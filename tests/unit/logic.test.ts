import { describe, expect, it } from 'vitest';
import { gradeQuestion, correctAnswerText, seededShuffle } from '@/lib/quiz';
import {
  emptyProgress, parseProgress, tpCompletion, overallCompletion, averageQuiz, weakTags, certificateEligible,
} from '@/lib/progress';
import { natInitial, natTranslate, natClear, NAT_POOL, rtImported, bestRoute, frSimulate, checkLabel } from '@/lib/sims';
import { parseApMessage, isTrustedOrigin } from '@/lib/ap-bridge';
import type { Question } from '@/data/types';

const base = { id: 'q', prompt: 'Question ?', explain: 'Parce que.', tags: ['t'], source: 'derive' as const };

describe('correction des quiz', () => {
  it('single / multi / input / order', () => {
    const s: Question = { ...base, kind: 'single', options: ['a', 'b'], answer: 1 };
    expect(gradeQuestion(s, 1)).toBe(true);
    expect(gradeQuestion(s, 0)).toBe(false);
    const m: Question = { ...base, kind: 'multi', options: ['a', 'b', 'c'], answers: [0, 2] };
    expect(gradeQuestion(m, [2, 0])).toBe(true);
    expect(gradeQuestion(m, [0])).toBe(false);
    expect(gradeQuestion(m, [0, 1, 2])).toBe(false);
    const i: Question = { ...base, kind: 'input', accept: ['255.255.255.128'] };
    expect(gradeQuestion(i, ' 255.255.255.128 ')).toBe(true);
    expect(gradeQuestion(i, '255.255.255.0')).toBe(false);
    const o: Question = { ...base, kind: 'order', items: ['x', 'y', 'z'] };
    expect(gradeQuestion(o, ['x', 'y', 'z'])).toBe(true);
    expect(gradeQuestion(o, ['y', 'x', 'z'])).toBe(false);
    expect(correctAnswerText(m)).toBe('a · c');
  });

  it('mélange déterministe qui ne renvoie pas l’ordre correct', () => {
    const items = ['1', '2', '3', '4'];
    const a = seededShuffle(items, 'seed');
    expect(seededShuffle(items, 'seed')).toEqual(a);
    expect(a).not.toEqual(items);
    expect([...a].sort()).toEqual(items);
  });
});

describe('progression', () => {
  it('rejette les données invalides', () => {
    expect(parseProgress(null)).toEqual(emptyProgress());
    expect(parseProgress({ version: 2 })).toEqual(emptyProgress());
  });

  it('calcule avancement, moyenne, points faibles, attestation', () => {
    const p = emptyProgress();
    p.tps.a = { modes: { learn: true, observe: true }, timeMs: 0, quiz: { score: 3, max: 4, answers: {}, correct: { q1: false, q2: true }, at: 0 } };
    p.tps.b = { modes: { learn: true, observe: true, practice: true, evaluate: true, correct: true }, timeMs: 0, quiz: { score: 1, max: 4, answers: {}, correct: { q1: false }, at: 0 } };
    expect(tpCompletion(p.tps.a)).toBe(40);
    expect(tpCompletion(p.tps.b)).toBe(100);
    expect(overallCompletion(p, ['a', 'b'])).toBe(70);
    expect(averageQuiz(p)).toBe(50);
    const weak = weakTags(p, (slug) => (slug === 'a' ? ['vrf'] : ['vrf', 'rt']));
    expect(weak[0]).toEqual({ tag: 'vrf', errors: 2, slugs: ['a', 'b'] });
    expect(certificateEligible(p, ['a', 'b'])).toBe(false);
    expect(certificateEligible(p, ['a'])).toBe(true);
  });
});

describe('simulateur NAT', () => {
  it('épuise le pool de 6 adresses puis échoue', () => {
    let st = natInitial('pool');
    for (let k = 2; k < 8; k++) {
      const r = natTranslate(st, `192.168.10.${k}`);
      expect(r.outcome.ok).toBe(true);
      st = r.state;
    }
    const used = st.entries.filter((e) => e.kind === 'dynamic').map((e) => e.insideGlobal);
    expect(used).toEqual(NAT_POOL);
    const r7 = natTranslate(st, '192.168.11.2');
    expect(r7.outcome).toEqual({ ok: false, reason: 'pool-exhausted' });
    // Un hôte déjà traduit réutilise sa traduction.
    expect(natTranslate(st, '192.168.10.2').outcome).toMatchObject({ ok: true, reused: true });
  });

  it('PAT : ports distincts sur une seule adresse ; ACL respectée', () => {
    let st = natInitial('pat');
    const a = natTranslate(st, '192.168.10.2'); st = a.state;
    const b = natTranslate(st, '192.168.30.2'); st = b.state;
    expect(a.outcome.ok && b.outcome.ok).toBe(true);
    if (a.outcome.ok && b.outcome.ok) {
      expect(a.outcome.entry.insideGlobal.split(':')[0]).toBe(b.outcome.entry.insideGlobal.split(':')[0]);
      expect(a.outcome.entry.insideGlobal).not.toBe(b.outcome.entry.insideGlobal);
    }
    expect(natTranslate(st, '10.10.10.1').outcome).toEqual({ ok: false, reason: 'acl' });
    expect(natClear(st).entries).toHaveLength(1);
  });
});

describe('autres simulateurs', () => {
  it('Route Target : import sur RT uniquement', () => {
    expect(rtImported(['1:100'], ['1:100'])).toBe(true);
    expect(rtImported(['100:100'], ['1:100'])).toBe(false);
    expect(rtImported(['100:100', '1:100'], ['1:100'])).toBe(true);
  });

  it('distance administrative avant métrique', () => {
    const ospf = { id: 'o', label: 'via R1', protocol: 'OSPF', ad: 110, metric: 20, domains: 3 };
    const eigrp = { id: 'e', label: 'via R4', protocol: 'EIGRP ext', ad: 170, metric: 5, domains: 2 };
    expect(bestRoute([ospf, eigrp])?.id).toBe('o');
    expect(bestRoute([ospf, { ...eigrp, ad: 105 }])?.id).toBe('e');
  });

  it('Frame Relay : trou noir en partie 1, bascule en partie 2', () => {
    expect(frSimulate({ part: 1, agence1Down: true }).pingC2toC1).toBe(false);
    expect(frSimulate({ part: 2, agence1Down: true })).toMatchObject({ pingC2toC1: true, hubSub16: 'down', hubPhysical: 'up' });
    expect(frSimulate({ part: 1, agence1Down: false }).pingC2toC1).toBe(true);
  });

  it('labels', () => {
    expect(checkLabel('Imp-Null', 'imp-null')).toBe(true);
    expect(checkLabel('Pop Label', 'pop')).toBe(true);
    expect(checkLabel('17', '16')).toBe(false);
  });
});

describe('pont ActivePresenter', () => {
  it('valide les messages', () => {
    expect(parseApMessage({ source: 'itlab-ap', tp: 'vpn-mpls', score: 8, max: 10 })).toEqual({ source: 'itlab-ap', tp: 'vpn-mpls', score: 8, max: 10 });
    expect(parseApMessage({ source: 'x', tp: 'a', score: 1, max: 1 })).toBeNull();
    expect(parseApMessage({ source: 'itlab-ap', tp: 'a', score: 5, max: 2 })).toBeNull();
    expect(parseApMessage({ source: 'itlab-ap', tp: '../x', score: 1, max: 2 })).toBeNull();
    expect(isTrustedOrigin('http://a', 'http://a')).toBe(true);
    expect(isTrustedOrigin('http://evil', 'http://a')).toBe(false);
  });
});

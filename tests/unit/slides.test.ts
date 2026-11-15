import { describe, expect, it } from 'vitest';
import { TPS } from '@/data/index';
import { buildSlides, commandScore, slideLabel } from '@/lib/slides';

describe('simulation IT LAB (diaporama)', () => {
  for (const tp of TPS) {
    it(`${tp.slug} : une diapo par commande et par question, bilan à la fin`, () => {
      const s = buildSlides(tp);
      const nCmd = tp.steps.reduce((n, st) => n + st.commands.length, 0);
      expect(s.filter((x) => x.kind === 'cmd')).toHaveLength(nCmd);
      expect(s.filter((x) => x.kind === 'quiz')).toHaveLength(tp.quiz.length);
      expect(s[0].kind).toBe('intro');
      expect(s[s.length - 1].kind).toBe('end');
      for (const x of s) expect(slideLabel(tp, x).length).toBeGreaterThan(2);
    });
  }

  it('barème des commandes', () => {
    expect(commandScore({ attempts: 0, hint: false, revealed: false, solved: true })).toBe(1);
    expect(commandScore({ attempts: 1, hint: false, revealed: false, solved: true })).toBe(0.5);
    expect(commandScore({ attempts: 0, hint: true, revealed: false, solved: true })).toBe(0.5);
    expect(commandScore({ attempts: 3, hint: false, revealed: true, solved: true })).toBe(0);
    expect(commandScore({ attempts: 0, hint: false, revealed: false, solved: false })).toBe(0);
  });
});

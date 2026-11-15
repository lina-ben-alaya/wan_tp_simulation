import { useEffect, useState } from 'react';
import type { CompareCase } from '../../data/types';
import { recordChallenge } from '../../lib/progress';
import { useProgress } from '../../lib/useProgress';
import Icon from '../ui/Icon';

export interface ChallengeCase extends CompareCase { tpTitle: string; tpSlug: string }

const ROUNDS = 8;
const SECONDS = 45;

function pick<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, n);
}

type Round = { c: ChallengeCase; order: number[] };
type Result = { c: ChallengeCase; ok: boolean; timeout: boolean; picked?: string; seconds: number };

/** Mode Défi : dépannage chronométré à partir des erreurs classiques des TP. */
export default function Challenge({ cases, base }: { cases: ChallengeCase[]; base: string }) {
  const progress = useProgress();
  const [rounds, setRounds] = useState<Round[] | null>(null);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(SECONDS);
  const [results, setResults] = useState<Result[]>([]);
  const [answered, setAnswered] = useState<Result | null>(null);
  const b = base.replace(/\/$/, '');

  const start = () => {
    setRounds(pick(cases, Math.min(ROUNDS, cases.length)).map((c) => ({ c, order: pick(c.challenge.options.map((_, k) => k), c.challenge.options.length) })));
    setI(0); setResults([]); setAnswered(null); setLeft(SECONDS);
  };

  useEffect(() => {
    if (!rounds || answered || i >= rounds.length) return;
    if (left <= 0) { answer(-1); return; }
    const id = window.setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left, rounds, answered, i]); // eslint-disable-line react-hooks/exhaustive-deps

  function answer(optIndex: number) {
    if (!rounds) return;
    const r = rounds[i];
    const res: Result = { c: r.c, ok: optIndex === r.c.challenge.answer, timeout: optIndex < 0, picked: optIndex >= 0 ? r.c.challenge.options[optIndex] : undefined, seconds: SECONDS - left };
    setAnswered(res);
    setResults((x) => [...x, res]);
  }

  function next() {
    if (!rounds) return;
    if (i + 1 >= rounds.length) {
      const score = results.filter((r) => r.ok).length;
      recordChallenge(score, rounds.length);
      setI(i + 1);
    } else { setI(i + 1); setLeft(SECONDS); setAnswered(null); }
  }

  if (!rounds) {
    return (
      <div className="card card-pad" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ color: 'var(--signal)' }}><Icon name="bolt" size={44} /></div>
        <h2>Prêt pour le dépannage ?</h2>
        <p className="muted">{Math.min(ROUNDS, cases.length)} pannes tirées au hasard parmi les {cases.length} erreurs classiques des TP. Pour chacune : un symptôme, {SECONDS} secondes pour choisir la bonne correction.</p>
        {progress.challenge.played > 0 && <p className="dim">Meilleur score : {progress.challenge.best} % · {progress.challenge.played} partie(s)</p>}
        <button className="btn btn-primary" onClick={start}><Icon name="play" /> Lancer le défi</button>
      </div>
    );
  }

  if (i >= rounds.length) {
    const score = results.filter((r) => r.ok).length;
    return (
      <div className="stack" style={{ maxWidth: 860, margin: '0 auto' }}>
        <div className="card card-pad" style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--signal)' }}><Icon name="trophy" size={44} /></div>
          <h2>Score : {score} / {rounds.length}</h2>
          <p className="muted">Temps moyen : {Math.round(results.reduce((s, r) => s + r.seconds, 0) / results.length)} s par panne.</p>
          <button className="btn btn-primary" onClick={start}><Icon name="restart" /> Rejouer</button>
        </div>
        {results.map((r, k) => (
          <div key={k} className="card card-pad">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className={`badge ${r.ok ? 'badge-ok' : 'badge-err'}`}>{r.ok ? 'Résolu' : r.timeout ? 'Temps écoulé' : 'Raté'}</span>
              <strong>{r.c.title}</strong>
              <a className="btn btn-quiet btn-sm" href={`${b}/tps/${r.c.tpSlug}?mode=learn`} style={{ marginLeft: 'auto' }}>{r.c.tpTitle} <Icon name="arrowRight" size={14} /></a>
            </div>
            {!r.ok && <p className="muted" style={{ margin: '8px 0 0' }}>Bonne correction : <strong>{r.c.challenge.options[r.c.challenge.answer]}</strong></p>}
            <p className="muted" style={{ margin: '6px 0 0' }}>{r.c.lesson}</p>
          </div>
        ))}
      </div>
    );
  }

  const r = rounds[i];
  return (
    <div className="stack" style={{ maxWidth: 820, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="mono dim">Panne {i + 1} / {rounds.length}</span>
        <div className="progress" style={{ flex: 1 }}><span style={{ width: `${(left / SECONDS) * 100}%`, background: left < 10 ? 'var(--err)' : 'var(--signal)' }} /></div>
        <span className="badge badge-signal mono" aria-live="off"><Icon name="timer" size={14} /> {left}s</span>
      </div>
      <div className="card card-pad fade-in" key={i}>
        <div className="eyebrow">{r.c.tpTitle}</div>
        <h2 style={{ fontSize: '1.2rem' }}><Icon name="warn" /> Symptôme</h2>
        <p className="lead" style={{ fontSize: '1.05rem' }}>{r.c.challenge.symptom}</p>
        <div style={{ display: 'grid', gap: 8 }}>
          {r.order.map((k, n) => {
            const isAnswer = k === r.c.challenge.answer;
            const cls = answered ? (isAnswer ? 'correct' : answered.picked === r.c.challenge.options[k] ? 'wrong' : '') : '';
            return (
              <button key={k} className={`option ${cls}`} disabled={!!answered} onClick={() => answer(k)}>
                <span className="key">{'ABCD'[n]}</span><span>{r.c.challenge.options[k]}</span>
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={`callout ${answered.ok ? 'callout-tip' : 'callout-err'} fade-in`} style={{ marginTop: 14 }} aria-live="polite">
            <Icon name={answered.ok ? 'checkCircle' : 'xCircle'} />
            <div><strong>{answered.ok ? 'Panne résolue.' : answered.timeout ? 'Temps écoulé.' : 'Ce n’est pas la bonne correction.'}</strong> {r.c.lesson}</div>
          </div>
        )}
      </div>
      {answered && <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }} onClick={next} autoFocus>{i + 1 < rounds.length ? 'Panne suivante' : 'Voir le bilan'} <Icon name="next" /></button>}
    </div>
  );
}

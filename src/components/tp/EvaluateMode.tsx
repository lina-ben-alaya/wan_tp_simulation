import { useState } from 'react';
import type { Tp } from '../../data/types';
import { gradeQuestion, PASS_RATIO, seededShuffle, type Answer } from '../../lib/quiz';
import QuestionView from './QuestionView';
import Icon from '../ui/Icon';

export default function EvaluateMode({ tp, onFinish, onNext }: {
  tp: Tp;
  onFinish: (score: number, max: number, answers: Record<string, unknown>, correct: Record<string, boolean>) => void;
  onNext: () => void;
}) {
  const qs = tp.quiz;
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [locked, setLocked] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const q = qs[i];
  const a = answers[q?.id];
  const isLocked = !!locked[q?.id];
  const correct = Object.fromEntries(qs.filter((x) => locked[x.id]).map((x) => [x.id, gradeQuestion(x, answers[x.id])]));
  const score = Object.values(correct).filter(Boolean).length;

  const hasAnswer = (() => {
    if (!q) return false;
    if (q.kind === 'order') return true;
    if (q.kind === 'multi') return Array.isArray(a) && a.length > 0;
    if (q.kind === 'input') return typeof a === 'string' && a.trim().length > 0;
    return a !== undefined;
  })();

  function validate() {
    // Pour une question d'ordre jamais manipulée, la réponse est l'ordre affiché.
    if (q.kind === 'order' && a === undefined) setAnswers((x) => ({ ...x, [q.id]: seededShuffle(q.items, q.id) }));
    setLocked((l) => ({ ...l, [q.id]: true }));
  }

  function finish() {
    const finalCorrect = Object.fromEntries(qs.map((x) => [x.id, gradeQuestion(x, answers[x.id])]));
    const s = Object.values(finalCorrect).filter(Boolean).length;
    onFinish(s, qs.length, answers as Record<string, unknown>, finalCorrect);
    setDone(true);
  }

  if (done) {
    const pct = Math.round((score / qs.length) * 100);
    const pass = score / qs.length >= PASS_RATIO;
    return (
      <div className="card card-pad fade-in" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ color: pass ? 'var(--ok)' : 'var(--signal)' }}><Icon name={pass ? 'award' : 'target'} size={46} /></div>
        <h2>{pass ? 'Évaluation réussie' : 'Évaluation à retravailler'}</h2>
        <p className="lead" style={{ margin: '0 auto 8px' }}>Score : <strong>{score} / {qs.length}</strong> ({pct} %)</p>
        <p className="muted">Seuil de réussite : {Math.round(PASS_RATIO * 100)} %. Le mode Corriger détaille chaque réponse.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={() => { setI(0); setAnswers({}); setLocked({}); setDone(false); }}><Icon name="restart" /> Recommencer</button>
          <button className="btn btn-primary" onClick={onNext}>Voir la correction <Icon name="arrowRight" /></button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }} className="stack">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="dim mono" style={{ fontSize: '0.84rem' }}>Question {i + 1} / {qs.length}</span>
        <div className="progress" style={{ flex: 1 }}><span style={{ width: `${((i + (isLocked ? 1 : 0)) / qs.length) * 100}%` }} /></div>
        <span className="badge">{score} bonne{score > 1 ? 's' : ''}</span>
      </div>
      <div className="card card-pad fade-in" key={q.id}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <span className={`badge ${q.source === 'enonce' ? 'badge-primary' : ''}`}>{q.source === 'enonce' ? 'Question du TP' : 'Question de notion'}</span>
        </div>
        <h2 style={{ fontSize: '1.2rem' }}>{q.prompt}</h2>
        <QuestionView q={q} value={a} onChange={(v) => setAnswers((x) => ({ ...x, [q.id]: v }))} locked={isLocked} />
        {isLocked && (
          <div className={`callout ${correct[q.id] ? 'callout-tip' : 'callout-err'} fade-in`} style={{ marginTop: 14 }} aria-live="polite">
            <Icon name={correct[q.id] ? 'checkCircle' : 'xCircle'} />
            <div><strong>{correct[q.id] ? 'Bonne réponse.' : 'Réponse incorrecte.'}</strong> {q.explain}</div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={() => setI(i - 1)} disabled={i === 0}><Icon name="prev" /> Retour</button>
        {!isLocked ? (
          <button className="btn btn-primary" onClick={validate} disabled={!hasAnswer}>Valider</button>
        ) : i < qs.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setI(i + 1)} autoFocus>Suivant <Icon name="next" /></button>
        ) : (
          <button className="btn btn-primary" onClick={finish} autoFocus disabled={qs.some((x) => !locked[x.id])}>Terminer <Icon name="trophy" /></button>
        )}
      </div>
    </div>
  );
}

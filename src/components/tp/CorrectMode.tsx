import { useEffect, useState } from 'react';
import type { Tp } from '../../data/types';
import type { TpProgress } from '../../lib/progress';
import { answerText, correctAnswerText, type Answer } from '../../lib/quiz';
import CompareView from './CompareView';
import Icon from '../ui/Icon';

/** Correction détaillée, explication des erreurs et bilan pédagogique. */
export default function CorrectMode({ tp, progress, onViewed, goto, defiHref }: { tp: Tp; progress: TpProgress; onViewed: () => void; goto: (m: 'evaluate' | 'practice' | 'learn') => void; defiHref: string }) {
  const quiz = progress.quiz;
  const [force, setForce] = useState(false);
  const visible = !!quiz || force;

  useEffect(() => { if (visible) onViewed(); }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) {
    return (
      <div className="card card-pad" style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <Icon name="target" size={40} />
        <h2>Évaluez-vous d’abord</h2>
        <p className="muted">La correction compare vos réponses aux réponses attendues. Faites l’évaluation pour obtenir un bilan personnalisé.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => goto('evaluate')}>Passer l’évaluation</button>
          <button className="btn btn-ghost" onClick={() => setForce(true)}>Voir les réponses quand même</button>
        </div>
      </div>
    );
  }

  const wrong = quiz ? tp.quiz.filter((q) => quiz.correct[q.id] === false) : [];
  const weak = [...new Set(wrong.flatMap((q) => q.tags))];
  const practiceMistakes = Object.entries(progress.practice?.mistakes ?? {});

  return (
    <div className="stack" style={{ maxWidth: 940, margin: '0 auto' }}>
      <section className="card card-pad">
        <div className="eyebrow"><Icon name="chart" size={14} /> Bilan pédagogique</div>
        <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <div className="stat"><b>{quiz ? `${quiz.score}/${quiz.max}` : '—'}</b><span>Évaluation</span></div>
          <div className="stat"><b>{progress.practice ? `${progress.practice.score}/${progress.practice.max}` : '—'}</b><span>Pratique (points)</span></div>
          <div className="stat"><b>{progress.ap ? `${progress.ap.score}/${progress.ap.max}` : '—'}</b><span>Simulation ActivePresenter</span></div>
        </div>
        {quiz && (
          wrong.length === 0 ? (
            <div className="callout callout-tip" style={{ marginTop: 14 }}><Icon name="checkCircle" /><div>Aucune erreur à l’évaluation. Testez-vous en mode Défi pour aller plus loin.</div></div>
          ) : (
            <div className="callout callout-warn" style={{ marginTop: 14 }}>
              <Icon name="bulb" />
              <div>
                <strong>Notions à revoir :</strong> {weak.join(', ')}.<br />
                Relisez les sections correspondantes dans <button className="btn btn-quiet btn-sm" onClick={() => goto('learn')} style={{ padding: '0 4px' }}>Apprendre</button>, puis refaites l’évaluation.
              </div>
            </div>
          )
        )}
        {practiceMistakes.length > 0 && (
          <p className="muted" style={{ margin: '12px 0 0' }}>
            Étapes de manipulation avec erreurs : {practiceMistakes.map(([id, n]) => `${tp.steps.find((s) => s.id === id)?.title ?? id} (${n})`).join(' · ')}.
          </p>
        )}
      </section>

      <section className="stack">
        <h2 style={{ fontSize: '1.35rem' }}>Réponses détaillées</h2>
        {tp.quiz.map((q, i) => {
          const ok = quiz?.correct[q.id];
          const given = quiz?.answers[q.id] as Answer;
          return (
            <article key={q.id} className="card card-pad">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                <span className="mono dim">Q{i + 1}</span>
                {quiz && <span className={`badge ${ok ? 'badge-ok' : 'badge-err'}`}>{ok ? 'Juste' : 'À revoir'}</span>}
                <span className="badge">{q.source === 'enonce' ? 'Question du TP' : 'Question de notion'}</span>
              </div>
              <h3>{q.prompt}</h3>
              <div className="diff" style={{ marginBottom: 10 }}>
                {quiz && (
                  <div className={`side ${ok ? 'good' : 'bad'}`}>
                    <div className="dim" style={{ fontSize: '0.8rem' }}>Votre réponse</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{answerText(q, given)}</div>
                  </div>
                )}
                <div className="side good">
                  <div className="dim" style={{ fontSize: '0.8rem' }}>Réponse attendue</div>
                  <div style={{ whiteSpace: 'pre-line' }}>{correctAnswerText(q)}</div>
                </div>
              </div>
              <p className="muted" style={{ margin: 0 }}><strong>Explication :</strong> {q.explain}</p>
            </article>
          );
        })}
      </section>

      <section className="stack">
        <h2 style={{ fontSize: '1.35rem' }}>Erreurs classiques à éviter</h2>
        {tp.compare.map((c) => <CompareView key={c.id} c={c} />)}
      </section>

      <div className="card card-pad" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={() => goto('practice')}><Icon name="terminal" /> Refaire la pratique</button>
        <button className="btn btn-ghost" onClick={() => goto('evaluate')}><Icon name="restart" /> Refaire l’évaluation</button>
        <a className="btn btn-primary" href={defiHref}>Mode défi <Icon name="bolt" /></a>
      </div>
    </div>
  );
}

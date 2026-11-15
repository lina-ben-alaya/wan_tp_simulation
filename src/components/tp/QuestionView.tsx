import { useMemo } from 'react';
import type { Question } from '../../data/types';
import type { Answer } from '../../lib/quiz';
import { seededShuffle } from '../../lib/quiz';
import Icon from '../ui/Icon';

const KEYS = 'ABCDEFGH';

/** Affiche une question et capture la réponse. `locked` = réponse validée (affiche la correction). */
export default function QuestionView({ q, value, onChange, locked }: { q: Question; value: Answer; onChange: (a: Answer) => void; locked: boolean }) {
  const shuffled = useMemo(() => (q.kind === 'order' ? seededShuffle(q.items, q.id) : []), [q]);
  const order = q.kind === 'order' ? ((value as string[] | undefined) ?? shuffled) : [];

  if (q.kind === 'single' || q.kind === 'multi') {
    const sel = q.kind === 'single' ? (typeof value === 'number' ? [value] : []) : ((value as number[]) ?? []);
    const correct = q.kind === 'single' ? [q.answer] : q.answers;
    return (
      <div role={q.kind === 'single' ? 'radiogroup' : 'group'} aria-label={q.prompt} style={{ display: 'grid', gap: 8 }}>
        {q.kind === 'multi' && <p className="dim" style={{ margin: 0, fontSize: '0.86rem' }}>Plusieurs réponses possibles.</p>}
        {q.options.map((o, i) => {
          const picked = sel.includes(i);
          const cls = locked ? (correct.includes(i) ? 'correct' : picked ? 'wrong' : '') : '';
          return (
            <button
              key={o}
              type="button"
              className={`option ${cls}`}
              aria-pressed={picked}
              role={q.kind === 'single' ? 'radio' : 'checkbox'}
              aria-checked={picked}
              disabled={locked}
              onClick={() => {
                if (q.kind === 'single') onChange(i);
                else onChange(picked ? sel.filter((x) => x !== i) : [...sel, i]);
              }}
            >
              <span className="key">{KEYS[i]}</span>
              <span style={{ flex: 1 }}>{o}</span>
              {locked && correct.includes(i) && <Icon name="checkCircle" className="" />}
              {locked && picked && !correct.includes(i) && <Icon name="xCircle" />}
            </button>
          );
        })}
      </div>
    );
  }

  if (q.kind === 'input') {
    return (
      <div>
        <input
          className="input mono"
          value={(value as string) ?? ''}
          placeholder={q.placeholder ?? 'Votre réponse'}
          onChange={(e) => onChange(e.target.value)}
          disabled={locked}
          aria-label="Votre réponse"
          autoComplete="off"
          spellCheck={false}
        />
        {locked && <p style={{ margin: '8px 0 0' }}>Réponse attendue : <code>{q.accept[0]}</code></p>}
      </div>
    );
  }

  // order
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      <p className="dim" style={{ margin: '0 0 8px', fontSize: '0.86rem' }}>Utilisez les flèches pour réordonner.</p>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
        {order.map((it, i) => {
          const ok = locked && q.items[i] === it;
          return (
            <li key={it} className="order-item" style={locked ? { borderColor: ok ? 'var(--ok)' : 'var(--err)' } : undefined}>
              <span className="mono dim" style={{ width: 20 }}>{i + 1}.</span>
              <span style={{ flex: 1 }}>{it}</span>
              {!locked && (
                <span style={{ display: 'flex', gap: 4 }}>
                  <button type="button" className="btn btn-quiet btn-sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Monter « ${it} »`}>↑</button>
                  <button type="button" className="btn btn-quiet btn-sm" onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label={`Descendre « ${it} »`}>↓</button>
                </span>
              )}
              {locked && <Icon name={ok ? 'checkCircle' : 'xCircle'} />}
            </li>
          );
        })}
      </ol>
      {locked && (
        <p style={{ margin: '10px 0 0' }} className="muted">Ordre correct : {q.items.map((x, i) => `${i + 1}. ${x}`).join(' → ')}</p>
      )}
    </div>
  );
}

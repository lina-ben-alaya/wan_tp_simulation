import { useState } from 'react';
import type { Tp } from '../../data/types';
import { GLOSSARY_BY_ID } from '../../data/glossary';
import { SIMS } from '../../data/catalog';
import Topology from './Topology';
import CompareView from './CompareView';
import SimHost from '../sims/SimHost';
import Icon from '../ui/Icon';
import { Callout, KindBadge } from '../ui/Badges';

export default function LearnMode({ tp, done, onDone, onNext }: { tp: Tp; done: boolean; onDone: () => void; onNext: () => void }) {
  const [term, setTerm] = useState<string | null>(null);
  const t = term ? GLOSSARY_BY_ID.get(term) : null;

  return (
    <div className="split split-side" style={{ alignItems: 'start' }}>
      <aside className="card card-pad" style={{ position: 'sticky', top: 80 }} aria-label="Sommaire du cours">
        <div className="eyebrow">Sommaire</div>
        <ol className="timeline">
          {tp.learn.map((s, i) => (
            <li key={s.title}><a href={`#learn-${i}`} style={{ display: 'block', padding: '6px 8px', borderRadius: 8, color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.88rem' }}>{i + 1}. {s.title}</a></li>
          ))}
          {tp.compare.length > 0 && <li><a href="#learn-compare" style={{ display: 'block', padding: '6px 8px', color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.88rem' }}>Correct / incorrect</a></li>}
          {tp.sims.length > 0 && <li><a href="#learn-sims" style={{ display: 'block', padding: '6px 8px', color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.88rem' }}>Simulateurs</a></li>}
          <li><a href="#learn-glossary" style={{ display: 'block', padding: '6px 8px', color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.88rem' }}>Glossaire du TP</a></li>
        </ol>
      </aside>

      <div className="stack" style={{ minWidth: 0 }}>
        <section className="card card-pad">
          <div className="eyebrow"><Icon name="network" size={14} /> Topologie interactive · survolez ou parcourez au clavier les équipements</div>
          <Topology topology={tp.topology} />
        </section>

        {tp.learn.map((s, i) => (
          <section key={s.title} id={`learn-${i}`} className="card card-pad anchor-offset fade-in">
            <div className="eyebrow">Notion {i + 1}</div>
            <h2 style={{ fontSize: '1.35rem' }}>{s.title}</h2>
            {s.body.map((p, k) => <p key={k} className="muted">{p}</p>)}
            {s.points && (
              <ul style={{ margin: '0 0 12px', paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 6 }}>
                {s.points.map((p) => (
                  <li key={p} style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--accent)' }}><Icon name="check" size={18} /></span>{p}</li>
                ))}
              </ul>
            )}
            {s.code && <pre className="code" style={{ marginBottom: 12 }}>{s.code}</pre>}
            {s.callout && (
              <Callout tone={s.callout.tone} icon={<Icon name={s.callout.tone === 'warn' ? 'warn' : s.callout.tone === 'tip' ? 'bulb' : 'info'} />}>
                {s.callout.text}
              </Callout>
            )}
          </section>
        ))}

        {tp.compare.length > 0 && (
          <section id="learn-compare" className="stack anchor-offset">
            <h2 style={{ fontSize: '1.35rem', marginTop: 12 }}>Configuration correcte ou incorrecte ?</h2>
            {tp.compare.map((c) => <CompareView key={c.id} c={c} />)}
          </section>
        )}

        {tp.sims.length > 0 && (
          <section id="learn-sims" className="stack anchor-offset">
            <h2 style={{ fontSize: '1.35rem', marginTop: 12 }}>Simulateurs</h2>
            {tp.sims.map((s) => (
              <div key={s} className="card card-pad">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                  <KindBadge k="calcule" />
                  <h3 style={{ margin: 0 }}>{SIMS[s].title}</h3>
                </div>
                <p className="muted">{SIMS[s].description}</p>
                <SimHost id={s} />
              </div>
            ))}
          </section>
        )}

        <section id="learn-glossary" className="card card-pad anchor-offset">
          <div className="eyebrow"><Icon name="book" size={14} /> Glossaire du TP</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {tp.glossary.map((g) => (
              <button key={g} className="chip" aria-pressed={term === g} onClick={() => setTerm(term === g ? null : g)}>
                {GLOSSARY_BY_ID.get(g)?.term ?? g}
              </button>
            ))}
          </div>
          {t && (
            <div className="callout callout-info fade-in" style={{ marginTop: 12 }} aria-live="polite">
              <Icon name="info" />
              <div><strong>{t.term}</strong>{t.full ? ` — ${t.full}` : ''}<br />{t.definition}</div>
            </div>
          )}
        </section>

        {tp.notes.length > 0 && (
          <Callout tone="warn" icon={<Icon name="warn" />}>
            <strong>Notes sur l’énoncé</strong>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>{tp.notes.map((n) => <li key={n}>{n}</li>)}</ul>
          </Callout>
        )}

        <div className="card card-pad" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <span className="muted">{done ? 'Mode Apprendre terminé.' : 'Vous avez parcouru les notions ?'}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {!done && <button className="btn btn-ghost" onClick={onDone}><Icon name="check" /> J’ai compris</button>}
            <button className="btn btn-primary" onClick={() => { if (!done) onDone(); onNext(); }}>Passer à Observer <Icon name="arrowRight" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

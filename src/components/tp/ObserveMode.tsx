import { useEffect, useRef, useState } from 'react';
import type { Tp } from '../../data/types';
import Topology from './Topology';
import Icon from '../ui/Icon';
import { FidelityBadge, KindBadge } from '../ui/Badges';

/**
 * Démonstration animée : les commandes de chaque étape sont « tapées » automatiquement,
 * puis la sortie (reconstituée ou extraite de l'énoncé) et l'explication s'affichent.
 */
export default function ObserveMode({ tp, initialStep = 0, done, onDone, onNext }: { tp: Tp; initialStep?: number; done: boolean; onDone: () => void; onNext: () => void }) {
  const [step, setStep] = useState(Math.min(initialStep, tp.steps.length - 1));
  const [cmd, setCmd] = useState(0);
  const [chars, setChars] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const s = tp.steps[step];
  const stepDone = cmd >= s.commands.length;
  const isLast = step === tp.steps.length - 1;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      if (cmd < s.commands.length) {
        const full = s.commands[cmd].cmd;
        if (chars < full.length) setChars((c) => c + 1);
        else { setCmd((c) => c + 1); setChars(0); }
      }
    }, (cmd < s.commands.length && chars >= s.commands[cmd].cmd.length ? 520 : 38) / speed);
    return () => window.clearInterval(id);
  }, [playing, cmd, chars, s, speed]);

  // Fin d'étape : pause, puis étape suivante automatiquement.
  useEffect(() => {
    if (!playing || !stepDone) return;
    if (isLast) { setPlaying(false); if (!done) onDone(); return; }
    const id = window.setTimeout(() => goto(step + 1, true), 2600 / speed);
    return () => window.clearTimeout(id);
  }, [playing, stepDone, isLast]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight }); }, [cmd, chars]);

  function goto(i: number, keepPlaying = false) {
    setStep(Math.max(0, Math.min(i, tp.steps.length - 1)));
    setCmd(0);
    setChars(0);
    if (!keepPlaying) setPlaying(false);
  }
  const showAll = () => { setCmd(s.commands.length); setChars(0); if (isLast && !done) onDone(); };

  return (
    <div className="split split-3" style={{ alignItems: 'start' }}>
      <aside className="card card-pad" aria-label="Chronologie des manipulations">
        <div className="eyebrow"><Icon name="list" size={14} /> Chronologie</div>
        <ol className="timeline">
          {tp.steps.map((st, i) => (
            <li key={st.id}>
              <button onClick={() => goto(i)} aria-current={i === step ? 'step' : undefined}>
                <span className={`tick ${i < step ? 'done' : i === step ? 'current' : ''}`}>{i < step ? <Icon name="check" size={12} /> : i + 1}</span>
                <span>{st.title}<br /><span className="dim" style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)' }}>{st.device}</span></span>
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <div className="stack" style={{ minWidth: 0 }}>
        <div className="card card-pad">
          <Topology topology={tp.topology} active={[s.device]} showLabels={false} />
        </div>
        <div className="console" aria-live="polite">
          <div className="console-bar">
            <span className="lights"><i /><i /><i /></span>
            <span>{s.device} — démonstration</span>
            <span style={{ marginLeft: 'auto' }}><KindBadge k="demo" /></span>
          </div>
          <div className="console-body" ref={bodyRef}>
            {s.commands.map((c, i) => {
              if (i > cmd) return null;
              const text = i < cmd ? c.cmd : c.cmd.slice(0, chars);
              return (
                <div key={i}>
                  <span className="prompt">{c.prompt}</span>{text}
                  {i === cmd && !stepDone && <span className="caret" />}
                </div>
              );
            })}
            {stepDone && s.output && <div className="out fade-in" style={{ marginTop: 6 }}>{s.output}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => goto(step - 1)} disabled={step === 0} aria-label="Étape précédente"><Icon name="prev" /> Retour</button>
          <button className="btn btn-primary btn-sm" onClick={() => {
            if (playing) { setPlaying(false); return; }
            if (stepDone) goto(isLast ? 0 : step + 1, true);
            setPlaying(true);
          }}>
            <Icon name={playing ? 'pause' : 'play'} /> {playing ? 'Pause' : 'Lecture'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={showAll} disabled={stepDone}>Tout afficher</button>
          <button className="btn btn-ghost btn-sm" onClick={() => goto(step + 1)} disabled={isLast}>Suivant <Icon name="next" /></button>
          <button className="btn btn-quiet btn-sm" onClick={() => goto(0)}><Icon name="restart" /> Recommencer</button>
          <label className="dim" style={{ marginLeft: 'auto', fontSize: '0.84rem', display: 'flex', gap: 6, alignItems: 'center' }}>
            Vitesse
            <select className="input" style={{ width: 'auto', padding: '4px 8px' }} value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
              <option value={0.5}>0,5×</option><option value={1}>1×</option><option value={2}>2×</option>
            </select>
          </label>
        </div>
      </div>

      <aside className="card card-pad stack" aria-label="Explication de l’étape">
        <div className="eyebrow">Étape {step + 1} / {tp.steps.length}</div>
        <h3 style={{ margin: 0 }}>{s.title}</h3>
        <p className="muted" style={{ margin: 0 }}><strong>Objectif :</strong> {s.goal}</p>
        {stepDone ? (
          <div className="fade-in">
            <p style={{ marginBottom: 8 }}>{s.explain}</p>
            {s.output && s.outputFidelity && <FidelityBadge f={s.outputFidelity} />}
          </div>
        ) : (
          <p className="dim" style={{ margin: 0 }}>L’explication s’affiche à la fin de la saisie.</p>
        )}
        {isLast && stepDone && (
          <button className="btn btn-primary" onClick={() => { if (!done) onDone(); onNext(); }}>À vous : Pratiquer <Icon name="arrowRight" /></button>
        )}
      </aside>
    </div>
  );
}

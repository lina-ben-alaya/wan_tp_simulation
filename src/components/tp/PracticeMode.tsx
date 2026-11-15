import { useEffect, useRef, useState } from 'react';
import type { Tp } from '../../data/types';
import { matchCommand, normalize, revealPrefix } from '../../lib/ios-match';
import Topology from './Topology';
import Icon from '../ui/Icon';
import { FidelityBadge, KindBadge } from '../ui/Badges';

type Line = { kind: 'in' | 'out' | 'ok' | 'bad' | 'info'; text: string; prompt?: string };

/** Points : 1 = réussi du premier coup sans aide ; 0,5 = réussi après erreurs ou indices ; 0 = solution affichée. */
export function commandPoints(attempts: number, hintLevel: number, revealed: boolean): number {
  if (revealed) return 0;
  return attempts === 0 && hintLevel === 0 ? 1 : 0.5;
}

export default function PracticeMode({ tp, initialStep = 0, onFinish, onNext }: {
  tp: Tp; initialStep?: number;
  onFinish: (score: number, max: number, mistakes: Record<string, number>) => void;
  onNext: () => void;
}) {
  const max = tp.steps.reduce((n, s) => n + s.commands.length, 0);
  const [step, setStep] = useState(Math.min(initialStep, tp.steps.length - 1));
  const [cmd, setCmd] = useState(0);
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<Line[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [hint, setHint] = useState(0);
  const [why, setWhy] = useState(false);
  const [coach, setCoach] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [histPos, setHistPos] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const s = tp.steps[step];
  const c = s.commands[cmd];
  const stepComplete = cmd >= s.commands.length;

  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight }); }, [lines]);

  const resetCommandState = () => { setAttempts(0); setHint(0); setWhy(false); setCoach(null); };

  function advance(points: number, shownAs: string, revealed = false) {
    const newLines: Line[] = [{ kind: 'in', prompt: c.prompt, text: shownAs }];
    if (revealed) newLines.push({ kind: 'info', text: '↳ solution affichée par l’assistant (0 point)' });
    const next = cmd + 1;
    if (next >= s.commands.length && s.output) newLines.push({ kind: 'out', text: s.output });
    setLines((l) => [...l, ...newLines]);
    setScore((x) => x + points);
    setCmd(next);
    resetCommandState();
    setInput('');
    if (next >= s.commands.length) setCoach('Étape réussie. ' + s.explain);
  }

  function submit() {
    if (!c) return;
    let raw = input;
    // L'apprenant a recopié l'invite : on la retire.
    if (raw.trim().startsWith(c.prompt)) raw = raw.trim().slice(c.prompt.length);
    const typed = normalize(raw);
    if (!typed) return;
    setHistory((h) => [typed, ...h].slice(0, 30));
    setHistPos(-1);
    if (typed === '?' || typed.endsWith(' ?')) {
      setLines((l) => [...l, { kind: 'in', prompt: c.prompt, text: typed }, { kind: 'info', text: 'Aide : utilisez le bouton « Indice » de l’assistant. Les abréviations IOS sont acceptées (conf t, sh ip ro, int s1/1…).' }]);
      setInput('');
      return;
    }
    const r = matchCommand(typed, c.cmd, c.alt);
    if (r.ok) {
      advance(commandPoints(attempts, hint, false), typed);
      return;
    }
    const words = typed.split(' ');
    const bad = r.badToken ?? 0;
    setLines((l) => [...l, { kind: 'in', prompt: c.prompt, text: typed }, { kind: 'bad', text: bad < words.length ? `% Commande non attendue : le mot n°${bad + 1} « ${words[bad]} » ne correspond pas.` : '% Commande incomplète.' }]);
    setAttempts((a) => a + 1);
    setMistakes((m) => ({ ...m, [s.id]: (m[s.id] ?? 0) + 1 }));
    setInput('');
    setCoach(attempts + 1 >= 2 && hint === 0 ? 'Plusieurs essais sans succès : demandez un indice, il ne coûte qu’un demi-point.' : null);
  }

  function nextStep() {
    if (step < tp.steps.length - 1) {
      setStep(step + 1);
      setCmd(0);
      setLines((l) => [...l, { kind: 'info', text: `— Étape ${step + 2} : ${tp.steps[step + 1].title} (${tp.steps[step + 1].device}) —` }]);
      resetCommandState();
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      setFinished(true);
      onFinish(score, max, mistakes);
    }
  }

  function restart() {
    setStep(0); setCmd(0); setLines([]); setScore(0); setMistakes({}); setFinished(false); setInput(''); resetCommandState();
  }

  const hintText = c ? (hint === 1 ? s.hint : hint === 2 ? `La commande commence par : ${revealPrefix(c.cmd)}` : hint >= 3 ? c.cmd : null) : null;
  const pct = Math.round((score / max) * 100);

  if (finished) {
    return (
      <div className="card card-pad fade-in" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ color: 'var(--accent)' }}><Icon name="trophy" size={44} /></div>
        <h2>Manipulations terminées</h2>
        <p className="lead" style={{ margin: '0 auto 12px' }}>Score : <strong>{score} / {max}</strong> ({pct} %)</p>
        <p className="muted">1 point par commande réussie du premier coup, ½ point avec erreurs ou indices, 0 si la solution a été affichée.</p>
        {Object.keys(mistakes).length > 0 && (
          <p className="muted">Étapes à revoir : {Object.keys(mistakes).map((id) => tp.steps.find((x) => x.id === id)?.title).join(' · ')}</p>
        )}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={restart}><Icon name="restart" /> Recommencer</button>
          <button className="btn btn-primary" onClick={onNext}>Passer à l’évaluation <Icon name="arrowRight" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="split split-3" style={{ alignItems: 'start' }}>
      <aside className="card card-pad" aria-label="Progression des étapes">
        <div className="eyebrow"><Icon name="list" size={14} /> Étapes</div>
        <ol className="timeline">
          {tp.steps.map((st, i) => (
            <li key={st.id}>
              <button disabled aria-current={i === step ? 'step' : undefined} style={{ cursor: 'default' }}>
                <span className={`tick ${i < step || (i === step && stepComplete) ? 'done' : i === step ? 'current' : ''}`}>{i < step || (i === step && stepComplete) ? <Icon name="check" size={12} /> : i + 1}</span>
                <span>{st.title}{mistakes[st.id] ? <span className="badge badge-err" style={{ marginLeft: 6 }}>{mistakes[st.id]} err.</span> : null}</span>
              </button>
            </li>
          ))}
        </ol>
        <div style={{ marginTop: 14 }}>
          <div className="dim" style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}><span>Score</span><span>{score} / {max}</span></div>
          <div className="progress" style={{ marginTop: 6 }}><span style={{ width: `${(score / max) * 100}%` }} /></div>
        </div>
      </aside>

      <div className="stack" style={{ minWidth: 0 }}>
        <div className="card card-pad">
          <Topology topology={tp.topology} active={[s.device]} showLabels={false} />
        </div>
        <div className="console" onClick={() => inputRef.current?.focus()}>
          <div className="console-bar">
            <span className="lights"><i /><i /><i /></span>
            <span>{s.device} — console d’entraînement</span>
            <span style={{ marginLeft: 'auto' }}><KindBadge k="guide" /></span>
          </div>
          <div className="console-body" ref={bodyRef} aria-live="polite">
            {lines.length === 0 && <div className="out">Saisissez les commandes demandées. Abréviations IOS acceptées. Les sorties sont préparées à l’avance : aucun routeur n’est exécuté.</div>}
            {lines.map((l, i) => (
              <div key={i} className={l.kind === 'in' ? '' : l.kind}>
                {l.prompt && <span className="prompt">{l.prompt}</span>}{l.text}
              </div>
            ))}
            {!stepComplete && (
              <form className="line-input" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                <label htmlFor="cli" className="prompt">{c.prompt}</label>
                <input
                  id="cli"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' && history.length) { e.preventDefault(); const p = Math.min(histPos + 1, history.length - 1); setHistPos(p); setInput(history[p]); }
                    if (e.key === 'ArrowDown') { e.preventDefault(); const p = histPos - 1; setHistPos(p); setInput(p >= 0 ? history[p] : ''); }
                  }}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label={`Commande à saisir sur ${s.device}`}
                />
              </form>
            )}
          </div>
        </div>
        {stepComplete && (
          <div className="fade-in" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {s.output && s.outputFidelity && <><span className="dim" style={{ fontSize: '0.84rem' }}>Sortie :</span><FidelityBadge f={s.outputFidelity} /></>}
            <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={nextStep} autoFocus>
              {step < tp.steps.length - 1 ? <>Étape suivante <Icon name="next" /></> : <>Voir mon résultat <Icon name="trophy" /></>}
            </button>
          </div>
        )}
      </div>

      <aside className="card card-pad stack" aria-label="Assistant pédagogique">
        <div className="eyebrow"><Icon name="sparkle" size={14} /> Assistant</div>
        <div>
          <div className="dim" style={{ fontSize: '0.8rem' }}>Étape {step + 1} / {tp.steps.length} · {s.device}</div>
          <h3 style={{ margin: '2px 0 6px' }}>{s.title}</h3>
          <p className="muted" style={{ margin: 0 }}>{s.goal}</p>
        </div>
        {!stepComplete && (
          <div className="dim" style={{ fontSize: '0.84rem' }}>Commande {cmd + 1} / {s.commands.length}{attempts > 0 ? ` · ${attempts} essai(s) infructueux` : ''}</div>
        )}
        {coach && <div className="callout callout-tip fade-in" aria-live="polite"><Icon name="bulb" /><div>{coach}</div></div>}
        {hintText && !stepComplete && (
          <div className="callout callout-info fade-in" aria-live="polite">
            <Icon name="help" />
            <div>{hint >= 3 ? <>Solution : <code>{hintText}</code></> : hintText}</div>
          </div>
        )}
        {why && <div className="callout callout-info fade-in"><Icon name="info" /><div>{s.explain}</div></div>}
        {!stepComplete && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setHint((h) => Math.min(h + 1, 2))} disabled={hint >= 2}>
              <Icon name="bulb" /> {hint === 0 ? 'Indice' : 'Indice suivant'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setWhy((w) => !w)}><Icon name="help" /> Pourquoi ?</button>
            <button className="btn btn-quiet btn-sm" onClick={() => advance(0, c.cmd, true)}>Afficher la solution</button>
          </div>
        )}
        <button className="btn btn-quiet btn-sm" onClick={restart} style={{ alignSelf: 'flex-start' }}><Icon name="restart" /> Recommencer le TP</button>
      </aside>
    </div>
  );
}

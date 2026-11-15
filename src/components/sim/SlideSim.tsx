import { useEffect, useMemo, useRef, useState } from 'react';
import type { Tp } from '../../data/types';
import { AUTHOR, FIDELITY } from '../../data/catalog';
import { buildSlides, commandScore, slideLabel } from '../../lib/slides';
import { matchCommand, normalize, revealPrefix } from '../../lib/ios-match';
import { gradeQuestion, PASS_RATIO, seededShuffle, type Answer } from '../../lib/quiz';
import { recordAp } from '../../lib/progress';
import Topology from '../tp/Topology';
import QuestionView from '../tp/QuestionView';
import Icon from '../ui/Icon';

type CmdState = { attempts: number; hint: boolean; revealed: boolean; solved: boolean; typed?: string };
const EMPTY: CmdState = { attempts: 0, hint: false, revealed: false, solved: false };
const MAX_ATTEMPTS = 3;

/**
 * Simulation interactive IT LAB : diaporama avec saisie des commandes dans une console,
 * indices, résultats, questions et score final. Aucune commande n'est exécutée :
 * la saisie est comparée aux commandes attendues (abréviations IOS acceptées).
 */
export default function SlideSim({ tp, fullPageHref }: { tp: Tp; fullPageHref?: string }) {
  const slides = useMemo(() => buildSlides(tp), [tp]);
  const [i, setI] = useState(0);
  const [cmds, setCmds] = useState<Record<string, CmdState>>({});
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [locked, setLocked] = useState<Record<string, boolean>>({});
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [toc, setToc] = useState(false);
  const [saved, setSaved] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sl = slides[i];
  const key = (s: number, c: number) => `${s}.${c}`;
  const cmdOf = (s: number, c: number) => cmds[key(s, c)] ?? EMPTY;

  const nCmd = tp.steps.reduce((n, s) => n + s.commands.length, 0);
  const max = nCmd + tp.quiz.length;
  const cmdPoints = tp.steps.reduce((n, s, si) => n + s.commands.reduce((m, _, ci) => m + commandScore(cmdOf(si, ci)), 0), 0);
  const quizPoints = tp.quiz.filter((q) => locked[q.id] && gradeQuestion(q, answers[q.id])).length;
  const score = cmdPoints + quizPoints;
  const fr = (n: number) => n.toLocaleString('fr-FR');

  const blocked =
    (sl.kind === 'cmd' && !cmdOf(sl.step, sl.cmd).solved) ||
    (sl.kind === 'quiz' && !locked[tp.quiz[sl.q].id]);

  useEffect(() => {
    setInput('');
    setError(null);
    if (sl.kind === 'cmd') setTimeout(() => inputRef.current?.focus(), 40);
    if (sl.kind === 'end' && !saved) {
      recordAp(tp.slug, score, max);
      setSaved(true);
    }
  }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (n: number) => setI(Math.max(0, Math.min(slides.length - 1, n)));
  const restart = () => { setCmds({}); setAnswers({}); setLocked({}); setSaved(false); go(0); };

  function submit() {
    if (sl.kind !== 'cmd') return;
    const c = tp.steps[sl.step].commands[sl.cmd];
    const k = key(sl.step, sl.cmd);
    const st = cmdOf(sl.step, sl.cmd);
    let raw = input.trim();
    if (raw.startsWith(c.prompt)) raw = raw.slice(c.prompt.length);
    const typed = normalize(raw);
    if (!typed) return;
    const r = matchCommand(typed, c.cmd, c.alt);
    if (r.ok) {
      setCmds((x) => ({ ...x, [k]: { ...st, solved: true, typed } }));
      setError(null);
      return;
    }
    const attempts = st.attempts + 1;
    const words = typed.split(' ');
    const bad = r.badToken ?? 0;
    if (attempts >= MAX_ATTEMPTS) {
      setCmds((x) => ({ ...x, [k]: { ...st, attempts, solved: true, revealed: true, typed: c.cmd } }));
      setError(`Trois essais : la commande attendue était « ${c.cmd} ».`);
    } else {
      setCmds((x) => ({ ...x, [k]: { ...st, attempts } }));
      setError(bad < words.length ? `Le mot « ${words[bad]} » n’est pas celui attendu. Essai ${attempts}/${MAX_ATTEMPTS}.` : `Commande incomplète. Essai ${attempts}/${MAX_ATTEMPTS}.`);
    }
    setInput('');
  }

  // Raccourcis clavier : flèches gauche/droite hors saisie.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' && !blocked) go(i + 1);
      if (e.key === 'ArrowLeft') go(i - 1);
    };
    const el = box.current;
    el?.addEventListener('keydown', onKey);
    return () => el?.removeEventListener('keydown', onKey);
  });

  /* ---------- Rendu d'une diapositive ---------- */
  function body() {
    switch (sl.kind) {
      case 'intro':
        return (
          <div className="sim-center">
            <div className="mono dim">{tp.code}</div>
            <h2 className="sim-title">{tp.title}</h2>
            <p className="lead" style={{ margin: '0 auto 18px' }}>{tp.subtitle}</p>
            <p className="muted" style={{ maxWidth: 680, margin: '0 auto 22px' }}>{tp.scenario}</p>
            <button className="btn btn-primary" onClick={() => go(1)}><Icon name="play" /> Commencer la simulation</button>
          </div>
        );
      case 'objectives':
        return (
          <div>
            <h2 className="sim-h">Objectifs</h2>
            <ul className="sim-list">{tp.objectives.map((o) => <li key={o}><Icon name="check" /> {o}</li>)}</ul>
            <p className="dim" style={{ marginTop: 18 }}>Matériel : {tp.equipment.join(' · ')} — Outils : {tp.tools.join(', ')}</p>
          </div>
        );
      case 'topology':
        return (
          <div>
            <h2 className="sim-h">Topologie</h2>
            <p className="dim" style={{ marginTop: -6 }}>Survolez un équipement pour voir ses interfaces et adresses.</p>
            <Topology topology={tp.topology} />
          </div>
        );
      case 'step': {
        const st = tp.steps[sl.step];
        return (
          <div className="sim-split">
            <div>
              <div className="eyebrow">Étape {sl.step + 1} / {tp.steps.length} · {st.device}</div>
              <h2 className="sim-h">{st.title}</h2>
              <div className="sim-callout"><Icon name="target" /> {st.goal}</div>
              <p className="dim">{st.commands.length} commande{st.commands.length > 1 ? 's' : ''} à saisir sur <strong>{st.device}</strong>.</p>
            </div>
            <Topology topology={tp.topology} active={[st.device]} showLabels={false} />
          </div>
        );
      }
      case 'cmd': {
        const st = tp.steps[sl.step];
        const c = st.commands[sl.cmd];
        const cs = cmdOf(sl.step, sl.cmd);
        return (
          <div>
            <div className="eyebrow">Étape {sl.step + 1} · {st.title} · commande {sl.cmd + 1}/{st.commands.length}</div>
            <div className="sim-callout"><Icon name="terminal" /> {st.goal} <strong>Tapez la commande puis Entrée.</strong></div>
            <div className="console" style={{ marginTop: 12 }}>
              <div className="console-bar"><span className="lights"><i /><i /><i /></span><span>{st.device} — console</span></div>
              <div className="console-body" style={{ minHeight: 170 }}>
                {st.commands.slice(0, sl.cmd).map((p, k) => (
                  <div key={k}><span className="prompt">{p.prompt}</span>{cmdOf(sl.step, k).typed ?? p.cmd}</div>
                ))}
                {cs.solved ? (
                  <div><span className="prompt">{c.prompt}</span>{cs.typed}<span className={cs.revealed ? 'bad' : 'ok'}>  {cs.revealed ? '← solution' : '✓'}</span></div>
                ) : (
                  <form className="line-input" onSubmit={(e) => { e.preventDefault(); submit(); }} style={{ borderTop: 0, marginTop: 0, paddingTop: 0 }}>
                    <label htmlFor="sim-cli" className="prompt">{c.prompt}</label>
                    <input id="sim-cli" ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label={`Commande à saisir sur ${st.device}`} />
                  </form>
                )}
              </div>
            </div>
            <div aria-live="polite" style={{ marginTop: 10, display: 'grid', gap: 8 }}>
              {error && <div className={`callout ${cs.revealed ? 'callout-warn' : 'callout-err'}`}><Icon name="xCircle" /><div>{error}</div></div>}
              {cs.solved && !cs.revealed && <div className="callout callout-tip"><Icon name="checkCircle" /><div><strong>Correct.</strong> {cs.attempts === 0 && !cs.hint ? '+1 point' : '+0,5 point'}</div></div>}
              {!cs.solved && cs.hint && <div className="callout callout-info"><Icon name="bulb" /><div>{st.hint} — début : <code>{revealPrefix(c.cmd)}</code></div></div>}
            </div>
            {!cs.solved && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setCmds((x) => ({ ...x, [key(sl.step, sl.cmd)]: { ...cs, hint: true } }))} disabled={cs.hint}><Icon name="bulb" /> Indice</button>
                <button className="btn btn-quiet btn-sm" onClick={() => { setCmds((x) => ({ ...x, [key(sl.step, sl.cmd)]: { ...cs, solved: true, revealed: true, typed: c.cmd } })); setError(`Solution : « ${c.cmd} » (0 point).`); }}>Voir la solution</button>
              </div>
            )}
          </div>
        );
      }
      case 'output': {
        const st = tp.steps[sl.step];
        return (
          <div>
            <div className="eyebrow">Résultat · étape {sl.step + 1} · {st.device}</div>
            <div className="console">
              <div className="console-bar"><span className="lights"><i /><i /><i /></span><span>{st.device}</span>
                {st.outputFidelity && <span className="badge badge-signal" style={{ marginLeft: 'auto' }} title={FIDELITY[st.outputFidelity].description}>{FIDELITY[st.outputFidelity].label}</span>}
              </div>
              <div className="console-body" style={{ minHeight: 120 }}><div className="out">{st.output}</div></div>
            </div>
            <div className="sim-callout" style={{ marginTop: 12 }}><Icon name="info" /> {st.explain}</div>
          </div>
        );
      }
      case 'quiz-intro':
        return (
          <div className="sim-center">
            <Icon name="target" size={44} />
            <h2 className="sim-title" style={{ fontSize: '1.8rem' }}>Vérifiez vos connaissances</h2>
            <p className="muted">{tp.quiz.length} questions sur ce TP. Chaque bonne réponse rapporte 1 point.</p>
            <button className="btn btn-primary" onClick={() => go(i + 1)}>Commencer les questions</button>
          </div>
        );
      case 'quiz': {
        const q = tp.quiz[sl.q];
        const isLocked = !!locked[q.id];
        const ok = isLocked && gradeQuestion(q, answers[q.id]);
        const a = answers[q.id];
        const has = q.kind === 'order' || (q.kind === 'multi' ? Array.isArray(a) && a.length > 0 : q.kind === 'input' ? typeof a === 'string' && a.trim() !== '' : a !== undefined);
        return (
          <div>
            <div className="eyebrow">Question {sl.q + 1} / {tp.quiz.length}</div>
            <h2 className="sim-h" style={{ fontSize: '1.2rem' }}>{q.prompt}</h2>
            <QuestionView q={q} value={a} onChange={(v) => setAnswers((x) => ({ ...x, [q.id]: v }))} locked={isLocked} />
            {!isLocked ? (
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} disabled={!has}
                onClick={() => {
                  if (q.kind === 'order' && a === undefined) setAnswers((x) => ({ ...x, [q.id]: seededShuffle(q.items, q.id) }));
                  setLocked((l) => ({ ...l, [q.id]: true }));
                }}>Valider</button>
            ) : (
              <div className={`callout ${ok ? 'callout-tip' : 'callout-err'}`} style={{ marginTop: 12 }} aria-live="polite">
                <Icon name={ok ? 'checkCircle' : 'xCircle'} /><div><strong>{ok ? 'Bonne réponse.' : 'Réponse incorrecte.'}</strong> {q.explain}</div>
              </div>
            )}
          </div>
        );
      }
      case 'end': {
        const pct = Math.round((score / max) * 100);
        const pass = score / max >= PASS_RATIO;
        return (
          <div className="sim-center">
            <span style={{ color: pass ? 'var(--ok)' : 'var(--signal)' }}><Icon name={pass ? 'award' : 'target'} size={48} /></span>
            <h2 className="sim-title" style={{ fontSize: '2rem' }}>{pass ? 'Simulation réussie' : 'Simulation terminée'}</h2>
            <p className="lead" style={{ margin: '0 auto 6px' }}>Score : <strong>{fr(score)} / {max}</strong> ({pct} %)</p>
            <p className="dim">Commandes : {fr(cmdPoints)} / {nCmd} · Questions : {quizPoints} / {tp.quiz.length}</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
              <button className="btn btn-primary" onClick={restart}><Icon name="restart" /> Recommencer</button>
              <button className="btn btn-ghost" onClick={() => go(3)}>Revoir les manipulations</button>
            </div>
          </div>
        );
      }
    }
  }

  return (
    <div ref={box} className="sim-stage" tabIndex={-1} aria-label={`Simulation IT LAB – ${tp.title}`}>
      <header className="sim-bar">
        <span className="brand-mark" style={{ width: 26, height: 26 }}><Icon name="logo" size={15} /></span>
        <strong className="sim-bar-title">IT LAB · {tp.title}</strong>
        <span className="dim mono" style={{ fontSize: '0.8rem', marginLeft: 'auto' }}>{i + 1} / {slides.length}</span>
        <button className="btn btn-quiet btn-sm" onClick={() => setToc((t) => !t)} aria-expanded={toc}><Icon name="list" /> Sommaire</button>
        <button className="btn btn-quiet btn-sm" onClick={() => box.current?.requestFullscreen?.().catch(() => undefined)} aria-label="Plein écran"><Icon name="expand" /></button>
      </header>
      <div className="progress" style={{ borderRadius: 0, height: 4 }}><span style={{ width: `${((i + 1) / slides.length) * 100}%` }} /></div>
      <div className="sim-main">
        {toc && (
          <nav className="sim-toc" aria-label="Sommaire de la simulation">
            {slides.map((s, k) => (
              <button key={k} aria-current={k === i ? 'step' : undefined} onClick={() => { go(k); }}>
                <span className="mono dim">{k + 1}</span> {slideLabel(tp, s)}
              </button>
            ))}
          </nav>
        )}
        <section className="sim-slide fade-in" key={i}>{body()}</section>
      </div>
      <footer className="sim-foot">
        <button className="btn btn-ghost btn-sm" onClick={() => go(i - 1)} disabled={i === 0}><Icon name="prev" /> Retour</button>
        <button className="btn btn-quiet btn-sm" onClick={restart}><Icon name="restart" /> Recommencer</button>
        <span className="dim sim-credit">Simulation IT LAB · {AUTHOR} · Score {fr(score)}/{max}</span>
        {fullPageHref && <a className="btn btn-quiet btn-sm" href={fullPageHref}><Icon name="external" /> Pleine page</a>}
        <button className="btn btn-primary btn-sm" onClick={() => go(i + 1)} disabled={blocked || i === slides.length - 1} title={blocked ? 'Terminez cette diapositive pour continuer' : undefined}>
          Suivant <Icon name="next" />
        </button>
      </footer>
    </div>
  );
}

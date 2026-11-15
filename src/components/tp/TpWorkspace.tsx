import { startTransition, useEffect, useRef, useState } from 'react';
import type { ModeId, Tp } from '../../data/types';
import { MODES } from '../../data/catalog';
import { useProgress } from '../../lib/useProgress';
import { addTime, isPersistent, markMode, recordPractice, recordQuiz, tpCompletion, tpOf } from '../../lib/progress';
import LearnMode from './LearnMode';
import ObserveMode from './ObserveMode';
import PracticeMode from './PracticeMode';
import EvaluateMode from './EvaluateMode';
import CorrectMode from './CorrectMode';
import Icon from '../ui/Icon';
import type { IconName } from '../ui/icons';

const MODE_ICONS: Record<ModeId, IconName> = { learn: 'book', observe: 'eye', practice: 'terminal', evaluate: 'target', correct: 'checkCircle' };
const isMode = (m: string | null): m is ModeId => !!m && MODES.some((x) => x.id === m);

/** Espace de travail d'un TP : les 5 modes, la progression et le suivi du temps. */
export default function TpWorkspace({ tp, base }: { tp: Tp; base: string }) {
  const [mode, setMode] = useState<ModeId>('learn');
  const [step, setStep] = useState(0);
  const [persistent, setPersistent] = useState(true);
  const progress = useProgress();
  const t = tpOf(progress, tp.slug);
  const topRef = useRef<HTMLDivElement>(null);

  // Mode et étape depuis l'URL (?mode=practice&step=3).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const m = p.get('mode');
    const s = Number(p.get('step'));
    startTransition(() => {
      if (isMode(m)) setMode(m);
      if (Number.isFinite(s) && s > 0) setStep(s - 1);
      setPersistent(isPersistent());
    });
  }, []);

  // Temps passé sur le TP (onglet visible uniquement).
  useEffect(() => {
    let start = Date.now();
    const flush = () => { addTime(tp.slug, Date.now() - start); start = Date.now(); };
    const onVis = () => (document.visibilityState === 'hidden' ? flush() : (start = Date.now()));
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', flush);
    return () => { flush(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('pagehide', flush); };
  }, [tp.slug]);

  function go(m: ModeId) {
    setMode(m);
    const u = new URL(window.location.href);
    u.searchParams.set('mode', m);
    u.searchParams.delete('step');
    window.history.replaceState(null, '', u);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const nextOf = (m: ModeId) => MODES[Math.min(MODES.findIndex((x) => x.id === m) + 1, MODES.length - 1)].id;

  return (
    <div ref={topRef} className="anchor-offset">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div className="mode-tabs" role="tablist" aria-label="Modes d’apprentissage" style={{ flex: '1 1 640px' }}>
          {MODES.map((m, i) => (
            <button key={m.id} role="tab" id={`tab-${m.id}`} aria-controls="mode-panel" aria-selected={mode === m.id} className="mode-tab" onClick={() => go(m.id)} title={m.description}>
              <span className="num">{i + 1}</span>
              <Icon name={MODE_ICONS[m.id]} size={16} />
              {m.label}
              {t.modes[m.id] && <span className="done" aria-label="terminé"><Icon name="check" size={14} /></span>}
            </button>
          ))}
        </div>
        <div style={{ flex: '0 1 220px', minWidth: 160 }}>
          <div className="dim" style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Progression du TP</span><span>{tpCompletion(t)} %</span>
          </div>
          <div className="progress" style={{ marginTop: 6 }}><span style={{ width: `${tpCompletion(t)}%` }} /></div>
        </div>
      </div>
      <p className="dim" style={{ margin: '0 0 16px', fontSize: '0.9rem' }}>
        <strong style={{ color: 'var(--text)' }}>{MODES.find((m) => m.id === mode)!.label} :</strong> {MODES.find((m) => m.id === mode)!.description}
      </p>
      {!persistent && (
        <div className="callout callout-warn" style={{ marginBottom: 16 }}>
          <Icon name="warn" /><div>Le stockage local du navigateur est indisponible : votre progression sera perdue à la fermeture de l’onglet.</div>
        </div>
      )}

      <div id="mode-panel" role="tabpanel" aria-labelledby={`tab-${mode}`} key={mode}>
        {mode === 'learn' && <LearnMode tp={tp} done={!!t.modes.learn} onDone={() => markMode(tp.slug, 'learn')} onNext={() => go('observe')} />}
        {mode === 'observe' && <ObserveMode tp={tp} initialStep={step} done={!!t.modes.observe} onDone={() => markMode(tp.slug, 'observe')} onNext={() => go('practice')} />}
        {mode === 'practice' && <PracticeMode tp={tp} initialStep={step} onFinish={(s, m, mi) => recordPractice(tp.slug, s, m, mi)} onNext={() => go(nextOf('practice'))} />}
        {mode === 'evaluate' && <EvaluateMode tp={tp} onFinish={(s, m, a, c) => recordQuiz(tp.slug, s, m, a, c)} onNext={() => go('correct')} />}
        {mode === 'correct' && <CorrectMode tp={tp} progress={t} onViewed={() => !t.modes.correct && markMode(tp.slug, 'correct')} goto={go} defiHref={`${base.replace(/\/$/, '')}/defi`} />}
      </div>
    </div>
  );
}

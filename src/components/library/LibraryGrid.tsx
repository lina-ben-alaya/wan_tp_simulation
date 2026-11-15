import { useMemo, useState } from 'react';
import type { SubjectId, ThemeId } from '../../data/types';
import { LEVELS, SUBJECTS, THEMES } from '../../data/catalog';
import { useProgress } from '../../lib/useProgress';
import { tpCompletion } from '../../lib/progress';
import { fold } from '../../lib/search';
import Icon from '../ui/Icon';

export interface TpCardData {
  slug: string; code: string; title: string; subtitle: string; summary: string;
  subject: SubjectId; theme: ThemeId; level: 1 | 2 | 3; duration: number; tools: string[]; steps: number; questions: number;
}

type Status = 'all' | 'todo' | 'doing' | 'done';

export function TpCard({ tp, href, completion }: { tp: TpCardData; href: string; completion: number }) {
  return (
    <a href={href} className={`card card-link theme-${tp.theme}`}>
      <div className="tp-card">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="badge badge-theme">{THEMES[tp.theme].label}</span>
          <span className="badge">{SUBJECTS[tp.subject].short}</span>
          {completion === 100 && <span className="badge badge-ok"><Icon name="check" size={12} /> Terminé</span>}
        </div>
        <div>
          <div className="mono dim" style={{ fontSize: '0.78rem' }}>{tp.code}</div>
          <h3>{tp.title}</h3>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: '0.92rem' }}>{tp.subtitle}</p>
        </div>
        <div className="meta">
          <span><Icon name="clock" size={14} /> {tp.duration} min</span>
          <span title={LEVELS[tp.level]}><span className="dots" aria-label={`Niveau ${LEVELS[tp.level]}`}>{[1, 2, 3].map((n) => <i key={n} className={n <= tp.level ? 'on' : ''} />)}</span> {LEVELS[tp.level]}</span>
          <span><Icon name="terminal" size={14} /> {tp.steps} étapes</span>
          <span><Icon name="target" size={14} /> {tp.questions} questions</span>
        </div>
        <div className="progress" aria-label={`Progression ${completion} %`}><span style={{ width: `${completion}%` }} /></div>
      </div>
    </a>
  );
}

export default function LibraryGrid({ tps, base }: { tps: TpCardData[]; base: string }) {
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState<SubjectId | 'all'>('all');
  const [theme, setTheme] = useState<ThemeId | 'all'>('all');
  const [level, setLevel] = useState<0 | 1 | 2 | 3>(0);
  const [status, setStatus] = useState<Status>('all');
  const progress = useProgress();

  const list = useMemo(() => tps.filter((t) => {
    const c = tpCompletion(progress.tps[t.slug]);
    if (subject !== 'all' && t.subject !== subject) return false;
    if (theme !== 'all' && t.theme !== theme) return false;
    if (level && t.level !== level) return false;
    if (status === 'todo' && c > 0) return false;
    if (status === 'doing' && (c === 0 || c === 100)) return false;
    if (status === 'done' && c < 100) return false;
    if (q) {
      const hay = fold(`${t.title} ${t.subtitle} ${t.summary} ${t.tools.join(' ')} ${t.code}`);
      if (!fold(q).split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  }), [tps, q, subject, theme, level, status, progress]);

  const b = base.replace(/\/$/, '');
  return (
    <div className="stack">
      <div className="card card-pad stack" style={{ gap: 12 }}>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Icon name="search" />
          <input className="input" placeholder="Filtrer : MPLS, NAT, Wireshark, VPCS…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filtrer les TP" />
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }} role="group" aria-label="Matière">
          <button className="chip" aria-pressed={subject === 'all'} onClick={() => setSubject('all')}>Toutes les matières</button>
          {(Object.keys(SUBJECTS) as SubjectId[]).map((s) => <button key={s} className="chip" aria-pressed={subject === s} onClick={() => setSubject(s)}>{SUBJECTS[s].label}</button>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }} role="group" aria-label="Thème">
          <button className="chip" aria-pressed={theme === 'all'} onClick={() => setTheme('all')}>Tous les thèmes</button>
          {(Object.keys(THEMES) as ThemeId[]).map((t) => <button key={t} className="chip" aria-pressed={theme === t} onClick={() => setTheme(t)}>{THEMES[t].label}</button>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <select className="input" style={{ width: 'auto' }} value={level} onChange={(e) => setLevel(Number(e.target.value) as 0 | 1 | 2 | 3)} aria-label="Niveau">
            <option value={0}>Tous niveaux</option><option value={1}>Fondamental</option><option value={2}>Intermédiaire</option><option value={3}>Avancé</option>
          </select>
          <select className="input" style={{ width: 'auto' }} value={status} onChange={(e) => setStatus(e.target.value as Status)} aria-label="Statut">
            <option value="all">Tous statuts</option><option value="todo">À commencer</option><option value="doing">En cours</option><option value="done">Terminés</option>
          </select>
          <span className="dim" style={{ marginLeft: 'auto', fontSize: '0.86rem' }} aria-live="polite">{list.length} TP</span>
        </div>
      </div>
      {list.length === 0 ? (
        <div className="card card-pad" style={{ textAlign: 'center' }}>
          <p className="muted">Aucun TP ne correspond à ces filtres.</p>
          <button className="btn btn-ghost btn-sm" onClick={() => { setQ(''); setSubject('all'); setTheme('all'); setLevel(0); setStatus('all'); }}>Réinitialiser</button>
        </div>
      ) : (
        <div className="grid-auto">
          {list.map((t) => <TpCard key={t.slug} tp={t} href={`${b}/tps/${t.slug}`} completion={tpCompletion(progress.tps[t.slug])} />)}
        </div>
      )}
    </div>
  );
}

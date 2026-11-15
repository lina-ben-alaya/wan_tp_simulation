import { useProgress } from '../../lib/useProgress';
import { MODES } from '../../data/catalog';
import { overallCompletion, tpCompletion } from '../../lib/progress';
import Icon from '../ui/Icon';

/** Encadré « Reprendre » de l'accueil : dernier TP visité et prochain mode à faire. */
export default function ResumeCard({ tps, base }: { tps: { slug: string; title: string; code: string }[]; base: string }) {
  const p = useProgress();
  const b = base.replace(/\/$/, '');
  const visited = tps
    .map((t) => ({ ...t, last: p.tps[t.slug]?.lastVisit ?? 0, c: tpCompletion(p.tps[t.slug]) }))
    .filter((t) => t.last > 0 || t.c > 0)
    .sort((a, b2) => b2.last - a.last);
  const current = visited.find((t) => t.c < 100) ?? null;
  const overall = overallCompletion(p, tps.map((t) => t.slug));

  if (!current) {
    return (
      <div className="card card-pad" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Icon name="sparkle" size={28} />
        <div style={{ flex: 1, minWidth: 220 }}>
          <strong>{overall === 100 ? 'Parcours terminé : bravo !' : 'Commencez votre parcours'}</strong>
          <div className="dim" style={{ fontSize: '0.9rem' }}>{overall === 100 ? 'Votre attestation est disponible dans le Dashboard.' : 'Premier TP conseillé : le backbone MPLS, qui ouvre le fil rouge « Opérateur ».'}</div>
        </div>
        <a className="btn btn-primary" href={overall === 100 ? `${b}/dashboard` : `${b}/tps/${tps[0].slug}`}>{overall === 100 ? 'Dashboard' : 'Démarrer'} <Icon name="arrowRight" /></a>
      </div>
    );
  }
  const t = p.tps[current.slug];
  const nextMode = MODES.find((m) => !t?.modes[m.id]) ?? MODES[0];
  return (
    <div className="card card-pad" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 220 }}>
        <div className="eyebrow" style={{ marginBottom: 4 }}>Reprendre · {current.code}</div>
        <strong>{current.title}</strong>
        <div className="progress" style={{ marginTop: 8, maxWidth: 320 }}><span style={{ width: `${current.c}%` }} /></div>
        <div className="dim" style={{ fontSize: '0.84rem', marginTop: 4 }}>{current.c} % · prochain mode : {nextMode.label}</div>
      </div>
      <a className="btn btn-primary" href={`${b}/tps/${current.slug}?mode=${nextMode.id}`}>Continuer <Icon name="arrowRight" /></a>
    </div>
  );
}

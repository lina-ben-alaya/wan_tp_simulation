import type { Fidelity } from '../../data/types';
import { ACTIVITY_KINDS, FIDELITY } from '../../data/catalog';

export function FidelityBadge({ f }: { f: Fidelity }) {
  const cls = f === 'reel' ? 'badge-ok' : f === 'enonce' ? 'badge-primary' : f === 'illustratif' ? 'badge-warn' : 'badge-signal';
  return (
    <span className={`badge ${cls}`} title={FIDELITY[f].description}>
      {FIDELITY[f].label}
    </span>
  );
}

export function KindBadge({ k }: { k: keyof typeof ACTIVITY_KINDS }) {
  return (
    <span className="badge badge-kind" title={ACTIVITY_KINDS[k].description}>
      {ACTIVITY_KINDS[k].label}
    </span>
  );
}

export function Callout({ tone, children, icon }: { tone: 'info' | 'warn' | 'tip' | 'err'; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className={`callout callout-${tone}`} role={tone === 'err' || tone === 'warn' ? 'note' : undefined}>
      {icon}
      <div>{children}</div>
    </div>
  );
}

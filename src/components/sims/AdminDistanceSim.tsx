import { useState } from 'react';
import { bestRoute, type RouteCandidate } from '../../lib/sims';
import Icon from '../ui/Icon';

export default function AdminDistanceSim() {
  const [ospf, setOspf] = useState(110);
  const [eigrpExt, setEigrpExt] = useState(170);
  const cands: RouteCandidate[] = [
    { id: 'ospf', label: 'via R1 (OSPF E2, redistribuée par R2)', protocol: 'OSPF', ad: ospf, metric: 20, domains: 3 },
    { id: 'eigrp', label: 'via R4 (EIGRP externe, redistribuée par R5)', protocol: 'EIGRP externe', ad: eigrpExt, metric: 2681856, domains: 2 },
  ];
  const best = bestRoute(cands)!;

  return (
    <div className="stack">
      <p className="muted" style={{ margin: 0 }}>R3 doit joindre <code>172.16.10.0/24</code> (domaine RIP). Il connaît deux routes ; il garde celle de plus petite distance administrative, sans comparer les métriques de protocoles différents.</p>
      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <label className="stack" style={{ gap: 4 }}>
          <span className="dim" style={{ fontSize: '0.84rem' }}>Distance OSPF : <strong className="mono">{ospf}</strong></span>
          <input type="range" min={1} max={200} value={ospf} onChange={(e) => setOspf(Number(e.target.value))} aria-label="Distance administrative OSPF" />
        </label>
        <label className="stack" style={{ gap: 4 }}>
          <span className="dim" style={{ fontSize: '0.84rem' }}>Distance EIGRP externe : <strong className="mono">{eigrpExt}</strong></span>
          <input type="range" min={1} max={255} value={eigrpExt} onChange={(e) => setEigrpExt(Number(e.target.value))} aria-label="Distance administrative EIGRP externe" />
        </label>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button className="chip" onClick={() => { setOspf(110); setEigrpExt(170); }}>Valeurs par défaut</button>
        <button className="chip" onClick={() => { setOspf(110); setEigrpExt(105); }}>Appliquer « distance eigrp 90 105 »</button>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {cands.map((c) => (
          <div key={c.id} className="card" style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center', borderColor: c.id === best.id ? 'var(--ok)' : undefined, background: c.id === best.id ? 'var(--ok-soft)' : undefined }}>
            <Icon name={c.id === best.id ? 'checkCircle' : 'route'} />
            <div style={{ flex: 1 }}>
              <strong>{c.label}</strong>
              <div className="dim mono" style={{ fontSize: '0.8rem' }}>[{c.ad}/{c.metric}] · {c.domains} domaines de routage traversés</div>
            </div>
            {c.id === best.id && <span className="badge badge-ok">Route retenue</span>}
          </div>
        ))}
      </div>
      <div className={`callout ${best.id === 'eigrp' ? 'callout-tip' : 'callout-warn'}`} aria-live="polite">
        <Icon name="info" />
        <div>{best.id === 'eigrp'
          ? 'R3 passe par le domaine EIGRP : deux domaines traversés au lieu de trois. C’est l’effet de distance eigrp 90 105.'
          : 'R3 choisit R1 car la distance OSPF est plus petite : la redistribution a faussé le choix (trois domaines traversés).'}</div>
      </div>
      <p className="dim" style={{ fontSize: '0.8rem', margin: 0 }}>Métriques indicatives. Le modèle applique la règle : plus petite distance administrative, puis plus petite métrique.</p>
    </div>
  );
}

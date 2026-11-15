import { useState } from 'react';
import { frSimulate } from '../../lib/sims';
import Icon from '../ui/Icon';

export default function FrFailoverSim() {
  const [part, setPart] = useState<1 | 2>(1);
  const [down, setDown] = useState(false);
  const r = frSimulate({ part, agence1Down: down });

  const hubToA1 = r.hubRouteToAgence1 === 'Frame Relay';
  const pvc16 = down ? 'var(--err)' : 'var(--ok)';

  return (
    <div className="stack">
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="chip" aria-pressed={part === 1} onClick={() => setPart(1)}>Partie 1 : interface physique + statiques</button>
        <button className="chip" aria-pressed={part === 2} onClick={() => setPart(2)}>Partie 2 : sous-interfaces + RIPv2</button>
        <button className={`btn btn-sm ${down ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setDown((d) => !d)} style={{ marginLeft: 'auto' }}>
          <Icon name="bolt" /> {down ? 'Réactiver s0/1 d’Agence1' : 'Couper s0/1 sur Agence1'}
        </button>
      </div>

      <svg viewBox="0 0 640 230" className="topo" role="img" aria-label="Chemin du trafic C2 vers C1">
        <line x1={110} y1={115} x2={320} y2={115} className="link serial" />
        <line x1={320} y1={115} x2={530} y2={50} stroke={pvc16} strokeWidth={3} strokeDasharray={down ? '6 6' : undefined} />
        <line x1={320} y1={115} x2={530} y2={185} stroke="var(--ok)" strokeWidth={3} />
        <path d="M110,115 Q300,-20 530,50" fill="none" stroke="var(--t-routage)" strokeWidth={2} strokeDasharray="4 5" />
        <text x={300} y={22} textAnchor="middle" className="link-label">PPP 172.16.1.0/24 (secours)</text>
        <text x={430} y={70} textAnchor="middle" className="link-label">PVC DLCI 16</text>
        <text x={430} y={172} textAnchor="middle" className="link-label">PVC DLCI 17</text>
        {/* trajets */}
        <path d={hubToA1 ? 'M110,115 L320,115 L530,50' : 'M110,115 Q300,-20 530,50'} fill="none" stroke="var(--signal)" strokeWidth={5} strokeOpacity={0.35} />
        {[['SiteCentral', 110, 115], ['FR', 320, 115], ['Agence1', 530, 50], ['Agence2', 530, 185]].map(([n, x, y]) => (
          <g key={n as string} transform={`translate(${x},${y})`} className="node">
            <circle r={22} className="shape" />
            <text y={40}>{n}</text>
          </g>
        ))}
        {down && <text x={470} y={95} fill="var(--err)" fontSize={22} fontWeight={700}>✕</text>}
        {!r.pingC2toC1 && <text x={530} y={115} textAnchor="middle" fill="var(--err)" fontWeight={700} fontSize={13}>paquets perdus</text>}
      </svg>

      <div className="table-wrap">
        <table className="table">
          <tbody>
            <tr><th>SiteCentral s0/1 (physique)</th><td><span className={`badge ${r.hubPhysical === 'up' ? 'badge-ok' : 'badge-err'}`}>{r.hubPhysical}</span></td></tr>
            {r.hubSub16 && <tr><th>SiteCentral s0/1.16</th><td><span className={`badge ${r.hubSub16 === 'up' ? 'badge-ok' : 'badge-err'}`}>{r.hubSub16}</span></td></tr>}
            <tr><th>Route d’Agence1 vers 192.168.1.0/24</th><td>{r.agence1RouteToHub}</td></tr>
            <tr><th>Route de SiteCentral vers 192.168.2.0/24</th><td>{r.hubRouteToAgence1}</td></tr>
            <tr><th>ping C2 → C1</th><td><span className={`badge ${r.pingC2toC1 ? 'badge-ok' : 'badge-err'}`}>{r.pingC2toC1 ? 'réussi' : 'échec'}</span></td></tr>
          </tbody>
        </table>
      </div>
      <div className={`callout ${r.pingC2toC1 ? 'callout-tip' : 'callout-err'}`} aria-live="polite"><Icon name="info" /><div>{r.explanation}</div></div>
    </div>
  );
}

import { useState } from 'react';
import Icon from '../ui/Icon';

const PHASES = [
  { title: 'PVC actif', text: 'Le commutateur FR1 signale par la LMI que le DLCI 16 est ACTIVE sur l’interface S1/0 du Siège. Le Siège connaît le DLCI, mais pas l’adresse IP de l’extrémité distante.', dir: 0 },
  { title: 'Requête Inverse ARP', text: 'Le Siège envoie sur le DLCI 16 : « Je suis 192.168.2.1. Quelle est ton adresse IP ? »', dir: 1 },
  { title: 'Réponse Inverse ARP', text: 'Agence 1 répond sur le même PVC : « Je suis 192.168.2.2. »', dir: -1 },
  { title: 'Mappage enregistré', text: 'Le Siège ajoute l’entrée dynamique : 192.168.2.2 ↔ DLCI 16. Pour joindre 192.168.2.2, il enverra désormais ses trames sur le DLCI 16.', dir: 0 },
];

export default function InverseArpSim() {
  const [p, setP] = useState(0);
  const ph = PHASES[p];
  return (
    <div className="stack">
      <svg viewBox="0 0 640 150" className="topo" role="img" aria-label={ph.title}>
        <line x1={90} y1={75} x2={550} y2={75} className="link serial" />
        <text x={320} y={60} textAnchor="middle" className="link-label">PVC – DLCI 16 côté Siège</text>
        {[['Siege', 90], ['FR1', 320], ['Agence1', 550]].map(([n, x]) => (
          <g key={n as string} transform={`translate(${x},75)`} className="node"><circle r={22} className="shape" /><text y={42}>{n}</text></g>
        ))}
        {ph.dir !== 0 && (
          <circle r={8} className="packet" key={p}>
            <animate attributeName="cx" from={ph.dir > 0 ? 90 : 550} to={ph.dir > 0 ? 550 : 90} dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="cy" values="75;75" dur="1.6s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
      <div className="card" style={{ padding: 14 }}>
        <div className="dim" style={{ fontSize: '0.8rem' }}>Phase {p + 1} / {PHASES.length}</div>
        <strong>{ph.title}</strong>
        <p className="muted" style={{ margin: '4px 0 0' }}>{ph.text}</p>
      </div>
      <div className="table-wrap">
        <table className="table mono" aria-label="show frame-relay map">
          <thead><tr><th>Interface</th><th>IP distante</th><th>DLCI</th><th>Type</th></tr></thead>
          <tbody>
            {p >= 3 ? <tr className="fade-in"><td>Serial1/0</td><td>192.168.2.2</td><td>16</td><td>dynamic</td></tr> : <tr><td colSpan={4} className="dim">(aucune entrée)</td></tr>}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setP(Math.max(0, p - 1))} disabled={p === 0}><Icon name="prev" /> Retour</button>
        <button className="btn btn-primary btn-sm" onClick={() => setP(Math.min(PHASES.length - 1, p + 1))} disabled={p === PHASES.length - 1}>Suivant <Icon name="next" /></button>
        <button className="btn btn-quiet btn-sm" onClick={() => setP(0)}><Icon name="restart" /> Recommencer</button>
      </div>
    </div>
  );
}

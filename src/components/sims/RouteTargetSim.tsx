import { useState } from 'react';
import { RT_RE, rtImported } from '../../lib/sims';
import Icon from '../ui/Icon';

export default function RouteTargetSim() {
  const [vrfRt, setVrfRt] = useState('1:100');
  const [routeRt, setRouteRt] = useState('100:100');
  const [rd, setRd] = useState('100:1');
  const routeRts = routeRt.split(',').map((s) => s.trim()).filter(Boolean);
  const valid = RT_RE.test(vrfRt.trim()) && routeRts.length > 0 && routeRts.every((r) => RT_RE.test(r)) && RT_RE.test(rd.trim());
  const imported = valid && rtImported(routeRts, [vrfRt]);

  return (
    <div className="stack">
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button className="chip" onClick={() => { setVrfRt('1:100'); setRouteRt('100:100'); }}>Question du TP (RT 100:100)</button>
        <button className="chip" onClick={() => { setVrfRt('1:100'); setRouteRt('1:100'); }}>Route du Client A (RT 1:100)</button>
      </div>
      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <label className="stack" style={{ gap: 4 }}>
          <span className="dim" style={{ fontSize: '0.84rem' }}>SP1 – VRF Client_A : route-target both</span>
          <input className="input mono" value={vrfRt} onChange={(e) => setVrfRt(e.target.value)} />
        </label>
        <label className="stack" style={{ gap: 4 }}>
          <span className="dim" style={{ fontSize: '0.84rem' }}>Route VPNv4 reçue : RT (séparés par des virgules)</span>
          <input className="input mono" value={routeRt} onChange={(e) => setRouteRt(e.target.value)} />
        </label>
        <label className="stack" style={{ gap: 4 }}>
          <span className="dim" style={{ fontSize: '0.84rem' }}>RD de la route (n’influence pas l’import)</span>
          <input className="input mono" value={rd} onChange={(e) => setRd(e.target.value)} />
        </label>
      </div>
      {!valid ? (
        <div className="callout callout-warn"><Icon name="warn" /><div>Format attendu : ASN:nn (ex. 1:100).</div></div>
      ) : (
        <div className={`callout ${imported ? 'callout-tip' : 'callout-err'} fade-in`} aria-live="polite">
          <Icon name={imported ? 'checkCircle' : 'xCircle'} />
          <div>
            <strong>{imported ? 'Route importée dans la VRF Client_A.' : 'Route NON importée.'}</strong>{' '}
            {imported
              ? `Un des RT de la route (${routeRt}) figure parmi les RT d’import de la VRF (${vrfRt}).`
              : `Aucun RT de la route (${routeRt}) ne correspond au RT d’import de la VRF (${vrfRt}). Le RD ${rd} sert seulement à rendre la route unique.`}
          </div>
        </div>
      )}
    </div>
  );
}

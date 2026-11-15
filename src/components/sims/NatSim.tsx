import { useState } from 'react';
import { natClear, natInitial, natTranslate, NAT_POOL, type NatMode, type NatState } from '../../lib/sims';
import Icon from '../ui/Icon';

const HOSTS = ['192.168.10.2', '192.168.10.3', '192.168.11.2', '192.168.11.3', '192.168.30.2', '192.168.30.3', '192.168.30.4', '192.168.10.4'];

export default function NatSim() {
  const [state, setState] = useState<NatState>(natInitial('pool'));
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const setMode = (m: NatMode) => { setState(natInitial(m)); setMsg(null); };
  const send = (h: string) => {
    const r = natTranslate(state, h);
    setState(r.state);
    if (r.outcome.ok) setMsg({ ok: true, text: `${h} → ${r.outcome.entry.insideGlobal}${r.outcome.reused ? ' (traduction existante réutilisée)' : ''}` });
    else if (r.outcome.reason === 'pool-exhausted') setMsg({ ok: false, text: `${h} : pool MY-NAT-POOL épuisé (6 adresses déjà utilisées). Le paquet n’est pas traduit.` });
    else setMsg({ ok: false, text: `${h} n’est pas autorisé par l’ACL NAT.` });
  };
  const usedPool = state.entries.filter((e) => e.kind === 'dynamic').length;

  return (
    <div className="stack">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="dim" style={{ fontSize: '0.86rem' }}>Configuration de R2 :</span>
        <button className="chip" aria-pressed={state.mode === 'pool'} onClick={() => setMode('pool')}>NAT dynamique (pool .241–.246)</button>
        <button className="chip" aria-pressed={state.mode === 'pat'} onClick={() => setMode('pat')}>Surcharge (overload)</button>
        <button className="btn btn-quiet btn-sm" onClick={() => { setState(natClear(state)); setMsg(null); }}><Icon name="trash" /> clear ip nat translation *</button>
      </div>
      <pre className="code" style={{ fontSize: '0.8rem' }}>{state.mode === 'pool'
        ? 'ip nat pool MY-NAT-POOL 209.165.200.241 209.165.200.246 netmask 255.255.255.248\nip nat inside source list NAT pool MY-NAT-POOL'
        : 'ip nat inside source list NAT interface serial0/1/0 overload'}</pre>
      <div>
        <div className="dim" style={{ fontSize: '0.84rem', marginBottom: 6 }}>Cliquez sur un hôte de l’intranet pour lui faire envoyer un ping vers le FAI :</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {HOSTS.map((h) => <button key={h} className="btn btn-ghost btn-sm mono" onClick={() => send(h)}>{h}</button>)}
        </div>
      </div>
      {msg && (
        <div className={`callout ${msg.ok ? 'callout-tip' : 'callout-err'} fade-in`} aria-live="polite">
          <Icon name={msg.ok ? 'checkCircle' : 'xCircle'} /><div className="mono" style={{ fontSize: '0.88rem' }}>{msg.text}</div>
        </div>
      )}
      {state.mode === 'pool' && (
        <div className="dim" style={{ fontSize: '0.84rem' }}>
          Pool utilisé : {usedPool} / {NAT_POOL.length}
          <div className="progress" style={{ marginTop: 4, maxWidth: 260 }}><span style={{ width: `${(usedPool / NAT_POOL.length) * 100}%`, background: usedPool === 6 ? 'var(--err)' : undefined }} /></div>
        </div>
      )}
      <div className="table-wrap">
        <table className="table mono" aria-label="show ip nat translations">
          <thead><tr><th>Pro</th><th>Inside global</th><th>Inside local</th><th>Type</th></tr></thead>
          <tbody>
            {state.entries.map((e) => (
              <tr key={e.insideLocal + e.insideGlobal}>
                <td>{e.proto}</td><td>{e.insideGlobal}</td><td>{e.insideLocal}</td>
                <td><span className={`badge ${e.kind === 'static' ? 'badge-primary' : e.kind === 'pat' ? 'badge-signal' : ''}`}>{e.kind === 'static' ? 'statique' : e.kind === 'pat' ? 'PAT' : 'dynamique'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="dim" style={{ fontSize: '0.8rem', margin: 0 }}>Modèle simplifié : les numéros de port PAT sont attribués séquentiellement à partir de 1024 pour la lisibilité.</p>
    </div>
  );
}

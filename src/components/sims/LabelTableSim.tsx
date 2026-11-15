import { useState } from 'react';
import { checkLabel, LABEL_EXERCISE } from '../../lib/sims';
import Icon from '../ui/Icon';

export default function LabelTableSim() {
  const [vals, setVals] = useState<string[]>(LABEL_EXERCISE.map(() => ''));
  const [checked, setChecked] = useState(false);
  const results = LABEL_EXERCISE.map((x, i) => checkLabel(vals[i], x.answer));
  const score = results.filter(Boolean).length;

  return (
    <div className="stack">
      <p className="muted" style={{ margin: 0 }}>
        Préfixe <code>1.1.1.0/25</code> (loopback de SP1). Hypothèse illustrative : SP2 a choisi le label local 16, SP3 le label 17.
        Complétez les cases : <code>imp-null</code>, <code>pop</code> ou un numéro.
      </p>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Routeur</th><th>Champ</th><th>Votre réponse</th>{checked && <th>Correction</th>}</tr></thead>
          <tbody>
            {LABEL_EXERCISE.map((x, i) => (
              <tr key={x.router + x.field}>
                <td><strong>{x.router}</strong></td>
                <td>{x.field === 'local' ? 'Label local (annoncé)' : 'Label sortant (LFIB)'}</td>
                <td>
                  <input className="input mono" style={{ maxWidth: 140, padding: '5px 8px' }} value={vals[i]} disabled={checked}
                    onChange={(e) => setVals((v) => v.map((y, k) => (k === i ? e.target.value : y)))} aria-label={`${x.router} ${x.field}`} />
                </td>
                {checked && (
                  <td>
                    <span className={`badge ${results[i] ? 'badge-ok' : 'badge-err'}`}>{results[i] ? 'Juste' : x.answer}</span>
                    <div className="dim" style={{ fontSize: '0.8rem', marginTop: 4 }}>{x.why}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {!checked ? (
          <button className="btn btn-primary btn-sm" onClick={() => setChecked(true)}><Icon name="check" /> Vérifier</button>
        ) : (
          <>
            <span className="badge">{score} / {LABEL_EXERCISE.length}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => { setChecked(false); setVals(LABEL_EXERCISE.map(() => '')); }}><Icon name="restart" /> Recommencer</button>
          </>
        )}
      </div>
    </div>
  );
}

import type { CompareCase } from '../../data/types';
import Icon from '../ui/Icon';

/** Comparaison configuration incorrecte / correcte, avec conséquence et leçon. */
export default function CompareView({ c }: { c: CompareCase }) {
  return (
    <article className="card card-pad" aria-labelledby={`cmp-${c.id}`}>
      <div className="eyebrow"><Icon name="compare" size={14} /> Comparaison</div>
      <h3 id={`cmp-${c.id}`}>{c.title}</h3>
      <p className="muted">{c.context}</p>
      <div className="diff">
        <div className="side bad">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 650, color: 'var(--err)', marginBottom: 8 }}>
            <Icon name="xCircle" size={18} /> Configuration incorrecte
          </div>
          <pre className="code">{c.wrong.config}</pre>
          <p style={{ margin: '10px 0 0' }}><strong>Résultat :</strong> {c.wrong.result}</p>
        </div>
        <div className="side good">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 650, color: 'var(--ok)', marginBottom: 8 }}>
            <Icon name="checkCircle" size={18} /> Configuration correcte
          </div>
          <pre className="code">{c.right.config}</pre>
          <p style={{ margin: '10px 0 0' }}><strong>Résultat :</strong> {c.right.result}</p>
        </div>
      </div>
      <p style={{ margin: '14px 0 0', display: 'flex', gap: 8 }}>
        <Icon name="bulb" size={18} className="" /> <span><strong>À retenir :</strong> {c.lesson}</span>
      </p>
    </article>
  );
}

import { useRef, useState } from 'react';
import type { ThemeId } from '../../data/types';
import { MODES, THEMES } from '../../data/catalog';
import { useProgress } from '../../lib/useProgress';
import {
  averageQuiz, certificateEligible, importProgress, overallCompletion, resetProgress, setLearnerName,
  totalTimeMs, tpCompletion, weakTags, getProgress,
} from '../../lib/progress';
import { PASS_RATIO } from '../../lib/quiz';
import Icon from '../ui/Icon';

export interface DashTp { slug: string; title: string; code: string; theme: ThemeId; tags: Record<string, string[]> }

const fmtTime = (ms: number) => {
  const m = Math.round(ms / 60000);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}`;
};

export default function Dashboard({ tps, base }: { tps: DashTp[]; base: string }) {
  const p = useProgress();
  const b = base.replace(/\/$/, '');
  const slugs = tps.map((t) => t.slug);
  const overall = overallCompletion(p, slugs);
  const avg = averageQuiz(p);
  const done = tps.filter((t) => tpCompletion(p.tps[t.slug]) === 100).length;
  const weak = weakTags(p, (slug, qid) => tps.find((t) => t.slug === slug)?.tags[qid] ?? []).slice(0, 6);
  const eligible = certificateEligible(p, slugs, PASS_RATIO);
  const [name, setName] = useState(p.learnerName ?? '');
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400000);
    const key = d.toISOString().slice(0, 10);
    return { key, label: d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }), n: p.activity[key] ?? 0 };
  });
  const maxDay = Math.max(1, ...days.map((d) => d.n));

  function exportJson() {
    const blob = new Blob([JSON.stringify(getProgress(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'itlab-progression.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function certificate() {
    if (!name.trim()) { setMsg('Indiquez votre nom pour l’attestation.'); return; }
    setLearnerName(name.trim());
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      const page = doc.addPage([842, 595]);
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      const reg = await doc.embedFont(StandardFonts.Helvetica);
      const center = (t: string, y: number, size: number, f = reg, c = rgb(0.06, 0.09, 0.16)) =>
        page.drawText(t, { x: (842 - f.widthOfTextAtSize(t, size)) / 2, y, size, font: f, color: c });
      page.drawRectangle({ x: 24, y: 24, width: 794, height: 547, borderColor: rgb(0.18, 0.33, 0.92), borderWidth: 2 });
      center('IT LAB - Interactive Learning Platform', 500, 14, reg, rgb(0.4, 0.45, 0.55));
      center('Attestation de parcours', 440, 34, bold);
      center('décernée à', 395, 14);
      center(name.trim().slice(0, 60), 350, 28, bold, rgb(0.18, 0.33, 0.92));
      center(`pour avoir complété les ${tps.length} travaux pratiques réseaux de la plateforme`, 300, 13);
      center(`(MPLS, VPN MPLS, BGP, redistribution, NAT/PAT/DHCP, IPsec, GRE, Frame Relay)`, 280, 11, reg, rgb(0.4, 0.45, 0.55));
      center(`Moyenne aux évaluations : ${avg ?? 0} %   ·   Temps de pratique : ${fmtTime(totalTimeMs(p))}`, 235, 12);
      center(`Délivrée le ${new Date().toLocaleDateString('fr-FR')}`, 190, 12);
      center('Document généré localement par la plateforme. Il ne constitue pas un diplôme ni une certification officielle.', 60, 9, reg, rgb(0.5, 0.5, 0.55));
      const bytes = await doc.save();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/pdf' }));
      a.download = 'attestation-itlab.pdf';
      a.click();
      setMsg('Attestation générée.');
    } catch {
      setMsg('La génération du PDF a échoué dans ce navigateur.');
    }
  }

  return (
    <div className="stack">
      <section className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {[
          { v: `${overall} %`, l: 'Progression globale', i: 'chart' as const },
          { v: `${done} / ${tps.length}`, l: 'TP terminés (5 modes)', i: 'checkCircle' as const },
          { v: avg === null ? '—' : `${avg} %`, l: 'Moyenne aux évaluations', i: 'target' as const },
          { v: fmtTime(totalTimeMs(p)), l: 'Temps passé', i: 'clock' as const },
          { v: p.challenge.played ? `${p.challenge.best} %` : '—', l: `Meilleur défi (${p.challenge.played} partie${p.challenge.played > 1 ? 's' : ''})`, i: 'bolt' as const },
        ].map((s) => (
          <div key={s.l} className="card card-pad stat"><span style={{ color: 'var(--primary)' }}><Icon name={s.i} /></span><b>{s.v}</b><span>{s.l}</span></div>
        ))}
      </section>

      <div className="split split-2">
        <section className="card card-pad">
          <h2 style={{ fontSize: '1.15rem' }}>Maîtrise par thème</h2>
          <div className="stack" style={{ gap: 12 }}>
            {(Object.keys(THEMES) as ThemeId[]).map((th) => {
              const list = tps.filter((t) => t.theme === th);
              const c = overallCompletion(p, list.map((t) => t.slug));
              return (
                <div key={th} className={`theme-${th}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}><span>{THEMES[th].label}</span><span className="mono dim">{c} %</span></div>
                  <div className="progress" style={{ marginTop: 4, height: 9 }}><span style={{ width: `${c}%` }} /></div>
                </div>
              );
            })}
          </div>
        </section>
        <section className="card card-pad">
          <h2 style={{ fontSize: '1.15rem' }}>Activité (14 jours)</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 140 }} role="img" aria-label="Nombre d’actions par jour sur 14 jours">
            {days.map((d) => (
              <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }} title={`${d.label} : ${d.n} action(s)`}>
                <div style={{ width: '100%', maxWidth: 22, height: `${(d.n / maxDay) * 100}%`, minHeight: d.n ? 4 : 2, background: d.n ? 'var(--primary)' : 'var(--surface-3)', borderRadius: 4 }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }} className="dim mono"><span>{days[0].label}</span><span>aujourd’hui</span></div>
        </section>
      </div>

      <section className="card card-pad">
        <h2 style={{ fontSize: '1.15rem' }}>Points faibles détectés</h2>
        {weak.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>Aucune erreur enregistrée pour l’instant. Les notions des questions ratées apparaîtront ici.</p>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {weak.map((w) => (
              <div key={w.tag} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="badge badge-err">{w.errors} erreur{w.errors > 1 ? 's' : ''}</span>
                <strong className="mono" style={{ fontSize: '0.9rem' }}>{w.tag}</strong>
                <span className="dim" style={{ fontSize: '0.86rem' }}>dans</span>
                {w.slugs.map((s) => <a key={s} className="btn btn-quiet btn-sm" href={`${b}/tps/${s}?mode=learn`}>{tps.find((t) => t.slug === s)?.title} <Icon name="arrowRight" size={14} /></a>)}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card card-pad">
        <h2 style={{ fontSize: '1.15rem' }}>Résultats par TP</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>TP</th>{MODES.map((m) => <th key={m.id} style={{ textAlign: 'center' }}>{m.label}</th>)}<th>Évaluation</th><th>Pratique</th><th>ActivePresenter</th></tr>
            </thead>
            <tbody>
              {tps.map((t) => {
                const x = p.tps[t.slug];
                return (
                  <tr key={t.slug}>
                    <td><a href={`${b}/tps/${t.slug}`}>{t.title}</a><div className="dim mono" style={{ fontSize: '0.74rem' }}>{t.code}</div></td>
                    {MODES.map((m) => <td key={m.id} style={{ textAlign: 'center', color: x?.modes[m.id] ? 'var(--ok)' : 'var(--border-strong)' }}>{x?.modes[m.id] ? <Icon name="checkCircle" size={18} label="fait" /> : '·'}</td>)}
                    <td className="mono">{x?.quiz ? `${x.quiz.score}/${x.quiz.max}` : '—'}</td>
                    <td className="mono">{x?.practice ? `${x.practice.score}/${x.practice.max}` : '—'}</td>
                    <td className="mono">{x?.ap ? `${x.ap.score}/${x.ap.max}` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="split split-2">
        <section className="card card-pad stack">
          <h2 style={{ fontSize: '1.15rem', margin: 0 }}><Icon name="award" /> Attestation de parcours</h2>
          <p className="muted" style={{ margin: 0 }}>Disponible lorsque les {tps.length} évaluations sont réussies (≥ {Math.round(PASS_RATIO * 100)} %). Document non officiel, généré dans votre navigateur.</p>
          <label className="stack" style={{ gap: 4 }}>
            <span className="dim" style={{ fontSize: '0.84rem' }}>Nom affiché sur l’attestation</span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
          </label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" disabled={!eligible} onClick={certificate}><Icon name="download" /> Générer le PDF</button>
            {!eligible && <span className="dim" style={{ fontSize: '0.84rem' }}>{tps.filter((t) => { const q = p.tps[t.slug]?.quiz; return !q || q.score / q.max < PASS_RATIO; }).length} évaluation(s) restante(s)</span>}
          </div>
          {msg && <p className="muted" aria-live="polite" style={{ margin: 0 }}>{msg}</p>}
        </section>
        <section className="card card-pad stack">
          <h2 style={{ fontSize: '1.15rem', margin: 0 }}><Icon name="user" /> Mes données</h2>
          <p className="muted" style={{ margin: 0 }}>La progression est enregistrée uniquement dans ce navigateur. Exportez-la pour la sauvegarder ou la transférer.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" onClick={exportJson}><Icon name="download" /> Exporter</button>
            <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}><Icon name="upload" /> Importer</button>
            <button className="btn btn-quiet btn-sm" onClick={() => { if (window.confirm('Effacer toute la progression de ce navigateur ? Cette action est irréversible.')) resetProgress(); }}><Icon name="trash" /> Réinitialiser</button>
          </div>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setMsg(importProgress(await f.text()) ? 'Progression importée.' : 'Fichier invalide.');
            e.target.value = '';
          }} />
        </section>
      </div>
    </div>
  );
}

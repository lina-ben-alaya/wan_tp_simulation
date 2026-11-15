import { useEffect, useRef, useState } from 'react';
import { isTrustedOrigin, parseApMessage } from '../../lib/ap-bridge';
import { recordAp } from '../../lib/progress';
import Icon from '../ui/Icon';

type Status = 'checking' | 'available' | 'missing';

/**
 * Lecteur d'un export HTML5 ActivePresenter.
 * - Vérifie la présence de l'export (sinon : storyboard + statut « à produire »).
 * - Charge l'export en iframe à la demande, plein écran possible.
 * - Reçoit le score via postMessage (voir src/lib/ap-bridge.ts).
 */
export default function APPlayer({ slug, title, src, scenes, scoreSlug }: { slug: string; title: string; src: string; scenes: string[]; scoreSlug?: string }) {
  const [status, setStatus] = useState<Status>('checking');
  const [launched, setLaunched] = useState(false);
  const [result, setResult] = useState<{ score: number; max: number } | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const expected = scoreSlug ?? slug;

  useEffect(() => {
    let alive = true;
    fetch(src, { method: 'HEAD', cache: 'no-store' })
      .then((r) => alive && setStatus(r.ok ? 'available' : 'missing'))
      .catch(() => alive && setStatus('missing'));
    return () => { alive = false; };
  }, [src]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (!isTrustedOrigin(e.origin, window.location.origin)) return;
      const m = parseApMessage(e.data);
      if (!m || m.tp !== expected) return;
      setResult({ score: m.score, max: m.max });
      recordAp(slug, m.score, m.max);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [slug, expected]);

  const fullscreen = () => box.current?.requestFullscreen?.().catch(() => undefined);

  if (status === 'checking') return <p className="dim">Recherche de l’export ActivePresenter…</p>;

  if (status === 'missing') {
    return (
      <div className="stack">
        <div className="callout callout-warn">
          <Icon name="info" />
          <div>
            <strong>Simulation ActivePresenter à produire.</strong> Aucun export n’est encore déposé dans <code>public/{src.split('/').slice(-3).join('/')}</code>.
            Le storyboard ci-dessous est prêt ; en attendant, les modes Observer et Pratiquer de la plateforme couvrent les mêmes manipulations.
          </div>
        </div>
        <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 4 }}>
          {scenes.map((s) => <li key={s} className="muted">{s}</li>)}
        </ol>
      </div>
    );
  }

  return (
    <div className="stack">
      {!launched ? (
        <div className="card" style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <Icon name="play" size={28} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <strong>{title}</strong>
            <div className="dim" style={{ fontSize: '0.86rem' }}>Export HTML5 ActivePresenter · {scenes.length} scènes</div>
          </div>
          <button className="btn btn-primary" onClick={() => setLaunched(true)}>Lancer la simulation</button>
        </div>
      ) : (
        <div ref={box} style={{ position: 'relative', background: 'var(--console-bg)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <iframe ref={frame} src={src} title={title} style={{ width: '100%', aspectRatio: '16 / 9', border: 0, display: 'block', minHeight: 320 }} allow="fullscreen" />
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {launched && <button className="btn btn-ghost btn-sm" onClick={fullscreen}><Icon name="expand" /> Plein écran</button>}
        {launched && <button className="btn btn-ghost btn-sm" onClick={() => { if (frame.current) frame.current.src = src; setResult(null); }}><Icon name="restart" /> Recommencer</button>}
        <a className="btn btn-quiet btn-sm" href={src} target="_blank" rel="noopener">Ouvrir dans un onglet <Icon name="external" /></a>
        {launched && !result && <button className="btn btn-quiet btn-sm" onClick={() => { recordAp(slug, 1, 1); setResult({ score: 1, max: 1 }); }}>Marquer comme terminée</button>}
        {result && <span className="badge badge-ok" aria-live="polite">Score reçu : {result.score} / {result.max}</span>}
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../ui/Icon';
import { searchIndex, type SearchEntry } from '../../lib/search';

/** Palette de recherche globale (Ctrl+K ou bouton « Rechercher »). */
export default function SearchPalette({ indexUrl, base }: { indexUrl: string; base: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-open-search]')) setOpen(true);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 10);
    if (!index && !error) {
      fetch(indexUrl)
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then(setIndex)
        .catch(() => setError(true));
    }
  }, [open, index, error, indexUrl]);

  const results = useMemo(() => (index ? searchIndex(index, q) : []), [index, q]);
  useEffect(() => setSel(0), [q]);

  if (!open) return null;
  const go = (e: SearchEntry) => (window.location.href = base.replace(/\/$/, '') + '/' + e.href);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="modal fade-in" role="dialog" aria-modal="true" aria-label="Recherche dans les TP">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <Icon name="search" />
          <input
            ref={inputRef}
            className="input"
            style={{ border: 0, padding: '6px 0', outline: 'none' }}
            placeholder="VRF, ip helper-address, DLCI, distance administrative…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
              if (e.key === 'Enter' && results[sel]) go(results[sel]);
            }}
            aria-label="Rechercher"
            aria-controls="search-results"
          />
          <kbd>Échap</kbd>
        </div>
        <div id="search-results" role="listbox" style={{ maxHeight: '55vh', overflowY: 'auto', padding: 8 }}>
          {error && <p className="muted" style={{ padding: 12 }}>L’index de recherche n’a pas pu être chargé.</p>}
          {!error && !index && <p className="muted" style={{ padding: 12 }}>Chargement de l’index…</p>}
          {index && q && results.length === 0 && <p className="muted" style={{ padding: 12 }}>Aucun résultat pour « {q} ».</p>}
          {index && !q && <p className="dim" style={{ padding: 12, margin: 0 }}>Cherchez dans les TP, les étapes, les commandes et le glossaire.</p>}
          {results.map((r, i) => (
            <a
              key={r.href + r.title + i}
              href={base.replace(/\/$/, '') + '/' + r.href}
              role="option"
              aria-selected={i === sel}
              onMouseEnter={() => setSel(i)}
              style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '9px 12px', borderRadius: 9, textDecoration: 'none', color: 'var(--text)', background: i === sel ? 'var(--surface-2)' : 'transparent' }}
            >
              <span className="badge badge-kind" style={{ minWidth: 78, justifyContent: 'center' }}>{r.type}</span>
              <span style={{ minWidth: 0 }}>
                <span style={{ fontWeight: 600, fontFamily: r.type === 'Commande' ? 'var(--font-mono)' : undefined }}>{r.title}</span>
                <span className="dim" style={{ display: 'block', fontSize: '0.82rem' }}>{r.context}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

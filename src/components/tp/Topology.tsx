import { useId, useRef, useState } from 'react';
import type { Topology as Topo, TopoNode, TopoLink } from '../../data/types';

const TONE: Record<string, string> = {
  mpls: 'var(--t-mpls)', routage: 'var(--t-routage)', services: 'var(--t-services)', vpn: 'var(--t-vpn)',
  'frame-relay': 'var(--t-frame-relay)', neutral: 'var(--t-neutral)', ok: 'var(--t-ok)', warn: 'var(--t-warn)',
};

function Glyph({ n }: { n: TopoNode }) {
  switch (n.kind) {
    case 'router':
      return (
        <g>
          <circle className="shape" r={24} />
          <path className="glyph" d="M-11 -4h22M7 -8l4 4-4 4M11 4h-22M-7 0l-4 4 4 4" />
        </g>
      );
    case 'switch':
      return (
        <g>
          <rect className="shape" x={-28} y={-15} width={56} height={30} rx={7} />
          <path className="glyph" d="M-16 -4h26M6 -8l4 4-4 4M16 4h-26M-6 0l-4 4 4 4" />
        </g>
      );
    case 'pc':
      return (
        <g>
          <rect className="shape" x={-20} y={-18} width={40} height={28} rx={4} />
          <path className="glyph" d="M-8 16h16M0 10v6" />
        </g>
      );
    case 'server':
      return (
        <g>
          <rect className="shape" x={-16} y={-24} width={32} height={48} rx={5} />
          <path className="glyph" d="M-8 -12h16M-8 -2h16M-8 8h10" />
        </g>
      );
    case 'frswitch':
    case 'cloud':
      return (
        <g>
          <path className="shape" d="M-26 0l13-22h26l13 22-13 22h-26z" />
          <path className="glyph" d="M-12 -5h24M8 -9l4 4-4 4M12 5h-24M-8 1l-4 4 4 4" />
        </g>
      );
  }
}

function linkPath(a: TopoNode, b: TopoNode, l: TopoLink): { d: string; mx: number; my: number } {
  if (l.kind === 'tunnel') {
    const mx = (a.x + b.x) / 2;
    const my = Math.min(a.y, b.y) - 120;
    return { d: `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`, mx, my: (a.y + b.y) / 4 + my / 2 };
  }
  return { d: `M${a.x},${a.y} L${b.x},${b.y}`, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
}

export interface TopologyProps {
  topology: Topo;
  /** Nœud(s) mis en évidence (étape en cours). */
  active?: string[];
  /** Chemin animé d'un paquet (suite d'identifiants de nœuds). */
  packetPath?: string[];
  onSelect?: (id: string) => void;
  title?: string;
  showLabels?: boolean;
}

export default function Topology({ topology, active = [], packetPath, onSelect, title, showLabels = true }: TopologyProps) {
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; n: TopoNode } | null>(null);
  const byId = new Map(topology.nodes.map((n) => [n.id, n]));
  const activeSet = new Set(active);

  const showTip = (n: TopoNode) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    const scale = r.width / topology.width;
    setTip({ x: Math.min(n.x * scale + 16, r.width - 200), y: n.y * scale + 24, n });
  };

  const packetD = packetPath && packetPath.length > 1
    ? packetPath.map((pid, i) => { const n = byId.get(pid); return n ? `${i ? 'L' : 'M'}${n.x},${n.y}` : ''; }).join(' ')
    : null;

  return (
    <div ref={wrap} style={{ position: 'relative' }}>
      <svg className="topo" viewBox={`0 0 ${topology.width} ${topology.height}`} role="img" aria-labelledby={`${id}-t`}>
        <title id={`${id}-t`}>{title ?? topology.caption ?? 'Topologie du TP'}</title>
        {topology.zones?.map((z) => (
          <g key={z.label + z.x} className="zone">
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={16} fill={TONE[z.tone] ?? TONE.neutral} fillOpacity={0.07} stroke={TONE[z.tone] ?? TONE.neutral} strokeOpacity={0.6} strokeWidth={1.5} />
            <text x={z.x + 12} y={z.y + 20} fontSize={12} fontWeight={600} fill={TONE[z.tone] ?? TONE.neutral} fontFamily="var(--font-mono)">{z.label}</text>
          </g>
        ))}
        {topology.links.map((l) => {
          const a = byId.get(l.a), b = byId.get(l.b);
          if (!a || !b) return null;
          const p = linkPath(a, b, l);
          const isActive = activeSet.has(l.a) && activeSet.has(l.b);
          return (
            <g key={l.a + l.b}>
              <path d={p.d} className={`link ${l.kind ?? ''} ${isActive ? 'active' : ''}`} />
              {showLabels && l.label && <text x={p.mx} y={p.my - 6} textAnchor="middle" className="link-label">{l.label}</text>}
            </g>
          );
        })}
        {packetD && (
          <circle r={7} className="packet">
            <animateMotion dur={`${Math.max(2, packetPath!.length * 0.9)}s`} repeatCount="indefinite" path={packetD} />
          </circle>
        )}
        {topology.nodes.map((n) => (
          <g
            key={n.id}
            className={`node ${activeSet.has(n.id) ? 'active' : ''}`}
            transform={`translate(${n.x},${n.y})`}
            tabIndex={0}
            role="button"
            aria-label={`${n.label ?? n.id}${n.role ? ` (${n.role})` : ''}${n.info ? ' : ' + n.info.join(', ') : ''}`}
            onMouseEnter={() => showTip(n)}
            onMouseLeave={() => setTip(null)}
            onFocus={() => showTip(n)}
            onBlur={() => setTip(null)}
            onClick={() => onSelect?.(n.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(n.id); } }}
          >
            {activeSet.has(n.id) && <circle className="pulse" r={26} fill="none" stroke="var(--signal)" strokeWidth={2} />}
            <Glyph n={n} />
            <text y={n.kind === 'server' ? 42 : 42}>{n.label ?? n.id}</text>
            {n.role && <text className="role" y={-32}>{n.role}</text>}
          </g>
        ))}
      </svg>
      {tip && (
        <div className="topo-tip" style={{ left: tip.x, top: tip.y }} role="tooltip">
          <strong>{tip.n.label ?? tip.n.id}</strong>{tip.n.role ? ` · ${tip.n.role}` : ''}
          {tip.n.info?.map((l) => <div key={l}>{l}</div>)}
        </div>
      )}
      {topology.caption && <p className="dim" style={{ fontSize: '0.8rem', margin: '6px 0 0', textAlign: 'center' }}>{topology.caption}</p>}
    </div>
  );
}

import type { Topology } from '../types';

/** Topologie commune aux TP MPLS (TP1 parties I et II, TP2 VPN MPLS) – d'après le schéma de l'énoncé. */
export const mplsTopology: Topology = {
  width: 800,
  height: 440,
  caption: 'Topologie des TP MPLS – routeurs Cisco 7200 sous GNS3',
  zones: [
    { label: 'Backbone MPLS – OSPF Area 0', x: 150, y: 24, w: 500, h: 210, tone: 'mpls' },
    { label: 'Client – EIGRP AS 100', x: 16, y: 252, w: 768, h: 176, tone: 'neutral' },
  ],
  nodes: [
    { id: 'SP1', kind: 'router', x: 230, y: 175, role: 'PE', info: ['Loopback0 : 1.1.1.1/25', 's1/1 → SIEGE : 192.168.12.0/24', 's1/2 → SP2 : 192.168.23.0/24'] },
    { id: 'SP2', kind: 'router', x: 400, y: 80, role: 'P', info: ['Loopback0 : 2.2.2.2/25', 's1/2 → SP1 : 192.168.23.0/24', 's1/3 → SP3 : 192.168.34.0/24'] },
    { id: 'SP3', kind: 'router', x: 570, y: 175, role: 'PE', info: ['Loopback0 : 3.3.3.3/25', 's1/3 → SP2 : 192.168.34.0/24', 's1/1 → AGENCE : 192.168.45.0/24'] },
    { id: 'SIEGE', kind: 'router', x: 230, y: 330, role: 'CE', info: ['s1/1 : 192.168.12.2/24', 'f0/0 : LAN SIEGE 10.10.10.0/24'] },
    { id: 'AGENCE', kind: 'router', x: 570, y: 330, role: 'CE', info: ['s1/1 : 192.168.45.2/24', 'f0/0 : LAN AGENCE 192.168.1.0/24'] },
    { id: 'SW1', label: 'LAN SIEGE', kind: 'switch', x: 80, y: 385, info: ['10.10.10.0/24'] },
    { id: 'SW2', label: 'LAN AGENCE', kind: 'switch', x: 720, y: 385, info: ['192.168.1.0/24'] },
  ],
  links: [
    { a: 'SIEGE', b: 'SP1', label: '192.168.12.0/24', kind: 'serial' },
    { a: 'SP1', b: 'SP2', label: '192.168.23.0/24', kind: 'serial' },
    { a: 'SP2', b: 'SP3', label: '192.168.34.0/24', kind: 'serial' },
    { a: 'SP3', b: 'AGENCE', label: '192.168.45.0/24', kind: 'serial' },
    { a: 'SW1', b: 'SIEGE', label: 'f0/0', kind: 'ethernet' },
    { a: 'AGENCE', b: 'SW2', label: 'f0/0', kind: 'ethernet' },
  ],
};

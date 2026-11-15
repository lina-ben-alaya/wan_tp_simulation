import type { Tp, ThemeId, SubjectId } from './types';
import mplsP1 from './tps/mpls-backbone-p1';
import mplsP2 from './tps/mpls-backbone-p2';
import vpnMpls from './tps/vpn-mpls';
import bgp from './tps/bgp';
import redistribution from './tps/redistribution';
import nat from './tps/nat-pat-dhcp';
import ipsec from './tps/vpn-ipsec';
import gre from './tps/gre-ipsec';
import frBase from './tps/frame-relay-base';
import frAvance from './tps/frame-relay-avance';

export const TPS: Tp[] = [mplsP1, mplsP2, vpnMpls, bgp, redistribution, nat, ipsec, gre, frBase, frAvance].sort(
  (a, b) => a.order - b.order,
);

export const getTp = (slug: string) => TPS.find((t) => t.slug === slug);
export const tpsByTheme = (theme: ThemeId) => TPS.filter((t) => t.theme === theme);
export const tpsBySubject = (subject: SubjectId) => TPS.filter((t) => t.subject === subject);

/** Parcours narratif « Opérateur » : le fil rouge qui relie les TP. */
export const OPERATOR_PATH: { chapter: string; story: string; slugs: string[] }[] = [
  { chapter: '1. Construire le backbone', story: 'Vous êtes ingénieur chez un ISP : vous montez le cœur de réseau OSPF puis MPLS.', slugs: ['mpls-backbone-p1', 'mpls-backbone-p2'] },
  { chapter: '2. Vendre un VPN au client', story: 'Le Client A s’abonne : ses deux sites communiquent dans une VRF isolée.', slugs: ['vpn-mpls'] },
  { chapter: '3. S’interconnecter à Internet', story: 'Votre réseau échange des routes avec les autres opérateurs et entre domaines.', slugs: ['bgp', 'redistribution'] },
  { chapter: '4. Adresser et publier', story: 'L’entreprise cliente reçoit ses adresses, publie ses serveurs et partage ses IP publiques.', slugs: ['nat-pat-dhcp'] },
  { chapter: '5. Sécuriser les échanges', story: 'Les sites communiquent à travers un réseau public, en chiffré.', slugs: ['vpn-ipsec', 'gre-ipsec'] },
  { chapter: '6. Maintenir l’accès WAN historique', story: 'Les agences encore en Frame Relay doivent survivre à une panne.', slugs: ['frame-relay-base', 'frame-relay-avance'] },
];

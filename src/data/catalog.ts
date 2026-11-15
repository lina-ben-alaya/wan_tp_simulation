import type { ModeId, SubjectId, ThemeId, Fidelity, SimId } from './types';

/** Auteur·e du projet, affiché dans le pied de page, l'accueil et la page À propos. */
export const AUTHOR = 'LINA BEN ALAYA';

export const SUBJECTS: Record<SubjectId, { label: string; short: string; description: string }> = {
  'tech-wan': {
    label: 'Atelier Technologies WAN',
    short: 'Tech. WAN',
    description: "Réseaux d'opérateur et interconnexion de sites : MPLS, VPN MPLS, NAT/DHCP, VPN IPsec, GRE, Frame Relay.",
  },
  routage: {
    label: 'Routage & Commutation',
    short: 'Routage',
    description: 'Protocoles de routage inter-domaines : BGP, redistribution OSPF / EIGRP / RIPv2, distance administrative.',
  },
};

export const THEMES: Record<ThemeId, { label: string; description: string }> = {
  mpls: { label: 'Cœur MPLS', description: 'Backbone opérateur, LDP, VRF et MP-BGP.' },
  routage: { label: 'Routage inter-domaines', description: 'eBGP entre opérateurs et redistribution entre IGP.' },
  services: { label: 'Adressage & services', description: 'DHCP, relais DHCP, NAT statique, dynamique et PAT.' },
  vpn: { label: 'VPN & sécurité', description: 'IPsec site à site, tunnels GRE chiffrés.' },
  'frame-relay': { label: 'Accès WAN Frame Relay', description: 'PVC, DLCI, LMI, Inverse ARP, hub & spoke.' },
};

export const MODES: { id: ModeId; label: string; verb: string; description: string }[] = [
  { id: 'learn', label: 'Apprendre', verb: 'Comprendre', description: 'Théorie illustrée, topologie, définitions et simulateurs.' },
  { id: 'observe', label: 'Observer', verb: 'Regarder', description: 'Démonstration animée et commentée des manipulations.' },
  { id: 'practice', label: 'Pratiquer', verb: 'Faire', description: 'Vous saisissez les commandes, l’assistant vous guide.' },
  { id: 'evaluate', label: 'Évaluer', verb: 'Se tester', description: 'Questions du TP et questions de notions, score final.' },
  { id: 'correct', label: 'Corriger', verb: 'Comprendre ses erreurs', description: 'Réponses justifiées, comparaisons et bilan.' },
];

export const FIDELITY: Record<Fidelity, { label: string; description: string }> = {
  reel: { label: 'Capture réelle', description: 'Issu d’une exécution réelle (GNS3, Packet Tracer ou compte rendu).' },
  enonce: { label: 'Extrait de l’énoncé', description: 'Reproduit tel quel depuis le document du TP.' },
  reconstitue: { label: 'Reconstitué', description: 'Résultat attendu, reconstitué à partir de l’énoncé et de la théorie. Aucun routeur n’a été exécuté.' },
  illustratif: { label: 'Illustratif', description: 'Valeurs d’exemple (ex. numéros de labels) : elles varient d’une exécution réelle à l’autre.' },
};

/** Types d'activités, affichés en badge pour distinguer clairement simulé et réel. */
export const ACTIVITY_KINDS = {
  guide: { label: 'GUIDÉ', description: 'Saisie de commandes comparée à des réponses attendues ; la sortie est préparée à l’avance. Aucun équipement n’exécute la commande.' },
  demo: { label: 'DÉMO', description: 'Démonstration animée et commentée, sans saisie.' },
  calcule: { label: 'CALCULÉ', description: 'Un modèle JavaScript calcule le résultat selon la règle enseignée. Ce n’est pas Cisco IOS.' },
  reel: { label: 'RÉEL', description: 'Labo à exécuter sur votre poste (GNS3 / Packet Tracer). Seul ce mode exécute de vraies commandes.' },
} as const;

export const SIMS: Record<SimId, { title: string; description: string }> = {
  'packet-mpls': { title: 'Voyage d’un paquet dans le VPN MPLS', description: 'Push, swap et pop des labels de transport et de VPN, saut par saut.' },
  'packet-gre-ipsec': { title: 'Encapsulation GRE over IPsec', description: 'Du paquet IP d’origine au paquet ESP chiffré qui traverse le WAN.' },
  'packet-ipsec': { title: 'Encapsulation IPsec (ESP)', description: 'Ce qui est visible et ce qui est chiffré sur le lien WAN.' },
  nat: { title: 'Simulateur NAT / PAT', description: 'Table de traductions en direct : statique, pool dynamique, surcharge.' },
  'route-target': { title: 'Labo Route Target', description: 'Une route VPNv4 est-elle importée dans la VRF ? Testez RD et RT.' },
  'admin-distance': { title: 'Choix de route & distance administrative', description: 'Modifiez les distances et observez la route retenue par R3.' },
  'fr-failover': { title: 'Panne Frame Relay : avant / après sous-interfaces', description: 'Coupez le lien et observez le trou noir… puis la solution.' },
  'inverse-arp': { title: 'Inverse ARP pas à pas', description: 'Comment un routeur associe un DLCI local à l’adresse IP distante.' },
  'label-table': { title: 'Tables LIB / LFIB', description: 'Complétez les labels du préfixe 1.1.1.0/25 sur chaque routeur.' },
};

export const LEVELS = { 1: 'Fondamental', 2: 'Intermédiaire', 3: 'Avancé' } as const;

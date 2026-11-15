/**
 * Modèles des simulateurs « CALCULÉ ». Ils appliquent les règles enseignées dans les TP ;
 * ce ne sont pas des émulateurs Cisco IOS. Fonctions pures, testées dans tests/unit/sims.test.ts.
 */

/* ===================== NAT / PAT (TP NAT-PAT-DHCP) ===================== */

export type NatMode = 'pool' | 'pat';

export interface NatEntry {
  proto: 'icmp' | '---';
  insideLocal: string;
  insideGlobal: string;
  kind: 'static' | 'dynamic' | 'pat';
}

export interface NatState {
  mode: NatMode;
  entries: NatEntry[];
  nextPort: number;
}

export const NAT_STATIC: NatEntry = { proto: '---', insideLocal: '192.168.20.2', insideGlobal: '77.77.77.77', kind: 'static' };
export const NAT_POOL = ['209.165.200.241', '209.165.200.242', '209.165.200.243', '209.165.200.244', '209.165.200.245', '209.165.200.246'];
export const NAT_PAT_ADDRESS = '209.165.200.225';
/** Réseaux autorisés par l'ACL étendue NAT de l'énoncé. */
export const NAT_ACL = ['192.168.10.', '192.168.11.', '192.168.30.'];

export const natInitial = (mode: NatMode): NatState => ({ mode, entries: [NAT_STATIC], nextPort: 1024 });

export type NatOutcome =
  | { ok: true; entry: NatEntry; reused: boolean }
  | { ok: false; reason: 'acl' | 'pool-exhausted' };

/** Un hôte interne envoie un ping vers l'extérieur. */
export function natTranslate(state: NatState, host: string): { state: NatState; outcome: NatOutcome } {
  if (host === NAT_STATIC.insideLocal) return { state, outcome: { ok: true, entry: NAT_STATIC, reused: true } };
  if (!NAT_ACL.some((p) => host.startsWith(p))) return { state, outcome: { ok: false, reason: 'acl' } };

  if (state.mode === 'pool') {
    const existing = state.entries.find((e) => e.kind === 'dynamic' && e.insideLocal === host);
    if (existing) return { state, outcome: { ok: true, entry: existing, reused: true } };
    const used = new Set(state.entries.filter((e) => e.kind === 'dynamic').map((e) => e.insideGlobal));
    const free = NAT_POOL.find((a) => !used.has(a));
    if (!free) return { state, outcome: { ok: false, reason: 'pool-exhausted' } };
    const entry: NatEntry = { proto: '---', insideLocal: host, insideGlobal: free, kind: 'dynamic' };
    return { state: { ...state, entries: [...state.entries, entry] }, outcome: { ok: true, entry, reused: false } };
  }

  // PAT : chaque flux reçoit un port distinct sur l'adresse de S0/1/0.
  const port = state.nextPort;
  const entry: NatEntry = { proto: 'icmp', insideLocal: `${host}:${port - 1023}`, insideGlobal: `${NAT_PAT_ADDRESS}:${port}`, kind: 'pat' };
  return { state: { ...state, entries: [...state.entries, entry], nextPort: port + 1 }, outcome: { ok: true, entry, reused: false } };
}

/** clear ip nat translation * : supprime les traductions dynamiques (la statique reste). */
export const natClear = (state: NatState): NatState => ({ ...state, entries: [NAT_STATIC], nextPort: 1024 });

/* ===================== Route Target (TP VPN MPLS) ===================== */

export const RT_RE = /^\d{1,10}:\d{1,10}$/;

/** Une route VPNv4 est importée si l'un de ses RT figure parmi les RT d'import de la VRF. Le RD n'intervient pas. */
export function rtImported(routeRts: string[], vrfImportRts: string[]): boolean {
  const imp = new Set(vrfImportRts.map((r) => r.trim()));
  return routeRts.some((r) => imp.has(r.trim()));
}

/* ===================== Distance administrative (TP Redistribution) ===================== */

export interface RouteCandidate {
  id: string;
  label: string;
  protocol: string;
  ad: number;
  metric: number;
  domains: number;
}

/** Sélection de la meilleure route : plus petite distance administrative, puis plus petite métrique. */
export function bestRoute(cands: RouteCandidate[]): RouteCandidate | undefined {
  return [...cands].sort((a, b) => a.ad - b.ad || a.metric - b.metric)[0];
}

/* ===================== Panne Frame Relay (TP FR avancé) ===================== */

export interface FrScenario {
  part: 1 | 2;
  agence1Down: boolean;
}

export interface FrResult {
  hubPhysical: 'up' | 'down';
  hubSub16?: 'up' | 'down';
  agence1RouteToHub: 'Frame Relay' | 'PPP (route flottante DA 50)' | 'PPP (RIP)';
  hubRouteToAgence1: 'Frame Relay' | 'PPP';
  pingC2toC1: boolean;
  explanation: string;
}

export function frSimulate({ part, agence1Down }: FrScenario): FrResult {
  if (!agence1Down) {
    return {
      hubPhysical: 'up',
      hubSub16: part === 2 ? 'up' : undefined,
      agence1RouteToHub: 'Frame Relay',
      hubRouteToAgence1: 'Frame Relay',
      pingC2toC1: true,
      explanation: 'Situation normale : le trafic passe par le PVC DLCI 16 ; le lien PPP reste en secours.',
    };
  }
  if (part === 1) {
    return {
      hubPhysical: 'up',
      agence1RouteToHub: 'PPP (route flottante DA 50)',
      hubRouteToAgence1: 'Frame Relay',
      pingC2toC1: false,
      explanation:
        "Agence1 a basculé sur PPP. Mais s0/1 de SiteCentral reste up (le PVC vers Agence2 est actif) : sa route vers 192.168.2.0/24 via Frame Relay reste en place et les paquets partent vers un PVC inactif. Trou noir : C2 → C1 échoue.",
    };
  }
  return {
    hubPhysical: 'up',
    hubSub16: 'down',
    agence1RouteToHub: 'PPP (RIP)',
    hubRouteToAgence1: 'PPP',
    pingC2toC1: true,
    explanation:
      "La sous-interface s0/1.16 suit l'état de son PVC et passe down. La route RIP via 192.168.0.2 disparaît ; RIP apprend 192.168.2.0/24 via le lien PPP. C2 → C1 réussit.",
  };
}

/* ===================== Tables de labels (TP1 partie II) ===================== */

/** Structure générale pour 1.1.1.0/25 (numéros illustratifs : SP2 = 16, SP3 = 17). */
export const LABEL_EXERCISE = [
  { router: 'SP1', field: 'local', answer: 'imp-null', why: 'Le préfixe est directement connecté à SP1 : il annonce implicit-null.' },
  { router: 'SP2', field: 'local', answer: '16', why: 'Label choisi par SP2 (valeur illustrative).' },
  { router: 'SP2', field: 'outgoing', answer: 'pop', why: 'SP1 a annoncé implicit-null : SP2 retire le label (PHP).' },
  { router: 'SP3', field: 'local', answer: '17', why: 'Label choisi par SP3 (valeur illustrative).' },
  { router: 'SP3', field: 'outgoing', answer: '16', why: 'SP3 utilise le label annoncé par son prochain saut, SP2.' },
] as const;

export function checkLabel(answer: string, expected: string): boolean {
  const a = answer.trim().toLowerCase().replace(/\s+/g, '');
  if (expected === 'imp-null') return ['imp-null', 'implicit-null', 'impnull', '3'].includes(a);
  if (expected === 'pop') return ['pop', 'poplabel', 'pop-label', 'imp-null'].includes(a);
  return a === expected;
}

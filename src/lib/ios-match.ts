/**
 * Validation pédagogique d'une commande Cisco IOS saisie par l'apprenant.
 *
 * Ce n'est PAS un interpréteur IOS : on compare la saisie à une commande attendue,
 * en tolérant ce qu'IOS tolère couramment (abréviations de mots-clés, noms d'interfaces
 * abrégés, casse des mots-clés, espaces multiples).
 *
 * Règles :
 * - mot-clé (minuscules) : la saisie peut en être un préfixe (« conf t », « sh ip ro ») ;
 * - interface (serial1/1, Loopback0, fa0/0, s0/1.16, tunnel0) : type abrégeable, numéros exacts ;
 * - valeur (adresse, nom, clé, nombre) : saisie exacte (les noms sont sensibles à la casse) ;
 * - jeton « {n} » dans une variante : n'importe quel entier.
 */

const IFACE_TYPES = ['fastethernet', 'gigabitethernet', 'ethernet', 'serial', 'loopback', 'tunnel'];

/** Mots-clés suivis d'une valeur libre (nom, clé…) qui ne doit pas être abrégée. */
const VALUE_AFTER = new Set(['key', 'transform-set', 'vrf', 'pool', 'description', 'peer', 'list', 'extended', 'hostname']);

/** Mots-clés qui peuvent suivre un mot de VALUE_AFTER (ex. « ip vrf forwarding »). */
const ALWAYS_KEYWORD = new Set(['forwarding', 'interface']);

const IFACE_RE = /^([a-z]+)(\d+(?:\/\d+)*(?:\.\d+)?)$/i;

export function normalize(cmd: string): string {
  return cmd.trim().replace(/\s+/g, ' ');
}

function fullIfaceType(letters: string): string | undefined {
  const l = letters.toLowerCase();
  // Abréviations usuelles : s, se, fa, f, lo, gi, g, e, tu…
  if (l === 'f' || l === 'fa') return 'fastethernet';
  if (l === 'g' || l === 'gi') return 'gigabitethernet';
  return IFACE_TYPES.find((t) => t.startsWith(l));
}

function ifaceMatch(input: string, canonical: string): boolean | null {
  const c = IFACE_RE.exec(canonical);
  if (!c) return null;
  const cType = fullIfaceType(c[1]);
  if (!cType) return null; // ce n'est pas une interface (ex. « R1Fa0/0 » ou mot-clé)
  const i = IFACE_RE.exec(input);
  if (!i) return false;
  const iType = fullIfaceType(i[1]);
  return iType === cType && i[2] === c[2];
}

function isKeyword(tok: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(tok) && !/^\d/.test(tok);
}

export function tokenMatch(input: string, canonical: string, valueContext = false): boolean {
  if (canonical === '{n}') return /^\d+$/.test(input);
  const iface = ifaceMatch(input, canonical);
  if (iface !== null) return iface;
  if (!valueContext && isKeyword(canonical)) {
    const lower = input.toLowerCase();
    return lower.length >= 1 && canonical.startsWith(lower);
  }
  return input === canonical;
}

export interface MatchResult {
  ok: boolean;
  /** Index (0-based) du premier mot incorrect, ou -1 si le nombre de mots diffère. */
  badToken?: number;
  /** Variante retenue (commande canonique ou alternative). */
  matched?: string;
}

function matchOne(input: string, canonical: string): MatchResult {
  const it = normalize(input).split(' ');
  const ct = normalize(canonical).split(' ');
  for (let k = 0; k < Math.min(it.length, ct.length); k++) {
    const valueContext = k > 0 && VALUE_AFTER.has(ct[k - 1].toLowerCase()) && !ALWAYS_KEYWORD.has(ct[k]);
    if (!tokenMatch(it[k], ct[k], valueContext)) return { ok: false, badToken: k };
  }
  if (it.length !== ct.length) return { ok: false, badToken: Math.min(it.length, ct.length) };
  return { ok: true, matched: canonical };
}

/** Compare la saisie à la commande attendue et à ses variantes. */
export function matchCommand(input: string, canonical: string, alt: string[] = []): MatchResult {
  if (!normalize(input)) return { ok: false, badToken: 0 };
  let best: MatchResult = { ok: false, badToken: 0 };
  for (const c of [canonical, ...alt]) {
    const r = matchOne(input, c);
    if (r.ok) return r;
    if ((r.badToken ?? 0) > (best.badToken ?? 0)) best = r;
  }
  return best;
}

/** Début de commande révélé par l'assistant (indice de niveau 2). */
export function revealPrefix(canonical: string, words = 2): string {
  return normalize(canonical).split(' ').slice(0, words).join(' ') + ' …';
}

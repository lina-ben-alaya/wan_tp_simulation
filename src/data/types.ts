/**
 * Modèle de contenu d'IT LAB.
 * Chaque TP est un module TypeScript typé, validé au test (tests/unit/content.test.ts)
 * par les schémas Zod de ./schema.ts.
 */

export type SubjectId = 'tech-wan' | 'routage';
export type ThemeId = 'mpls' | 'routage' | 'services' | 'vpn' | 'frame-relay';
export type ModeId = 'learn' | 'observe' | 'practice' | 'evaluate' | 'correct';

/**
 * Fidélité d'un contenu affiché :
 * - reel        : issu d'une capture réelle (GNS3 / Packet Tracer / compte rendu)
 * - enonce      : reproduit tel quel depuis l'énoncé du TP
 * - reconstitue : résultat attendu, reconstitué à partir de l'énoncé et de la théorie
 * - illustratif : valeurs d'exemple (ex. numéros de labels), à ne pas prendre pour des mesures
 */
export type Fidelity = 'reel' | 'enonce' | 'reconstitue' | 'illustratif';

export type SimId =
  | 'packet-mpls'
  | 'packet-gre-ipsec'
  | 'packet-ipsec'
  | 'nat'
  | 'route-target'
  | 'admin-distance'
  | 'fr-failover'
  | 'inverse-arp'
  | 'label-table';

export type NodeKind = 'router' | 'switch' | 'pc' | 'server' | 'frswitch' | 'cloud';

export interface TopoNode {
  id: string;
  label?: string;
  kind: NodeKind;
  x: number;
  y: number;
  /** Rôle pédagogique : CE, PE, P, ISP, Hub, Spoke… */
  role?: string;
  /** Lignes affichées au survol (interfaces, adresses). */
  info?: string[];
}

export interface TopoLink {
  a: string;
  b: string;
  label?: string;
  kind?: 'serial' | 'ethernet' | 'tunnel' | 'virtual';
}

export interface TopoZone {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tone: ThemeId | 'neutral' | 'ok' | 'warn';
}

export interface Topology {
  width: number;
  height: number;
  nodes: TopoNode[];
  links: TopoLink[];
  zones?: TopoZone[];
  caption?: string;
}

export interface LearnSection {
  title: string;
  body: string[];
  points?: string[];
  code?: string;
  callout?: { tone: 'info' | 'warn' | 'tip'; text: string };
}

export interface Command {
  /** Invite IOS affichée, ex. "SP1(config)#" */
  prompt: string;
  /** Commande canonique (forme complète). Les abréviations IOS sont acceptées. */
  cmd: string;
  /** Variantes acceptées supplémentaires (forme complète). */
  alt?: string[];
}

export interface Step {
  id: string;
  device: string;
  title: string;
  goal: string;
  commands: Command[];
  /** Sortie console affichée après la dernière commande. */
  output?: string;
  outputFidelity?: Fidelity;
  explain: string;
  hint: string;
}

interface QuestionBase {
  id: string;
  prompt: string;
  explain: string;
  /** Notions évaluées : servent au repérage des points faibles. */
  tags: string[];
  /** 'enonce' = question posée dans le TP ; 'derive' = question ajoutée à partir des notions du TP. */
  source: 'enonce' | 'derive';
}

export interface SingleQuestion extends QuestionBase {
  kind: 'single';
  options: string[];
  answer: number;
}
export interface MultiQuestion extends QuestionBase {
  kind: 'multi';
  options: string[];
  answers: number[];
}
export interface InputQuestion extends QuestionBase {
  kind: 'input';
  /** Réponses acceptées (comparaison insensible à la casse et aux espaces). */
  accept: string[];
  placeholder?: string;
}
export interface OrderQuestion extends QuestionBase {
  kind: 'order';
  /** Éléments dans l'ordre correct ; ils sont mélangés à l'affichage. */
  items: string[];
}
export type Question = SingleQuestion | MultiQuestion | InputQuestion | OrderQuestion;

export interface CompareCase {
  id: string;
  title: string;
  context: string;
  wrong: { config: string; result: string };
  right: { config: string; result: string };
  lesson: string;
  /** Version « défi » : symptôme + choix de la correction. */
  challenge: { symptom: string; options: string[]; answer: number };
}

export interface Tp {
  slug: string;
  order: number;
  code: string;
  title: string;
  subtitle: string;
  subject: SubjectId;
  theme: ThemeId;
  level: 1 | 2 | 3;
  /** minutes */
  duration: number;
  tools: string[];
  equipment: string[];
  fidelity: Fidelity;
  summary: string;
  scenario: string;
  objectives: string[];
  prerequisites: string[];
  topology: Topology;
  learn: LearnSection[];
  steps: Step[];
  quiz: Question[];
  compare: CompareCase[];
  sims: SimId[];
  /**
   * Simulation ActivePresenter : chemin local (« sims/… », dans public/) ou adresse https
   * d'un export publié ailleurs. `author` est affiché quand la simulation n'est pas de l'auteur du site.
   */
  ap: { file: string; scenes: string[]; author?: string };
  sources: { label: string; file: string }[];
  /** Anomalies relevées dans l'énoncé et leur traitement. */
  notes: string[];
  glossary: string[];
}

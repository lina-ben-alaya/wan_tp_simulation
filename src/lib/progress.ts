import type { ModeId } from '../data/types';

/**
 * Progression stockée localement dans le navigateur (aucun compte, aucun serveur).
 * Si localStorage est indisponible (navigation privée stricte…), la progression
 * reste en mémoire pour la session et `isPersistent()` renvoie false.
 */

export interface TpProgress {
  modes: Partial<Record<ModeId, boolean>>;
  practice?: { score: number; max: number; mistakes: Record<string, number>; at: number };
  quiz?: { score: number; max: number; answers: Record<string, unknown>; correct: Record<string, boolean>; at: number };
  ap?: { score: number; max: number; at: number };
  timeMs: number;
  lastVisit?: number;
}

export interface Progress {
  version: 1;
  tps: Record<string, TpProgress>;
  challenge: { best: number; played: number; history: { at: number; score: number; max: number }[] };
  /** Activité par jour (AAAA-MM-JJ → nombre d'actions). */
  activity: Record<string, number>;
  learnerName?: string;
}

export const STORAGE_KEY = 'itlab:progress:v1';
export const MODE_COUNT = 5;

export const emptyProgress = (): Progress => ({
  version: 1,
  tps: {},
  challenge: { best: 0, played: 0, history: [] },
  activity: {},
});

let memory: Progress = emptyProgress();
let persistent = true;
let loaded = false;
const listeners = new Set<() => void>();

function storage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    const s = window.localStorage;
    const probe = '__itlab_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

/** Valide et migre un objet inconnu en Progress. */
export function parseProgress(raw: unknown): Progress {
  const base = emptyProgress();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<Progress>;
  if (r.version !== 1) return base;
  return {
    version: 1,
    tps: typeof r.tps === 'object' && r.tps ? r.tps : {},
    challenge: r.challenge && Array.isArray(r.challenge.history) ? r.challenge : base.challenge,
    activity: typeof r.activity === 'object' && r.activity ? r.activity : {},
    learnerName: typeof r.learnerName === 'string' ? r.learnerName : undefined,
  };
}

function load() {
  if (loaded) return;
  loaded = true;
  const s = storage();
  if (!s) {
    persistent = false;
    return;
  }
  try {
    const txt = s.getItem(STORAGE_KEY);
    memory = txt ? parseProgress(JSON.parse(txt)) : emptyProgress();
  } catch {
    memory = emptyProgress();
  }
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      try {
        memory = parseProgress(e.newValue ? JSON.parse(e.newValue) : null);
      } catch {
        memory = emptyProgress();
      }
      listeners.forEach((l) => l());
    }
  });
}

function save() {
  const s = storage();
  if (s) {
    try {
      s.setItem(STORAGE_KEY, JSON.stringify(memory));
    } catch {
      persistent = false;
    }
  } else persistent = false;
  listeners.forEach((l) => l());
}

export function getProgress(): Progress {
  load();
  return memory;
}

export function isPersistent() {
  load();
  return persistent;
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const today = () => new Date().toISOString().slice(0, 10);

export function update(mutator: (p: Progress) => void) {
  load();
  const next: Progress = structuredClone(memory);
  mutator(next);
  next.activity[today()] = (next.activity[today()] ?? 0) + 1;
  memory = next;
  save();
}

export function tpOf(p: Progress, slug: string): TpProgress {
  return p.tps[slug] ?? { modes: {}, timeMs: 0 };
}

export function markMode(slug: string, mode: ModeId) {
  update((p) => {
    const t = tpOf(p, slug);
    t.modes = { ...t.modes, [mode]: true };
    t.lastVisit = Date.now();
    p.tps[slug] = t;
  });
}

export function recordPractice(slug: string, score: number, max: number, mistakes: Record<string, number>) {
  update((p) => {
    const t = tpOf(p, slug);
    t.practice = { score, max, mistakes, at: Date.now() };
    t.modes = { ...t.modes, practice: true };
    p.tps[slug] = t;
  });
}

export function recordQuiz(slug: string, score: number, max: number, answers: Record<string, unknown>, correct: Record<string, boolean>) {
  update((p) => {
    const t = tpOf(p, slug);
    t.quiz = { score, max, answers, correct, at: Date.now() };
    t.modes = { ...t.modes, evaluate: true };
    p.tps[slug] = t;
  });
}

export function recordAp(slug: string, score: number, max: number) {
  update((p) => {
    const t = tpOf(p, slug);
    t.ap = { score, max, at: Date.now() };
    p.tps[slug] = t;
  });
}

export function addTime(slug: string, ms: number) {
  if (ms < 1000) return;
  load();
  const t = tpOf(memory, slug);
  memory = { ...memory, tps: { ...memory.tps, [slug]: { ...t, timeMs: t.timeMs + Math.min(ms, 30 * 60_000) } } };
  save();
}

export function recordChallenge(score: number, max: number) {
  update((p) => {
    p.challenge.played += 1;
    p.challenge.best = Math.max(p.challenge.best, Math.round((score / max) * 100));
    p.challenge.history = [...p.challenge.history, { at: Date.now(), score, max }].slice(-20);
  });
}

export function setLearnerName(name: string) {
  update((p) => {
    p.learnerName = name.slice(0, 80);
  });
}

export function resetProgress() {
  load();
  memory = emptyProgress();
  save();
}

export function importProgress(json: string): boolean {
  try {
    const parsed = parseProgress(JSON.parse(json));
    load();
    memory = parsed;
    save();
    return true;
  } catch {
    return false;
  }
}

/* ---------- Calculs dérivés (purs, testés) ---------- */

/** Pourcentage d'avancement d'un TP : modes terminés / 5. */
export function tpCompletion(t: TpProgress | undefined): number {
  if (!t) return 0;
  const done = Object.values(t.modes).filter(Boolean).length;
  return Math.round((Math.min(done, MODE_COUNT) / MODE_COUNT) * 100);
}

export function overallCompletion(p: Progress, slugs: string[]): number {
  if (!slugs.length) return 0;
  return Math.round(slugs.reduce((s, slug) => s + tpCompletion(p.tps[slug]), 0) / slugs.length);
}

export function averageQuiz(p: Progress): number | null {
  const qs = Object.values(p.tps).map((t) => t.quiz).filter((q): q is NonNullable<TpProgress['quiz']> => !!q && q.max > 0);
  if (!qs.length) return null;
  return Math.round((qs.reduce((s, q) => s + q.score / q.max, 0) / qs.length) * 100);
}

export function totalTimeMs(p: Progress): number {
  return Object.values(p.tps).reduce((s, t) => s + (t.timeMs ?? 0), 0);
}

/**
 * Points faibles : notions (tags) des questions ratées, triées par nombre d'erreurs.
 * `tagsOf(slug, questionId)` fournit les tags d'une question.
 */
export function weakTags(p: Progress, tagsOf: (slug: string, qid: string) => string[]): { tag: string; errors: number; slugs: string[] }[] {
  const acc = new Map<string, { errors: number; slugs: Set<string> }>();
  for (const [slug, t] of Object.entries(p.tps)) {
    for (const [qid, ok] of Object.entries(t.quiz?.correct ?? {})) {
      if (ok) continue;
      for (const tag of tagsOf(slug, qid)) {
        const e = acc.get(tag) ?? { errors: 0, slugs: new Set<string>() };
        e.errors += 1;
        e.slugs.add(slug);
        acc.set(tag, e);
      }
    }
  }
  return [...acc.entries()]
    .map(([tag, e]) => ({ tag, errors: e.errors, slugs: [...e.slugs] }))
    .sort((a, b) => b.errors - a.errors);
}

/** Attestation : tous les TP évalués avec au moins `ratio` de bonnes réponses. */
export function certificateEligible(p: Progress, slugs: string[], ratio = 0.6): boolean {
  return slugs.every((s) => {
    const q = p.tps[s]?.quiz;
    return !!q && q.max > 0 && q.score / q.max >= ratio;
  });
}

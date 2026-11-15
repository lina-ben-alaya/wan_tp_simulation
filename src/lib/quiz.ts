import type { Question } from '../data/types';

export type Answer = number | number[] | string | string[] | undefined;

const norm = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();

/** Corrige une réponse. Retourne true si elle est juste. */
export function gradeQuestion(q: Question, a: Answer): boolean {
  switch (q.kind) {
    case 'single':
      return a === q.answer;
    case 'multi': {
      if (!Array.isArray(a)) return false;
      const s = new Set(a as number[]);
      return s.size === q.answers.length && q.answers.every((x) => s.has(x));
    }
    case 'input':
      return typeof a === 'string' && q.accept.some((acc) => norm(acc) === norm(a));
    case 'order':
      return Array.isArray(a) && a.length === q.items.length && q.items.every((it, i) => a[i] === it);
  }
}

/** Texte de la bonne réponse, pour le mode Corriger. */
export function correctAnswerText(q: Question): string {
  switch (q.kind) {
    case 'single':
      return q.options[q.answer];
    case 'multi':
      return q.answers.map((i) => q.options[i]).join(' · ');
    case 'input':
      return q.accept[0];
    case 'order':
      return q.items.map((it, i) => `${i + 1}. ${it}`).join('\n');
  }
}

/** Texte de la réponse de l'apprenant. */
export function answerText(q: Question, a: Answer): string {
  if (a === undefined || (Array.isArray(a) && a.length === 0) || a === '') return '(sans réponse)';
  switch (q.kind) {
    case 'single':
      return typeof a === 'number' ? q.options[a] ?? '?' : '?';
    case 'multi':
      return Array.isArray(a) ? (a as number[]).map((i) => q.options[i]).join(' · ') : '?';
    case 'input':
      return String(a);
    case 'order':
      return Array.isArray(a) ? (a as string[]).map((it, i) => `${i + 1}. ${it}`).join('\n') : '?';
  }
}

/** Mélange déterministe (graine) pour l'ordre des éléments : stable entre deux rendus. */
export function seededShuffle<T>(arr: T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  // Évite de présenter l'ordre déjà correct.
  if (out.every((x, i) => x === arr[i]) && out.length > 1) out.push(out.shift()!);
  return out;
}

export const PASS_RATIO = 0.6;

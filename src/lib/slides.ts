import type { Tp } from '../data/types';

/**
 * Plan des diapositives d'une simulation IT LAB (format « diaporama interactif »
 * inspiré des simulations logicielles) : introduction, objectifs, topologie,
 * puis pour chaque étape une diapo de contexte, une diapo par commande à saisir
 * et une diapo de résultat ; ensuite les questions et le bilan.
 */
export type Slide =
  | { kind: 'intro' }
  | { kind: 'objectives' }
  | { kind: 'topology' }
  | { kind: 'step'; step: number }
  | { kind: 'cmd'; step: number; cmd: number }
  | { kind: 'output'; step: number }
  | { kind: 'quiz-intro' }
  | { kind: 'quiz'; q: number }
  | { kind: 'end' };

export function buildSlides(tp: Tp): Slide[] {
  const s: Slide[] = [{ kind: 'intro' }, { kind: 'objectives' }, { kind: 'topology' }];
  tp.steps.forEach((st, i) => {
    s.push({ kind: 'step', step: i });
    st.commands.forEach((_, j) => s.push({ kind: 'cmd', step: i, cmd: j }));
    if (st.output) s.push({ kind: 'output', step: i });
  });
  s.push({ kind: 'quiz-intro' });
  tp.quiz.forEach((_, k) => s.push({ kind: 'quiz', q: k }));
  s.push({ kind: 'end' });
  return s;
}

/** Libellé court d'une diapositive (table des matières). */
export function slideLabel(tp: Tp, sl: Slide): string {
  switch (sl.kind) {
    case 'intro': return 'Introduction';
    case 'objectives': return 'Objectifs';
    case 'topology': return 'Topologie';
    case 'step': return `Étape ${sl.step + 1} – ${tp.steps[sl.step].title}`;
    case 'cmd': return `Tapez : ${tp.steps[sl.step].commands[sl.cmd].cmd}`;
    case 'output': return `Résultat – ${tp.steps[sl.step].title}`;
    case 'quiz-intro': return 'Questions';
    case 'quiz': return `Question ${sl.q + 1}`;
    case 'end': return 'Résultat final';
  }
}

/** Points d'une commande : 1 du premier coup, 0,5 après erreur ou indice, 0 si solution affichée. */
export function commandScore(st: { attempts: number; hint: boolean; revealed: boolean; solved: boolean }): number {
  if (!st.solved || st.revealed) return 0;
  return st.attempts === 0 && !st.hint ? 1 : 0.5;
}

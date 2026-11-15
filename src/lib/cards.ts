import type { Tp } from '../data/types';
import type { TpCardData } from '../components/library/LibraryGrid';

/** Données minimales d'un TP pour les cartes (évite de sérialiser tout le contenu dans les îlots). */
export const toCard = (t: Tp): TpCardData => ({
  slug: t.slug, code: t.code, title: t.title, subtitle: t.subtitle, summary: t.summary,
  subject: t.subject, theme: t.theme, level: t.level, duration: t.duration, tools: t.tools,
  steps: t.steps.length, questions: t.quiz.length,
});

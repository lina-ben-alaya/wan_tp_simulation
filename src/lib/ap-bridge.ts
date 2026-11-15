/**
 * Pont entre un export HTML5 ActivePresenter (chargé en iframe, même origine) et la plateforme.
 *
 * Dans ActivePresenter, sur la diapositive finale, ajouter une action « Exécuter JavaScript » :
 *
 *   parent.postMessage({ source: 'itlab-ap', tp: '<slug>', score: <score>, max: <max> }, '*');
 *
 * (les variables de score ActivePresenter peuvent être lues dans le script selon votre version ;
 * voir docs/AP-INTEGRATION.md). La plateforme vérifie l'origine et le format avant d'enregistrer.
 */

export interface ApScoreMessage {
  source: 'itlab-ap';
  tp: string;
  score: number;
  max: number;
}

export function parseApMessage(data: unknown): ApScoreMessage | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  if (d.source !== 'itlab-ap') return null;
  if (typeof d.tp !== 'string' || !/^[a-z0-9-]+$/.test(d.tp)) return null;
  const score = Number(d.score);
  const max = Number(d.max);
  if (!Number.isFinite(score) || !Number.isFinite(max) || max <= 0 || score < 0 || score > max) return null;
  return { source: 'itlab-ap', tp: d.tp, score, max };
}

/** Accepte uniquement les messages de la même origine (exports servis par la plateforme). */
export function isTrustedOrigin(origin: string, own: string): boolean {
  return origin === own;
}

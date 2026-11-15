import { useSyncExternalStore } from 'react';
import { emptyProgress, getProgress, subscribe, type Progress } from './progress';

const SERVER_SNAPSHOT: Progress = emptyProgress();

/** Progression réactive. Côté serveur (rendu statique) : progression vide. */
export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getProgress, () => SERVER_SNAPSHOT);
}

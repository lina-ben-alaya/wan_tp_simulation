import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Tp } from '../data/types';

/**
 * Vérifié au build : un export HTML5 ActivePresenter est-il déposé dans public/ pour ce TP ?
 * Si oui, la page du TP l'affiche ; sinon elle affiche la simulation IT LAB (diaporama interactif).
 */
export function hasApExport(tp: Tp): boolean {
  return !tp.ap.file.startsWith('http') && existsSync(join(process.cwd(), 'public', tp.ap.file.split('?')[0]));
}

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Tp } from '../data/types';

/**
 * Vérifié au moment du build : l'export HTML5 ActivePresenter du TP est-il déposé
 * dans public/ ? Ajouter un export puis reconstruire suffit à le rendre disponible.
 */
export function apAvailable(tp: Tp): boolean {
  return existsSync(join(process.cwd(), 'public', tp.ap.file));
}

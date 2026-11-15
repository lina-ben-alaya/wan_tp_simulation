/** Préfixe un chemin interne avec la base du site (utile pour GitHub Pages : /it-lab/…). */
export function url(path = ''): string {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
  const p = path.replace(/^\//, '');
  return `${base}/${p}`;
}

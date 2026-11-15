import type { Tp } from '../data/types';
import type { GlossaryTerm } from '../data/glossary';

export interface SearchEntry {
  type: 'TP' | 'Étape' | 'Commande' | 'Notion' | 'Glossaire' | 'Page';
  title: string;
  context: string;
  text: string;
  /** Chemin relatif à la base du site. */
  href: string;
}

export function buildSearchIndex(tps: Tp[], glossary: GlossaryTerm[]): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const tp of tps) {
    out.push({ type: 'TP', title: tp.title, context: tp.code, text: `${tp.subtitle} ${tp.summary} ${tp.objectives.join(' ')}`, href: `tps/${tp.slug}` });
    tp.learn.forEach((s) => out.push({ type: 'Notion', title: s.title, context: tp.title, text: `${s.body.join(' ')} ${(s.points ?? []).join(' ')} ${s.code ?? ''}`, href: `tps/${tp.slug}?mode=learn` }));
    tp.steps.forEach((s, i) => {
      out.push({ type: 'Étape', title: s.title, context: `${tp.title} · étape ${i + 1}`, text: `${s.goal} ${s.explain}`, href: `tps/${tp.slug}?mode=practice&step=${i + 1}` });
      s.commands.forEach((c) => out.push({ type: 'Commande', title: c.cmd, context: `${tp.title} · ${s.device}`, text: c.prompt, href: `tps/${tp.slug}?mode=observe&step=${i + 1}` }));
    });
  }
  for (const g of glossary) out.push({ type: 'Glossaire', title: g.term, context: g.full ?? 'Glossaire', text: g.definition, href: `ressources#glossaire-${g.id}` });
  const pages: [string, string][] = [['Dashboard', 'dashboard'], ['Mode défi', 'defi'], ['Simulations', 'simulations'], ['Modules', 'modules'], ['Ressources et glossaire', 'ressources'], ['À propos', 'a-propos']];
  pages.forEach(([t, h]) => out.push({ type: 'Page', title: t, context: 'Page', text: t, href: h }));
  return out;
}

export const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Recherche : tous les mots doivent apparaître ; le titre compte davantage. */
export function searchIndex(index: SearchEntry[], query: string, limit = 30): SearchEntry[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: { e: SearchEntry; s: number }[] = [];
  for (const e of index) {
    const title = fold(e.title);
    const all = `${title} ${fold(e.context)} ${fold(e.text)}`;
    if (!words.every((w) => all.includes(w))) continue;
    let s = 0;
    for (const w of words) {
      if (title.startsWith(w)) s += 6;
      else if (title.includes(w)) s += 4;
      else s += 1;
    }
    if (e.type === 'TP') s += 2;
    if (e.type === 'Glossaire') s += 1;
    scored.push({ e, s });
  }
  return scored.sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.e);
}

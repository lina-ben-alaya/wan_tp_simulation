import { describe, expect, it } from 'vitest';
import { TPS } from '@/data/index';
import { tpSchema } from '@/data/schema';
import { GLOSSARY, GLOSSARY_BY_ID } from '@/data/glossary';
import { SIMS } from '@/data/catalog';
import { matchCommand } from '@/lib/ios-match';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));

describe('contenu des TP', () => {
  it('contient les 10 TP, slugs et ordres uniques', () => {
    expect(TPS).toHaveLength(10);
    expect(new Set(TPS.map((t) => t.slug)).size).toBe(10);
    expect(new Set(TPS.map((t) => t.order)).size).toBe(10);
  });

  for (const tp of TPS) {
    describe(tp.slug, () => {
      it('respecte le schéma', () => {
        const r = tpSchema.safeParse(tp);
        if (!r.success) throw new Error(JSON.stringify(r.error.issues, null, 2));
      });

      it('a des identifiants uniques (étapes, questions, comparaisons)', () => {
        for (const list of [tp.steps.map((s) => s.id), tp.quiz.map((q) => q.id), tp.compare.map((c) => c.id)]) {
          expect(new Set(list).size).toBe(list.length);
        }
      });

      it('référence des prérequis, termes et simulateurs existants', () => {
        for (const p of tp.prerequisites) expect(TPS.some((t) => t.slug === p), p).toBe(true);
        for (const g of tp.glossary) expect(GLOSSARY_BY_ID.has(g), `terme ${g}`).toBe(true);
        for (const s of tp.sims) expect(s in SIMS, `sim ${s}`).toBe(true);
      });

      it('référence des documents sources présents', () => {
        for (const s of tp.sources) expect(existsSync(publicDir + s.file), s.file).toBe(true);
      });

      it('chaque commande attendue est acceptée par le validateur', () => {
        for (const step of tp.steps) {
          for (const c of step.commands) {
            expect(matchCommand(c.cmd, c.cmd, c.alt).ok, `${step.id}: ${c.cmd}`).toBe(true);
            for (const a of c.alt ?? []) {
              const concrete = a.replace(/\{n\}/g, '7');
              expect(matchCommand(concrete, c.cmd, c.alt).ok, `${step.id}: ${concrete}`).toBe(true);
            }
          }
        }
      });

      it('chaque nœud de topologie est relié', () => {
        const linked = new Set(tp.topology.links.flatMap((l) => [l.a, l.b]));
        for (const n of tp.topology.nodes) expect(linked.has(n.id), n.id).toBe(true);
      });
    });
  }
});

describe('glossaire', () => {
  it('identifiants uniques et définitions non vides', () => {
    expect(new Set(GLOSSARY.map((g) => g.id)).size).toBe(GLOSSARY.length);
    for (const g of GLOSSARY) expect(g.definition.length).toBeGreaterThan(20);
  });
});

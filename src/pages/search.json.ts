import type { APIRoute } from 'astro';
import { TPS } from '../data/index';
import { GLOSSARY } from '../data/glossary';
import { buildSearchIndex } from '../lib/search';

/** Index de recherche généré au build (statique, fonctionne hors ligne). */
export const GET: APIRoute = () =>
  new Response(JSON.stringify(buildSearchIndex(TPS, GLOSSARY)), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });

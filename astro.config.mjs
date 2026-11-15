// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// BASE_PATH permet le déploiement sur GitHub Pages (ex. /it-lab/). En local : "/".
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  base,
  trailingSlash: 'ignore',
  integrations: [react()],
  // Cast : écart de types entre la version de Vite d'Astro et celle du plugin Tailwind (sans effet à l'exécution).
  vite: { plugins: [/** @type {any} */ (tailwindcss())] },
});

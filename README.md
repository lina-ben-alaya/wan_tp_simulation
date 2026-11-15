# IT LAB – Interactive Learning Platform

Plateforme pédagogique (Astro 5 + React 18 + Tailwind 4) : 10 TP réseaux en 5 modes (Apprendre, Observer, Pratiquer, Évaluer, Corriger), simulateurs calculés, mode Défi, Dashboard, recherche (Ctrl K), glossaire, intégration ActivePresenter.

## Installation et exécution
```bash
npm install
npm run dev        # http://localhost:4321
npm test           # tests unitaires (Vitest)
npm run check      # vérification des types
npm run build      # site statique dans dist/
```
Déploiement GitHub Pages : `BASE_PATH=/nom-du-depot/ npm run build`.

> Windows : gardez le projet dans un chemin court (ex. `C:\it-lab`), sinon l'installation d'esbuild échoue (limite de 260 caractères).

## Structure
- `src/data/tps/*.ts` : contenu des 10 TP (validé par `src/data/schema.ts` dans `tests/unit/content.test.ts`)
- `src/lib/` : validateur de commandes IOS, progression (localStorage), quiz, simulateurs, pont ActivePresenter
- `src/components/` : modes du TP, topologie SVG, simulateurs, dashboard, défi, recherche
- `public/docs/` : énoncés PDF · `public/sims/<slug>/` : exports HTML5 ActivePresenter (à déposer)

## Intégrer une simulation ActivePresenter
1. Exporter le projet en HTML5 dans `public/sims/<slug>/index.html` (slug = nom du TP, ex. `vpn-mpls`).
2. Sur la dernière diapositive, action « Exécuter JavaScript » :
   `parent.postMessage({ source: 'itlab-ap', tp: '<slug>', score: <score>, max: <max> }, '*');`
3. La plateforme détecte l'export automatiquement et enregistre le score. Le gabarit `public/sims/_demo/` permet de tester le pont.

/**
 * Génère, pour chaque TP, un « kit de production » ActivePresenter : le scénario
 * diapositive par diapositive (textes, captures à réaliser, zones de saisie avec
 * réponses acceptées, feedbacks, questions), à partir du contenu de la plateforme.
 *
 * Exécution : npx vite-node scripts/gen-kits.ts
 * Sortie    : docs/kits-activepresenter/<n>-<slug>.md
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { TPS } from '../src/data/index';
import type { Question, Tp } from '../src/data/types';
import { matchCommand } from '../src/lib/ios-match';

const OUT = 'docs/kits-activepresenter';
mkdirSync(OUT, { recursive: true });

const fence = (s: string) => '```\n' + s + '\n```';

/** Abréviations IOS courantes à ajouter comme réponses acceptées dans la zone de saisie. */
function abbreviations(cmd: string): string[] {
  const rules: [RegExp, string][] = [
    [/^configure terminal$/, 'conf t'],
    [/^show /, 'sh '],
    [/^interface /, 'int '],
    [/ interfaces?$/, ' int'],
    [/no shutdown$/, 'no shut'],
    [/loopback(\d)/i, 'lo$1'],
    [/serial(\d)/i, 's$1'],
    [/fastethernet(\d)/i, 'f$1'],
    [/ running-config startup-config$/, ' run start'],
    [/^address-family /, 'add '],
  ];
  let a = cmd;
  for (const [re, rep] of rules) a = a.replace(re, rep);
  // On ne garde l'abréviation que si le validateur IOS de la plateforme l'accepte aussi.
  return a !== cmd && matchCommand(a, cmd).ok ? [a] : [];
}

function quizSlide(q: Question, n: number): string {
  const head = `### Diapo Q${n} — ${q.source === 'enonce' ? 'Question du TP' : 'Question de notion'}\n\n**Question (texte affiché) :** ${q.prompt}\n`;
  const fb = `\n- **Feedback correct :** « Bonne réponse. ${q.explain} »\n- **Feedback incorrect :** « Réponse incorrecte. ${q.explain} »\n- Score : 1 point · Tentatives : 2\n`;
  switch (q.kind) {
    case 'single':
      return head + `\n**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.\n\n` +
        q.options.map((o, i) => `- [${i === q.answer ? 'x' : ' '}] ${o}`).join('\n') + '\n' + fb;
    case 'multi':
      return head + `\n**Interaction ActivePresenter :** Question à choix multiples — *plusieurs réponses*.\n\n` +
        q.options.map((o, i) => `- [${q.answers.includes(i) ? 'x' : ' '}] ${o}`).join('\n') + '\n' + fb;
    case 'input':
      return head + `\n**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.\n\nRéponses acceptées :\n` +
        q.accept.map((a) => `- \`${a}\``).join('\n') + '\n' + fb;
    case 'order':
      return head + `\n**Interaction ActivePresenter :** Question de séquence (Sequence). Ordre correct :\n\n` +
        q.items.map((it, i) => `${i + 1}. ${it}`).join('\n') + '\n' + fb;
  }
}

function kit(tp: Tp, index: number): string {
  const L: string[] = [];
  const nCmd = tp.steps.reduce((n, s) => n + s.commands.length, 0);
  L.push(`# Kit ActivePresenter — ${tp.code} : ${tp.title}`, '');
  L.push(`> Kit de production pour réaliser **votre propre** simulation de ce TP dans ActivePresenter. Contenu issu de l’énoncé et de la plateforme IT LAB. Les sorties marquées *reconstituées* doivent être remplacées par **vos captures réelles** (GNS3 / Packet Tracer).`, '');
  L.push('## 0. Paramètres du projet', '');
  L.push(`| Réglage | Valeur |`, `|---|---|`);
  L.push(`| Nom du projet | \`${tp.slug}\` |`);
  L.push(`| Taille | 1280 × 720 (ou la taille de vos captures), option *Responsive* activée |`);
  L.push(`| Auteur (Fichier → Propriétés du projet) | Lina Ben Alaya |`);
  L.push(`| Export | HTML5, dossier \`${tp.slug}\` |`);
  L.push(`| Volume | ${tp.steps.length} étapes · ${nCmd} saisies de commandes · ${tp.quiz.length} questions |`);
  L.push(`| Outils à ouvrir | ${tp.tools.join(', ')} |`, '');

  L.push('## 1. Diapo « Introduction »', '');
  L.push(`- **Titre :** ${tp.code} — ${tp.title}`, `- **Sous-titre :** ${tp.subtitle}`, `- **Texte :** ${tp.scenario}`, `- **Bouton :** « Commencer » → diapo suivante`, '');
  L.push('## 2. Diapo « Objectifs »', '');
  tp.objectives.forEach((o) => L.push(`- ${o}`));
  L.push('', '- **Boutons :** « Retour » · « Suivant »', '');
  L.push('## 3. Diapo « Environnement et topologie »', '');
  L.push(`- **Capture à réaliser :** la topologie complète dans ${tp.tools[0]}.`);
  L.push(`- **Légende / callouts** (un par équipement) :`);
  tp.topology.nodes.forEach((n) => L.push(`  - **${n.label ?? n.id}**${n.role ? ` (${n.role})` : ''} : ${(n.info ?? []).join(' · ') || '—'}`));
  L.push(`- **Matériel :** ${tp.equipment.join(', ')}`, '');

  L.push('## 4. Manipulations (simulation logicielle)', '');
  L.push(`> Pour chaque commande : une diapo avec la **capture de la console à l’invite indiquée**, une **zone de saisie (Text Entry)** placée sur la ligne de commande, et les feedbacks. Cochez *Insensible à la casse*. Ajoutez une diapo « Résultat » après la dernière commande de l’étape si une sortie est indiquée.`, '');
  let slide = 0;
  tp.steps.forEach((s, i) => {
    L.push(`### Étape ${i + 1} — ${s.title} (${s.device})`, '');
    L.push(`- **Diapo de contexte — texte :** ${s.goal}`);
    s.commands.forEach((c) => {
      slide++;
      L.push('', `#### Diapo saisie ${slide} — sur **${s.device}**`, '');
      L.push(`- **Capture :** console de ${s.device} affichant l’invite \`${c.prompt}\``);
      L.push(`- **Consigne (légende) :** « ${s.goal} »`);
      L.push(`- **Réponse attendue (Text Entry) :** \`${c.cmd}\``);
      const ab = abbreviations(c.cmd);
      if (ab.length) L.push(`- **Abréviation à accepter aussi :** ${ab.map((a) => `\`${a}\``).join(' · ')}`);
      if (c.alt?.length) L.push(`- **Autres réponses acceptées :** ${c.alt.map((a) => `\`${a.replace(/\{n\}/g, '<nombre>')}\``).join(' · ')}`);
      L.push(`- **Indice (bouton « Indice » ou après 2 erreurs) :** « ${s.hint} »`);
      L.push(`- **Feedback correct :** « Correct. »`);
      L.push(`- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »`);
      L.push(`- **Après 3 essais :** afficher la solution \`${c.cmd}\` puis passer à la suite (0 point).`);
    });
    if (s.output) {
      L.push('', `#### Diapo résultat — étape ${i + 1}`, '');
      L.push(`- **Capture :** la sortie réelle sur ${s.device}. Sortie ${s.outputFidelity === 'enonce' ? 'extraite de l’énoncé' : s.outputFidelity === 'illustratif' ? '**illustrative** (valeurs à remplacer par les vôtres)' : '**reconstituée** (à remplacer par votre capture réelle)'} :`);
      L.push('', fence(s.output), '');
    }
    L.push('', `- **Explication (légende sur la diapo résultat) :** ${s.explain}`, '');
  });

  L.push('## 5. Questions', '');
  tp.quiz.forEach((q, i) => L.push(quizSlide(q, i + 1)));

  if (tp.compare.length) {
    L.push('## 6. Diapo bonus « Erreur classique » (optionnelle)', '');
    tp.compare.forEach((c) => {
      L.push(`### ${c.title}`, '', `- **Contexte :** ${c.context}`, `- **Incorrect :**`, '', fence(c.wrong.config), '', `  → ${c.wrong.result}`, `- **Correct :**`, '', fence(c.right.config), '', `  → ${c.right.result}`, `- **À retenir :** ${c.lesson}`, '');
    });
  }

  L.push('## 7. Diapo « Résultat final »', '');
  L.push('- Afficher le score (variable *Score* du projet) et le pourcentage.', '- Boutons : « Recommencer » (aller à la diapo 1) · « Revoir les erreurs ».');
  L.push('- *Optionnel* — remonter le score dans IT LAB : sur cette diapo, Événement « Au chargement » → action **Exécuter JavaScript** :', '');
  L.push(fence(`parent.postMessage({ source: 'itlab-ap', tp: '${tp.slug}', score: 1, max: 1 }, '*');`));
  L.push('', '## 8. Notes sur l’énoncé', '');
  tp.notes.forEach((n) => L.push(`- ${n}`));
  L.push('', `---`, `Source : ${tp.sources.map((s) => s.label).join(', ')}.`, '');
  return L.join('\n');
}

const done = new Set(['redistribution']); // simulation déjà réalisée
TPS.forEach((tp, i) => {
  const name = `${String(i + 1).padStart(2, '0')}-${tp.slug}.md`;
  writeFileSync(`${OUT}/${name}`, kit(tp, i));
  console.log((done.has(tp.slug) ? '(déjà réalisée) ' : '') + name);
});

# Guide : réaliser vos simulations ActivePresenter pour IT LAB

Ce dossier contient **un kit par TP** (`01-…` à `10-…`). Chaque kit décrit la simulation diapositive par diapositive : textes, captures à réaliser, commandes attendues (et abréviations à accepter), indices, feedbacks et questions avec leurs réponses.

Ordre conseillé (du plus court au plus long) : **04 BGP** → 09 Frame Relay base → 01 MPLS P1 → 02 MPLS P2 → 07 IPsec → 06 NAT/DHCP → 08 GRE → 10 Frame Relay avancé → 03 VPN MPLS.
Le kit **05 Redistribution** est fourni pour référence : cette simulation existe déjà.

---

## Étape 1 — Faire le TP réel et capturer
1. Montez la topologie dans GNS3 (ou Packet Tracer pour le TP NAT/DHCP), comme indiqué en section 3 du kit.
2. Ouvrez ActivePresenter → **Nouveau projet → Enregistrer une simulation logicielle** (*Software Simulation*).
3. Choisissez la fenêtre de la console du routeur, mode **Simulation** (ou *Démonstration* pour une version « regarder »).
4. Tapez les commandes du kit **dans l’ordre**, une par une. ActivePresenter crée une diapositive par action.
5. Arrêtez l’enregistrement (`Fin` sur le clavier ou icône de la barre des tâches).

> Astuce : enregistrez une étape du kit par session, c’est plus facile à corriger.

## Étape 2 — Configurer chaque saisie de commande
Pour chaque diapositive « Diapo saisie » du kit :
1. Sélectionnez la zone de saisie (**Text Entry**) créée par l’enregistrement, ou insérez-la : *Interactions → Text Entry*.
2. **Propriétés → Interaction → Réponses correctes** : ajoutez la *Réponse attendue*, l’*Abréviation à accepter aussi* et les *Autres réponses acceptées* du kit.
3. Cochez **Insensible à la casse**.
4. **Tentatives** : 3. Dans les feedbacks, collez les textes du kit (Correct / Incorrect).
5. **Indice** : ajoutez une légende masquée, affichée par un bouton « Indice » (*Événements → Au clic → Afficher l’objet*).

## Étape 3 — Diapositives de cours, résultats et questions
- **Introduction, Objectifs, Topologie** : *Accueil → Nouvelle diapositive*, puis copiez les textes des sections 1 à 3.
- **Résultat** : capture de la sortie réelle, plus une légende avec l’« Explication » du kit.
- **Questions** : *Interactions → Choix multiples / Saisie de texte / Séquence*, avec les réponses cochées dans le kit.
- **Résultat final** : *Interactions → Diapositive de résultats* (score automatique).

## Étape 4 — Navigation
- Ajoutez les boutons **Retour**, **Suivant** et **Recommencer** (*Insérer → Bouton*, Action *Aller à la diapositive précédente / suivante / première*).
- **Fichier → Propriétés du projet** : Auteur = *Lina Ben Alaya*, Titre = titre du TP.

## Étape 5 — Exporter en HTML5
1. **Exporter → HTML5**.
2. Dossier de sortie : le **nom du projet** indiqué dans le kit (ex. `bgp`).
3. Cochez *Responsive* si proposé, puis exportez.
4. Testez en ouvrant le fichier `.html` du dossier exporté dans votre navigateur.

## Étape 6 — Me transmettre l’export
Dites-moi où se trouve le dossier exporté, en indiquant le TP. Je l’intègre au site (copie permanente dans votre dépôt GitHub). La mention « Simulation réalisée par Brahim Fatnass » est alors remplacée par votre simulation, à votre nom.

---

### Rappels importants
- Les sorties marquées **reconstituées** ou **illustratives** dans les kits sont des exemples : remplacez-les par **vos captures réelles**.
- Les **notes sur l’énoncé** (fin de chaque kit) signalent les incohérences des énoncés (adresses, coquilles) : vérifiez-les sur votre maquette.
- Pour faire remonter le score dans le Dashboard d’IT LAB : action *Exécuter JavaScript* sur la diapositive de résultats (code fourni dans chaque kit, section 7).

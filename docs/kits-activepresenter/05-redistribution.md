# Kit ActivePresenter — TP Redistribution : Redistribution OSPF / EIGRP / RIPv2

> Kit de production pour réaliser **votre propre** simulation de ce TP dans ActivePresenter. Contenu issu de l’énoncé et de la plateforme IT LAB. Les sorties marquées *reconstituées* doivent être remplacées par **vos captures réelles** (GNS3 / Packet Tracer).

## 0. Paramètres du projet

| Réglage | Valeur |
|---|---|
| Nom du projet | `redistribution` |
| Taille | 1280 × 720 (ou la taille de vos captures), option *Responsive* activée |
| Auteur (Fichier → Propriétés du projet) | Lina Ben Alaya |
| Export | HTML5, dossier `redistribution` |
| Volume | 8 étapes · 25 saisies de commandes · 9 questions |
| Outils à ouvrir | GNS3 |

## 1. Diapo « Introduction »

- **Titre :** TP Redistribution — Redistribution OSPF / EIGRP / RIPv2
- **Sous-titre :** Faire communiquer trois domaines de routage et maîtriser la distance administrative
- **Texte :** Le réseau comprend un domaine OSPF (R1, R2, R3), un domaine EIGRP 1 (R2, R3, R4, R5) et un domaine RIPv2 (R5, R6). Les routeurs de frontière (R2, R3, R5) doivent redistribuer les routes pour que tous les réseaux soient joignables.
- **Bouton :** « Commencer » → diapo suivante

## 2. Diapo « Objectifs »

- Configurer OSPF, EIGRP et RIPv2 et vérifier la propagation dans chaque domaine
- Redistribuer OSPF ↔ EIGRP sur R2 et R3, RIP ↔ EIGRP sur R5
- Comprendre la métrique de redistribution, le mot-clé subnets et metric-type
- Identifier un routage sous-optimal causé par la distance administrative et le corriger

- **Boutons :** « Retour » · « Suivant »

## 3. Diapo « Environnement et topologie »

- **Capture à réaliser :** la topologie complète dans GNS3.
- **Légende / callouts** (un par équipement) :
  - **R1** (OSPF) : Loopbacks 172.16.30-33.0/24 · 10.0.12.1 / 10.0.13.1
  - **R2** (OSPF + EIGRP) : 10.0.12.2 (OSPF) · 10.0.25.2 (EIGRP)
  - **R3** (OSPF + EIGRP) : 10.0.13.3 (OSPF) · 10.0.34.3 (EIGRP)
  - **R4** (EIGRP) : Loopbacks 172.16.20-23.0/24 · 10.0.34.4 / 10.0.45.4
  - **R5** (EIGRP + RIP) : 10.0.25.5 / 10.0.45.5 (EIGRP) · 10.0.56.5 (RIP)
  - **R6** (RIP) : 10.0.56.6 · Réseaux 172.16.0.0 (ex. 172.16.10.0/24)
- **Matériel :** R1, R2, R3, R4, R5, R6

## 4. Manipulations (simulation logicielle)

> Pour chaque commande : une diapo avec la **capture de la console à l’invite indiquée**, une **zone de saisie (Text Entry)** placée sur la ligne de commande, et les feedbacks. Cochez *Insensible à la casse*. Ajoutez une diapo « Résultat » après la dernière commande de l’étape si une sortie est indiquée.

### Étape 1 — OSPF sur R1 (R1)

- **Diapo de contexte — texte :** Router-ID 1.1.1.1, loopbacks et liens en Area 0.

#### Diapo saisie 1 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config)#`
- **Consigne (légende) :** « Router-ID 1.1.1.1, loopbacks et liens en Area 0. »
- **Réponse attendue (Text Entry) :** `router ospf 1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router ospf 1, router-id, puis network … 0.0.0.255 area 0 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router ospf 1` puis passer à la suite (0 point).

#### Diapo saisie 2 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-router)#`
- **Consigne (légende) :** « Router-ID 1.1.1.1, loopbacks et liens en Area 0. »
- **Réponse attendue (Text Entry) :** `router-id 1.1.1.1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router ospf 1, router-id, puis network … 0.0.0.255 area 0 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router-id 1.1.1.1` puis passer à la suite (0 point).

#### Diapo saisie 3 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-router)#`
- **Consigne (légende) :** « Router-ID 1.1.1.1, loopbacks et liens en Area 0. »
- **Réponse attendue (Text Entry) :** `network 172.16.30.0 0.0.0.255 area 0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router ospf 1, router-id, puis network … 0.0.0.255 area 0 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 172.16.30.0 0.0.0.255 area 0` puis passer à la suite (0 point).

#### Diapo saisie 4 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-router)#`
- **Consigne (légende) :** « Router-ID 1.1.1.1, loopbacks et liens en Area 0. »
- **Réponse attendue (Text Entry) :** `network 10.0.12.0 0.0.0.255 area 0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router ospf 1, router-id, puis network … 0.0.0.255 area 0 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 10.0.12.0 0.0.0.255 area 0` puis passer à la suite (0 point).

#### Diapo saisie 5 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-router)#`
- **Consigne (légende) :** « Router-ID 1.1.1.1, loopbacks et liens en Area 0. »
- **Réponse attendue (Text Entry) :** `network 10.0.13.0 0.0.0.255 area 0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router ospf 1, router-id, puis network … 0.0.0.255 area 0 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 10.0.13.0 0.0.0.255 area 0` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** L'énoncé annonce aussi 172.16.31.0, 172.16.32.0 et 172.16.33.0 (même syntaxe). R2 et R3 annoncent ensuite 10.0.12.0 et 10.0.13.0.

### Étape 2 — EIGRP sur R4 (R4)

- **Diapo de contexte — texte :** Annoncer les liens et les loopbacks de R4.

#### Diapo saisie 6 — sur **R4**

- **Capture :** console de R4 affichant l’invite `R4(config)#`
- **Consigne (légende) :** « Annoncer les liens et les loopbacks de R4. »
- **Réponse attendue (Text Entry) :** `router eigrp 1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router eigrp 1, no auto-summary, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router eigrp 1` puis passer à la suite (0 point).

#### Diapo saisie 7 — sur **R4**

- **Capture :** console de R4 affichant l’invite `R4(config-router)#`
- **Consigne (légende) :** « Annoncer les liens et les loopbacks de R4. »
- **Réponse attendue (Text Entry) :** `no auto-summary`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router eigrp 1, no auto-summary, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `no auto-summary` puis passer à la suite (0 point).

#### Diapo saisie 8 — sur **R4**

- **Capture :** console de R4 affichant l’invite `R4(config-router)#`
- **Consigne (légende) :** « Annoncer les liens et les loopbacks de R4. »
- **Réponse attendue (Text Entry) :** `network 10.0.34.0 0.0.0.255`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router eigrp 1, no auto-summary, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 10.0.34.0 0.0.0.255` puis passer à la suite (0 point).

#### Diapo saisie 9 — sur **R4**

- **Capture :** console de R4 affichant l’invite `R4(config-router)#`
- **Consigne (légende) :** « Annoncer les liens et les loopbacks de R4. »
- **Réponse attendue (Text Entry) :** `network 10.0.45.0 0.0.0.255`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router eigrp 1, no auto-summary, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 10.0.45.0 0.0.0.255` puis passer à la suite (0 point).

#### Diapo saisie 10 — sur **R4**

- **Capture :** console de R4 affichant l’invite `R4(config-router)#`
- **Consigne (légende) :** « Annoncer les liens et les loopbacks de R4. »
- **Réponse attendue (Text Entry) :** `network 172.16.20.0 0.0.0.255`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router eigrp 1, no auto-summary, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 172.16.20.0 0.0.0.255` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Puis 172.16.21-23.0 de la même façon. R2 (10.0.25.0), R3 (10.0.34.0) et R5 (10.0.25.0, 10.0.45.0) rejoignent EIGRP 1.

### Étape 3 — RIPv2 sur R6 (R6)

- **Diapo de contexte — texte :** Domaine RIP entre R5 et R6.

#### Diapo saisie 11 — sur **R6**

- **Capture :** console de R6 affichant l’invite `R6(config)#`
- **Consigne (légende) :** « Domaine RIP entre R5 et R6. »
- **Réponse attendue (Text Entry) :** `router rip`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router rip, version 2, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router rip` puis passer à la suite (0 point).

#### Diapo saisie 12 — sur **R6**

- **Capture :** console de R6 affichant l’invite `R6(config-router)#`
- **Consigne (légende) :** « Domaine RIP entre R5 et R6. »
- **Réponse attendue (Text Entry) :** `version 2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router rip, version 2, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `version 2` puis passer à la suite (0 point).

#### Diapo saisie 13 — sur **R6**

- **Capture :** console de R6 affichant l’invite `R6(config-router)#`
- **Consigne (légende) :** « Domaine RIP entre R5 et R6. »
- **Réponse attendue (Text Entry) :** `network 10.0.56.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router rip, version 2, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 10.0.56.0` puis passer à la suite (0 point).

#### Diapo saisie 14 — sur **R6**

- **Capture :** console de R6 affichant l’invite `R6(config-router)#`
- **Consigne (légende) :** « Domaine RIP entre R5 et R6. »
- **Réponse attendue (Text Entry) :** `network 172.16.0.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router rip, version 2, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 172.16.0.0` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** RIP annonce par réseau de classe (172.16.0.0). R5 annonce 10.0.56.0. Vérifiez ensuite la propagation : show ip route sur R3, R5 et R2.

### Étape 4 — Redistribuer OSPF dans EIGRP (R2)

- **Diapo de contexte — texte :** Les routes OSPF doivent apparaître dans le domaine EIGRP.

#### Diapo saisie 15 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « Les routes OSPF doivent apparaître dans le domaine EIGRP. »
- **Réponse attendue (Text Entry) :** `router eigrp 1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Dans router eigrp 1 : redistribute ospf 1 metric suivi de 5 valeurs. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router eigrp 1` puis passer à la suite (0 point).

#### Diapo saisie 16 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config-router)#`
- **Consigne (légende) :** « Les routes OSPF doivent apparaître dans le domaine EIGRP. »
- **Réponse attendue (Text Entry) :** `redistribute ospf 1 metric 10000 100 255 1 1500`
- **Autres réponses acceptées :** `redistribute ospf 1 metric <nombre> <nombre> <nombre> <nombre> <nombre>`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Dans router eigrp 1 : redistribute ospf 1 metric suivi de 5 valeurs. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `redistribute ospf 1 metric 10000 100 255 1 1500` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Attention à se placer dans le processus EIGRP. Les 5 valeurs (bande passante, délai, fiabilité, charge, MTU) figurent dans une capture de l'énoncé : toute métrique explicite est acceptée ici. Faites de même sur R3, puis vérifiez sur R4 les routes D EX.

### Étape 5 — Vérifier sur R4 (R4)

- **Diapo de contexte — texte :** Repérer les routes externes.

#### Diapo saisie 17 — sur **R4**

- **Capture :** console de R4 affichant l’invite `R4#`
- **Consigne (légende) :** « Repérer les routes externes. »
- **Réponse attendue (Text Entry) :** `show ip route`
- **Abréviation à accepter aussi :** `sh ip route`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show ip route »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show ip route` puis passer à la suite (0 point).

#### Diapo résultat — étape 5

- **Capture :** la sortie réelle sur R4. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
D EX    172.16.30.0/24 [170/…] via 10.0.34.3, Serial0/1
D EX    10.0.12.0/24 [170/…] via 10.0.45.5, Serial0/0
…
```


- **Explication (légende sur la diapo résultat) :** EX = routes externes, importées dans EIGRP. Leur distance administrative est 170.

### Étape 6 — Redistribuer EIGRP dans OSPF (R2)

- **Diapo de contexte — texte :** R1 doit connaître les réseaux EIGRP (dont les sous-réseaux).

#### Diapo saisie 18 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « R1 doit connaître les réseaux EIGRP (dont les sous-réseaux). »
- **Réponse attendue (Text Entry) :** `router ospf 1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « redistribute eigrp 1 subnets metric 50 metric-type … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router ospf 1` puis passer à la suite (0 point).

#### Diapo saisie 19 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config-router)#`
- **Consigne (légende) :** « R1 doit connaître les réseaux EIGRP (dont les sous-réseaux). »
- **Réponse attendue (Text Entry) :** `redistribute eigrp 1 subnets metric 50 metric-type 1`
- **Autres réponses acceptées :** `redistribute eigrp 1 subnets metric 50 metric-type 2` · `redistribute eigrp 1 metric 50 metric-type 1 subnets` · `redistribute eigrp 1 metric 50 metric-type 2 subnets`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « redistribute eigrp 1 subnets metric 50 metric-type … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `redistribute eigrp 1 subnets metric 50 metric-type 1` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** subnets inclut les sous-réseaux ; metric 50 et metric-type (1 ou 2) suivent l'explication de l'énoncé. Même chose sur R3, puis show ip route sur R1.

### Étape 7 — RIP ↔ EIGRP sur R5 (R5)

- **Diapo de contexte — texte :** Terminer par la frontière RIP.

#### Diapo saisie 20 — sur **R5**

- **Capture :** console de R5 affichant l’invite `R5(config)#`
- **Consigne (légende) :** « Terminer par la frontière RIP. »
- **Réponse attendue (Text Entry) :** `router rip`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Dans RIP : redistribute eigrp 1 metric <sauts> ; dans EIGRP : redistribute rip metric <5 valeurs>. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router rip` puis passer à la suite (0 point).

#### Diapo saisie 21 — sur **R5**

- **Capture :** console de R5 affichant l’invite `R5(config-router)#`
- **Consigne (légende) :** « Terminer par la frontière RIP. »
- **Réponse attendue (Text Entry) :** `redistribute eigrp 1 metric 3`
- **Autres réponses acceptées :** `redistribute eigrp 1 metric <nombre>`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Dans RIP : redistribute eigrp 1 metric <sauts> ; dans EIGRP : redistribute rip metric <5 valeurs>. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `redistribute eigrp 1 metric 3` puis passer à la suite (0 point).

#### Diapo saisie 22 — sur **R5**

- **Capture :** console de R5 affichant l’invite `R5(config-router)#`
- **Consigne (légende) :** « Terminer par la frontière RIP. »
- **Réponse attendue (Text Entry) :** `router eigrp 1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Dans RIP : redistribute eigrp 1 metric <sauts> ; dans EIGRP : redistribute rip metric <5 valeurs>. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router eigrp 1` puis passer à la suite (0 point).

#### Diapo saisie 23 — sur **R5**

- **Capture :** console de R5 affichant l’invite `R5(config-router)#`
- **Consigne (légende) :** « Terminer par la frontière RIP. »
- **Réponse attendue (Text Entry) :** `redistribute rip metric 10000 100 255 1 1500`
- **Autres réponses acceptées :** `redistribute rip metric <nombre> <nombre> <nombre> <nombre> <nombre>`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Dans RIP : redistribute eigrp 1 metric <sauts> ; dans EIGRP : redistribute rip metric <5 valeurs>. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `redistribute rip metric 10000 100 255 1 1500` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Vers RIP, la métrique est un nombre de sauts (1 à 15). Vérifiez que R6 connaît toutes les routes, puis faites des pings vers les réseaux distants.

### Étape 8 — Corriger la distance administrative (R3)

- **Diapo de contexte — texte :** R3 doit préférer le chemin EIGRP vers 172.16.10.0/24.

#### Diapo saisie 24 — sur **R3**

- **Capture :** console de R3 affichant l’invite `R3(config)#`
- **Consigne (légende) :** « R3 doit préférer le chemin EIGRP vers 172.16.10.0/24. »
- **Réponse attendue (Text Entry) :** `router eigrp 1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « distance eigrp <interne> <externe> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router eigrp 1` puis passer à la suite (0 point).

#### Diapo saisie 25 — sur **R3**

- **Capture :** console de R3 affichant l’invite `R3(config-router)#`
- **Consigne (légende) :** « R3 doit préférer le chemin EIGRP vers 172.16.10.0/24. »
- **Réponse attendue (Text Entry) :** `distance eigrp 90 105`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « distance eigrp <interne> <externe> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `distance eigrp 90 105` puis passer à la suite (0 point).

#### Diapo résultat — étape 8

- **Capture :** la sortie réelle sur R3. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
D EX    172.16.10.0/24 [105/…] via 10.0.34.4, Serial0/1
```


- **Explication (légende sur la diapo résultat) :** Les routes EIGRP externes passent de 170 à 105, en dessous des 110 d’OSPF : R3 n’envoie plus ce trafic vers R1.

## 5. Questions

### Diapo Q1 — Question du TP

**Question (texte affiché) :** Que se passe-t-il si l’on redistribue dans EIGRP sans spécifier de métrique ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] La métrique OSPF est conservée
- [x] Les routes sont annoncées avec une métrique infinie
- [ ] EIGRP calcule automatiquement la métrique
- [ ] La redistribution est refusée

- **Feedback correct :** « Bonne réponse. Sans métrique, les routes sont annoncées avec une métrique infinie (de même pour RIP). »
- **Feedback incorrect :** « Réponse incorrecte. Sans métrique, les routes sont annoncées avec une métrique infinie (de même pour RIP). »
- Score : 1 point · Tentatives : 2

### Diapo Q2 — Question du TP

**Question (texte affiché) :** Quel préfixe EIGRP marque une route redistribuée (externe) dans show ip route ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `EX`
- `D EX`

- **Feedback correct :** « Bonne réponse. D EX : route EIGRP externe. »
- **Feedback incorrect :** « Réponse incorrecte. D EX : route EIGRP externe. »
- Score : 1 point · Tentatives : 2

### Diapo Q3 — Question du TP

**Question (texte affiché) :** Rôle du mot-clé subnets dans redistribute eigrp 1 subnets ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Chiffrer les routes
- [x] Redistribuer aussi les sous-réseaux
- [ ] Limiter à 10 routes
- [ ] Activer RIPv2

- **Feedback correct :** « Bonne réponse. Sans subnets, OSPF ne redistribue que les routes vers les réseaux par classe. »
- **Feedback incorrect :** « Réponse incorrecte. Sans subnets, OSPF ne redistribue que les routes vers les réseaux par classe. »
- Score : 1 point · Tentatives : 2

### Diapo Q4 — Question du TP

**Question (texte affiché) :** Quelle métrique OSPF utilise-t-il par défaut pour des routes redistribuées depuis EIGRP ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `20`

- **Feedback correct :** « Bonne réponse. Sans métrique, OSPF utilise 20. »
- **Feedback incorrect :** « Réponse incorrecte. Sans métrique, OSPF utilise 20. »
- Score : 1 point · Tentatives : 2

### Diapo Q5 — Question du TP

**Question (texte affiché) :** Avec metric-type 2 et metric 50, quelle métrique voit un routeur à trois sauts ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [x] 50
- [ ] 50 + coût des liens
- [ ] 150
- [ ] 20

- **Feedback correct :** « Bonne réponse. Type 2 : la métrique ne grandit pas après la redistribution. »
- **Feedback incorrect :** « Réponse incorrecte. Type 2 : la métrique ne grandit pas après la redistribution. »
- Score : 1 point · Tentatives : 2

### Diapo Q6 — Question du TP

**Question (texte affiché) :** Pourquoi R3 passe-t-il par R1 pour joindre 172.16.10.0/24 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Le lien vers R4 est plus lent
- [x] La route OSPF (DA 110) est préférée à la route EIGRP externe (DA 170)
- [ ] OSPF a une meilleure métrique
- [ ] RIP est désactivé

- **Feedback correct :** « Bonne réponse. La DA est comparée avant la métrique : 110 < 170. »
- **Feedback incorrect :** « Réponse incorrecte. La DA est comparée avant la métrique : 110 < 170. »
- Score : 1 point · Tentatives : 2

### Diapo Q7 — Question du TP

**Question (texte affiché) :** Après « distance eigrp 90 105 » sur R3, quelle route est retenue ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Toujours celle via R1
- [x] La route EIGRP externe (DA 105 < 110)
- [ ] Aucune
- [ ] Une route statique

- **Feedback correct :** « Bonne réponse. 105 < 110 : le chemin EIGRP devient le meilleur. »
- **Feedback incorrect :** « Réponse incorrecte. 105 < 110 : le chemin EIGRP devient le meilleur. »
- Score : 1 point · Tentatives : 2

### Diapo Q8 — Question de notion

**Question (texte affiché) :** Quels routeurs effectuent une redistribution ?

**Interaction ActivePresenter :** Question à choix multiples — *plusieurs réponses*.

- [ ] R1
- [x] R2
- [x] R3
- [ ] R4
- [x] R5
- [ ] R6

- **Feedback correct :** « Bonne réponse. R2, R3 (OSPF/EIGRP) et R5 (EIGRP/RIP). »
- **Feedback incorrect :** « Réponse incorrecte. R2, R3 (OSPF/EIGRP) et R5 (EIGRP/RIP). »
- Score : 1 point · Tentatives : 2

### Diapo Q9 — Question de notion

**Question (texte affiché) :** Quelle est la DA par défaut d’une route EIGRP interne ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [x] 90
- [ ] 110
- [ ] 120
- [ ] 170

- **Feedback correct :** « Bonne réponse. EIGRP interne 90, OSPF 110, RIP 120, EIGRP externe 170. »
- **Feedback incorrect :** « Réponse incorrecte. EIGRP interne 90, OSPF 110, RIP 120, EIGRP externe 170. »
- Score : 1 point · Tentatives : 2

## 6. Diapo bonus « Erreur classique » (optionnelle)

### Redistribution dans EIGRP sans métrique

- **Contexte :** R2 redistribue OSPF dans EIGRP.
- **Incorrect :**

```
router eigrp 1
 redistribute ospf 1
```

  → Routes annoncées avec une métrique infinie : R4 ne les installe pas.
- **Correct :**

```
router eigrp 1
 redistribute ospf 1 metric 10000 100 255 1 1500
```

  → R4 voit les routes OSPF en D EX.
- **À retenir :** Vers EIGRP et RIP, spécifiez toujours la métrique.

### Redistribution dans OSPF sans subnets

- **Contexte :** R2 redistribue EIGRP dans OSPF.
- **Incorrect :**

```
router ospf 1
 redistribute eigrp 1 metric 50
```

  → Seuls les réseaux par classe sont redistribués : les sous-réseaux (10.0.x.0/24, 172.16.x.0/24) manquent sur R1.
- **Correct :**

```
router ospf 1
 redistribute eigrp 1 subnets metric 50
```

  → R1 connaît les sous-réseaux EIGRP.
- **À retenir :** subnets est indispensable pour redistribuer des sous-réseaux dans OSPF.

### Distance administrative par défaut ou ajustée

- **Contexte :** R3 vers 172.16.10.0/24.
- **Incorrect :**

```
router eigrp 1
! DA par défaut : interne 90, externe 170
```

  → R3 passe par R1 (OSPF, 110) : trois domaines traversés.
- **Correct :**

```
router eigrp 1
 distance eigrp 90 105
```

  → R3 passe par le domaine EIGRP (105) : deux domaines traversés.
- **À retenir :** La DA prime sur la métrique ; elle peut être ajustée pour corriger un choix faussé par la redistribution.

## 7. Diapo « Résultat final »

- Afficher le score (variable *Score* du projet) et le pourcentage.
- Boutons : « Recommencer » (aller à la diapo 1) · « Revoir les erreurs ».
- *Optionnel* — remonter le score dans IT LAB : sur cette diapo, Événement « Au chargement » → action **Exécuter JavaScript** :

```
parent.postMessage({ source: 'itlab-ap', tp: 'redistribution', score: 1, max: 1 }, '*');
```

## 8. Notes sur l’énoncé

- Les commandes de redistribution exactes (et leurs métriques) ne figurent que dans des captures d'écran de l'énoncé : les métriques affichées sont reconstituées et toute métrique explicite est acceptée en mode Pratiquer.
- L'énoncé parle d'un « NextHop R5 » pour R3 ; dans la topologie, R3 rejoint le domaine EIGRP par R4 (puis R5). La plateforme indique « via le domaine EIGRP ».

---
Source : Énoncé – Redistribution OSPF/RIPv2/EIGRP.

# Kit ActivePresenter — TP1 · P2 : Backbone MPLS – Partie II

> Kit de production pour réaliser **votre propre** simulation de ce TP dans ActivePresenter. Contenu issu de l’énoncé et de la plateforme IT LAB. Les sorties marquées *reconstituées* doivent être remplacées par **vos captures réelles** (GNS3 / Packet Tracer).

## 0. Paramètres du projet

| Réglage | Valeur |
|---|---|
| Nom du projet | `mpls-backbone-p2` |
| Taille | 1280 × 720 (ou la taille de vos captures), option *Responsive* activée |
| Auteur (Fichier → Propriétés du projet) | Lina Ben Alaya |
| Export | HTML5, dossier `mpls-backbone-p2` |
| Volume | 7 étapes · 13 saisies de commandes · 7 questions |
| Outils à ouvrir | GNS3, Cisco 7200 |

## 1. Diapo « Introduction »

- **Titre :** TP1 · P2 — Backbone MPLS – Partie II
- **Sous-titre :** Activation de MPLS, LDP, LIB et LFIB
- **Texte :** Le backbone OSPF de la partie I est opérationnel. Il faut maintenant que les routeurs de l'opérateur commutent sur des labels : on active MPLS et le protocole de distribution de labels LDP.
- **Bouton :** « Commencer » → diapo suivante

## 2. Diapo « Objectifs »

- Forcer la loopback 0 comme router-ID LDP
- Activer MPLS sur toutes les interfaces physiques du domaine
- Vérifier les adjacences LDP
- Distinguer la LIB (show mpls ldp bindings) de la LFIB (show mpls forwarding-table)
- Relever les labels utilisés pour le préfixe 1.1.1.0/25

- **Boutons :** « Retour » · « Suivant »

## 3. Diapo « Environnement et topologie »

- **Capture à réaliser :** la topologie complète dans GNS3.
- **Légende / callouts** (un par équipement) :
  - **SP1** (PE) : Loopback0 : 1.1.1.1/25 · s1/1 → SIEGE : 192.168.12.0/24 · s1/2 → SP2 : 192.168.23.0/24
  - **SP2** (P) : Loopback0 : 2.2.2.2/25 · s1/2 → SP1 : 192.168.23.0/24 · s1/3 → SP3 : 192.168.34.0/24
  - **SP3** (PE) : Loopback0 : 3.3.3.3/25 · s1/3 → SP2 : 192.168.34.0/24 · s1/1 → AGENCE : 192.168.45.0/24
  - **SIEGE** (CE) : s1/1 : 192.168.12.2/24 · f0/0 : LAN SIEGE 10.10.10.0/24
  - **AGENCE** (CE) : s1/1 : 192.168.45.2/24 · f0/0 : LAN AGENCE 192.168.1.0/24
  - **LAN SIEGE** : 10.10.10.0/24
  - **LAN AGENCE** : 192.168.1.0/24
- **Matériel :** SP1, SP2, SP3

## 4. Manipulations (simulation logicielle)

> Pour chaque commande : une diapo avec la **capture de la console à l’invite indiquée**, une **zone de saisie (Text Entry)** placée sur la ligne de commande, et les feedbacks. Cochez *Insensible à la casse*. Ajoutez une diapo « Résultat » après la dernière commande de l’étape si une sortie est indiquée.

### Étape 1 — Forcer le router-ID LDP (SP1)

- **Diapo de contexte — texte :** LDP doit utiliser Loopback0 comme identifiant.

#### Diapo saisie 1 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1#`
- **Consigne (légende) :** « LDP doit utiliser Loopback0 comme identifiant. »
- **Réponse attendue (Text Entry) :** `configure terminal`
- **Abréviation à accepter aussi :** `conf t`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « mpls ldp router-id <interface> force »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `configure terminal` puis passer à la suite (0 point).

#### Diapo saisie 2 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config)#`
- **Consigne (légende) :** « LDP doit utiliser Loopback0 comme identifiant. »
- **Réponse attendue (Text Entry) :** `mpls ldp router-id loopback0 force`
- **Abréviation à accepter aussi :** `mpls ldp router-id lo0 force`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « mpls ldp router-id <interface> force »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `mpls ldp router-id loopback0 force` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Commande de configuration globale, à répéter sur SP2 et SP3. Le mot-clé force applique immédiatement le nouvel ID.

### Étape 2 — Activer MPLS vers SP2 (SP1)

- **Diapo de contexte — texte :** Activer MPLS sur l’interface physique du domaine MPLS.

#### Diapo saisie 3 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config)#`
- **Consigne (légende) :** « Activer MPLS sur l’interface physique du domaine MPLS. »
- **Réponse attendue (Text Entry) :** `interface serial1/2`
- **Abréviation à accepter aussi :** `int s1/2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « mpls ip, en mode interface. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface serial1/2` puis passer à la suite (0 point).

#### Diapo saisie 4 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-if)#`
- **Consigne (légende) :** « Activer MPLS sur l’interface physique du domaine MPLS. »
- **Réponse attendue (Text Entry) :** `mpls ip`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « mpls ip, en mode interface. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `mpls ip` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Seules les interfaces du backbone reçoivent « mpls ip ». L'interface vers SIEGE (client) n'en a pas besoin.

### Étape 3 — Activer MPLS sur SP2 (SP2)

- **Diapo de contexte — texte :** SP2 a deux interfaces dans le domaine MPLS.

#### Diapo saisie 5 — sur **SP2**

- **Capture :** console de SP2 affichant l’invite `SP2(config)#`
- **Consigne (légende) :** « SP2 a deux interfaces dans le domaine MPLS. »
- **Réponse attendue (Text Entry) :** `mpls ldp router-id loopback0 force`
- **Abréviation à accepter aussi :** `mpls ldp router-id lo0 force`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Deux interfaces série : s1/2 et s1/3. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `mpls ldp router-id loopback0 force` puis passer à la suite (0 point).

#### Diapo saisie 6 — sur **SP2**

- **Capture :** console de SP2 affichant l’invite `SP2(config)#`
- **Consigne (légende) :** « SP2 a deux interfaces dans le domaine MPLS. »
- **Réponse attendue (Text Entry) :** `interface serial1/2`
- **Abréviation à accepter aussi :** `int s1/2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Deux interfaces série : s1/2 et s1/3. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface serial1/2` puis passer à la suite (0 point).

#### Diapo saisie 7 — sur **SP2**

- **Capture :** console de SP2 affichant l’invite `SP2(config-if)#`
- **Consigne (légende) :** « SP2 a deux interfaces dans le domaine MPLS. »
- **Réponse attendue (Text Entry) :** `mpls ip`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Deux interfaces série : s1/2 et s1/3. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `mpls ip` puis passer à la suite (0 point).

#### Diapo saisie 8 — sur **SP2**

- **Capture :** console de SP2 affichant l’invite `SP2(config-if)#`
- **Consigne (légende) :** « SP2 a deux interfaces dans le domaine MPLS. »
- **Réponse attendue (Text Entry) :** `interface serial1/3`
- **Abréviation à accepter aussi :** `int s1/3`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Deux interfaces série : s1/2 et s1/3. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface serial1/3` puis passer à la suite (0 point).

#### Diapo saisie 9 — sur **SP2**

- **Capture :** console de SP2 affichant l’invite `SP2(config-if)#`
- **Consigne (légende) :** « SP2 a deux interfaces dans le domaine MPLS. »
- **Réponse attendue (Text Entry) :** `mpls ip`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Deux interfaces série : s1/2 et s1/3. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `mpls ip` puis passer à la suite (0 point).

#### Diapo résultat — étape 3

- **Capture :** la sortie réelle sur SP2. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
%LDP-5-NBRCHG: LDP Neighbor 1.1.1.1:0 (1) is UP
```


- **Explication (légende sur la diapo résultat) :** Un message console signale que les routeurs sont devenus adjacents via LDP. Terminez avec SP3 (router-ID + mpls ip sur s1/3).

### Étape 4 — Vérifier les adjacences LDP (SP2)

- **Diapo de contexte — texte :** SP2 doit voir SP1 et SP3.

#### Diapo saisie 10 — sur **SP2**

- **Capture :** console de SP2 affichant l’invite `SP2#`
- **Consigne (légende) :** « SP2 doit voir SP1 et SP3. »
- **Réponse attendue (Text Entry) :** `show mpls ldp neighbor`
- **Abréviation à accepter aussi :** `sh mpls ldp neighbor`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show mpls ldp neighbor »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show mpls ldp neighbor` puis passer à la suite (0 point).

#### Diapo résultat — étape 4

- **Capture :** la sortie réelle sur SP2. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
    Peer LDP Ident: 1.1.1.1:0; Local LDP Ident 2.2.2.2:0
        TCP connection: 1.1.1.1.646 - 2.2.2.2.xxxxx
        State: Oper; Msgs sent/rcvd: …
    Peer LDP Ident: 3.3.3.3:0; Local LDP Ident 2.2.2.2:0
        TCP connection: 3.3.3.3.xxxxx - 2.2.2.2.646
        State: Oper; Msgs sent/rcvd: …
```


- **Explication (légende sur la diapo résultat) :** Les identifiants LDP sont les loopbacks (x.x.x.x:0) : le router-ID forcé est bien pris en compte. State: Oper = session opérationnelle (TCP 646).

### Étape 5 — Interfaces MPLS de SP3 (SP3)

- **Diapo de contexte — texte :** Lister les interfaces où MPLS fonctionne.

#### Diapo saisie 11 — sur **SP3**

- **Capture :** console de SP3 affichant l’invite `SP3#`
- **Consigne (légende) :** « Lister les interfaces où MPLS fonctionne. »
- **Réponse attendue (Text Entry) :** `show mpls interfaces`
- **Abréviation à accepter aussi :** `sh mpls int`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show mpls interfaces »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show mpls interfaces` puis passer à la suite (0 point).

#### Diapo résultat — étape 5

- **Capture :** la sortie réelle sur SP3. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
Interface              IP            Tunnel   BGP Static Operational
Serial1/3              Yes (ldp)     No       No  No     Yes
```


- **Explication (légende sur la diapo résultat) :** Seule s1/3 (vers SP2) est dans le domaine MPLS. s1/1, vers AGENCE, est une interface client.

### Étape 6 — Lire la LFIB (SP3)

- **Diapo de contexte — texte :** Afficher la table de commutation des labels.

#### Diapo saisie 12 — sur **SP3**

- **Capture :** console de SP3 affichant l’invite `SP3#`
- **Consigne (légende) :** « Afficher la table de commutation des labels. »
- **Réponse attendue (Text Entry) :** `show mpls forwarding-table`
- **Abréviation à accepter aussi :** `sh mpls forwarding-table`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show mpls forwarding-table »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show mpls forwarding-table` puis passer à la suite (0 point).

#### Diapo résultat — étape 6

- **Capture :** la sortie réelle sur SP3. Sortie **illustrative** (valeurs à remplacer par les vôtres) :

```
Local  Outgoing    Prefix            Bytes Label  Outgoing   Next Hop
Label  Label       or Tunnel Id      Switched     interface
17     16          1.1.1.0/25        0            Se1/3      point2point
18     Pop Label   2.2.2.0/25        0            Se1/3      point2point
19     Pop Label   192.168.23.0/24   0            Se1/3      point2point
```


- **Explication (légende sur la diapo résultat) :** Pour 2.2.2.0/25, SP2 est le dernier saut avant la destination : il a annoncé un label implicit-null, d'où « Pop Label ». Les numéros (16, 17…) sont illustratifs.

### Étape 7 — Lire la LIB (SP3)

- **Diapo de contexte — texte :** Afficher toutes les associations préfixe ↔ label.

#### Diapo saisie 13 — sur **SP3**

- **Capture :** console de SP3 affichant l’invite `SP3#`
- **Consigne (légende) :** « Afficher toutes les associations préfixe ↔ label. »
- **Réponse attendue (Text Entry) :** `show mpls ldp bindings`
- **Abréviation à accepter aussi :** `sh mpls ldp bindings`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show mpls ldp bindings »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show mpls ldp bindings` puis passer à la suite (0 point).

#### Diapo résultat — étape 7

- **Capture :** la sortie réelle sur SP3. Sortie **illustrative** (valeurs à remplacer par les vôtres) :

```
  lib entry: 1.1.1.0/25, rev 6
        local binding:  label: 17
        remote binding: lsr: 2.2.2.2:0, label: 16
  lib entry: 3.3.3.0/25, rev 2
        local binding:  label: imp-null
        remote binding: lsr: 2.2.2.2:0, label: 18
```


- **Explication (légende sur la diapo résultat) :** La LIB montre le label local et les labels reçus de chaque voisin (remote binding). Pour son propre réseau 3.3.3.0/25, SP3 annonce imp-null.

## 5. Questions

### Diapo Q1 — Question du TP

**Question (texte affiché) :** Quelle commande affiche les adjacences LDP ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `show mpls ldp neighbor`
- `sh mpls ldp neighbor`
- `show mpls ldp neighbors`

- **Feedback correct :** « Bonne réponse. show mpls ldp neighbor vérifie que les adjacences ont été formées. »
- **Feedback incorrect :** « Réponse incorrecte. show mpls ldp neighbor vérifie que les adjacences ont été formées. »
- Score : 1 point · Tentatives : 2

### Diapo Q2 — Question du TP

**Question (texte affiché) :** Quelle commande affiche la LFIB ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] show mpls ldp bindings
- [x] show mpls forwarding-table
- [ ] show mpls interfaces
- [ ] show ip route

- **Feedback correct :** « Bonne réponse. show mpls forwarding-table → LFIB ; show mpls ldp bindings → LIB. »
- **Feedback incorrect :** « Réponse incorrecte. show mpls forwarding-table → LFIB ; show mpls ldp bindings → LIB. »
- Score : 1 point · Tentatives : 2

### Diapo Q3 — Question de notion

**Question (texte affiché) :** Quelle table contient aussi les labels reçus de voisins non utilisés pour commuter ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] La LFIB
- [x] La LIB
- [ ] La table de routage
- [ ] La table ARP

- **Feedback correct :** « Bonne réponse. La LIB stocke toutes les associations reçues ; la LFIB ne garde que celles du prochain saut retenu. »
- **Feedback incorrect :** « Réponse incorrecte. La LIB stocke toutes les associations reçues ; la LFIB ne garde que celles du prochain saut retenu. »
- Score : 1 point · Tentatives : 2

### Diapo Q4 — Question du TP

**Question (texte affiché) :** Pourquoi forcer le router-ID LDP sur la loopback 0 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Pour chiffrer LDP
- [x] Pour que l’ID reste inchangé malgré les changements de topologie et redémarrages
- [ ] Parce que LDP refuse les interfaces série
- [ ] Pour économiser des labels

- **Feedback correct :** « Bonne réponse. C'est la justification donnée par l'énoncé : un ID stable. »
- **Feedback incorrect :** « Réponse incorrecte. C'est la justification donnée par l'énoncé : un ID stable. »
- Score : 1 point · Tentatives : 2

### Diapo Q5 — Question de notion

**Question (texte affiché) :** Dans la LFIB de SP3, que signifie « Pop Label » pour 2.2.2.0/25 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Le paquet est rejeté
- [x] SP3 retire le label avant d’envoyer à SP2, qui est la destination
- [ ] SP3 ajoute deux labels
- [ ] LDP est en panne

- **Feedback correct :** « Bonne réponse. SP2 a annoncé implicit-null pour son propre réseau : l’avant-dernier saut retire le label (PHP). »
- **Feedback incorrect :** « Réponse incorrecte. SP2 a annoncé implicit-null pour son propre réseau : l’avant-dernier saut retire le label (PHP). »
- Score : 1 point · Tentatives : 2

### Diapo Q6 — Question de notion

**Question (texte affiché) :** Sur quelles interfaces faut-il taper « mpls ip » ?

**Interaction ActivePresenter :** Question à choix multiples — *plusieurs réponses*.

- [x] SP1 s1/2
- [ ] SP1 s1/1 (vers SIEGE)
- [x] SP2 s1/2 et s1/3
- [x] SP3 s1/3
- [ ] AGENCE s1/1

- **Feedback correct :** « Bonne réponse. Uniquement les interfaces physiques du domaine MPLS (entre SP1, SP2 et SP3). »
- **Feedback incorrect :** « Réponse incorrecte. Uniquement les interfaces physiques du domaine MPLS (entre SP1, SP2 et SP3). »
- Score : 1 point · Tentatives : 2

### Diapo Q7 — Question du TP

**Question (texte affiché) :** Pour 1.1.1.0/25, quel label local SP1 annonce-t-il à ses voisins ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Un label numérique ≥ 16
- [x] implicit-null (imp-null), car le réseau lui est directement connecté
- [ ] Aucun label
- [ ] Le label 0 explicite

- **Feedback correct :** « Bonne réponse. Un routeur annonce imp-null pour ses réseaux connectés. Les labels numériques choisis par SP2 et SP3 dépendent de l'exécution : relevez-les sur votre maquette. »
- **Feedback incorrect :** « Réponse incorrecte. Un routeur annonce imp-null pour ses réseaux connectés. Les labels numériques choisis par SP2 et SP3 dépendent de l'exécution : relevez-les sur votre maquette. »
- Score : 1 point · Tentatives : 2

## 6. Diapo bonus « Erreur classique » (optionnelle)

### Router-ID LDP automatique ou forcé

- **Contexte :** Le router-ID LDP identifie le routeur dans les sessions LDP.
- **Incorrect :**

```
! aucune commande mpls ldp router-id
```

  → L'ID est choisi automatiquement ; il peut changer au gré des changements de topologie ou des redémarrages.
- **Correct :**

```
mpls ldp router-id loopback0 force
```

  → L'ID LDP est l'adresse de Loopback0 et reste stable.
- **À retenir :** Forcer le router-ID LDP sur une loopback garantit des identifiants stables.

### Interface oubliée lors de l’activation MPLS

- **Contexte :** SP2 a deux liens dans le backbone.
- **Incorrect :**

```
interface serial1/2
 mpls ip
! s1/3 sans mpls ip
```

  → Pas d’adjacence LDP entre SP2 et SP3 : pas de labels échangés sur ce lien.
- **Correct :**

```
interface serial1/2
 mpls ip
interface serial1/3
 mpls ip
```

  → SP2 voit SP1 et SP3 comme voisins LDP.
- **À retenir :** MPLS doit être activé sur toutes les interfaces physiques du domaine.

## 7. Diapo « Résultat final »

- Afficher le score (variable *Score* du projet) et le pourcentage.
- Boutons : « Recommencer » (aller à la diapo 1) · « Revoir les erreurs ».
- *Optionnel* — remonter le score dans IT LAB : sur cette diapo, Événement « Au chargement » → action **Exécuter JavaScript** :

```
parent.postMessage({ source: 'itlab-ap', tp: 'mpls-backbone-p2', score: 1, max: 1 }, '*');
```

## 8. Notes sur l’énoncé

- L'énoncé demande les labels de 1.1.1.0/25 « sur papier » : les valeurs dépendent de votre exécution. Les numéros affichés ici sont illustratifs ; seule la structure (imp-null, Pop Label, swap) est générale.
- L'énoncé écrit « mpls ldp router-id interface force » : interface est à remplacer par loopback0.

---
Source : Énoncé TP1 – Partie II.

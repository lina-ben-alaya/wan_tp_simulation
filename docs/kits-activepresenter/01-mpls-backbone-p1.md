# Kit ActivePresenter — TP1 · P1 : Backbone MPLS – Partie I

> Kit de production pour réaliser **votre propre** simulation de ce TP dans ActivePresenter. Contenu issu de l’énoncé et de la plateforme IT LAB. Les sorties marquées *reconstituées* doivent être remplacées par **vos captures réelles** (GNS3 / Packet Tracer).

## 0. Paramètres du projet

| Réglage | Valeur |
|---|---|
| Nom du projet | `mpls-backbone-p1` |
| Taille | 1280 × 720 (ou la taille de vos captures), option *Responsive* activée |
| Auteur (Fichier → Propriétés du projet) | Lina Ben Alaya |
| Export | HTML5, dossier `mpls-backbone-p1` |
| Volume | 8 étapes · 21 saisies de commandes · 8 questions |
| Outils à ouvrir | GNS3, Cisco 7200 |

## 1. Diapo « Introduction »

- **Titre :** TP1 · P1 — Backbone MPLS – Partie I
- **Sous-titre :** OSPF dans le cœur opérateur, EIGRP chez le client
- **Texte :** Vous êtes ingénieur réseau chez un ISP. Des clients demandent un service MPLS : vous commencez par le cœur du réseau (le backbone). Le client possède deux sites, LAN SIEGE et LAN AGENCE, à raccorder via le backbone. Son réseau forme l'AS 100 et utilise EIGRP ; le backbone utilise OSPF (zone unique).
- **Bouton :** « Commencer » → diapo suivante

## 2. Diapo « Objectifs »

- Configurer les interfaces et les loopbacks selon le plan d’adressage
- Utiliser la loopback comme router-ID OSPF
- Déployer OSPF (Area 0) sur SP1, SP2 et SP3 et vérifier la connectivité
- Comprendre pourquoi annoncer la loopback avec son vrai masque (point-to-point)
- Configurer EIGRP AS 100 sur les routeurs CE et expliquer l’absence de voisins

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
- **Matériel :** SP1, SP2, SP3, SIEGE, AGENCE, SW1, SW2

## 4. Manipulations (simulation logicielle)

> Pour chaque commande : une diapo avec la **capture de la console à l’invite indiquée**, une **zone de saisie (Text Entry)** placée sur la ligne de commande, et les feedbacks. Cochez *Insensible à la casse*. Ajoutez une diapo « Résultat » après la dernière commande de l’étape si une sortie est indiquée.

### Étape 1 — Adresser l’interface vers SIEGE (SP1)

- **Diapo de contexte — texte :** Configurer s1/1 de SP1 dans 192.168.12.0/24 et l’activer.

#### Diapo saisie 1 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1#`
- **Consigne (légende) :** « Configurer s1/1 de SP1 dans 192.168.12.0/24 et l’activer. »
- **Réponse attendue (Text Entry) :** `configure terminal`
- **Abréviation à accepter aussi :** `conf t`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Entrez en mode configuration, sélectionnez serial1/1, puis ip address … et no shutdown. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `configure terminal` puis passer à la suite (0 point).

#### Diapo saisie 2 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config)#`
- **Consigne (légende) :** « Configurer s1/1 de SP1 dans 192.168.12.0/24 et l’activer. »
- **Réponse attendue (Text Entry) :** `interface serial1/1`
- **Abréviation à accepter aussi :** `int s1/1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Entrez en mode configuration, sélectionnez serial1/1, puis ip address … et no shutdown. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface serial1/1` puis passer à la suite (0 point).

#### Diapo saisie 3 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-if)#`
- **Consigne (légende) :** « Configurer s1/1 de SP1 dans 192.168.12.0/24 et l’activer. »
- **Réponse attendue (Text Entry) :** `ip address 192.168.12.1 255.255.255.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Entrez en mode configuration, sélectionnez serial1/1, puis ip address … et no shutdown. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip address 192.168.12.1 255.255.255.0` puis passer à la suite (0 point).

#### Diapo saisie 4 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-if)#`
- **Consigne (légende) :** « Configurer s1/1 de SP1 dans 192.168.12.0/24 et l’activer. »
- **Réponse attendue (Text Entry) :** `no shutdown`
- **Abréviation à accepter aussi :** `no shut`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Entrez en mode configuration, sélectionnez serial1/1, puis ip address … et no shutdown. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `no shutdown` puis passer à la suite (0 point).

#### Diapo résultat — étape 1

- **Capture :** la sortie réelle sur SP1. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
%LINK-3-UPDOWN: Interface Serial1/1, changed state to up
%LINEPROTO-5-UPDOWN: Line protocol on Interface Serial1/1, changed state to up
```


- **Explication (légende sur la diapo résultat) :** Chaque lien série a son propre réseau /24. Les interfaces Cisco sont désactivées par défaut : « no shutdown » est indispensable. L'adresse hôte .1 côté SP1 est cohérente avec le TP2 (SIEGE = 192.168.12.2).

### Étape 2 — Créer la loopback de SP1 (SP1)

- **Diapo de contexte — texte :** Loopback0 = 1.1.1.1/25 (futur router-ID OSPF).

#### Diapo saisie 5 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config)#`
- **Consigne (légende) :** « Loopback0 = 1.1.1.1/25 (futur router-ID OSPF). »
- **Réponse attendue (Text Entry) :** `interface loopback0`
- **Abréviation à accepter aussi :** `int lo0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « /25 → 255.255.255.128 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface loopback0` puis passer à la suite (0 point).

#### Diapo saisie 6 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-if)#`
- **Consigne (légende) :** « Loopback0 = 1.1.1.1/25 (futur router-ID OSPF). »
- **Réponse attendue (Text Entry) :** `ip address 1.1.1.1 255.255.255.128`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « /25 → 255.255.255.128 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip address 1.1.1.1 255.255.255.128` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Un /25 correspond au masque 255.255.255.128. La loopback est toujours « up ».

### Étape 3 — Vérifier le lien point à point SIEGE–SP1 (SIEGE)

- **Diapo de contexte — texte :** Tester la connectivité directe avant tout routage.

#### Diapo saisie 7 — sur **SIEGE**

- **Capture :** console de SIEGE affichant l’invite `SIEGE#`
- **Consigne (légende) :** « Tester la connectivité directe avant tout routage. »
- **Réponse attendue (Text Entry) :** `ping 192.168.12.1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ping suivi de l’adresse de SP1 sur le lien. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ping 192.168.12.1` puis passer à la suite (0 point).

#### Diapo résultat — étape 3

- **Capture :** la sortie réelle sur SIEGE. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.12.1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5)
```


- **Explication (légende sur la diapo résultat) :** Un réseau directement connecté est joignable sans protocole de routage. Faites de même entre AGENCE et SP3.

### Étape 4 — Activer OSPF sur SP1 (SP1)

- **Diapo de contexte — texte :** Annoncer la loopback et le lien vers SP2 dans l’Area 0.

#### Diapo saisie 8 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config)#`
- **Consigne (légende) :** « Annoncer la loopback et le lien vers SP2 dans l’Area 0. »
- **Réponse attendue (Text Entry) :** `router ospf 1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router ospf <id> puis network <réseau> <wildcard> area 0. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router ospf 1` puis passer à la suite (0 point).

#### Diapo saisie 9 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-router)#`
- **Consigne (légende) :** « Annoncer la loopback et le lien vers SP2 dans l’Area 0. »
- **Réponse attendue (Text Entry) :** `network 1.1.1.0 0.0.0.127 area 0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router ospf <id> puis network <réseau> <wildcard> area 0. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 1.1.1.0 0.0.0.127 area 0` puis passer à la suite (0 point).

#### Diapo saisie 10 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-router)#`
- **Consigne (légende) :** « Annoncer la loopback et le lien vers SP2 dans l’Area 0. »
- **Réponse attendue (Text Entry) :** `network 192.168.23.0 0.0.0.255 area 0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router ospf <id> puis network <réseau> <wildcard> area 0. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 192.168.23.0 0.0.0.255 area 0` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** OSPF utilise des masques génériques (wildcard) : 0.0.0.127 pour un /25. Le lien vers SIEGE n'est pas annoncé : il appartient au client. L'adresse de la loopback devient le router-ID.

### Étape 5 — Activer OSPF sur SP2 (SP2)

- **Diapo de contexte — texte :** SP2 annonce sa loopback et ses deux liens de backbone.

#### Diapo saisie 11 — sur **SP2**

- **Capture :** console de SP2 affichant l’invite `SP2(config)#`
- **Consigne (légende) :** « SP2 annonce sa loopback et ses deux liens de backbone. »
- **Réponse attendue (Text Entry) :** `router ospf 1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Trois commandes network : loopback, lien vers SP1, lien vers SP3. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router ospf 1` puis passer à la suite (0 point).

#### Diapo saisie 12 — sur **SP2**

- **Capture :** console de SP2 affichant l’invite `SP2(config-router)#`
- **Consigne (légende) :** « SP2 annonce sa loopback et ses deux liens de backbone. »
- **Réponse attendue (Text Entry) :** `network 2.2.2.0 0.0.0.127 area 0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Trois commandes network : loopback, lien vers SP1, lien vers SP3. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 2.2.2.0 0.0.0.127 area 0` puis passer à la suite (0 point).

#### Diapo saisie 13 — sur **SP2**

- **Capture :** console de SP2 affichant l’invite `SP2(config-router)#`
- **Consigne (légende) :** « SP2 annonce sa loopback et ses deux liens de backbone. »
- **Réponse attendue (Text Entry) :** `network 192.168.23.0 0.0.0.255 area 0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Trois commandes network : loopback, lien vers SP1, lien vers SP3. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 192.168.23.0 0.0.0.255 area 0` puis passer à la suite (0 point).

#### Diapo saisie 14 — sur **SP2**

- **Capture :** console de SP2 affichant l’invite `SP2(config-router)#`
- **Consigne (légende) :** « SP2 annonce sa loopback et ses deux liens de backbone. »
- **Réponse attendue (Text Entry) :** `network 192.168.34.0 0.0.0.255 area 0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Trois commandes network : loopback, lien vers SP1, lien vers SP3. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 192.168.34.0 0.0.0.255 area 0` puis passer à la suite (0 point).

#### Diapo résultat — étape 5

- **Capture :** la sortie réelle sur SP2. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
%OSPF-5-ADJCHG: Process 1, Nbr 1.1.1.1 on Serial1/2 from LOADING to FULL, Loading Done
```


- **Explication (légende sur la diapo résultat) :** L'adjacence OSPF avec SP1 passe à l'état FULL : les bases de données sont synchronisées. Configurez ensuite SP3 (3.3.3.0/25 et 192.168.34.0/24).

### Étape 6 — Annoncer le vrai masque de la loopback (SP1)

- **Diapo de contexte — texte :** Forcer OSPF à annoncer 1.1.1.0/25 au lieu de 1.1.1.1/32.

#### Diapo saisie 15 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config)#`
- **Consigne (légende) :** « Forcer OSPF à annoncer 1.1.1.0/25 au lieu de 1.1.1.1/32. »
- **Réponse attendue (Text Entry) :** `interface loopback0`
- **Abréviation à accepter aussi :** `int lo0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « La commande se tape en mode interface, sur la loopback. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface loopback0` puis passer à la suite (0 point).

#### Diapo saisie 16 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-if)#`
- **Consigne (légende) :** « Forcer OSPF à annoncer 1.1.1.0/25 au lieu de 1.1.1.1/32. »
- **Réponse attendue (Text Entry) :** `ip ospf network point-to-point`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « La commande se tape en mode interface, sur la loopback. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip ospf network point-to-point` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** À répéter sur chaque loopback (SP1, SP2, SP3). Sinon OSPF annonce une route /32, ce qui pose problème dans un environnement MPLS.

### Étape 7 — Vérifier la table de routage (SP3)

- **Diapo de contexte — texte :** Les loopbacks distantes apparaissent en /25 avec le code O.

#### Diapo saisie 17 — sur **SP3**

- **Capture :** console de SP3 affichant l’invite `SP3#`
- **Consigne (légende) :** « Les loopbacks distantes apparaissent en /25 avec le code O. »
- **Réponse attendue (Text Entry) :** `show ip route`
- **Abréviation à accepter aussi :** `sh ip route`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show ip route »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show ip route` puis passer à la suite (0 point).

#### Diapo résultat — étape 7

- **Capture :** la sortie réelle sur SP3. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
Codes: C - connected, O - OSPF, D - EIGRP ...

     1.0.0.0/25 is subnetted, 1 subnets
O       1.1.1.0 [110/129] via 192.168.34.2, Serial1/3
     2.0.0.0/25 is subnetted, 1 subnets
O       2.2.2.0 [110/65] via 192.168.34.2, Serial1/3
     3.0.0.0/25 is subnetted, 1 subnets
C       3.3.3.0 is directly connected, Loopback0
O    192.168.23.0/24 [110/128] via 192.168.34.2, Serial1/3
C    192.168.34.0/24 is directly connected, Serial1/3
C    192.168.45.0/24 is directly connected, Serial1/1
```


- **Explication (légende sur la diapo résultat) :** Le code O indique une route OSPF ; [110/x] = distance administrative 110 / coût. Les loopbacks sont bien en /25. Les métriques exactes dépendent de la bande passante des liens.

### Étape 8 — Configurer EIGRP AS 100 sur SIEGE (SIEGE)

- **Diapo de contexte — texte :** Annoncer le LAN SIEGE et le lien vers SP1.

#### Diapo saisie 18 — sur **SIEGE**

- **Capture :** console de SIEGE affichant l’invite `SIEGE(config)#`
- **Consigne (légende) :** « Annoncer le LAN SIEGE et le lien vers SP1. »
- **Réponse attendue (Text Entry) :** `router eigrp 100`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router eigrp 100, puis network pour chaque réseau du client. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router eigrp 100` puis passer à la suite (0 point).

#### Diapo saisie 19 — sur **SIEGE**

- **Capture :** console de SIEGE affichant l’invite `SIEGE(config-router)#`
- **Consigne (légende) :** « Annoncer le LAN SIEGE et le lien vers SP1. »
- **Réponse attendue (Text Entry) :** `network 10.10.10.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router eigrp 100, puis network pour chaque réseau du client. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 10.10.10.0` puis passer à la suite (0 point).

#### Diapo saisie 20 — sur **SIEGE**

- **Capture :** console de SIEGE affichant l’invite `SIEGE(config-router)#`
- **Consigne (légende) :** « Annoncer le LAN SIEGE et le lien vers SP1. »
- **Réponse attendue (Text Entry) :** `network 192.168.12.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router eigrp 100, puis network pour chaque réseau du client. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 192.168.12.0` puis passer à la suite (0 point).

#### Diapo saisie 21 — sur **SIEGE**

- **Capture :** console de SIEGE affichant l’invite `SIEGE(config-router)#`
- **Consigne (légende) :** « Annoncer le LAN SIEGE et le lien vers SP1. »
- **Réponse attendue (Text Entry) :** `no auto-summary`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router eigrp 100, puis network pour chaque réseau du client. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `no auto-summary` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Même chose sur AGENCE (192.168.1.0 et 192.168.45.0). Aucun voisin n'apparaît : SP1 et SP3 ne participent pas encore à l'AS 100. C'est le résultat attendu.

## 5. Questions

### Diapo Q1 — Question de notion

**Question (texte affiché) :** Quel est le rôle de SIEGE et AGENCE dans cette architecture ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] P (Provider)
- [ ] PE (Provider Edge)
- [x] CE (Customer Edge)
- [ ] ASBR

- **Feedback correct :** « Bonne réponse. L'énoncé l'indique : AGENCE et SIEGE sont des routeurs CE, ils appartiennent au client. »
- **Feedback incorrect :** « Réponse incorrecte. L'énoncé l'indique : AGENCE et SIEGE sont des routeurs CE, ils appartiennent au client. »
- Score : 1 point · Tentatives : 2

### Diapo Q2 — Question de notion

**Question (texte affiché) :** Quel masque décimal correspond au /25 des loopbacks ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `255.255.255.128`

- **Feedback correct :** « Bonne réponse. /25 = 25 bits à 1 → 255.255.255.128 ; la wildcard OSPF correspondante est 0.0.0.127. »
- **Feedback incorrect :** « Réponse incorrecte. /25 = 25 bits à 1 → 255.255.255.128 ; la wildcard OSPF correspondante est 0.0.0.127. »
- Score : 1 point · Tentatives : 2

### Diapo Q3 — Question du TP

**Question (texte affiché) :** Sans « ip ospf network point-to-point », avec quelle longueur de préfixe OSPF annonce-t-il la loopback ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] /24
- [ ] /25
- [x] /32
- [ ] /30

- **Feedback correct :** « Bonne réponse. Le type de réseau par défaut d'une loopback fait annoncer une route d'hôte /32, ce qui cause des problèmes dans les environnements MPLS. »
- **Feedback incorrect :** « Réponse incorrecte. Le type de réseau par défaut d'une loopback fait annoncer une route d'hôte /32, ce qui cause des problèmes dans les environnements MPLS. »
- Score : 1 point · Tentatives : 2

### Diapo Q4 — Question de notion

**Question (texte affiché) :** Pourquoi utiliser l’adresse de la loopback comme router-ID ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Elle est plus rapide que les interfaces physiques
- [x] Elle reste active tant que le routeur fonctionne : l’identifiant est stable
- [ ] OSPF ne fonctionne pas sans loopback
- [ ] Elle évite de configurer des réseaux network

- **Feedback correct :** « Bonne réponse. Une loopback ne tombe pas avec un lien physique : le router-ID ne change pas lors des changements de topologie. »
- **Feedback incorrect :** « Réponse incorrecte. Une loopback ne tombe pas avec un lien physique : le router-ID ne change pas lors des changements de topologie. »
- Score : 1 point · Tentatives : 2

### Diapo Q5 — Question du TP

**Question (texte affiché) :** Après l’étape 3, les voisins EIGRP SIEGE ↔ AGENCE sont-ils établis ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Oui, immédiatement
- [x] Non, pas tant que MPLS n’est pas en place sur SP1 et SP3
- [ ] Oui, via OSPF
- [ ] Seulement après un reload

- **Feedback correct :** « Bonne réponse. Les deux CE ne sont pas adjacents : le backbone ne transporte pas encore leur AS. MPLS sera ajouté dans la partie II puis le VPN au TP2. »
- **Feedback incorrect :** « Réponse incorrecte. Les deux CE ne sont pas adjacents : le backbone ne transporte pas encore leur AS. MPLS sera ajouté dans la partie II puis le VPN au TP2. »
- Score : 1 point · Tentatives : 2

### Diapo Q6 — Question de notion

**Question (texte affiché) :** Complétez : network 192.168.23.0 ____ area 0

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `0.0.0.255`

- **Feedback correct :** « Bonne réponse. Le lien est un /24 : la wildcard est 0.0.0.255. »
- **Feedback incorrect :** « Réponse incorrecte. Le lien est un /24 : la wildcard est 0.0.0.255. »
- Score : 1 point · Tentatives : 2

### Diapo Q7 — Question de notion

**Question (texte affiché) :** Remettez les étapes du TP dans l’ordre.

**Interaction ActivePresenter :** Question de séquence (Sequence). Ordre correct :

1. Adressage des interfaces et loopbacks
2. Tests point à point
3. OSPF dans le backbone
4. ip ospf network point-to-point sur les loopbacks
5. EIGRP sur les CE

- **Feedback correct :** « Bonne réponse. On valide chaque couche avant la suivante : adressage, connectivité directe, IGP opérateur, puis réseau client. »
- **Feedback incorrect :** « Réponse incorrecte. On valide chaque couche avant la suivante : adressage, connectivité directe, IGP opérateur, puis réseau client. »
- Score : 1 point · Tentatives : 2

### Diapo Q8 — Question de notion

**Question (texte affiché) :** Dans « O 1.1.1.0 [110/129] », que représente 110 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Le coût OSPF
- [x] La distance administrative d’OSPF
- [ ] Le numéro de processus
- [ ] Le délai en ms

- **Feedback correct :** « Bonne réponse. Entre crochets : [distance administrative / métrique]. 110 est la distance administrative par défaut d’OSPF. »
- **Feedback incorrect :** « Réponse incorrecte. Entre crochets : [distance administrative / métrique]. 110 est la distance administrative par défaut d’OSPF. »
- Score : 1 point · Tentatives : 2

## 6. Diapo bonus « Erreur classique » (optionnelle)

### Loopback annoncée en /32 ou en /25

- **Contexte :** SP1 annonce sa Loopback0 (1.1.1.1/25) dans OSPF.
- **Incorrect :**

```
interface Loopback0
 ip address 1.1.1.1 255.255.255.128
! (type de réseau OSPF par défaut)
```

  → Les autres routeurs apprennent 1.1.1.1/32. Le préfixe ne correspond plus au réseau connecté 1.1.1.0/25 de SP1 : problèmes en environnement MPLS.
- **Correct :**

```
interface Loopback0
 ip address 1.1.1.1 255.255.255.128
 ip ospf network point-to-point
```

  → OSPF annonce 1.1.1.0/25 : les tables de routage (et plus tard les labels) portent sur le même préfixe.
- **À retenir :** Sur une loopback, OSPF annonce /32 par défaut ; « ip ospf network point-to-point » fait annoncer le vrai masque.

## 7. Diapo « Résultat final »

- Afficher le score (variable *Score* du projet) et le pourcentage.
- Boutons : « Recommencer » (aller à la diapo 1) · « Revoir les erreurs ».
- *Optionnel* — remonter le score dans IT LAB : sur cette diapo, Événement « Au chargement » → action **Exécuter JavaScript** :

```
parent.postMessage({ source: 'itlab-ap', tp: 'mpls-backbone-p1', score: 1, max: 1 }, '*');
```

## 8. Notes sur l’énoncé

- L'énoncé ne précise pas les adresses hôtes des liens de backbone : la plateforme utilise .1/.2 (SP1–SP2) et .2/.3 (SP2–SP3). Les adresses PE–CE (.1 côté SP, .2 côté CE) sont cohérentes avec le TP2.

---
Source : Énoncé TP1 – Partie I.

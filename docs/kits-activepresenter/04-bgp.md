# Kit ActivePresenter — TP BGP : Configuration de BGP

> Kit de production pour réaliser **votre propre** simulation de ce TP dans ActivePresenter. Contenu issu de l’énoncé et de la plateforme IT LAB. Les sorties marquées *reconstituées* doivent être remplacées par **vos captures réelles** (GNS3 / Packet Tracer).

## 0. Paramètres du projet

| Réglage | Valeur |
|---|---|
| Nom du projet | `bgp` |
| Taille | 1280 × 720 (ou la taille de vos captures), option *Responsive* activée |
| Auteur (Fichier → Propriétés du projet) | Lina Ben Alaya |
| Export | HTML5, dossier `bgp` |
| Volume | 7 étapes · 19 saisies de commandes · 10 questions |
| Outils à ouvrir | Routeurs Cisco 1841 (ou GNS3), Émulateur de terminal |

## 1. Diapo « Introduction »

- **Titre :** TP BGP — Configuration de BGP
- **Sous-titre :** Route par défaut côté client, eBGP entre deux FAI
- **Texte :** Une petite société a besoin d’un accès à Internet et le demande à son FAI local (ISP1). ISP1 se connecte à l’Internet via ISP2 à l’aide de BGP4, le protocole de routage le plus courant entre FAI.
- **Bouton :** « Commencer » → diapo suivante

## 2. Diapo « Objectifs »

- Configurer le routeur client avec une route par défaut vers ISP1
- Configurer sur ISP1 une route statique de retour vers le réseau client
- Configurer eBGP entre ISP1 (AS 100) et ISP2 (AS 200)
- Lire show ip route et show ip bgp

- **Boutons :** « Retour » · « Suivant »

## 3. Diapo « Environnement et topologie »

- **Capture à réaliser :** la topologie complète dans Routeurs Cisco 1841 (ou GNS3).
- **Légende / callouts** (un par équipement) :
  - **ISP1** (FAI) : s0/0/0 : 10.10.10.2/24 · s0/0/1 : 172.16.1.1/24 · Loopback0 : 192.168.100.1/24
  - **ISP2** (FAI) : s0/0/0 : 172.16.1.2/24 · Loopback0 : 192.168.200.1/24
  - **CR** (Client) : s0/0/0 : 10.10.10.1/24 · Fa0/0 : 192.168.1.1/24
  - **Switch** : —
  - **Hôte** : 192.168.1.0/24 · Passerelle : 192.168.1.1
- **Matériel :** CR, ISP1, ISP2, PC hôte, Commutateur

## 4. Manipulations (simulation logicielle)

> Pour chaque commande : une diapo avec la **capture de la console à l’invite indiquée**, une **zone de saisie (Text Entry)** placée sur la ligne de commande, et les feedbacks. Cochez *Insensible à la casse*. Ajoutez une diapo « Résultat » après la dernière commande de l’étape si une sortie est indiquée.

### Étape 1 — Loopback d’ISP1 (ISP1)

- **Diapo de contexte — texte :** Simuler un réseau réel 192.168.100.0/24.

#### Diapo saisie 1 — sur **ISP1**

- **Capture :** console de ISP1 affichant l’invite `ISP1>`
- **Consigne (légende) :** « Simuler un réseau réel 192.168.100.0/24. »
- **Réponse attendue (Text Entry) :** `enable`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface loopback0 puis ip address … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `enable` puis passer à la suite (0 point).

#### Diapo saisie 2 — sur **ISP1**

- **Capture :** console de ISP1 affichant l’invite `ISP1#`
- **Consigne (légende) :** « Simuler un réseau réel 192.168.100.0/24. »
- **Réponse attendue (Text Entry) :** `configure terminal`
- **Abréviation à accepter aussi :** `conf t`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface loopback0 puis ip address … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `configure terminal` puis passer à la suite (0 point).

#### Diapo saisie 3 — sur **ISP1**

- **Capture :** console de ISP1 affichant l’invite `ISP1(config)#`
- **Consigne (légende) :** « Simuler un réseau réel 192.168.100.0/24. »
- **Réponse attendue (Text Entry) :** `interface loopback0`
- **Abréviation à accepter aussi :** `int lo0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface loopback0 puis ip address … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface loopback0` puis passer à la suite (0 point).

#### Diapo saisie 4 — sur **ISP1**

- **Capture :** console de ISP1 affichant l’invite `ISP1(config-if)#`
- **Consigne (légende) :** « Simuler un réseau réel 192.168.100.0/24. »
- **Réponse attendue (Text Entry) :** `ip address 192.168.100.1 255.255.255.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface loopback0 puis ip address … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip address 192.168.100.1 255.255.255.0` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Une interface de bouclage est une interface virtuelle qui simule un réseau réel à des fins de tests. Même chose sur ISP2 avec 192.168.200.1/24.

### Étape 2 — Route par défaut sur CR (CR)

- **Diapo de contexte — texte :** Envoyer tout trafic inconnu vers ISP1.

#### Diapo saisie 5 — sur **CR**

- **Capture :** console de CR affichant l’invite `CR(config)#`
- **Consigne (légende) :** « Envoyer tout trafic inconnu vers ISP1. »
- **Réponse attendue (Text Entry) :** `ip route 0.0.0.0 0.0.0.0 10.10.10.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip route 0.0.0.0 0.0.0.0 <prochain saut> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip route 0.0.0.0 0.0.0.0 10.10.10.2` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** 0.0.0.0 0.0.0.0 correspond à toutes les destinations. Le prochain saut est l’interface d’ISP1 sur le lien.

### Étape 3 — Route de retour sur ISP1 (ISP1)

- **Diapo de contexte — texte :** ISP1 doit savoir joindre 192.168.1.0/24.

#### Diapo saisie 6 — sur **ISP1**

- **Capture :** console de ISP1 affichant l’invite `ISP1(config)#`
- **Consigne (légende) :** « ISP1 doit savoir joindre 192.168.1.0/24. »
- **Réponse attendue (Text Entry) :** `ip route 192.168.1.0 255.255.255.0 10.10.10.1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip route <réseau client> <masque> <adresse de CR> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip route 192.168.1.0 255.255.255.0 10.10.10.1` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Sans cette route, les réponses ne reviennent pas vers le LAN client. Testez ensuite le ping de l'hôte vers 10.10.10.2.

### Étape 4 — BGP sur ISP1 (AS 100) (ISP1)

- **Diapo de contexte — texte :** Voisin ISP2 et annonce de deux réseaux.

#### Diapo saisie 7 — sur **ISP1**

- **Capture :** console de ISP1 affichant l’invite `ISP1(config)#`
- **Consigne (légende) :** « Voisin ISP2 et annonce de deux réseaux. »
- **Réponse attendue (Text Entry) :** `router bgp 100`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 100, neighbor … remote-as 200, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router bgp 100` puis passer à la suite (0 point).

#### Diapo saisie 8 — sur **ISP1**

- **Capture :** console de ISP1 affichant l’invite `ISP1(config-router)#`
- **Consigne (légende) :** « Voisin ISP2 et annonce de deux réseaux. »
- **Réponse attendue (Text Entry) :** `neighbor 172.16.1.2 remote-as 200`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 100, neighbor … remote-as 200, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `neighbor 172.16.1.2 remote-as 200` puis passer à la suite (0 point).

#### Diapo saisie 9 — sur **ISP1**

- **Capture :** console de ISP1 affichant l’invite `ISP1(config-router)#`
- **Consigne (légende) :** « Voisin ISP2 et annonce de deux réseaux. »
- **Réponse attendue (Text Entry) :** `network 192.168.1.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 100, neighbor … remote-as 200, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 192.168.1.0` puis passer à la suite (0 point).

#### Diapo saisie 10 — sur **ISP1**

- **Capture :** console de ISP1 affichant l’invite `ISP1(config-router)#`
- **Consigne (légende) :** « Voisin ISP2 et annonce de deux réseaux. »
- **Réponse attendue (Text Entry) :** `network 192.168.100.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 100, neighbor … remote-as 200, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 192.168.100.0` puis passer à la suite (0 point).

#### Diapo saisie 11 — sur **ISP1**

- **Capture :** console de ISP1 affichant l’invite `ISP1(config-router)#`
- **Consigne (légende) :** « Voisin ISP2 et annonce de deux réseaux. »
- **Réponse attendue (Text Entry) :** `end`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 100, neighbor … remote-as 200, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `end` puis passer à la suite (0 point).

#### Diapo saisie 12 — sur **ISP1**

- **Capture :** console de ISP1 affichant l’invite `ISP1#`
- **Consigne (légende) :** « Voisin ISP2 et annonce de deux réseaux. »
- **Réponse attendue (Text Entry) :** `copy running-config startup-config`
- **Abréviation à accepter aussi :** `copy run start`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 100, neighbor … remote-as 200, network … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `copy running-config startup-config` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** ISP1 annonce le réseau du client (présent dans sa table grâce à la route statique) et sa loopback.

### Étape 5 — BGP sur ISP2 (AS 200) (ISP2)

- **Diapo de contexte — texte :** Voisin ISP1 et annonce de 192.168.200.0.

#### Diapo saisie 13 — sur **ISP2**

- **Capture :** console de ISP2 affichant l’invite `ISP2(config)#`
- **Consigne (légende) :** « Voisin ISP1 et annonce de 192.168.200.0. »
- **Réponse attendue (Text Entry) :** `router bgp 200`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 200 … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router bgp 200` puis passer à la suite (0 point).

#### Diapo saisie 14 — sur **ISP2**

- **Capture :** console de ISP2 affichant l’invite `ISP2(config-router)#`
- **Consigne (légende) :** « Voisin ISP1 et annonce de 192.168.200.0. »
- **Réponse attendue (Text Entry) :** `neighbor 172.16.1.1 remote-as 100`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 200 … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `neighbor 172.16.1.1 remote-as 100` puis passer à la suite (0 point).

#### Diapo saisie 15 — sur **ISP2**

- **Capture :** console de ISP2 affichant l’invite `ISP2(config-router)#`
- **Consigne (légende) :** « Voisin ISP1 et annonce de 192.168.200.0. »
- **Réponse attendue (Text Entry) :** `network 192.168.200.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 200 … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 192.168.200.0` puis passer à la suite (0 point).

#### Diapo saisie 16 — sur **ISP2**

- **Capture :** console de ISP2 affichant l’invite `ISP2(config-router)#`
- **Consigne (légende) :** « Voisin ISP1 et annonce de 192.168.200.0. »
- **Réponse attendue (Text Entry) :** `end`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 200 … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `end` puis passer à la suite (0 point).

#### Diapo saisie 17 — sur **ISP2**

- **Capture :** console de ISP2 affichant l’invite `ISP2#`
- **Consigne (légende) :** « Voisin ISP1 et annonce de 192.168.200.0. »
- **Réponse attendue (Text Entry) :** `copy running-config startup-config`
- **Abréviation à accepter aussi :** `copy run start`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 200 … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `copy running-config startup-config` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Chaque côté déclare l’AS de l’autre : remote-as 100 ici, remote-as 200 sur ISP1.

### Étape 6 — Table de routage d’ISP2 (ISP2)

- **Diapo de contexte — texte :** Repérer les routes BGP.

#### Diapo saisie 18 — sur **ISP2**

- **Capture :** console de ISP2 affichant l’invite `ISP2#`
- **Consigne (légende) :** « Repérer les routes BGP. »
- **Réponse attendue (Text Entry) :** `show ip route`
- **Abréviation à accepter aussi :** `sh ip route`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show ip route »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show ip route` puis passer à la suite (0 point).

#### Diapo résultat — étape 6

- **Capture :** la sortie réelle sur ISP2. Sortie extraite de l’énoncé :

```
Gateway of last resort is not set

     172.16.0.0/24 is subnetted, 1 subnets
C       172.16.1.0 is directly connected, Serial0/0
C    192.168.200.0/24 is directly connected, Loopback0
B    192.168.1.0/24 [20/0] via 172.16.1.1, 00:40:38
B    192.168.100.0/24 [20/0] via 172.16.1.1, 00:40:38
```


- **Explication (légende sur la diapo résultat) :** Les lignes B sont des routes apprises par BGP, annoncées par ISP1 (172.16.1.1). 20 = distance administrative de l’eBGP.

### Étape 7 — Table BGP d’ISP1 (ISP1)

- **Diapo de contexte — texte :** Interpréter show ip bgp.

#### Diapo saisie 19 — sur **ISP1**

- **Capture :** console de ISP1 affichant l’invite `ISP1#`
- **Consigne (légende) :** « Interpréter show ip bgp. »
- **Réponse attendue (Text Entry) :** `show ip bgp`
- **Abréviation à accepter aussi :** `sh ip bgp`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show ip bgp »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show ip bgp` puis passer à la suite (0 point).

#### Diapo résultat — étape 7

- **Capture :** la sortie réelle sur ISP1. Sortie extraite de l’énoncé :

```
BGP table version is 4, local router ID is 192.168.100.1
Status codes: s suppressed, d damped, h history, * valid, > best, i - internal
Origin codes: i - IGP, e - EGP, ? - incomplete

   Network          Next Hop     Metric LocPrf Weight Path
*> 192.168.1.0      10.10.10.1        0         32768 i
*> 192.168.100.0    0.0.0.0           0         32768 i
*> 192.168.200.0    172.16.1.2        0             0 200 i
```


- **Explication (légende sur la diapo résultat) :** 192.168.200.0 vient de l’AS 200 (Path « 200 i »). Les deux autres sont d’origine locale (Weight 32768).

## 5. Questions

### Diapo Q1 — Question du TP

**Question (texte affiché) :** Avant toute route, CR peut-il atteindre ISP2 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Oui
- [x] Non

- **Feedback correct :** « Bonne réponse. Sans route ni protocole de routage, CR ne connaît que ses réseaux directement connectés. »
- **Feedback incorrect :** « Réponse incorrecte. Sans route ni protocole de routage, CR ne connaît que ses réseaux directement connectés. »
- Score : 1 point · Tentatives : 2

### Diapo Q2 — Question du TP

**Question (texte affiché) :** Le réseau 192.168.1.0 est-il dans la table de routage d’ISP2 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [x] Oui
- [ ] Non

- **Feedback correct :** « Bonne réponse. Il apparaît en B, via 172.16.1.1. »
- **Feedback incorrect :** « Réponse incorrecte. Il apparaît en B, via 172.16.1.1. »
- Score : 1 point · Tentatives : 2

### Diapo Q3 — Question du TP

**Question (texte affiché) :** Quelle lettre se trouve à gauche de l’entrée 192.168.1.0 dans la table d’ISP2 ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `B`

- **Feedback correct :** « Bonne réponse. B = route apprise par BGP. »
- **Feedback incorrect :** « Réponse incorrecte. B = route apprise par BGP. »
- Score : 1 point · Tentatives : 2

### Diapo Q4 — Question du TP

**Question (texte affiché) :** Que signifie cette lettre ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Route statique
- [x] Route apprise par BGP
- [ ] Route par défaut
- [ ] Réseau connecté

- **Feedback correct :** « Bonne réponse. Voir les codes : B - BGP. »
- **Feedback incorrect :** « Réponse incorrecte. Voir les codes : B - BGP. »
- Score : 1 point · Tentatives : 2

### Diapo Q5 — Question du TP

**Question (texte affiché) :** Quel routeur a annoncé le réseau 192.168.1.0 à ISP2 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] CR
- [x] ISP1 (172.16.1.1)
- [ ] ISP2 lui-même
- [ ] Le PC hôte

- **Feedback correct :** « Bonne réponse. ISP1 l’annonce via la commande network 192.168.1.0. »
- **Feedback incorrect :** « Réponse incorrecte. ISP1 l’annonce via la commande network 192.168.1.0. »
- Score : 1 point · Tentatives : 2

### Diapo Q6 — Question du TP

**Question (texte affiché) :** Quel réseau ISP2 signale-t-il à ISP1 ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `192.168.200.0`
- `192.168.200.0/24`

- **Feedback correct :** « Bonne réponse. ISP2 annonce uniquement 192.168.200.0/24. »
- **Feedback incorrect :** « Réponse incorrecte. ISP2 annonce uniquement 192.168.200.0/24. »
- Score : 1 point · Tentatives : 2

### Diapo Q7 — Question du TP

**Question (texte affiché) :** Comment le réseau 192.168.1.0 est-il connu d’ISP1 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Par BGP depuis CR
- [x] Par une route statique (S) vers 10.10.10.1
- [ ] Par OSPF
- [ ] Il est directement connecté

- **Feedback correct :** « Bonne réponse. Route statique configurée à l’étape 2 ; elle permet ensuite à BGP de l’annoncer. »
- **Feedback incorrect :** « Réponse incorrecte. Route statique configurée à l’étape 2 ; elle permet ensuite à BGP de l’annoncer. »
- Score : 1 point · Tentatives : 2

### Diapo Q8 — Question du TP

**Question (texte affiché) :** Pourquoi 192.168.100.0 et 192.168.200.0 n’apparaissent-ils pas dans la table de CR ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] BGP est en panne
- [x] Aucun protocole de routage ne tourne entre CR et ISP1 : CR utilise sa route par défaut
- [ ] Les loopbacks ne sont pas routables
- [ ] CR est dans l’AS 200

- **Feedback correct :** « Bonne réponse. ISP1 n’annonce aucun réseau au client ; la route par défaut suffit pour sortir. »
- **Feedback incorrect :** « Réponse incorrecte. ISP1 n’annonce aucun réseau au client ; la route par défaut suffit pour sortir. »
- Score : 1 point · Tentatives : 2

### Diapo Q9 — Question de notion

**Question (texte affiché) :** Dans show ip bgp, que signifie « *> » ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Route supprimée
- [x] Route valide et meilleure
- [ ] Route interne
- [ ] Route amortie

- **Feedback correct :** « Bonne réponse. * valid, > best. »
- **Feedback incorrect :** « Réponse incorrecte. * valid, > best. »
- Score : 1 point · Tentatives : 2

### Diapo Q10 — Question de notion

**Question (texte affiché) :** Quelle est la distance administrative des routes eBGP (valeur entre crochets) ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `20`

- **Feedback correct :** « Bonne réponse. [20/0] : 20 est la distance administrative de l’eBGP. »
- **Feedback incorrect :** « Réponse incorrecte. [20/0] : 20 est la distance administrative de l’eBGP. »
- Score : 1 point · Tentatives : 2

## 6. Diapo bonus « Erreur classique » (optionnelle)

### Route de retour absente sur ISP1

- **Contexte :** ISP1 doit annoncer 192.168.1.0 en BGP.
- **Incorrect :**

```
router bgp 100
 network 192.168.1.0
! pas de ip route 192.168.1.0 …
```

  → Le réseau n’est pas dans la table d’ISP1 : BGP ne l’annonce pas et les réponses ne reviennent pas au client.
- **Correct :**

```
ip route 192.168.1.0 255.255.255.0 10.10.10.1
router bgp 100
 network 192.168.1.0
```

  → Route S dans la table d’ISP1, annoncée en BGP : ISP2 la voit en B.
- **À retenir :** La commande network de BGP annonce un réseau présent dans la table de routage.

### Mauvais remote-as

- **Contexte :** Déclaration du voisin eBGP sur ISP1.
- **Incorrect :**

```
router bgp 100
 neighbor 172.16.1.2 remote-as 100
```

  → ISP1 attend un voisin de l’AS 100 alors qu’ISP2 est dans l’AS 200 : la session ne s’établit pas.
- **Correct :**

```
router bgp 100
 neighbor 172.16.1.2 remote-as 200
```

  → Session eBGP établie, routes échangées.
- **À retenir :** remote-as désigne l’AS du voisin, pas son propre AS.

## 7. Diapo « Résultat final »

- Afficher le score (variable *Score* du projet) et le pourcentage.
- Boutons : « Recommencer » (aller à la diapo 1) · « Revoir les erreurs ».
- *Optionnel* — remonter le score dans IT LAB : sur cette diapo, Événement « Au chargement » → action **Exécuter JavaScript** :

```
parent.postMessage({ source: 'itlab-ap', tp: 'bgp', score: 1, max: 1 }, '*');
```

## 8. Notes sur l’énoncé

- Classement dans la matière « Routage & Commutation » : choix par défaut (le document ne porte pas d’en-tête de module), à confirmer.
- Coquille de l’énoncé : « ISP1 se connecte à l’Internet par l’intermédiaire de SP2 » → ISP2.
- Les horodatages « 00$$$40$$$38 » de l’énoncé ont été rétablis en 00:40:38.
- Le document est © Cisco Systems : vérifiez les droits avant une publication publique du PDF.

---
Source : Énoncé – Configuration d’un routeur avec BGP (Cisco Networking Academy).

# Kit ActivePresenter — TP FR avancé : Frame Relay avancé – hub & spoke

> Kit de production pour réaliser **votre propre** simulation de ce TP dans ActivePresenter. Contenu issu de l’énoncé et de la plateforme IT LAB. Les sorties marquées *reconstituées* doivent être remplacées par **vos captures réelles** (GNS3 / Packet Tracer).

## 0. Paramètres du projet

| Réglage | Valeur |
|---|---|
| Nom du projet | `frame-relay-avance` |
| Taille | 1280 × 720 (ou la taille de vos captures), option *Responsive* activée |
| Auteur (Fichier → Propriétés du projet) | Lina Ben Alaya |
| Export | HTML5, dossier `frame-relay-avance` |
| Volume | 8 étapes · 33 saisies de commandes · 9 questions |
| Outils à ouvrir | GNS3, VPCS |

## 1. Diapo « Introduction »

- **Titre :** TP FR avancé — Frame Relay avancé – hub & spoke
- **Sous-titre :** Routes flottantes, panne d’un PVC et sous-interfaces point-à-point
- **Texte :** SiteCentral (hub) dessert Agence1 et Agence2 (spokes) par deux PVC. Une liaison PPP 172.16.1.0/24 relie aussi SiteCentral et Agence1 en secours. Quand le lien Frame Relay d'Agence1 tombe, le trafic doit basculer sur le PPP… mais ce n'est pas si simple.
- **Bouton :** « Commencer » → diapo suivante

## 2. Diapo « Objectifs »

- Configurer le commutateur FR (2 PVC) et l’encapsulation FR (LMI ANSI) et PPP
- Créer des routes statiques flottantes (distance administrative 50)
- Analyser le comportement lors de la panne d’un PVC sur une interface physique
- Créer des sous-interfaces point-à-point avec frame-relay interface-dlci
- Remplacer les routes statiques par RIPv2 et valider la bascule

- **Boutons :** « Retour » · « Suivant »

## 3. Diapo « Environnement et topologie »

- **Capture à réaliser :** la topologie complète dans GNS3.
- **Légende / callouts** (un par équipement) :
  - **C2** : 192.168.1.10/24 · Passerelle 192.168.1.254
  - **SiteCentral** (Hub) : LAN : 192.168.1.254/24 · s0/0 : PPP 172.16.1.0/24 · s0/1 : Frame Relay (port 1) · s0/1.16 : 192.168.0.1/30 · s0/1.17 : 192.168.100.1/30
  - **FR** : Port 1 : SiteCentral · Port 2 : Agence1 · Port 3 : Agence2
  - **Agence1** (Spoke) : LAN : 192.168.2.254/24 · s0/1 : FR (port 2) · s0/1.16 : 192.168.0.2/30 · PPP vers SiteCentral
  - **Agence2** (Spoke) : LAN : 192.168.3.254/24 · s0/0 : FR (port 3) · s0/0.16 : 192.168.100.2/30
  - **C1** : 192.168.2.10/24 · Passerelle 192.168.2.254
  - **C3** : 192.168.3.10/24 · Passerelle 192.168.3.254
- **Matériel :** SiteCentral, Agence1, Agence2, Commutateur FR, C1, C2, C3

## 4. Manipulations (simulation logicielle)

> Pour chaque commande : une diapo avec la **capture de la console à l’invite indiquée**, une **zone de saisie (Text Entry)** placée sur la ligne de commande, et les feedbacks. Cochez *Insensible à la casse*. Ajoutez une diapo « Résultat » après la dernière commande de l’étape si une sortie est indiquée.

### Étape 1 — Encapsulations PPP et Frame Relay (SiteCentral)

- **Diapo de contexte — texte :** PPP sur le WAN de secours, FR (LMI ANSI) vers le commutateur.

#### Diapo saisie 1 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config)#`
- **Consigne (légende) :** « PPP sur le WAN de secours, FR (LMI ANSI) vers le commutateur. »
- **Réponse attendue (Text Entry) :** `interface s0/0`
- **Abréviation à accepter aussi :** `int s0/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « encapsulation ppp / encapsulation frame-relay / frame-relay lmi-type ansi »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface s0/0` puis passer à la suite (0 point).

#### Diapo saisie 2 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-if)#`
- **Consigne (légende) :** « PPP sur le WAN de secours, FR (LMI ANSI) vers le commutateur. »
- **Réponse attendue (Text Entry) :** `encapsulation ppp`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « encapsulation ppp / encapsulation frame-relay / frame-relay lmi-type ansi »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `encapsulation ppp` puis passer à la suite (0 point).

#### Diapo saisie 3 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-if)#`
- **Consigne (légende) :** « PPP sur le WAN de secours, FR (LMI ANSI) vers le commutateur. »
- **Réponse attendue (Text Entry) :** `interface s0/1`
- **Abréviation à accepter aussi :** `int s0/1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « encapsulation ppp / encapsulation frame-relay / frame-relay lmi-type ansi »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface s0/1` puis passer à la suite (0 point).

#### Diapo saisie 4 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-if)#`
- **Consigne (légende) :** « PPP sur le WAN de secours, FR (LMI ANSI) vers le commutateur. »
- **Réponse attendue (Text Entry) :** `encapsulation frame-relay`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « encapsulation ppp / encapsulation frame-relay / frame-relay lmi-type ansi »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `encapsulation frame-relay` puis passer à la suite (0 point).

#### Diapo saisie 5 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-if)#`
- **Consigne (légende) :** « PPP sur le WAN de secours, FR (LMI ANSI) vers le commutateur. »
- **Réponse attendue (Text Entry) :** `frame-relay lmi-type ansi`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « encapsulation ppp / encapsulation frame-relay / frame-relay lmi-type ansi »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `frame-relay lmi-type ansi` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Même principe sur Agence1 (PPP + FR) et Agence2 (FR).

### Étape 2 — Route flottante vers le LAN d’Agence1 (SiteCentral)

- **Diapo de contexte — texte :** Route via PPP avec une DA de 50.

#### Diapo saisie 6 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config)#`
- **Consigne (légende) :** « Route via PPP avec une DA de 50. »
- **Réponse attendue (Text Entry) :** `ip route 192.168.2.0 255.255.255.0 172.16.1.2 50`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip route <réseau> <masque> <prochain saut PPP> 50 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip route 192.168.2.0 255.255.255.0 172.16.1.2 50` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** La route via le commutateur FR (DA 1) est préférée ; celle-ci n'est qu'un secours. N'oubliez pas de créer les deux routes, et la route vers le LAN d'Agence2. Vérifiez avec show ip route et show running-config.

### Étape 3 — Configurer l’hôte C1 (VPCS) (C1)

- **Diapo de contexte — texte :** Adresse, préfixe et passerelle.

#### Diapo saisie 7 — sur **C1**

- **Capture :** console de C1 affichant l’invite `C1>`
- **Consigne (légende) :** « Adresse, préfixe et passerelle. »
- **Réponse attendue (Text Entry) :** `ip 192.168.2.10/24 192.168.2.254`
- **Autres réponses acceptées :** `ip 192.168.2.10 255.255.255.0 192.168.2.254`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip <adresse>/<préfixe> <passerelle> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip 192.168.2.10/24 192.168.2.254` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** C2 : 192.168.1.10/24, passerelle 192.168.1.254 ; C3 : 192.168.3.10/24, passerelle 192.168.3.254. Testez ping C3 → C2 et C1 → C2.

### Étape 4 — Panne : désactiver s0/1 sur Agence1 (Agence1)

- **Diapo de contexte — texte :** Observer la bascule côté Agence1.

#### Diapo saisie 8 — sur **Agence1**

- **Capture :** console de Agence1 affichant l’invite `Agence1(config)#`
- **Consigne (légende) :** « Observer la bascule côté Agence1. »
- **Réponse attendue (Text Entry) :** `interface s0/1`
- **Abréviation à accepter aussi :** `int s0/1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « shutdown sur s0/1, puis show ip route. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface s0/1` puis passer à la suite (0 point).

#### Diapo saisie 9 — sur **Agence1**

- **Capture :** console de Agence1 affichant l’invite `Agence1(config-if)#`
- **Consigne (légende) :** « Observer la bascule côté Agence1. »
- **Réponse attendue (Text Entry) :** `shutdown`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « shutdown sur s0/1, puis show ip route. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `shutdown` puis passer à la suite (0 point).

#### Diapo saisie 10 — sur **Agence1**

- **Capture :** console de Agence1 affichant l’invite `Agence1(config-if)#`
- **Consigne (légende) :** « Observer la bascule côté Agence1. »
- **Réponse attendue (Text Entry) :** `do show ip route`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « shutdown sur s0/1, puis show ip route. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `do show ip route` puis passer à la suite (0 point).

#### Diapo résultat — étape 4

- **Capture :** la sortie réelle sur Agence1. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
S    192.168.1.0/24 [50/0] via 172.16.1.1
```


- **Explication (légende sur la diapo résultat) :** La route flottante (DA 50) via le lien PPP est désormais la route opérationnelle vers 192.168.1.0/24.

### Étape 5 — État de s0/1 sur SiteCentral (SiteCentral)

- **Diapo de contexte — texte :** Comprendre le trou noir.

#### Diapo saisie 11 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral#`
- **Consigne (légende) :** « Comprendre le trou noir. »
- **Réponse attendue (Text Entry) :** `show ip interface brief`
- **Abréviation à accepter aussi :** `sh ip interface brief`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show ip interface brief »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show ip interface brief` puis passer à la suite (0 point).

#### Diapo résultat — étape 5

- **Capture :** la sortie réelle sur SiteCentral. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
Interface        IP-Address      OK? Method Status    Protocol
Serial0/0        172.16.1.1      YES manual up        up
Serial0/1        …               YES manual up        up
```


- **Explication (légende sur la diapo résultat) :** s0/1 reste up (le PVC vers Agence2 est actif) : SiteCentral continue d'envoyer le trafic vers 192.168.2.0/24 par Frame Relay. Le ping C2 → C1 échoue.

### Étape 6 — Sous-interfaces point-à-point (SiteCentral)

- **Diapo de contexte — texte :** Une sous-interface par PVC.

#### Diapo saisie 12 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config)#`
- **Consigne (légende) :** « Une sous-interface par PVC. »
- **Réponse attendue (Text Entry) :** `interface s0/1`
- **Abréviation à accepter aussi :** `int s0/1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface s0/1.16 point-to-point, ip address …, frame-relay interface-dlci 16 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface s0/1` puis passer à la suite (0 point).

#### Diapo saisie 13 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-if)#`
- **Consigne (légende) :** « Une sous-interface par PVC. »
- **Réponse attendue (Text Entry) :** `no ip address`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface s0/1.16 point-to-point, ip address …, frame-relay interface-dlci 16 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `no ip address` puis passer à la suite (0 point).

#### Diapo saisie 14 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-if)#`
- **Consigne (légende) :** « Une sous-interface par PVC. »
- **Réponse attendue (Text Entry) :** `exit`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface s0/1.16 point-to-point, ip address …, frame-relay interface-dlci 16 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `exit` puis passer à la suite (0 point).

#### Diapo saisie 15 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config)#`
- **Consigne (légende) :** « Une sous-interface par PVC. »
- **Réponse attendue (Text Entry) :** `interface s0/1.16 point-to-point`
- **Abréviation à accepter aussi :** `int s0/1.16 point-to-point`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface s0/1.16 point-to-point, ip address …, frame-relay interface-dlci 16 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface s0/1.16 point-to-point` puis passer à la suite (0 point).

#### Diapo saisie 16 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-subif)#`
- **Consigne (légende) :** « Une sous-interface par PVC. »
- **Réponse attendue (Text Entry) :** `description PVC-avec-agence1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface s0/1.16 point-to-point, ip address …, frame-relay interface-dlci 16 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `description PVC-avec-agence1` puis passer à la suite (0 point).

#### Diapo saisie 17 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-subif)#`
- **Consigne (légende) :** « Une sous-interface par PVC. »
- **Réponse attendue (Text Entry) :** `ip address 192.168.0.1 255.255.255.252`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface s0/1.16 point-to-point, ip address …, frame-relay interface-dlci 16 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip address 192.168.0.1 255.255.255.252` puis passer à la suite (0 point).

#### Diapo saisie 18 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-subif)#`
- **Consigne (légende) :** « Une sous-interface par PVC. »
- **Réponse attendue (Text Entry) :** `frame-relay interface-dlci 16`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface s0/1.16 point-to-point, ip address …, frame-relay interface-dlci 16 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `frame-relay interface-dlci 16` puis passer à la suite (0 point).

#### Diapo saisie 19 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-fr-dlci)#`
- **Consigne (légende) :** « Une sous-interface par PVC. »
- **Réponse attendue (Text Entry) :** `exit`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface s0/1.16 point-to-point, ip address …, frame-relay interface-dlci 16 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `exit` puis passer à la suite (0 point).

#### Diapo saisie 20 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-subif)#`
- **Consigne (légende) :** « Une sous-interface par PVC. »
- **Réponse attendue (Text Entry) :** `no shutdown`
- **Abréviation à accepter aussi :** `no shut`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface s0/1.16 point-to-point, ip address …, frame-relay interface-dlci 16 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `no shutdown` puis passer à la suite (0 point).

#### Diapo saisie 21 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-subif)#`
- **Consigne (légende) :** « Une sous-interface par PVC. »
- **Réponse attendue (Text Entry) :** `exit`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface s0/1.16 point-to-point, ip address …, frame-relay interface-dlci 16 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `exit` puis passer à la suite (0 point).

#### Diapo saisie 22 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config)#`
- **Consigne (légende) :** « Une sous-interface par PVC. »
- **Réponse attendue (Text Entry) :** `interface s0/1.17 point-to-point`
- **Abréviation à accepter aussi :** `int s0/1.17 point-to-point`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface s0/1.16 point-to-point, ip address …, frame-relay interface-dlci 16 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface s0/1.17 point-to-point` puis passer à la suite (0 point).

#### Diapo saisie 23 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-subif)#`
- **Consigne (légende) :** « Une sous-interface par PVC. »
- **Réponse attendue (Text Entry) :** `description PVC-avec-agence2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface s0/1.16 point-to-point, ip address …, frame-relay interface-dlci 16 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `description PVC-avec-agence2` puis passer à la suite (0 point).

#### Diapo saisie 24 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-subif)#`
- **Consigne (légende) :** « Une sous-interface par PVC. »
- **Réponse attendue (Text Entry) :** `ip address 192.168.100.1 255.255.255.252`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface s0/1.16 point-to-point, ip address …, frame-relay interface-dlci 16 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip address 192.168.100.1 255.255.255.252` puis passer à la suite (0 point).

#### Diapo saisie 25 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-subif)#`
- **Consigne (légende) :** « Une sous-interface par PVC. »
- **Réponse attendue (Text Entry) :** `frame-relay interface-dlci 17`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface s0/1.16 point-to-point, ip address …, frame-relay interface-dlci 16 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `frame-relay interface-dlci 17` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Commandes de l'énoncé. On garde l'encapsulation frame-relay et la LMI ANSI sur l'interface physique. Sur Agence2 : s0/0.16 (192.168.100.2/30, DLCI 16) ; sur Agence1 : s0/1.16 (192.168.0.2/30, DLCI 16).

### Étape 7 — Passer au routage RIPv2 (SiteCentral)

- **Diapo de contexte — texte :** Supprimer les routes statiques et activer RIPv2.

#### Diapo saisie 26 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config)#`
- **Consigne (légende) :** « Supprimer les routes statiques et activer RIPv2. »
- **Réponse attendue (Text Entry) :** `no ip route 192.168.2.0 255.255.255.0 172.16.1.2 50`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router rip, version 2, network pour chaque réseau directement connecté. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `no ip route 192.168.2.0 255.255.255.0 172.16.1.2 50` puis passer à la suite (0 point).

#### Diapo saisie 27 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config)#`
- **Consigne (légende) :** « Supprimer les routes statiques et activer RIPv2. »
- **Réponse attendue (Text Entry) :** `router rip`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router rip, version 2, network pour chaque réseau directement connecté. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router rip` puis passer à la suite (0 point).

#### Diapo saisie 28 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-router)#`
- **Consigne (légende) :** « Supprimer les routes statiques et activer RIPv2. »
- **Réponse attendue (Text Entry) :** `version 2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router rip, version 2, network pour chaque réseau directement connecté. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `version 2` puis passer à la suite (0 point).

#### Diapo saisie 29 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-router)#`
- **Consigne (légende) :** « Supprimer les routes statiques et activer RIPv2. »
- **Réponse attendue (Text Entry) :** `network 192.168.0.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router rip, version 2, network pour chaque réseau directement connecté. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 192.168.0.0` puis passer à la suite (0 point).

#### Diapo saisie 30 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-router)#`
- **Consigne (légende) :** « Supprimer les routes statiques et activer RIPv2. »
- **Réponse attendue (Text Entry) :** `network 192.168.100.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router rip, version 2, network pour chaque réseau directement connecté. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 192.168.100.0` puis passer à la suite (0 point).

#### Diapo saisie 31 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-router)#`
- **Consigne (légende) :** « Supprimer les routes statiques et activer RIPv2. »
- **Réponse attendue (Text Entry) :** `network 192.168.1.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router rip, version 2, network pour chaque réseau directement connecté. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 192.168.1.0` puis passer à la suite (0 point).

#### Diapo saisie 32 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral(config-router)#`
- **Consigne (légende) :** « Supprimer les routes statiques et activer RIPv2. »
- **Réponse attendue (Text Entry) :** `network 172.16.0.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router rip, version 2, network pour chaque réseau directement connecté. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 172.16.0.0` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Supprimez aussi les autres routes statiques et activez RIPv2 sur Agence1 et Agence2. Réactivez s0/1 sur Agence1, puis testez C2 → C3 et C2 → C1.

### Étape 8 — Même panne, nouveau résultat (SiteCentral)

- **Diapo de contexte — texte :** Après shutdown de s0/1 sur Agence1.

#### Diapo saisie 33 — sur **SiteCentral**

- **Capture :** console de SiteCentral affichant l’invite `SiteCentral#`
- **Consigne (légende) :** « Après shutdown de s0/1 sur Agence1. »
- **Réponse attendue (Text Entry) :** `show ip interface brief`
- **Abréviation à accepter aussi :** `sh ip interface brief`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show ip interface brief »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show ip interface brief` puis passer à la suite (0 point).

#### Diapo résultat — étape 8

- **Capture :** la sortie réelle sur SiteCentral. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
Serial0/1        unassigned      YES manual up        up
Serial0/1.16     192.168.0.1     YES manual down      down
Serial0/1.17     192.168.100.1   YES manual up        up
```


- **Explication (légende sur la diapo résultat) :** s0/1 reste up mais s0/1.16 passe down : la route RIP via 192.168.0.2 disparaît et SiteCentral apprend 192.168.2.0/24 via PPP. Le ping C2 → C1 réussit ; vérifiez avec trace sous VPCS.

## 5. Questions

### Diapo Q1 — Question du TP

**Question (texte affiché) :** Pourquoi ajouter 50 à la fin de la route via le WAN 172.16.1.0/24 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Pour la rendre prioritaire
- [x] Pour lui donner une distance administrative de 50 : elle est moins préférée que la route via Frame Relay (DA 1)
- [ ] Pour limiter le débit
- [ ] C’est un numéro de DLCI

- **Feedback correct :** « Bonne réponse. Plus la DA est grande, moins la route est préférée. »
- **Feedback incorrect :** « Réponse incorrecte. Plus la DA est grande, moins la route est préférée. »
- Score : 1 point · Tentatives : 2

### Diapo Q2 — Question du TP

**Question (texte affiché) :** Après « shutdown » de s0/1 sur Agence1, quelle est la route opérationnelle d’Agence1 vers 192.168.1.0/24 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Aucune
- [x] La route statique flottante via le lien PPP (DA 50)
- [ ] Toujours la route Frame Relay
- [ ] Une route RIP

- **Feedback correct :** « Bonne réponse. La route principale disparaît, la route flottante entre dans la table. »
- **Feedback incorrect :** « Réponse incorrecte. La route principale disparaît, la route flottante entre dans la table. »
- Score : 1 point · Tentatives : 2

### Diapo Q3 — Question du TP

**Question (texte affiché) :** Partie 1 : quel est l’état de s0/1 sur SiteCentral après la panne ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] down/down
- [x] up/up : le PVC vers Agence2 est toujours actif
- [ ] administratively down
- [ ] up/down

- **Feedback correct :** « Bonne réponse. L’interface physique porte deux PVC ; l’un fonctionne encore. »
- **Feedback incorrect :** « Réponse incorrecte. L’interface physique porte deux PVC ; l’un fonctionne encore. »
- Score : 1 point · Tentatives : 2

### Diapo Q4 — Question du TP

**Question (texte affiché) :** Partie 1 : que se passe-t-il pour un ping de C2 vers C1 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Il réussit via PPP
- [x] Il échoue : SiteCentral envoie toujours vers Frame Relay, où le PVC d’Agence1 est inactif
- [ ] Il réussit via Agence2
- [ ] Il est chiffré

- **Feedback correct :** « Bonne réponse. Trou noir : la route de SiteCentral ne change pas. »
- **Feedback incorrect :** « Réponse incorrecte. Trou noir : la route de SiteCentral ne change pas. »
- Score : 1 point · Tentatives : 2

### Diapo Q5 — Question du TP

**Question (texte affiché) :** Pourquoi le DLCI est-il obligatoire sur une sous-interface point-à-point ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Pour le chiffrement
- [x] L’Inverse ARP ne fonctionne pas sur les sous-interfaces point-à-point
- [ ] Parce que la LMI est en ANSI
- [ ] Il ne l’est pas

- **Feedback correct :** « Bonne réponse. Inverse ARP est actif sur l’interface physique (multipoint par défaut), pas sur les sous-interfaces point-à-point. »
- **Feedback incorrect :** « Réponse incorrecte. Inverse ARP est actif sur l’interface physique (multipoint par défaut), pas sur les sous-interfaces point-à-point. »
- Score : 1 point · Tentatives : 2

### Diapo Q6 — Question du TP

**Question (texte affiché) :** Quel nom donner à la sous-interface de s0/1 pour le PVC de DLCI 17 ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `s0/1.17`
- `serial0/1.17`

- **Feedback correct :** « Bonne réponse. Convention de l’énoncé : nom_interface_physique.dlci. »
- **Feedback incorrect :** « Réponse incorrecte. Convention de l’énoncé : nom_interface_physique.dlci. »
- Score : 1 point · Tentatives : 2

### Diapo Q7 — Question du TP

**Question (texte affiché) :** Partie 2 : après la même panne, quel est l’état de s0/1.16 sur SiteCentral ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] up
- [x] down
- [ ] deleted
- [ ] administratively down

- **Feedback correct :** « Bonne réponse. La sous-interface suit l’état de son PVC : elle passe down, la route disparaît, RIP bascule sur PPP. »
- **Feedback incorrect :** « Réponse incorrecte. La sous-interface suit l’état de son PVC : elle passe down, la route disparaît, RIP bascule sur PPP. »
- Score : 1 point · Tentatives : 2

### Diapo Q8 — Question de notion

**Question (texte affiché) :** Quel DLCI Agence2 utilise-t-elle pour joindre SiteCentral ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `16`

- **Feedback correct :** « Bonne réponse. PVC 2 : port 3 / DLCI 16 côté Agence2 (les DLCI sont locaux). »
- **Feedback incorrect :** « Réponse incorrecte. PVC 2 : port 3 / DLCI 16 côté Agence2 (les DLCI sont locaux). »
- Score : 1 point · Tentatives : 2

### Diapo Q9 — Question de notion

**Question (texte affiché) :** Pourquoi le type point-to-point ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [x] Pour simuler le fonctionnement d’une liaison spécialisée pour chaque PVC
- [ ] Pour utiliser plus d’adresses
- [ ] Pour activer l’Inverse ARP
- [ ] Pour le multicast uniquement

- **Feedback correct :** « Bonne réponse. Chaque sous-interface se comporte comme une LS, avec son propre réseau /30. »
- **Feedback incorrect :** « Réponse incorrecte. Chaque sous-interface se comporte comme une LS, avec son propre réseau /30. »
- Score : 1 point · Tentatives : 2

## 6. Diapo bonus « Erreur classique » (optionnelle)

### Interface physique ou sous-interfaces

- **Contexte :** Le PVC SiteCentral ↔ Agence1 tombe.
- **Incorrect :**

```
interface s0/1
 encapsulation frame-relay
 ip address …
! deux PVC sur l’interface physique
```

  → s0/1 reste up : la route via FR reste en place → ping C2 → C1 en échec (trou noir).
- **Correct :**

```
interface s0/1.16 point-to-point
 ip address 192.168.0.1 255.255.255.252
 frame-relay interface-dlci 16
+ RIPv2
```

  → s0/1.16 passe down : la route disparaît, RIP converge via PPP → ping OK.
- **À retenir :** Une sous-interface point-à-point par PVC rend la panne d’un PVC visible au routage.

### Route de secours sans distance administrative

- **Contexte :** Deux routes vers 192.168.2.0/24 sur SiteCentral.
- **Incorrect :**

```
ip route 192.168.2.0 255.255.255.0 <via FR>
ip route 192.168.2.0 255.255.255.0 172.16.1.2
```

  → Deux routes de même DA (1) : le lien PPP n’est plus un simple secours, le trafic est réparti sur les deux.
- **Correct :**

```
ip route 192.168.2.0 255.255.255.0 <via FR>
ip route 192.168.2.0 255.255.255.0 172.16.1.2 50
```

  → Seule la route FR est active ; la route PPP n’apparaît qu’en cas de panne.
- **À retenir :** Une route flottante a une DA supérieure à celle de la route principale.

## 7. Diapo « Résultat final »

- Afficher le score (variable *Score* du projet) et le pourcentage.
- Boutons : « Recommencer » (aller à la diapo 1) · « Revoir les erreurs ».
- *Optionnel* — remonter le score dans IT LAB : sur cette diapo, Événement « Au chargement » → action **Exécuter JavaScript** :

```
parent.postMessage({ source: 'itlab-ap', tp: 'frame-relay-avance', score: 1, max: 1 }, '*');
```

## 8. Notes sur l’énoncé

- Le tableau d'adressage des hôtes est désaligné dans le PDF ; il a été reconstitué : C1 192.168.2.10/24 (passerelle .2.254), C2 192.168.1.10/24 (.1.254), C3 192.168.3.10/24 (.3.254).
- Les adresses des interfaces FR de la partie 1 et l'adresse hôte du lien PPP ne sont pas données : la plateforme suppose SiteCentral 172.16.1.1 et Agence1 172.16.1.2.

---
Source : Énoncé – Frame Relay avancé (hub and spoke).

# Kit ActivePresenter — TP2 : VPN MPLS

> Kit de production pour réaliser **votre propre** simulation de ce TP dans ActivePresenter. Contenu issu de l’énoncé et de la plateforme IT LAB. Les sorties marquées *reconstituées* doivent être remplacées par **vos captures réelles** (GNS3 / Packet Tracer).

## 0. Paramètres du projet

| Réglage | Valeur |
|---|---|
| Nom du projet | `vpn-mpls` |
| Taille | 1280 × 720 (ou la taille de vos captures), option *Responsive* activée |
| Auteur (Fichier → Propriétés du projet) | Lina Ben Alaya |
| Export | HTML5, dossier `vpn-mpls` |
| Volume | 9 étapes · 31 saisies de commandes · 10 questions |
| Outils à ouvrir | GNS3, Cisco 7200, Wireshark |

## 1. Diapo « Introduction »

- **Titre :** TP2 — VPN MPLS
- **Sous-titre :** VRF, Route Distinguisher, Route Target et MP-BGP
- **Texte :** Le backbone MPLS fonctionne. Le Client A (routeurs SIEGE et AGENCE) s'abonne au service : ses deux sites doivent communiquer à travers le réseau de l'opérateur (AS 1), sans que ses routes ne se mélangent avec celles d'autres clients.
- **Bouton :** « Commencer » → diapo suivante

## 2. Diapo « Objectifs »

- Créer une VRF Client_A avec RD 100:1 et RT 1:100 sur SP1 et SP3
- Associer la VRF aux interfaces PE→CE et comprendre le ping « vrf »
- Configurer EIGRP par VRF (address-family) sur les PE
- Établir une session MP-BGP VPNv4 entre les loopbacks des PE
- Redistribuer EIGRP ↔ BGP et vérifier la connectivité de bout en bout
- Observer l’en-tête MPLS et la pile de labels (Wireshark, traceroute)

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
- **Matériel :** SP1, SP2, SP3, SIEGE, AGENCE

## 4. Manipulations (simulation logicielle)

> Pour chaque commande : une diapo avec la **capture de la console à l’invite indiquée**, une **zone de saisie (Text Entry)** placée sur la ligne de commande, et les feedbacks. Cochez *Insensible à la casse*. Ajoutez une diapo « Résultat » après la dernière commande de l’étape si une sortie est indiquée.

### Étape 1 — Créer la VRF du Client A (SP1)

- **Diapo de contexte — texte :** VRF Client_A, RD 100:1, RT 1:100 en import et export.

#### Diapo saisie 1 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config)#`
- **Consigne (légende) :** « VRF Client_A, RD 100:1, RT 1:100 en import et export. »
- **Réponse attendue (Text Entry) :** `ip vrf Client_A`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip vrf <nom>, puis rd ASN:nn et route-target both ASN:nn. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip vrf Client_A` puis passer à la suite (0 point).

#### Diapo saisie 2 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-vrf)#`
- **Consigne (légende) :** « VRF Client_A, RD 100:1, RT 1:100 en import et export. »
- **Réponse attendue (Text Entry) :** `rd 100:1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip vrf <nom>, puis rd ASN:nn et route-target both ASN:nn. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `rd 100:1` puis passer à la suite (0 point).

#### Diapo saisie 3 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-vrf)#`
- **Consigne (légende) :** « VRF Client_A, RD 100:1, RT 1:100 en import et export. »
- **Réponse attendue (Text Entry) :** `route-target both 1:100`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip vrf <nom>, puis rd ASN:nn et route-target both ASN:nn. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `route-target both 1:100` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Les mêmes commandes sont introduites sur SP3. « both » car les PE doivent importer et exporter pour cette VRF.

### Étape 2 — Associer la VRF à l’interface vers SIEGE (SP1)

- **Diapo de contexte — texte :** Placer s1/1 dans la VRF puis ressaisir l’adresse IP.

#### Diapo saisie 4 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config)#`
- **Consigne (légende) :** « Placer s1/1 dans la VRF puis ressaisir l’adresse IP. »
- **Réponse attendue (Text Entry) :** `interface serial1/1`
- **Abréviation à accepter aussi :** `int s1/1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip vrf forwarding Client_A puis ip address … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface serial1/1` puis passer à la suite (0 point).

#### Diapo saisie 5 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-if)#`
- **Consigne (légende) :** « Placer s1/1 dans la VRF puis ressaisir l’adresse IP. »
- **Réponse attendue (Text Entry) :** `ip vrf forwarding Client_A`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip vrf forwarding Client_A puis ip address … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip vrf forwarding Client_A` puis passer à la suite (0 point).

#### Diapo saisie 6 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-if)#`
- **Consigne (légende) :** « Placer s1/1 dans la VRF puis ressaisir l’adresse IP. »
- **Réponse attendue (Text Entry) :** `ip address 192.168.12.1 255.255.255.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip vrf forwarding Client_A puis ip address … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip address 192.168.12.1 255.255.255.0` puis passer à la suite (0 point).

#### Diapo résultat — étape 2

- **Capture :** la sortie réelle sur SP1. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
% Interface Serial1/1 IP address 192.168.12.1 removed due to enabling VRF Client_A
```


- **Explication (légende sur la diapo résultat) :** L'adresse IP est supprimée lors de l'activation de la VRF : il faut la ressaisir. Faites de même sur SP3 (s1/1, 192.168.45.1).

### Étape 3 — Tester le lien PE–CE (SP1)

- **Diapo de contexte — texte :** Comparer un ping global et un ping dans la VRF.

#### Diapo saisie 7 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1#`
- **Consigne (légende) :** « Comparer un ping global et un ping dans la VRF. »
- **Réponse attendue (Text Entry) :** `ping 192.168.12.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ping vrf <nom> <adresse> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ping 192.168.12.2` puis passer à la suite (0 point).

#### Diapo saisie 8 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1#`
- **Consigne (légende) :** « Comparer un ping global et un ping dans la VRF. »
- **Réponse attendue (Text Entry) :** `ping vrf Client_A 192.168.12.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ping vrf <nom> <adresse> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ping vrf Client_A 192.168.12.2` puis passer à la suite (0 point).

#### Diapo résultat — étape 3

- **Capture :** la sortie réelle sur SP1. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
SP1#ping 192.168.12.2
.....
Success rate is 0 percent (0/5)
SP1#ping vrf Client_A 192.168.12.2
!!!!!
Success rate is 100 percent (5/5)
```


- **Explication (légende sur la diapo résultat) :** Le premier ping échoue : la table de routage globale de SP1 n'a pas de route vers ce réseau. En précisant la VRF, le ping réussit. Côté SIEGE, ping 192.168.12.1 réussit directement.

### Étape 4 — EIGRP dans la VRF sur SP3 (SP3)

- **Diapo de contexte — texte :** Former l’adjacence EIGRP AS 100 avec AGENCE dans la VRF.

#### Diapo saisie 9 — sur **SP3**

- **Capture :** console de SP3 affichant l’invite `SP3(config)#`
- **Consigne (légende) :** « Former l’adjacence EIGRP AS 100 avec AGENCE dans la VRF. »
- **Réponse attendue (Text Entry) :** `router eigrp 1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router eigrp 1 → address-family ipv4 vrf Client_A → network → no auto-summary → autonomous-system 100 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router eigrp 1` puis passer à la suite (0 point).

#### Diapo saisie 10 — sur **SP3**

- **Capture :** console de SP3 affichant l’invite `SP3(config-router)#`
- **Consigne (légende) :** « Former l’adjacence EIGRP AS 100 avec AGENCE dans la VRF. »
- **Réponse attendue (Text Entry) :** `address-family ipv4 vrf Client_A`
- **Abréviation à accepter aussi :** `add ipv4 vrf Client_A`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router eigrp 1 → address-family ipv4 vrf Client_A → network → no auto-summary → autonomous-system 100 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `address-family ipv4 vrf Client_A` puis passer à la suite (0 point).

#### Diapo saisie 11 — sur **SP3**

- **Capture :** console de SP3 affichant l’invite `SP3(config-router-af)#`
- **Consigne (légende) :** « Former l’adjacence EIGRP AS 100 avec AGENCE dans la VRF. »
- **Réponse attendue (Text Entry) :** `network 192.168.45.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router eigrp 1 → address-family ipv4 vrf Client_A → network → no auto-summary → autonomous-system 100 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 192.168.45.0` puis passer à la suite (0 point).

#### Diapo saisie 12 — sur **SP3**

- **Capture :** console de SP3 affichant l’invite `SP3(config-router-af)#`
- **Consigne (légende) :** « Former l’adjacence EIGRP AS 100 avec AGENCE dans la VRF. »
- **Réponse attendue (Text Entry) :** `no auto-summary`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router eigrp 1 → address-family ipv4 vrf Client_A → network → no auto-summary → autonomous-system 100 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `no auto-summary` puis passer à la suite (0 point).

#### Diapo saisie 13 — sur **SP3**

- **Capture :** console de SP3 affichant l’invite `SP3(config-router-af)#`
- **Consigne (légende) :** « Former l’adjacence EIGRP AS 100 avec AGENCE dans la VRF. »
- **Réponse attendue (Text Entry) :** `autonomous-system 100`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router eigrp 1 → address-family ipv4 vrf Client_A → network → no auto-summary → autonomous-system 100 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `autonomous-system 100` puis passer à la suite (0 point).

#### Diapo résultat — étape 4

- **Capture :** la sortie réelle sur SP3. Sortie extraite de l’énoncé :

```
%DUAL-5-NBRCHANGE: IP-EIGRP(1) 100: Neighbor 192.168.45.2 (Serial1/1) up: new adjacency
```


- **Explication (légende sur la diapo résultat) :** Exemple tiré de l'énoncé. Faites pareil sur SP1 en annonçant 192.168.12.0. Les réseaux appris sont injectés dans la table VRF ; ils ne sont annoncés à aucun voisin EIGRP AS 1.

### Étape 5 — Comparer table globale et table VRF (SP1)

- **Diapo de contexte — texte :** Constater où sont rangées les routes du client.

#### Diapo saisie 14 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1#`
- **Consigne (légende) :** « Constater où sont rangées les routes du client. »
- **Réponse attendue (Text Entry) :** `show ip route`
- **Abréviation à accepter aussi :** `sh ip route`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show ip route vrf <nom> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show ip route` puis passer à la suite (0 point).

#### Diapo saisie 15 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1#`
- **Consigne (légende) :** « Constater où sont rangées les routes du client. »
- **Réponse attendue (Text Entry) :** `show ip route vrf Client_A`
- **Abréviation à accepter aussi :** `sh ip route vrf Client_A`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show ip route vrf <nom> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show ip route vrf Client_A` puis passer à la suite (0 point).

#### Diapo résultat — étape 5

- **Capture :** la sortie réelle sur SP1. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
Routing Table: Client_A
...
D    10.10.10.0/24 [90/2195456] via 192.168.12.2, Serial1/1
C    192.168.12.0/24 is directly connected, Serial1/1
```


- **Explication (légende sur la diapo résultat) :** La table globale ne contient ni 192.168.12.0/24 ni 192.168.45.0/24. La table VRF contient une route EIGRP (D) vers le LAN SIEGE, mais encore rien du côté AGENCE.

### Étape 6 — Session MP-BGP VPNv4 vers SP3 (SP1)

- **Diapo de contexte — texte :** Voisinage iBGP AS 1 entre loopbacks, activé pour VPNv4.

#### Diapo saisie 16 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config)#`
- **Consigne (légende) :** « Voisinage iBGP AS 1 entre loopbacks, activé pour VPNv4. »
- **Réponse attendue (Text Entry) :** `router bgp 1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 1, neighbor … remote-as / update-source, puis address-family vpnv4 et activate / send-community both. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router bgp 1` puis passer à la suite (0 point).

#### Diapo saisie 17 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-router)#`
- **Consigne (légende) :** « Voisinage iBGP AS 1 entre loopbacks, activé pour VPNv4. »
- **Réponse attendue (Text Entry) :** `neighbor 3.3.3.3 remote-as 1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 1, neighbor … remote-as / update-source, puis address-family vpnv4 et activate / send-community both. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `neighbor 3.3.3.3 remote-as 1` puis passer à la suite (0 point).

#### Diapo saisie 18 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-router)#`
- **Consigne (légende) :** « Voisinage iBGP AS 1 entre loopbacks, activé pour VPNv4. »
- **Réponse attendue (Text Entry) :** `neighbor 3.3.3.3 update-source Loopback0`
- **Abréviation à accepter aussi :** `neighbor 3.3.3.3 update-source lo0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 1, neighbor … remote-as / update-source, puis address-family vpnv4 et activate / send-community both. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `neighbor 3.3.3.3 update-source Loopback0` puis passer à la suite (0 point).

#### Diapo saisie 19 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-router)#`
- **Consigne (légende) :** « Voisinage iBGP AS 1 entre loopbacks, activé pour VPNv4. »
- **Réponse attendue (Text Entry) :** `address-family vpnv4`
- **Abréviation à accepter aussi :** `add vpnv4`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 1, neighbor … remote-as / update-source, puis address-family vpnv4 et activate / send-community both. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `address-family vpnv4` puis passer à la suite (0 point).

#### Diapo saisie 20 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-router-af)#`
- **Consigne (légende) :** « Voisinage iBGP AS 1 entre loopbacks, activé pour VPNv4. »
- **Réponse attendue (Text Entry) :** `neighbor 3.3.3.3 activate`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 1, neighbor … remote-as / update-source, puis address-family vpnv4 et activate / send-community both. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `neighbor 3.3.3.3 activate` puis passer à la suite (0 point).

#### Diapo saisie 21 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-router-af)#`
- **Consigne (légende) :** « Voisinage iBGP AS 1 entre loopbacks, activé pour VPNv4. »
- **Réponse attendue (Text Entry) :** `neighbor 3.3.3.3 send-community both`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 1, neighbor … remote-as / update-source, puis address-family vpnv4 et activate / send-community both. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `neighbor 3.3.3.3 send-community both` puis passer à la suite (0 point).

#### Diapo saisie 22 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-router-af)#`
- **Consigne (légende) :** « Voisinage iBGP AS 1 entre loopbacks, activé pour VPNv4. »
- **Réponse attendue (Text Entry) :** `exit-address-family`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « router bgp 1, neighbor … remote-as / update-source, puis address-family vpnv4 et activate / send-community both. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `exit-address-family` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Symétrique sur SP3 avec neighbor 1.1.1.1. update-source Loopback0 fait partir la session de la loopback, l’adresse que le voisin attend.

### Étape 7 — Redistribuer entre EIGRP et BGP (SP1)

- **Diapo de contexte — texte :** Échanger les routes du client entre les deux protocoles, dans la VRF.

#### Diapo saisie 23 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config)#`
- **Consigne (légende) :** « Échanger les routes du client entre les deux protocoles, dans la VRF. »
- **Réponse attendue (Text Entry) :** `router eigrp 1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Dans EIGRP : redistribute bgp 1 metric … ; dans BGP (af vrf) : redistribute eigrp 100. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router eigrp 1` puis passer à la suite (0 point).

#### Diapo saisie 24 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-router)#`
- **Consigne (légende) :** « Échanger les routes du client entre les deux protocoles, dans la VRF. »
- **Réponse attendue (Text Entry) :** `address-family ipv4 vrf Client_A`
- **Abréviation à accepter aussi :** `add ipv4 vrf Client_A`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Dans EIGRP : redistribute bgp 1 metric … ; dans BGP (af vrf) : redistribute eigrp 100. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `address-family ipv4 vrf Client_A` puis passer à la suite (0 point).

#### Diapo saisie 25 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-router-af)#`
- **Consigne (légende) :** « Échanger les routes du client entre les deux protocoles, dans la VRF. »
- **Réponse attendue (Text Entry) :** `redistribute bgp 1 metric 1500 4000 200 10 1500`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Dans EIGRP : redistribute bgp 1 metric … ; dans BGP (af vrf) : redistribute eigrp 100. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `redistribute bgp 1 metric 1500 4000 200 10 1500` puis passer à la suite (0 point).

#### Diapo saisie 26 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-router-af)#`
- **Consigne (légende) :** « Échanger les routes du client entre les deux protocoles, dans la VRF. »
- **Réponse attendue (Text Entry) :** `router bgp 1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Dans EIGRP : redistribute bgp 1 metric … ; dans BGP (af vrf) : redistribute eigrp 100. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `router bgp 1` puis passer à la suite (0 point).

#### Diapo saisie 27 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-router)#`
- **Consigne (légende) :** « Échanger les routes du client entre les deux protocoles, dans la VRF. »
- **Réponse attendue (Text Entry) :** `address-family ipv4 vrf Client_A`
- **Abréviation à accepter aussi :** `add ipv4 vrf Client_A`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Dans EIGRP : redistribute bgp 1 metric … ; dans BGP (af vrf) : redistribute eigrp 100. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `address-family ipv4 vrf Client_A` puis passer à la suite (0 point).

#### Diapo saisie 28 — sur **SP1**

- **Capture :** console de SP1 affichant l’invite `SP1(config-router-af)#`
- **Consigne (légende) :** « Échanger les routes du client entre les deux protocoles, dans la VRF. »
- **Réponse attendue (Text Entry) :** `redistribute eigrp 100`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Dans EIGRP : redistribute bgp 1 metric … ; dans BGP (af vrf) : redistribute eigrp 100. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `redistribute eigrp 100` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Même configuration sur SP3. La métrique EIGRP est obligatoire pour les routes redistribuées depuis BGP.

### Étape 8 — Vérifier les routes BGP dans la VRF (SP3)

- **Diapo de contexte — texte :** SP3 doit apprendre les réseaux de SIEGE par BGP.

#### Diapo saisie 29 — sur **SP3**

- **Capture :** console de SP3 affichant l’invite `SP3#`
- **Consigne (légende) :** « SP3 doit apprendre les réseaux de SIEGE par BGP. »
- **Réponse attendue (Text Entry) :** `show ip route vrf Client_A`
- **Abréviation à accepter aussi :** `sh ip route vrf Client_A`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show ip route vrf Client_A »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show ip route vrf Client_A` puis passer à la suite (0 point).

#### Diapo résultat — étape 8

- **Capture :** la sortie réelle sur SP3. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
Routing Table: Client_A
...
B    10.10.10.0/24 [200/2195456] via 1.1.1.1, 00:01:12
B    192.168.12.0/24 [200/0] via 1.1.1.1, 00:01:12
D    192.168.1.0/24 [90/2172416] via 192.168.45.2, Serial1/1
C    192.168.45.0/24 is directly connected, Serial1/1
```


- **Explication (légende sur la diapo résultat) :** Des routes B (BGP) apparaissent vers les réseaux directement connectés à SIEGE, avec SP1 (1.1.1.1) comme prochain saut. 200 = distance administrative iBGP.

### Étape 9 — Test de bout en bout et labels (SIEGE)

- **Diapo de contexte — texte :** Joindre le LAN AGENCE et observer le LSP.

#### Diapo saisie 30 — sur **SIEGE**

- **Capture :** console de SIEGE affichant l’invite `SIEGE#`
- **Consigne (légende) :** « Joindre le LAN AGENCE et observer le LSP. »
- **Réponse attendue (Text Entry) :** `ping 192.168.1.1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ping puis traceroute vers 192.168.1.1. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ping 192.168.1.1` puis passer à la suite (0 point).

#### Diapo saisie 31 — sur **SIEGE**

- **Capture :** console de SIEGE affichant l’invite `SIEGE#`
- **Consigne (légende) :** « Joindre le LAN AGENCE et observer le LSP. »
- **Réponse attendue (Text Entry) :** `traceroute 192.168.1.1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ping puis traceroute vers 192.168.1.1. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `traceroute 192.168.1.1` puis passer à la suite (0 point).

#### Diapo résultat — étape 9

- **Capture :** la sortie réelle sur SIEGE. Sortie **illustrative** (valeurs à remplacer par les vôtres) :

```
!!!!!
Success rate is 100 percent (5/5)

Type escape sequence to abort.
Tracing the route to 192.168.1.1
  1 192.168.12.1 …
  2 192.168.23.2 [MPLS: Labels 16/20 Exp 0] …
  3 192.168.45.1 [MPLS: Label 20 Exp 0] …
  4 192.168.45.2 …
```


- **Explication (légende sur la diapo résultat) :** Le ping réussit. Le traceroute révèle la pile de labels : transport/VPN au cœur, puis le label VPN seul après le retrait du label de transport. Numéros et sauts exacts : à relever sur votre maquette.

## 5. Questions

### Diapo Q1 — Question du TP

**Question (texte affiché) :** SP1 reçoit par MP-BGP une route VPNv4 avec le Route Target 100:100. Est-elle importée dans la VRF Client_A ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Oui, car le RD est 100:1
- [x] Non : la VRF importe uniquement le RT 1:100
- [ ] Oui, toutes les routes VPNv4 sont importées
- [ ] Seulement si send-community est configuré

- **Feedback correct :** « Bonne réponse. L’import se fait sur le RT, pas sur le RD. La VRF est configurée avec route-target both 1:100 : 100:100 ne correspond pas. »
- **Feedback incorrect :** « Réponse incorrecte. L’import se fait sur le RT, pas sur le RD. La VRF est configurée avec route-target both 1:100 : 100:100 ne correspond pas. »
- Score : 1 point · Tentatives : 2

### Diapo Q2 — Question du TP

**Question (texte affiché) :** Pourquoi « SP1# ping 192.168.12.2 » échoue-t-il après l’activation de la VRF ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Le lien série est down
- [x] La table de routage globale de SP1 n’a pas de route vers ce réseau
- [ ] SIEGE bloque ICMP
- [ ] Il manque OSPF

- **Feedback correct :** « Bonne réponse. Le réseau 192.168.12.0/24 est désormais dans la table VRF. Il faut ping vrf Client_A 192.168.12.2. »
- **Feedback incorrect :** « Réponse incorrecte. Le réseau 192.168.12.0/24 est désormais dans la table VRF. Il faut ping vrf Client_A 192.168.12.2. »
- Score : 1 point · Tentatives : 2

### Diapo Q3 — Question du TP

**Question (texte affiché) :** Que se passe-t-il quand on tape « ip vrf forwarding Client_A » sur une interface déjà adressée ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Rien
- [x] L’adresse IP est supprimée et doit être ressaisie
- [ ] L’interface est désactivée définitivement
- [ ] Le RD est effacé

- **Feedback correct :** « Bonne réponse. L'énoncé le souligne : il faut ressaisir les adresses IP de ces interfaces. »
- **Feedback incorrect :** « Réponse incorrecte. L'énoncé le souligne : il faut ressaisir les adresses IP de ces interfaces. »
- Score : 1 point · Tentatives : 2

### Diapo Q4 — Question du TP

**Question (texte affiché) :** Avant BGP, y a-t-il des routes EIGRP (D) dans « show ip route vrf Client_A » sur SP1 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [x] Oui, vers le LAN du CE local (SIEGE)
- [ ] Non, aucune
- [ ] Oui, vers les deux LAN
- [ ] Seulement des routes B

- **Feedback correct :** « Bonne réponse. L’adjacence EIGRP PE–CE fonctionne dans la VRF : SP1 apprend 10.10.10.0/24 de SIEGE. »
- **Feedback incorrect :** « Réponse incorrecte. L’adjacence EIGRP PE–CE fonctionne dans la VRF : SP1 apprend 10.10.10.0/24 de SIEGE. »
- Score : 1 point · Tentatives : 2

### Diapo Q5 — Question du TP

**Question (texte affiché) :** Avant BGP, SIEGE et SP1 ont-ils des routes vers les réseaux du client côté AGENCE ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Oui
- [x] Non : rien ne transporte encore les routes entre SP1 et SP3
- [ ] Seulement SP1
- [ ] Seulement SIEGE

- **Feedback correct :** « Bonne réponse. Les deux PE n’échangent encore aucune route client. Même constat pour SP3 et AGENCE vers SIEGE. »
- **Feedback incorrect :** « Réponse incorrecte. Les deux PE n’échangent encore aucune route client. Même constat pour SP3 et AGENCE vers SIEGE. »
- Score : 1 point · Tentatives : 2

### Diapo Q6 — Question de notion

**Question (texte affiché) :** À quoi sert « neighbor 3.3.3.3 activate » sous address-family vpnv4 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] À démarrer BGP
- [x] À autoriser l’échange de routes VPNv4 avec ce voisin (activé par défaut seulement pour IPv4)
- [ ] À chiffrer la session
- [ ] À choisir la loopback comme source

- **Feedback correct :** « Bonne réponse. Explication de l'énoncé : par défaut, les voisins sont activés uniquement pour IPv4. »
- **Feedback incorrect :** « Réponse incorrecte. Explication de l'énoncé : par défaut, les voisins sont activés uniquement pour IPv4. »
- Score : 1 point · Tentatives : 2

### Diapo Q7 — Question de notion

**Question (texte affiché) :** Pourquoi « send-community both » est-il nécessaire ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [x] Pour envoyer les communautés étendues, qui transportent le Route Target
- [ ] Pour activer MPLS
- [ ] Pour redistribuer EIGRP
- [ ] Pour envoyer les mises à jour en multicast

- **Feedback correct :** « Bonne réponse. Le RT voyage sous forme de communauté étendue BGP. Sans elle, le PE distant ne sait pas dans quelle VRF importer la route. »
- **Feedback incorrect :** « Réponse incorrecte. Le RT voyage sous forme de communauté étendue BGP. Sans elle, le PE distant ne sait pas dans quelle VRF importer la route. »
- Score : 1 point · Tentatives : 2

### Diapo Q8 — Question du TP

**Question (texte affiché) :** Après la redistribution, quel code identifie sur SP3 les routes vers les réseaux de SIEGE ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] D
- [ ] O
- [x] B
- [ ] C

- **Feedback correct :** « Bonne réponse. Ce sont des routes BGP (B) apprises de SP1. »
- **Feedback incorrect :** « Réponse incorrecte. Ce sont des routes BGP (B) apprises de SP1. »
- Score : 1 point · Tentatives : 2

### Diapo Q9 — Question de notion

**Question (texte affiché) :** Combien de labels porte un paquet du client au cœur du backbone (entre SP1 et SP2) ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] 0
- [ ] 1
- [x] 2 : transport (LDP) + VPN (MP-BGP)
- [ ] 3

- **Feedback correct :** « Bonne réponse. Label stacking : le label externe achemine jusqu’au PE de sortie, le label interne identifie la VRF. »
- **Feedback incorrect :** « Réponse incorrecte. Label stacking : le label externe achemine jusqu’au PE de sortie, le label interne identifie la VRF. »
- Score : 1 point · Tentatives : 2

### Diapo Q10 — Question de notion

**Question (texte affiché) :** Ordonnez la mise en place du VPN MPLS.

**Interaction ActivePresenter :** Question de séquence (Sequence). Ordre correct :

1. Créer la VRF (RD, RT)
2. Associer la VRF à l’interface PE→CE
3. EIGRP par VRF sur les PE
4. MP-BGP VPNv4 entre PE
5. Redistribution EIGRP ↔ BGP
6. Tests ping / traceroute / Wireshark

- **Feedback correct :** « Bonne réponse. Chaque étape s’appuie sur la précédente : sans VRF, pas d’address-family VRF ; sans MP-BGP, rien à redistribuer. »
- **Feedback incorrect :** « Réponse incorrecte. Chaque étape s’appuie sur la précédente : sans VRF, pas d’address-family VRF ; sans MP-BGP, rien à redistribuer. »
- Score : 1 point · Tentatives : 2

## 6. Diapo bonus « Erreur classique » (optionnelle)

### Ping depuis un PE : global ou VRF

- **Contexte :** SP1 teste le lien vers SIEGE après l’activation de la VRF.
- **Incorrect :**

```
SP1# ping 192.168.12.2
```

  → ..... Success rate is 0 percent : la table globale ne connaît pas ce réseau.
- **Correct :**

```
SP1# ping vrf Client_A 192.168.12.2
```

  → !!!!! Success rate is 100 percent.
- **À retenir :** Sur un PE, toute commande vers un réseau client doit préciser la VRF.

### Route Target incohérent

- **Contexte :** SP1 et SP3 doivent importer mutuellement les routes du Client A.
- **Incorrect :**

```
SP1: route-target both 1:100
SP3: route-target both 100:100
```

  → Les routes exportées par chaque PE ne correspondent pas à l’import de l’autre : aucune route B dans les VRF.
- **Correct :**

```
SP1: route-target both 1:100
SP3: route-target both 1:100
```

  → Chaque PE importe les routes de l’autre : routes B visibles, ping SIEGE ↔ AGENCE OK.
- **À retenir :** L’import repose sur le RT : il doit correspondre entre export d’un côté et import de l’autre.

### Adresse oubliée après l’activation de la VRF

- **Contexte :** On associe s1/1 de SP1 à la VRF.
- **Incorrect :**

```
interface Serial1/1
 ip vrf forwarding Client_A
```

  → L’adresse IP a été supprimée : l’interface n’a plus d’adresse, l’adjacence EIGRP ne se forme pas.
- **Correct :**

```
interface Serial1/1
 ip vrf forwarding Client_A
 ip address 192.168.12.1 255.255.255.0
```

  → L’interface est dans la VRF et adressée.
- **À retenir :** ip vrf forwarding efface l’adresse IP : ressaisissez-la toujours après.

## 7. Diapo « Résultat final »

- Afficher le score (variable *Score* du projet) et le pourcentage.
- Boutons : « Recommencer » (aller à la diapo 1) · « Revoir les erreurs ».
- *Optionnel* — remonter le score dans IT LAB : sur cette diapo, Événement « Au chargement » → action **Exécuter JavaScript** :

```
parent.postMessage({ source: 'itlab-ap', tp: 'vpn-mpls', score: 1, max: 1 }, '*');
```

## 8. Notes sur l’énoncé

- L'énoncé nomme la VRF « CLIENT_A » dans le titre et « Client_A » dans les commandes. Le nom est sensible à la casse : la plateforme utilise Client_A partout.
- Valeurs de métriques et de labels dans les sorties : reconstituées ou illustratives, à remplacer par celles de votre compte rendu.
- Capture entre SP2 et SP3 : selon le sens, le label de transport peut avoir été retiré par SP2 (PHP). Point à vérifier sur la capture réelle.

---
Source : Énoncé TP2 – VPN MPLS.

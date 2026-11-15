# Kit ActivePresenter — TP GRE/IPsec : Tunnel GRE over IPsec

> Kit de production pour réaliser **votre propre** simulation de ce TP dans ActivePresenter. Contenu issu de l’énoncé et de la plateforme IT LAB. Les sorties marquées *reconstituées* doivent être remplacées par **vos captures réelles** (GNS3 / Packet Tracer).

## 0. Paramètres du projet

| Réglage | Valeur |
|---|---|
| Nom du projet | `gre-ipsec` |
| Taille | 1280 × 720 (ou la taille de vos captures), option *Responsive* activée |
| Auteur (Fichier → Propriétés du projet) | Lina Ben Alaya |
| Export | HTML5, dossier `gre-ipsec` |
| Volume | 7 étapes · 35 saisies de commandes · 8 questions |
| Outils à ouvrir | GNS3, Cisco 7200 (IOS avec « crypto »), Wireshark |

## 1. Diapo « Introduction »

- **Titre :** TP GRE/IPsec — Tunnel GRE over IPsec
- **Sous-titre :** Tunnel GRE entre deux sites, puis chiffrement par IPsec
- **Texte :** Deux sites (10.0.10.0/24 et 10.0.20.0/24) sont reliés à un routeur WAN par des adresses publiques. Ils doivent communiquer par un tunnel, et ce trafic doit être chiffré. Le reste du trafic sort vers le WAN avec NAT.
- **Bouton :** « Commencer » → diapo suivante

## 2. Diapo « Objectifs »

- Configurer l’adressage, la NAT overload et l’exclusion du trafic inter-sites
- Créer l’interface Tunnel0 (GRE) et comprendre le MTU de 1400
- Router le trafic inter-sites dans le tunnel
- Analyser l’encapsulation IP/GRE/IP sous Wireshark
- Chiffrer le tunnel GRE avec IPsec (ISAKMP, transform-set, ACL GRE, crypto map)

- **Boutons :** « Retour » · « Suivant »

## 3. Diapo « Environnement et topologie »

- **Capture à réaliser :** la topologie complète dans GNS3.
- **Légende / callouts** (un par équipement) :
  - **LAN site 1** : 10.0.10.0/24
  - **RouterA** : fa0/0 : 10.0.10.1/24 (nat inside) · s0/0 : 201.20.20.1/30 (nat outside) · Tunnel0 : 172.16.1.1/24
  - **WAN** (WAN) : s0/0 : 201.20.20.2/30 · s0/1 : 204.20.20.1/30
  - **RouterB** : fa0/0 : 10.0.20.1/24 (nat inside) · s0/0 : 204.20.20.2/30 (nat outside) · Tunnel0 : 172.16.1.2/24
  - **LAN site 2** : 10.0.20.0/24
- **Matériel :** RouterA, WAN, RouterB

## 4. Manipulations (simulation logicielle)

> Pour chaque commande : une diapo avec la **capture de la console à l’invite indiquée**, une **zone de saisie (Text Entry)** placée sur la ligne de commande, et les feedbacks. Cochez *Insensible à la casse*. Ajoutez une diapo « Résultat » après la dernière commande de l’étape si une sortie est indiquée.

### Étape 1 — Configuration de base de RouterA (RouterA)

- **Diapo de contexte — texte :** Adressage, interfaces NAT et route par défaut.

#### Diapo saisie 1 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config)#`
- **Consigne (légende) :** « Adressage, interfaces NAT et route par défaut. »
- **Réponse attendue (Text Entry) :** `interface fa0/0`
- **Abréviation à accepter aussi :** `int fa0/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Interface LAN : inside ; interface WAN : outside. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface fa0/0` puis passer à la suite (0 point).

#### Diapo saisie 2 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-if)#`
- **Consigne (légende) :** « Adressage, interfaces NAT et route par défaut. »
- **Réponse attendue (Text Entry) :** `ip address 10.0.10.1 255.255.255.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Interface LAN : inside ; interface WAN : outside. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip address 10.0.10.1 255.255.255.0` puis passer à la suite (0 point).

#### Diapo saisie 3 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-if)#`
- **Consigne (légende) :** « Adressage, interfaces NAT et route par défaut. »
- **Réponse attendue (Text Entry) :** `ip nat inside`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Interface LAN : inside ; interface WAN : outside. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip nat inside` puis passer à la suite (0 point).

#### Diapo saisie 4 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-if)#`
- **Consigne (légende) :** « Adressage, interfaces NAT et route par défaut. »
- **Réponse attendue (Text Entry) :** `no shutdown`
- **Abréviation à accepter aussi :** `no shut`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Interface LAN : inside ; interface WAN : outside. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `no shutdown` puis passer à la suite (0 point).

#### Diapo saisie 5 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-if)#`
- **Consigne (légende) :** « Adressage, interfaces NAT et route par défaut. »
- **Réponse attendue (Text Entry) :** `interface s0/0`
- **Abréviation à accepter aussi :** `int s0/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Interface LAN : inside ; interface WAN : outside. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface s0/0` puis passer à la suite (0 point).

#### Diapo saisie 6 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-if)#`
- **Consigne (légende) :** « Adressage, interfaces NAT et route par défaut. »
- **Réponse attendue (Text Entry) :** `ip address 201.20.20.1 255.255.255.252`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Interface LAN : inside ; interface WAN : outside. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip address 201.20.20.1 255.255.255.252` puis passer à la suite (0 point).

#### Diapo saisie 7 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-if)#`
- **Consigne (légende) :** « Adressage, interfaces NAT et route par défaut. »
- **Réponse attendue (Text Entry) :** `ip nat outside`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Interface LAN : inside ; interface WAN : outside. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip nat outside` puis passer à la suite (0 point).

#### Diapo saisie 8 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-if)#`
- **Consigne (légende) :** « Adressage, interfaces NAT et route par défaut. »
- **Réponse attendue (Text Entry) :** `no shutdown`
- **Abréviation à accepter aussi :** `no shut`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Interface LAN : inside ; interface WAN : outside. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `no shutdown` puis passer à la suite (0 point).

#### Diapo saisie 9 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-if)#`
- **Consigne (légende) :** « Adressage, interfaces NAT et route par défaut. »
- **Réponse attendue (Text Entry) :** `exit`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Interface LAN : inside ; interface WAN : outside. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `exit` puis passer à la suite (0 point).

#### Diapo saisie 10 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config)#`
- **Consigne (légende) :** « Adressage, interfaces NAT et route par défaut. »
- **Réponse attendue (Text Entry) :** `ip route 0.0.0.0 0.0.0.0 201.20.20.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « Interface LAN : inside ; interface WAN : outside. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip route 0.0.0.0 0.0.0.0 201.20.20.2` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Les interfaces NAT sont définies selon les flux entrants et sortants ; la route par défaut envoie le trafic vers le routeur WAN. RouterB est symétrique (10.0.20.1, 204.20.20.2, défaut 204.20.20.1).

### Étape 2 — NAT avec exclusion du trafic inter-sites (RouterA)

- **Diapo de contexte — texte :** Ne pas traduire le trafic vers le site 2.

#### Diapo saisie 11 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config)#`
- **Consigne (légende) :** « Ne pas traduire le trafic vers le site 2. »
- **Réponse attendue (Text Entry) :** `access-list 100 deny ip 10.0.10.0 0.0.0.255 10.0.20.0 0.0.0.255`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « access-list 100 deny … puis permit … any, puis ip nat inside source list 100 … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `access-list 100 deny ip 10.0.10.0 0.0.0.255 10.0.20.0 0.0.0.255` puis passer à la suite (0 point).

#### Diapo saisie 12 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config)#`
- **Consigne (légende) :** « Ne pas traduire le trafic vers le site 2. »
- **Réponse attendue (Text Entry) :** `access-list 100 permit ip 10.0.10.0 0.0.0.255 any`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « access-list 100 deny … puis permit … any, puis ip nat inside source list 100 … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `access-list 100 permit ip 10.0.10.0 0.0.0.255 any` puis passer à la suite (0 point).

#### Diapo saisie 13 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config)#`
- **Consigne (légende) :** « Ne pas traduire le trafic vers le site 2. »
- **Réponse attendue (Text Entry) :** `ip nat inside source list 100 interface s0/0 overload`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « access-list 100 deny … puis permit … any, puis ip nat inside source list 100 … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip nat inside source list 100 interface s0/0 overload` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** L'ordre compte : la ligne deny doit précéder le permit any.

### Étape 3 — Interface Tunnel0 (RouterA)

- **Diapo de contexte — texte :** Créer le tunnel GRE vers RouterB.

#### Diapo saisie 14 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config)#`
- **Consigne (légende) :** « Créer le tunnel GRE vers RouterB. »
- **Réponse attendue (Text Entry) :** `interface tunnel0`
- **Abréviation à accepter aussi :** `int tunnel0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface tunnel0, ip address, ip mtu, tunnel source, tunnel destination. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface tunnel0` puis passer à la suite (0 point).

#### Diapo saisie 15 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-if)#`
- **Consigne (légende) :** « Créer le tunnel GRE vers RouterB. »
- **Réponse attendue (Text Entry) :** `ip address 172.16.1.1 255.255.255.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface tunnel0, ip address, ip mtu, tunnel source, tunnel destination. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip address 172.16.1.1 255.255.255.0` puis passer à la suite (0 point).

#### Diapo saisie 16 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-if)#`
- **Consigne (légende) :** « Créer le tunnel GRE vers RouterB. »
- **Réponse attendue (Text Entry) :** `ip mtu 1400`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface tunnel0, ip address, ip mtu, tunnel source, tunnel destination. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip mtu 1400` puis passer à la suite (0 point).

#### Diapo saisie 17 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-if)#`
- **Consigne (légende) :** « Créer le tunnel GRE vers RouterB. »
- **Réponse attendue (Text Entry) :** `tunnel source s0/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface tunnel0, ip address, ip mtu, tunnel source, tunnel destination. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `tunnel source s0/0` puis passer à la suite (0 point).

#### Diapo saisie 18 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-if)#`
- **Consigne (légende) :** « Créer le tunnel GRE vers RouterB. »
- **Réponse attendue (Text Entry) :** `tunnel destination 204.20.20.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « interface tunnel0, ip address, ip mtu, tunnel source, tunnel destination. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `tunnel destination 204.20.20.2` puis passer à la suite (0 point).

#### Diapo résultat — étape 3

- **Capture :** la sortie réelle sur RouterA. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
%LINEPROTO-5-UPDOWN: Line protocol on Interface Tunnel0, changed state to up
```


- **Explication (légende sur la diapo résultat) :** Sur RouterB : 172.16.1.2, tunnel destination 201.20.20.1.

### Étape 4 — Tester le tunnel (RouterA)

- **Diapo de contexte — texte :** Ping de l’extrémité du tunnel, puis du LAN distant.

#### Diapo saisie 19 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA#`
- **Consigne (légende) :** « Ping de l’extrémité du tunnel, puis du LAN distant. »
- **Réponse attendue (Text Entry) :** `ping 172.16.1.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ping 172.16.1.2 puis ping 10.0.20.1 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ping 172.16.1.2` puis passer à la suite (0 point).

#### Diapo saisie 20 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA#`
- **Consigne (légende) :** « Ping de l’extrémité du tunnel, puis du LAN distant. »
- **Réponse attendue (Text Entry) :** `ping 10.0.20.1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ping 172.16.1.2 puis ping 10.0.20.1 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ping 10.0.20.1` puis passer à la suite (0 point).

#### Diapo résultat — étape 4

- **Capture :** la sortie réelle sur RouterA. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
RouterA#ping 172.16.1.2
!!!!!
Success rate is 100 percent (5/5)
RouterA#ping 10.0.20.1
.....
Success rate is 0 percent (0/5)
```


- **Explication (légende sur la diapo résultat) :** Le ping vers 10.0.20.1 échoue : RouterA n'a pas de route vers 10.0.20.0/24 ; sa route par défaut envoie le paquet au WAN, qui ne connaît pas ce réseau privé.

### Étape 5 — Router le trafic inter-sites dans le tunnel (RouterA)

- **Diapo de contexte — texte :** Route statique vers le LAN distant via le tunnel.

#### Diapo saisie 21 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config)#`
- **Consigne (légende) :** « Route statique vers le LAN distant via le tunnel. »
- **Réponse attendue (Text Entry) :** `ip route 10.0.20.0 255.255.255.0 172.16.1.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip route <LAN distant> <masque> <adresse tunnel du pair> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip route 10.0.20.0 255.255.255.0 172.16.1.2` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Sur RouterB : ip route 10.0.10.0 255.255.255.0 172.16.1.1. Le ping 10.0.20.1 réussit alors. Capture sur S0/0 + « ping 10.0.20.1 repeat 1 » : IP externe (201.20.20.1 → 204.20.20.2, protocole 47 = GRE) / GRE / IP interne.

### Étape 6 — ISAKMP et politique VPN (RouterA)

- **Diapo de contexte — texte :** Phase 1 et paramètres IPsec.

#### Diapo saisie 22 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config)#`
- **Consigne (légende) :** « Phase 1 et paramètres IPsec. »
- **Réponse attendue (Text Entry) :** `crypto isakmp enable`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto isakmp enable / policy 1 / key / lifetime / transform-set strong »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `crypto isakmp enable` puis passer à la suite (0 point).

#### Diapo saisie 23 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config)#`
- **Consigne (légende) :** « Phase 1 et paramètres IPsec. »
- **Réponse attendue (Text Entry) :** `crypto isakmp policy 1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto isakmp enable / policy 1 / key / lifetime / transform-set strong »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `crypto isakmp policy 1` puis passer à la suite (0 point).

#### Diapo saisie 24 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-isakmp)#`
- **Consigne (légende) :** « Phase 1 et paramètres IPsec. »
- **Réponse attendue (Text Entry) :** `authentication pre-share`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto isakmp enable / policy 1 / key / lifetime / transform-set strong »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `authentication pre-share` puis passer à la suite (0 point).

#### Diapo saisie 25 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-isakmp)#`
- **Consigne (légende) :** « Phase 1 et paramètres IPsec. »
- **Réponse attendue (Text Entry) :** `exit`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto isakmp enable / policy 1 / key / lifetime / transform-set strong »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `exit` puis passer à la suite (0 point).

#### Diapo saisie 26 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config)#`
- **Consigne (légende) :** « Phase 1 et paramètres IPsec. »
- **Réponse attendue (Text Entry) :** `crypto isakmp key 6 P@ssword address 204.20.20.2`
- **Autres réponses acceptées :** `crypto isakmp key 0 P@ssword address 204.20.20.2` · `crypto isakmp key P@ssword address 204.20.20.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto isakmp enable / policy 1 / key / lifetime / transform-set strong »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `crypto isakmp key 6 P@ssword address 204.20.20.2` puis passer à la suite (0 point).

#### Diapo saisie 27 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config)#`
- **Consigne (légende) :** « Phase 1 et paramètres IPsec. »
- **Réponse attendue (Text Entry) :** `crypto ipsec security-association lifetime seconds 4096`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto isakmp enable / policy 1 / key / lifetime / transform-set strong »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `crypto ipsec security-association lifetime seconds 4096` puis passer à la suite (0 point).

#### Diapo saisie 28 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config)#`
- **Consigne (légende) :** « Phase 1 et paramètres IPsec. »
- **Réponse attendue (Text Entry) :** `crypto ipsec transform-set strong esp-3des esp-md5-hmac`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto isakmp enable / policy 1 / key / lifetime / transform-set strong »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `crypto ipsec transform-set strong esp-3des esp-md5-hmac` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** La clé « P@ssword » sert à l’authentification de RouterA avec RouterB (204.20.20.2). Le transform-set « strong » chiffre en 3DES et authentifie en MD5-HMAC ; la durée de vie de la clé de chiffrement est de 4096 s.

### Étape 7 — ACL GRE et crypto map (RouterA)

- **Diapo de contexte — texte :** Chiffrer tout le trafic du tunnel GRE.

#### Diapo saisie 29 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config)#`
- **Consigne (légende) :** « Chiffrer tout le trafic du tunnel GRE. »
- **Réponse attendue (Text Entry) :** `access-list 101 permit gre host 201.20.20.1 host 204.20.20.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « access-list 101 permit gre host … host …, puis crypto map S2SVPN 10 ipsec-isakmp … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `access-list 101 permit gre host 201.20.20.1 host 204.20.20.2` puis passer à la suite (0 point).

#### Diapo saisie 30 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config)#`
- **Consigne (légende) :** « Chiffrer tout le trafic du tunnel GRE. »
- **Réponse attendue (Text Entry) :** `crypto map S2SVPN 10 ipsec-isakmp`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « access-list 101 permit gre host … host …, puis crypto map S2SVPN 10 ipsec-isakmp … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `crypto map S2SVPN 10 ipsec-isakmp` puis passer à la suite (0 point).

#### Diapo saisie 31 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-crypto-map)#`
- **Consigne (légende) :** « Chiffrer tout le trafic du tunnel GRE. »
- **Réponse attendue (Text Entry) :** `match address 101`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « access-list 101 permit gre host … host …, puis crypto map S2SVPN 10 ipsec-isakmp … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `match address 101` puis passer à la suite (0 point).

#### Diapo saisie 32 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-crypto-map)#`
- **Consigne (légende) :** « Chiffrer tout le trafic du tunnel GRE. »
- **Réponse attendue (Text Entry) :** `set peer 204.20.20.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « access-list 101 permit gre host … host …, puis crypto map S2SVPN 10 ipsec-isakmp … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `set peer 204.20.20.2` puis passer à la suite (0 point).

#### Diapo saisie 33 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-crypto-map)#`
- **Consigne (légende) :** « Chiffrer tout le trafic du tunnel GRE. »
- **Réponse attendue (Text Entry) :** `set transform-set strong`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « access-list 101 permit gre host … host …, puis crypto map S2SVPN 10 ipsec-isakmp … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `set transform-set strong` puis passer à la suite (0 point).

#### Diapo saisie 34 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-crypto-map)#`
- **Consigne (légende) :** « Chiffrer tout le trafic du tunnel GRE. »
- **Réponse attendue (Text Entry) :** `interface s0/0`
- **Abréviation à accepter aussi :** `int s0/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « access-list 101 permit gre host … host …, puis crypto map S2SVPN 10 ipsec-isakmp … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface s0/0` puis passer à la suite (0 point).

#### Diapo saisie 35 — sur **RouterA**

- **Capture :** console de RouterA affichant l’invite `RouterA(config-if)#`
- **Consigne (légende) :** « Chiffrer tout le trafic du tunnel GRE. »
- **Réponse attendue (Text Entry) :** `crypto map S2SVPN`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « access-list 101 permit gre host … host …, puis crypto map S2SVPN 10 ipsec-isakmp … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `crypto map S2SVPN` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** S2SVPN = Site-to-Site VPN. RouterB : ACL inversée (gre host 204.20.20.2 host 201.20.20.1) et set peer 201.20.20.1. Après un ping 10.0.20.1, la capture sur S0/0 ne montre plus que de l’ESP. Explorez ensuite show crypto ?

## 5. Questions

### Diapo Q1 — Question du TP

**Question (texte affiché) :** Avant les routes statiques, « RouterA# ping 10.0.20.1 » aboutit-il ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Oui, grâce au tunnel
- [x] Non : aucune route ne dirige 10.0.20.0/24 vers le tunnel
- [ ] Oui, grâce à la NAT
- [ ] Non, car IPsec bloque

- **Feedback correct :** « Bonne réponse. La route par défaut envoie le paquet au WAN, qui ne connaît pas ce réseau privé. »
- **Feedback incorrect :** « Réponse incorrecte. La route par défaut envoie le paquet au WAN, qui ne connaît pas ce réseau privé. »
- Score : 1 point · Tentatives : 2

### Diapo Q2 — Question du TP

**Question (texte affiché) :** Pourquoi fixer ip mtu 1400 sur le tunnel ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Pour accélérer le routage
- [x] Pour éviter la fragmentation due aux en-têtes ajoutés par GRE puis IPsec
- [ ] Parce que GRE l’exige
- [ ] Pour la NAT

- **Feedback correct :** « Bonne réponse. L’encapsulation ajoute des octets à chaque paquet. »
- **Feedback incorrect :** « Réponse incorrecte. L’encapsulation ajoute des octets à chaque paquet. »
- Score : 1 point · Tentatives : 2

### Diapo Q3 — Question du TP

**Question (texte affiché) :** Rôle de la ligne « access-list 100 deny ip 10.0.10.0 … 10.0.20.0 … » ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Bloquer le trafic vers le site 2
- [x] Exclure le trafic inter-sites de la traduction NAT pour qu’il passe par le tunnel
- [ ] Chiffrer le trafic
- [ ] Autoriser Internet

- **Feedback correct :** « Bonne réponse. deny dans une ACL de NAT = ne pas traduire, pas « bloquer ». »
- **Feedback incorrect :** « Réponse incorrecte. deny dans une ACL de NAT = ne pas traduire, pas « bloquer ». »
- Score : 1 point · Tentatives : 2

### Diapo Q4 — Question du TP

**Question (texte affiché) :** Ordonnez les en-têtes d’un ping 10.0.20.1 dans le tunnel GRE (de l’extérieur vers l’intérieur).

**Interaction ActivePresenter :** Question de séquence (Sequence). Ordre correct :

1. IP externe 201.20.20.1 → 204.20.20.2
2. GRE
3. IP interne 172.16.1.1 → 10.0.20.1
4. ICMP Echo

- **Feedback correct :** « Bonne réponse. Le paquet d’origine (IP + ICMP) est encapsulé dans GRE, lui-même dans un IP externe aux adresses publiques. »
- **Feedback incorrect :** « Réponse incorrecte. Le paquet d’origine (IP + ICMP) est encapsulé dans GRE, lui-même dans un IP externe aux adresses publiques. »
- Score : 1 point · Tentatives : 2

### Diapo Q5 — Question du TP

**Question (texte affiché) :** Pourquoi combiner GRE et IPsec ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] IPsec seul est trop lent
- [x] IPsec ne supporte pas le multicast : GRE permet le routage dynamique, IPsec chiffre
- [ ] GRE chiffre et IPsec route
- [ ] Pour économiser des adresses

- **Feedback correct :** « Bonne réponse. Explication de l’énoncé. »
- **Feedback incorrect :** « Réponse incorrecte. Explication de l’énoncé. »
- Score : 1 point · Tentatives : 2

### Diapo Q6 — Question de notion

**Question (texte affiché) :** Quel protocole l’ACL 101 désigne-t-elle comme trafic à chiffrer ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `gre`

- **Feedback correct :** « Bonne réponse. access-list 101 permit gre host 201.20.20.1 host 204.20.20.2. »
- **Feedback incorrect :** « Réponse incorrecte. access-list 101 permit gre host 201.20.20.1 host 204.20.20.2. »
- Score : 1 point · Tentatives : 2

### Diapo Q7 — Question du TP

**Question (texte affiché) :** Dans « transform-set strong esp-3des esp-md5-hmac », que désigne « strong » ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] L’algorithme de chiffrement
- [x] Le nom du transform-set
- [ ] Le niveau de sécurité IOS
- [ ] Le pair

- **Feedback correct :** « Bonne réponse. strong est le nom donné ; esp-3des chiffre, esp-md5-hmac authentifie. »
- **Feedback incorrect :** « Réponse incorrecte. strong est le nom donné ; esp-3des chiffre, esp-md5-hmac authentifie. »
- Score : 1 point · Tentatives : 2

### Diapo Q8 — Question de notion

**Question (texte affiché) :** Après la partie II, que montre la capture sur S0/0 lors d’un ping 10.0.20.1 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] IP/GRE/IP en clair
- [x] Des paquets ESP entre 201.20.20.1 et 204.20.20.2
- [ ] De l’ICMP en clair
- [ ] Rien

- **Feedback correct :** « Bonne réponse. Le paquet GRE est chiffré dans ESP : on ne voit plus que les adresses publiques. »
- **Feedback incorrect :** « Réponse incorrecte. Le paquet GRE est chiffré dans ESP : on ne voit plus que les adresses publiques. »
- Score : 1 point · Tentatives : 2

## 6. Diapo bonus « Erreur classique » (optionnelle)

### Tunnel sans route

- **Contexte :** Le tunnel est up, ping 172.16.1.2 OK.
- **Incorrect :**

```
! aucune route vers 10.0.20.0/24
```

  → ping 10.0.20.1 échoue : le trafic suit la route par défaut vers le WAN.
- **Correct :**

```
ip route 10.0.20.0 255.255.255.0 172.16.1.2
```

  → Le trafic inter-sites entre dans le tunnel : ping OK.
- **À retenir :** Un tunnel est un lien : il faut une route (statique ou dynamique) pour y envoyer le trafic.

### NAT sans exclusion

- **Contexte :** ACL 100 de RouterA.
- **Incorrect :**

```
access-list 100 permit ip 10.0.10.0 0.0.0.255 any
```

  → Le trafic vers le site 2 est aussi traduit : le site distant reçoit une source publique au lieu de 10.0.10.x.
- **Correct :**

```
access-list 100 deny ip 10.0.10.0 0.0.0.255 10.0.20.0 0.0.0.255
access-list 100 permit ip 10.0.10.0 0.0.0.255 any
```

  → Seul le trafic Internet est traduit ; l’inter-sites garde ses adresses privées.
- **À retenir :** Excluez le trafic VPN de la NAT, avant le permit any.

## 7. Diapo « Résultat final »

- Afficher le score (variable *Score* du projet) et le pourcentage.
- Boutons : « Recommencer » (aller à la diapo 1) · « Revoir les erreurs ».
- *Optionnel* — remonter le score dans IT LAB : sur cette diapo, Événement « Au chargement » → action **Exécuter JavaScript** :

```
parent.postMessage({ source: 'itlab-ap', tp: 'gre-ipsec', score: 1, max: 1 }, '*');
```

## 8. Notes sur l’énoncé

- Coquille corrigée : l'énoncé écrit « int s0/0 255.255.255.252 » puis « ip address 201.20.20.1 » ; la forme correcte est ip address 201.20.20.1 255.255.255.252 sur s0/0 (idem RouterB).
- « crypto isakmp key 6 P@ssword » : l'énoncé explique que 6 « indique que la clé doit être chiffrée ». Sur IOS, ce chiffre indique le type de la clé saisie (0 = en clair, 6 = déjà chiffrée en type 6). La commande de l'énoncé est conservée, les variantes key 0 et sans chiffre sont acceptées. Point à valider avec l'enseignant.

---
Source : Énoncé – Tunnel GRE over IPsec.

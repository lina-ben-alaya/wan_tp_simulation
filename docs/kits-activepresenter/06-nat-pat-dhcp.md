# Kit ActivePresenter — TP NAT/DHCP : DHCP, NAT et PAT

> Kit de production pour réaliser **votre propre** simulation de ce TP dans ActivePresenter. Contenu issu de l’énoncé et de la plateforme IT LAB. Les sorties marquées *reconstituées* doivent être remplacées par **vos captures réelles** (GNS3 / Packet Tracer).

## 0. Paramètres du projet

| Réglage | Valeur |
|---|---|
| Nom du projet | `nat-pat-dhcp` |
| Taille | 1280 × 720 (ou la taille de vos captures), option *Responsive* activée |
| Auteur (Fichier → Propriétés du projet) | Lina Ben Alaya |
| Export | HTML5, dossier `nat-pat-dhcp` |
| Volume | 9 étapes · 35 saisies de commandes · 10 questions |
| Outils à ouvrir | Cisco Packet Tracer, Routeurs 1841, Commutateurs 2960 |

## 1. Diapo « Introduction »

- **Titre :** TP NAT/DHCP — DHCP, NAT et PAT
- **Sous-titre :** Serveur et relais DHCP, NAT statique, NAT dynamique et surcharge
- **Texte :** La société ABC dispose de trois LAN privés (192.168.10.0, 192.168.11.0, 192.168.30.0), d'une zone publique avec un serveur web et d'un accès Internet via son FAI. Le FAI héberge un serveur DNS et un serveur FTP. Un internaute, derrière Router4, doit accéder aux serveurs publics.
- **Bouton :** « Commencer » → diapo suivante

## 2. Diapo « Objectifs »

- Configurer les routes statiques et par défaut de l’intranet
- Configurer R2 en serveur DHCP (exclusions, pools, passerelle, DNS)
- Configurer un agent relais DHCP (ip helper-address) sur R1 et R3
- Configurer la NAT statique (serveur web, serveurs du FAI)
- Configurer la NAT dynamique avec un pool, puis la surcharge (PAT)
- Vérifier avec show ip dhcp binding, show ip nat translations et show ip nat statistics

- **Boutons :** « Retour » · « Suivant »

## 3. Diapo « Environnement et topologie »

- **Capture à réaliser :** la topologie complète dans Cisco Packet Tracer.
- **Légende / callouts** (un par équipement) :
  - **R1** : f0/0 : 192.168.10.1/24 · f0/1 : 192.168.11.1/24 · Série : 10.10.10.1/30
  - **R3** : f0/0 : 192.168.30.1/24 · Série : 10.10.9.1/30
  - **R2** (DHCP + NAT) : 10.10.10.2/30 (vers R1) · 10.10.9.2/30 (vers R3) · fa0/0 : 192.168.20.1/29 · S0/1/0 : 209.165.200.225/30
  - **LAN 10 / 11** : 192.168.10.0/24 (PC0, PC1) · 192.168.11.0/24 (PC5, PC6)
  - **LAN 30** : 192.168.30.0/24 (PC2, PC3)
  - **Serveur Web** : Local : 192.168.20.2 · Global : 77.77.77.77
  - **ISP** (FAI) : 209.165.200.226/30 (vers R2) · 209.165.200.229/30 (vers Router4) · fa0/0 : 192.168.10.1/24 (hébergement)
  - **Serveur DNS** : Local : 192.168.10.3 · Global : 88.88.88.88
  - **Serveur FTP** : Local : 192.168.10.2 · Global : 66.66.66.66
  - **Router4** : 209.165.200.230/30 · LAN 192.168.1.0/24 (PAT)
  - **Internaute** : 192.168.1.0/24
- **Matériel :** R1, R2, R3, ISP, Router4, Serveur Web, Serveur DNS, Serveur FTP, PC

## 4. Manipulations (simulation logicielle)

> Pour chaque commande : une diapo avec la **capture de la console à l’invite indiquée**, une **zone de saisie (Text Entry)** placée sur la ligne de commande, et les feedbacks. Cochez *Insensible à la casse*. Ajoutez une diapo « Résultat » après la dernière commande de l’étape si une sortie est indiquée.

### Étape 1 — Routes statiques de R1 (R1)

- **Diapo de contexte — texte :** R1 renvoie tout le reste vers R2.

#### Diapo saisie 1 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config)#`
- **Consigne (légende) :** « R1 renvoie tout le reste vers R2. »
- **Réponse attendue (Text Entry) :** `ip route 192.168.30.0 255.255.255.0 10.10.10.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip route <réseau> <masque> 10.10.10.2 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip route 192.168.30.0 255.255.255.0 10.10.10.2` puis passer à la suite (0 point).

#### Diapo saisie 2 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config)#`
- **Consigne (légende) :** « R1 renvoie tout le reste vers R2. »
- **Réponse attendue (Text Entry) :** `ip route 10.10.9.0 255.255.255.252 10.10.10.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip route <réseau> <masque> 10.10.10.2 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip route 10.10.9.0 255.255.255.252 10.10.10.2` puis passer à la suite (0 point).

#### Diapo saisie 3 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config)#`
- **Consigne (légende) :** « R1 renvoie tout le reste vers R2. »
- **Réponse attendue (Text Entry) :** `ip route 192.168.20.0 255.255.255.248 10.10.10.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip route <réseau> <masque> 10.10.10.2 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip route 192.168.20.0 255.255.255.248 10.10.10.2` puis passer à la suite (0 point).

#### Diapo saisie 4 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config)#`
- **Consigne (légende) :** « R1 renvoie tout le reste vers R2. »
- **Réponse attendue (Text Entry) :** `ip route 0.0.0.0 0.0.0.0 10.10.10.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip route <réseau> <masque> 10.10.10.2 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip route 0.0.0.0 0.0.0.0 10.10.10.2` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Tâche 1 de l'énoncé. R2 reçoit des routes vers 192.168.10.0, 192.168.11.0 (via 10.10.10.1) et 192.168.30.0 (via 10.10.9.1), plus une route par défaut vers 209.165.200.226.

### Étape 2 — Exclure les adresses statiques (R2)

- **Diapo de contexte — texte :** Réserver passerelles et adresses fixes.

#### Diapo saisie 5 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « Réserver passerelles et adresses fixes. »
- **Réponse attendue (Text Entry) :** `ip dhcp excluded-address 192.168.10.1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip dhcp excluded-address <adresse> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip dhcp excluded-address 192.168.10.1` puis passer à la suite (0 point).

#### Diapo saisie 6 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « Réserver passerelles et adresses fixes. »
- **Réponse attendue (Text Entry) :** `ip dhcp excluded-address 192.168.10.10`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip dhcp excluded-address <adresse> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip dhcp excluded-address 192.168.10.10` puis passer à la suite (0 point).

#### Diapo saisie 7 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « Réserver passerelles et adresses fixes. »
- **Réponse attendue (Text Entry) :** `ip dhcp excluded-address 192.168.11.1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip dhcp excluded-address <adresse> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip dhcp excluded-address 192.168.11.1` puis passer à la suite (0 point).

#### Diapo saisie 8 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « Réserver passerelles et adresses fixes. »
- **Réponse attendue (Text Entry) :** `ip dhcp excluded-address 192.168.11.10`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip dhcp excluded-address <adresse> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip dhcp excluded-address 192.168.11.10` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Ces adresses ne seront jamais attribuées par le serveur DHCP.

### Étape 3 — Créer le pool R1Fa0/0 (R2)

- **Diapo de contexte — texte :** Pool du réseau 192.168.10.0/24.

#### Diapo saisie 9 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « Pool du réseau 192.168.10.0/24. »
- **Réponse attendue (Text Entry) :** `ip dhcp pool R1Fa0/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip dhcp pool <nom>, puis network, default-router, dns-server. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip dhcp pool R1Fa0/0` puis passer à la suite (0 point).

#### Diapo saisie 10 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(dhcp-config)#`
- **Consigne (légende) :** « Pool du réseau 192.168.10.0/24. »
- **Réponse attendue (Text Entry) :** `network 192.168.10.0 255.255.255.0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip dhcp pool <nom>, puis network, default-router, dns-server. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `network 192.168.10.0 255.255.255.0` puis passer à la suite (0 point).

#### Diapo saisie 11 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(dhcp-config)#`
- **Consigne (légende) :** « Pool du réseau 192.168.10.0/24. »
- **Réponse attendue (Text Entry) :** `default-router 192.168.10.1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip dhcp pool <nom>, puis network, default-router, dns-server. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `default-router 192.168.10.1` puis passer à la suite (0 point).

#### Diapo saisie 12 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(dhcp-config)#`
- **Consigne (légende) :** « Pool du réseau 192.168.10.0/24. »
- **Réponse attendue (Text Entry) :** `dns-server 88.88.88.88`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip dhcp pool <nom>, puis network, default-router, dns-server. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `dns-server 88.88.88.88` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Créez de même R1Fa0/1 (192.168.11.0, passerelle .11.1) et R3Fa0/0 (192.168.30.0, passerelle .30.1).

### Étape 4 — Agent relais DHCP (R1)

- **Diapo de contexte — texte :** Relayer les DHCPDISCOVER des deux LAN de R1 vers R2.

#### Diapo saisie 13 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config)#`
- **Consigne (légende) :** « Relayer les DHCPDISCOVER des deux LAN de R1 vers R2. »
- **Réponse attendue (Text Entry) :** `interface f0/0`
- **Abréviation à accepter aussi :** `int f0/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip helper-address <adresse du serveur DHCP> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface f0/0` puis passer à la suite (0 point).

#### Diapo saisie 14 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-if)#`
- **Consigne (légende) :** « Relayer les DHCPDISCOVER des deux LAN de R1 vers R2. »
- **Réponse attendue (Text Entry) :** `ip helper-address 10.10.10.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip helper-address <adresse du serveur DHCP> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip helper-address 10.10.10.2` puis passer à la suite (0 point).

#### Diapo saisie 15 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-if)#`
- **Consigne (légende) :** « Relayer les DHCPDISCOVER des deux LAN de R1 vers R2. »
- **Réponse attendue (Text Entry) :** `exit`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip helper-address <adresse du serveur DHCP> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `exit` puis passer à la suite (0 point).

#### Diapo saisie 16 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config)#`
- **Consigne (légende) :** « Relayer les DHCPDISCOVER des deux LAN de R1 vers R2. »
- **Réponse attendue (Text Entry) :** `interface f0/1`
- **Abréviation à accepter aussi :** `int f0/1`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip helper-address <adresse du serveur DHCP> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface f0/1` puis passer à la suite (0 point).

#### Diapo saisie 17 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-if)#`
- **Consigne (légende) :** « Relayer les DHCPDISCOVER des deux LAN de R1 vers R2. »
- **Réponse attendue (Text Entry) :** `ip helper-address 10.10.10.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip helper-address <adresse du serveur DHCP> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip helper-address 10.10.10.2` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Sur R3 : interface f0/0, ip helper-address 10.10.9.2.

### Étape 5 — Vérifier les baux (R2)

- **Diapo de contexte — texte :** Lister les adresses attribuées.

#### Diapo saisie 18 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2#`
- **Consigne (légende) :** « Lister les adresses attribuées. »
- **Réponse attendue (Text Entry) :** `show ip dhcp binding`
- **Abréviation à accepter aussi :** `sh ip dhcp binding`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show ip dhcp binding »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show ip dhcp binding` puis passer à la suite (0 point).

#### Diapo résultat — étape 5

- **Capture :** la sortie réelle sur R2. Sortie extraite de l’énoncé :

```
IP address       Client-ID/            Lease expiration        Type
                 Hardware address
192.168.10.2     0004.9AD8.83A8           --                   Automatic
192.168.11.2     00E0.A31A.E050           --                   Automatic
192.168.30.2     0001.966C.A561           --                   Automatic
192.168.30.3     00E0.F957.94CD           --                   Automatic
```


- **Explication (légende sur la diapo résultat) :** Chaque PC a reçu la première adresse libre de son pool. Les adresses MAC sont celles de la maquette de l’énoncé.

### Étape 6 — NAT statique du serveur web (R2)

- **Diapo de contexte — texte :** Publier 192.168.20.2 sous 77.77.77.77.

#### Diapo saisie 19 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « Publier 192.168.20.2 sous 77.77.77.77. »
- **Réponse attendue (Text Entry) :** `ip nat inside source static 192.168.20.2 77.77.77.77`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip nat inside source static <local> <global>, puis inside/outside sur les interfaces. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip nat inside source static 192.168.20.2 77.77.77.77` puis passer à la suite (0 point).

#### Diapo saisie 20 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « Publier 192.168.20.2 sous 77.77.77.77. »
- **Réponse attendue (Text Entry) :** `interface serial0/1/0`
- **Abréviation à accepter aussi :** `int s0/1/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip nat inside source static <local> <global>, puis inside/outside sur les interfaces. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface serial0/1/0` puis passer à la suite (0 point).

#### Diapo saisie 21 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config-if)#`
- **Consigne (légende) :** « Publier 192.168.20.2 sous 77.77.77.77. »
- **Réponse attendue (Text Entry) :** `ip nat outside`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip nat inside source static <local> <global>, puis inside/outside sur les interfaces. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip nat outside` puis passer à la suite (0 point).

#### Diapo saisie 22 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config-if)#`
- **Consigne (légende) :** « Publier 192.168.20.2 sous 77.77.77.77. »
- **Réponse attendue (Text Entry) :** `interface fa0/0`
- **Abréviation à accepter aussi :** `int fa0/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip nat inside source static <local> <global>, puis inside/outside sur les interfaces. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface fa0/0` puis passer à la suite (0 point).

#### Diapo saisie 23 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config-if)#`
- **Consigne (légende) :** « Publier 192.168.20.2 sous 77.77.77.77. »
- **Réponse attendue (Text Entry) :** `ip nat inside`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip nat inside source static <local> <global>, puis inside/outside sur les interfaces. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip nat inside` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Les hôtes externes accèdent au serveur web via 77.77.77.77. Sur ISP : NAT statique 192.168.10.3 → 88.88.88.88 et 192.168.10.2 → 66.66.66.66, puis ip route 77.77.77.77 255.255.255.255 serial0/0/0.

### Étape 7 — NAT dynamique avec un pool (R2)

- **Diapo de contexte — texte :** Traduire les 3 LAN privés avec 6 adresses publiques.

#### Diapo saisie 24 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « Traduire les 3 LAN privés avec 6 adresses publiques. »
- **Réponse attendue (Text Entry) :** `ip nat pool MY-NAT-POOL 209.165.200.241 209.165.200.246 netmask 255.255.255.248`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip nat pool, ACL étendue NAT, puis ip nat inside source list … pool … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip nat pool MY-NAT-POOL 209.165.200.241 209.165.200.246 netmask 255.255.255.248` puis passer à la suite (0 point).

#### Diapo saisie 25 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « Traduire les 3 LAN privés avec 6 adresses publiques. »
- **Réponse attendue (Text Entry) :** `ip access-list extended NAT`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip nat pool, ACL étendue NAT, puis ip nat inside source list … pool … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip access-list extended NAT` puis passer à la suite (0 point).

#### Diapo saisie 26 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config-ext-nacl)#`
- **Consigne (légende) :** « Traduire les 3 LAN privés avec 6 adresses publiques. »
- **Réponse attendue (Text Entry) :** `permit ip 192.168.10.0 0.0.0.255 any`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip nat pool, ACL étendue NAT, puis ip nat inside source list … pool … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `permit ip 192.168.10.0 0.0.0.255 any` puis passer à la suite (0 point).

#### Diapo saisie 27 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config-ext-nacl)#`
- **Consigne (légende) :** « Traduire les 3 LAN privés avec 6 adresses publiques. »
- **Réponse attendue (Text Entry) :** `permit ip 192.168.11.0 0.0.0.255 any`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip nat pool, ACL étendue NAT, puis ip nat inside source list … pool … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `permit ip 192.168.11.0 0.0.0.255 any` puis passer à la suite (0 point).

#### Diapo saisie 28 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config-ext-nacl)#`
- **Consigne (légende) :** « Traduire les 3 LAN privés avec 6 adresses publiques. »
- **Réponse attendue (Text Entry) :** `permit ip 192.168.30.0 0.0.0.255 any`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip nat pool, ACL étendue NAT, puis ip nat inside source list … pool … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `permit ip 192.168.30.0 0.0.0.255 any` puis passer à la suite (0 point).

#### Diapo saisie 29 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config-ext-nacl)#`
- **Consigne (légende) :** « Traduire les 3 LAN privés avec 6 adresses publiques. »
- **Réponse attendue (Text Entry) :** `exit`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip nat pool, ACL étendue NAT, puis ip nat inside source list … pool … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `exit` puis passer à la suite (0 point).

#### Diapo saisie 30 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « Traduire les 3 LAN privés avec 6 adresses publiques. »
- **Réponse attendue (Text Entry) :** `ip nat inside source list NAT pool MY-NAT-POOL`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « ip nat pool, ACL étendue NAT, puis ip nat inside source list … pool … »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip nat inside source list NAT pool MY-NAT-POOL` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Ajoutez ip nat inside sur s0/0/0 et s0/0/1 (côté R1 et R3) ; sur ISP : ip route 209.165.200.240 255.255.255.240 serial0/0/0.

### Étape 8 — Passer en surcharge (PAT) (R2)

- **Diapo de contexte — texte :** Supprimer le pool et traduire sur l’adresse de S0/1/0.

#### Diapo saisie 31 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « Supprimer le pool et traduire sur l’adresse de S0/1/0. »
- **Réponse attendue (Text Entry) :** `no ip nat inside source list NAT pool MY-NAT-POOL`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « … list NAT interface serial0/1/0 overload »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `no ip nat inside source list NAT pool MY-NAT-POOL` puis passer à la suite (0 point).

#### Diapo saisie 32 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « Supprimer le pool et traduire sur l’adresse de S0/1/0. »
- **Réponse attendue (Text Entry) :** `no ip nat pool MY-NAT-POOL 209.165.200.241 209.165.200.246 netmask 255.255.255.248`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « … list NAT interface serial0/1/0 overload »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `no ip nat pool MY-NAT-POOL 209.165.200.241 209.165.200.246 netmask 255.255.255.248` puis passer à la suite (0 point).

#### Diapo saisie 33 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2(config)#`
- **Consigne (légende) :** « Supprimer le pool et traduire sur l’adresse de S0/1/0. »
- **Réponse attendue (Text Entry) :** `ip nat inside source list NAT interface serial0/1/0 overload`
- **Abréviation à accepter aussi :** `ip nat inside source list NAT interface s0/1/0 overload`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « … list NAT interface serial0/1/0 overload »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip nat inside source list NAT interface serial0/1/0 overload` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Si le message « %Pool MY-NAT-POOL in use, cannot destroy » apparaît, effacez d'abord les traductions : clear ip nat translation *. overload ajoute le numéro de port à la traduction.

### Étape 9 — Vérifier la traduction (R2)

- **Diapo de contexte — texte :** Observer les traductions avec ports.

#### Diapo saisie 34 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2#`
- **Consigne (légende) :** « Observer les traductions avec ports. »
- **Réponse attendue (Text Entry) :** `show ip nat translations`
- **Abréviation à accepter aussi :** `sh ip nat translations`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show ip nat translations »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show ip nat translations` puis passer à la suite (0 point).

#### Diapo saisie 35 — sur **R2**

- **Capture :** console de R2 affichant l’invite `R2#`
- **Consigne (légende) :** « Observer les traductions avec ports. »
- **Réponse attendue (Text Entry) :** `show ip nat statistics`
- **Abréviation à accepter aussi :** `sh ip nat statistics`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show ip nat translations »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show ip nat statistics` puis passer à la suite (0 point).

#### Diapo résultat — étape 9

- **Capture :** la sortie réelle sur R2. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
Pro  Inside global          Inside local        Outside local       Outside global
icmp 209.165.200.225:1     192.168.10.2:1      209.165.200.226:1   209.165.200.226:1
icmp 209.165.200.225:2     192.168.30.2:2      209.165.200.226:2   209.165.200.226:2
---  77.77.77.77            192.168.20.2        ---                 ---
```


- **Explication (légende sur la diapo résultat) :** Plusieurs hôtes partagent l’adresse de S0/1/0 ; le numéro de port les distingue. La traduction statique du serveur web reste permanente.

## 5. Questions

### Diapo Q1 — Question du TP

**Question (texte affiché) :** À quoi sert ip dhcp excluded-address ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] À bloquer un client
- [x] À empêcher le routeur d’attribuer des adresses réservées (interfaces, serveurs, imprimantes)
- [ ] À créer un pool
- [ ] À relayer DHCP

- **Feedback correct :** « Bonne réponse. Le serveur suppose sinon que toutes les adresses du pool sont attribuables. »
- **Feedback incorrect :** « Réponse incorrecte. Le serveur suppose sinon que toutes les adresses du pool sont attribuables. »
- Score : 1 point · Tentatives : 2

### Diapo Q2 — Question du TP

**Question (texte affiché) :** Pourquoi configurer ip helper-address sur R1 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Pour chiffrer DHCP
- [x] Les clients et le serveur DHCP ne sont pas sur le même sous-réseau : les diffusions doivent être relayées vers R2
- [ ] Pour activer la NAT
- [ ] Pour donner une passerelle aux PC

- **Feedback correct :** « Bonne réponse. DHCP fonctionne par diffusions de couche 2, qui ne franchissent pas les routeurs. »
- **Feedback incorrect :** « Réponse incorrecte. DHCP fonctionne par diffusions de couche 2, qui ne franchissent pas les routeurs. »
- Score : 1 point · Tentatives : 2

### Diapo Q3 — Question de notion

**Question (texte affiché) :** Quelle adresse helper configurer sur R3 f0/0 ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `10.10.9.2`

- **Feedback correct :** « Bonne réponse. L’interface de R2 sur le lien R2–R3. »
- **Feedback incorrect :** « Réponse incorrecte. L’interface de R2 sur le lien R2–R3. »
- Score : 1 point · Tentatives : 2

### Diapo Q4 — Question du TP

**Question (texte affiché) :** Quelle adresse publique utilisent les hôtes externes pour joindre le serveur web d’ABC ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] 192.168.20.2
- [x] 77.77.77.77
- [ ] 209.165.200.225
- [ ] 88.88.88.88

- **Feedback correct :** « Bonne réponse. NAT statique 192.168.20.2 ↔ 77.77.77.77. »
- **Feedback incorrect :** « Réponse incorrecte. NAT statique 192.168.20.2 ↔ 77.77.77.77. »
- Score : 1 point · Tentatives : 2

### Diapo Q5 — Question du TP

**Question (texte affiché) :** Pourquoi ajouter « ip route 77.77.77.77 255.255.255.255 serial0/0/0 » sur ISP ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Pour la NAT de l’ISP
- [x] L’ISP doit savoir joindre les adresses publiques utilisées par la NAT de R2
- [ ] Pour DHCP
- [ ] Pour activer le PAT

- **Feedback correct :** « Bonne réponse. R2 traduit en adresses publiques ; l’ISP doit les router vers R2. »
- **Feedback incorrect :** « Réponse incorrecte. R2 traduit en adresses publiques ; l’ISP doit les router vers R2. »
- Score : 1 point · Tentatives : 2

### Diapo Q6 — Question de notion

**Question (texte affiché) :** Combien d’adresses publiques contient MY-NAT-POOL (209.165.200.241 à .246) ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `6`
- `six`

- **Feedback correct :** « Bonne réponse. De .241 à .246 inclus : 6 adresses. »
- **Feedback incorrect :** « Réponse incorrecte. De .241 à .246 inclus : 6 adresses. »
- Score : 1 point · Tentatives : 2

### Diapo Q7 — Question du TP

**Question (texte affiché) :** Que se passe-t-il si plus de 6 hôtes doivent sortir en même temps avec le pool ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Ils partagent automatiquement les adresses
- [x] Le pool est épuisé : les hôtes supplémentaires ne sont pas traduits tant qu’une traduction n’a pas expiré
- [ ] Le routeur crée de nouvelles adresses
- [ ] Le trafic est envoyé sans traduction

- **Feedback correct :** « Bonne réponse. C’est la limite de la NAT dynamique qui motive la surcharge (PAT). »
- **Feedback incorrect :** « Réponse incorrecte. C’est la limite de la NAT dynamique qui motive la surcharge (PAT). »
- Score : 1 point · Tentatives : 2

### Diapo Q8 — Question du TP

**Question (texte affiché) :** Que permet le mot-clé overload ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] De traduire plus vite
- [x] D’ajouter le numéro de port à la traduction : plusieurs hôtes partagent une adresse publique
- [ ] D’augmenter la taille du pool
- [ ] D’exclure des adresses

- **Feedback correct :** « Bonne réponse. La surcharge suit les numéros de port. »
- **Feedback incorrect :** « Réponse incorrecte. La surcharge suit les numéros de port. »
- Score : 1 point · Tentatives : 2

### Diapo Q9 — Question du TP

**Question (texte affiché) :** Quelle commande efface toutes les traductions NAT ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `clear ip nat translation *`

- **Feedback correct :** « Bonne réponse. Nécessaire si le pool est « in use » au moment de le supprimer. »
- **Feedback incorrect :** « Réponse incorrecte. Nécessaire si le pool est « in use » au moment de le supprimer. »
- Score : 1 point · Tentatives : 2

### Diapo Q10 — Question de notion

**Question (texte affiché) :** Ordonnez la configuration de la NAT dynamique.

**Interaction ActivePresenter :** Question de séquence (Sequence). Ordre correct :

1. Définir le pool d’adresses globales
2. Créer l’ACL des adresses internes à traduire
3. Associer l’ACL au pool (ip nat inside source list)
4. Désigner les interfaces inside et outside
5. Ajouter la route statique sur l’ISP
6. Vérifier (show ip nat translations)

- **Feedback correct :** « Bonne réponse. Ordre des étapes de la tâche 7 de l’énoncé. »
- **Feedback incorrect :** « Réponse incorrecte. Ordre des étapes de la tâche 7 de l’énoncé. »
- Score : 1 point · Tentatives : 2

## 6. Diapo bonus « Erreur classique » (optionnelle)

### Pool de 6 adresses ou surcharge

- **Contexte :** Les trois LAN d’ABC sortent vers Internet.
- **Incorrect :**

```
ip nat pool MY-NAT-POOL 209.165.200.241 209.165.200.246 netmask 255.255.255.248
ip nat inside source list NAT pool MY-NAT-POOL
```

  → Au-delà de 6 hôtes simultanés, les nouvelles connexions ne sont pas traduites.
- **Correct :**

```
ip nat inside source list NAT interface serial0/1/0 overload
```

  → Tous les hôtes partagent l’adresse de S0/1/0, distingués par le port.
- **À retenir :** La NAT dynamique est limitée par la taille du pool ; la surcharge (PAT) lève cette limite.

### Relais DHCP absent

- **Contexte :** Les PC de 192.168.30.0/24 demandent une adresse à R2.
- **Incorrect :**

```
R3: interface f0/0
 ! pas de ip helper-address
```

  → Les DHCPDISCOVER (diffusion) restent sur le LAN : les PC n’obtiennent pas d’adresse.
- **Correct :**

```
R3: interface f0/0
 ip helper-address 10.10.9.2
```

  → R3 relaie vers R2 : les PC reçoivent 192.168.30.x.
- **À retenir :** Un serveur DHCP sur un autre sous-réseau nécessite un agent relais.

### Route vers l’adresse publique oubliée sur l’ISP

- **Contexte :** Un internaute veut joindre 77.77.77.77.
- **Incorrect :**

```
ISP: ! pas de route vers 77.77.77.77
```

  → L’ISP ne sait pas où envoyer le trafic : le serveur web est injoignable.
- **Correct :**

```
ISP: ip route 77.77.77.77 255.255.255.255 serial0/0/0
```

  → Le trafic atteint R2, qui le traduit vers 192.168.20.2.
- **À retenir :** Les adresses globales utilisées par la NAT doivent être routées jusqu’au routeur qui traduit.

## 7. Diapo « Résultat final »

- Afficher le score (variable *Score* du projet) et le pourcentage.
- Boutons : « Recommencer » (aller à la diapo 1) · « Revoir les erreurs ».
- *Optionnel* — remonter le score dans IT LAB : sur cette diapo, Événement « Au chargement » → action **Exécuter JavaScript** :

```
parent.postMessage({ source: 'itlab-ap', tp: 'nat-pat-dhcp', score: 1, max: 1 }, '*');
```

## 8. Notes sur l’énoncé

- L'énoncé numérote deux « Tâche 6 » et ne contient pas de tâches 3 et 4 ; la plateforme suit l'ordre logique des manipulations.
- Coquilles normalisées : « ipdhcp » → ip dhcp, « DEFault-router » → default-router, « ipnat » → ip nat.
- Le document PDF est un scan ; certaines adresses d'interface (R1 10.10.10.1, R3 10.10.9.1, ISP .226/.229, Router4 .230) sont déduites du schéma.
- La tâche 9 (PAT sur Router4) n'est pas détaillée dans l'énoncé : elle suit le même principe que la surcharge sur R2.

---
Source : Énoncé – Configuration du DHCP et NAT.

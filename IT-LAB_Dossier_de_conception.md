# IT LAB – Interactive Learning Platform
## Dossier de conception (phase 0 – avant développement)

> Version 0.1 – 14/11/2026 – Document soumis à validation. Aucune ligne de code n'a été écrite.

**Sommaire**
1. Analyse comparative des deux références
2. Inventaire et analyse des 10 TP
3. Anomalies et points à valider dans les documents
4. Architecture technique proposée
5. Maquette (design system + wireframes)
6. Fonctionnalités innovantes (priorisées)
7. Plan de réalisation des simulations ActivePresenter + storyboards
8. Scénario de démonstration devant le jury
9. Feuille de route
10. Questions à valider

---

## 1. Analyse comparative des références

### 1.1 Référence 1 – brahimfatnass.github.io/simulations (« Network Labs »)

| Aspect | Constat |
|---|---|
| Structure | Page unique : hero + carte réseau interactive + archive des 10 labs (ancre `#archive`). |
| Navigation | Carte « hub » : chaque nœud = un lab ; clic → aperçu (niveau, durée, tags) → « Launch simulation » ou « New tab ». Tri : ordre du cours / difficulté / durée. |
| Interactivité | Lab ouvert dans le navigateur (simulation HTML5). Case « Mark as done ». |
| Design | Sombre, accent vert/lime néon, typographie grasse, très « produit SaaS ». Fort impact visuel. |
| Progression | Compteur « 0 of 10 done » (déclaratif, cochage manuel). |
| Limites | Pas de quiz ni de score, pas de recherche, pas de contenu théorique, pas de compte rendu, progression déclarative, pas de mode clair visible, aucun lien entre les TP. |

### 1.2 Référence 2 – youssefbelghith27.github.io/wan-tp-simulations

| Aspect | Constat |
|---|---|
| Structure | Page unique académique (ISET Nabeul, RSI31) : hero, liste des TP groupés par thème (« Cœur de réseau MPLS »…), guide d'utilisation, notes de méthode. |
| Volume annoncé | 10 TP, 330 diapositives, 174 commandes à taper, 23 actions Wireshark. |
| Interactivité | Simulations ActivePresenter : console IOS simulée (saisie validée, abréviations acceptées), écrans Wireshark reconstitués (filtre, dépliage d'en-têtes), mode Démo, score = commandes réussies du 1er coup. Comptes rendus associés. Sources `.approj` fournies. |
| Honnêteté | Indique clairement que les écrans sont reconstitués (sauf TP1 partie 1 issu de GNS3). Bonne pratique à reprendre. |
| Design | Clair, éditorial, sobre, accent sarcelle. Lisible mais peu immersif. |
| Limites | Un seul mode (pratique CLI), pas de théorie structurée, pas de quiz conceptuel, pas de tableau de bord, pas de recherche/glossaire, pas de visualisation du chemin des paquets, score limité au 1er essai, pas de mode sombre. |

### 1.3 Synthèse : ce qu'on garde, ce qu'on dépasse

| Critère | Réf. 1 | Réf. 2 | **IT LAB (proposé)** |
|---|---|---|---|
| Carte/topologie interactive | ✅ (navigation) | ◐ (image cliquable) | ✅ **Topologie vivante par TP** (survol interface → IP, état, protocole) |
| Simulation CLI guidée | ? | ✅ | ✅ (ActivePresenter, reprise et enrichie) |
| Théorie structurée | ❌ | ❌ | ✅ Mode **Apprendre** |
| Démonstration commentée | ❌ | ✅ (mode Démo) | ✅ Mode **Observer** |
| Quiz conceptuels + correction | ❌ | ❌ | ✅ Modes **Évaluer** + **Corriger** |
| Visualisation des paquets/en-têtes | ❌ | ◐ (Wireshark statique) | ✅ **Packet Journey** (push/swap/pop MPLS, GRE/ESP, NAT) |
| Comparaison config correcte/incorrecte | ❌ | ❌ | ✅ **Diff pédagogique** |
| Dépannage / défi | ❌ | ❌ | ✅ **Mode Défi** |
| Progression | déclarative | score local | ✅ **Calculée** (modes complétés, scores, temps) + dashboard |
| Recherche / glossaire | ❌ | ❌ | ✅ plein texte + glossaire lié |
| Clair / sombre | sombre | clair | ✅ les deux + accessibilité AA |
| Fil narratif entre TP | ❌ | ◐ (groupes) | ✅ **Parcours « Opérateur »** |
| Transparence simulé / réel | ? | ✅ | ✅ **Badges systématiques** (voir §7.1) |

---

## 2. Inventaire des TP

Matières identifiées :
- **Atelier Technologies WAN (RSI3/RSI31)** : TP1-P1, TP1-P2, TP2 VPN MPLS, NAT/PAT/DHCP, VPN IPsec, GRE over IPsec, Frame Relay base, Frame Relay avancé.
- **Routage & Commutation (RSI3)** : Redistribution OSPF/EIGRP/RIPv2.
- **Non précisé** : Lab BGP (document Cisco Networking Academy, sans en-tête de module ; numéroté « 2 » comme la redistribution) → *classement à confirmer* (§10).

Thèmes transverses proposés pour la navigation : **Cœur MPLS · Routage inter-domaines · Adressage & services · VPN & sécurité · Accès WAN Frame Relay**.

### Vue d'ensemble

| # | TP | Matière | Outil | Équipements | Durée estimée* | Niveau* |
|---|---|---|---|---|---|---|
| 1 | Backbone MPLS – Partie I (OSPF + EIGRP) | Tech. WAN | GNS3, c7200 | SP1-3, SIEGE, AGENCE | 60 min | ●●○ |
| 2 | Backbone MPLS – Partie II (LDP) | Tech. WAN | GNS3 | idem | 45 min | ●●○ |
| 3 | VPN MPLS (VRF, MP-BGP) | Tech. WAN | GNS3 + Wireshark | idem | 90 min | ●●● |
| 4 | Configuration BGP (eBGP AS100/AS200) | à confirmer | routeurs 1841 | CR, ISP1, ISP2, PC | 45 min | ●○○ |
| 5 | Redistribution OSPF/EIGRP/RIPv2 + DA | Routage & Comm. | GNS3 | R1-R6 | 75 min | ●●● |
| 6 | NAT / PAT / DHCP | Tech. WAN | Packet Tracer (1841, 2960) | R1, R2, R3, ISP, Router4, serveurs, PC | 90 min | ●●○ |
| 7 | VPN IPsec site à site | Tech. WAN | GNS3 c7200 + Wireshark | R1, R2, R3, PC-A, PC-C | 60 min | ●●○ |
| 8 | Tunnel GRE over IPsec | Tech. WAN | GNS3 c7200 + Wireshark | RouterA, WAN, RouterB | 75 min | ●●● |
| 9 | Frame Relay – configuration de base | Tech. WAN | GNS3 + Wireshark | Siege, Agence1, Agence2, FR1 | 60 min | ●○○ |
| 10 | Frame Relay avancé (hub & spoke, sous-interfaces) | Tech. WAN | GNS3 + VPCS | SiteCentral, Agence1, Agence2, FR | 90 min | ●●● |

\* Durées et niveaux = estimations pédagogiques, à ajuster.

---

### TP1 – Backbone MPLS, Partie I

- **Objectif** : construire le cœur opérateur (OSPF zone unique) et le réseau client (EIGRP AS 100) avant MPLS.
- **Topologie** : SP1 lo 1.1.1.1/25 · SP2 lo 2.2.2.2/25 · SP3 lo 3.3.3.3/25 ; liens 192.168.12.0/24 (SIEGE s1/1–SP1 s1/1), 192.168.23.0/24 (SP1 s1/2–SP2 s1/2), 192.168.34.0/24 (SP2 s1/3–SP3 s1/3), 192.168.45.0/24 (SP3 s1/1–AGENCE s1/1) ; LAN SIEGE 10.10.10.0/24 (f0/0), LAN AGENCE 192.168.1.0/24 (f0/0). Routeurs Cisco 7200.
- **Notions** : ISP, backbone, CE (Customer Edge), loopback = router-ID OSPF, OSPF aire unique, EIGRP AS, type de réseau OSPF loopback (/32 par défaut).
- **Manipulations** : (1) adressage + loopbacks + tests point à point AGENCE-SP3 / SIEGE-SP1 ; (2) OSPF sur SP1-SP3 avec annonce des loopbacks ; `ip ospf network point-to-point` sur chaque loopback ; (3) EIGRP sur SIEGE et AGENCE.
- **Résultats attendus** : connectivité totale dans le domaine OSPF ; loopbacks annoncées en /25 (et non /32) ; **voisins EIGRP SIEGE↔AGENCE non formés** tant que MPLS n'est pas en place.
- **Captures / schémas** : topologie, `show ip route` (O, préfixes /25), `show ip ospf neighbor`.
- **Questions implicites** : pourquoi /32 pose problème en MPLS ? pourquoi l'EIGRP client ne converge pas encore ?
- **Simulable** : saisie CLI guidée, comparateur « loopback /32 vs /25 », quiz.

### TP1 – Backbone MPLS, Partie II

- **Objectif** : activer MPLS/LDP dans le backbone et lire LIB/LFIB.
- **Commandes** : `mpls ldp router-id loopback0 force` ; `mpls ip` sur les interfaces du domaine ; vérifications `show mpls ldp neighbor`, `show mpls interfaces`, `show mpls forwarding-table` (LFIB), `show mpls ldp bindings` (LIB).
- **Notions** : LDP, router-ID LDP stable, label, LIB vs LFIB, adjacences LDP (messages console).
- **Question** : labels utilisés pour 1.1.1.0/25 sur chaque routeur → **valeurs dépendantes de l'exécution réelle** : à reprendre de votre compte rendu (sinon simulation marquée « valeurs illustratives »).
- **Simulable** : CLI guidée, **table de labels interactive** (l'apprenant complète local/outgoing label par routeur), animation push/swap/pop.

### TP2 – VPN MPLS

- **Objectif** : fournir un VPN L3 MPLS au Client A (SIEGE/AGENCE).
- **Étapes et commandes** :
  1. VRF sur SP1/SP3 : `ip vrf Client_A`, `rd 100:1`, `route-target both 1:100`, `ip vrf forwarding Client_A` sur l'interface PE→CE, **ressaisie de l'IP** (effacée par la VRF) ; `ping 192.168.12.2` échoue, `ping vrf Client_A 192.168.12.2` réussit.
  2. EIGRP PE : `router eigrp 1` / `address-family ipv4 vrf Client_A` / `network …` / `no auto-summary` / `autonomous-system 100` ; `show ip route` vs `show ip route vrf Client_A`.
  3. MP-BGP entre loopbacks : `router bgp 1`, `neighbor x remote-as 1`, `update-source Loopback0`, `address-family vpnv4`, `activate`, `send-community both` ; redistribution mutuelle : `redistribute bgp 1 metric 1500 4000 200 10 1500` (EIGRP) et `redistribute eigrp 100` (BGP).
  4. Tests : capture Wireshark SP2–SP3, `ping 192.168.1.1` (SIEGE), `ping 10.10.10.1` (AGENCE), traceroutes → labels, **label stacking**.
- **Notions** : client/VRF, RD, RT import/export, PE/CE/P, MP-BGP, VPNv4, address-family, communautés étendues, redistribution IGP↔BGP, métrique composite EIGRP, pile de labels (transport + VPN).
- **Questions & réponses (dérivées de l'énoncé)** :
  - Route VPNv4 reçue avec RT 100:100 importée ? → **Non** : la VRF importe uniquement le RT 1:100.
  - Routes EIGRP (D) dans la table VRF ? → **Oui**, routes du CE local.
  - SIEGE/SP1 ont-ils des routes vers les réseaux AGENCE (avant BGP) ? → **Non** ; idem SP3/AGENCE vers SIEGE.
  - Après redistribution : routes **B** dans `show ip route vrf Client_A`.
- **Simulable** : CLI guidée (≈ le plus gros TP), Wireshark reconstitué (en-tête MPLS), **simulateur RT import/export** (logique calculée), Packet Journey avec 2 labels.

### TP4 – Configuration BGP (Cisco NetAcad)

- **Objectifs** : client relié à ISP1 par route par défaut ; eBGP ISP1 (AS 100) ↔ ISP2 (AS 200).
- **Topologie** : CR s0/0/0 10.10.10.1/24, LAN 192.168.1.0/24 (gw .1) ; ISP1 s0/0/0 10.10.10.2, s0/0/1 172.16.1.1/24, Lo0 192.168.100.1/24 ; ISP2 s0/0/0 172.16.1.2, Lo0 192.168.200.1/24.
- **Commandes** : loopbacks ; `ip route 0.0.0.0 0.0.0.0 10.10.10.2` (CR) ; `ip route 192.168.1.0 255.255.255.0 10.10.10.1` (ISP1) ; `router bgp 100 / neighbor 172.16.1.2 remote-as 200 / network 192.168.1.0 / network 192.168.100.0` ; `router bgp 200 / neighbor 172.16.1.1 remote-as 100 / network 192.168.200.0` ; `copy run start` ; `show ip route`, `show ip bgp` ; procédure effacement/rechargement ; annexe SDM.
- **Questions & réponses** :
  - CR atteint ISP2 ? hôte atteint ISP1 ? (avant routage) → **Non / Non**.
  - 192.168.1.0 dans la table d'ISP2 ? → **Oui** ; lettre → **B** = route apprise par BGP ; 192.168.100.0 présent ? → **Oui** ; annoncé par → **ISP1** (172.16.1.1).
  - Réseaux signalés par ISP2 à ISP1 → **192.168.200.0/24**.
  - Comment 192.168.1.0 est connu d'ISP1 → **route statique (S)**, puis annoncé en BGP via `network`.
  - ISP1 annonce-t-il des réseaux à CR ? / pourquoi 192.168.100.0 et 200.0 absents chez CR ? → **Non** : aucun protocole de routage entre CR et ISP1 ; CR utilise sa route par défaut.
  - Lecture `show ip bgp` : `*>` valide/meilleure, next hop 0.0.0.0 = local, weight 32768 = origine locale, AS-path « 200 i ».
- **Simulable** : CLI guidée, **lecteur interactif de table BGP** (survol de chaque colonne), quiz.

### TP5 – Redistribution OSPF / EIGRP / RIPv2 (Routage & Commutation)

- **Topologie** : R1-R6 ; IP = réseau + ID routeur (ex. R3 S0/1 10.0.34.3/24). OSPF (R1, R2, R3 ; R1 loopbacks 172.16.30-33.0/24) ; EIGRP 1 (R2, R3, R4, R5 ; R4 loopbacks 172.16.20-23.0/24) ; RIPv2 (R5, R6 ; 172.16.0.0).
- **Notions** : redistribution, métrique obligatoire vers EIGRP/RIP (sinon infinie), routes EIGRP **EX** (externes), mot-clé `subnets` (OSPF), métrique par défaut 20, `metric-type` 1 (croissante) vs 2 (fixe), **distance administrative** (OSPF 110, EIGRP externe 170), routage sous-optimal, correction `distance eigrp 90 105`.
- **Résultats** : R4 voit les routes OSPF (D EX) ; R1 voit les routes EIGRP (O E1/E2) ; R6 connaît toutes les routes ; R3 joint 172.16.10.0/24 via R1 (DA 110) au lieu de R5 (DA 170) → après `distance eigrp 90 105`, passage via EIGRP.
- ⚠️ Les commandes de redistribution exactes figurent **uniquement dans des captures d'écran** du PDF (non extractibles) → à retranscrire depuis votre compte rendu.
- **Simulable** : **comparateur de distance administrative** (choix de route recalculé en direct), carte des 3 domaines colorés, CLI guidée.

### TP6 – NAT / PAT / DHCP (Packet Tracer)

- **Topologie** : intranet ABC (zone privée jaune) R1 (LAN 192.168.10.0/24, 192.168.11.0/24), R3 (192.168.30.0/24), R2 (10.10.10.0/30 vers R1, 10.10.9.0/30 vers R3, zone publique 192.168.20.0/29 : ServeurWeb local 192.168.20.2 / global 77.77.77.77) ; ISP (209.165.200.224/30 vers R2, 209.165.200.228/30 vers Router4) ; zone d'hébergement ISP (192.168.10.0/24 : Server DNS 192.168.10.3 → 88.88.88.88, Server FTP public 192.168.10.2 → 66.66.66.66) ; Router4 + Internaute (192.168.1.0/24, PAT).
- **Tâches** : 1 routes statiques/défaut (R1, R2, R3) ; 2 serveur DHCP sur R2 (exclusions 192.168.10.1/.10, 192.168.11.1/.10, pools R1Fa0/0, R1Fa0/1, R3F0/0, default-router, dns-server 88.88.88.88, `ip helper-address` sur R1 f0/0, f0/1 → 10.10.10.2 et R3 f0/0 → 10.10.9.2, `show ip dhcp binding`) ; NAT statique (192.168.20.2 → 77.77.77.77, inside/outside) ; NAT statique des serveurs chez l'ISP ; routage statique ISP (77.77.77.77/32) ; vérification ; NAT dynamique (pool MY-NAT-POOL 209.165.200.241-246 /29, ACL étendue NAT, `ip nat inside source list NAT pool MY-NAT-POOL`, route ISP 209.165.200.240/28) ; surcharge NAT (suppression pool, `clear ip nat translation *`, `… interface S0/1/0 overload`) ; Tâche 9 : PAT sur Router4.
- **Question** : plus d'hôtes que les 6 adresses du pool ? → les traductions supplémentaires échouent (pool épuisé) jusqu'à expiration d'une entrée → motivation de la surcharge (PAT).
- **Notion remarquable** : la zone ISP réutilise 192.168.10.0/24 (même plage que le LAN ABC) — sans conflit grâce au NAT : excellent point pédagogique.
- **Simulable** : **simulateur NAT calculé** (table de traductions inside local/global, statique/dynamique/PAT avec ports), animation DORA DHCP + relais helper-address, CLI guidée.

### TP7 – VPN IPsec site à site

- **Topologie** : PC-A (192.168.1.0/24) – R1 – R2 – R3 – PC-C (192.168.3.0/24), liens série 10.1.1.0/30 et 10.2.2.0/30.
- **Paramètres** : Phase 1 – ISAKMP, AES, SHA-1 (défaut), pre-share « cisco », DH groupe 2, durée 86400 s. Phase 2 – transform-set VPN-SET `esp-3des esp-sha-hmac`, crypto map VPN-MAP `ipsec-isakmp`, ACL 110 (trafic 192.168.1.0 ↔ 192.168.3.0), application sur l'interface de sortie.
- **Vérifications** : `show crypto ipsec sa` avant/après trafic (compteurs encaps/encrypt/decaps/decrypt à 0 puis > 0), Wireshark : en-têtes de la couche réseau (ISAKMP puis ESP).
- **Simulable** : **assistant de correspondance Phase 1/Phase 2** (paramètres R1 vs R3 : détecte une incohérence), compteurs SA animés, Wireshark reconstitué, CLI guidée.

### TP8 – Tunnel GRE over IPsec

- **Topologie** : RouterA (fa0/0 10.0.10.1/24, s0/0 201.20.20.1/30) – WAN (201.20.20.2 / 204.20.20.1) – RouterB (s0/0 204.20.20.2/30, fa0/0 10.0.20.1/24) ; Tunnel0 172.16.1.1/24 ↔ 172.16.1.2/24.
- **Partie I GRE** : NAT overload avec ACL 100 (deny trafic inter-sites, permit le reste), route par défaut, `interface Tunnel0` (`ip mtu 1400`, `tunnel source`, `tunnel destination`) ; ping 172.16.1.2 OK ; ping 10.0.20.1 **échoue** (pas de route vers le LAN distant) → routes statiques via le tunnel → OK ; capture : IP externe 201.20.20.1→204.20.20.2 / GRE / IP interne.
- **Partie II IPsec** : pourquoi GRE + IPsec (IPsec ne transporte pas le multicast → GRE permet le routage dynamique) ; `crypto isakmp enable`, policy 1 pre-share, clé, lifetime 4096 s, transform-set `strong esp-3des esp-md5-hmac`, ACL 101 `permit gre host 201.20.20.1 host 204.20.20.2`, crypto map S2SVPN, application sur S0/0, `show crypto ?`.
- **Notions** : tunnel, encapsulation, MTU/fragmentation, NAT exclusion, transform-set, crypto map.
- **Simulable** : **Packet Journey à 3 états** (IP seul → IP/GRE/IP → IP/ESP/[GRE/IP] chiffré), CLI guidée, Wireshark reconstitué.

### TP9 – Frame Relay de base

- **Étapes** : topologie GNS3 (Siege, Agence 1, Agence 2, commutateur FR1) ; `encapsulation frame-relay` + `no shutdown` ; interprétation `show frame-relay pvc`, `show interface serial1/0` ; Wireshark DTE↔DCE (LMI) ; IP 192.168.2.0/29 ; `show frame-relay map` ; Wireshark Inverse ARP (requête sur DLCI 16, réponse 192.168.2.2) ; ping ; LAN + routes statiques ; mappage statique (désactivation Inverse ARP, effacement du mappage dynamique, `frame-relay map ip … broadcast`, vérification).
- **Questions & réponses** :
  - À quoi sert de mapper une IP avec un DLCI ? → Résolution L3→L2 : savoir sur quel PVC (DLCI local) envoyer un paquet destiné à une IP voisine.
  - DLCI mappé avec l'IP locale ou distante ? → **IP de l'extrémité distante**, DLCI **local**.
  - Rôle de `broadcast` : répliquer le trafic broadcast/multicast (protocoles de routage) sur le PVC.
- **Simulable** : **animation Inverse ARP**, constructeur de table de mappage, Wireshark reconstitué (LMI, InARP).

### TP10 – Frame Relay avancé (hub & spoke)

- **Partie 1** : commutateur FR (PVC DLCI 16 port1↔port2/DLCI 16 ; DLCI 17 port1↔port3/DLCI 16) ; PPP sur le WAN de secours 172.16.1.0/24, LMI ANSI ; routes statiques **flottantes** (DA 50 sur le lien PPP) ; hôtes VPCS C1 192.168.2.10 (gw .254), C2 192.168.1.10, C3 192.168.3.10 ; panne : `shutdown` de s0/1 sur Agence1.
  - Réponses : Agence1 bascule sur la route PPP ; **SiteCentral garde s0/1 up** (l'autre PVC reste actif) et continue d'envoyer via FR → **ping C2→C1 échoue** (trou noir).
- **Partie 2** : sous-interfaces point-à-point s0/1.16 (192.168.0.1/30, DLCI 16) et s0/1.17 (192.168.100.1/30, DLCI 17), Agence2 s0/0.16, Agence1 s0/1.16 ; Inverse ARP inactif en point-à-point → DLCI obligatoire ; suppression des statiques → RIPv2 ; même panne → **s0/1.16 passe down**, s0/1 reste up, RIP converge via PPP → ping C2→C1 réussit, `trace` VPCS.
- **Simulable** : **animation de panne avant/après** (le cas d'école du comparateur « correcte vs incorrecte »), CLI guidée.

---

## 3. Anomalies et points à valider dans les documents

Pour ne pas « inventer » de contenu, ces points seront **affichés tels quels** ou **corrigés seulement après votre accord** :

| TP | Point | Proposition |
|---|---|---|
| Tous | Seuls les **énoncés** sont joints, pas les **comptes rendus** (sorties réelles, labels, captures Wireshark, réponses rédigées). | Me fournir les CR ; à défaut, chaque sortie sera badgée « résultat attendu reconstitué ». |
| TP2 | `CLIENT_A` (titre) vs `Client_A` (commandes) — les noms de VRF sont sensibles à la casse. | Uniformiser sur `Client_A`. |
| TP1-P2 | Valeurs de labels non fournies. | Reprendre du CR ou marquer « illustratif ». |
| TP2 | Capture entre SP2 et SP3 : avec le PHP (Penultimate Hop Popping), le sens SP2→SP3 ne porte souvent que le label VPN, le sens SP3→SP2 en porte deux. | À confirmer sur votre capture avant d'en faire une question. |
| TP5 | Commandes de redistribution uniquement en images. | Retranscrire depuis le CR. |
| TP7 | Table d'adressage illisible dans le PDF ; les peers configurés (10.2.2.2 sur R1, 10.1.1.2 sur R3) semblent correspondre aux interfaces de **R2** dans le schéma standard de ce lab. | Vérifier l'adressage réel ; risque d'échec de la négociation IKE. |
| TP8 | `int s0/0 255.255.255.252` puis `ip address 201.20.20.1` (masque mal placé). | Corriger en `ip address 201.20.20.1 255.255.255.252`. |
| TP8 | Explication de `crypto isakmp key 6` (« 6 indique que la clé doit être chiffrée ») : sur IOS, 0/6 indique le **type de la clé saisie** (0 = en clair, 6 = déjà chiffrée). | Proposer une note de correction, à valider. |
| TP6 | Deux « Tâche 6 », tâches 3–4 absentes, typos (`ipdhcp`, `DEFault-router`, `ipnat`). | Renuméroter et normaliser. |
| TP10 | Tableau d'adressage VPCS désaligné dans le PDF. | Reconstitué ci-dessus, à confirmer. |
| TP4 | « ISP1 se connecte via SP2 » (coquille pour ISP2). | Corriger. |

---

## 4. Architecture technique

### 4.1 Contraintes déduites
- Contenu **majoritairement statique** (TP, théorie, quiz) + **exports HTML5 ActivePresenter** volumineux.
- Hébergement gratuit et simple (GitHub Pages comme les références), démonstration **hors ligne** possible devant le jury.
- Interactivité riche mais localisée (terminal, topologie, quiz, simulateurs calculés).
- Pas de besoin réel de serveur pour la v1 (pas d'authentification multi-utilisateurs exigée).

### 4.2 Stack recommandée

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | **Astro 5 + TypeScript** | Site statique ultra-rapide, contenu en Markdown/MDX, « îlots » interactifs seulement où il faut. |
| Composants interactifs | **React 18** (îlots) | Terminal, quiz, topologie, simulateurs. |
| Styles | **Tailwind CSS** + design tokens CSS (clair/sombre) | Cohérence, thème, responsive. |
| Animations | **Motion** (ex-Framer Motion) + SVG | Animations de paquets, transitions de modes ; respect de `prefers-reduced-motion`. |
| Contenu | **Content Collections** Astro (MDX + YAML validés par schéma Zod) | Chaque TP = un dossier de données ; erreurs de contenu détectées à la compilation. |
| Recherche | **Pagefind** | Index plein texte généré au build, fonctionne hors ligne, sans serveur. |
| Progression | `localStorage` versionné (+ export/import JSON) | Aucun compte nécessaire ; option v2 : Supabase si suivi enseignant souhaité. |
| Simulations AP | Exports **HTML5 ActivePresenter** dans `public/sims/<tp>/`, chargés en `<iframe>` même origine | Isolation, chargement différé, plein écran. |
| Certificat | `pdf-lib` côté client | Attestation PDF générée localement. |
| Tests | **Vitest** (logique : NAT, RT, DA, scoring) + **Playwright** (parcours, accessibilité via axe-core) | |
| Qualité | ESLint, Prettier, Lighthouse CI | |
| Déploiement | **GitHub Actions → GitHub Pages** ; build aussi servable en local (`npm run preview`) pour le jury | |

### 4.3 Structure du projet

```
it-lab/
├─ astro.config.mjs · tailwind.config.ts · tsconfig.json · package.json
├─ src/
│  ├─ content/
│  │  ├─ config.ts                 # schémas Zod (tp, quiz, glossary)
│  │  ├─ tps/
│  │  │  ├─ mpls-backbone-p1/
│  │  │  │  ├─ index.yaml          # métadonnées, topologie, objectifs
│  │  │  │  ├─ learn.mdx           # Mode Apprendre
│  │  │  │  ├─ steps.yaml          # manipulations, commandes, sorties attendues
│  │  │  │  ├─ quiz.yaml           # Évaluer / Corriger
│  │  │  │  └─ compare.yaml        # configs correcte vs incorrecte
│  │  │  └─ … (10 dossiers)
│  │  ├─ glossary/*.yaml
│  │  └─ paths/operateur.yaml      # parcours narratif
│  ├─ components/
│  │  ├─ ui/                       # Button, Card, Badge, Tabs, Dialog…
│  │  ├─ topology/TopologyView.tsx # SVG piloté par index.yaml
│  │  ├─ cli/TerminalPractice.tsx  # terminal guidé natif (complément AP)
│  │  ├─ quiz/QuizEngine.tsx
│  │  ├─ sims/                     # simulateurs calculés
│  │  │  ├─ PacketJourney.tsx  NatTable.tsx  RouteTargetLab.tsx
│  │  │  ├─ AdminDistance.tsx  FrFailover.tsx  InverseArp.tsx
│  │  ├─ ap/APPlayer.tsx           # iframe ActivePresenter + pont de score
│  │  ├─ assistant/StepCoach.tsx   # assistant pédagogique (règles)
│  │  └─ dashboard/…
│  ├─ lib/ progress.ts · scoring.ts · ap-bridge.ts · search.ts
│  ├─ layouts/ BaseLayout.astro · TpLayout.astro
│  └─ pages/
│     ├─ index.astro  dashboard.astro  modules/[module].astro
│     ├─ tps/index.astro  tps/[slug]/[mode].astro
│     ├─ simulations.astro  ressources.astro  glossaire.astro  a-propos.astro
├─ public/
│  ├─ sims/<tp-slug>/index.html …  # exports ActivePresenter
│  ├─ docs/                        # PDF des énoncés & CR
│  └─ labs/                        # fichiers .gns3project / .pkt (optionnel)
├─ activepresenter/                # sources .approj + gabarit commun
├─ tests/ unit/ e2e/
└─ docs/ ARCHITECTURE.md · CONTENU.md · AP-INTEGRATION.md · DEPLOIEMENT.md
```

### 4.4 Modèle de données d'un TP (extrait)

```yaml
# src/content/tps/vpn-mpls/index.yaml
slug: vpn-mpls
title: Configuration d'un VPN MPLS
subject: tech-wan            # matière
theme: coeur-mpls
order: 3
level: 3
duration: 90
tools: [GNS3, Wireshark]
prerequisites: [mpls-backbone-p1, mpls-backbone-p2]
objectives:
  - Créer une VRF par client sur les PE
  - Échanger les routes VPNv4 avec MP-BGP
sources:
  - { label: Énoncé, file: /docs/tp2-mpls.pdf }
fidelity: reconstitue        # reel | reconstitue | illustratif
topology:
  nodes: [{ id: SP1, role: PE, x: 220, y: 120, loopback: 1.1.1.1/25 }, …]
  links: [{ a: SP1:s1/1, b: SIEGE:s1/1, net: 192.168.12.0/24 }, …]
ap_simulations:
  - { id: practice, file: /sims/vpn-mpls/index.html, kind: guided-cli }
```

```yaml
# steps.yaml (extrait)
- id: vrf-create
  device: SP1
  title: Créer la VRF du client
  expect: ["ip vrf Client_A"]
  accept: ['^ip vrf Client_A$']   # regex de validation (terminal natif)
  hint: "Mode de configuration globale, mot-clé vrf."
  explain: "Une VRF isole la table de routage d'un client sur le PE."
  output_fidelity: attendu
```

### 4.5 Intégration ActivePresenter
1. Chaque projet AP est exporté en **HTML5** (option *Responsive*) dans `public/sims/<slug>/`.
2. `APPlayer` charge l'export en `<iframe loading="lazy">` avec plein écran, écran de chargement et message d'erreur si le fichier est absent (`fetch HEAD` préalable).
3. **Pont de score** : sur la diapositive finale, une action AP « Exécuter JavaScript » appelle `parent.postMessage({source:'itlab-ap', tp, mode, score, max}, '*')` ; `ap-bridge.ts` vérifie l'origine et enregistre le résultat dans la progression. *(Fonctionnalité à confirmer selon votre édition/version d'ActivePresenter ; alternative : export SCORM/xAPI ou saisie automatique « terminé » à l'ouverture de la dernière diapo.)*
4. Fallback : si l'export ne communique pas, la plateforme propose « Marquer comme terminé ».

### 4.6 Gestion des erreurs
- Validation Zod du contenu au build (TP incomplet = build en échec, message clair).
- Iframe AP introuvable/bloquée → carte d'erreur + lien direct + lien vers le mode Observer natif.
- `localStorage` indisponible (navigation privée) → progression en mémoire + bandeau d'information.
- Données de progression versionnées (migration si le schéma évolue).
- Page 404 personnalisée, `ErrorBoundary` React autour de chaque îlot.

---

## 5. Maquette

### 5.1 Identité visuelle
- **Concept** : « laboratoire de signal » – le paquet comme fil conducteur graphique (point lumineux circulant sur les liens de la topologie).
- **Typographie** : *IBM Plex Sans* (interface), *IBM Plex Mono* (CLI, adresses, sorties) – identité ingénieur, excellente lisibilité.
- **Palette (tokens)** :

| Token | Clair | Sombre | Usage |
|---|---|---|---|
| `--bg` | #F6F7FB | #0B1020 | fond |
| `--surface` | #FFFFFF | #121A2E | cartes |
| `--text` | #0F172A | #E6EAF2 | texte |
| `--primary` | #2F54EB | #6E8BFF | actions |
| `--signal` | #F59E0B | #FBBF24 | paquets, focus pédagogique |
| `--ok` / `--err` | #15803D / #B91C1C | #4ADE80 / #F87171 | feedback |

- **Couleurs par thème** : Cœur MPLS = violet, Routage inter-domaines = bleu, Adressage & services = ambre, VPN & sécurité = rose, Frame Relay = sarcelle.
- **Badges de fidélité** : `RÉEL GNS3` · `RECONSTITUÉ` · `ILLUSTRATIF` · `CALCULÉ` (voir §7.1).
- Accessibilité : contraste AA, navigation clavier complète, focus visible, `aria-live` pour le feedback, sous-titres/transcription des démos, `prefers-reduced-motion`.

### 5.2 Wireframes

**Accueil**
```
┌──────────────────────────────────────────────────────────────────────┐
│ ◉ IT LAB   Modules  Bibliothèque  Simulations  Ressources  ⌕  ◐  ☰   │
├──────────────────────────────────────────────────────────────────────┤
│  Le réseau d'un opérateur,              ┌──────────────────────────┐ │
│  TP par TP.                             │  CARTE « OPÉRATEUR »      │ │
│  10 TP · 5 modes · simulations           │  CE ── PE ══ P ══ PE ── CE│ │
│  ActivePresenter                         │   ·paquet animé·          │ │
│  [Reprendre : VPN MPLS ▸] [Parcours]     │  clic = zone → TP         │ │
│                                          └──────────────────────────┘ │
│  ┌ Cœur MPLS ┐┌ Routage ┐┌ Adressage ┐┌ VPN ┐┌ Frame Relay ┐           │
│  │ 3 TP  ▓▓░ ││ 2 TP ▓░ ││ 1 TP  ░░  ││2 TP ││ 2 TP        │           │
│  Comment ça marche : Apprendre → Observer → Pratiquer → Évaluer → …  │
└──────────────────────────────────────────────────────────────────────┘
```

**Détail d'un TP (mode Pratiquer)**
```
┌──────────────────────────────────────────────────────────────────────┐
│ ← Bibliothèque / Cœur MPLS / VPN MPLS          ⏱ 90 min ●●● RECONSTITUÉ│
│ [Apprendre][Observer][■Pratiquer][Évaluer][Corriger]   Progression 40%│
├───────────────┬──────────────────────────────────┬───────────────────┤
│ CHRONOLOGIE   │  TOPOLOGIE (SVG vivante)          │ ASSISTANT         │
│ ✓ 1 VRF       │   SIEGE─SP1═SP2═SP3─AGENCE        │ 💡 Étape 3        │
│ ✓ 2 RD/RT     │   (SP1 en surbrillance)           │ « La VRF a effacé │
│ ▸ 3 Interface │──────────────────────────────────│ l'adresse IP… »   │
│ ○ 4 EIGRP     │  TERMINAL SP1                     │ [Indice] [Pourquoi│
│ ○ 5 MP-BGP    │  SP1(config-if)# ip vrf forw█     │  ?] [Glossaire]   │
│ ○ 6 Tests     │  ✓ commande acceptée              │ Score : 12/14     │
├───────────────┴──────────────────────────────────┴───────────────────┤
│ [◀ Retour]  [⟲ Recommencer]   [Simulation ActivePresenter ⛶]  [Suivant ▶]│
└──────────────────────────────────────────────────────────────────────┘
```

**Dashboard**
```
┌──────────────────────────────────────────────────────────────────────┐
│ Progression globale ◔ 46%   Temps 5h40   Quiz moyen 78%   Défis 4/10 │
│ ┌ Carte de maîtrise par thème (radar) ┐ ┌ Activité (14 jours) ┐       │
│ ┌ Points faibles détectés ────────────────────────────────────┐      │
│ │ • Route Target import/export (2 erreurs) → [Réviser]        │      │
│ │ • Distance administrative (1 erreur)     → [Défi ciblé]     │      │
│ └──────────────────────────────────────────────────────────────┘      │
│ [Exporter ma progression] [Attestation (disponible à 100 %)]          │
└──────────────────────────────────────────────────────────────────────┘
```

Pages complémentaires : **Modules** (cartes par matière → thèmes), **Bibliothèque** (grille filtrable : matière, thème, niveau, outil, statut ; recherche), **Simulations** (catalogue des exports AP, badges de type), **Ressources** (PDF énoncés/CR, schémas SVG, fichiers GNS3/PT, glossaire), **À propos** (projet, méthode, transparence simulé/réel, crédits).

> Une maquette haute fidélité cliquable (HTML) peut être produite après validation de cette direction.

---

## 6. Fonctionnalités innovantes (priorisées)

| Priorité | Fonctionnalité | Justification par les documents | Effort |
|---|---|---|---|
| **MVP** | **5 modes par TP** | Demande explicite | Élevé |
| **MVP** | **Topologie vivante** (survol → interface, IP, protocole ; nœud actif selon l'étape) | Tous les TP reposent sur un schéma | Moyen |
| **MVP** | **Chronologie des manipulations** + reprise | Étapes numérotées dans chaque énoncé | Faible |
| **MVP** | **Quiz avec correction instantanée** (QCM, valeur, ordre de commandes, lecture de sortie, zone cliquable sur topologie) | Questions présentes dans les énoncés | Moyen |
| **MVP** | **Badges de fidélité** simulé/réel | Exigence d'honnêteté | Faible |
| **MVP** | Recherche plein texte + **glossaire lié** (LDP, LIB, LFIB, VRF, RD, RT, VPNv4, DA, DLCI, LMI, InARP, ISAKMP, SA, PAT…) | Notions extraites | Faible |
| **MVP** | Progression calculée + Dashboard | Demande explicite | Moyen |
| **V1** | **Packet Journey** : animation des en-têtes (MPLS push/swap/pop, GRE, ESP, NAT) | Questions Wireshark TP2, TP7, TP8, TP9 | Moyen |
| **V1** | **Comparateur correcte / incorrecte** (diff + conséquence) – 10 cas ci-dessous | Erreurs décrites dans les énoncés | Moyen |
| **V1** | **Simulateurs calculés** : NAT/PAT, RT import, DA, Inverse ARP, bascule FR | Logique déterministe documentée | Moyen |
| **V1** | **Assistant pédagogique** à règles (indice progressif → explication → solution) | Explications des énoncés | Moyen |
| **V1** | **Mode Défi** : dépannage chronométré à partir des erreurs typiques | Cas de panne des TP | Moyen |
| **V2** | **Parcours « Opérateur »** : fil narratif reliant les TP (on construit le backbone, on vend un VPN, on connecte à Internet, on sécurise, on gère l'accès WAN) | Le scénario ISP du TP1 | Faible |
| **V2** | **Attestation de parcours** PDF (mention « non officielle ») | Si pertinent | Faible |
| **V2** | Mode révision espacée (questions ratées reproposées) | – | Faible |

**Cas du comparateur (tous issus des TP)** : loopback OSPF /32 vs point-to-point (TP1) · `ping` sans/avec `vrf` (TP2) · RT 100:100 vs 1:100 (TP2) · redistribution EIGRP sans métrique → infinie (TP5) · OSPF sans `subnets` (TP5) · DA 110 vs 105 (TP5) · route statique sans/avec DA 50 (TP10) · interface physique vs sous-interfaces (TP10) · `frame-relay map` sans/avec `broadcast` (TP9) · NAT sans exclusion ACL du trafic inter-sites (TP8) · pool NAT de 6 adresses vs overload (TP6).

> Assistant « IA » : la v1 est **à règles** (fiable, hors ligne, sans coût). Un assistant conversationnel basé sur un LLM peut être une option v2, à condition de le cadrer sur le contenu des TP.

---

## 7. Plan de réalisation des simulations ActivePresenter

### 7.1 Typologie (transparence)

| Badge | Type | Ce que c'est réellement |
|---|---|---|
| `GUIDÉ` | Simulation guidée AP | L'apprenant tape une commande ; AP **compare le texte** à des réponses acceptées et affiche une **sortie préenregistrée**. Aucun routeur n'est exécuté. |
| `DÉMO` | Démonstration AP | Vidéo/animation commentée, saisie automatique. |
| `CALCULÉ` | Simulateur natif plateforme | Un modèle JavaScript **calcule** un résultat (table NAT, choix de route par DA, import RT). Fidèle à la règle enseignée, mais ce n'est pas IOS. |
| `RÉEL` | Labo réel | Fichiers GNS3/Packet Tracer téléchargeables à exécuter sur votre poste. Seul ce mode exécute de vraies commandes. |

Chaque sortie affichée porte aussi : `capture réelle` (issue de votre CR) ou `résultat attendu reconstitué`.

### 7.2 Gabarit commun (projet maître `.approj`)
- Résolution 1280×720, responsive, thème aux couleurs IT LAB, polices Plex.
- Diapos maîtres : *Titre*, *Objectifs*, *Topologie*, *Console*, *Wireshark*, *Question*, *Feedback*, *Résultat*.
- Variables : `score`, `essais`, `etape` ; boutons **Suivant / Retour / Recommencer / Indice** sur chaque diapo.
- Console : zone de saisie texte, réponses acceptées multiples (abréviations : `conf t`, `sh ip ro`…), 3 essais → indice → solution affichée (score 1 / 0,5 / 0).
- Diapo finale : score, temps, pont `postMessage` vers la plateforme.

### 7.3 Storyboard standard (13 scènes)
| # | Scène | Contenu | Interaction |
|---|---|---|---|
| S0 | Introduction | Titre, matière, durée, badge fidélité | Commencer |
| S1 | Objectifs | 3–5 objectifs | Suivant |
| S2 | Environnement | Outil (GNS3/PT), modèle de routeur, topologie annotée | Survol des équipements |
| S3 | Rappel théorique | 1 schéma clé | Clic pour révéler |
| S4…Sn | Étapes de manipulation | Console + topologie, équipement actif surligné | Saisie / clic sur zone |
| Sv | Vérification | Sortie `show …` annotée (callouts) | Clic sur la ligne pertinente |
| Sw | Wireshark (si TP concerné) | Trame reconstituée | Filtre + dépliage d'en-tête |
| Sq | Questions | QCM / valeur / ordre | Feedback immédiat |
| Sf | Bilan | Score, erreurs, liens de révision | Recommencer / Retour plateforme |

### 7.4 Storyboards par TP (scènes spécifiques S4…Sq)

**TP1 – Backbone MPLS P1** · `GUIDÉ` + sorties `RÉEL GNS3` si captures du CR
1. Adressage SP1 (s1/1, s1/2, Loopback0 1.1.1.1/25) – console.
2. Ping point à point SIEGE→SP1 – sortie annotée.
3. `router ospf` + `network` sur SP1, SP2, SP3 – saisie.
4. `ip ospf network point-to-point` sur loopback – **avant/après** `show ip route` (/32 → /25), zones annotées.
5. EIGRP 100 sur SIEGE/AGENCE – saisie.
6. Question : « Pourquoi aucun voisin EIGRP ? » (QCM) → feedback.

**TP1 – P2 LDP** · `GUIDÉ`
1. `mpls ldp router-id loopback0 force` (3 routeurs).
2. `mpls ip` par interface – message console d'adjacence LDP animé.
3. `show mpls ldp neighbor` – clic sur l'ID du voisin.
4. `show mpls interfaces` / `forwarding-table` / `ldp bindings` sur SP3 – zones « LIB » vs « LFIB ».
5. Exercice : compléter les labels de 1.1.1.0/25 par routeur (valeurs du CR).
6. Quiz LIB/LFIB/router-ID.

**TP2 – VPN MPLS** · `GUIDÉ` + Wireshark reconstitué (le plus long : prévoir 3 chapitres)
1. Ch.1 VRF : `ip vrf Client_A`, `rd 100:1`, `route-target both 1:100` ; question RT 100:100.
2. `ip vrf forwarding` → animation « l'IP disparaît » → ressaisie.
3. `ping 192.168.12.2` ✗ puis `ping vrf Client_A …` ✓ (comparaison côte à côte).
4. Ch.2 EIGRP en address-family ; `show ip route` vs `show ip route vrf` ; 3 questions de l'énoncé.
5. Ch.3 MP-BGP SP1/SP3 ; redistribution ; routes B.
6. Ping SIEGE→192.168.1.1 ; Wireshark : dépliage de l'en-tête MPLS ; traceroute : pile de labels.
7. Quiz final (rôles PE/P/CE, RD vs RT, VPNv4).

**TP4 – BGP** · `GUIDÉ`
1. Loopbacks ISP1/ISP2. 2. Route par défaut CR + statique ISP1 ; ping hôte→10.10.10.2. 3. `router bgp 100/200`, neighbors, `network`. 4. `show ip route` ISP2 → 5 questions (zones cliquables sur la ligne B). 5. `show ip route` ISP1/CR → questions. 6. `show ip bgp` : survol des colonnes (Next Hop, Weight, Path). 7. Question finale « Pourquoi ISP1 n'annonce rien à CR ? ».

**TP5 – Redistribution** · `GUIDÉ` + `CALCULÉ` (comparateur DA côté plateforme)
1. Carte des 3 domaines colorés. 2. Configuration OSPF/EIGRP/RIP (accéléré). 3. Redistribution OSPF→EIGRP avec métrique ; `show ip route` R4 (lignes D EX). 4. EIGRP→OSPF `subnets`, `metric-type` (animation type 1 vs 2). 5. RIP↔EIGRP ; R6 complet. 6. Problème : table de R3 vers 172.16.10.0 → question « pourquoi R1 ? ». 7. `distance eigrp 90 105` → nouvelle table.

**TP6 – NAT/PAT/DHCP** · `GUIDÉ` (Packet Tracer) + `CALCULÉ` (table NAT)
1. Topologie par zones (privée/publique/ISP). 2. Routes statiques R1/R2/R3. 3. DHCP : exclusions, pools, helper-address – animation DORA relayée. 4. `show ip dhcp binding`. 5. NAT statique serveur web 77.77.77.77 + inside/outside. 6. NAT statique serveurs ISP + route 77.77.77.77/32. 7. NAT dynamique (pool, ACL, association) ; question « plus de 6 hôtes ? ». 8. Overload ; `show ip nat translations` (ports). 9. PAT Router4.

**TP7 – VPN IPsec** · `GUIDÉ` + Wireshark reconstitué
1. Adressage + routage statique, ping PC-A→PC-C. 2. Tableau Phase 1 à compléter (glisser-déposer R1/R3). 3. Saisie Phase 1 R1. 4. Tableau Phase 2. 5. Transform-set, crypto map, ACL 110, application S0/0/0. 6. Idem R3 (mode accéléré). 7. `show crypto ipsec sa` avant (compteurs à 0). 8. Ping + Wireshark (ISAKMP puis ESP). 9. `show crypto ipsec sa` après ; question sur les compteurs.

**TP8 – GRE over IPsec** · `GUIDÉ` + Wireshark reconstitué
1. Adressage + NAT overload + ACL 100 (pourquoi le deny ?). 2. Interface Tunnel0, MTU 1400 (explication animée de l'en-tête ajouté). 3. Ping 172.16.1.2 ✓ / 10.0.20.1 ✗ → question. 4. Routes via tunnel → ✓. 5. Wireshark : IP/GRE/IP – exercice « reconstituer l'encapsulation » (glisser les en-têtes). 6. Pourquoi GRE + IPsec (multicast). 7. ISAKMP, policy, clé, transform-set, ACL 101 GRE, crypto map. 8. Wireshark : ESP seul visible. 9. `show crypto ?` exploration.

**TP9 – Frame Relay base** · `GUIDÉ` + Wireshark reconstitué
1. Encapsulation + no shut. 2. `show frame-relay pvc` / `show interface s1/0` annotés (statut PVC, LMI). 3. Wireshark LMI DTE↔DCE. 4. Adressage 192.168.2.0/29 ; `show frame-relay map` (dynamic). 5. Wireshark InARP requête/réponse DLCI 16 ↔ 192.168.2.2. 6. Ping ; question « à quoi sert le mappage ? ». 7. LAN + statiques. 8. Mappage statique : `no frame-relay inverse-arp`, `clear frame-relay inarp`, `frame-relay map … broadcast` ; question local/distant.

**TP10 – Frame Relay avancé** · `GUIDÉ` + `DÉMO` de panne
1. Commutateur FR : construire la table de commutation (ports/DLCI) par glisser-déposer. 2. Encapsulations PPP / FR ANSI. 3. Routes flottantes DA 50. 4. VPCS + pings. 5. **Démo panne** Agence1 s0/1 down → animation du trou noir. 6. Questions 6–7. 7. Sous-interfaces point-to-point (SiteCentral, Agence1, Agence2). 8. RIPv2. 9. **Même panne** → s0/1.16 down, convergence → ping ✓, `trace`. 10. Comparatif final avant/après.

### 7.5 Processus de production (par TP)
1. Extraction contenu → `steps.yaml` (source unique de vérité).
2. Captures : réelles (GNS3/PT, à refaire si besoin) ou reconstituées depuis le CR.
3. Montage AP depuis le gabarit maître → tests internes (toutes les branches : juste / faux / indice).
4. Export HTML5 → `public/sims/<slug>/` → test d'intégration (score remonté) → validation.

---

## 8. Scénario de démonstration devant le jury (≈ 10 min)

| Min | Action | Message clé |
|---|---|---|
| 0:00 | Accueil, carte « Opérateur » animée, bascule clair/sombre | Identité, professionnalisme |
| 1:00 | Bibliothèque : recherche « VRF », filtres | Accès rapide à 10 TP |
| 2:00 | TP VPN MPLS – **Apprendre** : schéma PE/P/CE, glossaire au survol | Théorie intégrée |
| 3:00 | **Observer** : démo commentée de la création de VRF | Démonstration guidée |
| 4:00 | **Pratiquer** : saisie volontairement fausse → assistant (indice → explication) | Feedback pédagogique |
| 5:30 | Simulation **ActivePresenter** plein écran : Wireshark, en-tête MPLS ; score remonté | Intégration AP |
| 6:30 | **Packet Journey** GRE over IPsec : IP → GRE → ESP | Visualiser l'invisible |
| 7:30 | **Comparateur** Frame Relay physique vs sous-interfaces (panne) | Comprendre l'erreur |
| 8:30 | **Évaluer → Corriger** : quiz, bilan, points faibles | Évaluation |
| 9:15 | **Dashboard** + attestation | Suivi de progression |
| 9:45 | Page À propos : transparence simulé/réel, architecture | Rigueur, honnêteté |

Plan B : build local (`npm run preview`) hors ligne + captures vidéo de secours.

---

## 9. Feuille de route

| Phase | Contenu | Livrables | Durée indicative |
|---|---|---|---|
| P0 | Validation de ce dossier, réception des CR | Dossier validé | – |
| P1 | Socle : design system, layouts, pages, schémas de contenu, progression, recherche | Plateforme navigable | 1–1,5 sem. |
| P2 | **2 TP pilotes complets** (VPN MPLS + NAT/PAT/DHCP) : 5 modes, quiz, 1 simulateur calculé, 1 export AP | Démo verticale | 1,5 sem. |
| P3 | 8 TP restants (contenu + quiz + comparateurs) | 10 TP | 2 sem. |
| P4 | Simulations AP (gabarit + 10 projets) | Exports HTML5 intégrés | 3–4 sem.* |
| P5 | Défi, Packet Journey, assistant, dashboard avancé, attestation | Fonctions différenciantes | 1,5 sem. |
| P6 | Tests (unitaires, e2e, accessibilité, mobile), documentation, répétition jury | Version finale | 1 sem. |

\* La production AP se fait dans le logiciel ActivePresenter (sur votre poste). Je fournis storyboards détaillés, textes, réponses acceptées, callouts et le code d'intégration ; le montage AP lui-même ne peut pas être généré automatiquement.

---

## 10. Questions à valider

1. **Comptes rendus** : pouvez-vous fournir vos CR (sorties réelles, captures Wireshark, réponses) ? Sinon toutes les sorties seront badgées « reconstitué ».
2. **Stack** : Astro + React + Tailwind, hébergement GitHub Pages, progression locale sans compte : OK ?
3. **ActivePresenter** : quelle version/édition (gratuite, Standard, Pro) ? Cela détermine l'action « Exécuter JavaScript » et l'export SCORM/xAPI.
4. **Classement du TP BGP** : Technologies WAN ou Routage & Commutation ?
5. **Corrections des anomalies** (§3) : les afficher corrigées avec une note, ou laisser l'énoncé d'origine ?
6. **Périmètre** : uniquement ces 10 TP réseau, ou prévoir d'autres matières plus tard (le modèle de données le permet) ?

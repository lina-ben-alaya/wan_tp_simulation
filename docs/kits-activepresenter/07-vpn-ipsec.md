# Kit ActivePresenter — TP VPN IPsec : VPN IPsec site à site

> Kit de production pour réaliser **votre propre** simulation de ce TP dans ActivePresenter. Contenu issu de l’énoncé et de la plateforme IT LAB. Les sorties marquées *reconstituées* doivent être remplacées par **vos captures réelles** (GNS3 / Packet Tracer).

## 0. Paramètres du projet

| Réglage | Valeur |
|---|---|
| Nom du projet | `vpn-ipsec` |
| Taille | 1280 × 720 (ou la taille de vos captures), option *Responsive* activée |
| Auteur (Fichier → Propriétés du projet) | Lina Ben Alaya |
| Export | HTML5, dossier `vpn-ipsec` |
| Volume | 7 étapes · 19 saisies de commandes · 9 questions |
| Outils à ouvrir | GNS3, Cisco 7200, Wireshark |

## 1. Diapo « Introduction »

- **Titre :** TP VPN IPsec — VPN IPsec site à site
- **Sous-titre :** IKE phase 1 et phase 2, transform-set, crypto map
- **Texte :** Deux sites, derrière R1 et R3, communiquent à travers R2 (le réseau intermédiaire). Le trafic entre PC-A et PC-C doit être protégé par un tunnel IPsec établi entre R1 et R3.
- **Bouton :** « Commencer » → diapo suivante

## 2. Diapo « Objectifs »

- Configurer l’adressage et le routage statique, tester PC-A ↔ PC-C
- Activer ISAKMP et définir la politique IKE phase 1 (AES, SHA-1, pre-share, DH 2)
- Définir la phase 2 : transform-set VPN-SET, ACL 110, crypto map VPN-MAP
- Appliquer la crypto map sur l’interface de sortie
- Observer show crypto ipsec sa avant et après du trafic utile, et les en-têtes sous Wireshark

- **Boutons :** « Retour » · « Suivant »

## 3. Diapo « Environnement et topologie »

- **Capture à réaliser :** la topologie complète dans GNS3.
- **Légende / callouts** (un par équipement) :
  - **PC-A** : 192.168.1.3/24 · Passerelle : 192.168.1.1
  - **R1** (Extrémité VPN) : Fa0/0 : 192.168.1.1/24 · S0/0/0 : 10.1.1.2/30 (voir notes)
  - **R2** (Transit) : S0/0/0 : 10.1.1.1/30 · S0/0/1 : 10.2.2.1/30
  - **R3** (Extrémité VPN) : Fa0/0 : 192.168.3.1/24 · S0/0/1 : 10.2.2.2/30 (voir notes)
  - **PC-C** : 192.168.3.3/24 · Passerelle : 192.168.3.1
- **Matériel :** R1, R2, R3, PC-A, PC-C

## 4. Manipulations (simulation logicielle)

> Pour chaque commande : une diapo avec la **capture de la console à l’invite indiquée**, une **zone de saisie (Text Entry)** placée sur la ligne de commande, et les feedbacks. Cochez *Insensible à la casse*. Ajoutez une diapo « Résultat » après la dernière commande de l’étape si une sortie est indiquée.

### Étape 1 — Activer ISAKMP (R1)

- **Diapo de contexte — texte :** Prérequis à IKE.

#### Diapo saisie 1 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config)#`
- **Consigne (légende) :** « Prérequis à IKE. »
- **Réponse attendue (Text Entry) :** `crypto isakmp enable`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto isakmp enable »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `crypto isakmp enable` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Pareil pour R3.

### Étape 2 — ACL du trafic à chiffrer (R1)

- **Diapo de contexte — texte :** Désigner le trafic LAN 1 → LAN 3.

#### Diapo saisie 2 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config)#`
- **Consigne (légende) :** « Désigner le trafic LAN 1 → LAN 3. »
- **Réponse attendue (Text Entry) :** `access-list 110 permit ip 192.168.1.0 0.0.0.255 192.168.3.0 0.0.0.255`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « access-list 110 permit ip <source> <wildcard> <destination> <wildcard> »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `access-list 110 permit ip 192.168.1.0 0.0.0.255 192.168.3.0 0.0.0.255` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Sur R3, l'ACL est le miroir : 192.168.3.0 → 192.168.1.0.

### Étape 3 — Politique IKE phase 1 (R1)

- **Diapo de contexte — texte :** AES, pre-share, groupe DH 2, clé partagée.

#### Diapo saisie 3 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config)#`
- **Consigne (légende) :** « AES, pre-share, groupe DH 2, clé partagée. »
- **Réponse attendue (Text Entry) :** `crypto isakmp policy 10`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto isakmp policy 10, puis encryption, authentication, group ; enfin la clé. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `crypto isakmp policy 10` puis passer à la suite (0 point).

#### Diapo saisie 4 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-isakmp)#`
- **Consigne (légende) :** « AES, pre-share, groupe DH 2, clé partagée. »
- **Réponse attendue (Text Entry) :** `encryption aes`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto isakmp policy 10, puis encryption, authentication, group ; enfin la clé. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `encryption aes` puis passer à la suite (0 point).

#### Diapo saisie 5 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-isakmp)#`
- **Consigne (légende) :** « AES, pre-share, groupe DH 2, clé partagée. »
- **Réponse attendue (Text Entry) :** `authentication pre-share`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto isakmp policy 10, puis encryption, authentication, group ; enfin la clé. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `authentication pre-share` puis passer à la suite (0 point).

#### Diapo saisie 6 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-isakmp)#`
- **Consigne (légende) :** « AES, pre-share, groupe DH 2, clé partagée. »
- **Réponse attendue (Text Entry) :** `group 2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto isakmp policy 10, puis encryption, authentication, group ; enfin la clé. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `group 2` puis passer à la suite (0 point).

#### Diapo saisie 7 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-isakmp)#`
- **Consigne (légende) :** « AES, pre-share, groupe DH 2, clé partagée. »
- **Réponse attendue (Text Entry) :** `exit`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto isakmp policy 10, puis encryption, authentication, group ; enfin la clé. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `exit` puis passer à la suite (0 point).

#### Diapo saisie 8 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config)#`
- **Consigne (légende) :** « AES, pre-share, groupe DH 2, clé partagée. »
- **Réponse attendue (Text Entry) :** `crypto isakmp key cisco address 10.2.2.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto isakmp policy 10, puis encryption, authentication, group ; enfin la clé. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `crypto isakmp key cisco address 10.2.2.2` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** La clé « cisco » est associée à l’adresse du pair (R3). Hachage SHA-1 et durée 86400 s : valeurs par défaut, non saisies.

### Étape 4 — Transform-set et crypto map (R1)

- **Diapo de contexte — texte :** Phase 2 : protection et association.

#### Diapo saisie 9 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config)#`
- **Consigne (légende) :** « Phase 2 : protection et association. »
- **Réponse attendue (Text Entry) :** `crypto ipsec transform-set VPN-SET esp-3des esp-sha-hmac`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto map VPN-MAP 10 ipsec-isakmp puis set peer / set transform-set / match address. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `crypto ipsec transform-set VPN-SET esp-3des esp-sha-hmac` puis passer à la suite (0 point).

#### Diapo saisie 10 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(cfg-crypto-trans)#`
- **Consigne (légende) :** « Phase 2 : protection et association. »
- **Réponse attendue (Text Entry) :** `exit`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto map VPN-MAP 10 ipsec-isakmp puis set peer / set transform-set / match address. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `exit` puis passer à la suite (0 point).

#### Diapo saisie 11 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config)#`
- **Consigne (légende) :** « Phase 2 : protection et association. »
- **Réponse attendue (Text Entry) :** `crypto map VPN-MAP 10 ipsec-isakmp`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto map VPN-MAP 10 ipsec-isakmp puis set peer / set transform-set / match address. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `crypto map VPN-MAP 10 ipsec-isakmp` puis passer à la suite (0 point).

#### Diapo saisie 12 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-crypto-map)#`
- **Consigne (légende) :** « Phase 2 : protection et association. »
- **Réponse attendue (Text Entry) :** `description VPN connection to R3`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto map VPN-MAP 10 ipsec-isakmp puis set peer / set transform-set / match address. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `description VPN connection to R3` puis passer à la suite (0 point).

#### Diapo saisie 13 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-crypto-map)#`
- **Consigne (légende) :** « Phase 2 : protection et association. »
- **Réponse attendue (Text Entry) :** `set peer 10.2.2.2`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto map VPN-MAP 10 ipsec-isakmp puis set peer / set transform-set / match address. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `set peer 10.2.2.2` puis passer à la suite (0 point).

#### Diapo saisie 14 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-crypto-map)#`
- **Consigne (légende) :** « Phase 2 : protection et association. »
- **Réponse attendue (Text Entry) :** `set transform-set VPN-SET`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto map VPN-MAP 10 ipsec-isakmp puis set peer / set transform-set / match address. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `set transform-set VPN-SET` puis passer à la suite (0 point).

#### Diapo saisie 15 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-crypto-map)#`
- **Consigne (légende) :** « Phase 2 : protection et association. »
- **Réponse attendue (Text Entry) :** `match address 110`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto map VPN-MAP 10 ipsec-isakmp puis set peer / set transform-set / match address. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `match address 110` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** La crypto map relie pair, transform-set et ACL. Sur R3 : set peer 10.1.1.2, description « VPN connection to R1 ».

### Étape 5 — Appliquer la crypto map (R1)

- **Diapo de contexte — texte :** Sur l’interface de sortie (entrée du tunnel).

#### Diapo saisie 16 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config)#`
- **Consigne (légende) :** « Sur l’interface de sortie (entrée du tunnel). »
- **Réponse attendue (Text Entry) :** `interface serial0/0/0`
- **Abréviation à accepter aussi :** `int s0/0/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto map <nom> en mode interface. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface serial0/0/0` puis passer à la suite (0 point).

#### Diapo saisie 17 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1(config-if)#`
- **Consigne (légende) :** « Sur l’interface de sortie (entrée du tunnel). »
- **Réponse attendue (Text Entry) :** `crypto map VPN-MAP`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « crypto map <nom> en mode interface. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `crypto map VPN-MAP` puis passer à la suite (0 point).

#### Diapo résultat — étape 5

- **Capture :** la sortie réelle sur R1. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
%CRYPTO-6-ISAKMP_ON_OFF: ISAKMP is ON
```


- **Explication (légende sur la diapo résultat) :** Sur R3, la crypto map est appliquée sur S0/0/1.

### Étape 6 — État du tunnel avant trafic (R1)

- **Diapo de contexte — texte :** Observer les compteurs.

#### Diapo saisie 18 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1#`
- **Consigne (légende) :** « Observer les compteurs. »
- **Réponse attendue (Text Entry) :** `show crypto ipsec sa`
- **Abréviation à accepter aussi :** `sh crypto ipsec sa`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show crypto ipsec sa »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show crypto ipsec sa` puis passer à la suite (0 point).

#### Diapo résultat — étape 6

- **Capture :** la sortie réelle sur R1. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
interface: Serial0/0/0
    Crypto map tag: VPN-MAP, local addr 10.1.1.2
   local  ident (addr/mask/prot/port): (192.168.1.0/255.255.255.0/0/0)
   remote ident (addr/mask/prot/port): (192.168.3.0/255.255.255.0/0/0)
   current_peer 10.2.2.2 port 500
    #pkts encaps: 0, #pkts encrypt: 0, #pkts digest: 0
    #pkts decaps: 0, #pkts decrypt: 0, #pkts verify: 0
```


- **Explication (légende sur la diapo résultat) :** Aucun paquet n’a encore été chiffré : le tunnel attend du trafic « intéressant ».

### Étape 7 — État du tunnel après un ping PC-A → PC-C (R1)

- **Diapo de contexte — texte :** Les compteurs augmentent.

#### Diapo saisie 19 — sur **R1**

- **Capture :** console de R1 affichant l’invite `R1#`
- **Consigne (légende) :** « Les compteurs augmentent. »
- **Réponse attendue (Text Entry) :** `show crypto ipsec sa`
- **Abréviation à accepter aussi :** `sh crypto ipsec sa`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show crypto ipsec sa »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show crypto ipsec sa` puis passer à la suite (0 point).

#### Diapo résultat — étape 7

- **Capture :** la sortie réelle sur R1. Sortie **illustrative** (valeurs à remplacer par les vôtres) :

```
    #pkts encaps: 4, #pkts encrypt: 4, #pkts digest: 4
    #pkts decaps: 4, #pkts decrypt: 4, #pkts verify: 4
```


- **Explication (légende sur la diapo résultat) :** Le premier paquet peut être perdu pendant la négociation : les valeurs exactes dépendent de votre essai. Sous Wireshark : ISAKMP (UDP 500) puis ESP, avec les adresses des routeurs en clair et le contenu chiffré.

## 5. Questions

### Diapo Q1 — Question du TP

**Question (texte affiché) :** Pourquoi activer ISAKMP ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Pour router les paquets
- [x] Il est utilisé par IKE pour sécuriser le trafic via IPsec
- [ ] Pour la NAT
- [ ] Pour créer l’ACL

- **Feedback correct :** « Bonne réponse. ISAKMP est le cadre utilisé par IKE pour gérer les associations de sécurité et les clés. »
- **Feedback incorrect :** « Réponse incorrecte. ISAKMP est le cadre utilisé par IKE pour gérer les associations de sécurité et les clés. »
- Score : 1 point · Tentatives : 2

### Diapo Q2 — Question du TP

**Question (texte affiché) :** Que doivent avoir en commun R1 et R3 en phase 1 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Le même hostname
- [x] Une politique avec les mêmes paramètres
- [ ] La même ACL
- [ ] Le même numéro de crypto map

- **Feedback correct :** « Bonne réponse. Les deux pairs doivent avoir une stratégie identique. »
- **Feedback incorrect :** « Réponse incorrecte. Les deux pairs doivent avoir une stratégie identique. »
- Score : 1 point · Tentatives : 2

### Diapo Q3 — Question du TP

**Question (texte affiché) :** Quels paramètres de phase 1 sont configurés explicitement dans le TP (non par défaut) ?

**Interaction ActivePresenter :** Question à choix multiples — *plusieurs réponses*.

- [x] encryption aes
- [ ] hash sha
- [x] authentication pre-share
- [x] group 2
- [ ] lifetime 86400

- **Feedback correct :** « Bonne réponse. SHA-1 et 86400 s sont les valeurs par défaut. »
- **Feedback incorrect :** « Réponse incorrecte. SHA-1 et 86400 s sont les valeurs par défaut. »
- Score : 1 point · Tentatives : 2

### Diapo Q4 — Question du TP

**Question (texte affiché) :** Quelle est la clé pré-partagée du TP ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `cisco`

- **Feedback correct :** « Bonne réponse. crypto isakmp key cisco address <pair>. »
- **Feedback incorrect :** « Réponse incorrecte. crypto isakmp key cisco address <pair>. »
- Score : 1 point · Tentatives : 2

### Diapo Q5 — Question du TP

**Question (texte affiché) :** Que définit l’ACL 110 ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Le trafic bloqué
- [x] Le trafic autorisé à passer (et chiffré) dans le tunnel IPsec
- [ ] Les adresses NAT
- [ ] Les voisins OSPF

- **Feedback correct :** « Bonne réponse. Le trafic 192.168.1.0/24 ↔ 192.168.3.0/24. »
- **Feedback incorrect :** « Réponse incorrecte. Le trafic 192.168.1.0/24 ↔ 192.168.3.0/24. »
- Score : 1 point · Tentatives : 2

### Diapo Q6 — Question de notion

**Question (texte affiché) :** Dans « esp-3des esp-sha-hmac », que garantit esp-sha-hmac ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Le chiffrement
- [x] L’intégrité et l’authentification des paquets
- [ ] La compression
- [ ] Le routage

- **Feedback correct :** « Bonne réponse. 3DES chiffre ; SHA-HMAC authentifie et contrôle l’intégrité. »
- **Feedback incorrect :** « Réponse incorrecte. 3DES chiffre ; SHA-HMAC authentifie et contrôle l’intégrité. »
- Score : 1 point · Tentatives : 2

### Diapo Q7 — Question du TP

**Question (texte affiché) :** Avant tout ping, que valent les compteurs pkts encaps/encrypt ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [x] 0
- [ ] Le nombre de paquets ISAKMP
- [ ] 100
- [ ] Ils n’existent pas encore

- **Feedback correct :** « Bonne réponse. Le tunnel ne chiffre que le trafic correspondant à l’ACL. »
- **Feedback incorrect :** « Réponse incorrecte. Le tunnel ne chiffre que le trafic correspondant à l’ACL. »
- Score : 1 point · Tentatives : 2

### Diapo Q8 — Question du TP

**Question (texte affiché) :** Sous Wireshark, sur le lien R1–R2, que voit-on du ping PC-A → PC-C ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] ICMP en clair de 192.168.1.3 vers 192.168.3.3
- [x] Des paquets ESP entre les routeurs, contenu chiffré
- [ ] Rien
- [ ] Des paquets GRE

- **Feedback correct :** « Bonne réponse. L’en-tête IP externe porte les adresses des routeurs ; le paquet d’origine est chiffré dans ESP. »
- **Feedback incorrect :** « Réponse incorrecte. L’en-tête IP externe porte les adresses des routeurs ; le paquet d’origine est chiffré dans ESP. »
- Score : 1 point · Tentatives : 2

### Diapo Q9 — Question de notion

**Question (texte affiché) :** Ordonnez la configuration IPsec sur R1.

**Interaction ActivePresenter :** Question de séquence (Sequence). Ordre correct :

1. crypto isakmp enable
2. ACL 110 du trafic à chiffrer
3. Politique IKE phase 1 et clé
4. Transform-set (phase 2)
5. Crypto map
6. Application sur S0/0/0

- **Feedback correct :** « Bonne réponse. Ordre de l’énoncé. »
- **Feedback incorrect :** « Réponse incorrecte. Ordre de l’énoncé. »
- Score : 1 point · Tentatives : 2

## 6. Diapo bonus « Erreur classique » (optionnelle)

### Politiques de phase 1 différentes

- **Contexte :** R1 et R3 négocient IKE.
- **Incorrect :**

```
R1: encryption aes / group 2
R3: encryption 3des / group 5
```

  → Aucune politique commune : la phase 1 échoue, aucune SA n’est créée.
- **Correct :**

```
R1 et R3: encryption aes, authentication pre-share, group 2
```

  → Phase 1 négociée puis SA IPsec créées.
- **À retenir :** Les deux pairs doivent avoir une politique ISAKMP aux paramètres identiques.

### Crypto map non appliquée

- **Contexte :** Toute la configuration est saisie sur R1.
- **Incorrect :**

```
interface Serial0/0/0
 ! pas de crypto map
```

  → Le trafic passe en clair : rien ne déclenche IPsec.
- **Correct :**

```
interface Serial0/0/0
 crypto map VPN-MAP
```

  → Le trafic correspondant à l’ACL est chiffré.
- **À retenir :** Une crypto map n’agit que lorsqu’elle est appliquée sur l’interface de sortie.

## 7. Diapo « Résultat final »

- Afficher le score (variable *Score* du projet) et le pourcentage.
- Boutons : « Recommencer » (aller à la diapo 1) · « Revoir les erreurs ».
- *Optionnel* — remonter le score dans IT LAB : sur cette diapo, Événement « Au chargement » → action **Exécuter JavaScript** :

```
parent.postMessage({ source: 'itlab-ap', tp: 'vpn-ipsec', score: 1, max: 1 }, '*');
```

## 8. Notes sur l’énoncé

- Le tableau d'adressage de l'énoncé est désaligné dans le PDF. Pour rester cohérente avec les commandes de l'énoncé (R1 : set peer 10.2.2.2 ; R3 : set peer 10.1.1.2), la plateforme utilise R1 S0/0/0 = 10.1.1.2 et R3 S0/0/1 = 10.2.2.2, R2 portant 10.1.1.1 et 10.2.2.1. À vérifier avec votre maquette.

---
Source : Énoncé – TP VPN IPsec sous GNS3.

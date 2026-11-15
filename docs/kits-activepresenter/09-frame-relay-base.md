# Kit ActivePresenter — TP FR base : Frame Relay – configuration de base

> Kit de production pour réaliser **votre propre** simulation de ce TP dans ActivePresenter. Contenu issu de l’énoncé et de la plateforme IT LAB. Les sorties marquées *reconstituées* doivent être remplacées par **vos captures réelles** (GNS3 / Packet Tracer).

## 0. Paramètres du projet

| Réglage | Valeur |
|---|---|
| Nom du projet | `frame-relay-base` |
| Taille | 1280 × 720 (ou la taille de vos captures), option *Responsive* activée |
| Auteur (Fichier → Propriétés du projet) | Lina Ben Alaya |
| Export | HTML5, dossier `frame-relay-base` |
| Volume | 6 étapes · 16 saisies de commandes · 8 questions |
| Outils à ouvrir | GNS3, Wireshark |

## 1. Diapo « Introduction »

- **Titre :** TP FR base — Frame Relay – configuration de base
- **Sous-titre :** Encapsulation, PVC, LMI, Inverse ARP et mappage statique
- **Texte :** Le siège (DTE) est relié au commutateur Frame Relay FR1 (DCE), qui achemine des circuits virtuels permanents vers Agence 1 et Agence 2. Les interfaces série partagent le réseau 192.168.2.0/29.
- **Bouton :** « Commencer » → diapo suivante

## 2. Diapo « Objectifs »

- Configurer l’encapsulation Frame Relay et activer les interfaces
- Interpréter show frame-relay pvc et show interfaces serial1/0
- Analyser le trafic LMI entre DTE et DCE
- Interpréter show frame-relay map et les messages Inverse ARP
- Remplacer le mappage dynamique par un mappage statique avec broadcast

- **Boutons :** « Retour » · « Suivant »

## 3. Diapo « Environnement et topologie »

- **Capture à réaliser :** la topologie complète dans GNS3.
- **Légende / callouts** (un par équipement) :
  - **Siege** (DTE) : S1/0 : 192.168.2.1/29 · DLCI 16 → Agence1, 17 → Agence2 (hypothèse)
  - **FR1** (DCE) : Commutateur Frame Relay · Commute les PVC par port / DLCI
  - **Agence1** (DTE) : S1/0 : 192.168.2.2/29
  - **Agence2** (DTE) : S1/0 : 192.168.2.3/29
- **Matériel :** Siege, Agence1, Agence2, FR1 (commutateur Frame Relay)

## 4. Manipulations (simulation logicielle)

> Pour chaque commande : une diapo avec la **capture de la console à l’invite indiquée**, une **zone de saisie (Text Entry)** placée sur la ligne de commande, et les feedbacks. Cochez *Insensible à la casse*. Ajoutez une diapo « Résultat » après la dernière commande de l’étape si une sortie est indiquée.

### Étape 1 — Encapsulation Frame Relay (Siege)

- **Diapo de contexte — texte :** Configurer S1/0 et l’activer.

#### Diapo saisie 1 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege(config)#`
- **Consigne (légende) :** « Configurer S1/0 et l’activer. »
- **Réponse attendue (Text Entry) :** `interface s1/0`
- **Abréviation à accepter aussi :** `int s1/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « encapsulation frame-relay puis no shutdown. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface s1/0` puis passer à la suite (0 point).

#### Diapo saisie 2 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege(config-if)#`
- **Consigne (légende) :** « Configurer S1/0 et l’activer. »
- **Réponse attendue (Text Entry) :** `encapsulation frame-relay`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « encapsulation frame-relay puis no shutdown. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `encapsulation frame-relay` puis passer à la suite (0 point).

#### Diapo saisie 3 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege(config-if)#`
- **Consigne (légende) :** « Configurer S1/0 et l’activer. »
- **Réponse attendue (Text Entry) :** `no shutdown`
- **Abréviation à accepter aussi :** `no shut`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « encapsulation frame-relay puis no shutdown. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `no shutdown` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** Même chose sur Agence 1 et Agence 2. Le commutateur FR1 doit avoir été configuré avec les PVC.

### Étape 2 — État des PVC (Siege)

- **Diapo de contexte — texte :** Interpréter show frame-relay pvc.

#### Diapo saisie 4 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege#`
- **Consigne (légende) :** « Interpréter show frame-relay pvc. »
- **Réponse attendue (Text Entry) :** `show frame-relay pvc`
- **Abréviation à accepter aussi :** `sh frame-relay pvc`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show frame-relay pvc »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show frame-relay pvc` puis passer à la suite (0 point).

#### Diapo résultat — étape 2

- **Capture :** la sortie réelle sur Siege. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
PVC Statistics for interface Serial1/0 (Frame Relay DTE)

              Active     Inactive      Deleted       Static
  Local          2            0            0            0

DLCI = 16, DLCI USAGE = LOCAL, PVC STATUS = ACTIVE, INTERFACE = Serial1/0
DLCI = 17, DLCI USAGE = LOCAL, PVC STATUS = ACTIVE, INTERFACE = Serial1/0
```


- **Explication (légende sur la diapo résultat) :** ACTIVE : le PVC est opérationnel de bout en bout (signalé par la LMI). INACTIVE : le DCE connaît le PVC mais l’extrémité distante est indisponible. DELETED : le DLCI n’est pas connu du commutateur.

### Étape 3 — Interface série et LMI (Siege)

- **Diapo de contexte — texte :** Lire l’encapsulation et les compteurs LMI.

#### Diapo saisie 5 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege#`
- **Consigne (légende) :** « Lire l’encapsulation et les compteurs LMI. »
- **Réponse attendue (Text Entry) :** `show interfaces serial1/0`
- **Abréviation à accepter aussi :** `sh interfaces s1/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show interfaces serial1/0 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show interfaces serial1/0` puis passer à la suite (0 point).

#### Diapo résultat — étape 3

- **Capture :** la sortie réelle sur Siege. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
Serial1/0 is up, line protocol is up
  Encapsulation FRAME-RELAY, loopback not set
  LMI enq sent  …, LMI stat recvd …, LMI upd recvd 0, DTE LMI up
  LMI DLCI …  LMI type is …  frame relay DTE
```


- **Explication (légende sur la diapo résultat) :** Les compteurs LMI enq sent / stat recvd montrent l'échange de signalisation avec FR1 : c'est ce trafic que vous capturez sous Wireshark entre Siege (DTE) et FR1 (DCE).

### Étape 4 — Adressage du WAN (Siege)

- **Diapo de contexte — texte :** Utiliser la plage 192.168.2.0/29.

#### Diapo saisie 6 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege(config)#`
- **Consigne (légende) :** « Utiliser la plage 192.168.2.0/29. »
- **Réponse attendue (Text Entry) :** `interface s1/0`
- **Abréviation à accepter aussi :** `int s1/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « /29 → 255.255.255.248 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface s1/0` puis passer à la suite (0 point).

#### Diapo saisie 7 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege(config-if)#`
- **Consigne (légende) :** « Utiliser la plage 192.168.2.0/29. »
- **Réponse attendue (Text Entry) :** `ip address 192.168.2.1 255.255.255.248`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « /29 → 255.255.255.248 »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `ip address 192.168.2.1 255.255.255.248` puis passer à la suite (0 point).

- **Explication (légende sur la diapo résultat) :** /29 = 255.255.255.248 : 6 adresses utilisables, assez pour les trois routeurs.

### Étape 5 — Mappage dynamique (Siege)

- **Diapo de contexte — texte :** Interpréter show frame-relay map.

#### Diapo saisie 8 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege#`
- **Consigne (légende) :** « Interpréter show frame-relay map. »
- **Réponse attendue (Text Entry) :** `show frame-relay map`
- **Abréviation à accepter aussi :** `sh frame-relay map`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « show frame-relay map »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `show frame-relay map` puis passer à la suite (0 point).

#### Diapo résultat — étape 5

- **Capture :** la sortie réelle sur Siege. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
Serial1/0 (up): ip 192.168.2.2 dlci 16(0x10,0x400), dynamic,
              broadcast, status defined, active
Serial1/0 (up): ip 192.168.2.3 dlci 17(0x11,0x410), dynamic,
              broadcast, status defined, active
```


- **Explication (légende sur la diapo résultat) :** dynamic : appris par Inverse ARP. Pour joindre 192.168.2.2, le Siège utilise le DLCI 16.

### Étape 6 — Mappage statique (Siege)

- **Diapo de contexte — texte :** Désactiver Inverse ARP et mapper manuellement.

#### Diapo saisie 9 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege(config)#`
- **Consigne (légende) :** « Désactiver Inverse ARP et mapper manuellement. »
- **Réponse attendue (Text Entry) :** `interface s1/0`
- **Abréviation à accepter aussi :** `int s1/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « no frame-relay inverse-arp, clear frame-relay inarp, puis frame-relay map ip <IP distante> <DLCI local> broadcast. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface s1/0` puis passer à la suite (0 point).

#### Diapo saisie 10 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege(config-if)#`
- **Consigne (légende) :** « Désactiver Inverse ARP et mapper manuellement. »
- **Réponse attendue (Text Entry) :** `no frame-relay inverse-arp`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « no frame-relay inverse-arp, clear frame-relay inarp, puis frame-relay map ip <IP distante> <DLCI local> broadcast. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `no frame-relay inverse-arp` puis passer à la suite (0 point).

#### Diapo saisie 11 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege(config-if)#`
- **Consigne (légende) :** « Désactiver Inverse ARP et mapper manuellement. »
- **Réponse attendue (Text Entry) :** `end`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « no frame-relay inverse-arp, clear frame-relay inarp, puis frame-relay map ip <IP distante> <DLCI local> broadcast. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `end` puis passer à la suite (0 point).

#### Diapo saisie 12 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege#`
- **Consigne (légende) :** « Désactiver Inverse ARP et mapper manuellement. »
- **Réponse attendue (Text Entry) :** `clear frame-relay inarp`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « no frame-relay inverse-arp, clear frame-relay inarp, puis frame-relay map ip <IP distante> <DLCI local> broadcast. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `clear frame-relay inarp` puis passer à la suite (0 point).

#### Diapo saisie 13 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege#`
- **Consigne (légende) :** « Désactiver Inverse ARP et mapper manuellement. »
- **Réponse attendue (Text Entry) :** `configure terminal`
- **Abréviation à accepter aussi :** `conf t`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « no frame-relay inverse-arp, clear frame-relay inarp, puis frame-relay map ip <IP distante> <DLCI local> broadcast. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `configure terminal` puis passer à la suite (0 point).

#### Diapo saisie 14 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege(config)#`
- **Consigne (légende) :** « Désactiver Inverse ARP et mapper manuellement. »
- **Réponse attendue (Text Entry) :** `interface s1/0`
- **Abréviation à accepter aussi :** `int s1/0`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « no frame-relay inverse-arp, clear frame-relay inarp, puis frame-relay map ip <IP distante> <DLCI local> broadcast. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `interface s1/0` puis passer à la suite (0 point).

#### Diapo saisie 15 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege(config-if)#`
- **Consigne (légende) :** « Désactiver Inverse ARP et mapper manuellement. »
- **Réponse attendue (Text Entry) :** `frame-relay map ip 192.168.2.2 16 broadcast`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « no frame-relay inverse-arp, clear frame-relay inarp, puis frame-relay map ip <IP distante> <DLCI local> broadcast. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `frame-relay map ip 192.168.2.2 16 broadcast` puis passer à la suite (0 point).

#### Diapo saisie 16 — sur **Siege**

- **Capture :** console de Siege affichant l’invite `Siege(config-if)#`
- **Consigne (légende) :** « Désactiver Inverse ARP et mapper manuellement. »
- **Réponse attendue (Text Entry) :** `frame-relay map ip 192.168.2.3 17 broadcast`
- **Indice (bouton « Indice » ou après 2 erreurs) :** « no frame-relay inverse-arp, clear frame-relay inarp, puis frame-relay map ip <IP distante> <DLCI local> broadcast. »
- **Feedback correct :** « Correct. »
- **Feedback incorrect :** « Ce n’est pas la commande attendue. Réessayez. »
- **Après 3 essais :** afficher la solution `frame-relay map ip 192.168.2.3 17 broadcast` puis passer à la suite (0 point).

#### Diapo résultat — étape 6

- **Capture :** la sortie réelle sur Siege. Sortie **reconstituée** (à remplacer par votre capture réelle) :

```
Serial1/0 (up): ip 192.168.2.2 dlci 16(0x10,0x400), static,
              broadcast, CISCO, status defined, active
```


- **Explication (légende sur la diapo résultat) :** Entre l'effacement et le mappage statique, vérifiez que la communication est coupée. Le DLCI est mappé avec l'adresse IP de l'autre extrémité du PVC.

## 5. Questions

### Diapo Q1 — Question du TP

**Question (texte affiché) :** À quoi sert de mapper une adresse IP avec un DLCI ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] À chiffrer la trame
- [x] À savoir sur quel PVC (DLCI local) envoyer un paquet destiné à une adresse IP voisine
- [ ] À attribuer une adresse IP
- [ ] À configurer la LMI

- **Feedback correct :** « Bonne réponse. C’est la résolution couche 3 → couche 2 propre à Frame Relay. »
- **Feedback incorrect :** « Réponse incorrecte. C’est la résolution couche 3 → couche 2 propre à Frame Relay. »
- Score : 1 point · Tentatives : 2

### Diapo Q2 — Question du TP

**Question (texte affiché) :** Le DLCI est-il mappé avec l’adresse IP locale ou celle de l’autre extrémité du PVC ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] L’adresse IP locale
- [x] L’adresse IP de l’autre extrémité

- **Feedback correct :** « Bonne réponse. frame-relay map ip <IP distante> <DLCI local>. »
- **Feedback incorrect :** « Réponse incorrecte. frame-relay map ip <IP distante> <DLCI local>. »
- Score : 1 point · Tentatives : 2

### Diapo Q3 — Question du TP

**Question (texte affiché) :** Quel protocole associe dynamiquement une adresse IP à un DLCI ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] ARP
- [x] Inverse ARP
- [ ] LMI
- [ ] DHCP

- **Feedback correct :** « Bonne réponse. Inverse ARP part du DLCI connu pour découvrir l’IP distante. »
- **Feedback incorrect :** « Réponse incorrecte. Inverse ARP part du DLCI connu pour découvrir l’IP distante. »
- Score : 1 point · Tentatives : 2

### Diapo Q4 — Question du TP

**Question (texte affiché) :** Pourquoi ajouter broadcast à frame-relay map ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] Pour diffuser la configuration
- [x] Pour envoyer le trafic de diffusion / multidiffusion sur le DLCI (nécessaire à la plupart des protocoles de routage)
- [ ] Pour activer Inverse ARP
- [ ] Pour la LMI

- **Feedback correct :** « Bonne réponse. Sans broadcast, les mises à jour de routage multicast ne passent pas. »
- **Feedback incorrect :** « Réponse incorrecte. Sans broadcast, les mises à jour de routage multicast ne passent pas. »
- Score : 1 point · Tentatives : 2

### Diapo Q5 — Question de notion

**Question (texte affiché) :** Quel trafic observe-t-on entre Siege (DTE) et FR1 (DCE) avant même d’adresser les interfaces ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [ ] ICMP
- [x] Des messages LMI (état des PVC / keepalive)
- [ ] OSPF
- [ ] DHCP

- **Feedback correct :** « Bonne réponse. La LMI fonctionne dès que l’encapsulation est active. »
- **Feedback incorrect :** « Réponse incorrecte. La LMI fonctionne dès que l’encapsulation est active. »
- Score : 1 point · Tentatives : 2

### Diapo Q6 — Question de notion

**Question (texte affiché) :** Masque décimal du /29 utilisé sur le WAN ?

**Interaction ActivePresenter :** Zone de saisie (Text Entry), *non sensible à la casse*.

Réponses acceptées :
- `255.255.255.248`

- **Feedback correct :** « Bonne réponse. /29 = 255.255.255.248. »
- **Feedback incorrect :** « Réponse incorrecte. /29 = 255.255.255.248. »
- Score : 1 point · Tentatives : 2

### Diapo Q7 — Question de notion

**Question (texte affiché) :** Dans show frame-relay map, que signifie « dynamic » ?

**Interaction ActivePresenter :** Question à choix multiples — *une seule réponse*.

- [x] Le mappage a été appris par Inverse ARP
- [ ] Le PVC change de DLCI
- [ ] Le routage est dynamique
- [ ] La LMI est désactivée

- **Feedback correct :** « Bonne réponse. Après la configuration statique, la mention devient « static ». »
- **Feedback incorrect :** « Réponse incorrecte. Après la configuration statique, la mention devient « static ». »
- Score : 1 point · Tentatives : 2

### Diapo Q8 — Question de notion

**Question (texte affiché) :** Ordonnez le passage au mappage statique.

**Interaction ActivePresenter :** Question de séquence (Sequence). Ordre correct :

1. Désactiver l’Inverse ARP
2. Effacer le mappage dynamique (clear frame-relay inarp)
3. Vérifier que la communication est coupée
4. Ajouter frame-relay map … broadcast
5. Vérifier le mappage statique

- **Feedback correct :** « Bonne réponse. Ordre de l’étape 11 de l’énoncé. »
- **Feedback incorrect :** « Réponse incorrecte. Ordre de l’étape 11 de l’énoncé. »
- Score : 1 point · Tentatives : 2

## 6. Diapo bonus « Erreur classique » (optionnelle)

### Mappage statique sans broadcast

- **Contexte :** Un protocole de routage tourne sur le WAN Frame Relay.
- **Incorrect :**

```
frame-relay map ip 192.168.2.2 16
```

  → Le ping unicast fonctionne, mais les mises à jour de routage (multicast) ne sont pas envoyées sur le PVC.
- **Correct :**

```
frame-relay map ip 192.168.2.2 16 broadcast
```

  → Le trafic de diffusion est répliqué sur le PVC : le routage fonctionne.
- **À retenir :** La plupart des protocoles de routage nécessitent le mot-clé broadcast.

### Inverse ARP désactivé sans mappage

- **Contexte :** Passage au mappage statique.
- **Incorrect :**

```
no frame-relay inverse-arp
clear frame-relay inarp
! pas de frame-relay map
```

  → Plus aucune correspondance IP ↔ DLCI : la communication est coupée.
- **Correct :**

```
no frame-relay inverse-arp
frame-relay map ip 192.168.2.2 16 broadcast
frame-relay map ip 192.168.2.3 17 broadcast
```

  → Correspondances statiques : communication rétablie.
- **À retenir :** Sans Inverse ARP, chaque voisin doit être mappé statiquement.

## 7. Diapo « Résultat final »

- Afficher le score (variable *Score* du projet) et le pourcentage.
- Boutons : « Recommencer » (aller à la diapo 1) · « Revoir les erreurs ».
- *Optionnel* — remonter le score dans IT LAB : sur cette diapo, Événement « Au chargement » → action **Exécuter JavaScript** :

```
parent.postMessage({ source: 'itlab-ap', tp: 'frame-relay-base', score: 1, max: 1 }, '*');
```

## 8. Notes sur l’énoncé

- Les commandes de mappage statique et les sorties figurent en captures dans l'énoncé : elles sont reconstituées ici.
- L'énoncé ne précise que DLCI 16 ↔ 192.168.2.2 ; l'affectation DLCI 17 ↔ Agence2 (192.168.2.3) est une hypothèse de la plateforme, de même que les adresses .1 et .3.
- Les étapes 9-10 (LAN et routes statiques) ne détaillent pas l'adressage des LAN : elles ne sont pas reprises en mode Pratiquer.

---
Source : Énoncé – Configuration de base Frame Relay.

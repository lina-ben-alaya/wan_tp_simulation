import type { Tp } from '../types';
import { mplsTopology } from './_mpls-topology';

const tp: Tp = {
  slug: 'mpls-backbone-p2',
  order: 2,
  code: 'TP1 · P2',
  title: 'Backbone MPLS – Partie II',
  subtitle: 'Activation de MPLS, LDP, LIB et LFIB',
  subject: 'tech-wan',
  theme: 'mpls',
  level: 2,
  duration: 45,
  tools: ['GNS3', 'Cisco 7200'],
  equipment: ['SP1', 'SP2', 'SP3'],
  fidelity: 'reconstitue',
  summary:
    "Activer MPLS dans le backbone : forcer l'ID LDP sur la loopback, activer « mpls ip » sur les interfaces, vérifier les adjacences LDP puis lire les tables LIB et LFIB.",
  scenario:
    "Le backbone OSPF de la partie I est opérationnel. Il faut maintenant que les routeurs de l'opérateur commutent sur des labels : on active MPLS et le protocole de distribution de labels LDP.",
  objectives: [
    'Forcer la loopback 0 comme router-ID LDP',
    'Activer MPLS sur toutes les interfaces physiques du domaine',
    'Vérifier les adjacences LDP',
    'Distinguer la LIB (show mpls ldp bindings) de la LFIB (show mpls forwarding-table)',
    'Relever les labels utilisés pour le préfixe 1.1.1.0/25',
  ],
  prerequisites: ['mpls-backbone-p1'],
  topology: mplsTopology,
  learn: [
    {
      title: 'MPLS en une phrase',
      body: [
        'MPLS (Multi Protocol Label Switching) ajoute devant l’en-tête IP un label court. Les routeurs du cœur commutent les paquets en lisant ce label, sans consulter la table de routage IP à chaque saut.',
        "Le chemin suivi par les paquets étiquetés est appelé LSP (Label Switched Path).",
      ],
      points: ['Push : le routeur d’entrée ajoute un label', 'Swap : un routeur du cœur remplace le label', 'Pop : le label est retiré avant la sortie'],
    },
    {
      title: 'LDP et son router-ID',
      body: [
        'LDP (Label Distribution Protocol) permet aux routeurs voisins d’échanger les associations « préfixe ↔ label ».',
        "Le router-ID LDP serait choisi automatiquement, mais il est préférable de le forcer sur Loopback0 : sa valeur reste inchangée malgré les changements de topologie et les redémarrages.",
      ],
      code: 'mpls ldp router-id loopback0 force',
    },
    {
      title: 'LIB et LFIB',
      body: [
        'La LIB (Label Information Base) contient tous les labels connus : ceux attribués localement et ceux reçus de chaque voisin LDP. Commande : show mpls ldp bindings.',
        'La LFIB (Label Forwarding Information Base) contient uniquement ce qui sert à commuter : label entrant, label sortant, interface et prochain saut. Commande : show mpls forwarding-table.',
      ],
      callout: { tone: 'tip', text: 'Les numéros de labels varient d’une exécution à l’autre : relevez ceux de votre maquette.' },
    },
  ],
  steps: [
    {
      id: 'ldp-id-sp1',
      device: 'SP1',
      title: 'Forcer le router-ID LDP',
      goal: 'LDP doit utiliser Loopback0 comme identifiant.',
      commands: [
        { prompt: 'SP1#', cmd: 'configure terminal' },
        { prompt: 'SP1(config)#', cmd: 'mpls ldp router-id loopback0 force' },
      ],
      explain: 'Commande de configuration globale, à répéter sur SP2 et SP3. Le mot-clé force applique immédiatement le nouvel ID.',
      hint: 'mpls ldp router-id <interface> force',
    },
    {
      id: 'mpls-ip-sp1',
      device: 'SP1',
      title: 'Activer MPLS vers SP2',
      goal: 'Activer MPLS sur l’interface physique du domaine MPLS.',
      commands: [
        { prompt: 'SP1(config)#', cmd: 'interface serial1/2' },
        { prompt: 'SP1(config-if)#', cmd: 'mpls ip' },
      ],
      explain: "Seules les interfaces du backbone reçoivent « mpls ip ». L'interface vers SIEGE (client) n'en a pas besoin.",
      hint: 'mpls ip, en mode interface.',
    },
    {
      id: 'mpls-ip-sp2',
      device: 'SP2',
      title: 'Activer MPLS sur SP2',
      goal: 'SP2 a deux interfaces dans le domaine MPLS.',
      commands: [
        { prompt: 'SP2(config)#', cmd: 'mpls ldp router-id loopback0 force' },
        { prompt: 'SP2(config)#', cmd: 'interface serial1/2' },
        { prompt: 'SP2(config-if)#', cmd: 'mpls ip' },
        { prompt: 'SP2(config-if)#', cmd: 'interface serial1/3' },
        { prompt: 'SP2(config-if)#', cmd: 'mpls ip' },
      ],
      output: '%LDP-5-NBRCHG: LDP Neighbor 1.1.1.1:0 (1) is UP',
      outputFidelity: 'reconstitue',
      explain: 'Un message console signale que les routeurs sont devenus adjacents via LDP. Terminez avec SP3 (router-ID + mpls ip sur s1/3).',
      hint: 'Deux interfaces série : s1/2 et s1/3.',
    },
    {
      id: 'ldp-nbr',
      device: 'SP2',
      title: 'Vérifier les adjacences LDP',
      goal: 'SP2 doit voir SP1 et SP3.',
      commands: [{ prompt: 'SP2#', cmd: 'show mpls ldp neighbor' }],
      output:
        '    Peer LDP Ident: 1.1.1.1:0; Local LDP Ident 2.2.2.2:0\n        TCP connection: 1.1.1.1.646 - 2.2.2.2.xxxxx\n        State: Oper; Msgs sent/rcvd: …\n    Peer LDP Ident: 3.3.3.3:0; Local LDP Ident 2.2.2.2:0\n        TCP connection: 3.3.3.3.xxxxx - 2.2.2.2.646\n        State: Oper; Msgs sent/rcvd: …',
      outputFidelity: 'reconstitue',
      explain: 'Les identifiants LDP sont les loopbacks (x.x.x.x:0) : le router-ID forcé est bien pris en compte. State: Oper = session opérationnelle (TCP 646).',
      hint: 'show mpls ldp neighbor',
    },
    {
      id: 'mpls-if',
      device: 'SP3',
      title: 'Interfaces MPLS de SP3',
      goal: 'Lister les interfaces où MPLS fonctionne.',
      commands: [{ prompt: 'SP3#', cmd: 'show mpls interfaces' }],
      output: 'Interface              IP            Tunnel   BGP Static Operational\nSerial1/3              Yes (ldp)     No       No  No     Yes',
      outputFidelity: 'reconstitue',
      explain: 'Seule s1/3 (vers SP2) est dans le domaine MPLS. s1/1, vers AGENCE, est une interface client.',
      hint: 'show mpls interfaces',
    },
    {
      id: 'lfib',
      device: 'SP3',
      title: 'Lire la LFIB',
      goal: 'Afficher la table de commutation des labels.',
      commands: [{ prompt: 'SP3#', cmd: 'show mpls forwarding-table' }],
      output:
        'Local  Outgoing    Prefix            Bytes Label  Outgoing   Next Hop\nLabel  Label       or Tunnel Id      Switched     interface\n17     16          1.1.1.0/25        0            Se1/3      point2point\n18     Pop Label   2.2.2.0/25        0            Se1/3      point2point\n19     Pop Label   192.168.23.0/24   0            Se1/3      point2point',
      outputFidelity: 'illustratif',
      explain: "Pour 2.2.2.0/25, SP2 est le dernier saut avant la destination : il a annoncé un label implicit-null, d'où « Pop Label ». Les numéros (16, 17…) sont illustratifs.",
      hint: 'show mpls forwarding-table',
    },
    {
      id: 'lib',
      device: 'SP3',
      title: 'Lire la LIB',
      goal: 'Afficher toutes les associations préfixe ↔ label.',
      commands: [{ prompt: 'SP3#', cmd: 'show mpls ldp bindings' }],
      output:
        '  lib entry: 1.1.1.0/25, rev 6\n        local binding:  label: 17\n        remote binding: lsr: 2.2.2.2:0, label: 16\n  lib entry: 3.3.3.0/25, rev 2\n        local binding:  label: imp-null\n        remote binding: lsr: 2.2.2.2:0, label: 18',
      outputFidelity: 'illustratif',
      explain: 'La LIB montre le label local et les labels reçus de chaque voisin (remote binding). Pour son propre réseau 3.3.3.0/25, SP3 annonce imp-null.',
      hint: 'show mpls ldp bindings',
    },
  ],
  quiz: [
    {
      id: 'q1', kind: 'input', source: 'enonce', tags: ['ldp'],
      prompt: 'Quelle commande affiche les adjacences LDP ?',
      accept: ['show mpls ldp neighbor', 'sh mpls ldp neighbor', 'show mpls ldp neighbors'],
      explain: 'show mpls ldp neighbor vérifie que les adjacences ont été formées.',
    },
    {
      id: 'q2', kind: 'single', source: 'enonce', tags: ['lib-lfib'],
      prompt: 'Quelle commande affiche la LFIB ?',
      options: ['show mpls ldp bindings', 'show mpls forwarding-table', 'show mpls interfaces', 'show ip route'],
      answer: 1,
      explain: 'show mpls forwarding-table → LFIB ; show mpls ldp bindings → LIB.',
    },
    {
      id: 'q3', kind: 'single', source: 'derive', tags: ['lib-lfib'],
      prompt: 'Quelle table contient aussi les labels reçus de voisins non utilisés pour commuter ?',
      options: ['La LFIB', 'La LIB', 'La table de routage', 'La table ARP'],
      answer: 1,
      explain: 'La LIB stocke toutes les associations reçues ; la LFIB ne garde que celles du prochain saut retenu.',
    },
    {
      id: 'q4', kind: 'single', source: 'enonce', tags: ['ldp'],
      prompt: 'Pourquoi forcer le router-ID LDP sur la loopback 0 ?',
      options: ['Pour chiffrer LDP', 'Pour que l’ID reste inchangé malgré les changements de topologie et redémarrages', 'Parce que LDP refuse les interfaces série', 'Pour économiser des labels'],
      answer: 1,
      explain: "C'est la justification donnée par l'énoncé : un ID stable.",
    },
    {
      id: 'q5', kind: 'single', source: 'derive', tags: ['php'],
      prompt: 'Dans la LFIB de SP3, que signifie « Pop Label » pour 2.2.2.0/25 ?',
      options: ['Le paquet est rejeté', 'SP3 retire le label avant d’envoyer à SP2, qui est la destination', 'SP3 ajoute deux labels', 'LDP est en panne'],
      answer: 1,
      explain: 'SP2 a annoncé implicit-null pour son propre réseau : l’avant-dernier saut retire le label (PHP).',
    },
    {
      id: 'q6', kind: 'multi', source: 'derive', tags: ['mpls-interfaces'],
      prompt: 'Sur quelles interfaces faut-il taper « mpls ip » ?',
      options: ['SP1 s1/2', 'SP1 s1/1 (vers SIEGE)', 'SP2 s1/2 et s1/3', 'SP3 s1/3', 'AGENCE s1/1'],
      answers: [0, 2, 3],
      explain: 'Uniquement les interfaces physiques du domaine MPLS (entre SP1, SP2 et SP3).',
    },
    {
      id: 'q7', kind: 'single', source: 'enonce', tags: ['lib-lfib'],
      prompt: 'Pour 1.1.1.0/25, quel label local SP1 annonce-t-il à ses voisins ?',
      options: ['Un label numérique ≥ 16', 'implicit-null (imp-null), car le réseau lui est directement connecté', 'Aucun label', 'Le label 0 explicite'],
      answer: 1,
      explain: "Un routeur annonce imp-null pour ses réseaux connectés. Les labels numériques choisis par SP2 et SP3 dépendent de l'exécution : relevez-les sur votre maquette.",
    },
  ],
  compare: [
    {
      id: 'cmp-ldp-id',
      title: 'Router-ID LDP automatique ou forcé',
      context: 'Le router-ID LDP identifie le routeur dans les sessions LDP.',
      wrong: {
        config: '! aucune commande mpls ldp router-id',
        result: "L'ID est choisi automatiquement ; il peut changer au gré des changements de topologie ou des redémarrages.",
      },
      right: {
        config: 'mpls ldp router-id loopback0 force',
        result: "L'ID LDP est l'adresse de Loopback0 et reste stable.",
      },
      lesson: 'Forcer le router-ID LDP sur une loopback garantit des identifiants stables.',
      challenge: {
        symptom: 'show mpls ldp neighbor affiche un identifiant LDP qui n’est pas la loopback du voisin.',
        options: ['Ajouter mpls ldp router-id loopback0 force sur le voisin', 'Retirer mpls ip', 'Changer l’aire OSPF', 'Ajouter ip ospf network point-to-point'],
        answer: 0,
      },
    },
    {
      id: 'cmp-mpls-ip',
      title: 'Interface oubliée lors de l’activation MPLS',
      context: 'SP2 a deux liens dans le backbone.',
      wrong: {
        config: 'interface serial1/2\n mpls ip\n! s1/3 sans mpls ip',
        result: 'Pas d’adjacence LDP entre SP2 et SP3 : pas de labels échangés sur ce lien.',
      },
      right: {
        config: 'interface serial1/2\n mpls ip\ninterface serial1/3\n mpls ip',
        result: 'SP2 voit SP1 et SP3 comme voisins LDP.',
      },
      lesson: 'MPLS doit être activé sur toutes les interfaces physiques du domaine.',
      challenge: {
        symptom: 'show mpls ldp neighbor sur SP2 ne montre que 1.1.1.1.',
        options: ['Activer mpls ip sur s1/3 de SP2 (et s1/3 de SP3)', 'Changer le router-ID OSPF', 'Activer mpls ip vers SIEGE', 'Effacer la LIB'],
        answer: 0,
      },
    },
  ],
  sims: ['label-table'],
  ap: {
    file: 'sims/mpls-backbone-p2/index.html',
    scenes: ['Introduction et objectifs', 'Rappel push / swap / pop', 'mpls ldp router-id sur les 3 routeurs', 'mpls ip par interface + message LDP', 'show mpls ldp neighbor annoté', 'LIB vs LFIB sur SP3 (zones cliquables)', 'Exercice : labels de 1.1.1.0/25', 'Quiz et score'],
  },
  sources: [{ label: 'Énoncé TP1 – Partie II', file: 'docs/tp1-mpls-partie2.pdf' }],
  notes: [
    "L'énoncé demande les labels de 1.1.1.0/25 « sur papier » : les valeurs dépendent de votre exécution. Les numéros affichés ici sont illustratifs ; seule la structure (imp-null, Pop Label, swap) est générale.",
    "L'énoncé écrit « mpls ldp router-id interface force » : interface est à remplacer par loopback0.",
  ],
  glossary: ['mpls', 'label', 'ldp', 'lsp', 'lib', 'lfib', 'php', 'router-id'],
};

export default tp;

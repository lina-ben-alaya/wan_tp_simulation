import type { Tp } from '../types';

const tp: Tp = {
  slug: 'redistribution',
  order: 5,
  code: 'TP Redistribution',
  title: 'Redistribution OSPF / EIGRP / RIPv2',
  subtitle: 'Faire communiquer trois domaines de routage et maîtriser la distance administrative',
  subject: 'routage',
  theme: 'routage',
  level: 3,
  duration: 75,
  tools: ['GNS3'],
  equipment: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
  fidelity: 'reconstitue',
  summary:
    "Trois domaines de routage (OSPF, EIGRP, RIPv2) doivent échanger leurs routes. On redistribue entre protocoles, on interprète les routes externes, puis on corrige un choix de route faussé par la distance administrative.",
  scenario:
    "Le réseau comprend un domaine OSPF (R1, R2, R3), un domaine EIGRP 1 (R2, R3, R4, R5) et un domaine RIPv2 (R5, R6). Les routeurs de frontière (R2, R3, R5) doivent redistribuer les routes pour que tous les réseaux soient joignables.",
  objectives: [
    'Configurer OSPF, EIGRP et RIPv2 et vérifier la propagation dans chaque domaine',
    'Redistribuer OSPF ↔ EIGRP sur R2 et R3, RIP ↔ EIGRP sur R5',
    'Comprendre la métrique de redistribution, le mot-clé subnets et metric-type',
    'Identifier un routage sous-optimal causé par la distance administrative et le corriger',
  ],
  prerequisites: [],
  topology: {
    width: 800,
    height: 440,
    caption: 'Adresses d’interface = réseau du lien + ID du routeur (ex. R3 S0/1 : 10.0.34.3/24)',
    zones: [
      { label: 'OSPF – Area 0', x: 24, y: 40, w: 330, h: 370, tone: 'ok' },
      { label: 'EIGRP 1', x: 250, y: 220, w: 330, h: 190, tone: 'routage' },
      { label: 'EIGRP 1', x: 250, y: 40, w: 330, h: 150, tone: 'routage' },
      { label: 'RIPv2', x: 450, y: 24, w: 330, h: 140, tone: 'warn' },
    ],
    nodes: [
      { id: 'R1', kind: 'router', x: 110, y: 225, role: 'OSPF', info: ['Loopbacks 172.16.30-33.0/24', '10.0.12.1 / 10.0.13.1'] },
      { id: 'R2', kind: 'router', x: 300, y: 110, role: 'OSPF + EIGRP', info: ['10.0.12.2 (OSPF)', '10.0.25.2 (EIGRP)'] },
      { id: 'R3', kind: 'router', x: 300, y: 340, role: 'OSPF + EIGRP', info: ['10.0.13.3 (OSPF)', '10.0.34.3 (EIGRP)'] },
      { id: 'R4', kind: 'router', x: 520, y: 340, role: 'EIGRP', info: ['Loopbacks 172.16.20-23.0/24', '10.0.34.4 / 10.0.45.4'] },
      { id: 'R5', kind: 'router', x: 520, y: 110, role: 'EIGRP + RIP', info: ['10.0.25.5 / 10.0.45.5 (EIGRP)', '10.0.56.5 (RIP)'] },
      { id: 'R6', kind: 'router', x: 710, y: 110, role: 'RIP', info: ['10.0.56.6', 'Réseaux 172.16.0.0 (ex. 172.16.10.0/24)'] },
    ],
    links: [
      { a: 'R1', b: 'R2', label: '10.0.12.0/24', kind: 'serial' },
      { a: 'R1', b: 'R3', label: '10.0.13.0/24', kind: 'serial' },
      { a: 'R2', b: 'R5', label: '10.0.25.0/24', kind: 'serial' },
      { a: 'R3', b: 'R4', label: '10.0.34.0/24', kind: 'serial' },
      { a: 'R4', b: 'R5', label: '10.0.45.0/24', kind: 'serial' },
      { a: 'R5', b: 'R6', label: '10.0.56.0/24', kind: 'serial' },
    ],
  },
  learn: [
    {
      title: 'Pourquoi redistribuer ?',
      body: [
        'Chaque protocole de routage ne connaît que les routes de son propre domaine. Un routeur placé à la frontière exécute deux protocoles : la redistribution lui fait injecter les routes de l’un dans l’autre.',
        'Ici, R2 et R3 sont à la frontière OSPF/EIGRP, R5 à la frontière EIGRP/RIP.',
      ],
    },
    {
      title: 'La métrique : obligatoire vers EIGRP et RIP',
      body: [
        "Chaque protocole a sa propre métrique : un coût OSPF n'a pas de sens pour EIGRP. Lors d'une redistribution vers EIGRP (de même pour RIP), il est très important de spécifier la métrique : sans métrique choisie, les routes sont annoncées avec une métrique infinie, donc inutilisables.",
        'Une fois redistribuées dans EIGRP, les routes apparaissent avec le préfixe EX : ce sont des routes externes.',
      ],
      code: 'R2(config)# router eigrp 1\nR2(config-router)# redistribute ospf 1 metric <bande passante> <délai> <fiabilité> <charge> <MTU>',
    },
    {
      title: 'Vers OSPF : subnets et metric-type',
      body: [
        'Le mot-clé subnets permet de redistribuer les sous-réseaux. Sans lui, OSPF ne redistribue que les réseaux par classe.',
        'Sans métrique explicite, OSPF utilise une métrique de 20 pour les routes redistribuées.',
      ],
      points: [
        'metric-type 1 (E1) : la métrique augmente à chaque routeur qui annonce la route',
        'metric-type 2 (E2) : la métrique reste la même (tous les routeurs voient 50 si metric 50)',
      ],
    },
    {
      title: 'Le piège de la distance administrative',
      body: [
        "Quand un routeur connaît le même réseau par deux protocoles, il retient la route de plus petite distance administrative (DA), sans comparer les métriques. OSPF = 110, EIGRP interne = 90, EIGRP externe = 170.",
        "R3 doit joindre 172.16.10.0/24 (domaine RIP). Il a le choix entre la route OSPF externe via R1 (DA 110) et la route EIGRP externe par le domaine EIGRP (DA 170). Il choisit R1 et traverse trois domaines au lieu de deux : la redistribution a faussé le choix.",
      ],
      code: 'R3(config)# router eigrp 1\nR3(config-router)# distance eigrp 90 105',
      callout: { tone: 'tip', text: 'distance eigrp 90 105 : routes EIGRP internes à 90, externes à 105 (< 110) → R3 préfère désormais le chemin EIGRP.' },
    },
  ],
  steps: [
    {
      id: 'ospf-r1', device: 'R1', title: 'OSPF sur R1', goal: 'Router-ID 1.1.1.1, loopbacks et liens en Area 0.',
      commands: [
        { prompt: 'R1(config)#', cmd: 'router ospf 1' },
        { prompt: 'R1(config-router)#', cmd: 'router-id 1.1.1.1' },
        { prompt: 'R1(config-router)#', cmd: 'network 172.16.30.0 0.0.0.255 area 0' },
        { prompt: 'R1(config-router)#', cmd: 'network 10.0.12.0 0.0.0.255 area 0' },
        { prompt: 'R1(config-router)#', cmd: 'network 10.0.13.0 0.0.0.255 area 0' },
      ],
      explain: "L'énoncé annonce aussi 172.16.31.0, 172.16.32.0 et 172.16.33.0 (même syntaxe). R2 et R3 annoncent ensuite 10.0.12.0 et 10.0.13.0.",
      hint: 'router ospf 1, router-id, puis network … 0.0.0.255 area 0',
    },
    {
      id: 'eigrp-r4', device: 'R4', title: 'EIGRP sur R4', goal: 'Annoncer les liens et les loopbacks de R4.',
      commands: [
        { prompt: 'R4(config)#', cmd: 'router eigrp 1' },
        { prompt: 'R4(config-router)#', cmd: 'no auto-summary' },
        { prompt: 'R4(config-router)#', cmd: 'network 10.0.34.0 0.0.0.255' },
        { prompt: 'R4(config-router)#', cmd: 'network 10.0.45.0 0.0.0.255' },
        { prompt: 'R4(config-router)#', cmd: 'network 172.16.20.0 0.0.0.255' },
      ],
      explain: 'Puis 172.16.21-23.0 de la même façon. R2 (10.0.25.0), R3 (10.0.34.0) et R5 (10.0.25.0, 10.0.45.0) rejoignent EIGRP 1.',
      hint: 'router eigrp 1, no auto-summary, network …',
    },
    {
      id: 'rip-r6', device: 'R6', title: 'RIPv2 sur R6', goal: 'Domaine RIP entre R5 et R6.',
      commands: [
        { prompt: 'R6(config)#', cmd: 'router rip' },
        { prompt: 'R6(config-router)#', cmd: 'version 2' },
        { prompt: 'R6(config-router)#', cmd: 'network 10.0.56.0' },
        { prompt: 'R6(config-router)#', cmd: 'network 172.16.0.0' },
      ],
      explain: 'RIP annonce par réseau de classe (172.16.0.0). R5 annonce 10.0.56.0. Vérifiez ensuite la propagation : show ip route sur R3, R5 et R2.',
      hint: 'router rip, version 2, network …',
    },
    {
      id: 'redis-ospf-eigrp', device: 'R2', title: 'Redistribuer OSPF dans EIGRP', goal: 'Les routes OSPF doivent apparaître dans le domaine EIGRP.',
      commands: [
        { prompt: 'R2(config)#', cmd: 'router eigrp 1' },
        { prompt: 'R2(config-router)#', cmd: 'redistribute ospf 1 metric 10000 100 255 1 1500', alt: ['redistribute ospf 1 metric {n} {n} {n} {n} {n}'] },
      ],
      explain: "Attention à se placer dans le processus EIGRP. Les 5 valeurs (bande passante, délai, fiabilité, charge, MTU) figurent dans une capture de l'énoncé : toute métrique explicite est acceptée ici. Faites de même sur R3, puis vérifiez sur R4 les routes D EX.",
      hint: 'Dans router eigrp 1 : redistribute ospf 1 metric suivi de 5 valeurs.',
    },
    {
      id: 'verif-r4', device: 'R4', title: 'Vérifier sur R4', goal: 'Repérer les routes externes.',
      commands: [{ prompt: 'R4#', cmd: 'show ip route' }],
      output: 'D EX    172.16.30.0/24 [170/…] via 10.0.34.3, Serial0/1\nD EX    10.0.12.0/24 [170/…] via 10.0.45.5, Serial0/0\n…',
      outputFidelity: 'reconstitue',
      explain: 'EX = routes externes, importées dans EIGRP. Leur distance administrative est 170.',
      hint: 'show ip route',
    },
    {
      id: 'redis-eigrp-ospf', device: 'R2', title: 'Redistribuer EIGRP dans OSPF', goal: 'R1 doit connaître les réseaux EIGRP (dont les sous-réseaux).',
      commands: [
        { prompt: 'R2(config)#', cmd: 'router ospf 1' },
        { prompt: 'R2(config-router)#', cmd: 'redistribute eigrp 1 subnets metric 50 metric-type 1', alt: ['redistribute eigrp 1 subnets metric 50 metric-type 2', 'redistribute eigrp 1 metric 50 metric-type 1 subnets', 'redistribute eigrp 1 metric 50 metric-type 2 subnets'] },
      ],
      explain: "subnets inclut les sous-réseaux ; metric 50 et metric-type (1 ou 2) suivent l'explication de l'énoncé. Même chose sur R3, puis show ip route sur R1.",
      hint: 'redistribute eigrp 1 subnets metric 50 metric-type …',
    },
    {
      id: 'redis-rip', device: 'R5', title: 'RIP ↔ EIGRP sur R5', goal: 'Terminer par la frontière RIP.',
      commands: [
        { prompt: 'R5(config)#', cmd: 'router rip' },
        { prompt: 'R5(config-router)#', cmd: 'redistribute eigrp 1 metric 3', alt: ['redistribute eigrp 1 metric {n}'] },
        { prompt: 'R5(config-router)#', cmd: 'router eigrp 1' },
        { prompt: 'R5(config-router)#', cmd: 'redistribute rip metric 10000 100 255 1 1500', alt: ['redistribute rip metric {n} {n} {n} {n} {n}'] },
      ],
      explain: 'Vers RIP, la métrique est un nombre de sauts (1 à 15). Vérifiez que R6 connaît toutes les routes, puis faites des pings vers les réseaux distants.',
      hint: 'Dans RIP : redistribute eigrp 1 metric <sauts> ; dans EIGRP : redistribute rip metric <5 valeurs>.',
    },
    {
      id: 'da-fix', device: 'R3', title: 'Corriger la distance administrative', goal: 'R3 doit préférer le chemin EIGRP vers 172.16.10.0/24.',
      commands: [
        { prompt: 'R3(config)#', cmd: 'router eigrp 1' },
        { prompt: 'R3(config-router)#', cmd: 'distance eigrp 90 105' },
      ],
      output: 'D EX    172.16.10.0/24 [105/…] via 10.0.34.4, Serial0/1',
      outputFidelity: 'reconstitue',
      explain: 'Les routes EIGRP externes passent de 170 à 105, en dessous des 110 d’OSPF : R3 n’envoie plus ce trafic vers R1.',
      hint: 'distance eigrp <interne> <externe>',
    },
  ],
  quiz: [
    { id: 'q1', kind: 'single', source: 'enonce', tags: ['metrique-redistribution'], prompt: 'Que se passe-t-il si l’on redistribue dans EIGRP sans spécifier de métrique ?', options: ['La métrique OSPF est conservée', 'Les routes sont annoncées avec une métrique infinie', 'EIGRP calcule automatiquement la métrique', 'La redistribution est refusée'], answer: 1, explain: 'Sans métrique, les routes sont annoncées avec une métrique infinie (de même pour RIP).' },
    { id: 'q2', kind: 'input', source: 'enonce', tags: ['routes-externes'], prompt: 'Quel préfixe EIGRP marque une route redistribuée (externe) dans show ip route ?', accept: ['EX', 'D EX'], explain: 'D EX : route EIGRP externe.' },
    { id: 'q3', kind: 'single', source: 'enonce', tags: ['subnets'], prompt: 'Rôle du mot-clé subnets dans redistribute eigrp 1 subnets ?', options: ['Chiffrer les routes', 'Redistribuer aussi les sous-réseaux', 'Limiter à 10 routes', 'Activer RIPv2'], answer: 1, explain: 'Sans subnets, OSPF ne redistribue que les routes vers les réseaux par classe.' },
    { id: 'q4', kind: 'input', source: 'enonce', tags: ['metrique-redistribution'], prompt: 'Quelle métrique OSPF utilise-t-il par défaut pour des routes redistribuées depuis EIGRP ?', accept: ['20'], explain: 'Sans métrique, OSPF utilise 20.' },
    { id: 'q5', kind: 'single', source: 'enonce', tags: ['metric-type'], prompt: 'Avec metric-type 2 et metric 50, quelle métrique voit un routeur à trois sauts ?', options: ['50', '50 + coût des liens', '150', '20'], answer: 0, explain: 'Type 2 : la métrique ne grandit pas après la redistribution.' },
    { id: 'q6', kind: 'single', source: 'enonce', tags: ['distance-administrative'], prompt: 'Pourquoi R3 passe-t-il par R1 pour joindre 172.16.10.0/24 ?', options: ['Le lien vers R4 est plus lent', 'La route OSPF (DA 110) est préférée à la route EIGRP externe (DA 170)', 'OSPF a une meilleure métrique', 'RIP est désactivé'], answer: 1, explain: 'La DA est comparée avant la métrique : 110 < 170.' },
    { id: 'q7', kind: 'single', source: 'enonce', tags: ['distance-administrative'], prompt: 'Après « distance eigrp 90 105 » sur R3, quelle route est retenue ?', options: ['Toujours celle via R1', 'La route EIGRP externe (DA 105 < 110)', 'Aucune', 'Une route statique'], answer: 1, explain: '105 < 110 : le chemin EIGRP devient le meilleur.' },
    { id: 'q8', kind: 'multi', source: 'derive', tags: ['routeurs-frontiere'], prompt: 'Quels routeurs effectuent une redistribution ?', options: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'], answers: [1, 2, 4], explain: 'R2, R3 (OSPF/EIGRP) et R5 (EIGRP/RIP).' },
    { id: 'q9', kind: 'single', source: 'derive', tags: ['distance-administrative'], prompt: 'Quelle est la DA par défaut d’une route EIGRP interne ?', options: ['90', '110', '120', '170'], answer: 0, explain: 'EIGRP interne 90, OSPF 110, RIP 120, EIGRP externe 170.' },
  ],
  compare: [
    {
      id: 'cmp-no-metric', title: 'Redistribution dans EIGRP sans métrique', context: 'R2 redistribue OSPF dans EIGRP.',
      wrong: { config: 'router eigrp 1\n redistribute ospf 1', result: 'Routes annoncées avec une métrique infinie : R4 ne les installe pas.' },
      right: { config: 'router eigrp 1\n redistribute ospf 1 metric 10000 100 255 1 1500', result: 'R4 voit les routes OSPF en D EX.' },
      lesson: 'Vers EIGRP et RIP, spécifiez toujours la métrique.',
      challenge: { symptom: 'La redistribution est configurée sur R2, mais R4 ne voit aucune route D EX.', options: ['Ajouter une métrique explicite à redistribute ospf 1', 'Ajouter subnets', 'Changer le router-ID', 'Passer en metric-type 1'], answer: 0 },
    },
    {
      id: 'cmp-subnets', title: 'Redistribution dans OSPF sans subnets', context: 'R2 redistribue EIGRP dans OSPF.',
      wrong: { config: 'router ospf 1\n redistribute eigrp 1 metric 50', result: 'Seuls les réseaux par classe sont redistribués : les sous-réseaux (10.0.x.0/24, 172.16.x.0/24) manquent sur R1.' },
      right: { config: 'router ospf 1\n redistribute eigrp 1 subnets metric 50', result: 'R1 connaît les sous-réseaux EIGRP.' },
      lesson: 'subnets est indispensable pour redistribuer des sous-réseaux dans OSPF.',
      challenge: { symptom: 'R1 ne voit aucun des sous-réseaux /24 du domaine EIGRP.', options: ['Ajouter le mot-clé subnets', 'Ajouter une métrique EIGRP', 'Changer la DA', 'Activer RIP sur R1'], answer: 0 },
    },
    {
      id: 'cmp-da', title: 'Distance administrative par défaut ou ajustée', context: 'R3 vers 172.16.10.0/24.',
      wrong: { config: 'router eigrp 1\n! DA par défaut : interne 90, externe 170', result: 'R3 passe par R1 (OSPF, 110) : trois domaines traversés.' },
      right: { config: 'router eigrp 1\n distance eigrp 90 105', result: 'R3 passe par le domaine EIGRP (105) : deux domaines traversés.' },
      lesson: 'La DA prime sur la métrique ; elle peut être ajustée pour corriger un choix faussé par la redistribution.',
      challenge: { symptom: 'R3 envoie le trafic vers 172.16.10.0/24 à R1 alors que le chemin par R4 est plus court.', options: ['distance eigrp 90 105 sur R3', 'Augmenter le coût OSPF de R1', 'Supprimer la redistribution sur R5', 'Passer RIP en version 1'], answer: 0 },
    },
  ],
  sims: ['admin-distance'],
  ap: {
    file: 'sims/redistribution/index.html',
    scenes: ['Introduction', 'Carte des trois domaines', 'Configuration de base (accélérée)', 'OSPF → EIGRP et routes D EX', 'EIGRP → OSPF : subnets et metric-type', 'RIP ↔ EIGRP et table de R6', 'Problème : table de R3', 'distance eigrp 90 105', 'Quiz et score'],
  },
  sources: [{ label: 'Énoncé – Redistribution OSPF/RIPv2/EIGRP', file: 'docs/tp-redistribution.pdf' }],
  notes: [
    "Les commandes de redistribution exactes (et leurs métriques) ne figurent que dans des captures d'écran de l'énoncé : les métriques affichées sont reconstituées et toute métrique explicite est acceptée en mode Pratiquer.",
    "L'énoncé parle d'un « NextHop R5 » pour R3 ; dans la topologie, R3 rejoint le domaine EIGRP par R4 (puis R5). La plateforme indique « via le domaine EIGRP ».",
  ],
  glossary: ['redistribution', 'distance-administrative', 'ospf', 'eigrp', 'rip', 'metric-type', 'route-externe'],
};

export default tp;

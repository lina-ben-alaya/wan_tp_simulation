import type { Tp } from '../types';

const tp: Tp = {
  slug: 'vpn-ipsec',
  order: 7,
  code: 'TP VPN IPsec',
  title: 'VPN IPsec site à site',
  subtitle: 'IKE phase 1 et phase 2, transform-set, crypto map',
  subject: 'tech-wan',
  theme: 'vpn',
  level: 2,
  duration: 60,
  tools: ['GNS3', 'Cisco 7200', 'Wireshark'],
  equipment: ['R1', 'R2', 'R3', 'PC-A', 'PC-C'],
  fidelity: 'reconstitue',
  summary:
    "Chiffrer le trafic entre les LAN 192.168.1.0/24 et 192.168.3.0/24 qui traverse R2 : activation d'ISAKMP, paramètres IKE phase 1 et phase 2, ACL du trafic à protéger, crypto map, puis observation des compteurs et des paquets ESP.",
  scenario:
    "Deux sites, derrière R1 et R3, communiquent à travers R2 (le réseau intermédiaire). Le trafic entre PC-A et PC-C doit être protégé par un tunnel IPsec établi entre R1 et R3.",
  objectives: [
    'Configurer l’adressage et le routage statique, tester PC-A ↔ PC-C',
    'Activer ISAKMP et définir la politique IKE phase 1 (AES, SHA-1, pre-share, DH 2)',
    'Définir la phase 2 : transform-set VPN-SET, ACL 110, crypto map VPN-MAP',
    'Appliquer la crypto map sur l’interface de sortie',
    'Observer show crypto ipsec sa avant et après du trafic utile, et les en-têtes sous Wireshark',
  ],
  prerequisites: [],
  topology: {
    width: 800,
    height: 440,
    caption: 'Tunnel IPsec entre R1 et R3 à travers R2',
    zones: [{ label: 'Tunnel IPsec (ESP)', x: 140, y: 140, w: 520, h: 120, tone: 'vpn' }],
    nodes: [
      { id: 'PC-A', kind: 'pc', x: 60, y: 320, info: ['192.168.1.3/24', 'Passerelle : 192.168.1.1'] },
      { id: 'R1', kind: 'router', x: 200, y: 200, role: 'Extrémité VPN', info: ['Fa0/0 : 192.168.1.1/24', 'S0/0/0 : 10.1.1.2/30 (voir notes)'] },
      { id: 'R2', kind: 'router', x: 400, y: 200, role: 'Transit', info: ['S0/0/0 : 10.1.1.1/30', 'S0/0/1 : 10.2.2.1/30'] },
      { id: 'R3', kind: 'router', x: 600, y: 200, role: 'Extrémité VPN', info: ['Fa0/0 : 192.168.3.1/24', 'S0/0/1 : 10.2.2.2/30 (voir notes)'] },
      { id: 'PC-C', kind: 'pc', x: 740, y: 320, info: ['192.168.3.3/24', 'Passerelle : 192.168.3.1'] },
    ],
    links: [
      { a: 'PC-A', b: 'R1', label: '192.168.1.0/24', kind: 'ethernet' },
      { a: 'R1', b: 'R2', label: '10.1.1.0/30', kind: 'serial' },
      { a: 'R2', b: 'R3', label: '10.2.2.0/30', kind: 'serial' },
      { a: 'R3', b: 'PC-C', label: '192.168.3.0/24', kind: 'ethernet' },
    ],
  },
  learn: [
    {
      title: 'IPsec en deux phases',
      body: [
        "ISAKMP (Internet Security Association and Key Management Protocol) est utilisé par IKE (Internet Key Exchange) pour sécuriser le trafic IP via IPsec ; son activation est obligatoire.",
        'Phase 1 (IKE) : les deux routeurs s’authentifient et créent un canal sûr. Les deux pairs doivent avoir une politique aux paramètres identiques.',
        'Phase 2 (IPsec) : on négocie la protection du trafic utile (transform-set) et on désigne ce trafic (ACL).',
      ],
    },
    {
      title: 'Paramètres de la phase 1',
      body: ['Valeurs du TP (les autres sont les valeurs par défaut) :'],
      points: ['Distribution des clés : ISAKMP', 'Chiffrement : AES', 'Hachage : SHA-1 (défaut)', 'Authentification : pre-share, clé « cisco »', 'Échange de clés : Diffie-Hellman groupe 2', 'Durée de vie IKE SA : 86400 s (défaut)'],
      code: 'crypto isakmp policy 10\n encryption aes\n authentication pre-share\n group 2\ncrypto isakmp key cisco address <pair>',
    },
    {
      title: 'Paramètres de la phase 2',
      body: [
        "Le transform-set VPN-SET protège les données avec esp-3des (chiffrement) et esp-sha-hmac (intégrité). L'ACL 110 désigne le trafic à chiffrer (LAN local → LAN distant). La crypto map VPN-MAP relie le tout : pair, transform-set, ACL ; on l'applique sur l'interface de sortie.",
      ],
      code: 'crypto map VPN-MAP 10 ipsec-isakmp\n set peer <pair>\n set transform-set VPN-SET\n match address 110',
      callout: { tone: 'tip', text: "Le tunnel ne s'établit qu'à l'arrivée de trafic correspondant à l'ACL : avant le premier ping, les compteurs de show crypto ipsec sa sont à 0." },
    },
  ],
  steps: [
    {
      id: 'isakmp', device: 'R1', title: 'Activer ISAKMP', goal: 'Prérequis à IKE.',
      commands: [{ prompt: 'R1(config)#', cmd: 'crypto isakmp enable' }],
      explain: 'Pareil pour R3.',
      hint: 'crypto isakmp enable',
    },
    {
      id: 'acl', device: 'R1', title: 'ACL du trafic à chiffrer', goal: 'Désigner le trafic LAN 1 → LAN 3.',
      commands: [{ prompt: 'R1(config)#', cmd: 'access-list 110 permit ip 192.168.1.0 0.0.0.255 192.168.3.0 0.0.0.255' }],
      explain: "Sur R3, l'ACL est le miroir : 192.168.3.0 → 192.168.1.0.",
      hint: 'access-list 110 permit ip <source> <wildcard> <destination> <wildcard>',
    },
    {
      id: 'phase1', device: 'R1', title: 'Politique IKE phase 1', goal: 'AES, pre-share, groupe DH 2, clé partagée.',
      commands: [
        { prompt: 'R1(config)#', cmd: 'crypto isakmp policy 10' },
        { prompt: 'R1(config-isakmp)#', cmd: 'encryption aes' },
        { prompt: 'R1(config-isakmp)#', cmd: 'authentication pre-share' },
        { prompt: 'R1(config-isakmp)#', cmd: 'group 2' },
        { prompt: 'R1(config-isakmp)#', cmd: 'exit' },
        { prompt: 'R1(config)#', cmd: 'crypto isakmp key cisco address 10.2.2.2' },
      ],
      explain: 'La clé « cisco » est associée à l’adresse du pair (R3). Hachage SHA-1 et durée 86400 s : valeurs par défaut, non saisies.',
      hint: 'crypto isakmp policy 10, puis encryption, authentication, group ; enfin la clé.',
    },
    {
      id: 'phase2', device: 'R1', title: 'Transform-set et crypto map', goal: 'Phase 2 : protection et association.',
      commands: [
        { prompt: 'R1(config)#', cmd: 'crypto ipsec transform-set VPN-SET esp-3des esp-sha-hmac' },
        { prompt: 'R1(cfg-crypto-trans)#', cmd: 'exit' },
        { prompt: 'R1(config)#', cmd: 'crypto map VPN-MAP 10 ipsec-isakmp' },
        { prompt: 'R1(config-crypto-map)#', cmd: 'description VPN connection to R3' },
        { prompt: 'R1(config-crypto-map)#', cmd: 'set peer 10.2.2.2' },
        { prompt: 'R1(config-crypto-map)#', cmd: 'set transform-set VPN-SET' },
        { prompt: 'R1(config-crypto-map)#', cmd: 'match address 110' },
      ],
      explain: 'La crypto map relie pair, transform-set et ACL. Sur R3 : set peer 10.1.1.2, description « VPN connection to R1 ».',
      hint: 'crypto map VPN-MAP 10 ipsec-isakmp puis set peer / set transform-set / match address.',
    },
    {
      id: 'apply', device: 'R1', title: 'Appliquer la crypto map', goal: 'Sur l’interface de sortie (entrée du tunnel).',
      commands: [
        { prompt: 'R1(config)#', cmd: 'interface serial0/0/0' },
        { prompt: 'R1(config-if)#', cmd: 'crypto map VPN-MAP' },
      ],
      output: '%CRYPTO-6-ISAKMP_ON_OFF: ISAKMP is ON',
      outputFidelity: 'reconstitue',
      explain: 'Sur R3, la crypto map est appliquée sur S0/0/1.',
      hint: 'crypto map <nom> en mode interface.',
    },
    {
      id: 'sa-before', device: 'R1', title: 'État du tunnel avant trafic', goal: 'Observer les compteurs.',
      commands: [{ prompt: 'R1#', cmd: 'show crypto ipsec sa' }],
      output: 'interface: Serial0/0/0\n    Crypto map tag: VPN-MAP, local addr 10.1.1.2\n   local  ident (addr/mask/prot/port): (192.168.1.0/255.255.255.0/0/0)\n   remote ident (addr/mask/prot/port): (192.168.3.0/255.255.255.0/0/0)\n   current_peer 10.2.2.2 port 500\n    #pkts encaps: 0, #pkts encrypt: 0, #pkts digest: 0\n    #pkts decaps: 0, #pkts decrypt: 0, #pkts verify: 0',
      outputFidelity: 'reconstitue',
      explain: 'Aucun paquet n’a encore été chiffré : le tunnel attend du trafic « intéressant ».',
      hint: 'show crypto ipsec sa',
    },
    {
      id: 'sa-after', device: 'R1', title: 'État du tunnel après un ping PC-A → PC-C', goal: 'Les compteurs augmentent.',
      commands: [{ prompt: 'R1#', cmd: 'show crypto ipsec sa' }],
      output: '    #pkts encaps: 4, #pkts encrypt: 4, #pkts digest: 4\n    #pkts decaps: 4, #pkts decrypt: 4, #pkts verify: 4',
      outputFidelity: 'illustratif',
      explain: 'Le premier paquet peut être perdu pendant la négociation : les valeurs exactes dépendent de votre essai. Sous Wireshark : ISAKMP (UDP 500) puis ESP, avec les adresses des routeurs en clair et le contenu chiffré.',
      hint: 'show crypto ipsec sa',
    },
  ],
  quiz: [
    { id: 'q1', kind: 'single', source: 'enonce', tags: ['isakmp'], prompt: 'Pourquoi activer ISAKMP ?', options: ['Pour router les paquets', 'Il est utilisé par IKE pour sécuriser le trafic via IPsec', 'Pour la NAT', 'Pour créer l’ACL'], answer: 1, explain: 'ISAKMP est le cadre utilisé par IKE pour gérer les associations de sécurité et les clés.' },
    { id: 'q2', kind: 'single', source: 'enonce', tags: ['phase1'], prompt: 'Que doivent avoir en commun R1 et R3 en phase 1 ?', options: ['Le même hostname', 'Une politique avec les mêmes paramètres', 'La même ACL', 'Le même numéro de crypto map'], answer: 1, explain: 'Les deux pairs doivent avoir une stratégie identique.' },
    { id: 'q3', kind: 'multi', source: 'enonce', tags: ['phase1'], prompt: 'Quels paramètres de phase 1 sont configurés explicitement dans le TP (non par défaut) ?', options: ['encryption aes', 'hash sha', 'authentication pre-share', 'group 2', 'lifetime 86400'], answers: [0, 2, 3], explain: 'SHA-1 et 86400 s sont les valeurs par défaut.' },
    { id: 'q4', kind: 'input', source: 'enonce', tags: ['phase1'], prompt: 'Quelle est la clé pré-partagée du TP ?', accept: ['cisco'], explain: 'crypto isakmp key cisco address <pair>.' },
    { id: 'q5', kind: 'single', source: 'enonce', tags: ['phase2'], prompt: 'Que définit l’ACL 110 ?', options: ['Le trafic bloqué', 'Le trafic autorisé à passer (et chiffré) dans le tunnel IPsec', 'Les adresses NAT', 'Les voisins OSPF'], answer: 1, explain: 'Le trafic 192.168.1.0/24 ↔ 192.168.3.0/24.' },
    { id: 'q6', kind: 'single', source: 'derive', tags: ['phase2'], prompt: 'Dans « esp-3des esp-sha-hmac », que garantit esp-sha-hmac ?', options: ['Le chiffrement', 'L’intégrité et l’authentification des paquets', 'La compression', 'Le routage'], answer: 1, explain: '3DES chiffre ; SHA-HMAC authentifie et contrôle l’intégrité.' },
    { id: 'q7', kind: 'single', source: 'enonce', tags: ['sa-compteurs'], prompt: 'Avant tout ping, que valent les compteurs pkts encaps/encrypt ?', options: ['0', 'Le nombre de paquets ISAKMP', '100', 'Ils n’existent pas encore'], answer: 0, explain: 'Le tunnel ne chiffre que le trafic correspondant à l’ACL.' },
    { id: 'q8', kind: 'single', source: 'enonce', tags: ['wireshark-esp'], prompt: 'Sous Wireshark, sur le lien R1–R2, que voit-on du ping PC-A → PC-C ?', options: ['ICMP en clair de 192.168.1.3 vers 192.168.3.3', 'Des paquets ESP entre les routeurs, contenu chiffré', 'Rien', 'Des paquets GRE'], answer: 1, explain: 'L’en-tête IP externe porte les adresses des routeurs ; le paquet d’origine est chiffré dans ESP.' },
    { id: 'q9', kind: 'order', source: 'derive', tags: ['methodologie'], prompt: 'Ordonnez la configuration IPsec sur R1.', items: ['crypto isakmp enable', 'ACL 110 du trafic à chiffrer', 'Politique IKE phase 1 et clé', 'Transform-set (phase 2)', 'Crypto map', 'Application sur S0/0/0'], explain: 'Ordre de l’énoncé.' },
  ],
  compare: [
    {
      id: 'cmp-policy', title: 'Politiques de phase 1 différentes', context: 'R1 et R3 négocient IKE.',
      wrong: { config: 'R1: encryption aes / group 2\nR3: encryption 3des / group 5', result: 'Aucune politique commune : la phase 1 échoue, aucune SA n’est créée.' },
      right: { config: 'R1 et R3: encryption aes, authentication pre-share, group 2', result: 'Phase 1 négociée puis SA IPsec créées.' },
      lesson: 'Les deux pairs doivent avoir une politique ISAKMP aux paramètres identiques.',
      challenge: { symptom: 'Le ping PC-A → PC-C échoue et show crypto ipsec sa reste à 0 alors que la crypto map est appliquée des deux côtés.', options: ['Aligner les paramètres de la policy ISAKMP sur R1 et R3', 'Supprimer l’ACL 110', 'Retirer la route statique', 'Changer le nom du transform-set'], answer: 0 },
    },
    {
      id: 'cmp-map', title: 'Crypto map non appliquée', context: 'Toute la configuration est saisie sur R1.',
      wrong: { config: 'interface Serial0/0/0\n ! pas de crypto map', result: 'Le trafic passe en clair : rien ne déclenche IPsec.' },
      right: { config: 'interface Serial0/0/0\n crypto map VPN-MAP', result: 'Le trafic correspondant à l’ACL est chiffré.' },
      lesson: 'Une crypto map n’agit que lorsqu’elle est appliquée sur l’interface de sortie.',
      challenge: { symptom: 'Wireshark montre l’ICMP en clair entre R1 et R2.', options: ['Appliquer crypto map VPN-MAP sur S0/0/0', 'Changer la clé', 'Ajouter group 5', 'Ajouter une route'], answer: 0 },
    },
  ],
  sims: ['packet-ipsec'],
  ap: {
    file: 'https://brahimfatnass.github.io/simulations/tp4-vpn/',
    author: 'Brahim Fatnass',
    scenes: ['Introduction et topologie', 'Adressage, routage, ping initial', 'Tableau phase 1 à compléter (glisser-déposer)', 'Saisie phase 1 sur R1', 'Tableau phase 2', 'Transform-set, crypto map, ACL, application', 'R3 en mode accéléré', 'show crypto ipsec sa avant trafic', 'Ping et Wireshark : ISAKMP puis ESP', 'show crypto ipsec sa après', 'Quiz et score'],
  },
  sources: [{ label: 'Énoncé – TP VPN IPsec sous GNS3', file: 'docs/tp-vpn-ipsec.pdf' }],
  notes: [
    "Le tableau d'adressage de l'énoncé est désaligné dans le PDF. Pour rester cohérente avec les commandes de l'énoncé (R1 : set peer 10.2.2.2 ; R3 : set peer 10.1.1.2), la plateforme utilise R1 S0/0/0 = 10.1.1.2 et R3 S0/0/1 = 10.2.2.2, R2 portant 10.1.1.1 et 10.2.2.1. À vérifier avec votre maquette.",
  ],
  glossary: ['ipsec', 'isakmp', 'ike', 'sa', 'esp', 'transform-set', 'crypto-map', 'diffie-hellman', 'acl'],
};

export default tp;

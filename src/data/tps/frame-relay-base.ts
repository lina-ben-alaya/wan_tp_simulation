import type { Tp } from '../types';

const tp: Tp = {
  slug: 'frame-relay-base',
  order: 9,
  code: 'TP FR base',
  title: 'Frame Relay – configuration de base',
  subtitle: 'Encapsulation, PVC, LMI, Inverse ARP et mappage statique',
  subject: 'tech-wan',
  theme: 'frame-relay',
  level: 1,
  duration: 60,
  tools: ['GNS3', 'Wireshark'],
  equipment: ['Siege', 'Agence1', 'Agence2', 'FR1 (commutateur Frame Relay)'],
  fidelity: 'reconstitue',
  summary:
    "Relier un siège et deux agences par un nuage Frame Relay : encapsulation, lecture de l'état des PVC, analyse de la signalisation LMI et de l'Inverse ARP sous Wireshark, puis passage à un mappage statique IP ↔ DLCI.",
  scenario:
    "Le siège (DTE) est relié au commutateur Frame Relay FR1 (DCE), qui achemine des circuits virtuels permanents vers Agence 1 et Agence 2. Les interfaces série partagent le réseau 192.168.2.0/29.",
  objectives: [
    'Configurer l’encapsulation Frame Relay et activer les interfaces',
    'Interpréter show frame-relay pvc et show interfaces serial1/0',
    'Analyser le trafic LMI entre DTE et DCE',
    'Interpréter show frame-relay map et les messages Inverse ARP',
    'Remplacer le mappage dynamique par un mappage statique avec broadcast',
  ],
  prerequisites: [],
  topology: {
    width: 800,
    height: 440,
    caption: 'WAN Frame Relay 192.168.2.0/29',
    zones: [{ label: 'Nuage Frame Relay', x: 260, y: 140, w: 280, h: 170, tone: 'frame-relay' }],
    nodes: [
      { id: 'Siege', kind: 'router', x: 120, y: 225, role: 'DTE', info: ['S1/0 : 192.168.2.1/29', 'DLCI 16 → Agence1, 17 → Agence2 (hypothèse)'] },
      { id: 'FR1', kind: 'frswitch', x: 400, y: 225, role: 'DCE', info: ['Commutateur Frame Relay', 'Commute les PVC par port / DLCI'] },
      { id: 'Agence1', kind: 'router', x: 680, y: 120, role: 'DTE', info: ['S1/0 : 192.168.2.2/29'] },
      { id: 'Agence2', kind: 'router', x: 680, y: 330, role: 'DTE', info: ['S1/0 : 192.168.2.3/29'] },
    ],
    links: [
      { a: 'Siege', b: 'FR1', label: 'S1/0', kind: 'serial' },
      { a: 'FR1', b: 'Agence1', label: 'PVC', kind: 'serial' },
      { a: 'FR1', b: 'Agence2', label: 'PVC', kind: 'serial' },
    ],
  },
  learn: [
    {
      title: 'Frame Relay : PVC et DLCI',
      body: [
        "Frame Relay est une technologie WAN à commutation de trames. Les sites ne sont pas reliés par des câbles dédiés, mais par des circuits virtuels permanents (PVC) établis à travers le commutateur de l'opérateur.",
        "Chaque PVC est identifié localement par un DLCI (Data Link Connection Identifier). Le DLCI n'a de signification que sur la liaison entre le routeur et le commutateur.",
      ],
      points: ['DTE : équipement de l’abonné (les routeurs)', 'DCE : équipement de l’opérateur (FR1)', 'LMI : signalisation d’état entre DTE et DCE (keepalive, état des PVC)'],
    },
    {
      title: 'Inverse ARP',
      body: [
        "Le protocole de résolution d'adresse inverse (Inverse ARP) permet aux extrémités distantes d'une liaison Frame Relay de se découvrir dynamiquement : il associe une adresse IP à un DLCI.",
        "Une requête Inverse ARP est envoyée sur le circuit virtuel (DLCI 16) ; la réponse donne l'adresse logique correspondante (192.168.2.2).",
      ],
    },
    {
      title: 'Mappage statique et mot-clé broadcast',
      body: [
        "Malgré son utilité, l'Inverse ARP n'est pas toujours fiable. La bonne pratique consiste à mapper les adresses IP avec les DLCI de manière statique.",
        "Le mot-clé broadcast envoie sur le DLCI le trafic multidiffusion ou de diffusion destiné à cette liaison. La plupart des protocoles de routage en ont besoin pour fonctionner sur Frame Relay. Utilisé sur plusieurs DLCI d'une même interface, il réplique le trafic sur l'ensemble des PVC.",
      ],
      code: 'interface Serial1/0\n no frame-relay inverse-arp\n frame-relay map ip 192.168.2.2 16 broadcast',
      callout: { tone: 'tip', text: "On mappe l'adresse IP de l'extrémité DISTANTE au DLCI LOCAL." },
    },
  ],
  steps: [
    {
      id: 'encap', device: 'Siege', title: 'Encapsulation Frame Relay', goal: 'Configurer S1/0 et l’activer.',
      commands: [
        { prompt: 'Siege(config)#', cmd: 'interface s1/0' },
        { prompt: 'Siege(config-if)#', cmd: 'encapsulation frame-relay' },
        { prompt: 'Siege(config-if)#', cmd: 'no shutdown' },
      ],
      explain: "Même chose sur Agence 1 et Agence 2. Le commutateur FR1 doit avoir été configuré avec les PVC.",
      hint: 'encapsulation frame-relay puis no shutdown.',
    },
    {
      id: 'pvc', device: 'Siege', title: 'État des PVC', goal: 'Interpréter show frame-relay pvc.',
      commands: [{ prompt: 'Siege#', cmd: 'show frame-relay pvc' }],
      output: 'PVC Statistics for interface Serial1/0 (Frame Relay DTE)\n\n              Active     Inactive      Deleted       Static\n  Local          2            0            0            0\n\nDLCI = 16, DLCI USAGE = LOCAL, PVC STATUS = ACTIVE, INTERFACE = Serial1/0\nDLCI = 17, DLCI USAGE = LOCAL, PVC STATUS = ACTIVE, INTERFACE = Serial1/0',
      outputFidelity: 'reconstitue',
      explain: 'ACTIVE : le PVC est opérationnel de bout en bout (signalé par la LMI). INACTIVE : le DCE connaît le PVC mais l’extrémité distante est indisponible. DELETED : le DLCI n’est pas connu du commutateur.',
      hint: 'show frame-relay pvc',
    },
    {
      id: 'if', device: 'Siege', title: 'Interface série et LMI', goal: 'Lire l’encapsulation et les compteurs LMI.',
      commands: [{ prompt: 'Siege#', cmd: 'show interfaces serial1/0' }],
      output: 'Serial1/0 is up, line protocol is up\n  Encapsulation FRAME-RELAY, loopback not set\n  LMI enq sent  …, LMI stat recvd …, LMI upd recvd 0, DTE LMI up\n  LMI DLCI …  LMI type is …  frame relay DTE',
      outputFidelity: 'reconstitue',
      explain: "Les compteurs LMI enq sent / stat recvd montrent l'échange de signalisation avec FR1 : c'est ce trafic que vous capturez sous Wireshark entre Siege (DTE) et FR1 (DCE).",
      hint: 'show interfaces serial1/0',
    },
    {
      id: 'ip', device: 'Siege', title: 'Adressage du WAN', goal: 'Utiliser la plage 192.168.2.0/29.',
      commands: [
        { prompt: 'Siege(config)#', cmd: 'interface s1/0' },
        { prompt: 'Siege(config-if)#', cmd: 'ip address 192.168.2.1 255.255.255.248' },
      ],
      explain: '/29 = 255.255.255.248 : 6 adresses utilisables, assez pour les trois routeurs.',
      hint: '/29 → 255.255.255.248',
    },
    {
      id: 'map', device: 'Siege', title: 'Mappage dynamique', goal: 'Interpréter show frame-relay map.',
      commands: [{ prompt: 'Siege#', cmd: 'show frame-relay map' }],
      output: 'Serial1/0 (up): ip 192.168.2.2 dlci 16(0x10,0x400), dynamic,\n              broadcast, status defined, active\nSerial1/0 (up): ip 192.168.2.3 dlci 17(0x11,0x410), dynamic,\n              broadcast, status defined, active',
      outputFidelity: 'reconstitue',
      explain: 'dynamic : appris par Inverse ARP. Pour joindre 192.168.2.2, le Siège utilise le DLCI 16.',
      hint: 'show frame-relay map',
    },
    {
      id: 'static-map', device: 'Siege', title: 'Mappage statique', goal: 'Désactiver Inverse ARP et mapper manuellement.',
      commands: [
        { prompt: 'Siege(config)#', cmd: 'interface s1/0' },
        { prompt: 'Siege(config-if)#', cmd: 'no frame-relay inverse-arp' },
        { prompt: 'Siege(config-if)#', cmd: 'end' },
        { prompt: 'Siege#', cmd: 'clear frame-relay inarp' },
        { prompt: 'Siege#', cmd: 'configure terminal' },
        { prompt: 'Siege(config)#', cmd: 'interface s1/0' },
        { prompt: 'Siege(config-if)#', cmd: 'frame-relay map ip 192.168.2.2 16 broadcast' },
        { prompt: 'Siege(config-if)#', cmd: 'frame-relay map ip 192.168.2.3 17 broadcast' },
      ],
      output: 'Serial1/0 (up): ip 192.168.2.2 dlci 16(0x10,0x400), static,\n              broadcast, CISCO, status defined, active',
      outputFidelity: 'reconstitue',
      explain: "Entre l'effacement et le mappage statique, vérifiez que la communication est coupée. Le DLCI est mappé avec l'adresse IP de l'autre extrémité du PVC.",
      hint: 'no frame-relay inverse-arp, clear frame-relay inarp, puis frame-relay map ip <IP distante> <DLCI local> broadcast.',
    },
  ],
  quiz: [
    { id: 'q1', kind: 'single', source: 'enonce', tags: ['dlci-map'], prompt: 'À quoi sert de mapper une adresse IP avec un DLCI ?', options: ['À chiffrer la trame', 'À savoir sur quel PVC (DLCI local) envoyer un paquet destiné à une adresse IP voisine', 'À attribuer une adresse IP', 'À configurer la LMI'], answer: 1, explain: 'C’est la résolution couche 3 → couche 2 propre à Frame Relay.' },
    { id: 'q2', kind: 'single', source: 'enonce', tags: ['dlci-map'], prompt: 'Le DLCI est-il mappé avec l’adresse IP locale ou celle de l’autre extrémité du PVC ?', options: ['L’adresse IP locale', 'L’adresse IP de l’autre extrémité'], answer: 1, explain: 'frame-relay map ip <IP distante> <DLCI local>.' },
    { id: 'q3', kind: 'single', source: 'enonce', tags: ['inverse-arp'], prompt: 'Quel protocole associe dynamiquement une adresse IP à un DLCI ?', options: ['ARP', 'Inverse ARP', 'LMI', 'DHCP'], answer: 1, explain: 'Inverse ARP part du DLCI connu pour découvrir l’IP distante.' },
    { id: 'q4', kind: 'single', source: 'enonce', tags: ['broadcast'], prompt: 'Pourquoi ajouter broadcast à frame-relay map ?', options: ['Pour diffuser la configuration', 'Pour envoyer le trafic de diffusion / multidiffusion sur le DLCI (nécessaire à la plupart des protocoles de routage)', 'Pour activer Inverse ARP', 'Pour la LMI'], answer: 1, explain: 'Sans broadcast, les mises à jour de routage multicast ne passent pas.' },
    { id: 'q5', kind: 'single', source: 'derive', tags: ['lmi'], prompt: 'Quel trafic observe-t-on entre Siege (DTE) et FR1 (DCE) avant même d’adresser les interfaces ?', options: ['ICMP', 'Des messages LMI (état des PVC / keepalive)', 'OSPF', 'DHCP'], answer: 1, explain: 'La LMI fonctionne dès que l’encapsulation est active.' },
    { id: 'q6', kind: 'input', source: 'derive', tags: ['adressage'], prompt: 'Masque décimal du /29 utilisé sur le WAN ?', accept: ['255.255.255.248'], explain: '/29 = 255.255.255.248.' },
    { id: 'q7', kind: 'single', source: 'derive', tags: ['pvc-status'], prompt: 'Dans show frame-relay map, que signifie « dynamic » ?', options: ['Le mappage a été appris par Inverse ARP', 'Le PVC change de DLCI', 'Le routage est dynamique', 'La LMI est désactivée'], answer: 0, explain: 'Après la configuration statique, la mention devient « static ».' },
    { id: 'q8', kind: 'order', source: 'derive', tags: ['methodologie'], prompt: 'Ordonnez le passage au mappage statique.', items: ['Désactiver l’Inverse ARP', 'Effacer le mappage dynamique (clear frame-relay inarp)', 'Vérifier que la communication est coupée', 'Ajouter frame-relay map … broadcast', 'Vérifier le mappage statique'], explain: 'Ordre de l’étape 11 de l’énoncé.' },
  ],
  compare: [
    {
      id: 'cmp-broadcast', title: 'Mappage statique sans broadcast', context: 'Un protocole de routage tourne sur le WAN Frame Relay.',
      wrong: { config: 'frame-relay map ip 192.168.2.2 16', result: 'Le ping unicast fonctionne, mais les mises à jour de routage (multicast) ne sont pas envoyées sur le PVC.' },
      right: { config: 'frame-relay map ip 192.168.2.2 16 broadcast', result: 'Le trafic de diffusion est répliqué sur le PVC : le routage fonctionne.' },
      lesson: 'La plupart des protocoles de routage nécessitent le mot-clé broadcast.',
      challenge: { symptom: 'Les pings entre routeurs passent, mais aucun voisin de routage ne se forme à travers Frame Relay.', options: ['Ajouter broadcast aux commandes frame-relay map', 'Changer le DLCI', 'Désactiver la LMI', 'Changer le masque'], answer: 0 },
    },
    {
      id: 'cmp-inarp', title: 'Inverse ARP désactivé sans mappage', context: 'Passage au mappage statique.',
      wrong: { config: 'no frame-relay inverse-arp\nclear frame-relay inarp\n! pas de frame-relay map', result: 'Plus aucune correspondance IP ↔ DLCI : la communication est coupée.' },
      right: { config: 'no frame-relay inverse-arp\nframe-relay map ip 192.168.2.2 16 broadcast\nframe-relay map ip 192.168.2.3 17 broadcast', result: 'Correspondances statiques : communication rétablie.' },
      lesson: 'Sans Inverse ARP, chaque voisin doit être mappé statiquement.',
      challenge: { symptom: 'Après « clear frame-relay inarp », le Siège ne joint plus 192.168.2.2 ; show frame-relay map est vide.', options: ['Ajouter frame-relay map ip 192.168.2.2 16 broadcast', 'Activer la LMI', 'Changer l’encapsulation en PPP', 'Ajouter une route par défaut'], answer: 0 },
    },
  ],
  sims: ['inverse-arp'],
  ap: {
    file: 'sims/frame-relay-base/index.html',
    scenes: ['Introduction et topologie', 'Encapsulation + no shutdown', 'show frame-relay pvc annoté', 'show interfaces serial1/0 (LMI)', 'Wireshark : LMI DTE ↔ DCE', 'Adressage /29 et show frame-relay map', 'Wireshark : Inverse ARP requête / réponse', 'Question : à quoi sert le mappage ?', 'Mappage statique et broadcast', 'Score et bilan'],
  },
  sources: [{ label: 'Énoncé – Configuration de base Frame Relay', file: 'docs/tp-frame-relay-base.pdf' }],
  notes: [
    "Les commandes de mappage statique et les sorties figurent en captures dans l'énoncé : elles sont reconstituées ici.",
    "L'énoncé ne précise que DLCI 16 ↔ 192.168.2.2 ; l'affectation DLCI 17 ↔ Agence2 (192.168.2.3) est une hypothèse de la plateforme, de même que les adresses .1 et .3.",
    "Les étapes 9-10 (LAN et routes statiques) ne détaillent pas l'adressage des LAN : elles ne sont pas reprises en mode Pratiquer.",
  ],
  glossary: ['frame-relay', 'pvc', 'dlci', 'lmi', 'inverse-arp', 'dte', 'dce', 'broadcast'],
};

export default tp;

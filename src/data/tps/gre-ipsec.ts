import type { Tp } from '../types';

const tp: Tp = {
  slug: 'gre-ipsec',
  order: 8,
  code: 'TP GRE/IPsec',
  title: 'Tunnel GRE over IPsec',
  subtitle: 'Tunnel GRE entre deux sites, puis chiffrement par IPsec',
  subject: 'tech-wan',
  theme: 'vpn',
  level: 3,
  duration: 75,
  tools: ['GNS3', 'Cisco 7200 (IOS avec « crypto »)', 'Wireshark'],
  equipment: ['RouterA', 'WAN', 'RouterB'],
  fidelity: 'reconstitue',
  summary:
    "Relier deux LAN privés à travers un WAN public avec un tunnel GRE (avec NAT pour l'accès Internet), puis chiffrer le trafic du tunnel avec IPsec : GRE transporte le multicast, IPsec le protège.",
  scenario:
    "Deux sites (10.0.10.0/24 et 10.0.20.0/24) sont reliés à un routeur WAN par des adresses publiques. Ils doivent communiquer par un tunnel, et ce trafic doit être chiffré. Le reste du trafic sort vers le WAN avec NAT.",
  objectives: [
    'Configurer l’adressage, la NAT overload et l’exclusion du trafic inter-sites',
    'Créer l’interface Tunnel0 (GRE) et comprendre le MTU de 1400',
    'Router le trafic inter-sites dans le tunnel',
    'Analyser l’encapsulation IP/GRE/IP sous Wireshark',
    'Chiffrer le tunnel GRE avec IPsec (ISAKMP, transform-set, ACL GRE, crypto map)',
  ],
  prerequisites: ['vpn-ipsec'],
  topology: {
    width: 800,
    height: 440,
    caption: 'Tunnel 0 : 172.16.1.1/24 ↔ 172.16.1.2/24',
    zones: [{ label: 'Tunnel GRE (chiffré par IPsec en partie II)', x: 120, y: 60, w: 560, h: 110, tone: 'vpn' }],
    nodes: [
      { id: 'LANA', label: 'LAN site 1', kind: 'pc', x: 60, y: 320, info: ['10.0.10.0/24'] },
      { id: 'RouterA', kind: 'router', x: 200, y: 260, info: ['fa0/0 : 10.0.10.1/24 (nat inside)', 's0/0 : 201.20.20.1/30 (nat outside)', 'Tunnel0 : 172.16.1.1/24'] },
      { id: 'WAN', kind: 'router', x: 400, y: 330, role: 'WAN', info: ['s0/0 : 201.20.20.2/30', 's0/1 : 204.20.20.1/30'] },
      { id: 'RouterB', kind: 'router', x: 600, y: 260, info: ['fa0/0 : 10.0.20.1/24 (nat inside)', 's0/0 : 204.20.20.2/30 (nat outside)', 'Tunnel0 : 172.16.1.2/24'] },
      { id: 'LANB', label: 'LAN site 2', kind: 'pc', x: 740, y: 320, info: ['10.0.20.0/24'] },
    ],
    links: [
      { a: 'LANA', b: 'RouterA', kind: 'ethernet' },
      { a: 'RouterA', b: 'WAN', label: '201.20.20.0/30', kind: 'serial' },
      { a: 'WAN', b: 'RouterB', label: '204.20.20.0/30', kind: 'serial' },
      { a: 'RouterB', b: 'LANB', kind: 'ethernet' },
      { a: 'RouterA', b: 'RouterB', label: 'Tunnel0 172.16.1.0/24', kind: 'tunnel' },
    ],
  },
  learn: [
    {
      title: 'Le tunnel GRE',
      body: [
        "GRE encapsule un paquet IP complet dans un nouveau paquet IP. L'en-tête externe porte les adresses publiques des extrémités (201.20.20.1 → 204.20.20.2) ; le paquet interne garde ses adresses privées.",
        "L'interface Tunnel0 se comporte comme un lien point à point (172.16.1.0/24) : on peut router dessus.",
      ],
      code: 'interface Tunnel0\n ip address 172.16.1.1 255.255.255.0\n ip mtu 1400\n tunnel source S0/0\n tunnel destination 204.20.20.2',
    },
    {
      title: 'Pourquoi un MTU de 1400 ?',
      body: [
        "L'encapsulation ajoute des octets à chaque paquet. En limitant volontairement le MTU des interfaces GRE à 1400, on garantit que les paquets transitant par le tunnel ne seront pas fragmentés en passant sur le tunnel IPsec correspondant.",
      ],
    },
    {
      title: 'NAT et exclusion du trafic inter-sites',
      body: [
        "Les sites sortent sur le WAN avec NAT overload. L'ACL 100 exclut (deny) le trafic d'un LAN vers l'autre : ce trafic ne doit pas être traduit mais passer par le tunnel. Une route statique vers le LAN distant via l'adresse de tunnel du pair l'y envoie.",
      ],
      code: 'access-list 100 deny ip 10.0.10.0 0.0.0.255 10.0.20.0 0.0.0.255\naccess-list 100 permit ip 10.0.10.0 0.0.0.255 any\nip nat inside source list 100 interface s0/0 overload',
    },
    {
      title: 'Pourquoi combiner GRE et IPsec ?',
      body: [
        "IPsec ne supporte pas les paquets multicast IP : on ne peut pas faire tourner de protocole de routage dynamique sur un VPN IPsec seul. GRE supporte le multicast : il encapsule d'abord le paquet (même multicast) dans un paquet unicast IP GRE, qui peut ensuite être chiffré par IPsec.",
        "L'ACL 101 désigne donc le trafic GRE entre les deux extrémités publiques comme trafic à chiffrer.",
      ],
      code: 'access-list 101 permit gre host 201.20.20.1 host 204.20.20.2',
      callout: { tone: 'warn', text: "Sur IOS, dans « crypto isakmp key 6 … », le chiffre indique le type de la clé saisie (0 = en clair, 6 = déjà chiffrée). L'explication de l'énoncé diffère : voir les notes du TP." },
    },
  ],
  steps: [
    {
      id: 'base-a', device: 'RouterA', title: 'Configuration de base de RouterA', goal: 'Adressage, interfaces NAT et route par défaut.',
      commands: [
        { prompt: 'RouterA(config)#', cmd: 'interface fa0/0' },
        { prompt: 'RouterA(config-if)#', cmd: 'ip address 10.0.10.1 255.255.255.0' },
        { prompt: 'RouterA(config-if)#', cmd: 'ip nat inside' },
        { prompt: 'RouterA(config-if)#', cmd: 'no shutdown' },
        { prompt: 'RouterA(config-if)#', cmd: 'interface s0/0' },
        { prompt: 'RouterA(config-if)#', cmd: 'ip address 201.20.20.1 255.255.255.252' },
        { prompt: 'RouterA(config-if)#', cmd: 'ip nat outside' },
        { prompt: 'RouterA(config-if)#', cmd: 'no shutdown' },
        { prompt: 'RouterA(config-if)#', cmd: 'exit' },
        { prompt: 'RouterA(config)#', cmd: 'ip route 0.0.0.0 0.0.0.0 201.20.20.2' },
      ],
      explain: 'Les interfaces NAT sont définies selon les flux entrants et sortants ; la route par défaut envoie le trafic vers le routeur WAN. RouterB est symétrique (10.0.20.1, 204.20.20.2, défaut 204.20.20.1).',
      hint: 'Interface LAN : inside ; interface WAN : outside.',
    },
    {
      id: 'nat-a', device: 'RouterA', title: 'NAT avec exclusion du trafic inter-sites', goal: 'Ne pas traduire le trafic vers le site 2.',
      commands: [
        { prompt: 'RouterA(config)#', cmd: 'access-list 100 deny ip 10.0.10.0 0.0.0.255 10.0.20.0 0.0.0.255' },
        { prompt: 'RouterA(config)#', cmd: 'access-list 100 permit ip 10.0.10.0 0.0.0.255 any' },
        { prompt: 'RouterA(config)#', cmd: 'ip nat inside source list 100 interface s0/0 overload' },
      ],
      explain: "L'ordre compte : la ligne deny doit précéder le permit any.",
      hint: 'access-list 100 deny … puis permit … any, puis ip nat inside source list 100 …',
    },
    {
      id: 'tunnel-a', device: 'RouterA', title: 'Interface Tunnel0', goal: 'Créer le tunnel GRE vers RouterB.',
      commands: [
        { prompt: 'RouterA(config)#', cmd: 'interface tunnel0' },
        { prompt: 'RouterA(config-if)#', cmd: 'ip address 172.16.1.1 255.255.255.0' },
        { prompt: 'RouterA(config-if)#', cmd: 'ip mtu 1400' },
        { prompt: 'RouterA(config-if)#', cmd: 'tunnel source s0/0' },
        { prompt: 'RouterA(config-if)#', cmd: 'tunnel destination 204.20.20.2' },
      ],
      output: '%LINEPROTO-5-UPDOWN: Line protocol on Interface Tunnel0, changed state to up',
      outputFidelity: 'reconstitue',
      explain: 'Sur RouterB : 172.16.1.2, tunnel destination 201.20.20.1.',
      hint: 'interface tunnel0, ip address, ip mtu, tunnel source, tunnel destination.',
    },
    {
      id: 'ping-tunnel', device: 'RouterA', title: 'Tester le tunnel', goal: 'Ping de l’extrémité du tunnel, puis du LAN distant.',
      commands: [
        { prompt: 'RouterA#', cmd: 'ping 172.16.1.2' },
        { prompt: 'RouterA#', cmd: 'ping 10.0.20.1' },
      ],
      output: 'RouterA#ping 172.16.1.2\n!!!!!\nSuccess rate is 100 percent (5/5)\nRouterA#ping 10.0.20.1\n.....\nSuccess rate is 0 percent (0/5)',
      outputFidelity: 'reconstitue',
      explain: "Le ping vers 10.0.20.1 échoue : RouterA n'a pas de route vers 10.0.20.0/24 ; sa route par défaut envoie le paquet au WAN, qui ne connaît pas ce réseau privé.",
      hint: 'ping 172.16.1.2 puis ping 10.0.20.1',
    },
    {
      id: 'routes-tunnel', device: 'RouterA', title: 'Router le trafic inter-sites dans le tunnel', goal: 'Route statique vers le LAN distant via le tunnel.',
      commands: [{ prompt: 'RouterA(config)#', cmd: 'ip route 10.0.20.0 255.255.255.0 172.16.1.2' }],
      explain: 'Sur RouterB : ip route 10.0.10.0 255.255.255.0 172.16.1.1. Le ping 10.0.20.1 réussit alors. Capture sur S0/0 + « ping 10.0.20.1 repeat 1 » : IP externe (201.20.20.1 → 204.20.20.2, protocole 47 = GRE) / GRE / IP interne.',
      hint: 'ip route <LAN distant> <masque> <adresse tunnel du pair>',
    },
    {
      id: 'ipsec-1', device: 'RouterA', title: 'ISAKMP et politique VPN', goal: 'Phase 1 et paramètres IPsec.',
      commands: [
        { prompt: 'RouterA(config)#', cmd: 'crypto isakmp enable' },
        { prompt: 'RouterA(config)#', cmd: 'crypto isakmp policy 1' },
        { prompt: 'RouterA(config-isakmp)#', cmd: 'authentication pre-share' },
        { prompt: 'RouterA(config-isakmp)#', cmd: 'exit' },
        { prompt: 'RouterA(config)#', cmd: 'crypto isakmp key 6 P@ssword address 204.20.20.2', alt: ['crypto isakmp key 0 P@ssword address 204.20.20.2', 'crypto isakmp key P@ssword address 204.20.20.2'] },
        { prompt: 'RouterA(config)#', cmd: 'crypto ipsec security-association lifetime seconds 4096' },
        { prompt: 'RouterA(config)#', cmd: 'crypto ipsec transform-set strong esp-3des esp-md5-hmac' },
      ],
      explain: 'La clé « P@ssword » sert à l’authentification de RouterA avec RouterB (204.20.20.2). Le transform-set « strong » chiffre en 3DES et authentifie en MD5-HMAC ; la durée de vie de la clé de chiffrement est de 4096 s.',
      hint: 'crypto isakmp enable / policy 1 / key / lifetime / transform-set strong',
    },
    {
      id: 'ipsec-2', device: 'RouterA', title: 'ACL GRE et crypto map', goal: 'Chiffrer tout le trafic du tunnel GRE.',
      commands: [
        { prompt: 'RouterA(config)#', cmd: 'access-list 101 permit gre host 201.20.20.1 host 204.20.20.2' },
        { prompt: 'RouterA(config)#', cmd: 'crypto map S2SVPN 10 ipsec-isakmp' },
        { prompt: 'RouterA(config-crypto-map)#', cmd: 'match address 101' },
        { prompt: 'RouterA(config-crypto-map)#', cmd: 'set peer 204.20.20.2' },
        { prompt: 'RouterA(config-crypto-map)#', cmd: 'set transform-set strong' },
        { prompt: 'RouterA(config-crypto-map)#', cmd: 'interface s0/0' },
        { prompt: 'RouterA(config-if)#', cmd: 'crypto map S2SVPN' },
      ],
      explain: 'S2SVPN = Site-to-Site VPN. RouterB : ACL inversée (gre host 204.20.20.2 host 201.20.20.1) et set peer 201.20.20.1. Après un ping 10.0.20.1, la capture sur S0/0 ne montre plus que de l’ESP. Explorez ensuite show crypto ?',
      hint: 'access-list 101 permit gre host … host …, puis crypto map S2SVPN 10 ipsec-isakmp …',
    },
  ],
  quiz: [
    { id: 'q1', kind: 'single', source: 'enonce', tags: ['gre-routage'], prompt: 'Avant les routes statiques, « RouterA# ping 10.0.20.1 » aboutit-il ?', options: ['Oui, grâce au tunnel', 'Non : aucune route ne dirige 10.0.20.0/24 vers le tunnel', 'Oui, grâce à la NAT', 'Non, car IPsec bloque'], answer: 1, explain: 'La route par défaut envoie le paquet au WAN, qui ne connaît pas ce réseau privé.' },
    { id: 'q2', kind: 'single', source: 'enonce', tags: ['gre-mtu'], prompt: 'Pourquoi fixer ip mtu 1400 sur le tunnel ?', options: ['Pour accélérer le routage', 'Pour éviter la fragmentation due aux en-têtes ajoutés par GRE puis IPsec', 'Parce que GRE l’exige', 'Pour la NAT'], answer: 1, explain: 'L’encapsulation ajoute des octets à chaque paquet.' },
    { id: 'q3', kind: 'single', source: 'enonce', tags: ['nat-exclusion'], prompt: 'Rôle de la ligne « access-list 100 deny ip 10.0.10.0 … 10.0.20.0 … » ?', options: ['Bloquer le trafic vers le site 2', 'Exclure le trafic inter-sites de la traduction NAT pour qu’il passe par le tunnel', 'Chiffrer le trafic', 'Autoriser Internet'], answer: 1, explain: 'deny dans une ACL de NAT = ne pas traduire, pas « bloquer ».' },
    { id: 'q4', kind: 'order', source: 'enonce', tags: ['gre-encapsulation'], prompt: 'Ordonnez les en-têtes d’un ping 10.0.20.1 dans le tunnel GRE (de l’extérieur vers l’intérieur).', items: ['IP externe 201.20.20.1 → 204.20.20.2', 'GRE', 'IP interne 172.16.1.1 → 10.0.20.1', 'ICMP Echo'], explain: 'Le paquet d’origine (IP + ICMP) est encapsulé dans GRE, lui-même dans un IP externe aux adresses publiques.' },
    { id: 'q5', kind: 'single', source: 'enonce', tags: ['gre-ipsec'], prompt: 'Pourquoi combiner GRE et IPsec ?', options: ['IPsec seul est trop lent', 'IPsec ne supporte pas le multicast : GRE permet le routage dynamique, IPsec chiffre', 'GRE chiffre et IPsec route', 'Pour économiser des adresses'], answer: 1, explain: 'Explication de l’énoncé.' },
    { id: 'q6', kind: 'input', source: 'derive', tags: ['gre-ipsec'], prompt: 'Quel protocole l’ACL 101 désigne-t-elle comme trafic à chiffrer ?', accept: ['gre'], explain: 'access-list 101 permit gre host 201.20.20.1 host 204.20.20.2.' },
    { id: 'q7', kind: 'single', source: 'enonce', tags: ['transform-set'], prompt: 'Dans « transform-set strong esp-3des esp-md5-hmac », que désigne « strong » ?', options: ['L’algorithme de chiffrement', 'Le nom du transform-set', 'Le niveau de sécurité IOS', 'Le pair'], answer: 1, explain: 'strong est le nom donné ; esp-3des chiffre, esp-md5-hmac authentifie.' },
    { id: 'q8', kind: 'single', source: 'derive', tags: ['wireshark-esp'], prompt: 'Après la partie II, que montre la capture sur S0/0 lors d’un ping 10.0.20.1 ?', options: ['IP/GRE/IP en clair', 'Des paquets ESP entre 201.20.20.1 et 204.20.20.2', 'De l’ICMP en clair', 'Rien'], answer: 1, explain: 'Le paquet GRE est chiffré dans ESP : on ne voit plus que les adresses publiques.' },
  ],
  compare: [
    {
      id: 'cmp-gre-route', title: 'Tunnel sans route', context: 'Le tunnel est up, ping 172.16.1.2 OK.',
      wrong: { config: '! aucune route vers 10.0.20.0/24', result: 'ping 10.0.20.1 échoue : le trafic suit la route par défaut vers le WAN.' },
      right: { config: 'ip route 10.0.20.0 255.255.255.0 172.16.1.2', result: 'Le trafic inter-sites entre dans le tunnel : ping OK.' },
      lesson: 'Un tunnel est un lien : il faut une route (statique ou dynamique) pour y envoyer le trafic.',
      challenge: { symptom: 'ping 172.16.1.2 réussit mais ping 10.0.20.1 échoue depuis RouterA.', options: ['Ajouter ip route 10.0.20.0 255.255.255.0 172.16.1.2', 'Changer le MTU', 'Retirer la NAT', 'Ajouter crypto map'], answer: 0 },
    },
    {
      id: 'cmp-nat-deny', title: 'NAT sans exclusion', context: 'ACL 100 de RouterA.',
      wrong: { config: 'access-list 100 permit ip 10.0.10.0 0.0.0.255 any', result: 'Le trafic vers le site 2 est aussi traduit : le site distant reçoit une source publique au lieu de 10.0.10.x.' },
      right: { config: 'access-list 100 deny ip 10.0.10.0 0.0.0.255 10.0.20.0 0.0.0.255\naccess-list 100 permit ip 10.0.10.0 0.0.0.255 any', result: 'Seul le trafic Internet est traduit ; l’inter-sites garde ses adresses privées.' },
      lesson: 'Excluez le trafic VPN de la NAT, avant le permit any.',
      challenge: { symptom: 'Dans le tunnel, les paquets du site 1 arrivent avec la source 201.20.20.1 au lieu de 10.0.10.x.', options: ['Ajouter la ligne deny inter-sites en tête de l’ACL 100', 'Changer la destination du tunnel', 'Retirer ip mtu 1400', 'Changer le transform-set'], answer: 0 },
    },
  ],
  sims: ['packet-gre-ipsec'],
  ap: {
    file: 'sims/gre-ipsec/index.html',
    scenes: ['Introduction', 'Adressage, NAT overload et ACL 100', 'Tunnel0 et MTU 1400 (animation)', 'ping 172.16.1.2 ✓ / 10.0.20.1 ✗', 'Routes via le tunnel', 'Wireshark IP/GRE/IP : reconstituer l’encapsulation', 'Pourquoi GRE + IPsec', 'ISAKMP, transform-set, ACL 101, crypto map', 'Wireshark : ESP seul', 'show crypto ? – exploration', 'Score et bilan'],
  },
  sources: [{ label: 'Énoncé – Tunnel GRE over IPsec', file: 'docs/tp-gre-ipsec.pdf' }],
  notes: [
    "Coquille corrigée : l'énoncé écrit « int s0/0 255.255.255.252 » puis « ip address 201.20.20.1 » ; la forme correcte est ip address 201.20.20.1 255.255.255.252 sur s0/0 (idem RouterB).",
    "« crypto isakmp key 6 P@ssword » : l'énoncé explique que 6 « indique que la clé doit être chiffrée ». Sur IOS, ce chiffre indique le type de la clé saisie (0 = en clair, 6 = déjà chiffrée en type 6). La commande de l'énoncé est conservée, les variantes key 0 et sans chiffre sont acceptées. Point à valider avec l'enseignant.",
  ],
  glossary: ['gre', 'tunnel', 'mtu', 'nat', 'ipsec', 'esp', 'transform-set', 'crypto-map', 'multicast', 'acl'],
};

export default tp;

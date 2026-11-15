import { useEffect, useState } from 'react';
import Icon from '../ui/Icon';

type Kind = 'ip-outer' | 'ip' | 'label' | 'vpnlabel' | 'gre' | 'esp' | 'udp' | 'isakmp' | 'payload' | 'trailer';
interface Block { t: string; k: Kind; enc?: boolean }
interface Hop { where: string; stack: Block[]; text: string }

const COLORS: Record<Kind, string> = {
  'ip-outer': 'var(--t-routage)', ip: 'var(--t-frame-relay)', label: 'var(--t-mpls)', vpnlabel: 'var(--t-vpn)',
  gre: 'var(--t-services)', esp: 'var(--t-vpn)', udp: 'var(--t-neutral)', isakmp: 'var(--t-neutral)', payload: 'var(--text-3)', trailer: 'var(--t-vpn)',
};

const VARIANTS: Record<string, { title: string; note: string; hops: Hop[] }> = {
  mpls: {
    title: 'SIEGE ping 192.168.1.1 (LAN AGENCE) à travers le VPN MPLS',
    note: 'Numéros de labels illustratifs. Le retrait du label de transport par SP2 (PHP) est le comportement par défaut ; vérifiez-le sur votre capture.',
    hops: [
      { where: 'SIEGE → SP1', stack: [{ t: 'IP 192.168.12.2 → 192.168.1.1', k: 'ip' }, { t: 'ICMP Echo', k: 'payload' }], text: 'Le CE envoie un paquet IP ordinaire : le client ne voit pas MPLS.' },
      { where: 'SP1 → SP2', stack: [{ t: 'Label 17 (transport, LDP)', k: 'label' }, { t: 'Label 20 (VPN, MP-BGP)', k: 'vpnlabel' }, { t: 'IP 192.168.12.2 → 192.168.1.1', k: 'ip' }, { t: 'ICMP Echo', k: 'payload' }], text: 'SP1 (PE d’entrée) cherche la destination dans la VRF Client_A et empile deux labels : le label VPN, puis le label de transport vers SP3 (3.3.3.3).' },
      { where: 'SP2 → SP3', stack: [{ t: 'Label 20 (VPN)', k: 'vpnlabel' }, { t: 'IP 192.168.12.2 → 192.168.1.1', k: 'ip' }, { t: 'ICMP Echo', k: 'payload' }], text: 'SP2 est l’avant-dernier saut vers 3.3.3.3 : il retire le label de transport (PHP). Il ne lit jamais l’en-tête IP du client.' },
      { where: 'SP3 → AGENCE', stack: [{ t: 'IP 192.168.12.2 → 192.168.1.1', k: 'ip' }, { t: 'ICMP Echo', k: 'payload' }], text: 'SP3 lit le label VPN : il identifie la VRF Client_A, retire le label et route le paquet vers AGENCE.' },
    ],
  },
  'gre-ipsec': {
    title: 'Hôte 10.0.10.x ping 10.0.20.1 à travers le tunnel',
    note: 'Ordre des en-têtes conforme à l’énoncé : IP externe / GRE / IP interne, puis chiffrement ESP en partie II.',
    hops: [
      { where: 'LAN site 1 → RouterA', stack: [{ t: 'IP 10.0.10.x → 10.0.20.1', k: 'ip' }, { t: 'ICMP Echo', k: 'payload' }], text: 'Paquet privé. L’ACL 100 l’exclut de la NAT ; la route statique l’envoie vers Tunnel0.' },
      { where: 'WAN – partie I (GRE seul)', stack: [{ t: 'IP 201.20.20.1 → 204.20.20.2 (proto 47)', k: 'ip-outer' }, { t: 'GRE', k: 'gre' }, { t: 'IP 10.0.10.x → 10.0.20.1', k: 'ip' }, { t: 'ICMP Echo', k: 'payload' }], text: 'RouterA encapsule le paquet dans GRE avec un en-tête IP externe aux adresses publiques. Le contenu reste lisible sous Wireshark.' },
      { where: 'WAN – partie II (GRE over IPsec)', stack: [{ t: 'IP 201.20.20.1 → 204.20.20.2 (proto 50)', k: 'ip-outer' }, { t: 'ESP', k: 'esp' }, { t: 'GRE', k: 'gre', enc: true }, { t: 'IP 10.0.10.x → 10.0.20.1', k: 'ip', enc: true }, { t: 'ICMP', k: 'payload', enc: true }, { t: 'ESP auth (MD5-HMAC)', k: 'trailer' }], text: 'Le trafic GRE correspond à l’ACL 101 : la crypto map S2SVPN le chiffre (3DES). Sur le WAN, on ne voit plus que de l’ESP entre les deux routeurs.' },
      { where: 'RouterB → LAN site 2', stack: [{ t: 'IP 10.0.10.x → 10.0.20.1', k: 'ip' }, { t: 'ICMP Echo', k: 'payload' }], text: 'RouterB déchiffre, désencapsule GRE et route le paquet d’origine vers son LAN.' },
    ],
  },
  ipsec: {
    title: 'PC-A (192.168.1.3) ping PC-C (192.168.3.3)',
    note: 'Adresses des routeurs selon l’hypothèse d’adressage du TP (voir les notes).',
    hops: [
      { where: 'PC-A → R1', stack: [{ t: 'IP 192.168.1.3 → 192.168.3.3', k: 'ip' }, { t: 'ICMP Echo', k: 'payload' }], text: 'Le trafic correspond à l’ACL 110 : il est « intéressant » pour la crypto map VPN-MAP.' },
      { where: 'R1 ↔ R3 – négociation', stack: [{ t: 'IP 10.1.1.2 → 10.2.2.2', k: 'ip-outer' }, { t: 'UDP 500', k: 'udp' }, { t: 'ISAKMP (IKE phase 1 puis phase 2)', k: 'isakmp' }], text: 'Avant le premier paquet chiffré, R1 et R3 négocient : politique 10 (AES, pre-share, DH 2), puis transform-set VPN-SET.' },
      { where: 'R1 → R2 → R3', stack: [{ t: 'IP 10.1.1.2 → 10.2.2.2 (proto 50)', k: 'ip-outer' }, { t: 'ESP', k: 'esp' }, { t: 'IP 192.168.1.3 → 192.168.3.3', k: 'ip', enc: true }, { t: 'ICMP', k: 'payload', enc: true }, { t: 'ESP auth (SHA-HMAC)', k: 'trailer' }], text: 'Le paquet d’origine est chiffré (3DES) dans ESP. R2 ne voit que les adresses des routeurs ; les compteurs pkts encaps/encrypt augmentent.' },
      { where: 'R3 → PC-C', stack: [{ t: 'IP 192.168.1.3 → 192.168.3.3', k: 'ip' }, { t: 'ICMP Echo', k: 'payload' }], text: 'R3 déchiffre (pkts decaps/decrypt) et remet le paquet d’origine.' },
    ],
  },
};

export default function PacketJourney({ variant }: { variant: keyof typeof VARIANTS }) {
  const v = VARIANTS[variant];
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(false);
  const h = v.hops[i];

  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % v.hops.length), 3200);
    return () => window.clearInterval(id);
  }, [auto, v.hops.length]);

  return (
    <div className="stack">
      <strong>{v.title}</strong>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {v.hops.map((hop, k) => (
          <button key={hop.where} className="chip" aria-pressed={k === i} onClick={() => { setI(k); setAuto(false); }}>{k + 1}. {hop.where}</button>
        ))}
      </div>
      <div className="card fade-in" key={i} style={{ padding: 14, overflowX: 'auto' }}>
        <div className="dim" style={{ fontSize: '0.78rem', marginBottom: 8 }}>En-têtes sur le lien « {h.where} » (de l’extérieur vers l’intérieur)</div>
        <div style={{ display: 'flex', minWidth: 'min-content' }} role="list" aria-label="Pile d’en-têtes">
          {h.stack.map((b, k) => (
            <div key={k} role="listitem" title={b.enc ? 'Chiffré' : undefined}
              style={{
                padding: '10px 12px', minWidth: 96, fontSize: '0.8rem', fontFamily: 'var(--font-mono)', lineHeight: 1.35,
                borderRadius: k === 0 ? '9px 0 0 9px' : k === h.stack.length - 1 ? '0 9px 9px 0' : 0,
                background: `color-mix(in srgb, ${COLORS[b.k]} ${b.enc ? 8 : 16}%, var(--surface))`,
                borderTop: `3px solid ${COLORS[b.k]}`, borderRight: '1px solid var(--border)',
                backgroundImage: b.enc ? 'repeating-linear-gradient(135deg, transparent 0 6px, color-mix(in srgb, var(--text) 7%, transparent) 6px 8px)' : undefined,
              }}>
              {b.enc && <Icon name="lock" size={12} />} {b.t}
            </div>
          ))}
        </div>
      </div>
      <p className="muted" style={{ margin: 0 }} aria-live="polite">{h.text}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}><Icon name="prev" /> Saut précédent</button>
        <button className="btn btn-primary btn-sm" onClick={() => setI(Math.min(v.hops.length - 1, i + 1))} disabled={i === v.hops.length - 1}>Saut suivant <Icon name="next" /></button>
        <button className="btn btn-quiet btn-sm" onClick={() => setAuto((a) => !a)}><Icon name={auto ? 'pause' : 'play'} /> {auto ? 'Pause' : 'Lecture auto'}</button>
      </div>
      <p className="dim" style={{ fontSize: '0.8rem', margin: 0 }}>{v.note}</p>
    </div>
  );
}

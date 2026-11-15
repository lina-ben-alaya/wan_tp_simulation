import { lazy, Suspense, useEffect, useState } from 'react';
import type { SimId } from '../../data/types';

const NatSim = lazy(() => import('./NatSim'));
const RouteTargetSim = lazy(() => import('./RouteTargetSim'));
const AdminDistanceSim = lazy(() => import('./AdminDistanceSim'));
const FrFailoverSim = lazy(() => import('./FrFailoverSim'));
const InverseArpSim = lazy(() => import('./InverseArpSim'));
const LabelTableSim = lazy(() => import('./LabelTableSim'));
const PacketJourney = lazy(() => import('./PacketJourney'));

/** Charge à la demande le simulateur « CALCULÉ » demandé. */
export default function SimHost({ id }: { id: SimId }) {
  // Rendu uniquement côté client : évite une frontière Suspense « déshydratée »
  // qui serait mise à jour avant la fin de l'hydratation.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <p className="dim">Chargement du simulateur…</p>;
  return (
    <Suspense fallback={<p className="dim">Chargement du simulateur…</p>}>
      {id === 'nat' && <NatSim />}
      {id === 'route-target' && <RouteTargetSim />}
      {id === 'admin-distance' && <AdminDistanceSim />}
      {id === 'fr-failover' && <FrFailoverSim />}
      {id === 'inverse-arp' && <InverseArpSim />}
      {id === 'label-table' && <LabelTableSim />}
      {id === 'packet-mpls' && <PacketJourney variant="mpls" />}
      {id === 'packet-gre-ipsec' && <PacketJourney variant="gre-ipsec" />}
      {id === 'packet-ipsec' && <PacketJourney variant="ipsec" />}
    </Suspense>
  );
}

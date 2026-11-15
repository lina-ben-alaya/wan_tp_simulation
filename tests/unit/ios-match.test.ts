import { describe, expect, it } from 'vitest';
import { matchCommand, normalize, revealPrefix } from '@/lib/ios-match';

const ok = (input: string, canon: string, alt?: string[]) => expect(matchCommand(input, canon, alt).ok, input).toBe(true);
const ko = (input: string, canon: string, alt?: string[]) => expect(matchCommand(input, canon, alt).ok, input).toBe(false);

describe('matchCommand', () => {
  it('accepte la forme complète et les espaces multiples', () => {
    ok('configure terminal', 'configure terminal');
    ok('  show   ip route ', 'show ip route');
  });

  it('accepte les abréviations IOS de mots-clés', () => {
    ok('conf t', 'configure terminal');
    ok('sh ip ro', 'show ip route');
    ok('sh mpls ldp nei', 'show mpls ldp neighbor');
    ok('add ipv4 vrf Client_A', 'address-family ipv4 vrf Client_A');
    ok('no shut', 'no shutdown');
    ok('SHOW IP ROUTE', 'show ip route');
  });

  it('accepte les noms d’interfaces abrégés, numéros exacts', () => {
    ok('int s1/1', 'interface serial1/1');
    ok('interface Serial1/1', 'interface serial1/1');
    ok('int lo0', 'interface loopback0');
    ok('int f0/0', 'interface fa0/0');
    ok('int fastEthernet0/0', 'interface fa0/0');
    ok('int s0/1.16 point-to-point', 'interface s0/1.16 point-to-point');
    ok('neighbor 3.3.3.3 update-source lo0', 'neighbor 3.3.3.3 update-source Loopback0');
    ko('int s1/2', 'interface serial1/1');
    ko('int f0/0', 'interface serial0/0');
  });

  it('exige les valeurs exactes (adresses, noms sensibles à la casse)', () => {
    ko('ip vrf CLIENT_A', 'ip vrf Client_A');
    ko('ip address 1.1.1.1 255.255.255.0', 'ip address 1.1.1.1 255.255.255.128');
    ko('crypto isakmp key cis address 10.2.2.2', 'crypto isakmp key cisco address 10.2.2.2');
    ko('crypto ipsec transform-set str esp-3des esp-md5-hmac', 'crypto ipsec transform-set strong esp-3des esp-md5-hmac');
  });

  it('ne traite pas « forwarding » comme une valeur après vrf', () => {
    ok('ip vrf forw Client_A', 'ip vrf forwarding Client_A');
  });

  it('refuse les commandes incomplètes ou trop longues', () => {
    ko('router ospf', 'router ospf 1');
    ko('router ospf 1 2', 'router ospf 1');
    ko('', 'router ospf 1');
  });

  it('gère les variantes et le joker {n}', () => {
    const canon = 'redistribute ospf 1 metric 10000 100 255 1 1500';
    const alt = ['redistribute ospf 1 metric {n} {n} {n} {n} {n}'];
    ok('redistribute ospf 1 metric 1500 4000 200 10 1500', canon, alt);
    ko('redistribute ospf 1', canon, alt);
  });

  it('signale le premier mot erroné', () => {
    expect(matchCommand('router eigrp 10', 'router eigrp 100').badToken).toBe(2);
  });

  it('utilitaires', () => {
    expect(normalize('  a   b ')).toBe('a b');
    expect(revealPrefix('ip route 0.0.0.0 0.0.0.0 10.10.10.2')).toBe('ip route …');
  });
});

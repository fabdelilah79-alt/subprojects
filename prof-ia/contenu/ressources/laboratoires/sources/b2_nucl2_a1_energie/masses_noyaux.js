/*
Rôle : données du chapitre « Noyaux, masse et énergie » : masses des NOYAUX (en u, masse atomique moins Z masses
       d'électrons), masses du proton, du neutron et de l'électron ; énergie de liaison d'un noyau.
Reçoit : rien.
Produit : Labo.NOYAUX { id : { symbole, z, a, m } } ; Labo.NUCLEONS { mp, mn, me, u_MeV } ;
          Labo.liaison(id) -> { dm (u), El (MeV), El_A (MeV/nucléon) }.
Utilisé par : balance_noyaux.js, affiche_masses.js, simulation.js.
*/
(function (L) {
  const n = (symbole, z, a, m) => ({ symbole, z, a, m });
  L.NOYAUX = {
    H2: n("²₁H", 1, 2, 2.013553), H3: n("³₁H", 1, 3, 3.0155), He4: n("⁴₂He", 2, 4, 4.001505), Li7: n("⁷₃Li", 3, 7, 7.014358),
    C12: n("¹²₆C", 6, 12, 11.996709), C14: n("¹⁴₆C", 6, 14, 13.999951), N14: n("¹⁴₇N", 7, 14, 13.999234), O16: n("¹⁶₈O", 8, 16, 15.990526),
    F18: n("¹⁸₉F", 9, 18, 17.996001), O18: n("¹⁸₈O", 8, 18, 17.994771), Al27: n("²⁷₁₃Al", 13, 27, 26.974406), Ca40: n("⁴⁰₂₀Ca", 20, 40, 39.951619),
    Fe56: n("⁵⁶₂₆Fe", 26, 56, 55.920673), Sr94: n("⁹⁴₃₈Sr", 38, 94, 93.894515), Sn120: n("¹²⁰₅₀Sn", 50, 120, 119.874773), Xe140: n("¹⁴⁰₅₄Xe", 54, 140, 139.892018),
    Pb208: n("²⁰⁸₈₂Pb", 82, 208, 207.931668), Rn222: n("²²²₈₆Rn", 86, 222, 221.9704), Ra226: n("²²⁶₈₈Ra", 88, 226, 225.977135), U235: n("²³⁵₉₂U", 92, 235, 234.993461),
    U238: n("²³⁸₉₂U", 92, 238, 238.000319),
  };
  L.NUCLEONS = { mp: 1.007276, mn: 1.008665, me: 0.000549, u_MeV: 931.5 };

  L.liaison = function (id) {
    // Défaut de masse, énergie de liaison et énergie de liaison par nucléon d'un noyau.
    const k = L.NOYAUX[id], N = L.NUCLEONS, dm = k.z * N.mp + (k.a - k.z) * N.mn - k.m;
    return { dm, El: dm * N.u_MeV, El_A: (dm * N.u_MeV) / k.a };
  };
})(window.Labo);

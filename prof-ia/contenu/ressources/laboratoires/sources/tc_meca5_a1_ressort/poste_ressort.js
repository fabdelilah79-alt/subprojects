/*
Rôle : paillasse « ressort » : potence, ressort à spires avec son index et sa règle, coffret de masses marquées.
       On accroche les masses en chaîne sous le ressort (règles de accrochage.js).
Reçoit : le groupe SVG de la paillasse ; { raideur (N/m), l0_cm, couleur, prefixe (des faits notés), etiquette }.
Produit : Labo.poste_ressort(groupe, reglages) -> { pense_bete } ; faits : <prefixe>poids_mesures (masses en kg), ...
Utilisé par : simulation.js.
*/
(function (L) {
  const PLACES = [170, 198, 228, 262, 298, 342];

  L.poste_ressort = function (g, { raideur, l0_cm, couleur, prefixe, etiquette }) {
    // Construit la paillasse et branche l'accrochage des masses sous le ressort.
    const fond = L.svg("g", {}, g);
    const attache = L.potence(fond);
    L.coffret_masses(fond, PLACES, 150, 372, 490);
    L.svg("rect", { x: 700, y: 356, width: 190, height: 30, rx: 3, fill: "#f7f5ee", stroke: "#c9c3b0" }, fond);
    L.texte(fond, 795, 371, etiquette, { class: "etiquette-carton", "font-size": 16 });
    const calques = { poses: L.svg("g", {}, g) };
    const ressort = new L.Ressort(L.svg("g", { filter: "url(#ombre)" }, g), attache, { raideur, l0_cm, px_par_cm: 10, couleur });
    calques.suspendus = L.svg("g", {}, g);
    const cible = L.svg("circle", { r: 12, class: "zone-depot" }, g);
    calques.main = L.svg("g", {}, g);
    const objets = L.MASSES_MARQUEES.map((d, i) => new L.ObjetSuspendu(calques.poses, { ...d, type: "masse", place: i }));
    L.accrochage({ dyn: ressort, objets, calques, places: PLACES, cible, prefixe });
    return { pense_bete: L.decor.pense_bete(g, 24, 52, 230) };
  };
})(window.Labo);

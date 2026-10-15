/*
Rôle : paillasse 1 « Le poids d'un corps » : potence en fonte et acier, dynamomètre suspendu, coffret en bois
       de masses marquées, caillou de masse inconnue avec son étiquette.
Reçoit : le groupe SVG de la paillasse (décor déjà dessiné).
Produit : Labo.poste_poids(groupe) -> { pense_bete } ; les gestes notent leurs faits (voir accrochage.js).
Utilisé par : simulation.js.
*/
(function (L) {
  const PLACES = [170, 198, 228, 262, 298, 342];

  function etiquette_caillou(g) {
    // Petit carton posé à plat devant le caillou.
    L.svg("path", { d: "M650 553 H748 L756 571 H642 Z", fill: "#fbf7ea", stroke: "#cfc6ad", "stroke-width": 0.8 }, g);
    L.texte(g, 699, 562.5, "Caillou : m = ?", { class: "etiquette-carton", "font-size": 16 });
  }

  function objets(calque) {
    // Les six masses marquées (dans leurs logements) et le caillou (sur la paillasse).
    const liste = L.MASSES_MARQUEES.map((d, i) => new L.ObjetSuspendu(calque, { ...d, type: "masse", place: i }));
    liste.push(new L.ObjetSuspendu(calque, { type: "caillou", masse_kg: 0.35 }));
    return liste;
  }

  L.poste_poids = function (g) {
    // Construit la paillasse du poids et branche ses gestes.
    const fond = L.svg("g", {}, g);
    L.decor.etagere(fond, 730, 196, 240);
    L.potence(fond);
    L.coffret_masses(fond, PLACES, 150, 372, 490);
    etiquette_caillou(fond);
    const calques = { poses: L.svg("g", {}, g) };
    const dyn = new L.Dynamometre(L.svg("g", { filter: "url(#ombre)" }, g), 604, 47);
    calques.suspendus = L.svg("g", {}, g);
    const cible = L.svg("circle", { r: 12, class: "zone-depot" }, g);
    calques.main = L.svg("g", {}, g);
    const liste = objets(calques.poses);
    const regles = L.accrochage({ dyn, objets: liste, calques, places: PLACES, cible });
    const caillou = liste[liste.length - 1];
    regles.poser(caillou, 699, 545, false);
    return { pense_bete: L.decor.pense_bete(g, 24, 52, 230) };
  };
})(window.Labo);

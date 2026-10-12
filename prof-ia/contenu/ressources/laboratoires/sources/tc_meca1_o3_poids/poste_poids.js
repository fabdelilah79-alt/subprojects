/*
Rôle : paillasse 1 « Le poids d'un corps » : potence en fonte et acier, dynamomètre suspendu, coffret en bois
       de masses marquées, caillou de masse inconnue avec son étiquette.
Reçoit : le groupe SVG de la paillasse (décor déjà dessiné).
Produit : Labo.poste_poids(groupe) -> { pense_bete } ; les gestes notent leurs faits (voir accrochage.js).
Utilisé par : simulation.js.
*/
(function (L) {
  const PLACES = [170, 198, 228, 262, 298, 342];

  function potence(g) {
    // Socle lourd vu un peu d'en haut, tige verticale, noix de serrage, tige horizontale et crochet.
    L.ombre_sol(g, 485, 530, 92, 10, 0.5);
    L.svg("path", { d: "M412 504 H564 L556 520 H404 Z", fill: "#3a3f45" }, g);
    L.svg("rect", { x: 404, y: 520, width: 152, height: 13, rx: 2, fill: "url(#acier)" }, g);
    L.svg("ellipse", { cx: 478, cy: 512, rx: 9, ry: 3, fill: "#22262a" }, g);
    L.svg("rect", { x: 473, y: 14, width: 10, height: 498, fill: "url(#metal)" }, g);
    L.svg("rect", { x: 478, y: 22, width: 134, height: 7, fill: "url(#metal-h)" }, g);
    L.svg("rect", { x: 466, y: 14, width: 24, height: 22, rx: 3, fill: "url(#acier)" }, g);
    L.svg("rect", { x: 488, y: 20, width: 12, height: 5, rx: 2, fill: "#1b1e21" }, g);
    L.svg("path", { d: "M604 29 V36 a5 5 0 1 1 -5 5", fill: "none", stroke: "url(#metal)", "stroke-width": 2.2, "stroke-linecap": "round" }, g);
  }

  function coffret(g) {
    // Coffret en bois ouvert, avec un logement par masse.
    L.ombre_sol(g, 262, 530, 118, 9, 0.5);
    L.svg("path", { d: "M160 478 H362 L372 494 H150 Z", fill: "url(#bois)" }, g);
    PLACES.forEach((x, i) => L.svg("ellipse", { cx: x, cy: 489, rx: L.MASSES_MARQUEES[i].largeur / 2 + 2, ry: 3.5, fill: "#4a2f14" }, g));
    L.svg("rect", { x: 150, y: 494, width: 222, height: 34, fill: "url(#bois-face)" }, g);
    L.svg("rect", { x: 150, y: 494, width: 222, height: 2, fill: "#e2bb85" }, g);
    L.texte(g, 261, 512, "Masses marquées", { class: "etiquette-carton", fill: "#f3e3c7", "font-size": 18 });
  }

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
    potence(fond);
    coffret(fond);
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

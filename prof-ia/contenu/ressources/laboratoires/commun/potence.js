/*
Rôle : potence de laboratoire (socle lourd, tige verticale, noix de serrage, tige horizontale terminée par un crochet)
       et coffret en bois de masses marquées, avec un logement par masse.
Reçoit : le groupe SVG ; la position de la tige et du crochet ; les places du coffret.
Produit : Labo.potence(groupe, { x, haut, bras }) -> point du crochet ; Labo.coffret_masses(groupe, places, x1, x2, base).
Utilisé par : poste_poids.js (tc_meca1_o3_poids), les postes du chapitre « Équilibre d'un solide ».
*/
(function (L) {
  L.potence = function (g, { x = 478, haut = 14, bras = 126, socle = 504 } = {}) {
    // Socle vu un peu d'en haut, tige, noix, bras horizontal et crochet au bout ; renvoie le point d'accroche.
    L.ombre_sol(g, x + 7, socle + 26, 92, 10, 0.5);
    L.svg("path", { d: `M${x - 66} ${socle} H${x + 86} L${x + 78} ${socle + 16} H${x - 74} Z`, fill: "#3a3f45" }, g);
    L.svg("rect", { x: x - 74, y: socle + 16, width: 152, height: 13, rx: 2, fill: "url(#acier)" }, g);
    L.svg("ellipse", { cx: x, cy: socle + 8, rx: 9, ry: 3, fill: "#22262a" }, g);
    L.svg("rect", { x: x - 5, y: haut, width: 10, height: socle + 8 - haut, fill: "url(#metal)" }, g);
    L.svg("rect", { x, y: haut + 8, width: bras + 8, height: 7, fill: "url(#metal-h)" }, g);
    L.svg("rect", { x: x - 12, y: haut, width: 24, height: 22, rx: 3, fill: "url(#acier)" }, g);
    L.svg("rect", { x: x + 10, y: haut + 6, width: 12, height: 5, rx: 2, fill: "#1b1e21" }, g);
    const c = { x: x + bras, y: haut + 15 };
    L.svg("path", { d: `M${c.x} ${c.y} V${c.y + 7} a5 5 0 1 1 -5 5`, fill: "none", stroke: "url(#metal)", "stroke-width": 2.2, "stroke-linecap": "round" }, g);
    return { x: c.x, y: c.y + 7 };
  };

  L.coffret_masses = function (g, places, x1, x2, base) {
    // Coffret en bois ouvert, un logement par masse marquée (L.MASSES_MARQUEES), étiquette sur la face avant.
    const cx = (x1 + x2) / 2;
    L.ombre_sol(g, cx, base + 40, (x2 - x1) / 2 + 8, 9, 0.5);
    L.svg("path", { d: `M${x1 + 10} ${base - 12} H${x2 - 10} L${x2} ${base + 4} H${x1} Z`, fill: "url(#bois)" }, g);
    places.forEach((x, i) => L.svg("ellipse", { cx: x, cy: base - 1, rx: L.MASSES_MARQUEES[i].largeur / 2 + 2, ry: 3.5, fill: "#4a2f14" }, g));
    L.svg("rect", { x: x1, y: base + 4, width: x2 - x1, height: 34, fill: "url(#bois-face)" }, g);
    L.svg("rect", { x: x1, y: base + 4, width: x2 - x1, height: 2, fill: "#e2bb85" }, g);
    L.texte(g, cx, base + 22, "Masses marquées", { class: "etiquette-carton", fill: "#f3e3c7", "font-size": 18 });
  };
})(window.Labo);

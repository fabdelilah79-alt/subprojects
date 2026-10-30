/*
Rôle : pièces détaillées du banc à coussin d'air, dessinées comme le matériel des catalogues scolaires : mobile en aluminium
       (plaque supérieure rouge anodisée, flancs qui enserrent le rail, vis, crochets à œillet, tige filetée du réflecteur),
       réflecteur carré en plastique vu de trois quarts, palette d'amortissement en carton sur sa pince, aimant de freinage
       (monture en acier, deux pastilles aimantées, vis moletée), surcharge cylindrique en laiton, soufflerie (grille,
       interrupteur à voyant, embout du tuyau, pieds en caoutchouc).
Reçoit : le groupe SVG et la position de chaque pièce (px) ; HAUT = haut du rail.
Produit : Labo.pieces_banc = { mobile(g, x, haut, long, n, amortisseur), palette(g, x, y, couchee), aimant(g, x, y),
          surcharge(g, x, y), soufflerie(g, x, y) }.
Utilisé par : banc_ressort_dessin.js, banc_ressort_accessoires.js.
*/
(function (L) {
  function surcharge(g, x, y) {
    // Masse de 100 g en laiton (cylindre de 14 mm vu un peu d'en haut) posée sur y.
    L.svg("rect", { x: x - 7, y: y - 9, width: 14, height: 9, fill: "url(#laiton)", stroke: "#7a5a14", "stroke-width": 0.5 }, g);
    L.svg("ellipse", { cx: x, cy: y - 9, rx: 7, ry: 2.2, fill: "#e6c66e", stroke: "#7a5a14", "stroke-width": 0.5 }, g);
    L.svg("ellipse", { cx: x, cy: y - 9, rx: 1.6, ry: 0.6, fill: "#5a3d10" }, g);
  }

  function palette(g, x, y, couchee = false) {
    // Plaque de carton de 10 × 8 cm vue de trois quarts (ou couchée à plat sur le plateau), bord plus sombre, pince en métal.
    if (couchee) { L.svg("path", { d: `M${x - 18} ${y + 3} l6 -6 h30 l-6 6 Z`, fill: "#d2b27a", stroke: "#7a5a2a", "stroke-width": 0.6 }, g); L.svg("path", { d: `M${x - 18} ${y + 3} h30 v2 h-30 Z`, fill: "#a8854c" }, g); return; }
    L.svg("path", { d: `M${x} ${y} l9 -5 v-36 l-9 5 Z`, fill: "#d8bb85", stroke: "#7a5a2a", "stroke-width": 0.6 }, g);
    L.svg("path", { d: `M${x} ${y} h-2 v-36 l9 -5 h2 l-9 5 Z`, fill: "#a8854c" }, g);
    L.svg("rect", { x: x - 3, y: y - 4, width: 8, height: 6, rx: 1, fill: "url(#metal)", stroke: "#444", "stroke-width": 0.5 }, g);
  }

  function aimant(g, x, y, monte = false) {
    // Aimant de freinage : monture en acier ; sur le plateau, ses deux pastilles aimantées (face rouge) et sa vis moletée ;
    // monté, il est vissé sur le flanc du mobile, pastilles tournées vers le rail (on voit le dos de la monture et ses vis).
    if (monte) {
      L.svg("rect", { x: x - 12, y, width: 24, height: 10, rx: 2, fill: "url(#acier)", stroke: "#2a2e33", "stroke-width": 0.7 }, g);
      L.svg("rect", { x: x - 12, y: y + 7, width: 24, height: 3, fill: "#b8352c", opacity: 0.85 }, g);
      for (const dx of [-8, 8]) L.svg("circle", { cx: x + dx, cy: y + 4, r: 1.4, fill: "#d9dde0", stroke: "#444", "stroke-width": 0.4 }, g);
      return;
    }
    L.svg("rect", { x: x - 2, y: y - 4, width: 4, height: 5, fill: "url(#acier)", stroke: "#333", "stroke-width": 0.4 }, g);
    L.svg("rect", { x: x - 12, y, width: 24, height: 11, rx: 2, fill: "url(#acier)", stroke: "#2a2e33", "stroke-width": 0.7 }, g);
    for (const dx of [-6, 6]) { L.svg("circle", { cx: x + dx, cy: y + 5.5, r: 3.6, fill: "#3a3f44", stroke: "#111", "stroke-width": 0.5 }, g); L.svg("circle", { cx: x + dx, cy: y + 5.5, r: 2.4, fill: "#b8352c" }, g); }
  }

  function reflecteur(g, cx, haut) {
    // Tige filetée et réflecteur carré (5 cm) en plastique gris clair, vu de trois quarts, face tournée vers le capteur.
    L.svg("rect", { x: cx - 1, y: haut - 30, width: 2, height: 9, fill: "url(#acier)" }, g);
    L.svg("path", { d: `M${cx - 3} ${haut - 28} l7 -4 v-20 l-7 4 Z`, fill: "#e4e7ea", stroke: "#6a7177", "stroke-width": 0.6 }, g);
    L.svg("path", { d: `M${cx - 3} ${haut - 28} h-2 v-20 l7 -4 h2 l-7 4 Z`, fill: "#a9b0b6" }, g);
  }

  function mobile(g, x, haut, long, n, amortisseur) {
    // Mobile : flancs en aluminium autour du rail, plaque supérieure anodisée, vis, crochets à œillet, accessoires montés.
    const gr = L.svg("g", { class: "mobile-ressort", role: "button", "aria-label": "Mobile" }, g);
    if (amortisseur === "palette") palette(gr, x + 12, haut - 22);
    L.svg("path", { d: `M${x + 1} ${haut - 16} H${x + long - 1} V${haut + 7} l-2 2 H${x + 3} l-2 -2 Z`, fill: "url(#metal-h)", stroke: "#4b5258", "stroke-width": 0.7 }, gr);
    L.svg("line", { x1: x + 3, y1: haut + 5, x2: x + long - 3, y2: haut + 5, stroke: "#8a9298", "stroke-width": 0.5 }, gr);
    L.svg("rect", { x, y: haut - 22, width: long, height: 7, rx: 1.5, fill: "#b9352c", stroke: "#6b1813", "stroke-width": 0.7 }, gr);
    L.svg("rect", { x: x + 1.5, y: haut - 21.5, width: long - 3, height: 1.6, fill: "#fff", opacity: 0.3 }, gr);
    for (const dx of [5, long - 5]) L.svg("circle", { cx: x + dx, cy: haut - 18.5, r: 1.3, fill: "#d9dde0", stroke: "#555", "stroke-width": 0.4 }, gr);
    for (const [cx, s] of [[x, -1], [x + long, 1]]) L.svg("path", { d: `M${cx} ${haut - 14} h${3 * s} a2.2 2.2 0 1 ${s > 0 ? 1 : 0} 0 0.1`, fill: "none", stroke: "url(#acier)", "stroke-width": 1.4 }, gr);
    reflecteur(gr, x + long / 2, haut);
    for (let k = 0; k < n; k++) surcharge(gr, x + (k ? long - 11 : 11), haut - 22);
    if (amortisseur === "aimant") aimant(gr, x + 24, haut - 7, true);
    L.svg("rect", { x: x - 4, y: haut - 70, width: long + 8, height: 90, fill: "#000", opacity: 0.001 }, gr);
    return gr;
  }

  function soufflerie(g, x, y) {
    // Soufflerie posée sur ses pieds : caisson, grille d'aspiration, interrupteur à bascule et voyant, embout du tuyau.
    L.ombre_sol(g, x + 38, y + 35, 44, 4, 0.35);
    for (const dx of [8, 68]) L.svg("rect", { x: x + dx - 4, y: y + 32, width: 8, height: 3, rx: 1, fill: "#1b1e21" }, g);
    L.svg("rect", { x, y, width: 76, height: 32, rx: 4, fill: "#5d6e7b", stroke: "#222" }, g);
    L.svg("rect", { x: x + 2, y: y + 1, width: 72, height: 3, rx: 1.5, fill: "#fff", opacity: 0.18 }, g);
    for (let k = 0; k < 5; k++) L.svg("rect", { x: x + 8, y: y + 8 + k * 4, width: 34, height: 1.8, rx: 0.9, fill: "#2b333a" }, g);
    L.svg("rect", { x: x + 50, y: y + 9, width: 9, height: 13, rx: 1.5, fill: "#1b1e21" }, g);
    L.svg("rect", { x: x + 51.5, y: y + 10, width: 6, height: 6, rx: 1, fill: "#c62828" }, g);
    L.svg("circle", { cx: x + 66, cy: y + 12, r: 2, fill: "#7dff9a", stroke: "#1b3d22", "stroke-width": 0.5 }, g);
    L.svg("rect", { x: x + 28, y: y - 5, width: 12, height: 6, rx: 1, fill: "url(#acier)", stroke: "#333", "stroke-width": 0.5 }, g);
    L.texte(g, x + 38, y + 29, "SOUFFLERIE", { "font-size": 5, "font-weight": 700, fill: "#e6ebef" });
  }

  L.pieces_banc = { mobile, palette, aimant, surcharge, soufflerie };
})(window.Labo);

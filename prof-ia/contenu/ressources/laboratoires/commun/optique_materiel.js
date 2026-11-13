/*
Rôle : matériel d'optique dessiné en 2,5D (vu de face, un peu d'en haut, avec ombres et reflets) : pied en fonte avec sa
       tige et une noix de serrage ; lampe à incandescence sur douille (filament, halo quand elle est allumée) ; module
       laser cylindrique (corps métallique, bague, lentille, voyant) orientable ; écran de carton percé, tenu par une noix
       sur la tige d'un pied (vu un peu de biais, avec son épaisseur).
Reçoit : le groupe SVG et les réglages de chaque objet (positions à l'écran).
Produit : Labo.pied_support(g, x, sol, haut) ; Labo.noix(g, x, y) ; Labo.lampe_douille(g, { x, y, allumee }) ;
          Labo.laser_module(g, { x, y, angle, allume, longueur }) ; Labo.ecran_perce(g, { x, y, trou }).
Utilisé par : les simulations d'optique.
*/
(function (L) {
  L.pied_support = function (g, x, sol, haut) {
    // Pied en fonte (ombre, socle bombé), tige d'acier jusqu'à la hauteur haut.
    L.ombre_sol(g, x + 4, sol + 2, 46, 8, 0.45);
    L.svg("ellipse", { cx: x, cy: sol - 2, rx: 40, ry: 9, fill: "#1f2327" }, g);
    L.svg("ellipse", { cx: x, cy: sol - 6, rx: 38, ry: 8, fill: "url(#acier)", stroke: "#111" }, g);
    L.svg("ellipse", { cx: x - 8, cy: sol - 8, rx: 16, ry: 2.5, fill: "#fff", opacity: 0.15 }, g);
    L.tige(g, `M${x} ${sol - 8} V${haut}`, 6);
  };

  L.noix = function (g, x, y) {
    // Noix de serrage : bloc d'aluminium et sa vis à tête moletée.
    L.svg("rect", { x: x - 9, y: y - 8, width: 18, height: 16, rx: 2, fill: "url(#metal)", stroke: "#444" }, g);
    L.svg("rect", { x: x + 9, y: y - 3, width: 8, height: 6, fill: "#555" }, g);
    L.svg("circle", { cx: x + 20, cy: y, r: 5, fill: "#2b2f33", stroke: "#000" }, g);
  };

  L.lampe_douille = function (g, { x, y, allumee }) {
    // Douille noire tenue par une noix, ampoule de verre, filament (rougeoyant si allumée), halo.
    if (allumee) { L.svg("circle", { cx: x, cy: y - 20, r: 60, fill: "url(#halo)" }, g); }
    L.svg("rect", { x: x - 11, y: y - 4, width: 22, height: 26, rx: 3, fill: "#24282c", stroke: "#000" }, g);
    for (let k = 0; k < 4; k++) L.svg("line", { x1: x - 11, y1: y + 2 + 5 * k, x2: x + 11, y2: y + 2 + 5 * k, stroke: "#3c4248" }, g);
    L.svg("path", { d: `M${x - 9} ${y - 2} C${x - 22} ${y - 18} ${x - 20} ${y - 46} ${x} ${y - 46} C${x + 20} ${y - 46} ${x + 22} ${y - 18} ${x + 9} ${y - 2} Z`, fill: allumee ? "#fff8d6" : "url(#verre)", stroke: "#9fb6be", "stroke-width": 1.2, opacity: allumee ? 0.95 : 1 }, g);
    L.svg("path", { d: `M${x - 4} ${y - 4} L${x - 6} ${y - 26} M${x + 4} ${y - 4} L${x + 6} ${y - 26} M${x - 6} ${y - 26} q3 -4 6 0 q3 4 6 0`, fill: "none", stroke: allumee ? "#ff9d2e" : "#6b6b6b", "stroke-width": allumee ? 1.6 : 1 }, g);
    L.svg("ellipse", { cx: x - 8, cy: y - 32, rx: 3, ry: 7, fill: "#fff", opacity: 0.5 }, g);
  };

  L.laser_module = function (g, { x, y, angle = 0, allume = true, longueur = 70 }) {
    // Corps cylindrique (dégradé métallique), bague noire, lentille à l'avant (vers +x avant rotation), voyant.
    const c = L.svg("g", { transform: `translate(${x} ${y}) rotate(${angle})` }, g);
    L.svg("rect", { x: -longueur, y: -9, width: longueur, height: 18, rx: 4, fill: "url(#metal-h)", stroke: "#333" }, c);
    L.svg("rect", { x: -longueur + 6, y: -9, width: 8, height: 18, fill: "#22262a" }, c);
    L.svg("rect", { x: -6, y: -10, width: 8, height: 20, rx: 2, fill: "#2b2f33" }, c);
    L.svg("ellipse", { cx: 2, cy: 0, rx: 2, ry: 6, fill: "#9fd6ff", stroke: "#333", "stroke-width": 0.6 }, c);
    L.svg("circle", { cx: -longueur + 24, cy: -4, r: 2.4, fill: allume ? "#ff3b2a" : "#5a1b16" }, c);
    L.svg("rect", { x: -longueur + 30, y: -6, width: 22, height: 7, rx: 1, fill: "#ffd54f" }, c);
    L.texte(c, -longueur + 41, -2.5, "CLASSE 2", { "font-size": 3.6, "font-weight": 700, fill: "#222" });
    return c;
  };

  L.ecran_perce = function (g, { x, y, trou = true }) {
    // Carton de 12 cm vu un peu de biais (face avant, tranche), trou noir au centre ; tenu à sa base par une noix.
    L.svg("path", { d: `M${x - 6} ${y - 54} L${x + 4} ${y - 60} L${x + 4} ${y + 48} L${x - 6} ${y + 54} Z`, fill: "#7a5a33" }, g);
    L.svg("path", { d: `M${x - 6} ${y - 54} L${x - 22} ${y - 46} L${x - 22} ${y + 62} L${x - 6} ${y + 54} Z`, fill: "#c39a63", stroke: "#6d4a26", "stroke-width": 0.8 }, g);
    L.svg("path", { d: `M${x - 6} ${y - 54} L${x - 22} ${y - 46} L${x - 22} ${y + 62} L${x - 6} ${y + 54} Z`, fill: "url(#reflet)" }, g);
    if (trou) L.svg("ellipse", { cx: x - 13, cy: y + 4, rx: 2.6, ry: 4, fill: "#0b0b0b" }, g);
    L.noix(g, x - 4, y + 66);
  };
})(window.Labo);

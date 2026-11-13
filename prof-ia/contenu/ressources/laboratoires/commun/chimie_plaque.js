/*
Rôle : plaque chauffante de chimie : boîtier blanc, plateau en fonte, bouton de réglage, voyant rouge allumé quand elle
       chauffe ; version interactive avec une touche Marche/Arrêt.
Reçoit : le groupe SVG, la position { x (milieu), bas } et, pour la version interactive, une fonction appelée à chaque
         changement (allumée ou non).
Produit : Labo.dessin_plaque(g, x, bas, allumee) ; Labo.plaque_chauffante(g, { x, bas, changer }) -> { allumee }.
Utilisé par : chimie_chauffage.js et les simulations de chimie (décoction, hydrodistillation).
*/
(function (L) {
  L.dessin_plaque = function (g, x, bas, allumee) {
    // Plaque chauffante vue de face ; le plateau rougeoie un peu quand elle chauffe.
    g.replaceChildren();
    L.svg("ellipse", { cx: x + 4, cy: bas + 2, rx: 70, ry: 6, fill: "#000", opacity: 0.3 }, g);
    L.svg("rect", { x: x - 66, y: bas - 30, width: 132, height: 30, rx: 4, fill: "#e8eaea", stroke: "#a7adb0" }, g);
    L.svg("rect", { x: x - 60, y: bas - 36, width: 120, height: 8, rx: 2, fill: allumee ? "#5a3a30" : "#3b3f43" }, g);
    L.svg("circle", { cx: x + 44, cy: bas - 15, r: 7, fill: "#30353a" }, g);
    L.svg("line", { x1: x + 44, y1: bas - 15, x2: x + 48, y2: bas - 20, stroke: "#fff", "stroke-width": 1.4 }, g);
    L.svg("circle", { cx: x + 26, cy: bas - 15, r: 2.6, fill: allumee ? "#ff3b2f" : "#5b2420" }, g);
    L.texte(g, x - 34, bas - 14, "PLAQUE CHAUFFANTE", { "font-size": 4.8, "font-weight": 700, fill: "#566066" });
  };

  L.plaque_chauffante = function (g, { x, bas, changer = () => {} }) {
    // Plaque avec touche Marche/Arrêt (à gauche du voyant).
    const p = { allumee: false }, dessin = L.svg("g", {}, g);
    L.dessin_plaque(dessin, x, bas, false);
    L.bouton_rond(g, x + 8, bas - 15, "I/O", () => { p.allumee = !p.allumee; L.dessin_plaque(dessin, x, bas, p.allumee); changer(p.allumee); }, 7);
    return p;
  };
})(window.Labo);

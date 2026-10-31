/*
Rôle : bougie blanche dans un bougeoir de laiton, vue en 2,5D, à une profondeur donnée (plus petite quand elle est plus
       loin) ; flamme vacillante si elle est allumée ; « image » de flamme pâle (reflet vu dans la vitre).
Reçoit : le groupe SVG et { x, y (pied, écran), s (échelle), allumee, image (flamme seule, pâle), t (temps, s) }.
Produit : Labo.bougie(g, reglage).
Utilisé par : poste_bougies.js.
*/
(function (L) {
  function flamme(g, x, y, s, t, opacite) {
    // Halo, flamme en goutte (jaune et orange), cœur bleuté.
    const v = 1 + 0.06 * Math.sin(t * 13) + 0.04 * Math.sin(t * 7.3);
    L.svg("circle", { cx: x, cy: y - 14 * s, r: 26 * s, fill: "url(#halo)", opacity: opacite }, g);
    L.svg("path", { d: `M${x} ${y - 30 * s * v} C${x + 7 * s} ${y - 16 * s} ${x + 6 * s} ${y - 3 * s} ${x} ${y - 2 * s} C${x - 6 * s} ${y - 3 * s} ${x - 7 * s} ${y - 16 * s} ${x} ${y - 30 * s * v} Z`, fill: "#ffcf4a", opacity: opacite }, g);
    L.svg("ellipse", { cx: x, cy: y - 7 * s, rx: 2.6 * s, ry: 5 * s, fill: "#ff8a1e", opacity: opacite }, g);
    L.svg("ellipse", { cx: x, cy: y - 3 * s, rx: 1.6 * s, ry: 2.2 * s, fill: "#5b7bd6", opacity: 0.7 * opacite }, g);
  }

  L.bougie = function (g, { x, y, s = 1, allumee = false, image = false, t = 0 }) {
    // Ombre, bougeoir, bougie (cire, reflet), mèche, flamme ; ou seulement la flamme pâle d'une image.
    const h = 70 * s, r = 9 * s, haut = y - 10 * s - h;
    if (image) { flamme(g, x, haut, s, t, 0.45); return; }
    L.ombre_sol(g, x + 4 * s, y + 2, 22 * s, 5 * s, 0.45);
    L.svg("ellipse", { cx: x, cy: y - 2 * s, rx: 20 * s, ry: 5 * s, fill: "url(#laiton)", stroke: "#6d4a0e", "stroke-width": 0.6 }, g);
    L.svg("rect", { x: x - 11 * s, y: y - 12 * s, width: 22 * s, height: 10 * s, rx: 2, fill: "url(#laiton)" }, g);
    L.svg("rect", { x: x - r, y: haut, width: 2 * r, height: h, fill: "#f6f1e3", stroke: "#cfc6ad", "stroke-width": 0.6 }, g);
    L.svg("rect", { x: x - r * 0.6, y: haut, width: r * 0.35, height: h, fill: "#fff", opacity: 0.6 }, g);
    L.svg("ellipse", { cx: x, cy: haut, rx: r, ry: 2.4 * s, fill: "#ebe4cf" }, g);
    L.svg("line", { x1: x, y1: haut, x2: x + 0.5, y2: haut - 6 * s, stroke: "#222", "stroke-width": 1.4 * s }, g);
    if (allumee) flamme(g, x, haut - 4 * s, s, t, 1);
  };
})(window.Labo);

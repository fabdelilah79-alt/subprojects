/*
Rôle : dessin du tube à grenaille (échelle 0,4 px/mm) : tube de carton de 1,10 m fermé par deux bouchons, monté sur un
       axe au milieu (support et manivelle), grenaille de plomb (500 g) qui repose au bout le plus bas ; thermomètre
       électronique dont la sonde passe par l'axe ; compteur des chutes ; fiche des données.
Reçoit : le groupe SVG ; l'angle du tube (rad), la position de la grenaille dans le tube (px, axe du tube), T, n.
Produit : Labo.tube_dessin = { fond(g), tube(g, phi, s), afficheurs(g, T, n), P, DEMI, BUTEE }.
Utilisé par : poste_tube.js.
*/
(function (L) {
  const P = { x: 420, y: 320 }, DEMI = 220, BUTEE = 200, TABLE = 560;
  const GRAINS = Array.from({ length: 36 }, (_, k) => ({ x: ((k * 37) % 15) - 7, y: ((k * 53) % 19) - 9 }));

  function fond(g) {
    // Support (pied et colonne), câble de la sonde jusqu'au thermomètre, thermomètre, compteur, fiche des données.
    L.svg("rect", { x: P.x - 70, y: TABLE - 12, width: 140, height: 12, rx: 3, fill: "#3a3f44" }, g);
    L.svg("path", { d: `M${P.x - 14} ${TABLE - 12} L${P.x - 8} ${P.y} H${P.x + 8} L${P.x + 14} ${TABLE - 12} Z`, fill: "#4b555c", stroke: "#1b1e21" }, g);
    L.svg("path", { d: `M${P.x + 6} ${P.y + 4} C${P.x + 90} ${P.y + 60} 620 380 680 380`, fill: "none", stroke: "#1b1e21", "stroke-width": 2 }, g);
    L.svg("rect", { x: 680, y: 352, width: 150, height: 62, rx: 6, fill: "#e9b949", stroke: "#6b5300" }, g);
    L.texte(g, 755, 365, "THERMOMÈTRE", { "font-size": 7.5, "font-weight": 700, fill: "#3b2a05" });
    L.svg("rect", { x: 692, y: 372, width: 126, height: 28, rx: 3, fill: "#1d2a22" }, g);
    L.svg("rect", { x: 680, y: 450, width: 150, height: 56, rx: 6, fill: "#c7ccd0", stroke: "#555" }, g);
    L.texte(g, 755, 463, "COMPTEUR DE CHUTES", { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
    L.svg("rect", { x: 712, y: 470, width: 86, height: 26, rx: 3, fill: "#1d1d1d" }, g);
    L.svg("rect", { x: 600, y: 150, width: 290, height: 76, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0" }, g);
    ["Grenaille de plomb : m = 500 g", "c(plomb) = 129 J·kg⁻¹·K⁻¹ ; g = 9,81 N/kg", "Chute à chaque retournement : h = 1,00 m"].forEach((t, i) => L.texte(g, 745, 170 + i * 18, t, { "font-size": 9, fill: "#222" }));
  }

  function tube(g, phi, s) {
    // Tube tourné de phi autour de l'axe ; grenaille centrée en s (axe du tube, vers le bouchon B positif) ; manivelle.
    const gr = L.svg("g", { class: "tube-grenaille", role: "button", "aria-label": "Tube à grenaille", transform: `rotate(${(phi * 180) / Math.PI} ${P.x} ${P.y})` }, g);
    L.svg("rect", { x: P.x - 11, y: P.y - DEMI, width: 22, height: 2 * DEMI, rx: 4, fill: "#c9a46b", stroke: "#6b4a2a" }, gr);
    L.svg("rect", { x: P.x - 7, y: P.y - DEMI + 8, width: 14, height: 2 * DEMI - 16, fill: "#8a6a3e", opacity: 0.35 }, gr);
    for (const k of [-1, 1]) L.svg("rect", { x: P.x - 13, y: P.y + k * DEMI - (k > 0 ? 8 : 0), width: 26, height: 8, rx: 2, fill: "#2b3035" }, gr);
    L.texte(gr, P.x, P.y - DEMI + 20, "A", { "font-size": 9, "font-weight": 700, fill: "#3b2a12" });
    L.texte(gr, P.x, P.y + DEMI - 14, "B", { "font-size": 9, "font-weight": 700, fill: "#3b2a12" });
    GRAINS.forEach((q) => L.svg("circle", { cx: P.x + q.x * 0.8, cy: P.y + s + q.y * 0.5, r: 2.2, fill: "#6e737a", stroke: "#3a3d42", "stroke-width": 0.4 }, gr));
    L.svg("circle", { cx: P.x, cy: P.y, r: 9, fill: "url(#metal)", stroke: "#333" }, gr);
    L.svg("line", { x1: P.x, y1: P.y, x2: P.x + 30, y2: P.y, stroke: "#3a3f44", "stroke-width": 5, "stroke-linecap": "round" }, gr);
    L.svg("circle", { cx: P.x + 32, cy: P.y, r: 6, fill: "#c0392b", stroke: "#5a1a12" }, gr);
    L.svg("rect", { x: P.x - 30, y: P.y - DEMI - 10, width: 60, height: 2 * DEMI + 20, fill: "#000", opacity: 0.001 }, gr);
  }

  function afficheurs(g, T, n) {
    // Température (au dixième de degré) et nombre de chutes de la grenaille.
    const o = { "font-size": 13, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" };
    L.texte(g, 755, 391, `${T.toFixed(1).replace(".", ",")} °C`, o);
    L.texte(g, 755, 488, String(n), { ...o, fill: "#ffb347" });
  }

  L.tube_dessin = { fond, tube, afficheurs, P, DEMI, BUTEE };
})(window.Labo);

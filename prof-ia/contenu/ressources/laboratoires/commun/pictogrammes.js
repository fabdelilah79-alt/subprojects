/*
Rôle : pictogrammes de danger du système général harmonisé (SGH), dessinés comme sur les étiquettes : losange à bord
       rouge, fond blanc, symbole noir. SGH02 flamme (inflammable), SGH05 corrosion, SGH07 point d'exclamation (nocif,
       irritant), SGH09 environnement (arbre et poisson).
Reçoit : le groupe SVG, le centre (x, y), la demi-diagonale d (px) et le code ("SGH02", "SGH05", "SGH07", "SGH09").
Produit : Labo.pictogramme(g, x, y, d, code) ; Labo.DANGERS = { code : texte }.
Utilisé par : les simulations de chimie (étiquettes, fiches de sécurité).
*/
(function (L) {
  L.DANGERS = { SGH02: "inflammable", SGH05: "corrosif", SGH07: "nocif, irritant", SGH09: "dangereux pour l'environnement" };
  const SYMBOLES = {
    // Symboles dans un carré de 20 × 20 centré en (0, 0).
    SGH02: "M-6 7 H6 M0 5 C-6 4 -6 -2 -2 -6 C-2 -2 0 -1 1 -4 C4 -1 6 4 0 5 Z M0 5 C-2 3 -2 0 0 -2 C1 0 2 2 0 5 Z",
    SGH05: "M-8 -6 L-5 -9 M-6 -7 L-2 -3 M2 -8 L5 -5 M3 -6 L7 -2 M-3 -1 V1 M5 0 V2 M-8 5 H-1 Q0 3 -2 2 L-6 3 M1 6 H8 V4 L5 3 L3 5 Z",
    SGH07: "M-1.4 -7 H1.4 L0.8 3 H-0.8 Z M0 5.2 A1.4 1.4 0 1 0 0.01 5.2 Z",
    SGH09: "M-7 7 V-2 M-7 -2 L-9 -6 M-7 0 L-4 -5 M-7 2 L-10 -1 M-1 4 Q3 1 7 4 Q3 7 -1 4 Z M-1 4 L-3 2 M-1 4 L-3 6 M-9 7 H9",
  };

  L.pictogramme = function (g, x, y, d, code) {
    // Losange rouge et blanc, symbole noir mis à l'échelle.
    const p = L.svg("g", { transform: `translate(${x} ${y})` }, g), k = d / 14;
    L.svg("path", { d: `M0 ${-d} L${d} 0 L0 ${d} L${-d} 0 Z`, fill: "#fff", stroke: "#d01c1c", "stroke-width": Math.max(0.8, d * 0.13), "stroke-linejoin": "round" }, p);
    const s = L.svg("path", { d: SYMBOLES[code], transform: `scale(${k})`, fill: code === "SGH02" || code === "SGH07" ? "#111" : "none", stroke: "#111", "stroke-width": 1.4, "stroke-linecap": "round", "stroke-linejoin": "round" }, p);
    if (code === "SGH07") s.setAttribute("stroke-width", 0.2);
    return p;
  };
})(window.Labo);

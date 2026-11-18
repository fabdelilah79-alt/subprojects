/*
Rôle : prototype « titrage en 2,5D » : outil de dessin SVG et matières réalistes (métal chromé, verre, plastiques,
       liquide rose, résine de la paillasse), ombres douces ; lumière venant d'en haut à gauche (fenêtre).
Reçoit : le SVG de la scène.
Produit : P.el(nom, attributs, parent), P.matieres(svg), P.ombre(g, x, y, rx, ry), P.K (rapport des ovales, vue de 3/4).
Utilisé par : decor.js, materiel_*.js de ce prototype (proposition, aucun laboratoire n'est modifié).
*/
window.P = (function () {
  const NS = "http://www.w3.org/2000/svg";
  const P = { K: 0.28 };

  P.el = function (nom, attributs = {}, parent = null) {
    // Crée un élément SVG avec ses attributs et l'ajoute au parent.
    const e = document.createElementNS(NS, nom);
    for (const [k, v] of Object.entries(attributs)) e.setAttribute(k, v);
    if (parent) parent.append(e);
    return e;
  };

  function degrade(defs, id, arrets, x2 = 1, y2 = 0) {
    // Dégradé linéaire : arrets = [[position, couleur, opacité ?], ...].
    const g = P.el("linearGradient", { id, x1: 0, y1: 0, x2, y2 }, defs);
    for (const [o, c, a = 1] of arrets) P.el("stop", { offset: o, "stop-color": c, "stop-opacity": a }, g);
  }

  function rond(defs, id, arrets, cx = 0.35, cy = 0.3) {
    // Dégradé radial (boutons, bouchons, reflets ronds).
    const g = P.el("radialGradient", { id, cx, cy, r: 0.75 }, defs);
    for (const [o, c, a = 1] of arrets) P.el("stop", { offset: o, "stop-color": c, "stop-opacity": a }, g);
  }

  P.matieres = function (svg) {
    // Toutes les matières du prototype.
    const defs = P.el("defs", {}, svg);
    degrade(defs, "chrome", [[0, "#5d656b"], [0.18, "#c9d0d4"], [0.32, "#ffffff"], [0.5, "#a9b1b6"], [0.78, "#6c757b"], [1, "#3f464b"]]);
    degrade(defs, "acier-sombre", [[0, "#2c3236"], [0.4, "#4b545a"], [1, "#1d2124"]]);
    degrade(defs, "verre", [[0, "#9fc3cf", 0.55], [0.1, "#ffffff", 0.35], [0.22, "#e8f6fa", 0.08], [0.8, "#d8eef4", 0.06], [0.93, "#9fc3cf", 0.3], [1, "#6f97a5", 0.6]]);
    degrade(defs, "rose", [[0, "#c2185b", 0.78], [0.3, "#f06292", 0.62], [0.7, "#ec407a", 0.66], [1, "#ad1457", 0.85]]);
    degrade(defs, "soude", [[0, "#5d9cc8", 0.55], [0.4, "#cfe6f7", 0.35], [1, "#3f7fae", 0.65]]);
    degrade(defs, "blanc-plastique", [[0, "#cfd6db"], [0.25, "#ffffff"], [0.7, "#eef2f4"], [1, "#b9c2c8"]]);
    degrade(defs, "ambre", [[0, "#4a1d05", 0.95], [0.25, "#a0521a", 0.9], [0.45, "#d98a3d", 0.85], [0.8, "#7a3a10", 0.95], [1, "#3a1503"]]);
    degrade(defs, "pissette", [[0, "#cfe0ea", 0.85], [0.3, "#ffffff", 0.9], [0.75, "#e3edf3", 0.85], [1, "#a8bfcc", 0.9]]);
    degrade(defs, "dessus-paillasse", [[0, "#2c3640"], [0.6, "#3d4a55"], [1, "#4c5b67"]], 0, 1);
    degrade(defs, "lcd", [[0, "#b9e6a5"], [1, "#8cc47a"]], 0, 1);
    rond(defs, "bouton-noir", [[0, "#6b7378"], [0.6, "#25292c"], [1, "#0e1012"]]);
    rond(defs, "voyant", [[0, "#d7ffd0"], [0.4, "#3ddc2f"], [1, "#127a0b"]]);
    rond(defs, "soleil", [[0, "#fffbe0"], [0.5, "#ffe58a"], [1, "#ffd23f", 0]]);
    const flou = P.el("filter", { id: "flou", x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
    P.el("feGaussianBlur", { stdDeviation: 5 }, flou);
    const flou2 = P.el("filter", { id: "flou-leger", x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
    P.el("feGaussianBlur", { stdDeviation: 1.6 }, flou2);
  };

  P.ombre = function (g, x, y, rx, ry = rx * P.K) {
    // Ombre posée : grande ombre douce décalée vers la droite (lumière à gauche) + ombre de contact sombre.
    P.el("ellipse", { cx: x + rx * 0.18, cy: y + 2, rx: rx * 1.15, ry: ry * 1.25, fill: "#000", opacity: 0.32, filter: "url(#flou)" }, g);
    P.el("ellipse", { cx: x + 2, cy: y, rx: rx * 0.98, ry: ry * 0.9, fill: "#000", opacity: 0.35, filter: "url(#flou-leger)" }, g);
  };

  return P;
})();

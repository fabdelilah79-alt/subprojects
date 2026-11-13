/*
Rôle : dessin du banc à coussin d'air vu de côté (échelle 0,5 px/mm) : rail de 1,20 m sur ses pieds, soufflerie et son
       tuyau, lanceur à ressort à gauche (graduation de la compression), cellule photoélectrique à 50 cm câblée au
       chronomètre, curseur à frottement à 90 cm et sa règle (0 à 25 cm), mobile de 200 g avec son drapeau de 5,0 cm et ses
       surcharges de 100 g.
Reçoit : le groupe SVG ; les positions du mobile, du plateau du lanceur et du curseur (px).
Produit : Labo.banc_dessin = { fond(g), lanceur(g, xp), mobile(g, x, n), surcharge(g, x, y), curseur(g, x), X0, MM, HAUT,
          X_CELLULE, X_CURSEUR, X_REPOS, LONG_MOBILE }.
Utilisé par : poste_banc.js.
*/
(function (L) {
  const X0 = 220, MM = 0.5, HAUT = 470, TABLE = 560, X_CELLULE = X0 + 500 * MM, X_CURSEUR = X0 + 900 * MM, X_REPOS = X0 + 44, LONG_MOBILE = 60;

  function fond(g) {
    // Soufflerie et tuyau, pieds, rail, cellule (montant arrière, émetteur) et son câble, chronomètre, règle du curseur.
    L.svg("rect", { x: 262, y: TABLE - 34, width: 76, height: 34, rx: 4, fill: "#5a6b78", stroke: "#222" }, g);
    L.texte(g, 300, TABLE - 14, "soufflerie", { "font-size": 7, fill: "#eef" });
    L.svg("path", { d: `M${X0 + 2} ${HAUT + 9} C${X0 - 30} ${HAUT + 30} 260 ${TABLE - 70} 300 ${TABLE - 34}`, fill: "none", stroke: "#2b2f33", "stroke-width": 7 }, g);
    for (const x of [X0 + 30, X0 + 570]) L.svg("rect", { x: x - 4, y: HAUT + 14, width: 8, height: TABLE - HAUT - 14, fill: "url(#metal)" }, g);
    L.svg("rect", { x: X0, y: HAUT, width: 1200 * MM, height: 14, fill: "url(#metal-h)", stroke: "#5b646a" }, g);
    for (let k = 1; k < 40; k++) L.svg("circle", { cx: X0 + k * 15, cy: HAUT + 2, r: 0.8, fill: "#444" }, g);
    L.svg("rect", { x: X_CELLULE - 3, y: 400, width: 6, height: HAUT - 400, fill: "#2b3136" }, g);
    L.svg("rect", { x: X_CELLULE - 9, y: 422, width: 18, height: 16, rx: 2, fill: "#20262b" }, g);
    L.svg("path", { d: `M${X_CELLULE} 400 C${X_CELLULE} 370 ${X_CELLULE + 40} 360 ${X_CELLULE + 40} 345`, fill: "none", stroke: "#1f2d3a", "stroke-width": 2 }, g);
    L.svg("rect", { x: X_CELLULE - 20, y: 290, width: 130, height: 56, rx: 6, fill: "#c7ccd0", stroke: "#555" }, g);
    L.texte(g, X_CELLULE + 45, 303, "CHRONOMÈTRE (cellule)", { "font-size": 7, "font-weight": 700, fill: "#23315a" });
    L.svg("rect", { x: X_CELLULE - 12, y: 310, width: 114, height: 24, rx: 3, fill: "#1d2a22" }, g);
    L.svg("rect", { x: X_CURSEUR - 2, y: HAUT + 16, width: 250 * MM + 8, height: 10, fill: "#e8c75a", stroke: "#9b7d1f", "stroke-width": 0.6 }, g);
    for (let mm = 0; mm <= 250; mm += 5) L.svg("line", { x1: X_CURSEUR + mm * MM, y1: HAUT + 16, x2: X_CURSEUR + mm * MM, y2: HAUT + 16 + (mm % 50 ? (mm % 10 ? 2 : 4) : 6), stroke: "#3b2f0a", "stroke-width": 0.5 }, g);
    for (let cm = 0; cm <= 25; cm += 5) L.texte(g, X_CURSEUR + cm * 10 * MM, HAUT + 25, String(cm), { "font-size": 5.5, "font-weight": 700, fill: "#3b2f0a" });
  }

  function lanceur(g, xp) {
    // Butée fixe, ressort (spires) jusqu'au plateau, graduation de la compression (0 à 5 cm).
    L.svg("rect", { x: X0, y: HAUT - 30, width: 14, height: 30, fill: "#3a3f44" }, g);
    const n = 9, l = xp - X0 - 14;
    L.svg("path", { d: `M${X0 + 14} ${HAUT - 15} ` + Array.from({ length: n }, (_, k) => `l${l / n / 2} ${k % 2 ? 6 : -6} l${l / n / 2} ${k % 2 ? -6 : 6}`).join(" "), fill: "none", stroke: "#9aa3a9", "stroke-width": 1.4 }, g);
    L.svg("rect", { x: xp, y: HAUT - 27, width: 4, height: 24, fill: "#2b2f33" }, g);
    for (let mm = 0; mm <= 50; mm += 10) L.svg("line", { x1: X_REPOS - mm * MM, y1: HAUT - 34, x2: X_REPOS - mm * MM, y2: HAUT - 30, stroke: "#e8ecef", "stroke-width": 0.6 }, g);
    L.texte(g, X_REPOS, HAUT - 37, "0", { "font-size": 5.5, fill: "#e8ecef" });
    L.texte(g, X_REPOS - 25, HAUT - 37, "5 cm", { "font-size": 5.5, fill: "#e8ecef" });
  }

  function mobile(g, x, n) {
    // Mobile en U renversé sur le rail (12 cm), drapeau de 5,0 cm, n surcharges de 100 g ; x = arrière du mobile.
    const gr = L.svg("g", { class: "mobile-banc", role: "button", "aria-label": "Mobile" }, g);
    L.svg("path", { d: `M${x} ${HAUT + 6} V${HAUT - 20} H${x + LONG_MOBILE} V${HAUT + 6} h-5 V${HAUT - 14} H${x + 5} V${HAUT + 6} Z`, fill: "#c7362f", stroke: "#6b1813" }, gr);
    L.svg("rect", { x: x + LONG_MOBILE / 2 - 12.5, y: HAUT - 42, width: 25, height: 22, fill: "#1d1d1d" }, gr);
    L.svg("rect", { x: x - 4, y: HAUT - 46, width: LONG_MOBILE + 8, height: 54, fill: "#000", opacity: 0.001 }, gr);
    for (let k = 0; k < n; k++) surcharge(L.svg("g", { class: "surcharge-mobile" }, g), x + (k ? LONG_MOBILE - 12 : 12), HAUT - 20);
    return gr;
  }

  function surcharge(g, x, y) {
    // Surcharge en laiton de 100 g (disque vu de côté), posée sur y.
    L.svg("rect", { x: x - 9, y: y - 9, width: 18, height: 9, rx: 1.5, fill: "url(#laiton)", stroke: "#8a6a1e", "stroke-width": 0.5 }, g);
    L.texte(g, x, y - 2.5, "100 g", { "font-size": 4.5, "font-weight": 700, fill: "#4a370b" });
  }

  function curseur(g, x) {
    // Curseur à frottement (patin de feutre) ; sa face gauche est en x.
    L.svg("rect", { x, y: HAUT - 24, width: 22, height: 24, rx: 2, fill: "#4a5560", stroke: "#1b1e21" }, g);
    L.svg("rect", { x, y: HAUT - 3, width: 22, height: 3, fill: "#8f7a5a" }, g);
    L.svg("path", { d: `M${x} ${HAUT} v14`, stroke: "#e0251b", "stroke-width": 1.4 }, g);
  }

  L.banc_dessin = { fond, lanceur, mobile, surcharge, curseur, X0, MM, HAUT, TABLE, X_CELLULE, X_CURSEUR, X_REPOS, LONG_MOBILE };
})(window.Labo);

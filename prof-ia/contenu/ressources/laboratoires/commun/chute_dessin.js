/*
Rôle : dessin de l'appareil de chute libre (hauteurs à l'échelle 0,4 px/mm) : potence, électroaimant à 1,100 m au-dessus
       de la paillasse, règle verticale graduée (0 au niveau de la paillasse), réceptacle garni de mousse, boîtier de
       commande de l'électroaimant, chronomètre à deux voies ; cellules photoélectriques (fourches) et leurs câbles.
Reçoit : le groupe SVG ; les hauteurs des cellules et de la bille (m).
Produit : Labo.chute_dessin = { fond(g), regle(g), cellule(g, numero, z, coupee), bille(g, z), afficheurs(g, dt1, dt2), y_de(z),
          X_FIL, Z0 }.
Utilisé par : chute_libre.js.
*/
(function (L) {
  const MM = 0.4, TABLE = 560, X = 420, Z0 = 1.1, RAYON = 4, TIGE = 360;
  const y_de = (z) => TABLE - z * 1000 * MM;

  function fond(g) {
    // Potence et bras, électroaimant et son câble, réceptacle, règle, boîtiers ; chaque câble aboutit à une borne.
    L.svg("rect", { x: TIGE - 60, y: TABLE - 10, width: 120, height: 10, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, `M${TIGE} ${TABLE - 10} V70`, 8);
    L.svg("rect", { x: TIGE - 10, y: 84, width: 20, height: 20, rx: 3, fill: "#2c3e50", stroke: "#111" }, g);
    L.tige(g, `M${TIGE + 10} 94 H${X - 12}`, 6);
    L.svg("rect", { x: X - 13, y: 82, width: 26, height: y_de(Z0) - RAYON - 82, rx: 3, fill: "#7a2a22", stroke: "#2b0f0c" }, g);
    L.svg("path", { d: `M${X + 13} 92 C480 92 490 110 517 110`, fill: "none", stroke: "#1b1e21", "stroke-width": 2.4 }, g);
    L.svg("rect", { x: X - 30, y: TABLE - 30, width: 60, height: 30, fill: "url(#bois-face)", stroke: "#6b4a2a" }, g);
    L.svg("rect", { x: X - 26, y: TABLE - 30, width: 52, height: 8, fill: "#e7d06a" }, g);
    L.svg("rect", { x: 520, y: 62, width: 110, height: 90, rx: 6, fill: "#2c3e50", stroke: "#111" }, g);
    L.texte(g, 575, 76, "ÉLECTROAIMANT", { "font-size": 7.5, "font-weight": 700, fill: "#e8ecef" });
    L.svg("circle", { cx: 520, cy: 110, r: 3, fill: "#1b1e21" }, g);
    L.svg("rect", { x: 740, y: 230, width: 150, height: 92, rx: 6, fill: "#c7ccd0", stroke: "#555" }, g);
    L.texte(g, 815, 243, "CHRONOMÈTRE 2 VOIES", { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
    for (const [k, y] of [[1, 250], [2, 284]].values()) { L.svg("rect", { x: 768, y, width: 114, height: 24, rx: 3, fill: "#1d2a22" }, g); L.texte(g, 756, y + 15, String(k), { "font-size": 9, "font-weight": 700, fill: "#23315a" }); L.svg("circle", { cx: 740, cy: y + 12, r: 3, fill: "#1f2d3a" }, g); }
  }

  function regle(g) {
    // Règle verticale graduée en cm (0 au niveau de la paillasse), devant les câbles des cellules.
    L.svg("rect", { x: 450, y: y_de(1.15), width: 16, height: 1150 * MM, fill: "#f3efe2", stroke: "#8a8270" }, g);
    for (let cm = 0; cm <= 115; cm++) L.svg("line", { x1: 450, y1: y_de(cm / 100), x2: 450 + (cm % 10 ? (cm % 5 ? 3 : 5) : 8), y2: y_de(cm / 100), stroke: "#333", "stroke-width": cm % 10 ? 0.4 : 0.8 }, g);
    for (let cm = 0; cm <= 110; cm += 10) L.texte(g, 462, y_de(cm / 100) + 2.5, String(cm), { "font-size": 6, "font-weight": 700, fill: "#333" });
    L.texte(g, 458, y_de(1.15) - 4, "cm", { "font-size": 6.5, fill: "#e8ecef" });
  }

  function cellule(g, numero, z, coupee) {
    // Fourche (branches de part et d'autre du trajet de la bille), noix sur la tige, index rouge, câble vers le chronomètre.
    const y = y_de(z), gr = L.svg("g", { class: `cellule-chute cellule-${numero}`, role: "slider", "aria-label": `Cellule ${numero}` }, g);
    L.svg("path", { d: `M${X + 16} ${y} C${560} ${y} ${640} ${238 + numero * 34} 737 ${262 + (numero - 1) * 34}`, fill: "none", stroke: numero === 1 ? "#1f2d3a" : "#c0392b", "stroke-width": 2 }, g);
    L.tige(gr, `M${TIGE + 8} ${y} H${X - 18}`, 4);
    L.svg("rect", { x: TIGE - 9, y: y - 8, width: 18, height: 16, rx: 3, fill: "#2c3e50", stroke: "#111" }, gr);
    L.svg("rect", { x: X - 18, y: y - 7, width: 8, height: 14, rx: 2, fill: "#20262b" }, gr);
    L.svg("rect", { x: X + 10, y: y - 7, width: 8, height: 14, rx: 2, fill: "#20262b" }, gr);
    L.svg("line", { x1: X - 10, y1: y, x2: X + 10, y2: y, stroke: "#ff3b30", "stroke-width": 0.7, opacity: coupee ? 0 : 0.7 }, gr);
    L.svg("path", { d: `M${X + 18} ${y} H450`, stroke: "#e0251b", "stroke-width": 1.2 }, gr);
    L.texte(gr, TIGE - 18, y + 3, String(numero), { "font-size": 9, "font-weight": 700, fill: "#e8ecef" });
    L.svg("rect", { x: TIGE - 30, y: y - 14, width: 110, height: 28, fill: "#000", opacity: 0.001 }, gr);
  }

  function bille(g, z) {
    // Bille d'acier (diamètre 2,0 cm), centre à la hauteur z.
    L.svg("circle", { cx: X, cy: y_de(z), r: RAYON, fill: "url(#metal)", stroke: "#333", "stroke-width": 0.6 }, g);
  }

  function afficheurs(g, dt1, dt2) {
    // Durées d'occultation des deux cellules, en millisecondes.
    [[dt1, 266], [dt2, 300]].forEach(([dt, y]) => L.texte(g, 825, y, dt === null ? "- - - -" : `Δt = ${(dt * 1000).toFixed(2).replace(".", ",")} ms`, { "font-size": 10.5, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" }));
  }

  L.chute_dessin = { fond, regle, cellule, bille, afficheurs, y_de, X_FIL: X, Z0, MM, TABLE };
})(window.Labo);

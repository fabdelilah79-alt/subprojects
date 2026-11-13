/*
Rôle : dessin du treuil électrique (hauteurs à l'échelle 0,5 px/mm) : grande potence, moteur à tambour (r = 2,0 cm) avec
       son compte-tours, fil et crochet, deux cellules photoélectriques à 10 cm et 70 cm au-dessus de la paillasse (fourches
       autour du trajet de la masse, câblées au chronomètre), chronomètre, câbles du moteur vers l'alimentation.
Reçoit : le groupe SVG ; l'état du treuil (angle du tambour, hauteur, faisceaux coupés, affichages).
Produit : Labo.treuil_dessin = { fond(g), tambour(g, theta), cellule(g, y, coupee), afficheur(g, x, y, texte), X_FIL, TAMBOUR,
          TABLE, MM, Y_CELLULES }.
Utilisé par : poste_treuil.js.
*/
(function (L) {
  const MM = 0.5, TABLE = 560, X_FIL = 448, TAMBOUR = { x: 458, y: 110, r: 10 }, TIGE = 330;
  const Y_CELLULES = [TABLE - 100 * MM, TABLE - 700 * MM];

  function fond(g) {
    // Potence, bras, moteur, boîtier des cellules et chronomètre, câbles (chaque câble aboutit à une borne).
    L.svg("rect", { x: TIGE - 60, y: TABLE - 10, width: 120, height: 10, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, `M${TIGE} ${TABLE - 10} V70`, 8);
    L.svg("rect", { x: TIGE - 10, y: 100, width: 20, height: 20, rx: 3, fill: "#2c3e50", stroke: "#111" }, g);
    L.tige(g, `M${TIGE + 10} 110 H475`, 7);
    Y_CELLULES.forEach((y) => { L.svg("rect", { x: TIGE - 9, y: y - 9, width: 18, height: 18, rx: 3, fill: "#2c3e50", stroke: "#111" }, g); L.tige(g, `M${TIGE + 9} ${y} H414`, 5); });
    L.svg("rect", { x: 470, y: 82, width: 112, height: 58, rx: 6, fill: "#2f5d46", stroke: "#10261a" }, g);
    L.texte(g, 526, 95, "TREUIL ÉLECTRIQUE", { "font-size": 7, "font-weight": 700, fill: "#e8ecef" });
    L.svg("rect", { x: 484, y: 104, width: 84, height: 22, rx: 3, fill: "#1d2a22" }, g);
    L.texte(g, 526, 135, "compte-tours", { "font-size": 6.5, fill: "#cfe0d6" });
    L.svg("rect", { x: 660, y: 214, width: 130, height: 72, rx: 6, fill: "#c7ccd0", stroke: "#555" }, g);
    L.texte(g, 725, 228, "CHRONOMÈTRE", { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
    L.svg("rect", { x: 670, y: 236, width: 110, height: 24, rx: 3, fill: "#1d2a22" }, g);
    L.texte(g, 725, 276, "départ : cellule 1 · arrêt : cellule 2", { "font-size": 6.5, fill: "#23315a" });
    for (const [k, y] of Y_CELLULES.entries()) {
      const bx = 660, by = 250 + (k ? -14 : 14);
      L.svg("circle", { cx: bx, cy: by, r: 3, fill: k ? "#c0392b" : "#1f2d3a" }, g);
      L.svg("path", { d: `M484 ${y} C${560} ${y} ${600} ${by} ${bx - 3} ${by}`, fill: "none", stroke: k ? "#c0392b" : "#1f2d3a", "stroke-width": 2 }, g);
    }
    L.svg("path", { d: "M582 112 C760 100 880 150 845 416", fill: "none", stroke: "#1b1e21", "stroke-width": 2.6 }, g);
    L.svg("path", { d: "M582 126 C770 116 895 160 865 416", fill: "none", stroke: "#c0392b", "stroke-width": 2.6 }, g);
    L.svg("rect", { x: 600, y: 160, width: 150, height: 38, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0" }, g);
    L.texte(g, 675, 176, "Tambour : r = 2,0 cm", { "font-size": 9, fill: "#222" });
    L.texte(g, 675, 190, "Cellules : Δh = 60,0 cm", { "font-size": 9, fill: "#222" });
  }

  function tambour(g, theta) {
    // Tambour du moteur (fil enroulé) et ses rayons, tourné de theta.
    const t = TAMBOUR, d = L.svg("g", { transform: `rotate(${(-theta * 180) / Math.PI} ${t.x} ${t.y})` }, g);
    L.svg("circle", { cx: t.x, cy: t.y, r: t.r + 5, fill: "#8d969c", stroke: "#3c4246" }, d);
    L.svg("circle", { cx: t.x, cy: t.y, r: t.r, fill: "#d8cfa8", stroke: "#8a7f55" }, d);
    for (let k = 0; k < 3; k++) { const a = (k * 2 * Math.PI) / 3; L.svg("line", { x1: t.x, y1: t.y, x2: t.x + (t.r + 4) * Math.cos(a), y2: t.y + (t.r + 4) * Math.sin(a), stroke: "#3c4246", "stroke-width": 1.6 }, d); }
    L.svg("circle", { cx: t.x, cy: t.y, r: 2.5, fill: "#222" }, g);
  }

  function cellule(g, y, coupee) {
    // Fourche de la cellule autour du trajet de la masse : émetteur à gauche, récepteur à droite, faisceau.
    L.svg("rect", { x: 412, y: y - 7, width: 10, height: 14, rx: 2, fill: "#20262b" }, g);
    L.svg("rect", { x: 474, y: y - 7, width: 10, height: 14, rx: 2, fill: "#20262b" }, g);
    L.svg("line", { x1: 422, y1: y, x2: 474, y2: y, stroke: "#ff3b30", "stroke-width": 0.8, opacity: coupee ? 0 : 0.6, "stroke-dasharray": "2 2" }, g);
    L.svg("circle", { cx: 479, cy: y - 10, r: 2.5, fill: coupee ? "#ff3b30" : "#3d1512" }, g);
  }

  function afficheur(g, x, y, texte) {
    // Texte vert d'un afficheur à cristaux liquides.
    L.texte(g, x, y, texte, { "font-size": 11, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
  }

  L.treuil_dessin = { fond, tambour, cellule, afficheur, X_FIL, TAMBOUR, TABLE, MM, Y_CELLULES };
})(window.Labo);

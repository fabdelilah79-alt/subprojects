/*
Rôle : dessin de la balance de Coulomb (échelle 2,5 px/mm) : balance de précision (0,1 mg) dont le plateau porte, sur une
       colonne isolante, la sphère A (rayon 1,0 cm) ; au-dessus, la sphère B portée par un bras isolant et une noix que
       l'on fait glisser le long d'un statif gradué (distance des centres d de 4 à 10 cm) ; générateur haute tension et
       sa sonde de charge (câble), sphère C neutre au bout d'un manche isolant.
Reçoit : le groupe SVG ; la distance d (cm), la position de la sonde et de la sphère C, les charges (signes).
Produit : Labo.coulomb_dessin = { fond(g), sphere_b(g, d), sonde(g, p), sphere_c(g, p), afficheur(g, dm), A, y_b(d), X_STATIF }.
Utilisé par : poste_coulomb.js.
*/
(function (L) {
  const A = { x: 430, y: 420 }, R = 25, MM = 2.5, X_STATIF = 590, HT = { x: 800, y: 470 };
  const y_b = (d) => A.y - d * 10 * MM;

  function fond(g) {
    // Balance, colonne isolante, sphère A, statif gradué, générateur haute tension, fiche des données.
    L.svg("rect", { x: A.x - 80, y: 520, width: 160, height: 40, rx: 5, fill: "#e4e7ea", stroke: "#7a858c" }, g);
    L.svg("rect", { x: A.x - 45, y: 532, width: 90, height: 20, rx: 2, fill: "#1d2a22" }, g);
    L.svg("ellipse", { cx: A.x, cy: 518, rx: 50, ry: 6, fill: "url(#metal)", stroke: "#666" }, g);
    L.svg("rect", { x: A.x - 5, y: A.y + R - 2, width: 10, height: 518 - A.y - R, fill: "#e8e2c8", stroke: "#a39c80" }, g);
    L.svg("circle", { cx: A.x, cy: A.y, r: R, fill: "url(#metal)", stroke: "#555" }, g);
    L.texte(g, A.x, A.y + 4, "A", { "font-size": 11, "font-weight": 700, fill: "#333" });
    L.svg("rect", { x: X_STATIF - 30, y: 548, width: 60, height: 10, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, `M${X_STATIF} 548 V120`, 6);
    L.svg("rect", { x: X_STATIF + 8, y: y_b(10) - 4, width: 22, height: y_b(4) - y_b(10) + 8, fill: "#f3efe2", stroke: "#8a8270" }, g);
    for (let mm = 40; mm <= 100; mm += 5) L.svg("line", { x1: X_STATIF + 8, y1: y_b(mm / 10), x2: X_STATIF + 8 + (mm % 10 ? 4 : 8), y2: y_b(mm / 10), stroke: "#333", "stroke-width": mm % 10 ? 0.5 : 0.9 }, g);
    for (let cm = 4; cm <= 10; cm++) L.texte(g, X_STATIF + 23, y_b(cm) + 3, String(cm), { "font-size": 7.5, "font-weight": 700, fill: "#333" });
    L.texte(g, X_STATIF + 19, y_b(10) - 9, "d (cm)", { "font-size": 7, "font-weight": 700, fill: "#33414b" });
    L.svg("rect", { x: HT.x - 70, y: HT.y - 40, width: 140, height: 80, rx: 6, fill: "#7a2a22", stroke: "#2b0f0c" }, g);
    L.texte(g, HT.x, HT.y - 24, "HAUTE TENSION 5 kV", { "font-size": 8, "font-weight": 700, fill: "#fbe9e7" });
    L.svg("circle", { cx: HT.x - 40, cy: HT.y + 10, r: 5, fill: "#c0392b", stroke: "#000" }, g);
    L.svg("rect", { x: 650, y: 140, width: 250, height: 62, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0" }, g);
    ["Sphères A, B, C identiques : rayon 1,0 cm", "Chargées par la sonde (5 kV) : q = 5,56 nC", "g = 9,81 N/kg ; F = Δm·g"].forEach((t, i) => L.texte(g, 775, 158 + i * 18, t, { "font-size": 9, fill: "#222" }));
  }

  function sphere_b(g, d) {
    // Sphère B, bras isolant, noix saisissable et index rouge sur le statif.
    const y = y_b(d), gr = L.svg("g", { class: "noix-b", role: "slider", "aria-label": "Distance entre A et B" }, g);
    L.svg("rect", { x: A.x, y: y - 4, width: X_STATIF - A.x - 10, height: 8, fill: "#e8e2c8", stroke: "#a39c80" }, gr);
    L.svg("circle", { cx: A.x, cy: y, r: R, fill: "url(#metal)", stroke: "#555" }, gr);
    L.texte(gr, A.x, y + 4, "B", { "font-size": 11, "font-weight": 700, fill: "#333" });
    L.svg("rect", { x: X_STATIF - 12, y: y - 11, width: 24, height: 22, rx: 3, fill: "#2c3e50", stroke: "#111" }, gr);
    L.svg("path", { d: `M${X_STATIF + 4} ${y} H${X_STATIF + 16}`, stroke: "#e0251b", "stroke-width": 1.6 }, gr);
    L.svg("rect", { x: X_STATIF - 30, y: y - 20, width: 60, height: 40, fill: "#000", opacity: 0.001 }, gr);
  }

  function sonde(g, p) {
    // Câble du générateur jusqu'à la sonde (manche isolant, pointe métallique).
    L.svg("path", { d: `M${HT.x - 40} ${HT.y + 10} C${HT.x - 80} ${HT.y + 60} ${p.x + 60} ${p.y + 80} ${p.x + 30} ${p.y + 10}`, fill: "none", stroke: "#c0392b", "stroke-width": 2.2 }, g);
    const gr = L.svg("g", { class: "sonde-ht", role: "button", "aria-label": "Sonde de charge" }, g);
    L.svg("rect", { x: p.x + 8, y: p.y - 5, width: 40, height: 10, rx: 4, fill: "#2b3035" }, gr);
    L.tige(gr, `M${p.x} ${p.y} H${p.x + 8}`, 3);
    L.svg("rect", { x: p.x - 6, y: p.y - 14, width: 60, height: 28, fill: "#000", opacity: 0.001 }, gr);
  }

  function sphere_c(g, p) {
    // Sphère C au bout de son manche isolant.
    const gr = L.svg("g", { class: "sphere-c", role: "button", "aria-label": "Sphère C" }, g);
    L.svg("rect", { x: p.x + R - 2, y: p.y - 4, width: 90, height: 8, rx: 3, fill: "#e8e2c8", stroke: "#a39c80" }, gr);
    L.svg("circle", { cx: p.x, cy: p.y, r: R, fill: "url(#metal)", stroke: "#555" }, gr);
    L.texte(gr, p.x, p.y + 4, "C", { "font-size": 11, "font-weight": 700, fill: "#333" });
  }

  function afficheur(g, dm) {
    // Indication de la balance (tarée sphères neutres), en mg.
    L.texte(g, A.x, 547, `${dm.toFixed(1).replace(".", ",")} mg`, { "font-size": 12, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
  }

  L.coulomb_dessin = { fond, sphere_b, sonde, sphere_c, afficheur, A, R, y_b, X_STATIF, HT };
})(window.Labo);

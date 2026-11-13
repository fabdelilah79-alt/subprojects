/*
Rôle : illustrations des documents historiques : les modèles de l'atome de Dalton (sphère pleine), de Thomson (sphère
       positive où sont dispersés les électrons), de Rutherford (noyau minuscule, trajectoires des particules alpha), de
       Bohr (électrons sur des couches) et le noyau de Chadwick (protons et neutrons). Les tailles du noyau sont
       volontairement agrandies (à l'échelle, il serait invisible) : c'est écrit sous le dessin.
Reçoit : le groupe SVG, le centre (x, y) et l'échelle k (diamètre d'environ 80 × k).
Produit : Labo.DESSINS_ATOME = { dalton, thomson, rutherford, bohr, chadwick } (fonctions (g, x, y, k)).
Utilisé par : documents_histoire.js.
*/
(function (L) {
  const legende = (g, x, y, k, t) => L.texte(g, x, y + 50 * k, t, { "font-size": 4.6 * k, fill: "#555", "font-style": "italic" });
  const charge = (g, x, y, r, signe, fond) => {
    // Petite particule chargée : disque coloré et signe.
    L.svg("circle", { cx: x, cy: y, r, fill: fond, stroke: "#333", "stroke-width": r / 8 }, g);
    if (signe) L.texte(g, x, y + r * 0.35, signe, { "font-size": r * 1.3, "font-weight": 700, fill: "#fff" });
  };

  function dalton(g, x, y, k) {
    // Trois atomes « boules pleines » de tailles différentes (deux éléments).
    for (const [dx, dy, r, c] of [[-18, 6, 16, "#6f8fb8"], [16, -10, 16, "#6f8fb8"], [12, 20, 11, "#c27a4a"]]) {
      L.svg("circle", { cx: x + dx * k, cy: y + dy * k, r: r * k, fill: c, stroke: "#333", "stroke-width": 0.6 * k }, g);
      L.svg("circle", { cx: x + (dx - r / 3) * k, cy: y + (dy - r / 3) * k, r: r * 0.3 * k, fill: "#fff", opacity: 0.4 }, g);
    }
    legende(g, x, y, k, "sphères pleines, indivisibles");
  }

  function thomson(g, x, y, k) {
    // Sphère chargée positivement (rose), électrons dispersés « comme des raisins ».
    L.svg("circle", { cx: x, cy: y, r: 38 * k, fill: "#f3c6cf", stroke: "#a0505f", "stroke-width": 0.8 * k }, g);
    for (const [px, py] of [[-6, 4], [-24, -18], [8, -26], [18, 10], [-20, 18], [26, -6], [2, 26], [-30, 0]]) L.texte(g, x + (px + 4) * k, y + (py - 6) * k, "+", { "font-size": 6 * k, fill: "#a0505f" });
    for (const [px, py] of [[-14, -6], [12, -12], [-6, 18], [22, 22], [-26, -10], [4, 4], [-14, 28], [28, -18]]) charge(g, x + px * k, y + py * k, 4 * k, "−", "#2f6fc0");
    legende(g, x, y, k, "le « pudding » de Thomson");
  }

  function rutherford(g, x, y, k) {
    // Rangée de noyaux d'or (points) très espacés ; trajectoires alpha : tout droit, déviées, une renvoyée en arrière.
    for (let i = -2; i <= 2; i++) L.svg("circle", { cx: x + 6 * k, cy: y + i * 16 * k, r: 1.8 * k, fill: "#c9302c" }, g);
    const t = { fill: "none", stroke: "#2c7a3a", "stroke-width": 0.9 * k };
    for (const dy of [-24, -8, 8, 24]) L.svg("path", { d: `M${x - 40 * k} ${y + dy * k} H${x + 40 * k}`, ...t }, g);
    L.svg("path", { d: `M${x - 40 * k} ${y + 18 * k} H${x + 1 * k} Q${x + 8 * k} ${y + 18 * k} ${x + 40 * k} ${y + 34 * k}`, ...t }, g);
    L.svg("path", { d: `M${x - 40 * k} ${y + 1 * k} H${x + 2 * k} Q${x + 8 * k} ${y + 1 * k} ${x - 36 * k} ${y - 12 * k}`, ...t, stroke: "#d0661a" }, g);
    L.texte(g, x - 34 * k, y - 32 * k, "α →", { "font-size": 6 * k, fill: "#2c7a3a", "font-weight": 700 });
    legende(g, x, y, k, "noyaux (agrandis) et trajectoires α");
  }

  function bohr(g, x, y, k) {
    // Noyau (agrandi) et électrons sur deux couches (K : 2, L : 4), comme pour le carbone.
    for (const r of [18, 34]) L.svg("circle", { cx: x, cy: y, r: r * k, fill: "none", stroke: "#888", "stroke-width": 0.7 * k, "stroke-dasharray": `${2 * k} ${2 * k}` }, g);
    charge(g, x, y, 7 * k, "+", "#c9302c");
    [[18, 90], [18, 270], [34, 20], [34, 110], [34, 200], [34, 290]].forEach(([r, a]) => charge(g, x + r * k * Math.cos((a * Math.PI) / 180), y - r * k * Math.sin((a * Math.PI) / 180), 3.6 * k, "−", "#2f6fc0"));
    L.texte(g, x + 14 * k, y - 12 * k, "K", { "font-size": 5 * k, fill: "#444" });
    L.texte(g, x + 29 * k, y - 26 * k, "L", { "font-size": 5 * k, fill: "#444" });
    legende(g, x, y, k, "électrons sur les couches K, L");
  }

  function chadwick(g, x, y, k) {
    // Noyau d'hélium 4 très agrandi : 2 protons (rouges, +) et 2 neutrons (gris), serrés.
    [[-7, -6, "+", "#c9302c"], [7, 6, "+", "#c9302c"], [7, -6, "", "#8a9096"], [-7, 6, "", "#8a9096"]].forEach(([dx, dy, s, c]) => charge(g, x + dx * 1.6 * k, y + dy * 1.6 * k, 11 * k, s, c));
    legende(g, x, y, k, "noyau d'hélium (très agrandi)");
  }

  L.DESSINS_ATOME = { dalton, thomson, rutherford, bohr, chadwick };
})(window.Labo);

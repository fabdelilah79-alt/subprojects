/*
Rôle : dessins de l'activité « les cinq sens » : orange entière, demi-orange côté pulpe et côté peau, planche à découper,
       couteau, presse-agrumes en verre (avec le jus recueilli), feuille de papier (lisse ou froissée), et ce qu'on voit
       à la loupe (vésicules de jus, pores de la peau, fibres du papier, pulpe en suspension dans le jus).
Reçoit : le groupe SVG où dessiner et la position.
Produit : Labo.dessins_sens = { orange, demi_pulpe, demi_peau, planche, couteau, presse, papier, loupe, vue_loupe }.
Utilisé par : postes_sens.js, cartes_sens.js.
*/
(function (L) {
  const PEAU = { fill: "url(#peau-orange)" }, R = 30;
  // Les dessins sont faits à la moitié de la taille réelle, puis agrandis autour de leur point d'appui (orange de 75 mm).
  const agrandi = (g, x, y, k = 2) => L.svg("g", { transform: `translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})` }, g);

  function degrades(g) {
    // Dégradés de la peau et de la pulpe (une seule fois par paillasse).
    const defs = L.svg("defs", {}, g);
    const peau = L.svg("radialGradient", { id: "peau-orange", cx: 0.38, cy: 0.32, r: 0.75 }, defs);
    [[0, "#ffc35a"], [0.45, "#f39418"], [1, "#b8560a"]].forEach(([o, c]) => L.svg("stop", { offset: o, "stop-color": c }, peau));
  }

  function pores(g, x, y, r, n = 26) {
    // Petits pores de la peau (glandes à huile essentielle).
    for (let k = 0; k < n; k++) { const a = k * 2.4, d = r * Math.sqrt((k + 0.5) / n) * 0.9; L.svg("circle", { cx: x + d * Math.cos(a), cy: y + d * Math.sin(a) * 0.95, r: 0.7, fill: "#c9670c", opacity: 0.7 }, g); }
  }

  const D = {
    degrades,
    orange(g, x, y) {
      // Orange entière posée (centre x, y) : ombre, peau granuleuse, petite cicatrice du pédoncule.
      g = agrandi(g, x, y);
      L.svg("ellipse", { cx: x + 4, cy: y + R - 2, rx: R, ry: 6, fill: "#000", opacity: 0.3 }, g);
      L.svg("circle", { cx: x, cy: y, r: R, ...PEAU }, g);
      pores(g, x, y, R);
      L.svg("circle", { cx: x - 4, cy: y - R + 5, r: 2.4, fill: "#6b7a2a" }, g);
    },
    demi_pulpe(g, x, y) {
      // Demi-orange posée sur sa peau, face coupée vers le haut : écorce, albédo blanc, quartiers, pépin.
      g = agrandi(g, x, y);
      L.svg("ellipse", { cx: x + 4, cy: y + R * 0.55, rx: R, ry: 5, fill: "#000", opacity: 0.3 }, g);
      L.svg("path", { d: `M${x - R} ${y} A${R} ${R * 0.42} 0 0 0 ${x + R} ${y} A${R} ${R * 0.9} 0 0 1 ${x - R} ${y} Z`, ...PEAU }, g);
      L.svg("ellipse", { cx: x, cy: y, rx: R, ry: R * 0.42, fill: "#f4d9a8" }, g);
      L.svg("ellipse", { cx: x, cy: y, rx: R - 3, ry: R * 0.42 - 2, fill: "#f6a630" }, g);
      for (let k = 0; k < 10; k++) { const a = (k * Math.PI) / 5; L.svg("line", { x1: x, y1: y, x2: x + (R - 3) * Math.cos(a), y2: y + (R * 0.42 - 2) * Math.sin(a), stroke: "#fbe3b4", "stroke-width": 1 }, g); }
      L.svg("ellipse", { cx: x, cy: y, rx: 3, ry: 1.5, fill: "#fbe3b4" }, g);
      L.svg("ellipse", { cx: x + 9, cy: y + 3, rx: 2.4, ry: 1.2, fill: "#f3ecd2" }, g);
    },
    demi_peau(g, x, y) {
      // Demi-orange posée sur sa face coupée : un dôme de peau.
      g = agrandi(g, x, y);
      L.svg("ellipse", { cx: x + 4, cy: y + 2, rx: R, ry: 5, fill: "#000", opacity: 0.3 }, g);
      L.svg("path", { d: `M${x - R} ${y} A${R} ${R * 0.95} 0 0 1 ${x + R} ${y} A${R} ${R * 0.2} 0 0 1 ${x - R} ${y} Z`, ...PEAU }, g);
      pores(L.svg("g", {}, g), x, y - R * 0.45, R * 0.6, 14);
    },
    ecorce(g, x, y) {
      // Écorce vidée après pressage, couchée sur le côté : la pulpe écrasée et la couche blanche se voient dedans.
      g = agrandi(g, x, y);
      L.svg("ellipse", { cx: x + 4, cy: y + 4, rx: 27, ry: 5, fill: "#000", opacity: 0.3 }, g);
      L.svg("path", { d: `M${x - 26} ${y - 2} Q${x - 22} ${y + 8} ${x} ${y + 7} Q${x + 24} ${y + 6} ${x + 27} ${y - 6} Q${x + 10} ${y - 24} ${x - 14} ${y - 18} Z`, ...PEAU }, g);
      L.svg("path", { d: `M${x - 22} ${y - 4} Q${x - 18} ${y - 16} ${x - 4} ${y - 16} Q${x + 10} ${y - 18} ${x + 16} ${y - 9} Q${x + 2} ${y - 2} ${x - 22} ${y - 4} Z`, fill: "#f4dcae" }, g);
      L.svg("path", { d: `M${x - 16} ${y - 7} Q${x - 4} ${y - 14} ${x + 10} ${y - 10} Q${x - 2} ${y - 5} ${x - 16} ${y - 7} Z`, fill: "#e9a64a", opacity: 0.85 }, g);
    },
    planche(g, x, y, l = 400, h = 46) {
      // Planche à découper en bois (25 cm) posée sur la paillasse (dessus en perspective et chant de 15 mm).
      L.svg("rect", { x: x + 4, y: y + 8, width: l, height: h, rx: 8, fill: "#000", opacity: 0.25 }, g);
      L.svg("rect", { x, y, width: l, height: h, rx: 8, fill: "url(#bois)" }, g);
      L.svg("rect", { x, y: y + h - 6, width: l, height: 10, rx: 4, fill: "url(#bois-face)" }, g);
    },
    couteau(g) {
      // Couteau d'office (dessiné au tiers de sa taille), pointe en (0, 0), manche noir à droite.
      L.svg("path", { d: "M0 0 Q14 -9 46 -9 L48 0 Z", fill: "url(#metal)", stroke: "#6d757b", "stroke-width": 0.6 }, g);
      L.svg("rect", { x: 48, y: -8, width: 40, height: 9, rx: 3.5, fill: "#1c1d1f" }, g);
      for (const dx of [56, 72]) L.svg("circle", { cx: dx, cy: -3.5, r: 1.2, fill: "#b9bfc3" }, g);
    },
    presse(g, x, y, jus) {
      // Presse-agrumes en verre de 13 cm : coupelle (avec le jus recueilli, 0 à 1) et cône strié au centre.
      g = agrandi(g, x, y, 1.85);
      L.svg("ellipse", { cx: x + 4, cy: y + 14, rx: 58, ry: 9, fill: "#000", opacity: 0.25 }, g);
      L.svg("path", { d: `M${x - 56} ${y - 6} Q${x - 52} ${y + 12} ${x} ${y + 13} Q${x + 52} ${y + 12} ${x + 56} ${y - 6} Z`, fill: "url(#verre)", stroke: "#9fb6be" }, g);
      if (jus > 0) L.svg("ellipse", { cx: x, cy: y - 3, rx: 30 + 22 * jus, ry: 5 + 4 * jus, fill: "#f39c28", opacity: 0.8 }, g);
      L.svg("ellipse", { cx: x, cy: y - 6, rx: 56, ry: 10, fill: "none", stroke: "#9fb6be", "stroke-width": 1.4 }, g);
      L.svg("path", { d: `M${x - 18} ${y - 4} Q${x - 10} ${y - 40} ${x} ${y - 44} Q${x + 10} ${y - 40} ${x + 18} ${y - 4} Z`, fill: "url(#verre)", stroke: "#9fb6be" }, g);
      for (const dx of [-10, -4, 2, 8]) L.svg("path", { d: `M${x + dx} ${y - 6} Q${x + dx * 0.5} ${y - 30} ${x} ${y - 42}`, stroke: "#ffffff", opacity: 0.6, fill: "none" }, g);
    },
    papier(g, x, y, froisse) {
      // Feuille A4 de papier blanc posée à plat (vue en perspective) ; froissée, elle se plisse.
      g = agrandi(g, x, y, 3);
      L.svg("path", { d: `M${x - 70} ${y + 22} L${x - 50} ${y - 20} L${x + 74} ${y - 20} L${x + 60} ${y + 22} Z`, fill: "#000", opacity: 0.18, transform: "translate(4 4)" }, g);
      if (!froisse) return void L.svg("path", { d: `M${x - 70} ${y + 22} L${x - 50} ${y - 20} L${x + 74} ${y - 20} L${x + 60} ${y + 22} Z`, fill: "#fbfbf6", stroke: "#d8d8cf" }, g);
      L.svg("path", { d: `M${x - 40} ${y + 14} L${x - 46} ${y - 4} L${x - 24} ${y - 18} L${x + 6} ${y - 12} L${x + 34} ${y - 20} L${x + 46} ${y} L${x + 30} ${y + 18} L${x - 6} ${y + 12} Z`, fill: "#f3f3ec", stroke: "#cfcfc4" }, g);
      for (const d of [`M${x - 24} ${y - 18} L${x - 6} ${y + 12}`, `M${x + 6} ${y - 12} L${x + 30} ${y + 18}`, `M${x - 46} ${y - 4} L${x + 46} ${y}`]) L.svg("path", { d, stroke: "#d8d8cc", fill: "none" }, g);
    },
  };
  L.dessins_sens = D;
})(window.Labo);

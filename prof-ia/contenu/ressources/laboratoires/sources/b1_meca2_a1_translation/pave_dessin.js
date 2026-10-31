/*
Rôle : dessin de la paillasse du pavé tiré : règle de 70 cm posée sur la paillasse (0 à gauche), repères A et B
       (à 10 cm et 50 cm), pavé de bois de 500 g (10 cm de long) avec son crochet, et rapporteur transparent fixé au
       crochet (0° horizontal, 90° vertical) pour lire l'angle α du fil.
Reçoit : le groupe SVG, la position du devant du pavé (px) et la hauteur de la paillasse.
Produit : Labo.pave_dessin.regle(g, reglage), Labo.pave_dessin.pave(g, x, table), Labo.pave_dessin.rapporteur(g, H).
Utilisé par : poste_pave.js.
*/
(function (L) {
  const MM = 0.7, X0 = 240, LONG = 70, HAUT = 28, CM = 70;

  function regle(g, { table, xa, xb }) {
    // Règle en bois jaune (graduée en cm), flèches rouges des repères A et B.
    const y = table + 8;
    L.svg("path", { d: `M${X0 - 8} ${y + 12} L${X0 - 2} ${y} H${X0 + (CM * 10 + 8) * MM} L${X0 + (CM * 10 + 2) * MM} ${y + 12} Z`, fill: "#e8c75a", stroke: "#9b7d1f", "stroke-width": 0.8 }, g);
    for (let cm = 0; cm <= CM; cm++) {
      const x = X0 + cm * 10 * MM, grand = cm % 10 === 0;
      L.svg("line", { x1: x, y1: y, x2: x - 0.5, y2: y + (grand ? 7 : cm % 5 ? 3 : 5), stroke: "#3b2f0a", "stroke-width": grand ? 0.9 : 0.5 }, g);
      if (grand) L.texte(g, x - 1, y + 11, String(cm), { "font-size": 6.5, "font-weight": 700, fill: "#3b2f0a" });
    }
    L.texte(g, X0 + (CM * 10 + 4) * MM, y + 11, "cm", { "font-size": 6, fill: "#3b2f0a" });
    [[xa, "A"], [xb, "B"]].forEach(([x, nom]) => {
      L.svg("path", { d: `M${x} ${y - 1} l-5 -9 h10 Z`, fill: "#d0312d" }, g);
      L.svg("rect", { x: x - 0.6, y: table - 34, width: 1.2, height: 34, fill: "#d0312d", opacity: 0.55 }, g);
      L.texte(g, x, table - 38, nom, { "font-size": 12, "font-weight": 700, fill: "#d0312d" });
    });
  }

  function pave(g, x, table) {
    // Pavé de bois (face avant, dessus), masse inscrite, crochet sur la face avant ; x est la face avant.
    const gr = L.svg("g", { class: "pave-tire", role: "button", "aria-label": "Pavé de bois" }, g);
    L.svg("ellipse", { cx: x - LONG / 2, cy: table + 2, rx: LONG / 2 + 4, ry: 3, fill: "#000", opacity: 0.25 }, gr);
    L.svg("path", { d: `M${x - LONG} ${table - HAUT} l7 -7 H${x + 7} l-7 7 Z`, fill: "url(#bois)", stroke: "#6b4a2a", "stroke-width": 0.6 }, gr);
    L.svg("path", { d: `M${x} ${table - HAUT} l7 -7 V${table - 7} L${x} ${table} Z`, fill: "#8a5f35", stroke: "#6b4a2a", "stroke-width": 0.6 }, gr);
    L.svg("rect", { x: x - LONG, y: table - HAUT, width: LONG, height: HAUT, fill: "url(#bois-face)", stroke: "#6b4a2a", "stroke-width": 0.8 }, gr);
    L.texte(gr, x - LONG / 2, table - HAUT / 2 + 3, "500 g", { "font-size": 9, "font-weight": 700, fill: "#3b2a12" });
    L.svg("path", { d: `M${x} ${table - 16} h3 a3 3 0 1 1 0 0.1`, fill: "none", stroke: "url(#metal)", "stroke-width": 1.6 }, gr);
    return gr;
  }

  function rapporteur(g, H) {
    // Quart de rapporteur transparent centré sur le crochet : un trait tous les 5°, un nombre tous les 10°.
    const R = 62, p = (r, d) => ({ x: H.x + r * Math.cos((d * Math.PI) / 180), y: H.y - r * Math.sin((d * Math.PI) / 180) });
    L.svg("path", { d: `M${H.x} ${H.y} H${H.x + R} A${R} ${R} 0 0 0 ${H.x} ${H.y - R} Z`, fill: "#dfeef6", opacity: 0.45, stroke: "#6d8a99", "stroke-width": 0.8 }, g);
    for (let d = 0; d <= 90; d += 5) {
      const a = p(R, d), b = p(R - (d % 10 ? 4 : 7), d);
      L.svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "#203845", "stroke-width": 0.6 }, g);
      if (d % 10 === 0) { const t = p(R - 13, d); L.texte(g, t.x, t.y + 2.5, String(d), { "font-size": 6.5, "font-weight": 700, fill: "#203845" }); }
    }
  }

  L.pave_dessin = { regle, pave, rapporteur, MM, X0, LONG };
})(window.Labo);

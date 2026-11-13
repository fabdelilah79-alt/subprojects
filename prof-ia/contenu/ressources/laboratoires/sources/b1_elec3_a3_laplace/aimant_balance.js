/*
Rôle : dessin, en 2,5D, d'un aimant en U posé sur un plateau tournant (deux pôles verticaux de 5 cm sur une semelle,
       entrefer de 3 cm) orienté d'un angle α par rapport au conducteur (dirigé vers l'élève), et du cadre conducteur
       (segment horizontal de longueur l dans l'entrefer, deux montants, support isolant tenu par une potence).
Reçoit : le groupe SVG, le centre du plateau (écran), α (degrés), l (m).
Produit : Labo.dessin_aimant_balance(g, centre, alpha) ; Labo.dessin_cadre(g, centre, l) ; Labo.prisme(g, centre, reglage).
Utilisé par : poste_balance.js.
*/
(function (L) {
  const EX = 1800, EY = 400, KZ = 1100;

  L.prisme = function (g, c, { x, y, u, a, w, z0, z1, couleur, bord = "#222" }) {
    // Pavé : base rectangulaire (demi-longueur a selon u, demi-largeur w) entre les hauteurs z0 et z1 ; faces du fond d'abord.
    const v = { x: -u.y, y: u.x }, P = (s, t, z) => ({ x: c.x + (x + s * a * u.x + t * w * v.x) * EX, y: c.y + (y + s * a * u.y + t * w * v.y) * EY - z * KZ });
    const coins = [[-1, -1], [1, -1], [1, 1], [-1, 1]], faces = coins.map((p, k) => [p, coins[(k + 1) % 4]]);
    faces.sort((f1, f2) => P(...f1[0], 0).y + P(...f1[1], 0).y - P(...f2[0], 0).y - P(...f2[1], 0).y);
    for (const [p, q] of faces) L.svg("path", { d: `M${[P(...p, z0), P(...q, z0), P(...q, z1), P(...p, z1)].map((r) => `${r.x} ${r.y}`).join(" L")} Z`, fill: couleur, stroke: bord, "stroke-width": 0.6, opacity: 0.95 }, g);
    const dessus = `M${coins.map((p) => { const r = P(...p, z1); return `${r.x} ${r.y}`; }).join(" L")} Z`;
    L.svg("path", { d: dessus, fill: couleur, stroke: bord, "stroke-width": 0.6 }, g);
    L.svg("path", { d: dessus, fill: "#fff", opacity: 0.2 }, g);
  };

  L.dessin_aimant_balance = function (g, c, alpha) {
    // Plateau tournant gradué, semelle, pôle nord (rouge) et pôle sud (bleu) ; le champ va du nord au sud.
    g.replaceChildren();
    L.svg("ellipse", { cx: c.x, cy: c.y - 2, rx: 0.04 * EX, ry: 0.04 * EY, fill: "#e9e4d2", stroke: "#8a8270" }, g);
    for (let a = 0; a < 180; a += 30) { const r = (a * Math.PI) / 180; L.svg("line", { x1: c.x - 0.04 * EX * Math.cos(r), y1: c.y - 2 - 0.04 * EY * Math.sin(r), x2: c.x + 0.04 * EX * Math.cos(r), y2: c.y - 2 + 0.04 * EY * Math.sin(r), stroke: "#c9c4b0", "stroke-width": 0.5 }, g); }
    const phi = ((90 - alpha) * Math.PI) / 180, u = { x: Math.cos(phi), y: Math.sin(phi) }, d = 0.0225;
    L.prisme(g, c, { x: 0, y: 0, u, a: 0.03, w: 0.025, z0: 0, z1: 0.015, couleur: "#6b7178" });
    const poles = [[-1, "#d63a2f"], [1, "#2f6fd0"]].map(([s, col]) => ({ x: s * d * u.x, y: s * d * u.y, col }));
    poles.sort((p, q) => p.y - q.y).forEach((p) => L.prisme(g, c, { x: p.x, y: p.y, u, a: 0.0075, w: 0.025, z0: 0.015, z1: 0.065, couleur: p.col }));
    L.texte(g, c.x, c.y + 26, `α = ${alpha}°`, { "font-size": 9, "font-weight": 700, fill: "#e8e2d4" });
  };

  L.dessin_cadre = function (g, c, l) {
    // Segment horizontal (dans l'entrefer, à 4 cm du plateau) dirigé vers l'élève, montants jusqu'au support isolant.
    g.replaceChildren();
    const P = (y, z) => ({ x: c.x, y: c.y + y * EY - z * KZ }), a = P(-l / 2, 0.04), b = P(l / 2, 0.04), ha = P(-l / 2, 0.15), hb = P(l / 2, 0.15);
    L.svg("path", { d: `M${ha.x - 4} ${ha.y} L${a.x - 4} ${a.y} L${b.x + 4} ${b.y} L${hb.x + 4} ${hb.y}`, fill: "none", stroke: "#b86b2a", "stroke-width": 3.2, "stroke-linejoin": "round" }, g);
    L.svg("rect", { x: c.x - 30, y: ha.y - 14, width: 60, height: 12, rx: 2, fill: "#f0e6c8", stroke: "#8a7a4a" }, g);
    L.texte(g, c.x, ha.y - 22, `cadre : l = ${Math.round(l * 100)} cm`, { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
  };
})(window.Labo);

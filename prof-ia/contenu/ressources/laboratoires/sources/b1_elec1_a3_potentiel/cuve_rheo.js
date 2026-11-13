/*
Rôle : cuve rhéographique vue un peu d'en haut : cuve de 20 cm × 14 cm, eau du robinet sur une feuille quadrillée (1 cm),
       deux plaques de cuivre parallèles à x = 5 cm (reliée à la borne − du générateur, potentiel 0) et x = 15 cm (borne +,
       12,0 V), générateur et voltmètre (COM relié à la plaque à 0 V, borne V reliée à la pointe de touche). Entre les
       plaques, le potentiel croît régulièrement : V = U·(x − 5 cm)/d ; au-delà, il reste celui de la plaque la plus proche.
Reçoit : le groupe SVG ; la position de la pointe (cm dans la cuve).
Produit : Labo.cuve_rheo = { fond(g), pointe(g, p), afficheur(g, V), potentiel(p), vers_cuve(point écran), ecran(p), U, X1, X2 }.
Utilisé par : poste_cuve.js.
*/
(function (L) {
  const U = 12, X1 = 5, X2 = 15, LX = 20, LY = 14;
  const ecran = (p) => ({ x: 250 + p.x * 25 + p.y * 3, y: 545 - p.y * 12 });
  const vers_cuve = (q) => { const y = (545 - q.y) / 12; return { x: (q.x - 250 - y * 3) / 25, y }; };
  const potentiel = (p) => U * Math.max(0, Math.min(1, (p.x - X1) / (X2 - X1)));

  function quadrillage(g) {
    // Eau sur la feuille quadrillée, graduations en cm sur deux bords.
    const c = [ecran({ x: 0, y: 0 }), ecran({ x: LX, y: 0 }), ecran({ x: LX, y: LY }), ecran({ x: 0, y: LY })];
    L.svg("path", { d: `M${c[0].x} ${c[0].y + 8} L${c[1].x} ${c[1].y + 8} L${c[1].x} ${c[1].y} L${c[2].x} ${c[2].y} L${c[3].x} ${c[3].y} L${c[0].x} ${c[0].y} Z`, fill: "#9fb6be", opacity: 0.6 }, g);
    L.svg("path", { d: `M${c.map((p) => `${p.x} ${p.y}`).join(" L")} Z`, fill: "#f4f7f2", stroke: "#7a8a90", "stroke-width": 1.4 }, g);
    for (let x = 0; x <= LX; x++) { const a = ecran({ x, y: 0 }), b = ecran({ x, y: LY }); L.svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "#8fb3c9", "stroke-width": x % 5 ? 0.4 : 0.9 }, g); }
    for (let y = 0; y <= LY; y++) { const a = ecran({ x: 0, y }), b = ecran({ x: LX, y }); L.svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "#8fb3c9", "stroke-width": y % 5 ? 0.4 : 0.9 }, g); }
    for (let x = 0; x <= LX; x += 2) { const a = ecran({ x, y: 0 }); L.texte(g, a.x, a.y + 18, String(x), { "font-size": 7, "font-weight": 700, fill: "#e8ecef" }); }
    for (let y = 0; y <= LY; y += 2) { const a = ecran({ x: 0, y }); L.texte(g, a.x - 10, a.y + 3, String(y), { "font-size": 7, "font-weight": 700, fill: "#e8ecef" }); }
    L.svg("path", { d: `M${c.map((p) => `${p.x} ${p.y}`).join(" L")} Z`, fill: "#7fb8d6", opacity: 0.25 }, g);
  }

  function fond(g) {
    // Cuve, plaques, générateur, voltmètre et câbles (chaque câble aboutit à une borne).
    quadrillage(g);
    for (const x of [X1, X2]) { const a = ecran({ x, y: 0.3 }), b = ecran({ x, y: LY - 0.3 }); L.svg("path", { d: `M${a.x} ${a.y} L${b.x} ${b.y} l0 -12 L${a.x} ${a.y - 12} Z`, fill: "#c87533", stroke: "#7a4214" }, g); }
    L.svg("rect", { x: 140, y: 250, width: 130, height: 70, rx: 6, fill: "#2c3e50", stroke: "#111" }, g);
    L.texte(g, 205, 264, "GÉNÉRATEUR 12,0 V", { "font-size": 7.5, "font-weight": 700, fill: "#e8ecef" });
    L.svg("rect", { x: 760, y: 250, width: 130, height: 80, rx: 6, fill: "#e9b949", stroke: "#6b5300" }, g);
    L.texte(g, 825, 264, "VOLTMÈTRE", { "font-size": 7.5, "font-weight": 700, fill: "#3b2a05" });
    L.svg("rect", { x: 772, y: 272, width: 106, height: 26, rx: 3, fill: "#1d2a22" }, g);
    const p1 = ecran({ x: X1, y: LY }), p2 = ecran({ x: X2, y: LY });
    const bornes = [[180, 300, "#1b1e21", p1], [230, 300, "#c0392b", p2], [790, 318, "#1b1e21", p1]];
    for (const [x, y, c, p] of bornes) { L.svg("circle", { cx: x, cy: y, r: 4.5, fill: c, stroke: "#000" }, g); L.svg("path", { d: `M${x} ${y} C${x} ${y + 60} ${p.x} ${p.y - 80} ${p.x} ${p.y - 12}`, fill: "none", stroke: c, "stroke-width": 2.2 }, g); }
    L.texte(g, 790, 328 + 12, "COM", { "font-size": 6.5, fill: "#3b2a05" });
    L.svg("circle", { cx: 860, cy: 318, r: 4.5, fill: "#c0392b", stroke: "#000" }, g);
  }

  function pointe(g, p) {
    // Pointe de touche plongée dans l'eau au point p, et son câble jusqu'à la borne V du voltmètre.
    const q = ecran(p), gr = L.svg("g", { class: "pointe-touche", role: "button", "aria-label": "Pointe de touche" }, g);
    L.svg("path", { d: `M860 318 C860 380 ${q.x + 60} ${q.y - 110} ${q.x + 14} ${q.y - 60}`, fill: "none", stroke: "#c0392b", "stroke-width": 2.2 }, gr);
    L.svg("path", { d: `M${q.x} ${q.y} L${q.x + 14} ${q.y - 60}`, stroke: "#2b3035", "stroke-width": 5, "stroke-linecap": "round" }, gr);
    L.svg("path", { d: `M${q.x} ${q.y} l3 -14`, stroke: "url(#metal)", "stroke-width": 2 }, gr);
    L.svg("circle", { cx: q.x, cy: q.y, r: 2, fill: "#111" }, gr);
    L.svg("rect", { x: q.x - 12, y: q.y - 66, width: 36, height: 70, fill: "#000", opacity: 0.001 }, gr);
  }

  function afficheur(g, V) {
    // Tension mesurée entre la pointe et la plaque à 0 V.
    L.texte(g, 825, 290, `${V.toFixed(2).replace(".", ",")} V`, { "font-size": 13, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
  }

  L.cuve_rheo = { fond, pointe, afficheur, potentiel, vers_cuve, ecran, U, X1, X2, LX, LY };
})(window.Labo);

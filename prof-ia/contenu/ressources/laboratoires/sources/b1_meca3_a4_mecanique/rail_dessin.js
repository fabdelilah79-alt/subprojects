/*
Rôle : dessin du rail à coussin d'air incliné (échelle 0,6 px/mm, sin α = 0,100) : rail d'un mètre gradué le long de son
       chant (0 au drapeau du mobile retenu en haut), pieds, cale de 9 cm sous le pied du haut, électroaimant de retenue
       et son boîtier, butée en bas, deux cellules (x = 20 et 80 cm) câblées au chronomètre à deux voies, soufflerie et
       son tuyau ; mobile de 200 g avec drapeau de 2,0 cm.
Reçoit : le groupe SVG ; la position x (m) du drapeau, les faisceaux coupés, les durées affichées, le débit choisi.
Produit : Labo.rail_dessin = { fond(g), mobile(g, x), cellules(g, coupees), afficheurs(g, dt1, dt2, debit), point(x, n),
          X_CELLULES }.
Utilisé par : poste_rail.js.
*/
(function (L) {
  const MM = 0.6, O = { x: 236, y: 400 }, SIN = 0.1, COS = Math.sqrt(1 - SIN * SIN), TABLE = 560, X_CELLULES = [0.2, 0.8];
  const point = (x, n = 0) => ({ x: O.x + x * 1000 * MM * COS - n * SIN, y: O.y + x * 1000 * MM * SIN + n * COS });
  const ANGLE = (Math.asin(SIN) * 180) / Math.PI;

  function fond(g) {
    // Soufflerie et tuyau, pieds et cale, rail gradué, électroaimant et boîtier, butée, chronomètre et fiche des données.
    L.svg("rect", { x: 470, y: 470, width: 140, height: 86, rx: 6, fill: "#5a6b78", stroke: "#222" }, g);
    L.texte(g, 540, 483, "SOUFFLERIE", { "font-size": 7.5, "font-weight": 700, fill: "#eef" });
    const m = point(0.45, 10);
    L.svg("path", { d: `M${m.x} ${m.y} C${m.x} ${m.y + 30} 470 470 486 470`, fill: "none", stroke: "#2b2f33", "stroke-width": 7 }, g);
    const h = point(0.06, 8), b = point(0.94, 8);
    L.svg("rect", { x: h.x - 22, y: TABLE - 54, width: 44, height: 54, fill: "url(#bois-face)", stroke: "#6b4a2a" }, g);
    L.texte(g, h.x, TABLE - 22, "cale 9 cm", { "font-size": 6.5, fill: "#3b2a12" });
    L.svg("rect", { x: h.x - 4, y: h.y, width: 8, height: TABLE - 54 - h.y, fill: "url(#metal)" }, g);
    L.svg("rect", { x: b.x - 4, y: b.y, width: 8, height: TABLE - b.y, fill: "url(#metal)" }, g);
    const r = L.svg("g", { transform: `translate(${O.x} ${O.y}) rotate(${ANGLE})` }, g);
    L.svg("rect", { x: -52, y: 0, width: 1000 * MM + 62, height: 12, fill: "url(#metal-h)", stroke: "#5b646a" }, r);
    for (let cm = 0; cm <= 100; cm++) L.svg("line", { x1: cm * 6, y1: 12, x2: cm * 6, y2: 12 - (cm % 10 ? (cm % 5 ? 2 : 3.5) : 5.5), stroke: "#222", "stroke-width": cm % 10 ? 0.4 : 0.8 }, r);
    for (let cm = 0; cm <= 100; cm += 10) L.texte(r, cm * 6, 21, String(cm), { "font-size": 6, "font-weight": 700, fill: "#e8ecef" });
    L.svg("rect", { x: -50, y: -24, width: 12, height: 24, fill: "#7a2a22", stroke: "#2b0f0c" }, r);
    L.svg("rect", { x: 1000 * MM + 2, y: -18, width: 8, height: 18, fill: "#2b2f33" }, r);
    const a = point(0, -24), boite = { x: 100, y: 262 };
    L.svg("path", { d: `M${a.x - 44} ${a.y + 2} C${a.x - 46} ${a.y - 30} ${boite.x + 110} ${boite.y + 70} ${boite.x + 110} ${boite.y + 50}`, fill: "none", stroke: "#1b1e21", "stroke-width": 2.2 }, g);
    L.svg("rect", { x: boite.x, y: boite.y, width: 110, height: 80, rx: 6, fill: "#2c3e50", stroke: "#111" }, g);
    L.texte(g, boite.x + 55, boite.y + 13, "ÉLECTROAIMANT", { "font-size": 7.5, "font-weight": 700, fill: "#e8ecef" });
    L.svg("rect", { x: 740, y: 230, width: 150, height: 92, rx: 6, fill: "#c7ccd0", stroke: "#555" }, g);
    L.texte(g, 815, 243, "CHRONOMÈTRE 2 VOIES", { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
    for (const [k, y] of [[1, 250], [2, 284]]) { L.svg("rect", { x: 768, y, width: 114, height: 24, rx: 3, fill: "#1d2a22" }, g); L.texte(g, 756, y + 15, String(k), { "font-size": 9, "font-weight": 700, fill: "#23315a" }); }
    L.svg("rect", { x: 560, y: 120, width: 300, height: 76, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0" }, g);
    ["Mobile : m = 200 g ; drapeau ℓ = 2,0 cm", "Rail : sin α = 0,100 ; cellules à x = 20 et 80 cm", "z = (1,00 − x)·sin α au-dessus du bas du rail"].forEach((t, i) => L.texte(g, 710, 140 + i * 18, t, { "font-size": 9, fill: "#222" }));
  }

  function cellules(g, coupees) {
    // Fourches au-dessus du rail, faisceau, câbles jusqu'aux bornes du chronomètre.
    X_CELLULES.forEach((x, k) => {
      const p = point(x, -14), q = point(x, -44), c = k ? "#c0392b" : "#1f2d3a", by = 262 + k * 34;
      L.svg("path", { d: `M${q.x} ${q.y} C${q.x} ${q.y - 60} 700 ${by} 737 ${by}`, fill: "none", stroke: c, "stroke-width": 2 }, g);
      L.svg("circle", { cx: 740, cy: by, r: 3, fill: c }, g);
      L.svg("path", { d: `M${q.x - 8} ${q.y} H${q.x + 8} L${p.x + 8} ${p.y + 10} H${p.x - 8} Z`, fill: "#20262b" }, g);
      L.svg("circle", { cx: q.x + 10, cy: q.y + 4, r: 2.5, fill: coupees[k] ? "#ff3b30" : "#3d1512" }, g);
    });
  }

  function mobile(g, x) {
    // Mobile en U renversé (12 cm), drapeau centré en x (m).
    const r = L.svg("g", { transform: `translate(${point(x).x} ${point(x).y}) rotate(${ANGLE})` }, g);
    L.svg("path", { d: "M-36 6 V-18 H36 V6 h-5 V-12 H-31 V6 Z", fill: "#c7362f", stroke: "#6b1813" }, r);
    L.svg("rect", { x: -6, y: -36, width: 12, height: 18, fill: "#1d1d1d" }, r);
  }

  function afficheurs(g, dt1, dt2, debit) {
    // Durées d'occultation (ms) et voyant du débit de la soufflerie.
    [[dt1, 266], [dt2, 300]].forEach(([dt, y]) => L.texte(g, 825, y, dt === null ? "- - - -" : `Δt = ${(dt * 1000).toFixed(2).replace(".", ",")} ms`, { "font-size": 10.5, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" }));
    L.texte(g, 540, 549, debit === "normal" ? "débit normal" : "débit faible : frottement", { "font-size": 7.5, "font-weight": 700, fill: debit === "normal" ? "#9df5b0" : "#ffb199" });
  }

  L.rail_dessin = { fond, cellules, mobile, afficheurs, point, X_CELLULES };
})(window.Labo);

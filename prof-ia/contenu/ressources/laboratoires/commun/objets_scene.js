/*
Rôle : objets de la vie courante dessinés en 2,5D pour les simulations d'optique : lampe d'architecte (socle lesté, bras
       articulés à ressorts, abat-jour conique orienté, ampoule, cône de lumière), livre fermé posé à plat (couverture,
       tranche des pages), élève assis vu de profil, tourné vers la gauche (visage ombré, cheveux, oreille, œil, pull).
Reçoit : le groupe SVG et les réglages (positions à l'écran).
Produit : Labo.lampe_bureau(g, { x, sol, coude, tete, cible, allumee }) -> { foyer (point d'où part la lumière) } ;
          Labo.livre(g, { x, y, l, titre }) -> { dessus (milieu de la couverture) } ; Labo.observateur(g, { x, y }) (x, y : œil).
Utilisé par : les simulations d'optique.
*/
(function (L) {
  L.lampe_bureau = function (g, { x, sol, coude, tete, cible, allumee }) {
    // Socle, deux bras doubles et leurs ressorts, articulations, abat-jour tourné vers la cible, lumière.
    L.ombre_sol(g, x + 6, sol + 2, 44, 8, 0.5);
    L.svg("ellipse", { cx: x, cy: sol - 3, rx: 36, ry: 9, fill: "#1e2226" }, g);
    L.svg("ellipse", { cx: x, cy: sol - 7, rx: 34, ry: 8, fill: "url(#acier)", stroke: "#000" }, g);
    L.svg("rect", { x: x - 6, y: sol - 22, width: 12, height: 16, rx: 2, fill: "#2b3035" }, g);
    const base = { x, y: sol - 20 };
    for (const [a, b] of [[base, coude], [coude, tete]]) {
      L.tige(g, `M${a.x - 3} ${a.y} L${b.x - 3} ${b.y}`, 4); L.tige(g, `M${a.x + 4} ${a.y} L${b.x + 4} ${b.y}`, 3);
      const n = 9, z = Array.from({ length: n + 1 }, (_, k) => `${a.x + 10 + ((b.x - a.x) * k) / n + (k % 2 ? 3 : -3)} ${a.y + ((b.y - a.y) * k) / n}`).join(" L");
      L.svg("path", { d: `M${z}`, fill: "none", stroke: "#9aa3a9", "stroke-width": 1 }, g);
    }
    for (const p of [base, coude, tete]) { L.svg("circle", { cx: p.x, cy: p.y, r: 6, fill: "#2b3035", stroke: "#000" }, g); L.svg("circle", { cx: p.x, cy: p.y, r: 2.2, fill: "url(#metal)" }, g); }
    const ang = (Math.atan2(cible.y - tete.y, cible.x - tete.x) * 180) / Math.PI, u = { x: Math.cos((ang * Math.PI) / 180), y: Math.sin((ang * Math.PI) / 180) };
    if (allumee) L.svg("path", { d: `M${tete.x + 14 * u.x - 26 * u.y} ${tete.y + 14 * u.y + 26 * u.x} L${cible.x - 90} ${cible.y + 4} L${cible.x + 90} ${cible.y + 4} L${tete.x + 14 * u.x + 26 * u.y} ${tete.y + 14 * u.y - 26 * u.x} Z`, fill: "#fff3b0", opacity: 0.12 }, g);
    const c = L.svg("g", { transform: `translate(${tete.x} ${tete.y}) rotate(${ang})` }, g);
    L.svg("path", { d: "M-30 -9 L14 -28 A7 28 0 0 1 14 28 L-30 9 Z", fill: "#3a6ea5", stroke: "#123" }, c);
    L.svg("path", { d: "M-30 -9 L14 -28 L14 -14 L-30 -3 Z", fill: "#fff", opacity: 0.18 }, c);
    L.svg("ellipse", { cx: 14, cy: 0, rx: 7, ry: 28, fill: allumee ? "#fff6c2" : "#1b2733", stroke: "#123" }, c);
    L.svg("ellipse", { cx: 12, cy: 0, rx: 4, ry: 12, fill: allumee ? "#ffffff" : "#6b6b60" }, c);
    if (allumee) L.svg("circle", { cx: tete.x + 16 * u.x, cy: tete.y + 16 * u.y, r: 40, fill: "url(#halo)" }, g);
    return { foyer: { x: tete.x + 14 * u.x, y: tete.y + 14 * u.y } };
  };

  L.livre = function (g, { x, y, l = 120, titre = "PHYSIQUE" }) {
    // Livre fermé à plat : ombre, tranche des pages (face avant et côté), couverture (dessus), titre.
    const e = 14, d = 34, k = 10, a = x - l / 2, b = x + l / 2;
    L.ombre_sol(g, x + 6, y + 2, l / 2 + 8, 7, 0.45);
    L.svg("path", { d: `M${a} ${y - e} H${b} V${y} H${a} Z`, fill: "#f4eedb", stroke: "#a99f7d" }, g);
    for (let t = 3; t < e; t += 2.5) L.svg("line", { x1: a + 2, y1: y - e + t, x2: b - 2, y2: y - e + t, stroke: "#d8cfb0", "stroke-width": 0.6 }, g);
    L.svg("path", { d: `M${b} ${y - e} L${b + k} ${y - e - d} V${y - d} L${b} ${y} Z`, fill: "#e2d9bd", stroke: "#a99f7d" }, g);
    L.svg("path", { d: `M${a} ${y - e} L${a + k} ${y - e - d} H${b + k} L${b} ${y - e} Z`, fill: "#2f8f5b", stroke: "#14502f" }, g);
    L.svg("path", { d: `M${a} ${y - e} L${a + k} ${y - e - d} H${a + k + 10} L${a + 10} ${y - e} Z`, fill: "#1f6b42" }, g);
    L.svg("path", { d: `M${a} ${y - e} V${y} M${a} ${y - e} L${a - 2} ${y - e / 2} L${a} ${y}`, fill: "none", stroke: "#1f6b42", "stroke-width": 3 }, g);
    L.texte(g, x + k / 2 + 5, y - e - d / 2, titre, { "font-size": 9, "font-weight": 700, fill: "#f2f2e6", "letter-spacing": 1 });
    return { dessus: { x: x + k / 2, y: y - e - d / 2 } };
  };

  L.observateur = function (g, { x, y }) {
    // Élève de profil, regard vers la gauche : pull, cou, visage (dégradé), cheveux, oreille, œil, sourcil, lèvres.
    const P = (dx, dy) => `${x + dx} ${y + dy}`;
    L.svg("path", { d: `M${P(6, 90)} C${P(-30, 100)} ${P(-48, 120)} ${P(-54, 175)} H${x + 120} C${P(118, 130)} ${P(100, 100)} ${P(56, 86)} Z`, fill: "#3d5f8f", stroke: "#22385a" }, g);
    L.svg("path", { d: `M${P(14, 60)} L${P(16, 94)} C${P(30, 100)} ${P(46, 98)} ${P(54, 88)} L${P(48, 52)} Z`, fill: "#d9a27a" }, g);
    L.svg("path", { d: `M${P(30, -62)} C${P(4, -60)} ${P(-6, -44)} ${P(-8, -24)} Q${P(-8, -10)} ${P(-11, -4)} Q${P(-14, 6)} ${P(-26, 20)} Q${P(-22, 26)} ${P(-13, 26)} Q${P(-17, 31)} ${P(-15, 33)} Q${P(-11, 36)} ${P(-15, 40)} Q${P(-14, 52)} ${P(-8, 57)} Q${P(8, 66)} ${P(24, 62)} C${P(52, 56)} ${P(70, 40)} ${P(72, 10)} C${P(74, -30)} ${P(60, -62)} ${P(30, -62)} Z`, fill: "#e6b48d", stroke: "#a4704c", "stroke-width": 0.8 }, g);
    L.svg("path", { d: `M${P(40, -40)} C${P(70, -30)} ${P(72, 20)} ${P(60, 44)} C${P(70, 20)} ${P(68, -10)} ${P(40, -40)} Z`, fill: "#b37d58", opacity: 0.6 }, g);
    L.svg("path", { d: `M${P(-6, -36)} C${P(0, -66)} ${P(50, -76)} ${P(72, -40)} C${P(80, -20)} ${P(76, 10)} ${P(66, 26)} C${P(60, 6)} ${P(52, -10)} ${P(46, -24)} C${P(30, -40)} ${P(10, -40)} ${P(-6, -36)} Z`, fill: "#2b1d14" }, g);
    L.svg("ellipse", { cx: x + 38, cy: y + 10, rx: 7, ry: 12, fill: "#dca47c", stroke: "#a4704c" }, g);
    L.svg("path", { d: `M${P(-9, -10)} Q${P(-2, -15)} ${P(8, -11)}`, fill: "none", stroke: "#2b1d14", "stroke-width": 2 }, g);
    L.svg("path", { d: `M${P(-9, 0)} Q${P(-2, -5)} ${P(5, 0)} Q${P(-2, 4)} ${P(-9, 0)} Z`, fill: "#fff", stroke: "#6b4a34", "stroke-width": 0.7 }, g);
    L.svg("circle", { cx: x - 5, cy: y, r: 2.4, fill: "#3b5a7a" }, g);
    L.svg("path", { d: `M${P(-16, 34)} Q${P(-12, 36)} ${P(-14, 38)}`, fill: "none", stroke: "#b5534a", "stroke-width": 2 }, g);
  };
})(window.Labo);

/*
Rôle : banc d'optique de 1 m en 2,5D : rail d'aluminium gradué en centimètres sur deux pieds ; cavaliers (blocs serrés sur
       le rail, tige verticale) ; lanterne avec sa lampe et l'objet lumineux « F » (2,0 cm) sur sa diapositive ; lentille dans
       sa bague noire, avec son étiquette ; oculaire (petite lentille dans un tube noir) ; écran blanc gradué (12 cm), tourné vers la lentille.
Reçoit : le groupe SVG et { x0 (abscisse écran du 0 du rail), k (px par cm), rail (y du dessus du rail), axe (y de l'axe) }.
Produit : Labo.banc_optique(g, reglage) -> banc { px(cm), cm(px), k, rail, axe } ; Labo.cavalier(g, banc, x, haut) ;
          Labo.lanterne_banc(g, banc, { x, taille (cm, 2 par défaut) }) ; Labo.lentille_banc(g, banc, { x, nom, diaphragme, ry }) ;
          Labo.oculaire_banc(g, banc, { x, nom }) ;
          Labo.ecran_banc(g, banc, { x }) -> transformation (mm de l'écran -> écran) pour y dessiner l'image.
Utilisé par : image_banc.js et les simulations d'optique (lentilles).
*/
(function (L) {
  L.banc_optique = function (g, { x0 = 80, k = 8, rail = 470, axe = 320 } = {}) {
    // Pieds, rail (dessus clair, face graduée), chiffres tous les 10 cm.
    const b = { k, rail, axe, px: (c) => x0 + c * k, cm: (p) => (p - x0) / k };
    for (const c of [4, 96]) { L.svg("rect", { x: b.px(c) - 30, y: rail + 14, width: 60, height: 40, rx: 4, fill: "url(#acier)", stroke: "#111" }, g); L.ombre_sol(g, b.px(c), rail + 56, 40, 6, 0.5); }
    L.svg("rect", { x: b.px(0) - 6, y: rail - 6, width: 100 * k + 12, height: 6, fill: "url(#metal-h)", stroke: "#666" }, g);
    L.svg("rect", { x: b.px(0) - 6, y: rail, width: 100 * k + 12, height: 16, fill: "url(#metal)", stroke: "#666" }, g);
    for (let c = 0; c <= 100; c++) L.svg("line", { x1: b.px(c), y1: rail, x2: b.px(c), y2: rail + (c % 10 ? (c % 5 ? 4 : 7) : 10), stroke: "#222", "stroke-width": c % 10 ? 0.5 : 0.9 }, g);
    for (let c = 0; c <= 100; c += 10) L.texte(g, b.px(c), rail + 13, String(c), { "font-size": 6.5, "font-weight": 700, fill: "#222" });
    return b;
  };

  L.cavalier = function (g, b, x, haut) {
    // Bloc serré sur le rail (vis de blocage), index qui pointe la graduation, tige jusqu'à la hauteur haut.
    const p = b.px(x);
    L.svg("rect", { x: p - 16, y: b.rail - 16, width: 32, height: 20, rx: 3, fill: "#2b3035", stroke: "#000" }, g);
    L.svg("path", { d: `M${p - 3} ${b.rail + 4} L${p} ${b.rail + 9} L${p + 3} ${b.rail + 4} Z`, fill: "#ffd54f" }, g);
    L.svg("circle", { cx: p + 18, cy: b.rail - 6, r: 4, fill: "#111" }, g);
    L.tige(g, `M${p} ${b.rail - 16} V${haut}`, 6);
  };

  L.lanterne_banc = function (g, b, { x, taille = 2 }) {
    // Lanterne (boîtier, ouïes, lampe qui éclaire la diapositive), diapositive portant le « F » lumineux (taille en cm, pied A sur l'axe).
    const p = b.px(x);
    L.cavalier(g, b, x - 4, b.axe + 40);
    L.svg("rect", { x: p - 80, y: b.axe - 50, width: 74, height: 90, rx: 6, fill: "#2f3a45", stroke: "#111" }, g);
    for (let k = 0; k < 5; k++) L.svg("rect", { x: p - 70, y: b.axe - 40 + k * 14, width: 30, height: 5, rx: 2, fill: "#1b2229" }, g);
    const T = (u, v) => ({ x: p - 22 + (u * 40) / 60, y: b.axe + v - (u * 4) / 60 }), c = [T(-30, -30), T(30, -30), T(30, 30), T(-30, 30)];
    L.svg("path", { d: `M${c.map((q) => `${q.x} ${q.y}`).join(" L")} Z`, fill: "#16191c", stroke: "#000" }, g);
    const s = taille / 2, F = [[0, 0, 0, -20], [0, -20, 12, -20], [0, -11, 8, -11]].map(([a, d, e, f]) => { const m = T(s * a, s * d), n = T(s * e, s * f); return `M${m.x} ${m.y} L${n.x} ${n.y}`; }).join(" ");
    L.svg("path", { d: F, fill: "none", stroke: "#fff3b0", "stroke-width": Math.max(1.6, 1.6 * taille), "stroke-linecap": "square" }, g);
    L.svg("path", { d: F, fill: "none", stroke: "#fff3b0", "stroke-width": 8, opacity: 0.25 }, g);
    L.svg("path", { d: `M${p - 80} ${b.axe + 30} C${p - 110} ${b.axe + 60} ${p - 100} ${b.rail} ${p - 120} ${b.rail + 60}`, fill: "none", stroke: "#1b1e21", "stroke-width": 2.4 }, g);
    L.texte(g, p - 43, b.axe - 58, `lanterne + objet « F » (AB = ${taille >= 1 ? `${String(taille.toFixed(1)).replace(".", ",")} cm` : `${Math.round(taille * 10)} mm`})`, { "font-size": 7, "font-weight": 700, fill: "#e8e2d4" });
  };

  L.lentille_banc = function (g, b, { x, nom, diaphragme, ry = 30 }) {
    // Lentille (5 cm de diamètre par défaut : ry = 30) dans sa bague (vue de trois quarts), diaphragme éventuel, étiquette.
    const p = b.px(x);
    L.cavalier(g, b, x, b.axe + ry);
    L.svg("ellipse", { cx: p, cy: b.axe, rx: 9 * ry / 30, ry, fill: "#1e2226" }, g);
    L.svg("ellipse", { cx: p, cy: b.axe, rx: 6 * ry / 30, ry: ry - 5, fill: "#cfe8ef", opacity: 0.8 }, g);
    L.svg("ellipse", { cx: p - 2, cy: b.axe - ry / 4, rx: 1.5, ry: ry * 0.3, fill: "#fff", opacity: 0.7 }, g);
    if (diaphragme) { L.svg("ellipse", { cx: p - 4, cy: b.axe, rx: 6, ry: 25, fill: "#24282c" }, g); L.svg("ellipse", { cx: p - 4, cy: b.axe, rx: 2.5, ry: 8, fill: "#cfe8ef" }, g); }
    const l = Math.max(44, nom.length * 4.1);
    L.svg("rect", { x: p - l / 2, y: b.axe + ry + 6, width: l, height: 14, rx: 2, fill: "#fdfdf8", stroke: "#999" }, g);
    L.texte(g, p, b.axe + ry + 13, nom, { "font-size": 7, "font-weight": 700, fill: "#222" });
  };

  L.oculaire_banc = function (g, b, { x, nom }) {
    // Tube noir de l'oculaire sur son cavalier, petite lentille (3 cm) vue de trois quarts, étiquette.
    const p = b.px(x);
    L.cavalier(g, b, x, b.axe + 18);
    L.svg("rect", { x: p - 12, y: b.axe - 18, width: 26, height: 36, rx: 3, fill: "#1f2327", stroke: "#000" }, g);
    L.svg("ellipse", { cx: p - 12, cy: b.axe, rx: 5, ry: 14, fill: "#111" }, g);
    L.svg("ellipse", { cx: p - 12, cy: b.axe, rx: 3.4, ry: 11, fill: "#cfe8ef", opacity: 0.8 }, g);
    const l = Math.max(44, nom.length * 4.1);
    L.svg("rect", { x: p - l / 2, y: b.axe + 24, width: l, height: 14, rx: 2, fill: "#fdfdf8", stroke: "#999" }, g);
    L.texte(g, p, b.axe + 31, nom, { "font-size": 7, "font-weight": 700, fill: "#222" });
  };

  L.ecran_banc = function (g, b, { x }) {
    // Écran blanc de 12 cm (vu de biais : face de 60 px, centrée sur sa tige), quadrillé au centimètre ; transformation mm -> écran.
    const p = b.px(x), T = (u, v) => ({ x: p + (u * 60) / 120, y: b.axe + v - (u * 6) / 120 });
    L.cavalier(g, b, x, b.axe + 66);
    const c = [T(-60, -60), T(60, -60), T(60, 60), T(-60, 60)];
    L.svg("path", { d: `M${c[1].x} ${c[1].y} l8 -4 V${c[2].y - 4} l-8 4 Z`, fill: "#b9b6aa" }, g);
    L.svg("path", { d: `M${c.map((q) => `${q.x} ${q.y}`).join(" L")} Z`, fill: "#f7f6f0", stroke: "#999" }, g);
    for (let v = -50; v <= 50; v += 10) { const a = T(-60, v), d = T(60, v); L.svg("line", { x1: a.x, y1: a.y, x2: d.x, y2: d.y, stroke: v ? "#e1ded3" : "#c9c4b0", "stroke-width": 0.5 }, g); }
    for (let u = -50; u <= 50; u += 10) { const a = T(u, -60), d = T(u, 60); L.svg("line", { x1: a.x, y1: a.y, x2: d.x, y2: d.y, stroke: "#e1ded3", "stroke-width": 0.5 }, g); }
    return T;
  };
})(window.Labo);

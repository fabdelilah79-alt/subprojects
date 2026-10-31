/*
Rôle : logiciel d'acquisition d'un titrage pH-métrique sur l'ordinateur portable relié au pH-mètre : touche « Mesurer »
       (enregistre le volume versé et le pH affiché ; un point au même volume remplace l'ancien), « Effacer », « dpH/dV »
       (affiche la dérivée, calculée entre deux points successifs, en pointillés orange) ; graphique pH = f(V) (0 à 20 mL,
       pH 0 à 14) ; curseur vertical que l'on fait glisser : il affiche V, pH et dpH/dV (interpolés).
Reçoit : le groupe SVG et { x, y, l, h (portable), mesurer() -> { V (mL), pH } ou null }.
Produit : Labo.logiciel_ph(g, reglage) -> s ; fait « titrage_ph » = { n, points [[V, pH]], derivee (affichée), curseur { V, pH, d },
          v_max (milieu de l'intervalle où dpH/dV est maximal) }.
Utilisé par : poste_vinaigre.js.
*/
(function (L) {
  const VMAX = 20, fr = (v, n = 2) => v.toFixed(n).replace(".", ",");

  function derivee(points) {
    // dpH/dV au milieu de chaque intervalle entre deux points successifs.
    const d = [];
    for (let k = 1; k < points.length; k++) { const [v1, p1] = points[k - 1], [v2, p2] = points[k]; if (v2 - v1 > 1e-3) d.push([(v1 + v2) / 2, (p2 - p1) / (v2 - v1)]); }
    return d;
  }

  function lire(serie, V) {
    // Valeur interpolée linéairement à V (null hors de la série).
    for (let k = 1; k < serie.length; k++) if (serie[k - 1][0] <= V && V <= serie[k][0]) { const [a, pa] = serie[k - 1], [b, pb] = serie[k]; return pa + ((pb - pa) * (V - a)) / (b - a || 1); }
    return null;
  }

  function graphique(gg, G, s) {
    // Axes, graduations, points pH = f(V), dérivée (facultative) et curseur.
    gg.replaceChildren();
    const X = (V) => G.x + (V / VMAX) * G.l, Y = (pH) => G.y + G.h - (pH / 14) * G.h;
    L.svg("rect", { x: G.x, y: G.y, width: G.l, height: G.h, fill: "#fff", stroke: "#b9c0c6" }, gg);
    for (const V of [0, 5, 10, 15, 20]) { L.svg("line", { x1: X(V), y1: G.y, x2: X(V), y2: G.y + G.h, stroke: "#eef0ec" }, gg); L.texte(gg, X(V), G.y + G.h + 8, String(V), { "font-size": 5.5, fill: "#333" }); }
    for (const p of [0, 2, 4, 6, 8, 10, 12, 14]) { L.svg("line", { x1: G.x, y1: Y(p), x2: G.x + G.l, y2: Y(p), stroke: "#eef0ec" }, gg); L.texte(gg, G.x - 4, Y(p) + 2, String(p), { "font-size": 5.5, fill: "#333", "text-anchor": "end" }); }
    L.texte(gg, G.x + 2, G.y - 3, "pH", { "font-size": 6, "font-weight": 700, fill: "#23315a", "text-anchor": "start" });
    L.texte(gg, G.x + G.l, G.y + G.h + 15, "V (mL)", { "font-size": 6, "font-weight": 700, fill: "#23315a", "text-anchor": "end" });
    for (const [V, p] of s.points) L.svg("path", { d: `M${X(V) - 1.6} ${Y(p)} h3.2 M${X(V)} ${Y(p) - 1.6} v3.2`, stroke: "#c62828", "stroke-width": 0.9 }, gg);
    const d = derivee(s.points), dm = Math.max(1, ...d.map((q) => q[1]));
    if (s.derivee && d.length > 1) {
      L.svg("path", { d: d.map(([V, q], k) => `${k ? "L" : "M"}${X(V).toFixed(1)} ${(G.y + G.h - (q / dm) * G.h * 0.95).toFixed(1)}`).join(" "), fill: "none", stroke: "#ef8f00", "stroke-width": 1, "stroke-dasharray": "3 2" }, gg);
      L.texte(gg, G.x + G.l - 2, G.y + 7, "dpH/dV", { "font-size": 5.5, "font-weight": 700, fill: "#ef8f00", "text-anchor": "end" });
    }
    if (s.curseur !== null) L.svg("line", { x1: X(s.curseur), y1: G.y, x2: X(s.curseur), y2: G.y + G.h, stroke: "#2f4a6b", "stroke-width": 0.8 }, gg);
    return d;
  }

  function touche(g, x, y, l, texte, f) {
    // Touche grise du logiciel.
    const b = L.svg("g", { class: `logiciel-ph-${texte.replace(/\W/g, "").toLowerCase()}`, role: "button", "aria-label": texte }, g);
    L.svg("rect", { x, y, width: l, height: 13, rx: 2, fill: "#e4e8ec", stroke: "#8a96a0" }, b);
    L.texte(b, x + l / 2, y + 9, texte, { "font-size": 6.5, "font-weight": 700, fill: "#23315a" });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: f });
  }

  L.logiciel_ph = function (g, { x, y, l, h, mesurer }) {
    // Portable, touches, graphique et curseur ; fait noté à chaque changement.
    const d = L.portable(g, { x, y, l, h, titre: "Titrage pH-métrique — acquisition" }), s = { points: [], derivee: false, curseur: null };
    const G = { x: d.x + 22, y: d.y + 40, l: d.l - 32, h: d.h - 78 }, gg = L.svg("g", {}, g), info = L.svg("g", { "pointer-events": "none" }, g);
    const maj = () => {
      const der = graphique(gg, G, s), c = s.curseur, pH = c === null ? null : lire(s.points, c), q = c === null ? null : lire(der, c);
      info.replaceChildren();
      L.texte(info, d.x + 8, d.y + d.h - 8, `${s.points.length} points    ${c === null ? "curseur : touchez le graphique" : `V = ${fr(c)} mL   pH = ${pH === null ? "—" : fr(pH)}   dpH/dV = ${q === null ? "—" : fr(q, 1)}`}`, { "font-size": 6.5, fill: "#23315a", "text-anchor": "start" });
      const m = der.reduce((a, b) => (b[1] > a[1] ? b : a), [0, -1]);
      L.missions.noter("titrage_ph", { n: s.points.length, points: s.points.map(([V, p]) => [Math.round(V * 100) / 100, p]), derivee: s.derivee, curseur: { V: c, pH, d: q }, v_max: m[1] > 0 ? Math.round(m[0] * 100) / 100 : null });
    };
    touche(g, d.x + 8, d.y + 19, 48, "Mesurer", () => { const m = mesurer(); if (!m) return; s.points = s.points.filter((p) => Math.abs(p[0] - m.V) > 0.005).concat([[m.V, m.pH]]).sort((a, b) => a[0] - b[0]); maj(); });
    touche(g, d.x + 62, d.y + 19, 42, "Effacer", () => { s.points = []; s.curseur = null; maj(); });
    touche(g, d.x + 110, d.y + 19, 42, "dpH/dV", () => { s.derivee = !s.derivee; maj(); });
    const zone = L.svg("rect", { x: G.x, y: G.y, width: G.l, height: G.h, fill: "#fff", opacity: 0.001, class: "logiciel-ph-graphique" }, g);
    const placer = (p) => { s.curseur = Math.max(0, Math.min(VMAX, ((p.x - G.x) / G.l) * VMAX)); maj(); };
    zone.addEventListener("pointerdown", (e) => placer(L.scene.vers_scene(e)));
    L.glissable(zone, { soulever: false, debut: () => ({ x: G.x + ((s.curseur ?? 0) / VMAX) * G.l, y: G.y }), deplacer: placer });
    maj();
    return s;
  };
})(window.Labo);

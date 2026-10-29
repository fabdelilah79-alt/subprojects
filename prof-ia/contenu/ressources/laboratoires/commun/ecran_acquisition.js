/*
Rôle : ordinateur portable et logiciel d'acquisition : barre de touches (Durée, Lancer, Effacer, Tangente), graphique des
       tensions enregistrées (EA0 en rouge, EA1 en orange ; les deux acquisitions précédentes restent en clair, pour
       comparer), curseur vertical que l'on fait glisser et qui affiche t et les tensions, tangente à l'origine de la
       dernière courbe EA0 jusqu'à son asymptote.
Reçoit : le groupe SVG, { x, y } (coin de l'écran) et les actions { duree(), lancer(), effacer(), tangente(), curseur(t) }.
Produit : Labo.ecran_acquisition(g, coin, actions) -> tracer(s) ; s = { duree, etat, courbes [{ pts [[t, u0, u1]] }],
          curseur (s), tangente }.
Utilisé par : interface_acquisition.js.
*/
(function (L) {
  const P = { dx: 54, dy: 44, l: 356, h: 150 }, fmt = (v, n = 2) => v.toFixed(n).replace(".", ",").replace("-", "−");

  function portable(g, x, y) {
    // Écran (cadre noir, dalle blanche), charnière, clavier en perspective sur la paillasse.
    L.ombre_sol(g, x + 220, y + 318, 240, 10, 0.4);
    L.svg("path", { d: `M${x - 10} ${y + 270} h460 l30 44 h-520 Z`, fill: "#b9bec3", stroke: "#6c737a" }, g);
    for (let r = 0; r < 4; r++) L.svg("rect", { x: x + 10 - r * 6, y: y + 276 + r * 9, width: 420 + r * 12, height: 6, rx: 1, fill: "#40464c", opacity: 0.7 }, g);
    L.svg("rect", { x, y, width: 440, height: 268, rx: 8, fill: "#1b1e21", stroke: "#000" }, g);
    L.svg("rect", { x: x + 10, y: y + 10, width: 420, height: 246, fill: "#fbfbf8" }, g);
  }

  function touches(g, x, y, a) {
    // Touches du logiciel (petits boutons gris).
    [["Durée", a.duree], ["Lancer", a.lancer], ["Effacer", a.effacer], ["Tangente", a.tangente]].forEach(([t, f], k) => {
      const b = L.svg("g", { class: `logiciel-${t.toLowerCase()}`, role: "button", "aria-label": t }, g);
      L.svg("rect", { x: x + 16 + k * 62, y: y + 14, width: 56, height: 17, rx: 3, fill: "#e4e8ec", stroke: "#8a96a0" }, b);
      L.texte(b, x + 44 + k * 62, y + 26, t, { "font-size": 8, "font-weight": 700, fill: "#23315a" });
      L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: f });
    });
  }

  function echelles(s) {
    // Bornes du graphique : 0 à la durée ; tensions arrondies au volt.
    const u = s.courbes.flatMap((c) => c.pts.flatMap((p) => [p[1], p[2]]));
    return { tmax: s.duree, umax: Math.max(1, Math.ceil(Math.max(0, ...u))), umin: Math.min(0, Math.floor(Math.min(0, ...u))) };
  }

  function axes(g, x0, y0, e) {
    // Quadrillage, graduations, titres des axes.
    for (let k = 0; k <= 10; k++) { const X = x0 + (k * P.l) / 10; L.svg("line", { x1: X, y1: y0, x2: X, y2: y0 + P.h, stroke: "#e2e2dc", "stroke-width": 0.6 }, g); if (k % 2 === 0) L.texte(g, X, y0 + P.h + 11, fmt((k * e.tmax) / 10, e.tmax < 2 ? 2 : 1), { "font-size": 6.5, fill: "#333" }); }
    const pasu = Math.max(1, Math.ceil((e.umax - e.umin) / 6));
    for (let u = e.umin; u <= e.umax + 1e-9; u += pasu) { const Y = y0 + P.h - ((u - e.umin) / (e.umax - e.umin)) * P.h; L.svg("line", { x1: x0, y1: Y, x2: x0 + P.l, y2: Y, stroke: u === 0 ? "#999" : "#e2e2dc", "stroke-width": 0.6 }, g); L.texte(g, x0 - 6, Y + 2.5, String(u).replace("-", "−"), { "font-size": 6.5, fill: "#333", "text-anchor": "end" }); }
    L.texte(g, x0 + P.l, y0 + P.h + 22, "t (s)", { "font-size": 7, "font-weight": 700, fill: "#333", "text-anchor": "end" });
    L.texte(g, x0 - 6, y0 - 6, "u (V)", { "font-size": 7, "font-weight": 700, fill: "#333", "text-anchor": "start" });
  }

  function courbes(g, s, X, Y) {
    // Courbes EA0 et EA1 ; les anciennes en clair ; tangente à l'origine de la dernière courbe EA0.
    s.courbes.forEach((c, n) => {
      const vieille = n < s.courbes.length - 1;
      for (const v of [1, 2]) { if (v === 2 && c.pts.every((p) => Math.abs(p[2]) < 0.1)) continue; L.svg("path", { d: c.pts.map((p, k) => `${k ? "L" : "M"}${X(p[0]).toFixed(1)} ${Y(p[v]).toFixed(1)}`).join(" "), fill: "none", stroke: v === 1 ? "#d32f2f" : "#f29d0b", "stroke-width": vieille ? 1 : 1.6, opacity: vieille ? 0.35 : 1 }, g); }
    });
    const d = s.courbes[s.courbes.length - 1];
    if (!s.tangente || !d || d.pts.length < 10) return;
    const [p0, p3] = [d.pts[0], d.pts[3]], pente = (p3[1] - p0[1]) / (p3[0] - p0[0]), fin = d.pts[d.pts.length - 1][1], tt = (fin - p0[1]) / pente;
    L.svg("line", { x1: X(0), y1: Y(p0[1]), x2: X(Math.min(tt, s.duree)), y2: Y(p0[1] + pente * Math.min(tt, s.duree)), stroke: "#1565c0", "stroke-width": 1, "stroke-dasharray": "4 3" }, g);
    L.svg("line", { x1: X(0), y1: Y(fin), x2: X(s.duree), y2: Y(fin), stroke: "#1565c0", "stroke-width": 0.8, "stroke-dasharray": "2 3" }, g);
    if (tt < s.duree) L.svg("circle", { cx: X(tt), cy: Y(fin), r: 3, fill: "#1565c0" }, g);
  }

  L.ecran_acquisition = function (g, { x, y }, a) {
    // Portable, touches, zone du graphique, curseur glissant ; renvoie la fonction qui redessine.
    portable(g, x, y); touches(g, x, y, a);
    const gg = L.svg("g", { "pointer-events": "none" }, g), x0 = x + P.dx, y0 = y + P.dy;
    const poignee = L.svg("rect", { x: x0, y: y0, width: P.l, height: P.h, fill: "#000", opacity: 0, class: "curseur-acquisition", role: "slider", "aria-label": "Curseur" }, g);
    let s0 = null;
    L.glissable(poignee, { soulever: false, debut: () => ({ x: x0 + ((s0?.curseur ?? 0) / (s0?.duree || 1)) * P.l, y: 0 }), deplacer: (p) => a.curseur(Math.max(0, Math.min(1, (p.x - x0) / P.l)) * (s0?.duree || 1)) });
    return (s) => {
      s0 = s; gg.replaceChildren();
      const e = echelles(s), X = (t) => x0 + (t / e.tmax) * P.l, Y = (u) => y0 + P.h - ((u - e.umin) / (e.umax - e.umin)) * P.h;
      axes(gg, x0, y0, e); courbes(gg, s, X, Y);
      const d = s.courbes[s.courbes.length - 1], p = d && d.pts.length ? d.pts.reduce((m, q) => (Math.abs(q[0] - s.curseur) < Math.abs(m[0] - s.curseur) ? q : m)) : null;
      L.svg("line", { x1: X(s.curseur), y1: y0, x2: X(s.curseur), y2: y0 + P.h, stroke: "#2e7d32", "stroke-width": 1 }, gg);
      L.texte(gg, x + 300, y + 26, `durée : ${fmt(s.duree, s.duree < 1 ? 1 : 0)} s · ${s.etat}`, { "font-size": 7.5, fill: "#23315a", "text-anchor": "start" });
      L.texte(gg, x + 220, y + 246, p ? `curseur : t = ${fmt(p[0], 3)} s ; EA0 = ${fmt(p[1])} V ; EA1 = ${fmt(p[2])} V` : "curseur : pas de mesure", { "font-size": 8.5, "font-weight": 700, fill: "#2e7d32" });
      return p;
    };
  };
})(window.Labo);

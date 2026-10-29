/*
Rôle : ordinateur portable et logiciel d'acquisition : barre de touches (Durée, Lancer, Effacer, Tangente, Voie 2 : EA1,
       −EA1, EA1 − EA0 ou Énergies), graphique des tensions enregistrées (EA0 en rouge, voie 2 en orange ; temps en ms pour les durées
       courtes ; les deux acquisitions précédentes restent en clair, pour
       comparer), curseur vertical que l'on fait glisser et qui affiche t et les tensions, tangente à l'origine de la
       dernière courbe EA0 jusqu'à son asymptote. Mode Énergies : Ee (rouge), Em (orange) et E = Ee + Em (bleu), en µJ.
Reçoit : le groupe SVG, { x, y } (coin de l'écran) et les actions { duree(), lancer(), effacer(), tangente(), voie2(), curseur(t) }.
Produit : Labo.ecran_acquisition(g, coin, actions) -> tracer(s) ; s = { duree, etat, courbes [{ pts [[t, u0, u1]] }],
          curseur (s), tangente, voie2 (« EA1 », « −EA1 », « EA1 − EA0 ») } ; Labo.voie2(p, mode) (tension de la voie 2).
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
    [["Durée", a.duree], ["Lancer", a.lancer], ["Effacer", a.effacer], ["Tangente", a.tangente], ["Voie 2", a.voie2]].forEach(([t, f], k) => {
      const b = L.svg("g", { class: `logiciel-${t.toLowerCase().replace(" ", "")}`, role: "button", "aria-label": t }, g);
      L.svg("rect", { x: x + 16 + k * 62, y: y + 14, width: 56, height: 17, rx: 3, fill: "#e4e8ec", stroke: "#8a96a0" }, b);
      L.texte(b, x + 44 + k * 62, y + 26, t, { "font-size": 8, "font-weight": 700, fill: "#23315a" });
      L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: f });
    });
  }

  function echelles(s) {
    // Bornes du graphique : 0 à la durée ; tensions arrondies au volt.
    const u = s.courbes.flatMap((c) => c.pts.flatMap((p) => p.slice(1)));
    return { tmax: s.duree, umax: Math.max(1, Math.ceil(Math.max(0, ...u))), umin: Math.min(0, Math.floor(Math.min(0, ...u))) };
  }

  L.voie2 = (p, mode) => (mode === "−EA1" ? -p[2] : mode === "EA1 − EA0" ? p[2] - p[1] : p[2]);
  const unite = (d) => (d < 0.5 ? { k: 1000, nom: "ms" } : { k: 1, nom: "s" });

  function axes(g, x0, y0, e, titre) {
    // Quadrillage, graduations (temps en ms pour les durées courtes), titres des axes.
    const u = unite(e.tmax);
    for (let k = 0; k <= 10; k++) { const X = x0 + (k * P.l) / 10; L.svg("line", { x1: X, y1: y0, x2: X, y2: y0 + P.h, stroke: "#e2e2dc", "stroke-width": 0.6 }, g); if (k % 2 === 0) L.texte(g, X, y0 + P.h + 11, fmt((k * e.tmax * u.k) / 10, e.tmax * u.k < 2 ? 2 : 1), { "font-size": 6.5, fill: "#333" }); }
    const pasu = Math.max(1, Math.ceil((e.umax - e.umin) / 6));
    for (let u = e.umin; u <= e.umax + 1e-9; u += pasu) { const Y = y0 + P.h - ((u - e.umin) / (e.umax - e.umin)) * P.h; L.svg("line", { x1: x0, y1: Y, x2: x0 + P.l, y2: Y, stroke: u === 0 ? "#999" : "#e2e2dc", "stroke-width": 0.6 }, g); L.texte(g, x0 - 6, Y + 2.5, String(u).replace("-", "−"), { "font-size": 6.5, fill: "#333", "text-anchor": "end" }); }
    L.texte(g, x0 + P.l, y0 + P.h + 22, `t (${u.nom})`, { "font-size": 7, "font-weight": 700, fill: "#333", "text-anchor": "end" });
    L.texte(g, x0 - 6, y0 - 6, titre, { "font-size": 7, "font-weight": 700, fill: "#333", "text-anchor": "start" });
  }

  function courbes(g, s, X, Y) {
    // Courbes EA0 et EA1 ; les anciennes en clair ; tangente à l'origine de la dernière courbe EA0.
    s.courbes.forEach((c, n) => {
      const vieille = n < s.courbes.length - 1;
      for (const v of [1, 2, 3]) { if (!c.pts.length || c.pts[0].length <= v || (v === 2 && c.pts.every((p) => Math.abs(p[2]) < 0.1))) continue; L.svg("path", { d: c.pts.map((p, k) => `${k ? "L" : "M"}${X(p[0]).toFixed(1)} ${Y(p[v]).toFixed(1)}`).join(" "), fill: "none", stroke: ["", "#d32f2f", "#f29d0b", "#1565c0"][v], "stroke-width": vieille ? 1 : 1.6, opacity: vieille ? 0.35 : 1 }, g); }
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
    return (s0_) => {
      const en = s0_.voie2 === "Énergies", conv = en ? (p) => [p[0], ...s0_.energies(p)] : (p) => [p[0], p[1], L.voie2(p, s0_.voie2)];
      const s = { ...s0_, tangente: s0_.tangente && !en, courbes: s0_.courbes.map((c) => ({ pts: c.pts.map(conv) })) }, u = unite(s.duree);
      s0 = s; gg.replaceChildren();
      const e = echelles(s), X = (t) => x0 + (t / e.tmax) * P.l, Y = (u) => y0 + P.h - ((u - e.umin) / (e.umax - e.umin)) * P.h;
      axes(gg, x0, y0, e, en ? "E (µJ)" : "u (V)"); courbes(gg, s, X, Y);
      if (en) L.texte(gg, x0 + P.l, y0 - 6, "Ee : rouge · Em : orange · E = Ee + Em : bleu", { "font-size": 7, "font-weight": 700, fill: "#333", "text-anchor": "end" });
      const d = s.courbes[s.courbes.length - 1], p = d && d.pts.length ? d.pts.reduce((m, q) => (Math.abs(q[0] - s.curseur) < Math.abs(m[0] - s.curseur) ? q : m)) : null;
      L.svg("line", { x1: X(s.curseur), y1: y0, x2: X(s.curseur), y2: y0 + P.h, stroke: "#2e7d32", "stroke-width": 1 }, gg);
      L.texte(gg, x + 338, y + 26, `${fmt(s.duree * u.k, s.duree * u.k < 1 ? 1 : 0)} ${u.nom} · ${s.etat}`, { "font-size": 7.5, fill: "#23315a", "text-anchor": "start" });
      const texte = !p ? "curseur : pas de mesure" : en ? `curseur : t = ${fmt(p[0] * u.k, 3)} ${u.nom} ; Ee = ${fmt(p[1], 1)} ; Em = ${fmt(p[2], 1)} ; E = ${fmt(p[3], 1)} µJ` : `curseur : t = ${fmt(p[0] * u.k, 3)} ${u.nom} ; EA0 = ${fmt(p[1])} V ; ${s.voie2} = ${fmt(p[2])} V`;
      L.texte(gg, x + 220, y + 246, texte, { "font-size": 8.5, "font-weight": 700, fill: "#2e7d32" });
      return p;
    };
  };
})(window.Labo);

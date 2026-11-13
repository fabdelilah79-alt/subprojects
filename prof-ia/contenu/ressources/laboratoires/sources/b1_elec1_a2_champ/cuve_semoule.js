/*
Rôle : cuve de verre (diamètre 14 cm) remplie d'huile de ricin où flottent des grains de semoule, vue un peu d'en haut ; deux
       jeux d'électrodes : deux pointes (charges ponctuelles de signes opposés) ou deux plaques parallèles. Sous tension, les
       grains (allongés) s'orientent peu à peu selon le champ électrostatique E (superposition des champs des deux
       pointes ; champ uniforme entre les plaques, presque nul au-dehors), et dessinent les lignes de champ.
Reçoit : le groupe SVG ; la configuration ("pointes", "plaques" ou null), l'état de la haute tension.
Produit : Labo.cuve_semoule(g) -> c { config, ht, remuer(), tic(dt), alignement() (0 à 1), dessiner(), dans(p) } .
Utilisé par : poste_champ.js.
*/
(function (L) {
  const C = { x: 430, y: 430 }, SX = 3, SY = 1.5, RAYON = 70, N = 420, EL = 36;
  const ecran = (u, v) => ({ x: C.x + u * SX, y: C.y + v * SY });

  function champ(config, u, v) {
    // Champ (unités arbitraires) en un point de la cuve (mm) : somme des champs des deux pointes, ou champ des plaques.
    if (config === "pointes") {
      let ex = 0, ey = 0;
      for (const [s, a] of [[1, -EL], [-1, EL]]) { const dx = u - a, dy = v, r = Math.max(3, Math.hypot(dx, dy)); ex += (s * dx) / r ** 3; ey += (s * dy) / r ** 3; }
      return { x: ex * 4000, y: ey * 4000 };
    }
    if (config === "plaques") {
      const dedans = Math.abs(u) < EL && Math.abs(v) < 40, bord = Math.exp(-Math.max(0, Math.abs(v) - 40) / 6) * Math.exp(-Math.max(0, Math.abs(u) - EL) / 6);
      return { x: (dedans ? 3 : 0.4 * bord), y: 0 };
    }
    return { x: 0, y: 0 };
  }

  L.cuve_semoule = function (g) {
    // Grains placés au hasard dans la cuve ; orientation qui suit le champ ; dessin de la cuve et des électrodes.
    const c = { config: null, ht: false, grains: [] }, gr = L.svg("g", {}, g);
    let graine = 7;
    const hasard = () => ((graine = (graine * 16807) % 2147483647) / 2147483647);
    for (let k = 0; k < N; k++) { const r = RAYON * Math.sqrt(hasard()) * 0.95, t = hasard() * 2 * Math.PI; c.grains.push({ u: r * Math.cos(t), v: r * Math.sin(t), a: hasard() * Math.PI }); }
    c.remuer = () => c.grains.forEach((q) => { q.a = hasard() * Math.PI; });
    c.tic = (dt) => {
      // Rotation de chaque grain vers la direction du champ (d'autant plus vite que E est grand, borné).
      if (!c.ht || !c.config) return;
      for (const q of c.grains) { const E = champ(c.config, q.u, q.v), k = Math.min(3, Math.hypot(E.x, E.y)), phi = Math.atan2(E.y, E.x); q.a -= Math.sin(2 * (q.a - phi)) * k * 1.5 * dt; }
    };
    c.alignement = () => {
      // Moyenne de cos 2(a − φ) sur les grains où le champ est notable.
      const s = c.grains.map((q) => ({ q, E: champ(c.config, q.u, q.v) })).filter((x) => Math.hypot(x.E.x, x.E.y) > 0.3);
      return s.length ? s.reduce((m, x) => m + Math.cos(2 * (x.q.a - Math.atan2(x.E.y, x.E.x))), 0) / s.length : 0;
    };
    c.dessiner = () => {
      // Cuve, huile, grains, électrodes en place.
      gr.replaceChildren();
      L.svg("ellipse", { cx: C.x, cy: C.y + 8, rx: RAYON * SX + 8, ry: RAYON * SY + 8, fill: "#9fb6be", opacity: 0.5 }, gr);
      L.svg("ellipse", { cx: C.x, cy: C.y, rx: RAYON * SX, ry: RAYON * SY, fill: "#e9d89a", stroke: "#9fb6be", "stroke-width": 2 }, gr);
      for (const q of c.grains) { const p = ecran(q.u, q.v), dx = Math.cos(q.a) * 2.2 * SX, dy = Math.sin(q.a) * 2.2 * SY; L.svg("line", { x1: p.x - dx, y1: p.y - dy, x2: p.x + dx, y2: p.y + dy, stroke: "#8a6a2a", "stroke-width": 1.6, "stroke-linecap": "round" }, gr); }
      if (c.config === "pointes") [[-EL, "+"], [EL, "−"]].forEach(([u, s]) => { const p = ecran(u, 0); L.svg("circle", { cx: p.x, cy: p.y, r: 6, fill: "url(#metal)", stroke: "#333" }, gr); L.texte(gr, p.x, p.y - 12, s, { "font-size": 13, "font-weight": 700, fill: s === "+" ? "#c0392b" : "#1f4f8f" }); });
      if (c.config === "plaques") [[-EL, "+"], [EL, "−"]].forEach(([u, s]) => { const p = ecran(u, -40); L.svg("rect", { x: p.x - 3, y: p.y, width: 6, height: 80 * SY, fill: "url(#metal)", stroke: "#333" }, gr); L.texte(gr, p.x, p.y - 8, s, { "font-size": 13, "font-weight": 700, fill: s === "+" ? "#c0392b" : "#1f4f8f" }); });
    };
    c.dans = (p) => Math.hypot((p.x - C.x) / SX, (p.y - C.y) / SY) < RAYON + 20;
    c.dessiner();
    return c;
  };
  L.cuve_semoule.C = C;
})(window.Labo);

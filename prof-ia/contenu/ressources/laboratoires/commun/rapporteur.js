/*
Rôle : rapporteur circulaire transparent (rayon 9 cm), posé sur la feuille d'enregistrement relevée : graduations tous
       les degrés, nombres tous les 10° dans les deux sens (anneau extérieur : sens inverse des aiguilles d'une montre ;
       anneau intérieur : sens des aiguilles). On le fait glisser (son centre se cale sur l'axe O s'il en est tout près), on
       le fait pivoter par sa poignée pour mettre le 0 sur une direction, et on tourne son fil (alidade rouge) jusqu'à un
       point : on lit l'angle sous le fil.
Reçoit : la feuille (Labo.Feuille) et la position de départ du centre (mm sur la feuille).
Produit : Labo.rapporteur(feuille, depart) -> { centre() (mm), angle() (degrés, orientation du 0), fil() (degrés lus sous le fil) }.
Utilisé par : les simulations de mouvement de rotation (1re année du bac).
*/
(function (L) {
  const R = 90, E = () => L.Feuille.ECHELLE, vf = (x, y) => L.Feuille.vers_feuille(x, y);

  function cadran(g) {
    // Disque transparent, graduations, nombres dans les deux sens, croix du centre.
    const r = R * E();
    L.svg("circle", { r, fill: "#f3f9ff", opacity: 0.5, stroke: "#6c9ac0" }, g);
    for (let d = 0; d < 360; d++) {
      const a = (-d * Math.PI) / 180, l = (d % 10 === 0 ? 8 : d % 5 === 0 ? 5 : 3) * E(), c = Math.cos(a), s = Math.sin(a);
      L.svg("line", { x1: r * c, y1: r * s, x2: (r - l) * c, y2: (r - l) * s, stroke: "#123", "stroke-width": d % 10 === 0 ? 0.6 : 0.3 }, g);
      if (d % 10) continue;
      L.texte(g, (r - 13 * E()) * c, (r - 13 * E()) * s + 2.5, String(d), { "font-size": 6.5, fill: "#123" });
      L.texte(g, (r - 22 * E()) * c, (r - 22 * E()) * s + 2.5, String((360 - d) % 360), { "font-size": 5.5, fill: "#b03a2e" });
    }
    L.svg("path", { d: `M-6 0 H6 M0 -6 V6`, stroke: "#123", "stroke-width": 0.8 }, g);
    L.svg("line", { x1: 0, y1: 0, x2: r, y2: 0, stroke: "#123", "stroke-width": 0.6, "stroke-dasharray": "3 2" }, g);
  }

  L.rapporteur = function (feuille, depart = { x: 470, y: 300 }) {
    // Rapporteur déplaçable, orientable (poignée jaune) et son fil rouge (poignée rouge au bout du fil).
    const g = L.svg("g", { class: "rapporteur" }, feuille.outils), corps = L.svg("g", {}, g);
    cadran(corps);
    const fil = L.svg("g", {}, g), poignee = L.svg("circle", { cx: (R + 8) * E(), cy: 0, r: 8, fill: "#f1d58a", stroke: "#8a6516", class: "poignee-rapporteur" }, g);
    L.svg("line", { x1: 0, y1: 0, x2: 160 * E(), y2: 0, stroke: "#c0392b", "stroke-width": 0.9 }, fil);
    const bout = L.svg("circle", { cx: 160 * E(), cy: 0, r: 7, fill: "#e74c3c", opacity: 0.8, class: "fil-rapporteur" }, fil);
    const s = { c: { ...depart }, angle: 0, fil: 0 };
    const placer = () => {
      const p = vf(s.c.x, s.c.y);
      g.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${s.angle})`);
      fil.setAttribute("transform", `rotate(${-s.fil})`);
      L.missions.noter("rapporteur", { centre: { ...s.c }, angle: Math.round(s.angle * 10) / 10, fil: Math.round(s.fil * 10) / 10 });
    };
    const centre = () => vf(s.c.x, s.c.y), direction = (p) => (Math.atan2(p.y - centre().y, p.x - centre().x) * 180) / Math.PI;
    L.glissable(corps, { soulever: false, debut: () => centre(),
      deplacer: (p) => { s.c = { x: (p.x - vf(0, 0).x) / E(), y: (p.y - vf(0, 0).y) / E() }; const o = feuille.mobile.axe; if (o && Math.hypot(s.c.x - o.x, s.c.y - o.y) < 3) s.c = { ...o }; placer(); } });
    L.glissable(poignee, { soulever: false, debut: () => ({ x: 0, y: 0 }), deplacer: (d, ev) => { s.angle = direction(L.scene.vers_scene(ev)); placer(); } });
    L.glissable(bout, { soulever: false, debut: () => ({ x: 0, y: 0 }), deplacer: (d, ev) => { s.fil = (((s.angle - direction(L.scene.vers_scene(ev))) % 360) + 360) % 360; placer(); } });
    placer();
    return { centre: () => ({ ...s.c }), angle: () => s.angle, fil: () => s.fil };
  };
})(window.Labo);

/*
Rôle : recherche du centre d'inertie sur la feuille relevée : les segments AiBi sont tracés au crayon ; un curseur vert
       glisse le long de A0B0 et place une croix verte au même endroit de chaque segment (même fraction de AB).
       L'élève cherche la position où les croix sont alignées et régulièrement espacées.
Reçoit : la feuille (Labo.Feuille) ; les gestes de l'élève sur le curseur.
Produit : Labo.recherche_centre(feuille) -> { fraction() } ; fait noté « fraction_g » (AG / AB, de 0 à 1).
Utilisé par : simulation.js.
*/
(function (L) {
  const VERT = "#1e8a3a", vf = (p) => L.Feuille.vers_feuille(p.x, p.y);
  const sur = (a, b, k) => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });

  function croix(g, p) {
    // Petite croix verte de 3 px.
    L.svg("path", { d: `M${p.x - 3} ${p.y - 3} L${p.x + 3} ${p.y + 3} M${p.x - 3} ${p.y + 3} L${p.x + 3} ${p.y - 3}`, stroke: VERT, "stroke-width": 1.4 }, g);
  }

  function curseur_mobile(curseur, pts, etat, placer) {
    // Le curseur ne peut que glisser le long de A0B0 ; au lâcher, la fraction AG / AB est notée.
    L.glissable(curseur, {
      soulever: false,
      debut: () => sur(pts[0].a, pts[0].b, etat.k),
      deplacer: (p) => {
        const { a, b } = pts[0], u = { x: b.x - a.x, y: b.y - a.y };
        etat.k = Math.max(0, Math.min(1, ((p.x - a.x) * u.x + (p.y - a.y) * u.y) / (u.x * u.x + u.y * u.y)));
        placer();
      },
      lacher: () => L.missions.noter("fraction_g", Math.round(etat.k * 1000) / 1000),
    });
  }

  function dessiner(g, feuille, etat) {
    // Segments AiBi en gris pointillé, croix vertes à la fraction k, curseur sur A0B0.
    g.replaceChildren();
    const pts = feuille.points.filter((p) => p.a).map((p) => ({ a: vf(p.a), b: vf(p.b) }));
    if (!pts.length) return;
    for (const { a, b } of pts) L.svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "#8d9399", "stroke-width": 0.6, "stroke-dasharray": "3 2" }, g);
    const croix_g = L.svg("g", {}, g);
    const curseur = L.svg("circle", { r: 7, fill: VERT, opacity: 0.45, stroke: VERT, class: "curseur-centre", role: "slider", "aria-label": "Curseur sur A0B0" }, g);
    const placer = () => {
      croix_g.replaceChildren();
      for (const { a, b } of pts) croix(croix_g, sur(a, b, etat.k));
      const c = sur(pts[0].a, pts[0].b, etat.k);
      curseur.setAttribute("cx", c.x); curseur.setAttribute("cy", c.y);
    };
    curseur_mobile(curseur, pts, etat, placer);
    placer();
  }

  L.recherche_centre = function (feuille) {
    // Prépare le calque (sous la règle) ; il se redessine à chaque ouverture de la feuille.
    const g = L.svg("g", { class: "recherche-centre" }, feuille.outils), etat = { k: 0.5 };
    feuille.outils.prepend(g);
    L.ecouter("enregistrement", (e) => { if (e.mobile === feuille.mobile && e.nouveau) { etat.k = 0.5; L.missions.noter("fraction_g", null); } });
    L.ecouter("feuille", (e) => { if (e.feuille === feuille && e.ouverte) dessiner(g, feuille, etat); });
    return { fraction: () => etat.k };
  };
})(window.Labo);

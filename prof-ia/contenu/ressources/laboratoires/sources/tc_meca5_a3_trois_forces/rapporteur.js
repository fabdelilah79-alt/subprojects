/*
Rôle : rapporteur transparent (demi-cercle de 0° à 180°, deux graduations : depuis la gauche et depuis la droite) que l'élève
       fait glisser ; lâché près de l'anneau, il s'y centre, sa base horizontale : on lit l'angle de chaque fil avec l'horizontale.
Reçoit : le groupe SVG ; le centre où il se cale (fonction) ; sa place de départ.
Produit : Labo.rapporteur(groupe, centre(), depart) ; fait noté « rapporteur_pose » (oui quand il est centré sur l'anneau).
Utilisé par : poste_trois_forces.js.
*/
(function (L) {
  const R = 78;

  function dessiner(g) {
    // Demi-disque bleuté, traits au degré, nombres tous les 10° sur deux couronnes, repère du centre.
    L.svg("path", { d: `M${-R} 0 A${R} ${R} 0 0 1 ${R} 0 Z`, fill: "#dbeeff", opacity: 0.45, stroke: "#4a7fb0", "stroke-width": 0.8 }, g);
    for (let d = 0; d <= 180; d++) {
      const a = (d * Math.PI) / 180, l = d % 10 === 0 ? 9 : d % 5 === 0 ? 6 : 3.5, c = -Math.cos(a), s = -Math.sin(a);
      L.svg("line", { x1: c * R, y1: s * R, x2: c * (R - l), y2: s * (R - l), stroke: "#1f4d78", "stroke-width": d % 10 === 0 ? 0.6 : 0.3 }, g);
      if (d % 10 === 0) {
        L.texte(g, c * (R - 15), s * (R - 15), String(d), { "font-size": 5.5, fill: "#1f4d78" });
        L.texte(g, c * (R - 24), s * (R - 24), String(180 - d), { "font-size": 4.5, fill: "#b03030" });
      }
    }
    L.svg("line", { x1: -R, y1: 0, x2: R, y2: 0, stroke: "#1f4d78", "stroke-width": 0.6 }, g);
    L.svg("path", { d: "M-5 0 H5 M0 -5 V5", stroke: "#b03030", "stroke-width": 0.7 }, g);
  }

  L.rapporteur = function (parent, centre, depart) {
    // Rapporteur déplaçable ; il se cale sur l'anneau quand on le lâche tout près.
    const g = L.svg("g", { class: "rapporteur", role: "button", "aria-label": "Rapporteur" }, parent);
    dessiner(g);
    let p = { ...depart };
    const placer = () => L.placer(g, p.x, p.y);
    L.glissable(g, {
      soulever: false,
      debut: () => ({ ...p }),
      deplacer: (q) => { p = q; placer(); },
      lacher: (q) => {
        const c = centre(), cale = Math.hypot(q.x - c.x, q.y - c.y) < 28;
        p = cale ? { ...c } : q;
        placer();
        L.missions.noter("rapporteur_pose", cale);
      },
    });
    placer();
    return { recaler: () => { const c = centre(); if (Math.hypot(p.x - c.x, p.y - c.y) < 28) { p = { ...c }; placer(); } } };
  };
})(window.Labo);

/*
Rôle : dynamomètre de traction tenu à la main par son anneau, relié à l'objet tiré par une cordelette : le corps gradué
       suit l'anneau, la tige du crochet sort du corps quand on tire (l'index rouge glisse le long de l'échelle). Il se
       dessine dans n'importe quelle direction (horizontale, inclinée, verticale) ; la cordelette pend quand on ne tire pas.
Reçoit : le groupe SVG, le point d'attache H sur l'objet, la position R de l'anneau et { calibre (N), px_n (px par N),
         corps (longueur du corps, px), corde (longueur de la cordelette, px), pas (N entre deux traits) }.
Produit : Labo.dynamometre_traction(g, H, R, reglage) -> { F (N), D (distance H-R), angle (rad, vers le haut positif) } ;
          Labo.dynamometre_traction.longueur(F, reglage) -> distance H-R pour une force F ; Labo.DYN_TRACTION (réglages).
Utilisé par : les simulations du chapitre « Travail et puissance d'une force ».
*/
(function (L) {
  L.DYN_TRACTION = { calibre: 4, px_n: 30, corps: 150, corde: 18, pas: 0.1 };

  function corps(g, r, x0, e) {
    // Tube transparent gradué (0 du côté de l'anneau), index rouge au bout de la tige, nombres tous les newtons.
    const zero = r.calibre * r.px_n + 10;
    L.svg("rect", { x: x0, y: -8, width: r.corps - 9, height: 16, rx: 4, fill: "url(#plastique)", stroke: "#8e9aa1" }, g);
    const n = Math.round(r.calibre / r.pas), tous = Math.round(1 / r.pas);
    for (let i = 0; i <= n; i++) {
      const x = x0 + zero - i * r.pas * r.px_n, grand = i % tous === 0;
      L.svg("line", { x1: x, y1: -8, x2: x, y2: -8 + (grand ? 7 : i % (tous / 2) ? 3 : 5), stroke: "#1d1d1d", "stroke-width": grand ? 0.8 : 0.45 }, g);
      if (grand) L.texte(g, x, 6, String(i / tous), { "font-size": 7, "font-weight": 700, fill: "#1d2a33" });
    }
    L.texte(g, x0 + zero + 12, 6, "N", { "font-size": 7, "font-weight": 700, fill: "#1d2a33" });
    L.svg("rect", { x: x0 + zero - e - 1.5, y: -7, width: 3, height: 14, fill: "#e0251b" }, g);
  }

  L.dynamometre_traction = function (g, H, R, reglage = {}) {
    // Cordelette (tendue ou pendante), tige du crochet, corps gradué, anneau ; renvoie la force lue.
    const r = { ...L.DYN_TRACTION, ...reglage }, dx = R.x - H.x, dy = R.y - H.y, D = Math.hypot(dx, dy);
    const e = Math.max(0, Math.min(r.calibre * r.px_n, D - r.corde - r.corps)), x0 = D - r.corps, xc = x0 - e;
    const gr = L.svg("g", { transform: `translate(${H.x} ${H.y}) rotate(${(Math.atan2(dy, dx) * 180) / Math.PI})` }, g);
    const mou = Math.sqrt(Math.max(0, r.corde * r.corde - xc * xc)) * 0.8 * Math.sign(dx || 1);
    L.svg("path", { d: `M0 0 Q${xc / 2} ${mou} ${xc} 0`, fill: "none", stroke: "#e9e4d2", "stroke-width": 1.6 }, gr);
    L.svg("path", { d: `M${xc} 0 h-4 a3 3 0 1 0 0 0.1`, fill: "none", stroke: "url(#metal)", "stroke-width": 1.6 }, gr);
    L.tige(gr, `M${xc} 0 H${xc + r.calibre * r.px_n + 10}`, 2.4);
    corps(gr, r, x0, e);
    L.tige(gr, `M${D - 10} 0 H${D - 6}`, 3);
    L.svg("circle", { cx: D, cy: 0, r: 6, fill: "none", stroke: "url(#metal)", "stroke-width": 2.6 }, gr);
    L.svg("circle", { cx: D, cy: 0, r: 18, fill: "#000", opacity: 0.001, class: "anneau-dyn" }, gr);
    return { F: e / r.px_n, D, angle: Math.atan2(-dy, dx) };
  };

  L.dynamometre_traction.longueur = function (F, reglage = {}) {
    // Distance entre le point d'attache et l'anneau quand le dynamomètre indique la force F.
    const r = { ...L.DYN_TRACTION, ...reglage };
    return r.corde + r.corps + Math.max(0, Math.min(r.calibre, F)) * r.px_n;
  };
})(window.Labo);

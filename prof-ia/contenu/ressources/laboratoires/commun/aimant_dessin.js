/*
Rôle : dessin d'un barreau aimanté posé sur une feuille vue un peu d'en haut (plan_magnetique.js) : dessus de l'aimant
       (moitié nord rouge marquée N, moitié sud bleue marquée S) et flanc plus sombre ; un barreau cassé est dessiné en deux
       morceaux séparés, chacun avec son pôle nord et son pôle sud. Fournit aussi les sources de champ correspondantes.
Reçoit : le groupe SVG, le plan et l'aimant { x, y (centre, m), angle (direction sud → nord), longueur (m), largeur (m),
         casse (booléen), ecart (m, entre les deux morceaux) }.
Produit : Labo.dessin_barreau(g, plan, a) ; Labo.sources_barreau(a) -> sources (champ_magnetique.js) ;
          Labo.dans_barreau(a, p, marge) -> vrai si le point p est sur l'aimant.
Utilisé par : les postes des simulations de magnétisme.
*/
(function (L) {
  const morceaux = (a) => {
    // Un ou deux morceaux : { centre, longueur }.
    if (!a.casse) return [{ x: a.x, y: a.y, l: a.longueur }];
    const d = (a.longueur / 2 + a.ecart) / 2, c = Math.cos(a.angle), s = Math.sin(a.angle);
    return [-1, 1].map((k) => ({ x: a.x + k * d * c, y: a.y + k * d * s, l: a.longueur / 2 }));
  };

  function bloc(g, plan, a, m) {
    // Flanc (décalé vers le bas), puis dessus en deux moitiés, lettres N et S.
    const c = Math.cos(a.angle), s = Math.sin(a.angle), w = a.largeur / 2;
    const P = (t, n) => plan.ecran({ x: m.x + t * c - n * s, y: m.y + t * s + n * c });
    const poly = (pts, dy = 0) => `M${pts.map((q) => `${q.x} ${q.y + dy}`).join(" L")} Z`;
    const tout = [P(-m.l / 2, -w), P(m.l / 2, -w), P(m.l / 2, w), P(-m.l / 2, w)];
    L.svg("path", { d: poly(tout, 9), fill: "#000", opacity: 0.25 }, g);
    L.svg("path", { d: poly(tout, 7), fill: "#4a4f55" }, g);
    L.svg("path", { d: poly([P(0, -w), P(m.l / 2, -w), P(m.l / 2, w), P(0, w)]), fill: "#d63a2f", stroke: "#7a1712", "stroke-width": 0.7 }, g);
    L.svg("path", { d: poly([P(-m.l / 2, -w), P(0, -w), P(0, w), P(-m.l / 2, w)]), fill: "#2f6fd0", stroke: "#173d78", "stroke-width": 0.7 }, g);
    for (const [t, lettre] of [[m.l / 3, "N"], [-m.l / 3, "S"]]) { const q = P(t, 0); L.texte(g, q.x, q.y, lettre, { "font-size": 10, "font-weight": 700, fill: "#fff" }); }
  }

  L.dessin_barreau = (g, plan, a) => morceaux(a).forEach((m) => bloc(g, plan, a, m));

  L.sources_barreau = (a) => morceaux(a).flatMap((m) => L.champ_magnetique.barreau({ x: m.x, y: m.y, angle: a.angle, longueur: m.l, q: a.q }));

  L.dans_barreau = (a, p, marge = 0) => morceaux(a).some((m) => {
    // Coordonnées du point dans le repère du morceau.
    const dx = p.x - m.x, dy = p.y - m.y, t = dx * Math.cos(a.angle) + dy * Math.sin(a.angle), n = -dx * Math.sin(a.angle) + dy * Math.cos(a.angle);
    return Math.abs(t) <= m.l / 2 + marge && Math.abs(n) <= a.largeur / 2 + marge;
  });
})(window.Labo);

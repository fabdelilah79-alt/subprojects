/*
Rôle : dessin d'un rayon (ou d'un faisceau fin) de lumière : ligne brisée avec un léger halo et, au milieu de chaque
       segment assez long, une petite flèche qui indique le sens de propagation (modèle du rayon lumineux).
Reçoit : le groupe SVG, la liste des points (écran) et { couleur, largeur, opacite, fleches, halo }.
Produit : Labo.rayon_lumineux(g, points, reglage).
Utilisé par : les simulations d'optique.
*/
(function (L) {
  L.rayon_lumineux = function (g, points, { couleur = "#ff2a1a", largeur = 1.8, opacite = 1, fleches = true, halo = true } = {}) {
    // Halo, trait, flèches au milieu des segments de plus de 40 px.
    if (points.length < 2) return;
    const d = `M${points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L")}`;
    if (halo) L.svg("path", { d, fill: "none", stroke: couleur, "stroke-width": largeur * 4, opacity: 0.18 * opacite, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    L.svg("path", { d, fill: "none", stroke: couleur, "stroke-width": largeur, opacity: opacite, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    if (!fleches) return;
    for (let k = 1; k < points.length; k++) {
      const a = points[k - 1], b = points[k], l = Math.hypot(b.x - a.x, b.y - a.y);
      if (l < 40) continue;
      const u = { x: (b.x - a.x) / l, y: (b.y - a.y) / l }, m = { x: (a.x + b.x) / 2 + 4 * u.x, y: (a.y + b.y) / 2 + 4 * u.y };
      L.svg("path", { d: `M${m.x} ${m.y} L${m.x - 8 * u.x - 4 * u.y} ${m.y - 8 * u.y + 4 * u.x} L${m.x - 8 * u.x + 4 * u.y} ${m.y - 8 * u.y - 4 * u.x} Z`, fill: couleur, opacity: opacite }, g);
    }
  };
})(window.Labo);

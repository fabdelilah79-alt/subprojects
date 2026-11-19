/*
Rôle : géométrie de la construction de l'image d'un objet AB par une lentille mince convergente, sur une feuille quadrillée
       (1 cm = 20 px, centre optique O au milieu, axe orienté dans le sens de la lumière) : les trois rayons particuliers
       issus de B (parallèle à l'axe -> passe par F' ; par O -> non dévié ; par F -> ressort parallèle), arrêtés au bord
       de la feuille ; prolongements en pointillés vers l'arrière (image virtuelle).
Reçoit : la position de A (cm, négative), la hauteur AB (cm), f' (cm), les rayons choisis.
Produit : Labo.CONSTRUCTION = { E (cm -> écran), M (écran -> cm), BORDS } ; Labo.image_construction({ xa, h, f }) -> { x, y } (B') ;
          Labo.rayons_construction(g, reglage).
Utilisé par : poste_construction.js.
*/
(function (L) {
  const BORDS = { g: -16, d: 17, h: 5.25 };
  L.CONSTRUCTION = { BORDS, E: (x, y) => ({ x: 520 + 20 * x, y: 330 - 20 * y }), M: (p) => ({ x: (p.x - 520) / 20, y: (330 - p.y) / 20 }) };

  L.image_construction = function ({ xa, h, f }) {
    // Position de B' par la relation de conjugaison (null : image à l'infini).
    const inv = 1 / f + 1 / xa;
    if (Math.abs(inv) < 1e-6) return null;
    const xp = 1 / inv;
    return { x: xp, y: (h * xp) / xa };
  };

  function bord(p, d) {
    // Point où la demi-droite (p, d) sort de la feuille.
    const t = Math.min(d.x > 0 ? (BORDS.d - p.x) / d.x : d.x < 0 ? (BORDS.g - p.x) / d.x : 1e9, d.y > 0 ? (BORDS.h - p.y) / d.y : d.y < 0 ? (-BORDS.h - p.y) / d.y : 1e9);
    return { x: p.x + t * d.x, y: p.y + t * d.y };
  }

  function chemins({ xa, h, f }) {
    // Pour chaque rayon : point d'arrivée sur la lentille, direction de sortie (null : il manque la lentille).
    const B = { x: xa, y: h }, y3 = Math.abs(xa + f) < 1e-6 ? null : (h * f) / (xa + f);
    return {
      1: { B, I: { x: 0, y: h }, d: { x: f, y: -h } },
      2: { B, I: { x: 0, y: 0 }, d: { x: -xa, y: -h } },
      3: y3 === null || (xa > -f && y3 < h) ? null : { B, I: { x: 0, y: y3 }, d: { x: 1, y: 0 } },
    };
  }

  L.rayons_construction = function (g, { xa, h, f, rayons, prolonger }) {
    // Trace les rayons choisis ; un rayon qui passe au-delà du bord de la lentille (5 cm) n'est pas dévié.
    g.replaceChildren();
    const c = chemins({ xa, h, f }), E = L.CONSTRUCTION.E, couleurs = { 1: "#d32f2f", 2: "#1565c0", 3: "#2e7d32" };
    for (const k of [1, 2, 3]) {
      if (!rayons[k] || !c[k]) continue;
      const { B, I } = c[k], manque = Math.abs(I.y) > 5, d = manque ? { x: I.x - B.x, y: I.y - B.y } : c[k].d;
      const fin = bord(I, d);
      L.rayon_lumineux(g, [B, I, fin].map((p) => E(p.x, p.y)), { couleur: couleurs[k], largeur: 1.3, halo: false });
      if (prolonger && !manque) {
        const a = E(I.x, I.y), z = bord(I, { x: -d.x, y: -d.y }), b = E(z.x, z.y);
        L.svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: couleurs[k], "stroke-width": 1, "stroke-dasharray": "5 4", opacity: 0.8 }, g);
      }
    }
  };
})(window.Labo);

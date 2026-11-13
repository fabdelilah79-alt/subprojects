/*
Rôle : mouvement d'un petit morceau de papier, vu un peu d'en haut : un point au sol (où il se poserait) et une hauteur.
       Attiré, il part de l'arrêt et accélère vers la baguette ; collé, il la suit ; détaché, il tombe sous l'effet de son
       poids, freiné par l'air (vitesse limite faible), en se balançant et en tournoyant, et se pose juste en dessous.
Reçoit : le morceau { sol: {x, y}, h, etat, ... }, la durée de l'image dt (s), le temps t (s).
Produit : Labo.papier.avancer(b, dt, t, chercher, sur_contact), Labo.papier.ecran(b) (position dessinée),
          Labo.papier.detacher(b, baguette) ; Labo.papier.point_baguette(baguette, p).
Utilisé par : papiers.js.
*/
(function (L) {
  const DEMI = 100, G = 900, FREIN = 6.5, ACCELERATION = 2600, V_MAX = 700, DECHARGE_S = 20;

  const ecran = (b) => ({ x: b.sol.x, y: b.sol.y - b.h });

  function point_baguette(bg, p) {
    // Point de la baguette (tenue horizontalement) le plus proche de p, et la distance.
    const x = Math.max(bg.pos.x - DEMI, Math.min(bg.pos.x + DEMI, p.x));
    return { d: Math.hypot(p.x - x, p.y - bg.pos.y), point: { x, y: bg.pos.y + 6 } };
  }

  function placer(b, p) {
    // Place le morceau au point p de l'écran : même verticale au sol, hauteur = écart entre le sol et p.
    b.sol.x = p.x;
    if (p.y > b.sol.y) b.sol.y = p.y;
    b.h = b.sol.y - p.y;
  }

  function voler(b, dt, sur_contact) {
    // Attiré : il accélère vers la baguette ; au contact, il s'y colle.
    const p = ecran(b), cible = point_baguette(b.bg, p).point, d = Math.hypot(cible.x - p.x, cible.y - p.y);
    b.v = Math.min(V_MAX, b.v + ACCELERATION * dt);
    const pas = Math.min(d, b.v * dt);
    placer(b, d > 0 ? { x: p.x + ((cible.x - p.x) / d) * pas, y: p.y + ((cible.y - p.y) / d) * pas } : p);
    b.a += b.tour * dt;
    if (d - pas < 2) {
      const q = ecran(b);
      Object.assign(b, { etat: "colle", decalage: { x: q.x - b.bg.pos.x, y: q.y - b.bg.pos.y } });
      sur_contact(b.bg);
    }
  }

  function tomber(b, dt, t) {
    // Chute freinée par l'air : vitesse qui tend vers G / FREIN ; balancement et tournoiement ; il se pose au sol.
    b.v += (G - FREIN * b.v) * dt;
    b.h -= b.v * dt;
    b.sol.x += 28 * Math.sin(t * 5 + b.phase) * dt * Math.min(1, b.h / 10);
    b.a += 260 * Math.sin(t * 4 + b.phase) * dt;
    if (b.h <= 0) Object.assign(b, { h: 0, v: 0, etat: "repos" });
  }

  L.papier = {
    ecran,
    point_baguette,
    detacher(b, bg) {
      // Le morceau quitte la baguette (chargé comme elle) et commence à tomber.
      Object.assign(b, { etat: "tombe", v: 0, charge_par: bg.id, q_contact: Math.abs(bg.q), decharge: DECHARGE_S });
    },
    avancer(b, dt, t, chercher, sur_contact) {
      // Au repos → attiré → collé un moment → repoussé, il tombe ; chargé, il n'est pas réattiré tout de suite.
      b.decharge = Math.max(0, (b.decharge || 0) - dt);
      if (b.etat === "repos") {
        const bg = chercher(b);
        if (bg) Object.assign(b, { etat: "vole", bg, v: 0, tour: (b.phase - 3) * 120, duree: 1.5 + (b.phase / 6) * 2 });
      } else if (b.etat === "vole") voler(b, dt, sur_contact);
      else if (b.etat === "colle") {
        placer(b, { x: b.bg.pos.x + b.decalage.x, y: b.bg.pos.y + b.decalage.y });
        b.duree -= dt;
        if (b.duree < 0) L.papier.detacher(b, b.bg);
      } else tomber(b, dt, t);
    },
  };
})(window.Labo);

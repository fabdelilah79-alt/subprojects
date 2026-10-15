/*
Rôle : mouvement du mobile autoporteur, image par image : glissement sans frottement, descente si la table est
       inclinée, rotation autour du clou si le fil est tendu, rebond amorti sur les butées en caoutchouc ;
       frottement jusqu'à l'arrêt si la soufflerie est coupée ; rotation propre de deux palets solidaires.
Reçoit : le mobile (Labo.CoussinAir) ; la durée de chaque image.
Produit : CoussinAir.prototype.tourner() et sur_image(fonction(dt, mobile)), appelée à chaque image où il bouge.
Utilisé par : coussin_air.js (chargé juste après), enregistrement.js.
*/
(function (L) {
  const C = L.CoussinAir.prototype;
  const T = L.CoussinAir.TABLE, CLOU = L.CoussinAir.CLOU;
  const REBOND = 0.8, FROTTEMENT = 1800;

  function tourner_autour_du_clou(m, dt) {
    // Mouvement circulaire uniforme : la valeur de la vitesse reste la même, sa direction tourne.
    const r = { x: m.pos.x - CLOU.x, y: m.pos.y - CLOU.y }, v = Math.hypot(m.vitesse.x, m.vitesse.y);
    const sens = Math.sign(r.x * m.vitesse.y - r.y * m.vitesse.x) || 1;
    const angle = Math.atan2(r.y, r.x) + (sens * v * dt) / m.rayon_fil;
    m.pos = { x: CLOU.x + m.rayon_fil * Math.cos(angle), y: CLOU.y + m.rayon_fil * Math.sin(angle) };
    m.vitesse = { x: -Math.sin(angle) * v * sens, y: Math.cos(angle) * v * sens };
  }

  function frotter(m, dt) {
    // Air coupé : le mobile frotte sur la table, sa vitesse diminue vite jusqu'à l'arrêt.
    const v = Math.hypot(m.vitesse.x, m.vitesse.y), reste = Math.max(0, v - FROTTEMENT * dt);
    m.vitesse = v ? { x: (m.vitesse.x * reste) / v, y: (m.vitesse.y * reste) / v } : m.vitesse;
  }

  function glisser_librement(m, dt) {
    // Glissement sans frottement (avec la pente éventuelle), rebond amorti sur les bords ; frottement si l'air est coupé.
    if (m.sans_air) frotter(m, dt);
    else m.vitesse.y += m.a * dt;
    m.pos.x += m.vitesse.x * dt;
    m.pos.y += m.vitesse.y * dt;
    if (m.solide) m.solide.angle += m.solide.omega * dt;
    const r = m.marge || T.rayon;
    for (const [axe, max] of [["x", T.l], ["y", T.h]]) {
      if (m.pos[axe] < r) { m.pos[axe] = r; m.vitesse[axe] = Math.abs(m.vitesse[axe]) * REBOND; }
      if (m.pos[axe] > max - r) { m.pos[axe] = max - r; m.vitesse[axe] = -Math.abs(m.vitesse[axe]) * REBOND; }
    }
    if (m.a && m.pos.y >= T.h - T.rayon - 0.5 && Math.abs(m.vitesse.y) < 25) m.vitesse.y = 0;
  }

  C.immobile = function () {
    // Le mobile est-il arrêté (et pas retenu par le fil) ?
    const pente = this.a && !this.sans_air && this.pos.y < T.h - T.rayon - 1;
    return !this.rayon_fil && Math.hypot(this.vitesse.x, this.vitesse.y) < 2 && !pente;
  };

  C.tourner = function () {
    // Boucle d'animation (pas de calcul de 2 ms pour rester précis).
    let avant = null;
    const image = (instant) => {
      const dt = avant === null ? 0 : Math.min(0.05, (instant - avant) / 1000);
      avant = instant;
      if (!this.tenu && !this.arrete && dt > 0 && !this.immobile()) {
        for (let reste = dt; reste > 1e-6; reste -= 0.002) {
          const pas = Math.min(0.002, reste);
          if (this.rayon_fil) tourner_autour_du_clou(this, pas);
          else glisser_librement(this, pas);
          for (const f of this.ecouteurs) f(pas, this);
        }
        this.dessiner_mobile();
      }
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
  };

  C.sur_image = function (fonction) {
    // Abonne fonction(dt, mobile) à chaque petit pas de mouvement.
    this.ecouteurs.push(fonction);
  };
})(window.Labo);

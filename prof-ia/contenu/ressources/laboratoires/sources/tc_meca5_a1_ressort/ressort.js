/*
Rôle : ressort à spires suspendu au crochet d'une potence, avec un index rouge à son extrémité et une règle verticale
       graduée en millimètres (zéro au point d'attache) : on lit la longueur l du ressort. Il obéit à T = K·Δl ;
       accroché, il oscille puis s'immobilise ; au-delà de 20 cm d'allongement, il est en butée (déformation).
Reçoit : le groupe SVG, le point d'attache (px), { raideur (N/m), l0_cm, px_par_cm, couleur } ; la force (N) à chaque changement.
Produit : new Labo.Ressort(groupe, attache, reglages) avec charger(N), crochet(), sur_mouvement(), calibre, au_repos() —
          la même interface que le dynamomètre, pour accrochage.js.
Utilisé par : poste_ressort.js.
*/
(function (L) {
  const OMEGA = 2 * Math.PI * 1.2, AMORTISSEMENT = 6, ALLONGEMENT_MAX_CM = 20;

  function regle(g, x, y, px_par_cm) {
    // Règle verticale de 40 cm : traits au mm, au demi-cm et au cm, nombres tous les 5 cm.
    L.svg("rect", { x: x - 2, y: y - 8, width: 34, height: 40 * px_par_cm + 16, fill: "#f3e7c9", stroke: "#a88b55", filter: "url(#ombre)" }, g);
    for (let mm = 0; mm <= 400; mm++) {
      const yy = y + (mm / 10) * px_par_cm, l = mm % 10 === 0 ? 10 : mm % 5 === 0 ? 7 : 4;
      L.svg("line", { x1: x, y1: yy, x2: x + l, y2: yy, stroke: "#2b2416", "stroke-width": mm % 10 === 0 ? 0.6 : 0.25 }, g);
      if (mm % 50 === 0) L.texte(g, x + 21, yy, String(mm / 10), { "font-size": 8, "font-weight": 700, fill: "#2b2416" });
    }
    L.texte(g, x + 21, y - 3, "cm", { "font-size": 6, fill: "#2b2416" });
  }

  function Ressort(parent, attache, { raideur, l0_cm, px_par_cm, couleur = "#8b949c" }) {
    // Dessine la règle, le ressort et son index ; l'origine des longueurs est le point d'attache.
    Object.assign(this, { attache, raideur, l0_cm, px_par_cm, ext: 0, vitesse: 0, cible: 0, ecouteurs: [] });
    this.calibre = (raideur * ALLONGEMENT_MAX_CM) / 100;
    regle(parent, attache.x + 22, attache.y, px_par_cm);
    this.g = L.svg("g", {}, parent);
    this.spires = L.svg("path", { fill: "none", stroke: couleur, "stroke-width": 1.8, "stroke-linejoin": "round" }, this.g);
    this.index = L.svg("path", { fill: "#e0251b" }, this.g);
    this.crochet_svg = L.svg("path", { fill: "none", stroke: "url(#metal)", "stroke-width": 2.2, "stroke-linecap": "round" }, this.g);
    this.dessiner();
    this.tourner();
  }

  const R = Ressort.prototype;

  R.longueur_px = function () {
    // Longueur actuelle du ressort, à l'écran.
    return (this.l0_cm * this.px_par_cm) + this.ext;
  };

  R.dessiner = function () {
    // 18 spires régulièrement réparties ; l'index (petite flèche) pointe vers la règle à l'extrémité du ressort.
    const { x, y } = this.attache, l = this.longueur_px(), n = 18, d = [`M${x} ${y} V${y + 6}`];
    for (let i = 0; i < n; i++) d.push(`L${x + (i % 2 ? -7 : 7)} ${y + 6 + ((l - 12) * (i + 0.5)) / n}`);
    d.push(`L${x} ${y + l - 6} V${y + l}`);
    this.spires.setAttribute("d", d.join(" "));
    this.index.setAttribute("d", `M${x} ${y + l - 1.2} H${x + 18} l4 1.2 l-4 1.2 H${x} Z`);
    this.crochet_svg.setAttribute("d", `M${x} ${y + l} v4 a4 4 0 1 1 -6 3.5`);
  };

  R.crochet = function () {
    // Point où l'on accroche une masse.
    return { x: this.attache.x - 4, y: this.attache.y + this.longueur_px() + 10 };
  };

  R.charger = function (force_N) {
    // Nouvelle force : allongement Δl = T / K (limité à 20 cm : au-delà le ressort serait déformé).
    this.cible = Math.min(ALLONGEMENT_MAX_CM, (force_N / this.raideur) * 100) * this.px_par_cm;
  };

  R.au_repos = function () {
    // Le ressort est-il immobile ?
    return Math.abs(this.vitesse) < 0.4 && Math.abs(this.ext - this.cible) < 0.1;
  };

  R.tourner = function () {
    // Oscillation amortie autour de la position d'équilibre.
    let avant = null;
    const image = (instant) => {
      const dt = avant === null ? 0 : Math.min(0.033, (instant - avant) / 1000);
      avant = instant;
      if (!this.au_repos()) {
        this.vitesse += (-OMEGA * OMEGA * (this.ext - this.cible) - AMORTISSEMENT * this.vitesse) * dt;
        this.ext += this.vitesse * dt;
        if (this.au_repos()) { this.ext = this.cible; this.vitesse = 0; }
        this.dessiner();
        for (const f of this.ecouteurs) f(this.au_repos());
      }
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
  };

  R.sur_mouvement = function (fonction) {
    // Appelle fonction(au_repos) à chaque image où le ressort bouge.
    this.ecouteurs.push(fonction);
  };

  L.Ressort = Ressort;
})(window.Labo);

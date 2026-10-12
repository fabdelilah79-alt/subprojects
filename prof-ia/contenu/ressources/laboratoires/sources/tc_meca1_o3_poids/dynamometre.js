/*
Rôle : dynamomètre à ressort (calibre 10 N) : tube transparent gradué, ressort qui s'allonge, index rouge,
       crochet ; le ressort oscille puis s'immobilise (oscillation amortie), en butée au-delà du calibre.
Reçoit : le groupe SVG, la position de l'anneau, le poids accroché (en N) à chaque changement.
Produit : new Dynamometre(groupe, x, y) avec charger(poids_N), crochet() -> point d'accroche, et sur_mouvement().
Utilisé par : poste_poids.js.
*/
(function (L) {
  const PX_PAR_N = 12;
  const CALIBRE_N = 10;
  const ZERO = 44;
  const OMEGA = 2 * Math.PI * 1.4;
  const AMORTISSEMENT = 4.5;

  function graduer(g, x) {
    // Graduations : un trait tous les 0,2 N, un nombre tous les 1 N.
    for (let i = 0; i <= CALIBRE_N * 5; i++) {
      const y = ZERO + (i * PX_PAR_N) / 5;
      const grand = i % 5 === 0;
      L.svg("line", { x1: x - 13, y1: y, x2: x - 13 + (grand ? 9 : 5), y2: y, stroke: "#1d1d1d", "stroke-width": grand ? 0.9 : 0.5 }, g);
      if (grand) L.texte(g, x + 9, y, String(i / 5), { class: "graduation", "font-size": 8 });
    }
    L.texte(g, x + 21, ZERO + CALIBRE_N * PX_PAR_N + 8, "N", { class: "graduation", "font-size": 8 });
  }

  function Dynamometre(parent, x, y) {
    // Dessine le dynamomètre ; l'origine du groupe est son anneau de suspension.
    this.g = L.svg("g", { transform: `translate(${x} ${y})` }, parent);
    this.origine = { x, y };
    this.ext = 0;
    this.vitesse = 0;
    this.cible = 0;
    this.ecouteurs = [];
    L.svg("circle", { cx: 0, cy: 0, r: 6, fill: "none", stroke: "url(#metal)", "stroke-width": 2.5 }, this.g);
    L.svg("rect", { x: -15, y: 6, width: 30, height: 8, rx: 2, fill: "#d23b2e" }, this.g);
    this.ressort = L.svg("path", { fill: "none", stroke: "#8b949c", "stroke-width": 1.6 }, this.g);
    this.tige = L.svg("rect", { x: -2, width: 4, fill: "url(#metal)" }, this.g);
    this.index = L.svg("rect", { x: -11, width: 22, height: 3, fill: "#e0251b" }, this.g);
    L.svg("rect", { x: -14, y: 13, width: 28, height: ZERO + CALIBRE_N * PX_PAR_N + 4 - 13, fill: "url(#plastique)", stroke: "#9aa6ac", "stroke-width": 0.8 }, this.g);
    L.svg("rect", { x: -11, y: 14, width: 4, height: CALIBRE_N * PX_PAR_N + 8, fill: "#fff", opacity: 0.55 }, this.g);
    graduer(this.g, 0);
    this.bas = ZERO + CALIBRE_N * PX_PAR_N + 4;
    L.svg("rect", { x: -15, y: this.bas, width: 30, height: 7, rx: 2, fill: "#d23b2e" }, this.g);
    this.crochet_svg = L.svg("path", { fill: "none", stroke: "url(#metal)", "stroke-width": 2.4, "stroke-linecap": "round" }, this.g);
    this.dessiner();
    this.tourner();
  }

  const D = Dynamometre.prototype;

  D.dessiner = function () {
    // Place le ressort, l'index, la tige et le crochet pour l'allongement actuel.
    const y_index = ZERO + this.ext;
    let d = "M0 14";
    const spires = 14;
    for (let i = 1; i <= spires; i++) d += ` L${i % 2 ? -5 : 5} ${14 + ((y_index - 16) * i) / spires}`;
    this.ressort.setAttribute("d", d + ` L0 ${y_index}`);
    this.index.setAttribute("y", y_index - 1.5);
    const y_bas = this.bas + 10 + this.ext;
    this.tige.setAttribute("y", y_index);
    this.tige.setAttribute("height", y_bas - y_index);
    this.crochet_svg.setAttribute("d", `M0 ${y_bas} v4 a4 4 0 1 1 -6 3.5`);
  };

  D.crochet = function () {
    // Point où l'on accroche un objet (coordonnées de la paillasse).
    return { x: this.origine.x - 4, y: this.origine.y + this.bas + 20 + this.ext };
  };

  D.charger = function (poids_N) {
    // Nouveau poids accroché : le ressort va osciller vers son nouvel allongement (butée à 10 N).
    this.cible = Math.min(CALIBRE_N, poids_N) * PX_PAR_N + (poids_N > CALIBRE_N ? 2 : 0);
  };

  D.au_repos = function () {
    // Le ressort est-il immobile ?
    return Math.abs(this.vitesse) < 0.4 && Math.abs(this.ext - this.cible) < 0.15;
  };

  D.tourner = function () {
    // Boucle d'animation : oscillation amortie du ressort autour de sa position d'équilibre.
    let avant = null;
    const image = (instant) => {
      const dt = avant === null ? 0 : Math.min(0.033, (instant - avant) / 1000);
      avant = instant;
      if (!this.au_repos()) {
        const acceleration = -OMEGA * OMEGA * (this.ext - this.cible) - AMORTISSEMENT * this.vitesse;
        this.vitesse += acceleration * dt;
        this.ext = Math.max(-2, Math.min(CALIBRE_N * PX_PAR_N + 2, this.ext + this.vitesse * dt));
        if (this.au_repos()) { this.ext = this.cible; this.vitesse = 0; }
        this.dessiner();
        for (const f of this.ecouteurs) f(this.au_repos());
      }
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
  };

  D.sur_mouvement = function (fonction) {
    // Appelle fonction(au_repos) à chaque image où le ressort bouge.
    this.ecouteurs.push(fonction);
  };

  L.Dynamometre = Dynamometre;
  L.Dynamometre.CALIBRE_N = CALIBRE_N;
})(window.Labo);

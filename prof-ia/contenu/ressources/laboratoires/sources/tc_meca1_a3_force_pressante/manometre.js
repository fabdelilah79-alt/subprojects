/*
Rôle : manomètre à tube en U sur sa planche graduée (cm, zéro au milieu) : le liquide coloré descend dans la branche
       reliée à la capsule et monte dans l'autre ; la dénivellation Δh suit la pression avec un léger retard.
Reçoit : le groupe SVG, la position de la planche ; la dénivellation visée (cm) à chaque changement.
Produit : new Manometre(parent, x, y) avec viser(dh_cm), entree() (haut de la branche gauche), sur_repos(fonction).
Utilisé par : poste_liquide.js.
*/
(function (L) {
  const PX_PAR_CM = 10;
  const ECART = 70;
  const HAUT = 30, BAS = 330, ZERO = 180;

  function planche(g) {
    // Planche en bois et échelle graduée en centimètres entre les deux branches.
    L.svg("rect", { x: -40, y: 0, width: ECART + 80, height: BAS + 76, rx: 4, fill: "url(#bois)", stroke: "#8d6337" }, g);
    L.svg("rect", { x: 14, y: HAUT - 6, width: ECART - 28, height: BAS - HAUT + 12, fill: "#fbfaf2", stroke: "#b8ad8e", "stroke-width": 0.6 }, g);
    for (let cm = -14; cm <= 14; cm++) {
      for (let mm = 0; mm < 10 && cm + mm / 10 <= 14; mm += 5) {
        const y = ZERO - (cm + mm / 10) * PX_PAR_CM;
        const grand = mm === 0;
        L.svg("line", { x1: 14, y1: y, x2: 14 + (grand ? 8 : 4), y2: y, stroke: "#222", "stroke-width": grand ? 0.6 : 0.4 }, g);
        L.svg("line", { x1: ECART - 14, y1: y, x2: ECART - 14 - (grand ? 8 : 4), y2: y, stroke: "#222", "stroke-width": grand ? 0.6 : 0.4 }, g);
        if (grand && cm % 2 === 0) L.texte(g, ECART / 2, y, String(cm), { class: "graduation", "font-size": 7.5 });
      }
    }
    L.texte(g, ECART / 2, BAS + 14, "cm", { class: "graduation" });
    L.texte(g, ECART / 2, BAS + 62, "Manomètre", { class: "etiquette-carton", "font-size": 15 });
  }

  function Manometre(parent, x, y) {
    // Dessine la planche, le tube en verre et le liquide rouge ; l'origine est le coin haut de la branche gauche.
    this.g = L.svg("g", { transform: `translate(${x} ${y})`, filter: "url(#ombre)" }, parent);
    this.origine = { x, y };
    planche(this.g);
    this.liquide = L.svg("path", { fill: "none", stroke: "#c42c3a", "stroke-width": 8, "stroke-linejoin": "round" }, this.g);
    const tube = `M0 ${HAUT} V${BAS} a${ECART / 2} ${ECART / 2} 0 0 0 ${ECART} 0 V${HAUT}`;
    L.svg("path", { d: tube, fill: "none", stroke: "#cfe3ea", "stroke-width": 13, opacity: 0.22 }, this.g);
    L.svg("path", { d: tube, fill: "none", stroke: "#ffffff", "stroke-width": 2, opacity: 0.7, transform: "translate(-3 0)" }, this.g);
    this.dh = 0;
    this.cible = 0;
    this.ecouteurs = [];
    this.dessiner();
    this.tourner();
  }

  const M = Manometre.prototype;

  M.dessiner = function () {
    // Liquide : branche gauche abaissée de Δh/2, branche droite montée de Δh/2 ; ménisques arrondis.
    const gauche = ZERO + (this.dh / 2) * PX_PAR_CM, droite = ZERO - (this.dh / 2) * PX_PAR_CM;
    this.liquide.setAttribute("d", `M0 ${gauche + 3} V${BAS} a${ECART / 2} ${ECART / 2} 0 0 0 ${ECART} 0 V${droite + 3}`);
  };

  M.entree = function () {
    // Haut de la branche gauche, où arrive le tuyau de la capsule.
    return { x: this.origine.x, y: this.origine.y + HAUT };
  };

  M.viser = function (dh_cm) {
    // Nouvelle dénivellation à atteindre (le liquide s'y rend en quelques dixièmes de seconde).
    this.cible = Math.max(-26, Math.min(26, dh_cm));
  };

  M.tourner = function () {
    // Boucle d'animation : le liquide rejoint la dénivellation visée (premier ordre, τ = 0,25 s).
    let avant = null, en_mouvement = false;
    const image = (instant) => {
      const dt = avant === null ? 0 : Math.min(0.05, (instant - avant) / 1000);
      avant = instant;
      if (Math.abs(this.dh - this.cible) > 0.005) {
        en_mouvement = true;
        this.dh += (this.cible - this.dh) * Math.min(1, dt / 0.25);
        this.dessiner();
      } else if (en_mouvement) {
        en_mouvement = false;
        this.dh = this.cible;
        this.dessiner();
        for (const f of this.ecouteurs) f(this.dh);
      }
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
  };

  M.sur_repos = function (fonction) {
    // Appelle fonction(dh) quand le liquide s'immobilise.
    this.ecouteurs.push(fonction);
  };

  L.Manometre = Manometre;
})(window.Labo);

/*
Rôle : objets que l'on accroche au dynamomètre : masses marquées en laiton à double crochet (50 g à 500 g)
       et caillou de masse inconnue tenu par une ficelle. Chaque objet sait se dessiner, debout ou suspendu.
Reçoit : le groupe SVG et la description de l'objet (masse, taille, inscription).
Produit : new ObjetSuspendu(parent, description) avec placer(x, y), pendre(oui), hauteur_debout, hauteur_pendu.
Utilisé par : accrochage.js, poste_poids.js (tc_meca1_o3_poids), les simulations d'équilibre (tc_meca5_*).
*/
(function (L) {
  function masse_marquee(g, largeur, hauteur, inscription) {
    // Cylindre de laiton vu un peu d'en haut, crochet en haut, anneau en bas, masse gravée.
    L.svg("path", { d: "M0 9 V3 a3 3 0 1 1 5 -1", fill: "none", stroke: "url(#metal)", "stroke-width": 2, "stroke-linecap": "round" }, g);
    const ry = Math.max(2.5, largeur * 0.13);
    L.svg("rect", { x: -largeur / 2, y: 9, width: largeur, height: hauteur, fill: "url(#laiton)" }, g);
    L.svg("ellipse", { cx: 0, cy: 9 + hauteur, rx: largeur / 2, ry, fill: "#6d4a0e" }, g);
    L.svg("rect", { x: -largeur / 2, y: 9 + hauteur - 1, width: largeur, height: 1.5, fill: "url(#laiton)" }, g);
    L.svg("ellipse", { cx: 0, cy: 9, rx: largeur / 2, ry, fill: "url(#laiton-haut)", stroke: "#a77d24", "stroke-width": 0.5 }, g);
    L.texte(g, 0, 9 + hauteur / 2 + 1.5, inscription, { class: "etiquette-objet", "font-size": Math.min(8, largeur / 3.3), textLength: largeur * 0.78, lengthAdjust: "spacingAndGlyphs" });
    const anneau = L.svg("path", { d: `M0 ${9 + hauteur + ry - 1} v3 a3 3 0 1 0 0.1 0`, fill: "none", stroke: "url(#metal)", "stroke-width": 1.8 }, g);
    return { anneau, ry };
  }

  function caillou(g) {
    // Caillou gris irrégulier, entouré d'une ficelle qui forme une boucle en haut.
    L.svg("path", { d: "M0 0 C-6 4 -5 10 0 12", fill: "none", stroke: "#c8b48a", "stroke-width": 1.6 }, g);
    L.svg("path", { d: "M0 0 C6 4 5 10 0 12", fill: "none", stroke: "#b7a378", "stroke-width": 1.6 }, g);
    L.svg("path", {
      d: "M-20 22 C-24 14 -12 9 -2 11 C8 8 22 12 23 22 C25 32 14 40 2 39 C-10 41 -24 35 -20 22 Z",
      fill: "url(#caillou)", stroke: "#3f3c37", "stroke-width": 0.6,
    }, g);
    L.svg("path", { d: "M-12 18 C-6 14 4 14 10 16", fill: "none", stroke: "#cfccc4", "stroke-width": 1.4, opacity: 0.6 }, g);
    L.svg("path", { d: "M-18 25 C-6 22 10 22 22 26", fill: "none", stroke: "#c8b48a", "stroke-width": 1.6 }, g);
  }

  function ObjetSuspendu(parent, description) {
    // Crée l'objet ; son origine est le point par lequel on l'accroche (haut du crochet ou de la ficelle).
    Object.assign(this, description);
    this.g = L.svg("g", { filter: "url(#ombre)", class: "objet-suspendu" }, parent);
    this.g.objet = this;
    this.base = 0;
    if (description.type === "caillou") {
      caillou(this.g);
      this.hauteur_debout = 40;
      this.hauteur_pendu = 40;
      this.accroche_dessous = false;
      this.anneau = null;
    } else {
      const { anneau, ry } = masse_marquee(this.g, description.largeur, description.hauteur, description.inscription);
      this.anneau = anneau;
      this.hauteur_debout = 9 + description.hauteur + ry;
      this.hauteur_pendu = 9 + description.hauteur + ry + 6;
      this.accroche_dessous = true;
    }
    this.pos = { x: 0, y: 0 };
    this.pendre(false);
  }

  ObjetSuspendu.prototype.placer = function (x, y) {
    // Place l'objet par son point d'accroche.
    this.pos = { x, y };
    L.placer(this.g, x, y);
  };

  ObjetSuspendu.prototype.pendre = function (oui) {
    // Suspendu, l'anneau du bas pend sous la masse ; posé, il est replié sous la masse.
    this.suspendu = oui;
    if (this.anneau) this.anneau.style.display = oui ? "" : "none";
  };

  ObjetSuspendu.prototype.dessous = function () {
    // Point où l'on peut accrocher l'objet suivant (sous l'anneau).
    return { x: this.pos.x, y: this.pos.y + this.hauteur_pendu };
  };

  L.ObjetSuspendu = ObjetSuspendu;

  L.MASSES_MARQUEES = [
    { masse_kg: 0.05, largeur: 16, hauteur: 13, inscription: "50g" },
    { masse_kg: 0.1, largeur: 20, hauteur: 17, inscription: "100g" },
    { masse_kg: 0.1, largeur: 20, hauteur: 17, inscription: "100g" },
    { masse_kg: 0.2, largeur: 25, hauteur: 24, inscription: "200g" },
    { masse_kg: 0.2, largeur: 25, hauteur: 24, inscription: "200g" },
    { masse_kg: 0.5, largeur: 33, hauteur: 36, inscription: "500g" },
  ];
})(window.Labo);

/*
Rôle : brique pleine de 2,00 kg (20 cm × 10 cm × 5 cm) dessinée en 2,5D (face avant, dessus, côté) ;
       on la tourne pour changer la face posée : à plat, sur le chant, debout.
Reçoit : le groupe SVG ; l'orientation de départ.
Produit : new Brique(parent, orientation) avec placer(x, y) (milieu du bas de la face avant), tourner(), dimensions().
Utilisé par : poste_pression.js.
*/
(function (L) {
  const PROFONDEUR = { x: 0.3, y: -0.4 };
  const ORIENTATIONS = {
    plat: { largeur: 200, hauteur: 50, profondeur: 100, surface_m2: 0.02 },
    chant: { largeur: 200, hauteur: 100, profondeur: 50, surface_m2: 0.01 },
    debout: { largeur: 100, hauteur: 200, profondeur: 50, surface_m2: 0.005 },
  };
  const ORDRE = ["plat", "chant", "debout"];

  function Brique(parent, orientation) {
    // Crée la brique ; son origine est le milieu du bord bas de sa face avant.
    this.g = L.svg("g", { filter: "url(#ombre)", class: "brique" }, parent);
    this.orientation = orientation;
    this.masse_kg = 2;
    this.pos = { x: 0, y: 0 };
    this.dessiner();
  }

  const B = Brique.prototype;

  B.dimensions = function () {
    // Dimensions à l'écran (1 px = 1 mm) et surface posée de l'orientation actuelle.
    return ORIENTATIONS[this.orientation];
  };

  B.dessiner = function () {
    // Dessine les trois faces visibles, le joint de mortier séché et l'étiquette de masse.
    this.g.replaceChildren();
    const { largeur: w, hauteur: h, profondeur: p } = this.dimensions();
    const dx = p * PROFONDEUR.x, dy = p * PROFONDEUR.y, x0 = -w / 2, x1 = w / 2;
    L.svg("path", { d: `M${x0} ${-h} L${x0 + dx} ${-h + dy} H${x1 + dx} L${x1} ${-h} Z`, fill: "url(#brique-haut)" }, this.g);
    L.svg("path", { d: `M${x1} ${-h} L${x1 + dx} ${-h + dy} V${dy} L${x1} 0 Z`, fill: "url(#brique-cote)" }, this.g);
    L.svg("rect", { x: x0, y: -h, width: w, height: h, fill: "url(#brique-face)" }, this.g);
    L.svg("path", { d: `M${x0} ${-h + 0.5} H${x1}`, stroke: "#e08a6e", "stroke-width": 1, opacity: 0.7 }, this.g);
    L.svg("rect", { x: x0, y: -h, width: w, height: h, fill: "none", stroke: "#7a2f1f", "stroke-width": 0.8 }, this.g);
    const etiquette = L.svg("g", { transform: `translate(${Math.min(x1 - 40, x0 + 8)} ${-h + 6})` }, this.g);
    L.svg("rect", { width: 34, height: 14, fill: "#fbf7ea", stroke: "#cfc6ad", "stroke-width": 0.5 }, etiquette);
    L.texte(etiquette, 17, 7.5, "2,00 kg", { class: "etiquette-objet", "font-size": 7, textLength: 28, lengthAdjust: "spacingAndGlyphs" });
    this.hauteur = h;
  };

  B.placer = function (x, y) {
    // Place la brique par le milieu du bas de sa face avant.
    this.pos = { x, y };
    L.placer(this.g, x, y);
  };

  B.tourner = function () {
    // Passe à la face suivante (à plat -> sur le chant -> debout) avec un petit basculement.
    this.orientation = ORDRE[(ORDRE.indexOf(this.orientation) + 1) % ORDRE.length];
    this.dessiner();
    L.animer(0.25, (t) => {
      const k = 1 + 0.08 * Math.sin(Math.PI * t);
      this.g.setAttribute("transform", `translate(${this.pos.x} ${this.pos.y}) scale(${2 - k} ${k})`);
    }, () => this.placer(this.pos.x, this.pos.y));
  };

  L.Brique = Brique;
})(window.Labo);

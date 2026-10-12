/*
Rôle : sonde spatiale réaliste (corps couvert de feuille dorée, panneaux solaires, antenne parabolique),
       de taille liée à sa masse, avec l'afficheur de son capteur (distance et force mesurées).
Reçoit : le groupe SVG et { masse_kg, cote } (côté de l'afficheur : "droite" ou "gauche").
Produit : new Labo.Sonde(parent, reglages) avec placer(x, y), afficher(lignes), pos ; la masse est gravée sous la sonde.
Utilisé par : les simulations de gravitation (tc_meca1_a2_gravitation, tc_meca1_o3_altitude).
*/
(function (L) {
  function panneau(g, x, largeur) {
    // Panneau solaire : cellules bleu nuit séparées par de fines lignes.
    L.svg("rect", { x, y: -7, width: largeur, height: 14, fill: "#1b2e5c", stroke: "#8c97a8", "stroke-width": 0.6 }, g);
    for (let i = 1; i < 4; i++) L.svg("line", { x1: x + (largeur * i) / 4, y1: -7, x2: x + (largeur * i) / 4, y2: 7, stroke: "#3c5a99", "stroke-width": 0.5 }, g);
    L.svg("line", { x1: x, y1: 0, x2: x + largeur, y2: 0, stroke: "#3c5a99", "stroke-width": 0.5 }, g);
  }

  function corps(g) {
    // Corps doré vu un peu de côté, antenne parabolique blanche, petite antenne fouet.
    L.svg("path", { d: "M-9 -9 L-5 -12 H11 L9 -9 Z", fill: "#f6dc8c" }, g);
    L.svg("path", { d: "M9 -9 L11 -12 V6 L9 9 Z", fill: "#8a6516" }, g);
    L.svg("rect", { x: -9, y: -9, width: 18, height: 18, fill: "url(#laiton)" }, g);
    L.svg("path", { d: "M-6 -6 L6 6 M-6 2 L2 -6", stroke: "#fff3c4", "stroke-width": 0.5, opacity: 0.7 }, g);
    L.svg("ellipse", { cx: 0, cy: -16, rx: 7, ry: 3, fill: "#eef0f2", stroke: "#9aa1a7", "stroke-width": 0.6 }, g);
    L.svg("line", { x1: 0, y1: -13, x2: 0, y2: -9, stroke: "#9aa1a7", "stroke-width": 1 }, g);
    L.svg("line", { x1: 4, y1: 9, x2: 8, y2: 16, stroke: "#c9cdd1", "stroke-width": 0.6 }, g);
  }

  function Sonde(parent, { masse_kg, cote = "droite" }) {
    // Construit la sonde ; elle est plus grosse quand elle est plus lourde.
    this.masse_kg = masse_kg;
    this.cote = cote;
    this.g = L.svg("g", { class: "sonde" }, parent);
    this.dessin = L.svg("g", { transform: `scale(${Math.cbrt(masse_kg / 500)})` }, this.g);
    L.svg("line", { x1: -30, y1: 0, x2: 30, y2: 0, stroke: "#9aa1a7", "stroke-width": 1.2 }, this.dessin);
    panneau(this.dessin, -42, 30);
    panneau(this.dessin, 12, 30);
    corps(this.dessin);
    L.texte(this.g, 0, 26, `${L.nombre(masse_kg, 0)} kg`, { "font-size": 11, "font-weight": 700, fill: "#f1d58a" });
    this.ecran = L.svg("g", { class: "afficheur", "pointer-events": "none" }, this.g);
    this.pos = { x: 0, y: 0 };
  }

  Sonde.prototype.placer = function (x, y) {
    // Place la sonde.
    this.pos = { x, y };
    L.placer(this.g, x, y);
  };

  Sonde.prototype.afficher = function (lignes) {
    // Afficheur du capteur, relié à la sonde par un fil : une ligne par mesure (texte avec indices possibles).
    this.ecran.replaceChildren();
    if (!lignes.length) return;
    const largeur = 14 + Math.max(...lignes.map((l) => l.replace(/[_^]\{|\}/g, "").length)) * 7.1, hauteur = 8 + lignes.length * 15;
    const x = this.cote === "gauche" ? -30 - largeur : 30, y = -40 - hauteur;
    L.svg("path", { d: `M${this.cote === "gauche" ? -10 : 10} -8 L${this.cote === "gauche" ? x + largeur : x} ${y + hauteur}`, stroke: "#5fd38a", "stroke-width": 0.8, opacity: 0.7 }, this.ecran);
    L.svg("rect", { x, y, width: largeur, height: hauteur, rx: 3, fill: "#08130d", stroke: "#2f7d4f", opacity: 0.92 }, this.ecran);
    lignes.forEach((ligne, i) => L.texte_exposants(this.ecran, x + 6, y + 12 + i * 15, ligne, { "font-size": 11.5, fill: "#7dfc9f", "font-family": "ui-monospace, Consolas, monospace" }));
  };

  L.Sonde = Sonde;
})(window.Labo);

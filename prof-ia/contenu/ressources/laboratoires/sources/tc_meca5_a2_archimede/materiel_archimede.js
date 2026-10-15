/*
Rôle : matériel de la poussée d'Archimède : support élévateur à ciseaux (son plateau monte ou descend quand on le fait
       glisser), bécher gradué contenant un liquide, cylindre plein suspendu par un crochet.
Reçoit : les groupes SVG ; les positions et dimensions (px) ; les gestes de l'élève sur le plateau.
Produit : new Labo.Elevateur(groupe, x, { bas, haut }) : plateau (y du dessus), limite(f), sur_changement(f) ;
          Labo.dessiner_becher(groupe, x, y_dessus_plateau, { niveau, liquide, etiquette }) ; Labo.dessiner_cylindre(groupe, x, y_haut, reglages).
Utilisé par : poste_archimede.js.
*/
(function (L) {
  const BECHER = { l: 70, h: 90, verre: 3 };

  function Elevateur(parent, x, { bas, haut }) {
    // Socle, ciseaux, plateau ; le plateau se déplace verticalement entre « haut » et « bas ».
    Object.assign(this, { x, bas, haut, plateau: bas, ecouteurs: [], limite_f: (y) => y });
    this.g = L.svg("g", { class: "elevateur", role: "slider", "aria-label": "Plateau du support élévateur" }, parent);
    this.dessiner();
    L.glissable(this.g, {
      soulever: false,
      debut: () => ({ x: this.x, y: this.plateau }),
      deplacer: (p) => this.regler(p.y),
    });
  }

  Elevateur.prototype.regler = function (y) {
    // Place le plateau (borné, et sans que le solide touche le fond du bécher).
    this.plateau = this.limite_f(Math.max(this.haut, Math.min(this.bas, y)));
    this.dessiner();
    for (const f of this.ecouteurs) f(this.plateau);
  };

  Elevateur.prototype.dessiner = function () {
    // Socle d'acier, deux paires de bras croisés, vis et manivelle, plateau.
    const { x, plateau: y } = this, b = this.bas + 26, g = this.g;
    g.replaceChildren();
    L.ombre_sol(g, x, b + 6, 70, 6, 0.4);
    L.svg("rect", { x: x - 62, y: b - 6, width: 124, height: 8, rx: 2, fill: "url(#acier)" }, g);
    L.svg("rect", { x: x - 66, y: y - 8, width: 132, height: 8, rx: 2, fill: "url(#metal-h)", stroke: "#5d666d", "stroke-width": 0.6 }, g);
    const m = (y + b) / 2;
    for (const [a, c] of [[[x - 48, y], [x + 48, m]], [[x + 48, y], [x - 48, m]], [[x - 48, m], [x + 48, b - 6]], [[x + 48, m], [x - 48, b - 6]]]) {
      L.tige(g, `M${a[0]} ${a[1]} L${c[0]} ${c[1]}`, 4);
    }
    L.tige(g, `M${x - 52} ${m} H${x + 64}`, 3);
    L.svg("circle", { cx: x + 68, cy: m, r: 6, fill: "#2a2e33", stroke: "#8a9297", "stroke-width": 1.5 }, g);
    L.svg("rect", { x: x - 70, y: y - 40, width: 140, height: b - y + 46, fill: "#000", opacity: 0.001 }, g);
  };

  Elevateur.prototype.limite = function (f) { this.limite_f = f; };
  Elevateur.prototype.sur_changement = function (f) { this.ecouteurs.push(f); };

  L.dessiner_becher = function (g, x, y, { niveau, liquide, etiquette }) {
    // Bécher posé en y (fond extérieur) : liquide jusqu'à « niveau » px au-dessus du fond, graduations, étiquette.
    const { l, h } = BECHER, gauche = x - l / 2, haut = y - h;
    L.svg("rect", { x: gauche + 3, y: y - niveau, width: l - 6, height: niveau - 3, fill: liquide, opacity: 0.75 }, g);
    L.svg("ellipse", { cx: x, cy: y - niveau, rx: l / 2 - 3, ry: 3, fill: "#d9eef7", opacity: 0.7 }, g);
    L.svg("path", { d: `M${gauche} ${haut} V${y - 4} q0 4 4 4 H${gauche + l - 4} q4 0 4 -4 V${haut} M${gauche} ${haut} l-4 -3`, fill: "url(#verre)", stroke: "#9fb6be", "stroke-width": 1.4, "fill-opacity": 0.35 }, g);
    for (let i = 1; i <= 4; i++) L.svg("line", { x1: gauche + 6, y1: y - i * 20, x2: gauche + 16, y2: y - i * 20, stroke: "#5f7a84", "stroke-width": 0.8 }, g);
    L.svg("rect", { x: x - 26, y: y - 19, width: 52, height: 13, rx: 2, fill: "#fbf7ea", stroke: "#cfc6ad", "stroke-width": 0.6 }, g);
    L.texte(g, x, y - 12.5, etiquette, { "font-size": 8, "font-weight": 700, fill: "#333" });
    return { fond_interieur: y - 3, l, h };
  };

  L.dessiner_cylindre = function (g, x, y, { largeur, hauteur, metal, nom }) {
    // Cylindre plein avec son anneau de suspension et son nom gravé ; (x, y) est le point d'accroche.
    L.svg("path", { d: `M${x} ${y} v4 a3 3 0 1 0 0.1 0`, fill: "none", stroke: "url(#metal)", "stroke-width": 1.8 }, g);
    L.svg("rect", { x: x - largeur / 2, y: y + 10, width: largeur, height: hauteur, rx: 2, fill: metal, stroke: "#3b3f44", "stroke-width": 0.6 }, g);
    L.svg("ellipse", { cx: x, cy: y + 10, rx: largeur / 2, ry: 3, fill: "#ffffff", opacity: 0.35 }, g);
    L.texte(g, x, y + 10 + hauteur / 2, nom, { "font-size": 7, "font-weight": 700, fill: "#1b1f22", transform: `rotate(-90 ${x} ${y + 10 + hauteur / 2})` });
  };

  L.Elevateur = Elevateur;
  L.BECHER = BECHER;
})(window.Labo);

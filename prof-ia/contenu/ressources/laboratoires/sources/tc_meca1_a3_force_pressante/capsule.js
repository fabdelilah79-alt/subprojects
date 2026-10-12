/*
Rôle : capsule manométrique (boîtier métallique fermé par une membrane de caoutchouc) au bout de son tube rigide ;
       on la tourne pour orienter la membrane vers le bas, sur le côté ou vers le haut.
Reçoit : le groupe SVG (l'équipage mobile) et la longueur du tube rigide.
Produit : new Capsule(parent, longueur) avec dessiner(orientation) ; Capsule.ORIENTATIONS.
Utilisé par : poste_liquide.js.
*/
(function (L) {
  const ORIENTATIONS = ["bas", "cote", "haut"];
  const R = 17;

  function boitier_vertical(g, y, membrane_en_bas) {
    // Boîtier à axe vertical : la membrane est la face du bas ou celle du haut.
    const haut = y - 7, bas = y + 7;
    L.svg("rect", { x: -R, y: haut, width: 2 * R, height: bas - haut, fill: "url(#metal)" }, g);
    L.svg("ellipse", { cx: 0, cy: bas, rx: R, ry: 5, fill: membrane_en_bas ? "#d8b07a" : "#7d868d" }, g);
    L.svg("ellipse", { cx: 0, cy: haut, rx: R, ry: 5, fill: membrane_en_bas ? "url(#metal-h)" : "#e2bd86", stroke: membrane_en_bas ? "none" : "#a37a43", "stroke-width": 0.6 }, g);
  }

  function boitier_cote(g, y) {
    // Boîtier à axe horizontal : la membrane regarde vers la droite.
    L.svg("rect", { x: -9, y: y - R, width: 14, height: 2 * R, fill: "url(#metal-h)" }, g);
    L.svg("ellipse", { cx: 5, cy: y, rx: 6, ry: R, fill: "#e2bd86", stroke: "#a37a43", "stroke-width": 0.6 }, g);
    L.svg("ellipse", { cx: -9, cy: y, rx: 4, ry: R, fill: "#6c747a" }, g);
  }

  function Capsule(parent, longueur) {
    // Prépare le tube rigide et la capsule ; l'origine est le haut du tube (tenu par la noix).
    this.g = L.svg("g", { class: "capsule" }, parent);
    this.longueur = longueur;
    this.orientation = "bas";
    this.dessiner();
  }

  Capsule.prototype.dessiner = function () {
    // Dessine le tube, le coude éventuel, le boîtier orienté et le repère rouge de son centre.
    this.g.replaceChildren();
    const y = this.longueur;
    const coude = this.orientation === "haut" ? `M0 0 V${y - 22} Q0 ${y - 4} ${-R - 4} ${y - 4} Q${-R - 10} ${y} ${-R} ${y}` : `M0 0 V${y - (this.orientation === "bas" ? 7 : R)}`;
    L.tige(this.g, coude, 5);
    if (this.orientation === "cote") boitier_cote(this.g, y);
    else boitier_vertical(this.g, y, this.orientation === "bas");
    L.svg("line", { x1: -R - 6, y1: y, x2: R + 6, y2: y, stroke: "#d0261c", "stroke-width": 0.8 }, this.g);
  };

  Capsule.prototype.tourner = function () {
    // Passe à l'orientation suivante de la membrane.
    this.orientation = ORIENTATIONS[(ORIENTATIONS.indexOf(this.orientation) + 1) % ORIENTATIONS.length];
    this.dessiner();
  };

  L.Capsule = Capsule;
})(window.Labo);

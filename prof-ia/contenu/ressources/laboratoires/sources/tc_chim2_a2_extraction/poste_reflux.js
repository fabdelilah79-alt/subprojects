/*
Rôle : paillasse « reconnaître la verrerie » : un montage de chauffage à reflux (chauffe-ballon, ballon, réfrigérant à
       boules vertical, entrée et sortie de l'eau) dont les éléments sont numérotés, et un tableau pour associer chaque
       nom à son numéro.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_reflux(groupe) -> { pense_bete } ; Labo.ETIQUETTES_REFLUX ; fait « tri_reflux ».
Utilisé par : simulation.js.
*/
(function (L) {
  const VERRE = { fill: "url(#verre)", stroke: "#9fb6be" }, X = 340;
  L.ETIQUETTES_REFLUX = [
    { id: "refrigerant", texte: ["réfrigérant", "à boules"], colonne: 0 }, { id: "ballon", texte: ["ballon", "(fond rond)"], colonne: 1 },
    { id: "chauffe", texte: ["chauffe-ballon", ""], colonne: 2 }, { id: "entree", texte: ["entrée de", "l'eau froide"], colonne: 3 },
    { id: "sortie", texte: ["sortie de", "l'eau"], colonne: 4 },
  ];

  function montage(g) {
    // Chauffe-ballon, ballon, réfrigérant à boules vertical tenu par une pince, deux embouts, tuyaux.
    L.svg("rect", { x: 236, y: 552, width: 110, height: 10, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, "M262 552 V200", 5);
    for (const y of [300, 446]) { L.tige(g, `M262 ${y} H${X - 12}`, 3); L.svg("rect", { x: X - 16, y: y - 7, width: 10, height: 14, rx: 3, fill: "#c0392b" }, g); }
    L.svg("circle", { cx: X, cy: 498, r: 34, ...VERRE }, g);
    L.svg("path", { d: `M${X - 31} 504 A31 31 0 0 0 ${X + 31} 504 Z`, fill: "#e9d7b0", opacity: 0.7 }, g);
    L.svg("path", { d: `M${X - 46} 521 A46 9 0 0 0 ${X + 46} 521 L${X + 46} 562 H${X - 46} Z`, fill: "#5e6b74" }, g);
    L.texte(g, X, 548, "CHAUFFE-BALLON", { "font-size": 5.5, "font-weight": 700, fill: "#dfe6ea" });
    L.svg("rect", { x: X - 8, y: 430, width: 16, height: 40, ...VERRE }, g);
    L.svg("rect", { x: X - 14, y: 250, width: 28, height: 182, rx: 8, ...VERRE }, g);
    for (let k = 0; k < 5; k++) L.svg("ellipse", { cx: X, cy: 272 + k * 34, rx: 9, ry: 13, ...VERRE }, g);
    L.svg("rect", { x: X - 4, y: 240, width: 8, height: 14, ...VERRE }, g);
    L.svg("rect", { x: X - 12, y: 254, width: 24, height: 174, fill: "#5fb3dc", opacity: 0.25 }, g);
    for (const y of [412, 266]) { L.svg("rect", { x: X + 14, y: y - 3, width: 12, height: 6, ...VERRE }, g); L.svg("rect", { x: X + 20, y: y - 4, width: 4, height: 8, rx: 1.5, ...VERRE }, g); }
    // Tuyaux enfilés sur les embouts (ils recouvrent l'olive de 8 px et partent dans l'axe de l'embout).
    L.svg("path", { d: `M${X + 18} 412 H${X + 34} C${X + 80} 412 ${X + 90} 470 ${X + 120} 470`, stroke: "#c9a96b", "stroke-width": 7, fill: "none" }, g);
    L.svg("path", { d: `M${X + 18} 266 H${X + 34} C${X + 80} 266 ${X + 110} 300 ${X + 130} 330`, stroke: "#c9a96b", "stroke-width": 7, fill: "none" }, g);
  }

  function numeros(g) {
    // Pastilles numérotées reliées à chaque élément.
    for (const [n, x, y, cx, cy] of [[1, 380, 200, X + 10, 330], [2, 196, 470, X - 30, 498], [3, 200, 556, X - 46, 545], [4, 430, 440, X + 26, 412], [5, 430, 240, X + 26, 266]]) {
      L.svg("line", { x1: x, y1: y, x2: cx, y2: cy, stroke: "#23315a", "stroke-width": 1 }, g);
      L.svg("circle", { cx: x, cy: y, r: 10, fill: "#fbe98a", stroke: "#23315a" }, g);
      L.texte(g, x, y + 0.5, String(n), { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    }
  }

  L.poste_reflux = function (g) {
    // Montage numéroté et tableau des noms.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 160, 140);
    montage(g); numeros(g);
    L.tableau_tri(g, { x: 480, y: 48, largeur: 520, hauteur: 300, titre: "Montage de chauffage à reflux", colonnes: ["1", "2", "3", "4", "5"], etiquettes: [3, 0, 4, 1, 2].map((k) => ({ ...L.ETIQUETTES_REFLUX[k] })), fait: "tri_reflux" });
    return { pense_bete };
  };
})(window.Labo);

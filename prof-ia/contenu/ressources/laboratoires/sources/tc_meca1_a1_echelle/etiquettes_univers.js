/*
Rôle : étiquettes aimantées de l'activité « échelle des distances » : un petit dessin et un nom par objet
       (noyau, atome, globule rouge, élève, rayon de la Terre, Terre-Lune, Terre-Soleil, Voie lactée).
Reçoit : le groupe SVG et l'identifiant de l'objet.
Produit : Labo.ETIQUETTES_UNIVERS (objets, longueur et ordre de grandeur attendu) ; Labo.dessiner_etiquette(parent, id).
Utilisé par : poste_echelle.js.
*/
(function (L) {
  const LARGEUR = 120, HAUTEUR = 56;

  L.ETIQUETTES_UNIVERS = [
    { id: "noyau", nom: ["Noyau", "d'un atome"], exposant: -15 },
    { id: "atome", nom: ["Atome", "d'hydrogène"], exposant: -10 },
    { id: "globule", nom: ["Globule", "rouge"], exposant: -5 },
    { id: "eleve", nom: ["Taille", "d'un élève"], exposant: 0 },
    { id: "terre", nom: ["Rayon", "de la Terre"], exposant: 7 },
    { id: "terre_lune", nom: ["Distance", "Terre – Lune"], exposant: 8 },
    { id: "terre_soleil", nom: ["Distance", "Terre – Soleil"], exposant: 11 },
    { id: "galaxie", nom: ["Diamètre de", "la Voie lactée"], exposant: 21 },
  ];

  const DESSINS = {
    noyau(g) {
      // Amas de protons (rouges) et de neutrons (gris).
      [[-5, -3, "#c0392b"], [4, -4, "#8e959b"], [0, 4, "#8e959b"], [-6, 5, "#c0392b"], [6, 4, "#c0392b"]]
        .forEach(([x, y, c]) => L.svg("circle", { cx: x, cy: y, r: 5, fill: c, stroke: "#333", "stroke-width": 0.4 }, g));
    },
    atome(g) {
      // Noyau minuscule et nuage électronique.
      L.svg("circle", { r: 15, fill: "#9fc4e8", opacity: 0.5 }, g);
      L.svg("ellipse", { rx: 15, ry: 6, fill: "none", stroke: "#3e6fa3", "stroke-width": 0.8 }, g);
      L.svg("circle", { r: 1.6, fill: "#c0392b" }, g);
      L.svg("circle", { cx: 13, cy: -3, r: 1.8, fill: "#1f4f8f" }, g);
    },
    globule(g) {
      // Disque rouge creusé au centre.
      L.svg("ellipse", { rx: 15, ry: 11, fill: "#c0392b" }, g);
      L.svg("ellipse", { rx: 7, ry: 5, fill: "#e0705f" }, g);
    },
    eleve(g) {
      // Silhouette d'un élève debout.
      L.svg("circle", { cx: 0, cy: -12, r: 4.5, fill: "#3b4450" }, g);
      L.svg("path", { d: "M-6 -6 H6 L5 6 H2 V17 H-2 V6 H-5 Z", fill: "#3b4450" }, g);
    },
    terre(g) {
      // Terre : océans et continents.
      L.svg("circle", { r: 15, fill: "#2f6db0" }, g);
      L.svg("path", { d: "M-8 -9 C-2 -12 3 -6 -1 -2 C-5 2 -11 0 -8 -9 Z M3 2 C9 0 12 6 6 10 C2 12 0 6 3 2 Z", fill: "#4f9a4c" }, g);
      L.svg("line", { x1: 0, y1: 0, x2: 15, y2: 0, stroke: "#fff", "stroke-width": 1, "stroke-dasharray": "2 1.5" }, g);
    },
    terre_lune(g) {
      // Terre, Lune et la distance qui les sépare.
      L.svg("circle", { cx: -12, r: 8, fill: "#2f6db0" }, g);
      L.svg("circle", { cx: 14, r: 3, fill: "#b9b9b9" }, g);
      L.svg("path", { d: "M-3 9 H12", stroke: "#333", "stroke-width": 0.8, "marker-start": "url(#fleche-cote)", "marker-end": "url(#fleche-cote)" }, g);
    },
    terre_soleil(g) {
      // Soleil, Terre et la distance qui les sépare.
      L.svg("circle", { cx: -10, r: 12, fill: "#f4b400" }, g);
      L.svg("circle", { cx: 15, r: 2.5, fill: "#2f6db0" }, g);
      L.svg("path", { d: "M2 12 H15", stroke: "#333", "stroke-width": 0.8, "marker-start": "url(#fleche-cote)", "marker-end": "url(#fleche-cote)" }, g);
    },
    galaxie(g) {
      // Galaxie spirale vue de face.
      L.svg("ellipse", { rx: 16, ry: 9, fill: "#2b2d4a" }, g);
      L.svg("path", { d: "M0 0 C6 -6 14 -2 12 4 M0 0 C-6 6 -14 2 -12 -4", fill: "none", stroke: "#d9d4ff", "stroke-width": 1.6 }, g);
      L.svg("circle", { r: 2.5, fill: "#fff6c8" }, g);
    },
  };

  L.dessiner_etiquette = function (parent, objet) {
    // Étiquette blanche à bande verte, aimant au dos ; origine au centre.
    const g = L.svg("g", { class: "etiquette-aimantee", filter: "url(#ombre)" }, parent);
    L.svg("rect", { x: -LARGEUR / 2, y: -HAUTEUR / 2, width: LARGEUR, height: HAUTEUR, rx: 3, fill: "#fdfdf8", stroke: "#b9bdb5", "stroke-width": 0.8 }, g);
    L.svg("rect", { x: -LARGEUR / 2, y: -HAUTEUR / 2, width: 6, height: HAUTEUR, rx: 2, fill: "#1f6f4a" }, g);
    DESSINS[objet.id](L.svg("g", { transform: `translate(${-LARGEUR / 2 + 28} 0)` }, g));
    objet.nom.forEach((ligne, i) => {
      const ajuste = ligne.length > 11 ? { textLength: 76, lengthAdjust: "spacingAndGlyphs" } : {};
      L.texte(g, 18, -8 + i * 17, ligne, { class: "etiquette-carton", "font-size": 15, ...ajuste });
    });
    return g;
  };

  L.dessiner_etiquette.TAILLE = { l: LARGEUR, h: HAUTEUR };
})(window.Labo);

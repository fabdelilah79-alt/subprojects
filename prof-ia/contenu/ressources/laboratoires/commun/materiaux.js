/*
Rôle : matières du laboratoire en 2,5D : dégradés (métal, laiton, verre, eau, bois, paillasse), textures et ombres.
Reçoit : le dessin SVG du laboratoire.
Produit : un bloc <defs> ; chaque matière s'utilise par fill="url(#nom)" ou filter="url(#nom)" ;
         Labo.tige() pour les tiges métalliques (un dégradé ne s'affiche pas sur un trait parfaitement droit).
Utilisé par : toutes les simulations (Labo.materiaux), avant de dessiner.
*/
(function (L) {
  function degrade(defs, id, arrets, x2 = 1, y2 = 0, attributs = {}) {
    // Ajoute un dégradé linéaire ; arrets = [[position, couleur, opacité?], ...].
    const g = L.svg("linearGradient", { id, x1: 0, y1: 0, x2, y2, ...attributs }, defs);
    for (const [position, couleur, opacite = 1] of arrets) {
      L.svg("stop", { offset: position, "stop-color": couleur, "stop-opacity": opacite }, g);
    }
  }

  function filtre_ombre(defs, id, flou, dx, dy, opacite) {
    // Ajoute une ombre portée douce (lumière venant d'en haut à gauche).
    const f = L.svg("filter", { id, x: "-40%", y: "-40%", width: "180%", height: "180%" }, defs);
    L.svg("feDropShadow", { dx, dy, stdDeviation: flou, "flood-color": "#000", "flood-opacity": opacite }, f);
  }

  function texture_points(defs, id, fond, couleur, taille, points) {
    // Ajoute un motif répété fait de petits points (pores de mousse, grain de brique).
    const motif = L.svg("pattern", { id, width: taille, height: taille, patternUnits: "userSpaceOnUse" }, defs);
    L.svg("rect", { width: taille, height: taille, fill: fond }, motif);
    for (const [x, y, r] of points) L.svg("circle", { cx: x, cy: y, r, fill: couleur }, motif);
  }

  function metaux(defs) {
    // Métal chromé, laiton, acier sombre.
    degrade(defs, "metal", [[0, "#6f777d"], [0.3, "#f4f6f7"], [0.55, "#b9c0c5"], [1, "#59616a"]]);
    degrade(defs, "metal-h", [[0, "#f1f3f4"], [0.5, "#aab2b8"], [1, "#5e666d"]], 0, 1);
    degrade(defs, "laiton", [[0, "#7a5512"], [0.28, "#f6dc8c"], [0.55, "#c99a35"], [1, "#6d4a0e"]]);
    degrade(defs, "laiton-haut", [[0, "#fbeab0"], [1, "#c99a35"]], 0, 1);
    degrade(defs, "acier", [[0, "#2c3136"], [0.4, "#5f676e"], [1, "#24282c"]]);
  }

  function verres(defs) {
    // Verre, eau, liquide coloré, plastique transparent.
    degrade(defs, "verre", [[0, "#ffffff", 0.55], [0.12, "#dfeef3", 0.18], [0.8, "#cfe3ea", 0.12], [0.92, "#ffffff", 0.45], [1, "#9fb6be", 0.35]]);
    degrade(defs, "eau", [[0, "#7fc4dc", 0.55], [1, "#2c7fa3", 0.75]], 0, 1);
    degrade(defs, "eau-face", [[0, "#2c7fa3", 0.35], [0.5, "#9fdcef", 0.25], [1, "#2c7fa3", 0.45]]);
    degrade(defs, "liquide-rouge", [[0, "#9d1f2b"], [0.45, "#e2525d"], [1, "#7c1621"]]);
    degrade(defs, "plastique", [[0, "#dfe7ea", 0.55], [0.3, "#ffffff", 0.35], [0.7, "#f4f7f8", 0.2], [1, "#aab7bd", 0.6]]);
  }

  function decor(defs) {
    // Mur, carrelage, paillasse, façade des placards, bois.
    degrade(defs, "mur", [[0, "#d9dcd5"], [1, "#c5c9c1"]], 0, 1);
    degrade(defs, "paillasse", [[0, "#4b5359"], [0.55, "#353b40"], [1, "#2a2f33"]], 0, 1);
    degrade(defs, "bord", [[0, "#5c656c"], [1, "#22262a"]], 0, 1);
    degrade(defs, "facade", [[0, "#8a9497"], [1, "#6c7578"]], 0, 1);
    degrade(defs, "bois", [[0, "#b98a57"], [0.5, "#d9ab74"], [1, "#a17444"]], 0, 1);
    degrade(defs, "bois-face", [[0, "#8d6337"], [1, "#6d4a26"]], 0, 1);
    degrade(defs, "reflet", [[0, "#ffffff", 0], [0.5, "#ffffff", 0.08], [1, "#ffffff", 0]]);
    const motif = L.svg("pattern", { id: "carrelage", width: 48, height: 32, patternUnits: "userSpaceOnUse" }, defs);
    L.svg("rect", { width: 48, height: 32, fill: "#eef0ec" }, motif);
    L.svg("path", { d: "M0 0.5H48M0.5 0V32", stroke: "#c9cdc6", "stroke-width": 1 }, motif);
  }

  function matieres(defs) {
    // Mousse, brique, papier.
    texture_points(defs, "mousse-face", "#f0c64a", "#d9a92c", 7, [[1, 2, 0.9], [4.5, 5, 0.7], [5.5, 1.5, 0.5]]);
    texture_points(defs, "mousse-haut", "#f8d76a", "#e4b844", 7, [[2, 2, 0.8], [5, 5, 0.6]]);
    texture_points(defs, "brique-face", "#b4513a", "#94402c", 9, [[2, 3, 0.9], [6, 7, 0.8], [7, 2, 0.5]]);
    texture_points(defs, "brique-haut", "#c9644a", "#a9503a", 9, [[3, 3, 0.8], [7, 6, 0.6]]);
    degrade(defs, "brique-cote", [[0, "#8e3b28"], [1, "#6f2c1d"]]);
    degrade(defs, "caillou", [[0, "#a4a19a"], [0.5, "#7d7a73"], [1, "#4d4a45"]], 1, 1);
  }

  function rayonnant(defs, id, arrets, cx = 0.35, cy = 0.35) {
    // Ajoute un dégradé radial (sphère éclairée, halo de lampe).
    const g = L.svg("radialGradient", { id, cx, cy, r: 0.75 }, defs);
    for (const [position, couleur, opacite = 1] of arrets) L.svg("stop", { offset: position, "stop-color": couleur, "stop-opacity": opacite }, g);
  }

  function astres(defs) {
    // Lampe-soleil, son halo, globes de la Terre et de la Lune, sphères dorées.
    rayonnant(defs, "soleil", [[0, "#fffbe0"], [0.45, "#ffd23f"], [1, "#e88a0c"]], 0.45, 0.4);
    rayonnant(defs, "halo", [[0, "#fff3b0", 0.55], [0.6, "#ffd23f", 0.12], [1, "#ffd23f", 0]], 0.5, 0.5);
    rayonnant(defs, "terre", [[0, "#8fc3f0"], [0.6, "#2f6db0"], [1, "#163d6b"]]);
    rayonnant(defs, "lune", [[0, "#f2f2ee"], [0.65, "#b5b5ae"], [1, "#6e6e68"]]);
    rayonnant(defs, "laiton-boule", [[0, "#fff1c2"], [0.5, "#d4a640"], [1, "#6d4a0e"]]);
  }

  function marqueurs(defs) {
    // Pointes de flèche : cotes (petites, noires), forces (rouges ou bleues).
    for (const [id, taille, couleur] of [["fleche-cote", 4, "#333"], ["fleche-rouge", 9, "#c0392b"], ["fleche-bleue", 9, "#1f5fa8"]]) {
      const m = L.svg("marker", { id, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: taille, markerHeight: taille, orient: "auto-start-reverse", markerUnits: "userSpaceOnUse" }, defs);
      L.svg("path", { d: "M0 0 L10 5 L0 10 Z", fill: couleur }, m);
    }
  }

  L.materiaux = function (dessin) {
    // Crée toutes les matières et ombres dans le dessin du laboratoire.
    const defs = L.svg("defs", {}, dessin);
    metaux(defs);
    verres(defs);
    decor(defs);
    matieres(defs);
    marqueurs(defs);
    astres(defs);
    filtre_ombre(defs, "ombre", 2.5, 2, 3, 0.45);
    filtre_ombre(defs, "ombre-levee", 7, 10, 18, 0.35);
    const flou = L.svg("filter", { id: "flou", x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
    L.svg("feGaussianBlur", { stdDeviation: 5 }, flou);
    return defs;
  };

  L.tige = function (parent, d, epaisseur = 3, teinte = "acier") {
    // Tige métallique (droite ou coudée) : trait sombre, trait clair décalé pour le reflet ; d = chemin SVG.
    const couleurs = { acier: ["#6c747b", "#e4e8eb"], laiton: ["#8a6516", "#f6dc8c"] }[teinte];
    const g = L.svg("g", { fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, parent);
    L.svg("path", { d, stroke: couleurs[0], "stroke-width": epaisseur }, g);
    L.svg("path", { d, stroke: couleurs[1], "stroke-width": Math.max(0.6, epaisseur * 0.35), transform: `translate(${-epaisseur * 0.18} ${-epaisseur * 0.18})` }, g);
    return g;
  };

  L.ombre_sol = function (parent, cx, cy, rx, ry, opacite = 0.45) {
    // Dessine une ombre floue posée sur la paillasse, sous un objet.
    return L.svg("ellipse", { cx, cy, rx, ry, fill: "#000", opacity: opacite, filter: "url(#flou)" }, parent);
  };
})(window.Labo);

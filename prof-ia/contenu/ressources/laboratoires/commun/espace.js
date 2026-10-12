/*
Rôle : dessin réaliste de l'espace : ciel étoilé et Voie lactée, Soleil (assombrissement du bord, granulation,
       couronne), Terre (océans, continents, nuages, atmosphère), Lune (mers et cratères) ; la moitié de chaque
       astre opposée au Soleil est dans la nuit, avec une frontière jour/nuit douce (phases de la Lune).
Reçoit : le dessin SVG (pour ses matières) et les groupes où dessiner.
Produit : Labo.espace.ciel(g), Labo.espace.soleil(g, x, y, r), new Labo.espace.Astre(g, "terre" | "lune")
          avec placer(x, y, r, soleil).
Utilisé par : les simulations qui se passent dans l'espace (gravitation, altitude) ; continents.js donne les côtes.
*/
(function (L) {
  function hasard(graine) {
    // Suite de nombres pseudo-aléatoires reproductible : le ciel est le même à chaque ouverture.
    let s = graine;
    return () => ((s = (s * 16807) % 2147483647) / 2147483647);
  }

  let numero = 0;

  function matieres(defs) {
    // Dégradés et filtres propres aux astres (une seule fois, même s'il y a plusieurs scènes).
    if (defs.querySelector("#couronne")) return;
    const radial = (id, arrets, cx = 0.5, cy = 0.5) => {
      const g = L.svg("radialGradient", { id, cx, cy, r: 0.5 }, defs);
      for (const [o, c, a = 1] of arrets) L.svg("stop", { offset: o, "stop-color": c, "stop-opacity": a }, g);
    };
    radial("soleil-disque", [[0, "#fffdf2"], [0.55, "#ffe58a"], [0.88, "#ffa726"], [1, "#e65c00"]]);
    radial("couronne", [[0, "#fff6d5", 0.9], [0.3, "#ffd36b", 0.35], [0.6, "#ff9f3a", 0.08], [1, "#ff9f3a", 0]]);
    radial("ocean", [[0, "#79b8ea"], [0.6, "#1d5fa6"], [1, "#0b2c57"]], 0.38, 0.36);
    radial("atmosphere", [[0.78, "#7fc4ff", 0], [0.9, "#7fc4ff", 0.45], [1, "#7fc4ff", 0]]);
    radial("sol-lunaire", [[0, "#ecebe6"], [0.7, "#b9b7af"], [1, "#8b8981"]], 0.4, 0.38);
    const terres = L.svg("linearGradient", { id: "terres", gradientUnits: "userSpaceOnUse", x1: 0, y1: -16, x2: 0, y2: 16 }, defs);
    for (const [o, c] of [[0.2, "#6f8b46"], [0.33, "#b8a06a"], [0.4, "#d9bd84"], [0.5, "#cfae72"], [0.56, "#8e9a4f"], [0.62, "#4e7a33"], [0.78, "#6d8a42"], [0.86, "#a69565"], [1, "#5e7a3c"]]) {
      L.svg("stop", { offset: o, "stop-color": c }, terres);
    }
    const grain = L.svg("filter", { id: "granulation", x: 0, y: 0, width: 1, height: 1 }, defs);
    L.svg("feTurbulence", { type: "fractalNoise", baseFrequency: 0.22, numOctaves: 2, seed: 4 }, grain);
    L.svg("feColorMatrix", { values: "0 0 0 0 0.75  0 0 0 0 0.35  0 0 0 0 0  0 0 0 0.55 -0.12" }, grain);
    L.svg("feComposite", { in2: "SourceGraphic", operator: "in" }, grain);
    const nuages = L.svg("filter", { id: "nuages", x: 0, y: 0, width: 1, height: 1 }, defs);
    L.svg("feTurbulence", { type: "fractalNoise", baseFrequency: 0.09, numOctaves: 3, seed: 9 }, nuages);
    L.svg("feColorMatrix", { values: "0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.6 -0.75" }, nuages);
    L.svg("feComposite", { in2: "SourceGraphic", operator: "in" }, nuages);
    const flou = L.svg("filter", { id: "flou-large", x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
    L.svg("feGaussianBlur", { stdDeviation: 18 }, flou);
  }

  function ciel(g) {
    // Fond noir bleuté, bande laiteuse de la Voie lactée, étoiles de tailles et de couleurs variées.
    matieres(g.ownerSVGElement.querySelector("defs"));
    L.svg("rect", { width: L.LARGEUR, height: L.HAUTEUR, fill: "#03050b" }, g);
    const voie = L.svg("g", { transform: "rotate(-18 512 320)", filter: "url(#flou-large)", opacity: 0.55 }, g);
    for (const [cx, rx, ry, a] of [[512, 620, 70, 0.16], [380, 260, 40, 0.12], [700, 220, 34, 0.1], [520, 420, 22, 0.08]]) {
      L.svg("ellipse", { cx, cy: 250, rx, ry, fill: "#c9cfe6", opacity: a }, voie);
    }
    const r = hasard(7);
    for (let i = 0; i < 320; i++) {
      const taille = Math.pow(r(), 3) * 1.5 + 0.3, teinte = ["#ffffff", "#cfe0ff", "#fff1d6", "#ffd9c2"][Math.floor(r() * 4)];
      L.svg("circle", { cx: r() * L.LARGEUR, cy: r() * L.HAUTEUR, r: taille, fill: teinte, opacity: 0.35 + r() * 0.65 }, g);
    }
  }

  function soleil(g, x, y, r) {
    // Couronne lumineuse, disque plus sombre sur le bord, granulation et deux petites taches.
    L.svg("circle", { cx: x, cy: y, r: r * 3.1, fill: "url(#couronne)" }, g);
    L.svg("circle", { cx: x, cy: y, r, fill: "url(#soleil-disque)" }, g);
    L.svg("circle", { cx: x, cy: y, r: r * 0.97, fill: "#ffb84d", filter: "url(#granulation)", opacity: 0.6 }, g);
    L.svg("ellipse", { cx: x - r * 0.32, cy: y + r * 0.18, rx: 3, ry: 2.2, fill: "#7a3300", opacity: 0.6 }, g);
    L.svg("ellipse", { cx: x + r * 0.2, cy: y - r * 0.4, rx: 2, ry: 1.5, fill: "#7a3300", opacity: 0.5 }, g);
  }

  function Astre(parent, nature) {
    // Prépare la Terre ou la Lune (rayon de référence 16), avec son dégradé de nuit orientable.
    this.g = L.svg("g", { class: `astre-${nature}` }, parent);
    const defs = parent.ownerSVGElement.querySelector("defs");
    matieres(defs);
    const id = `${nature}-${++numero}`;
    this.nuit = L.svg("linearGradient", { id: `nuit-${id}`, x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
    for (const [o, a] of [[0, 0], [0.42, 0], [0.5, 0.9], [0.58, 0.97], [1, 0.98]]) L.svg("stop", { offset: o, "stop-color": "#02040c", "stop-opacity": a }, this.nuit);
    const clip = L.svg("clipPath", { id: `disque-${id}` }, defs);
    L.svg("circle", { r: 16 }, clip);
    const corps = L.svg("g", { "clip-path": `url(#disque-${id})` }, this.g);
    if (nature === "terre") this.terre(corps);
    else this.lune(corps);
    L.svg("circle", { r: nature === "terre" ? 18.6 : 16, fill: `url(#nuit-${id})` }, this.g);
  }

  Astre.prototype.terre = function (corps) {
    // Océans, continents (vrais contours : Afrique, Europe, Arabie, Amérique du Sud), nuages, atmosphère.
    L.svg("circle", { r: 18.5, fill: "url(#atmosphere)" }, this.g);
    L.svg("circle", { r: 16, fill: "url(#ocean)" }, corps);
    for (const d of L.continents(16)) L.svg("path", { d, fill: "url(#terres)", stroke: "#3f5f2a", "stroke-width": 0.08 }, corps);
    L.svg("rect", { x: -16, y: -16, width: 32, height: 32, fill: "#fff", filter: "url(#nuages)", opacity: 0.8 }, corps);
    L.svg("ellipse", { cx: 0, cy: -16, rx: 8, ry: 3.2, fill: "#f4f7fb", opacity: 0.9 }, corps);
    L.svg("ellipse", { cx: 0, cy: 16, rx: 7, ry: 2.6, fill: "#f4f7fb", opacity: 0.9 }, corps);
  };

  Astre.prototype.lune = function (corps) {
    // Sol gris, mers sombres et cratères.
    L.svg("circle", { r: 16, fill: "url(#sol-lunaire)" }, corps);
    for (const [x, y, rx, ry, c] of [[-4, -5, 6, 4.5, "#8f8d86"], [4, 3, 5, 3.5, "#97958d"], [-6, 6, 3, 2.5, "#9c9a92"], [7, -7, 2, 2, "#7f7d76"], [1, 10, 1.6, 1.6, "#85837c"]]) {
      L.svg("ellipse", { cx: x, cy: y, rx, ry, fill: c, opacity: 0.85 }, corps);
    }
  };

  Astre.prototype.placer = function (x, y, r, soleil) {
    // Place l'astre et tourne sa moitié de nuit à l'opposé du Soleil.
    const angle = (Math.atan2(y - soleil.y, x - soleil.x) * 180) / Math.PI;
    this.nuit.setAttribute("gradientTransform", `rotate(${angle} 0.5 0.5)`);
    this.g.setAttribute("transform", `translate(${x} ${y}) scale(${r / 16})`);
  };

  L.espace = { ciel, soleil, Astre };
})(window.Labo);

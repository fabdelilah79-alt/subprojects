/*
Rôle : application « Graphique » de la tablette : l'élève choisit l'abscisse et l'ordonnée parmi les colonnes
       du tableur, les points se dessinent un à un, puis il peut modéliser par une droite (y = a·x ou y = a·x + b).
Reçoit : le conteneur HTML et une fonction qui donne la feuille de calcul de la mission en cours.
Produit : new Labo.Courbe(conteneur, feuille) ; annonce « courbe » avec { x, y, n, modele, a, b }.
Utilisé par : tablette.js, missions.js (vérification des étapes).
*/
(function (L) {
  const ZONE = { g: 62, d: 584, h: 18, b: 262 };

  function pas_agreable(maximum) {
    // Pas de graduation « rond » (1, 2 ou 5 × 10^n) pour environ 5 graduations.
    const brut = maximum / 5;
    const puissance = Math.pow(10, Math.floor(Math.log10(brut)));
    return [1, 2, 5, 10].map((k) => k * puissance).find((p) => p >= brut);
  }

  function nom_court(entete) {
    // « P (N) » -> « P » : le nom de la grandeur, sans l'unité.
    return entete.replace(/\s*\(.*\)\s*$/, "").trim() || entete;
  }

  L.Courbe = function (conteneur, feuille) {
    // Construit les choix d'axes, les boutons de modélisation et la zone de tracé.
    this.feuille = feuille;
    this.etat = { x: "A", y: "B", modele: "aucun", n: 0, a: null, b: null };
    const barre = L.html("div", { class: "courbe-barre" }, conteneur);
    this.choix_y = this.selecteur(barre, "Ordonnée", "y");
    L.html("span", { class: "courbe-en-fonction" }, barre, "en fonction de");
    this.choix_x = this.selecteur(barre, "Abscisse", "x");
    L.html("span", { class: "courbe-en-fonction" }, barre, "Modéliser :");
    for (const [modele, texte] of [["lineaire", "y = a·x"], ["affine", "y = a·x + b"]]) {
      const bouton = L.html("button", { type: "button", class: "tablette-bouton" }, barre, texte);
      bouton.addEventListener("click", () => { this.etat.modele = modele; this.dessiner(true); });
    }
    this.equation = L.html("p", { class: "courbe-equation", "aria-live": "polite" }, conteneur);
    this.dessin = L.svg("svg", { viewBox: "0 0 600 290", class: "courbe-dessin", preserveAspectRatio: "xMinYMin meet" }, conteneur);
    L.ecouter("tableur", () => { if (conteneur.offsetParent) this.dessiner(false); });
  };

  const C = L.Courbe.prototype;

  C.selecteur = function (barre, etiquette, axe) {
    // Liste déroulante des colonnes du tableur pour un axe.
    const choix = L.html("select", { "aria-label": etiquette }, barre);
    choix.addEventListener("change", () => { this.etat[axe] = choix.value; this.etat.modele = "aucun"; this.dessiner(true); });
    return choix;
  };

  C.remplir_choix = function () {
    // Met dans les listes les entêtes actuels des colonnes.
    for (const [choix, axe] of [[this.choix_x, "x"], [this.choix_y, "y"]]) {
      choix.replaceChildren();
      for (const lettre of L.Tableur.LETTRES) L.html("option", { value: lettre }, choix, this.feuille().entete(lettre));
      choix.value = this.etat[axe];
    }
  };

  C.modeliser = function (points) {
    // Moindres carrés : droite passant par l'origine (linéaire) ou droite quelconque (affine).
    const n = points.length;
    const sx = points.reduce((s, p) => s + p.x, 0), sy = points.reduce((s, p) => s + p.y, 0);
    const sxx = points.reduce((s, p) => s + p.x * p.x, 0), sxy = points.reduce((s, p) => s + p.x * p.y, 0);
    if (this.etat.modele === "lineaire") return { a: sxx ? sxy / sxx : null, b: 0 };
    const den = n * sxx - sx * sx;
    if (n < 2 || !den) return { a: null, b: null };
    const a = (n * sxy - sx * sy) / den;
    return { a, b: (sy - a * sx) / n };
  };

  C.axes = function (g, max_x, max_y, feuille) {
    // Axes, quadrillage léger, graduations et noms des grandeurs.
    const px = (ZONE.d - ZONE.g) / max_x, py = (ZONE.b - ZONE.h) / max_y;
    for (const [axe, maximum] of [["x", max_x], ["y", max_y]]) {
      const pas = pas_agreable(maximum);
      for (let v = 0; v <= maximum + pas * 0.01; v += pas) {
        const x = ZONE.g + v * px, y = ZONE.b - v * py;
        const ligne = axe === "x" ? { x1: x, y1: ZONE.h, x2: x, y2: ZONE.b } : { x1: ZONE.g, y1: y, x2: ZONE.d, y2: y };
        L.svg("line", { ...ligne, class: "courbe-grille" }, g);
        const etiquette = L.nombre_court(Number(v.toPrecision(6)), 3);
        if (axe === "x") L.texte(g, x, ZONE.b + 14, etiquette, { class: "courbe-graduation" });
        else L.texte(g, ZONE.g - 6, y, etiquette, { class: "courbe-graduation", "text-anchor": "end" });
      }
    }
    L.svg("path", { d: `M${ZONE.g} ${ZONE.h - 8}V${ZONE.b}H${ZONE.d + 8}`, class: "courbe-axe" }, g);
    L.texte(g, ZONE.d + 8, ZONE.b - 10, feuille.entete(this.etat.x), { class: "courbe-nom", "text-anchor": "end" });
    L.texte(g, ZONE.g + 6, ZONE.h - 6, feuille.entete(this.etat.y), { class: "courbe-nom", "text-anchor": "start" });
    return { px, py };
  };

  C.dessiner = function (anime) {
    // Trace les points (un à un si anime) et, si demandé, la droite modèle avec son équation.
    const feuille = this.feuille();
    this.remplir_choix();
    const points = feuille.lignes([this.etat.x, this.etat.y]).map((l) => ({ x: l[this.etat.x], y: l[this.etat.y] }));
    this.dessin.replaceChildren();
    this.equation.textContent = points.length ? "" : "Remplissez d'abord le tableur : les points apparaîtront ici.";
    Object.assign(this.etat, { n: points.length, a: null, b: null });
    if (!points.length) return L.annoncer("courbe", { ...this.etat });
    const max_x = Math.max(...points.map((p) => p.x), 1e-9) * 1.1, max_y = Math.max(...points.map((p) => p.y), 1e-9) * 1.1;
    const { px, py } = this.axes(this.dessin, max_x, max_y, feuille);
    points.forEach((p, i) => {
      const x = ZONE.g + p.x * px, y = ZONE.b - p.y * py;
      const croix = L.svg("path", { d: `M${x - 6} ${y}h12M${x} ${y - 6}v12`, class: "courbe-point" }, this.dessin);
      if (anime) { croix.style.animationDelay = `${i * 0.12}s`; croix.classList.add("apparait"); }
    });
    if (this.etat.modele !== "aucun") this.tracer_modele(points, px, py, feuille, anime);
    L.annoncer("courbe", { ...this.etat });
  };

  C.tracer_modele = function (points, px, py, feuille, anime) {
    // Dessine la droite modèle et écrit son équation (a et b à la française).
    const { a, b } = this.modeliser(points);
    if (a === null) return;
    Object.assign(this.etat, { a, b });
    const x_fin = (ZONE.d - ZONE.g) / px;
    const y = (v) => ZONE.b - (a * v + b) * py;
    const droite = L.svg("line", { x1: ZONE.g, y1: y(0), x2: ZONE.d, y2: y(x_fin), class: "courbe-modele" }, this.dessin);
    if (anime) droite.classList.add("trace");
    const nx = nom_court(feuille.entete(this.etat.x)), ny = nom_court(feuille.entete(this.etat.y));
    const terme_b = this.etat.modele === "affine" ? ` ${b < 0 ? "−" : "+"} ${feuille.ecrire(Math.abs(b))}` : "";
    this.equation.textContent = `Modèle : ${ny} = ${feuille.ecrire(a)} × ${nx}${terme_b}`;
  };
})(window.Labo);

/*
Rôle : paillasses de l'activité « retard et célérité » : (1) le long ressort (ressort_long.js), deux cellules
       photoélectriques et le chronomètre électronique (detecteurs_onde.js) : retard d'une bosse transversale entre A et
       B ; (2) le claquoir, deux microphones sur une règle de 1 m et l'oscilloscope à mémoire (micro_claquoir.js,
       oscilloscope_memoire.js) : retard d'un son entre M1 et M2 ; un thermomètre mural indique 20 °C.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_ressort_retard, Labo.poste_son (groupe) -> { pense_bete } ; faits « ressort », « chrono_ressort »
          (xA, xB en m, dt en s), « son » (x1, x2, d, tau, claps), « oscillo_memoire » (Sv, Sv2, b, enregistre).
Utilisé par : simulation.js.
*/
(function (L) {
  function thermometre(g, x, y) {
    // Thermomètre à alcool mural, gradué de 0 à 40 °C, qui indique 20 °C.
    L.svg("rect", { x: x - 12, y, width: 24, height: 130, rx: 4, fill: "#fbfaf4", stroke: "#b9b19a" }, g);
    L.svg("rect", { x: x - 2, y: y + 10, width: 4, height: 100, rx: 2, fill: "#e8edf0", stroke: "#9aa5ad", "stroke-width": 0.5 }, g);
    L.svg("rect", { x: x - 2, y: y + 60, width: 4, height: 50, fill: "#d32f2f" }, g);
    L.svg("circle", { cx: x, cy: y + 115, r: 5, fill: "#d32f2f" }, g);
    for (let i = 0; i <= 4; i++) { L.svg("line", { x1: x + 3, y1: y + 110 - i * 25, x2: x + 7, y2: y + 110 - i * 25, stroke: "#333", "stroke-width": 0.6 }, g); L.texte(g, x + 10, y + 111 - i * 25, String(i * 10), { "font-size": 5.5, "text-anchor": "start", fill: "#333" }); }
    L.texte(g, x, y + 126, "°C", { "font-size": 6, fill: "#333" });
  }

  L.poste_ressort_retard = function (g) {
    // Cellules et chronomètre derrière le ressort ; le faisceau passe 4,5 cm au-dessus de l'axe (rayon des spires : 3,5 cm).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), fond = L.svg("g", {}, g);
    const r = L.ressort_long(g, { x0: 200, k: 300, y_axe: 430, sol: 520, v: 2, fait: "ressort" });
    L.detecteurs_onde(fond, r.transversal, { x0: 200, k: 300, y_axe: 430, sol: 530, positions: [0.5, 1.5], seuil: 0.045, chrono: { x: 890, y: 440 }, fait: "chrono_ressort" });
    return { pense_bete };
  };

  L.poste_son = function (g) {
    // Oscilloscope à mémoire au fond de la paillasse, règle et micros devant, thermomètre au mur.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    thermometre(g, 290, 70);
    const o = L.oscilloscope_memoire(g, { x: 650, y: 140, Sv: 0.5, Sv2: 0.5, b: 0.5 });
    L.banc_son(g, o, { x0: 300, k: 500, sol: 545, theta: 20, positions: [0.1, 0.5], fait: "son" });
    return { pense_bete };
  };
})(window.Labo);

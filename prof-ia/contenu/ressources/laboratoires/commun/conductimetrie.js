/*
Rôle : physique et appareils de la conductimétrie : conductivités molaires ioniques (valeurs des tables, à 25 °C, en
       mS·m²/mol), solutions (ions et coefficients), conductivité σ = Σ λi·[Xi] (SI) corrigée pour la concentration
       (les ions se gênent : facteur 1 − 0,5·√C) et la température (+ 2,1 % par °C) ; eau distillée σ = 5 × 10⁻⁴ S/m ;
       conductance G = σ·S/L. Appareils sur une étagère murale : GBF (500 Hz, tension efficace réglable), ampèremètre
       (mA~) et voltmètre (V~) numériques, à cristaux liquides.
Reçoit : le nom de la solution, C (mol/L), θ (°C), S (m²), L (m) ; le groupe SVG et les positions des appareils.
Produit : Labo.LAMBDA ; Labo.SOLUTIONS ; Labo.sigma(nom, C, θ) (S/m) ; Labo.conductance({ nom, C, theta, S, L }) (S) ;
          Labo.etagere_appareils(g, { x, y }) -> { bornes { gbf, a, v } (points des câbles), afficher(U, I) }.
Utilisé par : cellule_conductance.js et les simulations de conductimétrie.
*/
(function (L) {
  L.LAMBDA = { "H3O+": 34.98, "HO-": 19.86, "Na+": 5.01, "K+": 7.35, "NH4+": 7.34, "Cl-": 7.63 };
  L.SOLUTIONS = {
    eau: { nom: "eau distillée", ions: {} }, sucre: { nom: "eau sucrée", ions: {} },
    NaCl: { nom: "chlorure de sodium", ions: { "Na+": 1, "Cl-": 1 } }, KCl: { nom: "chlorure de potassium", ions: { "K+": 1, "Cl-": 1 } },
    NaOH: { nom: "hydroxyde de sodium", ions: { "Na+": 1, "HO-": 1 } }, KOH: { nom: "hydroxyde de potassium", ions: { "K+": 1, "HO-": 1 } },
    HCl: { nom: "acide chlorhydrique", ions: { "H3O+": 1, "Cl-": 1 } }, NH4Cl: { nom: "chlorure d'ammonium", ions: { "NH4+": 1, "Cl-": 1 } },
  };

  L.sigma = function (nom, C, theta = 25) {
    // σ (S/m) = Σ λ (S·m²/mol) × [X] (mol/m³), corrigée ; plus la faible conductivité de l'eau.
    const s = Object.entries(L.SOLUTIONS[nom].ions).reduce((t, [ion, nu]) => t + L.LAMBDA[ion] * 1e-3 * nu * C * 1000, 0);
    return (s * (1 - 0.5 * Math.sqrt(C)) + 5e-4) * (1 + 0.021 * (theta - 25));
  };
  L.conductance = ({ nom, C, theta = 25, S, L: l }) => (l > 0 && S > 0 ? (L.sigma(nom, C, theta) * S) / l : 0);

  function boitier(g, x, y, titre, couleur) {
    // Appareil de 100 × 80 posé sur l'étagère : boîtier, écran, légende, deux bornes ; renvoie le groupe de l'écran.
    L.svg("rect", { x: x + 3, y: y + 3, width: 100, height: 80, rx: 6, fill: "#1b1e21" }, g);
    L.svg("rect", { x, y, width: 100, height: 80, rx: 6, fill: couleur, stroke: "#111" }, g);
    L.svg("rect", { x: x + 8, y: y + 8, width: 84, height: 26, rx: 3, fill: "#1d2a22", stroke: "#000" }, g);
    L.texte(g, x + 50, y + 46, titre, { "font-size": 7.5, "font-weight": 700, fill: "#e8e2cc" });
    for (const [dx, c] of [[30, "#c62828"], [70, "#111"]]) L.svg("circle", { cx: x + dx, cy: y + 66, r: 6, fill: c, stroke: "#000" }, g);
    return L.svg("g", {}, g);
  }

  L.etagere_appareils = function (g, { x, y }) {
    // Étagère murale (planche, équerres) ; GBF, ampèremètre (mA~), voltmètre (V~) ; écrans mis à jour par afficher(U, I).
    L.svg("rect", { x: x - 10, y: y + 80, width: 360, height: 9, fill: "url(#bois)", stroke: "#6d4a26" }, g);
    for (const dx of [20, 320]) L.svg("path", { d: `M${x + dx} ${y + 89} v22 l-12 -22 Z`, fill: "#8d918a" }, g);
    const e = [boitier(g, x, y, "GBF 500 Hz", "#2f3a45"), boitier(g, x + 120, y, "AMPÈREMÈTRE mA~", "#c9a227"), boitier(g, x + 240, y, "VOLTMÈTRE V~", "#c9a227")];
    const ecrire = (k, t) => { e[k].replaceChildren(); L.texte(e[k], x + 120 * k + 50, y + 26, t, { "font-size": 13, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" }); };
    const b = (k) => [{ x: x + 120 * k + 30, y: y + 66 }, { x: x + 120 * k + 70, y: y + 66 }];
    return {
      bornes: { gbf: b(0), a: b(1), v: b(2) },
      afficher: (U, I) => { const bruit = 1 + (Math.random() - 0.5) * 0.002; ecrire(0, `${U.toFixed(2).replace(".", ",")} V`); ecrire(1, (I * 1000 * bruit).toFixed(3).replace(".", ",")); ecrire(2, (U * bruit).toFixed(3).replace(".", ",")); },
    };
  };
})(window.Labo);

/*
Rôle : affiche murale « Données à 20 °C » : températures de fusion et d'ébullition, densité, miscibilité avec l'eau,
       solubilité du diiode et dangers, pour l'eau, l'éthanol, le cyclohexane, le dichlorométhane et le diiode.
Reçoit : le groupe SVG et le coin haut gauche { x, y }.
Produit : Labo.affiche_solvants(g, x, y) ; Labo.SOLVANTS (les données, pour les questions).
Utilisé par : poste_solvant.js, simulation.js.
*/
(function (L) {
  const COLONNES = ["Espèce", "θ fusion (°C)", "θ ébullition (°C)", "Densité", "Miscible à l'eau", "Diiode y est", "Dangers"];
  const LIGNES = [
    ["eau", "0", "100", "1,00", "—", "peu soluble", "—"],
    ["éthanol", "−114", "78", "0,79", "oui", "très soluble", "inflammable"],
    ["cyclohexane", "6,5", "81", "0,78", "non", "très soluble", "inflammable, nocif"],
    ["dichlorométhane", "−97", "40", "1,33", "non", "très soluble", "nocif, cancérogène suspecté"],
    ["diiode", "114", "184", "4,9", "—", "—", "nocif"],
  ];
  const LARGEURS = [70, 54, 62, 44, 62, 62, 126];
  L.SOLVANTS = { COLONNES, LIGNES };

  L.affiche_solvants = function (g, x, y) {
    // Tableau imprimé, lignes alternées.
    const a = L.svg("g", { class: "affiche-solvants" }, g), l = LARGEURS.reduce((s, v) => s + v, 0) + 16, h = 30 + 18 * (LIGNES.length + 1);
    L.svg("rect", { x: x + 3, y: y + 4, width: l, height: h, fill: "#000", opacity: 0.15, filter: "url(#flou)" }, a);
    L.svg("rect", { x, y, width: l, height: h, fill: "#fdfdf8", stroke: "#c9c4b0" }, a);
    L.texte(a, x + l / 2, y + 13, "Données à 20 °C, sous la pression atmosphérique", { "font-size": 9, "font-weight": 700, fill: "#23315a" });
    [COLONNES, ...LIGNES].forEach((ligne, i) => {
      const yy = y + 26 + i * 18;
      if (i % 2 === 0) L.svg("rect", { x: x + 8, y: yy, width: l - 16, height: 18, fill: i ? "#eef3f7" : "#dbe6f0" }, a);
      let xx = x + 8;
      ligne.forEach((t, j) => { L.texte(a, xx + LARGEURS[j] / 2, yy + 9.5, t, { "font-size": i ? 6.8 : 6.2, "font-weight": i && j ? 400 : 700, fill: "#222" }); xx += LARGEURS[j]; });
    });
    return a;
  };
})(window.Labo);

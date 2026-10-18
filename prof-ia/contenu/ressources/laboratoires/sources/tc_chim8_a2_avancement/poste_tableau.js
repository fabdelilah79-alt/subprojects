/*
Rôle : paillasse « tableau d'avancement » : tableau blanc avec le modèle du tableau d'avancement de la réaction
       CH₃COOH + HCO₃⁻ → CH₃COO⁻ + CO₂ + H₂O (état initial, en cours, final) et le rappel des essais réalisés sur la
       paillasse précédente (masse, volume de gaz), tenu à jour. Le tableau se remplit au tableur de la tablette.
Reçoit : le groupe SVG de la paillasse (lit Labo.ESSAIS_AVANCEMENT).
Produit : Labo.poste_tableau_avancement(groupe) -> { pense_bete }.
Utilisé par : simulation.js.
*/
(function (L) {
  const COL = [330, 440, 560, 680, 800, 910], LIGNES = [["État", "Avancement", "n(CH₃COOH)", "n(HCO₃⁻)", "n(CH₃COO⁻)", "n(CO₂)"], ["initial", "0", "n₁", "n₂", "0", "0"], ["en cours", "x", "n₁ − x", "n₂ − x", "x", "x"], ["final", "xmax", "n₁ − xmax", "n₂ − xmax", "xmax", "xmax"]];

  function modele(g) {
    // Tableau blanc, équation, grille du tableau d'avancement.
    L.svg("rect", { x: 266, y: 30, width: 740, height: 300, rx: 3, fill: "url(#metal-h)", filter: "url(#ombre)" }, g);
    L.svg("rect", { x: 272, y: 36, width: 728, height: 288, fill: "#fbfcfd" }, g);
    L.texte(g, 636, 58, "Tableau d'avancement (quantités en mmol)", { "font-size": 13, "font-weight": 700, fill: "#23315a" });
    L.texte(g, 636, 86, "CH₃COOH  +  HCO₃⁻   ⟶   CH₃COO⁻  +  CO₂  +  H₂O", { "font-size": 15, "font-weight": 700, fill: "#1f2a44" });
    LIGNES.forEach((l, i) => {
      const y = 116 + i * 34;
      L.svg("rect", { x: 282, y: y - 17, width: 708, height: 34, fill: i ? "#ffffff" : "#eef2f5", stroke: "#b9c4cc" }, g);
      l.forEach((t, j) => L.texte(g, COL[j] + 20, y + 4, t, { "font-size": i ? 11 : 10, "font-weight": i ? 400 : 700, fill: "#1f2a44" }));
    });
    L.texte(g, 636, 270, "n₁ : acide éthanoïque (10,0 mL à 0,50 mol/L) ; n₂ = m / M, avec M(NaHCO₃) = 84 g/mol.", { "font-size": 9.5, fill: "#33414b" });
    L.texte(g, 636, 288, "xmax est la plus petite des valeurs de x qui annulent une quantité de réactif.", { "font-size": 9.5, fill: "#33414b" });
  }

  L.poste_tableau_avancement = function (g) {
    // Modèle du tableau et rappel des essais (mis à jour chaque seconde).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    modele(g);
    const essais = L.svg("g", { "pointer-events": "none" }, g);
    const maj = () => {
      essais.replaceChildren();
      L.svg("rect", { x: 300, y: 350, width: 670, height: 40, rx: 4, fill: "#fdfdf8", stroke: "#c9c4b0" }, essais);
      const t = L.ESSAIS_AVANCEMENT.map((x, k) => `essai ${k + 1} : m = ${x.m.toFixed(2).replace(".", ",")} g, V = ${Math.round(x.V)} mL`).join("   ·   ");
      L.texte(essais, 635, 374, t || "Aucun essai réalisé pour l'instant (paillasse 1).", { "font-size": 9.5, fill: "#222" });
    };
    maj(); setInterval(maj, 1000);
    return { pense_bete };
  };
})(window.Labo);

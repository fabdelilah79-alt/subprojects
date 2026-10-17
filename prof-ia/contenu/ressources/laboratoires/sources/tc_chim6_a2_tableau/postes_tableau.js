/*
Rôle : les deux paillasses de l'activité « utiliser la classification » : (1) tableau périodique magnétique à remplir
       (périodes 1 à 3, colonnes 1, 2, 13 à 18) avec 18 cartes portant le symbole, Z et la formule électronique ;
       (2) tableau de Lewis avec les éléments H, C, Si, N, P, O, S, Cl, pour écrire des formules à partir de la position
       des éléments dans la classification.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_tableau(groupe), Labo.poste_formules(groupe) -> { pense_bete } ; faits « periodique » (cartes rangées) et
          « lewis » ; Labo.CARTES_PERIODIQUE (case attendue de chaque carte).
Utilisé par : simulation.js.
*/
(function (L) {
  const SYMBOLES = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar"];
  const EXP = "⁰¹²³⁴⁵⁶⁷⁸", ORDRE = [12, 4, 17, 0, 9, 14, 2, 7, 15, 1, 10, 5, 13, 3, 16, 8, 11, 6];

  function formule(Z) {
    // Formule électronique (K)ᵃ(L)ᵇ(M)ᶜ d'un atome (Z ≤ 18).
    const K = Math.min(2, Z), Lc = Math.min(8, Z - K), M = Z - K - Lc;
    return `(K)${EXP[K]}` + (Lc ? `(L)${EXP[Lc]}` : "") + (M ? `(M)${EXP[M]}` : "");
  }

  function case_de(Z) {
    // Ligne (période) et colonne attendues : H en colonne 1, He en colonne 18, puis 8 colonnes par période.
    if (Z <= 2) return `0,${Z === 1 ? 0 : 7}`;
    const n = Z <= 10 ? Z - 2 : Z - 10;
    return `${Z <= 10 ? 1 : 2},${n - 1}`;
  }
  L.CARTES_PERIODIQUE = Object.fromEntries(SYMBOLES.map((s, i) => [s, case_de(i + 1)]));

  L.poste_tableau = function (g) {
    // Paillasse 1 : tableau périodique à remplir.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 200);
    const cartes = ORDRE.map((i) => ({ id: SYMBOLES[i], textes: [SYMBOLES[i], `Z = ${i + 1}`, formule(i + 1)] }));
    L.tableau_cartes(g, { titre: "Classification périodique (Z ≤ 18)", colonnes: ["1", "2", "13", "14", "15", "16", "17", "18"], lignes: ["1", "2", "3"], cartes, fait: "periodique", case: { l: 60, h: 58 } });
    return { pense_bete };
  };

  L.poste_formules = function (g) {
    // Paillasse 2 : tableau de Lewis avec les éléments des colonnes 14 à 17.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 200);
    L.tableau_lewis(g, "lewis", ["H", "C", "Si", "N", "P", "O", "S", "Cl"]);
    return { pense_bete };
  };
})(window.Labo);

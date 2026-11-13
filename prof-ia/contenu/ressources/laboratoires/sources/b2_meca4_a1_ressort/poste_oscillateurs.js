/*
Rôle : paillasse « des oscillateurs mécaniques » : tableau blanc magnétique où l'on range des systèmes (étiquettes) en
       oscillateurs mécaniques et autres mouvements, sans équation (comme le demandent les orientations).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_oscillateurs(g) -> { pense_bete } ; fait « tri_oscillateurs » = { id: colonne }.
Utilisé par : simulation.js (paillasse 1).
*/
(function (L) {
  const SYSTEMES = [
    ["simple", ["Pendule simple", "(bille et fil)"], 0], ["pesant", ["Balancier", "d'horloge"], 0], ["torsion", ["Pendule", "de torsion"], 0],
    ["ressort", ["Solide accroché", "à un ressort"], 0], ["balancoire", ["Balançoire", "qu'on lâche"], 0], ["lame", ["Lame de scie", "qui vibre"], 0],
    ["chute", ["Bille qui", "tombe"], 1], ["roue", ["Roue qui", "tourne"], 1], ["chariot", ["Chariot lancé", "sur un rail"], 1],
  ];
  L.SYSTEMES_OSCILLANTS = SYSTEMES;

  L.poste_oscillateurs = function (g) {
    // Pense-bête et tableau de tri sur le mur.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 300, y: 30, largeur: 560, hauteur: 370, titre: "Ces systèmes sont-ils des oscillateurs mécaniques ?", colonnes: [["Oscillateur", "mécanique"], ["Pas un", "oscillateur"]], etiquettes: SYSTEMES.map(([id, texte, colonne]) => ({ id, texte, colonne })), fait: "tri_oscillateurs", par_ligne: 5 });
    return { pense_bete };
  };
})(window.Labo);

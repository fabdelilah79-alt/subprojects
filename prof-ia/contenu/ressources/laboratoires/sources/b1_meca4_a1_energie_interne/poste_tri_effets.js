/*
Rôle : paillasse du tableau magnétique : situations du vécu où un système reçoit du travail, à classer selon l'effet
       produit : élévation de température, déformation élastique, changement d'état physique, transformation chimique.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_tri_effets(g) -> { pense_bete } ; Labo.EFFETS_TRAVAIL (étiquettes et bonne colonne) ;
          fait « tri_effets » = { id: colonne }.
Utilisé par : simulation.js (paillasse 2).
*/
(function (L) {
  const E = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });

  L.EFFETS_TRAVAIL = [
    E("mains", "On frotte", "ses mains", 0), E("pompe", "On gonfle un pneu :", "la pompe chauffe", 0), E("frein", "Un vélo freine :", "les patins chauffent", 0),
    E("ressort", "On comprime", "un ressort", 1), E("arc", "On tend", "un arc", 1),
    E("glacons", "On frotte deux", "glaçons : ils fondent", 2), E("patin", "Un patineur glisse :", "la glace fond", 2),
    E("allumette", "On frotte", "une allumette", 3), E("briquet", "On frotte la pierre", "d'un briquet", 3),
  ];

  L.poste_tri_effets = function (g) {
    // Tableau à quatre colonnes ; les étiquettes sont mélangées dans la réserve.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ordre = [5, 0, 7, 3, 8, 1, 6, 4, 2];
    L.tableau_tri(g, { x: 270, y: 30, largeur: 600, hauteur: 360, titre: "Le travail reçu par le système produit…", colonnes: [["une élévation", "de température"], ["une déformation", "élastique"], ["un changement", "d'état physique"], ["une transformation", "chimique"]], etiquettes: ordre.map((k) => L.EFFETS_TRAVAIL[k]), fait: "tri_effets", par_ligne: 6 });
    return { pense_bete };
  };
})(window.Labo);

/*
Rôle : paillasse du tableau magnétique : neuf situations du vécu à classer selon le travail de la force citée :
       moteur (la force favorise le déplacement), résistant (elle s'y oppose) ou nul (force perpendiculaire au
       déplacement, ou point d'application immobile).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_tri_travail(g) -> { pense_bete } ; Labo.SITUATIONS_TRAVAIL (étiquettes et bonne colonne) ;
          fait « tri_travail » = { id: colonne }.
Utilisé par : simulation.js (paillasse 2).
*/
(function (L) {
  const E = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });

  L.SITUATIONS_TRAVAIL = [
    E("pomme", "Poids d'une pomme", "qui tombe", 0), E("pousser", "Main qui pousse", "un chariot qui avance", 0), E("remorqueur", "Câble qui tire", "un bateau qui avance", 0),
    E("sac", "Poids d'un sac", "que l'on monte", 1), E("freinage", "Frottement de la route", "(voiture qui freine)", 1), E("parachute", "Action de l'air", "sur un parachutiste", 1),
    E("valise", "Réaction normale", "(valise traînée)", 2), E("route", "Poids d'une voiture", "sur route horizontale", 2), E("porteur", "Main qui tient une", "valise immobile", 2),
  ];

  L.poste_tri_travail = function (g) {
    // Tableau magnétique à trois colonnes ; les étiquettes sont mélangées dans la réserve.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ordre = [3, 6, 0, 8, 4, 1, 7, 5, 2];
    L.tableau_tri(g, { x: 270, y: 30, largeur: 600, hauteur: 360, titre: "Le travail de la force est…", colonnes: ["moteur", "résistant", "nul"], etiquettes: ordre.map((k) => L.SITUATIONS_TRAVAIL[k]), fait: "tri_travail", par_ligne: 6 });
    return { pense_bete };
  };
})(window.Labo);

/*
Rôle : paillasse du tableau magnétique : situations et documents à classer selon le mode de transfert thermique principal :
       conduction (de proche en proche dans un solide), convection (déplacement d'un fluide), rayonnement (sans contact,
       même à travers le vide).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_tri_transferts(g) -> { pense_bete } ; Labo.TRANSFERTS (étiquettes et bonne colonne) ;
          fait « tri_transferts » = { id: colonne }.
Utilisé par : simulation.js (paillasse 2).
*/
(function (L) {
  const E = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });

  L.TRANSFERTS = [
    E("cuillere", "La cuillère dans le", "thé chaud s'échauffe", 0), E("casserole", "Le manche d'une", "casserole chauffe", 0), E("fer", "Une barre de fer tenue", "dans une flamme", 0),
    E("radiateur", "L'air chaud monte", "au-dessus du radiateur", 1), E("eau", "L'eau d'une casserole", "chauffée par le fond", 1),
    E("soleil", "Le Soleil chauffe", "la Terre", 2), E("feu", "On se chauffe à", "distance d'un feu", 2), E("lampe", "La lampe chauffe", "la plaque noire", 2),
  ];

  L.poste_tri_transferts = function (g) {
    // Tableau à trois colonnes ; les étiquettes sont mélangées dans la réserve.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ordre = [5, 0, 3, 7, 1, 6, 4, 2];
    L.tableau_tri(g, { x: 270, y: 30, largeur: 600, hauteur: 360, titre: "Mode de transfert thermique principal", colonnes: ["conduction", "convection", "rayonnement"], etiquettes: ordre.map((k) => L.TRANSFERTS[k]), fait: "tri_transferts", par_ligne: 6 });
    return { pense_bete };
  };
})(window.Labo);

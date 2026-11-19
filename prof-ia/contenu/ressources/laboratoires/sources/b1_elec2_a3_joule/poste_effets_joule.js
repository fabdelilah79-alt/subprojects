/*
Rôle : tableau magnétique « effet Joule utile ou nuisible » : étiquettes d'appareils et de situations de la vie courante.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_effets_joule(g) -> { pense_bete } ; Labo.EFFETS_JOULE ; fait « tri_joule ».
Utilisé par : simulation.js.
*/
(function (L) {
  const E = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  L.EFFETS_JOULE = [
    E("radiateur", "Radiateur", "électrique", 0), E("bouilloire", "Bouilloire", "électrique", 0),
    E("fusible", "Fusible", "(il fond)", 0), E("grille", "Grille-pain", "", 0),
    E("lignes", "Lignes à", "haute tension", 1), E("moteur", "Moteur", "qui chauffe", 1),
    E("processeur", "Processeur", "d'ordinateur", 1), E("chargeur", "Chargeur", "qui chauffe", 1),
  ];

  L.poste_effets_joule = function (g) {
    // Décor de paillasse ordinaire et tableau magnétique à deux colonnes.
    L.decor.paillasse(g, 1);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ordre = [4, 0, 6, 2, 5, 1, 7, 3];
    L.tableau_tri(g, { x: 270, y: 30, largeur: 600, hauteur: 360, titre: "Effet Joule", colonnes: [["utile", "(effet recherché)"], ["nuisible", "(énergie perdue)"]], etiquettes: ordre.map((i) => L.EFFETS_JOULE[i]), fait: "tri_joule", par_ligne: 6 });
    return { pense_bete };
  };
})(window.Labo);

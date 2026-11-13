/*
Rôle : paillasse « sources et objets diffusants » : tableau magnétique où l'on classe des objets selon qu'ils produisent
       leur propre lumière (sources primaires) ou renvoient la lumière qu'ils reçoivent (objets diffusants).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_sources(g) -> { pense_bete } ; Labo.SOURCES_LUMIERE ; fait « tri_sources ».
Utilisé par : simulation.js.
*/
(function (L) {
  const E = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  L.SOURCES_LUMIERE = [
    E("soleil", "Soleil", "", 0), E("lampe", "Lampe", "allumée", 0), E("bougie", "Flamme", "de bougie", 0), E("telephone", "Écran de", "téléphone allumé", 0),
    E("lune", "Lune", "", 1), E("livre", "Livre", "", 1), E("mur", "Mur", "blanc", 1), E("eteinte", "Lampe", "éteinte", 1),
  ];

  L.poste_sources = function (g) {
    // Décor ordinaire et tableau magnétique à deux colonnes.
    L.decor.paillasse(g, 3);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ordre = [4, 0, 6, 2, 5, 1, 7, 3];
    L.tableau_tri(g, { x: 270, y: 30, largeur: 600, hauteur: 360, titre: "D'où vient la lumière qui arrive à l'œil ?", colonnes: [["source primaire", "(produit sa lumière)"], ["objet diffusant", "(renvoie la lumière reçue)"]], etiquettes: ordre.map((i) => L.SOURCES_LUMIERE[i]), fait: "tri_sources", par_ligne: 6 });
    return { pense_bete };
  };
})(window.Labo);

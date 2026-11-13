/*
Rôle : paillasse « bille d'acier » : plateau horizontal, gouttière de lancement, aimant et cale en bois rangés à droite,
       photographie à pose multiple du mouvement de la bille.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_bille(groupe) -> { pense_bete, bille, aimant, cale }.
Utilisé par : simulation.js.
*/
(function (L) {
  L.poste_bille = function (g) {
    // Construit la paillasse : plateau, objets rangés, bille en haut de la gouttière.
    L.Plateau.dessiner(g);
    L.texte(g, 560, 314, "Photographie à pose multiple : une image de la bille toutes les 0,06 s", { class: "etiquette-carton", "font-size": 14, fill: "#3b2a05" });
    const objets = L.svg("g", {}, g);
    const aimant = new L.ObjetPlateau(objets, "aimant", { x: 790, y: 70 });
    const cale = new L.ObjetPlateau(objets, "cale", { x: 795, y: 250 });
    const bille = new L.Bille(g, aimant, cale);
    const pense_bete = L.decor.pense_bete(g, 24, 40, 230);
    return { pense_bete, bille, aimant, cale };
  };
})(window.Labo);

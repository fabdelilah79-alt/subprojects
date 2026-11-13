/*
Rôle : paillasses de l'activité « diffraction et dispersion » : (1) cuve à ondes et son écran de projection (cuve_ondes.js) ;
       (2) banc de diffraction des ultrasons (banc_ultrasons.js) ; (3) quatre documents (la houle et le port, le son
       derrière une porte, la lumière, des ondes de toutes tailles) et un tableau magnétique : diffraction marquée ou
       peu marquée selon la taille de l'ouverture comparée à la longueur d'onde.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_cuve_ondes, Labo.poste_ultrasons, Labo.poste_documents_diffraction (groupe) -> { pense_bete } ; faits
          « cuve », « ultrasons », « docs_diffraction », « tri_diffraction » ; Labo.TRI_DIFFRACTION (étiquettes attendues).
Utilisé par : simulation.js.
*/
(function (L) {
  const doc = (k, titre, texte) => ({ x: 262 + k * 186, y: 40, l: 178, h: 190, taille: 4, titre, texte });
  const DOCS = [
    doc(0, "La houle entre dans le port", "La houle du large est une onde plane de longueur d'onde 50 à 100 m. Quand elle passe par l'entrée d'un port, large de quelques dizaines de mètres, elle s'étale derrière la passe en vagues circulaires centrées sur l'entrée : c'est la diffraction. Les ingénieurs en tiennent compte pour placer les digues et protéger les bateaux amarrés."),
    doc(1, "Le son passe par la porte", "On entend une personne qui parle dans le couloir, même sans la voir. La voix contient des sons de longueur d'onde comprise entre quelques centimètres et quelques mètres, du même ordre que la largeur d'une porte (90 cm) : le son est diffracté par l'ouverture et se répand dans toute la pièce. Les sons graves (grande longueur d'onde) contournent mieux les obstacles que les sons aigus."),
    doc(2, "Et la lumière ?", "La longueur d'onde de la lumière visible est très petite : 0,4 à 0,8 µm. Par une porte ou une fenêtre, la lumière se propage en ligne droite : on ne voit pas la personne du couloir. La diffraction de la lumière n'est visible qu'avec une ouverture très fine, de quelques dixièmes de millimètre ou moins (fente, trou d'aiguille)."),
    doc(3, "Des ondes de toutes tailles", "Longueurs d'onde : houle 50 à 300 m ; ondes radio « grandes ondes » environ 1 km ; son audible 1,7 cm à 17 m ; ultrasons de 40 kHz dans l'air 8,5 mm ; rides d'une cuve à ondes environ 1 cm ; lumière visible environ 0,5 µm. Le phénomène de diffraction est d'autant plus marqué que la largeur de l'ouverture ou de l'obstacle est proche de la longueur d'onde, ou plus petite."),
  ];
  const e = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  const SITUATIONS = [
    e("port", "houle (λ = 60 m)", "passe de 40 m", 0), e("porte_son", "voix (λ = 1 m)", "porte de 90 cm", 0), e("us_1", "ultrasons (8,5 mm)", "fente de 1 cm", 0), e("lumiere_fine", "lumière (0,6 µm)", "fente de 0,05 mm", 0),
    e("porte_lum", "lumière (0,6 µm)", "porte de 90 cm", 1), e("us_10", "ultrasons (8,5 mm)", "fente de 10 cm", 1), e("cuve_large", "rides (1 cm)", "fente de 15 cm", 1), e("tunnel", "lumière (0,6 µm)", "tunnel de 5 m", 1),
  ];

  L.poste_cuve_ondes = function (g) {
    // Pense-bête et cuve à ondes.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.cuve_ondes(g, { x: 290, y: 130, fait: "cuve" });
    return { pense_bete };
  };

  L.poste_ultrasons = function (g) {
    // Pense-bête et banc des ultrasons.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.banc_ultrasons(g, { x: 420, y: 495, fait: "ultrasons" });
    return { pense_bete };
  };

  L.poste_documents_diffraction = function (g) {
    // Pense-bête, documents, tableau de tri.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 262, y: 262, largeur: 540, hauteur: 300, titre: "La diffraction est-elle marquée ?", colonnes: [["Diffraction marquée", "(ouverture ≈ λ ou plus petite)"], ["Peu marquée", "(ouverture ≫ λ)"]], etiquettes: SITUATIONS, fait: "tri_diffraction", par_ligne: 5 });
    L.documents_mur(g, DOCS, "docs_diffraction");
    return { pense_bete };
  };
  L.TRI_DIFFRACTION = SITUATIONS;
})(window.Labo);

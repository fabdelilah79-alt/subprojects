/*
Rôle : paillasse « applications et dangers » : quatre documents au mur (la centrale nucléaire, le Soleil et ITER, la
       médecine nucléaire, dangers et déchets) et un tableau magnétique où l'on range neuf applications selon la
       transformation nucléaire utilisée (fission, fusion, désintégration radioactive).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_applications(g) -> { pense_bete } ; faits « docs_applications » (numéros lus), « tri_applications »
          (étiquette : colonne) ; Labo.TRI_APPLICATIONS.
Utilisé par : simulation.js.
*/
(function (L) {
  const doc = (k, titre, texte) => ({ x: 262 + k * 148, y: 40, l: 140, h: 190, taille: 4, titre, texte });
  const DOCS = [
    doc(0, "La centrale nucléaire", "Dans le cœur d'un réacteur, un neutron lent provoque la fission d'un noyau d'uranium 235 en deux noyaux plus légers, avec deux ou trois neutrons qui peuvent provoquer d'autres fissions : c'est une réaction en chaîne, contrôlée par des barres qui absorbent les neutrons. L'énergie libérée chauffe de l'eau ; la vapeur fait tourner une turbine et un alternateur. Un gramme d'uranium 235 libère autant d'énergie que plusieurs tonnes de pétrole."),
    doc(1, "Le Soleil et ITER", "Au cœur du Soleil, à 15 millions de degrés, des noyaux d'hydrogène fusionnent pour former de l'hélium : le Soleil perd environ 4 millions de tonnes de masse par seconde, transformées en énergie rayonnée. Sur Terre, le réacteur expérimental ITER (Cadarache, France) cherche à maîtriser la fusion du deutérium et du tritium (²₁H + ³₁H → ⁴₂He + ¹₀n). La bombe H utilise une fusion non contrôlée."),
    doc(2, "La médecine nucléaire", "Scintigraphie et TEP : on injecte un radioélément de courte demi-vie (fluor 18, émetteur β+, 110 min ; technétium 99m) qui se fixe sur un organe ou une tumeur ; une caméra détecte le rayonnement et donne une image du fonctionnement de l'organe. Radiothérapie : le rayonnement γ du cobalt 60, ou un faisceau d'un accélérateur, détruit les cellules cancéreuses. L'iode 131 soigne certaines maladies de la thyroïde."),
    doc(3, "Dangers et déchets", "Les rayonnements ionisants abîment les cellules : brûlures et maladies en cas de forte dose, risque accru de cancer à faible dose. Irradiation : exposition à une source extérieure ; contamination : substance radioactive avalée, respirée ou déposée sur la peau. Accidents de Tchernobyl (1986) et de Fukushima (2011). Les déchets des centrales restent radioactifs des milliers d'années : on les vitrifie et on les stocke dans des sites profonds et surveillés."),
  ];
  const e = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  const APPLICATIONS = [
    e("centrale", "Centrale", "nucléaire", 0), e("bombeA", "Bombe A", "(uranium, plutonium)", 0), e("sousmarin", "Sous-marin", "à propulsion nucléaire", 0),
    e("soleil", "Énergie", "du Soleil", 1), e("iter", "Réacteur ITER", "(deutérium, tritium)", 1), e("bombeH", "Bombe H", "", 1),
    e("tep", "Imagerie TEP", "au fluor 18", 2), e("cobalt", "Radiothérapie", "au cobalt 60", 2), e("datation", "Datation", "au carbone 14", 2),
  ];
  L.TRI_APPLICATIONS = APPLICATIONS;

  L.poste_applications = function (g) {
    // Pense-bête, documents, tableau de tri.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 232, y: 262, largeur: 600, hauteur: 300, titre: "Quelle transformation nucléaire ?", colonnes: ["Fission", "Fusion", ["Désintégration", "radioactive"]], etiquettes: APPLICATIONS, fait: "tri_applications", par_ligne: 3 });
    L.documents_mur(g, DOCS, "docs_applications");
    return { pense_bete };
  };
})(window.Labo);

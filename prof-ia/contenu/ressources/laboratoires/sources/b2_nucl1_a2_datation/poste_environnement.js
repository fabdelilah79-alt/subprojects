/*
Rôle : paillasse « la radioactivité autour de nous » : quatre documents au mur (radioactivité naturelle et artificielle,
       le carbone 14, effets biologiques, dater des roches) et un tableau magnétique où l'on range huit objets à dater
       selon le radioélément adapté (carbone 14, potassium 40, uranium 238, tritium).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_environnement(g) -> { pense_bete } ; faits « docs_radio » (numéros lus), « tri_datation » (étiquette :
          colonne) ; Labo.TRI_DATATION (étiquettes et colonnes attendues).
Utilisé par : simulation.js.
*/
(function (L) {
  const doc = (k, titre, texte) => ({ x: 262 + k * 148, y: 40, l: 140, h: 190, taille: 4, titre, texte });
  const DOCS = [
    doc(0, "La radioactivité autour de nous", "Nous vivons dans un bain de radioactivité naturelle : le radon, gaz radioactif qui sort des roches granitiques ; le potassium 40 et l'uranium des roches et des sols ; les rayons cosmiques venus de l'espace. Notre propre corps contient du potassium 40 et du carbone 14 : environ 8 000 désintégrations par seconde (8 000 Bq) pour un adulte. S'y ajoute la radioactivité artificielle : examens médicaux (radiographie, scintigraphie), centrales nucléaires."),
    doc(1, "Le carbone 14", "Le carbone 14 se forme sans cesse dans la haute atmosphère, sous l'effet des rayons cosmiques ; il est radioactif β− (demi-vie 5 730 ans). Un être vivant échange du carbone avec l'atmosphère (respiration, photosynthèse, alimentation) : la proportion de carbone 14 dans son carbone reste constante, avec une activité d'environ 0,23 Bq par gramme de carbone. Après sa mort, les échanges cessent : le carbone 14 n'est plus renouvelé et son activité diminue selon la loi de décroissance."),
    doc(2, "Effets biologiques", "Les rayonnements α, β et γ déposent de l'énergie dans les cellules qu'ils traversent et peuvent abîmer l'ADN. L'effet dépend de l'activité de la source, de la durée d'exposition, de la nature du rayonnement (α est très dangereux s'il est inhalé ou avalé) et de l'énergie déposée par kilogramme du corps. La dose efficace se mesure en sieverts (Sv) ; la radioactivité naturelle donne environ 2,4 mSv par an. Protection : distance, durée courte, écran."),
    doc(3, "Dater des roches", "Pour dater, on choisit un radioélément dont la demi-vie est du même ordre de grandeur que l'âge cherché : au bout d'une dizaine de demi-vies, il ne reste presque plus de noyaux et la mesure devient impossible ; si la demi-vie est trop longue, l'activité ne change presque pas. Carbone 14 (5 730 ans) : jusqu'à environ 50 000 ans. Potassium 40 (1,3 milliard d'années) : roches volcaniques. Uranium 238 (4,5 milliards d'années) : les roches les plus anciennes, les météorites. Tritium (12,3 ans) : eaux, vins."),
  ];
  const e = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  const OBJETS = [
    e("mammouth", "Os de mammouth", "(≈ 20 000 ans)", 0), e("foyer", "Charbon d'un foyer", "préhistorique", 0),
    e("lave", "Coulée de lave", "(≈ 2 millions d'années)", 1), e("basalte", "Basalte volcanique", "(≈ 100 millions d'années)", 1),
    e("meteorite", "Météorite", "(≈ 4,5 milliards d'années)", 2), e("gneiss", "Roche terrestre", "(≈ 4 milliards d'années)", 2),
    e("vin", "Vin millésimé", "(≈ 20 ans)", 3), e("nappe", "Eau d'une nappe", "(quelques dizaines d'années)", 3),
  ];
  L.TRI_DATATION = OBJETS;

  L.poste_environnement = function (g) {
    // Pense-bête, documents, tableau de tri.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 232, y: 262, largeur: 600, hauteur: 300, titre: "Quel radioélément pour dater ?", colonnes: [["Carbone 14", "t½ = 5 730 ans"], ["Potassium 40", "t½ = 1,3 × 10⁹ ans"], ["Uranium 238", "t½ = 4,5 × 10⁹ ans"], ["Tritium ³H", "t½ = 12,3 ans"]], etiquettes: OBJETS, fait: "tri_datation", par_ligne: 4 });
    L.documents_mur(g, DOCS, "docs_radio");
    return { pense_bete };
  };
})(window.Labo);

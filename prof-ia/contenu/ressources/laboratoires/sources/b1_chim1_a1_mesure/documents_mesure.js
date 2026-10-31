/*
Rôle : paillasse « pourquoi mesurer ? » : cinq documents au mur (santé et analyses biologiques, environnement,
       agroalimentaire, sécurité, techniques de mesure) et un tableau magnétique où l'on range huit exemples de mesures
       par domaine de la vie courante.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_documents_mesure(g) -> { pense_bete } ; faits « docs_mesure » = [numéros lus], « tri_mesure » = { étiquette : colonne } ;
          Labo.TRI_MESURE (étiquettes et colonnes attendues).
Utilisé par : simulation.js.
*/
(function (L) {
  const doc = (k, titre, texte) => ({ x: 262 + k * 148, y: 40, l: 140, h: 190, taille: 4, titre, texte });
  const DOCS = [
    doc(0, "Santé : les analyses biologiques", "Une prise de sang permet de mesurer la concentration de nombreuses espèces chimiques : glucose, cholestérol, urée, fer… Chaque résultat est comparé à des valeurs de référence. Exemple : la glycémie à jeun d'un adulte en bonne santé est comprise entre 0,70 et 1,10 g/L ; au-delà de 1,26 g/L, deux fois de suite, le médecin parle de diabète. Une erreur de mesure peut conduire à un mauvais diagnostic ou à une mauvaise dose de médicament."),
    doc(1, "Environnement : l'eau et l'air", "Pour protéger la santé et la nature, on mesure en permanence la qualité de l'eau et de l'air. Une eau n'est potable que si elle contient moins de 50 mg/L d'ions nitrate (norme de l'Organisation mondiale de la santé) : les nitrates viennent surtout des engrais et peuvent polluer l'eau des puits. On mesure aussi le pH des rivières, la quantité de dioxygène dissous pour les poissons, et les gaz polluants de l'air des villes."),
    doc(2, "Agroalimentaire : ce que l'on mange", "Les industriels mesurent la composition de leurs produits et l'indiquent sur l'étiquette : sucres, matières grasses, sel, vitamines… Les additifs (colorants, conservateurs) sont autorisés en quantité limitée. Exemple : le colorant bleu patenté E131, utilisé dans les sirops de menthe, a une dose journalière admissible (DJA) de 5 mg par kilogramme de masse corporelle et par jour. Des laboratoires de contrôle vérifient que ces limites sont respectées."),
    doc(3, "Sécurité : prévenir les accidents", "Un éthylotest mesure l'alcool dans l'air expiré : au volant, la loi fixe une limite, de quelques dixièmes de milligramme par litre d'air expiré selon les pays. Un détecteur de monoxyde de carbone sonne quand ce gaz invisible et inodore, produit par un chauffage mal réglé, atteint une concentration dangereuse. Dans l'industrie, des capteurs surveillent les fuites de gaz toxiques ou inflammables."),
    doc(4, "Quelques techniques de mesure", "Pour mesurer une quantité de matière, on peut : peser (balance) ; mesurer un volume (éprouvette, pipette, burette) ; comparer une teinte à une échelle de teintes ou à la couleur d'une bandelette réactive ; mesurer le pH (papier pH, pH-mètre) ; mesurer la conductance d'une solution (conductimètre) ; mesurer l'absorption de la lumière (spectrophotomètre) ; réaliser un dosage par titrage. Chaque mesure a une incertitude qu'il faut connaître."),
  ];
  const e = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  const ETIQUETTES = [
    e("glycemie", "glucose", "dans le sang", 0), e("cholesterol", "cholestérol", "dans le sang", 0),
    e("nitrates", "nitrates dans", "l'eau d'un puits", 1), e("riviere", "pH et dioxygène", "d'une rivière", 1),
    e("colorant", "colorant E131", "dans un sirop", 2), e("sucre", "sucres d'une", "boisson", 2),
    e("alcool", "alcool dans", "l'air expiré", 3), e("co", "monoxyde de carbone", "dans une maison", 3),
  ];

  L.poste_documents_mesure = function (g) {
    // Pense-bête, tableau de tri, documents au mur.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 232, y: 262, largeur: 600, hauteur: 300, titre: "Dans quel domaine mesure-t-on ?", colonnes: ["Santé", "Environnement", ["Agro-", "alimentaire"], "Sécurité"], etiquettes: ETIQUETTES, fait: "tri_mesure", par_ligne: 4 });
    L.documents_mur(g, DOCS, "docs_mesure");
    return { pense_bete };
  };
  L.TRI_MESURE = ETIQUETTES;
})(window.Labo);

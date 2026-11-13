/*
Rôle : paillasse de documents « référentiels galiléens et troisième loi » : quatre documents au mur (principe d'inertie et
       référentiels galiléens, Copernic et le référentiel héliocentrique, référentiels non galiléens, troisième loi de
       Newton) et un tableau magnétique où l'on range huit référentiels (galiléen approximativement, ou non galiléen).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_referentiels(g) -> { pense_bete } ; faits « docs_newton », « tri_referentiels » ; Labo.TRI_REFERENTIELS.
Utilisé par : simulation.js.
*/
(function (L) {
  const doc = (k, titre, texte) => ({ x: 262 + k * 148, y: 40, l: 140, h: 190, taille: 4, titre, texte });
  const DOCS = [
    doc(0, "Référentiels galiléens", "Un référentiel est galiléen si le principe d'inertie y est vérifié : un solide isolé (ou pseudo-isolé) y est immobile ou en mouvement rectiligne uniforme. Le référentiel terrestre (le laboratoire) est presque galiléen pour des expériences de courte durée ; le référentiel géocentrique (centre de la Terre et trois étoiles lointaines) convient pour la Lune et les satellites ; le référentiel héliocentrique, pour les planètes. Tout référentiel en translation rectiligne uniforme par rapport à un référentiel galiléen est galiléen."),
    doc(1, "Copernic et le Soleil au centre", "En 1543, Nicolas Copernic propose un système où le Soleil, et non la Terre, est au centre du mouvement des planètes. Galilée (lunette, 1610) et Kepler (lois des orbites, 1609-1619) le confirment. En 1687, Isaac Newton publie ses trois lois du mouvement et la gravitation universelle : elles s'appliquent dans un référentiel galiléen, et le référentiel héliocentrique (centre du Soleil et trois étoiles lointaines) en est un excellent exemple."),
    doc(2, "Référentiels non galiléens", "Dans un bus qui freine, une balle posée sur le sol roule vers l'avant alors qu'aucune force horizontale ne la pousse : dans le référentiel du bus, le principe d'inertie n'est pas vérifié. De même dans un manège qui tourne, une voiture qui prend un virage ou un ascenseur qui démarre. Ces référentiels, accélérés par rapport au sol, ne sont pas galiléens : on ne peut pas y appliquer les lois de Newton telles quelles."),
    doc(3, "La troisième loi de Newton", "Quand un corps A exerce une force sur un corps B, B exerce sur A une force de même droite d'action, de même intensité et de sens contraire : F(A/B) = −F(B/A). C'est vrai à chaque instant, que les corps soient en contact (la table et le mobile, deux patineurs qui se poussent) ou à distance (la Terre et la Lune s'attirent avec des forces de même intensité). Ces deux forces s'exercent sur deux corps différents : elles ne se compensent pas."),
  ];
  const e = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  const REFERENTIELS = [
    e("labo", "Laboratoire", "(expérience courte)", 0), e("geo", "Géocentrique", "(satellites)", 0),
    e("helio", "Héliocentrique", "(planètes)", 0), e("train", "Train en ligne droite", "à vitesse constante", 0),
    e("bus", "Bus qui freine", "", 1), e("manege", "Manège qui tourne", "", 1),
    e("ascenseur", "Ascenseur", "qui démarre", 1), e("virage", "Voiture dans", "un virage", 1),
  ];
  L.TRI_REFERENTIELS = REFERENTIELS;

  L.poste_referentiels = function (g) {
    // Pense-bête, documents, tableau de tri.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 232, y: 262, largeur: 600, hauteur: 300, titre: "Ce référentiel est-il galiléen ?", colonnes: [["Galiléen", "(approximativement)"], ["Non galiléen", ""]], etiquettes: REFERENTIELS, fait: "tri_referentiels", par_ligne: 4 });
    L.documents_mur(g, DOCS, "docs_newton");
    return { pense_bete };
  };
})(window.Labo);

/*
Rôle : paillasses (2) « le long ressort » (ressort_long.js : ondes transversale et longitudinale, spire rouge) et (3) « sons
       et séismes » : quatre documents au mur (le son, les séismes et le sismogramme, des vagues à la ola, ce qu'est une
       onde) et un tableau magnétique où l'on range huit ondes : transversales ou longitudinales.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_ressort_exemples, Labo.poste_sons_seismes (groupe) -> { pense_bete } ; faits « ressort » (ressort_long.js),
          « docs_ondes » (numéros lus), « tri_ondes » (étiquette : colonne) ; Labo.TRI_ONDES (étiquettes attendues).
Utilisé par : simulation.js.
*/
(function (L) {
  const doc = (k, titre, texte) => ({ x: 262 + k * 186, y: 40, l: 178, h: 190, taille: 4, titre, texte });
  const DOCS = [
    doc(0, "Le son", "Une membrane de haut-parleur qui vibre pousse et tire l'air voisin : des tranches d'air sont tour à tour comprimées et dilatées, et cette perturbation se transmet de proche en proche. Les molécules d'air vibrent sur place, dans la direction de propagation : le son est une onde longitudinale. Il se propage dans les gaz, les liquides et les solides, mais pas dans le vide : sous une cloche où l'on fait le vide, on n'entend plus le réveil qui sonne. Dans l'air à 20 °C, sa célérité est d'environ 340 m/s."),
    doc(1, "Les séismes", "Lors d'un séisme, deux ondes partent du foyer. Les ondes P (premières), longitudinales, compriment et dilatent les roches ; elles vont à environ 6 km/s. Les ondes S (secondes), transversales, cisaillent les roches ; elles vont à environ 3,5 km/s. Un sismographe enregistre d'abord l'arrivée des ondes P, puis celle des ondes S : plus la station est loin du foyer, plus l'écart entre les deux arrivées est grand. Avec trois stations, on localise l'épicentre."),
    doc(2, "Des vagues à la ola", "Un caillou jeté dans l'eau calme crée des rides circulaires qui s'élargissent ; une feuille posée sur l'eau monte et descend quand elles passent, mais reste à sa place. Dans un stade, la ola fait le tour des tribunes : chaque spectateur se lève puis se rassied, sans quitter son siège. Ce qui avance, c'est la perturbation, pas les personnes."),
    doc(3, "Qu'est-ce qu'une onde mécanique ?", "Une onde mécanique est la propagation d'une perturbation dans un milieu matériel, sans transport de matière, mais avec transport d'énergie. La célérité v est la vitesse de propagation de la perturbation : v = d / Δt. Si la perturbation est perpendiculaire à la direction de propagation, l'onde est transversale ; si elle est dans la même direction, l'onde est longitudinale. Une onde n'est pas forcément périodique : une seule secousse suffit."),
  ];
  const e = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  const ONDES = [
    e("corde", "corde secouée", "de haut en bas", 0), e("ola", "la ola", "dans un stade", 0), e("ondes_s", "ondes sismiques", "S", 0), e("ressort_t", "ressort secoué", "sur le côté", 0),
    e("son_air", "le son", "dans l'air", 1), e("ondes_p", "ondes sismiques", "P", 1), e("ressort_l", "ressort comprimé", "puis lâché", 1), e("son_eau", "le son", "dans l'eau", 1),
  ];

  L.poste_ressort_exemples = function (g) {
    // Pense-bête et long ressort.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.ressort_long(g, { x0: 160, k: 350, y_axe: 430, sol: 520, v: 2, fait: "ressort" });
    return { pense_bete };
  };

  L.poste_sons_seismes = function (g) {
    // Pense-bête, documents, tableau des ondes.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 262, y: 262, largeur: 540, hauteur: 300, titre: "Transversale ou longitudinale ?", colonnes: [["Transversale", "(perturbation ⊥ propagation)"], ["Longitudinale", "(perturbation ∥ propagation)"]], etiquettes: ONDES, fait: "tri_ondes", par_ligne: 5 });
    L.documents_mur(g, DOCS, "docs_ondes");
    return { pense_bete };
  };
  L.TRI_ONDES = ONDES;
})(window.Labo);

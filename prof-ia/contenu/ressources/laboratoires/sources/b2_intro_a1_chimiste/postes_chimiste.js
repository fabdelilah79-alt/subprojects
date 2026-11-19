/*
Rôle : paillasses de l'introduction « Les questions que se pose le chimiste » : (1) l'article d'une chimiste (cinq documents)
       et le tableau des activités du chimiste ; (2) une usine d'acide phosphorique et un atelier de médicaments (deux
       documents) et le tableau des préoccupations ; (3) quatre situations (documents) et le tableau des questions de l'année.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_activites_chimiste, Labo.poste_preoccupations, Labo.poste_questions_chimiste (groupe) -> { pense_bete } ;
          faits « docs_chimiste », « docs_usine », « docs_situations » (documents lus), « tri_activites », « tri_preoccupations »,
          « tri_questions_chimie » (étiquette : colonne).
Utilisé par : simulation.js.
*/
(function (L) {
  const D = L.DONNEES_CHIMISTE;

  function poste(g, docs, fait_docs, tableau) {
    // Pense-bête, tableau magnétique, documents au mur (le document ouvert passe devant tout).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 232, y: 262, largeur: 600, hauteur: 300, par_ligne: 4, ...tableau });
    L.documents_mur(g, docs, fait_docs);
    return { pense_bete };
  }

  L.poste_activites_chimiste = (g) => poste(g, D.article, "docs_chimiste", { titre: "Quelle activité du chimiste ?", colonnes: ["Extraire", "Analyser", "Synthétiser", "Recycler"], etiquettes: D.activites, fait: "tri_activites" });
  L.poste_preoccupations = (g) => poste(g, D.usine, "docs_usine", { titre: "Quelle préoccupation du chimiste ?", colonnes: ["Rendement", "Durée", "Coût", ["Déchets, santé,", "environnement"]], etiquettes: D.preoccupations, fait: "tri_preoccupations" });
  L.poste_questions_chimiste = (g) => poste(g, D.situations, "docs_situations", { titre: "Quelle question pose cette situation ?", colonnes: [["Est-elle toujours", "rapide ?"], ["Est-elle toujours", "totale ?"], ["Son sens est-il prévu ?", "Peut-on l'inverser ?"], ["Comment la", "contrôler ?"]], etiquettes: D.questions, fait: "tri_questions_chimie" });
})(window.Labo);

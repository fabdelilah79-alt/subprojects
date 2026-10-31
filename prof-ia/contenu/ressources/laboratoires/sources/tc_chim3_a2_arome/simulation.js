/*
Rôle : simulation de l'activité 2 du chapitre « Synthèse d'espèces chimiques » (tronc commun) : synthèse de l'acétate
       d'isoamyle (arôme de banane) au reflux, lavage à l'eau salée, puis comparaison avec l'arôme naturel de banane et
       une référence par chromatographie (révélation sous UV). Objectifs O1, O2, O3.
Reçoit : rien (les vérifications lisent les faits des paillasses).
Produit : la simulation démarrée : reflux ; lavage ; comparaison.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const { reflux, lavage, choix } = L.MISSIONS_AROME, { preparation } = L.MISSIONS_CCM;
  const C = (faits) => faits.ccm_arome || {};
  const ESPECES = { ester: { rgb: null, Rf: 0.62 }, alcool: { rgb: null, Rf: 0.36 }, autre: { rgb: null, Rf: 0.18 } };
  const ech = (n, x, texte, especes) => ({ n, x, texte, rgb: null, especes });

  const COMPARER = {
    id: "comparer", paillasse: 2, titre: "Est-ce le même arôme ?",
    objectif: "L'espèce synthétisée est-elle identique à celle de la banane ? On compare : 1 produit obtenu, 2 arôme naturel de banane, 3 acétate d'isoamyle pur (référence).",
    entetes: [],
    conclusion: "Les trois dépôts donnent une tache à la même hauteur que la référence : le produit obtenu contient de l'acétate d'isoamyle, la même espèce que celle de la banane. Une espèce synthétique peut être identique à une espèce naturelle. Le produit obtenu donne aussi une petite tache d'alcool isoamylique : il n'est pas tout à fait pur ; l'arôme naturel contient d'autres espèces.",
    conclusion_courte: "Synthétique et naturel : même espèce, même Rf.",
    etapes: [
      { consigne: "Pour savoir si l'espèce synthétisée est identique à l'espèce naturelle, on…", court: "Proposez une méthode.", question: choix(["fait une chromatographie du produit, de l'arôme naturel et de l'espèce pure (référence), sur la même plaque", "compare leurs couleurs", "les goûte"], "Quelle technique identifie une espèce par comparaison ?", "Exact.") },
      ...preparation("ccm_arome", 3, "mélange de solvants"),
      { consigne: "Allumez la lampe UV et entourez au crayon chaque tache sombre.", court: "Révélation UV, taches entourées.", verifier: ({ faits }) => (C(faits).uv_vu && C(faits).cercles >= 5) || false },
      { consigne: "Le produit obtenu (1) et l'arôme naturel (2) contiennent…", court: "Répondez dans le carnet.", question: choix(["de l'acétate d'isoamyle : chacun a une tache à la hauteur de la référence (3)", "des espèces différentes", "aucune espèce commune"], "Comparez les hauteurs des taches.", "Exact.") },
      { consigne: "Le produit obtenu donne aussi une petite tache plus basse. On en déduit…", court: "Répondez dans le carnet.", question: choix(["qu'il contient encore un peu d'alcool isoamylique : il n'est pas tout à fait pur", "que la synthèse a échoué", "que la référence est impure"], "Que reste-t-il des réactifs ?", "Exact : on pourrait le purifier (par distillation).") },
      { consigne: "Une espèce chimique synthétique, identique à une espèce naturelle…", court: "Répondez dans le carnet.", question: choix(["a les mêmes propriétés : c'est la même espèce chimique", "est forcément moins bonne", "est artificielle"], "Rappelez-vous le chapitre « Espèces chimiques ».", "Exact.") },
    ],
  };

  const CCM = L.poste_ccm({ fait: "ccm_arome", eluant: "éluant", revelation: true, especes: ESPECES, echantillons: [ech(1, 390, "obtenu", ["ester", "alcool"]), ech(2, 425, "banane", ["ester", "autre"]), ech(3, 460, "pur", ["ester"])] });
  L.demarrer({ id: "tc_chim3_a2_arome", titre: "Laboratoire : synthèse d'un arôme de banane", paillasses: [L.poste_reflux_arome, L.poste_lavage, CCM], missions: [reflux, lavage, COMPARER] });
})(window.Labo);

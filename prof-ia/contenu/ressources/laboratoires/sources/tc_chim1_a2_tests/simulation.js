/*
Rôle : simulation de l'activité 2 du chapitre « Espèces chimiques » (tronc commun) : tests de détection d'espèces
       chimiques dans un fruit et dans du papier (eau, acidité, amidon, glucose), avec témoins ; l'élève propose le test
       qui permet de vérifier une hypothèse. Objectif O1.
Reçoit : rien (les vérifications lisent les faits des paillasses et la feuille du tableur).
Produit : la simulation démarrée : l'eau ; acide ou basique ; l'amidon ; le glucose.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const { eau, ph, choix } = L.MISSIONS_TESTS;
  const A = (faits) => faits.test_amidon || {}, G = (faits) => faits.test_glucose || {};
  const trois = (faits, f) => [1, 2, 3].every((n) => f(G(faits)[n] || {}));

  const AMIDON = {
    id: "amidon", paillasse: 2, titre: "Le test de l'amidon",
    objectif: "Hypothèse : le papier contient de l'amidon. Proposez un test, puis réalisez-le.",
    entetes: [],
    conclusion: "L'eau iodée (jaune-brun) devient bleu-noir en présence d'amidon. Témoin : la pomme de terre, riche en amidon. Le papier ordinaire contient de l'amidon (on en ajoute pendant sa fabrication) ; le papier filtre (cellulose presque pure) et la pulpe d'orange n'en contiennent pas.",
    conclusion_courte: "Eau iodée : bleu-noir = amidon.",
    etapes: [
      { consigne: "Pour tester l'hypothèse « le papier contient de l'amidon », on utilise…", court: "Proposez un test.", question: choix(["l'eau iodée, qui devient bleu-noir avec l'amidon", "le sulfate de cuivre anhydre", "la phénolphtaléine"], "Quel réactif réagit avec l'amidon ?", "Exact.") },
      { consigne: "Déposez deux gouttes d'eau iodée sur chacun des quatre échantillons. La pomme de terre, riche en amidon, sert de témoin.", court: "Eau iodée sur les 4 échantillons.", verifier: ({ faits }) => [1, 2, 3, 4].every((n) => (A(faits)[n] || {}).iode) || false, aide_geste: "Lâchez la pipette au-dessus de l'échantillon, puis appuyez brièvement sur sa poire." },
      { consigne: "L'eau iodée est devenue bleu-noir sur…", court: "Répondez dans le carnet.", question: choix(["la pomme de terre et le papier ; elle est restée jaune-brun sur le papier filtre et la pulpe d'orange", "les quatre échantillons", "la pulpe d'orange seulement"], "Comparez à la couleur du témoin.", "Exact.") },
      { consigne: "L'hypothèse est-elle vérifiée ?", court: "Répondez dans le carnet.", question: choix(["Oui : le papier contient de l'amidon, comme le témoin", "Non : le papier ne contient que de la cellulose", "On ne peut pas conclure sans goûter"], "Le papier réagit-il comme la pomme de terre ?", "Exact.") },
    ],
  };

  const GLUCOSE = {
    id: "glucose", paillasse: 3, titre: "Le test du glucose",
    objectif: "Le jus d'orange contient-il du glucose (un sucre) ? Proposez et réalisez le test.",
    entetes: [],
    conclusion: "Chauffée avec du glucose, la liqueur de Fehling (bleue) donne un précipité rouge brique. Le tube de glucose (témoin) et le tube de jus d'orange donnent ce précipité ; le tube d'eau distillée reste bleu. Le jus d'orange contient du glucose, une espèce naturelle fabriquée par l'oranger.",
    conclusion_courte: "Fehling chauffée : rouge brique = glucose.",
    etapes: [
      { consigne: "Pour savoir si le jus d'orange contient du glucose, on…", court: "Proposez un test.", question: choix(["chauffe au bain-marie le jus avec de la liqueur de Fehling, et l'on fait de même avec une solution de glucose (témoin) et de l'eau distillée", "ajoute de l'eau iodée au jus", "goûte le jus : s'il est sucré, il contient du glucose"], "On ne goûte jamais au laboratoire, et un goût sucré ne dit pas quel sucre.", "Exact.") },
      { consigne: "Avec la pipette du flacon, versez environ 1 mL de liqueur de Fehling (une pipette pleine) dans chacun des trois tubes.", court: "Fehling dans les 3 tubes.", verifier: ({ faits }) => trois(faits, (t) => t.fehling >= 0.8) || false, aide_geste: "Lâchez la pipette juste au-dessus du tube, appuyez sur la poire ; remettez-la dans le flacon pour la remplir." },
      { consigne: "Placez les trois tubes dans le bain-marie (80 °C) et observez pendant quelques instants.", court: "Les 3 tubes au bain-marie.", verifier: ({ faits }) => (trois(faits, (t) => t.bain) && G(faits)[1].avance > 0.8 && G(faits)[3].avance > 0.8) || false, aide_geste: "Glissez chaque tube dans le bécher d'eau chaude. Le bain-marie est déjà chaud : regardez le thermomètre." },
      { consigne: "Un précipité rouge brique s'est formé dans…", court: "Répondez dans le carnet.", question: choix(["le tube de glucose et le tube de jus d'orange ; le tube d'eau distillée est resté bleu", "les trois tubes", "le tube d'eau distillée seulement"], "Comparez au témoin (glucose).", "Exact : le jus d'orange contient du glucose.") },
      { consigne: "Le glucose du jus d'orange est une espèce chimique…", court: "Répondez dans le carnet.", question: choix(["naturelle : elle est fabriquée par l'oranger", "synthétique : elle est fabriquée par l'industrie", "artificielle"], "D'où vient le jus ?", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_chim1_a2_tests", titre: "Laboratoire : tests de détection", paillasses: [L.poste_eau, L.poste_ph, L.poste_amidon, L.poste_glucose], missions: [eau, ph, AMIDON, GLUCOSE] });
})(window.Labo);

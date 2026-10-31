/*
Rôle : simulation de l'activité du chapitre « Les questions que se pose le chimiste » (2e année du bac) : analyser l'article
       d'une chimiste et classer ses activités (extraire, analyser, synthétiser, recycler ; chimie lourde et chimie fine) ;
       situer ses préoccupations sur deux fabrications (rendement, durée, coût, déchets, santé et environnement) ; faire
       émerger les questions de l'année (rapide ? totale ? sens prévisible, inversable ? comment contrôler ?). Objectif O1.
Reçoit : rien (les vérifications lisent les documents lus et les tableaux de tri).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const D = L.DONNEES_CHIMISTE, choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const lus = (fait, n) => ({ faits }) => (faits[fait] || []).length >= n;
  const range = (etiquettes, fait) => ({ faits }) => L.tableau_tri.verifier(etiquettes, faits[fait]);

  const ACTIVITES = {
    id: "activites", paillasse: 0, titre: "Les activités du chimiste",
    conclusion: "Le chimiste extrait des espèces qui existent dans la nature (huiles essentielles, caféine), analyse la composition des produits (contrôle de l'eau, des médicaments), synthétise des espèces nouvelles ou rares (médicaments, engrais) et recycle les déchets (plastiques, métaux). La chimie lourde produit des millions de tonnes (engrais, acides) ; la chimie fine produit de petites quantités très pures (médicaments, parfums).",
    objectif: "Lire l'article d'une chimiste et classer ses activités.",
    entetes: [], conclusion_courte: "Extraire, analyser, synthétiser, recycler.",
    etapes: [
      { consigne: "Lisez les cinq documents au mur.", court: "Lisez les documents.", aide_geste: "Touchez un document pour l'ouvrir, touchez-le de nouveau pour le refermer.", verifier: lus("docs_chimiste", 5) },
      { consigne: "Rangez chaque activité dans la bonne colonne du tableau.", court: "Tableau : rangez les activités.", aide_geste: "Faites glisser chaque étiquette jaune dans une colonne.", verifier: range(D.activites, "tri_activites") },
      { consigne: "La production d'engrais (des millions de tonnes par an) relève…", court: "Répondez dans le carnet.", question: choix(["de la chimie lourde", "de la chimie fine", "de l'analyse"], "Relisez le document « Synthétiser ».", "Exact : la chimie fine produit de petites quantités très pures.") },
      { consigne: "L'aspirine que l'on fabrique est…", court: "Répondez dans le carnet.", question: choix(["la même espèce chimique que l'aspirine extraite de l'écorce de saule : seule son origine change", "moins efficace, car elle n'est pas naturelle", "un mélange qui n'a pas de formule"], "Une espèce chimique a les mêmes propriétés, quelle que soit son origine.", "Exact.") },
    ],
  };

  const PREOCCUPATIONS = {
    id: "preoccupations", paillasse: 1, titre: "Les préoccupations du chimiste",
    conclusion: "Une fabrication se juge par son rendement (quantité obtenue / quantité attendue : 85 % pour l'aspirine), sa durée (qu'un catalyseur ou une température plus élevée raccourcissent), son coût (réactifs, énergie) et ses conséquences : déchets à stocker ou à valoriser (20 millions de tonnes de phosphogypse par an pour 4 millions de tonnes de P₂O₅), protection des personnes et de l'environnement.",
    objectif: "Étudier deux fabrications et classer les préoccupations du chimiste.",
    entetes: [], donnees: ["Rendement = quantité obtenue / quantité attendue", "1 t de P₂O₅ → environ 5 t de phosphogypse"], conclusion_courte: "Rendement, durée, coût, déchets.",
    etapes: [
      { consigne: "Lisez les deux documents au mur.", court: "Lisez les documents.", verifier: lus("docs_usine", 2) },
      { consigne: "Rangez chaque étiquette sous la préoccupation qui lui correspond.", court: "Tableau : rangez les étiquettes.", verifier: range(D.preoccupations, "tri_preoccupations") },
      { consigne: "Rendement de la fabrication de l'aspirine (en %) ?", court: "Rendement (%) ?", question: nombre("%", 85, 0.5, "0,85 t obtenue pour 1,00 t attendue.", "Exact : 85 %.") },
      { consigne: "Masse de phosphogypse rejetée en un an par l'usine (en millions de tonnes) ?", court: "Phosphogypse (Mt) ?", question: nombre("Mt", 20, 0.5, "5 t de phosphogypse par tonne de P₂O₅ ; 4 millions de tonnes de P₂O₅.", "Exact : environ 20 millions de tonnes.") },
      { consigne: "Pour l'industriel, le meilleur procédé est…", court: "Répondez dans le carnet.", question: choix(["un compromis : bon rendement, durée courte, coût faible, peu de déchets et sans danger", "celui qui va le plus vite, quels que soient les déchets", "celui qui coûte le plus cher"], "Relisez « Mes préoccupations ».", "Exact.") },
    ],
  };

  const QUESTIONS = {
    id: "questions", paillasse: 2, titre: "Les questions de l'année",
    conclusion: "Les situations observées posent les questions de l'année : une transformation chimique est-elle toujours rapide (non : précipité instantané, rouille lente) ? Toujours totale (non : estérification, acide éthanoïque dans l'eau) ? Son sens est-il prévisible, peut-on l'inverser (pile qui débite, batterie que l'on recharge) ? Comment le chimiste la contrôle-t-il (catalyseur, réactif en excès, élimination d'un produit) ?",
    objectif: "Faire émerger, à partir de situations, les questions étudiées cette année.",
    entetes: [], conclusion_courte: "Rapide ? Totale ? Sens ? Contrôle ?",
    etapes: [
      { consigne: "Lisez les quatre documents au mur.", court: "Lisez les documents.", verifier: lus("docs_situations", 4) },
      { consigne: "Rangez chaque situation sous la question qu'elle pose.", court: "Tableau : rangez les situations.", verifier: range(D.questions, "tri_questions_chimie") },
      { consigne: "Pour savoir si une transformation est rapide ou lente, le chimiste…", court: "Répondez dans le carnet.", question: choix(["suit l'évolution d'une grandeur (couleur, pression, conductance) au cours du temps", "pèse les réactifs une seule fois", "regarde seulement l'état final"], "Il faut des mesures à différents instants.", "Exact : c'est le suivi temporel.") },
      { consigne: "Recharger une batterie montre que…", court: "Répondez dans le carnet.", question: choix(["une transformation peut être forcée dans le sens inverse, en lui fournissant de l'énergie", "toutes les transformations sont rapides", "une pile ne s'use jamais"], "Relisez « Dans un téléphone ».", "Exact : c'est une transformation forcée.") },
    ],
  };

  L.demarrer({ id: "b2_intro_a1_chimiste", titre: "Laboratoire : les questions du chimiste", paillasses: [L.poste_activites_chimiste, L.poste_preoccupations, L.poste_questions_chimiste], missions: [ACTIVITES, PREOCCUPATIONS, QUESTIONS] });
})(window.Labo);

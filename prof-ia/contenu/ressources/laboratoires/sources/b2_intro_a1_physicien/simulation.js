/*
Rôle : simulation de l'activité du chapitre « Les questions que se pose le physicien » (2e année du bac) : analyser
       l'article d'une physicienne (télécommunications, énergie nucléaire, circuits, satellites et horloges), ranger ses
       questions par partie du programme, puis suivre la démarche du physicien sur un problème (distance d'un satellite
       GPS). Objectif O1.
Reçoit : rien (les vérifications lisent les faits « docs_physicien », « tri_questions », « docs_gps », « tri_demarche »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const T = L.TRI_PHYSICIEN;

  const ARTICLE = {
    id: "article", paillasse: 0, titre: "L'article d'une physicienne",
    objectif: "Lire l'article ; ranger les questions du physicien par partie du programme de l'année.",
    entetes: [],
    conclusion: "Le physicien se pose des questions sur le monde qui l'entoure et sur les techniques : communiquer (ondes mécaniques et lumineuses, modulation), produire de l'énergie et dater (transformations nucléaires), stocker l'énergie et la faire osciller dans un circuit (condensateur, bobine), comprendre le mouvement des satellites et mesurer le temps (lois de Newton, oscillateurs). Ces questions structurent le programme de l'année.",
    conclusion_courte: "Ondes, noyau, circuits, mouvements : les questions de l'année.",
    etapes: [
      { consigne: "Lisez les cinq documents au mur.", court: "Lisez les documents.", aide_geste: "Touchez un document pour l'ouvrir, touchez-le de nouveau pour le refermer.", verifier: ({ faits }) => (faits.docs_physicien || []).length >= 5 },
      { consigne: "Rangez chaque question du physicien dans la partie du programme qui y répond.", court: "Tableau : rangez les questions.", aide_geste: "Faites glisser chaque étiquette jaune dans une colonne.", verifier: ({ faits }) => L.tableau_tri.verifier(T.questions, faits.tri_questions) },
      { consigne: "Pour transmettre la voix par radio, on la confie à une onde de haute fréquence. Ce procédé s'appelle…", court: "Répondez dans le carnet.", question: choix(["la modulation", "la diffraction", "la fission"], "Relisez le document « Communiquer avec les ondes ».", "Exact.") },
      { consigne: "Un satellite ne tombe pas sur la Terre parce que…", court: "Répondez dans le carnet.", question: choix(["il tombe sans cesse, mais sa vitesse est assez grande pour qu'il tourne autour de la Terre", "il n'est plus attiré par la Terre", "il est porté par l'air"], "Relisez le document « Satellites et horloges ».", "Exact : la Terre l'attire toujours.") },
    ],
  };

  const DEMARCHE = {
    id: "demarche", paillasse: 1, titre: "Résoudre un problème de physicien",
    objectif: "À quelle distance du récepteur se trouve un satellite GPS ? Suivre la démarche du physicien.",
    entetes: [],
    donnees: ["c = 3,00 × 10⁸ m/s", "1 ms = 10⁻³ s"],
    conclusion: "Le physicien part d'une observation et d'une question précise, choisit un modèle (onde qui se propage en ligne droite à la célérité c), mesure une grandeur (le retard Δt, avec des horloges très précises), calcule (d = c·Δt = 3,00 × 10⁸ × 0,0673 ≈ 2,02 × 10⁷ m, soit environ 20 200 km) puis valide en comparant à une valeur connue. Une erreur d'un millionième de seconde sur Δt donne 300 m d'erreur : d'où les horloges atomiques.",
    conclusion_courte: "Question, modèle, mesure, calcul, validation.",
    etapes: [
      { consigne: "Lisez le document du problème.", court: "Lisez le document.", verifier: ({ faits }) => (faits.docs_gps || []).length >= 1 },
      { consigne: "Rangez chaque étiquette dans l'étape de la démarche à laquelle elle appartient.", court: "Tableau : rangez les étapes.", verifier: ({ faits }) => L.tableau_tri.verifier(T.demarche, faits.tri_demarche) },
      { consigne: "Calculez la distance d = c × Δt entre le satellite et le récepteur (en km).", court: "d (km) ?", question: nombre("km", 20190, 150, "Δt = 67,3 ms = 0,0673 s ; d = 3,00 × 10⁸ × 0,0673 m, puis divisez par 1000.", "Exact : environ 20 200 km, l'altitude des satellites GPS.") },
      { consigne: "Une erreur d'un millionième de seconde (10⁻⁶ s) sur Δt donnerait une erreur sur d de…", court: "Répondez dans le carnet.", question: choix(["300 m : il faut des horloges très précises", "3 mm", "3 000 km"], "Erreur sur d = c × erreur sur Δt.", "Exact.") },
      { consigne: "Si la distance calculée était très différente de la valeur publiée, le physicien…", court: "Répondez dans le carnet.", question: choix(["vérifierait sa mesure, puis remettrait en cause son modèle", "changerait la valeur publiée", "garderait son résultat sans rien vérifier"], "Relisez « Comment je travaille ».", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_intro_a1_physicien", titre: "Laboratoire : les questions du physicien", paillasses: [L.poste_article, L.poste_demarche], missions: [ARTICLE, DEMARCHE] });
})(window.Labo);

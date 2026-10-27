/*
Rôle : paillasses de l'introduction « Les questions que se pose le physicien » (2e année du bac) : (1) un article où une
       physicienne raconte son métier, en cinq documents au mur (communiquer avec les ondes, l'énergie du noyau, les
       circuits électriques, satellites et horloges, la démarche du physicien), et un tableau magnétique où l'on range
       huit questions par partie du programme ; (2) un problème du physicien (à quelle distance est un satellite GPS ?) :
       document et tableau magnétique des étapes de la démarche.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_article, Labo.poste_demarche (groupe) -> { pense_bete } ; faits « docs_physicien », « docs_gps »
          (numéros lus), « tri_questions », « tri_demarche » (étiquette : colonne) ; Labo.TRI_PHYSICIEN = { questions, demarche }.
Utilisé par : simulation.js.
*/
(function (L) {
  const doc = (k, titre, texte) => ({ x: 262 + k * 148, y: 40, l: 140, h: 190, taille: 4, titre, texte });
  const DOCS = [
    doc(0, "Communiquer avec les ondes", "« Mon téléphone envoie et reçoit des ondes électromagnétiques ; la fibre optique guide la lumière sur des milliers de kilomètres. Le son, lui, est une onde mécanique : il a besoin d'un milieu pour se propager. Pour transmettre une voix par radio, on la confie à une onde de haute fréquence : c'est la modulation. Comprendre la propagation, la célérité, la diffraction des ondes, c'est la base de toutes les télécommunications. »"),
    doc(1, "L'énergie du noyau", "« Le noyau de certains atomes est instable : il se désintègre en émettant un rayonnement. Ce phénomène suit une loi de décroissance précise, qui permet de dater un fossile par le carbone 14 ou de soigner un cancer. Dans une centrale nucléaire, la fission de noyaux d'uranium libère une énergie énorme, calculée avec E = m·c². Il faut aussi protéger les personnes des rayonnements et gérer les déchets. »"),
    doc(2, "Des circuits partout", "« Le flash d'un appareil photo se charge grâce à un condensateur ; une bobine retarde l'établissement du courant ; un circuit qui associe bobine et condensateur oscille et permet à une radio de choisir sa station. J'étudie comment la tension et l'intensité évoluent au cours du temps dans ces circuits, avec un oscilloscope ou un ordinateur. »"),
    doc(3, "Satellites et horloges", "« Pourquoi un satellite ne tombe-t-il pas sur la Terre ? Les lois de Newton répondent : il tombe sans cesse, mais sa vitesse est assez grande pour qu'il tourne autour d'elle. Les satellites GPS embarquent des horloges atomiques ; avant elles, on mesurait le temps avec des oscillateurs : pendule, ressort, quartz. Mécanique et énergie expliquent ces mouvements. »"),
    doc(4, "Comment je travaille", "« Tout commence par une question précise. Je choisis un modèle simple, je fais des hypothèses, je prévois un résultat. Puis je mesure, avec des appareils dont je connais l'incertitude. Je compare la mesure à la prévision : si elles ne s'accordent pas, je change de modèle. Enfin je communique mes résultats, pour qu'ils soient vérifiés par d'autres. »"),
  ];
  const GPS = [{ x: 262, y: 40, l: 300, h: 190, taille: 5, titre: "À quelle distance est un satellite GPS ?", chaine: ["satellite", "(horloge)", "signal à c", "récepteur"], texte: "Un satellite GPS émet un signal daté par son horloge atomique. Le récepteur, au sol, note l'heure d'arrivée : le signal a mis Δt = 67,3 ms pour arriver. Le signal est une onde électromagnétique qui se propage en ligne droite, dans le vide et dans l'air, à la célérité c = 3,00 × 10⁸ m/s. Valeur publiée : les satellites GPS tournent à environ 20 200 km d'altitude." }];
  const e = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  const QUESTIONS = [
    e("son", "Comment le son", "se propage-t-il ?", 0), e("prisme", "Pourquoi un prisme", "décompose la lumière ?", 0),
    e("fossile", "Comment dater", "un fossile ?", 1), e("centrale", "D'où vient l'énergie", "d'une centrale ?", 1),
    e("flash", "Comment se charge", "un flash photo ?", 2), e("radio", "Comment une radio", "choisit sa station ?", 2),
    e("satellite", "Pourquoi un satellite", "ne tombe pas ?", 3), e("pendule", "Comment un pendule", "mesure le temps ?", 3),
  ];
  const DEMARCHE = [
    e("retard", "Le signal arrive", "avec un retard", 0), e("question", "À quelle distance", "est le satellite ?", 0),
    e("onde", "Onde qui se propage", "à c = 3,00×10⁸ m/s", 1), e("droite", "Propagation", "en ligne droite", 1),
    e("delta", "Retard mesuré :", "Δt = 67,3 ms", 2), e("horloges", "Horloges atomiques", "très précises", 2),
    e("calcul", "Calculer", "d = c × Δt", 3), e("comparer", "Comparer à la", "valeur publiée", 3),
  ];

  L.poste_article = function (g) {
    // Pense-bête, documents de l'article, tableau des questions.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 232, y: 262, largeur: 600, hauteur: 300, titre: "Dans quelle partie du programme ?", colonnes: ["Ondes", ["Transformations", "nucléaires"], "Électricité", "Mécanique"], etiquettes: QUESTIONS, fait: "tri_questions", par_ligne: 4 });
    L.documents_mur(g, DOCS, "docs_physicien");
    return { pense_bete };
  };

  L.poste_demarche = function (g) {
    // Pense-bête, document du problème, tableau des étapes de la démarche.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 232, y: 262, largeur: 600, hauteur: 300, titre: "Les étapes de la démarche", colonnes: [["1. Observer,", "questionner"], ["2. Choisir", "un modèle"], "3. Mesurer", ["4. Calculer,", "valider"]], etiquettes: DEMARCHE, fait: "tri_demarche", par_ligne: 4 });
    L.documents_mur(g, GPS, "docs_gps");
    return { pense_bete };
  };
  L.TRI_PHYSICIEN = { questions: QUESTIONS, demarche: DEMARCHE };
})(window.Labo);

/*
Rôle : contenu des paillasses de l'introduction « Les questions que se pose le chimiste » (2e année du bac) : documents
       au mur (article d'une chimiste : extraire, analyser, synthétiser, recycler, ses préoccupations ; étude d'une usine ;
       situations de laboratoire et de la vie courante) et étiquettes des tableaux de tri, avec leur colonne attendue.
Reçoit : rien.
Produit : Labo.DONNEES_CHIMISTE = { article, usine, situations (documents), activites, preoccupations, questions (étiquettes) }.
Utilisé par : postes_chimiste.js (fichier nommé pour être chargé avant lui), simulation.js.
*/
(function (L) {
  const doc = (k, titre, chaine, texte, n = 5) => ({ x: 262 + k * (740 / n), y: 40, l: 740 / n - 8, h: 190, taille: 4, titre, chaine, texte });
  const e = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  const ARTICLE = [
    doc(0, "Extraire", ["pétales de rose", "+ vapeur d'eau", "distillation", "huile essentielle"], "« Au printemps, nous distillons des roses avec de la vapeur d'eau : il faut environ 4 tonnes de pétales pour obtenir 1 kg d'huile essentielle. On extrait aussi la caféine du thé ou du café avec un solvant. Extraire, c'est séparer une espèce chimique qui existe déjà dans la nature. »"),
    doc(1, "Analyser", ["échantillon", "(eau, comprimé)", "dosage", "comparaison à la norme"], "« Au laboratoire de contrôle, je vérifie qu'une eau potable contient moins de 50 mg/L de nitrates et qu'un comprimé contient bien 500 mg de paracétamol. Analyser, c'est identifier les espèces présentes et mesurer leur quantité : titrage, chromatographie, spectrophotométrie. »"),
    doc(2, "Synthétiser", ["réactifs", "(+ catalyseur)", "réaction", "produit purifié"], "« On fabrique des espèces qui n'existent pas dans la nature, ou qui y sont trop rares : médicaments comme l'aspirine (chimie fine : quelques tonnes très pures), engrais et acide phosphorique tirés des phosphates (chimie lourde : des millions de tonnes par an). »"),
    doc(3, "Recycler", ["déchet", "(trié)", "traitement", "matière réutilisée"], "« Les bouteilles en plastique PET sont broyées, lavées, fondues puis transformées en fibres pour les vêtements. Le plomb des batteries de voiture est récupéré presque entièrement et réutilisé. Recycler, c'est économiser les matières premières et l'énergie et réduire les déchets. »"),
    doc(4, "Mes préoccupations", ["rendement", "(et durée)", "coût", "déchets, santé"], "« Pour chaque fabrication, je me demande : quelle quantité de produit vais-je obtenir (rendement) ? En combien de temps ? À quel coût ? Que faire des déchets ? Les produits sont-ils dangereux pour les ouvriers, les consommateurs et l'environnement ? »"),
  ];
  const USINE = [
    doc(0, "Une usine d'acide phosphorique", ["phosphate", "+ acide sulfurique", "acide phosphorique", "+ phosphogypse (déchet)"], "Le phosphate naturel réagit avec l'acide sulfurique à 80 °C pendant environ 4 heures. Pour chaque tonne de P₂O₅ produite (dans l'acide phosphorique), l'usine rejette environ 5 tonnes de phosphogypse, un solide qu'il faut stocker ou valoriser. Production : 4 millions de tonnes de P₂O₅ par an.", 2),
    doc(1, "Un atelier de médicaments", ["acide salicylique", "+ anhydride éthanoïque", "3 h, catalyseur", "aspirine (0,85 t)"], "Pour fabriquer l'aspirine, on chauffe l'acide salicylique avec l'anhydride éthanoïque, en présence d'un catalyseur acide, pendant 3 heures. On attendait 1,00 tonne d'aspirine ; on en obtient 0,85 tonne après purification. Les vapeurs d'acide éthanoïque sont aspirées pour protéger les opérateurs.", 2),
  ];
  const SITUATIONS = [
    doc(0, "Au laboratoire", ["Ag⁺ + Cl⁻", "(eau salée)", "AgCl", "précipité immédiat"], "On verse du nitrate d'argent dans de l'eau salée : un précipité blanc apparaît instantanément. Mais une pièce de fer laissée sous la pluie met des mois à rouiller.", 4),
    doc(1, "Dans un flacon", ["acide + alcool", "(chauffage)", "ester + eau", "il reste des réactifs"], "On chauffe un acide avec un alcool pendant des heures : il se forme un ester, mais il reste toujours de l'acide et de l'alcool. Une solution d'acide éthanoïque contient très peu d'ions : l'acide réagit peu avec l'eau.", 4),
    doc(2, "Dans un téléphone", ["pile", "(sens spontané)", "elle s'use", "recharge : sens inverse"], "Une pile débite du courant toute seule, puis s'use : sa transformation se fait dans un sens précis. Le chargeur d'une batterie fait marcher la transformation dans l'autre sens, en lui fournissant de l'énergie.", 4),
    doc(3, "Dans une usine", ["catalyseur", "(pot catalytique)", "plus rapide", "excès : plus de produit"], "Le pot catalytique d'une voiture accélère la transformation des gaz polluants. Pour fabriquer un ester, l'industriel retire l'eau formée ou met un réactif en excès : il obtient plus de produit.", 4),
  ];
  const ACTIVITES = [
    e("rose", "Obtenir l'huile", "essentielle de rose", 0), e("cafeine", "Isoler la caféine", "du thé", 0),
    e("nitrates", "Doser les nitrates", "d'une eau", 1), e("comprime", "Contrôler un", "comprimé de 500 mg", 1),
    e("aspirine", "Fabriquer", "de l'aspirine", 2), e("phosphorique", "Produire de l'acide", "phosphorique", 2),
    e("pet", "Refaire des fibres", "avec du PET", 3), e("plomb", "Récupérer le plomb", "des batteries", 3),
  ];
  const PREOCCUPATIONS = [
    e("quantite", "Obtenir plus", "de produit", 0), e("purifier", "Perdre peu de produit", "en le purifiant", 0),
    e("catalyseur", "Accélérer avec", "un catalyseur", 1), e("chauffer", "Chauffer pour aller", "plus vite", 1),
    e("reactifs", "Choisir des réactifs", "bon marché", 2), e("energie", "Économiser", "l'énergie", 2),
    e("gypse", "Stocker ou valoriser", "le phosphogypse", 3), e("vapeurs", "Protéger les ouvriers", "des vapeurs", 3),
  ];
  const QUESTIONS = [
    e("argent", "Précipité blanc", "instantané", 0), e("rouille", "Le fer rouille", "en des mois", 0),
    e("ester", "Il reste de l'acide", "et de l'alcool", 1), e("ions", "Peu d'ions dans", "l'acide éthanoïque", 1),
    e("pile", "La pile débite", "toute seule", 2), e("recharge", "Recharger", "une batterie", 2),
    e("pot", "Pot catalytique", "d'une voiture", 3), e("exces", "Réactif en excès,", "eau retirée", 3),
  ];
  L.DONNEES_CHIMISTE = { article: ARTICLE, usine: USINE, situations: SITUATIONS, activites: ACTIVITES, preoccupations: PREOCCUPATIONS, questions: QUESTIONS };
})(window.Labo);

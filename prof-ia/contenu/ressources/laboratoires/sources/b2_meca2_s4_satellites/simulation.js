/*
Rôle : simulation de la partie « Satellites et planètes » du chapitre « Applications des lois de Newton » (2e année du bac,
       filières PC, SMA, SMB) : référentiels héliocentrique et géocentrique, textes historiques ; lois de Kepler au simulateur
       (ellipse, aires égales en des durées égales) et troisième loi avec les données des planètes ; deuxième loi de Newton
       appliquée à un satellite en orbite circulaire (mouvement circulaire uniforme, v = √(G·M/r)), satellite géostationnaire.
       Objectif O8. Orbites elliptiques : description seulement (leur étude dynamique est hors programme).
Reçoit : rien (les vérifications sont dans verifications_satellites.js).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const V = L.verif_satellites, { choix, nombre, relatif } = V, MU = 6.674e-11 * 5.972e24, R = 6.371e6;
  const soleil = (l) => l.mode === "soleil" && l.issue === "orbite" && !l.circulaire, terre = (l) => l.mode === "terre" && l.circulaire;
  const iss = (l) => terre(l) && Math.abs(l.r0 - (R + 4e5)) <= 5e4, geo = (l) => terre(l) && Math.abs(l.T - 86164) <= 862;

  const REFERENTIELS = {
    id: "referentiels", paillasse: 0, titre: "Référentiels et histoire",
    conclusion: "Le mouvement des planètes s'étudie dans le référentiel héliocentrique (centre du Soleil, axes vers trois étoiles lointaines) ; celui de la Lune et des satellites dans le référentiel géocentrique (centre de la Terre, axes parallèles à ceux du référentiel héliocentrique : il est en translation par rapport à lui). Ces référentiels sont considérés comme galiléens. Le référentiel terrestre ne convient pas pour les satellites.",
    objectif: "Choisir le référentiel adapté à l'étude d'une planète ou d'un satellite.",
    entetes: [], donnees: ["Référentiel héliocentrique : centre du Soleil", "Référentiel géocentrique : centre de la Terre", "Axes dirigés vers des étoiles lointaines"],
    conclusion_courte: "Planètes : héliocentrique ; satellites : géocentrique.",
    etapes: [
      { consigne: "Lisez les documents « Référentiels » et « De Ptolémée à Newton » : touchez-les.", court: "Lisez les documents 1 et 2.", verifier: ({ faits }) => V.lu(faits, 1, 2) || false },
      { consigne: "Pour étudier le mouvement de Mars autour du Soleil, on choisit le référentiel…", court: "Répondez dans le carnet.", question: choix(["héliocentrique", "géocentrique", "terrestre (lié au laboratoire)"], "Quel est le centre du mouvement ?", "Exact.") },
      { consigne: "Pour étudier un satellite de télécommunication, on choisit le référentiel…", court: "Répondez dans le carnet.", question: choix(["géocentrique", "héliocentrique", "terrestre (lié au laboratoire)"], "Le satellite tourne autour de la Terre.", "Exact.") },
      { consigne: "Le référentiel géocentrique…", court: "Répondez dans le carnet.", question: choix(["est en translation par rapport au référentiel héliocentrique : ses axes gardent la même direction", "tourne avec la Terre en un jour", "est lié au sol du laboratoire"], "Relisez le document « Référentiels ».", "Exact.") },
    ],
  };

  const KEPLER = {
    id: "kepler", paillasse: 0, titre: "Les lois de Kepler",
    conclusion: "Dans le référentiel héliocentrique, chaque planète décrit une ellipse dont le Soleil occupe un foyer (1re loi) ; le segment Soleil-planète balaie des aires égales pendant des durées égales : la planète va plus vite près du Soleil (2e loi) ; pour toutes les planètes, T²/a³ = 4π²/(G·MS) est la même constante (3e loi), ce qui permet de calculer la masse du Soleil, MS ≈ 2,0 × 10³⁰ kg.",
    objectif: "Observer une orbite elliptique et la loi des aires ; vérifier la 3e loi avec les données des planètes.",
    entetes: ["a (m)", "T (s)", "a³ (m³)", "T² (s²)"],
    donnees: ["1 UA = 1,496 × 10¹¹ m ; 1 j = 86 400 s", "G = 6,67 × 10⁻¹¹ N·m²·kg⁻²", "3e loi : T² / a³ = 4π² / (G·MS)"],
    conclusion_courte: "Ellipse, loi des aires, T²/a³ = 4π²/(G·MS).",
    etapes: [
      { consigne: "Onglet « Soleil – planète », r0 = 1 UA : lancez une planète avec v0 = 25 km/s.", court: "Lancez une planète (25 km/s).", aide_geste: "Glissez le curseur bleu ou touchez − et +, puis « Lancer ».", verifier: ({ faits }) => V.lance(faits, soleil) || false },
      { consigne: "La trajectoire de la planète est…", court: "Répondez dans le carnet.", question: choix(["une ellipse dont le Soleil occupe un foyer", "un cercle centré sur le Soleil", "une ellipse centrée sur le Soleil"], "Le Soleil est-il au centre de la courbe ?", "Exact : c'est la première loi de Kepler.") },
      { consigne: "Cochez « Aires balayées en des durées égales », relancez et observez les secteurs balayés pendant chaque dixième de période.", court: "Cochez les aires, relancez.", verifier: ({ faits }) => V.lance(faits, (l) => soleil(l) && l.aires) || false },
      { consigne: "Pendant des durées égales, le segment Soleil-planète balaie…", court: "Répondez dans le carnet.", question: choix(["des aires égales", "des longueurs d'orbite égales", "des angles égaux"], "Comparez la forme des secteurs.", "Exact : c'est la deuxième loi de Kepler.") },
      { consigne: "La planète va le plus vite…", court: "Répondez dans le carnet.", question: choix(["quand elle est le plus près du Soleil", "quand elle est le plus loin du Soleil", "toujours à la même vitesse"], "Où les secteurs sont-ils courts et larges ?", "Exact.") },
      { consigne: "Lisez le document « Données » ; tableur : a (m) en A, T (s) en B, a³ en C, T² en D, pour quatre planètes au moins.", court: "Tableur : a, T, a³, T².", verifier: V.kepler },
      { consigne: "Tracez T² (D) en fonction de a³ (C), modèle y = a·x.", court: "Courbe T² = f(a³).", verifier: ({ courbe: c }) => (c.x === "C" && c.y === "D" && c.n >= 4 && c.modele === "lineaire") || "Abscisse : C ; ordonnée : D ; modèle y = a·x." },
      { consigne: "Le coefficient directeur vaut 4π² / (G·MS) : déduisez-en la masse du Soleil MS (kg).", court: "MS (kg) ?", question: relatif("kg", 1.99e30, 0.03, "MS = 4π² / (G × coefficient directeur).", "Exact : MS ≈ 2,0 × 10³⁰ kg.") },
      { consigne: "La troisième loi de Kepler dit que…", court: "Répondez dans le carnet.", question: choix(["T² / a³ a la même valeur pour toutes les planètes", "T / a est le même pour toutes les planètes", "T est proportionnelle à a"], "La courbe est une droite qui passe par l'origine.", "Exact.") },
    ],
  };

  const SATELLITES = {
    id: "satellites", paillasse: 0, titre: "Satellites en orbite circulaire",
    conclusion: "Dans le référentiel géocentrique, un satellite n'est soumis qu'à l'attraction de la Terre, F = G·M·m/r², dirigée vers le centre de la Terre. La deuxième loi de Newton donne une accélération centripète a = G·M/r² ; sur une orbite circulaire, le mouvement est uniforme et v = √(G·M/r), indépendante de la masse du satellite ; T = 2π·r/v. Le satellite géostationnaire tourne dans le plan de l'équateur, dans le sens de rotation de la Terre, en un jour sidéral (86 164 s), à 35 800 km d'altitude : il reste au-dessus du même point de la Terre.",
    objectif: "Mettre un satellite en orbite circulaire ; appliquer la deuxième loi de Newton ; trouver l'orbite géostationnaire.",
    entetes: [], donnees: ["G = 6,67 × 10⁻¹¹ SI ; M = 5,97 × 10²⁴ kg ; R = 6 371 km", "Orbite circulaire : v = √(G·M/r) ; T = 2π·r / v", "Jour sidéral : 86 164 s"],
    conclusion_courte: "v = √(G·M/r) ; géostationnaire : T = 86 164 s, h ≈ 35 800 km.",
    etapes: [
      { consigne: "Onglet « Terre – satellite » : lancez un satellite à l'altitude de la Station spatiale (h = 400 km) et réglez v0 pour obtenir une orbite circulaire.", court: "Orbite circulaire à 400 km.", aide_geste: "r0 = R + h = 6 771 km ; touchez − et + pour régler v0 à 0,01 km/s près.", verifier: ({ faits }) => V.lance(faits, iss) || false },
      { consigne: "Dans le référentiel géocentrique, la seule force qui s'exerce sur le satellite est…", court: "Répondez dans le carnet.", question: choix(["l'attraction de la Terre, F = G·M·m/r², dirigée vers le centre de la Terre", "une force dans le sens du mouvement", "aucune force"], "Pas d'air à 400 km (presque).", "Exact.") },
      { consigne: "D'après la deuxième loi de Newton, a = G·M/r², dirigée vers le centre ; pour un mouvement circulaire, aN = v²/r. Donc…", court: "Répondez dans le carnet.", question: choix(["le mouvement est circulaire uniforme et v = √(G·M/r)", "v = G·M/r", "la vitesse augmente à chaque tour"], "L'accélération n'a pas de composante tangentielle.", "Exact.") },
      { consigne: "Calculez v = √(G·M/(R + h)) pour h = 400 km (km/s) et comparez au réglage du logiciel.", court: "v (km/s) ?", question: nombre("km/s", Math.sqrt(MU / (R + 4e5)) / 1000, 0.04, "r = R + h en mètres.", "Exact : environ 7,67 km/s.") },
      { consigne: "Période de ce satellite (s), lue dans les résultats du logiciel ?", court: "T (s) ?", question: relatif("s", (f) => V.dernier(f, iss)?.T ?? 5545, 0.01, "Vérifiez T = 2π·r / v.", "Exact : environ 1 h 32 min.") },
      { consigne: "La vitesse d'un satellite en orbite circulaire dépend-elle de sa masse ?", court: "Répondez dans le carnet.", question: choix(["non : v = √(G·M/r) ne dépend que de M et de r", "oui : un satellite plus lourd va moins vite", "oui : un satellite plus lourd va plus vite"], "La masse m se simplifie dans la deuxième loi de Newton.", "Exact.") },
      { consigne: "Trouvez l'orbite circulaire dont la période vaut un jour sidéral (86 164 s) : le satellite et le point rouge de l'équateur tournent alors ensemble.", court: "Orbite géostationnaire.", aide_geste: "Augmentez r0, puis cherchez la vitesse de l'orbite circulaire.", verifier: ({ faits }) => V.lance(faits, geo) || false },
      { consigne: "Altitude du satellite géostationnaire (km) ?", court: "h (km) ?", question: nombre("km", 35786, 250, "h = r − R, lue dans les résultats.", "Exact : environ 35 800 km.") },
      { consigne: "Un satellite géostationnaire…", court: "Répondez dans le carnet.", question: choix(["tourne dans le plan de l'équateur, dans le sens de rotation de la Terre, en un jour sidéral : il reste au-dessus du même point", "est immobile dans le référentiel géocentrique", "peut passer au-dessus du pôle Nord"], "Il doit suivre la rotation de la Terre.", "Exact : antennes paraboliques fixes, télévision, météorologie.") },
    ],
  };

  L.demarrer({ id: "b2_meca2_s4_satellites", titre: "Laboratoire : satellites et planètes", paillasses: [L.poste_satellites], missions: [REFERENTIELS, KEPLER, SATELLITES] });
})(window.Labo);

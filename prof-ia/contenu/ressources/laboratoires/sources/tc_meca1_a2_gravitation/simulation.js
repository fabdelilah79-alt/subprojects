/*
Rôle : simulation de l'activité 2 du chapitre « Exemples d'actions mécaniques » (tronc commun) :
       « Mouvement de la Terre autour du Soleil, de la Lune autour de la Terre ». Objectif O2 : connaître et appliquer
       la loi de la gravitation universelle. Orientations : partir de l'observation des corps de l'Univers pour
       introduire la loi de Newton ; rappeler le principe des actions réciproques.
       Mission 1 : observer les mouvements et représenter les actions. Missions 2 et 3 : DÉCOUVRIR la loi avec
       des sondes (F proportionnelle à m, à M, à 1/d²), constater que F·d²/(m·M) vaut toujours la constante G,
       puis appliquer la loi au couple Terre-Lune.
Reçoit : rien (les vérifications lisent les faits notés par les scènes et le tableur).
Produit : la simulation démarrée : deux vues réalistes depuis l'espace (le Soleil n'est pas au laboratoire).
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const { G, M_T, M_L } = L.LOI_GRAVITATION;
  const V = L.VERIF_LOI;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const courbe = (x, y, n) => ({ courbe: c }) => c.x === x && c.y === y && c.n >= n;

  function fleches({ faits }) {
    // Les trois flèches-forces sont posées sur l'astre qui subit chaque action.
    if (Object.keys(faits.fleches_placees || {}).length === L.FLECHES_FORCES.length) return true;
    return faits.fleche_erreur || false;
  }

  const OBSERVER = {
    id: "observer", paillasse: 0, titre: "Le Soleil, la Terre et la Lune",
    objectif: "Observer les mouvements de la Terre autour du Soleil et de la Lune autour de la Terre, puis représenter les actions mécaniques qui s'exercent.",
    entetes: [],
    conclusion: "Le Soleil attire la Terre, la Terre attire la Lune : ces actions à distance (gravitation) les font tourner. Les actions réciproques sont égales et opposées.",
    conclusion_courte: "Gravitation : actions à distance, réciproques.",
    etapes: [
      { consigne: "Observez une année complète : la Terre fait un tour autour du Soleil, la Lune tourne autour de la Terre. Regardez leurs faces éclairées.", court: "Observez une année complète.", verifier: ({ faits }) => (faits.annees || 0) >= 1, aide_geste: "Saisissez la Terre pour arrêter le temps, faites-la glisser pour avancer ou reculer." },
      { consigne: "En une année, combien de nouvelles lunes y a-t-il (la Lune passe entre la Terre et le Soleil) ?", court: "Combien de nouvelles lunes en un an ?", question: { type: "nombre", unite: "", attendu: 12.4, tolerance: 0.65, aide: "Saisissez la Terre et avancez lentement le temps : comptez chaque passage de la Lune entre la Terre et le Soleil.", bravo: "Exact : 12 ou 13 nouvelles lunes par an (12,4 en moyenne)." } },
      { consigne: "La Terre ne part pas en ligne droite : elle tourne autour du Soleil. Pourquoi ?", court: "Répondez dans le carnet.", question: choix(["Le Soleil attire la Terre (action à distance : la gravitation)", "Le vent solaire pousse la Terre", "Aucune action ne s'exerce sur elle"], "Pour changer la direction d'un mouvement, il faut une action mécanique.", "Exact : c'est l'attraction gravitationnelle du Soleil.") },
      { consigne: "Posez chaque flèche-force sur l'astre qui subit l'action : F_{S/T} (Soleil sur Terre), F_{T/S} (Terre sur Soleil), F_{T/L} (Terre sur Lune).", court: "Posez les 3 flèches sur les bons astres.", verifier: fleches, aide_geste: "La flèche F_{A/B} se pose sur B : c'est B qui subit l'action de A." },
      { consigne: "Comparez F_{T/S} et F_{S/T} (principe des actions réciproques).", court: "Répondez dans le carnet.", question: choix(["Même droite d'action, même intensité, sens opposés", "F_{T/S} est beaucoup plus petite, car la Terre est plus légère", "F_{T/S} est nulle"], "Relisez le principe des actions réciproques.", "Exact : F_{T/S} = −F_{S/T}.") },
    ],
  };

  const MASSES = {
    id: "masses", paillasse: 1, titre: "De quoi dépend la force de gravitation ? Les masses",
    objectif: "Avec des sondes de masses différentes, découvrir comment la force exercée par un astre dépend des masses.",
    entetes: ["m (kg)", "F (N)"],
    donnees: ["Masse de la Terre : M_{T} = 5,97 × 10^{24} kg", "Masse de la Lune : M_{L} = 7,35 × 10^{22} kg"],
    conclusion: "La force de gravitation est proportionnelle à la masse m de la sonde et à la masse M de l'astre.",
    conclusion_courte: "F proportionnelle à m et à M.",
    etapes: [
      { consigne: "Saisissez une sonde. Approchez-la de la Terre, puis éloignez-la : lisez F_{T} sur son afficheur, pour au moins 3 distances.", court: "Approchez et éloignez une sonde de la Terre.", verifier: V.distances_variees, aide_geste: "Lâchez la sonde : elle se cale sur un multiple de 500 km. Zoomez sur l'afficheur." },
      { consigne: "Quand la sonde s'éloigne de la Terre, la force F_{T} exercée par la Terre…", court: "Répondez dans le carnet.", question: choix(["diminue", "augmente", "ne change pas"], "Comparez les valeurs lues sur l'afficheur.", "Exact : F_{T} diminue quand la distance augmente.") },
      { consigne: "Placez les 3 sondes, l'une après l'autre, sur le cercle de 20 000 km autour de la Terre. Notez m (kg) en A et F_{T} (N) en B.", court: "3 sondes à 20 000 km : notez m et F.", verifier: V.tableau_masses },
      { consigne: "Tracez F en fonction de m et modélisez par une droite.", court: "Tracez F en fonction de m.", verifier: courbe("A", "B", 3) },
      { consigne: "À distance égale, la force F est…", court: "Répondez dans le carnet.", question: choix(["proportionnelle à la masse m de la sonde", "indépendante de la masse m", "inversement proportionnelle à m"], "Regardez la forme de la courbe et le modèle.", "Exact : si m double, F double.") },
      { consigne: "Placez la sonde de 500 kg à 10 000 km de la Terre, puis à 10 000 km de la Lune (cercles de la Lune).", court: "Sonde de 500 kg : 10 000 km de la Terre, puis de la Lune.", verifier: V.deux_astres },
      { consigne: "À la même distance, combien de fois la force exercée par la Terre est-elle plus grande que celle exercée par la Lune ? Comparez avec M_{T} / M_{L}.", court: "F Terre / F Lune = ?", question: { type: "nombre", unite: "fois", attendu: M_T / M_L, tolerance: 2, aide: "Divisez F_{T} (près de la Terre) par F_{L} (près de la Lune), à 10 000 km chacun.", bravo: "Exact : environ 81, comme M_{T} / M_{L} : F est proportionnelle à M." } },
    ],
  };

  const DISTANCE = {
    id: "distance", paillasse: 1, titre: "De quoi dépend la force de gravitation ? La distance",
    objectif: "Découvrir comment la force dépend de la distance d entre les centres, puis reconnaître la constante G dans la loi.",
    entetes: ["d (km)", "F (N)", "1/d²", "F·d²/(m·M)"],
    donnees: ["Constante de gravitation universelle : G = 6,67 × 10^{−11} N·m²/kg² (la même partout dans l'Univers)", "Masse de la Terre : M_{T} = 5,97 × 10^{24} kg ; 1 km = 1000 m", "Distance Terre – Lune : 3,84 × 10^{8} m ; M_{L} = 7,35 × 10^{22} kg"],
    conclusion: "Loi de la gravitation universelle : F = G · m · M / d², avec G ≈ 6,67 × 10^{−11} N·m²/kg².",
    conclusion_courte: "F = G·m·M/d².",
    etapes: [
      { consigne: "Placez la sonde de 1000 kg à au moins 5 distances d de la Terre. Notez d (km) en A et F_{T} (N) en B ; en C, calculez 1/d² (=1/A2^2).", court: "Sonde 1000 kg : 5 distances, d, F et 1/d².", verifier: V.tableau_distances },
      { consigne: "Tracez F en fonction de d.", court: "Tracez F en fonction de d.", verifier: courbe("A", "B", 5) },
      { consigne: "Quand la distance d double (de 10 000 km à 20 000 km), la force F est…", court: "Répondez dans le carnet.", question: choix(["divisée par 4", "divisée par 2", "la même"], "Comparez F à 10 000 km et à 20 000 km dans votre tableau.", "Exact : d × 2 donne F ÷ 4 = F ÷ 2².") },
      { consigne: "Tracez F en fonction de 1/d² (colonne C) et modélisez par une droite.", court: "Tracez F en fonction de 1/d².", verifier: courbe("C", "B", 5) },
      { consigne: "F est donc proportionnelle à…", court: "Répondez dans le carnet.", question: choix(["1/d²", "1/d", "d"], "La courbe F = f(1/d²) est-elle une droite passant par l'origine ?", "Exact : F est proportionnelle à 1/d².") },
      { consigne: "Dans la colonne D, calculez pour chaque mesure le rapport F · d² / (m · M_{T}), avec d en mètre et m = 1000 kg.", court: "Colonne D : F·d²/(m·M) pour chaque ligne.", verifier: V.rapport_constant, aide_geste: "En D2 : =B2*(A2*1000)^2/(1000*5,97E24), puis recopiez vers le bas." },
      { consigne: "Que remarquez-vous dans la colonne D ?", court: "Répondez dans le carnet.", question: choix(["Le rapport est le même pour toutes les mesures : c'est la constante G = 6,67 × 10^{−11} N·m²/kg²", "Le rapport change avec la distance", "Le rapport dépend de la masse de la sonde"], "Comparez les valeurs de la colonne D entre elles, puis avec G.", "Exact : F · d² / (m · M) = G, donc F = G · m · M / d².") },
      { consigne: "Appliquez la loi : calculez l'intensité de la force exercée par la Terre sur la Lune.", court: "Calculez F Terre-Lune (en N).", question: { type: "nombre", unite: "N", attendu: (G * M_T * M_L) / Math.pow(3.84e8, 2), tolerance_relative: 0.03, aide: "=6,67E-11*5,97E24*7,35E22/(3,84E8)^2 ; répondez sous la forme 1,98E20.", bravo: "Exact : F ≈ 1,98 × 10^{20} N." } },
    ],
  };

  L.demarrer({ id: "tc_meca1_a2_gravitation", titre: "Observatoire : la gravitation", decor: "aucun", paillasses: [L.poste_systeme_solaire, L.poste_loi], missions: [OBSERVER, MASSES, DISTANCE] });
})(window.Labo);

/*
Rôle : simulation de l'activité 1 du chapitre « Modulation d'amplitude » (2e année du bac) : histoire de la transmission de
       l'information (documents, tri), répartition des bandes de fréquences (document, tri, λ = c/f), émission et
       réception d'une onde électromagnétique par deux antennes (même fréquence, amplitude qui diminue avec la distance,
       transport d'énergie sans transport de matière). Objectifs O1, O2.
Reçoit : rien (les vérifications lisent les faits des documents, des tableaux et « antennes »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const T = L.TRI_TRANSMISSION, A = (f) => f.antennes || {};

  const HISTOIRE = {
    id: "histoire", paillasse: 0, titre: "Histoire de la transmission",
    objectif: "Lire les documents ; ranger les moyens de communication selon ce qui porte l'information.",
    entetes: [],
    donnees: ["Vitesse des ondes électromagnétiques dans le vide : c ≈ 3,0 × 10⁸ m/s"],
    conclusion: "L'information a d'abord été portée par des signaux visibles ou sonores, puis par un courant dans des fils (télégraphe, téléphone), enfin par des ondes électromagnétiques (TSF, radio, télévision, téléphone portable) qui se propagent sans support matériel, à la vitesse de la lumière. Une onde transporte de l'énergie et de l'information sans transport de matière ; l'information est confiée à une onde porteuse de haute fréquence.",
    conclusion_courte: "Signaux, fils, puis ondes électromagnétiques.",
    etapes: [
      { consigne: "Lisez les quatre documents au mur.", court: "Lisez les documents.", aide_geste: "Touchez un document pour l'ouvrir, touchez-le de nouveau pour le refermer.", verifier: ({ faits }) => (faits.docs_histoire || []).length >= 4 || false },
      { consigne: "Rangez chaque moyen de communication selon ce qui porte l'information.", court: "Tableau : rangez les étiquettes.", aide_geste: "Faites glisser chaque étiquette jaune dans une colonne.", verifier: ({ faits }) => L.tableau_tri.verifier(T.histoire, faits.tri_histoire) },
      { consigne: "Une onde électromagnétique…", court: "Répondez dans le carnet.", question: choix(["transporte de l'énergie et de l'information, sans transport de matière", "transporte de la matière", "a besoin d'un fil pour se propager"], "Document « Les ondes de Hertz ».", "Exact.") },
      { consigne: "On n'émet pas directement le son (20 Hz à 20 kHz) parce que…", court: "Répondez dans le carnet.", question: choix(["il faudrait des antennes immenses et tous les émetteurs se brouilleraient : on le confie à une porteuse de haute fréquence", "le son ne contient pas d'information", "les ondes de basse fréquence n'existent pas"], "Document « De la TSF à nos jours » ; pensez à λ = c/f.", "Exact.") },
    ],
  };

  const BANDES = {
    id: "bandes", paillasse: 1, titre: "Les bandes de fréquences",
    objectif: "Lire le document ; ranger les services selon leur bande de fréquences ; calculer des longueurs d'onde.",
    entetes: [],
    donnees: ["λ = c / f, avec c ≈ 3,0 × 10⁸ m/s"],
    conclusion: "Le spectre des fréquences est partagé entre les services par des accords internationaux, pour que les émetteurs ne se brouillent pas : radio AM en kilohertz (grandes et petites ondes), radio FM vers 100 MHz, télévision en centaines de MHz, téléphone portable et Wi-Fi en gigahertz. Plus la fréquence est grande, plus la longueur d'onde λ = c/f est petite.",
    conclusion_courte: "Chaque service a sa bande ; λ = c/f.",
    etapes: [
      { consigne: "Lisez le document au mur.", court: "Lisez le document.", verifier: ({ faits }) => (faits.docs_bandes || []).length >= 1 || false },
      { consigne: "Rangez chaque service dans sa bande de fréquences.", court: "Tableau : rangez les services.", verifier: ({ faits }) => L.tableau_tri.verifier(T.bandes, faits.tri_bandes) },
      { consigne: "Longueur d'onde d'un émetteur grandes ondes de 200 kHz (m) ?", court: "λ (m) ?", question: nombre("m", 1500, 30, "λ = 3,0 × 10⁸ / 2,0 × 10⁵.", "Exact : 1,5 km.") },
      { consigne: "Longueur d'onde d'une radio FM de 100 MHz (m) ?", court: "λ (m) ?", question: nombre("m", 3, 0.1, "λ = 3,0 × 10⁸ / 1,0 × 10⁸.", "Exact : 3 m.") },
      { consigne: "Les fréquences sont partagées entre les services…", court: "Répondez dans le carnet.", question: choix(["pour que les émetteurs ne se brouillent pas", "pour que les ondes aillent plus vite", "parce qu'une onde ne peut porter qu'un seul son"], "Relisez le document.", "Exact.") },
    ],
  };

  const ANTENNES = {
    id: "antennes", paillasse: 2, titre: "Émettre et recevoir",
    objectif: "Émettre une onde avec une antenne, la recevoir avec une autre ; comparer les fréquences ; effet de la distance.",
    entetes: [],
    donnees: ["GBF de 100 kHz à 1 MHz", "Voie 1 : antenne réceptrice ; voie 2 : sortie du GBF", "Faites glisser l'antenne réceptrice le long de la règle"],
    conclusion: "Le GBF fait circuler dans l'antenne émettrice un courant variable : elle émet une onde électromagnétique. L'antenne réceptrice, placée dans cette onde, est le siège d'une tension de même fréquence que celle du GBF. Son amplitude diminue quand la distance augmente : l'énergie de l'onde se répartit dans l'espace. Rien de matériel ne va d'une antenne à l'autre : l'onde transporte de l'énergie et de l'information.",
    conclusion_courte: "Même fréquence ; amplitude qui diminue avec la distance.",
    etapes: [
      { consigne: "Reliez le GBF à l'antenne émettrice (SORTIE sur « antenne », masse sur « masse »). Oscilloscope : masse sur la masse de l'antenne réceptrice, voie 1 sur l'antenne réceptrice, voie 2 sur la SORTIE du GBF.", court: "Câblez l'émetteur et le récepteur.", verifier: ({ faits }) => (A(faits).emission && A(faits).reception && A(faits).voie2_gbf) || false },
      { consigne: "Mesurez la période de la tension reçue (voie 1) : fréquence f (kHz) ?", court: "f (kHz) ?", question: { ...nombre("kHz", (f) => (A(f).f || 100000) / 1000, null, "Nombre de divisions d'une période × balayage, puis f = 1/T.", "Exact."), tolerance_relative: 0.04 } },
      { consigne: "La tension reçue par l'antenne réceptrice…", court: "Répondez dans le carnet.", question: choix(["a la même fréquence que la tension du GBF", "a une fréquence plus petite", "est continue"], "Comparez les deux voies.", "Exact : une antenne reçoit à la fréquence de l'onde émise.") },
      { consigne: "Changez la fréquence du GBF (500 kHz) et observez de nouveau.", court: "f = 500 kHz.", verifier: ({ faits }) => (A(faits).f === 500000 && A(faits).reception) || false },
      { consigne: "Placez l'antenne réceptrice à 0,2 m, puis à 0,8 m de l'antenne émettrice.", court: "Éloignez l'antenne réceptrice.", aide_geste: "Faites glisser le chariot de l'antenne réceptrice.", verifier: ({ faits }) => (A(faits).d >= 0.8 && A(faits).reception) || false },
      { consigne: "Quand la distance augmente, l'amplitude de la tension reçue…", court: "Répondez dans le carnet.", question: choix(["diminue : l'énergie de l'onde se répartit dans l'espace", "augmente", "ne change pas"], "Lisez l'amplitude de la voie 1 aux deux distances.", "Exact.") },
      { consigne: "Entre les deux antennes, l'onde transporte…", court: "Répondez dans le carnet.", question: choix(["de l'énergie, sans transport de matière", "de la matière", "un courant dans l'air"], "Y a-t-il un fil entre les deux antennes ?", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_elec5_a1_histoire", titre: "Laboratoire : transmettre l'information", decor: "aucun", paillasses: [L.poste_histoire, L.poste_bandes, L.poste_antennes], missions: [HISTOIRE, BANDES, ANTENNES] });
})(window.Labo);

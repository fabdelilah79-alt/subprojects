/*
Rôle : paillasses de l'activité « techniques traditionnelles » : (1) quatre documents historiques au mur (enfleurage,
       macération, infusion et décoction, distillation) ; (2) comparer macération, infusion et décoction de feuilles de
       thé, avec le matériel physique (bécher d'eau froide à incliner, bouilloire qui verse, plaque chauffante, chronomètre) ; (3) tableau pour classer des préparations.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_documents_extraction, Labo.poste_comparer, Labo.poste_classer_techniques (groupe) -> { pense_bete } ;
          Labo.ETIQUETTES_TECHNIQUES ; faits « documents_extraction », « extraction_the » = { A, B, C : { eau, T, c }, plaque },
          « chronometre », « tri_techniques ».
Utilisé par : simulation.js.
*/
(function (L) {
  const doc = (x, y, titre, chaine, texte) => ({ x, y, l: 228, h: 170, taille: 5.3, titre, chaine, texte });
  const DOCS = [
    doc(280, 30, "L'enfleurage", ["fleurs fraîches", "(jasmin)", "graisse froide", "pommade parfumée"], "Au XIXe siècle, à Grasse (France), on étalait de la graisse froide sur des plaques de verre et l'on y posait des fleurs fragiles (jasmin, tubéreuse). Chaque jour, on remplaçait les fleurs fanées par des fleurs fraîches, pendant des semaines. La graisse chargée de parfum devenait une « pommade », que l'on lavait à l'alcool pour en retirer le parfum. Cette méthode très longue n'est presque plus utilisée."),
    doc(522, 30, "La macération", ["plante", "", "liquide froid", "macérat"], "On laisse tremper une plante dans un liquide (eau, huile, alcool) à la température ambiante, pendant des heures ou des jours. Exemples : la poudre de henné que l'on laisse tremper dans de l'eau avant de l'appliquer ; des plantes mises à macérer dans de l'huile d'olive."),
    doc(280, 214, "L'infusion et la décoction", ["plante", "", "eau très chaude", "tisane"], "Infusion : on verse de l'eau bouillante sur la plante et on laisse reposer quelques minutes, hors du feu (thé, verveine, menthe). Décoction : on fait bouillir la plante dans l'eau pendant plusieurs minutes ; on la réserve aux parties dures : racines, écorces, graines (cannelle, gingembre)."),
    doc(522, 214, "Les savants arabes et la distillation", ["pétales de rose", "+ eau", "alambic", "eau de rose"], "Le mot « alambic » vient de l'arabe al-inbiq. Aux Xe et XIe siècles, des savants comme Al-Razi et Ibn Sina (Avicenne) ont perfectionné la distillation, en particulier pour préparer l'eau de rose. Aujourd'hui encore, à Kelâa M'Gouna, dans la vallée du Dadès, on distille les roses pour produire de l'eau de rose."),
  ];
  L.ETIQUETTES_TECHNIQUES = [
    { id: "jasmin", texte: ["jasmin", "(parfum)"], colonne: 0 }, { id: "henne", texte: ["henné", "dans l'eau"], colonne: 1 },
    { id: "the", texte: ["thé", "à la menthe"], colonne: 2 }, { id: "verveine", texte: ["verveine", "(feuilles)"], colonne: 2 },
    { id: "cannelle", texte: ["bâtons de", "cannelle"], colonne: 3 }, { id: "gingembre", texte: ["racines de", "gingembre"], colonne: 3 },
  ];
  const pense = (g) => L.decor.pense_bete(g, 24, 52, 230);

  L.poste_documents_extraction = function (g) {
    // Paillasse 1 : quatre documents à lire.
    const pense_bete = pense(g);
    L.documents_mur(g, DOCS, "documents_extraction");
    return { pense_bete };
  };

  L.poste_comparer = function (g) {
    // Paillasse 2 (matériel aux vraies dimensions) : A eau froide (macération), B eau de la bouilloire (infusion),
    // C eau froide sur la plaque (décoction) ; le bécher d'eau froide se prend et s'incline au-dessus d'un bécher.
    const pense_bete = pense(g), ctx = L.paillasse_chimie(g), SOL = 576;
    L.ecoulement(ctx, { sol: SOL, e: 1.6 }); ctx.obstacles = [[110, 270], [541, 699]];
    const g_p = L.svg("g", { transform: "translate(620 576) scale(1.2) translate(-620 -576)" }, ctx.fond);
    const plaque = L.plaque_chauffante(g_p, { x: 620, bas: 576 });
    const A = L.becher_the(ctx, { id: "A", x: 360, y: SOL - 2.2, lettre: "A", texte: "macération" });
    const B = L.becher_the(ctx, { id: "B", x: 480, y: SOL - 2.2, lettre: "B", texte: "infusion" });
    const C = L.becher_the(ctx, { id: "C", x: 620, y: SOL - 36 * 1.2 - 2.2, lettre: "C", texte: "décoction" });
    L.manipuler(ctx, L.recipient(ctx, { id: "froide", profil: "becher_250", x: 780, y: SOL - 2.2, contenu: { eau: 230 }, etiquette: "eau froide" }), { sol: SOL - 2.2 });
    L.bouilloire(ctx, { x: 190, sol: 496, e: 1.6 });
    const chrono = L.chronometre(g, { x: 690, y: 170 });
    let avant = "";
    chrono.tic((dt) => {
      A.avancer(dt, false); B.avancer(dt, false); C.avancer(dt, plaque.allumee);
      const v = { ...Object.fromEntries([A, B, C].map((b) => [b.id, { eau: b.eau, V: Math.round(b.r.c.volume()), T: Math.round(b.T), c: Math.round(b.c * 100) / 100 }])), plaque: plaque.allumee };
      if (JSON.stringify(v) !== avant) { avant = JSON.stringify(v); L.missions.noter("extraction_the", v); }
    });
    return { pense_bete };
  };

  L.poste_classer_techniques = function (g) {
    // Paillasse 3 : chaque préparation dans la colonne de sa technique.
    const pense_bete = pense(g);
    L.tableau_tri(g, { x: 270, y: 40, largeur: 640, hauteur: 330, titre: "Quelle technique pour chaque préparation ?", colonnes: ["Enfleurage", "Macération", "Infusion", "Décoction"], etiquettes: [4, 0, 2, 5, 1, 3].map((k) => ({ ...L.ETIQUETTES_TECHNIQUES[k] })), fait: "tri_techniques" });
    return { pense_bete };
  };
})(window.Labo);

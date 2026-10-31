/*
Rôle : simulation de la partie « Particule chargée dans un champ électrostatique uniforme » du chapitre « Applications des lois de
       Newton » (2e année du bac, filières PC, SMA, SMB) : canon à électrons (E parallèle à v, mouvement accéléré,
       v0 = √(2·e·UA/m)) ; déviation entre deux plaques (E = UP/d perpendiculaire à v0, F = q·E, équations horaires, trajectoire
       parabolique y = e·E·x²/(2·m·v0²)) ; influence de E et de la vitesse sur la déviation ; application à l'oscilloscope. Objectif O6.
Reçoit : rien (les vérifications lisent « tube_e », « vues_ecran » et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const E_CH = 1.602e-19, ME = 9.109e-31, D = 0.05, choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const TU = (f) => f.tube_e || {}, VU = (f) => f.vues_ecran || [], y_th = (v, x) => (v.UP * x * x) / (4 * D * v.UA);
  const lu = (f, test) => VU(f).some(test), derniere = (f) => VU(f).filter((v) => v.UP > 0).slice(-1)[0];

  function trajectoire({ faits, feuille }) {
    // A : x (m), B : |y| (m) lus sur l'écran (à 1,5 mm près) pour les réglages de la dernière vue, C : x² ; quatre points.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), vue = derniere(faits);
    if (!vue) return false;
    let n_ok = 0;
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const x = v("A", n);
      if (!(x > 0 && x <= 0.1)) return `Ligne ${n} : en A, l'abscisse x en mètres (entre 0 et 0,10 m).`;
      if (Math.abs(Math.abs(v("B", n)) - y_th(vue, x)) > 0.0015) return `Ligne ${n} : en B, l'ordonnée y (en mètres) lue sur l'écran pour x = ${String(x).replace(".", ",")} m.`;
      if (Math.abs(v("C", n) - x * x) > 1e-6) return `Ligne ${n} : en C, =A${n}^2.`;
      n_ok++;
    }
    return n_ok >= 4 || false;
  }

  function deviations({ faits, feuille }) {
    // A : UP (V) ; B : déviation (m) à x = 10 cm, à UA = 4 000 V ; quatre tensions UP différentes, chacune vue à l'écran.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), tensions = new Set();
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const vue = VU(faits).find((w) => w.UA === 4000 && w.UP === v("A", n));
      if (!vue) return `Ligne ${n} : en A, une tension UP que vous avez réglée (UA = 4 000 V), puis regardé l'écran en grand.`;
      if (Math.abs(Math.abs(v("B", n)) - y_th(vue, 0.1)) > 0.0015) return `Ligne ${n} : en B, la déviation (m) lue à x = 10 cm.`;
      tensions.add(vue.UP);
    }
    return tensions.size >= 4 || false;
  }

  const CANON = {
    id: "canon", paillasse: 0, titre: "Le canon à électrons",
    conclusion: "Dans le canon, entre la cathode et l'anode, le champ électrostatique est parallèle à la vitesse : l'électron, soumis à F = −e·E, a un mouvement rectiligne accéléré et sort de l'anode avec la vitesse v0 = √(2·e·UA/m) (3,75 × 10⁷ m/s pour UA = 4 000 V). Son poids est négligeable devant la force électrique.",
    objectif: "Produire le faisceau d'électrons et calculer leur vitesse à la sortie du canon.",
    entetes: [], donnees: ["e = 1,60 × 10⁻¹⁹ C ; m = 9,11 × 10⁻³¹ kg", "Théorème de l'énergie cinétique : ½·m·v0² = e·UA", "Distance entre les plaques : d = 5,0 cm"],
    conclusion_courte: "Canon : v0 = √(2·e·UA/m).",
    etapes: [
      { consigne: "Mettez le chauffage du filament, puis réglez la tension accélératrice UA à 4 000 V : observez le faisceau sur l'écran.", court: "Chauffage, UA = 4 000 V.", aide_geste: "Interrupteur « Chauffage », puis bouton UA (glissez vers le haut ou touchez +).", verifier: ({ faits }) => (TU(faits).faisceau && TU(faits).UA === 4000) || false },
      { consigne: "Entre la cathode et l'anode, le champ est parallèle à la vitesse de l'électron. Son mouvement y est…", court: "Répondez dans le carnet.", question: choix(["rectiligne accéléré", "rectiligne uniforme", "circulaire"], "La force électrique a la direction du mouvement.", "Exact.") },
      { consigne: "Vitesse des électrons à la sortie du canon pour UA = 4 000 V (m/s) ?", court: "v0 (m/s) ?", question: relatif("m/s", Math.sqrt((2 * E_CH * 4000) / ME), 0.03, "½·m·v0² = e·UA.", "Exact : environ 3,75 × 10⁷ m/s.") },
      { consigne: "Sans tension entre les plaques, le faisceau reste horizontal, car…", court: "Répondez dans le carnet.", question: choix(["le poids de l'électron est négligeable : aucune force notable ne s'exerce sur lui", "le poids de l'électron est compensé par la poussée de l'air", "l'électron n'a pas de masse"], "Comparez m·g (≈ 10⁻²⁹ N) aux forces électriques (≈ 10⁻¹⁴ N).", "Exact : le mouvement est rectiligne uniforme entre les plaques.") },
    ],
  };

  const DEVIATION = {
    id: "deviation", paillasse: 0, titre: "Déviation entre les plaques",
    conclusion: "Entre les plaques, le champ E = UP/d est uniforme et perpendiculaire à v0. La deuxième loi de Newton donne a = e·E/m vers la plaque positive : x = v0·t (mouvement uniforme) et y = ½·(e·E/m)·t², d'où la trajectoire parabolique y = e·E·x²/(2·m·v0²) = UP·x²/(4·d·UA). Les électrons sont déviés vers la plaque positive.",
    objectif: "Observer la trajectoire, lire des points sur l'écran, vérifier que y est proportionnelle à x².",
    entetes: ["x (m)", "y (m)", "x² (m²)"],
    donnees: ["d = 5,0 cm ; E = UP / d", "x = v0·t ; y = ½·(e·E/m)·t²", "1 cm = 0,01 m"],
    conclusion_courte: "Trajectoire parabolique : y = UP·x² / (4·d·UA).",
    etapes: [
      { consigne: "UA = 4 000 V : réglez UP à 1 500 V, plaque positive en haut. Touchez l'écran du tube pour le voir en grand.", court: "UP = 1 500 V ; écran en grand.", verifier: ({ faits }) => lu(faits, (v) => v.UA === 4000 && v.UP === 1500 && v.sens === 1) || false },
      { consigne: "Le faisceau est dévié…", court: "Répondez dans le carnet.", question: choix(["vers la plaque positive : la force F = −e·E est opposée au champ", "vers la plaque négative", "il n'est pas dévié"], "Inversez la polarité et regardez.", "Exact.") },
      { consigne: "Valeur du champ entre les plaques E = UP / d (V/m) ?", court: "E (V/m) ?", question: relatif("V/m", 1500 / D, 0.02, "d = 5,0 cm = 0,050 m.", "Exact : 3,0 × 10⁴ V/m.") },
      { consigne: "Tableur : lisez sur l'écran y pour x = 2, 4, 6, 8 et 10 cm ; x (m) en A, y (m) en B, x² en C.", court: "Tableur : x, y, x².", aide_geste: "Écran en grand : un carreau = 1 cm, une petite division = 2 mm.", verifier: trajectoire },
      { consigne: "Tracez y (B) en fonction de x² (C), modèle y = a·x.", court: "Courbe y = f(x²).", verifier: ({ courbe: c }) => (c.x === "C" && c.y === "B" && c.n >= 4 && c.modele === "lineaire") || "Abscisse : C ; ordonnée : B ; modèle y = a·x." },
      { consigne: "Coefficient directeur (m⁻¹) ? Comparez à UP / (4·d·UA).", court: "Coefficient (m⁻¹) ?", question: relatif("m⁻¹", 1500 / (4 * D * 4000), 0.1, "Lisez a dans l'équation de la droite.", "Exact : 1,9 m⁻¹ environ.") },
      { consigne: "Avec x = v0·t et y = ½·(e·E/m)·t², la trajectoire s'écrit…", court: "Répondez dans le carnet.", question: choix(["y = e·E·x² / (2·m·v0²) : une parabole", "y = e·E·x / (m·v0) : une droite", "x² + y² = R² : un cercle"], "Éliminez t entre les deux équations.", "Exact.") },
    ],
  };

  const INFLUENCE = {
    id: "influence", paillasse: 0, titre: "Influence du champ et de la vitesse",
    conclusion: "À vitesse v0 fixée, la déviation à la sortie des plaques est proportionnelle à UP, donc au champ E. Pour UP fixé, elle diminue quand UA augmente : des électrons plus rapides restent moins longtemps entre les plaques. C'est le principe de l'oscilloscope : la déviation du spot est proportionnelle à la tension appliquée aux plaques.",
    objectif: "Mesurer la déviation à x = 10 cm pour plusieurs tensions UP, puis augmenter UA.",
    entetes: ["UP (V)", "y à 10 cm (m)"],
    donnees: ["UA = 4 000 V", "Déviation lue à la sortie des plaques (x = 10 cm)", "E = UP / d"],
    conclusion_courte: "Déviation proportionnelle à E ; plus faible si v0 est plus grande.",
    etapes: [
      { consigne: "UA = 4 000 V : pour quatre tensions UP (entre 500 et 2 000 V), regardez l'écran en grand et lisez la déviation y à x = 10 cm. UP en A, y (m) en B.", court: "Tableur : UP, déviation.", verifier: deviations },
      { consigne: "Tracez B en fonction de A, modèle y = a·x.", court: "Courbe y = f(UP).", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "B" && c.n >= 4 && c.modele === "lineaire") || "Abscisse : A ; ordonnée : B ; modèle y = a·x." },
      { consigne: "La déviation à la sortie des plaques est…", court: "Répondez dans le carnet.", question: choix(["proportionnelle à UP, donc au champ E", "indépendante de UP", "proportionnelle à UP²"], "La courbe est une droite passant par l'origine.", "Exact.") },
      { consigne: "UP = 1 500 V : augmentez UA jusqu'à 5 000 V et regardez l'écran en grand.", court: "UA = 5 000 V.", verifier: ({ faits }) => lu(faits, (v) => v.UA === 5000 && v.UP === 1500) || false },
      { consigne: "Quand UA augmente, la déviation…", court: "Répondez dans le carnet.", question: choix(["diminue : les électrons, plus rapides, restent moins longtemps entre les plaques", "augmente", "ne change pas"], "y = UP·x² / (4·d·UA).", "Exact.") },
      { consigne: "Dans un oscilloscope, la déviation du spot sert à…", court: "Répondez dans le carnet.", question: choix(["mesurer une tension : la déviation est proportionnelle à la tension appliquée aux plaques", "mesurer la masse des électrons", "chauffer l'écran"], "Pensez à la sensibilité verticale (V/div).", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_meca2_s2_champ_electrique", titre: "Laboratoire : électrons dans un champ électrostatique", paillasses: [L.poste_champ_electrique], missions: [CANON, DEVIATION, INFLUENCE] });
})(window.Labo);

/*
Rôle : simulation de l'activité 1 du chapitre « Applications des lois de Newton » (2e année du bac) : bille en chute libre
       filmée par une caméra, pointage vidéo à l'ordinateur (étalonnage, origine, pointage image par image), export au
       tableur, vitesse vy(t) et accélération ; équation différentielle d²y/dt² = −g et équations horaires du mouvement
       rectiligne uniformément varié ; l'accélération ne dépend pas de la masse. Objectifs O1, O2.
Reçoit : rien (les vérifications lisent « chutes », « pointage », la feuille de calcul et le graphique).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const G = 9.81, DT = 0.04;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const P = (f) => f.pointage || {}, C = (f) => f.chutes || [], derniere = (f) => C(f)[C(f).length - 1] || {};
  const pointee = (f, bille) => derniere(f).bille === bille && P(f).video === derniere(f).id && P(f).echelle_ok && P(f).origine && (P(f).points || []).length >= 10;

  function tableau({ faits, feuille }) {
    // A, B, C : t, x, y exportés (dix lignes au moins) ; D : vy = (y suivant − y précédent) / (2Δt) sur sept lignes au moins.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), pts = P(faits).points || [];
    let lignes = 0, vitesses = 0;
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const p = pts.find((q) => Math.abs(q.t - v("A", n)) < 1e-3);
      if (!p || Math.abs(v("C", n) - p.y) > 1e-3) return `Ligne ${n} : touchez « Exporter » dans le logiciel pour copier t, x, y.`;
      lignes++;
      if (v("D", n) === null) continue;
      if (v("C", n - 1) === null || v("C", n + 1) === null) return `Ligne ${n} : vy demande les lignes voisines ; commencez en D3.`;
      const vy = (v("C", n + 1) - v("C", n - 1)) / (v("A", n + 1) - v("A", n - 1));
      if (Math.abs(v("D", n) - vy) > 0.01 * Math.abs(vy) + 0.005) return `Ligne ${n} : en D, vy = (C${n + 1} − C${n - 1}) / (2 × 0,04).`;
      vitesses++;
    }
    return (lignes >= 10 && vitesses >= 7) || false;
  }

  const droite = (f, c) => (c.x === "A" && c.y === "D" && c.n >= 7 && c.modele === "affine") || "Abscisse : A (t) ; ordonnée : D (vy) ; modèle y = a·x + b.";

  const CHUTE = {
    id: "chute", paillasse: 0, titre: "Une bille en chute libre",
    objectif: "Filmer la chute d'une bille, la pointer image par image ; déterminer vy(t) et l'accélération.",
    entetes: ["t (s)", "x (m)", "y (m)", "vy (m/s)"],
    donnees: ["Caméra : 25 images par seconde (Δt = 0,04 s) ; la vidéo commence au lâcher", "Axe Oy vertical, vers le haut", "vy ≈ (y(i+1) − y(i−1)) / (2Δt)"],
    conclusion: "La bille n'est soumise qu'à son poids (l'action de l'air est négligeable) : c'est une chute libre. La deuxième loi de Newton donne m·a = m·g, soit d²y/dt² = −g sur un axe vertical vers le haut. vy(t) est une droite : vy = −g·t + v0y ; y = −½·g·t² + v0y·t + y0. Le mouvement est rectiligne uniformément varié ; l'accélération vaut g ≈ 9,8 m/s².",
    conclusion_courte: "Chute libre : d²y/dt² = −g ; mouvement uniformément varié.",
    etapes: [
      { consigne: "La bille d'acier est accrochée à l'électroaimant. Appuyez sur « Lâcher » : elle tombe dans le bac et la caméra filme.", court: "Lâchez la bille d'acier.", verifier: ({ faits }) => derniere(faits).bille === "acier" || false },
      { consigne: "Dans le logiciel : touchez « Échelle », puis les repères 0 et 100 cm de la règle filmée (1 m).", court: "Étalonnez l'échelle.", aide_geste: "Zoomez à deux doigts pour cliquer précisément.", verifier: ({ faits }) => P(faits).echelle_ok || (P(faits).echelle ? "Échelle imprécise : recommencez en cliquant exactement sur les traits 0 et 100 cm." : false) },
      { consigne: "Touchez « Origine » et cliquez sur la bille de l'image 0 ; puis pointez la bille sur chaque image (au moins dix).", court: "Origine, puis pointage.", verifier: ({ faits }) => pointee(faits, "acier") || false },
      { consigne: "Touchez « Exporter » : t, x, y vont dans les colonnes A, B, C. En D (de D3 à D9 au moins), calculez vy = (y suivant − y précédent) / (2 × 0,04).", court: "Tableur : vy en D.", verifier: tableau },
      { consigne: "Tracez vy (D) en fonction de t (A) et modélisez par y = a·x + b.", court: "Courbe vy = f(t).", verifier: ({ faits, courbe }) => droite(faits, courbe) },
      { consigne: "Valeur de l'accélération |a| (m/s²) ?", court: "|a| (m/s²) ?", question: nombre("m/s²", G, 0.6, "Coefficient directeur de la droite, en valeur absolue.", "Exact : g ≈ 9,8 m/s².") },
      { consigne: "Vitesse initiale v0y : ordonnée à l'origine de la droite (m/s) ?", court: "v0y (m/s) ?", question: nombre("m/s", 0, 0.25, "Lisez b dans l'équation de la droite.", "Exact : la bille est lâchée sans vitesse.") },
      { consigne: "vy(t) est une droite : le mouvement est…", court: "Répondez dans le carnet.", question: choix(["rectiligne uniformément varié : l'accélération est constante", "rectiligne uniforme", "circulaire"], "La pente est constante.", "Exact.") },
      { consigne: "Avec un axe Oy vertical vers le haut, la deuxième loi de Newton donne…", court: "Répondez dans le carnet.", question: choix(["d²y/dt² = −g, d'où y = −½·g·t² + v0y·t + y0", "d²y/dt² = 0, d'où y = v0·t", "dy/dt = −g·t², d'où y = −g·t"], "Seule force : le poids m·g, vertical vers le bas.", "Exact.") },
    ],
  };

  const MASSE = {
    id: "masse", paillasse: 0, titre: "La masse compte-t-elle ?",
    objectif: "Recommencer avec une bille de verre (5 g) ; comparer les accélérations.",
    entetes: ["t (s)", "x (m)", "y (m)", "vy (m/s)"],
    donnees: ["Bille d'acier : 33 g ; bille de verre : 5 g, de même taille"],
    conclusion: "La bille de verre, presque sept fois plus légère, tombe avec la même accélération g : en chute libre, l'accélération ne dépend pas de la masse (m·a = m·g, la masse se simplifie). Une chute libre ne fait intervenir que le poids ; pour un objet léger et grand (feuille, plume), l'action de l'air n'est plus négligeable et la chute n'est plus libre.",
    conclusion_courte: "En chute libre, a = g, quelle que soit la masse.",
    etapes: [
      { consigne: "Touchez « Raccrocher », touchez la bille de verre (coupelle), puis « Lâcher ». Étalonnez, placez l'origine et pointez au moins dix images.", court: "Filmez et pointez la bille de verre.", aide_geste: "On ne peut changer de bille que lorsque l'électroaimant est raccroché.", verifier: ({ faits }) => pointee(faits, "verre") || false },
      { consigne: "Exportez ; en D, calculez vy comme pour la bille d'acier.", court: "Tableur : vy en D.", verifier: tableau },
      { consigne: "Tracez vy (D) en fonction de t (A), modèle y = a·x + b.", court: "Courbe vy = f(t).", verifier: ({ faits, courbe }) => droite(faits, courbe) },
      { consigne: "Accélération de la bille de verre |a| (m/s²) ?", court: "|a| (m/s²) ?", question: nombre("m/s²", G, 0.6, "Coefficient directeur.", "Exact.") },
      { consigne: "En chute libre, l'accélération…", court: "Répondez dans le carnet.", question: choix(["ne dépend pas de la masse : m·a = m·g, d'où a = g", "est plus grande pour la bille la plus lourde", "est plus grande pour la bille la plus légère"], "Comparez vos deux valeurs.", "Exact.") },
      { consigne: "Un solide est en chute libre quand…", court: "Répondez dans le carnet.", question: choix(["il n'est soumis qu'à son poids", "il tombe verticalement", "sa vitesse est constante"], "Pensez à une feuille de papier qui tombe.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_meca2_a1_chute", titre: "Laboratoire : la chute libre", paillasses: [L.poste_chute], missions: [CHUTE, MASSE] });
})(window.Labo);

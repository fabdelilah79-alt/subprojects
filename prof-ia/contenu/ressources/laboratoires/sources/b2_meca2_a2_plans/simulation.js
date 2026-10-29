/*
Rôle : simulation de l'activité 2 du chapitre « Applications des lois de Newton » (2e année du bac) : solide de 200 g sur un
       plan horizontal puis incliné (α = 25°), chariot (frottements négligeables) ou pavé de bois (frottements), filmé et
       pointé ; vx(t) au tableur ; ẍ = 0 (mouvement uniforme) ou ẍ = constante ; deuxième loi de Newton projetée sur la
       direction du mouvement : a = g·sin α sans frottement, f = m·(g·sin α − a) avec frottement. Objectifs O2, O3.
Reçoit : rien (les vérifications lisent « essais_plan », « pointage », la feuille de calcul et le graphique).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const G = 9.81, M = 0.2, S25 = Math.sin((25 * Math.PI) / 180), C25 = Math.cos((25 * Math.PI) / 180);
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const P = (f) => f.pointage || {}, E = (f) => f.essais_plan || [], dernier = (f) => E(f)[E(f).length - 1] || {};
  const filme = (f, solide, alpha) => dernier(f).solide === solide && dernier(f).alpha === alpha && P(f).video === dernier(f).id;
  const pointe = (f, solide, alpha, n) => (filme(f, solide, alpha) && P(f).echelle_ok && P(f).origine && (P(f).points || []).length >= n) || false;

  function tableau({ faits, feuille }) {
    // A, B : t, x exportés (six lignes au moins) ; D : vx = (x suivant − x précédent) / (2Δt) sur quatre lignes au moins.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), pts = P(faits).points || [];
    let lignes = 0, vitesses = 0;
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const p = pts.find((q) => Math.abs(q.t - v("A", n)) < 1e-3);
      if (!p || Math.abs(v("B", n) - p.x) > 1e-3) return `Ligne ${n} : touchez « Exporter » dans le logiciel pour copier t, x, y.`;
      lignes++;
      if (v("D", n) === null) continue;
      if (v("B", n - 1) === null || v("B", n + 1) === null) return `Ligne ${n} : vx demande les lignes voisines ; commencez en D3.`;
      const vx = (v("B", n + 1) - v("B", n - 1)) / (v("A", n + 1) - v("A", n - 1));
      if (Math.abs(v("D", n) - vx) > 0.01 * Math.abs(vx) + 0.005) return `Ligne ${n} : en D, vx = (B${n + 1} − B${n - 1}) / (2 × 0,04).`;
      vitesses++;
    }
    return (lignes >= 6 && vitesses >= 4) || false;
  }

  const droite = (c) => (c.x === "A" && c.y === "D" && c.n >= 4 && c.modele === "affine") || "Abscisse : A (t) ; ordonnée : D (vx) ; modèle y = a·x + b.";
  const etapes_mesure = (solide, alpha, texte) => [
    { consigne: texte, court: `Lancez le ${solide === "pave" ? "pavé" : "chariot"} (α = ${alpha}°).`, aide_geste: "Réglages du plan : angle, solide, lanceur ; puis « Lancer ».", verifier: ({ faits }) => filme(faits, solide, alpha) || false },
    { consigne: "Logiciel : « Échelle » (repères 0 et 100 cm de la règle filmée), « Origine » sur le solide de l'image 0, puis pointez le repère jaune du solide sur chaque image (six au moins).", court: "Étalonnez et pointez.", verifier: ({ faits }) => pointe(faits, solide, alpha, 6) },
    { consigne: "« Exporter » ; en D (à partir de D3), calculez vx = (x suivant − x précédent) / (2 × 0,04).", court: "Tableur : vx en D.", verifier: tableau },
    { consigne: "Tracez vx (D) en fonction de t (A), modèle y = a·x + b.", court: "Courbe vx = f(t).", verifier: ({ courbe }) => droite(courbe) },
  ];

  const HORIZONTAL = {
    id: "horizontal", paillasse: 0, titre: "Sur un plan horizontal",
    objectif: "Lancer un chariot, puis un pavé de bois, sur la planche horizontale ; comparer leurs vitesses.",
    entetes: ["t (s)", "x (m)", "y (m)", "vx (m/s)"],
    donnees: ["Solides : m = 200 g ; lanceur à ressort : v0 = 1,4 m/s", "Caméra : 25 images/s (Δt = 0,04 s), inclinée comme la planche", "Deuxième loi : P + R = m·aG"],
    conclusion: "Sur le plan horizontal, le chariot garde une vitesse constante : ẍ = 0, le mouvement est rectiligne uniforme, P et R se compensent. Le pavé ralentit avec une accélération constante a ≈ −2,9 m/s² : la réaction du plan a une composante tangentielle f, opposée au mouvement (frottement) ; la deuxième loi projetée sur l'axe du mouvement donne −f = m·a, soit f = m·|a| ≈ 0,59 N.",
    conclusion_courte: "Sans frottement : ẍ = 0 ; avec frottement : −f = m·a.",
    etapes: [
      ...etapes_mesure("chariot", 0, "Planche horizontale (α = 0°), chariot, lanceur armé : appuyez sur « Lancer »."),
      { consigne: "Coefficient directeur a de la droite vx = f(t) pour le chariot (m/s²) ?", court: "a (m/s²) ?", question: nombre("m/s²", 0, 0.3, "Lisez a dans l'équation de la droite.", "Exact : ẍ ≈ 0.") },
      { consigne: "Le chariot a donc un mouvement…", court: "Répondez dans le carnet.", question: choix(["rectiligne uniforme : ẍ = 0, P et R se compensent", "uniformément accéléré", "circulaire"], "vx ne varie pas.", "Exact : c'est le principe d'inertie.") },
      ...etapes_mesure("pave", 0, "Choisissez le pavé de bois (lanceur armé, α = 0°) et lancez-le."),
      { consigne: "Accélération a du pavé (m/s²) ?", court: "a (m/s²) ?", question: nombre("m/s²", -G * 0.3, 0.3, "Coefficient directeur de la droite (négatif : il ralentit).", "Exact.") },
      { consigne: "Intensité de la force de frottement f = m·|a| (N), avec m = 200 g ?", court: "f (N) ?", question: nombre("N", M * G * 0.3, 0.07, "Deuxième loi sur l'axe du mouvement : −f = m·a.", "Exact : environ 0,6 N.") },
    ],
  };

  const INCLINE = {
    id: "incline", paillasse: 0, titre: "Sur un plan incliné",
    objectif: "Lâcher le chariot puis le pavé en haut de la planche inclinée à 25° ; déterminer a et le frottement.",
    entetes: ["t (s)", "x (m)", "y (m)", "vx (m/s)"],
    donnees: ["Axe x le long de la planche, vers le bas", "Sans frottement : a = g·sin α ; avec frottement : m·a = m·g·sin α − f", "g = 9,81 m/s²"],
    conclusion: "Sur le plan incliné, l'accélération est constante : ẍ = cte, le mouvement est rectiligne uniformément varié, x = ½·a·t² + v0·t + x0. Sans frottement, la deuxième loi projetée donne a = g·sin α ≈ 4,1 m/s² pour α = 25°. Avec frottement, a = g·sin α − f/m est plus petite (≈ 1,5 m/s²), d'où f = m·(g·sin α − a) ≈ 0,53 N. Pour une pente faible (α = 10°), le pavé reste immobile : le frottement compense la composante du poids le long du plan.",
    conclusion_courte: "ẍ = cte ; a = g·sin α − f/m.",
    etapes: [
      ...etapes_mesure("chariot", 25, "Réglez α = 25°, chariot, lâcher sans vitesse (lanceur désarmé) ; appuyez sur « Lancer »."),
      { consigne: "Accélération a du chariot (m/s²) ?", court: "a (m/s²) ?", question: nombre("m/s²", G * S25, 0.3, "Coefficient directeur.", "Exact : a = g·sin α.") },
      ...etapes_mesure("pave", 25, "Recommencez avec le pavé de bois (α = 25°, sans vitesse)."),
      { consigne: "Accélération a du pavé (m/s²) ?", court: "a (m/s²) ?", question: nombre("m/s²", G * (S25 - 0.3 * C25), 0.25, "Coefficient directeur.", "Exact.") },
      { consigne: "Intensité de la force de frottement f = m·(g·sin α − a) (N) ?", court: "f (N) ?", question: nombre("N", M * G * 0.3 * C25, 0.08, "m = 0,200 kg ; sin 25° = 0,423.", "Exact : environ 0,53 N.") },
      { consigne: "Réglez α = 10° et lâchez le pavé.", court: "Pavé, α = 10°.", verifier: ({ faits }) => (dernier(faits).solide === "pave" && dernier(faits).alpha === 10 && dernier(faits).arret) || false },
      { consigne: "À 10°, le pavé ne glisse pas parce que…", court: "Répondez dans le carnet.", question: choix(["le frottement compense la composante du poids le long du plan", "son poids est nul", "la planche le repousse vers le haut"], "La composante m·g·sin α est petite.", "Exact.") },
      { consigne: "Pour un mouvement rectiligne avec ẍ = constante, l'équation horaire est…", court: "Répondez dans le carnet.", question: choix(["x = ½·a·t² + v0·t + x0", "x = a·t + x0", "x = v0·t²"], "Intégrez deux fois ẍ = a.", "Exact : mouvement rectiligne uniformément varié.") },
    ],
  };

  L.demarrer({ id: "b2_meca2_a2_plans", titre: "Laboratoire : solide sur un plan", paillasses: [L.poste_plan], missions: [HORIZONTAL, INCLINE] });
})(window.Labo);

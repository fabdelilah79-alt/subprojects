/*
Rôle : simulation de l'activité 2 du chapitre « Lois de Newton » (2e année du bac) : vérification expérimentale de
       ΣF = m·ΔvG/Δt sur la table à coussin d'air inclinée, en faisant varier la masse (surcharge) et la force (pente) ;
       rôle de la masse, application ; puis référentiels galiléens et troisième loi (documents, tri, questions).
       Objectifs O4, O5, O6, O7.
Reçoit : rien (les vérifications lisent « essais », l'enregistrement, la feuille de calcul, le graphique et les tris).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const G = 9.81;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const E = (f) => f.essais || [];

  function tableau({ faits, feuille }) {
    // Au moins quatre essais différents (deux masses, deux pentes) : m, ΣF = m·g·sin α, ΔvG/Δt, m·ΔvG/Δt.
    const l = feuille.lignes(["A", "B", "C", "D"]), es = E(faits);
    if (l.length < 4) return false;
    const vus = [];
    for (const [k, r] of l.entries()) {
      const x = es.find((s) => Math.abs(s.m - r.A) < 1e-6 && Math.abs(r.B - s.m * G * s.sin) <= 0.01 * r.B + 1e-4);
      if (!x) return `Ligne ${k + 2} : en A la masse (kg) d'un de vos enregistrements, en B ΣF = m·g·sin α (N) pour sa pente.`;
      if (Math.abs(r.C - G * x.sin) > 0.08 * G * x.sin) return `Ligne ${k + 2} : en C, ΔvG/Δt mesurée sur cet enregistrement (m/s²) : (vj − vi) / ((j − i)·τ).`;
      if (Math.abs(r.D - r.A * r.C) > 0.005 * r.D + 1e-4) return `Ligne ${k + 2} : en D, m·ΔvG/Δt : =A${k + 2}*C${k + 2}.`;
      vus.push(x);
    }
    const n = (cle) => new Set(vus.map((x) => x[cle])).size;
    return (new Set(vus.map((x) => `${x.m}:${x.sin}`)).size >= 4 && n("m") >= 2 && n("sin") >= 2) || "Il faut quatre essais différents : deux masses (avec et sans surcharge) et deux pentes au moins.";
  }

  const premier = (f) => E(f).some((s) => s.m === 0.6 && s.sin === 0.05 && s.n >= 16);

  const LOI = {
    id: "loi", paillasse: 0, titre: "Vérifier ΣF = m·ΔvG/Δt",
    objectif: "Mesurer l'accélération d'un mobile sur une pente pour plusieurs masses et plusieurs pentes ; comparer m·ΔvG/Δt à ΣF.",
    entetes: ["m (kg)", "ΣF (N)", "ΔvG/Δt (m/s²)", "m·ΔvG/Δt (N)"],
    donnees: ["Mobile : 600 g ; surcharge : 300 g ; g = 9,81 N/kg", "Cales de 1,5 ; 2,5 ; 4 cm sous des pieds distants de 50 cm : sin α = 0,030 ; 0,050 ; 0,080", "Sans frottement : ΣF = P + R = m·g·sin α le long de la pente"],
    conclusion: "Dans un référentiel galiléen, la somme vectorielle des forces extérieures appliquées à un solide est égale au produit de sa masse par l'accélération de son centre d'inertie : ΣFext = m·aG (deuxième loi de Newton, ou théorème du centre d'inertie). Pour une même force, plus la masse est grande, plus l'accélération est petite : la masse mesure l'inertie du solide. Équation aux dimensions : 1 N = 1 kg·m/s².",
    conclusion_courte: "ΣFext = m·aG ; 1 N = 1 kg·m/s².",
    etapes: [
      { consigne: "Glissez la cale de 2,5 cm sous la table. Appuyez sur « Enregistrer », posez le mobile (600 g) en haut et lâchez-le sans élan.", court: "Enregistrez une descente (600 g, 2,5 cm).", aide_geste: "Touchez une cale pour la glisser sous les pieds du fond de la table.", verifier: ({ faits }) => premier(faits) || false },
      { consigne: "Sur la feuille, mesurez v₅ et v₁₅ ; ΔvG/Δt = (v₁₅ − v₅) / (10·τ) (m/s²) ?", court: "ΔvG/Δt (m/s²) ?", question: nombre("m/s²", G * 0.05, 0.04, "vi = Mi−1Mi+1 / (2τ) ; Δt = 10·τ.", "Exact.") },
      { consigne: "Faites au moins quatre essais : avec et sans la surcharge de 300 g, avec au moins deux pentes. Tableur : en A : m (kg) ; en B : ΣF = m·g·sin α (N) ; en C : ΔvG/Δt mesurée (m/s²) ; en D : m·ΔvG/Δt (N).", court: "Tableur : m, ΣF, ΔvG/Δt, m·ΔvG/Δt.", aide_geste: "Posez la surcharge sur le mobile immobile ; changez de cale entre deux essais.", verifier: tableau },
      { consigne: "Tracez m·ΔvG/Δt (D) en fonction de ΣF (B).", court: "Courbe m·ΔvG/Δt = f(ΣF).", verifier: ({ courbe }) => (courbe.x === "B" && courbe.y === "D" && courbe.n >= 4) || "Abscisse : B ; ordonnée : D." },
      { consigne: "Les points sont sur une droite passant par l'origine, de coefficient directeur 1 : …", court: "Répondez dans le carnet.", question: choix(["ΣF = m·ΔvG/Δt : la deuxième loi de Newton est vérifiée", "ΣF = ΔvG/Δt", "la force ne dépend pas de la masse"], "Comparez les colonnes B et D.", "Exact.") },
      { consigne: "Pour une même force, si la masse double, l'accélération…", court: "Répondez dans le carnet.", question: choix(["est deux fois plus petite : la masse mesure l'inertie", "double", "ne change pas"], "aG = ΣF / m.", "Exact.") },
      { consigne: "Le mobile surchargé (0,90 kg) part du repos sur la pente de 4 cm (sin α = 0,080). Sa vitesse au bout de 0,50 s (m/s) ?", court: "v (m/s) ?", question: nombre("m/s", G * 0.08 * 0.5, 0.01, "aG = g·sin α (la masse se simplifie) ; v = aG·t.", "Exact : environ 0,39 m/s.") },
      { consigne: "L'équation aux dimensions de ΣF = m·aG montre que 1 N vaut…", court: "Répondez dans le carnet.", question: choix(["1 kg·m/s²", "1 kg·m/s", "1 kg/s²"], "[m]·[a] = kg × m/s².", "Exact.") },
    ],
  };

  const REFERENTIELS = {
    id: "referentiels", paillasse: 1, titre: "Référentiels galiléens et troisième loi",
    objectif: "Lire les documents ; reconnaître les référentiels galiléens ; appliquer la troisième loi de Newton.",
    entetes: [],
    donnees: ["Référentiel galiléen : le principe d'inertie y est vérifié", "Troisième loi : F(A/B) = −F(B/A)"],
    conclusion: "Les lois de Newton s'appliquent dans un référentiel galiléen : le référentiel terrestre pour des expériences courtes, le référentiel géocentrique pour les satellites, le référentiel héliocentrique pour les planètes. Un référentiel accéléré par rapport à eux (bus qui freine, manège) n'est pas galiléen. Troisième loi : deux corps en interaction exercent l'un sur l'autre des forces opposées, de même droite d'action et de même intensité, qui s'appliquent à deux corps différents.",
    conclusion_courte: "Référentiel galiléen ; F(A/B) = −F(B/A).",
    etapes: [
      { consigne: "Lisez les quatre documents au mur.", court: "Lisez les documents.", aide_geste: "Touchez un document pour l'ouvrir, touchez-le de nouveau pour le refermer.", verifier: ({ faits }) => (faits.docs_newton || []).length >= 4 || false },
      { consigne: "Rangez chaque référentiel dans la bonne colonne.", court: "Tableau : galiléen ou non ?", verifier: ({ faits }) => L.tableau_tri.verifier(L.TRI_REFERENTIELS, faits.tri_referentiels) },
      { consigne: "Un référentiel est galiléen si…", court: "Répondez dans le carnet.", question: choix(["le principe d'inertie y est vérifié", "il est lié au Soleil", "il est immobile"], "Document « Référentiels galiléens ».", "Exact.") },
      { consigne: "Le mobile pousse sur la table avec une force F. La table exerce sur le mobile…", court: "Répondez dans le carnet.", question: choix(["une force −F : même droite d'action, même intensité, sens contraire", "une force plus petite", "aucune force"], "Troisième loi de Newton.", "Exact.") },
      { consigne: "La Terre attire la Lune ; la Lune attire la Terre avec une force…", court: "Répondez dans le carnet.", question: choix(["de même intensité", "beaucoup plus faible, car la Lune est plus légère", "nulle"], "La troisième loi s'applique aussi à distance.", "Exact : mais l'accélération de la Terre est bien plus petite.") },
      { consigne: "Deux patineurs se poussent : A (60 kg) exerce sur B (40 kg) une force de 120 N. Accélération de B (m/s²) ?", court: "aB (m/s²) ?", question: nombre("m/s²", 3, 0.05, "B reçoit 120 N ; aB = F / mB.", "Exact : et A reçoit aussi 120 N, aA = 2 m/s².") },
    ],
  };

  L.demarrer({ id: "b2_meca1_a2_newton", titre: "Laboratoire : deuxième loi de Newton", paillasses: [L.poste_newton, L.poste_referentiels], missions: [LOI, REFERENTIELS] });
})(window.Labo);

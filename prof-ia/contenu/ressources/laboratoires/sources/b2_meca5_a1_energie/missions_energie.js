/*
Rôle : missions des paillasses 1 et 2 du chapitre « Aspects énergétiques des oscillateurs mécaniques » (2e année du bac) :
       travail de la force d'un ressort par la méthode graphique (aire sous F = f(x)), énergie potentielle élastique
       Epe = ½·K·x² ; énergie mécanique du solide-ressort horizontal, conservée sans frottement, non conservée avec la palette.
Reçoit : rien (les vérifications lisent « traction », « essais_ressort », « acquisition », la feuille et le graphique).
Produit : Labo.MISSIONS_ENERGIE = [TRAVAIL, RESSORT] ; Labo.questions_energie = { choix, relatif } (aides à écrire les questions).
Utilisé par : simulation.js.
*/
(function (L) {
  const K = 20;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const E = (f) => f.essais_ressort || [], dernier = (f, a) => E(f).filter((e) => e.amortisseur === a).pop();
  const fini = (f, a) => { const e = dernier(f, a); if (!e) return false; if (Math.abs(e.x0) < 0.03) return "Écartez le mobile d'au moins 3 cm avant de le lâcher."; return (f.acquisition?.etat === "terminée" && f.acquisition?.n >= 1) || "Touchez « Acquérir » avant de lâcher le mobile."; };

  function releves({ feuille }) {
    // A : x (m) entre 0 et 10 cm ; B : F (N) lue au dynamomètre (à 0,06 N près de K·x) ; cinq relevés au moins.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`);
    let lignes = 0;
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      if (v("A", n) < 0 || v("A", n) > 0.105) return `Ligne ${n} : en A, l'allongement x en mètres (entre 0 et 0,10 m).`;
      if (v("B", n) === null || Math.abs(v("B", n) - K * v("A", n)) > 0.06) return `Ligne ${n} : en B, la force F (N) lue au dynamomètre pour cet allongement.`;
      lignes++;
    }
    return lignes >= 5 || false;
  }

  const TRAVAIL = {
    id: "travail", paillasse: 0, titre: "Travail de la force d'un ressort",
    objectif: "Allonger le ressort avec le dynamomètre, tracer F = f(x) et calculer le travail par l'aire sous la courbe.",
    entetes: ["x (m)", "F (N)", "", ""], donnees: ["Ressort vert : K = 20 N/m", "x : allongement lu sous l'index du mobile", "Travail : aire sous la courbe F = f(x)"],
    conclusion: "La tension du ressort vaut T = K·x et s'oppose à l'allongement. Quand l'allongement passe de 0 à x, son travail est l'opposé de l'aire sous la droite F = K·x : W(T) = −½·K·x² ; entre x1 et x2, W(T) = −(½·K·x2² − ½·K·x1²). On définit l'énergie potentielle élastique Epe = ½·K·x² + cte ; avec l'état de référence Epe = 0 à l'équilibre (x = 0), Epe = ½·K·x², et W(T) = −ΔEpe.",
    conclusion_courte: "W(T) = −½·K·x² ; Epe = ½·K·x² (Epe = 0 en x = 0).",
    etapes: [
      { consigne: "Faites glisser la noix vers la droite : le dynamomètre allonge le ressort ; allez jusqu'à x = 8 cm environ.", court: "Allongez le ressort.", aide_geste: "La noix reste là où vous la lâchez ; l'index rouge du mobile montre x sur la règle.", verifier: ({ faits }) => (faits.traction?.xmax ?? 0) >= 0.075 || false },
      { consigne: "Relevez x (en m) et F (en N) pour au moins cinq allongements entre 0 et 10 cm ; tableur : x en A, F en B.", court: "Tableur : x et F.", verifier: releves },
      { consigne: "Tracez F (B) en fonction de x (A), modèle y = a·x.", court: "Courbe F = f(x).", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "B" && c.n >= 5 && c.modele === "lineaire") || "Abscisse : A ; ordonnée : B ; modèle y = a·x." },
      { consigne: "Raideur K du ressort (coefficient directeur, N/m) ?", court: "K (N/m) ?", question: relatif("N/m", K, 0.06, "F = K·x.", "Exact : environ 20 N/m.") },
      { consigne: "Le travail fourni par l'opérateur pour allonger le ressort de 0 à x est…", court: "Répondez dans le carnet.", question: choix(["l'aire du triangle sous la droite : ½·F·x = ½·K·x²", "F·x = K·x²", "nul"], "La force grandit de 0 à F pendant l'allongement.", "Exact : méthode graphique.") },
      { consigne: "Travail de la tension du ressort quand l'allongement passe de 0 à 6 cm (J) ?", court: "W(T) de 0 à 6 cm (J) ?", question: { type: "nombre", unite: "J", attendu: -0.5 * K * 0.06 ** 2, tolerance: 0.004, aide: "La tension s'oppose à l'allongement : W(T) = −½·K·x².", bravo: "Exact : −0,036 J." } },
      { consigne: "L'énergie potentielle élastique, nulle à l'équilibre (état de référence), s'écrit…", court: "Répondez dans le carnet.", question: choix(["Epe = ½·K·x²", "Epe = K·x", "Epe = ½·K·x"], "Epe = ½·K·x² + cte et Epe(0) = 0.", "Exact : W(T) = −ΔEpe.") },
    ],
  };

  const RESSORT = {
    id: "ressort", paillasse: 1, titre: "Énergie mécanique du solide-ressort",
    objectif: "Enregistrer x(t), afficher Ec, Epe et Em ; sans amortisseur, puis avec la palette.",
    entetes: [], donnees: ["Ec = ½·m·v² ; Epe = ½·K·x² ; Em = Ec + Epe", "Théorème de l'énergie cinétique : ΔEc = somme des travaux", "m = 0,200 kg ; K = 10 N/m"],
    conclusion: "Pour le solide-ressort horizontal, Em = ½·m·v² + ½·K·x². Sans frottement, l'énergie mécanique se conserve : Ec et Epe s'échangent (Ec maximale à l'équilibre, Epe maximale aux élongations extrêmes), Em = ½·K·Xm². Avec des frottements, Em diminue : l'énergie perdue est transférée au milieu extérieur.",
    conclusion_courte: "Sans frottement : Em = ½·K·Xm² constante ; sinon Em diminue.",
    etapes: [
      { consigne: "Mobile au repos : « Zéro » ; puis « Acquérir » (5 s), écartez le mobile de 5 cm et lâchez-le.", court: "Enregistrez x(t).", verifier: ({ faits }) => fini(faits, "aucun") },
      { consigne: "Touchez « Énergies » : le logiciel calcule v = dx/dt et trace Ec, Epe et Em.", court: "Vue « Énergies ».", verifier: ({ faits }) => faits.acquisition?.vue === "energies" || false },
      { consigne: "Quand Ec est maximale, Epe est…", court: "Répondez dans le carnet.", question: choix(["nulle : le mobile passe par l'équilibre", "maximale aussi", "égale à Ec"], "Comparez les courbes bleue et orange.", "Exact : Ec et Epe s'échangent.") },
      { consigne: "Énergie mécanique Em (mJ), lue au curseur ?", court: "Em (mJ) ?", question: relatif("mJ", (f) => (dernier(f, "aucun")?.Em0 || 0) * 1000, 0.06, "Courbe verte.", "Exact : Em = ½·K·Xm².") },
      { consigne: "Avec le théorème de l'énergie cinétique (entre le lâcher et l'équilibre, W(T) = ½·K·x0²), vitesse maximale du mobile (m/s) ?", court: "v max (m/s) ?", question: relatif("m/s", (f) => Math.abs(dernier(f, "aucun")?.x0 || 0) * Math.sqrt(10 / 0.2), 0.06, "½·m·v² = ½·K·x0².", "Exact.") },
      { consigne: "Sur le banc presque sans frottement, l'énergie mécanique…", court: "Répondez dans le carnet.", question: choix(["se conserve", "diminue rapidement", "augmente"], "Courbe verte.", "Exact.") },
      { consigne: "Posez la palette sur le mobile ; Durée 10 s, « Acquérir », écartez de 5 cm et lâchez ; affichez les énergies.", court: "Énergies avec la palette.", verifier: ({ faits }) => fini(faits, "palette") },
      { consigne: "Avec la palette, l'énergie mécanique…", court: "Répondez dans le carnet.", question: choix(["diminue : elle est transférée au milieu extérieur par les frottements", "reste constante", "augmente"], "Courbe verte.", "Exact : Em n'est pas conservée.") },
    ],
  };

  L.MISSIONS_ENERGIE = [TRAVAIL, RESSORT];
  L.questions_energie = { choix, relatif };
})(window.Labo);

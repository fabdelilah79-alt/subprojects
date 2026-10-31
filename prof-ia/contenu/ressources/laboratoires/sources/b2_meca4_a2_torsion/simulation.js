/*
Rôle : simulation de l'activité 2 du chapitre « Systèmes mécaniques oscillants » (2e année du bac) : pendule de torsion ;
       couple de rappel M = −C·θ, équation différentielle J·θ̈ + C·θ = 0 et sa solution DONNÉE ; mesure de la période propre au
       chronomètre (plusieurs oscillations) ; influence du moment d'inertie (masselottes) et de la constante de torsion
       (deux fils) ; T0 = 2π·√(J/C) ; isochronisme. Objectifs O1, O3, O4.
Reçoit : rien (les vérifications lisent « pendule », « lachers_torsion », « chronometre », la feuille et le graphique).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const C = { A: 0.004, B: 0.016 }, J = (d) => 0.0009 + 0.2 * d * d, T = (d, fil) => 2 * Math.PI * Math.sqrt(J(d) / C[fil]);
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const LA = (f) => f.lachers_torsion || [], lache = (f, fil, d, test = () => true) => LA(f).some((l) => l.fil === fil && Math.abs(l.d - d) < 1e-6 && test(l));
  const chrono = (f, fil, d) => (f.chronometre?.mesures || []).some((t) => [3, 4, 5, 10].some((n) => Math.abs(t / n - T(d, fil)) < 0.04 * T(d, fil)));

  function mesure(fil, d) {
    // Un lâcher avec ce montage, et une durée du chronomètre qui vaut 3, 4, 5 ou 10 périodes (à 4 % près).
    return ({ faits }) => {
      if (!lache(faits, fil, d)) return false;
      return chrono(faits, fil, d) || "Chronométrez plusieurs oscillations (par exemple 5) : « ▶∥ » au passage par une position extrême, « ▶∥ » au même passage, 5 oscillations plus tard.";
    };
  }

  function tableau({ faits, feuille }) {
    // A : d (m) ; B : T0 mesurée (fil A, à 3 %) ; C : J = 0,0009 + 0,2·d² ; D : T0² ; trois lignes.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`);
    let lignes = 0;
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const d = v("A", n);
      if (![0.04, 0.08, 0.12].some((x) => Math.abs(x - d) < 1e-6) || !lache(faits, "A", d)) return `Ligne ${n} : en A, une distance d (m) essayée avec le fil A.`;
      if (v("B", n) === null || Math.abs(v("B", n) - T(d, "A")) > 0.03 * T(d, "A")) return `Ligne ${n} : en B, la période mesurée (durée chronométrée divisée par le nombre d'oscillations).`;
      if (v("C", n) === null || Math.abs(v("C", n) - J(d)) > 0.005 * J(d)) return `Ligne ${n} : en C, =0,0009+0,2*A${n}^2.`;
      if (v("D", n) === null || Math.abs(v("D", n) - v("B", n) ** 2) > 0.005 * v("B", n) ** 2) return `Ligne ${n} : en D, =B${n}^2.`;
      lignes++;
    }
    return lignes >= 3 || false;
  }

  const INERTIE = {
    id: "inertie", paillasse: 0, titre: "Influence du moment d'inertie",
    objectif: "Fil A : mesurer la période propre pour d = 4, 8 et 12 cm ; tracer T0² en fonction de J.",
    entetes: ["d (m)", "T0 (s)", "J (kg·m²)", "T0² (s²)"],
    donnees: ["Couple de rappel du fil : M = −C·θ", "Solution DONNÉE de J·θ̈ + C·θ = 0 : θ = θm·cos(2π·t/T0 + φ)", "J = 0,0009 + 0,2·d² (kg·m²)"],
    conclusion: "Tourné d'un angle θ, le fil de torsion exerce un couple de rappel de moment M = −C·θ (C : constante de torsion, en N·m/rad). La relation fondamentale de la dynamique en rotation donne J·θ̈ = −C·θ, soit θ̈ + (C/J)·θ = 0 ; la solution est θ = θm·cos(2π·t/T0 + φ) avec T0 = 2π·√(J/C). T0² est proportionnel à J : la période augmente quand on éloigne les masselottes de l'axe.",
    conclusion_courte: "J·θ̈ + C·θ = 0 ; T0 = 2π·√(J/C).",
    etapes: [
      { consigne: "Fil A, masselottes à 8 cm : tournez la barre d'environ 30° par son aiguille et lâchez-la ; chronométrez 5 oscillations.", court: "Chronométrez 5 oscillations.", aide_geste: "Faites glisser l'aiguille rouge le long du cadran, puis lâchez.", verifier: mesure("A", 0.08) },
      { consigne: "Le fil tordu exerce sur la barre un couple de rappel de moment…", court: "Répondez dans le carnet.", question: choix(["M = −C·θ : il ramène la barre vers l'équilibre", "M = C·θ", "constant"], "Comparez avec la force de rappel d'un ressort.", "Exact : C est la constante de torsion (N·m/rad).") },
      { consigne: "La relation fondamentale de la dynamique en rotation donne l'équation différentielle…", court: "Répondez dans le carnet.", question: choix(["J·θ̈ + C·θ = 0", "J·θ̇ + C·θ = 0", "θ̈ = C·J"], "ΣM = J·θ̈.", "Exact : sa solution (donnée) est θ = θm·cos(2π·t/T0 + φ).") },
      { consigne: "Masselottes à 4 cm, puis à 12 cm (touchez une masselotte pour la déplacer) : mesurez T0 à chaque fois.", court: "d = 4 cm et 12 cm.", verifier: ({ faits }) => (lache(faits, "A", 0.04) && lache(faits, "A", 0.12) && ((chrono(faits, "A", 0.04) && chrono(faits, "A", 0.12)) || "Chronométrez plusieurs oscillations pour chacune des deux positions.")) || false },
      { consigne: "Tableur : d (m) en A, T0 en B, J = 0,0009 + 0,2·d² en C, T0² en D (trois lignes).", court: "Tableur : d, T0, J, T0².", verifier: tableau },
      { consigne: "Tracez T0² (D) en fonction de J (C), modèle y = a·x.", court: "Courbe T0² = f(J).", verifier: ({ courbe: c }) => (c.x === "C" && c.y === "D" && c.n >= 3 && c.modele === "lineaire") || "Abscisse : C ; ordonnée : D ; modèle y = a·x." },
      { consigne: "T0² = (4π²/C)·J : déduisez du coefficient directeur la constante de torsion C du fil A (N·m/rad).", court: "C (N·m/rad) ?", question: relatif("N·m/rad", C.A, 0.08, "C = 4π² / a.", "Exact : environ 4,0 × 10⁻³ N·m/rad.") },
      { consigne: "Quand on éloigne les masselottes de l'axe, la période propre…", court: "Répondez dans le carnet.", question: choix(["augmente, car J augmente", "diminue", "ne change pas"], "T0 = 2π·√(J/C).", "Exact.") },
    ],
  };

  const TORSION = {
    id: "torsion", paillasse: 0, titre: "Constante de torsion, isochronisme",
    objectif: "Masselottes à 8 cm : comparer le fil B au fil A ; lâcher à 20° puis à 45°.",
    entetes: [], donnees: ["Fil B plus épais : C = 1,6 × 10⁻² N·m/rad (4 fois celle du fil A)", "Isochronisme : la période ne dépend pas de l'amplitude"],
    conclusion: "Avec un fil plus raide (constante de torsion C quatre fois plus grande), la période propre est divisée par deux : T0 = 2π·√(J/C). Pour des amplitudes différentes, la période reste la même : les oscillations sont isochrones.",
    conclusion_courte: "T0 diminue quand C augmente ; T0 ne dépend pas de θm.",
    etapes: [
      { consigne: "Remplacez le fil A par le fil B (touchez la bobine posée sur la paillasse), masselottes à 8 cm ; mesurez T0.", court: "Fil B : mesurez T0.", verifier: mesure("B", 0.08) },
      { consigne: "T0 (fil A) / T0 (fil B) ?", court: "Rapport des périodes ?", question: relatif("", 2, 0.05, "Avec les deux mesures à 8 cm.", "Exact : C est 4 fois plus grande, T0 est divisée par √4 = 2.") },
      { consigne: "Toujours avec le fil B, lâchez la barre à environ 20°, puis à environ 45° ; chronométrez à chaque fois.", court: "Lâchers à 20° et 45°.", verifier: ({ faits }) => (lache(faits, "B", 0.08, (l) => Math.abs(l.theta0) < 25) && lache(faits, "B", 0.08, (l) => Math.abs(l.theta0) > 40) && chrono(faits, "B", 0.08)) || false },
      { consigne: "Quand l'amplitude change, la période propre…", court: "Répondez dans le carnet.", question: choix(["ne change pas : les oscillations sont isochrones", "augmente avec l'amplitude", "diminue avec l'amplitude"], "Comparez les deux durées.", "Exact.") },
      { consigne: "La période propre d'un pendule de torsion dépend…", court: "Répondez dans le carnet.", question: choix(["de J et de C seulement : T0 = 2π·√(J/C)", "de l'amplitude", "de la masse du fil"], "Reprenez les mesures.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_meca4_a2_torsion", titre: "Laboratoire : le pendule de torsion", paillasses: [L.poste_torsion], missions: [INERTIE, TORSION] });
})(window.Labo);

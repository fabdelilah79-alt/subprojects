/*
Rôle : missions des paillasses « rails de Laplace » et « balance de Laplace » : direction et sens de la force de Laplace,
       travail de la force (filière SM), intensité F = I·l·B·sin α.
Reçoit : rien (les vérifications lisent les faits « rails », « balance » et la feuille du tableur).
Produit : Labo.MISSIONS_LAPLACE = [RAILS, BALANCE].
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const ra = (f) => f.rails || { vus: {} }, ba = (f) => f.balance || { points: {} }, pt = (f, l, a, I) => ba(f).points[`${l}:${a}:${I}`];

  function tableau({ faits, feuille }) {
    // Cadre de 4 cm, α = 90° : I, Δm mesurée, F = Δm·g, I·l·B.
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 4) return false;
    for (const [k, r] of l.entries()) {
      const dm = pt(faits, 4, 90, r.A);
      if (dm === undefined || Math.abs(r.B - dm) > 0.006) return `Ligne ${k + 2} : I (A) et Δm (g) lue sur la balance, cadre de 4 cm, α = 90°.`;
      if (Math.abs(r.C - (r.B * 9.81) / 1000) > 0.005 * r.C + 1e-6) return `Ligne ${k + 2} : F = Δm × g, Δm en kg : par exemple =B${k + 2}*9,81/1000.`;
      if (Math.abs(r.D - r.A * 0.04 * 0.08) > 0.005 * r.D) return `Ligne ${k + 2} : I·l·B, par exemple =A${k + 2}*0,04*0,08.`;
    }
    return new Set(l.map((r) => r.A)).size >= 4 || "Quatre intensités différentes.";
  }

  const RAILS = {
    id: "rails", paillasse: 0, titre: "Les rails de Laplace",
    objectif: "Observer le mouvement d'une tige parcourue par un courant dans un champ magnétique ; trouver le sens de la force.",
    entetes: [],
    donnees: ["Rails écartés de l = 5,0 cm ; B = 0,10 T dans l'entrefer", "Tige : 15 g ; frottements : environ 8 mN"],
    conclusion: "Un conducteur parcouru par un courant, placé dans un champ magnétique, subit la force de Laplace : perpendiculaire au conducteur et au champ, de sens donné par la règle de la main droite (ou trièdre direct I·l, B, F), d'intensité F = I·l·B·sin α. Elle change de sens si l'on inverse le courant ou le champ. Son travail convertit de l'énergie électrique en énergie mécanique.",
    conclusion_courte: "F perpendiculaire à I et à B ; F = I·l·B·sin α.",
    etapes: [
      { consigne: "Fermez le circuit (I = 6 A) et observez la tige posée dans l'entrefer.", court: "Fermez le circuit.", aide_geste: "« Fermer / Ouvrir » sur le générateur ; « Replacer » ramène la tige.", verifier: ({ faits }) => Object.keys(ra(faits).vus).length > 0 },
      { consigne: "La force qui met la tige en mouvement est…", court: "Répondez dans le carnet.", question: choix(["perpendiculaire à la tige et au champ B : elle pousse la tige le long des rails", "parallèle au champ B", "dirigée le long de la tige"], "B est vertical, la tige est en travers des rails.", "Exact : c'est la force de Laplace.") },
      { consigne: "Replacez la tige et inversez le courant ; puis retournez l'aimant. Observez à chaque fois le sens du mouvement.", court: "Inversez I, puis B.", verifier: ({ faits }) => Object.keys(ra(faits).vus).length >= 3 },
      { consigne: "Le sens de la force de Laplace…", court: "Répondez dans le carnet.", question: choix(["change quand on inverse le courant ou le champ ; il est donné par la règle de la main droite (I, B, F)", "ne dépend que du sens du courant", "ne dépend que du champ"], "Comparez vos trois essais.", "Exact.") },
      { consigne: "Réglez I = 1 A, replacez la tige et fermez le circuit.", court: "I = 1 A.", verifier: ({ faits }) => !!ra(faits).immobile },
      { consigne: "Avec I = 1 A, la tige ne bouge pas, parce que…", court: "Répondez dans le carnet.", question: choix(["F = I·l·B = 5 mN est plus petite que les frottements", "il n'y a plus de champ", "le courant ne passe pas dans la tige"], "Calculez I·l·B.", "Exact.") },
      { consigne: "Pour I = 6 A, quel est le travail de la force de Laplace quand la tige parcourt les 6,0 cm de l'entrefer ? (W = F·d)", court: "W (J) ?", question: { type: "nombre", unite: "J", attendu: 6 * 0.05 * 0.1 * 0.06, tolerance_relative: 0.02, aide: "F = I·l·B, puis W = F × d (d en mètres).", bravo: "Exact : 1,8×10⁻³ J d'énergie électrique convertie en énergie mécanique." } },
    ],
  };

  const BALANCE = {
    id: "balance", paillasse: 1, titre: "Intensité de la force de Laplace",
    objectif: "Mesurer F avec une balance pour différentes valeurs de I, de l et de α.",
    entetes: ["I (A)", "Δm (g)", "F (N)", "I·l·B (N)"],
    donnees: ["B = 0,080 T dans l'entrefer ; g = 9,81 N/kg", "Le cadre exerce sur l'aimant une force opposée à la force de Laplace : F = |Δm|·g"],
    conclusion: "L'intensité de la force de Laplace est F = I·l·B·sin α, où l est la longueur du conducteur dans le champ et α l'angle entre le conducteur et B : F est proportionnelle à I et à l ; elle est maximale quand le conducteur est perpendiculaire à B et nulle quand il lui est parallèle.",
    conclusion_courte: "F = I·l·B·sin α.",
    etapes: [
      { consigne: "Circuit ouvert, allumez la balance (I/O) : elle fait le zéro (tare).", court: "Allumez la balance.", verifier: ({ faits }) => !!ba(faits).tare_ok },
      { consigne: "Cadre de 4 cm, α = 90° : mesurez Δm pour quatre intensités au moins (de 1 à 5 A). En A : I ; en B : |Δm| (g) ; en C : F = |Δm|·g (N) ; en D : I·l·B (N).", court: "Tableur : A, B, C, D.", verifier: tableau },
      { consigne: "Comparez les colonnes C et D :", court: "Répondez dans le carnet.", question: choix(["F = I·l·B : la force est proportionnelle à I", "F ne dépend pas de I", "F = I²·l·B"], "Comparez C et D, ligne par ligne.", "Exact.") },
      { consigne: "I = 5 A, α = 90° : mesurez Δm avec les cadres de 2 cm et de 1 cm.", court: "Cadres de 2 cm et 1 cm.", aide_geste: "« Cadre » change de cadre.", verifier: ({ faits }) => pt(faits, 2, 90, 5) !== undefined && pt(faits, 1, 90, 5) !== undefined },
      { consigne: "Quand la longueur l du conducteur dans le champ est divisée par 2, F…", court: "Répondez dans le carnet.", question: choix(["est divisée par 2 : F est proportionnelle à l", "ne change pas", "est divisée par 4"], "Comparez Δm pour 4 cm et 2 cm.", "Exact.") },
      { consigne: "Cadre de 4 cm, I = 5 A : mesurez Δm pour α = 60°, 30° et 0°.", court: "α = 60°, 30°, 0°.", aide_geste: "« Tourner » fait tourner l'aimant sur son plateau.", verifier: ({ faits }) => [60, 30, 0].every((a) => pt(faits, 4, a, 5) !== undefined) },
      { consigne: "Valeur de F pour α = 30° (d'après votre mesure) ?", court: "F (N) à 30° ?", question: { type: "nombre", unite: "N", attendu: (f) => ((pt(f, 4, 30, 5) || 0) * 9.81) / 1000, tolerance_relative: 0.03, aide: "F = |Δm| × g, Δm en kg.", bravo: "Exact : la moitié de la force à 90° (sin 30° = 0,5)." } },
      { consigne: "Pour α = 0° (conducteur parallèle au champ)…", court: "Répondez dans le carnet.", question: choix(["F = 0 : F = I·l·B·sin α", "F est maximale", "F ne dépend pas de α"], "Regardez la balance pour α = 0°.", "Exact.") },
    ],
  };

  L.MISSIONS_LAPLACE = [RAILS, BALANCE];
})(window.Labo);

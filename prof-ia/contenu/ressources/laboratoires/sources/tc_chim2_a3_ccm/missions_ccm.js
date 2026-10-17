/*
Rôle : étapes communes des missions de chromatographie (ligne, dépôts, éluant, développement, front) et vérification du
       tableur des Rf, pour l'activité 3 du chapitre « Extraction, séparation et identification » (objectif O4).
Reçoit : le nom du fait de la paillasse et le nombre de dépôts attendus.
Produit : Labo.MISSIONS_CCM = { choix, preparation(fait, n, eluant), feuille_rf(fait, references) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });

  function preparation(fait, n, eluant) {
    // Les cinq gestes de toute chromatographie, vérifiés sur la paillasse.
    const F = (faits) => faits[fait] || {};
    return [
      { consigne: "Avec le crayon, tracez la ligne de dépôt à environ 1 cm du bas de la plaque.", court: "Ligne de dépôt à 1 cm.", aide_geste: "Lâchez le crayon, la mine sur la plaque, à la hauteur voulue.",
        verifier: ({ faits }) => { const l = F(faits).ligne; if (l && (l < 7 || l > 15)) return "La ligne doit être à environ 1 cm (entre 0,7 et 1,5 cm) du bas : retracez-la (c'est possible tant qu'il n'y a pas de dépôt)."; return !!l || false; } },
      { consigne: `Avec le capillaire de chaque tube, déposez une petite goutte de chacun des ${n} échantillons sur la ligne, à environ 1 cm l'une de l'autre.`, court: `${n} dépôts sur la ligne.`, aide_geste: "Sortez le capillaire du tube et lâchez-le, sa pointe sur la ligne.",
        verifier: ({ faits }) => { const f = F(faits); if ((f.depots || []).length < n) return false; if (!f.sur_ligne) return "Un dépôt n'est pas sur la ligne : refaites-le (seule la dernière goutte de chaque tube compte)."; return f.espaces || "Écartez les dépôts d'au moins 6 mm l'un de l'autre, et d'au moins 5 mm des bords."; } },
      { consigne: `Versez l'éluant (${eluant}) dans la cuve : une hauteur d'environ 5 mm, plus basse que la ligne de dépôt. Fermez la cuve avec son couvercle.`, court: "Éluant (5 mm), cuve fermée.", aide_geste: "Touchez le haut de la cuve pour poser ou ôter le couvercle.",
        verifier: ({ faits }) => { const f = F(faits); if (f.eluant >= f.ligne - 1) return "Trop d'éluant : il recouvrirait les dépôts. Videz la cuve dans le bidon (touchez-le) et recommencez."; return (f.eluant >= 2 && f.couvercle) || false; } },
      { consigne: "Ôtez le couvercle, posez la plaque au fond de la cuve, refermez la cuve, puis observez l'éluant monter (regardez le chronomètre).", court: "Plaque dans la cuve fermée.",
        verifier: ({ faits }) => { const f = F(faits); if (f.dissous) return "Les dépôts se sont dissous dans l'éluant : son niveau dépassait la ligne de dépôt."; return (f.lieu === "cuve" && f.couvercle && f.front > 20) || false; } },
      { consigne: "Quand le front de l'éluant arrive à environ 1 cm du haut, sortez la plaque (couvercle ôté) et marquez tout de suite le front au crayon.", court: "Plaque sortie, front marqué.",
        verifier: ({ faits }) => { const f = F(faits); if (f.front_marque && f.front < 60) return "La plaque est sortie trop tôt : l'éluant n'est pas assez monté pour bien séparer les espèces."; return (f.lieu === "support" && f.front_marque && f.front >= 60) || false; } },
    ];
  }

  function feuille_rf(fait, references) {
    // Lignes : n° du dépôt (A), d (B), D (C), Rf (D) pour chaque référence ; mesures à 2,5 mm près, Rf = d/D.
    return ({ feuille, faits }) => {
      const f = faits[fait] || {}, lignes = feuille.lignes(["A", "B", "C", "D"]);
      for (const [k, l] of lignes.entries()) {
        const d = f.d?.[l.A]?.[0];
        if (!references.includes(l.A) || d === undefined) return `Ligne ${k + 2} : le numéro du dépôt (colonne A) est ${references.join(", ")}.`;
        if (Math.abs(l.B - d) > 2.5) return `Ligne ${k + 2} : mesurez de nouveau d, de la ligne de dépôt au centre de la tache (en mm).`;
        if (Math.abs(l.C - f.D) > 2.5) return `Ligne ${k + 2} : D est la distance de la ligne de dépôt au front (en mm).`;
        if (Math.abs(l.D - l.B / l.C) > 0.03) return `Ligne ${k + 2} : Rf = d / D (sans unité).`;
      }
      return new Set(lignes.map((l) => l.A)).size >= references.length || false;
    };
  }

  L.MISSIONS_CCM = { choix, preparation, feuille_rf };
})(window.Labo);

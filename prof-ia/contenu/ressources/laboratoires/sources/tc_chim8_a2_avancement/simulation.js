/*
Rôle : simulation de l'activité 2 du chapitre « Transformation chimique d'un système » (tronc commun) : influence des
       quantités de réactifs sur l'avancement maximal (vinaigre dilué et hydrogénocarbonate de sodium, gaz recueilli sur
       la cuve à eau), puis tableau d'avancement et bilan de matière au tableur. Objectifs O3, O4.
Reçoit : rien (les vérifications lisent le fait « avancement » et la feuille de calcul de chaque mission).
Produit : la simulation démarrée : essais ; tableau d'avancement.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const MASSES = [0.1, 0.25, 0.5, 0.75], N_ACIDE = 5, proche = (a, b, r) => Math.abs(a - b) <= r * Math.abs(b) + 1e-9;
  const essais = (faits) => faits.avancement?.essais || [];
  const n2 = (faits, k) => ((essais(faits)[k]?.m || MASSES[k]) * 1000) / 84;
  const v = (x) => String(x).replace(".", ",");

  function essai(k) {
    // Étape : l'essai k est terminé avec la bonne masse (à 0,02 g près) et le gaz a été recueilli.
    return ({ faits }) => {
      const e = essais(faits);
      if (e.length < k + 1) return false;
      if (Math.abs(e[k].m - MASSES[k]) > 0.02) return `Pour l'essai ${k + 1}, il faut environ ${v(MASSES[k])} g (vous avez introduit ${v(e[k].m)} g) : touchez « Nouvel essai » et recommencez.`;
      return e[k].V > 1 || "Le gaz s'est échappé : l'erlenmeyer doit être sous le bouchon du montage. Touchez « Nouvel essai ».";
    };
  }

  function mesures({ faits, feuille }) {
    // Tableur : m en A et V en B pour chaque essai, n(NaHCO₃) = m / M (mmol) en C, n(CO₂) = V / Vm (mmol) en D.
    const l = feuille.lignes(["A", "B", "C", "D"]), e = essais(faits);
    if (l.length < 4) return false;
    for (const [k, r] of l.slice(0, 4).entries()) {
      if (!e[k] || Math.abs(r.A - e[k].m) > 0.006 || Math.abs(r.B - e[k].V) > 3) return `Ligne ${k + 2} : recopiez m et V de l'essai ${k + 1}.`;
      if (!proche(r.C, (r.A * 1000) / 84, 0.015)) return `Ligne ${k + 2} : n(NaHCO₃) = m / M, en mmol (M = 84 g/mol).`;
      if (!proche(r.D, r.B / 24, 0.015)) return `Ligne ${k + 2} : n(CO₂) = V / Vm, en mmol (Vm = 24 mL/mmol).`;
    }
    return true;
  }

  const ESSAIS = {
    id: "essais", paillasse: 0, titre: "Avancement maximal et quantités de réactifs",
    objectif: "Faire réagir 10,0 mL de vinaigre dilué (0,50 mol/L) avec des masses croissantes d'hydrogénocarbonate de sodium et mesurer le volume de CO₂.",
    entetes: ["m (g)", "V(CO₂) (mL)", "n(NaHCO₃) (mmol)", "n(CO₂) (mmol)"],
    donnees: ["M(NaHCO₃) = 84 g/mol", "Vm = 24 L/mol = 24 mL/mmol"],
    conclusion: "Tant que l'hydrogénocarbonate est le réactif limitant, la quantité de CO₂ formée est égale à sa quantité : l'avancement maximal augmente avec la masse introduite. Au-delà de 5,0 mmol (0,42 g), c'est l'acide éthanoïque qui est limitant : l'avancement maximal ne change plus, xmax = 5,0 mmol. L'avancement maximal est fixé par le réactif limitant, celui qui est entièrement consommé.",
    conclusion_courte: "xmax est fixé par le réactif limitant.",
    etapes: [
      { consigne: "Équation : CH₃COOH + HCO₃⁻ → CH₃COO⁻ + CO₂ + H₂O. Le gaz recueilli dans l'éprouvette est…", court: "Répondez dans le carnet.", question: choix(["du dioxyde de carbone CO₂", "du dihydrogène H₂", "de la vapeur d'eau"], "Lisez l'équation.", "Exact.") },
      ...MASSES.map((m, k) => ({
        consigne: `Essai ${k + 1} : pesez ${v(m)} g d'hydrogénocarbonate de sodium, versez-le dans l'erlenmeyer, placez l'erlenmeyer sous le bouchon du montage, puis ouvrez le robinet de l'ampoule. Lisez le volume de gaz, puis touchez « Nouvel essai ».`,
        court: `Essai ${k + 1} : ${v(m)} g.`, aide_geste: "Coupelle sur la balance, tare, spatule ; coupelle lâchée au-dessus de l'erlenmeyer ; erlenmeyer glissé sous le bouchon ; robinet touché.", verifier: essai(k),
      })),
      { consigne: "Au tableur : m (A) et V (B) de chaque essai (lignes 2 à 5), puis n(NaHCO₃) en mmol (C) et n(CO₂) en mmol (D).", court: "Tableur : m, V, n, n.", verifier: mesures },
      { consigne: "Tracez n(CO₂) (colonne D) en fonction de n(NaHCO₃) (colonne C).", court: "Graphique n(CO₂) = f(n(NaHCO₃)).", verifier: ({ courbe: c }) => (c.x === "C" && c.y === "D" && c.n >= 4) || false },
      { consigne: "Pour les essais 1 et 2, n(CO₂) = n(NaHCO₃). Le réactif limitant est alors…", court: "Répondez dans le carnet.", question: choix(["l'hydrogénocarbonate de sodium", "l'acide éthanoïque", "aucun des deux"], "Lequel est entièrement consommé ?", "Exact : il est entièrement consommé.") },
      { consigne: "Pour les essais 3 et 4, le volume de CO₂ ne change plus. Le réactif limitant est…", court: "Répondez dans le carnet.", question: choix(["l'acide éthanoïque", "l'hydrogénocarbonate de sodium", "le dioxyde de carbone"], "n(acide) = 10,0 mL × 0,50 mol/L.", "Exact : il reste de la poudre au fond de l'erlenmeyer.") },
      { consigne: "Quel est l'avancement maximal xmax des essais 3 et 4 ?", court: "xmax (mmol) ?", question: { type: "nombre", unite: "mmol", attendu: 5, tolerance: 0.3, aide: "xmax = n(acide) = C × V.", bravo: "Exact : xmax = 5,0 mmol, soit 120 mL de CO₂." } },
    ],
  };

  function etats(k, l1, l2) {
    // Lignes l1 (état initial) et l2 (état final) du tableau d'avancement de l'essai k : x, n(acide), n(HCO₃⁻), n(CO₂).
    return ({ faits, feuille }) => {
      const l = feuille.lignes(["A", "B", "C", "D"]), a = l[l1 - 2], b = l[l2 - 2], n = n2(faits, k), x = Math.min(N_ACIDE, n);
      if (!a || !b) return false;
      if (Math.abs(a.A) > 1e-9 || !proche(a.B, N_ACIDE, 0.02) || !proche(a.C, n, 0.03) || Math.abs(a.D) > 1e-9) return `Ligne ${l1} : état initial (x = 0), n₁ = 5,0 mmol, n₂ = ${v(Math.round(n * 100) / 100)} mmol, pas de CO₂.`;
      if (!proche(b.A, x, 0.03)) return `Ligne ${l2} : xmax est la plus petite valeur de x qui annule un réactif.`;
      if (Math.abs(b.B - (N_ACIDE - x)) > 0.06 || Math.abs(b.C - (n - x)) > 0.06 || !proche(b.D, x, 0.03)) return `Ligne ${l2} : état final : n₁ − xmax, n₂ − xmax, n(CO₂) = xmax.`;
      return true;
    };
  }

  const TABLEAU = {
    id: "tableau", paillasse: 1, titre: "Tableau d'avancement et bilan de matière",
    objectif: "Dresser le tableau d'avancement des essais 2 et 4 et faire le bilan de matière à l'état final.",
    entetes: ["x (mmol)", "n(CH₃COOH)", "n(HCO₃⁻)", "n(CO₂)"],
    donnees: ["n₁ = n(CH₃COOH) initial = 5,0 mmol", "n₂ = n(HCO₃⁻) initial = m / M"],
    conclusion: "Le tableau d'avancement donne les quantités de matière au cours de la transformation en fonction de l'avancement x : chaque réactif diminue de (coefficient × x), chaque produit augmente de (coefficient × x). L'avancement maximal xmax est la plus petite valeur de x qui annule la quantité d'un réactif : c'est le réactif limitant. Le bilan de matière donne les quantités à l'état final.",
    conclusion_courte: "n(réactif) = n₀ − x ; xmax : un réactif s'annule.",
    etapes: [
      { consigne: "Au cours de la transformation, pour un avancement x, la quantité d'acide éthanoïque est…", court: "Répondez dans le carnet.", question: choix(["n₁ − x", "n₁ + x", "x"], "Un réactif est consommé.", "Exact : il disparaît une mole d'acide par mole de CO₂ formée.") },
      { consigne: "Au tableur, tableau d'avancement de l'essai 2 : ligne 2, état initial (x en A, n(CH₃COOH) en B, n(HCO₃⁻) en C, n(CO₂) en D) ; ligne 3, état final.", court: "Essai 2 : lignes 2 et 3.", verifier: etats(1, 2, 3) },
      { consigne: "Bilan de l'essai 2 : quelle quantité d'acide éthanoïque reste-t-il à l'état final ?", court: "n(acide) restant ?", question: { type: "nombre", unite: "mmol", attendu: (f) => N_ACIDE - Math.min(N_ACIDE, n2(f, 1)), tolerance: 0.1, aide: "n₁ − xmax, avec xmax = n₂.", bravo: "Exact : l'acide est en excès." } },
      { consigne: "Tableau d'avancement de l'essai 4 : ligne 4, état initial ; ligne 5, état final.", court: "Essai 4 : lignes 4 et 5.", verifier: etats(3, 4, 5) },
      { consigne: "Bilan de l'essai 4 : quelle masse d'hydrogénocarbonate reste-t-il au fond de l'erlenmeyer ?", court: "Masse restante (g) ?", question: { type: "nombre", unite: "g", attendu: (f) => ((n2(f, 3) - N_ACIDE) * 84) / 1000, tolerance: 0.02, aide: "(n₂ − xmax) × M, en grammes.", bravo: "Exact." } },
      { consigne: "Quelle masse d'hydrogénocarbonate faudrait-il pour que les deux réactifs soient entièrement consommés (mélange stœchiométrique) ?", court: "Masse stœchiométrique ?", question: { type: "nombre", unite: "g", attendu: 0.42, tolerance: 0.01, aide: "n₂ = n₁ = 5,0 mmol ; m = n × M.", bravo: "Exact : 0,42 g." } },
    ],
  };

  L.demarrer({ id: "tc_chim8_a2_avancement", titre: "Laboratoire : avancement", paillasses: [L.poste_avancement, L.poste_tableau_avancement], missions: [ESSAIS, TABLEAU] });
})(window.Labo);

/*
Rôle : simulation de l'activité 1 du chapitre « La mole et la concentration » (tronc commun) : comment mesurer une même
       quantité de matière d'espèces différentes ? Masses molaires calculées au tableur, pesée de 0,010 mol de quatre
       solides ; volume de 0,10 mol d'éthanol prélevé à la pipette graduée et vérifié à la balance ; volume molaire des gaz.
       Objectifs O1, O2, O3.
Reçoit : rien (les vérifications lisent les faits « pesees » et « liquides » et la feuille de calcul).
Produit : la simulation démarrée : solides ; liquides et gaz.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const M = { sucre: 342, sel: 58.5, soufre: 32, fer: 56 }, ORDRE = ["sucre", "sel", "soufre", "fer"], N = 0.01;

  function feuille({ feuille: f }) {
    // Lignes 2 à 5 : saccharose, chlorure de sodium, soufre, fer ; M en A, n en B, m = n × M en C.
    const l = f.lignes(["A", "B", "C"]);
    for (const [k, r] of l.entries()) {
      const m = M[ORDRE[k]];
      if (!m) break;
      if (Math.abs(r.A - m) > 0.6) return `Ligne ${k + 2} : la masse molaire de ${["C₁₂H₂₂O₁₁", "NaCl", "S", "Fe"][k]} est fausse : additionnez les masses molaires de tous ses atomes.`;
      if (Math.abs(r.B - N) > 1e-6) return `Ligne ${k + 2} : n = 0,010 mol.`;
      if (Math.abs(r.C - r.A * r.B) > 0.005 * r.A * r.B + 1e-6) return `Ligne ${k + 2} : m = n × M.`;
    }
    return l.length >= 4 || false;
  }

  function pese(ids) {
    // Chaque produit demandé a été pesé à 3 % près de 0,010 mol.
    return ({ faits }) => {
      const p = faits.pesees || {};
      for (const id of ids) {
        const m = N * M[id];
        if (p[id] === undefined || p[id] < 0.97 * m) return false;
        if (p[id] > 1.03 * m) return `Trop de ${id === "sel" ? "chlorure de sodium" : id === "sucre" ? "saccharose" : id} : touchez la coupelle hors de la balance pour la vider, puis recommencez.`;
      }
      return true;
    };
  }

  const SOLIDES = {
    id: "solides", paillasse: 0, titre: "Peser une même quantité de matière",
    objectif: "Calculer des masses molaires, puis peser 0,010 mol de quatre solides différents.",
    entetes: ["M (g/mol)", "n (mol)", "m (g)"],
    donnees: ["N_A = 6,02 × 10^{23} mol^{-1}", "Lignes 2 à 5 : C₁₂H₂₂O₁₁, NaCl, S, Fe"],
    conclusion: "Une mole est la quantité de matière d'un système qui contient N_A = 6,02 × 10²³ entités. La masse molaire M d'une espèce (g/mol) est la masse d'une mole ; celle d'une molécule est la somme des masses molaires de ses atomes. La masse à peser est m = n × M : la même quantité de matière correspond à des masses différentes.",
    conclusion_courte: "m = n × M ; M(molécule) = somme des M(atomes).",
    etapes: [
      { consigne: "Une mole d'atomes de fer contient 6,02 × 10²³ atomes. Une mole de molécules de saccharose contient…", court: "Répondez dans le carnet.", question: choix(["aussi 6,02 × 10²³ molécules (le nombre d'Avogadro)", "342 molécules", "6,02 × 10²³ grammes"], "Une mole, c'est toujours le même nombre d'entités.", "Exact : c'est le nombre d'Avogadro, N_A.") },
      { consigne: "Au tableur, pour chaque produit (dans l'ordre de la fiche), calculez M en A, écrivez n = 0,010 en B, et calculez la masse à peser m = n × M en C.", court: "Tableur : M, n, m.", aide_geste: "Lisez la fiche des masses molaires atomiques au mur.", verifier: feuille },
      { consigne: "Pesez 0,010 mol de saccharose : coupelle sur la balance, tare (T), puis tenez la spatule chargée au-dessus de la coupelle.", court: "0,010 mol de saccharose.", aide_geste: "Sortez la spatule du pot (elle se charge), tenez-la au-dessus de la coupelle ; retournez au pot pour la recharger.", verifier: pese(["sucre"]) },
      { consigne: "Pesez de même 0,010 mol de chlorure de sodium, de soufre et de fer, chacun dans sa coupelle.", court: "0,010 mol de NaCl, S, Fe.", verifier: pese(["sel", "soufre", "fer"]) },
      { consigne: "Les quatre coupelles contiennent la même quantité de matière, mais des masses différentes, car…", court: "Répondez dans le carnet.", question: choix(["les masses molaires de ces espèces sont différentes", "la balance n'est pas précise", "les poudres n'ont pas la même couleur"], "m = n × M.", "Exact.") },
    ],
  };

  const LIQUIDES = {
    id: "liquides", paillasse: 1, titre: "Prélever une quantité de matière de liquide ; les gaz",
    objectif: "Calculer le volume d'éthanol qui contient 0,10 mol, le prélever à la pipette graduée et vérifier sa masse.",
    entetes: [],
    conclusion: "Pour un liquide, on prélève un volume : V = m / ρ = n × M / ρ (0,10 mol d'éthanol : 5,8 mL). Pour un gaz, la quantité de matière se calcule avec le volume molaire : n = V / Vm (Vm ≈ 24 L/mol à 20 °C sous 1 013 hPa) ; Vm dépend de la température et de la pression.",
    conclusion_courte: "Liquide : V = n·M/ρ ; gaz : n = V/Vm.",
    etapes: [
      { consigne: "Quel volume d'éthanol (M = 46 g/mol, ρ = 0,79 g/mL) contient 0,10 mol ?", court: "Volume de 0,10 mol d'éthanol ?", question: { type: "nombre", unite: "mL", attendu: 5.82, tolerance: 0.1, aide: "Masse : m = n × M = 4,6 g ; volume : V = m / ρ.", bravo: "Exact : environ 5,8 mL." } },
      { consigne: "Tarez la balance (le bécher est vide). Avec la pipette graduée, prélevez de l'éthanol, puis faites-en couler 5,8 mL dans le bécher de pesée.", court: "5,8 mL d'éthanol dans le bécher.", aide_geste: "Posez la pointe dans le bécher d'éthanol, tournez la molette vers le haut jusqu'au trait 0 ; posez-la dans le bécher de pesée, tournez vers le bas jusqu'à la lecture 5,8.", verifier: ({ faits }) => { const l = faits.liquides || {}, v = l.recu?.ethanol || 0; if (l.recu?.eau) return "Le bécher de pesée contient de l'eau : il ne doit contenir que de l'éthanol."; return (v > 5.7 && v < 5.95) || (v > 5.95 && `Vous avez versé ${String(v).replace(".", ",")} mL : c'est trop.`) || false; } },
      { consigne: "Lisez la masse d'éthanol sur la balance. Quelle quantité de matière avez-vous prélevée ?", court: "n = m / M ?", question: { type: "nombre", unite: "mol", attendu: (f) => (f.liquides?.masse || 4.6) / 46, tolerance: 0.004, aide: "n = m / M, avec M = 46 g/mol.", bravo: "Exact : environ 0,10 mol." } },
      { consigne: "À 20 °C et sous 1 013 hPa, le volume molaire des gaz est Vm = 24 L/mol. Quel volume occupent 0,10 mol de dihydrogène ?", court: "Volume de 0,10 mol de gaz ?", question: { type: "nombre", unite: "L", attendu: 2.4, tolerance: 0.05, aide: "V = n × Vm.", bravo: "Exact : 2,4 L, quel que soit le gaz, à cette température et cette pression." } },
      { consigne: "Le volume molaire d'un gaz…", court: "Répondez dans le carnet.", question: choix(["dépend de la température et de la pression", "est toujours 24 L/mol", "dépend de la couleur du gaz"], "Un gaz chauffé se dilate.", "Exact : à 0 °C sous 1 013 hPa, Vm = 22,4 L/mol.") },
    ],
  };

  L.demarrer({ id: "tc_chim7_a1_mole", titre: "Laboratoire : la mole", paillasses: [L.poste_pesees, L.poste_liquides], missions: [SOLIDES, LIQUIDES] });
})(window.Labo);

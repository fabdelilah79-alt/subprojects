/*
Rôle : simulation de l'activité 2 du chapitre « La conductance » (1re année du bac) : situation-problème « le sérum
       physiologique contient-il bien 9 g/L de chlorure de sodium ? » : courbe d'étalonnage G = f(C) avec six solutions
       étalons de NaCl (1 à 10 mmol/L), même cellule (L = 1 cm, S = 1 cm²) ; concentration du sérum dilué 20 fois lue
       sur la courbe ; limite de l'étalonnage (solution à 0,10 mol/L). Objectif O4.
Reçoit : rien (les vérifications lisent le fait « conductance », la feuille du tableur et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const ETALONS = [1, 2, 4, 6, 8, 10];
  const FLACONS = [...ETALONS.map((c) => ({ id: `n${c}`, texte: `NaCl\n${c} mmol/L`, sol: "NaCl", C: c / 1000 })), { id: "serum", texte: "sérum\ndilué ×20", sol: "NaCl", C: 0.154 / 20 }, { id: "n100", texte: "NaCl\n0,10 mol/L", sol: "NaCl", C: 0.1 }];
  const me = (f) => (f.conductance || {}).mesures || [], a = (f, id) => me(f).some((m) => m.flacon === id);

  function poste(g) {
    // Paillasse unique : cellule de géométrie fixe (L = 1 cm, S = 1 cm²), huit flacons.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.cellule_conductance(g, { flacons: FLACONS, L: 1, L_fixe: true, S_fixe: 1 });
    return { pense_bete };
  }

  function tableau({ faits, feuille }) {
    // Les six étalons : C (mmol/L), G (mS) mesurée.
    const l = feuille.lignes(["A", "B"]);
    if (l.length < 6) return false;
    for (const [k, x] of l.entries()) if (!me(faits).some((m) => m.flacon === `n${x.A}` && Math.abs(m.G * 1000 - x.B) <= 0.01 * m.G * 1000 + 0.002)) return `Ligne ${k + 2} : C (mmol/L) d'un étalon et G = I/U (mS) mesurée pour lui.`;
    return new Set(l.map((x) => x.A)).size >= 6 || "Les six étalons.";
  }

  const ETALONNAGE = {
    id: "etalonnage", paillasse: 0, titre: "Courbe d'étalonnage",
    objectif: "Mesurer la conductance de six solutions étalons de chlorure de sodium et tracer G = f(C).",
    entetes: ["C (mmol/L)", "G (mS)"],
    donnees: ["Même cellule, même tension, même température pour toutes les mesures", "G = I / U"],
    conclusion: "Pour des solutions diluées (C ≤ 10⁻² mol/L), la conductance est proportionnelle à la concentration : G = k·C. Cette droite d'étalonnage permet de trouver la concentration d'une solution de chlorure de sodium à partir de sa conductance, mesurée dans les mêmes conditions.",
    conclusion_courte: "Solutions diluées : G = k·C.",
    etapes: [
      { consigne: "Pour chaque étalon : touchez le flacon, montez le bécher, lisez U et I. En A, C (mmol/L) ; en B, G = I/U (mS).", court: "Tableur : A, B.", aide_geste: "Touchez un flacon ; faites glisser le plateau vers le haut.", verifier: tableau },
      { consigne: "Tracez G (B) en fonction de C (A) et modélisez.", court: "Courbe G = f(C).", verifier: ({ courbe }) => (courbe.x === "A" && courbe.y === "B" && courbe.n >= 6 && courbe.modele !== "aucun") || "Abscisse : A (C) ; ordonnée : B (G) ; choisissez un modèle." },
      { consigne: "Pour ces solutions diluées, G est…", court: "Répondez dans le carnet.", question: choix(["proportionnelle à C (droite passant par l'origine)", "indépendante de C", "proportionnelle à 1/C"], "Regardez la courbe.", "Exact.") },
    ],
  };

  const SERUM = {
    id: "serum", paillasse: 0, titre: "Le sérum physiologique",
    objectif: "Trouver, avec la courbe d'étalonnage, la concentration en chlorure de sodium d'un sérum physiologique dilué 20 fois.",
    entetes: [],
    donnees: ["Étiquette du sérum : chlorure de sodium 0,9 % (9 g/L)", "M(NaCl) = 58,5 g/mol"],
    conclusion: "Le sérum dilué 20 fois a une concentration d'environ 7,7 mmol/L (lue sur la droite d'étalonnage) : le sérum contient 154 mmol/L de chlorure de sodium, soit 0,154 × 58,5 ≈ 9,0 g/L. L'étiquette est exacte. On a dilué le sérum pour que sa conductance tombe dans le domaine de la droite d'étalonnage.",
    conclusion_courte: "Sérum : 154 mmol/L, 9,0 g/L.",
    etapes: [
      { consigne: "Mesurez la conductance du sérum dilué 20 fois.", court: "Sérum dilué.", verifier: ({ faits }) => a(faits, "serum") },
      { consigne: "Concentration du sérum dilué (mmol/L), lue sur la courbe ?", court: "C (mmol/L) ?", question: nombre("mmol/L", 7.7, 0.35, "C = G / k (pente de la droite).", "Exact.") },
      { consigne: "Concentration du sérum (mmol/L) ?", court: "C₀ (mmol/L) ?", question: nombre("mmol/L", 154, 7, "Le sérum a été dilué 20 fois.", "Exact.") },
      { consigne: "Concentration massique du sérum (g/L) ?", court: "t (g/L) ?", question: nombre("g/L", 9, 0.45, "t = C₀ × M(NaCl), C₀ en mol/L.", "Exact : l'étiquette (9 g/L) est juste.") },
    ],
  };

  const LIMITE = {
    id: "limite", paillasse: 0, titre: "Limite de l'étalonnage",
    objectif: "Mesurer la conductance d'une solution plus concentrée (0,10 mol/L) et la comparer à la droite.",
    entetes: [],
    conclusion: "Pour C = 0,10 mol/L, la conductance mesurée est nettement plus faible que celle que donne la droite prolongée : les ions, plus nombreux, se gênent. La droite d'étalonnage n'est valable que pour les solutions diluées (C ≤ 10⁻² mol/L) : il faut diluer les solutions trop concentrées.",
    conclusion_courte: "Étalonnage valable pour les solutions diluées.",
    etapes: [
      { consigne: "Mesurez la conductance de la solution de NaCl à 0,10 mol/L.", court: "NaCl 0,10 mol/L.", verifier: ({ faits }) => a(faits, "n100") },
      { consigne: "Comparée à la valeur donnée par la droite prolongée (10 fois celle de 10 mmol/L), G mesurée est…", court: "Répondez dans le carnet.", question: choix(["plus faible : la droite n'est valable que pour les solutions diluées", "égale", "plus grande"], "Comparez à 10 × G(10 mmol/L).", "Exact : on dilue avant de mesurer.") },
    ],
  };

  L.demarrer({ id: "b1_chim3_a2_etalonnage", titre: "Laboratoire : courbe d'étalonnage", paillasses: [poste], missions: [ETALONNAGE, SERUM, LIMITE] });
})(window.Labo);

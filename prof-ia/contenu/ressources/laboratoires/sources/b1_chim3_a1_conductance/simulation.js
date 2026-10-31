/*
Rôle : simulation de l'activité 1 du chapitre « La conductance » (1re année du bac) : mesurer la conductance d'une portion
       de solution entre deux électrodes planes parallèles (GBF, ampèremètre, voltmètre) ; les ions sont indispensables ;
       G = I/U = 1/R ; facteurs qui influent sur G (L, S, C) ; conductivité σ = G·L/S. Objectifs O1, O2, O3.
Reçoit : rien (les vérifications lisent le fait « conductance » et la feuille du tableur).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const me = (f) => (f.conductance || {}).mesures || [], a = (f, flacon, q = () => true) => me(f).some((m) => m.flacon === flacon && q(m));
  const distincts = (f, flacon, q, k) => new Set(me(f).filter((m) => m.flacon === flacon && q(m)).map((m) => m[k])).size;
  const FLACONS = [{ id: "eau", texte: "eau\ndistillée", sol: "eau", C: 0 }, { id: "sucre", texte: "eau\nsucrée", sol: "sucre", C: 0 }, { id: "nacl5", texte: "NaCl\n5 mmol/L", sol: "NaCl", C: 0.005 }, { id: "nacl10", texte: "NaCl\n10 mmol/L", sol: "NaCl", C: 0.01 }];

  const poste = (g) => L.poste_conductance(g, { flacons: FLACONS, L: 1 });

  function tableau({ faits, feuille }) {
    // Trois tensions : U (V), I (mA), G = I/U (mS), R = U/I (Ω) ; NaCl 10 mmol/L, L = 1 cm, S = 2 cm².
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 3) return false;
    for (const [k, x] of l.entries()) {
      if (!me(faits).some((m) => m.flacon === "nacl10" && m.L === 1 && m.S === 2 && Math.abs(m.U - x.A) < 1e-6 && Math.abs(m.I * 1000 - x.B) < 0.006)) return `Ligne ${k + 2} : U (V) et I (mA) lus sur les afficheurs pour NaCl 10 mmol/L, L = 1,0 cm, S = 2,0 cm².`;
      if (Math.abs(x.C - x.B / x.A) > 0.01 * x.C + 1e-4 || Math.abs(x.D - (1000 * x.A) / x.B) > 0.01 * x.D) return `Ligne ${k + 2} : C = B/A (G en mS) et D = 1000 × A/B (R en Ω).`;
    }
    return new Set(l.map((x) => x.A)).size >= 3 || "Trois tensions différentes.";
  }

  const IONS = {
    id: "ions", paillasse: 0, titre: "Les ions conduisent le courant",
    objectif: "Plonger la cellule dans l'eau distillée, l'eau sucrée et une solution de chlorure de sodium ; comparer l'intensité.",
    entetes: [],
    donnees: ["GBF : tension alternative de 500 Hz (évite l'électrolyse) ; multimètres en alternatif : ils affichent les valeurs efficaces U et I", "Entre deux solutions, la cellule est rincée à l'eau distillée et essuyée (c'est fait pour vous)"],
    conclusion: "L'eau distillée et l'eau sucrée (molécules de saccharose) ne laissent passer qu'un courant presque nul ; la solution de chlorure de sodium, qui contient des ions Na⁺ et Cl⁻, laisse passer un courant notable : les ions sont indispensables à la conduction dans une solution.",
    conclusion_courte: "Pas d'ions, pas de courant.",
    etapes: [
      L.etape_montage_conductance,
      { consigne: "Pour chaque bécher (eau distillée, eau sucrée, NaCl 10 mmol/L) : posez-le sur le plateau, montez-le pour immerger les plaques, lisez l'intensité.", court: "Trois liquides.", aide_geste: "Faites glisser le bécher sur le plateau du support élévateur, puis la manivelle vers le haut ; descendez le plateau avant de reprendre le bécher.", verifier: ({ faits }) => ["eau", "sucre", "nacl10"].every((k) => a(faits, k)) },
      { consigne: "Le courant passe nettement…", court: "Répondez dans le carnet.", question: choix(["dans la solution de chlorure de sodium seulement : il faut des ions", "dans les trois liquides", "dans l'eau sucrée"], "Comparez les intensités (mA).", "Exact.") },
    ],
  };

  const MESURE = {
    id: "mesure", paillasse: 0, titre: "Conductance et résistance",
    objectif: "Mesurer U et I pour plusieurs tensions du GBF ; calculer G = I/U et R = U/I.",
    entetes: ["U (V)", "I (mA)", "G (mS)", "R (Ω)"],
    conclusion: "Le rapport I/U ne dépend pas de la tension : c'est la conductance G de la portion de solution entre les plaques (en siemens, S). Sa résistance est R = 1/G. Pour NaCl à 10 mmol/L, L = 1,0 cm et S = 2,0 cm² : G ≈ 2,4 mS, R ≈ 415 Ω.",
    conclusion_courte: "G = I/U = 1/R (en S).",
    etapes: [
      { consigne: "NaCl 10 mmol/L, L = 1,0 cm, plaques immergées de 2,0 cm (S = 2,0 cm²). Pour trois tensions (touches AMPL. − et + du GBF) : en A, U (V) lue au voltmètre ; en B, I (mA) lue à l'ampèremètre ; en C, G = I/U ; en D, R = U/I.", court: "Tableur : A, B, C, D.", aide_geste: "Lisez la profondeur immergée (cm) sur les graduations de la plaque de gauche ; montez ou descendez avec la manivelle. Si un afficheur montre « 1 », prenez un calibre plus grand.", verifier: tableau },
      { consigne: "Quand U augmente, G…", court: "Répondez dans le carnet.", question: choix(["ne change pas : elle caractérise la portion de solution", "augmente comme U", "diminue"], "Regardez la colonne C.", "Exact.") },
      { consigne: "Conductance mesurée (mS) ?", court: "G (mS) ?", question: nombre("mS", 2.41, 0.1, "G = I / U.", "Exact.") },
    ],
  };

  const FACTEURS = {
    id: "facteurs", paillasse: 0, titre: "De quoi dépend la conductance ?",
    objectif: "Faire varier la distance L entre les plaques, la surface immergée S et la concentration C.",
    entetes: [],
    conclusion: "La conductance est inversement proportionnelle à la distance L des plaques, proportionnelle à la surface immergée S, et elle augmente avec la concentration (et la température). On écrit G = σ·S/L : la conductivité σ ne dépend que de la solution (nature, concentration, température). Pour NaCl à 10 mmol/L : σ ≈ 0,12 S/m. Pour comparer des mesures, il faut les faire dans les mêmes conditions.",
    conclusion_courte: "G = σ·S/L.",
    etapes: [
      { consigne: "NaCl 10 mmol/L, S = 2,0 cm² : mesurez I pour trois distances L (faites glisser la plaque de droite).", court: "Trois distances.", verifier: ({ faits }) => distincts(faits, "nacl10", (m) => m.S === 2, "L") >= 3 },
      { consigne: "Quand L double, G…", court: "Répondez dans le carnet.", question: choix(["est divisée par deux : G est inversement proportionnelle à L", "double", "ne change pas"], "Comparez L = 1 cm et L = 2 cm.", "Exact.") },
      { consigne: "L = 1,0 cm : mesurez I pour trois profondeurs d'immersion (S = 1, 2, 3 cm²).", court: "Trois surfaces.", verifier: ({ faits }) => distincts(faits, "nacl10", (m) => m.L === 1, "S") >= 3 },
      { consigne: "Quand S double, G…", court: "Répondez dans le carnet.", question: choix(["double : G est proportionnelle à S", "est divisée par deux", "ne change pas"], "Comparez S = 1 et S = 2 cm².", "Exact.") },
      { consigne: "Mêmes L et S : comparez NaCl à 5 mmol/L et à 10 mmol/L.", court: "Deux concentrations.", verifier: ({ faits }) => me(faits).some((m) => m.flacon === "nacl5" && me(faits).some((n) => n.flacon === "nacl10" && n.L === m.L && n.S === m.S)) },
      { consigne: "Conductivité σ = G·L/S de la solution à 10 mmol/L (en S/m) ?", court: "σ (S/m) ?", question: nombre("S/m", 0.12, 0.006, "G en S, L en m, S en m² (1 cm² = 10⁻⁴ m²).", "Exact : σ ≈ 0,12 S/m.") },
      { consigne: "Pour comparer deux solutions, il faut…", court: "Répondez dans le carnet.", question: choix(["les mêmes L, S et la même température (grandeurs d'influence)", "la même tension seulement", "des béchers de même couleur"], "G dépend de L, S, C et θ.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_chim3_a1_conductance", titre: "Laboratoire : la conductance", decor: "aucun", paillasses: [poste], missions: [IONS, MESURE, FACTEURS] });
})(window.Labo);

/*
Rôle : simulation de l'activité 1 du chapitre « Oscillations libres d'un circuit RLC série » (2e année du bac) : décharge
       d'un condensateur dans une bobine enregistrée à l'ordinateur ; régimes pseudo-périodique et apériodique (régime
       critique), rôle de la résistance ; pseudo-période mesurée pour plusieurs L et C, comparée à T₀ = 2π√(LC) ; équation
       différentielle à amortissement négligeable, q(t), i(t). Objectifs O1, O2, O3, O6.
Reçoit : rien (les vérifications lisent les faits « montage_rlc », « oscillations », la feuille et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const O = (f) => f.oscillations || [], M = (f) => f.montage_rlc || {};
  const vu = (f, R, regime) => O(f).some((o) => R(o.R) && o.L === 0.5 && o.C === 1e-5 && o.regime === regime);
  const T_ref = (f) => { const o = O(f).find((x) => x.R === 10 && x.L === 0.5 && x.C === 1e-5 && x.T); return o ? o.T * 1000 : 14.06; };

  function tableau({ faits, feuille }) {
    // Au moins quatre couples (L, C) : L (H) en A, C (µF) en B, T mesurée (ms) en C, 2π√(LC) (ms) en D.
    const l = feuille.lignes(["A", "B", "C", "D"]), o = O(faits).filter((x) => x.T && x.R <= 22);
    if (l.length < 4) return false;
    for (const [k, x] of l.entries()) {
      if (!o.some((m) => Math.abs(m.L - x.A) < 1e-9 && Math.abs(m.C * 1e6 - x.B) < 1e-6 && Math.abs(m.T * 1000 - x.C) <= 0.03 * m.T * 1000)) return `Ligne ${k + 2} : en A L (H), en B C (µF) d'un de vos enregistrements (R ≤ 22 Ω), en C la pseudo-période mesurée (ms).`;
      if (Math.abs(x.D - 2000 * Math.PI * Math.sqrt((x.A * x.B) / 1e6)) > 0.003 * x.D + 1e-3) return `Ligne ${k + 2} : en D, 2π√(LC) en ms : =2000*PI()*RACINE(A${k + 2}*B${k + 2}/1000000).`;
    }
    return new Set(l.map((x) => `${x.A}:${x.B}`)).size >= 4 || "Quatre couples (L, C) différents.";
  }

  const REGIMES = {
    id: "regimes", paillasse: 0, titre: "Décharge oscillante, régimes",
    objectif: "Enregistrer la décharge d'un condensateur dans une bobine ; reconnaître les régimes ; rôle de la résistance.",
    entetes: [],
    donnees: ["E = 6,0 V ; C = 10 µF ; bobine : r = 10 Ω, L = 0,50 H avec son noyau", "K en 1 : le condensateur se charge ; K en 2 : il se décharge dans la bobine et R", "EA0 : tension uC aux bornes du condensateur"],
    conclusion: "Le condensateur chargé se décharge dans la bobine : uC oscille autour de 0 avec une amplitude qui diminue, ce sont des oscillations libres amorties (régime pseudo-périodique). Plus la résistance totale R + r est grande, plus l'amortissement est fort ; pour une grande résistance, uC tend vers 0 sans osciller : régime apériodique. Le régime critique sépare les deux : uC revient à 0 le plus vite, sans osciller. L'amortissement est dû à l'effet Joule dans les résistances ; sans résistance, les oscillations seraient périodiques.",
    conclusion_courte: "Pseudo-périodique, critique, apériodique : selon R.",
    etapes: [
      { consigne: "Câblez : G+ vers K1, K0 vers C, C vers G− ; K2 vers la bobine, bobine vers R, R vers la deuxième borne de C ; GND sur cette borne, EA0 sur l'autre borne de C.", court: "Câblez le montage.", verifier: ({ faits }) => (M(faits).charge && M(faits).decharge && M(faits).mesure) || false },
      { consigne: "R = 10 Ω, C = 10 µF, noyau enfoncé, K en 1. Touchez « Lancer » (100 ms), puis basculez K en position 2.", court: "Enregistrez la décharge (R = 10 Ω).", aide_geste: "Touchez le condensateur pour changer C, la bobine pour le noyau.", verifier: ({ faits }) => vu(faits, (R) => R === 10, "pseudo-periodique") || false },
      { consigne: "La tension uC…", court: "Répondez dans le carnet.", question: choix(["oscille autour de 0 avec une amplitude qui diminue : oscillations libres amorties (régime pseudo-périodique)", "diminue jusqu'à 0 sans changer de signe", "oscille avec une amplitude constante"], "Regardez la courbe rouge.", "Exact.") },
      { consigne: "Remettez K en 1, réglez R = 100 Ω, puis enregistrez une nouvelle décharge.", court: "Enregistrez avec R = 100 Ω.", verifier: ({ faits }) => vu(faits, (R) => R === 100, "pseudo-periodique") || false },
      { consigne: "Quand R augmente…", court: "Répondez dans le carnet.", question: choix(["l'amplitude diminue plus vite : l'amortissement augmente", "l'amplitude reste la même", "les oscillations durent plus longtemps"], "Comparez avec la courbe en clair.", "Exact.") },
      { consigne: "Enregistrez une décharge avec R = 1 000 Ω.", court: "Enregistrez avec R = 1 kΩ.", verifier: ({ faits }) => vu(faits, (R) => R >= 470, "aperiodique") || false },
      { consigne: "Avec R = 1 000 Ω, uC…", court: "Répondez dans le carnet.", question: choix(["tend vers 0 sans osciller : régime apériodique", "oscille plus vite", "reste égale à E"], "uC change-t-elle de signe ?", "Exact.") },
      { consigne: "Le régime critique…", court: "Répondez dans le carnet.", question: choix(["sépare les deux régimes : uC revient à 0 le plus vite, sans osciller", "est le régime le plus oscillant", "n'existe que sans résistance"], "Essayez R = 220 Ω puis 470 Ω.", "Exact.") },
      { consigne: "L'amortissement des oscillations est dû…", court: "Répondez dans le carnet.", question: choix(["à la résistance totale R + r : effet Joule", "au condensateur seul", "au générateur"], "Que se passe-t-il quand R diminue ?", "Exact.") },
    ],
  };

  const PERIODE = {
    id: "periode", paillasse: 0, titre: "Pseudo-période et période propre",
    objectif: "Mesurer la pseudo-période pour plusieurs L et C ; la comparer à T₀ = 2π√(LC).",
    entetes: ["L (H)", "C (µF)", "T (ms)", "2π√(LC) (ms)"],
    donnees: ["Mesurez plusieurs pseudo-périodes au curseur, puis divisez", "Sans noyau : L = 0,050 H ; avec noyau : L = 0,50 H", "Gardez R = 10 Ω (amortissement faible)"],
    conclusion: "La pseudo-période ne dépend que de L et de C quand l'amortissement est faible : T ≈ T₀ = 2π√(LC), la période propre de l'oscillateur LC. Elle augmente avec L et avec C. L'équation aux dimensions de √(LC) donne une durée : √((V·s/A)·(A·s/V)) = s.",
    conclusion_courte: "T ≈ T₀ = 2π√(LC).",
    etapes: [
      { consigne: "Pseudo-période T de la décharge avec R = 10 Ω, L = 0,50 H, C = 10 µF (ms) ?", court: "T (ms) ?", question: { ...nombre("ms", T_ref, null, "Curseur sur deux maxima séparés de plusieurs pseudo-périodes.", "Exact."), tolerance_relative: 0.03 } },
      { consigne: "Mesurez T pour au moins quatre couples (L, C), avec R = 10 Ω. Tableur : en A : L (H) ; en B : C (µF) ; en C : T (ms) ; en D : 2π√(LC) (ms).", court: "Tableur : L, C, T, 2π√(LC).", aide_geste: "Touchez le condensateur (C) ou la bobine (noyau) ; choisissez une durée adaptée.", verifier: tableau },
      { consigne: "Tracez T (C) en fonction de 2π√(LC) (D).", court: "Courbe T = f(2π√(LC)).", verifier: ({ courbe }) => (courbe.x === "D" && courbe.y === "C" && courbe.n >= 4) || "Abscisse : D ; ordonnée : C." },
      { consigne: "Les points sont sur une droite de coefficient directeur 1 : la pseudo-période…", court: "Répondez dans le carnet.", question: choix(["est presque égale à la période propre T₀ = 2π√(LC)", "est proportionnelle à R", "ne dépend pas de C"], "Comparez C et D.", "Exact.") },
      { consigne: "L'équation aux dimensions de √(LC) montre que T₀ est…", court: "Répondez dans le carnet.", question: choix(["une durée : √((V·s/A)·(A·s/V)) = s", "une fréquence", "sans dimension"], "1 H = 1 V·s/A ; 1 F = 1 A·s/V.", "Exact.") },
    ],
  };

  const EQUATION = {
    id: "equation", paillasse: 0, titre: "Équation différentielle",
    objectif: "Établir l'équation différentielle à amortissement négligeable ; q(t) et i(t) ; période propre.",
    entetes: [],
    donnees: ["Convention récepteur : uC = q / C ; uL = L·di/dt (r négligée) ; i = dq/dt", "À t = 0 : q = C·E et i = 0"],
    conclusion: "Sans résistance, uC + uL = 0, soit L·d²q/dt² + q/C = 0, ou d²q/dt² + q/(LC) = 0. La solution est q(t) = Qm·cos(2πt/T₀ + φ) avec T₀ = 2π√(LC) ; ici φ = 0 et Qm = C·E = 60 µC. L'intensité i = dq/dt = −(2π/T₀)·Qm·sin(2πt/T₀) est en quadrature avec q : elle est nulle quand la charge est maximale.",
    conclusion_courte: "d²q/dt² + q/(LC) = 0 ; T₀ = 2π√(LC).",
    etapes: [
      { consigne: "Avec R + r négligeable, la loi d'additivité des tensions donne…", court: "Répondez dans le carnet.", question: choix(["L·d²q/dt² + q/C = 0", "L·dq/dt + q/C = 0", "L·q + C·d²q/dt² = 0"], "uL = L·di/dt et i = dq/dt.", "Exact.") },
      { consigne: "La solution de d²q/dt² + q/(LC) = 0 est…", court: "Répondez dans le carnet.", question: choix(["q(t) = Qm·cos(2πt/T₀ + φ), avec T₀ = 2π√(LC)", "q(t) = Qm·e^(−t/τ)", "q(t) = Qm·t/T₀"], "Une fonction dont la dérivée seconde est proportionnelle à elle-même, au signe près.", "Exact.") },
      { consigne: "Charge maximale Qm = C·E, avec C = 10 µF et E = 6,0 V (µC) ?", court: "Qm (µC) ?", question: nombre("µC", 60, 0.5, "Qm = 10 × 10⁻⁶ × 6,0.", "Exact : φ = 0 car q(0) = Qm.") },
      { consigne: "L'intensité i = dq/dt s'écrit…", court: "Répondez dans le carnet.", question: choix(["i(t) = −(2π/T₀)·Qm·sin(2πt/T₀) : nulle quand q est maximale", "i(t) = Qm·cos(2πt/T₀)", "i(t) = 0"], "Dérivez q(t).", "Exact.") },
      { consigne: "Période propre pour L = 0,50 H et C = 10 µF (ms) ?", court: "T₀ (ms) ?", question: nombre("ms", 14.05, 0.1, "T₀ = 2π√(0,50 × 10 × 10⁻⁶).", "Exact : environ 14 ms, comme la pseudo-période mesurée.") },
    ],
  };

  L.demarrer({ id: "b2_elec3_a1_decharge", titre: "Laboratoire : décharge oscillante d'un condensateur", decor: "aucun", paillasses: [(g) => L.poste_rlc(g)], missions: [REGIMES, PERIODE, EQUATION] });
})(window.Labo);

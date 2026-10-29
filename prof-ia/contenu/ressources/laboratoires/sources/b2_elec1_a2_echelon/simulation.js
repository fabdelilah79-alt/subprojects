/*
Rôle : simulation de l'activité 2 du chapitre « Dipôle RC » (2e année du bac) : réponse d'un dipôle RC à un échelon de
       tension, enregistrée par une interface d'acquisition ; continuité de uC, régime permanent, constante de temps τ
       (63 % et tangente à l'origine), influence de R et de C (τ = R·C au tableur), décharge ; équation différentielle et
       sa solution. Objectifs O4, O5, O6.
Reçoit : rien (les vérifications lisent les faits « montage_rc », « acquisition », « taus », la feuille et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const D = (f) => (f.acquisition || {}).derniere || {}, M = (f) => f.montage_rc || {};
  const charge = (f) => D(f).u_fin - D(f).u_debut > 3, decharge = (f) => D(f).u_debut - D(f).u_fin > 3;

  function tableau({ faits, feuille }) {
    // Au moins quatre couples (R, C) différents : R (kΩ) en A, C (µF) en B, τ mesurée (s) en C, R·C (s) en D.
    const l = feuille.lignes(["A", "B", "C", "D"]), t = faits.taus || [];
    if (l.length < 4) return false;
    for (const [k, x] of l.entries()) {
      if (!t.some((m) => Math.abs(m.R - x.A * 1000) < 1 && Math.abs(m.C - x.B * 1e-6) < 1e-9 && Math.abs(m.tau - x.C) <= 0.03 * m.tau + 0.005)) return `Ligne ${k + 2} : en A R (kΩ), en B C (µF) d'une de vos acquisitions, en C la constante de temps τ que vous avez mesurée (s).`;
      if (Math.abs(x.D - (x.A * x.B) / 1000) > 0.002 * x.D + 1e-4) return `Ligne ${k + 2} : en D, R·C en secondes : =A${k + 2}*B${k + 2}/1000.`;
    }
    return new Set(l.map((x) => `${x.A}:${x.B}`)).size >= 4 || "Quatre couples (R, C) différents.";
  }

  const CHARGE = {
    id: "charge", paillasse: 0, titre: "Charge d'un condensateur",
    objectif: "Câbler le montage ; enregistrer la tension uC pendant la charge ; déterminer la constante de temps τ.",
    entetes: [],
    donnees: ["E = 6,0 V ; R = 10 kΩ ; C = 100 µF", "τ : instant où uC atteint 63 % de sa valeur finale ; la tangente à l'origine coupe l'asymptote à t = τ"],
    conclusion: "Quand on bascule K en position 1, uC augmente progressivement de 0 à E : la tension aux bornes d'un condensateur est continue, elle ne fait pas de saut ; la charge n'est pas instantanée. En régime permanent, uC = E et le courant est nul. La constante de temps τ, lue à 63 % de E ou par la tangente à l'origine, vaut 1,0 s : c'est le produit R·C.",
    conclusion_courte: "uC continue ; τ = R·C = 1,0 s.",
    etapes: [
      { consigne: "Câblez : G+ vers K1, K0 vers R, R vers C1, C2 vers G− ; K2 vers C2 (décharge) ; EA0 sur C1, GND sur C2.", court: "Câblez le montage.", aide_geste: "Tirez un fil d'une borne à l'autre.", verifier: ({ faits }) => (M(faits).serie && M(faits).decharge && M(faits).mesure) || false },
      { consigne: "K en position 2 (condensateur déchargé). Touchez « Lancer » sur l'ordinateur (durée 5 s), puis basculez K en position 1.", court: "Enregistrez la charge.", aide_geste: "Touchez le commutateur pour le basculer.", verifier: ({ faits }) => (charge(faits) && D(faits).R === 10000 && D(faits).C === 1e-4) || false },
      { consigne: "Au moment où l'on bascule K, la tension uC…", court: "Répondez dans le carnet.", question: choix(["part de 0 et augmente progressivement : elle ne fait pas de saut (elle est continue)", "saute aussitôt à 6 V", "reste nulle"], "Regardez le début de la courbe.", "Exact : la charge n'est pas instantanée.") },
      { consigne: "Valeur de uC en régime permanent (V) ?", court: "uC finale (V) ?", question: nombre("V", (f) => D(f).u_fin || 6, 0.05, "Fin de la courbe.", "Exact : uC = E.") },
      { consigne: "Placez le curseur où uC = 0,63 × E. Constante de temps τ (s) ?", court: "τ (s) ?", question: nombre("s", (f) => D(f).tau || 1, 0.03, "Glissez le curseur vert sur le graphique.", "Exact.") },
      { consigne: "Touchez « Tangente ». La tangente à l'origine coupe l'asymptote uC = E…", court: "Répondez dans le carnet.", question: choix(["à t = τ", "à t = 2τ", "à t = 5τ"], "Lisez l'abscisse du point bleu.", "Exact : deuxième méthode pour mesurer τ.") },
      { consigne: "Calculez R·C (s).", court: "R·C (s) ?", question: nombre("s", 1, 0.01, "R = 10 × 10³ Ω ; C = 100 × 10⁻⁶ F.", "Exact : τ = R·C.") },
    ],
  };

  const INFLUENCE = {
    id: "influence", paillasse: 0, titre: "Influence de R et de C",
    objectif: "Mesurer τ pour plusieurs résistances et capacités ; vérifier τ = R·C.",
    entetes: ["R (kΩ)", "C (µF)", "τ (s)", "R·C (s)"],
    donnees: ["Chaque enregistrement doit partir d'un condensateur complètement déchargé (ou chargé) et durer au moins 5τ", "Une capacité neuve, choisie sur la boîte, est déchargée"],
    conclusion: "τ augmente avec R (C fixée) et avec C (R fixée) : la charge est plus lente. Les mesures vérifient τ = R·C. Équation aux dimensions : [R]·[C] = (U/I)·(I·T/U) = T : τ est un temps, en secondes. Au bout de 5τ, le condensateur est chargé à plus de 99 %.",
    conclusion_courte: "τ = R·C.",
    etapes: [
      { consigne: "Mesurez τ pour au moins quatre couples (R, C) différents (charges ou décharges). Tableur : en A : R (kΩ) ; en B : C (µF) ; en C : τ (s) ; en D : R·C (s).", court: "Tableur : R, C, τ, R·C.", aide_geste: "Touches − et + de la boîte de résistances ; touchez la boîte de condensateurs pour changer C ; choisissez une durée d'environ 5τ.", verifier: tableau },
      { consigne: "Tracez τ (C) en fonction de R·C (D).", court: "Courbe τ = f(RC).", verifier: ({ courbe }) => (courbe.x === "D" && courbe.y === "C" && courbe.n >= 4) || "Abscisse : D (R·C) ; ordonnée : C (τ)." },
      { consigne: "La courbe est une droite qui passe par l'origine, de coefficient directeur…", court: "Répondez dans le carnet.", question: choix(["1 : τ = R·C", "2 : τ = 2 R·C", "0,63"], "Comparez τ et R·C ligne par ligne.", "Exact.") },
      { consigne: "Quand R augmente (C fixée), la charge…", court: "Répondez dans le carnet.", question: choix(["est plus lente : τ augmente", "est plus rapide", "ne change pas"], "Comparez deux courbes.", "Exact.") },
      { consigne: "L'équation aux dimensions de R·C montre que τ est…", court: "Répondez dans le carnet.", question: choix(["un temps : [R]·[C] = (U/I)·(I·T/U) = T", "une tension", "sans dimension"], "R = U/I ; C = q/u = I·t/u.", "Exact.") },
    ],
  };

  const DECHARGE = {
    id: "decharge", paillasse: 0, titre: "Décharge et équation différentielle",
    objectif: "Enregistrer la décharge ; établir l'équation différentielle et vérifier sa solution.",
    entetes: [],
    donnees: ["Loi d'additivité des tensions : uR + uC = E (charge) ; uR = R·i ; i = dq/dt = C·duC/dt", "e⁻¹ ≈ 0,37"],
    conclusion: "Pendant la charge, uR + uC = E avec uR = R·C·duC/dt : uC + R·C·duC/dt = E. La solution uC = E·(1 − e^(−t/τ)), avec τ = R·C, vérifie cette équation et la condition initiale uC(0) = 0. Pendant la décharge (E = 0), uC + R·C·duC/dt = 0 et uC = E·e^(−t/τ) : à t = τ, il reste 37 % de E. L'intensité i = C·duC/dt vaut E/R au début de la charge, puis tend vers 0.",
    conclusion_courte: "uC + RC·duC/dt = E ; uC = E(1 − e^(−t/RC)).",
    etapes: [
      { consigne: "R = 10 kΩ, C = 100 µF. Chargez le condensateur (K en 1), touchez « Lancer », puis basculez K en position 2.", court: "Enregistrez la décharge.", verifier: ({ faits }) => (decharge(faits) && D(faits).R === 10000 && D(faits).C === 1e-4) || false },
      { consigne: "Tension uC à t = τ = 1,0 s (V) ?", court: "uC(τ) (V) ?", question: nombre("V", (f) => (D(f).u_debut || 6) * Math.exp(-1), 0.1, "Placez le curseur à t = 1,00 s.", "Exact : environ 37 % de E.") },
      { consigne: "Pendant la charge, uR + uC = E avec uR = R·i et i = C·duC/dt. L'équation différentielle s'écrit…", court: "Répondez dans le carnet.", question: choix(["uC + R·C·duC/dt = E", "uC − R·C·duC/dt = E", "R·C·uC + duC/dt = E"], "Remplacez uR par R·C·duC/dt.", "Exact.") },
      { consigne: "Sa solution, avec uC(0) = 0, est…", court: "Répondez dans le carnet.", question: choix(["uC = E·(1 − e^(−t/τ)), avec τ = R·C", "uC = E·e^(−t/τ)", "uC = E·t/τ"], "Elle part de 0 et tend vers E.", "Exact : en la remplaçant dans l'équation, on retrouve E.") },
      { consigne: "Pendant la décharge, la solution est…", court: "Répondez dans le carnet.", question: choix(["uC = E·e^(−t/τ)", "uC = E·(1 − e^(−t/τ))", "uC = E"], "Elle part de E et tend vers 0.", "Exact.") },
      { consigne: "Intensité du courant au tout début de la charge, i₀ = E / R (mA) ?", court: "i₀ (mA) ?", question: nombre("mA", 0.6, 0.01, "À t = 0, uC = 0 : toute la tension E est aux bornes de R.", "Exact : puis i diminue jusqu'à 0.") },
    ],
  };

  L.demarrer({ id: "b2_elec1_a2_echelon", titre: "Laboratoire : réponse d'un dipôle RC", decor: "aucun", paillasses: [L.poste_echelon], missions: [CHARGE, INFLUENCE, DECHARGE] });
})(window.Labo);

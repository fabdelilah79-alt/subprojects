/*
Rôle : simulation de l'activité 3 du chapitre « Oscillations libres d'un circuit RLC série » (2e année du bac) : entretien
       des oscillations par un dispositif à amplificateur opérationnel (rôle fonctionnel : il se comporte comme une
       résistance négative −R₀ et fournit de l'énergie) ; oscillations sinusoïdales quand R₀ = R + r, période T₀ ;
       amplification limitée par la saturation ; production d'une tension sinusoïdale de fréquence donnée. Objectifs O5, O6, O3.
Reçoit : rien (les vérifications lisent les faits « montage_rlc » et « oscillations »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const relatif = (unite, attendu, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: 0.03, aide, bravo });
  const O = (f) => f.oscillations || [], M = (f) => f.montage_rlc || {};
  const entretenue = (f) => O(f).filter((o) => o.regime === "periodique" && o.T);
  const derniere = (f) => entretenue(f).slice(-1)[0] || { T: 0.01406 };
  const a_150 = (f) => entretenue(f).some((o) => Math.abs(1 / o.T - 150) < 15);

  const ENTRETIEN = {
    id: "entretien", paillasse: 0, titre: "Entretenir les oscillations",
    objectif: "Insérer le dispositif d'entretien dans le circuit ; régler R₀ pour obtenir des oscillations d'amplitude constante.",
    entetes: [],
    donnees: ["Bobine : r = 10 Ω ; R = 10 Ω ; L = 0,50 H (noyau) ; C = 10 µF", "Dispositif d'entretien : u = −R₀·i (il fournit l'énergie R₀·i²)", "Touches − et + du dispositif : R₀ de 0 à 40 Ω"],
    conclusion: "Sans entretien (R₀ = 0), les oscillations s'amortissent. Le dispositif d'entretien fournit au circuit, à chaque instant, l'énergie dissipée par effet Joule : quand R₀ = R + r, il la compense exactement et les oscillations sont sinusoïdales, d'amplitude constante, de période T₀ = 2π√(LC). Si R₀ > R + r, l'amplitude augmente jusqu'à la saturation de l'amplificateur, qui la limite (la tension se déforme un peu). L'énergie vient de l'alimentation ±15 V du dispositif.",
    conclusion_courte: "R₀ = R + r : oscillations entretenues, période T₀.",
    etapes: [
      { consigne: "Câblez : G+ vers K1, K0 vers C, C vers G− ; K2 vers la bobine, bobine vers R, R vers la borne 1 du dispositif, sa borne 2 vers G− ; GND au −, EA0 sur la borne de C reliée à K0.", court: "Câblez le circuit avec le dispositif.", verifier: ({ faits }) => (M(faits).charge && M(faits).decharge && M(faits).mesure) || false },
      { consigne: "R₀ = 0 : touchez « Lancer » (100 ms), puis basculez K en 2.", court: "Enregistrez sans entretien (R₀ = 0).", verifier: ({ faits }) => O(faits).some((o) => o.R0 === 0 && o.regime === "pseudo-periodique") || false },
      { consigne: "Remettez K en 1. Augmentez R₀ et recommencez jusqu'à obtenir des oscillations d'amplitude constante.", court: "Réglez R₀ : amplitude constante.", aide_geste: "Touches − et + du dispositif d'entretien.", verifier: ({ faits }) => entretenue(faits).length > 0 || false },
      { consigne: "Résistance totale R + r du circuit (Ω) ?", court: "R + r (Ω) ?", question: nombre("Ω", 20, 0.5, "R = 10 Ω ; r = 10 Ω.", "Exact : les oscillations sont entretenues quand R₀ = R + r.") },
      { consigne: "Le rôle du dispositif d'entretien est de…", court: "Répondez dans le carnet.", question: choix(["fournir au circuit l'énergie perdue par effet Joule", "supprimer la résistance de la bobine", "fournir une tension continue"], "D'où vient l'énergie qui compense les pertes ?", "Exact : il puise cette énergie dans son alimentation.") },
      { consigne: "Période des oscillations entretenues (ms) ?", court: "T (ms) ?", question: relatif("ms", (f) => derniere(f).T * 1000, "Curseur sur plusieurs périodes.", "Exact.") },
      { consigne: "Cette période est…", court: "Répondez dans le carnet.", question: choix(["la période propre T₀ = 2π√(LC)", "plus grande que T₀", "égale à R₀·C"], "Comparez à 2π√(LC).", "Exact.") },
      { consigne: "Réglez R₀ = 40 Ω (plus que R + r) et enregistrez.", court: "Enregistrez avec R₀ = 40 Ω.", verifier: ({ faits }) => O(faits).some((o) => o.R0 > 20 && o.regime === "amplifie") || false },
      { consigne: "Avec R₀ > R + r, l'amplitude…", court: "Répondez dans le carnet.", question: choix(["augmente, puis est limitée par la saturation de l'amplificateur", "diminue", "devient infinie"], "Regardez toute la courbe.", "Exact.") },
    ],
  };

  const SINUS = {
    id: "sinus", paillasse: 0, titre: "Tension sinusoïdale de fréquence donnée",
    objectif: "Choisir L et C pour produire une tension sinusoïdale de fréquence 150 Hz.",
    entetes: [],
    donnees: ["f₀ = 1 / T₀ = 1 / (2π√(LC))", "Bobine : L = 0,50 H (noyau) ou 0,050 H", "Boîte de condensateurs : 1 ; 2,2 ; 4,7 ; 10 µF"],
    conclusion: "Un circuit LC entretenu est un générateur de tension sinusoïdale ; sa fréquence f₀ = 1/(2π√(LC)) se règle par L et C. Pour 150 Hz avec L = 0,50 H, il faut C ≈ 2,2 µF.",
    conclusion_courte: "f₀ = 1/(2π√(LC)) se règle par L et C.",
    etapes: [
      { consigne: "Capacité nécessaire pour f = 150 Hz avec L = 0,50 H (µF) ?", court: "C (µF) ?", question: nombre("µF", 2.25, 0.1, "C = 1 / (4π²·f²·L).", "Exact : prenez 2,2 µF.") },
      { consigne: "Réglez C et R₀ ; enregistrez une tension sinusoïdale entretenue de fréquence 150 Hz (à 10 % près).", court: "Produisez 150 Hz.", aide_geste: "Touchez le condensateur pour changer C ; choisissez une durée de 20 ou 50 ms.", verifier: ({ faits }) => a_150(faits) || false },
      { consigne: "Fréquence mesurée f = 1/T (Hz) ?", court: "f (Hz) ?", question: relatif("Hz", (f) => 1 / derniere(f).T, "Mesurez T au curseur, puis f = 1/T.", "Exact.") },
      { consigne: "Pour changer la fréquence de la tension produite, on…", court: "Répondez dans le carnet.", question: choix(["change L ou C : f₀ = 1/(2π√(LC))", "change R₀", "change la tension E du générateur"], "De quoi dépend T₀ ?", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_elec3_a3_entretien", titre: "Laboratoire : entretien des oscillations", decor: "aucun", paillasses: [(g) => L.poste_rlc(g, { entretien: true })], missions: [ENTRETIEN, SINUS] });
})(window.Labo);

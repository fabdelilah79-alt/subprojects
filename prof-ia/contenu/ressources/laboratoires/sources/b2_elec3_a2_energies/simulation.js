/*
Rôle : simulation de l'activité 2 du chapitre « Oscillations libres d'un circuit RLC série » (2e année du bac) : évolution
       graphique des énergies à l'ordinateur (mode « Énergies » du logiciel) : énergie électrique ½·C·uC², énergie
       magnétique ½·L·i² (i = uR / R) et énergie totale ; échanges entre condensateur et bobine, dissipation par effet
       Joule ; interprétation énergétique des trois régimes. Objectif O4.
Reçoit : rien (les vérifications lisent les faits « montage_rlc », « oscillations », « acquisition »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const O = (f) => f.oscillations || [], M = (f) => f.montage_rlc || {};
  const vu = (f, R, regime) => O(f).some((o) => R(o.R) && o.L === 0.5 && o.C === 1e-5 && o.regime === regime);
  const ref = (f) => O(f).find((o) => o.R === 10 && o.L === 0.5 && o.C === 1e-5 && o.T) || { R: 10, L: 0.5, C: 1e-5, T: 0.01406, U0: 6 };
  const energies = (f) => (f.acquisition || {}).voie2 === "Énergies";

  const ECHANGES = {
    id: "echanges", paillasse: 0, titre: "Énergies et échanges",
    objectif: "Afficher les énergies électrique, magnétique et totale ; interpréter leurs échanges et la diminution de l'énergie totale.",
    entetes: [],
    donnees: ["Énergie électrique (condensateur) : Ee = ½·C·uC²", "Énergie magnétique (bobine) : Em = ½·L·i², avec i = uR / R (EA1 sur R)", "Énergie totale : E = Ee + Em"],
    conclusion: "Pendant les oscillations, l'énergie passe du condensateur à la bobine et inversement : quand uC est extrême, i = 0, Em = 0 et Ee est maximale ; quand uC = 0, l'intensité est maximale et l'énergie est surtout magnétique. L'énergie totale diminue : elle est dissipée par effet Joule dans R + r ; c'est l'origine de l'amortissement.",
    conclusion_courte: "Échanges Ee ⇄ Em ; E diminue par effet Joule.",
    etapes: [
      { consigne: "Câblez comme pour la décharge, et ajoutez EA1 sur la borne de R reliée à la bobine (EA1 : uR = R·i).", court: "Câblez le montage avec EA1.", verifier: ({ faits }) => (M(faits).charge && M(faits).decharge && M(faits).mesure && M(faits).intensite) || false },
      { consigne: "R = 10 Ω, C = 10 µF, noyau enfoncé, K en 1. Touchez « Lancer » (100 ms), puis basculez K en position 2.", court: "Enregistrez la décharge.", verifier: ({ faits }) => vu(faits, (R) => R === 10, "pseudo-periodique") || false },
      { consigne: "Touchez « Voie 2 » jusqu'à « Énergies » : le logiciel calcule Ee (rouge), Em (orange) et E (bleu).", court: "Affichez les énergies.", verifier: ({ faits }) => energies(faits) || false },
      { consigne: "Énergie totale à t = 0 (µJ) ?", court: "E(0) (µJ) ?", question: nombre("µJ", (f) => 0.5 * 1e-5 * ref(f).U0 ** 2 * 1e6, 4, "Curseur à t = 0, ou ½·C·E².", "Exact : ½ × 10 µF × (6,0 V)² ≈ 180 µJ.") },
      { consigne: "Quand Ee est maximale, Em…", court: "Répondez dans le carnet.", question: choix(["est nulle : i = 0 ; l'énergie passe du condensateur à la bobine, puis revient", "est maximale aussi", "est égale à Ee"], "Comparez les courbes rouge et orange.", "Exact : ce sont des échanges d'énergie.") },
      { consigne: "L'énergie totale E…", court: "Répondez dans le carnet.", question: choix(["diminue : elle est dissipée par effet Joule dans R + r", "reste constante", "augmente"], "Regardez la courbe bleue.", "Exact : c'est l'amortissement.") },
      { consigne: "Placez le curseur à t ≈ T (une pseudo-période). Pourcentage de l'énergie initiale perdu pendant la première pseudo-période (%) ?", court: "Énergie perdue en une pseudo-période (%) ?", question: nombre("%", (f) => 100 * (1 - Math.exp((-(ref(f).R + 10) * ref(f).T) / ref(f).L)), 4, "(E(0) − E(T)) / E(0) × 100.", "Exact : près de la moitié de l'énergie est dissipée à chaque pseudo-période.") },
    ],
  };

  const REGIMES = {
    id: "regimes_energie", paillasse: 0, titre: "Les trois régimes et l'énergie",
    objectif: "Interpréter énergétiquement les régimes apériodique, pseudo-périodique et périodique.",
    entetes: [],
    donnees: ["Régime apériodique : grande résistance", "Régime périodique (idéal) : R + r = 0", "E = ½·C·uC² + ½·L·i²"],
    conclusion: "En régime apériodique, l'énergie du condensateur est dissipée par effet Joule avant de pouvoir être échangée : Em reste faible et E décroît sans oscillation. En régime pseudo-périodique, une partie de l'énergie est perdue à chaque échange. Sans résistance (régime périodique), l'énergie totale se conserverait : ½·C·Um² = ½·L·Im², et les oscillations seraient sinusoïdales, d'amplitude constante.",
    conclusion_courte: "Apériodique : dissipation sans échange ; périodique : E constante.",
    etapes: [
      { consigne: "En mode Énergies, enregistrez une décharge avec R = 1 000 Ω.", court: "Énergies avec R = 1 kΩ.", verifier: ({ faits }) => (energies(faits) && vu(faits, (R) => R >= 470, "aperiodique")) || false },
      { consigne: "En régime apériodique…", court: "Répondez dans le carnet.", question: choix(["l'énergie du condensateur est dissipée par effet Joule presque sans échange : Em reste faible", "l'énergie est échangée plusieurs fois", "l'énergie totale reste constante"], "Comparez la courbe orange aux enregistrements précédents.", "Exact.") },
      { consigne: "Sans aucune résistance (R + r = 0), l'énergie totale…", court: "Répondez dans le carnet.", question: choix(["resterait constante : les échanges Ee ⇄ Em dureraient sans fin (régime périodique)", "diminuerait quand même", "serait nulle"], "Qu'est-ce qui dissipe l'énergie ?", "Exact.") },
      { consigne: "Dans ce cas idéal, avec C = 10 µF, Um = 6,0 V et L = 0,50 H, intensité maximale Im (mA) ?", court: "Im (mA) ?", question: nombre("mA", 26.8, 0.6, "½·C·Um² = ½·L·Im².", "Exact : Im = Um·√(C/L) ≈ 27 mA.") },
    ],
  };

  L.demarrer({ id: "b2_elec3_a2_energies", titre: "Laboratoire : énergies d'un circuit RLC", decor: "aucun", paillasses: [(g) => L.poste_rlc(g, { energies: true })], missions: [ECHANGES, REGIMES] });
})(window.Labo);

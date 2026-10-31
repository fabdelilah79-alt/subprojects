/*
Rôle : simulation de l'activité 3 du chapitre « Systèmes mécaniques oscillants » (2e année du bac) : montage qui distingue
       l'excitateur (moteur à excentrique) du résonateur (solide-ressort horizontal) ; période propre du résonateur ;
       oscillations forcées à la fréquence de l'excitateur ; résonance quand f est proche de f0 (variation qualitative de
       l'amplitude, SANS tracer de courbe) ; influence de l'amortissement. Objectif O5.
Reçoit : rien (les vérifications lisent « lachers_resonance », « chronometre », « excitateur », « amplitudes »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const T0 = 2 * Math.PI * Math.sqrt(0.2 / 20), F0 = 1 / T0;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const mesures = (f) => f.chronometre?.mesures || [], A = (f) => (f.amplitudes || []).filter((a) => a.marche);
  const chrono = (f, T) => mesures(f).some((t) => [5, 10].some((n) => Math.abs(t / n - T) < 0.05 * T));
  const amp = (f, a, test) => A(f).some((x) => x.amortisseur === a && test(x.f));

  const RESONATEUR = {
    id: "resonateur", paillasse: 0, titre: "Excitateur et résonateur",
    objectif: "Mesurer la période propre du résonateur, puis le faire osciller avec l'excitateur à 0,8 Hz.",
    entetes: [], donnees: ["Résonateur : mobile et ses deux ressorts", "Excitateur : moteur à excentrique relié au ressort de droite", "f = 1 / T"],
    conclusion: "Le résonateur (le solide-ressort) écarté puis lâché oscille à sa période propre T0. Relié à un excitateur qui lui impose un mouvement périodique, il effectue des oscillations forcées : il oscille à la fréquence de l'excitateur, et non à sa fréquence propre.",
    conclusion_courte: "Oscillations forcées : à la fréquence de l'excitateur.",
    etapes: [
      { consigne: "Moteur arrêté : écartez le mobile de 4 cm, lâchez-le et chronométrez 10 oscillations (elles sont rapides).", court: "T0 du résonateur.", aide_geste: "« ▶∥ » au lâcher, « ▶∥ » après 10 allers-retours.", verifier: ({ faits }) => ((faits.lachers_resonance || []).some((l) => !l.marche) && (chrono(faits, T0) || "Chronométrez 10 oscillations complètes, puis divisez par 10.")) || false },
      { consigne: "Fréquence propre f0 du résonateur (Hz) ?", court: "f0 (Hz) ?", question: nombre("Hz", F0, 0.08, "f0 = 1 / T0.", "Exact : environ 1,6 Hz.") },
      { consigne: "Dans ce montage…", court: "Répondez dans le carnet.", question: choix(["le moteur est l'excitateur, le mobile et ses ressorts sont le résonateur", "le mobile est l'excitateur", "le ressort de gauche est l'excitateur"], "Qui impose le mouvement ?", "Exact.") },
      { consigne: "Réglez f = 0,8 Hz et mettez le moteur en marche ; attendez 10 s, puis chronométrez 5 oscillations du mobile.", court: "Excitateur à 0,8 Hz.", verifier: ({ faits }) => (faits.excitateur?.marche && faits.excitateur?.f === 0.8 && chrono(faits, 1 / 0.8)) || false },
      { consigne: "Le mobile oscille…", court: "Répondez dans le carnet.", question: choix(["à la fréquence de l'excitateur (oscillations forcées)", "à sa fréquence propre", "de plus en plus vite"], "Comparez avec 1/0,8 = 1,25 s.", "Exact.") },
    ],
  };

  const RESONANCE = {
    id: "resonance", paillasse: 0, titre: "La résonance",
    objectif: "Changer la fréquence de l'excitateur et lire l'amplitude du mobile avec les témoins.",
    entetes: [], donnees: ["Après chaque réglage, attendez 10 s : le régime forcé s'établit", "Puis touchez les témoins (ils reviennent contre l'aiguille) et laissez-les s'écarter", "Amplitude = (témoin de droite − témoin de gauche) / 2"],
    conclusion: "L'amplitude des oscillations forcées dépend de la fréquence de l'excitateur : elle est faible loin de la fréquence propre, et devient très grande quand la fréquence de l'excitateur est proche de la fréquence propre du résonateur : c'est la résonance.",
    conclusion_courte: "Résonance : f excitateur ≈ f0 ; amplitude maximale.",
    etapes: [
      { consigne: "Moteur en marche, sans amortisseur : essayez au moins une fréquence sous 1,3 Hz, une au-dessus de 1,9 Hz et cherchez celle qui donne la plus grande amplitude (à chaque réglage : attendez 10 s, remettez les témoins, lisez l'amplitude).", court: "Cherchez la résonance.", aide_geste: "Touches − et + de l'alimentation ; touchez les témoins rouges pour les remettre contre l'aiguille.", verifier: ({ faits }) => (amp(faits, "aucun", (f) => f <= 1.3) && amp(faits, "aucun", (f) => f >= 1.9) && amp(faits, "aucun", (f) => Math.abs(f - 1.6) < 0.05)) || false },
      { consigne: "Fréquence de l'excitateur qui donne la plus grande amplitude (Hz) ?", court: "f de résonance (Hz) ?", question: nombre("Hz", F0, 0.12, "Celle où les témoins s'écartent le plus.", "Exact.") },
      { consigne: "À la résonance, la fréquence de l'excitateur est…", court: "Répondez dans le carnet.", question: choix(["proche de la fréquence propre du résonateur", "deux fois la fréquence propre", "sans lien avec la fréquence propre"], "Comparez avec f0 mesurée.", "Exact.") },
      { consigne: "Loin de la résonance (0,8 Hz ou 2,5 Hz), l'amplitude du mobile est…", court: "Répondez dans le carnet.", question: choix(["faible", "maximale", "nulle"], "Regardez les témoins.", "Exact : le résonateur répond peu.") },
    ],
  };

  const AMORTI = {
    id: "amortissement", paillasse: 0, titre: "Résonance et amortissement",
    objectif: "À la résonance, comparer l'amplitude sans amortisseur, avec la palette, puis avec l'aimant.",
    entetes: [], donnees: ["Palette : amortissement faible ; aimant : amortissement fort"],
    conclusion: "L'amortissement diminue l'amplitude à la résonance : faiblement amorti, le résonateur a une résonance aiguë (grande amplitude) ; plus l'amortissement est fort, plus la résonance est floue et l'amplitude faible ; très amorti, il n'y a presque plus de résonance.",
    conclusion_courte: "Plus d'amortissement : résonance plus floue, amplitude plus faible.",
    etapes: [
      { consigne: "f = 1,6 Hz : posez la palette sur le mobile ; attendez 10 s, remettez les témoins et lisez l'amplitude.", court: "Résonance avec la palette.", verifier: ({ faits }) => amp(faits, "palette", (f) => Math.abs(f - 1.6) < 0.05) || false },
      { consigne: "Remplacez la palette par l'aimant de freinage ; attendez 10 s, remettez les témoins et lisez l'amplitude.", court: "Résonance avec l'aimant.", verifier: ({ faits }) => amp(faits, "aimant", (f) => Math.abs(f - 1.6) < 0.05) || false },
      { consigne: "Plus l'amortissement est fort, l'amplitude à la résonance est…", court: "Répondez dans le carnet.", question: choix(["plus faible : la résonance est plus floue", "plus grande", "la même"], "Comparez les trois amplitudes.", "Exact.") },
      { consigne: "Pourquoi ajoute-t-on des amortisseurs aux ponts, aux immeubles ou aux voitures ?", court: "Répondez dans le carnet.", question: choix(["pour éviter une résonance de trop grande amplitude", "pour qu'ils oscillent plus", "pour augmenter leur fréquence propre"], "Une grande amplitude peut casser une structure.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_meca4_a3_resonance", titre: "Laboratoire : la résonance mécanique", paillasses: [L.poste_resonance], missions: [RESONATEUR, RESONANCE, AMORTI] });
})(window.Labo);

/*
Rôle : simulation de l'activité 2 du chapitre « Modulation d'amplitude » (2e année du bac) : modulation avec un circuit
       multiplieur (porteuse et signal modulant à l'oscilloscope, taux de modulation, surmodulation, condition Fp ≫ Fs),
       puis démodulation : détecteur d'enveloppe (diode et R₁∥C₁, choix de la constante de temps), filtre passe-haut qui
       retire la composante continue. Objectifs O2, O3, O4.
Reçoit : rien (les vérifications lisent les faits « montage_am », « am »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const A = (f) => f.am || {}, M = (f) => f.montage_am || {}, V = (f) => M(f).voies || {};
  const module_ok = (f) => M(f).X === "porteuse" && M(f).Y === "signal" && M(f).masses;

  const MODULATION = {
    id: "modulation", paillasse: 0, titre: "Moduler l'amplitude d'une porteuse",
    objectif: "Réaliser une tension modulée en amplitude avec un multiplieur ; taux de modulation ; éviter la surmodulation.",
    entetes: [],
    donnees: ["Porteuse p(t) = Pm·cos(2π·Fp·t) ; signal modulant s(t) = Sm·cos(2π·Fs·t)", "Multiplieur : u(t) = k·p(t)·(s(t) + U₀), k = 0,1 V⁻¹", "Taux de modulation m = (Umax − Umin)/(Umax + Umin)"],
    conclusion: "Le multiplieur donne u(t) = k·Pm·(U₀ + s(t))·cos(2π·Fp·t) = A·(1 + m·cos(2π·Fs·t))·cos(2π·Fp·t) : l'amplitude de la porteuse varie comme le signal modulant. Le taux de modulation vaut m = Sm/U₀ = (Umax − Umin)/(Umax + Umin). Pour que l'enveloppe reproduise le signal, il faut m < 1 (U₀ > Sm) — sinon il y a surmodulation — et Fp ≫ Fs.",
    conclusion_courte: "m = Sm/U₀ < 1 et Fp ≫ Fs.",
    etapes: [
      { consigne: "Câblez : SORTIE du GBF 1 sur X, SORTIE du GBF 2 sur Y, les masses des GBF sur la masse de la maquette. Oscilloscope : masse sur la maquette, Y1 sur S, Y2 sur la sortie du GBF 2.", court: "Câblez le modulateur et l'oscilloscope.", verifier: ({ faits }) => (module_ok(faits) && V(faits).Y1 === "S" && V(faits).Y2 === "signal") || false },
      { consigne: "Sur l'écran, la tension u (voie 1)…", court: "Répondez dans le carnet.", question: choix(["a une amplitude qui varie comme le signal modulant : c'est une modulation d'amplitude", "a une fréquence qui varie", "est identique à la porteuse"], "Comparez l'enveloppe de la voie 1 à la voie 2 (balayage 0,5 ms/div).", "Exact.") },
      { consigne: "Lisez Umax et Umin de l'enveloppe ; taux de modulation m = (Umax − Umin)/(Umax + Umin) ?", court: "m ?", question: nombre("", (f) => A(f).m_mesure || 0.5, 0.05, "Umax : sommet le plus haut de l'enveloppe ; Umin : le plus bas.", "Exact.") },
      { consigne: "Avec Sm = 1 V et U₀ = 2 V, ce taux vaut…", court: "Répondez dans le carnet.", question: choix(["m = Sm/U₀ = 0,5", "m = U₀/Sm = 2", "m = Sm·U₀ = 2"], "u(t) = k·Pm·U₀·(1 + (Sm/U₀)·cos(2π·Fs·t))·cos(2π·Fp·t).", "Exact.") },
      { consigne: "Réglez U₀ = 0,5 V (plus petit que Sm) et observez la voie 1.", court: "U₀ = 0,5 V.", aide_geste: "Touches − et + de U₀ sur la maquette.", verifier: ({ faits }) => (A(faits).U0 === 0.5 && V(faits).Y1 === "S") || false },
      { consigne: "Avec U₀ < Sm…", court: "Répondez dans le carnet.", question: choix(["l'enveloppe ne reproduit plus le signal : c'est la surmodulation (m > 1)", "la modulation est meilleure", "la porteuse disparaît"], "Regardez les endroits où l'enveloppe s'annule.", "Exact.") },
      { consigne: "Remettez U₀ = 2 V. Réglez la porteuse à 10 kHz et le signal à 2 kHz : observez.", court: "Fp = 10 kHz ; Fs = 2 kHz.", aide_geste: "Touches − et + de fréquence des GBF.", verifier: ({ faits }) => (A(faits).U0 === 2 && A(faits).Fp === 10000 && A(faits).Fs === 2000) || false },
      { consigne: "Pour une bonne modulation, il faut…", court: "Répondez dans le carnet.", question: choix(["m < 1 (U₀ > Sm) et une porteuse de fréquence beaucoup plus grande que celle du signal (Fp ≫ Fs)", "U₀ = 0 et Fp = Fs", "m > 1 et Fp < Fs"], "Avec Fp = 5·Fs, l'enveloppe est-elle bien dessinée ?", "Exact.") },
    ],
  };

  const DEMODULATION = {
    id: "demodulation", paillasse: 0, titre: "Démoduler : détecteur d'enveloppe",
    objectif: "Récupérer le signal modulant : diode et R₁∥C₁ (constante de temps), puis filtre passe-haut.",
    entetes: [],
    donnees: ["Porteuse : 100 kHz (Tp = 10 µs) ; signal : 500 Hz (Ts = 2 ms) ; U₀ = 2 V", "Détecteur : τ = R₁·C₁ avec R₁ = 10 kΩ", "Filtre passe-haut : C₂ = 1 µF, R₂ = 10 kΩ"],
    conclusion: "La diode ne laisse passer que les alternances positives ; le condensateur C₁ se charge à chaque sommet de la porteuse et se décharge lentement dans R₁ : la tension suit l'enveloppe si Tp ≪ τ = R₁·C₁ < Ts. Si τ est trop petite, la tension suit la porteuse redressée ; si τ est trop grande, elle ne peut plus suivre l'enveloppe quand elle diminue. Le filtre passe-haut retire la composante continue (due à U₀) : on retrouve le signal modulant.",
    conclusion_courte: "Tp ≪ R₁·C₁ < Ts ; puis passe-haut.",
    etapes: [
      { consigne: "Revenez à Fp = 100 kHz et Fs = 500 Hz, U₀ = 2 V. Reliez S à E ; voie 1 de l'oscilloscope sur D (la voie 2 reste sur le signal du GBF 2).", court: "Câblez le détecteur ; voie 1 sur D.", verifier: ({ faits }) => (module_ok(faits) && M(faits).detection && V(faits).Y1 === "D" && A(faits).Fp === 100000 && A(faits).Fs === 500 && A(faits).U0 === 2) || false },
      { consigne: "Réglez C₁ = 1 nF (τ = 10 µs). La tension en D…", court: "C₁ = 1 nF : répondez dans le carnet.", question: choix(["suit presque chaque alternance de la porteuse : τ est trop petite", "reproduit parfaitement l'enveloppe", "est nulle"], "Comparez τ à la période de la porteuse (10 µs).", "Exact.") },
      { consigne: "Réglez C₁ = 100 nF (τ = 1 ms). La tension en D…", court: "C₁ = 100 nF : répondez dans le carnet.", question: choix(["ne suit plus l'enveloppe quand elle diminue : τ est trop grande", "suit la porteuse", "est la meilleure possible"], "Comparez τ à la période du signal (2 ms).", "Exact.") },
      { consigne: "Choisissez C₁ pour que la tension en D reproduise au mieux l'enveloppe.", court: "Choisissez C₁.", verifier: ({ faits }) => (M(faits).detection && A(faits).fid_D > 0.99 && A(faits).Fp === 100000) || false },
      { consigne: "La condition sur la constante de temps du détecteur est…", court: "Répondez dans le carnet.", question: choix(["Tp ≪ τ = R₁·C₁ < Ts", "τ < Tp", "τ ≫ Ts"], "Le condensateur ne doit pas se vider entre deux sommets de la porteuse, mais suivre l'enveloppe.", "Exact.") },
      { consigne: "Reliez D à F ; voie 1 sur O.", court: "Câblez le filtre ; voie 1 sur O.", verifier: ({ faits }) => (M(faits).filtre && V(faits).Y1 === "O" && A(faits).fid_O > 0.99) || false },
      { consigne: "Le filtre passe-haut…", court: "Répondez dans le carnet.", question: choix(["retire la composante continue (due à U₀) : on retrouve le signal modulant", "retire la porteuse", "amplifie la porteuse"], "Comparez la tension en O et le signal du GBF 2 (voie 2).", "Exact : ici, ils se superposent.") },
      { consigne: "Le rôle de la diode dans le détecteur est…", court: "Répondez dans le carnet.", question: choix(["de ne laisser passer que les alternances positives de la tension modulée", "de supprimer le signal modulant", "de produire la porteuse"], "Une diode ne conduit que dans un sens.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_elec5_a2_modulation", titre: "Laboratoire : modulation et démodulation", decor: "aucun", paillasses: [L.poste_modulation], missions: [MODULATION, DEMODULATION] });
})(window.Labo);

/*
Rôle : simulation de la partie « Pendule pesant ; pendule simple » du chapitre « Systèmes mécaniques oscillants » (2e année du
       bac, filières PC, SMA, SMB) : isochronisme des petites oscillations et période plus longue aux grandes amplitudes ;
       équation différentielle J·θ̈ + M·g·a·sin θ = 0, petites oscillations, solution donnée, période propre
       T0 = 2π·√(J/(M·g·a)) ; amortissement (pseudo-période ≈ période propre, sans étude théorique) ; pendule simple,
       T0 = 2π·√(l/g), mesure de g, indépendance de la masse, pendule simple synchrone (modèle du pendule pesant). Objectif O6.
Reçoit : rien (les vérifications lisent les faits des postes et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const V = L.verif_pendule, { choix, relatif } = V, M = () => L.pendule_pesant_modele;
  const acquis = (f, test) => (f.acquisition || {}).n >= 1 && (f.acquisition || {}).etat === "terminée" && !!V.lache_pesant(f, test);
  const T0_40 = () => 2 * Math.PI * Math.sqrt(M().J(0.4, false) / (9.81 * M().Ma(0.4, false))), L_SYNC = () => M().J(0.4, false) / M().Ma(0.4, false);

  const ISOCHRONISME = {
    id: "isochronisme", paillasse: 0, titre: "Isochronisme des petites oscillations",
    conclusion: "Pour les petites oscillations (amplitude de 20° au plus), la période du pendule pesant ne dépend pas de l'amplitude : c'est l'isochronisme des petites oscillations. Aux grandes amplitudes, la période est plus longue (environ 5 % de plus à 50°) : on ne peut plus confondre sin θ et θ.",
    objectif: "Enregistrer θ(t) pour plusieurs amplitudes et comparer les périodes.",
    entetes: ["θm (°)", "T (s)"], donnees: ["Masse coulissante à d = 40 cm, sans palette", "T = (durée de 5 oscillations) ÷ 5, lue au curseur", "Petites oscillations : θm ≤ 20°"],
    conclusion_courte: "Petites oscillations : T ne dépend pas de θm.",
    etapes: [
      { consigne: "Logiciel : durée 10 s, touchez « Acquérir ». Écartez la tige d'environ 10° (lisez le rapporteur) et lâchez-la.", court: "Acquérir, lâcher à 10°.", aide_geste: "Faites glisser la tige sur le côté, puis relâchez.", verifier: ({ faits }) => acquis(faits, (x) => x.d === 0.4 && !x.palette && Math.abs(x.theta0) >= 8 && Math.abs(x.theta0) <= 12) || false },
      { consigne: "La courbe θ(t) obtenue est…", court: "Répondez dans le carnet.", question: choix(["sinusoïdale : le mouvement est périodique, d'amplitude presque constante", "une droite", "une courbe qui tend vers zéro en une oscillation"], "Regardez la forme de la courbe.", "Exact.") },
      { consigne: "Tableur : lâchez la tige à environ 5°, 10°, 15° et 20° (« Acquérir » avant chaque lâcher) ; θm en A, T mesurée en B.", court: "Tableur : θm, T (4 lâchers).", aide_geste: "Placez le curseur sur un maximum, puis sur le 6e maximum : T = Δt ÷ 5.", verifier: V.isochronisme(4, 21, 4) },
      { consigne: "Pour les petites oscillations, la période…", court: "Répondez dans le carnet.", question: choix(["ne dépend pas de l'amplitude : c'est l'isochronisme des petites oscillations", "augmente nettement avec l'amplitude", "diminue avec l'amplitude"], "Comparez les valeurs de la colonne B.", "Exact.") },
      { consigne: "Lâchez maintenant la tige à 50° et mesurez T ; ajoutez la ligne au tableur.", court: "Lâcher à 50° ; ligne au tableur.", verifier: V.isochronisme(45, 50, 1) },
      { consigne: "Aux grandes amplitudes, la période…", court: "Répondez dans le carnet.", question: choix(["est plus grande : les oscillations ne sont plus isochrones, car sin θ n'est plus égal à θ", "reste la même", "est plus petite"], "Comparez T à 50° et T à 10°.", "Exact.") },
    ],
  };

  const PERIODE = {
    id: "periode", paillasse: 0, titre: "Équation différentielle et période propre",
    conclusion: "La relation fondamentale de la dynamique en rotation donne J·θ̈ = −M·g·a·sin θ (M·a = m1·a1 + m2·d). Pour les petites oscillations, sin θ ≈ θ : θ̈ + (M·g·a/J)·θ = 0, de solution θ = θm·cos(2π·t/T0 + φ) avec T0 = 2π·√(J/(M·g·a)). Lâché sans vitesse depuis θ0, θm = θ0 et φ = 0. Éloigner la masse de l'axe augmente la période.",
    objectif: "Établir l'équation différentielle, calculer T0 et la vérifier pour plusieurs positions de la masse.",
    entetes: ["d (m)", "T (s)"], donnees: ["J = J1 + m2·d² ; M·a = m1·a1 + m2·d", "J1 = 7,84 × 10⁻³ kg·m² ; m1 = 0,100 kg ; a1 = 0,24 m ; m2 = 0,200 kg", "g = 9,81 m/s²"],
    conclusion_courte: "θ̈ + (M·g·a/J)·θ = 0 ; T0 = 2π·√(J/(M·g·a)).",
    etapes: [
      { consigne: "Relation fondamentale de la dynamique en rotation autour de l'axe (frottements négligés) : J·θ̈ = …", court: "Répondez dans le carnet.", question: choix(["−(m1·a1 + m2·d)·g·sin θ : le moment du poids", "−(m1 + m2)·g·θ̇", "(m1·a1 + m2·d)·g·cos θ"], "La réaction de l'axe a un moment nul ; le bras de levier du poids est a·sin θ.", "Exact.") },
      { consigne: "Pour les petites oscillations (sin θ ≈ θ, θ en radians), l'équation devient…", court: "Répondez dans le carnet.", question: choix(["θ̈ + (M·g·a / J)·θ = 0", "θ̈ + (J / (M·g·a))·θ = 0", "θ̇ + (M·g·a / J)·θ = 0"], "Divisez par J.", "Exact.") },
      { consigne: "La solution est θ(t) = θm·cos(2π·t/T0 + φ). Lâché sans vitesse depuis θ0 > 0 à t = 0 :", court: "Répondez dans le carnet.", question: choix(["θm = θ0 et φ = 0", "θm = θ0 et φ = π/2", "θm = 0 et φ = 0"], "À t = 0 : θ = θ0 et θ̇ = 0.", "Exact.") },
      { consigne: "Calculez T0 = 2π·√(J / (M·g·a)) pour d = 40 cm (s).", court: "T0 calculée (s) ?", question: relatif("s", T0_40(), 0.02, "J = J1 + m2·d² ; M·a = m1·a1 + m2·d.", "Exact : environ 1,24 s, comme la mesure.") },
      { consigne: "Tableur : placez la masse à d = 10, 20, 30 et 40 cm ; pour chaque position, lâchez à 10° environ (« Acquérir » avant) et mesurez T. d (m) en A, T en B.", court: "Tableur : d, T (4 positions).", aide_geste: "Faites glisser la masse le long de la tige (pendule au repos) : elle se bloque dans les trous.", verifier: V.periodes_d },
      { consigne: "Quand on éloigne la masse de l'axe, la période…", court: "Répondez dans le carnet.", question: choix(["augmente : J augmente plus vite que M·g·a", "diminue", "ne change pas"], "Comparez les lignes du tableur.", "Exact.") },
      { consigne: "Longueur l = J / (M·a) du pendule simple qui aurait la même période (d = 40 cm), en m ?", court: "l synchrone (m) ?", question: relatif("m", L_SYNC(), 0.03, "Égalez 2π·√(J/(M·g·a)) et 2π·√(l/g).", "Exact : environ 0,38 m. Vous le vérifierez sur la paillasse 2.") },
    ],
  };

  const AMORTISSEMENT = {
    id: "amortissement", paillasse: 0, titre: "Amortissement des oscillations",
    conclusion: "Avec la palette, les frottements de l'air sont plus grands : l'amplitude diminue au cours du temps (régime pseudo-périodique), car de l'énergie est dissipée. La pseudo-période reste presque égale à la période propre quand l'amortissement est faible. Sans palette, l'amplitude diminue aussi, mais très lentement.",
    objectif: "Observer l'effet de la palette sur l'amplitude et mesurer la pseudo-période.",
    entetes: [], donnees: ["Palette d'aluminium mince au bas de la tige", "Masse à d = 40 cm", "Pseudo-période : durée de 5 oscillations ÷ 5"],
    conclusion_courte: "Amortissement : l'amplitude diminue ; T ≈ T0.",
    etapes: [
      { consigne: "Masse à 40 cm : montez la palette (touchez-la sur la paillasse), durée 20 s, « Acquérir », puis lâchez la tige à 20° environ.", court: "Palette, 20 s, lâcher à 20°.", verifier: ({ faits }) => (acquis(faits, (x) => x.palette && x.d === 0.4 && Math.abs(x.theta0) >= 15) && (faits.acquisition || {}).duree === 20) || false },
      { consigne: "L'amplitude des oscillations…", court: "Répondez dans le carnet.", question: choix(["diminue au cours du temps : les frottements de l'air sur la palette dissipent de l'énergie", "reste constante", "augmente"], "Regardez les maximums successifs.", "Exact.") },
      { consigne: "Mesurez la pseudo-période sur la courbe (5 oscillations ÷ 5), en s.", court: "Pseudo-période (s) ?", question: relatif("s", V.pseudo_periode, 0.02, "Curseur sur deux maximums séparés de 5 oscillations.", "Exact.") },
      { consigne: "Comparée à la période mesurée sans palette (≈ 1,24 s), la pseudo-période est…", court: "Répondez dans le carnet.", question: choix(["presque égale : l'amortissement change l'amplitude, pas la durée d'une oscillation", "deux fois plus grande", "nulle"], "Comparez les deux valeurs.", "Exact.") },
      { consigne: "Démontez la palette (touchez-la), puis refaites un lâcher à 20° avec une acquisition de 20 s.", court: "Sans palette, 20 s.", verifier: V.sans_palette },
      { consigne: "Sans palette, l'amplitude…", court: "Répondez dans le carnet.", question: choix(["diminue beaucoup plus lentement : les frottements sont plus faibles, mais pas nuls", "ne diminue pas du tout : il n'y a aucun frottement", "diminue plus vite"], "Comparez les deux courbes.", "Exact.") },
    ],
  };

  const SIMPLE = {
    id: "simple", paillasse: 1, titre: "Le pendule simple",
    conclusion: "Pour le pendule simple (bille quasi ponctuelle au bout d'un fil inextensible de masse négligeable), T² est proportionnelle à l : T0 = 2π·√(l/g). La pente 4π²/g donne g ≈ 9,8 m/s². La période ne dépend pas de la masse de la bille.",
    objectif: "Mesurer T pour plusieurs longueurs, vérifier T0 = 2π·√(l/g), en déduire g.",
    entetes: ["l (m)", "T (s)", "T² (s²)"], donnees: ["T = (durée de 10 oscillations) ÷ 10", "Amplitude : 10° environ", "T0 = 2π·√(l/g), donc T² = (4π²/g)·l"],
    conclusion_courte: "Pendule simple : T0 = 2π·√(l/g).",
    etapes: [
      { consigne: "Réglez la longueur du fil à 20 cm (molette de la pince, lisez la règle au centre de la bille), écartez la bille d'environ 10° et lâchez-la ; mesurez au chronomètre la durée de 10 oscillations.", court: "l = 20 cm ; 10 oscillations.", aide_geste: "Faites glisser la molette vers le bas pour allonger le fil, vers le haut pour le raccourcir.", verifier: ({ faits }) => (!!V.lache_simple(faits, (x) => Math.abs(x.l - 0.2) <= 0.006) && ((faits.chronometre || {}).mesures || []).length >= 1) || false },
      { consigne: "Tableur : pour l = 20, 40, 60 et 80 cm, mesurez 10 oscillations. l (m) en A, T en B, T² en C (=B2^2).", court: "Tableur : l, T, T².", verifier: V.simple },
      { consigne: "Tracez T² (C) en fonction de l (A), modèle y = a·x.", court: "Courbe T² = f(l).", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "C" && c.n >= 4 && c.modele === "lineaire") || "Abscisse : A ; ordonnée : C ; modèle y = a·x." },
      { consigne: "Le coefficient directeur vaut a = 4π²/g : déduisez-en g (m/s²).", court: "g (m/s²) ?", question: relatif("m/s²", 9.81, 0.05, "g = 4π² / a.", "Exact.") },
      { consigne: "Accrochez la bille d'aluminium (touchez la coupelle), réglez l = 40 cm et mesurez 10 oscillations.", court: "Bille d'aluminium, l = 40 cm.", verifier: ({ faits }) => !!V.lache_simple(faits, (x) => x.bille === "aluminium" && Math.abs(x.l - 0.4) <= 0.006) || false },
      { consigne: "Avec la bille d'aluminium, trois fois plus légère, la période…", court: "Répondez dans le carnet.", question: choix(["est la même : la période du pendule simple ne dépend pas de la masse", "est trois fois plus petite", "est trois fois plus grande"], "Comparez avec la ligne l = 0,40 m du tableur.", "Exact.") },
    ],
  };

  const MODELE = {
    id: "modele", paillasse: 1, titre: "Le pendule simple, modèle du pendule pesant",
    conclusion: "Le pendule pesant (d = 40 cm) et le pendule simple de longueur l = J/(M·a) ≈ 38 cm ont la même période (1,24 s) : ils oscillent ensemble. Le pendule simple est un modèle du pendule pesant ; on dit qu'il est synchrone.",
    objectif: "Vérifier qu'un pendule simple de longueur J/(M·a) a la période du pendule pesant.",
    entetes: [], donnees: ["Pendule pesant, d = 40 cm : T ≈ 1,24 s (mission 2)", "l = J / (M·a) ≈ 0,38 m", "T = (durée de 10 oscillations) ÷ 10"],
    conclusion_courte: "Pendule simple synchrone : l = J/(M·a).",
    etapes: [
      { consigne: "Bille d'acier : réglez l = 38 cm, lâchez la bille à 10° environ et mesurez 10 oscillations.", court: "l = 38 cm ; 10 oscillations.", verifier: ({ faits }) => !!V.lache_simple(faits, (x) => Math.abs(x.l - L_SYNC()) <= 0.007) || false },
      { consigne: "Période mesurée (s) ?", court: "T (s) ?", question: relatif("s", T0_40(), 0.04, "Durée de 10 oscillations ÷ 10.", "Exact : la même période que le pendule pesant.") },
      { consigne: "Le pendule simple est un modèle du pendule pesant, car…", court: "Répondez dans le carnet.", question: choix(["un pendule pesant a la même période qu'un pendule simple de longueur l = J / (M·a)", "un pendule pesant a la période d'un pendule simple aussi long que sa tige", "un pendule pesant n'oscille pas comme un pendule simple"], "La tige mesure 50 cm, le pendule simple synchrone 38 cm.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_meca4_s1_pendule_pesant", titre: "Laboratoire : pendule pesant et pendule simple", paillasses: [L.poste_pendule_pesant, L.poste_pendule_simple], missions: [ISOCHRONISME, PERIODE, AMORTISSEMENT, SIMPLE, MODELE] });
})(window.Labo);

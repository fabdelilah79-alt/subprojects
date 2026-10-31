/*
Rôle : simulation de l'activité 1 du chapitre « L'atome et la mécanique de Newton » (2e année du bac) : comparer systèmes
       astronomiques et atomiques. Forces électrostatique et gravitationnelle entre proton et électron (toutes deux en 1/d²,
       rapport 2,3 × 10³⁹) ; satellites de la Terre au simulateur (n'importe quelle orbite, T²/r³ constant) ; électron autour
       du proton selon Newton (n'importe quelle énergie, chute en 10⁻¹¹ s s'il rayonne) face aux expériences (énergie quantifiée,
       atome stable) : limites de la mécanique de Newton. Objectifs O1, O2.
Reçoit : rien (les vérifications sont dans verifications_astres.js).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const V = L.verif_astres, { choix, nombre, relatif } = V;
  const atome53 = (f) => V.dernier(f, (l) => l.mode === "atome" && l.circulaire && !l.rayonnement && Math.abs(l.r0 - 5.3e-11) < 1.1e-12);
  const terre7000 = (l) => l.mode === "terre" && l.circulaire && Math.abs(l.r0 - 7e6) <= 5e4;

  const FORCES = {
    id: "forces", paillasse: 0, titre: "Deux interactions en 1/d²",
    conclusion: "Entre deux masses s'exerce l'interaction gravitationnelle F = G·m·m′/d², entre deux charges l'interaction électrostatique F = k·|q·q′|/d² : toutes deux varient comme l'inverse du carré de la distance. Dans l'atome d'hydrogène, la force électrostatique est 2,3 × 10³⁹ fois plus grande que la force de gravitation, quelle que soit la distance : la gravitation y est négligeable. À l'échelle des astres, électriquement neutres et très massifs, c'est la gravitation qui domine.",
    objectif: "Comparer les forces électrostatique et gravitationnelle entre le proton et l'électron.",
    entetes: ["d (m)", "Fe (N)", "Fg (N)", "Fe / Fg"],
    donnees: ["k = 9,0 × 10⁹ SI ; G = 6,67 × 10⁻¹¹ SI", "e = 1,60 × 10⁻¹⁹ C ; me = 9,11 × 10⁻³¹ kg ; mp = 1,67 × 10⁻²⁷ kg", "Tableur : 5,3E-11 signifie 5,3 × 10⁻¹¹"],
    conclusion_courte: "Fe et Fg en 1/d² ; dans l'atome, Fe/Fg ≈ 2,3 × 10³⁹.",
    etapes: [
      { consigne: "Lisez les documents « Interaction gravitationnelle » et « Interaction électrostatique » : touchez-les.", court: "Lisez les deux lois.", verifier: ({ faits }) => V.lu(faits, 1, 2) || false },
      { consigne: "Ces deux forces varient avec la distance d…", court: "Répondez dans le carnet.", question: choix(["toutes les deux comme 1/d²", "Fe comme 1/d, Fg comme 1/d²", "Fe comme 1/d², Fg comme d²"], "Regardez le dénominateur des deux formules.", "Exact : les deux lois ont la même forme.") },
      { consigne: "Tableur : d (m) en A (5,3E-11, puis deux autres distances), Fe = k·e²/d² en B, Fg = G·me·mp/d² en C, Fe/Fg en D.", court: "Tableur : d, Fe, Fg, Fe/Fg.", verifier: V.forces },
      { consigne: "Pour l'atome d'hydrogène, Fe / Fg vaut environ…", court: "Fe / Fg ?", question: relatif("", 2.27e39, 0.05, "Colonne D, ligne de d = 5,3E-11.", "Exact : environ 2,3 × 10³⁹.") },
      { consigne: "Quand la distance change, le rapport Fe / Fg…", court: "Répondez dans le carnet.", question: choix(["ne change pas : les deux forces varient en 1/d²", "augmente avec d", "diminue avec d"], "Comparez les lignes de la colonne D.", "Exact.") },
      { consigne: "Dans l'atome, la cohésion (l'électron lié au noyau) est due…", court: "Répondez dans le carnet.", question: choix(["à l'interaction électrostatique ; la gravitation y est négligeable", "à la gravitation", "aux deux interactions, à parts égales"], "Comparez Fe et Fg.", "Exact.") },
      { consigne: "Pourquoi la gravitation domine-t-elle pourtant à l'échelle des astres ?", court: "Répondez dans le carnet.", question: choix(["les astres sont très massifs et électriquement neutres", "la loi de Coulomb ne s'applique pas dans le vide", "les astres portent tous une charge positive"], "Que vaut la charge totale d'une planète ?", "Exact : des charges + et − en nombres égaux, leurs forces s'annulent.") },
    ],
  };

  const SATELLITES = {
    id: "satellites", paillasse: 0, titre: "Satellites de la Terre",
    conclusion: "Un satellite lancé perpendiculairement au rayon décrit une ellipse dont la Terre occupe un foyer ; trop rapide, il s'échappe ; trop lent, il retombe. Pour chaque rayon r (au-dessus de l'atmosphère), il existe une vitesse v = √(G·M/r) qui donne une orbite circulaire : toutes les orbites, donc toutes les valeurs de l'énergie E = −G·M·m/(2r), sont possibles. La période vérifie la troisième loi de Kepler : T²/r³ = 4π²/(G·M).",
    objectif: "Lancer des satellites ; obtenir des orbites circulaires ; vérifier que T²/r³ est constant.",
    entetes: ["r (m)", "T (s)", "r³ (m³)", "T² (s²)"],
    donnees: ["Satellite de 1 000 kg, lancé perpendiculairement au rayon", "Orbite circulaire : rmin = rmax", "1 km = 1 000 m ; G = 6,67 × 10⁻¹¹ SI"],
    conclusion_courte: "Toutes les orbites sont possibles ; T²/r³ = 4π²/(G·M).",
    etapes: [
      { consigne: "Onglet « Terre – satellite », r0 = 7 000 km : lancez avec v0 = 7,0 km/s, puis augmentez v0 (8 km/s, 9 km/s…) jusqu'à ce que le satellite s'échappe.", court: "Augmentez v0 jusqu'à l'échappement.", aide_geste: "Glissez le curseur bleu, ou touchez − et + ; puis « Lancer ».", verifier: ({ faits }) => (V.lances(faits, (l) => l.mode === "terre" && l.issue === "orbite" && !l.circulaire) && V.lances(faits, (l) => l.mode === "terre" && l.issue === "echappe")) || false },
      { consigne: "À r0 fixé, quand v0 augmente…", court: "Répondez dans le carnet.", question: choix(["le satellite retombe, puis décrit une ellipse de plus en plus allongée, puis s'échappe", "la trajectoire rétrécit", "la trajectoire ne change pas"], "Comparez vos lancements.", "Exact.") },
      { consigne: "Toujours à r0 = 7 000 km, réglez v0 pour obtenir une orbite circulaire (rmin = rmax).", court: "Orbite circulaire à 7 000 km.", aide_geste: "Touchez − et + pour changer v0 de 0,01 km/s.", verifier: ({ faits }) => V.lances(faits, terre7000) || false },
      { consigne: "Vitesse du satellite sur l'orbite circulaire de rayon 7 000 km (km/s) ?", court: "v (km/s) ?", question: nombre("km/s", Math.sqrt(V.MU / 7e6) / 1000, 0.05, "Lisez v0 sur le panneau.", "Exact : v = √(G·M/r) ≈ 7,55 km/s.") },
      { consigne: "Obtenez deux autres orbites circulaires, par exemple à 15 000 km et à 42 000 km.", court: "Deux autres orbites circulaires.", verifier: ({ faits }) => V.differents(V.circulaires(faits, "terre").map((l) => l.r0), 1e6) >= 3 || false },
      { consigne: "Tableur : r (m) en A, T (s) en B, r³ en C, T² en D, pour vos trois orbites circulaires.", court: "Tableur : r, T, r³, T².", verifier: V.kepler },
      { consigne: "Tracez T² (D) en fonction de r³ (C), modèle y = a·x.", court: "Courbe T² = f(r³).", verifier: ({ courbe: c }) => (c.x === "C" && c.y === "D" && c.n >= 3 && c.modele === "lineaire") || "Abscisse : C ; ordonnée : D ; modèle y = a·x." },
      { consigne: "Le coefficient directeur vaut 4π² / (G·M) : déduisez-en la masse M de la Terre (kg).", court: "M (kg) ?", question: relatif("kg", 5.97e24, 0.03, "M = 4π² / (G·a).", "Exact : M ≈ 5,97 × 10²⁴ kg.") },
      { consigne: "Autour de la Terre, un satellite peut tourner…", court: "Répondez dans le carnet.", question: choix(["sur une orbite circulaire de n'importe quel rayon : son énergie peut prendre toutes les valeurs", "seulement sur quelques orbites permises", "seulement à 42 000 km"], "Combien d'orbites circulaires avez-vous pu obtenir ?", "Exact : à chaque rayon correspond une vitesse, et une énergie E = −G·M·m/(2r).") },
    ],
  };

  const ATOME = {
    id: "atome", paillasse: 0, titre: "L'atome d'hydrogène selon Newton",
    conclusion: "Avec la mécanique de Newton, l'électron pourrait tourner autour du proton sur une orbite de n'importe quel rayon : l'énergie de l'atome pourrait prendre toutes les valeurs, et deux atomes d'hydrogène pourraient être différents. De plus, une charge qui tourne rayonne : l'électron tomberait sur le noyau en 10⁻¹¹ s environ. Or les atomes d'hydrogène sont tous identiques et stables, et leur énergie est quantifiée (En = −13,6/n² eV). La mécanique de Newton ne s'applique pas à l'échelle de l'atome : c'est l'une de ses limites.",
    objectif: "Lancer l'électron autour du proton selon Newton ; comparer avec ce que montrent les expériences.",
    entetes: [], donnees: ["Électron : me = 9,11 × 10⁻³¹ kg, charge −e", "Orbite circulaire : v = √(k·e² / (me·r))", "1 eV = 1,60 × 10⁻¹⁹ J"],
    conclusion_courte: "Newton : toutes les énergies, chute de l'électron ; expérience : énergie quantifiée, atome stable.",
    etapes: [
      { consigne: "Onglet « Proton – électron », r0 = 53 pm : trouvez la vitesse v0 qui donne une orbite circulaire.", court: "Orbite circulaire à 53 pm.", aide_geste: "Glissez le curseur v0, puis réglez-le finement avec − et + (1 km/s).", verifier: ({ faits }) => !!atome53(faits) || false },
      { consigne: "Énergie mécanique de l'atome sur cette orbite (eV) ?", court: "E (eV) ?", question: nombre("eV", (f) => atome53(f)?.eV ?? -13.6, 0.3, "Lisez E (eV) dans les résultats.", "Exact : environ −13,6 eV, l'énergie de l'atome d'hydrogène dans son état fondamental.") },
      { consigne: "Obtenez deux autres orbites circulaires de l'électron, par exemple à 100 pm et à 150 pm.", court: "Deux autres orbites circulaires.", verifier: ({ faits }) => V.differents(V.circulaires(faits, "atome").map((l) => l.r0), 5e-12) >= 3 || false },
      { consigne: "Selon la mécanique de Newton, l'énergie de l'atome d'hydrogène…", court: "Répondez dans le carnet.", question: choix(["peut prendre n'importe quelle valeur négative : il suffit de changer r", "ne peut prendre que les valeurs −13,6/n² eV", "est toujours nulle"], "Comparez les énergies de vos trois orbites.", "Exact : selon Newton, toutes les orbites et toutes les énergies seraient possibles.") },
      { consigne: "Lisez le document « Ce que montrent les expériences ».", court: "Lisez le document 4.", verifier: ({ faits }) => V.lu(faits, 4) || false },
      { consigne: "Les expériences montrent que l'énergie de l'atome d'hydrogène…", court: "Répondez dans le carnet.", question: choix(["est quantifiée : seules les valeurs En = −13,6/n² eV sont possibles", "peut prendre toutes les valeurs", "dépend de la vitesse de lancement de l'électron"], "Relisez le document 4.", "Exact : c'est ce que la mécanique de Newton n'explique pas.") },
      { consigne: "Cochez « Rayonnement de l'électron », puis lancez l'électron sur l'orbite circulaire de 53 pm. Observez.", court: "Rayonnement : lancez à 53 pm.", verifier: ({ faits }) => V.lances(faits, (l) => l.rayonnement && l.tombe && Math.abs(l.r0 - 5.3e-11) < 1.1e-12) || false },
      { consigne: "Au bout de combien de temps l'électron tombe-t-il sur le proton (s) ?", court: "Durée de la chute (s) ?", question: relatif("s", (f) => V.dernier(f, (l) => l.rayonnement && l.tombe)?.tf ?? 1.56e-11, 0.1, "Lisez le message en haut de la fenêtre.", "Exact : environ 1,6 × 10⁻¹¹ s.") },
      { consigne: "La mécanique de Newton (avec l'électromagnétisme classique)…", court: "Répondez dans le carnet.", question: choix(["n'explique ni la stabilité de l'atome ni la quantification de son énergie : elle a des limites", "explique parfaitement l'atome d'hydrogène", "explique la stabilité de l'atome, mais pas son énergie"], "Comparez le simulateur et les expériences.", "Exact : à l'échelle atomique, il faut une autre mécanique (la mécanique quantique).") },
    ],
  };

  L.demarrer({ id: "b2_meca6_a1_astres_atomes", titre: "Laboratoire : astres et atomes", paillasses: [L.poste_astres], missions: [FORCES, SATELLITES, ATOME] });
})(window.Labo);

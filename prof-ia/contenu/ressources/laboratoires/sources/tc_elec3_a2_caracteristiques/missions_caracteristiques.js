/*
Rôle : missions « caractéristiques » de l'activité 2 du chapitre « Montages électriques » : conducteur ohmique, lampe,
       diode (objectif O4). Chaque mission : montage, relevé d'au moins 6 points, tableur, courbe, questions.
Reçoit : rien (les vérifications lisent les points relevés, la feuille et la courbe du tableur).
Produit : Labo.MISSIONS_CARACTERISTIQUES = [résistance, lampe, diode].
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (attendu, tolerance, aide, bravo, relative = false) => ({ type: "nombre", unite: "", attendu, [relative ? "tolerance_relative" : "tolerance"]: tolerance, aide, bravo });
  const points = (faits, nom) => faits[`points_${nom}`] || [];
  const assez = (nom, n, filtre = () => true) => ({ faits }) => points(faits, nom).filter(filtre).length >= n || false;
  const courbe_ok = (x, y) => ({ courbe }) => (courbe.x === x && courbe.y === y && courbe.n >= 6) || false;
  const AIDE_MONTAGE = "Ampèremètre (mA, COM) en série ; voltmètre (VΩ, COM) directement aux bornes du dipôle.";

  function mission_caracteristique({ id, titre, nom, dipole, objectif, conclusion, courte, questions }) {
    // Mission type : montage, au moins 6 points, tableur (I en A, U en V), courbe U = f(I), questions.
    return {
      id, paillasse: 0, titre, objectif, entetes: ["I (A)", "U (V)"], conclusion, conclusion_courte: courte,
      etapes: [
        { consigne: `Réalisez le montage : générateur réglable, ${dipole} et ampèremètre (calibre 200 mA) en série ; voltmètre (V⎓ 20) aux bornes de ${dipole}. Réglez une tension de quelques volts.`, court: "Montage, puis réglez une tension.", verifier: assez(nom, 1), aide_geste: AIDE_MONTAGE },
        { consigne: "Faites varier la tension du générateur de 0 à 6 V environ : relevez au moins 6 points (I, U) différents.", court: "Au moins 6 points.", verifier: assez(nom, 6), aide_geste: "Touches −1, +1 (grossier) et −0,1, +0,1 (fin) du générateur." },
        { consigne: "Dans le tableur : I (en A) en colonne A, U (en V) en colonne B, une ligne par point.", court: "Tableur : I (A), U (V).", verifier: ({ feuille, faits }) => L.feuille_points(feuille, points(faits, nom)) },
        { consigne: "Tracez la caractéristique U = f(I) : U en ordonnée, I en abscisse.", court: "Tracez U en fonction de I.", verifier: courbe_ok("A", "B") },
        ...questions,
      ],
    };
  }

  const RESISTANCE = mission_caracteristique({
    id: "resistance", titre: "Caractéristique d'un conducteur ohmique", nom: "R", dipole: "la résistance R (A, B)",
    objectif: "Tracer la caractéristique U = f(I) de la résistance R.",
    conclusion: "La caractéristique d'un conducteur ohmique est une droite qui passe par l'origine : U = R·I (loi d'Ohm). R est le coefficient directeur.",
    courte: "Conducteur ohmique : U = R·I.",
    questions: [
      { consigne: "Modélisez la courbe par une fonction linéaire. Quelle est la résistance R (en Ω) ?", court: "R (Ω) ?", question: nombre(101.2, 0.03, "R est le coefficient directeur de la droite (U en V, I en A).", "Exact : R ≈ 101 Ω (100 Ω ± 5 %).", true) },
      { consigne: "La caractéristique est une droite passant par l'origine. Le dipôle…", court: "Répondez dans le carnet.", question: choix(["est un conducteur ohmique : U = R·I", "n'a pas de résistance", "a une résistance qui augmente avec I"], "U/I est-il constant ?", "Exact : c'est la loi d'Ohm.") },
    ],
  });

  const LAMPE = mission_caracteristique({
    id: "lampe", titre: "Caractéristique d'une lampe", nom: "lampe", dipole: "la lampe L (C, D) à la place de R",
    objectif: "La lampe suit-elle la loi d'Ohm ?",
    conclusion: "La caractéristique d'une lampe n'est pas une droite : U/I augmente avec I, car le filament chauffe et sa résistance augmente. La lampe n'est pas un conducteur ohmique.",
    courte: "Lampe : U/I augmente avec I.",
    questions: [
      { consigne: "La caractéristique de la lampe…", court: "Répondez dans le carnet.", question: choix(["n'est pas une droite : U/I augmente avec I", "est une droite passant par l'origine", "est horizontale"], "Comparez U/I pour un petit et un grand courant.", "Exact.") },
      { consigne: "Pourquoi la résistance U/I de la lampe augmente-t-elle avec l'intensité ?", court: "Répondez dans le carnet.", question: choix(["le filament chauffe, et la résistance d'un métal augmente avec la température", "le générateur s'use", "l'ampèremètre se trompe"], "Le filament devient de plus en plus lumineux, donc chaud.", "Exact : la lampe n'est pas un conducteur ohmique.") },
    ],
  });
  LAMPE.etapes[1].consigne = "Faites varier la tension du générateur de 0 à 6 V (sans dépasser 6 V, la tension nominale de la lampe) : relevez au moins 6 points, dont quelques-uns sous 1 V.";

  const DIODE = {
    id: "diode", paillasse: 1, titre: "Caractéristique d'une diode",
    objectif: "Tracer la caractéristique I = f(U) d'une diode au silicium, dans les deux sens.",
    entetes: ["I (A)", "U (V)"],
    conclusion: "Une diode ne laisse passer le courant que dans un sens, de l'anode A vers la cathode K, et seulement au-delà de sa tension de seuil (environ 0,6 V pour une diode au silicium). En sens inverse, elle est bloquée.",
    conclusion_courte: "Diode : passante de A vers K au-delà du seuil.",
    etapes: [
      { consigne: "Réalisez le montage : générateur réglable, résistance de protection, ampèremètre (calibre 200 mA) et diode en série (anode A du côté de P) ; voltmètre (V⎓ 2) aux bornes de la diode (VΩ sur A, COM sur K).", court: "Montage de la diode, sens direct.", verifier: assez("diode", 1), aide_geste: "La résistance de protection limite le courant dans la diode." },
      { consigne: "Faites varier la tension du générateur de 0 à 3 V : relevez au moins 6 points, dont 3 au-dessus de 0,6 V.", court: "Au moins 6 points en sens direct.", verifier: ({ faits }) => (points(faits, "diode").filter((p) => p.U > 0).length >= 6 && points(faits, "diode").filter((p) => p.U > 0.6).length >= 3) || false, aide_geste: "Utilisez les touches fines (±0,1 V) entre 0 et 1,5 V." },
      { consigne: "Tableur : I (A) en colonne A, U (V) en colonne B. Tracez la caractéristique I = f(U) : I en ordonnée, U en abscisse.", court: "Tableur, puis I en fonction de U.", verifier: ({ feuille, faits, courbe }) => { const r = L.feuille_points(feuille, points(faits, "diode")); return r === true ? courbe_ok("B", "A")({ courbe }) : r; } },
      { consigne: "Lisez sur la courbe la tension de seuil de la diode (tension à partir de laquelle le courant augmente fortement), en V.", court: "Tension de seuil (V) ?", question: nombre(0.62, 0.08, "Là où la courbe se redresse.", "Exact : environ 0,6 V.") },
      { consigne: "Retournez la diode (échangez les fils sur A et K, sans toucher au voltmètre), réglez le générateur sur 5 V et relevez le point.", court: "Diode retournée, générateur à 5 V.", verifier: assez("diode", 1, (p) => p.U < -1 && Math.abs(p.I) < 1e-4) },
      { consigne: "Diode retournée, l'intensité est nulle. La diode…", court: "Répondez dans le carnet.", question: choix(["ne laisse passer le courant que dans un sens, de A vers K, au-delà de la tension de seuil", "laisse passer le courant dans les deux sens", "est grillée"], "Comparez les deux sens.", "Exact.") },
    ],
  };

  L.MISSIONS_CARACTERISTIQUES = [RESISTANCE, LAMPE, DIODE];
})(window.Labo);

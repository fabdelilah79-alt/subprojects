/*
Rôle : missions des paillasses « superposition de deux champs » et « champ terrestre, expérience d'Œrsted ».
Reçoit : rien (les vérifications lisent les faits « superposition », « terre », « doc_oersted »).
Produit : Labo.MISSIONS_TERRE = [SUPERPOSITION, TERRE, OERSTED].
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const sp = (f) => f.superposition || {}, te = (f) => f.terre || {}, mT = (x) => (x || 0) * 1000;

  const SUPERPOSITION = {
    id: "superposition", paillasse: 1, titre: "Superposition de deux champs",
    objectif: "Mesurer en O le champ de chaque aimant, puis celui des deux ; comparer.",
    entetes: [],
    conclusion: "Quand plusieurs sources créent un champ magnétique en un point, le champ total est la somme vectorielle des champs : B = B1 + B2. Ici, B1 et B2 sont perpendiculaires : B = √(B1² + B2²), et l'aiguille prend la direction de la diagonale.",
    conclusion_courte: "B = B1 + B2 (somme de vecteurs).",
    etapes: [
      { consigne: "Retirez l'aimant 2 et mesurez B1 en O (pointe de la sonde sur la croix). Remettez l'aimant 2, retirez l'aimant 1 : mesurez B2 en O. Remettez les deux aimants : mesurez B en O.", court: "B1, B2, puis B en O.", aide_geste: "« Aimant 1 » et « Aimant 2 » retirent ou remettent les aimants.", verifier: ({ faits }) => ["B1", "B2", "B12"].every((k) => sp(faits)[k] !== undefined) },
      { consigne: "Calculez √(B1² + B2²) avec vos mesures.", court: "√(B1² + B2²) (mT) ?", question: { type: "nombre", unite: "mT", attendu: (f) => Math.hypot(mT(sp(f).B1), mT(sp(f).B2)), tolerance_relative: 0.02, aide: "B1 et B2 en mT.", bravo: "Exact." } },
      { consigne: "Comparez avec la valeur B mesurée avec les deux aimants :", court: "Répondez dans le carnet.", question: choix(["B ≈ √(B1² + B2²) : les champs s'ajoutent comme des vecteurs (B = B1 + B2), ici perpendiculaires", "B = B1 + B2 (on ajoute les valeurs)", "B = B2 − B1"], "B1 et B2 sont à angle droit.", "Exact.") },
      { consigne: "Placez la boussole en O, les deux aimants en place.", court: "Boussole en O.", verifier: ({ faits }) => !!sp(faits).boussole_O },
      { consigne: "En O, l'aiguille aimantée…", court: "Répondez dans le carnet.", question: choix(["prend la direction du champ total B1 + B2, entre les axes des deux aimants (plus près de l'aimant 2, dont le champ est le plus grand)", "pointe vers l'aimant 1", "pointe vers le nord géographique"], "Comparez à la diagonale du rectangle construit sur B1 et B2.", "Exact.") },
    ],
  };

  const TERRE = {
    id: "terre", paillasse: 2, titre: "Le champ magnétique terrestre",
    objectif: "Mesurer les composantes horizontale et verticale du champ terrestre ; en déduire sa valeur et l'inclinaison.",
    entetes: [],
    conclusion: "En un lieu, le champ magnétique terrestre B_T a une composante horizontale B_H, dirigée vers le nord magnétique (c'est elle qu'indique la boussole), et une composante verticale B_V. B_T = √(B_H² + B_V²) ≈ 4×10⁻⁵ T ; l'inclinaison I (tan I = B_V/B_H) est l'angle entre B_T et l'horizontale (environ 46° au Maroc).",
    conclusion_courte: "B_T = √(B_H² + B_V²) ; tan I = B_V/B_H.",
    etapes: [
      { consigne: "Circuit ouvert, sonde loin du fil : mesurez la composante horizontale B_H du champ terrestre, puis (bouton du teslamètre) sa composante verticale B_V.", court: "Mesurez B_H et B_V.", aide_geste: "Touchez le bouton du teslamètre pour changer de composante.", verifier: ({ faits }) => te(faits).BH !== undefined && te(faits).BV !== undefined },
      { consigne: "Valeur du champ terrestre : B_T = √(B_H² + B_V²).", court: "B_T (mT) ?", question: { type: "nombre", unite: "mT", attendu: (f) => Math.hypot(mT(te(f).BH), mT(te(f).BV)), tolerance_relative: 0.03, aide: "B_H et B_V en mT.", bravo: "Exact : environ 0,042 mT, soit 4,2×10⁻⁵ T." } },
      { consigne: "Inclinaison I (angle entre B_T et l'horizontale) : tan I = B_V / B_H.", court: "I (°) ?", question: { type: "nombre", unite: "°", attendu: (f) => (Math.atan2(mT(te(f).BV), mT(te(f).BH)) * 180) / Math.PI, tolerance: 1.5, aide: "I = arctan(B_V / B_H).", bravo: "Exact : comparez avec la boussole d'inclinaison." } },
      { consigne: "Une boussole ordinaire…", court: "Répondez dans le carnet.", question: choix(["s'oriente selon la composante horizontale B_H, vers le nord magnétique", "s'oriente selon B_V", "indique la valeur de B_T"], "Son aiguille ne tourne que dans un plan horizontal.", "Exact.") },
    ],
  };

  const OERSTED = {
    id: "oersted", paillasse: 2, titre: "L'expérience d'Œrsted",
    objectif: "Lire le document d'Œrsted ; refaire l'expérience : un courant dévie l'aiguille aimantée.",
    entetes: [],
    conclusion: "Un courant électrique crée un champ magnétique (Œrsted, 1820) : l'aiguille placée sous le fil dévie quand le courant passe, et dévie dans l'autre sens quand on inverse le courant. Le sens du champ dépend du sens du courant.",
    conclusion_courte: "Un courant crée un champ magnétique.",
    etapes: [
      { consigne: "Lisez le document d'Œrsted (au mur).", court: "Lisez le document.", aide_geste: "Touchez le document pour l'ouvrir.", verifier: ({ faits }) => (faits.doc_oersted || []).length > 0 },
      { consigne: "Placez la boussole sous le fil (le fil est parallèle à l'aiguille), réglez I = 3 A et fermez le circuit.", court: "Boussole sous le fil, courant.", verifier: ({ faits }) => !!te(faits).devie },
      { consigne: "Quand le courant passe, l'aiguille dévie, parce que…", court: "Répondez dans le carnet.", question: choix(["le courant électrique crée un champ magnétique qui s'ajoute au champ terrestre", "le fil chauffé attire l'aiguille", "l'aiguille aimante le fil"], "L'aiguille revient au nord quand on coupe le courant.", "Exact.") },
      { consigne: "Inversez le sens du courant, circuit fermé.", court: "Inversez le courant.", verifier: ({ faits }) => !!te(faits).inverse },
      { consigne: "En inversant le courant…", court: "Répondez dans le carnet.", question: choix(["l'aiguille dévie dans l'autre sens : le sens du champ dépend du sens du courant", "l'aiguille ne bouge plus", "rien ne change"], "Comparez les deux déviations.", "Exact.") },
    ],
  };

  L.MISSIONS_TERRE = [SUPERPOSITION, TERRE, OERSTED];
})(window.Labo);

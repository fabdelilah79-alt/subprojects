/*
Rôle : simulation de l'activité 2 (suite) du chapitre « Montages électriques » (tronc commun) : caractéristiques d'un
       générateur (pile) et d'un récepteur (électrolyseur), étudiés dans la même séance. Objectif O6 (loi d'Ohm pour un
       générateur U = E − r·I, courant de court-circuit ; pour un récepteur U = E' + r'·I), sans algébriser l'intensité.
Reçoit : rien (les vérifications lisent les points relevés, la feuille et la courbe du tableur).
Produit : la simulation démarrée : paillasse de la pile, paillasse de l'électrolyseur.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (attendu, tolerance, aide, bravo, relative = false) => ({ type: "nombre", unite: "", attendu, [relative ? "tolerance_relative" : "tolerance"]: tolerance, aide, bravo });
  const points = (faits, nom) => faits[`points_${nom}`] || [];
  const tableur_courbe = (nom, min) => ({ feuille, faits, courbe }) => { const r = L.feuille_points(feuille, points(faits, nom), { min }); return r === true ? (courbe.x === "A" && courbe.y === "B" && courbe.n >= min) || "Tracez U (colonne B) en fonction de I (colonne A)." : r; };

  const PILE = {
    id: "pile", paillasse: 0, titre: "Caractéristique d'une pile",
    objectif: "Comment la tension aux bornes d'une pile varie-t-elle avec l'intensité du courant qu'elle débite ?",
    entetes: ["I (A)", "U (V)"],
    conclusion: "La caractéristique d'une pile est une droite décroissante : U = E − r·I (loi d'Ohm pour un générateur). E est sa force électromotrice (tension à vide), r sa résistance interne. Le courant de court-circuit vaut Icc = E/r : il ne faut jamais court-circuiter une pile.",
    conclusion_courte: "Générateur : U = E − r·I ; Icc = E/r.",
    etapes: [
      { consigne: "Réalisez le circuit en série : pile, interrupteur, rhéostat (bornes A et C), résistance de protection Rp et ampèremètre (calibre 200 mA). Voltmètre (V⎓ 20) aux bornes de la pile : VΩ sur P, COM sur N. Fermez l'interrupteur.", court: "Circuit de la pile ; fermez K.", verifier: ({ faits }) => points(faits, "pile").some((p) => p.I > 0.01) || false, aide_geste: "La résistance Rp protège la pile quand le curseur est en A." },
      { consigne: "Déplacez le curseur du rhéostat pour relever au moins 6 points (I, U) différents. Ouvrez aussi l'interrupteur une fois : vous lirez U pour I = 0.", court: "Au moins 6 points, dont I = 0.", verifier: ({ faits }) => (points(faits, "pile").length >= 6 && points(faits, "pile").some((p) => p.I === 0)) || false, aide_geste: "Faites glisser le curseur noir le long de la barre." },
      { consigne: "Dans le tableur : I (A) en colonne A, U (V) en colonne B. Tracez U = f(I) et modélisez par une fonction affine.", court: "Tableur, puis U en fonction de I.", verifier: tableur_courbe("pile", 6) },
      { consigne: "La tension à vide (I = 0) est la force électromotrice E de la pile. Que vaut E (en V) ?", court: "E (V) ?", question: nombre(4.5, 0.03, "Ordonnée à l'origine de la droite.", "Exact.") },
      { consigne: "La pente de la droite vaut −r. Que vaut la résistance interne r de la pile (en Ω) ?", court: "r (Ω) ?", question: nombre(2, 0.12, "r = −(coefficient directeur), U en V et I en A.", "Exact : r ≈ 2 Ω.", true) },
      { consigne: "La tension aux bornes d'une pile qui débite un courant I…", court: "Répondez dans le carnet.", question: choix(["diminue quand I augmente : U = E − r·I", "reste toujours égale à E", "augmente quand I augmente"], "La droite descend.", "Exact : c'est la loi d'Ohm pour un générateur.") },
      { consigne: "Calculez le courant de court-circuit Icc = E/r (en A). Ne le mesurez pas : il abîmerait la pile.", court: "Icc (A) ?", question: nombre(2.25, 0.12, "Icc = E / r.", "Exact : un courant très grand, d'où le danger du court-circuit.", true) },
    ],
  };

  const ELECTROLYSEUR = {
    id: "electrolyseur", paillasse: 1, titre: "Caractéristique d'un électrolyseur",
    objectif: "Comment l'intensité du courant dans un électrolyseur dépend-elle de la tension à ses bornes ?",
    entetes: ["I (A)", "U (V)"],
    conclusion: "Un électrolyseur est un récepteur : aucun courant ne passe tant que U < E' ; au-delà, U = E' + r'·I (loi d'Ohm pour un récepteur). E' est sa force contre-électromotrice, r' sa résistance interne.",
    conclusion_courte: "Récepteur : U = E' + r'·I.",
    etapes: [
      { consigne: "Réalisez le circuit en série : alimentation réglable, résistance de protection, ampèremètre (calibre 200 mA) et électrolyseur. Voltmètre (V⎓ 20) aux bornes de l'électrolyseur (VΩ sur A, COM sur B).", court: "Circuit de l'électrolyseur.", verifier: ({ faits }) => points(faits, "electrolyseur").length >= 1 || false },
      { consigne: "Augmentez la tension de 0 à 3,5 V environ : relevez au moins 8 points, dont plusieurs où l'intensité est encore nulle. Observez les électrodes.", court: "Au moins 8 points ; observez les bulles.", verifier: ({ faits }) => { const p = points(faits, "electrolyseur"); return (p.length >= 8 && p.filter((q) => q.I < 2e-4).length >= 2 && p.filter((q) => q.I > 0.01).length >= 4) || false; }, aide_geste: "Touches fines (±0,1 V) près de 1,7 V." },
      { consigne: "Dans le tableur : I (A) en colonne A, U (V) en colonne B. Tracez U = f(I).", court: "Tableur, puis U en fonction de I.", verifier: tableur_courbe("electrolyseur", 8) },
      { consigne: "Tant que la tension est inférieure à une valeur E', l'intensité est nulle et aucune bulle n'apparaît. Lisez E' (en V) : ordonnée à l'origine de la partie droite de la courbe.", court: "E' (V) ?", question: nombre(1.7, 0.15, "Prolongez la partie droite jusqu'à I = 0.", "Exact : E' ≈ 1,7 V.") },
      { consigne: "Que vaut la résistance interne r' de l'électrolyseur (pente de la partie droite, en Ω) ?", court: "r' (Ω) ?", question: nombre(8, 0.15, "r' = ΔU / ΔI sur la partie droite.", "Exact : r' ≈ 8 Ω.", true) },
      { consigne: "Pour un récepteur comme l'électrolyseur, au-delà de E'…", court: "Répondez dans le carnet.", question: choix(["U = E' + r'·I", "U = E' − r'·I", "U = r'·I"], "La droite monte et ne passe pas par l'origine.", "Exact : c'est la loi d'Ohm pour un récepteur.") },
    ],
  };

  L.demarrer({ id: "tc_elec3_a2_dipoles_actifs", titre: "Laboratoire : générateur et récepteur", decor: "aucun", paillasses: [L.poste_pile, L.poste_electrolyseur], missions: [PILE, ELECTROLYSEUR] });
})(window.Labo);

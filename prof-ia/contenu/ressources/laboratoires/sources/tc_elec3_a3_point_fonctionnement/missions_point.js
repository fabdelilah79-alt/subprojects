/*
Rôle : missions « point de fonctionnement » de l'activité 3 du chapitre « Montages électriques » : méthode expérimentale
       (pile et lampe), méthode graphique (intersection des caractéristiques de la pile et de la lampe). Objectif O7.
Reçoit : rien (les vérifications lisent les mesures, la feuille et la courbe du tableur).
Produit : Labo.MISSIONS_POINT = [experience, graphique].
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const M = (faits) => (faits.montages || {}).lampe || {};
  const pile = (I) => 4.5 - 2 * I;

  function feuille_graphique({ feuille, faits, courbe }) {
    // Lignes : I et U de la lampe mesurés, et en C la tension de la pile pour le même I (U = 4,5 − 2·I).
    const r = L.feuille_points(feuille, faits.points_lampe || [], { min: 6 });
    if (r !== true) return r;
    const lignes = feuille.lignes(["A", "C"]);
    for (const [k, l] of lignes.entries()) if (Math.abs(l.C - pile(l.A)) > 0.005) return `C${k + 2} : la tension de la pile pour cette intensité, U = 4,5 − 2·I (par exemple =4,5-2*A${k + 2}).`;
    if (lignes.length < 6) return false;
    return (courbe.x === "A" && courbe.y === "B" && courbe.y2 === "C" && courbe.n >= 6) || "Graphique : U lampe (B) en ordonnée, I (A) en abscisse, et U pile (C) en deuxième courbe.";
  }

  const EXPERIENCE = {
    id: "experience", paillasse: 0, titre: "Une lampe branchée sur une pile",
    objectif: "Une lampe 6 V – 0,1 A branchée sur une pile de 4,5 V brille-t-elle normalement ? Quel courant la traverse ?",
    entetes: [],
    conclusion: "Le point de fonctionnement (I, U) d'un circuit est imposé à la fois par le générateur et par le récepteur : ici, I ≈ 82 mA et U ≈ 4,25 V. La lampe, prévue pour 6 V, est sous-alimentée et brille faiblement.",
    conclusion_courte: "Point de fonctionnement : fixé par le générateur et le récepteur.",
    etapes: [
      { consigne: "Réalisez le circuit en série : pile, interrupteur, ampèremètre (200 mA) et lampe L. Voltmètre (V⎓ 20) aux bornes de la lampe. Fermez l'interrupteur.", court: "Pile, K, ampèremètre, lampe ; fermez K.", verifier: ({ faits }) => (M(faits).I > 0.01 && M(faits).U_lampe > 1) || false, aide_geste: "Le voltmètre directement aux bornes de la lampe." },
      { consigne: "Relevez l'intensité I du courant (en A).", court: "I (A) ?", question: { type: "nombre", unite: "A", attendu: (faits) => M(faits).I || 0.085, tolerance: 0.002, aide: "Lisez l'ampèremètre (1 mA = 0,001 A).", bravo: "Exact." } },
      { consigne: "Relevez la tension U aux bornes de la lampe (en V).", court: "U (V) ?", question: { type: "nombre", unite: "V", attendu: (faits) => M(faits).U_lampe || 4.3, tolerance: 0.02, aide: "Lisez le voltmètre.", bravo: "Exact." } },
      { consigne: "Le couple (I, U) mesuré est le point de fonctionnement du circuit. La lampe…", court: "Répondez dans le carnet.", question: choix(["est sous-alimentée : U est inférieure à sa tension nominale de 6 V, elle brille faiblement", "fonctionne normalement", "est sur-alimentée"], "Comparez U à la tension écrite sur la lampe.", "Exact : la pile et la lampe sont mal adaptées.") },
    ],
  };

  const GRAPHIQUE = {
    id: "graphique", paillasse: 1, titre: "Méthode graphique",
    objectif: "Retrouver le point de fonctionnement par l'intersection des caractéristiques de la pile (U = 4,5 − 2·I) et de la lampe.",
    entetes: ["I (A)", "U lampe (V)", "U pile (V)"],
    conclusion: "Le point de fonctionnement est le point d'intersection de la caractéristique du générateur et de celle du récepteur : c'est le seul point (I, U) qui convient aux deux à la fois.",
    conclusion_courte: "Point de fonctionnement = intersection des caractéristiques.",
    etapes: [
      { consigne: "Relevez la caractéristique de la lampe L : alimentation réglable, ampèremètre (200 mA) et lampe en série, voltmètre aux bornes de la lampe ; au moins 6 points de 0 à 6 V.", court: "Caractéristique de la lampe (6 points).", verifier: ({ faits }) => (faits.points_lampe || []).length >= 6 || false, aide_geste: "Touches −1, +1, −0,1, +0,1 de l'alimentation." },
      { consigne: "Tableur : I (A) en A, U de la lampe (V) en B, et en C la tension de la pile pour la même intensité : U = 4,5 − 2·I. Graphique : B en fonction de A, et C en deuxième courbe.", court: "Tableur et graphique des deux caractéristiques.", verifier: feuille_graphique },
      { consigne: "Lisez sur le graphique l'intensité au point d'intersection des deux courbes (en A).", court: "I à l'intersection (A) ?", question: { type: "nombre", unite: "A", attendu: 0.085, tolerance: 0.007, aide: "Là où la courbe de la lampe croise la droite de la pile.", bravo: "Exact." } },
      { consigne: "Comparez avec le point mesuré directement (paillasse 1). Le point d'intersection…", court: "Répondez dans le carnet.", question: choix(["correspond au point de fonctionnement mesuré", "n'a aucun rapport avec le circuit", "donne la tension nominale de la lampe"], "Comparez les intensités.", "Exact : les deux méthodes concordent.") },
    ],
  };

  L.MISSIONS_POINT = [EXPERIENCE, GRAPHIQUE];
})(window.Labo);

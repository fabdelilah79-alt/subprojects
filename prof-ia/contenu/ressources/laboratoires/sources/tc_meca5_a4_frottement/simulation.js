/*
Rôle : simulation de l'activité 4 du chapitre « Équilibre d'un solide » (tronc commun) : « Mise en évidence du frottement ».
       Objectif O4 (connaître le coefficient de frottement) ; orientations : importance du frottement dans la vie courante,
       frottement représenté par une force répartie ou par ses composantes.
Reçoit : rien (les vérifications lisent les angles de glissement et les forces de traction maximales).
Produit : la simulation démarrée : plan inclinable avec deux pavés, traction horizontale au dynamomètre.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const G = 9.81, P = 0.2 * G;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const phi = (m) => (Math.atan(L.PAVES[m].statique) * 180) / Math.PI;
  const angle_note = (m) => ({ faits }) => {
    // L'angle de démarrage a été noté, près de l'angle limite (sinon le plan a été levé trop vite).
    const a = (faits.glissement || {})[m];
    if (a === undefined) return false;
    return a <= phi(m) + 3 || "Le pavé a glissé, mais vous avez soulevé le plan trop vite : reposez le pavé en haut du plan baissé et recommencez lentement.";
  };
  const traction = (g) => ({ faits }) => (faits.traction || {})[g] !== undefined || false;

  const PLAN = {
    id: "plan", paillasse: 0, titre: "Le plan inclinable",
    objectif: "Un pavé posé sur un plan : à partir de quelle inclinaison glisse-t-il ? Cela dépend-il des surfaces en contact ?",
    entetes: [],
    conclusion: "Le pavé glisse quand l'angle dépasse l'angle de frottement φ ; le coefficient de frottement est k = tan φ. Il dépend des surfaces en contact.",
    conclusion_courte: "k = tan φ.",
    etapes: [
      { consigne: "Faites glisser le pavé en bois sur le haut de la planche, plan à l'horizontale.", court: "Pavé en bois sur le plan.", verifier: ({ faits }) => faits.pave_sur_plan === "bois" || false },
      { consigne: "Soulevez lentement l'extrémité du plan (faites monter la noix de serrage) jusqu'à ce que le pavé se mette à glisser.", court: "Soulevez lentement le plan.", verifier: angle_note("bois"), aide_geste: "La noix est le bloc d'acier au bout de la planche." },
      { consigne: "Lisez l'angle φ du plan au moment où le pavé a démarré (en degrés).", court: "Angle φ (°) ?", question: { type: "nombre", unite: "°", attendu: (f) => f.glissement.bois, tolerance: 1, aide: "Lisez le rapporteur fixé à la charnière.", bravo: "Exact." } },
      { consigne: "Calculez le coefficient de frottement k = tan φ.", court: "k = tan φ ?", question: { type: "nombre", unite: "", attendu: (f) => Math.tan((f.glissement.bois * Math.PI) / 180), tolerance: 0.03, aide: "Calculatrice en degrés.", bravo: "Exact." } },
      { consigne: "Recommencez avec le pavé à semelle de caoutchouc (baissez d'abord le plan).", court: "Pavé à semelle de caoutchouc.", verifier: angle_note("caoutchouc") },
      { consigne: "Pour le caoutchouc sur le bois, le coefficient de frottement est…", court: "Répondez dans le carnet.", question: choix(["plus grand : il faut incliner davantage le plan", "le même", "plus petit"], "Comparez les deux angles.", "Exact : k dépend des surfaces en contact.") },
      { consigne: "Avant le glissement, le pavé est en équilibre sous son poids P et la réaction R du plan. R est…", court: "Répondez dans le carnet.", question: choix(["verticale, vers le haut, et inclinée d'un angle θ sur la normale au plan : sa composante parallèle au plan est la force de frottement", "perpendiculaire au plan", "nulle"], "Deux forces à l'équilibre sont opposées.", "Exact.") },
    ],
  };

  const TRACTION = {
    id: "traction", paillasse: 1, titre: "Tirer un pavé",
    objectif: "Tirer horizontalement le pavé en bois avec un dynamomètre : quelle force faut-il pour le faire démarrer ?",
    entetes: [],
    conclusion: "Le pavé démarre quand la force atteint k·P : la force de frottement maximale est proportionnelle au poids, et k est le même qu'avec le plan incliné.",
    conclusion_courte: "F_max = k·P.",
    etapes: [
      { consigne: "Tirez doucement l'anneau du dynamomètre vers la droite jusqu'à ce que le pavé démarre.", court: "Tirez jusqu'au démarrage.", verifier: traction(0), aide_geste: "L'index noir garde la force maximale." },
      { consigne: "Lisez la force maximale F_max sur l'index noir (en N).", court: "F_max (N) ?", question: { type: "nombre", unite: "N", attendu: L.PAVES.bois.statique * P, tolerance: 0.05, aide: "Un petit trait vaut 0,05 N.", bravo: "Exact." } },
      { consigne: "Ramenez le pavé à gauche, posez la masse de 200 g sur le pavé et recommencez.", court: "Avec 200 g sur le pavé.", verifier: traction(200) },
      { consigne: "Lisez la nouvelle force maximale (en N).", court: "F_max (N) ?", question: { type: "nombre", unite: "N", attendu: L.PAVES.bois.statique * 2 * P, tolerance: 0.06, aide: "Le poids a doublé.", bravo: "Exact." } },
      { consigne: "Le rapport F_max / P…", court: "Répondez dans le carnet.", question: choix(["est le même dans les deux cas : c'est le coefficient de frottement k, égal à tan φ", "double quand le poids double", "est nul"], "P = 1,96 N, puis 3,92 N.", "Exact.") },
      { consigne: "Dans la vie courante, le frottement…", court: "Répondez dans le carnet.", question: choix(["est indispensable : pour marcher, freiner, tenir un objet", "est toujours nuisible", "n'existe qu'au laboratoire"], "Imaginez un sol sans frottement.", "Exact : on cherche parfois à le réduire (huile), parfois à l'augmenter (pneus).") },
    ],
  };

  L.demarrer({
    id: "tc_meca5_a4_frottement", titre: "Laboratoire : le frottement",
    paillasses: [
      (g) => { L.plan_incline(g); return { pense_bete: L.decor.pense_bete(g, 24, 52, 230) }; },
      (g) => { L.traction(g); return { pense_bete: L.decor.pense_bete(g, 24, 52, 230) }; },
    ],
    missions: [PLAN, TRACTION],
  });
})(window.Labo);

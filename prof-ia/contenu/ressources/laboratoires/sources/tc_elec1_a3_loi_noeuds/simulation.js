/*
Rôle : simulation de l'activité 3 du chapitre « Courant électrique continu » (tronc commun) : loi des nœuds en série et en
       dérivation. Objectif O5 (conservation de la charge, loi des nœuds ; utiliser un ampèremètre et choisir son calibre).
Reçoit : rien (les vérifications lisent le circuit, les multimètres et la feuille du tableur).
Produit : la simulation démarrée : paillasse du circuit en série, paillasse du circuit en dérivation.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const S = (faits) => faits.serie || {}, D = (faits) => faits.derivation || {};
  const mA = (v) => Math.round(v * 1e5) / 100;
  const proche = (lu, v) => typeof lu === "number" && Math.abs(lu - mA(v)) <= 0.15;

  function tableau_serie({ feuille, faits }) {
    // Ligne 2 : les trois intensités mesurées (mA), toutes égales à celle du circuit.
    const l = feuille.lignes(["A", "B", "C"])[0], i = Math.abs(S(faits).i1 || 0);
    if (!l) return false;
    return (["A", "B", "C"].every((k) => proche(l[k], i))) || `Ligne 2 : écrivez les trois intensités lues, en mA (l'écran affiche ${L.nombre(mA(i), 1)}).`;
  }

  function tableau_derivation({ feuille, faits }) {
    // Ligne 2 : I, I1, I2 lus sur A, A1, A2 (mA) ; D = I1 + I2 calculé par une formule.
    const l = feuille.lignes(["A", "B", "C", "D"])[0], d = D(faits), r = d.roles || {}, m = d.mesures || {};
    if (!l || !r.principale) return false;
    if (!proche(l.A, m[r.principale]) || !proche(l.B, m[r.branche1]) || !proche(l.C, m[r.branche2])) return "Ligne 2 : recopiez I (branche principale), I1 (branche de L1) et I2 (branche de L2), en mA.";
    return Math.abs(l.D - (l.B + l.C)) < 0.01 || "En D2, calculez I1 + I2 (par exemple =B2+C2).";
  }

  const SERIE = {
    id: "serie", paillasse: 0, titre: "L'intensité dans un circuit en série",
    objectif: "Le courant « s'use »-t-il en traversant les lampes ? Mesurez l'intensité à plusieurs endroits.",
    entetes: ["I avant L1 (mA)", "I entre L1 et L2 (mA)", "I après L2 (mA)"],
    conclusion: "Dans un circuit en série, l'intensité du courant est la même en tout point : le courant ne s'use pas. On choisit le plus petit calibre supérieur à la valeur mesurée.",
    conclusion_courte: "En série : la même intensité partout.",
    etapes: [
      { consigne: "Réalisez un circuit en série : générateur, interrupteur, lampe L1 et lampe L2. Fermez l'interrupteur.", court: "Circuit en série avec L1 et L2, puis fermez K.", verifier: ({ faits }) => { const s = S(faits); return (s.ferme && s.eclat1 > 0.03 && s.eclat2 > 0.03 && Math.abs(s.i1 - s.i2) < 5e-4) || false; }, aide_geste: "Tirez un fil depuis une borne et lâchez-le sur une autre." },
      { consigne: "L2 brille moins que L1. Insérez le multimètre (bornes mA et COM, calibre 200 mA) à trois endroits différents du circuit : avant L1, entre L1 et L2, après L2.", court: "Multimètre à 3 endroits (200 mA).", verifier: ({ faits }) => Object.keys(S(faits).positions || {}).length >= 3 || false, aide_geste: "Ouvrez le circuit à l'endroit choisi et branchez le multimètre dans l'ouverture." },
      { consigne: "Recopiez dans le tableur les trois intensités mesurées (en mA), en A2, B2 et C2.", court: "Tableur : les trois intensités.", verifier: tableau_serie },
      { consigne: "Dans un circuit en série, l'intensité du courant…", court: "Répondez dans le carnet.", question: choix(["est la même en tout point du circuit", "diminue après chaque lampe", "est plus grande près de la borne +"], "Comparez les trois valeurs du tableur.", "Exact : le courant ne s'use pas.") },
      { consigne: "Le multimètre étant branché dans le circuit fermé, tournez son commutateur sur 20 mA.", court: "Calibre 20 mA.", verifier: ({ faits }) => (S(faits).mode === "20mA" && S(faits).depasse) || false },
      { consigne: "L'écran n'affiche plus qu'un « 1 » à gauche. Cela signifie que…", court: "Répondez dans le carnet.", question: choix(["l'intensité dépasse le calibre : il faut un calibre plus grand", "l'intensité vaut 1 mA", "le multimètre est en panne"], "Le calibre est la plus grande valeur mesurable.", "Exact.") },
      { consigne: "Pour mesurer cette intensité, le meilleur calibre est…", court: "Répondez dans le carnet.", question: choix(["200 mA : le plus petit calibre supérieur à la valeur", "10 A : le plus grand calibre", "20 mA : le plus petit calibre"], "Il faut un calibre assez grand, mais le plus précis possible.", "Exact.") },
    ],
  };

  const DERIVATION = {
    id: "derivation", paillasse: 1, titre: "La loi des nœuds",
    objectif: "Deux lampes en dérivation : comment l'intensité du courant principal se partage-t-elle au nœud ?",
    entetes: ["I (mA)", "I1 (mA)", "I2 (mA)", "I1 + I2 (mA)"],
    conclusion: "Loi des nœuds : la somme des intensités des courants qui arrivent à un nœud est égale à la somme des intensités de ceux qui en partent (I = I1 + I2). Elle traduit la conservation de la charge électrique.",
    conclusion_courte: "Loi des nœuds : I = I1 + I2.",
    etapes: [
      { consigne: "Montez L1 et L2 en dérivation aux bornes du générateur, avec l'interrupteur dans la branche principale. Fermez l'interrupteur : les deux lampes brillent normalement.", court: "L1 et L2 en dérivation, puis fermez K.", verifier: ({ faits }) => { const d = D(faits); return (d.ferme && d.eclat1 > 0.6 && d.eclat2 > 0.6) || false; }, aide_geste: "Deux fiches peuvent s'empiler sur une même borne : cette borne est alors un nœud." },
      { consigne: "Insérez les ampèremètres (bornes mA et COM, calibre 200 mA) : A dans la branche principale, A1 dans la branche de L1, A2 dans la branche de L2.", court: "A, A1, A2 en place (200 mA).", verifier: ({ faits }) => { const r = D(faits).roles || {}; return !!(r.principale && r.branche1 && r.branche2); } },
      { consigne: "Dans le tableur : I en A2, I1 en B2, I2 en C2 (en mA), puis calculez I1 + I2 en D2.", court: "Tableur : I, I1, I2, I1 + I2.", verifier: tableau_derivation },
      { consigne: "Comparez I et I1 + I2. Au nœud…", court: "Répondez dans le carnet.", question: choix(["I = I1 + I2 : le courant principal se partage entre les branches", "I = I1 = I2", "I1 + I2 est plus petit que I : une partie du courant se perd"], "Regardez les colonnes A et D.", "Exact : c'est la loi des nœuds.") },
      { consigne: "On ajoute une troisième lampe en dérivation. A mesure 0,45 A, A1 0,1 A et A2 0,05 A. Quelle est l'intensité I3 dans la troisième lampe (en A) ?", court: "I3 (A) ?", question: { type: "nombre", unite: "A", attendu: 0.3, tolerance: 0.005, aide: "I = I1 + I2 + I3.", bravo: "Exact : I3 = 0,3 A." } },
      { consigne: "La loi des nœuds traduit…", court: "Répondez dans le carnet.", question: choix(["la conservation de la charge : les charges ne s'accumulent pas au nœud et ne disparaissent pas", "l'usure du courant dans les lampes", "la fabrication de charges par le générateur"], "Que deviennent les électrons qui arrivent au nœud ?", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_elec1_a3_loi_noeuds", titre: "Laboratoire : la loi des nœuds", decor: "aucun", paillasses: [L.poste_serie, L.poste_derivation], missions: [SERIE, DERIVATION] });
})(window.Labo);

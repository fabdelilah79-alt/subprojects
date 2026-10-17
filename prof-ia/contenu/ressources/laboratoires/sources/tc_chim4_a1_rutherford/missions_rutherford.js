/*
Rôle : missions de l'expérience de Rutherford : comptages sans vide, avec et sans feuille, à plusieurs angles ; tableur
       θ / N, courbe, interprétation (structure lacunaire, noyau positif où la masse est concentrée).
Reçoit : les faits « rutherford » de la paillasse et la feuille de calcul.
Produit : Labo.MISSION_RUTHERFORD (mission de la paillasse 1).
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const R = (faits) => faits.rutherford || { mesures: [] };
  const vide = (m) => m.p < 5;

  function avec_sans({ faits }) {
    // À 0°, sous vide : un comptage sans la feuille, puis un comptage avec la feuille.
    const m = R(faits).mesures, i = m.findIndex((x) => x.theta === 0 && !x.feuille && vide(x));
    return i >= 0 && m.slice(i + 1).some((x) => x.theta === 0 && x.feuille && vide(x));
  }

  function feuille_angles({ feuille, faits }) {
    // Au moins 6 angles différents mesurés avec la feuille, sous vide, dont un au-delà de 90° ; N recopié du compteur.
    const m = R(faits).mesures.filter((x) => x.feuille && vide(x)), lignes = feuille.lignes(["A", "B"]);
    for (const [k, l] of lignes.entries()) {
      if (!m.some((x) => x.theta === l.A)) return `Ligne ${k + 2} : aucun comptage avec la feuille et sous vide à ${l.A}°. Comptez à cet angle.`;
      if (!m.some((x) => x.theta === l.A && x.N === l.B)) return `Ligne ${k + 2} : recopiez le nombre N affiché par le compteur à ${l.A}°.`;
    }
    const angles = new Set(lignes.map((l) => l.A));
    if (angles.size >= 6 && ![...angles].some((a) => a > 90)) return "Comptez aussi au-delà de 90° (par exemple à 120° ou 150°).";
    return angles.size >= 6 || false;
  }

  L.MISSION_RUTHERFORD = {
    id: "experience", paillasse: 1, titre: "L'expérience de Rutherford",
    objectif: "Envoyer des particules alpha sur une feuille d'or très mince et compter celles qui arrivent dans chaque direction θ.",
    entetes: ["θ (°)", "N (par min)"],
    donnees: ["Particule alpha : charge +2e, masse 6,6 × 10^{-27} kg", "Feuille d'or : 2 µm, environ 7 000 couches d'atomes"],
    conclusion: "Presque toutes les particules alpha traversent la feuille sans être déviées : l'atome est presque vide (structure lacunaire). Quelques-unes sont fortement déviées, certaines repartent en arrière : elles ont été repoussées par un noyau minuscule, chargé positivement, qui contient presque toute la masse de l'atome.",
    conclusion_courte: "Atome presque vide, noyau minuscule, positif et lourd.",
    etapes: [
      { consigne: "Feuille d'or en place, détecteur à 0° (dans l'axe du faisceau), sans faire le vide : lancez un comptage (touche ▶ du compteur).", court: "Comptage à 0°, sans vide.", aide_geste: "La touche ▶ compte pendant 1 min (le temps est accéléré).",
        verifier: ({ faits }) => R(faits).mesures.some((x) => x.theta === 0 && x.p > 500) || false },
      { consigne: "Le compteur n'a reçu aucune particule. Pourquoi ?", court: "Répondez dans le carnet.", question: choix(["Dans l'air, les particules alpha sont arrêtées après environ 4 cm ; de la source au détecteur, il y a environ 13 cm", "La source ne marche pas", "La feuille d'or arrête toutes les particules"], "Lisez la fiche de la source, au mur.", "Exact : il faut faire le vide dans la chambre.") },
      { consigne: "Mettez la pompe à vide en marche (touche I/O) et attendez que la pression soit inférieure à 5 hPa.", court: "Faites le vide (p < 5 hPa).", verifier: ({ faits }) => R(faits).p < 5 || false },
      { consigne: "Retirez la feuille d'or (bouton du couvercle) et comptez à 0°. Remettez la feuille et comptez de nouveau à 0°.", court: "0° : sans feuille, puis avec la feuille.", verifier: avec_sans },
      { consigne: "Avec ou sans la feuille d'or, on compte presque le même nombre de particules à 0°. On en déduit que…", court: "Répondez dans le carnet.", question: choix(["presque toutes les particules alpha traversent la feuille sans être déviées", "la feuille d'or est trouée", "les particules contournent la feuille"], "Comparez les deux nombres : la différence est très petite.", "Exact. Pourtant la feuille est continue : 7 000 couches d'atomes d'or. C'est l'atome lui-même qui est presque vide.") },
      { consigne: "Feuille en place, sous vide : comptez à au moins 6 angles différents, de 0° à 150° (dont au moins un au-delà de 90°). Notez θ en A et N en B.", court: "6 angles au moins : θ en A, N en B.", aide_geste: "Tournez le bras du détecteur au doigt (par pas de 5°), puis touchez ▶.", verifier: feuille_angles },
      { consigne: "Tracez N en fonction de θ.", court: "Tracez N en fonction de θ.", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "B" && c.n >= 6) || false },
      { consigne: "Quand l'angle θ augmente, le nombre N de particules reçues…", court: "Répondez dans le carnet.", question: choix(["diminue très vite, mais n'est pas nul, même au-delà de 90°", "augmente", "reste le même"], "Lisez votre tableau, en particulier au-delà de 90°.", "Exact : très peu de particules sont déviées, mais certaines repartent en arrière.") },
      { consigne: "Une particule alpha (positive) qui repart en arrière a été fortement repoussée. Elle est passée tout près…", court: "Répondez dans le carnet.", question: choix(["d'une très petite région chargée positivement, qui contient presque toute la masse de l'atome : le noyau", "d'un électron", "d'un trou de la feuille"], "Qu'est-ce qui peut repousser une charge positive, et la renvoyer alors qu'elle est 7 000 fois plus lourde qu'un électron ?", "Exact : c'est le noyau de l'atome.") },
      { consigne: "Le modèle de Thomson (charge positive répartie dans toute la sphère de l'atome) explique-t-il ces résultats ?", court: "Répondez dans le carnet.", question: choix(["Non : une charge positive étalée ne pourrait pas renvoyer une particule alpha en arrière", "Oui, parfaitement", "Oui, car les électrons arrêtent les particules alpha"], "Que prévoyait le modèle de Thomson ?", "Exact : il faut un nouveau modèle, celui de Rutherford.") },
    ],
  };
})(window.Labo);

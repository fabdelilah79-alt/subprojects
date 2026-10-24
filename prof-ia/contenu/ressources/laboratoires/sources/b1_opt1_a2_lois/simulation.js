/*
Rôle : simulation de l'activité 2 du chapitre « Conditions de visibilité d'un objet » (1re année du bac) : lois de la
       réflexion et retour inverse (miroir sur disque gradué) ; lois de Descartes de la réfraction, indice du plexiglas,
       angle limite et réflexion totale (demi-cylindre) ; observations courantes. Objectifs O3, O4.
Reçoit : rien (les vérifications lisent les faits « reflexion », « refraction » et la feuille du tableur).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const rf = (f) => f.reflexion || { essais: [] }, rr = (f) => f.refraction || { air: [], verre: [] }, sin = (a) => Math.sin((a * Math.PI) / 180);

  function tab_reflexion({ faits, feuille }) {
    // Cinq angles d'incidence différents ; r lu sur le disque (à 1° près).
    const l = feuille.lignes(["A", "B"]);
    if (l.length < 5) return false;
    for (const [k, x] of l.entries()) if (!rf(faits).essais.some((e) => e.i === x.A && Math.abs(e.r - x.B) <= 1)) return `Ligne ${k + 2} : i (°) d'un de vos essais et r (°) lu sur le disque.`;
    return new Set(l.map((x) => x.A)).size >= 5 || "Cinq angles d'incidence différents.";
  }

  function tab_refraction({ faits, feuille }) {
    // Quatre essais dans l'air : i1, i2 lu (à 1° près), sin i1, sin i2.
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 4) return false;
    for (const [k, x] of l.entries()) {
      if (!rr(faits).air.some((e) => e.i1 === x.A && Math.abs(e.i2 - x.B) <= 1)) return `Ligne ${k + 2} : i1 (°) d'un de vos essais (laser dans l'air) et i2 (°) lu sur le disque.`;
      if (Math.abs(x.C - sin(x.A)) > 0.005 || Math.abs(x.D - sin(x.B)) > 0.005) return `Ligne ${k + 2} : sinus des angles en degrés, par exemple =SIN(A${k + 2}*PI()/180).`;
    }
    return new Set(l.map((x) => x.A)).size >= 4 || "Quatre angles d'incidence différents.";
  }

  const REFLEXION = {
    id: "reflexion", paillasse: 0, titre: "Lois de la réflexion",
    objectif: "Mesurer l'angle de réflexion pour plusieurs angles d'incidence ; observer le retour inverse de la lumière.",
    entetes: ["i (°)", "r (°)"],
    conclusion: "Lois de Descartes de la réflexion : le rayon réfléchi est dans le plan d'incidence (défini par le rayon incident et la normale) ; l'angle de réflexion est égal à l'angle d'incidence : r = i. Principe du retour inverse : si la lumière suit un trajet dans un sens, elle peut le suivre dans l'autre sens.",
    conclusion_courte: "r = i ; retour inverse de la lumière.",
    etapes: [
      { consigne: "Placez le laser pour cinq angles d'incidence différents (de 10° à 70°). En A : i ; en B : r lu sur le disque.", court: "Tableur : A, B.", aide_geste: "Faites glisser le laser sur le bord du disque ; les angles se lisent à partir de la normale.", verifier: tab_reflexion },
      { consigne: "Comparez i et r :", court: "Répondez dans le carnet.", question: choix(["r = i : l'angle de réflexion est égal à l'angle d'incidence", "r = 2·i", "r = 90° − i"], "Comparez les colonnes A et B.", "Exact.") },
      { consigne: "Le rayon incident, la normale et le rayon réfléchi…", court: "Répondez dans le carnet.", question: choix(["sont dans le même plan (le plan d'incidence), de part et d'autre de la normale", "sont dans trois plans différents", "sont du même côté de la normale"], "Ils sont tous dans le plan du disque.", "Exact.") },
      { consigne: "Placez le laser à l'endroit où arrivait le rayon réfléchi de votre dernier essai.", court: "Laser sur le rayon réfléchi.", verifier: ({ faits }) => !!rf(faits).retour },
      { consigne: "La lumière repart alors…", court: "Répondez dans le carnet.", question: choix(["par le chemin de l'ancien rayon incident : c'est le retour inverse de la lumière", "dans une direction au hasard", "en ligne droite à travers le miroir"], "Regardez où arrive le nouveau rayon réfléchi.", "Exact.") },
    ],
  };

  const REFRACTION = {
    id: "refraction", paillasse: 1, titre: "Lois de la réfraction",
    objectif: "Mesurer les angles d'incidence et de réfraction de l'air vers le plexiglas ; en déduire l'indice ; étudier le passage inverse.",
    entetes: ["i1 (°)", "i2 (°)", "sin i1", "sin i2"],
    conclusion: "Lois de Descartes de la réfraction : le rayon réfracté est dans le plan d'incidence ; n1·sin i1 = n2·sin i2 (n : indice de réfraction du milieu, n = 1 pour l'air, 1,50 pour le plexiglas). Passant dans un milieu plus réfringent, la lumière se rapproche de la normale. Du plexiglas vers l'air, il n'y a plus de rayon réfracté au-delà de l'angle limite (sin i_lim = 1/n, i_lim ≈ 42°) : réflexion totale. Le retour inverse s'applique aussi.",
    conclusion_courte: "n1·sin i1 = n2·sin i2 ; réflexion totale.",
    etapes: [
      { consigne: "Laser dans l'air (en haut) : quatre angles d'incidence différents. En A : i1 ; en B : i2 lu sur le disque ; en C : sin i1 ; en D : sin i2.", court: "Tableur : A, B, C, D.", aide_geste: "Dans le tableur, SIN travaille en radians : =SIN(A2*PI()/180).", verifier: tab_refraction },
      { consigne: "Le rapport sin i1 / sin i2 est constant ; il vaut…", court: "n (sans unité) ?", question: { type: "nombre", unite: "", attendu: 1.5, tolerance: 0.04, aide: "Divisez C par D, ligne par ligne.", bravo: "Exact : c'est l'indice du plexiglas, n = 1,50 : sin i1 = n·sin i2." } },
      { consigne: "En entrant dans le plexiglas, le rayon…", court: "Répondez dans le carnet.", question: choix(["se rapproche de la normale (i2 < i1)", "s'éloigne de la normale", "n'est pas dévié"], "Comparez i1 et i2.", "Exact.") },
      { consigne: "Placez le laser sur le rayon réfracté de votre dernier essai (dans le plexiglas).", court: "Laser sur le rayon réfracté.", verifier: ({ faits }) => !!rr(faits).retour },
      { consigne: "Laser dans le plexiglas, augmentez l'angle d'incidence jusqu'à ce que le rayon réfracté disparaisse.", court: "Cherchez la réflexion totale.", verifier: ({ faits }) => rr(faits).verre.some((e) => e.r === null) && rr(faits).verre.some((e) => e.r !== null) },
      { consigne: "L'angle limite (le dernier angle avec un rayon réfracté) vaut environ…", court: "i_lim (°) ?", question: { type: "nombre", unite: "°", attendu: 41.8, tolerance: 1.2, aide: "sin i_lim = 1/n.", bravo: "Exact : sin i_lim = 1/1,50, i_lim ≈ 41,8°." } },
      { consigne: "Au-delà de l'angle limite…", court: "Répondez dans le carnet.", question: choix(["toute la lumière est réfléchie dans le plexiglas : c'est la réflexion totale (fibres optiques)", "la lumière traverse sans être déviée", "la lumière disparaît"], "Regardez le rayon réfléchi.", "Exact.") },
    ],
  };

  const OBSERVATIONS = {
    id: "observations", paillasse: 2, titre: "Observations courantes",
    objectif: "Expliquer deux observations de la vie courante.",
    entetes: [],
    conclusion: "La paille paraît brisée parce que la lumière venant de sa partie immergée est réfractée en sortant de l'eau : le cerveau la « voit » dans le prolongement des rayons reçus. Le lac reflète l'arbre par réflexion : l'image est symétrique par rapport à la surface de l'eau.",
    conclusion_courte: "Réfraction : paille brisée ; réflexion : reflet.",
    etapes: [
      { consigne: "La paille paraît brisée à la surface de l'eau, parce que…", court: "Répondez dans le carnet.", question: choix(["la lumière venant de la partie dans l'eau est réfractée en passant de l'eau à l'air", "la paille se plie dans l'eau", "l'eau absorbe la lumière"], "La paille est droite : sortez-la de l'eau pour vérifier.", "Exact.") },
      { consigne: "L'arbre est vu à l'envers dans le lac, parce que…", court: "Répondez dans le carnet.", question: choix(["la surface de l'eau réfléchit la lumière comme un miroir : r = i", "la lumière est réfractée dans l'eau", "le cerveau retourne l'image"], "Un miroir posé à plat donne le même effet.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_opt1_a2_lois", titre: "Laboratoire : réflexion et réfraction", decor: "aucun", paillasses: [L.poste_reflexion, L.poste_refraction, L.poste_observations], missions: [REFLEXION, REFRACTION, OBSERVATIONS] });
})(window.Labo);

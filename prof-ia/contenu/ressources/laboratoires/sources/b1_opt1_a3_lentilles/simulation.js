/*
Rôle : simulation de l'activité 3 du chapitre « Conditions de visibilité d'un objet » (1re année du bac) : lentilles
       convergentes et divergentes face à un faisceau parallèle (foyer image, distance focale), facteurs de la distance
       focale (rayon des faces, matière) ; reconnaître une lentille (bords minces ou épais, loupe).
Reçoit : rien (les vérifications lisent les faits « tableau », « loupe » et la feuille du tableur).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const ta = (f) => f.tableau || { vu: {}, mesures: {} }, mes = (f, id) => ta(f).mesures[id];

  function tableau({ faits, feuille }) {
    // Lentilles convergentes mesurées : R, n, f' mesurée, f' = R / (2(n − 1)).
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 3) return false;
    for (const [k, x] of l.entries()) {
      const len = L.LENTILLES.find((q) => q.type === "conv" && q.R === x.A && Math.abs(q.n - x.B) < 1e-6);
      if (!len) return `Ligne ${k + 2} : R (mm) et n d'une lentille convergente (lisez l'étiquette du plumier).`;
      if (mes(faits, len.id) === undefined || Math.abs(x.C - mes(faits, len.id)) > 2) return `Ligne ${k + 2} : f' mesurée (mm) avec le repère F' pour ${len.nom}.`;
      if (Math.abs(x.D - x.A / (2 * (x.B - 1))) > 0.05) return `Ligne ${k + 2} : f' = R / (2(n − 1)), par exemple =A${k + 2}/(2*(B${k + 2}-1)).`;
    }
    return new Set(l.map((x) => `${x.A}:${x.B}`)).size >= 3 || "Les trois lentilles convergentes.";
  }

  const FAISCEAU = {
    id: "faisceau", paillasse: 0, titre: "Lentilles et faisceau parallèle",
    objectif: "Observer l'effet d'une lentille convergente puis divergente sur un faisceau de rayons parallèles ; repérer le foyer image.",
    entetes: [],
    donnees: ["Tableau quadrillé : 1 carreau = 1 cm ; axe gradué en mm", "L1, L2, L3 : convergentes ; L4 : divergente"],
    conclusion: "Une lentille convergente (bords minces) fait converger un faisceau parallèle à son axe en un point de l'axe : le foyer image F'. Une lentille divergente (bords épais) le fait diverger : les rayons sortants semblent venir d'un point de l'axe situé avant la lentille, son foyer image (virtuel). La distance de la lentille à F' est la distance focale f'.",
    conclusion_courte: "Convergente : F' réel ; divergente : F' virtuel.",
    etapes: [
      { consigne: "Allumez la boîte à rayons (« Rayons »).", court: "Allumez les rayons.", verifier: ({ faits }) => !!ta(faits).allume },
      { consigne: "Posez la lentille L1 sur l'axe du tableau.", court: "L1 sur le tableau.", aide_geste: "Faites glisser la lentille du plumier jusqu'au tableau, puis le long de l'axe.", verifier: ({ faits }) => !!ta(faits).vu.conv },
      { consigne: "Après la lentille L1, les rayons parallèles…", court: "Répondez dans le carnet.", question: choix(["convergent vers un même point de l'axe : le foyer image F'", "restent parallèles", "s'écartent les uns des autres"], "Suivez les rayons après la lentille.", "Exact : L1 est convergente.") },
      { consigne: "Placez le repère F' au point où les rayons se croisent.", court: "Repère F' (L1).", aide_geste: "Faites glisser l'aimant rouge.", verifier: ({ faits }) => mes(faits, "L1") !== undefined },
      { consigne: "Distance focale de L1 (du centre de la lentille au repère F') ?", court: "f' (mm) de L1 ?", question: { type: "nombre", unite: "mm", attendu: (f) => mes(f, "L1") || 0, tolerance: 2, aide: "Comptez les carreaux (1 cm) et les graduations de l'axe (1 mm).", bravo: "Exact : environ 4 cm." } },
      { consigne: "Remplacez L1 par la lentille L4.", court: "L4 sur le tableau.", verifier: ({ faits }) => !!ta(faits).vu.div },
      { consigne: "Après la lentille L4, les rayons…", court: "Répondez dans le carnet.", question: choix(["s'écartent : ils semblent venir d'un point situé avant la lentille", "convergent derrière la lentille", "restent parallèles"], "Touchez « Prolonger » pour tracer leurs prolongements.", "Exact : L4 est divergente ; son foyer image est virtuel.") },
      { consigne: "Avec « Prolonger », placez le repère F' de L4, là où les prolongements se croisent.", court: "Repère F' (L4).", verifier: ({ faits }) => mes(faits, "L4") !== undefined },
    ],
  };

  const FOCALE = {
    id: "focale", paillasse: 0, titre: "De quoi dépend la distance focale ?",
    objectif: "Mesurer f' pour les trois lentilles convergentes et comparer à R / (2(n − 1)).",
    entetes: ["R (mm)", "n", "f' mesurée (mm)", "R / 2(n − 1) (mm)"],
    donnees: ["Étiquettes du plumier : L1 : R = 40 mm, n = 1,50 ; L2 : R = 25 mm, n = 1,50 ; L3 : R = 40 mm, n = 1,70 (verre flint)"],
    conclusion: "La distance focale d'une lentille dépend des rayons de courbure de ses faces et de la matière dont elle est faite : plus les faces sont bombées (R petit) et plus l'indice n est grand, plus f' est petite (la lentille est plus convergente). Pour une lentille mince à faces symétriques : f' ≈ R / (2(n − 1)).",
    conclusion_courte: "f' dépend de R et de n.",
    etapes: [
      { consigne: "Mesurez f' pour L1, L2 et L3 (repère F'). Une ligne par lentille : en A, R ; en B, n ; en C, f' mesurée ; en D, R / (2(n − 1)).", court: "Tableur : A, B, C, D.", verifier: tableau },
      { consigne: "Comparez L1 et L2 (même matière) :", court: "Répondez dans le carnet.", question: choix(["la lentille aux faces les plus bombées (R plus petit) a la plus petite distance focale", "f' ne dépend pas de la forme", "la lentille la plus plate converge le plus"], "Comparez C pour L1 et L2.", "Exact.") },
      { consigne: "Comparez L1 et L3 (même forme) :", court: "Répondez dans le carnet.", question: choix(["la matière la plus réfringente (n plus grand) donne la plus petite distance focale", "f' ne dépend pas de la matière", "le verre flint est divergent"], "Comparez C pour L1 et L3.", "Exact : f' dépend du milieu et des rayons des faces.") },
      { consigne: "Les valeurs mesurées (colonne C) sont un peu plus grandes que R / (2(n − 1)), parce que…", court: "Répondez dans le carnet.", question: choix(["ces lentilles sont épaisses : la formule n'est exacte que pour une lentille mince", "le tableau est mal gradué", "la lumière ralentit dans l'air"], "Regardez l'épaisseur de L2.", "Exact.") },
    ],
  };

  const LOUPE = {
    id: "loupe", paillasse: 1, titre: "Reconnaître une lentille",
    objectif: "Reconnaître une lentille convergente et une lentille divergente par leurs bords et par ce qu'elles montrent d'un texte.",
    entetes: [],
    conclusion: "Une lentille convergente a des bords minces : placée près d'un texte, elle l'agrandit (loupe). Une lentille divergente a des bords épais : elle montre le texte plus petit.",
    conclusion_courte: "Bords minces : convergente ; bords épais : divergente.",
    etapes: [
      { consigne: "Placez la lentille A, puis la lentille B, au-dessus du texte.", court: "A puis B sur le texte.", aide_geste: "Faites glisser chaque lentille par son manche.", verifier: ({ faits }) => !!(faits.loupe || {}).A && !!(faits.loupe || {}).B },
      { consigne: "La lentille A (bords minces) agrandit le texte : elle est…", court: "Répondez dans le carnet.", question: choix(["convergente (on l'utilise comme loupe)", "divergente", "ni l'une ni l'autre"], "Comparez avec L1, L2, L3 du tableau.", "Exact.") },
      { consigne: "La lentille B (bords épais) montre le texte plus petit : elle est…", court: "Répondez dans le carnet.", question: choix(["divergente", "convergente", "plane"], "Comparez avec L4 du tableau.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_opt1_a3_lentilles", titre: "Laboratoire : lentilles", decor: "aucun", paillasses: [L.poste_tableau, L.poste_loupe], missions: [FAISCEAU, FOCALE, LOUPE] });
})(window.Labo);

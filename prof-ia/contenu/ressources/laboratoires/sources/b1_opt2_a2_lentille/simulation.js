/*
Rôle : simulation de l'activité 2 du chapitre « Obtention de l'image d'un objet » (1re année du bac) : caractéristiques
       d'une lentille mince convergente au banc d'optique (foyer image, distance focale, vergence), conditions de Gauss
       (diaphragme), images réelles et virtuelle, construction géométrique de l'image. Objectifs O2, O3, O4.
Reçoit : rien (les vérifications lisent les faits « focale », « construction » et la feuille du tableur).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const es = (f) => (f.focale || {}).essais || [], co = (f) => f.construction || { cas: [] };
  const loin = (f, l) => es(f).filter((x) => x.objet === "lointain" && x.lentille === l), lant = (f) => es(f).filter((x) => x.objet === "lanterne");

  function tableau({ faits, feuille }) {
    // Une ligne par lentille : f' mesurée (cm) sur le banc, C = 1/f' (f' en mètres).
    const l = feuille.lignes(["A", "B"]);
    if (l.length < 2) return false;
    for (const [k, x] of l.entries()) {
      if (!["L1", "L2"].some((n) => loin(faits, n).some((m) => Math.abs(m.OAp - x.A) < 0.5))) return `Ligne ${k + 2} : f' (cm), distance lentille-écran quand l'image du paysage est nette.`;
      if (Math.abs(x.B - 100 / x.A) > 0.03 * (100 / x.A)) return `Ligne ${k + 2} : C = 1 / f' avec f' en mètres, par exemple =100/A${k + 2}.`;
    }
    return Math.abs(l[0].A - l[1].A) > 3 || "Une ligne pour L1, une ligne pour L2.";
  }

  const CARACT = {
    id: "caract", paillasse: 0, titre: "Foyer, distance focale, vergence",
    objectif: "Recueillir sur l'écran l'image d'un objet très éloigné ; en déduire la distance focale et la vergence de deux lentilles.",
    entetes: ["f' (cm)", "C (δ)"],
    donnees: ["Rail gradué en cm (lisez l'index jaune de chaque cavalier)", "Vergence : C = 1 / f' (f' en m, C en dioptries δ)"],
    conclusion: "L'image d'un objet très éloigné (à l'infini) se forme dans le plan focal image, au foyer image F' : la distance OF' = f' est la distance focale. La vergence C = 1 / f' s'exprime en dioptries (δ) quand f' est en mètres ; elle est positive pour une lentille convergente. Plus C est grande, plus f' est petite : la lentille est plus convergente.",
    conclusion_courte: "f' = OF' ; C = 1/f' en δ.",
    etapes: [
      { consigne: "Avec L1, déplacez l'écran jusqu'à voir une image nette de la maison lointaine.", court: "Image nette (L1).", aide_geste: "Faites glisser la lentille ou l'écran par son cavalier.", verifier: ({ faits }) => loin(faits, "L1").length > 0 },
      { consigne: "L'image d'un objet très éloigné se forme…", court: "Répondez dans le carnet.", question: choix(["au foyer image F' : la distance lentille-écran est la distance focale f'", "contre la lentille", "à n'importe quelle distance"], "Lisez les deux index sur le rail.", "Exact.") },
      { consigne: "Recommencez avec L2 (touche « Lentille »).", court: "Image nette (L2).", verifier: ({ faits }) => loin(faits, "L2").length > 0 },
      { consigne: "Une ligne par lentille : en A, f' (cm) ; en B, la vergence C = 1 / f' (δ, f' en mètres).", court: "Tableur : A, B.", verifier: tableau },
      { consigne: "La lentille la plus convergente est…", court: "Répondez dans le carnet.", question: choix(["L1 : sa vergence est la plus grande et sa distance focale la plus petite", "L2 : sa distance focale est la plus grande", "elles convergent autant"], "Comparez les colonnes A et B.", "Exact.") },
    ],
  };

  const GAUSS = {
    id: "gauss", paillasse: 0, titre: "Conditions de Gauss",
    objectif: "Observer l'effet d'un diaphragme sur la netteté et la luminosité de l'image du « F » de la lanterne.",
    entetes: [],
    conclusion: "Une lentille donne une image nette seulement si les rayons sont peu inclinés sur l'axe et passent près du centre optique : ce sont les conditions de Gauss. Un diaphragme placé contre la lentille arrête les rayons des bords : l'image est plus nette, mais moins lumineuse. On travaille alors avec des objets petits, près de l'axe.",
    conclusion_courte: "Gauss : rayons proches de l'axe, peu inclinés.",
    etapes: [
      { consigne: "Prenez la lanterne (touche « Objet ») et la lentille L1 ; cherchez l'image du « F » sur l'écran.", court: "Image du « F ».", verifier: ({ faits }) => lant(faits).some((x) => !x.diaphragme) },
      { consigne: "Mettez le diaphragme et refaites la mise au point.", court: "Avec diaphragme.", verifier: ({ faits }) => lant(faits).some((x) => x.diaphragme) },
      { consigne: "Avec le diaphragme, l'image est…", court: "Répondez dans le carnet.", question: choix(["plus nette mais moins lumineuse", "plus lumineuse et plus floue", "inchangée"], "Comparez le « F » avec et sans diaphragme ; déplacez un peu l'écran.", "Exact.") },
      { consigne: "Les conditions de Gauss demandent des rayons…", court: "Répondez dans le carnet.", question: choix(["proches de l'axe optique et peu inclinés sur lui", "qui passent par le bord de la lentille", "très inclinés"], "Le diaphragme ne laisse passer que le centre de la lentille.", "Exact.") },
    ],
  };

  const IMAGES = {
    id: "images", paillasse: 0, titre: "Image réelle, image virtuelle",
    objectif: "Chercher l'image du « F » pour plusieurs positions de la lentille L1 ; décrire l'image.",
    entetes: [],
    donnees: ["Lanterne : l'objet « F » est à 10 cm sur le rail ; L1 : f' = 10 cm"],
    conclusion: "Quand l'objet est avant le foyer objet F, la lentille en donne une image réelle, renversée, que l'on recueille sur un écran : plus petite que l'objet quand il est loin (au-delà de 2f'), plus grande quand il est près de F. Quand l'objet est entre F et la lentille, aucune image ne se forme sur l'écran : l'image est virtuelle, droite et agrandie (on la voit à travers la lentille : c'est la loupe).",
    conclusion_courte: "Avant F : image réelle renversée ; entre F et O : virtuelle.",
    etapes: [
      { consigne: "Placez L1 loin de la lanterne (plus de 20 cm) et obtenez une image nette plus petite que l'objet.", court: "Image réduite.", verifier: ({ faits }) => lant(faits).some((x) => x.lentille === "L1" && Math.abs(x.gamma) < 1) },
      { consigne: "Rapprochez L1 de la lanterne (entre 10 et 20 cm) : obtenez une image nette plus grande que l'objet.", court: "Image agrandie.", verifier: ({ faits }) => lant(faits).some((x) => x.lentille === "L1" && Math.abs(x.gamma) > 1) },
      { consigne: "L'image du « F » sur l'écran est…", court: "Répondez dans le carnet.", question: choix(["réelle et renversée", "droite", "virtuelle"], "Comparez le « F » de la lanterne et celui de l'écran.", "Exact.") },
      { consigne: "Placez L1 à moins de 10 cm de la lanterne et cherchez l'image avec l'écran.", court: "Objet entre F et O.", verifier: ({ faits }) => !!(faits.focale || {}).virtuelle },
      { consigne: "Aucune image n'apparaît sur l'écran, parce que…", court: "Répondez dans le carnet.", question: choix(["l'objet est entre le foyer et la lentille : l'image est virtuelle", "la lampe est trop faible", "l'écran est trop petit"], "Où est l'objet par rapport au foyer objet F (10 cm avant L1) ?", "Exact : on la voit à travers la lentille.") },
    ],
  };

  const CONSTRUCTION = {
    id: "construction", paillasse: 1, titre: "Construire l'image",
    objectif: "Placer les foyers, tracer les rayons particuliers issus de B et construire l'image A'B'.",
    entetes: [],
    donnees: ["Feuille : 1 carreau = 1 cm ; f' = 3 cm ; axe orienté dans le sens de la lumière"],
    conclusion: "Trois rayons particuliers issus de B suffisent pour construire B' : le rayon parallèle à l'axe ressort en passant par F' ; le rayon qui passe par O n'est pas dévié ; le rayon qui passe par F ressort parallèle à l'axe. A' est sur l'axe, à l'aplomb de B'. Si l'objet est entre F et O, les rayons sortants divergent : B' est à l'intersection de leurs prolongements ; l'image est virtuelle, droite et plus grande.",
    conclusion_courte: "B' : intersection des rayons particuliers.",
    etapes: [
      { consigne: "Posez les aimants F et F' (foyers objet et image) sur l'axe.", court: "Aimants F et F'.", aide_geste: "Faites glisser les aimants bleus ; OF = OF' = f'.", verifier: ({ faits }) => co(faits).F && co(faits).Fp },
      { consigne: "Objet loin de la lentille (A au-delà de 2F) : tracez deux rayons au moins et posez l'aimant B' à leur intersection.", court: "Image réduite.", aide_geste: "Faites glisser la flèche AB le long de l'axe.", verifier: ({ faits }) => co(faits).cas.some((c) => c.reelle && Math.abs(c.gamma) < 1) },
      { consigne: "Objet entre 2F et F : construisez de nouveau l'image.", court: "Image agrandie.", verifier: ({ faits }) => co(faits).cas.some((c) => c.reelle && Math.abs(c.gamma) > 1) },
      { consigne: "Objet entre F et O : touchez « Prolonger » et posez B' à l'intersection des prolongements.", court: "Image virtuelle.", verifier: ({ faits }) => co(faits).cas.some((c) => !c.reelle) },
      { consigne: "Le rayon issu de B qui passe par le centre optique O…", court: "Répondez dans le carnet.", question: choix(["n'est pas dévié", "ressort parallèle à l'axe", "passe par F'"], "Regardez le rayon 2 (bleu).", "Exact.") },
      { consigne: "Quand l'objet est entre F et O, l'image est…", court: "Répondez dans le carnet.", question: choix(["virtuelle, droite et plus grande que l'objet", "réelle et renversée", "au foyer image"], "B' est du même côté que l'objet, au-dessus de l'axe.", "Exact : c'est le principe de la loupe.") },
    ],
  };

  L.demarrer({ id: "b1_opt2_a2_lentille", titre: "Laboratoire : lentille convergente", decor: "aucun", paillasses: [L.poste_focale, L.poste_construction], missions: [CARACT, GAUSS, IMAGES, CONSTRUCTION] });
})(window.Labo);

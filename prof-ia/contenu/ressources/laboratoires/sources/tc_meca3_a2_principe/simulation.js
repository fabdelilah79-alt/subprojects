/*
Rôle : simulation de l'activité 2 du chapitre « Principe d'inertie » (tronc commun) : « Vérification expérimentale
       du principe d'inertie ». Objectifs O1 (énoncé du principe) et O2 (corps isolé, pseudo-isolé) ; orientation :
       dépasser la conception « une force est nécessaire pour entretenir un mouvement rectiligne uniforme ».
Reçoit : rien (les vérifications lisent la soufflerie, l'enregistrement et le tableur).
Produit : la simulation démarrée : table horizontale avec soufflerie, table inclinée, éclateurs, règles.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const V = L.VERIF_ENR;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const enr = (faits, table) => { const e = V.dernier(faits); return e && e.table === table ? e : null; };

  function lancer_horizontal({ faits }) {
    // Lancer enregistré sur la table horizontale, air en marche, 12 points alignés.
    const e = enr(faits, "horizontale");
    if (!e) return false;
    if (!e.air) return "Mettez l'air avant d'enregistrer : sans air, le palet frotte et s'arrête.";
    return (e.points.length >= 12 && V.rectiligne(e.points, 12)) || "Il faut 12 points alignés : relancez le palet vers le milieu de la table, sans rebond.";
  }

  function tableau({ feuille, faits }) {
    // i en A, MiMi+1 (cm) mesuré à la règle en B, pour i = 0 à 9.
    const e = enr(faits, "horizontale");
    if (!e) return false;
    const lignes = feuille.lignes(["A", "B"]);
    for (let i = 0; i < Math.min(10, lignes.length); i++) {
      if (Math.abs(lignes[i].A - i) > 1e-9) return `Ligne ${i + 2} : écrivez i = ${i} en colonne A.`;
      if (Math.abs(lignes[i].B - V.distance(e.points[i], e.points[i + 1]) / 10) > 0.15) return `Remesurez M${i}M${i + 1} à la règle (en cm, au millimètre près).`;
    }
    return lignes.length >= 10 || false;
  }

  function lancer_incline({ faits }) {
    // Lancer enregistré sur la table inclinée : 12 points au moins, sans toucher un bord.
    const e = enr(faits, "inclinee");
    if (!e) return false;
    if (e.points.length < 12) return "L'enregistrement est trop court : relancez le palet pendant l'enregistrement.";
    return !e.points.slice(0, 12).some((p) => p.x < 40 || p.x > 560 || p.y > 360) || "Le palet a touché un bord : lancez-le moins vite, vers la droite, depuis le haut.";
  }

  const IMMOBILE = {
    id: "immobile", paillasse: 0, titre: "Le palet au repos",
    objectif: "Le palet est posé sur la table horizontale. Que se passe-t-il quand l'air le soulève ?",
    entetes: [],
    conclusion: "Un palet posé, soulevé par l'air, reste immobile : son poids et l'action de l'air se compensent, il est pseudo-isolé.",
    conclusion_courte: "Au repos : P et R se compensent.",
    etapes: [
      { consigne: "Appuyez sur « Mettre l'air ». Ne touchez pas le palet : observez-le quelques secondes.", court: "Mettez l'air, observez le palet posé.", verifier: ({ faits }) => !!faits.immobile_avec_air },
      { consigne: "Le palet reste immobile. Son poids P et l'action R de l'air…", court: "Répondez dans le carnet.", question: choix(["se compensent : P + R = 0 (somme des vecteurs nulle)", "n'existent pas", "le poussent tous deux vers le bas"], "Il ne tombe pas et ne bouge pas.", "Exact : les deux actions se compensent.") },
      { consigne: "Un corps soumis à des actions qui se compensent est dit…", court: "Répondez dans le carnet.", question: choix(["pseudo-isolé", "isolé", "immobile pour toujours"], "Un corps isolé n'est soumis à aucune action.", "Exact. Un corps isolé, lui, n'est soumis à aucune action : c'est un cas idéal (loin de tout astre).") },
    ],
  };

  const LANCE = {
    id: "lance", paillasse: 0, titre: "Le palet lancé",
    objectif: "Lancer le palet, air en marche, et étudier son mouvement une fois lâché.",
    entetes: ["i", "MiMi+1 (cm)"],
    conclusion: "Principe d'inertie : dans un référentiel terrestre, tout corps isolé ou pseudo-isolé persévère dans son état de repos ou de mouvement rectiligne uniforme.",
    conclusion_courte: "Pseudo-isolé : repos ou MRU.",
    etapes: [
      { consigne: "Air en marche, appuyez sur « Enregistrer », puis lancez le palet : il glisse seul.", court: "Enregistrez un lancer, air en marche.", verifier: lancer_horizontal },
      { consigne: "Prenez la feuille. Pour i = 0 à 9, notez i en A et la distance MiMi+1 (cm), mesurée à la règle, en B.", court: "Tableur : i et MiMi+1 (i = 0 à 9).", verifier: tableau, aide_geste: "Posez le zéro de la règle sur Mi ; zoomez pour lire au millimètre." },
      { consigne: "Les distances MiMi+1 sont…", court: "Répondez dans le carnet.", question: choix(["égales : le mouvement est rectiligne uniforme", "de plus en plus petites : le palet ralentit", "de plus en plus grandes : le palet accélère"], "Comparez la colonne B.", "Exact : mouvement rectiligne uniforme.") },
      { consigne: "Une fois lâché, le palet est-il poussé vers l'avant par une force ?", court: "Répondez dans le carnet.", question: choix(["Non : aucune force n'est nécessaire pour entretenir un mouvement rectiligne uniforme", "Oui : sans force motrice, il s'arrêterait", "Oui : la force de la main reste dans le palet"], "Après le lâcher, seuls le poids et l'action de l'air agissent : ils se compensent.", "Exact : c'est le principe d'inertie.") },
      { consigne: "Énoncé du principe d'inertie : dans un référentiel terrestre, tout corps isolé ou pseudo-isolé…", court: "Répondez dans le carnet.", question: choix(["persévère dans son état de repos ou de mouvement rectiligne uniforme", "finit toujours par s'arrêter", "accélère jusqu'à une vitesse limite"], "Rassemblez vos deux observations : au repos, puis lancé.", "Exact.") },
    ],
  };

  const INCLINE = {
    id: "incline", paillasse: 1, titre: "Sur la table inclinée",
    objectif: "Sur la table inclinée, le palet est-il encore pseudo-isolé ?",
    entetes: [],
    conclusion: "Sur la table inclinée, le poids et l'action de l'air ne se compensent plus : le mouvement n'est plus rectiligne uniforme.",
    conclusion_courte: "Actions non compensées : pas de MRU.",
    etapes: [
      { consigne: "Appuyez sur « Enregistrer », puis lancez le palet vers la droite, depuis le haut de la table.", court: "Enregistrez un lancer sur la table inclinée.", verifier: lancer_incline, aide_geste: "Lancez doucement, parallèlement au bord du fond." },
      { consigne: "Prenez la feuille et comparez les distances entre points successifs. Le mouvement est-il rectiligne uniforme ?", court: "Répondez dans le carnet.", question: choix(["Non : la trajectoire est courbe et les distances augmentent", "Oui, comme sur la table horizontale", "Non : le palet ralentit"], "Regardez la forme de la trajectoire et l'écart entre les points.", "Exact.") },
      { consigne: "Sur la table inclinée, le poids P et l'action R de l'air…", court: "Répondez dans le carnet.", question: choix(["ne se compensent plus : le palet n'est pas pseudo-isolé", "se compensent toujours", "n'agissent plus"], "R reste perpendiculaire à la table, P reste vertical.", "Exact : le principe d'inertie ne s'applique pas.") },
      { consigne: "Une sonde spatiale, très loin de tout astre, moteurs coupés, se déplace à 10 km/s. Elle…", court: "Répondez dans le carnet.", question: choix(["continue en ligne droite à 10 km/s : elle est isolée", "ralentit puis s'arrête", "tombe vers le bas"], "Aucune action ne s'exerce sur elle.", "Exact : c'est un corps (presque) isolé.") },
    ],
  };

  L.demarrer({
    id: "tc_meca3_a2_principe", titre: "Laboratoire : le principe d'inertie",
    paillasses: [
      (g) => L.poste_coussin_air(g, { nom: "horizontale", soufflerie: true, outils: ["regle"] }),
      (g) => L.poste_coussin_air(g, { nom: "inclinee", inclinaison_mm_s2: 350, outils: ["regle"] }),
    ],
    missions: [IMMOBILE, LANCE, INCLINE],
  });
})(window.Labo);

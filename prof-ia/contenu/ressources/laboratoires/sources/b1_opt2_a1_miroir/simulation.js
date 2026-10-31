/*
Rôle : simulation de l'activité 1 du chapitre « Obtention de l'image d'un objet » (1re année du bac) : image d'une bougie
       dans une vitre (expérience des deux bougies) : position et taille de l'image d'un miroir plan ; champ de vision
       d'un miroir plan. Objectif O1.
Reçoit : rien (les vérifications lisent les faits « bougies », « champ » et la feuille du tableur).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const es = (f) => (f.bougies || {}).essais || [], ch = (f) => f.champ || {};

  function tableau({ faits, feuille }) {
    // Trois essais réussis : distance de la bougie 1 à la vitre, distance de la bougie 2 (image) à la vitre.
    const l = feuille.lignes(["A", "B"]);
    if (l.length < 3) return false;
    for (const [k, x] of l.entries()) if (!es(faits).some((e) => Math.abs(e.d_objet - x.A) < 0.3 && Math.abs(e.d_image - x.B) < 0.3)) return `Ligne ${k + 2} : distances (cm) d'un essai où la bougie 2 paraissait allumée.`;
    return new Set(l.map((x) => x.A)).size >= 3 || "Trois positions différentes de la bougie 1.";
  }

  const BOUGIES = {
    id: "bougies", paillasse: 0, titre: "L'expérience des deux bougies",
    objectif: "Trouver la position de l'image d'une bougie dans une vitre ; comparer les distances à la vitre.",
    entetes: ["objet à la vitre (cm)", "image à la vitre (cm)"],
    conclusion: "L'image d'un objet donnée par un miroir plan est symétrique de l'objet par rapport au plan du miroir : elle est derrière le miroir, à la même distance que l'objet, et elle a la même taille. C'est une image virtuelle : on la voit dans le miroir, mais on ne peut pas la recueillir sur un écran.",
    conclusion_courte: "Image symétrique de l'objet par rapport au miroir.",
    etapes: [
      { consigne: "Faites glisser la bougie éteinte (derrière la vitre) jusqu'à ce qu'elle paraisse allumée.", court: "Bougie 2 « allumée ».", aide_geste: "Faites glisser les bougies sur la feuille ; les chiffres donnent la distance à la vitre.", verifier: ({ faits }) => es(faits).length > 0 },
      { consigne: "Recommencez pour trois positions différentes de la bougie allumée. En A : distance de la bougie 1 à la vitre ; en B : distance de la bougie 2 à la vitre.", court: "Tableur : A, B.", verifier: tableau },
      { consigne: "Comparez les deux distances :", court: "Répondez dans le carnet.", question: choix(["elles sont égales : l'image est à la même distance du miroir que l'objet, de l'autre côté", "l'image est deux fois plus loin", "l'image est sur la vitre"], "Comparez A et B, ligne par ligne.", "Exact.") },
      { consigne: "L'image et l'objet sont…", court: "Répondez dans le carnet.", question: choix(["symétriques par rapport au plan du miroir, et de même taille", "l'un au-dessus de l'autre", "de tailles différentes"], "Les deux bougies ont la même hauteur.", "Exact.") },
      { consigne: "Si l'on place un écran à l'endroit de l'image…", court: "Répondez dans le carnet.", question: choix(["on n'y voit rien : l'image d'un miroir plan est virtuelle", "on y voit la flamme", "la flamme s'éteint"], "La lumière ne passe pas derrière la vitre pour former l'image.", "Exact.") },
    ],
  };

  const CHAMP = {
    id: "champ", paillasse: 1, titre: "Champ de vision d'un miroir",
    objectif: "Chercher quels objets l'œil voit dans un miroir selon sa position.",
    entetes: [],
    conclusion: "L'œil voit dans le miroir les objets dont l'image se trouve dans le cône issu de l'image de l'œil et s'appuyant sur les bords du miroir : c'est le champ de vision. Il est d'autant plus large que l'œil est proche du miroir et que le miroir est grand.",
    conclusion_courte: "Champ de vision : limité par les bords du miroir.",
    etapes: [
      { consigne: "Placez l'œil tout près du miroir (moins de 7 cm), puis loin (plus de 15 cm).", court: "Œil près, puis loin.", aide_geste: "Faites glisser la figurine œil sur la feuille.", verifier: ({ faits }) => ch(faits).pres !== null && ch(faits).pres !== undefined && ch(faits).loin !== null && ch(faits).loin !== undefined },
      { consigne: "Quand l'œil s'éloigne du miroir, le nombre de pions vus…", court: "Répondez dans le carnet.", question: choix(["diminue : le champ de vision se rétrécit", "augmente", "ne change pas"], "Comparez la bulle, œil près et œil loin.", "Exact.") },
      { consigne: "Un pion est vu dans le miroir si…", court: "Répondez dans le carnet.", question: choix(["la droite qui joint l'œil à l'image du pion traverse le miroir", "il est devant le miroir", "il est près de l'œil"], "Regardez les rayons tracés en jaune.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_opt2_a1_miroir", titre: "Laboratoire : miroir plan", decor: "aucun", paillasses: [L.poste_bougies, L.poste_champ], missions: [BOUGIES, CHAMP] });
})(window.Labo);

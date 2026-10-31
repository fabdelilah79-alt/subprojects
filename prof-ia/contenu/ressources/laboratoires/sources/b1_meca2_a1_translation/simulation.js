/*
Rôle : simulation du chapitre « Travail et puissance d'une force » (1re année du bac), activité de la fiche, partie
       translation : effet d'une force dont le point d'application se déplace, travail d'une force constante
       W = F·AB·cos α, travail moteur, résistant ou nul, travail du poids indépendant du chemin suivi. Objectifs O1 à O3.
Reçoit : rien (les vérifications lisent les faits « pave », « tri_travail », « plan » et la feuille de calcul).
Produit : la simulation démarrée : pavé tiré ; tableau magnétique ; plan incliné.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const ess = (f, cle) => (f[cle] || {}).essais || [], rad = (d) => (d * Math.PI) / 180;
  const glisse = (a) => (0.4 * 0.5 * 9.81) / (Math.cos(rad(a)) + 0.4 * Math.sin(rad(a)));
  const pres = (f, a) => ess(f, "pave").find((k) => Math.abs(k.alpha - a) <= 5 && k.ecart <= 8);
  const F0 = (f) => (pres(f, 0) || {}).F || 0;

  function tableau_pave({ faits, feuille }) {
    // Trois essais : α lu (proche d'un essai), F lue, F·cos α, W(F) = F·cos α × 0,40.
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 3) return false;
    for (const [k, r] of l.slice(0, 3).entries()) {
      if (!ess(faits, "pave").some((e) => Math.abs(e.alpha - r.A) <= 5)) return `Ligne ${k + 2} : α (colonne A) doit être l'angle d'un de vos essais.`;
      if (Math.abs(r.B - glisse(r.A)) > 0.12) return `Ligne ${k + 2} : F lue au dynamomètre pour cet angle (au dixième de newton).`;
      if (Math.abs(r.C - r.B * Math.cos(rad(r.A))) > 0.02 * Math.abs(r.C) + 0.005) return `Ligne ${k + 2} : F·cos α, par exemple =B${k + 2}*COS(A${k + 2}*PI()/180).`;
      if (Math.abs(r.D - r.C * 0.4) > 0.02 * Math.abs(r.D) + 0.002) return `Ligne ${k + 2} : W(F) = F·cos α × AB, avec AB = 0,40 m.`;
    }
    return true;
  }

  const PAVE = {
    id: "pave", paillasse: 0, titre: "Travail d'une force constante",
    objectif: "Tirer un pavé de A à B avec une force constante de directions différentes ; calculer son travail W = F·AB·cos α.",
    entetes: ["α (°)", "F (N)", "F·cos α (N)", "W(F) (J)"],
    donnees: ["Pavé : m = 500 g", "AB = 40 cm = 0,40 m", "W(F) = F × AB × cos α"],
    conclusion: "Quand le point d'application d'une force se déplace, la force travaille : elle peut mettre un corps en mouvement, le freiner, le déformer ou l'échauffer. Le travail d'une force constante F pour un déplacement AB est W(F) = F·AB·cos α (en joules, J), où α est l'angle entre F et AB : seule la composante de F parallèle au déplacement travaille. W > 0 : travail moteur ; W < 0 : travail résistant ; W = 0 si la force est perpendiculaire au déplacement.",
    conclusion_courte: "W(F) = F·AB·cos α (J).",
    etapes: [
      { consigne: "Tirez le pavé de A à B, fil horizontal (α = 0°), lentement et régulièrement : il glisse à vitesse constante.", court: "De A à B, α = 0°.", aide_geste: "Glissez l'anneau du dynamomètre vers la droite ; ramenez le pavé avant A pour recommencer.", verifier: ({ faits }) => !!pres(faits, 0) },
      { consigne: "Lisez F au dynamomètre. Quel est le travail de F de A à B ?", court: "W(F) (J) ?", question: { type: "nombre", unite: "J", attendu: (f) => F0(f) * 0.4, tolerance: 0.05, aide: "W = F × AB, avec AB = 0,40 m.", bravo: "Exact." } },
      { consigne: "Recommencez avec un fil incliné de 30° environ, puis de 60° environ (lisez l'angle sur le rapporteur), en gardant le même angle de A à B.", court: "Essais à 30° et 60°.", verifier: ({ faits }) => !!(pres(faits, 30) && pres(faits, 60)) || (ess(faits, "pave").some((k) => k.ecart > 8) ? "Gardez le même angle pendant tout le trajet de A à B." : false) },
      { consigne: "Tableur, une ligne par essai : α en A, F en B, F·cos α en C (=B2*COS(A2*PI()/180)), W(F) = C × 0,40 en D.", court: "Tableur : α, F, F·cos α, W.", verifier: tableau_pave },
      { consigne: "Pour un même déplacement AB, le travail de F dépend de sa direction : seule compte…", court: "Répondez dans le carnet.", question: choix(["la composante de F parallèle au déplacement", "la composante de F perpendiculaire au déplacement", "la valeur de F, quelle que soit sa direction"], "Comparez les colonnes C et D.", "Exact : W = F·AB·cos α.") },
      { consigne: "À vitesse constante, le frottement f compense la traction. Quel est le travail de f de A à B, pour l'essai à 0° ?", court: "W(f) (J) ?", question: { type: "nombre", unite: "J", attendu: (f) => -F0(f) * 0.4, tolerance: 0.05, aide: "f est opposée au déplacement : α = 180°, cos α = −1.", bravo: "Exact : W(f) < 0, travail résistant." } },
      { consigne: "De A à B, le travail du poids du pavé et celui de la réaction normale de la paillasse sont…", court: "Répondez dans le carnet.", question: choix(["nuls : ces forces sont perpendiculaires au déplacement", "moteurs", "résistants"], "cos 90° = 0.", "Exact.") },
    ],
  };

  const CLASSER = {
    id: "classer", paillasse: 1, titre: "Travail moteur, résistant ou nul",
    objectif: "Classer des situations du vécu selon le signe du travail de la force citée.",
    entetes: [],
    conclusion: "Le travail d'une force est moteur (W > 0) quand l'angle entre la force et le déplacement est inférieur à 90° : la force favorise le mouvement. Il est résistant (W < 0) quand cet angle dépasse 90° : la force s'oppose au mouvement. Il est nul quand la force est perpendiculaire au déplacement, ou quand son point d'application ne se déplace pas.",
    conclusion_courte: "Moteur : α < 90° ; résistant : α > 90° ; nul : α = 90° ou pas de déplacement.",
    etapes: [
      { consigne: "Classez les neuf situations : le travail de la force citée est-il moteur, résistant ou nul ?", court: "Classez les étiquettes.", verifier: ({ faits }) => L.tableau_tri.verifier(L.SITUATIONS_TRAVAIL, faits.tri_travail) },
      { consigne: "Le travail d'une force est moteur quand l'angle entre la force et le déplacement est…", court: "Répondez dans le carnet.", question: choix(["inférieur à 90°", "supérieur à 90°", "égal à 90°"], "cos α > 0 pour α < 90°.", "Exact.") },
      { consigne: "Un porteur tient une valise immobile : il se fatigue, mais le travail de sa force est nul, car…", court: "Répondez dans le carnet.", question: choix(["le point d'application de la force ne se déplace pas", "la force est nulle", "la valise est trop lourde"], "W = F·AB·cos α, avec AB = 0.", "Exact.") },
    ],
  };

  function tableau_plan({ faits, feuille }) {
    // Trois essais : α, L lue sur la planche, F lue, W(F) = L × F.
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 3) return false;
    for (const [k, r] of l.slice(0, 3).entries()) {
      const e = ess(faits, "plan").find((x) => x.alpha === Math.round(r.A));
      if (!e) return `Ligne ${k + 2} : α (colonne A) doit être l'inclinaison d'un de vos essais.`;
      if (Math.abs(r.B - e.L) > 0.01) return `Ligne ${k + 2} : L en mètres, lue sur la planche au repère rouge (à 1 cm près).`;
      if (Math.abs(r.C - e.F) > 0.1) return `Ligne ${k + 2} : F lue au dynamomètre (au dixième de newton).`;
      if (Math.abs(r.D - r.B * r.C) > 0.02 * Math.abs(r.D) + 0.002) return `Ligne ${k + 2} : W(F) = L × F.`;
    }
    return new Set(l.slice(0, 3).map((r) => Math.round(r.A))).size === 3 || "Trois inclinaisons différentes.";
  }

  const PLAN = {
    id: "plan", paillasse: 2, titre: "Travail du poids",
    objectif: "Monter un chariot de la même hauteur par des chemins différents ; montrer que le travail du poids ne dépend pas du chemin suivi.",
    entetes: ["α (°)", "L (m)", "F (N)", "W(F) (J)"],
    donnees: ["Chariot : m = 500 g ; g = 9,81 N/kg", "h = 20,0 cm (faisceau laser)", "W(F) = F × L"],
    conclusion: "Le travail du poids d'un corps qui passe d'une altitude zA à une altitude zB est W(P) = m·g·(zA − zB) : il ne dépend pas du chemin suivi, seulement de la différence d'altitude. Il est résistant quand le corps monte (W(P) = −m·g·h), moteur quand il descend. À vitesse constante, sans frottement, la force de traction compense le poids : W(F) = −W(P) = m·g·h, quel que soit le chemin.",
    conclusion_courte: "W(P) = m·g·(zA − zB), indépendant du chemin.",
    etapes: [
      { consigne: "Réglez l'inclinaison sur α = 20° : faites glisser la noix de la potence ; lisez l'angle sur le rapporteur.", court: "α = 20°.", verifier: ({ faits }) => (faits.plan || {}).alpha === 20 },
      { consigne: "Tirez le chariot à vitesse constante jusqu'à ce que son repère rouge coupe le faisceau laser. Lisez L sur la planche et F au dynamomètre.", court: "Jusqu'au faisceau.", aide_geste: "Glissez l'anneau du dynamomètre vers le haut de la planche.", verifier: ({ faits }) => ess(faits, "plan").some((e) => e.alpha === 20) },
      { consigne: "Recommencez avec deux autres inclinaisons (par exemple 30° et 40°).", court: "Deux autres inclinaisons.", verifier: ({ faits }) => new Set(ess(faits, "plan").map((e) => e.alpha)).size >= 3 },
      { consigne: "Tableur, une ligne par essai : α en A, L (m) en B, F (N) en C, W(F) = B × C en D.", court: "Tableur : α, L, F, W.", verifier: tableau_plan },
      { consigne: "Le travail de F est le même pour tous les chemins. Il vaut…", court: "Répondez dans le carnet.", question: choix(["m·g·h", "m·g·L", "F·h"], "Calculez 0,500 × 9,81 × 0,200.", "Exact : environ 0,98 J.") },
      { consigne: "Quel est le travail du poids du chariot, de O jusqu'au faisceau ?", court: "W(P) (J) ?", question: { type: "nombre", unite: "J", attendu: -0.5 * 9.81 * 0.2, tolerance: 0.03, aide: "W(P) = m·g·(zA − zB), avec zB − zA = 0,200 m.", bravo: "Exact : le chariot monte, le travail du poids est résistant." } },
      { consigne: "Le travail du poids entre deux points dépend…", court: "Répondez dans le carnet.", question: choix(["seulement de la différence d'altitude entre ces points", "de la longueur du chemin suivi", "de l'inclinaison du plan"], "Comparez vos trois chemins.", "Exact : il ne dépend pas du chemin suivi.") },
      { consigne: "Le chariot redescend du faisceau jusqu'en O. Quel est le travail de son poids ?", court: "W(P) (J) ?", question: { type: "nombre", unite: "J", attendu: 0.5 * 9.81 * 0.2, tolerance: 0.03, aide: "zA − zB = +0,200 m.", bravo: "Exact : travail moteur." } },
    ],
  };

  L.demarrer({ id: "b1_meca2_a1_translation", titre: "Laboratoire : travail d'une force", paillasses: [L.poste_pave, L.poste_tri_travail, L.poste_plan], missions: [PAVE, CLASSER, PLAN] });
})(window.Labo);

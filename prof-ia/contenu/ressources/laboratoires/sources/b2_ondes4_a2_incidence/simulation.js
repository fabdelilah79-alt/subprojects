/*
Rôle : simulation de l'activité 2 du chapitre « Diffraction de la lumière par un réseau » (2e année du bac) : réseau sur un
       plateau tournant (banc_reseau.js) ; incidence non normale : figure dissymétrique, vérification de
       sin θk − sin i = k·λ / a ; lumière blanche : spectres, ordre de déviation des couleurs, chevauchement des ordres ;
       longueur d'onde d'un laser vert : nature ondulatoire de la lumière. Objectifs O2, O3, O4.
Reçoit : rien (les vérifications lisent le fait « reseau »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const R = (f) => f.reseau || {}, DEG = 180 / Math.PI;
  const sur_ordre = (f, k) => (R(f).ordres || []).some((o) => o.k === k && o.ecran && [R(f).c1, R(f).c2].some((c) => Math.abs(c - o.x) <= 2));
  const reglage = (f, source, i) => R(f).n === 300 && R(f).source === source && R(f).i === i && R(f).D === 0.5;
  const delta = (k) => Math.asin(0.5 + k * 0.195) * DEG - 30;

  const OBLIQUE = {
    id: "oblique", paillasse: 0, titre: "Incidence non normale",
    objectif: "Tourner le réseau ; observer la figure ; vérifier la relation sin θk − sin i = k·λ / a.",
    entetes: [],
    donnees: ["Réseau de 300 traits/mm ; laser rouge : λ = 650 nm, donc λ / a = 0,195", "i : angle entre le faisceau incident et la normale au réseau (pointillés)", "θk : angle entre le faisceau d'ordre k et la normale ; déviation δk = θk − i, tan δk = x / D"],
    conclusion: "En incidence normale (i = 0), la figure est symétrique : sin θk = k·λ / a. Quand on tourne le réseau, la tache centrale (k = 0) ne bouge pas, mais les autres maximums ne sont plus symétriques. Les angles mesurés à partir de la normale au réseau vérifient sin θk − sin i = k·λ / a : on retrouve 0,195 pour k = 1 et −0,195 pour k = −1.",
    conclusion_courte: "sin θk − sin i = k·λ / a.",
    etapes: [
      { consigne: "Réseau de 300 traits/mm, laser rouge, i = 0°, écran à 0,50 m. Placez les deux curseurs sur les taches d'ordre 1 et −1.", court: "i = 0 : curseurs sur ±1.", aide_geste: "Faites glisser l'écran ; touchez Diapositive pour changer de réseau.", verifier: ({ faits }) => (reglage(faits, "rouge", 0) && sur_ordre(faits, 1) && sur_ordre(faits, -1)) || false },
      { consigne: "Position x de la tache d'ordre 1 (mm) ?", court: "x₁ (mm) ?", question: nombre("mm", 99.4, 1.5, "Lisez la position du curseur.", "Exact : les taches ±1 sont symétriques.") },
      { consigne: "Tournez le réseau : i = 30°. La figure…", court: "Répondez dans le carnet.", question: choix(["n'est plus symétrique ; la tache centrale (k = 0) reste dans l'axe du faisceau", "reste symétrique", "disparaît"], "Comparez les distances des ordres 1 et −1 à la tache centrale.", "Exact.") },
      { consigne: "Avec i = 30°, placez les curseurs sur les taches d'ordre 1 et −1.", court: "i = 30° : curseurs sur ±1.", aide_geste: "Bouton « rotation du réseau i » : glissez vers le haut, ou touches + et −.", verifier: ({ faits }) => (reglage(faits, "rouge", 30) && sur_ordre(faits, 1) && sur_ordre(faits, -1)) || false },
      { consigne: "Déviation de l'ordre 1 : δ₁ = arctan(x₁ / D) (°) ?", court: "δ₁ (°) ?", question: nombre("°", delta(1), 0.4, "x₁ et D dans la même unité.", "Exact : environ 14,0°.") },
      { consigne: "θ₁ = i + δ₁. Calculez sin θ₁ − sin i.", court: "sin θ₁ − sin i ?", question: nombre("", 0.195, 0.006, "i = 30° ; sin 30° = 0,5.", "Exact : λ / a = 0,195.") },
      { consigne: "Déviation de l'ordre −1 : δ₋₁ = arctan(x₋₁ / D) (°, négative) ?", court: "δ₋₁ (°) ?", question: nombre("°", delta(-1), 0.4, "x₋₁ est négative.", "Exact : environ −12,2°.") },
      { consigne: "θ₋₁ = i + δ₋₁. Calculez sin θ₋₁ − sin i.", court: "sin θ₋₁ − sin i ?", question: nombre("", -0.195, 0.006, "Le résultat est négatif.", "Exact : −λ / a.") },
      { consigne: "En incidence non normale, les directions des maximums vérifient…", court: "Répondez dans le carnet.", question: choix(["sin θk − sin i = k·λ / a", "sin θk = k·λ / a", "θk = k·λ / a + i"], "Vos deux derniers résultats.", "Exact.") },
    ],
  };

  const BLANCHE = {
    id: "blanche", paillasse: 0, titre: "Lumière blanche, longueur d'onde",
    objectif: "Observer les spectres de la lumière blanche ; mesurer la longueur d'onde d'un laser vert.",
    entetes: [],
    donnees: ["Lumière visible : de 400 nm (violet) à 800 nm (rouge) environ", "Réseau de 300 traits/mm : a = 3,33 µm"],
    conclusion: "En lumière blanche, toutes les radiations se superposent dans la direction k = 0 : tache centrale blanche. Dans les autres ordres, chaque radiation part dans sa direction (sin θk = k·λ / a) : on obtient des spectres, le violet le moins dévié, le rouge le plus (l'inverse du prisme). Les spectres d'ordres 2 et 3 se chevauchent. Comme la cuve à ondes, le réseau montre que la lumière se comporte comme une onde, et il permet de mesurer sa longueur d'onde : λ = a·sin θ1 ≈ 532 nm pour le laser vert.",
    conclusion_courte: "Spectres ; λ = a·sin θ1.",
    etapes: [
      { consigne: "Réseau de 300 traits/mm, i = 0°, écran à 0,50 m : passez en lumière blanche (touche Source).", court: "Lumière blanche, i = 0°.", verifier: ({ faits }) => reglage(faits, "blanche", 0) || false },
      { consigne: "Sur l'écran, on voit…", court: "Répondez dans le carnet.", question: choix(["une tache centrale blanche et, de chaque côté, des spectres colorés", "une seule tache blanche", "un seul spectre au centre"], "Regardez l'écran vu de face.", "Exact.") },
      { consigne: "Dans chaque spectre, la couleur la moins déviée est…", court: "Répondez dans le carnet.", question: choix(["le violet : sin θ1 = λ / a est plus petit pour une longueur d'onde plus courte", "le rouge", "le vert"], "Le violet est-il près ou loin de la tache centrale ?", "Exact : c'est l'inverse du prisme.") },
      { consigne: "La tache centrale reste blanche parce que…", court: "Répondez dans le carnet.", question: choix(["pour k = 0, toutes les radiations ont la même direction (non déviées) et se superposent", "le réseau absorbe les couleurs au centre", "le centre de l'écran est blanc"], "sin θ0 = 0 pour toutes les longueurs d'onde.", "Exact.") },
      { consigne: "Quels spectres se chevauchent ?", court: "Répondez dans le carnet.", question: choix(["ceux d'ordres 2 et 3", "ceux d'ordres 0 et 1", "aucun"], "Le rouge d'ordre 2 (700 nm) et le violet d'ordre 3 (400 nm) : comparez 2 × 700 et 3 × 400.", "Exact : 2 × 700 nm > 3 × 400 nm.") },
      { consigne: "Prenez le laser vert (i = 0°, écran à 0,50 m). Placez un curseur sur une tache d'ordre 1.", court: "Laser vert : curseur sur l'ordre 1.", verifier: ({ faits }) => (reglage(faits, "vert", 0) && (sur_ordre(faits, 1) || sur_ordre(faits, -1))) || false },
      { consigne: "Longueur d'onde du laser vert : λ = a·sin θ1 (nm) ?", court: "λ (nm) ?", question: nombre("nm", 532, 7, "sin θ1 = x / √(x² + D²) ; a = 3 333 nm.", "Exact : environ 532 nm.") },
      { consigne: "La diffraction par un réseau montre que…", court: "Répondez dans le carnet.", question: choix(["la lumière se comporte comme une onde, de longueur d'onde mesurable", "la lumière se propage toujours en ligne droite", "la lumière est formée de petites billes"], "Pensez à la cuve à ondes.", "Exact.") },
    ],
  };

  L.poste_reseau_tournant = function (g) {
    // Pense-bête et banc à réseau, avec le plateau tournant.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.banc_reseau(g, { fait: "reseau", incidence: true, objets: [3, 2, 4], D: 0.5 });
    return { pense_bete };
  };

  L.demarrer({ id: "b2_ondes4_a2_incidence", titre: "Laboratoire : réseau, incidence et lumière blanche", paillasses: [L.poste_reseau_tournant], missions: [OBLIQUE, BLANCHE] });
})(window.Labo);

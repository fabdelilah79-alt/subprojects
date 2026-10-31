/*
Rôle : simulation de l'activité 1 du chapitre « Ondes mécaniques progressives » (2e année du bac) : exemples familiers —
       une vague dans une cuve et un bouchon qui flotte (propagation sans transport de matière, célérité), ondes
       transversale et longitudinale le long d'un ressort, documents sur le son et les séismes. Objectifs O1, O2.
Reçoit : rien (les vérifications lisent les faits « vague », « ressort », « docs_ondes », « tri_ondes »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const V = (f) => f.vague || {}, R = (f) => f.ressort || { rouge: {} };

  const VAGUE = {
    id: "vague", paillasse: 0, titre: "La vague et le bouchon",
    objectif: "Créer une perturbation à la surface de l'eau ; observer le bouchon.",
    entetes: [],
    conclusion: "La perturbation créée par la cale se propage le long de la surface de l'eau : c'est une onde mécanique. Le bouchon monte puis redescend à sa place, sans avancer : l'onde transporte de l'énergie, pas de matière. Sa célérité est v = d / Δt = 0,40 m / 0,74 s ≈ 0,54 m/s. La plage de mousse absorbe la vague, qui n'est pas réfléchie.",
    conclusion_courte: "Une onde : propagation d'une perturbation, sans transport de matière.",
    etapes: [
      { consigne: "Enfoncez la cale dans l'eau, à gauche de la cuve, puis relâchez-la. Regardez la vague et le bouchon.", court: "Créez une vague.", aide_geste: "Faites glisser la cale vers le bas, puis lâchez-la.", verifier: ({ faits }) => (V(faits).source >= 0.3 && V(faits).arrivee) || false },
      { consigne: "Quand la vague passe, le bouchon…", court: "Répondez dans le carnet.", question: choix(["monte puis redescend à sa place : il n'est pas emporté", "est emporté par la vague jusqu'à la plage", "ne bouge pas du tout"], "Recommencez et regardez seulement le bouchon.", "Exact : il n'y a pas de transport de matière.") },
      { consigne: "La vague met 0,74 s pour parcourir les 40 cm qui séparent la cale du bouchon. Sa célérité vaut…", court: "v (m/s) ?", question: nombre("m/s", 0.54, 0.03, "v = d / Δt, avec d en mètres.", "Exact : environ 0,54 m/s.") },
      { consigne: "Une onde mécanique est…", court: "Répondez dans le carnet.", question: choix(["la propagation d'une perturbation dans un milieu matériel, sans transport de matière", "un déplacement de matière d'un point à un autre", "une vibration qui se répète forcément"], "Pensez au bouchon.", "Exact.") },
    ],
  };

  const RESSORT = {
    id: "ressort", paillasse: 1, titre: "Transversale ou longitudinale ?",
    objectif: "Créer deux sortes de perturbations le long d'un ressort ; suivre la spire rouge.",
    entetes: [],
    conclusion: "Quand on secoue la poignée perpendiculairement au ressort, chaque spire se déplace perpendiculairement à la direction de propagation : l'onde est transversale. Quand on pousse la poignée le long du ressort, les spires se serrent puis s'écartent dans la direction de propagation : l'onde est longitudinale. Dans les deux cas, la spire rouge revient à sa place.",
    conclusion_courte: "Transversale : ⊥ ; longitudinale : ∥ à la propagation.",
    etapes: [
      { consigne: "Saisissez la poignée, déplacez-la vivement vers le haut puis ramenez-la : une bosse parcourt le ressort.", court: "Onde transversale.", aide_geste: "Glissez la poignée vers le haut, puis lâchez-la : elle revient seule.", verifier: ({ faits }) => (R(faits).trans >= 0.05 && R(faits).rouge.dy >= 2) || false },
      { consigne: "Quand la bosse passe, la spire rouge…", court: "Répondez dans le carnet.", question: choix(["se déplace perpendiculairement au ressort puis revient à sa place : l'onde est transversale", "avance avec la bosse jusqu'au bout", "se déplace le long du ressort"], "Regardez seulement la spire rouge.", "Exact.") },
      { consigne: "Poussez maintenant la poignée le long du ressort (vers la droite) puis relâchez-la.", court: "Onde longitudinale.", aide_geste: "Glissez la poignée horizontalement vers la droite, puis lâchez-la.", verifier: ({ faits }) => (R(faits).longi >= 0.05 && R(faits).rouge.dx >= 2) || false },
      { consigne: "Cette fois, la spire rouge…", court: "Répondez dans le carnet.", question: choix(["se déplace le long du ressort, dans la direction de propagation, puis revient : l'onde est longitudinale", "se déplace perpendiculairement au ressort", "reste immobile"], "Les spires se serrent puis s'écartent.", "Exact.") },
    ],
  };

  const SONS = {
    id: "sons", paillasse: 2, titre: "Sons et séismes",
    objectif: "Lire les documents ; classer des ondes ; exploiter un sismogramme.",
    entetes: [],
    donnees: ["Ondes sismiques P : 6,0 km/s ; ondes S : 3,5 km/s"],
    conclusion: "Le son est une onde longitudinale de compression-dilatation ; il a besoin d'un milieu matériel et ne se propage pas dans le vide. Les séismes produisent des ondes P longitudinales, plus rapides, et des ondes S transversales. L'écart Δt entre leurs arrivées donne la distance du foyer : d = Δt / (1/vS − 1/vP) ; pour Δt = 20 s, d ≈ 168 km.",
    conclusion_courte: "Son : onde longitudinale, pas dans le vide.",
    etapes: [
      { consigne: "Lisez les quatre documents au mur.", court: "Lisez les documents.", aide_geste: "Touchez un document pour l'ouvrir, touchez-le de nouveau pour le refermer.", verifier: ({ faits }) => (faits.docs_ondes || []).length >= 4 },
      { consigne: "Rangez chaque onde dans sa colonne.", court: "Tableau : rangez les ondes.", verifier: ({ faits }) => L.tableau_tri.verifier(L.TRI_ONDES, faits.tri_ondes) },
      { consigne: "On n'entend plus le réveil placé sous une cloche où l'on a fait le vide parce que…", court: "Répondez dans le carnet.", question: choix(["le son est une onde mécanique : il a besoin d'un milieu matériel pour se propager", "le réveil s'arrête dans le vide", "le verre de la cloche arrête la lumière"], "Relisez le document « Le son ».", "Exact.") },
      { consigne: "Une station reçoit les ondes S 20 s après les ondes P. À quelle distance du foyer est-elle ?", court: "d (km) ?", question: nombre("km", 168, 5, "d / vS − d / vP = Δt, donc d = Δt / (1/vS − 1/vP), avec v en km/s.", "Exact : environ 168 km.") },
    ],
  };

  L.demarrer({ id: "b2_ondes1_a1_exemples", titre: "Laboratoire : des ondes autour de nous", paillasses: [L.poste_vague, L.poste_ressort_exemples, L.poste_sons_seismes], missions: [VAGUE, RESSORT, SONS] });
})(window.Labo);

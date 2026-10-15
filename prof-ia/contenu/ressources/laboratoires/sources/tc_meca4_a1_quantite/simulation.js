/*
Rôle : simulation de l'activité 1 du chapitre « Quantité de mouvement » (tronc commun) : « Définition et représentation
       de p ». Objectifs O1 (définir la quantité de mouvement, son unité) et O2 (représenter le vecteur quantité de mouvement).
Reçoit : rien (les vérifications lisent l'enregistrement, sa masse, la surcharge et la flèche tracée).
Produit : la simulation démarrée : table à coussin d'air, mobile de 300 g, surcharge de 300 g, règle, flèche p.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const V = L.VERIF_ENR, M = 0.3, SURCHARGE = 0.3, INDICE = 5, MM_PAR_KGMS = 200;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const e_ = (f) => V.dernier(f);
  const v_mru = (f) => V.distance(e_(f).points[0], e_(f).points[10]) / 1000 / (10 * e_(f).tau_s);

  function lancer(masse) {
    // Lancer enregistré avec la bonne masse, 12 points alignés.
    return ({ faits }) => {
      const e = e_(faits);
      if (!e) return false;
      if (Math.abs(e.masse_kg - masse) > 1e-6) return masse > M ? "Posez d'abord la surcharge sur le mobile, puis enregistrez un nouveau lancer." : "Retirez la surcharge du mobile pour ce premier lancer.";
      return (e.points.length >= 12 && V.rectiligne(e.points, 12)) || "Il faut 12 points alignés : relancez le mobile vers le milieu de la table, sans rebond.";
    };
  }

  function fleche({ faits }) {
    // Le vecteur p5 tracé : direction de la vitesse, longueur m·v à l'échelle.
    const e = e_(faits);
    if (!e || Math.abs(e.masse_kg - M) > 1e-6) return false;
    return L.vecteurs_vitesse.verifier((faits.vecteurs || {})[INDICE], e.points, INDICE, e.tau_s, M * MM_PAR_KGMS, "p");
  }

  const DEFINITION = {
    id: "definition", paillasse: 0, titre: "La quantité de mouvement d'un mobile",
    objectif: `Lancer le mobile de ${M * 1000} g sur la table horizontale, calculer sa quantité de mouvement p = m·v et représenter son vecteur.`,
    entetes: [],
    conclusion: "La quantité de mouvement d'un solide est p = m·v (en kg·m/s) ; son vecteur a la direction et le sens du vecteur vitesse.",
    conclusion_courte: "p = m·v, en kg·m/s.",
    etapes: [
      { consigne: "Appuyez sur « Enregistrer », puis lancez le mobile (sans la surcharge).", court: "Enregistrez un lancer.", verifier: lancer(M) },
      { consigne: "Prenez la feuille. Mesurez M0M10 à la règle et calculez la vitesse v du mobile (en m/s).", court: "Vitesse v (m/s) ?", question: { type: "nombre", unite: "m/s", attendu: v_mru, tolerance_relative: 0.05, aide: "v = M0M10 / (10τ), avec M0M10 en mètre.", bravo: "Exact : le mouvement est rectiligne uniforme." } },
      { consigne: `Calculez la quantité de mouvement p = m·v du mobile (m = ${M * 1000} g), en kg·m/s.`, court: "p (kg·m/s) ?", question: { type: "nombre", unite: "kg·m/s", attendu: (f) => M * v_mru(f), tolerance_relative: 0.06, aide: `m en kilogramme : ${L.nombre(M, 1)} kg.`, bravo: "Exact." } },
      { consigne: `Sur la feuille, tracez le vecteur quantité de mouvement en M${INDICE} : faites glisser la pointe de la flèche (échelle : 1 cm ↔ 0,05 kg·m/s).`, court: `Tracez le vecteur p${INDICE}.`, verifier: fleche, aide_geste: "La flèche part du point ; sa longueur dépend de p." },
      { consigne: "Le vecteur quantité de mouvement…", court: "Répondez dans le carnet.", question: choix(["a la direction et le sens du vecteur vitesse, et pour valeur m·v", "est perpendiculaire à la trajectoire", "est dirigé vers le bas, comme le poids"], "p = m·v : on multiplie le vecteur vitesse par la masse.", "Exact.") },
      { consigne: "L'unité de la quantité de mouvement dans le Système international est…", court: "Répondez dans le carnet.", question: choix(["le kg·m/s", "le newton (N)", "le joule (J)"], "Masse en kg, vitesse en m/s.", "Exact.") },
    ],
  };

  const MASSE = {
    id: "masse", paillasse: 0, titre: "Le rôle de la masse",
    objectif: `Avec la surcharge, la masse du mobile double (${(M + SURCHARGE) * 1000} g). Comment change sa quantité de mouvement ?`,
    entetes: [],
    conclusion: "À vitesse égale, la quantité de mouvement est proportionnelle à la masse.",
    conclusion_courte: "p proportionnelle à m (et à v).",
    etapes: [
      { consigne: "Posez la surcharge sur le mobile arrêté, appuyez sur « Enregistrer », puis lancez-le.", court: "Surcharge posée : enregistrez un lancer.", verifier: lancer(M + SURCHARGE), aide_geste: "Faites glisser le disque de laiton sur le mobile arrêté, puis lancez le mobile en le prenant par son bord." },
      { consigne: `Mesurez la vitesse, puis calculez p = m·v avec m = ${(M + SURCHARGE) * 1000} g (en kg·m/s).`, court: "p (kg·m/s) ?", question: { type: "nombre", unite: "kg·m/s", attendu: (f) => (M + SURCHARGE) * v_mru(f), tolerance_relative: 0.06, aide: "v = M0M10 / (10τ) ; m en kg.", bravo: "Exact." } },
      { consigne: "Deux mobiles ont la même vitesse ; l'un a une masse double de l'autre. Sa quantité de mouvement est…", court: "Répondez dans le carnet.", question: choix(["deux fois plus grande", "la même", "deux fois plus petite"], "p = m·v.", "Exact.") },
      { consigne: "Une voiture de 1200 kg roule à 72 km/h. Quelle est sa quantité de mouvement (en kg·m/s) ?", court: "p de la voiture (kg·m/s) ?", question: { type: "nombre", unite: "kg·m/s", attendu: 24000, tolerance: 100, aide: "72 km/h = 20 m/s.", bravo: "Exact : 1200 × 20 = 24 000 kg·m/s." } },
    ],
  };

  L.demarrer({
    id: "tc_meca4_a1_quantite", titre: "Laboratoire : la quantité de mouvement",
    paillasses: [(g) => L.poste_p(g, { masse_kg: M, surcharge_kg: SURCHARGE, indice: INDICE, mm_par_kgms: MM_PAR_KGMS })],
    missions: [DEFINITION, MASSE],
  });
})(window.Labo);

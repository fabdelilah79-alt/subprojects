/*
Rôle : simulation de l'activité 3 du chapitre « Lecture d'une formule chimique » (1re année du bac) : synthèse de l'acide
       benzoïque par oxydation de l'alcool benzylique par le permanganate en milieu basique — reflux, filtration du
       dioxyde de manganèse, acidification et filtration des cristaux, pesée et rendement, contrôle de pureté par
       chromatographie (révélation sous UV). Objectifs O5, O6, O7.
Reçoit : rien (les vérifications lisent les faits des paillasses).
Produit : la simulation démarrée : reflux ; filtration ; précipitation ; rendement ; chromatographie.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const { reflux, filtration, precipitation, choix } = L.MISSIONS_BENZOIQUE, { preparation } = L.MISSIONS_CCM;
  const P = (f) => f.pesee_benzoique || {}, C = (f) => f.ccm_benzoique || {};
  const N_MAX = (2.0 * 1.04) / 108 * 1000, N_OBT = (L.BENZOIQUE.M_OBTENUE / 122) * 1000;
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const ESPECES = { acide: { rgb: null, Rf: 0.42 }, alcool: { rgb: null, Rf: 0.68 } };
  const ech = (n, x, texte, especes) => ({ n, x, texte, rgb: null, especes });

  function peser({ faits }) {
    // Tout le produit dans une coupelle tarée posée sur la balance.
    const p = P(faits), M = L.BENZOIQUE.M_OBTENUE;
    if (!p.tout) return false;
    if (p.sur_balance < M - 0.01) return "Tout le produit doit être dans la coupelle posée sur la balance.";
    if (p.lecture !== null && Math.abs(p.lecture - M) > 0.02) return "La balance doit être tarée avec la coupelle vide : retirez la coupelle, posez-en une vide, appuyez sur T, puis versez de nouveau.";
    return p.lecture !== null || false;
  }

  const RENDEMENT = {
    id: "rendement", paillasse: 3, titre: "Peser le produit, calculer le rendement",
    objectif: "Peser l'acide benzoïque sec obtenu et calculer le rendement de la synthèse.",
    entetes: [],
    donnees: ["n = m / M ; m = d × ρ(eau) × V, avec ρ(eau) = 1,00 g/mL", "Les coefficients de l'alcool et de l'acide benzoïque sont égaux dans l'équation"],
    conclusion: "n(alcool) = 1,04 × 2,0 / 108 = 1,93 × 10⁻² mol : le permanganate étant en excès, c'est aussi la quantité maximale d'acide benzoïque. On obtient 1,62 g, soit n = 1,62 / 122 = 1,33 × 10⁻² mol. Le rendement r = n(obtenu) / n(max) ≈ 0,69 = 69 %. Il est inférieur à 100 % : pertes lors des transferts et des filtrations, acide resté dissous dans l'eau mère.",
    conclusion_courte: "r = n(obtenu) / n(max) ≈ 69 %.",
    etapes: [
      { consigne: "Allumez la balance, posez une coupelle vide sur le plateau et tarez (touche T).", court: "Coupelle tarée.", verifier: ({ faits }) => (P(faits).coupelle && P(faits).lecture === 0) || false },
      { consigne: "Avec la spatule, versez tout le produit sec dans la coupelle, puis lisez la masse.", court: "Pesez tout le produit.", aide_geste: "Sortez la spatule du pot et tenez-la au-dessus de la coupelle ; retournez au pot pour la recharger.", verifier: peser },
      { consigne: "Calculez la quantité de matière d'alcool benzylique introduite (en mmol).", court: "n(alcool) en mmol ?", question: nombre("mmol", N_MAX, 0.4, "m = 1,04 × 2,0 g ; n = m / 108.", "Exact : n(alcool) ≈ 19,3 mmol.") },
      { consigne: "Le permanganate est en excès. La quantité maximale d'acide benzoïque n(max) est donc…", court: "Répondez dans le carnet.", question: choix(["égale à n(alcool), car une mole d'alcool donne une mole d'acide", "égale à n(permanganate)", "le double de n(alcool)"], "Comparez les coefficients de l'équation (3 et 3).", "Exact.") },
      { consigne: "Quantité de matière d'acide benzoïque obtenue (en mmol) ?", court: "n(obtenu) en mmol ?", question: nombre("mmol", (f) => ((P(f).lecture || 0) / 122) * 1000 || N_OBT, 0.3, "n = m / M, avec M = 122 g/mol.", "Exact.") },
      { consigne: "Rendement de la synthèse (en %) ?", court: "Rendement (%) ?", question: nombre("%", (f) => ((P(f).lecture || L.BENZOIQUE.M_OBTENUE) / 122 * 1000 / N_MAX) * 100, 2, "r = n(obtenu) / n(max) × 100.", "Exact : environ 69 %.") },
      { consigne: "Le rendement est inférieur à 100 % parce que…", court: "Répondez dans le carnet.", question: choix(["une partie du produit est perdue (transferts, filtrations, acide resté dissous dans l'eau)", "la balance est fausse", "l'acide benzoïque s'est évaporé à l'étuve"], "Où a-t-on pu perdre du produit ?", "Exact.") },
    ],
  };

  const PURETE = {
    id: "purete", paillasse: 4, titre: "Le produit est-il pur ?",
    objectif: "Comparer par chromatographie : 1 produit obtenu, 2 acide benzoïque pur (référence), 3 alcool benzylique (réactif).",
    entetes: [],
    conclusion: "Le produit obtenu (1) donne une seule tache, à la même hauteur que l'acide benzoïque pur (2), et aucune tache à la hauteur de l'alcool benzylique (3) : le produit est de l'acide benzoïque, et il ne reste plus de réactif. On peut aussi mesurer sa température de fusion (122 °C) au banc Kofler.",
    conclusion_courte: "Une seule tache, au Rf de l'acide benzoïque : produit pur.",
    etapes: [
      ...preparation("ccm_benzoique", 3, "cyclohexane et acétone"),
      { consigne: "Allumez la lampe UV et entourez au crayon chaque tache sombre.", court: "Révélation UV, taches entourées.", verifier: ({ faits }) => (C(faits).uv_vu && C(faits).cercles >= 3) || false },
      { consigne: "Le produit obtenu (1)…", court: "Répondez dans le carnet.", question: choix(["donne une seule tache, au même niveau que l'acide benzoïque pur : c'est de l'acide benzoïque, sans alcool restant", "contient encore de l'alcool benzylique", "n'est pas de l'acide benzoïque"], "Comparez les hauteurs des taches 1, 2 et 3.", "Exact.") },
    ],
  };

  const CCM = L.poste_ccm({ fait: "ccm_benzoique", eluant: "éluant", revelation: true, especes: ESPECES, echantillons: [ech(1, 390, "obtenu", ["acide"]), ech(2, 425, "acide pur", ["acide"]), ech(3, 460, "alcool", ["alcool"])] });
  L.demarrer({ id: "b1_chim6_a3_benzoique", titre: "Laboratoire : synthèse de l'acide benzoïque", paillasses: [L.poste_reflux_benzoique, L.poste_filtration_mno2, L.poste_precipitation, L.poste_pesee_benzoique, CCM], missions: [reflux, filtration, precipitation, RENDEMENT, PURETE] });
})(window.Labo);

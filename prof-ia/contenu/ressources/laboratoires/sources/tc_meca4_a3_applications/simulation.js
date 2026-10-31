/*
Rôle : simulation de l'activité 3 du chapitre « Quantité de mouvement » (tronc commun) : « Applications : recul d'une
       arme, choc, barque ». Objectif O3 (connaître et appliquer la loi de conservation de la quantité de mouvement).
Reçoit : rien (les vérifications lisent l'enregistrement du choc et la fin des photographies).
Produit : la simulation démarrée : choc de deux mobiles sur table à coussin d'air, barque sur un lac, canon sur un rail.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const CHOC = { m_a: 0.2, m_b: 0.4 }, BARQUE = { m_enfant: 40, m_barque: 80, v_enfant: 2.4 }, CANON = { m_bille: 0.05, m_chariot: 0.4, v_bille: 3.2 };
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const D = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
  const e_ = (f) => { const e = L.VERIF_ENR.dernier(f); return e && e.points[0].a ? e : null; };
  const instant_choc = (e) => e.points.findIndex((p) => D(p.b, e.points[0].b) > 1);
  const v_avant = (f) => D(e_(f).points[0].a, e_(f).points[4].a) / 1000 / (4 * e_(f).tau_s);
  const v_apres = (f) => { const e = e_(f), k = instant_choc(e) + 1; return D(e.points[k].b, e.points[k + 4].b) / 1000 / (4 * e.tau_s); };

  function enregistrement_choc({ faits }) {
    // Au moins 5 intervalles avant le choc et 5 après.
    const e = e_(faits);
    if (!e) return false;
    const k = instant_choc(e);
    if (k < 0) return "A n'a pas touché B : lancez A droit vers B pendant l'enregistrement.";
    if (k < 6) return "Le choc arrive trop tôt : lancez A de plus loin (du bord gauche de la table).";
    return e.points.length - k >= 7 || "Il faut plus de points après le choc : choisissez τ = 60 ms, ou lancez A moins vite.";
  }

  const MISSION_CHOC = {
    id: "choc", paillasse: 0, titre: "Le choc de deux mobiles",
    objectif: `A (${CHOC.m_a * 1000} g) est lancé vers B (${CHOC.m_b * 1000} g, avec sa surcharge), immobile. Des bandes auto-agrippantes les collent au choc.`,
    entetes: [],
    conclusion: "Au cours du choc, la quantité de mouvement du système {A, B} se conserve : mA·vA = (mA + mB)·v'.",
    conclusion_courte: "Choc : p avant = p après.",
    etapes: [
      { consigne: "Appuyez sur « Enregistrer », puis lancez franchement le mobile A droit vers B, depuis le bord gauche de la table.", court: "Enregistrez le choc de A sur B.", verifier: enregistrement_choc },
      { consigne: "Prenez la feuille. Avant le choc, mesurez A0A4 et calculez la vitesse vA (en m/s).", court: "vA avant le choc (m/s) ?", question: { type: "nombre", unite: "m/s", attendu: v_avant, tolerance_relative: 0.06, aide: "vA = A0A4 / (4τ).", bravo: "Exact." } },
      { consigne: "Après le choc, A et B avancent ensemble. Mesurez quatre intervalles de B après le choc et calculez leur vitesse v' (en m/s).", court: "v' après le choc (m/s) ?", question: { type: "nombre", unite: "m/s", attendu: v_apres, tolerance_relative: 0.08, aide: "Choisissez des points de B qui ont bougé ; v' = distance / (4τ).", bravo: "Exact." } },
      { consigne: "Comparez p avant = mA·vA et p après = (mA + mB)·v'.", court: "Répondez dans le carnet.", question: choix(["elles sont égales : la quantité de mouvement se conserve au cours du choc", "p après est plus grande", "p après est nulle"], `mA = ${CHOC.m_a} kg, mA + mB = ${CHOC.m_a + CHOC.m_b} kg.`, "Exact.") },
    ],
  };

  const MISSION_BARQUE = {
    id: "barque", paillasse: 1, titre: "Le saut depuis la barque",
    objectif: `L'enfant (${BARQUE.m_enfant} kg) saute de la barque (${BARQUE.m_barque} kg), immobile sur l'eau, vers le ponton, à ${L.nombre(BARQUE.v_enfant, 1)} m/s.`,
    entetes: [],
    conclusion: "Le système {enfant, barque} est pseudo-isolé et immobile au départ : sa quantité de mouvement reste nulle, la barque recule.",
    conclusion_courte: "La barque recule : p total nul.",
    etapes: [
      { consigne: "Touchez « Sauter ! » et observez la photographie à pose multiple.", court: "Faites sauter l'enfant.", verifier: ({ faits }) => !!faits.recul_barque },
      { consigne: "Avec les points rouges du fanion et les bouées (tous les 0,5 m), mesurez la vitesse de la barque (en m/s).", court: "Vitesse de la barque (m/s) ?", question: { type: "nombre", unite: "m/s", attendu: (BARQUE.m_enfant * BARQUE.v_enfant) / BARQUE.m_barque, tolerance_relative: 0.1, aide: "Distance parcourue entre deux points éloignés, divisée par la durée (0,25 s entre deux points).", bravo: "Exact." } },
      { consigne: `Calculez p(enfant) = ${BARQUE.m_enfant} × ${L.nombre(BARQUE.v_enfant, 1)} et p(barque). La barque recule parce que…`, court: "Répondez dans le carnet.", question: choix(["la quantité de mouvement du système, nulle au départ, reste nulle : p(barque) = − p(enfant)", "l'eau la pousse vers l'arrière", "le vent souffle"], "Les deux quantités de mouvement ont la même valeur.", "Exact.") },
    ],
  };

  const MISSION_CANON = {
    id: "canon", paillasse: 2, titre: "Le recul du canon",
    objectif: `Le canon à ressort (avec son chariot : ${CANON.m_chariot * 1000} g) tire une bille de ${CANON.m_bille * 1000} g.`,
    entetes: [],
    conclusion: "Au tir, la bille et l'arme partent en sens opposés : m_bille·v_bille = m_arme·v_arme. C'est le recul d'une arme.",
    conclusion_courte: "Recul : m·v égales et opposées.",
    etapes: [
      { consigne: "Touchez « Tirer » et observez la photographie à pose multiple.", court: "Faites tirer le canon.", verifier: ({ faits }) => !!faits.recul_canon },
      { consigne: "Avec les points bleus et la graduation du rail (en cm), mesurez la vitesse de recul du chariot (en m/s).", court: "Vitesse de recul (m/s) ?", question: { type: "nombre", unite: "m/s", attendu: (CANON.m_bille * CANON.v_bille) / CANON.m_chariot, tolerance_relative: 0.1, aide: "Distance entre deux points éloignés, divisée par la durée (0,1 s entre deux points).", bravo: "Exact." } },
      { consigne: "La barrière lumineuse a mesuré la vitesse de la bille. Que vaut m_bille·v_bille comparé à m_chariot·v_chariot ?", court: "Répondez dans le carnet.", question: choix(["la même valeur : la quantité de mouvement totale reste nulle", "m_bille·v_bille est beaucoup plus grand", "il n'y a aucun rapport"], `${CANON.m_bille} × ${L.nombre(CANON.v_bille, 1)} et ${CANON.m_chariot} × votre vitesse.`, "Exact.") },
      { consigne: "Un fusil de 4 kg tire une balle de 10 g à 400 m/s. Quelle est sa vitesse de recul (en m/s) ?", court: "Vitesse de recul du fusil (m/s) ?", question: { type: "nombre", unite: "m/s", attendu: 1, tolerance: 0.02, aide: "0,010 × 400 = 4 × v.", bravo: "Exact : 1 m/s, c'est pourquoi on cale la crosse contre l'épaule." } },
    ],
  };

  L.demarrer({
    id: "tc_meca4_a3_applications", titre: "Laboratoire : applications de la conservation",
    paillasses: [
      (g) => { const poste = L.poste_coussin_air(g, { nom: "choc", outils: ["regle"] }); L.choc(poste.table, { ...CHOC, place_b: { x: 380, y: 200 } }); return poste; },
      (g) => L.poste_barque(g, BARQUE),
      (g) => L.poste_canon(g, CANON),
    ],
    missions: [MISSION_CHOC, MISSION_BARQUE, MISSION_CANON],
  });
})(window.Labo);

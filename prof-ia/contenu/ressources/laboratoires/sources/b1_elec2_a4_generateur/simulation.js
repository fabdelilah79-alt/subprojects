/*
Rôle : simulation de l'activité 4 du chapitre « Transfert d'énergie dans un circuit électrique » (1re année du bac) :
       énergie fournie par un générateur (pile) : P_g = E·I, P_e = U·I, P_j = r·I², rendement U/E ; influence des
       résistances et de la f.é.m. (deux piles en série) ; I = E/Req pour un circuit résistif. Objectifs O5, O6.
Reçoit : rien (les vérifications lisent le fait « generateur » et la feuille du tableur).
Produit : la simulation démarrée : bilan de puissance de la pile ; influence de E et des résistances.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const gen = (f) => f.generateur || { E_lu: null, points: {} }, pt = (f, cle) => gen(f).points[cle] || { I: 0, U: 0 };
  const E = (f) => gen(f).E_lu || 4.5, R = { "p1:r22": 22, "p1:r47": 47, "p1:r22+r47": 69 };

  function charge({ faits }) {
    // Pile seule sur R1 : I mesurée, U_PN lue aux bornes de la pile.
    const p = gen(faits).points["p1:r22"];
    if (p && p.U !== null) return true;
    return p ? "Branchez aussi le voltmètre entre P et N, interrupteur fermé." : false;
  }

  function tableau({ faits, feuille }) {
    // Pile seule sur R1, R2, R1 + R2 : R, I mesurée, E/(R + r), P_g = E·I.
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 3) return false;
    for (const [k, r] of l.entries()) {
      const cle = Object.keys(R).find((x) => R[x] === r.A), p = cle && gen(faits).points[cle];
      if (!p) return `Ligne ${k + 2} : R en A (22, 47 ou 69 Ω), pour un montage que vous avez mesuré (pile seule).`;
      if (Math.abs(r.B - p.I) > 2e-4) return `Ligne ${k + 2} : I en ampères, lue sur l'ampèremètre avec R = ${r.A} Ω.`;
      if (Math.abs(r.C - 4.5 / (r.A + 1.5)) > 0.005 * r.C) return `Ligne ${k + 2} : E/(R + r), par exemple =4,5/(A${k + 2}+1,5).`;
      if (Math.abs(r.D - 4.5 * r.B) > 0.005 * r.D) return `Ligne ${k + 2} : P_g = E × I, par exemple =4,5*B${k + 2}.`;
    }
    return new Set(l.map((r) => r.A)).size >= 3 || "Trois montages différents : R1, R2, R1 + R2 en série.";
  }

  const BILAN = {
    id: "bilan", paillasse: 0, titre: "Bilan de puissance d'une pile",
    objectif: "Mesurer E, U_PN et I ; calculer la puissance produite, fournie au circuit, perdue par effet Joule ; le rendement.",
    entetes: [],
    donnees: ["Pile plate : E ≈ 4,5 V ; résistance interne r inconnue", "R1 = 22 Ω ; R2 = 47 Ω"],
    conclusion: "Un générateur transforme une autre forme d'énergie (chimique pour une pile) en énergie électrique : puissance produite P_g = E·I. Il en fournit P_e = U_PN·I au circuit extérieur et en perd P_j = r·I² par effet Joule : E·I = U_PN·I + r·I². Rendement du générateur : η = P_e/P_g = U_PN/E < 1. L'énergie fournie par le générateur est reçue par les récepteurs du circuit.",
    conclusion_courte: "E·I = U·I + r·I² ; η = U/E.",
    etapes: [
      { consigne: "Branchez le voltmètre (calibre 20 V) entre les bornes P et N de la pile 1, sans rien d'autre : à vide (I = 0), il mesure la f.é.m. E.", court: "Mesurez E.", aide_geste: "Tirez un fil d'une borne à une autre ; tournez le commutateur d'un toucher.", verifier: ({ faits }) => gen(faits).E_lu !== null },
      { consigne: "f.é.m. de la pile 1 : E = ?", court: "E (V) ?", question: { type: "nombre", unite: "V", attendu: (f) => E(f), tolerance: 0.01, aide: "Lisez le voltmètre, à vide.", bravo: "Exact : E ≈ 4,5 V." } },
      { consigne: "Montez en série la pile 1, l'interrupteur, l'ampèremètre (mA et COM, calibre 200 mA) et R1 = 22 Ω ; gardez le voltmètre entre P et N. Fermez l'interrupteur.", court: "Circuit avec R1.", verifier: charge },
      { consigne: "Puissance électrique produite par la pile : P_g = E·I.", court: "P_g (W) ?", question: { type: "nombre", unite: "W", attendu: (f) => E(f) * pt(f, "p1:r22").I, tolerance_relative: 0.03, aide: "E en V, I en A (1 mA = 0,001 A).", bravo: "Exact." } },
      { consigne: "Puissance électrique fournie au circuit extérieur : P_e = U_PN·I.", court: "P_e (W) ?", question: { type: "nombre", unite: "W", attendu: (f) => pt(f, "p1:r22").U * pt(f, "p1:r22").I, tolerance_relative: 0.03, aide: "U_PN : voltmètre, circuit fermé.", bravo: "Exact : P_e < P_g." } },
      { consigne: "La pile perd P_j = P_g − P_e = r·I² par effet Joule. Déduisez sa résistance interne r = (E − U_PN)/I.", court: "r (Ω) ?", question: { type: "nombre", unite: "Ω", attendu: (f) => (E(f) - pt(f, "p1:r22").U) / pt(f, "p1:r22").I, tolerance_relative: 0.05, aide: "r = (E − U_PN) / I.", bravo: "Exact : r ≈ 1,5 Ω." } },
      { consigne: "Rendement de la pile : η = P_e/P_g = U_PN/E (nombre sans unité, par exemple 0,80).", court: "η ?", question: { type: "nombre", unite: "", attendu: (f) => pt(f, "p1:r22").U / E(f), tolerance: 0.01, aide: "η = U_PN / E.", bravo: "Exact." } },
      { consigne: "L'égalité E·I = U_PN·I + r·I² signifie…", court: "Répondez dans le carnet.", question: choix(["la puissance produite est égale à la puissance fournie au circuit plus la puissance perdue par effet Joule dans la pile", "la pile ne perd pas d'énergie", "la pile reçoit de l'énergie du circuit"], "Conservation de l'énergie.", "Exact.") },
    ],
  };

  const INFLUENCE = {
    id: "influence", paillasse: 0, titre: "Influence des résistances et de E",
    objectif: "Mesurer I pour plusieurs résistances, comparer à E/(R + r) ; associer deux piles en série.",
    entetes: ["R (Ω)", "I (A)", "E/(R + r) (A)", "P_g = E·I (W)"],
    donnees: ["Pile : E = 4,5 V ; r = 1,5 Ω", "R1 = 22 Ω ; R2 = 47 Ω ; R1 + R2 = 69 Ω"],
    conclusion: "Dans un circuit qui ne contient que des résistances (et un générateur de f.é.m. E constante), I = E/Req, où Req est la résistance totale (résistance interne comprise). L'énergie fournie pendant Δt, W = E·I·Δt = E²·Δt/Req, diminue quand Req augmente et augmente avec E. Deux générateurs en série : les f.é.m. et les résistances internes s'additionnent.",
    conclusion_courte: "I = E/Req ; W = E²·Δt/Req.",
    etapes: [
      { consigne: "Pile 1 seule : mesurez I avec R1, puis avec R2, puis avec R1 et R2 en série. En A : R (22, 47, 69) ; en B : I (A) ; en C : E/(R + r) ; en D : P_g = E·I.", court: "Tableur : A, B, C, D.", verifier: tableau },
      { consigne: "Comparez les colonnes B et C : dans ce circuit résistif…", court: "Répondez dans le carnet.", question: choix(["I = E/Req, avec Req = R + r (résistance totale du circuit)", "I ne dépend pas de R", "I = E × Req"], "Comparez B et C, ligne par ligne.", "Exact.") },
      { consigne: "Quand la résistance du circuit augmente, l'énergie fournie par la pile pendant une même durée…", court: "Répondez dans le carnet.", question: choix(["diminue : W = E·I·Δt = E²·Δt/Req", "augmente", "ne change pas"], "Regardez la colonne D.", "Exact.") },
      { consigne: "Associez les deux piles en série (borne P' de la pile 2 sur la borne N de la pile 1) ; mesurez I avec R2 = 47 Ω, voltmètre aux bornes de l'association.", court: "Deux piles en série, R2.", verifier: ({ faits }) => (pt(faits, "p1+p2:r47").U ?? null) !== null || (gen(faits).points["p1+p2:r47"] ? "Branchez aussi le voltmètre aux bornes de l'association des deux piles." : false) },
      { consigne: "Avec les deux piles en série, l'intensité est presque doublée, car…", court: "Répondez dans le carnet.", question: choix(["les f.é.m. s'additionnent : E = 9,0 V, et I = E/(R2 + r1 + r2)", "les résistances internes disparaissent", "chaque pile débite son propre courant dans R2"], "Comparez U aux bornes de l'association avec 2 × 4,5 V.", "Exact.") },
      { consigne: "La relation I = E/Req s'applique…", court: "Répondez dans le carnet.", question: choix(["seulement aux circuits qui ne contiennent que des résistances et un générateur de f.é.m. constante", "à tous les circuits, même avec un moteur", "seulement aux circuits sans générateur"], "Un moteur ou un électrolyseur a une f.c.é.m.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_elec2_a4_generateur", titre: "Laboratoire : énergie fournie par un générateur", decor: "aucun", paillasses: [L.poste_generateur], missions: [BILAN, INFLUENCE] });
})(window.Labo);

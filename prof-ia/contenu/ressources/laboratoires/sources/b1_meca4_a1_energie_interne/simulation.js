/*
Rôle : simulation du chapitre « Travail et énergie interne » (1re année du bac, SM) : effets du travail reçu par un
       système (tube à grenaille : échauffement du plomb ; tableau des effets du vécu), travail des forces pressantes sur un
       gaz (seringue chargée de masses : W = p·(V1 − V2)), énergie interne et premier principe ΔU = W + Q. Objectifs O1 à O4.
Reçoit : rien (les vérifications lisent les faits « tube », « tri_effets », « seringue » et la feuille de calcul).
Produit : la simulation démarrée : tube à grenaille ; tableau magnétique ; seringue à gaz.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const M = 0.5, G = 9.81, C = 129, H = 1, P0 = 101300, S = 4e-4;
  const tu = (f) => f.tube || { n: 0, mesures: {} }, se = (f) => (f.seringue || {}).essais || [];

  function tableau_tube({ faits, feuille }) {
    // Quatre relevés : n, T, énergie mécanique perdue n·m·g·h, m·c·(T − 20,0).
    const l = feuille.lignes(["A", "B", "C", "D"]), mes = tu(faits).mesures || {};
    if (l.length < 4) return false;
    for (const [k, r] of l.entries()) {
      if (mes[r.A] === undefined) return `Ligne ${k + 2} : n (colonne A) doit être un nombre de chutes que vous avez atteint (0 compris).`;
      if (Math.abs(r.B - mes[r.A]) > 0.25) return `Ligne ${k + 2} : T lue au thermomètre après ${r.A} chutes.`;
      if (Math.abs(r.C - r.A * M * G * H) > 0.01 * r.C + 0.01) return `Ligne ${k + 2} : énergie mécanique perdue = n × m × g × h.`;
      if (Math.abs(r.D - M * C * (r.B - 20)) > 0.01 * Math.abs(r.D) + 0.01) return `Ligne ${k + 2} : m·c·(T − 20,0) = 0,500 × 129 × (T − 20,0).`;
    }
    return Math.max(...l.map((r) => r.A)) >= 60 || "Allez jusqu'à 60 chutes au moins.";
  }

  const TUBE = {
    id: "tube", paillasse: 0, titre: "Le travail échauffe le plomb",
    objectif: "Retourner un tube contenant de la grenaille de plomb ; comparer l'énergie mécanique perdue à l'élévation de température.",
    entetes: ["n (chutes)", "T (°C)", "n·m·g·h (J)", "m·c·(T − T0) (J)"],
    donnees: ["m = 500 g ; h = 1,00 m ; g = 9,81 N/kg", "c(plomb) = 129 J·kg⁻¹·K⁻¹", "T0 = 20,0 °C"],
    conclusion: "À chaque chute, l'énergie mécanique de la grenaille (m·g·h) n'est pas conservée : au choc, elle est transférée à l'intérieur du plomb, dont la température s'élève. Cette énergie, stockée à l'échelle microscopique (agitation des particules et interactions entre elles), est l'énergie interne U du système. Ici ΔU = n·m·g·h ≈ m·c·ΔT.",
    conclusion_courte: "Énergie mécanique perdue → énergie interne : ΔU = m·c·ΔT.",
    etapes: [
      { consigne: "Lisez la température de la grenaille : T0 = 20,0 °C. Retournez le tube 20 fois (glissez-le autour de son axe, ou touchez-le pour un demi-tour).", court: "20 retournements.", aide_geste: "Un toucher sur le tube : un demi-tour.", verifier: ({ faits }) => tu(faits).n >= 20 },
      { consigne: "À chaque chute, la grenaille perd l'énergie mécanique m·g·h au choc. Quelle énergie a-t-elle perdue en 20 chutes ?", court: "Énergie perdue (J) ?", question: { type: "nombre", unite: "J", attendu: 20 * M * G * H, tolerance: 1, aide: "20 × m × g × h.", bravo: "Exact : environ 98 J." } },
      { consigne: "Continuez jusqu'à 40 puis 60 chutes ; lisez la température à 20, 40 et 60 chutes.", court: "Jusqu'à 60 chutes.", verifier: ({ faits }) => ["20", "40", "60"].every((n) => tu(faits).mesures?.[n] !== undefined) },
      { consigne: "Tableur, quatre lignes (0, 20, 40 et 60 chutes) : n en A, T en B, n·m·g·h en C, m·c·(T − 20,0) en D.", court: "Tableur : n, T, énergies.", verifier: tableau_tube },
      { consigne: "Les colonnes C et D sont presque égales. L'énergie mécanique perdue par la grenaille…", court: "Répondez dans le carnet.", question: choix(["est passée à l'intérieur du plomb : sa température s'est élevée", "a disparu", "est passée dans l'air de la salle uniquement"], "Comparez C et D.", "Exact.") },
      { consigne: "L'énergie interne U d'un système est…", court: "Répondez dans le carnet.", question: choix(["l'énergie de ses particules à l'échelle microscopique (agitation et interactions)", "son énergie cinétique de déplacement d'ensemble", "son énergie potentielle de pesanteur"], "Le tube est immobile au début et à la fin.", "Exact.") },
    ],
  };

  const EFFETS = {
    id: "effets", paillasse: 1, titre: "Les effets du travail",
    objectif: "Classer des situations du vécu selon l'effet du travail reçu par le système.",
    entetes: [],
    conclusion: "Le travail reçu par un système peut élever sa température, le déformer (déformation élastique), provoquer un changement d'état physique (fusion…) ou une transformation chimique. Dans tous les cas, l'énergie reçue est stockée sous forme d'énergie interne, ou d'énergie potentielle élastique.",
    conclusion_courte: "Effets du travail : température, déformation, changement d'état, transformation chimique.",
    etapes: [
      { consigne: "Classez les neuf situations selon l'effet du travail reçu.", court: "Classez les étiquettes.", verifier: ({ faits }) => L.tableau_tri.verifier(L.EFFETS_TRAVAIL, faits.tri_effets) },
      { consigne: "Quand on comprime un ressort, le travail reçu est stocké sous forme…", court: "Répondez dans le carnet.", question: choix(["d'énergie potentielle élastique", "d'énergie cinétique", "de chaleur seulement"], "Le ressort comprimé peut rendre ce travail.", "Exact.") },
    ],
  };

  function tableau_seringue({ faits, feuille }) {
    // Trois charges (1, 2, 3 kg) : m, p = p0 + m·g/S, V2 lu, W = p·(V1 − V2).
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 3) return false;
    for (const [k, r] of l.entries()) {
      const e = se(faits).find((x) => x.m === r.A && x.m > 0);
      if (!e) return `Ligne ${k + 2} : m (kg) d'une charge que vous avez posée (1, 2 ou 3 kg), gaz revenu à 20,0 °C.`;
      if (Math.abs(r.B - (P0 + (r.A * G) / S)) > 0.005 * r.B) return `Ligne ${k + 2} : p = p0 + m·g/S, en pascals (=101300+A${k + 2}*9,81/0,0004).`;
      if (Math.abs(r.C - e.V) > 0.4) return `Ligne ${k + 2} : V2 lu sur la seringue (au demi-millilitre), gaz revenu à 20,0 °C.`;
      if (Math.abs(r.D - r.B * (50 - r.C) * 1e-6) > 0.015 * r.D + 0.005) return `Ligne ${k + 2} : W = p × (V1 − V2), en m³ : =B${k + 2}*(50-C${k + 2})*0,000001.`;
    }
    return new Set(l.map((r) => r.A)).size >= 3 || "Trois charges différentes.";
  }
  const W2 = (f) => { const e = se(f).find((x) => x.m === 2) || { p: 0, V: 50 }; return e.p * (50 - e.V) * 1e-6; };

  const SERINGUE = {
    id: "seringue", paillasse: 2, titre: "Travail des forces pressantes",
    objectif: "Comprimer un gaz à pression extérieure constante ; calculer le travail reçu ; appliquer le premier principe.",
    entetes: ["m (kg)", "p (Pa)", "V2 (mL)", "W (J)"],
    donnees: ["S = 4,00 cm² ; p0 = 1013 hPa ; V1 = 50,0 mL", "p = p0 + m·g/S", "W = p·(V1 − V2) (1 mL = 10⁻⁶ m³)"],
    conclusion: "Un gaz comprimé sous une pression extérieure constante p reçoit le travail des forces pressantes W = −p·ΔV = p·(V1 − V2) : W > 0 quand le volume diminue. Premier principe de la thermodynamique : la variation de l'énergie interne d'un système est égale à la somme du travail et de la chaleur qu'il reçoit : ΔU = W + Q. Ici, le gaz revient à sa température initiale : ΔU = 0, donc Q = −W < 0 : il cède de la chaleur à l'extérieur.",
    conclusion_courte: "W = p·(V1 − V2) ; ΔU = W + Q.",
    etapes: [
      { consigne: "Posez une masse de 1 kg sur le plateau du piston. Observez le thermomètre et le volume ; attendez que le gaz revienne à 20,0 °C.", court: "1 kg sur le plateau.", aide_geste: "Glissez une masse jusqu'au plateau.", verifier: ({ faits }) => se(faits).some((e) => e.m === 1) },
      { consigne: "Juste après la compression, la température du gaz monte, puis redescend à 20,0 °C pendant que le volume diminue encore un peu. Le gaz a…", court: "Répondez dans le carnet.", question: choix(["reçu du travail, puis cédé de la chaleur à l'extérieur", "reçu de la chaleur de l'extérieur", "perdu du travail"], "Le gaz chaud se refroidit au contact de la seringue.", "Exact.") },
      { consigne: "Quelle est la pression du gaz avec 1 kg sur le plateau ?", court: "p (Pa) ?", question: { type: "nombre", unite: "Pa", attendu: P0 + G / S, tolerance: 400, aide: "p = p0 + m·g/S, avec S = 4,00×10⁻⁴ m².", bravo: "Exact : environ 1258 hPa, comme au manomètre." } },
      { consigne: "Recommencez avec 2 kg puis 3 kg sur le plateau (attendez chaque fois le retour à 20,0 °C).", court: "2 kg, puis 3 kg.", verifier: ({ faits }) => [2, 3].every((m) => se(faits).some((e) => e.m === m)) },
      { consigne: "Tableur, une ligne par charge : m en A, p en B, V2 en C, W = p·(V1 − V2) en D.", court: "Tableur : m, p, V2, W.", verifier: tableau_seringue },
      { consigne: "Le travail des forces pressantes reçu par le gaz est positif quand…", court: "Répondez dans le carnet.", question: choix(["son volume diminue (compression)", "son volume augmente (détente)", "sa pression diminue"], "W = −p·ΔV.", "Exact.") },
      { consigne: "Avec 2 kg, le gaz revient à sa température de départ : son énergie interne n'a pas changé (ΔU = 0). Quelle chaleur Q a-t-il échangée avec l'extérieur ?", court: "Q (J) ?", question: { type: "nombre", unite: "J", attendu: (f) => -W2(f), tolerance: 0.06, aide: "Premier principe : ΔU = W + Q = 0.", bravo: "Exact : Q < 0, le gaz a cédé de la chaleur." } },
      { consigne: "Le premier principe de la thermodynamique s'écrit…", court: "Répondez dans le carnet.", question: choix(["ΔU = W + Q", "ΔU = W − Q", "ΔEc = W + Q"], "W et Q sont comptés positivement quand le système les reçoit.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_meca4_a1_energie_interne", titre: "Laboratoire : travail et énergie interne", paillasses: [L.poste_tube, L.poste_tri_effets, L.poste_seringue], missions: [TUBE, EFFETS, SERINGUE] });
})(window.Labo);

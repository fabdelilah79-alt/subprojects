/*
Rôle : simulation de l'activité 1 du chapitre « Équilibre d'un solide » (tronc commun) : « Relation tension/allongement
       d'un ressort ». Objectif O1 (connaître T = K·Δl, la raideur et son unité) ; orientation : le ressort sert à étalonner
       un dynamomètre.
Reçoit : rien (les vérifications lisent les masses accrochées, le tableur et la courbe).
Produit : la simulation démarrée : deux paillasses, un ressort souple et un ressort plus raide.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const G = 9.81, R1 = { raideur: 25, l0_cm: 12 }, R2 = { raideur: 50, l0_cm: 10 };
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const longueur = (r, m) => r.l0_cm + ((m * G) / r.raideur) * 100;
  const mesurees = (faits, p) => faits[p + "poids_mesures"] || [];

  function tableau({ feuille, faits }) {
    // m (kg), T = m·g (N), l (cm) lue sur la règle, Δl = l − l0 (cm), pour au moins 4 masses accrochées.
    const lignes = feuille.lignes(["A", "B", "C", "D"]), faites = mesurees(faits, "r1_");
    for (const [k, l] of lignes.entries()) {
      if (!faites.some((m) => Math.abs(m - l.A) < 1e-6)) return `Ligne ${k + 2} : la masse ${L.nombre(l.A, 3)} kg n'a pas été accrochée au ressort.`;
      if (Math.abs(l.B - l.A * G) > 0.02) return `Ligne ${k + 2} : T = m·g, avec g = 9,81 N/kg (par exemple =A${k + 2}*9,81).`;
      if (Math.abs(l.C - longueur(R1, l.A)) > 0.2) return `Ligne ${k + 2} : relisez la longueur l sur la règle (pointe de l'index rouge), en cm.`;
      if (Math.abs(l.D - (l.C - R1.l0_cm)) > 0.05) return `Ligne ${k + 2} : Δl = l − l0 (l0 = ${R1.l0_cm} cm).`;
    }
    return lignes.length >= 4 || false;
  }

  const SOUPLE = {
    id: "souple", paillasse: 0, titre: "La tension d'un ressort",
    objectif: "Accrocher des masses au ressort et chercher la relation entre la tension T du ressort et son allongement Δl.",
    entetes: ["m (kg)", "T (N)", "l (cm)", "Δl (cm)"],
    conclusion: "La tension d'un ressort est proportionnelle à son allongement : T = K·Δl ; K est la raideur du ressort, en N/m.",
    conclusion_courte: "T = K·Δl (K en N/m).",
    etapes: [
      { consigne: "Lisez sur la règle la longueur l0 du ressort à vide (pointe de l'index rouge), en cm.", court: "Longueur à vide l0 (cm) ?", question: { type: "nombre", unite: "cm", attendu: R1.l0_cm, tolerance: 0.1, aide: "Zoomez sur la pointe de l'index.", bravo: "Exact." } },
      { consigne: "Accrochez des masses marquées sous le ressort (seules ou en chaîne) : au moins 4 valeurs différentes. Attendez que le ressort s'immobilise.", court: "Accrochez 4 masses différentes.", verifier: ({ faits }) => mesurees(faits, "r1_").length >= 4 || false, aide_geste: "Faites glisser une masse jusqu'au crochet ; seule la dernière se décroche." },
      { consigne: "Pour chaque masse : m (kg) en A, T = m·g (N) en B, la longueur l (cm) lue sur la règle en C, Δl = l − l0 (cm) en D.", court: "Tableur : m, T, l, Δl.", verifier: tableau, aide_geste: "Pour une masse, la tension du ressort est égale au poids : T = m·g." },
      { consigne: "Tracez T en fonction de Δl et modélisez.", court: "Tracez T en fonction de Δl.", verifier: ({ courbe }) => courbe.x === "D" && courbe.y === "B" && courbe.n >= 4 && courbe.modele !== "aucun" },
      { consigne: "La tension T et l'allongement Δl sont…", court: "Répondez dans le carnet.", question: choix(["proportionnels : T = K·Δl", "sans rapport", "inversement proportionnels"], "La courbe est une droite qui passe par l'origine.", "Exact.") },
      { consigne: "D'après le modèle, quelle est la raideur K du ressort (en N/m) ?", court: "Raideur K (N/m) ?", question: { type: "nombre", unite: "N/m", attendu: R1.raideur, tolerance_relative: 0.06, aide: "Le coefficient a est en N/cm : multipliez par 100 pour l'avoir en N/m.", bravo: "Exact." } },
    ],
  };

  const RAIDE = {
    id: "raide", paillasse: 1, titre: "Un ressort plus raide",
    objectif: "Avec un autre ressort, mesurer sa raideur à partir d'une seule mesure, puis comparer.",
    entetes: [],
    conclusion: "Plus un ressort est raide, plus sa raideur K est grande et moins il s'allonge sous la même tension. Un dynamomètre est un ressort étalonné.",
    conclusion_courte: "Ressort raide : K grand, Δl petit.",
    etapes: [
      { consigne: "Accrochez la masse de 200 g sous ce ressort et attendez qu'il s'immobilise.", court: "Accrochez 200 g.", verifier: ({ faits }) => mesurees(faits, "r2_").some((m) => Math.abs(m - 0.2) < 1e-6) || false },
      { consigne: `Lisez la longueur l du ressort (sa longueur à vide est l0 = ${R2.l0_cm} cm), en cm.`, court: "Longueur l (cm) ?", question: { type: "nombre", unite: "cm", attendu: longueur(R2, 0.2), tolerance: 0.15, aide: "Pointe de l'index rouge ; zoomez.", bravo: "Exact." } },
      { consigne: "Calculez sa raideur K = T / Δl (en N/m).", court: "Raideur K (N/m) ?", question: { type: "nombre", unite: "N/m", attendu: R2.raideur, tolerance_relative: 0.06, aide: "T = 0,2 × 9,81 N ; Δl en mètre.", bravo: "Exact." } },
      { consigne: "Le ressort le plus raide…", court: "Répondez dans le carnet.", question: choix(["a la plus grande raideur K : il s'allonge moins sous la même tension", "a la plus petite raideur K", "s'allonge le plus"], "Comparez les deux valeurs de K.", "Exact.") },
      { consigne: "Pour étalonner un dynamomètre, on…", court: "Répondez dans le carnet.", question: choix(["accroche des masses connues et on marque la position de l'index pour chaque poids P = m·g", "mesure la longueur du ressort à vide seulement", "chauffe le ressort"], "Le dynamomètre est un ressort gradué en newtons.", "Exact.") },
    ],
  };

  L.demarrer({
    id: "tc_meca5_a1_ressort", titre: "Laboratoire : la tension d'un ressort",
    paillasses: [
      (g) => L.poste_ressort(g, { ...R1, couleur: "#8b949c", prefixe: "r1_", etiquette: "Ressort 1" }),
      (g) => L.poste_ressort(g, { ...R2, couleur: "#b87333", prefixe: "r2_", etiquette: "Ressort 2" }),
    ],
    missions: [SOUPLE, RAIDE],
  });
})(window.Labo);

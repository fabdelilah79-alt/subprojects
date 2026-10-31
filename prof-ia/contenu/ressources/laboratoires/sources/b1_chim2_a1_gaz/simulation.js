/*
Rôle : simulation de l'activité 1 du chapitre « Grandeurs physiques liées aux quantités de matière » (1re année du bac) :
       vérifier PV = constante (seringue et pressiomètre, tableur et courbe), pression et température absolue (bain
       thermostaté), équation d'état PV = nRT, quantité de matière d'un gaz et volume molaire. Objectifs O1, O3.
Reçoit : rien (les vérifications lisent les faits « boyle », « temperature », la feuille du tableur et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const rel = (a, b, t = 0.01) => Math.abs(a - b) <= t * Math.abs(b) + 1e-9;

  function tableau_boyle({ faits, feuille }) {
    // Six mesures robinet fermé : V, P, P × V, 1/V.
    const l = feuille.lignes(["A", "B", "C", "D"]), m = (faits.boyle || {}).mesures || [];
    if (l.length < 6) return false;
    for (const [k, x] of l.entries()) {
      if (!m.some((p) => p.V === x.A && Math.abs(p.P - x.B) <= 3)) return `Ligne ${k + 2} : V (mL) et P (hPa) d'une mesure faite robinet fermé.`;
      if (!rel(x.C, x.A * x.B) || !rel(x.D, 1 / x.A)) return `Ligne ${k + 2} : C = A × B et D = 1/A (par exemple =A${k + 2}*B${k + 2} et =1/A${k + 2}).`;
    }
    return new Set(l.map((x) => x.A)).size >= 6 || "Six volumes différents.";
  }

  function tableau_temperature({ faits, feuille }) {
    // Cinq températures du bain stables : θ, P.
    const l = feuille.lignes(["A", "B"]), m = (faits.temperature || {}).mesures || [];
    if (l.length < 5) return false;
    for (const [k, x] of l.entries()) if (!m.some((p) => p.theta === x.A && Math.abs(p.P - x.B) <= 3)) return `Ligne ${k + 2} : θ (°C) et P (hPa) quand la pression ne change plus.`;
    return new Set(l.map((x) => x.A)).size >= 5 || "Cinq températures différentes.";
  }

  const BOYLE = {
    id: "boyle", paillasse: 0, titre: "Loi de Boyle-Mariotte",
    objectif: "Faire varier le volume d'une quantité d'air enfermée, à température constante, et mesurer sa pression.",
    entetes: ["V (mL)", "P (hPa)", "P × V", "1/V (mL⁻¹)"],
    donnees: ["Température de la salle : 20 °C (293 K)", "R = 8,314 Pa·m³·mol⁻¹·K⁻¹ ; 1 hPa = 100 Pa ; 1 mL = 10⁻⁶ m³"],
    conclusion: "À température constante, pour une même quantité de gaz, le produit P × V reste constant : c'est la loi de Boyle-Mariotte. La pression est proportionnelle à 1/V : quand on divise le volume par deux, la pression double.",
    conclusion_courte: "P × V = constante (T et n fixés).",
    etapes: [
      { consigne: "Robinet ouvert, amenez le piston à 40 mL, puis fermez le robinet.", court: "40 mL, robinet fermé.", aide_geste: "Faites glisser le poussoir ; touchez la manette du robinet.", verifier: ({ faits }) => !!faits.boyle && !faits.boyle.ouvert && Math.abs(faits.boyle.nRT - 1013 * 40) < 1 },
      { consigne: "Faites varier le volume entre 20 et 60 mL. Pour six volumes : en A, V ; en B, P ; en C, P × V ; en D, 1/V.", court: "Tableur : A, B, C, D.", verifier: tableau_boyle },
      { consigne: "Tracez P (colonne B) en fonction de 1/V (colonne D) et modélisez.", court: "Courbe P = f(1/V).", verifier: ({ courbe }) => (courbe.x === "D" && courbe.y === "B" && courbe.n >= 6 && courbe.modele !== "aucun") || "Abscisse : D (1/V) ; ordonnée : B (P) ; choisissez un modèle." },
      { consigne: "Que remarquez-vous ?", court: "Répondez dans le carnet.", question: choix(["P × V reste constant : P est proportionnelle à 1/V", "P est proportionnelle à V", "P ne dépend pas de V"], "Regardez la colonne C et la droite.", "Exact : loi de Boyle-Mariotte.") },
      { consigne: "Quantité de matière d'air enfermée (40 mL sous 1 013 hPa, à 293 K) : n = PV / RT, en mmol ?", court: "n (mmol) ?", question: nombre("mmol", 1.66, 0.05, "P = 101 300 Pa ; V = 40 × 10⁻⁶ m³.", "Exact : n ≈ 1,66 × 10⁻³ mol.") },
    ],
  };

  const TEMPERATURE = {
    id: "temperature", paillasse: 1, titre: "Pression et température",
    objectif: "Chauffer ou refroidir une quantité d'air à volume constant ; trouver la température absolue.",
    entetes: ["θ (°C)", "P (hPa)"],
    donnees: ["Ballon de 250 mL fermé à 20 °C sous 1 013 hPa"],
    conclusion: "À volume constant, la pression d'un gaz augmente linéairement avec la température. Prolongée, la droite coupe l'axe P = 0 vers −273 °C : c'est le zéro absolu. La température absolue T (en kelvins) vaut T = θ + 273,15 ; P est proportionnelle à T. Avec la loi de Boyle-Mariotte : PV = nRT (équation d'état du gaz parfait). Le volume molaire vaut Vm = RT/P, soit 24,1 L/mol à 20 °C sous 1 013 hPa.",
    conclusion_courte: "PV = nRT, T = θ + 273,15.",
    etapes: [
      { consigne: "Réglez la consigne à 0, 20, 40, 60 et 80 °C. À chaque fois, attendez que la pression ne change plus : en A, θ ; en B, P.", court: "Tableur : A, B.", aide_geste: "Touchez + ou − à côté du bouton de consigne.", verifier: tableau_temperature },
      { consigne: "Tracez P (B) en fonction de θ (A) et modélisez.", court: "Courbe P = f(θ).", verifier: ({ courbe }) => (courbe.x === "A" && courbe.y === "B" && courbe.n >= 5 && courbe.modele !== "aucun") || "Abscisse : A (θ) ; ordonnée : B (P) ; choisissez un modèle." },
      { consigne: "Pour quelle température la pression serait-elle nulle (prolongez la droite) ?", court: "θ (°C) ?", question: nombre("°C", -273, 6, "P = a θ + b : cherchez θ = −b / a.", "Exact : c'est le zéro absolu.") },
      { consigne: "La température absolue T (en kelvins) est…", court: "Répondez dans le carnet.", question: choix(["T = θ + 273,15 : la pression est proportionnelle à T", "T = θ − 273,15", "T = 273,15 × θ"], "Au zéro absolu, T = 0 K.", "Exact.") },
      { consigne: "Quantité d'air dans le ballon : n = PV / RT (en mmol) ?", court: "n (mmol) ?", question: nombre("mmol", 10.4, 0.3, "P = 101 300 Pa ; V = 250 × 10⁻⁶ m³ ; T = 293,15 K.", "Exact : n ≈ 1,04 × 10⁻² mol.") },
      { consigne: "Volume molaire d'un gaz à 20 °C sous 1 013 hPa : Vm = RT / P (en L/mol) ?", court: "Vm (L/mol) ?", question: nombre("L/mol", 24.1, 0.3, "Vm = 8,314 × 293,15 / 101 300 m³/mol.", "Exact : environ 24 L/mol.") },
    ],
  };

  L.demarrer({ id: "b1_chim2_a1_gaz", titre: "Laboratoire : le gaz parfait", paillasses: [L.poste_boyle, L.poste_temperature], missions: [BOYLE, TEMPERATURE] });
})(window.Labo);

/*
Rôle : simulation de l'activité 1 du chapitre « Dipôle RC » (2e année du bac) : charge d'un condensateur par un générateur
       de courant (u = f(t) au voltmètre et au chronomètre) ; convention récepteur, i = dq/dt, q = I·t, q = C·u, capacité
       et unité ; associations de deux condensateurs en parallèle et en série. Objectifs O1, O2, O3.
Reçoit : rien (les vérifications lisent les faits « montage_c », « releves », la feuille et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const R = (f, config) => (f.releves || []).filter((r) => r.config === config && r.I === 1e-4 && r.U < 19.99);
  const serie = (f, config, n, duree = 10) => { const r = R(f, config); return r.length >= n && Math.max(...r.map((x) => x.t)) - Math.min(...r.map((x) => x.t)) >= duree; };

  function tableau({ faits, feuille }) {
    // Au moins six relevés avec C₁ seul : t (s) en A, U (V) en B, q = I·t (mC) en C.
    const l = feuille.lignes(["A", "B", "C"]), r = R(faits, "C1");
    if (l.length < 6) return false;
    for (const [k, x] of l.entries()) {
      if (!r.some((m) => Math.abs(m.t - x.A) < 0.05 && Math.abs(m.U - x.B) < 0.006)) return `Ligne ${k + 2} : en A le temps t (s), en B la tension U (V) d'un de vos relevés avec C₁.`;
      if (Math.abs(x.C - 0.1 * x.A) > 1e-3) return `Ligne ${k + 2} : en C, q = I·t en millicoulombs (I = 0,10 mA) : =0,1*A${k + 2}.`;
    }
    return true;
  }

  const CHARGE = {
    id: "charge", paillasse: 0, titre: "Charge à courant constant",
    objectif: "Charger le condensateur C₁ avec un courant constant ; relever u(t) ; établir q = C·u.",
    entetes: ["t (s)", "U (V)", "q (mC)"],
    donnees: ["I = 0,10 mA ; q = I·t (charge de l'armature A, qui reçoit le courant)", "1 mA × 1 s = 1 mC ; 1 mC/V = 1 mF = 1 000 µF"],
    conclusion: "En convention récepteur, la flèche de la tension uAB est opposée au sens du courant i. Le courant arrive sur l'armature A, qui porte la charge qA = q ; l'autre porte −q. i = dq/dt : avec I constant, q = I·t. La tension augmente proportionnellement au temps, et q est proportionnelle à u : q = C·u. La capacité C (en farads, F) vaut ici 100 µF = 1,00 × 10⁻⁴ F.",
    conclusion_courte: "i = dq/dt ; q = C·u ; C₁ = 100 µF.",
    etapes: [
      { consigne: "En convention récepteur, pour un condensateur, la flèche de la tension uC et le sens positif du courant i…", court: "Répondez dans le carnet.", question: choix(["sont de sens opposés", "sont de même sens", "sont perpendiculaires"], "Comme pour une résistance.", "Exact.") },
      { consigne: "Câblez : générateur de courant (+) vers la borne 1 de C₁, borne 2 de C₁ vers (−) ; voltmètre (VΩ sur +, COM sur −), calibre 20 V.", court: "Câblez C₁ et le voltmètre.", verifier: ({ faits }) => ((faits.montage_c || {}).config === "C1" && faits.montage_c.voltmetre) || false },
      { consigne: "Déchargez C₁ ; « Zéro » ; I = 0,10 mA. Mettez en marche le générateur et le chronomètre ensemble, puis notez (t, U) au moins six fois en 20 s (sous 20 V, le calibre du voltmètre).", court: "Six relevés (t, U).", aide_geste: "Touche I/O du générateur, puis « Chrono » ; « Noter » à intervalles réguliers.", verifier: ({ faits }) => serie(faits, "C1", 6) || false },
      { consigne: "Tableur : en A : t (s) ; en B : U (V) ; en C : q = I·t (mC).", court: "Tableur : t, U, q.", verifier: tableau },
      { consigne: "Tracez q (C) en fonction de U (B) et modélisez par une droite.", court: "Courbe q = f(U).", aide_geste: "Si le chronomètre est parti un peu avant le générateur, choisissez y = a·x + b.", verifier: ({ courbe }) => (courbe.x === "B" && courbe.y === "C" && courbe.n >= 6 && courbe.modele !== "aucun") || "Abscisse : B (U) ; ordonnée : C (q) ; choisissez un modèle." },
      { consigne: "Le coefficient directeur est la capacité C (en mC/V = mF). Capacité de C₁ (µF) ?", court: "C₁ (µF) ?", question: nombre("µF", 100, 4, "1 mF = 1 000 µF.", "Exact : C₁ = 100 µF = 1,00 × 10⁻⁴ F.") },
      { consigne: "La relation entre la charge et la tension est…", court: "Répondez dans le carnet.", question: choix(["q = C·u, C (capacité) en farads", "q = u / C", "q = C + u"], "q est proportionnelle à u.", "Exact.") },
      { consigne: "Avec un courant constant, q augmente proportionnellement au temps parce que…", court: "Répondez dans le carnet.", question: choix(["i = dq/dt : si i = I est constant, q = I·t", "le condensateur est une résistance", "u est constante"], "Définition de l'intensité.", "Exact.") },
    ],
  };

  const ASSOCIATIONS = {
    id: "associations", paillasse: 0, titre: "Associations de condensateurs",
    objectif: "Mesurer la capacité équivalente de C₁ et C₂ en série, puis en parallèle.",
    entetes: [],
    donnees: ["C₁ = 100 µF ; C₂ = 47 µF ; I = 0,10 mA", "Capacité : C = I·Δt / ΔU"],
    conclusion: "En parallèle, les deux condensateurs ont la même tension et leurs charges s'ajoutent : C_éq = C₁ + C₂ = 147 µF. En série, ils portent la même charge et leurs tensions s'ajoutent : 1/C_éq = 1/C₁ + 1/C₂, C_éq ≈ 32 µF, plus petite que chacune.",
    conclusion_courte: "Parallèle : C₁ + C₂ ; série : 1/C = 1/C₁ + 1/C₂.",
    etapes: [
      { consigne: "Montez C₁ et C₂ en série (déchargés) et faites au moins quatre relevés en 6 s (la tension monte vite : restez sous 20 V).", court: "Série : quatre relevés.", verifier: ({ faits }) => serie(faits, "serie", 4, 4) || false },
      { consigne: "Capacité équivalente en série (µF) ?", court: "C série (µF) ?", question: nombre("µF", 32, 1.5, "C = I·Δt / ΔU.", "Exact : environ 32 µF.") },
      { consigne: "En série…", court: "Répondez dans le carnet.", question: choix(["1/C_éq = 1/C₁ + 1/C₂", "C_éq = C₁ + C₂", "C_éq = C₁ − C₂"], "1/100 + 1/47 = ?", "Exact : C_éq est plus petite que chacune.") },
      { consigne: "Montez C₁ et C₂ en parallèle (déchargés) et faites au moins quatre relevés en 20 s (I = 0,10 mA).", court: "Parallèle : quatre relevés.", verifier: ({ faits }) => serie(faits, "parallele", 4) || false },
      { consigne: "Capacité équivalente C = I·Δt / ΔU (µF) ?", court: "C parallèle (µF) ?", question: nombre("µF", 147, 5, "Prenez deux relevés éloignés.", "Exact : 147 µF.") },
      { consigne: "En parallèle…", court: "Répondez dans le carnet.", question: choix(["C_éq = C₁ + C₂", "1/C_éq = 1/C₁ + 1/C₂", "C_éq = C₁ × C₂"], "100 + 47 = ?", "Exact.") },
      { consigne: "Deux condensateurs de 220 µF en série : capacité équivalente (µF) ?", court: "220 µF en série ?", question: nombre("µF", 110, 1, "1/C = 2/220.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_elec1_a1_courant", titre: "Laboratoire : condensateur et courant constant", decor: "aucun", paillasses: [L.poste_courant], missions: [CHARGE, ASSOCIATIONS] });
})(window.Labo);

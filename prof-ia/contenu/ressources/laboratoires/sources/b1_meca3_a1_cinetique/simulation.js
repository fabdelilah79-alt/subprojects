/*
Rôle : simulation de l'activité 1 du chapitre « Le travail, mode de transfert d'énergie » (1re année du bac) : approche
       de l'énergie cinétique en translation (mobile lancé sur un banc à coussin d'air, arrêté par un curseur à
       frottement : d ∝ m·v²) et en rotation (volant d'inertie freiné par un couple constant : n ∝ J·ω²). Objectif O1.
Reçoit : rien (les vérifications lisent les faits « banc » et « volant », la feuille de calcul et le graphique).
Produit : la simulation démarrée : banc à coussin d'air ; volant d'inertie.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const eb = (f) => (f.banc || {}).essais || [], ev = (f) => (f.volant || {}).essais || [];
  const proche = (a, b, t) => Math.abs(a - b) <= t;

  function tableau_banc({ faits, feuille }) {
    // Quatre lancers au moins : m, v = 0,050/Δt, d, m·v².
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 4) return false;
    for (const [k, r] of l.entries()) {
      const e = eb(faits).find((x) => proche(x.m, r.A, 0.001) && proche(0.05 / x.dt, r.B, 0.01 * r.B) && proche(x.d, r.C, 0.002));
      if (!e) return `Ligne ${k + 2} : m (kg), v = 0,050 / Δt et d (m) d'un de vos lancers (d lue sur la règle du curseur, au mm).`;
      if (!proche(r.D, r.A * r.B * r.B, 0.02 * r.D)) return `Ligne ${k + 2} : m·v², par exemple =A${k + 2}*B${k + 2}^2.`;
    }
    return new Set(l.map((r) => r.A)).size >= 2 || "Il faut des lancers avec au moins deux masses différentes.";
  }

  const BANC = {
    id: "banc", paillasse: 0, titre: "Énergie cinétique en translation",
    objectif: "Lancer un mobile à différentes vitesses, avec différentes masses, et comparer la distance dont il pousse un curseur à frottement.",
    entetes: ["m (kg)", "v (m/s)", "d (m)", "m·v²"],
    donnees: ["Mobile : 200 g ; surcharges de 100 g", "Drapeau : ℓ = 5,0 cm ; v = ℓ / Δt", "Curseur : force de frottement constante"],
    conclusion: "Un solide en mouvement possède une énergie, l'énergie cinétique : elle permet de fournir un travail (ici celui, résistant, du frottement qui arrête le curseur). Pour un solide en translation à la vitesse v, Ec = ½·m·v², en joules (J), avec m en kg et v en m/s.",
    conclusion_courte: "Ec = ½·m·v² (translation).",
    etapes: [
      { consigne: "Reculez le mobile de 2 cm environ contre le ressort du lanceur, puis lâchez-le. Lisez Δt au chronomètre et la distance d dont il pousse le curseur.", court: "Premier lancer.", aide_geste: "Glissez le mobile vers la gauche, puis lâchez.", verifier: ({ faits }) => eb(faits).length >= 1 },
      { consigne: "Le frottement du curseur arrête le mobile. Plus la distance d est grande…", court: "Répondez dans le carnet.", question: choix(["plus le mobile avait d'énergie au départ", "plus le mobile était léger", "moins le mobile allait vite"], "Le travail résistant du frottement est −f·d.", "Exact.") },
      { consigne: "Faites au moins quatre lancers en changeant la compression : deux avec le mobile seul, deux avec une ou deux surcharges.", court: "Quatre lancers, deux masses.", aide_geste: "Posez une surcharge sur le mobile arrêté.", verifier: ({ faits }) => eb(faits).length >= 4 && new Set(eb(faits).map((e) => e.m)).size >= 2 },
      { consigne: "Tableur, une ligne par lancer : m en A, v = 0,050/Δt en B, d en C, m·v² en D.", court: "Tableur : m, v, d, m·v².", verifier: tableau_banc },
      { consigne: "Tracez d (colonne C) en fonction de m·v² (colonne D).", court: "Graphique d = f(m·v²).", verifier: ({ courbe: c }) => (c.x === "D" && c.y === "C" && c.n >= 4) || false },
      { consigne: "Le graphique est une droite qui passe par l'origine : l'énergie du mobile est proportionnelle à…", court: "Répondez dans le carnet.", question: choix(["m·v²", "m·v", "v, quelle que soit la masse"], "Tous les points sont alignés, quelles que soient les masses.", "Exact : Ec = ½·m·v².") },
      { consigne: "Calculez l'énergie cinétique Ec = ½·m·v² du mobile, pour votre premier lancer.", court: "Ec (J) ?", question: { type: "nombre", unite: "J", attendu: (f) => { const e = eb(f)[0] || { m: 0, dt: 1 }; return 0.5 * e.m * (0.05 / e.dt) ** 2; }, tolerance_relative: 0.03, aide: "v = 0,050 / Δt.", bravo: "Exact." } },
      { consigne: "Le travail du frottement f·d a absorbé toute cette énergie. Quelle est la force de frottement f du curseur ?", court: "f (N) ?", question: { type: "nombre", unite: "N", attendu: 0.25, tolerance: 0.02, aide: "f = Ec / d.", bravo: "Exact." } },
    ],
  };

  function tableau_volant({ faits, feuille }) {
    // Quatre essais au moins : J, ω = 2πN/60, n, J·ω².
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 4) return false;
    for (const [k, r] of l.entries()) {
      const e = ev(faits).find((x) => proche(x.J, r.A, 0.02 * x.J) && proche(x.N, (r.B * 60) / (2 * Math.PI), 1.2) && proche(x.n, r.C, 0.11));
      if (!e) return `Ligne ${k + 2} : J du disque, ω = 2π·N/60 (N lu avant de freiner) et n d'un de vos essais.`;
      if (!proche(r.D, r.A * r.B * r.B, 0.02 * r.D)) return `Ligne ${k + 2} : J·ω², par exemple =A${k + 2}*B${k + 2}^2.`;
    }
    return new Set(l.map((r) => r.A)).size >= 2 || "Il faut des essais avec les deux disques.";
  }

  const VOLANT = {
    id: "volant", paillasse: 1, titre: "Énergie cinétique en rotation",
    objectif: "Freiner un volant d'inertie lancé à différentes vitesses (deux disques) ; comparer le nombre de tours jusqu'à l'arrêt.",
    entetes: ["J (kg·m²)", "ω (rad/s)", "n (tours)", "J·ω²"],
    donnees: ["J_A = 5,0×10⁻³ kg·m² ; J_B = 9,8×10⁻³ kg·m²", "ω = 2π·N / 60 (N en tr/min)"],
    conclusion: "Un solide en rotation autour d'un axe fixe possède une énergie cinétique Ec = ½·J·ω², où ω est sa vitesse angulaire (rad/s) et J son moment d'inertie par rapport à l'axe (kg·m²). J dépend de la masse du solide et de sa répartition autour de l'axe : pour un disque homogène de masse m et de rayon R, J = ½·m·R².",
    conclusion_courte: "Ec = ½·J·ω² (rotation).",
    etapes: [
      { consigne: "Réglez la consigne sur 150 tr/min et appuyez sur Lancer. Quand la vitesse est stable, lisez N, puis appuyez sur Freiner. Lisez le nombre de tours n jusqu'à l'arrêt.", court: "Lancer, puis freiner.", verifier: ({ faits }) => ev(faits).length >= 1 },
      { consigne: "Faites quatre essais : deux vitesses différentes avec le disque A, puis deux avec le disque B (posez-le sur l'axe, disque arrêté).", court: "Deux disques, deux vitesses.", aide_geste: "Glissez le disque posé sur la paillasse jusqu'à l'axe.", verifier: ({ faits }) => ["A", "B"].every((d) => { const N = ev(faits).filter((e) => e.disque === d).map((e) => e.N); return N.length >= 2 && Math.max(...N) - Math.min(...N) >= 20; }) },
      { consigne: "Tableur, une ligne par essai : J en A, ω = 2π·N/60 en B, n en C, J·ω² en D.", court: "Tableur : J, ω, n, J·ω².", verifier: tableau_volant },
      { consigne: "Tracez n (colonne C) en fonction de J·ω² (colonne D).", court: "Graphique n = f(J·ω²).", verifier: ({ courbe: c }) => (c.x === "D" && c.y === "C" && c.n >= 4) || false },
      { consigne: "n est proportionnel à J·ω² pour les deux disques. L'énergie cinétique d'un solide en rotation est…", court: "Répondez dans le carnet.", question: choix(["Ec = ½·J·ω²", "Ec = ½·J·ω", "Ec = J²·ω"], "Comparez avec Ec = ½·m·v² en translation.", "Exact.") },
      { consigne: "Le moment d'inertie J d'un solide dépend…", court: "Répondez dans le carnet.", question: choix(["de sa masse et de la répartition de cette masse autour de l'axe", "seulement de sa masse", "de sa vitesse de rotation"], "Les deux disques ont la même masse.", "Exact : J = ½·m·R² pour un disque.") },
      { consigne: "Quelle est l'énergie cinétique du disque A quand il tourne à 200 tr/min ?", court: "Ec (J) ?", question: { type: "nombre", unite: "J", attendu: 0.5 * 0.005 * ((2 * Math.PI * 200) / 60) ** 2, tolerance: 0.03, aide: "ω = 2π × 200 / 60 rad/s.", bravo: "Exact." } },
    ],
  };

  L.demarrer({ id: "b1_meca3_a1_cinetique", titre: "Laboratoire : énergie cinétique", paillasses: [L.poste_banc, L.poste_volant], missions: [BANC, VOLANT] });
})(window.Labo);

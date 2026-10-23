/*
Rôle : simulation de l'activité 3 du chapitre « Rotation d'un solide autour d'un axe fixe » (1re année du bac) :
       caractéristiques de la rotation uniforme d'un disque entraîné par un moteur : fréquence au stroboscope, période et
       vitesse au capteur à fourche, ω = 2πf, v = R·ω, équations horaires. Objectifs O3 à O6 (travaux pratiques du programme).
Reçoit : rien (les vérifications lisent les faits « strobo » et « fourche » et la feuille de calcul).
Produit : la simulation démarrée : stroboscope ; capteur à fourche.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const st = (f) => f.strobo || {}, fo = (f) => f.fourche || {}, w = (f) => 2 * Math.PI * (fo(f).f || 0);

  const STROBO = {
    id: "strobo", paillasse: 0, titre: "Fréquence de rotation au stroboscope",
    objectif: "Mesurer la fréquence de rotation d'un disque entraîné par un moteur, avec un stroboscope.",
    entetes: [],
    conclusion: "La rotation du disque est uniforme : il fait toujours le même nombre de tours par seconde. Sa fréquence f (en Hz, ou tr/s) est le nombre de tours par seconde ; sa période T = 1/f est la durée d'un tour ; sa vitesse angulaire est ω = 2π/T = 2πf (en rad/s). Au stroboscope, le disque paraît immobile quand la fréquence des éclairs est égale à f (ou à f/2, f/3…) : la plus grande de ces fréquences donne f.",
    conclusion_courte: "T = 1/f ; ω = 2πf.",
    etapes: [
      { consigne: "Réglez l'alimentation du moteur sur 6,0 V : le disque tourne ; en lumière ordinaire, son repère est flou.", court: "Moteur sur 6,0 V.", verifier: ({ faits }) => Math.abs((st(faits).U ?? 0) - 6) < 0.05 && st(faits).f > 4 },
      { consigne: "Allumez le stroboscope (bouton I/O) : la salle est maintenant dans le noir.", court: "Allumez le stroboscope.", verifier: ({ faits }) => !!st(faits).allume },
      { consigne: "Diminuez la fréquence des éclairs à partir de 50 Hz : arrêtez-vous à la première valeur où l'on voit un seul trait immobile.", court: "Un seul trait immobile.", aide_geste: "Tournez le bouton vers le bas ; finissez avec les touches + et −.", verifier: ({ faits }) => { const s = st(faits); return !!(s.allume && s.images === 1 && Math.abs(s.fe - s.f) < 0.02 * s.f); } },
      { consigne: "Quelle est la fréquence de rotation f du disque ?", court: "f (Hz) ?", question: { type: "nombre", unite: "Hz", attendu: (f) => st(f).f, tolerance_relative: 0.03, aide: "C'est la fréquence des éclairs qui immobilise un seul trait.", bravo: "Exact." } },
      { consigne: "Réglez fe = 2f. On voit…", court: "Répondez dans le carnet.", question: choix(["deux traits immobiles, opposés", "un seul trait immobile", "le disque tourner normalement"], "Entre deux éclairs, le disque fait un demi-tour.", "Exact.") },
      { consigne: "Avec fe un peu plus petite que f, le trait semble tourner lentement…", court: "Répondez dans le carnet.", question: choix(["dans le sens de la rotation", "en sens inverse", "il reste immobile"], "Entre deux éclairs, le disque fait un peu plus d'un tour.", "Exact.") },
      { consigne: "Quelle est la période T de la rotation ?", court: "T (s) ?", question: { type: "nombre", unite: "s", attendu: (f) => 1 / st(f).f, tolerance_relative: 0.03, aide: "T = 1 / f.", bravo: "Exact : durée d'un tour." } },
      { consigne: "Quelle est la vitesse angulaire ω du disque ?", court: "ω (rad/s) ?", question: { type: "nombre", unite: "rad/s", attendu: (f) => 2 * Math.PI * st(f).f, tolerance_relative: 0.03, aide: "Un tour = 2π rad : ω = 2π f.", bravo: "Exact." } },
    ],
  };

  function vitesses({ faits, feuille }) {
    // Tableur : R (m) en A, Δt (s) en B, v = 0,005 / Δt en C, R·ω en D, pour les trois fentes.
    const l = feuille.lignes(["A", "B", "C", "D"]), om = w(faits);
    if (l.length < 3 || !om) return false;
    const R = l.slice(0, 3).map((r) => Math.round(r.A * 100));
    if (new Set(R).size < 3 || !R.every((r) => [4, 6, 8].includes(r))) return "Colonne A : les trois rayons 0,04 ; 0,06 et 0,08 m.";
    for (const [k, r] of l.slice(0, 3).entries()) {
      if (Math.abs(r.B - 0.005 / (r.A * om)) > 0.01 * r.B) return `Ligne ${k + 2} : Δt lue au compteur pour la fente à ${R[k]} cm (mode Passage, même tension).`;
      if (Math.abs(r.C - 0.005 / r.B) > 0.01 * r.C) return `Ligne ${k + 2} : v = 0,005 / Δt.`;
      if (Math.abs(r.D - r.A * om) > 0.02 * r.D) return `Ligne ${k + 2} : R × ω, avec ω = 2π / T.`;
    }
    return true;
  }

  const FOURCHE = {
    id: "fourche", paillasse: 1, titre: "Vitesse d'un point : v = R·ω",
    objectif: "Mesurer la période et les vitesses de trois points du disque avec un capteur à fourche ; vérifier v = R·ω.",
    entetes: ["R (m)", "Δt (s)", "v (m/s)", "R·ω (m/s)"],
    donnees: ["Largeur d'une fente : d = 5,0 mm", "v = d / Δt"],
    conclusion: "En rotation uniforme, tous les points du disque ont la même vitesse angulaire ω, et la vitesse d'un point est v = R·ω : elle est proportionnelle à sa distance R à l'axe. Les équations horaires sont θ(t) = ω·t + θ₀ et s(t) = R·ω·t + s₀.",
    conclusion_courte: "v = R·ω ; θ = ω·t + θ₀.",
    etapes: [
      { consigne: "Réglez l'alimentation sur 9,0 V, placez la fourche en face de la fente à 8 cm, et lisez la période T au compteur (mode Période).", court: "T à 9,0 V.", aide_geste: "Glissez la fourche le long de sa règle.", verifier: ({ faits }) => { const s = fo(faits); return Math.abs((s.U ?? 0) - 9) < 0.05 && s.r === 80 && s.mode === "periode" && !!s.T; } },
      { consigne: "Quelle est la fréquence de rotation f ?", court: "f (Hz) ?", question: { type: "nombre", unite: "Hz", attendu: (f) => fo(f).f, tolerance_relative: 0.01, aide: "f = 1 / T.", bravo: "Exact." } },
      { consigne: "Quelle est la vitesse angulaire ω ?", court: "ω (rad/s) ?", question: { type: "nombre", unite: "rad/s", attendu: w, tolerance_relative: 0.01, aide: "ω = 2π / T.", bravo: "Exact." } },
      { consigne: "Mode Passage : placez la fourche successivement à 4, 6 et 8 cm et lisez Δt. Tableur : R (m) en A, Δt en B, v = 0,005 / Δt en C, R × ω en D.", court: "Tableur : R, Δt, v, R·ω.", verifier: vitesses },
      { consigne: "Tracez v (colonne C) en fonction de R (colonne A).", court: "Graphique v = f(R).", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "C" && c.n >= 3) || false },
      { consigne: "Le graphique est une droite qui passe par l'origine, de coefficient directeur…", court: "Répondez dans le carnet.", question: choix(["ω : la relation v = R·ω est vérifiée", "T", "f"], "Comparez les colonnes C et D.", "Exact.") },
      { consigne: "Équation horaire avec θ₀ = 0 : θ(t) = ω·t. Combien de tours le disque fait-il en 10 s ?", court: "Tours en 10 s ?", question: { type: "nombre", unite: "tours", attendu: (f) => 10 * fo(f).f, tolerance_relative: 0.02, aide: "θ = ω·t, et un tour vaut 2π rad (ou : n = f × t).", bravo: "Exact." } },
      { consigne: "Quelle distance (abscisse curviligne s) parcourt la fente à 8 cm pendant 0,50 s ?", court: "s (m) ?", question: { type: "nombre", unite: "m", attendu: (f) => 0.08 * w(f) * 0.5, tolerance_relative: 0.02, aide: "s = R·θ = R·ω·t.", bravo: "Exact." } },
    ],
  };

  L.demarrer({ id: "b1_meca1_a3_uniforme", titre: "Laboratoire : rotation uniforme", paillasses: [L.poste_stroboscope, L.poste_fourche], missions: [STROBO, FOURCHE] });
})(window.Labo);

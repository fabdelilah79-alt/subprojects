/*
Rôle : simulation de l'activité 2 du chapitre « Ondes mécaniques progressives périodiques » (2e année du bac) : diffraction
       d'une onde plane à la surface de l'eau par une fente ou un obstacle (cuve à ondes) ; dispersion (célérité qui
       dépend de la fréquence) ; diffraction des ultrasons par une fente ; documents et classement. Objectifs O3, O4, O5.
Reçoit : rien (les vérifications lisent les faits « cuve », « ultrasons », « docs_diffraction », « tri_diffraction » et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const C = (f) => f.cuve || {}, U = (f) => f.ultrasons || {};
  const LAMBDA = { 10: 22.2, 15: 15.2, 20: 11.9, 25: 9.9, 30: 8.6 };

  function intervalles(c) {
    // Les curseurs encadrent n longueurs d'onde (n ≥ 3), à 1,5 mm près.
    const n = Math.round(c.ecart / c.lambda);
    return n >= 3 && Math.abs(c.ecart - n * c.lambda) < 1.5;
  }

  function tableau({ feuille }) {
    // Au moins quatre fréquences (A, Hz), λ mesurée (B, mm) et v = λ·f (C, m/s).
    const l = feuille.lignes(["A", "B", "C"]);
    if (l.length < 4) return false;
    for (const [k, x] of l.entries()) {
      if (!(x.A in LAMBDA) || Math.abs(x.B - LAMBDA[x.A]) > 0.6) return `Ligne ${k + 2} : en A une fréquence du vibreur (10, 15, 20, 25 ou 30 Hz), en B la longueur d'onde mesurée (mm).`;
      if (Math.abs(x.C - (x.A * x.B) / 1000) > 0.01) return `Ligne ${k + 2} : en C, v = λ·f en m/s (=A${k + 2}*B${k + 2}/1000).`;
    }
    return new Set(l.map((x) => x.A)).size >= 4 || "Quatre fréquences différentes.";
  }

  const DIFFRACTION = {
    id: "diffraction", paillasse: 0, titre: "Diffraction à la surface de l'eau",
    objectif: "Envoyer une onde plane sur une fente ou un obstacle de largeur a ; comparer a à la longueur d'onde λ.",
    entetes: [],
    donnees: ["f = 20 Hz : λ ≈ 12 mm", "Le stroboscope est réglé sur la fréquence du vibreur : l'image est immobile"],
    conclusion: "Quand la fente est large devant λ (a = 60 mm), l'onde reste plane derrière la fente, limitée à un faisceau à peine élargi. Quand a est du même ordre que λ ou plus petite (a = 10 mm), l'onde qui sort de la fente est circulaire, centrée sur la fente : c'est la diffraction. Elle est d'autant plus marquée que a est petite devant λ. Un obstacle de petite taille est contourné de la même manière. La fréquence et la longueur d'onde ne changent pas après la fente.",
    conclusion_courte: "Diffraction marquée quand a ≈ λ ou a < λ.",
    etapes: [
      { consigne: "Observez l'image avec une fente de largeur a = 60 mm (environ 5 λ) : derrière la fente, l'onde…", court: "Répondez dans le carnet.", question: choix(["reste presque plane, dans un faisceau un peu élargi sur les bords", "devient circulaire et remplit toute la cuve", "disparaît"], "Regardez les rides sous la barrière.", "Exact.") },
      { consigne: "Réduisez la largeur de la fente à 10 mm (touche −).", court: "Fente de 10 mm.", aide_geste: "Touchez − sous « a = … mm ».", verifier: ({ faits }) => (C(faits).obstacle === "fente" && C(faits).a <= 10) || false },
      { consigne: "Avec a = 10 mm (proche de λ), l'onde qui sort de la fente…", court: "Répondez dans le carnet.", question: choix(["est circulaire, centrée sur la fente : c'est la diffraction", "reste plane", "est réfléchie vers le vibreur"], "Comparez à l'image précédente.", "Exact.") },
      { consigne: "Choisissez « barrière : obstacle » (un obstacle de 10 mm) et observez derrière lui.", court: "Obstacle de 10 mm.", verifier: ({ faits }) => (C(faits).obstacle === "obstacle" && C(faits).a <= 10) || false },
      { consigne: "Derrière un petit obstacle, l'onde…", court: "Répondez dans le carnet.", question: choix(["le contourne : on retrouve des rides juste derrière lui", "laisse une ombre parfaite derrière lui", "s'arrête"], "Regardez juste sous l'obstacle.", "Exact.") },
      { consigne: "Après la fente, la longueur d'onde…", court: "Répondez dans le carnet.", question: choix(["est la même qu'avant : la fréquence et le milieu n'ont pas changé", "est plus petite", "est plus grande"], "Comparez l'écart entre les rides avant et après la barrière.", "Exact.") },
    ],
  };

  const DISPERSION = {
    id: "dispersion", paillasse: 0, titre: "La célérité dépend-elle de la fréquence ?",
    objectif: "Mesurer λ pour plusieurs fréquences du vibreur (sans barrière) ; calculer v = λ·f.",
    entetes: ["f (Hz)", "λ (mm)", "v (m/s)"],
    conclusion: "La longueur d'onde diminue quand la fréquence augmente, mais le produit λ·f n'est pas constant : la célérité des ondes à la surface de l'eau passe d'environ 0,22 m/s à 10 Hz à 0,26 m/s à 30 Hz. Un milieu où la célérité d'une onde périodique dépend de sa fréquence est un milieu dispersif. L'air, pour le son, n'est pas dispersif.",
    conclusion_courte: "Surface de l'eau : milieu dispersif.",
    etapes: [
      { consigne: "Choisissez « barrière : aucun » et f = 10 Hz. Placez les curseurs sur deux crêtes éloignées (au moins trois intervalles).", court: "λ à 10 Hz.", aide_geste: "Glissez chaque curseur rouge (triangle à droite de l'image) sur une ligne claire.", verifier: ({ faits }) => (C(faits).obstacle === "aucun" && C(faits).f === 10 && intervalles(C(faits))) || false },
      { consigne: "Longueur d'onde à 10 Hz (mm) ?", court: "λ (mm) ?", question: nombre("mm", 22.2, 0.8, "Divisez l'écart des curseurs par le nombre d'intervalles.", "Exact.") },
      { consigne: "Tableur : mesurez λ pour quatre fréquences. En A : f (Hz) ; en B : λ (mm) ; en C : v = λ·f (m/s).", court: "Tableur : f, λ, v.", verifier: tableau },
      { consigne: "D'après la colonne C, la surface de l'eau est un milieu…", court: "Répondez dans le carnet.", question: choix(["dispersif : la célérité dépend de la fréquence", "non dispersif : la célérité est la même pour toutes les fréquences", "où λ ne dépend pas de f"], "Comparez les valeurs de v.", "Exact.") },
    ],
  };

  const ULTRASONS = {
    id: "ultrasons", paillasse: 1, titre: "Diffraction des ultrasons",
    objectif: "Mesurer l'amplitude reçue derrière une fente en fonction de l'angle θ, pour deux largeurs de fente.",
    entetes: [],
    donnees: ["Fréquence : 40 kHz ; célérité du son : 340 m/s"],
    conclusion: "Avec a = 40 mm (environ 5 λ), le faisceau d'ultrasons reste étroit : l'amplitude s'annule vers 12°. Avec a = 10 mm (proche de λ = 8,5 mm), elle est encore grande à 30° : le faisceau s'élargit fortement derrière la fente, c'est la diffraction. Les ultrasons sont des ondes mécaniques comme les rides de l'eau : elles sont diffractées dans les mêmes conditions.",
    conclusion_courte: "Fente étroite (a ≈ λ) : faisceau très élargi.",
    etapes: [
      { consigne: "Mettez l'émetteur en marche ; fente a = 40 mm ; récepteur sur l'axe (θ = 0°). Lisez U.", court: "U à 0° (a = 40 mm).", aide_geste: "Touchez I/O ; glissez le récepteur le long du rapporteur.", verifier: ({ faits }) => (U(faits).marche && U(faits).a === 40 && U(faits).theta === 0) || false },
      { consigne: "Tournez le récepteur jusqu'à l'angle où le signal devient presque nul (premier minimum).", court: "Premier minimum (a = 40 mm).", verifier: ({ faits }) => { const u = U(faits); return (u.a === 40 && Math.abs(u.theta) >= 11 && Math.abs(u.theta) <= 14 && u.U < 0.2) || false; } },
      { consigne: "Passez à une fente de 10 mm (touche « Largeur a ») et placez le récepteur à θ = 30°. Lisez U.", court: "U à 30° (a = 10 mm).", verifier: ({ faits }) => (U(faits).marche && U(faits).a === 10 && Math.abs(U(faits).theta) === 30) || false },
      { consigne: "Avec la fente de 10 mm, le faisceau…", court: "Répondez dans le carnet.", question: choix(["s'élargit beaucoup : la diffraction est marquée car a est proche de λ", "reste aussi étroit", "disparaît"], "Comparez U à 30° pour les deux fentes.", "Exact.") },
      { consigne: "Longueur d'onde des ultrasons λ = v / f (mm) ?", court: "λ (mm) ?", question: nombre("mm", 8.5, 0.2, "v = 340 m/s ; f = 40 000 Hz.", "Exact : 8,5 mm.") },
    ],
  };

  const DOCUMENTS = {
    id: "documents", paillasse: 2, titre: "Reconnaître la diffraction",
    objectif: "Lire les documents ; classer des situations selon que la diffraction est marquée ou non.",
    entetes: [],
    conclusion: "La diffraction est marquée quand la largeur de l'ouverture ou de l'obstacle est du même ordre que la longueur d'onde, ou plus petite : la houle dans un port, la voix par une porte, les ultrasons par une fente de 1 cm. Elle est peu marquée quand l'ouverture est très grande devant λ : la lumière par une porte ou un tunnel se propage en ligne droite.",
    conclusion_courte: "Comparer l'ouverture à λ.",
    etapes: [
      { consigne: "Lisez les quatre documents au mur.", court: "Lisez les documents.", verifier: ({ faits }) => (faits.docs_diffraction || []).length >= 4 },
      { consigne: "Rangez chaque situation dans sa colonne.", court: "Tableau : rangez les situations.", verifier: ({ faits }) => L.tableau_tri.verifier(L.TRI_DIFFRACTION, faits.tri_diffraction) },
      { consigne: "On entend une personne derrière une porte entrouverte, sans la voir, parce que…", court: "Répondez dans le carnet.", question: choix(["la longueur d'onde du son est du même ordre que l'ouverture : il est diffracté ; celle de la lumière est beaucoup plus petite", "le son traverse les murs", "la lumière est plus lente que le son"], "Comparez les longueurs d'onde à 90 cm.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_ondes2_a2_diffraction", titre: "Laboratoire : diffraction et dispersion", paillasses: [L.poste_cuve_ondes, L.poste_ultrasons, L.poste_documents_diffraction], missions: [DIFFRACTION, DISPERSION, ULTRASONS, DOCUMENTS] });
})(window.Labo);

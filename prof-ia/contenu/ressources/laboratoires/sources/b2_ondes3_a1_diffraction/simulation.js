/*
Rôle : simulation de l'activité 1 du chapitre « Propagation d'une onde lumineuse » (2e année du bac) : diffraction de la
       lumière d'un laser par des fentes et des fils (banc_diffraction.js) ; vérification de θ = λ / a (tableur, courbe
       θ = f(1/a)), fréquence ν = c / λ ; laser vert, lumière blanche, épaisseur d'un cheveu. Objectifs O1, O2, O3.
Reçoit : rien (les vérifications lisent le fait « diffraction », la feuille et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const F = (f) => f.diffraction || {};
  const curseurs = (f) => F(f).L !== null && Math.abs(F(f).ecart - F(f).L) <= 1;

  function tableau({ feuille }) {
    // Laser rouge, D = 2,00 m : a (µm) en A, L (mm) en B, θ = L / (2D) en C, 1/a (m⁻¹) en D ; quatre fentes.
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 4) return false;
    for (const [k, x] of l.entries()) {
      if (Math.abs(x.B - (2 * 650e-9 * 2) / (x.A * 1e-6) * 1000) > 1.2) return `Ligne ${k + 2} : en A la largeur a de la fente (µm), en B la largeur L de la tache centrale mesurée à D = 2,00 m (mm).`;
      if (Math.abs(x.C - x.B / 4000) > 2e-5) return `Ligne ${k + 2} : en C, θ = L / (2D) en radians (L en m) : =B${k + 2}/4000.`;
      if (Math.abs(x.D - 1 / (x.A * 1e-6)) > 50) return `Ligne ${k + 2} : en D, 1/a en m⁻¹ : =1000000/A${k + 2}.`;
    }
    return new Set(l.map((x) => x.A)).size >= 4 || "Quatre fentes différentes.";
  }

  const FENTE = {
    id: "fente", paillasse: 0, titre: "Diffraction par une fente",
    objectif: "Observer la lumière d'un laser après une fente fine ; mesurer l'écart angulaire θ ; vérifier θ = λ / a.",
    entetes: ["a (µm)", "L (mm)", "θ (rad)", "1/a (m⁻¹)"],
    donnees: ["θ : écart angulaire entre le milieu de la tache centrale et la première extinction", "Petits angles : θ ≈ tan θ = (L/2) / D", "c = 3,00 × 10⁸ m/s"],
    conclusion: "Après une fente fine, la lumière ne se propage plus en ligne droite : elle s'étale perpendiculairement à la fente, en une tache centrale très lumineuse et des taches latérales séparées par des extinctions. C'est la diffraction, comme pour les ondes à la surface de l'eau : la lumière se comporte comme une onde. θ = L / (2D) est proportionnel à 1/a : θ = λ / a, avec λ ≈ 650 nm pour ce laser. Sa fréquence vaut ν = c / λ ≈ 4,6 × 10¹⁴ Hz.",
    conclusion_courte: "θ = λ / a : la lumière est une onde.",
    etapes: [
      { consigne: "Laser rouge, fente de 100 µm, écran à 2,00 m. Sur l'écran, la lumière…", court: "Répondez dans le carnet.", question: choix(["s'étale perpendiculairement à la fente : tache centrale et taches latérales séparées par des extinctions", "forme un point lumineux unique", "s'étale dans la direction de la fente"], "Regardez l'écran vu de face.", "Exact : c'est la diffraction.") },
      { consigne: "Placez les deux curseurs sur les deux premières extinctions, de part et d'autre de la tache centrale.", court: "Curseurs sur les extinctions.", aide_geste: "Glissez chaque trait rouge sur une zone sombre, juste à côté de la tache centrale.", verifier: ({ faits }) => (F(faits).a === 100 && F(faits).D === 2 && curseurs(faits)) || false },
      { consigne: "Largeur de la tache centrale L (mm) ?", court: "L (mm) ?", question: nombre("mm", (f) => F(f).L || 26, 1, "Écart entre les deux curseurs.", "Exact.") },
      { consigne: "Écart angulaire θ = L / (2D) (rad) ?", court: "θ (rad) ?", question: nombre("rad", (f) => (F(f).L || 26) / 4000, 0.0004, "L et D en mètres.", "Exact : environ 6,5 × 10⁻³ rad.") },
      { consigne: "Tableur : pour quatre fentes (D = 2,00 m), mesurez L. En A : a (µm) ; en B : L (mm) ; en C : θ = L/(2D) ; en D : 1/a (m⁻¹).", court: "Tableur : a, L, θ, 1/a.", aide_geste: "Touchez « Diapositive » pour changer de fente.", verifier: tableau },
      { consigne: "Tracez θ (C) en fonction de 1/a (D).", court: "Courbe θ = f(1/a).", verifier: ({ courbe }) => (courbe.x === "D" && courbe.y === "C" && courbe.n >= 4) || "Abscisse : D (1/a) ; ordonnée : C (θ)." },
      { consigne: "La droite passe par l'origine ; son coefficient directeur est λ. Longueur d'onde du laser (nm) ?", court: "λ (nm) ?", question: nombre("nm", 650, 25, "Coefficient directeur en mètres, à convertir en nanomètres.", "Exact : environ 650 nm, comme l'indique l'étiquette du laser.") },
      { consigne: "Fréquence ν = c / λ de cette lumière, en unités de 10¹⁴ Hz ?", court: "ν (× 10¹⁴ Hz) ?", question: nombre("× 10¹⁴ Hz", 4.62, 0.15, "ν = 3,00 × 10⁸ / 650 × 10⁻⁹.", "Exact : environ 4,6 × 10¹⁴ Hz.") },
    ],
  };

  const AUTRES = {
    id: "autres", paillasse: 0, titre: "Fil, couleur, lumière blanche",
    objectif: "Comparer une fente et un fil ; changer de laser ; éclairer en lumière blanche ; mesurer l'épaisseur d'un cheveu.",
    entetes: [],
    donnees: ["Lumière visible : de 400 nm (violet) à 800 nm (rouge) environ"],
    conclusion: "Un fil de diamètre a donne la même figure qu'une fente de largeur a. Avec le laser vert (λ plus petite), la tache centrale est plus étroite : θ = λ / a. Une lumière monochromatique a une seule longueur d'onde ; la lumière blanche est polychromatique : chaque radiation donne sa propre figure, d'où une tache centrale blanche bordée de couleurs. Le spectre visible s'étend d'environ 400 nm à 800 nm ; au-delà du violet, l'ultraviolet ; au-delà du rouge, l'infrarouge. La diffraction permet de mesurer l'épaisseur d'un cheveu : a = 2λD / L.",
    conclusion_courte: "Monochromatique, polychromatique ; a = 2λD / L.",
    etapes: [
      { consigne: "Remplacez la fente de 100 µm par le fil de 100 µm. La figure…", court: "Répondez dans le carnet.", question: choix(["est la même : un fil de diamètre a diffracte comme une fente de largeur a", "disparaît", "est deux fois plus large"], "Comparez à la fente de 100 µm.", "Exact.") },
      { consigne: "Revenez à la fente de 100 µm et prenez le laser vert (532 nm). La tache centrale…", court: "Répondez dans le carnet.", question: choix(["est plus étroite : θ = λ / a et λ est plus petite", "est plus large", "garde la même largeur"], "Comparez L pour les deux lasers.", "Exact.") },
      { consigne: "Passez en lumière blanche (lampe et fente source). La tache centrale est blanche et ses bords sont irisés parce que…", court: "Répondez dans le carnet.", question: choix(["la lumière blanche est polychromatique : chaque radiation a sa propre figure de diffraction", "la fente colore la lumière", "la lumière blanche n'est pas diffractée"], "Le bleu est-il diffracté comme le rouge ?", "Exact.") },
      { consigne: "Laser rouge, diapositive « cheveu », écran à 2,00 m : placez les curseurs sur les premières extinctions.", court: "Curseurs (cheveu).", verifier: ({ faits }) => (F(faits).type === "cheveu" && F(faits).source === "rouge" && F(faits).D === 2 && curseurs(faits)) || false },
      { consigne: "Épaisseur du cheveu a = 2λD / L (µm) ?", court: "a (µm) ?", question: nombre("µm", 72, 5, "λ = 650 nm, D = 2,00 m, L mesurée en mètres.", "Exact : environ 70 µm.") },
      { consigne: "Une radiation de longueur d'onde 1 000 nm dans le vide est…", court: "Répondez dans le carnet.", question: choix(["infrarouge : invisible, au-delà du rouge", "ultraviolette", "verte"], "Le visible s'arrête vers 800 nm.", "Exact.") },
    ],
  };

  L.poste_banc_diffraction = function (g) {
    // Pense-bête et banc de diffraction.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.banc_diffraction(g, { x0: 230, k: 300, sol: 520, y_faisceau: 470, vue: { x: 330, y: 84 }, fait: "diffraction" });
    return { pense_bete };
  };

  L.demarrer({ id: "b2_ondes3_a1_diffraction", titre: "Laboratoire : diffraction de la lumière", paillasses: [L.poste_banc_diffraction], missions: [FENTE, AUTRES] });
})(window.Labo);

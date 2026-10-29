/*
Rôle : simulation de l'activité 2 du chapitre « Relation entre la somme des moments et l'accélération angulaire »
       (2e année du bac) : tige à masselottes entraînée par une masse qui tombe de h = 50 cm (chronomètre et cellule) ;
       système en translation et en rotation, T = m·(g − r·θ̈), ΣM = T·r ; vérification de ΣM = JΔ·θ̈ ; rôle et unité du
       moment d'inertie, J = J_tige + 2·m'·d². Objectifs O3 et O5.
Reçoit : rien (les vérifications lisent « essais », la feuille de calcul et le graphique).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const G = 9.81, R = 0.025, H = 0.5, J = (d) => 0.0024 + 2 * 0.15 * d * d, MASSES = [50, 100, 150, 200, 250], D_CM = [5, 10, 15, 20];
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const E = (f) => f.essais || [], fait = (f, m, d) => E(f).some((e) => e.m_g === m && e.d_cm === d);
  const proche = (a, b, r = 0.01) => Math.abs(a - b) <= r * Math.abs(b) + 1e-6;

  function tableau(cle, quatrieme, n_min) {
    // A : m (kg) ou d (m) d'un essai ; B : sa durée t ; C : θ̈ = 2h/(r·t²) ; D : ΣM = m·(g − r·θ̈)·r, ou J = ΣM/θ̈.
    return ({ faits, feuille }) => {
      const v = (c, n) => feuille.valeur_sure(`${c}${n}`);
      let lignes = 0;
      for (let n = 2; n <= 12; n++) {
        if (v("A", n) === null) continue;
        const e = E(faits).find((x) => cle(x, v("A", n)));
        if (!e) return `Ligne ${n} : en A, une valeur d'un essai fait (en kg ou en m).`;
        if (v("B", n) === null || Math.abs(v("B", n) - e.t) > 0.0015) return `Ligne ${n} : en B, la durée t affichée par le chronomètre pour cet essai.`;
        const a = (2 * H) / (R * v("B", n) ** 2);
        if (v("C", n) === null || !proche(v("C", n), a)) return `Ligne ${n} : en C, θ̈ = 2h / (r·t²) = 2 × 0,50 / (0,025 × B${n}²).`;
        const m = quatrieme === "J" ? 0.1 : v("A", n), M = m * (G - R * v("C", n)) * R;
        if (v("D", n) === null || !proche(v("D", n), quatrieme === "J" ? M / v("C", n) : M)) return quatrieme === "J" ? `Ligne ${n} : en D, J = 0,1 × (9,81 − 0,025 × C${n}) × 0,025 / C${n}.` : `Ligne ${n} : en D, ΣM = A${n} × (9,81 − 0,025 × C${n}) × 0,025.`;
        lignes++;
      }
      return lignes >= n_min || false;
    };
  }

  const RELATION = {
    id: "relation", paillasse: 0, titre: "Moments et accélération angulaire",
    objectif: "Masselottes à 10 cm : mesurer la durée de chute pour cinq masses, calculer θ̈ et ΣM, puis tracer ΣM = f(θ̈).",
    entetes: ["m (kg)", "t (s)", "θ̈ (rad/s²)", "ΣM (N·m)"],
    donnees: ["Masse : h = ½·a·t², a = r·θ̈ : θ̈ = 2h / (r·t²)", "Masse : m·a = m·g − T : T = m·(g − r·θ̈)", "Solide : ΣM = T·r (poids et réaction de l'axe : moments nuls)"],
    conclusion: "Pour un solide en rotation autour d'un axe fixe Δ, la somme des moments des forces est proportionnelle à l'accélération angulaire : ΣMΔ = JΔ·θ̈ (relation fondamentale de la dynamique en rotation). Le coefficient JΔ est le moment d'inertie du solide par rapport à l'axe (kg·m²). Pour le système, on applique la deuxième loi de Newton à la masse (translation : m·a = m·g − T) et la relation fondamentale au solide (rotation : T·r = JΔ·θ̈), avec a = r·θ̈.",
    conclusion_courte: "ΣMΔ = JΔ·θ̈ ; JΔ en kg·m².",
    etapes: [
      { consigne: "Masselottes à 10 cm de l'axe, porte-masse seul (50 g) : appuyez sur « Lâcher », lisez t, puis « Remonter ».", court: "Mesure avec 50 g.", aide_geste: "Touchez une masselotte pour déplacer les deux d'un trou (5, 10, 15, 20 cm).", verifier: ({ faits }) => fait(faits, 50, 10) || false },
      { consigne: "Ajoutez un disque de 50 g (coffret) avant chaque nouvelle mesure, jusqu'à 250 g.", court: "Mesures : 100 à 250 g.", aide_geste: "Touchez un disque du coffret pour l'ajouter ; touchez le porte-masse pour en retirer un.", verifier: ({ faits }) => MASSES.every((m) => fait(faits, m, 10)) || false },
      { consigne: "Pour la masse en translation (deuxième loi de Newton, a = r·θ̈), la tension du fil est…", court: "Répondez dans le carnet.", question: choix(["T = m·(g − r·θ̈), un peu plus petite que m·g", "T = m·g exactement", "T = m·(g + r·θ̈)"], "m·a = m·g − T.", "Exact : le fil ne transmet pas tout le poids, la masse accélère.") },
      { consigne: "Sur la tige, le poids et la réaction de l'axe ont des moments…", court: "Répondez dans le carnet.", question: choix(["nuls : leurs droites d'action passent par l'axe, donc ΣM = T·r", "égaux à T·r", "opposés au moment de T"], "Bras de levier de ces forces ?", "Exact.") },
      { consigne: "Tableur, lignes 2 à 6 : m en kg (A), t (B), θ̈ = 2 × 0,50 / (0,025 × t²) (C), ΣM = m × (9,81 − 0,025 × θ̈) × 0,025 (D).", court: "Tableur : m, t, θ̈, ΣM.", verifier: tableau((e, a) => e.d_cm === 10 && Math.abs(e.m_g / 1000 - a) < 1e-6, "M", 5) },
      { consigne: "Tracez ΣM (D) en fonction de θ̈ (C), modèle y = a·x.", court: "Courbe ΣM = f(θ̈).", verifier: ({ courbe: c }) => (c.x === "C" && c.y === "D" && c.n >= 5 && c.modele === "lineaire") || "Abscisse : C ; ordonnée : D ; modèle y = a·x." },
      { consigne: "Les points sont alignés sur une droite qui passe par l'origine : ΣM et θ̈ sont…", court: "Répondez dans le carnet.", question: choix(["proportionnels : ΣM = J·θ̈", "sans lien", "inversement proportionnels"], "Forme de la courbe ?", "Exact : c'est la relation fondamentale de la dynamique en rotation.") },
      { consigne: "Coefficient directeur JΔ (moment d'inertie, kg·m²) ?", court: "JΔ (kg·m²) ?", question: relatif("kg·m²", J(0.1), 0.05, "Lisez a dans le modèle ; écrivez-le par exemple 0,0054.", "Exact.") },
      { consigne: "Calculez JΔ = J_tige + 2·m'·d² pour d = 10 cm et comparez (kg·m²).", court: "J calculé (kg·m²) ?", question: relatif("kg·m²", J(0.1), 0.03, "2,4 × 10⁻³ + 2 × 0,150 × 0,10².", "Exact : la mesure confirme la relation ΣM = JΔ·θ̈.") },
      { consigne: "L'unité du moment d'inertie est…", court: "Répondez dans le carnet.", question: choix(["le kg·m²", "le N·m", "le kg·m/s²"], "J = Σ m·r².", "Exact.") },
    ],
  };

  const INERTIE = {
    id: "inertie", paillasse: 0, titre: "Rôle du moment d'inertie",
    objectif: "Masse de 100 g : mesurer t pour d = 5, 10, 15 et 20 cm ; calculer θ̈ et JΔ = ΣM / θ̈.",
    entetes: ["d (m)", "t (s)", "θ̈ (rad/s²)", "J (kg·m²)"],
    donnees: ["m = 0,100 kg ; r = 0,025 m ; h = 0,50 m", "J = ΣM / θ̈ = m·(g − r·θ̈)·r / θ̈", "J_tige = 2,4 × 10⁻³ kg·m² ; m' = 0,150 kg"],
    conclusion: "Pour la même masse motrice, l'accélération angulaire diminue quand on éloigne les masselottes de l'axe : le moment d'inertie JΔ augmente. JΔ mesure l'inertie du solide en rotation ; il dépend de sa masse et de la répartition de cette masse autour de l'axe : pour des masses ponctuelles, J = Σ m·r², d'où J = J_tige + 2·m'·d².",
    conclusion_courte: "JΔ dépend de la répartition de la masse : J = J_tige + 2·m'·d².",
    etapes: [
      { consigne: "Mettez 100 g (porte-masse + 1 disque) ; mesurez t pour d = 5, 10, 15 et 20 cm.", court: "Mesures : d = 5 à 20 cm.", aide_geste: "Les masselottes se déplacent quand le frein est serré (après « Remonter »).", verifier: ({ faits }) => D_CM.every((d) => fait(faits, 100, d)) || false },
      { consigne: "Quand d augmente, la masse met plus de temps à descendre : θ̈…", court: "Répondez dans le carnet.", question: choix(["diminue : le solide résiste davantage à la mise en rotation", "augmente", "ne change pas"], "Comparez les durées.", "Exact.") },
      { consigne: "Tableur, lignes 2 à 5 : d en m (A), t (B), θ̈ (C), J = 0,1 × (9,81 − 0,025 × θ̈) × 0,025 / θ̈ (D).", court: "Tableur : d, t, θ̈, J.", verifier: tableau((e, a) => e.m_g === 100 && Math.abs(e.d_cm / 100 - a) < 1e-6, "J", 4) },
      { consigne: "Calculez J = J_tige + 2·m'·d² pour d = 20 cm et comparez à la ligne de d = 0,20 m (kg·m²).", court: "J (20 cm) en kg·m² ?", question: relatif("kg·m²", J(0.2), 0.03, "2,4 × 10⁻³ + 2 × 0,150 × 0,20².", "Exact.") },
      { consigne: "De d = 10 cm à d = 20 cm, la part des masselottes 2·m'·d²…", court: "Répondez dans le carnet.", question: choix(["est multipliée par 4", "est multipliée par 2", "ne change pas"], "d est doublée.", "Exact : J dépend du carré de la distance à l'axe.") },
      { consigne: "Le moment d'inertie d'un solide dépend…", court: "Répondez dans le carnet.", question: choix(["de sa masse et de la répartition de cette masse autour de l'axe", "seulement de sa masse", "de la masse motrice m"], "Même solide, masselottes déplacées.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_meca3_a2_relation", titre: "Laboratoire : moments et accélération angulaire", paillasses: [L.poste_tige], missions: [RELATION, INERTIE] });
})(window.Labo);

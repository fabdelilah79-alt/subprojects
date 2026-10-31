/*
Rôle : simulation de l'activité 3 du chapitre « Applications des lois de Newton » (2e année du bac) : projectiles de masses
       différentes lancés par un lance-projectile à ressort, filmés et pointés (action de l'air négligée) ; x(t) uniforme,
       vy(t) uniformément varié ; équations horaires, trajectoire parabolique, flèche et portée ; influence de l'angle et
       de la vitesse initiale, indépendance vis-à-vis de la masse. Objectif O4.
Reçoit : rien (les vérifications lisent « essais_tir », « pointage », la feuille de calcul et le graphique).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const G = 9.81, R = (d) => (d * Math.PI) / 180, portee = (v, a) => (v * v * Math.sin(R(2 * a))) / G;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const P = (f) => f.pointage || {}, E = (f) => f.essais_tir || [], dernier = (f) => E(f)[E(f).length - 1] || {};
  const tire = (f, p, a, v) => E(f).some((e) => e.projectile === p && e.alpha === a && e.v0 === v);
  const pointe = (f) => (dernier(f).projectile === "acier" && dernier(f).alpha === 45 && dernier(f).v0 === 3 && P(f).video === dernier(f).id && P(f).echelle_ok && P(f).origine && (P(f).points || []).length >= 9) || false;

  function tableau({ faits, feuille }) {
    // A, B, C : t, x, y exportés (neuf lignes au moins) ; D : vy = (y suivant − y précédent) / (2Δt) sur six lignes au moins.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), pts = P(faits).points || [];
    let lignes = 0, vitesses = 0;
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      const p = pts.find((q) => Math.abs(q.t - v("A", n)) < 1e-3);
      if (!p || Math.abs(v("B", n) - p.x) > 1e-3 || Math.abs(v("C", n) - p.y) > 1e-3) return `Ligne ${n} : touchez « Exporter » dans le logiciel pour copier t, x, y.`;
      lignes++;
      if (v("D", n) === null) continue;
      if (v("C", n - 1) === null || v("C", n + 1) === null) return `Ligne ${n} : vy demande les lignes voisines ; commencez en D3.`;
      const vy = (v("C", n + 1) - v("C", n - 1)) / (v("A", n + 1) - v("A", n - 1));
      if (Math.abs(v("D", n) - vy) > 0.01 * Math.abs(vy) + 0.005) return `Ligne ${n} : en D, vy = (C${n + 1} − C${n - 1}) / (2 × 0,04).`;
      vitesses++;
    }
    return (lignes >= 9 && vitesses >= 6) || false;
  }

  const TRAJECTOIRE = {
    id: "trajectoire", paillasse: 0, titre: "Mouvement d'un projectile",
    objectif: "Filmer et pointer la bille d'acier lancée à 45° avec v0 = 3,0 m/s ; étudier x(t) et vy(t).",
    entetes: ["t (s)", "x (m)", "y (m)", "vy (m/s)"],
    donnees: ["Origine O : bouche du lanceur ; x horizontal, y vertical vers le haut", "Caméra : 25 images/s (Δt = 0,04 s) ; action de l'air négligée", "v0x = v0·cos α ; v0y = v0·sin α"],
    conclusion: "Seul le poids agit : a = g, vertical vers le bas. Selon x, ẍ = 0 : x = v0·cos α·t (mouvement uniforme) ; selon y, ÿ = −g : vy = −g·t + v0·sin α et y = −½·g·t² + v0·sin α·t (mouvement uniformément varié). En éliminant t, la trajectoire est une parabole : y = −g·x² / (2·v0²·cos²α) + x·tan α.",
    conclusion_courte: "x = v0·cos α·t ; y = −½·g·t² + v0·sin α·t : parabole.",
    etapes: [
      { consigne: "Réglez α = 45°, v0 = 3,0 m/s, bille d'acier ; appuyez sur « Tirer ».", court: "Tirez la bille d'acier (45°, 3 m/s).", aide_geste: "Réglages sur le boîtier du lance-projectile ; « Recharger » avant un nouveau tir.", verifier: ({ faits }) => tire(faits, "acier", 45, 3) || false },
      { consigne: "Logiciel : « Échelle » (traits 0 et 100 cm du tableau), « Origine » sur la bille de l'image 0 (bouche du lanceur), puis pointez la bille sur chaque image (neuf au moins).", court: "Étalonnez et pointez.", verifier: ({ faits }) => pointe(faits) },
      { consigne: "« Exporter », puis tracez x (B) en fonction de t (A), modèle y = a·x.", court: "Courbe x = f(t).", verifier: ({ courbe }) => (courbe.x === "A" && courbe.y === "B" && courbe.n >= 8 && courbe.modele === "lineaire") || "Abscisse : A ; ordonnée : B ; modèle y = a·x." },
      { consigne: "x(t) est une droite : vitesse horizontale v0x (m/s) ?", court: "v0x (m/s) ?", question: nombre("m/s", 3 * Math.cos(R(45)), 0.08, "Coefficient directeur.", "Exact : v0x = v0·cos α, constante.") },
      { consigne: "En D (à partir de D3), calculez vy = (y suivant − y précédent) / (2 × 0,04).", court: "Tableur : vy en D.", verifier: tableau },
      { consigne: "Tracez vy (D) en fonction de t (A), modèle y = a·x + b.", court: "Courbe vy = f(t).", verifier: ({ courbe }) => (courbe.x === "A" && courbe.y === "D" && courbe.n >= 6 && courbe.modele === "affine") || "Abscisse : A ; ordonnée : D ; modèle y = a·x + b." },
      { consigne: "Valeur de l'accélération |a| (m/s²) ?", court: "|a| (m/s²) ?", question: nombre("m/s²", G, 0.6, "Coefficient directeur de vy(t).", "Exact : g.") },
      { consigne: "Les équations horaires du mouvement sont…", court: "Répondez dans le carnet.", question: choix(["x = v0·cos α·t et y = −½·g·t² + v0·sin α·t", "x = ½·g·t² et y = v0·t", "x = v0·t et y = v0·t"], "ẍ = 0 et ÿ = −g, avec les conditions initiales.", "Exact.") },
      { consigne: "En éliminant t, la trajectoire est…", court: "Répondez dans le carnet.", question: choix(["une parabole : y = −g·x²/(2·v0²·cos²α) + x·tan α", "une droite", "un cercle"], "t = x / (v0·cos α).", "Exact.") },
    ],
  };

  const PORTEE = {
    id: "portee", paillasse: 0, titre: "Flèche, portée, conditions initiales",
    objectif: "Calculer la flèche et la portée ; changer l'angle, puis le projectile.",
    entetes: [],
    donnees: ["Flèche : h = v0²·sin²α / (2g)", "Portée (retour à la hauteur de départ) : D = v0²·sin(2α) / g", "Bille d'acier : 33 g ; balle de bois : 8 g"],
    conclusion: "La flèche h = v0²·sin²α/(2g) et la portée D = v0²·sin(2α)/g ne dépendent que des conditions initiales (v0, α) et de g, pas de la masse : la bille d'acier et la balle de bois suivent la même trajectoire. Pour une même vitesse, deux angles complémentaires (30° et 60°) donnent la même portée ; elle est maximale pour α = 45°.",
    conclusion_courte: "h et D dépendent de v0 et α, pas de la masse.",
    etapes: [
      { consigne: "Flèche du tir à 45° avec v0 = 3,0 m/s (m) ?", court: "Flèche (m) ?", question: nombre("m", (3 * Math.sin(R(45))) ** 2 / (2 * G), 0.015, "h = v0²·sin²α / (2g) ; comparez au plus grand y du tableau du logiciel.", "Exact : environ 0,23 m.") },
      { consigne: "Portée de ce tir (m) ?", court: "Portée (m) ?", question: nombre("m", portee(3, 45), 0.02, "D = v0²·sin(2α) / g ; vérifiez sur le tableau quadrillé.", "Exact : environ 0,92 m.") },
      { consigne: "Tirez la bille d'acier à 30°, puis à 60°, toujours avec v0 = 3,0 m/s.", court: "Tirs à 30° et 60°.", verifier: ({ faits }) => (tire(faits, "acier", 30, 3) && tire(faits, "acier", 60, 3)) || false },
      { consigne: "Portée commune des tirs à 30° et à 60° (m) ?", court: "Portée (m) ?", question: nombre("m", portee(3, 30), 0.02, "sin 60° = sin 120°.", "Exact : environ 0,79 m.") },
      { consigne: "Pour une même vitesse initiale, la portée…", court: "Répondez dans le carnet.", question: choix(["est la même pour deux angles complémentaires et maximale à 45°", "augmente toujours avec l'angle", "ne dépend pas de l'angle"], "Comparez les trois tirs.", "Exact.") },
      { consigne: "Tirez la balle de bois à 45° avec v0 = 3,0 m/s.", court: "Tir de la balle de bois.", verifier: ({ faits }) => tire(faits, "bois", 45, 3) || false },
      { consigne: "Avec la balle de bois (8 g), la trajectoire…", court: "Répondez dans le carnet.", question: choix(["est la même : elle ne dépend pas de la masse (a = g)", "est plus haute", "est plus courte"], "Où retombe-t-elle ?", "Exact : l'action de l'air est négligeable.") },
      { consigne: "La trajectoire d'un projectile est fixée par…", court: "Répondez dans le carnet.", question: choix(["les conditions initiales (position, v0, α) et g", "sa masse", "sa couleur"], "Reprenez les équations horaires.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_meca2_a3_projectiles", titre: "Laboratoire : mouvement d'un projectile", paillasses: [L.poste_tir], missions: [TRAJECTOIRE, PORTEE] });
})(window.Labo);

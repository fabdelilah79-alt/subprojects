/*
Rôle : simulation de l'activité 2 du chapitre « Suivi temporel d'une transformation, vitesse de réaction » (2e année du bac) :
       suivi par une mesure physique ; pression du dihydrogène formé par Mg + 2 H⁺ (pressiomètre) et conductivité de la
       solution pendant l'hydrolyse du 2-chloro-2-méthylpropane (conductimètre) ; relevés, tableur-grapheur, x = f(t),
       avancement final, t1/2 lu sur la courbe, vitesse comparée sur les tangentes (sans calcul), choix de la méthode de
       suivi selon t1/2. Objectifs O1, O3, O5, O6.
Reçoit : rien (les vérifications lisent les faits « pression », « conductimetrie » et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const PR = (f) => f.pression || {}, CO = (f) => f.conductimetrie || {}, K_P = (225e-6 / (8.314 * 293.15)) * 1e5, K_S = 0.352;

  function demi(releves, v0) {
    // Date (s) où la mesure atteint la moitié de sa variation finale, par interpolation entre deux relevés.
    if (!releves || releves.length < 2) return 0;
    const vf = releves[releves.length - 1][1], m = (v0 + vf) / 2;
    let a = [0, v0];
    for (const b of releves) { if (b[1] >= m) return a[0] + ((m - a[1]) * (b[0] - a[0])) / (b[1] - a[1] || 1); a = b; }
    return 0;
  }

  const tableau = (releves, x, nom) => ({ faits, feuille }) => {
    // A : t (s) d'un relevé ; B : la mesure relevée ; C : x (mmol) ; huit lignes au moins.
    const v = (c, n) => feuille.valeur_sure(`${c}${n}`), r = releves(faits) || [];
    let n_ok = 0;
    for (let n = 2; n <= 12; n++) {
      if (v("A", n) === null) continue;
      if (!r.some(([t, m]) => Math.abs(t - v("A", n)) < 0.6 && Math.abs(m - v("B", n)) < 0.006)) return `Ligne ${n} : en A la date (s), en B ${nom} d'un même relevé de la feuille.`;
      const xa = x(v("B", n));
      if (v("C", n) === null || Math.abs(v("C", n) - xa) > 0.02 * Math.abs(xa) + 0.003) return `Ligne ${n} : en C, l'avancement x (mmol) calculé à partir de B${n}.`;
      n_ok++;
    }
    return n_ok >= 8 || false;
  };

  const PRESSION = {
    id: "pression", paillasse: 0, titre: "Suivi par la mesure de la pression",
    conclusion: "Le dihydrogène formé reste dans l'erlenmeyer bouché : sa quantité n(H₂) = x fait monter la pression, P − P0 = x·R·T/V. Les relevés de P donnent donc x à chaque date, sans arrêter la transformation. x augmente de plus en plus lentement et tend vers x_max ≈ 1,0 mmol (le magnésium est le réactif limitant) ; t1/2 ≈ 30 s. La pente de la tangente, donc la vitesse, diminue au cours du temps, car le ruban s'use.",
    objectif: "Suivre une transformation qui produit un gaz par la mesure de la pression.",
    entetes: ["t (s)", "P (hPa)", "x (mmol)"], donnees: ["Mg + 2 H⁺ → Mg²⁺ + H₂", "V(gaz) = 225 mL ; T = 293 K ; P0 = 1 013 hPa", "x = (P − P0)·V / (R·T) ; R = 8,314 SI", "M(Mg) = 24,3 g/mol"],
    conclusion_courte: "P − P0 = x·R·T/V : x(t), x_max, t1/2.",
    etapes: [
      { consigne: "Mettez les lunettes et les gants (acide chlorhydrique).", court: "Lunettes et gants.", aide_geste: "Touchez les lunettes, puis les gants.", verifier: ({ faits }) => PR(faits).epi || false },
      { consigne: "Lâchez le ruban de magnésium dans l'acide, puis bouchez aussitôt l'erlenmeyer : la réaction commence après environ 3 s.", court: "Ruban dans l'acide ; bouchez.", aide_geste: "Faites glisser le ruban jusqu'au col, puis touchez le bouchon.", verifier: ({ faits }) => { const p = PR(faits); if (p.dans && p.perdu > 0.005) return "Du gaz s'est échappé : touchez « Nouvel essai » et bouchez plus vite."; return (p.dans && p.ferme) || false; } },
      { consigne: "La pression augmente, car…", court: "Répondez dans le carnet.", question: choix(["le dihydrogène formé s'accumule dans l'erlenmeyer : n(H₂) = x et P − P0 = x·R·T/V", "l'acide s'évapore", "le magnésium se dilate"], "Quel gaz se forme ?", "Exact.") },
      { consigne: "Avec « Relever », notez P toutes les 10 à 15 s environ, jusqu'à ce qu'elle ne varie plus.", court: "Relevés de P.", verifier: ({ faits }) => { const p = PR(faits), r = p.releves || []; return (p.fini && r.length >= 8 && r[r.length - 1][1] >= p.P - 1) || false; } },
      { consigne: "Tableur : t (s) en A, P (hPa) en B, x (mmol) en C, pour huit relevés au moins.", court: "Tableur : t, P, x.", aide_geste: "En C : =(B2-1013)*0,00923 (V/(R·T) en mmol par hPa).", verifier: tableau((f) => PR(f).releves, (P) => (P - 1013) * K_P, "la pression") },
      { consigne: "Tracez x (C) en fonction de t (A).", court: "Courbe x = f(t).", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "C" && c.n >= 8) || "Abscisse : A ; ordonnée : C." },
      { consigne: "Avancement maximal x_max (mmol), d'après le tableau d'avancement ?", court: "x_max (mmol) ?", question: relatif("mmol", 0.024 / 24.3 * 1000, 0.03, "n(Mg) = m / M ; l'acide est en excès.", "Exact : 0,99 mmol, comme sur la courbe.") },
      { consigne: "Temps de demi-réaction t1/2 (s), lu sur la courbe ?", court: "t1/2 (s) ?", question: relatif("s", (f) => demi(PR(f).releves, 1013), 0.2, "Date où x = x_max / 2.", "Exact.") },
      { consigne: "Au cours du temps, la pente de la tangente à la courbe…", court: "Répondez dans le carnet.", question: choix(["diminue : la vitesse diminue, car le ruban s'use et les réactifs s'épuisent", "augmente", "reste constante"], "Comparez les tangentes au début et à la fin.", "Exact.") },
    ],
  };

  const CONDUCTIMETRIE = {
    id: "conductimetrie", paillasse: 1, titre: "Suivi par conductimétrie",
    conclusion: "Le 2-chloro-2-méthylpropane, molécule, ne conduit pas ; son hydrolyse forme des ions H₃O⁺ et Cl⁻ : σ = (λ(H₃O⁺) + λ(Cl⁻))·x/V augmente avec l'avancement. On suit la transformation sans prélever, en continu. x tend vers x_max = 1,0 mmol ; t1/2 ≈ 30 s. Une transformation aussi rapide ne peut pas être suivie par des prélèvements et des titrages, qui demandent chacun plusieurs minutes : on choisit la méthode de suivi selon t1/2.",
    objectif: "Suivre une transformation qui forme des ions par la mesure de la conductivité.",
    entetes: ["t (s)", "σ (mS/cm)", "x (mmol)"], donnees: ["(CH₃)₃C–Cl + 2 H₂O → (CH₃)₃C–OH + H₃O⁺ + Cl⁻", "Volume du mélange : V = 150 mL", "λ(H₃O⁺) = 35,0 mS·m²/mol ; λ(Cl⁻) = 7,6 mS·m²/mol", "x = σ·V / (λ(H₃O⁺) + λ(Cl⁻))"],
    conclusion_courte: "σ ∝ x : x(t), t1/2 ; choix de la méthode.",
    etapes: [
      { consigne: "Mettez l'agitateur en marche et plongez la sonde dans l'eau.", court: "Agitation ; sonde dans l'eau.", aide_geste: "Touchez le bouton de l'agitateur ; faites glisser la sonde vers le bas.", verifier: ({ faits }) => (CO(faits).plonge && CO(faits).agite) || false },
      { consigne: "Prélevez 10,0 mL de la solution de 2-chloro-2-méthylpropane et versez-les dans l'eau : l'horloge démarre.", court: "10,0 mL de réactif dans l'eau.", aide_geste: "Pipette : pointe dans la solution, molette vers le haut pour aspirer ; pointe dans le bécher, molette vers le bas.", verifier: ({ faits }) => { const n = CO(faits).n_RCl || 0; if (n > 1.03) return "Trop de réactif : touchez « Bécher neuf » et versez 10,0 mL."; return n >= 0.97 || false; } },
      { consigne: "La conductivité augmente, car…", court: "Répondez dans le carnet.", question: choix(["la transformation forme des ions H₃O⁺ et Cl⁻ ; le 2-chloro-2-méthylpropane, lui, n'est pas ionique", "l'acétone conduit le courant", "la sonde chauffe"], "Lisez l'équation de la réaction.", "Exact.") },
      { consigne: "Avec « Relever », notez σ toutes les 10 à 15 s environ, jusqu'à ce qu'elle ne varie plus.", court: "Relevés de σ.", verifier: ({ faits }) => { const c = CO(faits), r = c.releves || []; return (r.length >= 8 && r[r.length - 1][1] >= 0.97 * (2.841 * c.n_RCl + 0.005)) || false; } },
      { consigne: "Avec σ en mS/cm et V = 150 mL, x (mmol) = k·σ. Valeur de k ?", court: "k (mmol par mS/cm) ?", question: relatif("", K_S, 0.03, "1 mS/cm = 0,1 S/m ; V = 1,50 × 10⁻⁴ m³ ; λ en S·m²/mol.", "Exact : k ≈ 0,352.") },
      { consigne: "Tableur : t (s) en A, σ (mS/cm) en B, x (mmol) en C, pour huit relevés au moins.", court: "Tableur : t, σ, x.", verifier: tableau((f) => CO(f).releves, (s) => K_S * s, "la conductivité") },
      { consigne: "Tracez x (C) en fonction de t (A).", court: "Courbe x = f(t).", verifier: ({ courbe: c }) => (c.x === "A" && c.y === "C" && c.n >= 8) || "Abscisse : A ; ordonnée : C." },
      { consigne: "Temps de demi-réaction t1/2 (s), lu sur la courbe ?", court: "t1/2 (s) ?", question: relatif("s", (f) => demi(CO(f).releves, 0), 0.2, "x_max = 1,0 mmol (10,0 mL à 0,10 mol/L) : cherchez x = 0,50 mmol.", "Exact.") },
      { consigne: "Pour suivre cette transformation, des prélèvements suivis de titrages ne conviendraient pas, car…", court: "Répondez dans le carnet.", question: choix(["t1/2 est d'environ 30 s : chaque titrage dure plus longtemps ; on choisit la méthode de suivi selon t1/2", "on ne sait pas titrer les ions H₃O⁺", "un prélèvement arrêterait la transformation dans le bécher"], "Comparez t1/2 à la durée d'un titrage.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_chim2_a2_mesures_physiques", titre: "Laboratoire : suivi par une mesure physique", paillasses: [L.poste_pression, L.poste_conductimetrie], missions: [PRESSION, CONDUCTIMETRIE] });
})(window.Labo);

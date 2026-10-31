/*
Rôle : simulation de l'activité 3 du chapitre « Grandeurs physiques liées aux quantités de matière » (1re année du bac) :
       transformation qui produit un gaz (magnésium et acide chlorhydrique), mesure de la pression avec un pressiomètre,
       quantité de gaz formée (PV = nRT), tableau d'avancement, réactif limitant, prévision de la pression finale.
       Objectifs O2, O3, O8, O9.
Reçoit : rien (les vérifications lisent le fait « gaz_produit » et la feuille du tableur).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const es = (f) => (f.gaz_produit || {}).essais || [], essai = (f, m) => es(f).find((x) => x.m === m);
  const rel = (a, b, t = 0.02) => Math.abs(a - b) <= t * Math.abs(b) + 1e-6;

  function tableau({ faits, feuille }) {
    // Trois essais : m (g), n(Mg) (mmol), ΔP (hPa), n(H₂) (mmol) = ΔP × 100 × V / (R T) × 1000.
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 3) return false;
    for (const [k, x] of l.entries()) {
      const e = essai(faits, x.A);
      if (!e) return `Ligne ${k + 2} : en A, la masse (g) d'un ruban que vous avez fait réagir, erlenmeyer bouché.`;
      if (!rel(x.B, (x.A / 24.3) * 1000)) return `Ligne ${k + 2} : n(Mg) = m / M en mmol, par exemple =A${k + 2}/24,3*1000.`;
      if (Math.abs(x.C - (e.P - 1013)) > 3) return `Ligne ${k + 2} : ΔP = P finale − 1 013 hPa.`;
      if (!rel(x.D, x.C * 0.010667, 0.03)) return `Ligne ${k + 2} : n(H₂) = ΔP × V / (R T), en mmol : ×100 (Pa), ×260 × 10⁻⁶ (m³), ÷(8,314 × 293), ×1000, soit =C${k + 2}*0,01067.`;
    }
    return new Set(l.map((x) => x.A)).size >= 3 || "Trois rubans différents.";
  }

  const PRESSION = {
    id: "pression", paillasse: 0, titre: "Un gaz qui fait monter la pression",
    objectif: "Faire réagir un ruban de magnésium avec l'acide chlorhydrique dans un erlenmeyer bouché ; mesurer la pression.",
    entetes: [],
    donnees: ["Mg + 2 H⁺ → Mg²⁺ + H₂ ; M(Mg) = 24,3 g/mol", "Acide : 20,0 mL à 0,50 mol/L ; gaz dans l'erlenmeyer : V = 260 mL ; T = 293 K", "Pression de départ : 1 013 hPa"],
    conclusion: "Le dihydrogène formé reste dans l'erlenmeyer bouché : sa pression s'ajoute à celle de l'air. On en déduit sa quantité : n(H₂) = ΔP × V / (R T). Avec 0,048 g de magnésium (1,98 mmol), on trouve n(H₂) ≈ 1,98 mmol : tout le magnésium a réagi, c'est le réactif limitant (les ions H⁺, 10 mmol, sont en excès).",
    conclusion_courte: "n(gaz) = ΔP·V/(RT).",
    etapes: [
      { consigne: "L'acide chlorhydrique est corrosif : mettez lunettes et gants.", court: "Lunettes et gants.", verifier: ({ faits }) => !!(faits.gaz_produit || {}).epi },
      { consigne: "Lâchez le ruban de 0,048 g dans l'acide, bouchez aussitôt et attendez la fin de la réaction.", court: "Ruban de 0,048 g.", aide_geste: "Faites glisser le ruban au-dessus du col ; touchez le bouchon pour le poser.", verifier: ({ faits }) => { const e = essai(faits, 0.048); if (!e) return false; return e.P > 1180 || "Une partie du gaz s'est échappée : bouchez plus vite (« Nouvel essai »)."; } },
      { consigne: "Quantité de magnésium dans le ruban, en mmol ?", court: "n(Mg) (mmol) ?", question: nombre("mmol", 1.98, 0.04, "n = m / M = 0,048 / 24,3.", "Exact.") },
      { consigne: "Quantité d'ions H⁺ apportés, en mmol ?", court: "n(H⁺) (mmol) ?", question: nombre("mmol", 10, 0.1, "n = C × V = 0,50 × 20,0 mL.", "Exact : 10 mmol.") },
      { consigne: "Quantité de dihydrogène formée : n(H₂) = ΔP × V / (R T), en mmol ?", court: "n(H₂) (mmol) ?", question: nombre("mmol", 1.98, 0.08, "ΔP en Pa (1 hPa = 100 Pa), V = 260 × 10⁻⁶ m³, T = 293 K.", "Exact : environ 1,98 mmol.") },
      { consigne: "Le réactif limitant est…", court: "Répondez dans le carnet.", question: choix(["le magnésium : n(H₂) formé = n(Mg) apporté ; x_max = 1,98 mmol", "les ions H⁺", "aucun des deux"], "Comparez n(H₂) et n(Mg).", "Exact.") },
    ],
  };

  const AVANCEMENT = {
    id: "avancement", paillasse: 0, titre: "Tableau d'avancement",
    objectif: "Recommencer avec d'autres rubans ; comparer n(H₂) et l'avancement maximal.",
    entetes: ["m (g)", "n(Mg) (mmol)", "ΔP (hPa)", "n(H₂) (mmol)"],
    conclusion: "D'après le tableau d'avancement, n(Mg) = n₀ − x, n(H⁺) = 10 − 2x, n(H₂) = x. La réaction s'arrête quand un réactif est épuisé : x_max = n₀ si le magnésium est limitant (petits rubans), x_max = 10/2 = 5 mmol si ce sont les ions H⁺ (ruban de 0,24 g, 9,9 mmol). La quantité de gaz mesurée est égale à x_max.",
    conclusion_courte: "x_max = plus petite des valeurs n₀ et n(H⁺)/2.",
    etapes: [
      { consigne: "« Nouvel essai » : refaites l'expérience avec les rubans de 0,024 g et de 0,24 g. Une ligne par essai : en A, m ; en B, n(Mg) ; en C, ΔP ; en D, n(H₂).", court: "Tableur : A, B, C, D.", verifier: tableau },
      { consigne: "Pour le ruban de 0,24 g, la quantité de dihydrogène formée vaut environ…", court: "Répondez dans le carnet.", question: choix(["5 mmol : les ions H⁺ (10 mmol) sont épuisés, x_max = 10 / 2", "9,9 mmol : tout le magnésium réagit", "10 mmol"], "Comparez la colonne D à la colonne B.", "Exact : les ions H⁺ sont limitants.") },
      { consigne: "Dans le tableau d'avancement, la quantité d'ions H⁺ restante s'écrit…", court: "Répondez dans le carnet.", question: choix(["10 − 2x (mmol)", "10 − x", "10 + 2x"], "Il faut 2 H⁺ pour un Mg.", "Exact.") },
      { consigne: "Avancement maximal pour le ruban de 0,24 g, en mmol ?", court: "x_max (mmol) ?", question: nombre("mmol", 5, 0.15, "x_max est la plus petite des valeurs 9,9 et 10/2.", "Exact.") },
    ],
  };

  const PREVOIR = {
    id: "prevoir", paillasse: 0, titre: "Prévoir la pression finale",
    objectif: "Prévoir la pression finale avec le ruban de 0,036 g, puis la mesurer.",
    entetes: [],
    conclusion: "À température constante, on prévoit la pression finale : x_max = n(Mg) = 1,48 mmol (le magnésium est limitant), donc P = 1 013 hPa + x_max R T / V ≈ 1 152 hPa. La mesure confirme la prévision.",
    conclusion_courte: "P finale = P₀ + x_max·R·T/V.",
    etapes: [
      { consigne: "Prévoyez la pression finale (hPa) avec le ruban de 0,036 g.", court: "P prévue (hPa) ?", question: nombre("hPa", 1152, 6, "x_max = 0,036/24,3 mol ; ΔP = x_max × R × T / V (en Pa).", "Exact : environ 1 152 hPa.") },
      { consigne: "« Nouvel essai » : vérifiez avec le ruban de 0,036 g.", court: "Ruban de 0,036 g.", verifier: ({ faits }) => { const e = essai(faits, 0.036); if (!e) return false; return e.P > 1140 || "Le gaz s'est échappé : recommencez en bouchant aussitôt."; } },
      { consigne: "La mesure…", court: "Répondez dans le carnet.", question: choix(["confirme la prévision (à quelques hPa près)", "est deux fois plus grande", "ne dépend pas de la masse de magnésium"], "Comparez au pressiomètre.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_chim2_a3_gaz_produit", titre: "Laboratoire : un gaz produit par une transformation", paillasses: [L.poste_pression_gaz], missions: [PRESSION, AVANCEMENT, PREVOIR] });
})(window.Labo);

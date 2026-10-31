/*
Rôle : simulation de l'activité 2 du chapitre « Ondes mécaniques progressives » (2e année du bac) : mesure du retard et
       calcul de la célérité — bosse transversale le long d'un ressort (cellules photoélectriques et chronomètre
       électronique), son d'un claquoir reçu par deux microphones (oscilloscope à mémoire) ; tableur et courbe du retard
       en fonction de la distance. Objectifs O3, O4, O5.
Reçoit : rien (les vérifications lisent les faits « chrono_ressort », « ressort », « son », « oscillo_memoire », la feuille et
         la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const C = (f) => f.chrono_ressort || {}, S = (f) => f.son || {}, V_SON = 331.4 + 0.6 * 20;

  function tableau(v, unite_ms, tol) {
    // Au moins quatre lignes : distance d (m) en A, retard en B (s ou ms), d'accord avec d / v ; distances différentes.
    return ({ feuille }) => {
      const l = feuille.lignes(["A", "B"]);
      if (l.length < 4) return false;
      for (const [k, x] of l.entries()) if (Math.abs(x.B - (x.A / v) * (unite_ms ? 1000 : 1)) > tol) return `Ligne ${k + 2} : en A la distance d (m), en B le retard mesuré pour cette distance${unite_ms ? " (ms)" : " (s)"}.`;
      return new Set(l.map((x) => x.A)).size >= 4 || "Quatre distances différentes.";
    };
  }
  const courbe = ({ courbe }) => (courbe.x === "A" && courbe.y === "B" && courbe.n >= 4) || "Abscisse : A (distance) ; ordonnée : B (retard).";

  const RESSORT = {
    id: "ressort", paillasse: 0, titre: "Le retard le long d'un ressort",
    objectif: "Mesurer le retard Δt d'une bosse entre deux cellules A et B ; en déduire la célérité.",
    entetes: ["d = AB (m)", "Δt (s)"],
    donnees: ["Les cellules se règlent tous les 5 cm ; le faisceau passe 4,5 cm au-dessus du ressort", "Le chronomètre démarre quand le faisceau de A est coupé et s'arrête quand celui de B l'est"],
    conclusion: "Le point B reproduit le mouvement du point A avec un retard Δt = AB / v. Le retard est proportionnel à la distance : la droite Δt = f(d) passe par l'origine, son coefficient directeur vaut 1/v. Ici v ≈ 2,0 m/s. Une bosse plus petite ou plus large arrive avec le même retard : la célérité ne dépend pas de la forme de la perturbation, mais du milieu.",
    conclusion_courte: "Δt = d / v ; v ne dépend pas de la forme de la bosse.",
    etapes: [
      { consigne: "Cellule A à 50 cm, cellule B à 150 cm. Créez une bosse vers le haut (elle doit couper les faisceaux) et lisez Δt.", court: "Δt pour AB = 1,00 m.", aide_geste: "Glissez vivement la poignée vers le haut (au moins 6 cm), puis lâchez-la.", verifier: ({ faits }) => (C(faits).xA === 0.5 && C(faits).xB === 1.5 && C(faits).dt !== null) || (C(faits).dt === null ? false : "Placez A à 50 cm et B à 150 cm, puis recommencez.") },
      { consigne: "Calculez la célérité v = AB / Δt.", court: "v (m/s) ?", question: nombre("m/s", (f) => 1 / (C(f).dt || 0.5), 0.06, "AB = 1,00 m.", "Exact : environ 2,0 m/s.") },
      { consigne: "Tableur : mesurez Δt pour quatre distances AB différentes (déplacez B ; touchez RAZ si besoin). En A : d (m) ; en B : Δt (s).", court: "Tableur : d et Δt.", verifier: tableau(2, false, 0.012) },
      { consigne: "Tracez Δt (B) en fonction de d (A).", court: "Courbe Δt = f(d).", verifier: courbe },
      { consigne: "La courbe est une droite qui passe par l'origine. Son coefficient directeur vaut…", court: "Répondez dans le carnet.", question: choix(["1 / v : le retard est proportionnel à la distance, Δt = d / v", "v", "d × v"], "Δt = d / v.", "Exact.") },
      { consigne: "Le point B reproduit le mouvement du point A…", court: "Répondez dans le carnet.", question: choix(["avec un retard τ = AB / v", "en même temps que A", "avec une amplitude doublée"], "Pensez à la bosse qui passe d'abord en A puis en B.", "Exact.") },
      { consigne: "Recommencez avec une bosse plus petite (mais qui coupe les faisceaux). Le retard…", court: "Répondez dans le carnet.", question: choix(["ne change pas : la célérité ne dépend pas de la forme de la perturbation", "augmente", "diminue"], "Comparez les deux mesures.", "Exact : elle dépend du milieu.") },
    ],
  };

  const SON = {
    id: "son", paillasse: 1, titre: "La célérité du son",
    objectif: "Mesurer à l'oscilloscope le retard d'un son entre deux microphones ; en déduire la célérité du son dans l'air.",
    entetes: ["d = M1M2 (m)", "τ (ms)"],
    donnees: ["Oscilloscope en monocoup : il garde à l'écran le dernier enregistrement", "τ = nombre de divisions × balayage b", "Température de la salle : 20 °C"],
    conclusion: "La salve sonore arrive en M2 avec un retard τ sur M1 : τ = d / v. Le retard est proportionnel à la distance M1M2 ; le coefficient directeur de la droite τ = f(d) vaut 1/v, avec v ≈ 343 m/s dans l'air à 20 °C. L'amplitude diminue avec la distance, mais pas la célérité.",
    conclusion_courte: "Son dans l'air à 20 °C : v ≈ 343 m/s.",
    etapes: [
      { consigne: "Placez M1 à 10 cm et M2 à 50 cm du claquoir, puis faites claquer le claquoir.", court: "Clap avec M1M2 = 40 cm.", aide_geste: "Faites glisser chaque micro le long de la règle ; touchez le claquoir.", verifier: ({ faits }) => (S(faits).x1 === 0.1 && S(faits).x2 === 0.5 && S(faits).claps >= 1) || false },
      { consigne: "Lisez sur l'écran le retard τ entre le début de la salve 1 (en haut) et celui de la salve 2 (en bas).", court: "τ (ms) ?", question: nombre("ms", (f) => S(f).tau || 1.17, 0.08, "Comptez les divisions entre les deux débuts, multipliez par le balayage (ms/div).", "Exact : environ 1,2 ms.") },
      { consigne: "Tableur : mesurez τ pour quatre distances M1M2 différentes. En A : d (m) ; en B : τ (ms).", court: "Tableur : d et τ.", aide_geste: "Si besoin, changez le balayage (TIME/DIV) pour lire plus précisément.", verifier: tableau(V_SON, true, 0.09) },
      { consigne: "Tracez τ (B) en fonction de d (A).", court: "Courbe τ = f(d).", verifier: courbe },
      { consigne: "Déduisez du coefficient directeur la célérité du son dans l'air (m/s).", court: "v (m/s) ?", question: nombre("m/s", V_SON, 15, "Coefficient directeur a = 1/v, en ms par m : v = 1000 / a.", "Exact : environ 343 m/s.") },
      { consigne: "Si l'on claque plus fort, le retard τ…", court: "Répondez dans le carnet.", question: choix(["ne change pas : seule l'amplitude du signal change", "diminue", "augmente"], "La célérité dépend du milieu, pas de l'amplitude.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_ondes1_a2_retard", titre: "Laboratoire : retard et célérité", paillasses: [L.poste_ressort_retard, L.poste_son], missions: [RESSORT, SON] });
})(window.Labo);

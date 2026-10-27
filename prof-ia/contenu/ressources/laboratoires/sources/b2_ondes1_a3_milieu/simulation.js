/*
Rôle : simulation de l'activité 3 du chapitre « Ondes mécaniques progressives » (2e année du bac) : influence de la
       rigidité (tension) et de l'inertie (masse linéique) d'une corde sur la célérité, mesurée avec deux cellules et un
       chronomètre électronique ; documents sur la célérité du son selon le milieu et la température. Objectifs O4, O5.
Reçoit : rien (les vérifications lisent les faits « corde », « chrono_corde », « mesures_corde », « docs_milieux », la feuille
         et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const K = (f) => f.corde || {}, C = (f) => f.chrono_corde || {}, M = (f) => f.mesures_corde || {};

  function tableau({ feuille }) {
    // Corde B : au moins quatre tensions T (A), la célérité mesurée v (B) et v² (C).
    const l = feuille.lignes(["A", "B", "C"]);
    if (l.length < 4) return false;
    for (const [k, x] of l.entries()) {
      if (Math.abs(x.B - Math.sqrt(x.A / 0.1)) > 0.05 * x.B) return `Ligne ${k + 2} : en A la tension T = M·g (N), en B la célérité mesurée avec la corde B pour cette tension (m/s).`;
      if (Math.abs(x.C - x.B * x.B) > 0.03 * x.C) return `Ligne ${k + 2} : en C, v² (par exemple =B${k + 2}^2).`;
    }
    return new Set(l.map((x) => x.A)).size >= 4 || "Quatre tensions différentes.";
  }

  const TENSION = {
    id: "tension", paillasse: 0, titre: "La tension de la corde",
    objectif: "Mesurer la célérité d'une secousse le long de la corde B pour plusieurs tensions T = M·g.",
    entetes: ["T (N)", "v (m/s)", "v² (m²/s²)"],
    donnees: ["g = 9,81 N/kg", "M = masse du porte-masse (50 g) et des disques (100 g chacun)", "Cellules A et B à 1,00 m l'une de l'autre"],
    conclusion: "Plus la corde est tendue, plus la secousse avance vite. La courbe v² = f(T) est une droite qui passe par l'origine : v² = T / μ, soit v = √(T / μ). Son coefficient directeur vaut 1/μ = 10 m/kg pour la corde B (μ = 0,10 kg/m). La tension traduit la rigidité de la corde : un milieu plus rigide transmet plus vite la perturbation.",
    conclusion_courte: "v = √(T / μ) : v augmente avec la tension.",
    etapes: [
      { consigne: "Au boîtier de commande, choisissez « Chronophotographie : toutes les 0,05 s », puis touchez la poignée : elle donne un coup sec. Observez les images de la corde.", court: "Chronophotographie d'un coup sec.", aide_geste: "Touchez la poignée en bois ; la caméra rapide montre la scène ralentie 20 fois.", verifier: ({ faits }) => (K(faits).secousse > 0 && faits.photos_corde >= 6) || false },
      { consigne: "Sur la chronophotographie, d'une image à la suivante (0,05 s), la bosse…", court: "Répondez dans le carnet.", question: choix(["garde la même forme et avance de la même distance : elle se propage à vitesse constante, sans se déformer", "grandit en avançant", "avance de plus en plus vite"], "Comparez les bosses numérotées 1, 2, 3…", "Exact : la corde ne se déplace pas avec la bosse, chaque point monte puis redescend.") },
      { consigne: "Avec la corde B et deux disques (M = 250 g), cellules A à 50 cm et B à 150 cm, donnez un coup sec et lisez Δt.", court: "Δt pour T = 2,45 N.", aide_geste: "Touchez la poignée ; touchez RAZ avant une nouvelle mesure.", verifier: ({ faits }) => (K(faits).corde === "B" && K(faits).M === 0.25 && C(faits).dt !== null && C(faits).xB - C(faits).xA === 1) || false },
      { consigne: "Calculez la célérité v = AB / Δt.", court: "v (m/s) ?", question: nombre("m/s", (f) => 1 / (C(f).dt || 0.2), 0.15, "AB = 1,00 m.", "Exact : environ 5 m/s.") },
      { consigne: "Tableur : pour quatre masses M différentes (corde B), mesurez v. En A : T = M·g (N) ; en B : v (m/s) ; en C : v².", court: "Tableur : T, v, v².", aide_geste: "Touchez la boîte de disques pour en ajouter un ; touchez le porte-masse pour en retirer un.", verifier: tableau },
      { consigne: "Tracez v² (C) en fonction de T (A).", court: "Courbe v² = f(T).", verifier: ({ courbe }) => (courbe.x === "A" && courbe.y === "C" && courbe.n >= 4) || "Abscisse : A (T) ; ordonnée : C (v²)." },
      { consigne: "Coefficient directeur de la droite v² = f(T) (en m/kg) ?", court: "Coefficient (m/kg) ?", question: nombre("m/kg", 10, 0.8, "Prenez deux points éloignés de la droite.", "Exact : 1/μ = 10 m/kg.") },
      { consigne: "Au boîtier, choisissez un coup « long » ou une secousse « petite », puis mesurez de nouveau Δt pour M = 250 g. Le retard…", court: "Répondez dans le carnet.", question: choix(["ne change pas : la célérité ne dépend pas de la forme de la perturbation", "augmente", "diminue"], "Comparez avec votre première mesure.", "Exact : elle dépend du milieu (tension, masse linéique).") },
      { consigne: "Quand on augmente la tension de la corde, la célérité…", court: "Répondez dans le carnet.", question: choix(["augmente : v = √(T / μ)", "diminue", "ne change pas"], "Comparez les lignes du tableur.", "Exact.") },
    ],
  };

  const INERTIE = {
    id: "inertie", paillasse: 0, titre: "L'inertie de la corde",
    objectif: "Comparer la célérité le long de trois cordes de masses linéiques différentes, à la même tension.",
    entetes: [],
    donnees: ["Corde A : μ = 50 g/m ; corde B : 100 g/m ; corde C : 200 g/m"],
    conclusion: "À la même tension, la secousse est plus lente le long d'une corde plus lourde : la célérité diminue quand la masse linéique (l'inertie du milieu) augmente. La corde C (μ quatre fois plus grande que celle de A) transmet la secousse deux fois moins vite, en accord avec v = √(T / μ).",
    conclusion_courte: "v diminue quand l'inertie μ augmente.",
    etapes: [
      { consigne: "Gardez deux disques (M = 250 g). Montez la corde A (touchez-la au mur) et mesurez la célérité.", court: "Corde A, M = 250 g.", verifier: ({ faits }) => M(faits)["A|0.25"] > 0 || false },
      { consigne: "Montez la corde C et mesurez la célérité, toujours avec M = 250 g.", court: "Corde C, M = 250 g.", verifier: ({ faits }) => M(faits)["C|0.25"] > 0 || false },
      { consigne: "Rapport v(A) / v(C) ?", court: "v(A) / v(C) ?", question: nombre("", (f) => (M(f)["A|0.25"] || 7) / (M(f)["C|0.25"] || 3.5), 0.12, "Divisez les deux célérités mesurées.", "Exact : environ 2 = √(μC / μA).") },
      { consigne: "À tension égale, quand la masse linéique de la corde augmente, la célérité…", court: "Répondez dans le carnet.", question: choix(["diminue : l'inertie du milieu ralentit la propagation", "augmente", "ne change pas"], "Comparez les cordes A et C.", "Exact.") },
    ],
  };

  const MILIEUX = {
    id: "milieux", paillasse: 1, titre: "Le son dans différents milieux",
    objectif: "Lire les documents sur la célérité du son ; relier la célérité à la rigidité, à l'inertie et à la température.",
    entetes: [],
    conclusion: "La célérité d'une onde mécanique dépend du milieu et de son état : le son va plus vite dans l'acier (très rigide) que dans l'eau, et plus vite dans l'eau que dans l'air ; dans l'air, elle augmente avec la température (v ≈ 331,4 + 0,6·θ). Elle ne dépend ni de la forme ni de l'amplitude de la perturbation.",
    conclusion_courte: "La célérité dépend du milieu et de son état.",
    etapes: [
      { consigne: "Lisez les deux documents au mur.", court: "Lisez les documents.", verifier: ({ faits }) => (faits.docs_milieux || []).length >= 2 },
      { consigne: "Le son va beaucoup plus vite dans l'acier que dans l'air parce que…", court: "Répondez dans le carnet.", question: choix(["l'acier est beaucoup plus rigide : la perturbation se transmet plus vite de proche en proche", "l'acier est plus lourd", "l'air arrête le son"], "Relisez le premier document.", "Exact.") },
      { consigne: "Célérité du son dans l'air à 30 °C (m/s) ?", court: "v à 30 °C (m/s) ?", question: nombre("m/s", 349.4, 1.5, "v ≈ 331,4 + 0,6·θ.", "Exact : environ 349 m/s.") },
      { consigne: "Un éclair tombe à 1,7 km ; à 20 °C, on entend le tonnerre au bout de…", court: "Δt (s) ?", question: nombre("s", 4.96, 0.15, "Δt = d / v, avec d en mètres et v = 343 m/s.", "Exact : environ 5 s (la lumière arrive presque instantanément).") },
    ],
  };

  L.demarrer({ id: "b2_ondes1_a3_milieu", titre: "Laboratoire : célérité et milieu", paillasses: [L.poste_corde, L.poste_milieux], missions: [TENSION, INERTIE, MILIEUX] });
})(window.Labo);

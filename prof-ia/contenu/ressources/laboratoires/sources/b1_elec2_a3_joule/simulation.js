/*
Rôle : simulation de l'activité 3 du chapitre « Transfert d'énergie dans un circuit électrique » (1re année du bac) :
       vérification de la loi de Joule par calorimétrie (Q = R·I²·Δt) ; effet Joule utile ou nuisible dans la vie courante
       (lignes à haute tension, lampes). Objectif O3.
Reçoit : rien (les vérifications lisent les faits « joule », « tri_joule » et la feuille du tableur).
Produit : la simulation démarrée : loi de Joule ; effet Joule dans la vie courante.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const K = 0.2 * 4180 + 150, R = 4;
  const valides = (f) => ((f.joule || {}).essais || []).filter((e) => e.I !== null && e.t >= 200);
  const dernier = (f) => valides(f).slice(-1)[0] || { I: 0, t: 0, theta0: 0, theta1: 0 };

  function chauffe({ faits }) {
    // Une chauffe d'au moins 200 s avec le courant mesuré pendant toute sa durée.
    if (valides(faits).length) return true;
    const e = ((faits.joule || {}).essais || []).slice(-1)[0];
    if (!e) return false;
    return e.I === null ? "Le courant n'a pas été mesuré pendant toute la chauffe : ampèremètre en série (10A et COM, calibre 10 A) ; ne changez pas la tension pendant la chauffe." : "Chauffez plus longtemps : environ 300 s au chronomètre de chauffe.";
  }

  function tableau({ faits, feuille }) {
    // Trois chauffes à des intensités différentes : I, Δt, Q = 986·Δθ, R·I²·Δt.
    const l = feuille.lignes(["A", "B", "C", "D"]);
    if (l.length < 3) return false;
    for (const [k, r] of l.entries()) {
      const e = valides(faits).find((x) => Math.abs(x.I - r.A) < 0.006 && Math.abs(x.t - r.B) <= 1);
      if (!e) return `Ligne ${k + 2} : I (A) et Δt (s) d'une même chauffe mesurée.`;
      if (Math.abs(r.C - K * (e.theta1 - e.theta0)) > 0.02 * r.C + 5) return `Ligne ${k + 2} : Q = 986 × (θ1 − θ0).`;
      if (Math.abs(r.D - R * r.A * r.A * r.B) > 0.01 * r.D) return `Ligne ${k + 2} : R·I²·Δt, par exemple =4*A${k + 2}^2*B${k + 2}.`;
    }
    const I = l.map((r) => r.A);
    return Math.max(...I) - Math.min(...I) > 0.6 || "Trois intensités bien différentes : environ 6 V, 8 V et 10 V au générateur.";
  }

  const JOULE = {
    id: "joule", paillasse: 0, titre: "La loi de Joule",
    objectif: "Mesurer la chaleur dégagée par une résistance parcourue par un courant ; la comparer à R·I²·Δt.",
    entetes: ["I (A)", "Δt (s)", "Q (J)", "R·I²·Δt (J)"],
    donnees: ["Calorimètre : C = 150 J/K ; eau : m = 200 g ; c(eau) = 4180 J·kg⁻¹·K⁻¹", "Résistance chauffante : R = 4,0 Ω", "Chaleur reçue : Q = (m·c + C)·Δθ = 986 × Δθ"],
    conclusion: "Loi de Joule : un conducteur ohmique de résistance R, traversé par un courant d'intensité I pendant Δt, reçoit l'énergie électrique W = U·I·Δt = R·I²·Δt et la cède entièrement au milieu extérieur sous forme de chaleur : Q = R·I²·Δt ; puissance dissipée P = R·I². La chaleur est multipliée par 4 quand I double.",
    conclusion_courte: "Q = R·I²·Δt ; P = R·I².",
    etapes: [
      { consigne: "Montez en série le générateur, l'interrupteur, l'ampèremètre (bornes 10A et COM, calibre 10 A) et la résistance chauffante. Générateur sur 6 V : fermez l'interrupteur pendant 300 s environ (chronomètre de chauffe), puis ouvrez-le.", court: "Une chauffe de 300 s.", aide_geste: "Tirez un fil d'une borne à une autre ; fermez l'interrupteur d'un toucher ; agitez l'eau avec l'agitateur.", verifier: chauffe },
      { consigne: "Chaleur reçue par l'eau et le calorimètre pendant cette chauffe : Q = 986 × (θ1 − θ0).", court: "Q (J) ?", question: { type: "nombre", unite: "J", attendu: (f) => K * (dernier(f).theta1 - dernier(f).theta0), tolerance_relative: 0.03, aide: "θ0 : avant la chauffe ; θ1 : après.", bravo: "Exact." } },
      { consigne: "Calculez R·I²·Δt pour cette chauffe.", court: "R·I²·Δt (J) ?", question: { type: "nombre", unite: "J", attendu: (f) => R * dernier(f).I ** 2 * dernier(f).t, tolerance_relative: 0.03, aide: "R = 4,0 Ω, I en A, Δt en s.", bravo: "Exact : c'est presque la même valeur que Q." } },
      { consigne: "Refaites deux chauffes de 300 s, générateur sur 8 V puis sur 10 V (« Eau neuve » si besoin). Pour trois chauffes : I en A, Δt en B, Q = 986 × Δθ en C, R·I²·Δt en D.", court: "Tableur : A, B, C, D.", verifier: tableau },
      { consigne: "Comparez les colonnes C et D : la chaleur dégagée par la résistance…", court: "Répondez dans le carnet.", question: choix(["est égale à R·I²·Δt : c'est la loi de Joule", "est proportionnelle à I, et non à I²", "ne dépend pas de la durée"], "Comparez C et D, ligne par ligne.", "Exact : Q = R·I²·Δt.") },
      { consigne: "Même résistance, même durée : si l'intensité double, la chaleur dégagée est multipliée par…", court: "Facteur ?", question: { type: "nombre", unite: "", attendu: 4, tolerance: 0, aide: "Q est proportionnelle à I².", bravo: "Exact : (2I)² = 4 I²." } },
    ],
  };

  const EFFETS = {
    id: "effets_joule", paillasse: 1, titre: "L'effet Joule dans la vie courante",
    objectif: "Classer des situations où l'effet Joule est utile ou nuisible ; expliquer le transport sous haute tension.",
    entetes: [],
    conclusion: "L'effet Joule est utile dans les appareils de chauffage, les fusibles et les lampes à incandescence (le filament chauffé émet de la lumière) ; il est nuisible dans les moteurs, les générateurs, les composants électroniques et les lignes électriques (énergie perdue). Pour une même puissance P = U·I, une tension élevée donne un courant faible : les pertes R·I² dans les lignes sont plus petites.",
    conclusion_courte: "Utile (chauffage) ou nuisible (pertes) ; haute tension : I faible.",
    etapes: [
      { consigne: "Classez les huit étiquettes : effet Joule utile ou nuisible ?", court: "Classez les étiquettes.", verifier: ({ faits }) => L.tableau_tri.verifier(L.EFFETS_JOULE, faits.tri_joule) },
      { consigne: "On transporte l'électricité sous très haute tension (400 kV) parce que…", court: "Répondez dans le carnet.", question: choix(["pour une même puissance P = U·I, le courant est plus faible : les pertes R·I² dans les câbles sont plus petites", "le courant va plus vite", "les câbles ont alors une résistance nulle"], "Pertes dans un câble de résistance R : R·I².", "Exact.") },
      { consigne: "Dans une lampe à incandescence, le filament chauffé par effet Joule (environ 2500 °C) émet de la lumière ; mais l'essentiel de l'énergie électrique reçue est…", court: "Répondez dans le carnet.", question: choix(["cédé sous forme de chaleur : son rendement lumineux est faible (moins de 10 %)", "transformé en lumière", "transformé en énergie chimique"], "Une lampe à incandescence est très chaude.", "Exact : c'est pourquoi on la remplace par des lampes à DEL.") },
    ],
  };

  L.demarrer({ id: "b1_elec2_a3_joule", titre: "Laboratoire : loi de Joule", decor: "aucun", paillasses: [L.poste_joule, L.poste_effets_joule], missions: [JOULE, EFFETS] });
})(window.Labo);

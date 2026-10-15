/*
Rôle : simulation de l'activité 5 du chapitre « Équilibre d'un solide » (tronc commun) : « Effet de rotation d'une force ;
       moment d'un couple ; théorème des moments ; M = −C·θ ». Objectifs O5 (moment d'une force, moment d'un couple),
       O6 (conditions d'équilibre ΣF = 0 et ΣM = 0), O7 (couple de torsion, constante de torsion).
Reçoit : rien (les vérifications lisent la barre à trous, le pendule de torsion, le tableur et la courbe).
Produit : la simulation démarrée : barre à trous et masses marquées, pendule de torsion et masses à fente.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const G = 9.81, C = 0.02, R = 0.03;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const barre = (f) => f.barre || { masses: [] };
  const seule = (m, d) => ({ faits }) => { const b = barre(faits); return (b.masses.length === 1 && b.masses[0].m === m && b.masses[0].d === d) || false; };
  const equilibre = (test) => ({ faits }) => (faits.equilibres_barre || []).some(test) || false;
  const theta = (m) => ((2 * m * G * R) / C) * (180 / Math.PI);

  function tableau({ feuille, faits }) {
    // m par fil (kg), M = 2·m·g·r (N·m), θ lu (°), θ (rad), pour au moins 3 configurations à masses égales.
    const vues = (faits.torsion_mesures || []).map((x) => x.m), lignes = feuille.lignes(["A", "B", "C", "D"]);
    for (const [k, l] of lignes.entries()) {
      if (!vues.some((m) => Math.abs(m - l.A) < 1e-6)) return `Ligne ${k + 2} : la masse ${L.nombre(l.A, 3)} kg par fil n'a pas été essayée (porte-masses de 10 g compris).`;
      if (Math.abs(l.B - 2 * l.A * G * R) > 2e-4) return `Ligne ${k + 2} : M = F·d = m·g × 0,06 (par exemple =2*A${k + 2}*9,81*0,03).`;
      if (Math.abs(l.C - theta(l.A)) > 1.5) return `Ligne ${k + 2} : relisez l'angle θ indiqué par l'aiguille (en degrés).`;
      if (Math.abs(l.D - (l.C * Math.PI) / 180) > 0.005) return `Ligne ${k + 2} : θ (rad) = θ (°) × π / 180.`;
    }
    return lignes.length >= 3 || false;
  }

  const MOMENTS = {
    id: "moments", paillasse: 0, titre: "Le moment d'une force",
    objectif: "Une barre peut tourner autour d'un axe fixe. Quand une force la fait-elle tourner ? Quand reste-t-elle en équilibre ?",
    entetes: [],
    conclusion: "Moment d'une force par rapport à l'axe : M = F·d (N·m), d distance de l'axe à la droite d'action. Équilibre : la somme algébrique des moments est nulle.",
    conclusion_courte: "Équilibre : ΣM = 0.",
    etapes: [
      { consigne: "Accrochez la masse de 100 g au trou situé à 15 cm à droite de l'axe, et observez.", court: "100 g à 15 cm à droite.", verifier: seule(0.1, 15), aide_geste: "Les nombres sur la barre sont les distances à l'axe, en cm." },
      { consigne: "Le poids de la masse fait tourner la barre autour de l'axe. Cet effet de rotation dépend…", court: "Répondez dans le carnet.", question: choix(["de la valeur de la force et de la distance de sa droite d'action à l'axe", "seulement de la masse", "de la couleur de la barre"], "Pensez à une porte qu'on pousse près ou loin des gonds.", "Exact.") },
      { consigne: "Déplacez la masse au trou du milieu, sur l'axe.", court: "La masse sur l'axe.", verifier: seule(0.1, 0) },
      { consigne: "Une force dont la droite d'action passe par l'axe de rotation…", court: "Répondez dans le carnet.", question: choix(["n'a pas d'effet de rotation : son moment est nul", "fait tourner la barre très vite", "casse l'axe"], "La barre a-t-elle tourné ?", "Exact : d = 0, donc M = 0.") },
      { consigne: "Accrochez la masse de 200 g à 10 cm à gauche, puis cherchez où mettre la masse de 100 g, à droite, pour équilibrer la barre.", court: "Équilibrez 200 g à gauche avec 100 g.", verifier: equilibre((c) => c.length === 2 && c.some((x) => x.m === 0.2 && x.d === -10) && c.some((x) => x.m === 0.1 && x.d === 20)) },
      { consigne: "Comparez le moment M1 = P1·d1 de la masse de 200 g et le moment M2 = P2·d2 de la masse de 100 g.", court: "Répondez dans le carnet.", question: choix(["ils sont égaux : leurs effets de rotation, de sens contraires, se compensent", "M1 est deux fois plus grand", "ils sont nuls"], "P1 = 0,2 × 9,81 N, d1 = 0,10 m ; P2 = 0,1 × 9,81 N, d2 = 0,20 m.", "Exact.") },
      { consigne: "Trouvez un autre équilibre avec au moins trois masses accrochées.", court: "Un équilibre à trois masses.", verifier: equilibre((c) => c.length >= 3) },
      { consigne: "Théorème des moments : à l'équilibre d'un solide mobile autour d'un axe fixe, la somme algébrique des moments des forces…", court: "Répondez dans le carnet.", question: choix(["est nulle (et la somme vectorielle des forces aussi)", "est égale au poids", "est toujours positive"], "Comptez positivement un sens de rotation, négativement l'autre.", "Exact.") },
      { consigne: "Quel est le moment d'une force de 2 N dont la droite d'action est à 15 cm de l'axe (en N·m) ?", court: "Moment (N·m) ?", question: { type: "nombre", unite: "N·m", attendu: 0.3, tolerance: 0.005, aide: "M = F·d avec d en mètre.", bravo: "Exact." } },
    ],
  };

  const TORSION = {
    id: "torsion", paillasse: 1, titre: "Le couple de torsion",
    objectif: "Un couple de deux forces fait tourner le tambour fixé sur un fil d'acier : le fil se tord. Quelle relation entre le moment du couple et l'angle de torsion ?",
    entetes: ["m par fil (kg)", "M (N·m)", "θ (°)", "θ (rad)"],
    conclusion: "Le fil tordu exerce un couple de torsion de moment M = −C·θ (C : constante de torsion, en N·m/rad). À l'équilibre, il compense le moment du couple appliqué.",
    conclusion_courte: "Couple de torsion : M = −C·θ.",
    etapes: [
      { consigne: "Mettez la même masse sur les deux porte-masses (10 g chacun, à vide) : par exemple une masse de 10 g de chaque côté.", court: "Même masse des deux côtés.", verifier: ({ faits }) => (faits.torsion && faits.torsion.m1 === faits.torsion.m2 && faits.torsion.m1 >= 0.02) || false },
      { consigne: "Les deux fils exercent sur le tambour deux forces de même valeur, parallèles et de sens contraires. C'est…", court: "Répondez dans le carnet.", question: choix(["un couple de forces : son moment est M = F·d (d = 6 cm, distance entre les deux fils)", "une force unique", "un système sans effet"], "Le tambour tourne sans se déplacer.", "Exact : le moment d'un couple ne dépend pas de l'axe.") },
      { consigne: "Pour au moins 3 charges égales des deux côtés : m par fil (kg) en A, M = 2·m·g·r (N·m, r = 0,03 m) en B, l'angle θ lu (°) en C, θ en radian en D.", court: "Tableur : m, M, θ (°), θ (rad).", verifier: tableau, aide_geste: "Attendez que l'aiguille s'immobilise avant de lire θ." },
      { consigne: "Tracez M en fonction de θ (en radian) et modélisez.", court: "Tracez M en fonction de θ.", verifier: ({ courbe }) => courbe.x === "D" && courbe.y === "B" && courbe.n >= 3 && courbe.modele !== "aucun" },
      { consigne: "D'après le modèle, quelle est la constante de torsion C du fil (en N·m/rad) ?", court: "C (N·m/rad) ?", question: { type: "nombre", unite: "N·m/rad", attendu: C, tolerance_relative: 0.08, aide: "C est le coefficient directeur de la droite.", bravo: "Exact." } },
      { consigne: "On écrit le moment du couple de torsion M = −C·θ. Le signe « − » signifie que…", court: "Répondez dans le carnet.", question: choix(["le couple de torsion s'oppose à la rotation : il ramène l'aiguille vers le zéro", "le fil tourne dans le même sens que le couple", "C est négative"], "Que fait l'aiguille si on retire les masses ?", "Exact.") },
    ],
  };

  L.demarrer({
    id: "tc_meca5_a5_moments", titre: "Laboratoire : moments et couples",
    paillasses: [
      (g) => { L.barre_moments(g); return { pense_bete: L.decor.pense_bete(g, 24, 52, 230) }; },
      (g) => { L.torsion(g, C); return { pense_bete: L.decor.pense_bete(g, 24, 52, 160) }; },
    ],
    missions: [MOMENTS, TORSION],
  });
})(window.Labo);

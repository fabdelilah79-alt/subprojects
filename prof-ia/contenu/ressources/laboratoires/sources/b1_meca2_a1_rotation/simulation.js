/*
Rôle : simulation du chapitre « Travail et puissance d'une force » (1re année du bac), activité de la fiche, partie
       rotation : travail d'une force de moment constant (poulie à deux gorges, W = M·Δθ), travail d'un couple moteur de
       moment constant, puissance moyenne et instantanée (treuil électrique : P = W/Δt = F·v = M·ω). Objectifs O4 et O5.
Reçoit : rien (les vérifications lisent les faits « poulie » et « treuil » et la feuille de calcul).
Produit : la simulation démarrée : poulie à deux gorges ; treuil électrique.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const G = 9.81, M_P = 0.6 * G * 0.015, M_T = 0.5 * G * 0.02;
  const po = (f) => f.poulie || {}, tr = (f) => f.treuil || {};
  const essai = (f, U) => (tr(f).essais || []).find((e) => e.m === 0.5 && Math.abs(e.U - U) < 0.05);
  const P6 = (f) => { const e = essai(f, 6); return e ? (0.5 * G * 0.6) / e.dt : 0; };

  function tableau_poulie({ faits, feuille }) {
    // Trois arrêts : θ (rad), h (m), W(F) = M·θ, W(P) = −m·g·h.
    const l = feuille.lignes(["A", "B", "C", "D"]), arrets = po(faits).arrets || [];
    if (l.length < 3) return false;
    for (const [k, r] of l.slice(0, 3).entries()) {
      const a = arrets.find((x) => Math.abs(x.theta - r.A) < 0.06);
      if (!a) return `Ligne ${k + 2} : θ en radians (colonne A), lu sur la poulie à l'un de vos arrêts (=degrés*PI()/180).`;
      if (Math.abs(r.B - a.h) > 0.003) return `Ligne ${k + 2} : h en mètres, lue sur la règle au repère rouge de la masse.`;
      if (Math.abs(r.C - M_P * r.A) > 0.03 * Math.abs(r.C) + 0.001) return `Ligne ${k + 2} : W(F) = M × θ, avec M = F × R.`;
      if (Math.abs(r.D + 0.6 * G * r.B) > 0.03 * Math.abs(r.D) + 0.001) return `Ligne ${k + 2} : W(P) = −m × g × h (négatif : la masse monte).`;
    }
    return new Set(l.slice(0, 3).map((r) => Math.round(r.A * 5))).size === 3 || "Trois arrêts bien différents.";
  }

  const POULIE = {
    id: "poulie", paillasse: 0, titre: "Travail d'une force de moment constant",
    objectif: "Faire tourner une poulie à deux gorges avec une force de moment constant ; montrer que son travail est W = M·Δθ.",
    entetes: ["θ (rad)", "h (m)", "W(F) (J)", "W(P) (J)"],
    donnees: ["R = 5,0 cm ; r = 1,5 cm ; m = 600 g ; g = 9,81 N/kg", "M(F) = F × R", "W = M × Δθ (Δθ en rad)"],
    conclusion: "Une force F de moment constant M = F·R par rapport à l'axe d'un solide en rotation travaille : pour une rotation Δθ (en radians), W = M·Δθ. En effet, son point d'application parcourt l'arc R·Δθ en restant tangent à la trajectoire : W = F·R·Δθ. Quand la rotation est uniforme, la somme des moments est nulle : F·R = m·g·r, et le travail de F compense celui du poids : W(F) = −W(P) = m·g·h, avec h = r·Δθ.",
    conclusion_courte: "W = M·Δθ (J, N·m, rad).",
    etapes: [
      { consigne: "Tirez lentement l'anneau du dynamomètre vers le bas : le ressort s'allonge, puis la poulie tourne et la masse monte à vitesse constante.", court: "Faites monter la masse.", aide_geste: "Glissez l'anneau vers le bas ; lâché, il reste tenu.", verifier: ({ faits }) => (po(faits).theta || 0) > 0.3 },
      { consigne: "Lisez F au dynamomètre. Quel est le moment de F par rapport à l'axe, M(F) = F × R ?", court: "M(F) (N·m) ?", question: { type: "nombre", unite: "N·m", attendu: M_P, tolerance: 0.004, aide: "R = 5,0 cm = 0,050 m.", bravo: "Exact." } },
      { consigne: "Pendant la montée, le moment du poids de la masse (par le fil de la petite gorge) vaut −m·g·r. On constate que…", court: "Répondez dans le carnet.", question: choix(["F·R = m·g·r : les moments se compensent, la rotation est uniforme", "F·R est plus grand que m·g·r", "F = m·g"], "Calculez m·g·r avec r = 0,015 m.", "Exact.") },
      { consigne: "Arrêtez-vous trois fois (lâchez l'anneau), par exemple vers 60°, 120° et 200°. À chaque arrêt, lisez θ sous l'index rouge de la poulie et h sur la règle de la masse.", court: "Trois arrêts.", verifier: ({ faits }) => { const a = (po(faits).arrets || []).map((x) => x.theta); return a.some((x) => x > 0.7) && a.some((x) => x > 1.8) && a.some((x) => x > 3); } },
      { consigne: "Tableur, une ligne par arrêt : θ en radians en A (=degrés*PI()/180), h (m) en B, W(F) = M × θ en C, W(P) = −m·g·h en D.", court: "Tableur : θ, h, W(F), W(P).", verifier: tableau_poulie },
      { consigne: "Les colonnes C et D montrent que…", court: "Répondez dans le carnet.", question: choix(["W(F) = −W(P) : travail moteur pour F, résistant pour le poids", "W(F) = W(P)", "W(F) = 0"], "Comparez C et D, ligne par ligne.", "Exact.") },
      { consigne: "Le travail d'une force de moment constant M pour une rotation Δθ est…", court: "Répondez dans le carnet.", question: choix(["W = M·Δθ, avec Δθ en radians", "W = M / Δθ", "W = M·Δθ, avec Δθ en degrés"], "W = F × (R·Δθ) : l'arc parcouru s'exprime avec Δθ en radians.", "Exact.") },
      { consigne: "Quel serait le travail de F pour un tour complet de la poulie ?", court: "W (J) pour un tour ?", question: { type: "nombre", unite: "J", attendu: M_P * 2 * Math.PI, tolerance: 0.02, aide: "Un tour : Δθ = 2π rad.", bravo: "Exact." } },
    ],
  };

  function tableau_treuil({ faits, feuille }) {
    // Trois montées de la masse de 500 g : Δt, P = m·g·Δh/Δt, N (tr/min), M·ω.
    const l = feuille.lignes(["A", "B", "C", "D"]), es = (tr(faits).essais || []).filter((e) => e.m === 0.5);
    if (l.length < 3) return false;
    for (const [k, r] of l.slice(0, 3).entries()) {
      const e = es.find((x) => Math.abs(x.dt - r.A) < 0.01);
      if (!e) return `Ligne ${k + 2} : Δt (colonne A), lue au chronomètre pour une montée de la masse de 500 g.`;
      if (Math.abs(r.B - (0.5 * G * 0.6) / r.A) > 0.02 * r.B) return `Ligne ${k + 2} : P = m × g × Δh / Δt.`;
      if (Math.abs(r.C - e.N) > 2) return `Ligne ${k + 2} : N (tr/min), lu au compte-tours pendant cette montée.`;
      if (Math.abs(r.D - (M_T * 2 * Math.PI * r.C) / 60) > 0.02 * r.D) return `Ligne ${k + 2} : M × ω, avec M = m·g·r et ω = 2π·N / 60.`;
    }
    return new Set(l.slice(0, 3).map((r) => Math.round(r.A * 20))).size === 3 || "Trois tensions différentes.";
  }

  const PUISSANCE = {
    id: "puissance", paillasse: 1, titre: "Puissance d'un treuil électrique",
    objectif: "Mesurer la puissance d'un moteur qui monte une charge ; relier P = W/Δt, P = F·v et P = M·ω.",
    entetes: ["Δt (s)", "P = m·g·Δh/Δt (W)", "N (tr/min)", "M·ω (W)"],
    donnees: ["m = 500 g ; g = 9,81 N/kg ; Δh = 0,600 m", "Tambour : r = 2,0 cm ; M = m·g·r", "ω = 2π·N / 60"],
    conclusion: "La puissance moyenne d'une force est le travail qu'elle fournit par seconde : P = W / Δt (en watts, 1 W = 1 J/s). Sa puissance instantanée est P = F·v en translation et P = M·ω en rotation. Quand la vitesse est constante, la puissance instantanée est égale à la puissance moyenne. Pour un même travail, plus la durée est courte, plus la puissance est grande.",
    conclusion_courte: "P = W/Δt = F·v = M·ω (W).",
    etapes: [
      { consigne: "Accrochez la masse de 500 g au crochet du treuil.", court: "Masse de 500 g.", aide_geste: "Glissez la masse sous le crochet.", verifier: ({ faits }) => tr(faits).m === 0.5 },
      { consigne: "Réglez la tension sur 6,0 V, puis appuyez sur Monter. Le chronomètre mesure la durée Δt de la montée entre les deux cellules.", court: "Montée à 6,0 V.", verifier: ({ faits }) => !!essai(faits, 6) },
      { consigne: "Quel est le travail du poids de la masse entre les deux cellules ?", court: "W(P) (J) ?", question: { type: "nombre", unite: "J", attendu: -0.5 * G * 0.6, tolerance: 0.05, aide: "W(P) = −m·g·Δh : la masse monte.", bravo: "Exact." } },
      { consigne: "La masse monte à vitesse constante : le moteur fournit le travail W = m·g·Δh. Quelle est sa puissance moyenne ?", court: "P (W) à 6,0 V ?", question: { type: "nombre", unite: "W", attendu: P6, tolerance_relative: 0.03, aide: "P = W / Δt.", bravo: "Exact." } },
      { consigne: "Entre les cellules, la vitesse est constante. La puissance instantanée P = F·v est…", court: "Répondez dans le carnet.", question: choix(["égale à la puissance moyenne", "nulle", "plus grande que la puissance moyenne"], "v = Δh / Δt ne change pas.", "Exact.") },
      { consigne: "Le moteur exerce sur le tambour un couple de moment M = m·g·r. Combien vaut M ?", court: "M (N·m) ?", question: { type: "nombre", unite: "N·m", attendu: M_T, tolerance: 0.003, aide: "r = 2,0 cm = 0,020 m.", bravo: "Exact." } },
      { consigne: "De quel angle Δθ le tambour tourne-t-il pendant la montée de 60,0 cm ?", court: "Δθ (rad) ?", question: { type: "nombre", unite: "rad", attendu: 30, tolerance: 0.5, aide: "Le fil s'enroule : Δh = r·Δθ.", bravo: "Exact : environ 4,8 tours." } },
      { consigne: "Quel est le travail du couple moteur pendant cette montée ?", court: "W (J) ?", question: { type: "nombre", unite: "J", attendu: M_T * 30, tolerance: 0.05, aide: "W = M·Δθ.", bravo: "Exact : c'est m·g·Δh." } },
      { consigne: "Recommencez à 4,0 V et à 9,0 V (appuyez sur Descendre pour ramener la masse en bas avant chaque montée).", court: "Montées à 4,0 V et 9,0 V.", verifier: ({ faits }) => !!(essai(faits, 4) && essai(faits, 9)) },
      { consigne: "Tableur, une ligne par montée : Δt en A, P = m·g·Δh/Δt en B, N lu au compte-tours en C, M·ω en D (=0,0981*2*PI()*C2/60).", court: "Tableur : Δt, P, N, M·ω.", verifier: tableau_treuil },
      { consigne: "Le travail fourni est le même pour les trois montées. La puissance…", court: "Répondez dans le carnet.", question: choix(["est d'autant plus grande que la montée est rapide", "est la même pour les trois montées", "diminue quand la vitesse augmente"], "Comparez les colonnes A et B.", "Exact.") },
      { consigne: "Le watt est égal à…", court: "Répondez dans le carnet.", question: choix(["1 J/s", "1 J·s", "1 N·m"], "P = W / Δt.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_meca2_a1_rotation", titre: "Laboratoire : travail et puissance en rotation", paillasses: [L.poste_poulie, L.poste_treuil], missions: [POULIE, PUISSANCE] });
})(window.Labo);

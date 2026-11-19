/*
Rôle : simulation de l'activité 3 du chapitre « Le travail, mode de transfert d'énergie » (1re année du bac) : établir
       l'énergie potentielle de pesanteur à partir du travail du poids, avec l'appareil de chute libre (bille lâchée
       par un électroaimant, deux cellules photoélectriques) : ΔEc = W(P) = −Δ(m·g·z), Epp = m·g·z + cte, état de
       référence. Objectif O3.
Reçoit : rien (les vérifications lisent le fait « chute », la feuille de calcul et le graphique).
Produit : la simulation démarrée : appareil de chute libre.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const M = 0.033, G = 9.81, D = 0.02;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const es = (f) => ((f.chute || {}).essais || []).filter((e) => Math.abs(e.z1 - 0.9) < 1e-6);
  const premier = (f) => es(f)[0] || { z1: 0.9, z2: 0.4, dt1: 1, dt2: 1 };

  function tableau({ faits, feuille }) {
    // Cinq lâchers (cellule 1 à 90 cm) : z2, v2 = d/Δt2, ΔEc = ½m(v2² − v1²), m·g·z2.
    const l = feuille.lignes(["A", "B", "C", "D"]), v1 = D / premier(faits).dt1;
    if (l.length < 5) return false;
    for (const [k, r] of l.entries()) {
      const e = es(faits).find((x) => Math.abs(x.z2 - r.A) < 0.001);
      if (!e) return `Ligne ${k + 2} : z2 (m), hauteur de la cellule 2 lors d'un de vos lâchers (cellule 1 à 90 cm).`;
      if (Math.abs(r.B - D / e.dt2) > 0.01 * r.B) return `Ligne ${k + 2} : v2 = d / Δt2 = 0,0200 / Δt2 (Δt2 en secondes).`;
      if (Math.abs(r.C - 0.5 * M * (r.B * r.B - v1 * v1)) > 0.0006 + 0.03 * Math.abs(r.C)) return `Ligne ${k + 2} : ΔEc = ½ × 0,033 × (v2² − v1²), avec v1 = d / Δt1.`;
      if (Math.abs(r.D - M * G * r.A) > 0.01 * r.D) return `Ligne ${k + 2} : m·g·z2 = 0,033 × 9,81 × z2.`;
    }
    return new Set(l.map((r) => r.A)).size >= 5 || "Cinq hauteurs z2 différentes.";
  }

  const EPP = {
    id: "epp", paillasse: 0, titre: "Énergie potentielle de pesanteur",
    objectif: "Relier la variation d'énergie cinétique d'une bille en chute libre au travail de son poids ; en déduire l'énergie potentielle de pesanteur.",
    entetes: ["z2 (m)", "v2 (m/s)", "ΔEc (J)", "m·g·z2 (J)"],
    donnees: ["Bille : m = 33,0 g ; d = 2,00 cm ; g = 9,81 N/kg", "v ≈ d / Δt", "z : hauteur au-dessus de la paillasse"],
    conclusion: "Près de la Terre, le travail du poids d'un corps entre deux positions est W(P) = m·g·(z1 − z2) = −Δ(m·g·z). On définit l'énergie potentielle de pesanteur Epp = m·g·z + cte, avec l'axe Oz vers le haut : W(P) = −ΔEpp. La constante dépend de l'état de référence choisi (Epp = 0) ; la variation ΔEpp entre deux positions n'en dépend pas.",
    conclusion_courte: "Epp = m·g·z + cte ; W(P) = −ΔEpp.",
    etapes: [
      { consigne: "Laissez la cellule 1 à 90 cm et placez la cellule 2 vers 40 cm. Appuyez sur « Lâcher » : lisez Δt1 et Δt2 au chronomètre.", court: "Premier lâcher.", aide_geste: "Glissez une cellule le long de la tige ; « Remonter » replace la bille.", verifier: ({ faits }) => es(faits).length >= 1 },
      { consigne: "Quelle est la vitesse v1 de la bille au passage de la cellule 1 ?", court: "v1 (m/s) ?", question: { type: "nombre", unite: "m/s", attendu: (f) => D / premier(f).dt1, tolerance_relative: 0.02, aide: "v1 = d / Δt1, avec d = 0,0200 m et Δt1 en secondes.", bravo: "Exact." } },
      { consigne: "Quel est le travail du poids de la bille entre les deux cellules ?", court: "W(P) (J) ?", question: { type: "nombre", unite: "J", attendu: (f) => M * G * (premier(f).z1 - premier(f).z2), tolerance: 0.003, aide: "W(P) = m·g·(z1 − z2).", bravo: "Exact." } },
      { consigne: "La cellule 1 restant à 90 cm, faites au moins cinq lâchers avec la cellule 2 à cinq hauteurs différentes, entre 20 et 80 cm.", court: "Cinq hauteurs z2.", verifier: ({ faits }) => new Set(es(faits).map((e) => e.z2)).size >= 5 },
      { consigne: "Tableur, une ligne par lâcher : z2 en A, v2 = 0,0200/Δt2 en B, ΔEc = ½·m·(v2² − v1²) en C, m·g·z2 en D.", court: "Tableur : z2, v2, ΔEc, m·g·z2.", verifier: tableau },
      { consigne: "Tracez ΔEc (colonne C) en fonction de m·g·z2 (colonne D).", court: "Graphique ΔEc = f(m·g·z2).", verifier: ({ courbe: c }) => (c.x === "D" && c.y === "C" && c.n >= 5) || false },
      { consigne: "Le graphique est une droite de coefficient directeur −1 : ΔEc = W(P) = −Δ(m·g·z). En posant Epp = m·g·z + cte, on a…", court: "Répondez dans le carnet.", question: choix(["W(P) = −ΔEpp", "W(P) = ΔEpp", "W(P) = Epp"], "Quand la bille descend, W(P) > 0 et z diminue.", "Exact.") },
      { consigne: "On choisit le sol de la salle, 80,0 cm sous la paillasse, comme état de référence (Epp = 0). Quelle est l'énergie potentielle de la bille contre l'électroaimant (z = 1,100 m au-dessus de la paillasse) ?", court: "Epp (J) ?", question: { type: "nombre", unite: "J", attendu: M * G * 1.9, tolerance: 0.005, aide: "Hauteur au-dessus du sol : 1,100 + 0,800 m.", bravo: "Exact." } },
      { consigne: "Changer d'état de référence change la valeur de Epp ; la variation ΔEpp entre deux positions…", court: "Répondez dans le carnet.", question: choix(["ne change pas", "double", "change de signe"], "La constante s'élimine dans la différence.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_meca3_a3_potentielle", titre: "Laboratoire : énergie potentielle de pesanteur", paillasses: [(g) => { L.chute_libre(g); return { pense_bete: L.decor.pense_bete(g, 24, 52, 230) }; }], missions: [EPP] });
})(window.Labo);

/*
Rôle : les trois paillasses des associations de résistances : (1) trois résistances sur support et un ohmmètre ;
       (2) planche de fils résistants (constantan, cuivre) et ohmmètre ; (3) diviseur de tension : générateur 12 V,
       deux résistances et voltmètre. Les valeurs réelles des résistances s'écartent un peu des valeurs du code.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_resistances, Labo.poste_fils, Labo.poste_diviseur (groupe) -> { pense_bete } ; faits notés :
          « ohm » = { nom, valeur } (lecture reconnue), « resistances » = { <nom> : valeur (Ω) } (paillasses 1 et 2),
          « tensions_diviseur » = { <nom> : valeur (V) } (paillasse 3).
Utilisé par : simulation.js.
*/
(function (L) {
  const R = { R1: 98.6, R2: 223.4, R3: 1012 };
  L.VALEURS_ASSOCIATIONS = R;

  function candidats() {
    // Valeurs attendues pour chaque résistance seule et chaque association de deux résistances.
    const c = { ...R }, noms = Object.keys(R);
    for (const [k, a] of noms.entries()) for (const b of noms.slice(k + 1)) {
      c[`serie_${a}_${b}`] = R[a] + R[b];
      c[`parallele_${a}_${b}`] = (R[a] * R[b]) / (R[a] + R[b]);
    }
    return c;
  }

  const par_valeur = (attendus) => (m) => Object.keys(attendus).find((k) => Math.abs(m.valeur - attendus[k]) < 0.003 * attendus[k] + 0.11);

  function suivre_ohmmetre(c, m, reconnaitre) {
    // Reconnaît ce que mesure l'ohmmètre (reconnaitre(m) -> nom) et range les mesures.
    const vues = {};
    c.sur_calcul(() => {
      const mode = L.MULTIMETRE_MODES.find((k) => k.nom === m.mode), ok = mode.type === "R" && !m.depasse;
      const nom = ok ? reconnaitre(m) : null;
      L.missions.noter("ohm", ok ? { nom: nom || null, valeur: Math.round(m.valeur * 1000) / 1000, mode: m.mode } : null);
      if (nom) { vues[nom] = Math.round(m.valeur * 1000) / 1000; L.missions.noter("resistances", { ...vues }); }
    });
    c.calculer();
  }

  L.poste_resistances = function (g) {
    // Paillasse 1 : R1 (100 Ω), R2 (220 Ω), R3 (1 kΩ) et le multimètre.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    [["R1", 100], ["R2", 220], ["R3", 1000]].forEach(([nom, r], k) => L.resistance(c, { id: nom.toLowerCase(), x: 140 + k * 190, y: 240, R: r, R_reelle: R[nom], nom }));
    suivre_ohmmetre(c, L.multimetre(c, { x: 820, y: 230 }), par_valeur(candidats()));
    return { pense_bete };
  };

  L.poste_fils = function (g) {
    // Paillasse 2 : quatre fils tendus sur une planche ; R = ρ·l/S.
    const { pense_bete } = L.decor_circuit(g, 1), c = L.circuit(g);
    const fils = [
      { nom: "F1", matiere: "constantan", rho: 4.9e-7, l: 1, S: 0.05 }, { nom: "F2", matiere: "constantan", rho: 4.9e-7, l: 0.5, S: 0.05 },
      { nom: "F3", matiere: "constantan", rho: 4.9e-7, l: 1, S: 0.1 }, { nom: "F4", matiere: "cuivre", rho: 1.7e-8, l: 1, S: 0.05 },
    ];
    L.fils_resistants(c, { x: 60, y: 206, fils });
    // Le fil mesuré est reconnu par les bornes où sont branchés les fils de l'ohmmètre (F2 et F3 ont la même résistance).
    const entre = (m, f) => [[1, 2], [2, 1]].some(([p, q]) => c.meme_noeud(`${m.id}.VΩ`, `fils.${f.nom}${p}`) && c.meme_noeud(`${m.id}.COM`, `fils.${f.nom}${q}`));
    suivre_ohmmetre(c, L.multimetre(c, { x: 820, y: 230 }), (m) => (fils.find((f) => entre(m, f)) || {}).nom);
    return { pense_bete };
  };

  L.poste_diviseur = function (g) {
    // Paillasse 3 : générateur 12 V (P, N), R1 = 1 kΩ (A, B), R2 = 470 Ω (C, D), voltmètre.
    const { pense_bete } = L.decor_circuit(g, 2), c = L.circuit(g), vues = {};
    L.generateur(c, { x: 40, y: 196, E: 12, lettres: ["N", "P"] });
    L.resistance(c, { id: "ra", x: 330, y: 300, R: 1000, R_reelle: 985, nom: "R1", lettres: ["A", "B"] });
    L.resistance(c, { id: "rb", x: 520, y: 300, R: 470, R_reelle: 476, nom: "R2", lettres: ["C", "D"] });
    const m = L.multimetre(c, { x: 820, y: 230 }), points = { P: "generateur.+", N: "generateur.−", A: "ra.1", B: "ra.2", C: "rb.1", D: "rb.2" };
    c.sur_calcul(() => {
      const t = L.tension_mesuree(c, m, points), serie = c.meme_noeud("ra.2", "rb.1") || c.meme_noeud("ra.1", "rb.2");
      L.missions.noter("diviseur_monte", serie);
      if (t && serie) { vues[t.nom] = t.valeur; L.missions.noter("tensions_diviseur", { ...vues }); }
    });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

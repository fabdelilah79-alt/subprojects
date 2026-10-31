/*
Rôle : paillasses du transistor NPN : (1) effet transistor : G1 réglable et R_B = 10 kΩ dans le circuit de base, G2 = 6 V
       et une lampe 6 V – 0,1 A dans le circuit du collecteur ; (2) mesures : G1 réglable, R_B = 47 kΩ, G2 = 9 V,
       R_C = 220 Ω, trois ampèremètres (base, collecteur, émetteur) ; (3) détecteur d'obscurité déjà câblé : R1 = 47 kΩ,
       photorésistance, transistor, DEL ; l'élève branche l'alimentation 6 V.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_effet, Labo.poste_mesures_transistor, Labo.poste_detecteur (groupe) -> { pense_bete } ; faits notés
          « effet » = { monte, regime, eclat }, « courants_transistor » = [{ IB, IC, IE } (mA)], « detecteur » = { alimente, del }.
Utilisé par : simulation.js.
*/
(function (L) {
  const mA = (v) => Math.round(Math.abs(v) * 1e6) / 1000;

  L.poste_effet = function (g) {
    // Paillasse 1 : on fait varier la tension de G1 et on observe la lampe du circuit du collecteur.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g), vus = new Set();
    L.generateur(c, { id: "g1", x: 40, y: 196, E: 0, reglable: true, nom: "G1" });
    L.generateur(c, { id: "g2", x: 40, y: 360, E: 6, nom: "G2" });
    L.resistance(c, { id: "rb", x: 290, y: 230, R: 10000, R_reelle: 10050, nom: "RB" });
    const t = L.transistor(c, { x: 290, y: 400 }), lampe = L.lampe(c, { id: "lampe", x: 520, y: 230, I_n: 0.1, etiquette: "L" });
    c.sur_calcul(() => {
      const collecteur = Math.abs(Math.abs(lampe.i) - Math.abs(t.IC)) < 1e-4 + 0.01 * Math.abs(t.IC) && c.meme_noeud("t.E", "g2.−");
      const monte = collecteur && c.meme_noeud("t.E", "g1.−") && [["1", "2"], ["2", "1"]].some(([p, q]) => c.meme_noeud(`rb.${p}`, "g1.+") && c.meme_noeud(`rb.${q}`, "t.B"));
      if (monte) vus.add(t.regime);
      L.missions.noter("effet", { monte, regime: t.regime, eclat: Math.round(lampe.eclat * 100) / 100, vus: [...vus] });
    });
    c.calculer();
    return { pense_bete };
  };

  L.poste_mesures_transistor = function (g) {
    // Paillasse 2 : trois ampèremètres mesurent I_B, I_C et I_E ; chaque mesure complète est enregistrée.
    const { pense_bete } = L.decor_circuit(g, 1), c = L.circuit(g), points = {};
    L.generateur(c, { id: "g1", x: 40, y: 196, E: 0, reglable: true, nom: "G1" });
    L.generateur(c, { id: "g2", x: 40, y: 360, E: 9, nom: "G2" });
    L.resistance(c, { id: "rb", x: 290, y: 230, R: 47000, R_reelle: 46600, nom: "RB" });
    L.resistance(c, { id: "rc", x: 290, y: 380, R: 220, R_reelle: 221, nom: "RC" });
    const t = L.transistor(c, { id: "tm", x: 480, y: 470 });
    const [ab, ac, ae] = [["AB", 420], ["AC", 590], ["AE", 760]].map(([nom, x]) => L.multimetre(c, { id: nom, x, y: 186, etiquette: nom.replace("A", "A ") }));
    const lit = (m, i) => (L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {}).type === "A" && !m.depasse && Math.abs(Math.abs(m.valeur) - Math.abs(i)) < 0.01 * Math.abs(i) + 2e-6;
    c.sur_calcul(() => {
      if (t.IB < 1e-6 || !lit(ab, t.IB) || !lit(ac, t.IC) || !lit(ae, t.IE)) return;
      points[mA(ab.valeur).toFixed(3)] = { IB: mA(ab.valeur), IC: mA(ac.valeur), IE: mA(ae.valeur) };
      L.missions.noter("courants_transistor", Object.values(points).sort((p, q) => p.IB - q.IB));
    });
    c.calculer();
    return { pense_bete };
  };

  L.poste_detecteur = function (g) {
    // Paillasse 3 : montage déjà câblé par le professeur ; il ne manque que l'alimentation.
    const { pense_bete } = L.decor_circuit(g, 2), c = L.circuit(g);
    L.generateur(c, { id: "g", x: 40, y: 196, E: 6 });
    L.resistance(c, { id: "r1", x: 290, y: 230, R: 47000, R_reelle: 47300, nom: "R1" });
    const ldr = L.photoresistance(c, { x: 60, y: 380, lampe: { x: 250, y: 396 }, cache: { x: 250, y: 340 } });
    L.transistor(c, { id: "td", x: 480, y: 380 });
    const del = L.del(c, { x: 480, y: 230 });
    const fils = [["r1.2", "td.B", "#3c9a4a"], ["ldr.1", "td.B", "#3c9a4a"], ["ldr.2", "td.E", "#25282b"], ["del.−", "td.C", "#2f6fd0"], ["del.+", "r1.1", "#d32f2f"]];
    for (const [a, b, couleur] of fils) c.fils.push({ a, b, couleur, i: 0 });
    c.sur_calcul(() => L.missions.noter("detecteur", { alimente: c.meme_noeud("g.+", "r1.1") && c.meme_noeud("g.−", "td.E"), del: del.allumee, cache: ldr.E < 10, lampe: ldr.E > 1000 }));
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

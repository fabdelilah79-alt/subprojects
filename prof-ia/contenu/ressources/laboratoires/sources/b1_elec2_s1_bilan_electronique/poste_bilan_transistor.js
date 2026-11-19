/*
Rôle : paillasse « bilan énergétique d'un circuit à transistor », câblée par le professeur : circuit de base (G1 réglable,
       ampèremètre A1, RB = 22 kΩ, jonction B-E), circuit du collecteur (G2 = 12 V, ampèremètre A2, RC = 150 Ω – 1 W, C-E),
       émetteur commun ; un voltmètre libre que l'élève branche aux bornes de chaque dipôle ; thermomètre électronique dont la
       sonde touche le boîtier du transistor ; radiateur à clipser. Puissance reçue par le transistor P = UBE·IB + UCE·IC ;
       température du boîtier : dT/dt = (Ta + Rth·P − T)/τ (sans radiateur Rth = 180 °C/W, τ = 25 s ; avec, 60 °C/W, 45 s).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_bilan_transistor(g) -> { pense_bete } ; faits « bilan_transistor » = { E1, IB, IC (mA), tensions { g1, rb, be,
          g2, rc, ce } (V, lues au voltmètre pour ce réglage de G1) }, « thermique » = { radiateur, T (°C), P (mW), Tmax }.
Utilisé par : simulation.js (paillasse 1).
*/
(function (L) {
  const DIPOLES = { g1: ["g1.+", "g1.−"], rb: ["rb.1", "rb.2"], be: ["t.B", "t.E"], g2: ["g2.+", "g2.−"], rc: ["rc.1", "rc.2"], ce: ["t.C", "t.E"] };
  const FILS = [["g1.+", "AB.mA", "#d32f2f"], ["AB.COM", "rb.1", "#d32f2f"], ["rb.2", "t.B", "#3c9a4a"], ["t.E", "g1.−", "#25282b"],
    ["g2.+", "AC.mA", "#d32f2f"], ["AC.COM", "rc.1", "#d32f2f"], ["rc.2", "t.C", "#2f6fd0"], ["t.E", "g2.−", "#25282b"]];
  const type = (m) => (L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {}).type, r3 = (v) => Number(v.toPrecision(4));

  function radiateur(g, monte) {
    // Radiateur en étoile pour boîtier TO-92 (aluminium noirci) : bague autour du boîtier, ailettes rayonnantes ;
    // monté sur le transistor, ou posé à plat sur la paillasse.
    g.replaceChildren();
    const c = monte ? { x: 516, y: 488 } : { x: 760, y: 560 };
    if (!monte) L.ombre_sol(g, c.x, c.y + 6, 26, 4, 0.35);
    for (let k = 0; k <= 8; k++) {
      const a = Math.PI + (k * Math.PI) / 8, u = { x: Math.cos(a), y: Math.sin(a) };
      L.svg("line", { x1: c.x + 15 * u.x, y1: c.y + 15 * u.y, x2: c.x + 25 * u.x, y2: c.y + 25 * u.y, stroke: "#4b5258", "stroke-width": 3, "stroke-linecap": "round" }, g);
    }
    L.svg("path", { d: `M${c.x - 16} ${c.y} A16 16 0 0 1 ${c.x + 16} ${c.y} h-3 A13 13 0 0 0 ${c.x - 13} ${c.y} Z`, fill: "#5b6268", stroke: "#1b1e21", "stroke-width": 0.5 }, g);
    L.svg("rect", { x: c.x - 28, y: c.y - 28, width: 56, height: monte ? 30 : 46, fill: "#000", opacity: 0.001 }, g);
    if (!monte) L.texte(g, c.x, c.y + 16, "radiateur", { "font-size": 6.5, fill: "#f4f1e6" });
  }

  function thermique(g, t) {
    // Thermomètre (sonde sur le boîtier), radiateur ; température du boîtier calculée dix fois par seconde.
    const th = L.thermometre_numerique(g, { x: 650, y: 448, sonde: [{ x: 640, y: 430 }, { x: 575, y: 440 }, { x: 544, y: 462 }, { x: 526, y: 477 }] });
    const gr = L.svg("g", { class: "radiateur", role: "button", "aria-label": "Radiateur" }, g), e = { radiateur: false, T: 25, Tmax: 25, n: 0 };
    radiateur(gr, false);
    L.glissable(gr, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.radiateur = !e.radiateur; radiateur(gr, e.radiateur); } });
    setInterval(() => {
      const P = Math.max(0, t.UBE * t.IB + t.UCE * t.IC), [Rth, tau] = e.radiateur ? [60, 45] : [180, 25];
      e.T += ((25 + Rth * P - e.T) * 0.1) / tau; e.Tmax = Math.max(e.Tmax, e.T); th.afficher(e.T);
      if (++e.n % 10 === 0) L.missions.noter("thermique", { radiateur: e.radiateur, T: Math.round(e.T * 10) / 10, P: Math.round(P * 10000) / 10, Tmax: Math.round(e.Tmax * 10) / 10 });
    }, 100);
  }

  L.poste_bilan_transistor = function (g) {
    // Circuit câblé, appareils ; à chaque calcul, les intensités et la tension lue au voltmètre sont enregistrées.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g), m = { E1: null, tensions: {} };
    const g1 = L.generateur(c, { id: "g1", x: 40, y: 196, E: 0, reglable: true, nom: "G1" });
    L.generateur(c, { id: "g2", x: 40, y: 360, E: 12, nom: "G2" });
    L.resistance(c, { id: "rb", x: 290, y: 230, R: 22000, R_reelle: 21900, nom: "RB" });
    L.resistance(c, { id: "rc", x: 290, y: 380, R: 150, R_reelle: 149, nom: "RC" });
    const t = L.transistor(c, { id: "t", x: 480, y: 470 });
    const ab = L.multimetre(c, { id: "AB", x: 420, y: 186, mode: "2mA", etiquette: "A1" }), ac = L.multimetre(c, { id: "AC", x: 590, y: 186, mode: "200mA", etiquette: "A2" });
    const v = L.multimetre(c, { id: "V", x: 760, y: 186, etiquette: "V" });
    for (const [a, b, couleur] of FILS) c.fils.push({ a, b, couleur, i: 0 });
    c.sur_calcul(() => {
      if (g1.E !== m.E1) Object.assign(m, { E1: g1.E, tensions: {} });
      const nom = Object.keys(DIPOLES).find((k) => [0, 1].some((s) => c.meme_noeud("V.VΩ", DIPOLES[k][s]) && c.meme_noeud("V.COM", DIPOLES[k][1 - s])));
      if (nom && type(v) === "V" && !v.depasse) m.tensions[nom] = r3(Math.abs(v.valeur));
      const lu = (a) => type(a) === "A" && !a.depasse ? r3(Math.abs(a.valeur) * 1000) : null;
      L.missions.noter("bilan_transistor", { E1: g1.E, IB: lu(ab), IC: lu(ac), tensions: { ...m.tensions } });
    });
    c.calculer(); thermique(g, t);
    return { pense_bete };
  };
})(window.Labo);

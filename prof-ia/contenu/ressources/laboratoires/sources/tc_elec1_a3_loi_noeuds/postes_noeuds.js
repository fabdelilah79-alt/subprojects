/*
Rôle : les deux paillasses de la loi des nœuds : (1) deux lampes différentes en série et un multimètre que l'on déplace ;
       (2) deux lampes en dérivation et trois multimètres A, A1, A2. L'élève pose lui-même les fils.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_serie(groupe), Labo.poste_derivation(groupe) -> { pense_bete } ;
          faits notés « serie » = { ferme, i1, i2, mode, valeur, depasse, positions: { <bornes voisines> : I (A) } },
          « derivation » = { ferme, eclat1, eclat2, i1, i2, mesures: { <id> : I (A) }, roles: { principale, branche1, branche2 } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const arrondi = (v) => Math.round(v * 1e5) / 1e5;

  function voisines(c, m) {
    // Bornes reliées par un fil aux bornes de mesure du multimètre : elles disent où il est branché.
    const miennes = [`${m.id}.mA`, `${m.id}.COM`, `${m.id}.10A`];
    return c.fils.flatMap((f) => (miennes.includes(f.a) ? [f.b] : miennes.includes(f.b) ? [f.a] : [])).sort().join("|");
  }

  const valide = (m) => m.mode !== "OFF" && !m.depasse && Math.abs(m.valeur) > 0.001;

  L.poste_serie = function (g) {
    // Générateur 6 V, interrupteur, L1 (6 V – 0,1 A), L2 (6 V – 0,3 A), un multimètre.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g), positions = {};
    L.generateur(c, { x: 40, y: 196, E: 6 });
    const k = L.interrupteur(c, { x: 300, y: 214 });
    const l1 = L.lampe(c, { id: "l1", x: 450, y: 214, I_n: 0.1, etiquette: "L1" });
    const l2 = L.lampe(c, { id: "l2", x: 610, y: 214, I_n: 0.3, etiquette: "L2" });
    const m = L.multimetre(c, { x: 820, y: 230 });
    c.sur_calcul(() => {
      if (valide(m) && Math.abs(Math.abs(m.valeur) - Math.abs(l1.i)) < 5e-4 && Math.abs(l1.i - l2.i) < 5e-4) positions[voisines(c, m)] = arrondi(Math.abs(m.valeur));
      L.missions.noter("serie", { ferme: k.ferme, i1: arrondi(l1.i), i2: arrondi(l2.i), eclat1: arrondi(l1.eclat), eclat2: arrondi(l2.eclat), mode: m.mode, valeur: arrondi(m.valeur), depasse: m.depasse, positions: { ...positions } });
    });
    c.calculer();
    return { pense_bete };
  };

  function roles(mesures, i1, i2) {
    // Reconnaît, d'après les valeurs, l'ampèremètre de la branche principale et ceux des deux branches.
    const r = {}, proche = (a, b) => Math.abs(a - b) < 5e-4;
    for (const [id, v] of Object.entries(mesures)) {
      if (proche(v, Math.abs(i1) + Math.abs(i2))) r.principale = id;
      else if (proche(v, Math.abs(i1))) r.branche1 = id;
      else if (proche(v, Math.abs(i2))) r.branche2 = id;
    }
    return r;
  }

  L.poste_derivation = function (g) {
    // Générateur 6 V, interrupteur, L1 (6 V – 0,1 A), L2 (6 V – 0,05 A) et trois multimètres.
    const { pense_bete } = L.decor_circuit(g, 1), c = L.circuit(g);
    L.generateur(c, { x: 40, y: 196, E: 6 });
    const k = L.interrupteur(c, { x: 70, y: 420 });
    const l1 = L.lampe(c, { id: "l1", x: 470, y: 470, I_n: 0.1, etiquette: "L1" });
    const l2 = L.lampe(c, { id: "l2", x: 650, y: 470, I_n: 0.05, etiquette: "L2" });
    const ms = ["A", "A1", "A2"].map((nom, n) => L.multimetre(c, { id: nom, x: 290 + n * 180, y: 186, etiquette: nom }));
    c.sur_calcul(() => {
      const mesures = Object.fromEntries(ms.filter(valide).map((m) => [m.id, arrondi(Math.abs(m.valeur))]));
      L.missions.noter("derivation", { ferme: k.ferme, eclat1: arrondi(l1.eclat), eclat2: arrondi(l2.eclat), i1: arrondi(l1.i), i2: arrondi(l2.i), mesures, roles: roles(mesures, l1.i, l2.i) });
    });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

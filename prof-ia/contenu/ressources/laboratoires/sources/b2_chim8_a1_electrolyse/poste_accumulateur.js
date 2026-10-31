/*
Rôle : paillasse « accumulateur au plomb » (circuit vu de face) : accumulateur de laboratoire (accumulateur_plomb.js), commutateur K
       (position 1 : charge par l'alimentation réglable, 3,0 V ; position 2 : décharge dans une lampe de 2,5 V – 0,1 A), voltmètre
       et ampèremètre.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_accumulateur(g) -> { pense_bete } ; fait « accumulateur » = { q (C), E (V), plus (plaque pôle +), U_lu (V, valeur
          absolue lue par le voltmètre branché aux bornes des plaques, ou null), neuf_mesure (vu : tension nulle mesurée avant la
          charge), charge (q ≥ 8 C), plaque_generateur_plus (plaque reliée à la borne + du générateur pendant la charge),
          allumee (vu : lampe allumée par l'accumulateur seul), U_decharge (V, tension lue pendant que la lampe brille) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const mode = (m) => L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {};
  const r3 = (v) => Math.round(v * 1000) / 1000;

  function tension_plaques(c, volt) {
    // Valeur absolue de la tension lue entre les deux plaques, ou null si le voltmètre n'y est pas branché.
    if (mode(volt).type !== "V" || volt.depasse) return null;
    const n = (a, b) => c.meme_noeud(`V.${a}`, `accu.${b}`);
    return (n("VΩ", "1") && n("COM", "2")) || (n("VΩ", "2") && n("COM", "1")) ? r3(Math.abs(volt.valeur)) : null;
  }

  L.poste_accumulateur = function (g) {
    // Matériel ; le fait est noté à chaque calcul et deux fois par seconde.
    const { pense_bete } = L.decor_circuit(g, 2), c = L.circuit(g);
    const accu = L.accumulateur_plomb(c, { id: "accu", x: 250, y: 300 });
    const K = L.commutateur(c, { id: "K", x: 430, y: 330, position: 2, manette_dessus: true });
    const gen = L.generateur(c, { id: "G", x: 600, y: 420, E: 3, reglable: true, nom: "G" });
    const lampe = L.lampe(c, { id: "lampe", x: 430, y: 470, U_n: 2.5, I_n: 0.1 });
    const volt = L.multimetre(c, { id: "V", x: 690, y: 40, etiquette: "V" });
    L.multimetre(c, { id: "A", x: 860, y: 40, etiquette: "A" });
    const vu = { neuf_mesure: false, allumee: false, plaque_generateur_plus: null, U_decharge: null };
    const noter = () => {
      const e = accu.etat(), U = tension_plaques(c, volt), par_gen = Math.abs(gen.i) > 1e-3;
      if (U !== null && Math.abs(e.q) < 0.05 && U < 0.02) vu.neuf_mesure = true;
      if (par_gen && accu.en_charge && e.plus) vu.plaque_generateur_plus = e.plus;
      if (!par_gen && lampe.eclat > 0.2 && Math.abs(accu.i) > 0.02) { vu.allumee = true; if (U !== null) vu.U_decharge = U; }
      L.missions.noter("accumulateur", { q: r3(e.q), E: r3(e.E), plus: e.plus, U_lu: U, charge: Math.abs(e.q) >= 8, K: K.position, eclat: r3(lampe.eclat), ...vu });
    };
    c.sur_calcul(noter); setInterval(noter, 500);
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

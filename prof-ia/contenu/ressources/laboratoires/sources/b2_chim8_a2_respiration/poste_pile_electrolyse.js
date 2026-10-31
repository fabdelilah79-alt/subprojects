/*
Rôle : paillasse « une pile force une électrolyse » (circuit vu de face) : pile plate de 4,5 V (circuit_pile.js), tube en U
       d'électrolyse du chlorure de sodium (tube_electrolyse.js), voltmètre et ampèremètre.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_pile_electrolyse(g) -> { pense_bete } ; fait « pile_electrolyse » = { I (mA), I_lu (mA ou null), U_tube (V, lue
          aux bornes du tube, ou null), U_pile (V, lue aux bornes de la pile, ou null), Q (C) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const mode = (m) => L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {};
  const r3 = (v) => Math.round(v * 1000) / 1000;

  function tension(c, volt, comp, a, b) {
    // Valeur absolue de la tension lue entre les bornes a et b du composant, ou null si le voltmètre n'y est pas branché.
    if (mode(volt).type !== "V" || volt.depasse) return null;
    const n = (v, k) => c.meme_noeud(`V.${v}`, `${comp}.${k}`);
    return (n("VΩ", a) && n("COM", b)) || (n("VΩ", b) && n("COM", a)) ? r3(Math.abs(volt.valeur)) : null;
  }

  L.poste_pile_electrolyse = function (g) {
    // Matériel ; le fait est noté à chaque calcul et deux fois par seconde.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    const tube = L.tube_electrolyse(c, { x: 330, y: 250 });
    L.pile(c, { id: "pile", x: 600, y: 440, E: 4.5, r: 1.5 });
    const volt = L.multimetre(c, { id: "V", x: 690, y: 40, etiquette: "V" }), ampere = L.multimetre(c, { id: "A", x: 860, y: 40, etiquette: "A" });
    const noter = () => {
      const I = Math.abs(tube.i), lu = mode(ampere).type === "A" && !ampere.depasse && I > 1e-4 && Math.abs(Math.abs(ampere.valeur) - I) < 0.02 * I + 2e-6;
      L.missions.noter("pile_electrolyse", { I: r3(I * 1000), I_lu: lu ? r3(Math.abs(ampere.valeur) * 1000) : null, U_tube: tension(c, volt, "tube_u", "1", "2"), U_pile: tension(c, volt, "pile", "+", "−"), Q: r3(tube.etat().Q) });
    };
    c.sur_calcul(noter); setInterval(noter, 500);
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

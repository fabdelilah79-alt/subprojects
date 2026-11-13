/*
Rôle : paillasses des piles (circuit vu de dessus) : pile électrochimique (pile_electrochimique.js) avec son pont salin,
       résistance de 100 Ω, deux multimètres (voltmètre et ampèremètre) et les fils que l'élève branche.
Reçoit : le groupe SVG de la paillasse et { numero, gauche, droite (demi-piles), fait (nom du fait noté) }.
Produit : Labo.poste_pile_lab(g, reglage) -> { pense_bete } ; fait <fait> = { pont, E (V, modèle), I (mA, débité), U_21 (V, tension
          lue entre la lame de droite et celle de gauche, signée ; null si le voltmètre n'y est pas branché), I_lu (mA, lue par
          l'ampèremètre parcouru par le courant de la pile), Q (C) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const mode = (m) => L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {};
  const r4 = (v) => Math.round(v * 1e4) / 1e4;

  function tension(c, volt) {
    // Tension U(lame 2) − U(lame 1) lue au voltmètre, signée ; null s'il n'est pas branché aux bornes de la pile.
    if (mode(volt).type !== "V" || volt.depasse) return null;
    const n = (a, b) => c.meme_noeud(`V.${a}`, `pile_e.${b}`);
    if (n("VΩ", "2") && n("COM", "1")) return r4(volt.valeur);
    if (n("VΩ", "1") && n("COM", "2")) return r4(-volt.valeur);
    return null;
  }

  L.poste_pile_lab = function (g, { numero, gauche, droite, fait }) {
    // Matériel ; le fait est noté à chaque calcul du circuit et deux fois par seconde (débit).
    const { pense_bete } = L.decor_circuit(g, numero), c = L.circuit(g);
    const pile = L.pile_electrochimique(c, { x: 300, y: 300, gauche, droite });
    L.resistance(c, { id: "r", x: 600, y: 470, R: 100, R_reelle: 100.4, nom: "R" });
    const volt = L.multimetre(c, { id: "V", x: 690, y: 40, etiquette: "V" }), ampere = L.multimetre(c, { id: "A", x: 860, y: 40, etiquette: "A" });
    const noter = () => {
      const e = pile.etat(), I = Math.abs(pile.i), A = mode(ampere).type === "A" && !ampere.depasse && I > 1e-6 && Math.abs(Math.abs(ampere.valeur) - I) < 0.02 * I + 2e-6;
      L.missions.noter(fait, { pont: e.pont, E: r4(e.E), I: r4(I * 1000), U_21: tension(c, volt), I_lu: A ? r4(Math.abs(ampere.valeur) * 1000) : null, Q: r4(e.Q) });
    };
    c.sur_calcul(noter); setInterval(noter, 500);
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

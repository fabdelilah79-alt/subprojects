/*
Rôle : paillasse « électrolyse d'une solution de chlorure de sodium » (circuit vu de face) : tube en U à électrodes de graphite
       (tube_electrolyse.js) avec deux bandes de papier à l'iodure de potassium, alimentation réglable (6,0 V au départ),
       voltmètre et ampèremètre.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_nacl(g) -> { pense_bete } ; fait « electrolyse_nacl » = { U_G (V), U (V, aux bornes du tube), I (mA), I_lu (mA ou
          null), Q (C), anode, cathode (« 1 », « 2 » ou null : électrode reliée à la borne + ou − du générateur pendant le passage
          du courant), I_6V (mA, lu sous 6,0 V), rose (électrode où la solution a rosi), papier_bleu (branche où un papier a bleui, ou null),
          sous_seuil (vu : générateur en marche, tension inférieure à 2 V, ampèremètre branché et courant nul) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const mode = (m) => L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {};
  const r4 = (v) => Math.round(v * 1e4) / 1e4;

  function lecture(ampere, I) {
    // Valeur lue par l'ampèremètre s'il est parcouru par ce courant (mA), sinon null ; 0 quand il est en série et que rien ne passe.
    if (mode(ampere).type !== "A" || ampere.depasse) return null;
    if (Math.abs(I) < 1e-6) return Math.abs(ampere.valeur) < 1e-6 ? 0 : null;
    return Math.abs(Math.abs(ampere.valeur) - Math.abs(I)) < 0.02 * Math.abs(I) + 2e-6 ? r4(Math.abs(ampere.valeur) * 1000) : null;
  }

  L.poste_nacl = function (g) {
    // Matériel ; le fait est noté à chaque calcul et deux fois par seconde.
    const { pense_bete } = L.decor_circuit(g, 1), c = L.circuit(g);
    const tube = L.tube_electrolyse(c, { x: 300, y: 250, papiers: true });
    const gen = L.generateur(c, { id: "G", x: 600, y: 420, E: 6, reglable: true, nom: "G" });
    L.multimetre(c, { id: "V", x: 690, y: 40, etiquette: "V" });
    const ampere = L.multimetre(c, { id: "A", x: 860, y: 40, etiquette: "A" });
    const vu = { sous_seuil: false, anode: null, cathode: null, I_6V: null };
    const noter = () => {
      const e = tube.etat(), I = tube.i, lu = lecture(ampere, I), en_serie = lu !== null && c.meme_noeud("A.COM", "tube_u.1") + c.meme_noeud("A.COM", "tube_u.2") + c.meme_noeud("A.mA", "tube_u.1") + c.meme_noeud("A.mA", "tube_u.2") > 0;
      if (gen.marche && gen.E < 2 && gen.E > 0.5 && lu === 0 && en_serie) vu.sous_seuil = true;
      if (gen.marche && Math.abs(gen.E - 6) < 0.05 && lu > 0) vu.I_6V = lu;
      if (Math.abs(I) > 1e-3) Object.assign(vu, I > 0 ? { anode: "1", cathode: "2" } : { anode: "2", cathode: "1" });
      const rose = ["1", "2"].find((k) => e.cathode_Q[k] > 1) || null, bleu = e.papiers.find((p) => p.bleu > 0.5);
      L.missions.noter("electrolyse_nacl", { U_G: gen.marche ? gen.E : 0, U: r4(tube.u), I: r4(Math.abs(I) * 1000), I_lu: lu, Q: r4(e.Q), ...vu, rose, papier_bleu: bleu ? bleu.branche : null });
    };
    c.sur_calcul(noter); setInterval(noter, 500);
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

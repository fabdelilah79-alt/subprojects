/*
Rôle : paillasse « forcer une pile » (circuit vu de face) : pile Cu | Cu²⁺ || Ag⁺ | Ag, pont salin posé (pile_electrochimique.js),
       résistance de 100 Ω, alimentation réglable (0 à 12 V, à 0 V au départ), voltmètre et ampèremètre. Branchée en opposition
       (borne + sur la lame d'argent), l'alimentation impose un courant inverse dès que sa tension dépasse la f.é.m. de la pile.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_forcee(g) -> { pense_bete } ; fait « pile_forcee » = { E (V), U_G (V), I (mA, signé : > 0 dans le sens
          spontané), I_lu (mA, valeur absolue lue par l'ampèremètre parcouru par ce courant, ou null), spontane, force (vus à
          l'ampèremètre), oppose (borne + du générateur reliée à la lame d'argent), dm_cuivre, dm_argent (mg) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const mode = (m) => L.MULTIMETRE_MODES.find((k) => k.nom === m.mode) || {};
  const r4 = (v) => Math.round(v * 1e4) / 1e4;

  L.poste_forcee = function (g) {
    // Matériel ; le fait est noté à chaque calcul et deux fois par seconde.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    const pile = L.pile_electrochimique(c, { x: 250, y: 300, gauche: { metal: "cuivre", C: 0.1 }, droite: { metal: "argent", C: 0.1 }, pont: true });
    L.resistance(c, { id: "r", x: 560, y: 300, R: 100, R_reelle: 100.4, nom: "R" });
    const gen = L.generateur(c, { id: "G", x: 560, y: 420, E: 0, reglable: true, nom: "G" });
    const volt = L.multimetre(c, { id: "V", x: 690, y: 40, etiquette: "V" }), ampere = L.multimetre(c, { id: "A", x: 860, y: 40, etiquette: "A" });
    const vu = { spontane: false, force: false };
    const noter = () => {
      const e = pile.etat(), I = pile.i, lu = mode(ampere).type === "A" && !ampere.depasse && Math.abs(I) > 1e-5 && Math.abs(Math.abs(ampere.valeur) - Math.abs(I)) < 0.02 * Math.abs(I) + 2e-6;
      if (lu && I > 5e-4) vu.spontane = true;
      if (lu && I < -5e-4) vu.force = true;
      const oppose = c.meme_noeud("G.+", "pile_e.2") || (Math.abs(I) > 1e-5 && I < 0);
      L.missions.noter("pile_forcee", { E: r4(e.E), U_G: gen.marche ? gen.E : 0, I: r4(I * 1000), I_lu: lu ? r4(Math.abs(ampere.valeur) * 1000) : null, ...vu, oppose, dm_cuivre: r4(e.dm_gauche), dm_argent: r4(e.dm_droite), tension_lue: mode(volt).type === "V" ? r4(volt.valeur) : null });
    };
    c.sur_calcul(noter); setInterval(noter, 500);
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

/*
Rôle : paillasse des tensions variables : GBF, pile de 4,5 V, oscilloscope et multimètre ; l'élève pose les fils.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_oscilloscope(groupe) -> { pense_bete } ; faits notés (en plus de « oscillo » et « gbf ») :
          « voltmetre_gbf » = { mode, valeur, depasse } quand le multimètre est branché aux bornes du GBF,
          « formes_vues » = [formes du GBF vues à l'oscilloscope].
Utilisé par : simulation.js.
*/
(function (L) {
  L.poste_oscilloscope = function (g) {
    // Matériel ; à chaque changement : la mesure du voltmètre aux bornes du GBF et les formes déjà observées.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g), vues = new Set();
    L.gbf(c, { x: 40, y: 196, forme: "sinus", f: 500, Umax: 3 });
    L.pile(c, { x: 60, y: 400 });
    const o = L.oscilloscope(c, { x: 290, y: 186, Sv: 2, b: 5 });
    const m = L.multimetre(c, { x: 820, y: 230 });
    c.sur_calcul(() => {
      const aux_bornes = c.meme_noeud(`${m.id}.VΩ`, "gbf.sortie") && c.meme_noeud(`${m.id}.COM`, "gbf.masse");
      L.missions.noter("voltmetre_gbf", aux_bornes ? { mode: m.mode, valeur: Math.round(m.valeur * 1000) / 1000, depasse: m.depasse, forme: c.alternatif.forme } : null);
      if (o.onde && Math.max(...o.onde) - Math.min(...o.onde) > 1) { vues.add(c.alternatif.forme); L.missions.noter("formes_vues", [...vues]); }
    });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

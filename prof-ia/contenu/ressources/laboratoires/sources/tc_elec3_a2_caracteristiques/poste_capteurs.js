/*
Rôle : paillasse des capteurs : thermistance CTN (sonde à plonger dans l'eau glacée, à 20 °C ou chaude), photorésistance
       (lampe de poche, cache noir) et multimètre en ohmmètre.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_capteurs(groupe) -> { pense_bete } ; faits notés « mesures_ctn » = { <milieu> : R (Ω) } (température
          stabilisée), « mesures_ldr » = { obscurite, salle, lampe : R (Ω) }.
Utilisé par : simulation.js.
*/
(function (L) {
  L.poste_capteurs = function (g) {
    // Matériel ; à chaque calcul, la lecture de l'ohmmètre est rangée selon le capteur mesuré et son état.
    const { pense_bete } = L.decor_circuit(g, 3), c = L.circuit(g), ctn_vues = {}, ldr_vues = {};
    const bechers = [{ x: 90, y: 360, T: 2, nom: "eau glacée" }, { x: 190, y: 360, T: 20, nom: "eau du robinet" }, { x: 290, y: 360, T: 60, nom: "eau chaude" }];
    const ctn = L.thermistance(c, { x: 150, y: 220, bechers });
    const ldr = L.photoresistance(c, { x: 480, y: 230, lampe: { x: 700, y: 246 }, cache: { x: 560, y: 400 } });
    const m = L.multimetre(c, { x: 820, y: 230 });
    const aux_bornes = (id) => [[1, 2], [2, 1]].some(([p, q]) => c.meme_noeud(`${m.id}.VΩ`, `${id}.${p}`) && c.meme_noeud(`${m.id}.COM`, `${id}.${q}`));
    c.sur_calcul(() => {
      const mode = L.MULTIMETRE_MODES.find((k) => k.nom === m.mode);
      if (mode.type !== "R" || m.depasse) return;
      const R = Math.round(m.valeur);
      const milieu = bechers.find((b) => Math.abs(b.T - ctn.T) < 0.5);
      if (aux_bornes("ctn") && milieu) { ctn_vues[milieu.nom] = R; L.missions.noter("mesures_ctn", { ...ctn_vues }); }
      if (aux_bornes("ldr")) {
        const etat = ldr.E < 10 ? "obscurite" : ldr.E < 300 ? "salle" : ldr.E > 1000 ? "lampe" : null;
        if (etat) { ldr_vues[etat] = R; L.missions.noter("mesures_ldr", { ...ldr_vues }); }
      }
    });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

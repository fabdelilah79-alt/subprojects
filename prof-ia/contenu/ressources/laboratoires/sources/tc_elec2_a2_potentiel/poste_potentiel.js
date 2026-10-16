/*
Rôle : paillasse de la différence de potentiel : générateur 12 V (bornes P et N), plaquette de trois résistances en série
       (R1 = 100 Ω entre A et B, R2 = 220 Ω entre B et C, R3 = 330 Ω entre C et D) et multimètre en voltmètre.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_potentiel(groupe) -> { pense_bete } ; faits notés « plaquette_alimentee » (courant dans la plaquette),
          « tension » = { nom, valeur } (mesure en cours), « tensions » = { <nom> : valeur } (toutes les mesures faites,
          plaquette alimentée).
Utilisé par : simulation.js.
*/
(function (L) {
  const POINTS = { P: "generateur.+", N: "generateur.−", A: "plaquette.A", B: "plaquette.B", C: "plaquette.C", D: "plaquette.D" };

  L.poste_potentiel = function (g) {
    // Matériel ; à chaque changement du circuit, l'alimentation de la plaquette et la mesure en cours sont notées.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g), vues = {};
    L.generateur(c, { x: 40, y: 196, E: 12, lettres: ["N", "P"] });
    const plaquette = L.plaquette_resistances(c, { x: 300, y: 250 });
    const m = L.multimetre(c, { x: 820, y: 230 });
    c.sur_calcul(() => {
      const alimentee = Math.abs(plaquette.i[0] || 0) > 0.01 && Math.abs((plaquette.i[0] || 0) - (plaquette.i[2] || 0)) < 1e-4;
      const t = L.tension_mesuree(c, m, POINTS);
      L.missions.noter("plaquette_alimentee", alimentee);
      L.missions.noter("tension", t);
      if (t && alimentee) { vues[t.nom] = t.valeur; L.missions.noter("tensions", { ...vues }); }
    });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

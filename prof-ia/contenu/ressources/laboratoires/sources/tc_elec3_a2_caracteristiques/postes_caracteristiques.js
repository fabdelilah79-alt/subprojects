/*
Rôle : paillasses des caractéristiques : (1) alimentation réglable, résistance R = 100 Ω, lampe 6 V – 0,1 A, ampèremètre et
       voltmètre ; (2) alimentation réglable, résistance de protection 100 Ω, diode 1N4007, ampèremètre, voltmètre ;
       (3) GBF, résistance 470 Ω, diode Zener 5,1 V et oscilloscope.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_resistance_lampe, Labo.poste_diode, Labo.poste_zener (groupe) -> { pense_bete } ;
          faits notés « points_R », « points_lampe », « points_diode » (caracteristique.js), « oscillo » (oscilloscope.js).
Utilisé par : simulation.js.
*/
(function (L) {
  function mesureurs(c) {
    // Ampèremètre (au milieu de la paillasse) et voltmètre (à droite).
    return { ampere: L.multimetre(c, { id: "A", x: 470, y: 300, etiquette: "A" }), volt: L.multimetre(c, { id: "V", x: 820, y: 230, etiquette: "V" }) };
  }

  function suivre(c, m, comp, a, b, nom) {
    // Relève les points de la caractéristique du composant.
    L.suivre_caracteristique(c, { ...m, nom, dipole: { a: `${comp.id}.${a}`, b: `${comp.id}.${b}`, courant: () => comp.i } });
  }

  L.poste_resistance_lampe = function (g) {
    // Paillasse 1 : la résistance et la lampe, à étudier l'une après l'autre.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    L.generateur(c, { x: 40, y: 196, E: 0, lettres: ["N", "P"], reglable: true });
    const r = L.resistance(c, { id: "r", x: 290, y: 230, R: 100, R_reelle: 101.2, nom: "R", lettres: ["A", "B"] });
    const lampe = L.lampe(c, { id: "lampe", x: 290, y: 400, I_n: 0.1, etiquette: "L", lettres: ["C", "D"] });
    const m = mesureurs(c);
    suivre(c, m, r, "1", "2", "R");
    suivre(c, m, lampe, "1", "2", "lampe");
    c.calculer();
    return { pense_bete };
  };

  L.poste_diode = function (g) {
    // Paillasse 2 : diode et sa résistance de protection.
    const { pense_bete } = L.decor_circuit(g, 1), c = L.circuit(g);
    L.generateur(c, { x: 40, y: 196, E: 0, lettres: ["N", "P"], reglable: true });
    L.resistance(c, { id: "rp", x: 290, y: 230, R: 100, R_reelle: 99.1, nom: "Rp" });
    const d = L.diode(c, { id: "d", x: 290, y: 400 });
    suivre(c, mesureurs(c), d, "A", "K", "diode");
    c.calculer();
    return { pense_bete };
  };

  L.poste_zener = function (g) {
    // Paillasse 3 : GBF, résistance et Zener ; l'oscilloscope montre la tension aux bornes de la Zener.
    const { pense_bete } = L.decor_circuit(g, 2), c = L.circuit(g);
    L.gbf(c, { x: 40, y: 196, forme: "sinus", f: 500, Umax: 8 });
    L.resistance(c, { id: "rz", x: 60, y: 380, R: 470, R_reelle: 468, nom: "R" });
    L.zener(c, { id: "z", x: 240, y: 380 });
    L.oscilloscope(c, { x: 560, y: 186, Sv: 2, b: 0.5 });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

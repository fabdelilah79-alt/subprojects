/*
Rôle : paillasses des dipôles actifs : (1) pile plate 4,5 V (r = 2 Ω), interrupteur, rhéostat 100 Ω, résistance de
       protection 22 Ω, ampèremètre, voltmètre ; (2) alimentation réglable, résistance de protection 10 Ω, électrolyseur
       (E' = 1,7 V, r' = 8 Ω), ampèremètre, voltmètre.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_pile, Labo.poste_electrolyseur (groupe) -> { pense_bete } ; faits notés « points_pile » (convention
          générateur : U = U_PN, I débité) et « points_electrolyseur » (convention récepteur).
Utilisé par : simulation.js.
*/
(function (L) {
  L.poste_pile = function (g) {
    // Paillasse 1 : on fait varier le courant débité par la pile avec le rhéostat.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    const pile = L.pile(c, { x: 60, y: 230, E: 4.5, r: 2, lettres: ["N", "P"] });
    L.interrupteur(c, { id: "k", x: 250, y: 230 });
    L.rheostat(c, { x: 400, y: 210, R: 100, I_max: 1 });
    L.resistance(c, { id: "rp", x: 250, y: 400, R: 22, R_reelle: 22.3, nom: "Rp" });
    const ampere = L.multimetre(c, { id: "A", x: 470, y: 320, etiquette: "A" }), volt = L.multimetre(c, { id: "V", x: 820, y: 230, etiquette: "V" });
    L.suivre_caracteristique(c, { ampere, volt, nom: "pile", dipole: { a: "pile.+", b: "pile.−", courant: () => pile.i } });
    c.calculer();
    return { pense_bete };
  };

  L.poste_electrolyseur = function (g) {
    // Paillasse 2 : l'alimentation réglable fait varier la tension appliquée à l'électrolyseur.
    const { pense_bete } = L.decor_circuit(g, 1), c = L.circuit(g);
    L.generateur(c, { x: 40, y: 196, E: 0, lettres: ["N", "P"], reglable: true });
    L.resistance(c, { id: "rp", x: 290, y: 230, R: 10, R_reelle: 10.1, nom: "Rp" });
    const e = L.electrolyseur(c, { x: 300, y: 360, E: 1.7, r: 8, lettres: ["A", "B"] });
    const ampere = L.multimetre(c, { id: "A", x: 470, y: 300, etiquette: "A" }), volt = L.multimetre(c, { id: "V", x: 820, y: 230, etiquette: "V" });
    L.suivre_caracteristique(c, { ampere, volt, nom: "electrolyseur", dipole: { a: "electrolyseur.1", b: "electrolyseur.2", courant: () => e.i } });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

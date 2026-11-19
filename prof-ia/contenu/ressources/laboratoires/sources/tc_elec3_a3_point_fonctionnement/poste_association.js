/*
Rôle : paillasse de l'association de générateurs : deux piles plates 4,5 V (r = 2 Ω chacune), interrupteur, lampe 6 V – 0,1 A,
       résistance 27 Ω et voltmètre.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_association(groupe) -> { pense_bete } ; faits notés « association » = { serie (piles reliées + à −),
          opposition (+ à +, ou − à −), u_vide (V, tension mesurée aux bornes libres des deux piles, sans courant) },
          « lampe_association » = { eclat, avec_R (la résistance 27 Ω est parcourue par le courant) }.
Utilisé par : simulation.js.
*/
(function (L) {
  L.poste_association = function (g) {
    // Matériel ; à chaque changement, on note la façon dont les piles sont associées et l'éclat de la lampe.
    const { pense_bete } = L.decor_circuit(g, 2), c = L.circuit(g);
    const p1 = L.pile(c, { id: "pile1", x: 60, y: 230, E: 4.5, r: 2 }), p2 = L.pile(c, { id: "pile2", x: 60, y: 380, E: 4.5, r: 2 });
    const k = L.interrupteur(c, { id: "k", x: 260, y: 230 });
    const lampe = L.lampe(c, { id: "lampe", x: 440, y: 230, I_n: 0.1, etiquette: "L" });
    const r = L.resistance(c, { id: "r", x: 440, y: 400, R: 27, R_reelle: 27.2, nom: "R" });
    const volt = L.multimetre(c, { id: "V", x: 820, y: 230, etiquette: "V" });
    const n = (a, b) => c.meme_noeud(a, b);
    c.sur_calcul(() => {
      const serie = n("pile1.+", "pile2.−") || n("pile1.−", "pile2.+"), opposition = n("pile1.+", "pile2.+") || n("pile1.−", "pile2.−");
      const libres = serie ? (n("pile1.+", "pile2.−") ? ["pile2.+", "pile1.−"] : ["pile1.+", "pile2.−"]) : null;
      const sur = libres && [[0, 1], [1, 0]].some(([a, b]) => n("V.VΩ", libres[a]) && n("V.COM", libres[b]));
      const vide = Math.abs(p1.i) < 1e-4;
      L.missions.noter("association", { serie, opposition, u_vide: sur && vide && !volt.depasse ? Math.round(Math.abs(volt.valeur) * 100) / 100 : null });
      L.missions.noter("lampe_association", { eclat: Math.round(lampe.eclat * 100) / 100, avec_R: k.ferme && Math.abs(r.i) > 0.01 && Math.abs(Math.abs(r.i) - Math.abs(lampe.i)) < 1e-4, serie });
    });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

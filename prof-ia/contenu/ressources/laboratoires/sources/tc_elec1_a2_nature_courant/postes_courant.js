/*
Rôle : les deux paillasses de la nature du courant : (1) générateur 6 V, interrupteur, lampe, DEL, multimètre et loupe ;
       (2) générateur 12 V, interrupteur, multimètre, tube en U d'électrolyse et loupe. L'élève pose lui-même les fils.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_lampe_del(groupe), Labo.poste_electrolyse(groupe) -> { pense_bete } ;
          faits notés « circuit » = { ferme, del_allumee, del_inverse, i_lampe, i_del, eclat },
          « mesure » = { mode, valeur, depasse, i_lampe }, « electrolyse » = { i_tube, mesure, mode, depasse }.
Utilisé par : simulation.js.
*/
(function (L) {
  const arrondi = (v) => Math.round(v * 1e5) / 1e5;

  L.poste_lampe_del = function (g) {
    // Matériel de la paillasse 1 ; à chaque changement du circuit, les faits sont notés.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    L.generateur(c, { x: 40, y: 196, E: 6 });
    const k = L.interrupteur(c, { x: 300, y: 214 });
    const lampe = L.lampe(c, { x: 460, y: 214 });
    const del = L.del(c, { x: 620, y: 214 });
    const m = L.multimetre(c, { x: 820, y: 230 });
    c.sur_calcul(() => {
      L.missions.noter("circuit", { ferme: k.ferme, del_allumee: del.allumee, del_inverse: k.ferme && del.u < -1, i_lampe: arrondi(lampe.i), i_del: arrondi(del.i), eclat: arrondi(lampe.eclat) });
      L.missions.noter("mesure", { mode: m.mode, valeur: arrondi(m.valeur), depasse: m.depasse, i_lampe: arrondi(lampe.i) });
    });
    c.calculer();
    L.loupe_courant(g, c, null, { x: 720, y: 64 });
    return { pense_bete };
  };

  L.poste_electrolyse = function (g) {
    // Matériel de la paillasse 2 : le tube en U remplace la lampe.
    const { pense_bete } = L.decor_circuit(g, 1), c = L.circuit(g);
    L.generateur(c, { x: 40, y: 196, E: 12 });
    L.interrupteur(c, { x: 300, y: 214 });
    const m = L.multimetre(c, { x: 440, y: 230 });
    const tube = L.tube_electrolyse(c, { x: 620, y: 250 });
    c.sur_calcul(() => L.missions.noter("electrolyse", { i_tube: arrondi(tube.i), mesure: arrondi(m.valeur), mode: m.mode, depasse: m.depasse }));
    c.calculer();
    L.loupe_courant(g, c, tube, { x: 600, y: 64 });
    return { pense_bete };
  };
})(window.Labo);

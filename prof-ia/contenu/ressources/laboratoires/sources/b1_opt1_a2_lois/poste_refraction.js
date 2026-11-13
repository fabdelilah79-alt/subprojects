/*
Rôle : paillasse « réfraction » : disque optique gradué portant un demi-cylindre de plexiglas (n = 1,50) ; laser dans l'air
       (en haut) ou dans le plexiglas (en bas, sa lumière traverse la face courbe sans être déviée). Chaque position lâchée
       note un essai ; réflexion totale au-delà de l'angle limite (41,8°) ; retour inverse.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_refraction(g) -> { pense_bete } ; fait « refraction » = { air: [{ i1, i2 }], verre: [{ i, r }]
          (r = null : réflexion totale), retour }.
Utilisé par : simulation.js.
*/
(function (L) {
  L.poste_refraction = function (g) {
    // Décor, disque sur son pied ; essais notés à chaque lâcher du laser.
    const { pense_bete } = L.decor_circuit(g, 1), C = { x: 470, y: 318 }, e = { air: [], verre: [], retour: false };
    const d = L.disque_optique(L.svg("g", {}, g), { C, R: 140, n: 1.5 }), arrondi = (x) => (x === null ? null : Math.round(x * 100) / 100);
    let cible = null;
    d.sur_lacher = () => {
      // Essai dans l'air ou dans le plexiglas ; retour inverse si le laser est posé sur le rayon réfracté précédent.
      const x = d.rayons();
      if (cible !== null && Math.abs(d.a - cible) <= 1) e.retour = true;
      if (x.haut) { if (x.i > 0) e.air.push({ i1: x.i, i2: arrondi(x.t) }); cible = x.i > 0 ? Math.round(-Math.sign(d.a) * (180 - x.t)) : null; }
      else { if (x.i > 0) e.verre.push({ i: x.i, r: arrondi(x.t) }); cible = null; }
      L.missions.noter("refraction", JSON.parse(JSON.stringify(e)));
    };
    L.texte(g, 820, 300, "Laser en haut : dans l'air.", { "font-size": 9, "font-weight": 700, fill: "#e8e2d4" });
    L.texte(g, 820, 316, "Laser en bas : dans le plexiglas.", { "font-size": 9, "font-weight": 700, fill: "#e8e2d4" });
    return { pense_bete };
  };
})(window.Labo);

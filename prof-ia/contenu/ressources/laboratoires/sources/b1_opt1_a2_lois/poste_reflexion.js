/*
Rôle : paillasse « réflexion » : disque optique gradué portant un miroir plan sur son diamètre horizontal ; laser que l'on
       fait glisser sur le bord. Chaque position lâchée note un essai (i, r) ; placer le laser sur le rayon réfléchi d'un
       essai montre le retour inverse de la lumière.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_reflexion(g) -> { pense_bete } ; fait « reflexion » = { essais: [{ i, r }], retour }.
Utilisé par : simulation.js.
*/
(function (L) {
  L.poste_reflexion = function (g) {
    // Décor, socle, disque ; essais notés à chaque lâcher du laser.
    const { pense_bete } = L.decor_circuit(g, 0), C = { x: 470, y: 340 }, e = { essais: [], retour: false };
    L.svg("rect", { x: C.x - 70, y: 525, width: 140, height: 14, rx: 3, fill: "#3a3f44" }, g);
    L.tige(g, `M${C.x} 525 V${C.y + 180}`, 10);
    const d = L.disque_optique(L.svg("g", {}, g), { C, R: 160, n: null });
    let avant = null;
    d.sur_lacher = () => {
      // Essai noté ; retour inverse si le laser est mis à la place du rayon réfléchi de l'essai précédent.
      const x = d.rayons();
      if (avant !== null && avant !== 0 && d.a === -avant) e.retour = true;
      if (x.i > 0) e.essais.push({ i: x.i, r: x.r });
      avant = d.a;
      L.missions.noter("reflexion", JSON.parse(JSON.stringify(e)));
    };
    L.texte(g, 820, 300, "Faites glisser le laser", { "font-size": 9, "font-weight": 700, fill: "#e8e2d4" });
    L.texte(g, 820, 316, "sur le bord du disque.", { "font-size": 9, "font-weight": 700, fill: "#e8e2d4" });
    return { pense_bete };
  };
})(window.Labo);

/*
Rôle : les deux paillasses de l'électrisation : (1) baguettes, chiffons et coupelle de petits papiers ; (2) potence avec
       l'étrier, deux baguettes de PVC, une baguette de verre, chiffons et loupe « modèle ».
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_papier(groupe), Labo.poste_etrier(groupe) -> { pense_bete }.
Utilisé par : simulation.js.
*/
(function (L) {
  const CHIFFONS = () => [{ matiere: "laine", x: 600, y: 428, l: 120, h: 40 }, { matiere: "soie", x: 760, y: 428, l: 120, h: 40 }];

  L.poste_papier = function (g) {
    // Une baguette de PVC, une de verre, les chiffons, la coupelle de papiers.
    const baguettes = L.svg("g", {}, g);
    let papiers = null;
    const f = L.frottement(baguettes, {
      chiffons: CHIFFONS(),
      baguettes: [{ id: "pvc", matiere: "pvc", repos: { x: 330, y: 448 } }, { id: "verre", matiere: "verre", repos: { x: 330, y: 500 } }],
      sur_deplacement: (b, lache) => { if (lache) papiers.lacher(b); },
    });
    papiers = L.papiers(g, { x: 520, y: 548 }, f.baguettes);
    return { pense_bete: L.decor.pense_bete(g, 24, 52, 230) };
  };

  L.poste_etrier = function (g) {
    // Potence et étrier, trois baguettes, chiffons ; loupe rangée sur le mur, à droite.
    const attache = L.potence(L.svg("g", {}, g)), chiffons = CHIFFONS(), baguettes = L.svg("g", {}, g);
    let etrier = null;
    const f = L.frottement(baguettes, {
      chiffons,
      baguettes: [{ id: "pvc1", matiere: "pvc", repos: { x: 320, y: 446 } }, { id: "pvc2", matiere: "pvc", repos: { x: 320, y: 498 } }, { id: "verre", matiere: "verre", repos: { x: 320, y: 550 } }],
      sur_deplacement: (b, lache) => { if (lache) etrier.deposer(b); },
    });
    etrier = L.etrier(g, attache, f.baguettes);
    const objets = () => [
      ...f.baguettes.map((b) => ({ id: b.id, nom: b.matiere === "verre" ? "verre" : "PVC", q: b.q, zone: (x, y) => (b.pose_sur_etrier ? Math.abs(x - attache.x) < 90 && Math.abs(y - attache.y - 200) < 20 : Math.abs(x - b.pos.x) < 100 && Math.abs(y - b.pos.y) < 9) })),
      ...chiffons.map((c) => ({ id: c.matiere, nom: c.matiere, q: c.q || 0, zone: (x, y) => x > c.x - 10 && x < c.x + c.l && y > c.y && y < c.y + c.h })),
    ];
    L.loupe(g, objets, { x: 880, y: 250 });
    return { pense_bete: L.decor.pense_bete(g, 24, 52, 230) };
  };
})(window.Labo);

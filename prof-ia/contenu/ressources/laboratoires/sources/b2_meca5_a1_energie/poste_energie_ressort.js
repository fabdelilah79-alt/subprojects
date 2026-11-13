/*
Rôle : paillasse « énergie mécanique du solide-ressort horizontal » : banc à coussin d'air (frottements très faibles,
       h = 0,001 kg/s), mobile de 200 g, ressort de 10 N/m, palette d'amortissement sur le plateau ; capteur de position,
       interface et logiciel x(t) avec la vue « Énergies » : Ec = ½·m·v², Epe = ½·K·x², Em = Ec + Epe.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_energie_ressort(g) -> { pense_bete } ; faits « essais_ressort » = [{ id, amortisseur, x0, Em0 (J) }],
          « montage », « acquisition ».
Utilisé par : simulation.js (paillasse 2).
*/
(function (L) {
  const DECALAGE = 0.3;

  function fiche(g) {
    // Fiche des données collée au mur.
    L.svg("rect", { x: 272, y: 48, width: 264, height: 78, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 404, 64, "Énergies du solide-ressort", { "font-size": 9.5, "font-weight": 700, fill: "#23315a" });
    ["Mobile : m = 200 g ; ressort : K = 10 N/m", "Référence : Epe = 0 à l'équilibre (x = 0)", "Logiciel : v = dx/dt ; Ec = ½·m·v² ; Epe = ½·K·x²"].forEach((t, i) => L.texte(g, 404, 81 + i * 15, t, { "font-size": 8, fill: "#222" }));
  }

  L.poste_energie_ressort = function (g) {
    // Portable (derrière), banc, palette ; le lâcher déclenche l'acquisition et note l'essai.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), essais = [];
    fiche(g);
    let banc = null;
    const logiciel = L.logiciel_xt(g, { x: 560, y: 160, boitier: { x: 704, y: 508 }, etiquette: () => (banc.e.amortisseur === "palette" ? "avec la palette" : "sans amortisseur"),
      energies: (x, v) => [0.5 * banc.masse() * v * v, 0.5 * banc.e.k * x * x] });
    banc = L.banc_ressort(g, { k: 10, h_base: 0.001,
      sur_pas: (t, x) => logiciel.mesurer(t, DECALAGE + x),
      sur_lacher: (x0) => { essais.push({ id: `essai${essais.length + 1}`, amortisseur: banc.e.amortisseur, x0: Math.round(x0 * 1000) / 1000, Em0: Math.round(0.5 * banc.e.k * x0 * x0 * 1e5) / 1e5 }); L.missions.noter("essais_ressort", essais.slice()); logiciel.depart(banc.e.t); } });
    L.accessoires_ressort(g, banc, { amortisseurs: ["palette"], surcharges: 0 });
    L.missions.noter("essais_ressort", []);
    return { pense_bete };
  };
})(window.Labo);

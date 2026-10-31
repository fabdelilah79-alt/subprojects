/*
Rôle : paillasse « métaux et ions » : lunettes et gants, trois tubes à essai dans un porte-tubes (nitrate d'argent, sulfate
       de cuivre, sulfate de cuivre), fil de cuivre et clou en fer, flacon compte-gouttes de soude (identification des ions
       par précipitation), fiche des tests des ions. Les transformations sont dans ions_metaux.js et metal_tube.js.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_metaux(groupe) -> { pense_bete } ; fait « metaux » = { protege, t1, t2, t3 : { metal, Ag_depose, Cu_depose,
          Ag, Cu, Fe (mmol d'ions), HO, CuOH2, FeOH2, Ag2O (mmol de précipités) } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6;
  const TUBES = [["t1", "nitrate_argent", "AgNO₃"], ["t2", "sulfate_cuivre", "CuSO₄"], ["t3", "sulfate_cuivre", "CuSO₄"]];

  function fiche(g) {
    // Fiche murale : tests des ions à la soude.
    L.svg("rect", { x: 700, y: 46, width: 290, height: 92, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 845, 64, "Identifier un ion avec la soude", { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    ["Cu²⁺ : précipité bleu d'hydroxyde de cuivre Cu(OH)₂", "Fe²⁺ : précipité vert d'hydroxyde de fer Fe(OH)₂", "Ag⁺ : précipité brun d'oxyde d'argent Ag₂O", "Les ions NO₃⁻ et SO₄²⁻ ne réagissent pas ici."].forEach((t, i) => L.texte(g, 845, 84 + i * 15, t, { "font-size": 8.6, fill: "#222" }));
  }

  L.poste_metaux = function (g) {
    // Équipement, tubes, métaux, soude ; le bilan des tubes est noté à chaque changement.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 400, y: 236, width: 320, height: 24, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 560, 248, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    L.ecoulement(ctx, { sol: SOL, e: E });
    fiche(g);
    const epi = L.equipement(g, { x: 300, y: 70, changer: () => dire("") });
    const rack = L.porte_tubes(ctx, { x: 420, sol: SOL, e: E, n: 3, pas: 30 });
    const tubes = TUBES.map(([id, liquide, etiquette], k) => L.recipient(ctx, { id, profil: "tube", x: rack[k].x, y: rack[k].y, contenu: { [liquide]: 5 }, etiquette }));
    tubes.forEach((t) => t.g.setAttribute("pointer-events", "none"));
    L.flacon_gouttes(ctx, { id: "soude", x: 548, sol: SOL, e: E, liquide: "soude", texte: "Soude\n1 mol/L", autoriser: () => epi.protege() || (dire("La soude est corrosive : mettez lunettes et gants."), false) });
    L.metaux_tubes(ctx, { metaux: [{ type: "fer", x: 262 }, { type: "cuivre", x: 712 }], sol: SOL, e: E, tubes, dire });
    const r3 = (v) => Math.round(v * 1000) / 1000;
    const noter = () => {
      const f = { protege: epi.protege() };
      tubes.forEach((t) => { f[t.id] = { metal: t.metal?.type || null, Ag_depose: r3(t.metal?.Ag || 0), Cu_depose: r3(t.metal?.Cu || 0), ...L.IONS.bilan(t.c) }; });
      L.missions.noter("metaux", f);
    };
    ctx.sur_changement(noter); noter();
    setInterval(noter, 500);
    return { pense_bete };
  };
})(window.Labo);

/*
Rôle : paillasse « transfert spontané d'électrons entre espèces mélangées » : deux tubes dans un porte-tubes, nitrate d'argent
       à 0,10 mol/L et sulfate de cuivre à 0,050 mol/L ; fil de cuivre et clou en fer sur leurs verres de montre (metal_tube.js,
       ions_metaux.js) : Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag ; Fe + Cu²⁺ → Fe²⁺ + Cu ; fiche des constantes d'équilibre.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_melange(g) -> { pense_bete } ; fait « melanges » = { t1, t2 : { metal, Ag_depose, Cu_depose (mmol) } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6;

  L.poste_melange = function (g) {
    // Porte-tubes, deux tubes, deux métaux, fiche ; dépôts notés deux fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) L.texte(calque, 560, 248, t, { "font-size": 8, "font-weight": 700, fill: "#6b3d00" }); };
    L.ecoulement(ctx, { sol: SOL, e: E });
    L.svg("rect", { x: 680, y: 46, width: 310, height: 78, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 835, 64, "Données (25 °C)", { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    ["Cu + 2 Ag⁺ ⇌ Cu²⁺ + 2 Ag : K ≈ 2 × 10¹⁵", "Fe + Cu²⁺ ⇌ Fe²⁺ + Cu : K ≈ 3 × 10²⁶"].forEach((t, i) => L.texte(g, 835, 84 + i * 16, t, { "font-size": 8.8, fill: "#222" }));
    const rack = L.porte_tubes(ctx, { x: 420, sol: SOL, e: E, n: 2, pas: 30 });
    const tubes = [["t1", "nitrate_argent", "AgNO₃"], ["t2", "sulfate_cuivre", "CuSO₄"]].map(([id, liquide, etiquette], k) => L.recipient(ctx, { id, profil: "tube", x: rack[k].x, y: rack[k].y, contenu: { [liquide]: 5 }, etiquette }));
    tubes.forEach((t) => t.g.setAttribute("pointer-events", "none"));
    L.metaux_tubes(ctx, { metaux: [{ type: "fer", x: 262 }, { type: "cuivre", x: 690 }], sol: SOL, e: E, tubes, dire });
    const r3 = (v) => Math.round(v * 1000) / 1000;
    const noter = () => L.missions.noter("melanges", Object.fromEntries(tubes.map((t) => [t.id, { metal: t.metal?.type || null, Ag_depose: r3(t.metal?.Ag || 0), Cu_depose: r3(t.metal?.Cu || 0) }])));
    ctx.sur_changement(noter); noter(); setInterval(noter, 500);
    return { pense_bete };
  };
})(window.Labo);

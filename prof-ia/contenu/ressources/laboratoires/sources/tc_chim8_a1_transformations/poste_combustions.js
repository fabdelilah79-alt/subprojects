/*
Rôle : paillasse « combustions », sous la hotte aspirante : lunettes, affiche de sécurité, réactifs sur leurs carreaux
       (soufre, laine de fer, sodium), têt à combustion sur son support, bec Bunsen, un flacon de dioxygène devant, un autre
       flacon de dioxygène et un flacon de dichlore au fond (cuillere_combustion.js, flacon_gaz.js).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_combustions(groupe) -> { pense_bete } ; fait « combustions » = { lunettes, allume, reactif, m, T, lieu, brule,
          faits (par réactif : masse restante, masses brûlées dans l'air ou dans chaque flacon), flacons { id : { gaz (part
          restante), produits (g) } } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, FOND = 470, E = 1.6;

  function hotte(g) {
    // Hotte aspirante : montants, bandeau supérieur, vitre relevée, voyant d'aspiration.
    for (const x of [96, 1004]) L.svg("rect", { x: x - 8, y: 0, width: 16, height: 590, fill: "url(#metal)", stroke: "#7d868c" }, g);
    L.svg("rect", { x: 88, y: 0, width: 932, height: 30, fill: "#cfd5d8", stroke: "#8f989e" }, g);
    L.svg("rect", { x: 104, y: 30, width: 892, height: 14, fill: "rgba(205,228,236,0.55)", stroke: "#8f989e" }, g);
    L.svg("circle", { cx: 588, cy: 15, r: 4, fill: "#3ccf5a" }, g);
    L.texte(g, 720, 18, "HOTTE ASPIRANTE — aspiration en marche", { "font-size": 9, "font-weight": 700, fill: "#33414b" });
  }

  function support(g, x, sol) {
    // Support du têt : socle, tige, pince en fourche ; carreau de céramique sous la coupelle.
    L.svg("rect", { x: x - 22, y: sol - 6, width: 44, height: 6, rx: 1, fill: "#e9e4d8", stroke: "#b8b09c" }, g);
    L.svg("rect", { x: x - 70, y: sol - 8, width: 26, height: 8, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, `M${x - 57} ${sol - 8} V${sol - 230}`, 5);
    L.tige(g, `M${x - 57} ${sol - 220} H${x - 4}`, 3);
    L.svg("path", { d: `M${x - 6} ${sol - 226} h-6 v12 h6`, fill: "none", stroke: "#5d646a", "stroke-width": 2 }, g);
  }

  L.poste_combustions = function (g) {
    // Matériel et gestes ; le bilan est noté quand il change.
    hotte(g);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 400, y: 200, width: 330, height: 26, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 565, 213, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    L.affiche_securite(g, 780, 56);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const epi = L.equipement(g, { x: 300, y: 70, changer: () => dire("") });
    const cl2 = L.flacon_gaz(ctx, { id: "Cl2", x: 895, sol: FOND, e: E, gaz: "Cl2", m0: 1.8, etiquette: "dichlore", dire });
    const o2b = L.flacon_gaz(ctx, { id: "O2b", x: 760, sol: FOND, e: E, gaz: "O2", m0: 0.8, etiquette: "dioxygène 2", contenu: { eau: 20 }, dire });
    support(ctx.fond, 345, SOL);
    const bec = L.bec_bunsen(ctx, { x: 490, sol: SOL, e: E, dire });
    const flacons = [L.flacon_gaz(ctx, { id: "O2a", x: 668, sol: SOL, e: E, gaz: "O2", m0: 0.8, etiquette: "dioxygène 1", contenu: { eau: 20 }, dire }), o2b, cl2];
    const t = L.cuillere_combustion(ctx, bec, { support: { x: 345, sol: SOL }, carreaux: [{ reactif: "soufre", x: 175 }, { reactif: "fer", x: 228 }, { reactif: "sodium", x: 281 }], sol_carreaux: FOND, flacons, e: E, dire,
      autoriser: () => epi.porte.lunettes || (dire("Mettez vos lunettes : les combustions dans le dioxygène sont très vives."), false) });
    const r3 = (v) => Math.round(v * 1000) / 1000;
    const noter = () => {
      const f = {}; flacons.forEach((k) => { const a = k.atmosphere; f[k.id] = { gaz: r3(a.m / a.m0), produits: Object.fromEntries(Object.entries(a.produits).map(([n, v]) => [n, r3(v)])), plaque: k.bouchon }; });
      const v = { lunettes: epi.porte.lunettes, allume: bec.allume, reactif: t.reactif, m: r3(t.m), T: Math.round(t.T), lieu: t.dans?.id || t.lieu, brule: t.brule, faits: JSON.parse(JSON.stringify(t.faits)), flacons: f };
      const s = JSON.stringify(v);
      if (s !== noter.avant) { noter.avant = s; L.missions.noter("combustions", v); }
    };
    setInterval(noter, 200);
    return { pense_bete };
  };
})(window.Labo);

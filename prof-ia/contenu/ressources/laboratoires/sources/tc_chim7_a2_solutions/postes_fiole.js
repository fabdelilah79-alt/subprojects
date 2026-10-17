/*
Rôle : les deux paillasses « fiole jaugée » : (1) préparer 100,0 mL de solution de glucose par dissolution : balance, pot de
       glucose, coupelles de pesée, fiole jaugée de 100 mL avec son entonnoir et son bouchon, pissette d'eau distillée,
       pipette Pasteur dans un bécher d'eau distillée ; (2) dessinée à 1,2 px/mm pour que la pipette graduée tienne à
       l'écran : diluer dix fois une eau iodée (solution mère) dans une fiole jaugée de 50 mL. Une loupe montre le trait de jauge.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_preparation(groupe), Labo.poste_dilution(groupe) -> { pense_bete } ; faits « preparation » = { pesee (g pesés),
          reste (g sur la coupelle), lecture, glucose (g dans la fiole), fiole (état de fiole_jaugee.js) } et « dilution » =
          { lecture, V_pipette, dans, I2 (quantité de teinte dans la fiole), fiole }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, BAS = 470;

  function bulle(g, x, y) {
    // Messages de la paillasse, dans une bulle orange.
    const calque = L.svg("g", { "pointer-events": "none" }, g);
    return (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x, y, width: 320, height: 24, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, x + 160, y + 12, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
  }

  function fiche(g, titre, lignes) {
    // Fiche murale de données.
    L.svg("rect", { x: 700, y: 46, width: 290, height: 30 + lignes.length * 15, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 845, 64, titre, { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    lignes.forEach((t, i) => L.texte(g, 845, 84 + i * 15, t, { "font-size": 9, fill: "#222" }));
  }

  function eau_distillee(ctx, x_pissette, x_becher, e) {
    // Au fond de la paillasse : pissette d'eau distillée, bécher d'eau distillée et sa pipette Pasteur.
    L.pissette(ctx, { x: x_pissette, sol: BAS, e });
    const b = L.recipient(ctx, { id: "eau_pasteur", profil: "becher_50", x: x_becher, y: BAS, e, contenu: { eau: 40 }, etiquette: "eau distillée" });
    L.flacon_gouttes(ctx, { id: "pasteur", becher: b, e });
  }

  L.poste_preparation = function (g) {
    // Paillasse 1 : pesée du glucose, transfert dans la fiole, dissolution, ajustement au trait, homogénéisation.
    const E = 1.6, pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), dire = bulle(g, 400, 236);
    L.ecoulement(ctx, { sol: SOL, e: E });
    fiche(g, "Données", ["Glucose C₆H₁₂O₆ : M = 180 g/mol", "Fiole jaugée : 100,0 mL ± 0,1 mL", "Lire le bas du ménisque, l'œil au niveau du trait."]);
    eau_distillee(ctx, 245, 845, E);
    const b = L.balance_electronique(ctx, { x: 330, sol: SOL, e: E });
    const P = L.pesee_poudre(ctx, b, { pots: [{ id: "glucose", nom: "Glucose\nC₆H₁₂O₆", x: 545, rgb: [252, 252, 250], solide: "glucose_cristaux" }], coupelles: [515, 565], sol: SOL, sol_pots: BAS, e: E, dire });
    const F = L.fiole_jaugee(ctx, { id: "fiole100", profil: "fiole_jaugee_100", x: 655, sol: SOL, e: E, dire, entonnoir: { x: 772, sol: SOL }, bouchon: { x: 610, sol: BAS }, loupe: { x: 905, y: 262, r: 60 } });
    L.dissolution(ctx);
    let pesee = 0;
    const noter = () => {
      const c = P.coupelles.find((k) => k.produit === "glucose");
      if (c?.sur_balance) pesee = Math.round(c.poudre * 1000) / 1000;
      const glucose = L.solide_g(F.r.c, "glucose_cristaux") + L.dissous_g(F.r.c, "glucose_cristaux");
      L.missions.noter("preparation", { pesee, reste: c ? Math.round(c.poudre * 1e4) / 1e4 : 0, lecture: b.lecture(), glucose: Math.round(glucose * 1000) / 1000, fiole: F.etat() });
    };
    L.bouton_texte(g, 140, 250, "Nouvelle fiole", () => {
      // Recommencer : fiole vidée et rincée, coupelles vidées.
      F.vider(); pesee = 0;
      P.coupelles.forEach((c) => { if (c.sur_balance) b.retirer(c); Object.assign(c, { produit: null, poudre: 0, masse: 1.25, versant: null, sur_balance: false, pos: { ...c.repos } }); c.dessiner(); });
      dire("Fiole vidée et rincée, coupelles propres : recommencez la pesée."); noter();
    });
    ctx.sur_changement(noter); b.sur_changement(noter); noter();
    setInterval(noter, 500);
    return { pense_bete };
  };

  L.poste_dilution = function (g) {
    // Paillasse 2 (échelle 1,2) : solution mère, pipette graduée sur son support, fiole de 50 mL, bécher de récupération.
    const E = 1.2, pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), dire = bulle(g, 400, 236);
    L.ecoulement(ctx, { sol: SOL, e: E });
    fiche(g, "Solution mère", ["Eau iodée (diiode I₂ dissous dans l'eau)", "C₀ = 1,0 × 10⁻³ mol/L", "Fiole jaugée : 50,0 mL ± 0,06 mL"]);
    eau_distillee(ctx, 700, 830, E);
    const mere = L.recipient(ctx, { id: "mere", profil: "becher_100", x: 300, y: SOL, e: E, contenu: { eau_iodee: 70 }, etiquette: "solution mère" });
    const dechets = L.recipient(ctx, { id: "dechets", profil: "becher_250", x: 770, y: SOL, e: E, etiquette: "récupération" });
    [mere, dechets].forEach((r) => r.g.setAttribute("pointer-events", "none"));
    const F = L.fiole_jaugee(ctx, { id: "fiole50", profil: "fiole_jaugee_50", x: 430, sol: SOL, e: E, dire, bouchon: { x: 520, sol: BAS }, loupe: { x: 905, y: 262, r: 60 } });
    L.svg("rect", { x: 560, y: SOL - 8, width: 70, height: 8, rx: 2, fill: "#3a3f44" }, ctx.fond);
    L.tige(ctx.fond, `M620 ${SOL - 8} V${SOL - 300}`, 4);
    for (const y of [SOL - 120, SOL - 280]) { L.tige(ctx.fond, `M620 ${y} H596`, 3); L.svg("path", { d: `M597 ${y - 5} h-8 v10 h8`, fill: "none", stroke: "#5d646a", "stroke-width": 2 }, ctx.fond); }
    const pip = L.pipette_graduee(ctx, { support: { x: 590, y: SOL - 10 }, e: E, dire });
    const noter = () => {
      const I2 = F.r.c.phases.reduce((s, p) => s + (p.dissous.I2 || 0), 0);
      L.missions.noter("dilution", { lecture: pip.lecture(), V_pipette: Math.round(pip.V * 100) / 100, dans: pip.dans?.id || null, I2: Math.round(I2 * 1e4) / 1e4, fiole: F.etat() });
    };
    L.bouton_texte(g, 140, 250, "Nouvelle fiole", () => { F.vider(); dire("Fiole vidée et rincée : recommencez le prélèvement."); noter(); });
    ctx.sur_changement(noter); noter();
    setInterval(noter, 500);
    return { pense_bete };
  };
})(window.Labo);

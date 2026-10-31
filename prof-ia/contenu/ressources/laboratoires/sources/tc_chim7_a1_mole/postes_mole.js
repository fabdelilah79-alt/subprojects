/*
Rôle : les deux paillasses de l'activité « mesurer une même quantité de matière » : (1) balance, quatre pots (saccharose,
       chlorure de sodium, soufre, fer) avec leur spatule, coupelles de pesée, fiche des masses molaires atomiques ;
       (2) dessinée à 1,2 px/mm pour que la pipette et son pipeteur tiennent à l'écran : béchers d'éthanol et d'eau,
       pipette graduée de 10 mL, bécher de 50 mL posé sur une balance, fiche des masses volumiques.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_pesees(groupe), Labo.poste_liquides(groupe) -> { pense_bete } ; faits « pesees » = { produit : masse (g) }
          et « liquides » = { lecture, V_pipette, recu : { liquide : mL }, masse (g, lecture de la balance) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576;
  const POTS = [{ id: "sucre", nom: "Saccharose\nC12H22O11", x: 540, rgb: [248, 248, 244] }, { id: "sel", nom: "Chlorure de\nsodium NaCl", x: 630, rgb: [240, 242, 244] }, { id: "soufre", nom: "Soufre\nS", x: 720, rgb: [236, 214, 64] }, { id: "fer", nom: "Fer\nFe", x: 810, rgb: [96, 98, 102] }];

  function fiche(g, x, y, titre, lignes) {
    // Fiche murale : un titre, quelques lignes.
    L.svg("rect", { x, y, width: 240, height: 30 + lignes.length * 16, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, x + 120, y + 18, titre, { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    lignes.forEach((t, i) => L.texte(g, x + 120, y + 38 + i * 16, t, { "font-size": 9.5, fill: "#222" }));
  }

  L.poste_pesees = function (g) {
    // Paillasse 1 : pesée de solides.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 420, y: 236, width: 320, height: 24, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 580, 248, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    L.ecoulement(ctx, { sol: SOL, e: 1.6 });
    fiche(g, 700, 50, "Masses molaires atomiques (g/mol)", ["H : 1 ; C : 12 ; O : 16", "Na : 23 ; S : 32", "Cl : 35,5 ; Fe : 56"]);
    const b = L.balance_electronique(ctx, { x: 330, sol: SOL, e: 1.6 });
    const pots = POTS.map((p) => ({ ...p, nom: p.nom.replace(/\d+/g, (n) => n.split("").map((c) => "₀₁₂₃₄₅₆₇₈₉"[c]).join("")) }));
    const P = L.pesee_poudre(ctx, b, { pots, coupelles: [530, 590, 650, 710, 770], sol: SOL, sol_pots: 470, e: 1.6, dire });
    const noter = () => { const v = {}; P.coupelles.forEach((c) => { if (c.produit) v[c.produit] = Math.round(c.poudre * 1000) / 1000; }); L.missions.noter("pesees", { ...v, lecture: b.lecture() }); };
    ctx.sur_changement(noter); b.sur_changement(noter); noter();
    return { pense_bete };
  };

  L.poste_liquides = function (g) {
    // Paillasse 2 (échelle 1,2) : béchers, pipette graduée, bécher sur la balance.
    const E = 1.2, pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 420, y: 60, width: 320, height: 24, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 580, 72, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    L.ecoulement(ctx, { sol: SOL, e: E });
    fiche(g, 760, 50, "Données (20 °C)", ["éthanol : M = 46 g/mol", "ρ = 0,79 g/mL", "eau : M = 18 g/mol ; ρ = 1,0 g/mL"]);
    const eth = L.recipient(ctx, { id: "ethanol", profil: "becher_100", x: 300, y: SOL, e: E, contenu: { ethanol: 60 }, etiquette: "éthanol", pictos: ["SGH02"] });
    const eau = L.recipient(ctx, { id: "eau", profil: "becher_100", x: 400, y: SOL, e: E, contenu: { eau: 60 }, etiquette: "eau" });
    [eth, eau].forEach((r) => r.g.setAttribute("pointer-events", "none"));
    const b = L.balance_electronique(ctx, { x: 640, sol: SOL, e: E });
    const pese = L.recipient(ctx, { id: "pesee", profil: "becher_50", x: b.plateau.x, y: b.plateau.y + 2, e: E });
    pese.g.setAttribute("pointer-events", "none");
    b.ajouter({ get masse() { return 31.42 + pese.c.phases.reduce((s, p) => s + Object.entries(p.liquides).reduce((t, [n, v]) => t + v * L.LIQUIDES[n].d, 0), 0); } });
    L.svg("rect", { x: 470, y: SOL - 8, width: 70, height: 8, rx: 2, fill: "#3a3f44" }, ctx.fond);
    L.tige(ctx.fond, `M530 ${SOL - 8} V${SOL - 300}`, 4);
    for (const y of [SOL - 120, SOL - 280]) { L.tige(ctx.fond, `M530 ${y} H506`, 3); L.svg("path", { d: `M507 ${y - 5} h-8 v10 h8`, fill: "none", stroke: "#5d646a", "stroke-width": 2 }, ctx.fond); }
    const pip = L.pipette_graduee(ctx, { support: { x: 500, y: SOL - 10 }, e: E, dire });
    const noter = () => {
      const recu = {}; pese.c.phases.forEach((p) => Object.entries(p.liquides).forEach(([n, v]) => { recu[n] = Math.round(((recu[n] || 0) + v) * 100) / 100; }));
      L.missions.noter("liquides", { lecture: pip.lecture(), V_pipette: Math.round(pip.V * 100) / 100, dans: pip.dans?.id || null, recu, masse: b.lecture() });
    };
    ctx.sur_changement(noter); b.sur_changement(noter); noter();
    return { pense_bete };
  };
})(window.Labo);

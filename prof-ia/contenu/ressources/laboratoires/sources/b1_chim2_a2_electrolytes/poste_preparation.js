/*
Rôle : paillasse « préparer une solution électrolytique » : 100,0 mL de solution de sulfate de cuivre (II) à 0,100 mol/L par
       dissolution de cristaux bleus de sulfate de cuivre pentahydraté (M = 249,7 g/mol) : lunettes et gants au mur,
       étiquette du flacon avec ses pictogrammes de danger, balance, coupelles, fiole jaugée (entonnoir, bouchon, loupe),
       pissette et pipette d'eau distillée. Les cristaux se dissolvent peu à peu ; les ions Cu²⁺ colorent l'eau en bleu.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_preparation_cuivre(g) -> { pense_bete } ; fait « preparation » = { epi, pesee (g), cuivre (mmol de Cu²⁺ dans la fiole), fiole }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, BAS = 470, E = 1.6, M = 249.7;
  L.LIQUIDES.sulfate_cuivre_cristaux = { nom: "sulfate de cuivre pentahydraté", d: 2.28, rgb: [40, 110, 205], alpha: 0.97, classe: "solide" };
  L.DISSOLUTION.sulfate_cuivre_cristaux = { espece: "Cu2+", par_g: 1000 / M, sol: { eau: 0.32 }, K: 1.5, grain: 1.6, n: 40 };
  L.TEINTES["Cu2+"] ??= { aqueuse: [24, 104, 214], organique: [24, 104, 214] };

  function bulle(g, x, y) {
    // Messages de la paillasse, dans une bulle orange.
    const calque = L.svg("g", { "pointer-events": "none" }, g);
    return (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x, y, width: 320, height: 24, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, x + 160, y + 12, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
  }

  function fiche(g) {
    // Fiche murale : données et pictogrammes du sulfate de cuivre pentahydraté.
    L.svg("rect", { x: 660, y: 40, width: 330, height: 112, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0" }, g);
    L.texte(g, 825, 58, "Sulfate de cuivre pentahydraté CuSO₄,5H₂O", { "font-size": 9.5, "font-weight": 700, fill: "#23315a" });
    ["M = 249,7 g/mol ; fiole jaugée de 100,0 mL", "Nocif en cas d'ingestion, irritant pour les yeux", "Très toxique pour les organismes aquatiques"].forEach((t, i) => L.texte(g, 790, 80 + i * 15, t, { "font-size": 8.5, fill: "#222" }));
    L.pictogramme(g, 930, 110, 22, "SGH07"); L.pictogramme(g, 966, 110, 22, "SGH09");
  }

  L.poste_preparation_cuivre = function (g) {
    // Pesée, transfert, dissolution, ajustement au trait, homogénéisation ; équipement de protection.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), dire = bulle(g, 380, 236);
    L.ecoulement(ctx, { sol: SOL, e: E }); fiche(g);
    const epi = L.equipement(g, { x: 300, y: 70, changer: () => dire("") });
    L.pissette(ctx, { x: 245, sol: BAS, e: E });
    const eau = L.recipient(ctx, { id: "eau_pasteur", profil: "becher_50", x: 845, y: BAS, e: E, contenu: { eau: 40 }, etiquette: "eau distillée" });
    L.flacon_gouttes(ctx, { id: "pasteur", becher: eau, e: E });
    const b = L.balance_electronique(ctx, { x: 330, sol: SOL, e: E });
    const P = L.pesee_poudre(ctx, b, { pots: [{ id: "cuso4", nom: "Sulfate de\ncuivre", x: 545, rgb: [40, 110, 205], solide: "sulfate_cuivre_cristaux" }], coupelles: [515, 565], sol: SOL, sol_pots: BAS, e: E, dire });
    const F = L.fiole_jaugee(ctx, { id: "fiole100", profil: "fiole_jaugee_100", x: 655, sol: SOL, e: E, dire, entonnoir: { x: 772, sol: SOL }, bouchon: { x: 610, sol: BAS }, loupe: { x: 905, y: 262, r: 60 } });
    L.dissolution(ctx);
    let pesee = 0;
    const noter = () => {
      // Masse pesée (coupelle sur la balance), ions cuivre dans la fiole (dissous ou encore en cristaux), état de la fiole.
      const c = P.coupelles.find((k) => k.produit === "cuso4");
      if (c?.sur_balance) pesee = Math.round(c.poudre * 1000) / 1000;
      const m = L.solide_g(F.r.c, "sulfate_cuivre_cristaux") + L.dissous_g(F.r.c, "sulfate_cuivre_cristaux");
      L.missions.noter("preparation", { epi: epi.protege(), pesee, cuivre: Math.round((m * 1000 / M) * 1000) / 1000, fiole: F.etat() });
    };
    ctx.sur_changement(noter); b.sur_changement(noter); noter();
    setInterval(noter, 500);
    return { pense_bete };
  };
})(window.Labo);

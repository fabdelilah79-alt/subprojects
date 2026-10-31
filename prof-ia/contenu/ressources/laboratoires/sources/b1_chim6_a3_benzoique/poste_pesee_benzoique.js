/*
Rôle : paillasse de la pesée de l'acide benzoïque obtenu, séché à l'étuve : balance au centième, coupelles de pesée, pot
       contenant tout le produit sec (1,62 g) avec sa spatule (pesee_poudre.js), fiche des données pour le rendement.
       Le pot ne contient que le produit obtenu : quand tout est versé, il est vide.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_pesee_benzoique(groupe) -> { pense_bete } ; fait « pesee_benzoique » = { coupelle (vrai : une coupelle est
          sur la balance), lecture (g, ou null), sur_balance (masse de produit dans la coupelle posée sur la balance, g),
          verse (g de produit sorti du pot), tout (vrai : pot vide) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, M = L.BENZOIQUE.M_OBTENUE;
  const DONNEES = ["Alcool benzylique C₆H₅–CH₂OH : V = 2,0 mL ; d = 1,04 ; M = 108 g/mol", "Permanganate : en excès", "Acide benzoïque C₆H₅–COOH : M = 122 g/mol", "Rendement : r = n(obtenu) / n(max)"];

  function fiche(g) {
    // Fiche murale des données.
    L.svg("rect", { x: 560, y: 50, width: 400, height: 40 + DONNEES.length * 16, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 760, 70, "Données pour le rendement", { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    DONNEES.forEach((t, i) => L.texte(g, 760, 92 + i * 16, t, { "font-size": 9, fill: "#222" }));
  }

  function limiter(P, dire) {
    // Le produit versé ne dépasse pas ce que contenait le pot : l'excès est retiré de la coupelle qui vient d'en recevoir.
    const avec = P.coupelles.filter((c) => c.produit === "benzoique"), tot = avec.reduce((s, c) => s + c.poudre, 0);
    if (tot <= M) return tot;
    const c = avec.find((o) => o.poudre >= tot - M) || avec[0];
    c.poudre -= tot - M; c.masse = 1.25 + c.poudre; c.dessiner();
    if (!limiter.dit) { limiter.dit = true; dire("Le pot est vide : tout le produit obtenu est sorti."); }
    return M;
  }

  L.poste_pesee_benzoique = function (g) {
    // Balance, pot du produit sec, coupelles ; le fait suit la lecture et ce qui est versé.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 420, y: 236, width: 320, height: 24, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 580, 248, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    L.ecoulement(ctx, { sol: SOL, e: 1.6 });
    fiche(g);
    const b = L.balance_electronique(ctx, { x: 330, sol: SOL, e: 1.6 });
    const P = L.pesee_poudre(ctx, b, { pots: [{ id: "benzoique", nom: "Acide benzoïque\nobtenu (sec)", x: 640, rgb: [250, 250, 246] }], coupelles: [560, 640, 720], sol: SOL, sol_pots: 470, e: 1.6, dire });
    let verse = 0;
    const noter = () => {
      const c = P.coupelles.find((o) => o.sur_balance);
      L.missions.noter("pesee_benzoique", { coupelle: !!c, lecture: b.lecture(), sur_balance: c ? Math.round(c.poudre * 100) / 100 : 0, verse: Math.round(verse * 100) / 100, tout: verse >= M - 0.005 });
    };
    ctx.ecoulement.sur_pas(() => { const v = limiter(P, dire); if (v !== verse) { verse = v; noter(); } });
    ctx.sur_changement(noter); b.sur_changement(noter); noter();
    return { pense_bete };
  };
})(window.Labo);

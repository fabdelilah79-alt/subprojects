/*
Rôle : paillasses de pesée de la synthèse de l'aspirine (balance au centième, coupelles, pot et spatule : pesee_poudre.js, fiche
       des données) : (1) pesée de 3,00 g d'acide salicylique, que l'on introduira dans le ballon sec du montage ; (2) pesée de
       l'aspirine obtenue, séchée (le pot ne contient que le produit obtenu : 3,20 g ; vide, il ne donne plus rien).
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_pesee_salicylique, Labo.poste_pesee_aspirine (groupe) -> { pense_bete } ; faits « pesee_salicylique » et
          « pesee_aspirine » = { coupelle (une coupelle est sur la balance), lecture (g ou null), sur_balance (g), verse (g), tout }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576;
  const DONNEES = ["Acide salicylique C₇H₆O₃ : M = 138 g/mol", "Anhydride éthanoïque C₄H₆O₃ : V = 6,0 mL ; d = 1,08 ; M = 102 g/mol", "Aspirine C₉H₈O₄ : M = 180 g/mol", "Rendement : r = n(obtenu) / n(max)"];

  function fiche(g, titre) {
    // Fiche murale des données.
    L.svg("rect", { x: 560, y: 50, width: 400, height: 40 + DONNEES.length * 16, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 760, 70, titre, { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    DONNEES.forEach((t, i) => L.texte(g, 760, 92 + i * 16, t, { "font-size": 9, fill: "#222" }));
  }

  function limiter(P, pot, M, dire) {
    // Le produit versé ne dépasse pas ce que contenait le pot (M grammes, ou sans limite) : l'excès est retiré de la coupelle.
    const avec = P.coupelles.filter((c) => c.produit === pot), tot = avec.reduce((s, c) => s + c.poudre, 0);
    if (!M || tot <= M) return tot;
    const c = avec.find((o) => o.poudre >= tot - M) || avec[0];
    c.poudre -= tot - M; c.masse = 1.25 + c.poudre; c.dessiner();
    if (!limiter.dit) { limiter.dit = true; dire("Le pot est vide : tout le produit obtenu est sorti."); }
    return M;
  }

  const poste_pesee = ({ fait, pot, nom, rgb, M, titre }) => function (g) {
    // Balance, pot, coupelles ; le fait suit la lecture et ce qui est versé.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 420, y: 236, width: 320, height: 24, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 580, 248, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    L.ecoulement(ctx, { sol: SOL, e: 1.6 });
    fiche(g, titre);
    const b = L.balance_electronique(ctx, { x: 330, sol: SOL, e: 1.6 });
    const P = L.pesee_poudre(ctx, b, { pots: [{ id: pot, nom, x: 640, rgb }], coupelles: [560, 640, 720], sol: SOL, sol_pots: 470, e: 1.6, dire });
    let verse = 0;
    const noter = () => {
      const c = P.coupelles.find((o) => o.sur_balance);
      L.missions.noter(fait, { coupelle: !!c, lecture: b.lecture(), sur_balance: c ? Math.round(c.poudre * 100) / 100 : 0, verse: Math.round(verse * 100) / 100, tout: !!M && verse >= M - 0.005 });
    };
    ctx.ecoulement.sur_pas(() => { const v = limiter(P, pot, M, dire); if (v !== verse) { verse = v; noter(); } });
    ctx.sur_changement(noter); b.sur_changement(noter); noter();
    return { pense_bete };
  };

  L.poste_pesee_salicylique = poste_pesee({ fait: "pesee_salicylique", pot: "salicylique", nom: "Acide\nsalicylique", rgb: [248, 248, 244], M: null, titre: "Données de la synthèse" });
  L.poste_pesee_aspirine = poste_pesee({ fait: "pesee_aspirine", pot: "aspirine", nom: "Aspirine\nobtenue (sèche)", rgb: [250, 250, 246], M: L.ASPIRINE.M_OBTENUE, titre: "Données pour le rendement" });
})(window.Labo);

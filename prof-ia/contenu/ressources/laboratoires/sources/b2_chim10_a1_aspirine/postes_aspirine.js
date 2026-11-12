/*
Rôle : paillasses de la synthèse de l'aspirine : (1) chauffage à reflux de l'acide salicylique avec l'anhydride éthanoïque
       et quelques gouttes d'acide sulfurique (poste_synthese.js), contenu refroidi versé dans un bécher d'eau glacée où
       l'aspirine cristallise ; (2) filtration sous vide des cristaux (buchner_poste.js) ; (3) pesée de l'aspirine séchée :
       balance au centième, pot du produit sec (3,20 g), coupelles, spatule (pesee_poudre.js), fiche des données.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_reflux_aspirine, Labo.poste_filtration_aspirine, Labo.poste_pesee_aspirine (groupe) -> { pense_bete } ;
          faits « reflux_aspirine » (poste_synthese.js ; recu : mL de suspension de cristaux), « filtration_aspirine »
          (buchner_poste.js), « pesee_aspirine » = { coupelle, lecture (g ou null), sur_balance (g), verse (g), tout }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, A = L.ASPIRINE, S = A.somme, M = A.M_OBTENUE;
  const DONNEES = ["Acide salicylique C₇H₆O₃ : m = 3,00 g ; M = 138 g/mol", "Anhydride éthanoïque C₄H₆O₃ : V = 6,0 mL ; d = 1,08 ; M = 102 g/mol", "Aspirine C₉H₈O₄ : M = 180 g/mol", "Rendement : r = n(obtenu) / n(max)"];

  L.poste_reflux_aspirine = L.poste_synthese({
    fait: "reflux_aspirine", T_eb: 120, duree: 15, reagir: A.acetyler, suivis: ["acide_salicylique", "anhydride_acetique", "ox_sulfurique", "brut_aspirine"],
    reactifs: [
      { id: "salicylique", x: 490, contenu: { acide_salicylique: 2.1 }, texte: "acide salicylique 3,00 g", pictos: ["SGH07"] },
      { id: "anhydride", x: 560, contenu: { anhydride_acetique: 6 }, texte: "anhydride 6,0 mL", pictos: ["SGH05", "SGH02"] },
    ],
    gouttes: { liquide: "ox_sulfurique", texte: "Acide\nsulfurique" },
    recepteur: { profil: "becher_250", contenu: { eau_glacee: 60 }, etiquette: "eau glacée" },
    evoluer_recepteur: (c, dt) => A.cristalliser(c, dt),
    mesure: (r) => S(r.c, "suspension_aspirine"),
  });

  L.poste_filtration_aspirine = function (g) {
    // Les cristaux d'aspirine dans l'eau glacée ; ils restent sur le papier, l'eau mère passe.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: 1.6 });
    L.filtration_buchner(ctx, { fait: "filtration_aspirine", melange: { contenu: { suspension_aspirine: 25 }, etiquette: "cristaux + eau" }, retenu: { suspension_aspirine: "eau_mere_aspirine" }, residu_rgb: [250, 250, 246] });
    return { pense_bete };
  };

  function fiche(g) {
    // Fiche murale des données pour le rendement.
    L.svg("rect", { x: 560, y: 50, width: 400, height: 40 + DONNEES.length * 16, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 760, 70, "Données pour le rendement", { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    DONNEES.forEach((t, i) => L.texte(g, 760, 92 + i * 16, t, { "font-size": 9, fill: "#222" }));
  }

  function limiter(P, dire) {
    // Le produit versé ne dépasse pas ce que contenait le pot : l'excès est retiré de la coupelle qui vient d'en recevoir.
    const avec = P.coupelles.filter((c) => c.produit === "aspirine"), tot = avec.reduce((s, c) => s + c.poudre, 0);
    if (tot <= M) return tot;
    const c = avec.find((o) => o.poudre >= tot - M) || avec[0];
    c.poudre -= tot - M; c.masse = 1.25 + c.poudre; c.dessiner();
    if (!limiter.dit) { limiter.dit = true; dire("Le pot est vide : tout le produit obtenu est sorti."); }
    return M;
  }

  L.poste_pesee_aspirine = function (g) {
    // Balance, pot du produit sec, coupelles ; le fait suit la lecture et ce qui est versé.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 420, y: 236, width: 320, height: 24, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 580, 248, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    L.ecoulement(ctx, { sol: SOL, e: 1.6 });
    fiche(g);
    const b = L.balance_electronique(ctx, { x: 330, sol: SOL, e: 1.6 });
    const P = L.pesee_poudre(ctx, b, { pots: [{ id: "aspirine", nom: "Aspirine\nobtenue (sèche)", x: 640, rgb: [250, 250, 246] }], coupelles: [560, 640, 720], sol: SOL, sol_pots: 470, e: 1.6, dire });
    let verse = 0;
    const noter = () => {
      const c = P.coupelles.find((o) => o.sur_balance);
      L.missions.noter("pesee_aspirine", { coupelle: !!c, lecture: b.lecture(), sur_balance: c ? Math.round(c.poudre * 100) / 100 : 0, verse: Math.round(verse * 100) / 100, tout: verse >= M - 0.005 });
    };
    ctx.ecoulement.sur_pas(() => { const v = limiter(P, dire); if (v !== verse) { verse = v; noter(); } });
    ctx.sur_changement(noter); b.sur_changement(noter); noter();
    return { pense_bete };
  };
})(window.Labo);

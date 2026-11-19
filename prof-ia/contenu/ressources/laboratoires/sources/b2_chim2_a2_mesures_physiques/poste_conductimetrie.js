/*
Rôle : paillasse « suivi par conductimétrie » (1 px/mm) : bécher de 250 mL contenant 140 mL d'eau distillée, posé sur
       l'agitateur magnétique ; sonde du conductimètre tenue par une pince sur une tige ; bécher de solution de
       2-chloro-2-méthylpropane à 0,10 mol/L dans l'acétone ; pipette graduée de 10 mL tenue par deux pinces ; horloge
       murale (t = 0 quand la solution arrive dans l'eau) ; feuille de relevés (« Relever » y écrit t et σ) ; « Bécher neuf ».
       Hydrolyse lente (CH₃)₃C–Cl + 2 H₂O → (CH₃)₃C–OH + H₃O⁺ + Cl⁻ (reactions_lentes.js) : les ions formés font monter σ.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_conductimetrie(g) -> { pense_bete } ; fait « conductimetrie » = { plonge, agite, t (s), n_RCl (mmol versées),
          sigma (mS/cm, valeur vraie), stable, releves [[t (s), σ (mS/cm, lu)]] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1, X = 510, EQ = "(CH₃)₃C–Cl + 2 H₂O → (CH₃)₃C–OH + H₃O⁺ + Cl⁻";
  const aq = (r) => r.c.phases.find((p) => p.classe === "aqueuse") || { dissous: {}, V: 0 }, r3 = (v) => Math.round(v * 1000) / 1000;

  function support_pipette(fond, x) {
    // Pied, tige et deux pinces à noix : la pipette rangée y est tenue debout (pointe en x).
    L.pied_support(fond, x + 30, SOL, 240);
    for (const y of [440, 300]) {
      L.svg("rect", { x: x + 4, y: y - 2.5, width: 26, height: 5, fill: "url(#metal)" }, fond); L.noix(fond, x + 30, y);
      L.svg("path", { d: `M${x + 5} ${y - 5} h-9 v10 h9`, fill: "none", stroke: "#5d646a", "stroke-width": 2 }, fond);
    }
  }

  function suivi(ctx, melange, cond, agit, afficher) {
    // À chaque pas : hydrolyse, début de l'horloge quand le réactif arrive, fait noté.
    const s = { t0: null, releves: [] }, t = () => (s.t0 === null ? null : performance.now() / 1000 - s.t0);
    ctx.ecoulement.sur_pas((dt) => {
      if (L.avancer_lent(melange.c, dt)) melange.sig = null;
      const ph = aq(melange), n = (ph.dissous.RCl || 0) + ((melange.c.lentes || {})[EQ] || 0);
      if (s.t0 === null && n > 0) s.t0 = performance.now() / 1000;
      afficher(t());
      const c = cond.etat();
      L.missions.noter("conductimetrie", { plonge: c.plonge, agite: agit.agite(melange), t: t() === null ? null : Math.round(t()), n_RCl: r3(n), sigma: r3(c.sigma), stable: c.stable, releves: s.releves.map((r) => [...r]) });
    });
    return { s, t };
  }

  L.poste_conductimetrie = function (g) {
    // Matériel ; « Relever » écrit la date et la valeur affichée ; « Bécher neuf » : eau distillée neuve.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const afficher = L.horloge_murale(g, { x: 830, y: 52, legende: "HORLOGE — depuis le mélange" });
    const feuille = L.feuille_releves(g, { x: 645, y: 46, titre: "Relevés", colonnes: ["t (s)", "σ (mS/cm)"] });
    const agit = L.agitateur_magnetique(ctx, { x: X, sol: SOL, e: E });
    const melange = L.recipient(ctx, { id: "melange", profil: "becher_250", x: agit.station.x, y: agit.station.y, e: E, contenu: { eau: 140 }, etiquette: "eau + réactif" });
    melange.place = agit.station; agit.suivre(melange); melange.g.setAttribute("pointer-events", "none");
    const flacon = L.recipient(ctx, { id: "rcl", profil: "becher_100", x: 270, y: SOL, e: E, contenu: { cin_rcl: 40 }, etiquette: "C₄H₉Cl 0,10 mol/L", pictos: ["SGH02", "SGH07"] });
    flacon.g.setAttribute("pointer-events", "none");
    support_pipette(ctx.fond, 360);
    L.pipette_graduee(ctx, { support: { x: 360, y: SOL - 12 }, e: E });
    const cond = L.conductimetre(ctx, { x: 760, sol: SOL, e: E, tige: 610, sonde_x: 535, haut: 360, bas: 506, recipients: () => [melange], agite: agit.agite });
    L.pied_support(ctx.fond, 610, SOL, 200);
    const { s, t } = suivi(ctx, melange, cond, agit, afficher);
    L.bouton_texte(g, 140, 250, "Relever", () => {
      const c = cond.etat();
      if (t() === null || !c.plonge) return;
      const r = [Math.round(t()), Number(c.affiche.replace(",", "."))];
      if (feuille.ajouter([String(r[0]), c.affiche])) s.releves.push(r);
    });
    L.bouton_texte(g, 140, 285, "Bécher neuf", () => { melange.c = L.contenu({ eau: 140 }); melange.sig = null; melange.dessiner(); s.t0 = null; s.releves = []; feuille.vider(); });
    return { pense_bete };
  };
})(window.Labo);

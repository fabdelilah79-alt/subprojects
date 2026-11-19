/*
Rôle : paillasse « une réaction qui a lieu dans les deux sens » (1 px/mm) : bécher de 100 mL contenant 50,0 mL d'acide
       éthanoïque à 1,0 × 10⁻² mol/L, posé sur l'agitateur magnétique ; pH-mètre déjà étalonné, électrode sur sa tige ;
       flacon compte-gouttes d'acide éthanoïque pur (une goutte de 0,05 mL : 0,87 mmol, volume presque inchangé) ; pot
       d'éthanoate de sodium en cristaux et microspatule (une pointe : 0,10 g, 1,2 mmol) ; « Bécher neuf ».
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_deux_sens(g) -> { pense_bete } ; fait « deux_sens » = { plonge, agite, affiche, stable, gouttes_pur (mL),
          ethanoate (mmol), mesures { initial, acide, base } (pH lus, stables) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1, X = 510;
  const aq = (r) => r.c.phases.find((p) => p.classe === "aqueuse") || { liquides: {}, dissous: {}, V: 0 }, r3 = (v) => Math.round(v * 1000) / 1000;

  function suivi(ctx, becher, metre, agit) {
    // Mesures stables rangées selon ce qui a été ajouté au bécher ; fait noté à chaque pas.
    let mesures = {};
    ctx.ecoulement.sur_pas(() => {
      const m = metre.etat(), ph = aq(becher), pur = ph.liquides.eq_ethanoique_pur || 0, sel = ph.liquides.eq_ethanoate_sodium || 0;
      if (m.stable && m.dans === "becher") {
        if (!pur && !sel) mesures.initial = m.affiche; else if (pur && !sel) mesures.acide = m.affiche; else if (sel && !pur) mesures.base = m.affiche;
      }
      L.missions.noter("deux_sens", { plonge: m.plonge, agite: agit.agite(becher), affiche: m.affiche, stable: m.stable, gouttes_pur: r3(pur), ethanoate: r3(sel * 17.7), mesures: { ...mesures } });
    });
    return { vider: () => { mesures = {}; } };
  }

  L.poste_deux_sens = function (g) {
    // Agitateur, bécher fixe, pH-mètre, flacon d'acide pur, pot d'éthanoate de sodium.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const agit = L.agitateur_magnetique(ctx, { x: X, sol: SOL, e: E });
    L.pied_support(ctx.fond, 430, SOL, 200);
    const becher = L.recipient(ctx, { id: "becher", profil: "becher_100", x: agit.station.x, y: agit.station.y, e: E, contenu: { eq_ethanoique: 50 }, etiquette: "CH₃COOH 0,010 M" });
    becher.place = agit.station; agit.suivre(becher); becher.g.setAttribute("pointer-events", "none");
    const metre = L.ph_metre(ctx, { x: 780, sol: SOL, e: E, tige: 430, sonde_x: 522, haut: 360, bas: agit.station.y - 4, recipients: () => [becher], agite: agit.agite, etalonne: true });
    L.flacon_gouttes(ctx, { id: "eq_ethanoique_pur", x: 640, sol: SOL, e: E, liquide: "eq_ethanoique_pur", texte: "Acide\néthanoïque\npur" });
    L.spatule_poudre(ctx, { x: 290, sol: SOL, e: E, solide: "eq_ethanoate_sodium", dose: 0.07, texte: "Éthanoate\nde sodium", rgb: [246, 246, 240] });
    const s = suivi(ctx, becher, metre, agit);
    L.bouton_texte(g, 140, 250, "Bécher neuf", () => { becher.c = L.contenu({ eq_ethanoique: 50 }); becher.sig = null; becher.dessiner(); s.vider(); });
    return { pense_bete };
  };
})(window.Labo);

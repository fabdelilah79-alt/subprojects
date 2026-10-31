/*
Rôle : paillasses de la synthèse de l'acide benzoïque : (1) chauffage à reflux de l'alcool benzylique avec le permanganate
       de potassium en milieu basique (poste_synthese.js), le contenu refroidi est versé dans un bécher ; (2) filtration
       sous vide du dioxyde de manganèse brun (buchner_poste.js) : le filtrat incolore contient les ions benzoate ;
       (3) acidification de ce filtrat par l'acide chlorhydrique (gants et lunettes) : précipité blanc d'acide benzoïque,
       recueilli par une seconde filtration sous vide.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_reflux_benzoique, Labo.poste_filtration_mno2, Labo.poste_precipitation (groupe) -> { pense_bete } ;
          faits « reflux_benzoique » (poste_synthese.js), « filtration_mno2 » et « filtration_cristaux » (buchner_poste.js),
          « precipitation » = { epi, acide (mL d'acide qui a réagi), benzoate (mL de filtrat basique restant), cristaux (mL de suspension) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, B = L.BENZOIQUE, S = B.somme;

  L.poste_reflux_benzoique = L.poste_synthese({
    fait: "reflux_benzoique", T_eb: 100, duree: 20, reagir: B.oxyder, suivis: ["alcool_benzylique", "permanganate_basique"],
    reactifs: [
      { id: "alcool", x: 490, contenu: { alcool_benzylique: 2 }, texte: "alcool benzylique 2,0 mL", pictos: ["SGH07"] },
      { id: "permanganate", x: 560, contenu: { permanganate_basique: 45 }, texte: "KMnO₄ + soude", pictos: ["SGH05", "SGH09"] },
    ],
    gouttes: null,
    recepteur: { profil: "becher_250", contenu: {}, etiquette: "mélange obtenu" },
    evoluer_recepteur: () => {},
    mesure: (r) => S(r.c, "melange_mno2"),
  });

  L.poste_filtration_mno2 = function (g) {
    // Le mélange refroidi : dioxyde de manganèse (solide brun) dans la solution d'ions benzoate ; MnO₂ reste sur le papier.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    L.filtration_buchner(ctx, { fait: "filtration_mno2", melange: { contenu: { melange_mno2: 46 }, etiquette: "mélange refroidi" }, retenu: { melange_mno2: "benzoate_sodium" }, residu_rgb: [64, 42, 26] });
    return { pense_bete };
  };

  function message(calque, t) {
    // Bulle d'avertissement au-dessus de la paillasse.
    calque.replaceChildren();
    if (!t) return;
    L.svg("rect", { x: 560, y: 150, width: 300, height: 26, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque);
    L.texte(calque, 710, 163, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" });
  }

  L.poste_precipitation = function (g) {
    // Filtrat d'ions benzoate et bécher d'acide (corrosif) ; l'acide réagit dans tout récipient où il rencontre le filtrat.
    L.affiche_securite(g, 780, 56);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => message(calque, t);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const epi = L.equipement(g, { x: 300, y: 70, changer: () => dire("") });
    L.filtration_buchner(ctx, { fait: "filtration_cristaux", melange: { contenu: { benzoate_sodium: 45 }, etiquette: "filtrat (benzoate)" }, retenu: { suspension_benzoique: "eau_mere" }, residu_rgb: [250, 250, 246] });
    const acide = L.recipient(ctx, { id: "acide", profil: "becher_50", x: 800, y: SOL - 2.2, contenu: { hcl_concentre: 8 }, etiquette: "HCl 6 mol/L", pictos: ["SGH05"] });
    L.manipuler(ctx, acide, { sol: SOL - 2.2, autoriser: () => epi.protege() || (dire("Mettez vos lunettes et vos gants : l'acide est corrosif."), false) });
    const melange = ctx.ecoulement.recipients.find((r) => r.id === "melange");
    let verse = 0, avant = "";
    ctx.ecoulement.sur_pas((dt) => {
      for (const r of ctx.ecoulement.recipients) { const v = B.acidifier(r.c, dt); if (v > 0) { verse += v; r.sig = null; } }
      const o = (x) => Math.round(x * 10) / 10;
      const f = { epi: epi.protege(), acide: o(verse), benzoate: o(S(melange.c, "benzoate_sodium")), cristaux: o(ctx.ecoulement.recipients.reduce((s, r) => s + S(r.c, "suspension_benzoique"), 0)) };
      if (JSON.stringify(f) !== avant) { avant = JSON.stringify(f); L.missions.noter("precipitation", f); }
    });
    return { pense_bete };
  };
})(window.Labo);

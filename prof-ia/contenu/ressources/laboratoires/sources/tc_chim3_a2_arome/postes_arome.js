/*
Rôle : paillasses de la synthèse de l'arôme de banane : (1) chauffage à reflux de l'alcool isoamylique et de l'acide
       acétique avec quelques gouttes d'acide sulfurique (poste_synthese.js) ; (2) lavage à l'eau salée dans l'ampoule à
       décanter : l'ester forme la phase du dessus ; on élimine la phase aqueuse (en bas) et l'on sent l'ester par
       déplacement d'air.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_reflux_arome, Labo.poste_lavage (groupe) -> { pense_bete } ; faits « reflux_arome » (voir poste_synthese.js)
          et « lavage » = { brut, sale, ester, aq (mL dans l'ampoule), robinet, bouchon, agitee, degaze, decante, recu_aq,
          recu_ester (mL dans le bécher), senti }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, A = L.AROME, S = A.somme;

  L.poste_reflux_arome = L.poste_synthese({
    fait: "reflux_arome", T_eb: 100, duree: 30, reagir: A.esterifier, suivis: ["alcool_isoamylique", "acide_acetique", "acide_sulfurique"],
    reactifs: [
      { id: "alcool", x: 490, contenu: { alcool_isoamylique: 15 }, texte: "alcool isoamylique", pictos: ["SGH02", "SGH07"] },
      { id: "acide", x: 555, contenu: { acide_acetique: 20 }, texte: "acide acétique", pictos: ["SGH02", "SGH05"] },
    ],
    gouttes: { liquide: "acide_sulfurique", texte: "Acide\nsulfurique" },
    recepteur: { profil: "becher_100", contenu: {}, etiquette: "mélange obtenu" },
    evoluer_recepteur: () => {},
    mesure: (r) => S(r.c, "brut_ester"),
  });

  function message(calque, t) {
    // Bulle d'avertissement au-dessus de la paillasse.
    calque.replaceChildren();
    if (!t) return;
    L.svg("rect", { x: 450, y: 196, width: 300, height: 30, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque);
    L.texte(calque, 600, 211, t, { "font-size": 7, fill: "#6b3d00", "font-weight": 700 });
  }

  function sentir(g, s) {
    // Carte « sentir par déplacement d'air » : on rabat l'air vers soi avec la main, sans mettre le nez au-dessus.
    const b = L.svg("g", { role: "button", "aria-label": "Sentir" }, g);
    L.svg("rect", { x: 470, y: 120, width: 130, height: 30, rx: 4, fill: "#fbfaf3", stroke: "#cfcab8" }, b);
    L.texte(b, 535, 135, "Sentir (déplacement d'air)", { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => {
      const ester = S(s.a.r.c, "ester") > 3 && !s.a.r.bouchon;
      s.senti = ester; s.dire(ester ? "Odeur fruitée de banane : c'est l'acétate d'isoamyle." : s.a.r.bouchon ? "Ôtez d'abord le bouchon." : "Odeur piquante de vinaigre.");
    } });
  }

  function noter(s, rec) {
    // Ce que l'on sait de l'ampoule et du bécher.
    const r = s.a.r, aq = r.c.phases.filter((p) => p.classe === "aqueuse").reduce((t, p) => t + p.V, 0), o = (v) => Math.round(v * 10) / 10;
    const v = { brut: o(S(r.c, "brut_ester")), sale: o(S(r.c, "eau_salee")), ester: o(S(r.c, "ester")), aq: o(aq), robinet: r.robinet.ouvert, bouchon: r.bouchon, agitee: s.a.agitee, degaze: s.a.degaze, decante: r.c.emulsion < 0.05, recu_aq: o(rec.c.volume() - S(rec.c, "ester")), recu_ester: o(S(rec.c, "ester")), senti: !!s.senti };
    if (JSON.stringify(v) !== s.avant) { s.avant = JSON.stringify(v); L.missions.noter("lavage", v); }
  }

  L.poste_lavage = function (g) {
    // Ampoule sur son support, bécher sous le robinet, mélange obtenu et eau salée ; séparation plus rapide si l'on agite.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const s = { dire: (t) => message(calque, t) };
    const rec = L.recipient(ctx, { id: "aqueuse", profil: "becher_100", x: 400, y: SOL, etiquette: "phase aqueuse" });
    s.a = L.ampoule_support(ctx, { x: 400, y: 452, sol: SOL, e: E }, s.dire);
    for (const [id, x, contenu, texte] of [["brut", 560, { brut_ester: 35 }, "mélange obtenu"], ["sale", 660, { eau_salee: 50 }, "eau salée"]]) L.manipuler(ctx, L.recipient(ctx, { id, profil: "becher_100", x, y: SOL, contenu, etiquette: texte }), { sol: SOL });
    sentir(g, s);
    ctx.ecoulement.sur_pas((dt) => {
      const r = s.a.r, secoue = r.bouchon && Math.hypot(r.acc.x, r.acc.y) > 2500;
      A.separer(r.c, dt * (secoue ? 1 : 0.1));
      noter(s, rec);
    });
    return { pense_bete };
  };
})(window.Labo);

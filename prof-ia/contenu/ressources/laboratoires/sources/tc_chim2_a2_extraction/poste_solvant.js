/*
Rôle : paillasse de l'extraction du diiode par un solvant, avec le matériel physique à taille réelle : affiche des
       données, béchers d'eau iodée, de cyclohexane et d'éthanol (on les prend et on les incline au-dessus de l'ampoule
       pour verser), ampoule à décanter sur son support, bécher récepteur sous le robinet, bidon de récupération des
       solvants (le toucher vide l'ampoule et le bécher récepteur).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_solvant(groupe) -> { pense_bete } ; fait « ampoule » = { aq, org (mL), miscible, solvant, I2_org (part du
          diiode dans le solvant), robinet, bouchon, pression, agitee, degaze, decante, recu_aq, recu_org (mL), renverse }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, A = { x: 400, y: 452 }, BIDON = { x: 800, sol: SOL };

  function message(calque, texte) {
    // Bulle d'avertissement à côté de l'ampoule (disparaît au message suivant).
    calque.replaceChildren();
    if (!texte) return;
    L.svg("rect", { x: 450, y: 196, width: 250, height: 30, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque);
    L.texte(calque, 575, 211, texte, { "font-size": 7.4, fill: "#6b3d00", "font-weight": 700 });
  }

  function bidon(ctx, vider) {
    // Bidon jaune de récupération des solvants, avec son bouchon et son étiquette.
    const g = L.svg("g", { class: "bidon", role: "button", "aria-label": "Bidon de récupération" }, ctx.fond), x = BIDON.x, b = BIDON.sol;
    L.svg("ellipse", { cx: x + 4, cy: b + 1, rx: 32, ry: 4, fill: "#000", opacity: 0.3 }, g);
    L.svg("path", { d: `M${x - 28} ${b} V${b - 82} Q${x - 28} ${b - 92} ${x - 18} ${b - 92} H${x + 4} V${b - 100} H${x + 18} V${b - 92} Q${x + 28} ${b - 92} ${x + 28} ${b - 82} V${b} Z`, fill: "#e7c22a", stroke: "#a3850f" }, g);
    L.svg("rect", { x: x - 20, y: b - 70, width: 40, height: 30, fill: "#fff", stroke: "#a3850f", "stroke-width": 0.5 }, g);
    L.texte(g, x, b - 60, "Récupération", { "font-size": 5.6, "font-weight": 700, fill: "#3b2f00" });
    L.texte(g, x, b - 52, "des solvants", { "font-size": 5.6, "font-weight": 700, fill: "#3b2f00" });
    L.svg("rect", { x: x - 6, y: b - 49, width: 12, height: 6, fill: "#fff", stroke: "#d01c1c", "stroke-width": 0.8, transform: `rotate(45 ${x} ${b - 46})` }, g);
    L.glissable(g, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: vider });
  }

  function phase(r, classe) {
    // Phase d'un récipient (aqueuse ou organique), ou une phase vide.
    return r.c.phases.find((p) => p.classe === classe) || { V: 0, liquides: {}, dissous: {} };
  }

  function etat(a, rec, ctx) {
    // Ce que l'on sait de l'ampoule et du bécher récepteur.
    const r = a.r, aq = phase(r, "aqueuse"), org = phase(r, "organique"), I2 = (aq.dissous.I2 || 0) + (org.dissous.I2 || 0);
    const miscible = (aq.liquides.ethanol || 0) > 0.5, solvant = miscible ? "ethanol" : (org.liquides.cyclohexane || 0) > 0.5 ? "cyclohexane" : null;
    const arrondi = (v) => Math.round(v * 10) / 10;
    return {
      aq: arrondi(aq.V), org: arrondi(org.V), miscible, solvant, I2_org: I2 ? arrondi((org.dissous.I2 || 0) / I2) : 0,
      robinet: r.robinet.ouvert, bouchon: r.bouchon, pression: a.pression, agitee: a.agitee, degaze: a.degaze,
      decante: r.c.emulsion < 0.05, recu_aq: arrondi(phase(rec, "aqueuse").V), recu_org: arrondi(phase(rec, "organique").V), renverse: arrondi(ctx.ecoulement.renverse),
    };
  }

  L.poste_solvant = function (g) {
    // Construit la paillasse, l'ampoule et ses gestes ; note l'état à chaque changement.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.affiche_solvants(ctx.fond, 500, 24);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const calque = L.svg("g", { "pointer-events": "none" }, g), dire = (t) => message(calque, t);
    const rec = L.recipient(ctx, { id: "recepteur", profil: "becher_100", x: A.x, y: SOL });
    const a = L.ampoule_support(ctx, { x: A.x, y: A.y, sol: SOL, e: E }, dire);
    for (const [id, x, contenu, texte] of [["iodee", 545, { eau_iodee: 30 }, "eau iodée"], ["cyclo", 625, { cyclohexane: 15 }, "cyclohexane"], ["ethanol", 705, { ethanol: 15 }, "éthanol"]]) {
      L.manipuler(ctx, L.recipient(ctx, { id, profil: "becher_50", x, y: SOL, contenu, etiquette: texte }), { sol: SOL });
    }
    bidon(ctx, () => {
      if (a.r.tenu) return;
      a.r.c = L.contenu({}); rec.c = L.contenu({}); Object.assign(a, { pression: false, agitee: false, degaze: false });
      dire("Ampoule et bécher vidés dans le bidon de récupération.");
    });
    let avant = "";
    ctx.ecoulement.sur_pas(() => { const v = etat(a, rec, ctx), s = JSON.stringify(v); if (s !== avant) { avant = s; L.missions.noter("ampoule", v); } });
    return { pense_bete };
  };
})(window.Labo);

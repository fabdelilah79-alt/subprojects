/*
Rôle : paillasse des halogénures : trois tubes à essai contenant 2 mL de solutions de chlorure de sodium, de bromure de
       potassium et d'iodure de potassium, et un flacon compte-gouttes de nitrate d'argent (gants et lunettes : il tache la
       peau et il est corrosif). Avec les ions argent, chaque ion halogénure donne un précipité : chlorure d'argent blanc,
       bromure d'argent blanc jaunâtre, iodure d'argent jaune. Même réaction : Cl, Br et I forment une même famille.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_halogenures(groupe) -> { pense_bete } ; fait « halogenures » = { epi, Cl, Br, I (part de l'halogénure précipitée) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6;
  const aq = (nom, rgb = [236, 242, 244], alpha = 0.3) => ({ nom, d: 1.0, rgb, alpha, classe: "aqueuse", pH: 7 });
  Object.assign(L.LIQUIDES, {
    chlorure_sodium: aq("chlorure de sodium"), bromure_potassium: aq("bromure de potassium"), iodure_potassium: aq("iodure de potassium"),
    nitrate_argent: aq("nitrate d'argent"), trouble_AgCl: aq("précipité de chlorure d'argent", [246, 246, 244], 0.9),
    trouble_AgBr: aq("précipité de bromure d'argent", [242, 236, 200], 0.9), trouble_AgI: aq("précipité d'iodure d'argent", [238, 222, 120], 0.92),
  });
  const TUBES = [["Cl", "chlorure_sodium", "NaCl", "trouble_AgCl"], ["Br", "bromure_potassium", "KBr", "trouble_AgBr"], ["I", "iodure_potassium", "KI", "trouble_AgI"]];
  const vol = (c, n) => c.phases.reduce((s, p) => s + (p.liquides[n] || 0), 0);

  function precipiter(c, sel, trouble) {
    // Ag⁺ + X⁻ → AgX : le nitrate d'argent et l'halogénure deviennent un précipité en suspension (volumes égaux réagissent).
    const v = Math.min(vol(c, sel), vol(c, "nitrate_argent"));
    if (v <= 1e-4) return false;
    L.convertir_liquide(c, sel, trouble, v); L.convertir_liquide(c, "nitrate_argent", trouble, v);
    return true;
  }

  L.poste_halogenures = function (g) {
    // Porte-tubes, tubes, flacon de nitrate d'argent ; la précipitation se fait à chaque pas.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 380, y: 236, width: 320, height: 26, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 540, 249, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    const epi = L.equipement(g, { x: 300, y: 70, changer: () => dire("") });
    const rack = L.porte_tubes(ctx, { x: 420, sol: SOL, e: E, n: 3, pas: 30 });
    const tubes = TUBES.map(([, sel, texte], k) => {
      const t = L.recipient(ctx, { id: `t${k}`, profil: "tube", x: rack[k].x, y: rack[k].y, contenu: { [sel]: 2 }, etiquette: texte });
      t.place = rack[k]; L.manipuler(ctx, t, { sol: SOL, supports: rack, pose_libre: false });
      return t;
    });
    L.flacon_gouttes(ctx, { id: "argent", x: 600, sol: SOL, e: E, liquide: "nitrate_argent", texte: "Nitrate\nd'argent", autoriser: () => { if (epi.protege()) { dire(""); return true; } dire("Mettez lunettes et gants : le nitrate d'argent est corrosif et tache la peau."); return false; } });
    let avant = "";
    ctx.ecoulement.sur_pas(() => {
      const v = { epi: epi.protege() };
      TUBES.forEach(([X, sel, , trouble], k) => { if (precipiter(tubes[k].c, sel, trouble)) tubes[k].sig = null; const p = vol(tubes[k].c, trouble), s = vol(tubes[k].c, sel); v[X] = Math.round((p / 2 / Math.max(1e-6, p / 2 + s)) * 100) / 100; });
      const s = JSON.stringify(v); if (s !== avant) { avant = s; L.missions.noter("halogenures", v); }
    });
    return { pense_bete };
  };
})(window.Labo);

/*
Rôle : les deux paillasses du transfert d'électrons. Paillasse 1 : deux tubes de sulfate de cuivre (le second sert de
       témoin), clou en fer, flacon de soude (test des ions fer II : précipité vert) ; les transformations sont dans
       ions_metaux.js et metal_tube.js. Paillasse 2 : tube d'iodure de potassium et tube de diiode, flacons d'eau de Javel
       diluée, d'empois d'amidon et d'acide ascorbique (vitamine C) ; les réactions sont dans oxydoreduction.js.
       Lunettes et gants exigés pour la soude et l'eau de Javel.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_metal(g), Labo.poste_iodure(g) -> { pense_bete } ; faits « metal » = { t1, t2 : { metal, Cu_depose,
          Cu, Fe, FeOH2 } } et « iodure » = { t1, t2 : { reactions, I2 (mol/L), amidon } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, r3 = (v) => Math.round(v * 1000) / 1000;
  const phase = (r) => r.c.phases.find((p) => p.classe === "aqueuse") || { liquides: {}, dissous: {}, V: 0 };

  function banc(g, flacons, x_flacons, tubes_def) {
    // Décor, protection, porte-tubes et tubes fixes, flacons compte-gouttes (protégés si corrosifs).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 380, y: 236, width: 320, height: 26, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 540, 249, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    L.ecoulement(ctx, { sol: SOL, e: E });
    const epi = L.equipement(g, { x: 300, y: 70, changer: () => dire("") });
    const proteger = () => { if (epi.protege()) { dire(""); return true; } dire("Mettez lunettes et gants : ce produit est corrosif."); return false; };
    const rack = L.porte_tubes(ctx, { x: 420, sol: SOL, e: E, n: tubes_def.length, pas: 30 });
    const tubes = tubes_def.map(([id, contenu, etiquette], k) => { const t = L.recipient(ctx, { id, profil: "tube", x: rack[k].x, y: rack[k].y, contenu, etiquette }); t.g.setAttribute("pointer-events", "none"); return t; });
    flacons.forEach(([liquide, texte, corrosif], k) => L.flacon_gouttes(ctx, { id: liquide, x: x_flacons + k * 85, sol: SOL, e: E, liquide, texte, autoriser: corrosif ? proteger : () => true }));
    L.bouton_texte(g, 140, 250, "Nouveaux tubes", () => { tubes.forEach((t, k) => { t.c = L.contenu(tubes_def[k][1]); t.sig = null; if (t.metal) { t.metal.Cu = 0; t.metal.Ag = 0; } }); dire("Tubes rincés et remplis de nouveau."); });
    return { pense_bete, ctx, tubes, dire };
  }

  L.poste_metal = function (g) {
    // Sulfate de cuivre et clou en fer ; soude pour identifier les ions formés.
    const b = banc(g, [["soude", "Soude\n1 mol/L", true]], 600, [["t1", { sulfate_cuivre: 5 }, "1 CuSO₄"], ["t2", { sulfate_cuivre: 5 }, "2 témoin"]]);
    L.metaux_tubes(b.ctx, { metaux: [{ type: "fer", x: 262 }], sol: SOL, e: E, tubes: b.tubes, dire: b.dire });
    setInterval(() => {
      const f = {};
      b.tubes.forEach((t) => { const k = L.IONS.bilan(t.c); f[t.id] = { metal: t.metal?.type || null, Cu_depose: r3(t.metal?.Cu || 0), Cu: k.Cu, Fe: k.Fe, FeOH2: k.FeOH2 }; });
      L.missions.noter("metal", f);
    }, 400);
    return { pense_bete: b.pense_bete };
  };

  L.poste_iodure = function (g) {
    // Iodure de potassium (oxydé par l'eau de Javel) et diiode (réduit par l'acide ascorbique) ; amidon pour révéler le diiode.
    const b = banc(g, [["ox_javel", "Eau de Javel\ndiluée", true], ["ox_amidon", "Empois\nd'amidon"], ["ox_ascorbique", "Vitamine C"]], 600, [["t1", { ox_iodure: 3 }, "1 KI"], ["t2", { ox_diiode: 1, eau: 2 }, "2 diiode"]]);
    b.ctx.ecoulement.sur_pas(() => b.tubes.forEach((t) => { if (L.reagir(t.c)) t.sig = null; }));
    setInterval(() => {
      const f = {};
      b.tubes.forEach((t) => { const ph = phase(t); f[t.id] = { reactions: [...(t.c.reactions || [])], I2: L.concentration(ph, "I2"), amidon: (ph.liquides.ox_amidon || 0) > 0 }; });
      L.missions.noter("iodure", f);
    }, 400);
    return { pense_bete: b.pense_bete };
  };
})(window.Labo);

/*
Rôle : paillasse « dissolution d'espèces moléculaires » : cinq béchers de 100 mL (eau, eau, éthanol, éthanol, eau), pots de
       saccharose et de diiode avec leur microspatule (gants et lunettes pour le diiode), agitateur en verre, fiche
       « espèces moléculaires, espèces ioniques ». Les solides se dissolvent selon le solvant et l'agitation (dissolution.js).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_dissolution(groupe) -> { pense_bete } ; fait « dissolution » = { protege, b1 … b5 : { eau, ethanol (mL),
          phases, sucre_s, sucre_d, iode_s, iode_d (g de cristaux restants, g dissous) } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6;
  const BECHERS = [["b1", 290, { eau: 50 }, "1 : eau"], ["b2", 390, { eau: 50 }, "2 : eau"], ["b3", 490, { ethanol: 50 }, "3 : éthanol"], ["b4", 610, { ethanol: 30 }, "4 : éthanol"], ["b5", 720, { eau: 50 }, "5 : eau"]];

  function fiche(g) {
    // Fiche murale : espèces moléculaires et ioniques.
    L.svg("rect", { x: 690, y: 46, width: 300, height: 92, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 840, 64, "Espèces moléculaires, espèces ioniques", { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    ["Saccharose C₁₂H₂₂O₁₁, diiode I₂, éthanol C₂H₆O :", "solides ou liquides formés de molécules.", "Chlorure de sodium NaCl : cristal formé", "d'ions Na⁺ et Cl⁻."].forEach((t, i) => L.texte(g, 840, 84 + i * 15, t, { "font-size": 9, fill: "#222" }));
  }

  L.poste_dissolution = function (g) {
    // Équipement, fiche, béchers, pots, agitateur ; le bilan est noté à chaque changement.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 400, y: 236, width: 320, height: 24, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 560, 248, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    L.ecoulement(ctx, { sol: SOL, e: E });
    fiche(g);
    const epi = L.equipement(g, { x: 300, y: 70, changer: () => dire("") });
    L.agitateur(ctx, { x: 640, sol: 446, e: E });
    const R = BECHERS.map(([id, x, contenu, etiquette]) => L.recipient(ctx, { id, profil: "becher_100", x, y: SOL, e: E, contenu, etiquette }));
    R.forEach((r) => L.manipuler(ctx, r, { sol: SOL }));
    L.spatule_poudre(ctx, { x: 300, sol: 470, e: E, solide: "sucre_cristaux", dose: 0.5 / 1.59, texte: "Saccharose\nC₁₂H₂₂O₁₁", rgb: [250, 250, 246] });
    L.spatule_poudre(ctx, { x: 400, sol: 470, e: E, solide: "diiode_cristaux", dose: 0.05 / 4.93, texte: "Diiode\nI₂", rgb: [62, 48, 74], pictos: ["SGH07", "SGH09"],
      autoriser: () => epi.protege() || (dire("Diiode : mettez d'abord vos lunettes et vos gants."), false) });
    L.dissolution(ctx);
    const g3 = (x) => Math.round(x * 1e4) / 1e4;
    const noter = () => {
      const f = { protege: epi.protege() };
      for (const r of R) {
        const liq = (n) => Math.round(r.c.phases.reduce((s, p) => s + (p.liquides[n] || 0), 0) * 100) / 100;
        f[r.id] = { eau: liq("eau"), ethanol: liq("ethanol"), phases: r.c.phases.filter((p) => p.classe !== "solide").length, sucre_s: g3(L.solide_g(r.c, "sucre_cristaux")), sucre_d: g3(L.dissous_g(r.c, "sucre_cristaux")), iode_s: g3(L.solide_g(r.c, "diiode_cristaux")), iode_d: g3(L.dissous_g(r.c, "diiode_cristaux")) };
      }
      L.missions.noter("dissolution", f);
    };
    ctx.sur_changement(noter); noter();
    setInterval(noter, 500);
    return { pense_bete };
  };
})(window.Labo);

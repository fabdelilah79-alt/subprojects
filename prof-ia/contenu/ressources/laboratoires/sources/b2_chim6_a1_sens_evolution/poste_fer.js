/*
Rôle : paillasse « sens d'évolution d'une transformation d'oxydoréduction » : trois tubes à essai dans un porte-tubes, (1) 3 mL
       de chlorure de fer III et 3 mL de sulfate de fer II à 0,050 mol/L, (2) 6 mL de chlorure de fer III, (3) témoin comme le
       tube 1 ; fil de cuivre et clou en fer sur leurs verres de montre (metal_tube.js) : dans un tube, Cu + 2 Fe³⁺ → Cu²⁺ +
       2 Fe²⁺ ou Fe + 2 Fe³⁺ → 3 Fe²⁺ (ions_metaux.js) ; la teinte jaune-orangé des ions fer III disparaît peu à peu.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_fer(g) -> { pense_bete } ; fait « fer_metaux » = { t1, t2, t3 : { metal, Fe3, Fe2, Cu (mmol d'ions),
          part_Fe3 (part des ions fer III restants) } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6;
  const aq = (nom, dissous) => ({ nom, d: 1.0, rgb: [228, 240, 246], alpha: 0.3, classe: "aqueuse", pH: 2, dissous });
  Object.assign(L.LIQUIDES, {
    fer3_chlorure: aq("chlorure de fer III 0,050 mol/L", { "Fe3+": 0.05, "Cl-": 0.15 }),
    fer2_sulfate: aq("sulfate de fer II 0,050 mol/L", { "Fe2+": 0.05, "SO4--": 0.05 }),
  });
  const TUBES = [["t1", { fer3_chlorure: 3, fer2_sulfate: 3 }, "1 : Fe³⁺ + Fe²⁺"], ["t2", { fer3_chlorure: 6 }, "2 : Fe³⁺"], ["t3", { fer3_chlorure: 3, fer2_sulfate: 3 }, "3 : témoin"]];

  function fiche(g) {
    // Données affichées au mur : couples et constantes d'équilibre.
    L.svg("rect", { x: 680, y: 46, width: 310, height: 92, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 835, 64, "Données (25 °C)", { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    ["2 Fe³⁺ + Cu ⇌ 2 Fe²⁺ + Cu²⁺ : K ≈ 10¹⁴", "2 Fe³⁺ + Fe ⇌ 3 Fe²⁺ : K ≈ 10⁴¹", "Fe³⁺ : jaune-orangé ; Fe²⁺ : vert pâle ; Cu²⁺ : bleu", "Les métaux solides n'apparaissent pas dans Qr."].forEach((t, i) => L.texte(g, 835, 84 + i * 15, t, { "font-size": 8.6, fill: "#222" }));
  }

  L.poste_fer = function (g) {
    // Porte-tubes, tubes, métaux, fiche ; bilan des ions noté deux fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 400, y: 236, width: 320, height: 24, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 560, 248, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    L.ecoulement(ctx, { sol: SOL, e: E });
    fiche(g);
    const rack = L.porte_tubes(ctx, { x: 420, sol: SOL, e: E, n: 3, pas: 30 });
    const tubes = TUBES.map(([id, contenu, etiquette], k) => L.recipient(ctx, { id, profil: "tube", x: rack[k].x, y: rack[k].y, contenu, etiquette }));
    tubes.forEach((t) => t.g.setAttribute("pointer-events", "none"));
    L.metaux_tubes(ctx, { metaux: [{ type: "fer", x: 262 }, { type: "cuivre", x: 690 }], sol: SOL, e: E, tubes, dire });
    const r3 = (v) => Math.round(v * 1000) / 1000, n = (t, s) => t.c.phases.find((p) => p.classe === "aqueuse")?.dissous[s] || 0;
    const noter = () => {
      const f = {};
      tubes.forEach((t, k) => { const fe3_0 = 0.05 * TUBES[k][1].fer3_chlorure; f[t.id] = { metal: t.metal?.type || null, Fe3: r3(n(t, "Fe3+")), Fe2: r3(n(t, "Fe2+")), Cu: r3(n(t, "Cu2+")), part_Fe3: Math.round((100 * n(t, "Fe3+")) / fe3_0) / 100 }; });
      L.missions.noter("fer_metaux", f);
    };
    ctx.sur_changement(noter); noter(); setInterval(noter, 500);
    return { pense_bete };
  };
})(window.Labo);

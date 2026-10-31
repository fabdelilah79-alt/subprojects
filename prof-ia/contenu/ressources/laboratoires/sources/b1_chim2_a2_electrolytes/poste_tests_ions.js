/*
Rôle : paillasse « détecter les ions » : quatre tubes de solutions électrolytiques (sulfate de cuivre, chlorure de sodium,
       sulfate de sodium, chlorure de fer III) et trois flacons compte-gouttes de réactifs (soude, nitrate d'argent, chlorure
       de baryum). Chaque goutte apporte ses ions ; les précipités se forment selon les ions présents : Cu²⁺ + 2 HO⁻ → Cu(OH)₂
       bleu, Fe³⁺ + 3 HO⁻ → Fe(OH)₃ rouille, Ag⁺ + Cl⁻ → AgCl blanc, Ba²⁺ + SO₄²⁻ → BaSO₄ blanc. Lunettes et gants exigés.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_tests_ions(g) -> { pense_bete } ; fait « tests_ions » = { epi, 1…4 : [précipités déjà obtenus dans ce tube] } ;
          touche « Nouveaux tubes » : tubes rincés et remplis de nouveau.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6;
  const aq = (nom, dissous, pH = 7) => ({ nom, d: 1.0, rgb: [232, 240, 245], alpha: 0.3, classe: "aqueuse", pH, dissous });
  Object.assign(L.LIQUIDES, {
    sol_cuso4: aq("sulfate de cuivre (II)", { "Cu2+": 0.1, "SO4--": 0.1 }, 5), sol_nacl: aq("chlorure de sodium", { "Na+": 0.1, "Cl-": 0.1 }),
    sol_na2so4: aq("sulfate de sodium", { "Na+": 0.2, "SO4--": 0.1 }), sol_fecl3: aq("chlorure de fer (III)", { "Fe3+": 0.05, "Cl-": 0.15 }, 2),
    r_soude: aq("soude", { "Na+": 1, "HO-": 1 }, 14), r_argent: aq("nitrate d'argent", { "Ag+": 0.1, "NO3-": 0.1 }), r_baryum: aq("chlorure de baryum", { "Ba2+": 0.1, "Cl-": 0.2 }),
  });
  L.TEINTES["Cu2+"] ??= { aqueuse: [24, 104, 214], organique: [24, 104, 214] };
  L.TEINTES["Fe3+"] ??= { aqueuse: [205, 140, 40], organique: [205, 140, 40] };
  const PPT = { CuOH2: ["Cu2+", "HO-", 2, [70, 140, 215], 90], FeOH3: ["Fe3+", "HO-", 3, [168, 86, 28], 90], AgCl: ["Ag+", "Cl-", 1, [246, 246, 242], 500], BaSO4: ["Ba2+", "SO4--", 1, [250, 250, 250], 500] };
  const TUBES = [["sol_cuso4", "1 CuSO₄"], ["sol_nacl", "2 NaCl"], ["sol_na2so4", "3 Na₂SO₄"], ["sol_fecl3", "4 FeCl₃"]];

  L.REGLES_COULEUR = L.REGLES_COULEUR || [];
  L.REGLES_COULEUR.push((ph, rgb, alpha) => {
    // Précipités en suspension : le liquide prend leur couleur et devient opaque.
    for (const [nom, [, , , t, f]] of Object.entries(PPT)) {
      const q = ph.dissous[`ppt_${nom}`] || 0;
      if (q <= 0) continue;
      const k = Math.min(0.85, (f * q) / Math.max(ph.V, 0.1));
      rgb = rgb.map((v, i) => v + (t[i] - v) * k); alpha = Math.min(0.93, alpha + 0.65 * k);
    }
    return { rgb, alpha };
  });

  function precipiter(c) {
    // Les ions qui se rencontrent forment leur précipité (quantités en mmol) ; vrai si quelque chose a changé.
    const ph = c.phases.find((p) => p.classe === "aqueuse");
    let change = false;
    if (!ph) return change;
    for (const [nom, [cat, an, r]] of Object.entries(PPT)) {
      const n = Math.min(ph.dissous[cat] || 0, (ph.dissous[an] || 0) / r);
      if (n < 1e-6) continue;
      ph.dissous[cat] -= n; ph.dissous[an] -= n * r; ph.dissous[`ppt_${nom}`] = (ph.dissous[`ppt_${nom}`] || 0) + n; change = true;
    }
    return change;
  }

  L.poste_tests_ions = function (g) {
    // Porte-tubes, tubes, flacons de réactifs ; précipitations à chaque pas ; fait.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 380, y: 236, width: 320, height: 26, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 540, 249, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    const epi = L.equipement(g, { x: 300, y: 70, changer: () => dire("") });
    const rack = L.porte_tubes(ctx, { x: 400, sol: SOL, e: E, n: 4, pas: 30 });
    const tubes = TUBES.map(([sol, texte], k) => { const t = L.recipient(ctx, { id: `t${k}`, profil: "tube", x: rack[k].x, y: rack[k].y, contenu: { [sol]: 3 }, etiquette: texte }); t.place = rack[k]; L.manipuler(ctx, t, { sol: SOL, supports: rack, pose_libre: false }); return t; });
    const proteger = () => { if (epi.protege()) { dire(""); return true; } dire("Mettez lunettes et gants : la soude et le nitrate d'argent sont corrosifs."); return false; };
    [["r_soude", "Soude"], ["r_argent", "Nitrate\nd'argent"], ["r_baryum", "Chlorure\nde baryum"]].forEach(([liquide, texte], k) => L.flacon_gouttes(ctx, { id: liquide, x: 640 + k * 85, sol: SOL, e: E, liquide, texte, autoriser: proteger }));
    const vus = TUBES.map(() => new Set());
    L.bouton_texte(g, 140, 250, "Nouveaux tubes", () => { tubes.forEach((t, k) => { t.c = L.contenu({ [TUBES[k][0]]: 3 }); t.sig = null; }); dire("Tubes rincés et remplis de nouveau (3 mL)."); });
    let avant = "";
    ctx.ecoulement.sur_pas(() => {
      const v = { epi: epi.protege() };
      tubes.forEach((t, k) => { if (precipiter(t.c)) t.sig = null; const ph = t.c.phases.find((p) => p.classe === "aqueuse") || { dissous: {} }; Object.keys(PPT).forEach((n) => { if ((ph.dissous[`ppt_${n}`] || 0) > 0.002) vus[k].add(n); }); v[k + 1] = [...vus[k]]; });
      const s = JSON.stringify(v); if (s !== avant) { avant = s; L.missions.noter("tests_ions", v); }
    });
    return { pense_bete };
  };
})(window.Labo);

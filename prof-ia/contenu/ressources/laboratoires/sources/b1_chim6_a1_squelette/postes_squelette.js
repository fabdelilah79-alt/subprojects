/*
Rôle : les deux paillasses de l'influence du squelette carboné. Paillasse 1 : tubes d'hexane, de cyclohexane et d'éthanol
       (3 mL) dans un porte-tubes, pissette d'eau distillée : les hydrocarbures ne se mélangent pas à l'eau et restent
       au-dessus (moins denses), l'éthanol se mélange. Paillasse 2 : bain-marie à 50 °C, tubes de pentane, d'hexane et de
       cyclohexane : seul le pentane (Téb = 36 °C) bout ; affiche des températures d'ébullition des alcanes.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_solubilite(g), Labo.poste_ebullition(g) -> { pense_bete } ; faits « solubilite » = { 1…3 : { eau (mL),
          phases, haut (classe de la phase du haut) } } et « ebullition » = { 1…3 : { bain, T, bout, a_bouilli } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, r1 = (v) => Math.round(v * 10) / 10;
  const vol = (c, n) => c.phases.reduce((s, p) => s + (p.liquides[n] || 0), 0);
  const TABLE = [["méthane CH₄", "−162"], ["éthane C₂H₆", "−89"], ["propane C₃H₈", "−42"], ["butane C₄H₁₀", "−0,5"], ["pentane C₅H₁₂", "36"], ["hexane C₆H₁₄", "69"], ["2-méthylbutane C₅H₁₂", "28"], ["2,2-diméthylpropane C₅H₁₂", "10"]];

  function affiche(g) {
    // Affiche murale : températures d'ébullition sous la pression atmosphérique.
    L.svg("rect", { x: 700, y: 40, width: 300, height: 190, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 850, 58, "Températures d'ébullition (°C)", { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    TABLE.forEach(([n, t], k) => { const y = 78 + k * 18 + (k >= 6 ? 6 : 0); L.texte(g, 718, y, n, { "font-size": 8.6, fill: "#222", "text-anchor": "start" }); L.texte(g, 985, y, t, { "font-size": 8.6, "font-weight": 700, fill: "#222", "text-anchor": "end" }); });
    L.svg("line", { x1: 712, y1: 186, x2: 988, y2: 186, stroke: "#c9c4b0" }, g);
  }

  function bulles(g, t) {
    // Bulles de vapeur qui montent dans le liquide d'un tube qui bout.
    const h = t.pr.hauteur_de(t.c.volume()) * E;
    for (let k = 0; k < 7; k++) { const y = t.pose.y - ((performance.now() / 6 + k * 37) % Math.max(4, h)); L.svg("circle", { cx: t.pose.x + ((k * 5) % 9) - 4, cy: y, r: 1.3 + (k % 3) * 0.5, fill: "none", stroke: "#fff", "stroke-width": 0.8, opacity: 0.85 }, g); }
  }

  function rang(ctx, defs, x, supports_en_plus = []) {
    // Porte-tubes et tubes de 3 mL ; on peut prendre les tubes et les poser ailleurs (bain-marie).
    const rack = L.porte_tubes(ctx, { x, sol: SOL, e: E, n: defs.length, pas: 30 });
    return defs.map(([liquide, texte], k) => { const t = L.recipient(ctx, { id: `t${k + 1}`, profil: "tube", x: rack[k].x, y: rack[k].y, contenu: { [liquide]: 3 }, etiquette: texte }); t.place = rack[k]; L.manipuler(ctx, t, { sol: SOL, supports: [...rack, ...supports_en_plus], pose_libre: false }); return t; });
  }

  L.poste_solubilite = function (g) {
    // Trois tubes et la pissette ; le fait décrit les phases de chaque tube.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const tubes = rang(ctx, [["org_hexane", "hexane"], ["org_cyclohexane", "cyclohexane"], ["ethanol", "éthanol"]], 400);
    L.pissette(ctx, { x: 640, sol: SOL, e: E });
    setInterval(() => { const f = {}; tubes.forEach((t, k) => { f[k + 1] = { eau: r1(vol(t.c, "eau")), phases: t.c.phases.length, haut: t.c.phases[t.c.phases.length - 1]?.classe || null }; }); L.missions.noter("solubilite", f); }, 400);
    return { pense_bete };
  };

  L.poste_ebullition = function (g) {
    // Bain-marie à 50 °C, trois tubes d'hydrocarbures ; ébullition et bulles ; affiche des températures d'ébullition.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), gb = L.svg("g", { "pointer-events": "none" }, ctx.objets);
    L.ecoulement(ctx, { sol: SOL, e: E });
    affiche(g);
    const bain = L.bain_marie_physique(ctx, { x: 600, sol: SOL, e: E, T: 50 });
    const tubes = rang(ctx, [["org_pentane", "pentane"], ["org_hexane", "hexane"], ["org_cyclohexane", "cyclohexane"]], 330, bain.places), vu = tubes.map(() => false);
    ctx.ecoulement.sur_pas((dt) => { gb.replaceChildren(); tubes.forEach((t, k) => { t.bout = L.ebullition(t.c, dt); if (t.bout) { vu[k] = true; t.sig = null; bulles(gb, t); ctx.objets.insertBefore(gb, t.g); } }); });
    setInterval(() => { const f = {}; tubes.forEach((t, k) => { f[k + 1] = { bain: !!t.place?.bain, T: Math.round(t.c.T ?? 20), bout: !!t.bout, a_bouilli: vu[k] }; }); L.missions.noter("ebullition", f); }, 400);
    return { pense_bete };
  };
})(window.Labo);

/*
Rôle : paillasses des transformations rapides et lentes (vraies dimensions, porte-tubes, flacons compte-gouttes) :
       (1) quatre tubes : sel de Mohr acidifié (+ permanganate : décoloration immédiate), diiode (+ thiosulfate : décoloration
       immédiate), iodure de potassium acidifié (+ eau oxygénée : le diiode apparaît en quelques minutes), thiosulfate
       (+ acide chlorhydrique : le soufre trouble la solution en une demi-minute) ; (2) température : deux tubes d'iodure
       acidifié et un tube de glucose, eau oxygénée, liqueur de Fehling, bain-marie à 70 °C ; (3) concentration : thiosulfate
       à 0,10, 0,050 et 0,025 mol/L, une carte marquée d'une croix derrière chaque tube, acide chlorhydrique, chronomètre.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_rapides, Labo.poste_temperature, Labo.poste_concentration (groupe) -> { pense_bete } ; faits « tubes_rapides »,
          « tubes_temperature », « tubes_croix » (voir mesure()).
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, CROIX = 1.7e-3, r2 = (v) => Math.round(v * 100) / 100;
  const aqueuse = (t) => t.c.phases.find((p) => p.classe === "aqueuse") || { liquides: {}, dissous: {}, V: 1 };
  const mL = (t, n) => r2(aqueuse(t).liquides[n] || 0), mmolL = (t, s) => r2((1000 * (aqueuse(t).dissous[s] || 0)) / aqueuse(t).V);

  function banc(g, n, x_rack, def, flacons, x_flacons) {
    // Affiche, pense-bête, écoulement, porte-tubes et tubes, flacons ; les tubes réagissent (réactions totales et lentes).
    L.affiche_securite(g, 780, 56);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const rack = L.porte_tubes(ctx, { x: x_rack, sol: SOL, e: E, n, pas: 30 });
    const tubes = def.map(([contenu, etiquette], k) => { const t = L.recipient(ctx, { id: `t${k + 1}`, profil: "tube", x: rack[k].x, y: rack[k].y, contenu, etiquette }); t.place = rack[k]; return t; });
    flacons.forEach(([liquide, texte], k) => L.flacon_gouttes(ctx, { id: liquide, x: x_flacons + k * 85, sol: SOL, e: E, liquide, texte }));
    ctx.ecoulement.sur_pas((dt) => tubes.forEach((t) => { if (L.reagir(t.c)) t.sig = null; if (L.avancer_lent(t.c, dt)) t.sig = null; }));
    ctx.noter = (cle, f) => { let avant = ""; ctx.ecoulement.sur_pas(() => { const v = f(), s = JSON.stringify(v); if (s !== avant) { avant = s; L.missions.noter(cle, v); } }); };
    return { pense_bete, ctx, rack, tubes };
  }

  L.poste_rapides = function (g) {
    // Quatre tubes, quatre flacons : deux transformations rapides, deux lentes.
    const b = banc(g, 4, 330, [[{ ox_mohr: 2, ox_sulfurique: 0.5 }, "1 Fe²⁺"], [{ ox_diiode: 0.5, eau: 2 }, "2 I₂"], [{ cin_ki_acide: 3 }, "3 I⁻ + H⁺"], [{ ox_thiosulfate: 3 }, "4 S₂O₃²⁻"]],
      [["ox_permanganate", "Permanganate\nde potassium"], ["ox_thiosulfate", "Thiosulfate\nde sodium"], ["cin_peroxyde", "Eau oxygénée\n0,10 mol/L"], ["cin_hcl", "Acide\nchlorhydrique"]], 500);
    const [t1, t2, t3, t4] = b.tubes;
    b.ctx.noter("tubes_rapides", () => ({ t1: { permanganate: mL(t1, "ox_permanganate"), MnO4: mmolL(t1, "MnO4-") }, t2: { thiosulfate: mL(t2, "ox_thiosulfate"), I2: mmolL(t2, "I2") },
      t3: { peroxyde: mL(t3, "cin_peroxyde"), I2: mmolL(t3, "I2") }, t4: { acide: mL(t4, "cin_hcl"), S: mmolL(t4, "S") } }));
    return { pense_bete: b.pense_bete };
  };

  L.poste_temperature = function (g) {
    // Deux tubes d'iodure acidifié, un tube de glucose ; bain-marie à 70 °C ; les tubes se déplacent entre porte-tubes et bain.
    const b = banc(g, 3, 280, [[{ cin_ki_acide: 3 }, "1 I⁻ + H⁺"], [{ cin_ki_acide: 3 }, "2 I⁻ + H⁺"], [{ solution_glucose: 2 }, "3 glucose"]],
      [["cin_peroxyde", "Eau oxygénée\n0,10 mol/L"], ["fehling", "Liqueur de\nFehling"]], 430);
    const bain = L.bain_marie_physique(b.ctx, { x: 690, sol: SOL, e: E, T: 70 });
    b.tubes.forEach((t) => L.manipuler(b.ctx, t, { sol: SOL, supports: [...b.rack, ...bain.places], pose_libre: false }));
    const etat = (t) => ({ T: Math.round(t.c.T ?? 20), bain: !!t.place?.bain, peroxyde: mL(t, "cin_peroxyde"), I2: mmolL(t, "I2") });
    b.ctx.noter("tubes_temperature", () => ({ t1: etat(b.tubes[0]), t2: etat(b.tubes[1]), t3: { T: Math.round(b.tubes[2].c.T ?? 20), bain: !!b.tubes[2].place?.bain, fehling: mL(b.tubes[2], "fehling"), avance: r2(b.tubes[2].c.avance || 0) } }));
    return { pense_bete: b.pense_bete };
  };

  function croix(g, x, y) {
    // Carte blanche posée derrière le tube, marquée d'une croix noire à la hauteur du liquide.
    L.svg("rect", { x: x - 15, y: y - 70, width: 30, height: 64, rx: 1.5, fill: "#fbfbf6", stroke: "#b9b6aa", "stroke-width": 0.6 }, g);
    L.svg("path", { d: `M${x - 6} ${y - 20} l12 12 m0 -12 l-12 12`, stroke: "#111", "stroke-width": 2.6, "stroke-linecap": "round" }, g);
  }

  L.poste_concentration = function (g) {
    // Trois tubes de thiosulfate de concentrations différentes, croix derrière chacun, acide, chronomètre.
    const C0 = [0.1, 0.05, 0.025], g_c = L.svg("g", { "pointer-events": "none" }, g);
    const b = banc(g, 3, 330, C0.map((c, k) => [{ ox_thiosulfate: 3 * c / 0.1, eau: 3 - (3 * c) / 0.1 }, `${k + 1} ${String(c).replace(".", ",")} mol/L`]), [["cin_hcl", "Acide\nchlorhydrique"]], 520);
    b.rack.forEach((p) => croix(g_c, p.x, p.y));
    L.chronometre_manuel(g, { x: 660, y: 478, fait: "chronometre" });
    const suivi = b.tubes.map(() => ({ debut: null, croix: null }));
    b.ctx.noter("tubes_croix", () => {
      // Début : première goutte d'acide ; croix cachée quand le soufre atteint 1,7 × 10⁻³ mol/L.
      const t = performance.now() / 1000;
      return Object.fromEntries(b.tubes.map((tube, k) => {
        const s = suivi[k];
        if (s.debut === null && mL(tube, "cin_hcl") > 0) s.debut = t;
        if (s.debut !== null && s.croix === null && mmolL(tube, "S") / 1000 >= CROIX) s.croix = Math.round(t - s.debut);
        return [`t${k + 1}`, { c0: C0[k], acide: mL(tube, "cin_hcl"), t_croix: s.croix }];
      }));
    });
    return { pense_bete: b.pense_bete };
  };
})(window.Labo);

/*
Rôle : cellule de conductance aux vraies dimensions (1,6 px par mm, comme toute la verrerie) : deux plaques parallèles de
       1 cm × 4 cm tenues par une barrette graduée au bout d'un pied (on fait glisser la plaque de droite : L de 0,5 à 3 cm),
       reliées à un bornier à deux bornes (composant du circuit : conductance G) ; support élévateur à manivelle (on la fait
       glisser vers le haut ou le bas) ; béchers de 100 mL des solutions (verrerie physique : on les prend, on les pose sur
       le plateau, on peut verser). S = 1 cm × profondeur immergée ; σ d'un mélange : moyenne des σ pondérée par les volumes.
Reçoit : le contexte de chimie (paillasse_chimie), le circuit (circuit.js) et { flacons: [{ id, texte, sol (Labo.SOLUTIONS),
         C (mol/L) }], L (cm), L_fixe, S_fixe (cm² : la manivelle n'a que deux positions, bas ou plaques immergées de S_fixe cm) }.
Produit : Labo.cellule_conductance(ctx, c, reglage) -> { etat() -> { flacon (id du bécher posé sur le plateau, ou « melange »),
          L, S, G }, comp (bornes « cellule.1 » et « cellule.2 »), glisse() (vrai pendant un réglage), sur_lacher(f) }.
Utilisé par : poste_conductance.js.
*/
(function (L) {
  const X = 600, E = 1.6, PX_CM = 16, SOL = 576, YPB = 470, YB = 356, HAUT = 479, BAS = 552, MANIV = { x: X + 76 }, YBO = 327;
  const PLACES = [[50, 470], [140, 470], [230, 470], [320, 470], [410, 470], [236, 576], [324, 576], [412, 576]].map(([x, y]) => ({ x, y }));

  function cellule(g, l) {
    // Barrette graduée, tiges, deux plaques (vues de trois quarts), graduations de profondeur, fils jusqu'au bornier.
    g.replaceChildren();
    const xg = X - 24, xd = xg + l * PX_CM;
    L.svg("rect", { x: X - 44, y: YB - 6, width: 88, height: 6, rx: 2, fill: "#f0efe8", stroke: "#8f8b7c" }, g);
    for (let c = 0; c <= 4; c += 0.5) L.svg("line", { x1: xg + c * PX_CM, y1: YB - 6, x2: xg + c * PX_CM, y2: YB - (c % 1 ? 4 : 2), stroke: "#333", "stroke-width": 0.5 }, g);
    for (const [x, xb, couleur] of [[xg, X - 13, "#c62828"], [xd, X + 13, "#1d1f22"]]) {
      L.svg("path", { d: `M${xb} ${YBO + 4} C${xb} ${YBO + 14} ${x} ${YB - 22} ${x} ${YB - 8}`, fill: "none", stroke: couleur, "stroke-width": 1.6 }, g);
      L.svg("rect", { x: x - 4, y: YB - 10, width: 8, height: 11, rx: 2, fill: "#2b3035" }, g);
      L.svg("rect", { x: x + 2, y: YB, width: 2, height: YPB - 64 - YB + 2, fill: "url(#metal)" }, g);
      L.svg("path", { d: `M${x} ${YPB - 62} L${x + 7} ${YPB - 66} V${YPB - 4} L${x} ${YPB} Z`, fill: "#4a4f55", stroke: "#22262a", "stroke-width": 0.6 }, g);
    }
    for (let k = 1; k <= 3; k++) { const y = YPB - k * PX_CM; L.svg("line", { x1: xg - 5, y1: y, x2: xg, y2: y, stroke: "#e8e2cc", "stroke-width": 0.7 }, g); L.texte(g, xg - 11, y + 3, `${k}`, { "font-size": 6, fill: "#e8e2cc" }); }
    return { xd };
  }

  function support(g, y) {
    // Support élévateur (socle, ciseaux, plateau en y) et sa manivelle.
    g.replaceChildren();
    L.ombre_sol(g, X, SOL + 2, 62, 5, 0.4);
    L.svg("rect", { x: X - 56, y: SOL - 6, width: 112, height: 6, rx: 2, fill: "url(#metal)", stroke: "#444" }, g);
    for (const s of [-1, 1]) L.svg("line", { x1: X - 48, y1: s > 0 ? SOL - 6 : y + 6, x2: X + 48, y2: s > 0 ? y + 6 : SOL - 6, stroke: "#6a7177", "stroke-width": 3.5 }, g);
    L.svg("rect", { x: X - 56, y, width: 112, height: 6, rx: 2, fill: "url(#metal)", stroke: "#444" }, g);
    const ym = (y + SOL) / 2;
    L.svg("line", { x1: X + 48, y1: ym, x2: MANIV.x, y2: ym, stroke: "#555", "stroke-width": 3 }, g);
    L.svg("circle", { cx: MANIV.x, cy: ym, r: 8, fill: "#2b3035", stroke: "#000" }, g); L.svg("circle", { cx: MANIV.x, cy: ym, r: 3, fill: "url(#metal)" }, g);
  }

  function composant(c) {
    // Bornier isolant au bout de la potence, deux bornes ; modèle électrique : conductance G entre les bornes 1 et 2.
    const comp = { id: "cellule", G: 0, g: L.svg("g", { class: "cellule" }, c.calque_composants) };
    L.svg("rect", { x: X - 28, y: YBO - 11, width: 56, height: 24, rx: 3, fill: "#2b3035", stroke: "#111" }, comp.g);
    L.texte(comp.g, X, YBO - 15, "CELLULE", { "font-size": 6.5, "font-weight": 700, fill: "#e8e2cc" });
    c.borne(comp, "1", X - 13, YBO, L.ROUGE_BORNE);
    c.borne(comp, "2", X + 13, YBO, L.NOIR_BORNE);
    comp.dipoles = () => [{ a: "1", b: "2", g: Math.max(1e-12, comp.G), j: 0 }];
    return c.ajouter(comp);
  }

  function mesurer(b, flacons, l) {
    // Bécher sur le plateau : surface du liquide, profondeur immergée, σ du contenu (moyenne pondérée), G.
    if (!b) return { flacon: null, S: 0, G: 0 };
    const ph = b.c.phases.find((p) => p.classe === "aqueuse"), V = ph ? ph.V : 0;
    const prof = V > 0 ? Math.max(0, Math.min(4, (YPB - (b.pose.y - b.pr.hauteur_de(b.c.volume()) * E)) / PX_CM)) : 0, S = Math.round(prof * 10) / 10;
    let sigma = 0; const purs = [];
    for (const [n, v] of Object.entries(ph?.liquides || {})) { const f = flacons.find((k) => `cond_${k.id}` === n); if (f && v > 1e-6) { sigma += (v / V) * L.sigma(f.sol, f.C); purs.push(f.id); } else if (n === "eau") sigma += (v / V) * L.sigma("eau", 0); }
    return { flacon: purs.length === 1 && Object.keys(ph.liquides).length === 1 ? purs[0] : "melange", S, G: S > 0 ? (sigma * S * 1e-4) / (l * 1e-2) : 0 };
  }

  function bechers(ctx, flacons, station, e) {
    // Un bécher de 100 mL par solution (70 mL), sur sa place ; on ne le reprend sur le plateau que plateau en bas.
    return flacons.map((k, i) => {
      L.LIQUIDES[`cond_${k.id}`] = { nom: k.texte.replace("\n", " "), d: 1.0, rgb: [228, 240, 246], alpha: 0.3, classe: "aqueuse" };
      const r = L.recipient(ctx, { id: k.id, profil: "becher_100", x: PLACES[i].x, y: PLACES[i].y, e: E, contenu: { [`cond_${k.id}`]: 70 }, etiquette: k.texte.replace("\n", " ") });
      L.manipuler(ctx, r, { sol: SOL, supports: [...PLACES, station], pose_libre: false, autoriser: () => r.place !== station || e.y >= BAS - 1 });
      return r;
    });
  }

  L.cellule_conductance = function (ctx, c, { flacons, L: l0 = 1, L_fixe = false, S_fixe = null }) {
    // Matériel et gestes ; la conductance du composant suit le bécher, la hauteur du plateau et la distance des plaques.
    const e = { l: l0, y: BAS, glisse: false, lachers: [] }, station = { x: X, y: BAS, station: true };
    L.ecoulement(ctx, { sol: SOL, e: E });
    L.pied_support(ctx.fond, X - 100, SOL, 300); L.svg("rect", { x: X - 100, y: 340, width: 100, height: 5, fill: "url(#metal)" }, ctx.fond); L.svg("rect", { x: X - 2, y: 340, width: 4, height: YB - 346, fill: "url(#metal)" }, ctx.fond); L.noix(ctx.fond, X - 100, 342);
    const gs = L.svg("g", {}, ctx.fond), gc = L.svg("g", { "pointer-events": "none" }, ctx.fond), comp = composant(c), liste = bechers(ctx, flacons, station, e);
    const gm = L.svg("g", { class: "manivelle", role: "slider", "aria-label": "Manivelle du support élévateur" }, ctx.haut), gd = L.svg("g", { class: "plaque", role: "slider", "aria-label": "Plaque mobile" }, ctx.haut);
    const sur_plateau = () => liste.find((b) => b.place === station && !b.tenu);
    const etat = () => { const m = mesurer(sur_plateau(), flacons, e.l); return { flacon: m.flacon, L: e.l, S: m.S, G: m.G }; };
    const actualiser = () => { const G = etat().G; if (Math.abs(G - comp.G) > 1e-12) { comp.G = G; c.calculer(); } };
    const hauteur = (y) => { const b = sur_plateau(); e.y = b ? Math.max(HAUT, Math.min(BAS, y)) : BAS; if (S_fixe && b) { const h = YPB + b.pr.hauteur_de(b.c.volume()) * E - S_fixe * PX_CM; e.y = e.y < (h + BAS) / 2 ? h : BAS; } station.y = e.y; if (b) { b.pose.y = e.y; b.dessiner(); } };
    const dessiner = () => { const p = cellule(gc, e.l); support(gs, e.y); gm.replaceChildren(); L.svg("circle", { cx: MANIV.x, cy: (e.y + SOL) / 2, r: 14, fill: "#fff", opacity: 0.01 }, gm); gd.replaceChildren(); L.svg("rect", { x: p.xd - 8, y: YB - 14, width: 18, height: YPB - YB + 16, fill: "#fff", opacity: 0.01 }, gd); actualiser(); };
    const lacher = () => { e.glisse = false; actualiser(); e.lachers.forEach((f) => f()); };
    L.glissable(gm, { soulever: false, debut: () => { e.glisse = true; return { x: MANIV.x, y: e.y }; }, deplacer: (p) => { hauteur(p.y); dessiner(); }, lacher });
    if (!L_fixe) L.glissable(gd, { soulever: false, debut: () => { e.glisse = true; return { x: X - 24 + e.l * PX_CM, y: 0 }; }, deplacer: (p) => { e.l = Math.round(Math.max(0.5, Math.min(3, (p.x - X + 24) / PX_CM)) * 2) / 2; dessiner(); }, lacher });
    dessiner();
    setInterval(() => { if (!sur_plateau() && e.y < BAS) { e.y = BAS; station.y = BAS; dessiner(); } if (!e.glisse) actualiser(); }, 300);
    return { etat, comp, glisse: () => e.glisse, sur_lacher: (f) => e.lachers.push(f) };
  };
})(window.Labo);

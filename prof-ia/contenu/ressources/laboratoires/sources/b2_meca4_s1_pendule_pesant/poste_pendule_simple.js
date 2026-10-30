/*
Rôle : paillasse « pendule simple » : bille (acier 44 g ou aluminium 15 g) au bout d'un fil dont on règle la longueur l
       (15 à 80 cm, du point de suspension au centre de la bille) avec la molette de la pince ; règle graduée ; chronomètre
       à main pour mesurer dix oscillations. On écarte la bille (jusqu'à 30°) et on la lâche : θ̈ = −(g/l)·sin θ, frottement
       de l'air faible (τ = 300 s pour l'acier, 100 s pour l'aluminium).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_pendule_simple(g) -> { pense_bete } ; faits « pendule_simple » = { l (m), bille },
          « lachers_simple » = [{ id, l, bille, theta0 (°), T (s) }], « chronometre ».
Utilisé par : simulation.js (paillasse 2).
*/
(function (L) {
  const D = L.pendule_simple_dessin, MAX = Math.PI / 6, TAU = { acier: 300, aluminium: 100 }, deg = (r) => Math.round((r * 1800) / Math.PI) / 10;

  function fiche(g) {
    // Fiche des données collée au mur.
    L.svg("rect", { x: 580, y: 44, width: 400, height: 80, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 780, 60, "Pendule simple", { "font-size": 9.5, "font-weight": 700, fill: "#23315a" });
    ["l : longueur du point de suspension au centre de la bille", "Billes de même diamètre (2,2 cm) : acier 44 g ; aluminium 15 g", "Période propre du pendule simple : T0 = 2π·√(l / g) ; g = 9,81 m/s²"].forEach((t, i) => L.texte(g, 780, 77 + i * 15, t, { "font-size": 8, fill: "#222" }));
  }

  function gestes(g, e, m, noter, lacher) {
    // Molette (glisser vers le bas : le fil s'allonge), bille (écarter, lâcher ; un appui bref l'arrête), coupelle (changer de bille).
    const vers = (ev) => L.scene.vers_scene(ev), M = D.MOLETTE;
    const molette = L.svg("circle", { cx: M.x, cy: M.y, r: 14, fill: "#000", opacity: 0.001, class: "molette", role: "slider", "aria-label": "Molette de la pince" }, g);
    let l0 = e.l;
    L.glissable(molette, { soulever: false, debut: () => { m.arreter(); m.th = 0; l0 = e.l; return { x: 0, y: 0 }; },
      deplacer: (p) => { e.l = Math.max(0.15, Math.min(0.8, Math.round((l0 + p.y / D.PX) * 200) / 200)); }, lacher: noter });
    const bille = L.svg("circle", { r: 16, fill: "#000", opacity: 0.001, class: "bille", role: "slider", "aria-label": "Bille" }, g);
    L.glissable(bille, { soulever: false, debut: (ev) => { m.arreter(); return vers(ev); },
      deplacer: (p) => { m.th = Math.max(-MAX, Math.min(MAX, Math.atan2(p.x - D.O.x, p.y - D.O.y))); }, lacher, toucher: () => { m.th = 0; } });
    const coupelle = L.svg("rect", { x: D.COUPELLE.x - 30, y: D.COUPELLE.y - 16, width: 60, height: 30, fill: "#000", opacity: 0.001, class: "coupelle", role: "button", "aria-label": "Changer de bille" }, g);
    return { bille, coupelle };
  }

  L.poste_pendule_simple = function (g) {
    // Potence, pendule, coupelle, chronomètre ; le modèle est intégré à chaque image.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { l: 0.5, bille: "acier" }, lachers = [];
    fiche(g); D.fond(g);
    const gc = L.svg("g", {}, g), gp = L.svg("g", {}, g), m = L.pendule.creer({ omega2: L.pendule.G / e.l, tau: TAU.acier });
    const noter = () => { Object.assign(m, { omega2: L.pendule.G / e.l, tau: TAU[e.bille] }); L.missions.noter("pendule_simple", { l: e.l, bille: e.bille }); };
    const lacher = () => {
      // Lâcher sans vitesse ; l'essai est noté.
      if (Math.abs(m.th) < 0.02) return Object.assign(m, { th: 0 });
      m.lacher(m.th);
      lachers.push({ id: `lacher${lachers.length + 1}`, l: e.l, bille: e.bille, theta0: deg(m.th), T: Math.round(L.pendule.periode(m.omega2, m.th) * 10000) / 10000 });
      L.missions.noter("lachers_simple", lachers.slice());
    };
    const z = gestes(g, e, m, noter, lacher);
    L.glissable(z.coupelle, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { m.arreter(); m.th = 0; e.bille = e.bille === "acier" ? "aluminium" : "acier"; D.coupelle(gc, e.bille); noter(); } });
    L.chronometre_manuel(g, { x: 760, y: 470, fait: "chronometre" });
    let avant = performance.now() / 1000;
    const image = () => {
      // Intègre le mouvement depuis l'image précédente et redessine le pendule.
      const t = performance.now() / 1000;
      m.avancer(t - avant); avant = t;
      D.pendule(gp, e.l, m.th, e.bille);
      const c = D.centre(e.l, m.th); z.bille.setAttribute("cx", c.x); z.bille.setAttribute("cy", c.y);
      requestAnimationFrame(image);
    };
    D.coupelle(gc, e.bille); noter(); L.missions.noter("lachers_simple", []); image();
    return { pense_bete };
  };
})(window.Labo);

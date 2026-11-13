/*
Rôle : « table à forces » verticale : panneau blanc fixé au mur, deux poulies en haut, un anneau léger tenu par trois fils
       qui portent chacun un porte-masses (50 g). L'élève charge les porte-masses avec des masses à fente (glisser-déposer,
       depuis le plateau de rangement) ; l'anneau prend aussitôt sa position d'équilibre.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.table_forces(groupe) -> { etat(), sur_changement(f) } ; etat() = { O, alpha1, alpha2, masses [m1, m2, m3] (kg),
          F [N], pose } ; fait noté « config_forces » = { masses, pose, beta1, beta2 (angles des fils 1 et 2 avec l'horizontale, en °), F }.
Utilisé par : poste_trois_forces.js.
*/
(function (L) {
  const G = 9.81, P1 = { x: 250, y: 84 }, P2 = { x: 774, y: 84 }, R = 12, LONGUEUR = 560, Y_MAX = 384, BAS = 470, FIL3 = 30;
  const FENTES = [0.05, 0.05, 0.05, 0.05, 0.1, 0.1].map((m, i) => ({ m, id: i, sur: null }));

  function panneau(g) {
    // Panneau blanc et ses deux poulies à gorge sur leurs chapes.
    L.svg("rect", { x: 190, y: 50, width: 644, height: 340, rx: 4, fill: "#fbfbf8", stroke: "#b9bdb5", filter: "url(#ombre)" }, g);
    for (const P of [P1, P2]) {
      L.svg("rect", { x: P.x - 4, y: P.y - 30, width: 8, height: 30, fill: "url(#acier)" }, g);
      L.svg("circle", { cx: P.x, cy: P.y, r: R + 2, fill: "url(#metal)", stroke: "#3b3f44" }, g);
      L.svg("circle", { cx: P.x, cy: P.y, r: 3, fill: "#2a2e33" }, g);
    }
    L.svg("path", { d: "M310 456 H500 L508 470 H302 Z", fill: "url(#bois)" }, g);
    L.texte(g, 405, 486, "Masses à fente", { class: "etiquette-carton", "font-size": 14, fill: "#f3e3c7" });
  }

  function porte_masses(parent, x, y, n, fentes) {
    // Crochet, tige et plateau du porte-masses (50 g) ; les masses à fente empilées sur la tige.
    const g = L.svg("g", { class: "porte-masses", "data-fil": n }, parent);
    L.svg("path", { d: `M${x} ${y} v6`, stroke: "url(#metal)", "stroke-width": 1.6 }, g);
    L.tige(g, `M${x} ${y + 6} V${y + 50}`, 3);
    L.svg("ellipse", { cx: x, cy: y + 52, rx: 13, ry: 3.5, fill: "url(#acier)", stroke: "#3b3f44", "stroke-width": 0.6 }, g);
    L.texte(g, x + 24, y + 30, `${n}`, { "font-size": 11, "font-weight": 700, fill: "#14324f" });
    let h = y + 48;
    for (const f of fentes) { h -= f.m > 0.06 ? 8 : 5; dessiner_fente(g, x, h, f); }
  }

  function dessiner_fente(g, x, y, f) {
    // Disque de laiton fendu (vu un peu d'en haut), avec sa masse gravée.
    const e = f.m > 0.06 ? 8 : 5, gr = L.svg("g", { class: "masse-fente", "data-fente": f.id }, g);
    L.svg("rect", { x: x - 13, y, width: 26, height: e, fill: "url(#laiton)" }, gr);
    L.svg("ellipse", { cx: x, cy: y, rx: 13, ry: 3, fill: "url(#laiton-haut)", stroke: "#a77d24", "stroke-width": 0.5 }, gr);
    L.texte(gr, x, y + e / 2 + 1, `${f.m * 1000} g`, { "font-size": 4.5, fill: "#4a370b" });
  }

  function calculer(e) {
    // Masses de chaque porte-masses, forces, équilibre de l'anneau ; positions des porte-masses.
    e.masses = [0, 1, 2].map((i) => 0.05 + FENTES.filter((f) => f.sur === i).reduce((s, f) => s + f.m, 0));
    e.F = e.masses.map((m) => m * G);
    Object.assign(e, L.equilibre_anneau(P1, P2, e.F, Y_MAX));
    const y = (P) => Math.min(BAS - 56, P.y + LONGUEUR - Math.hypot(e.O.x - P.x, e.O.y - P.y));
    e.crochets = [{ x: P1.x - R, y: y(P1) }, { x: P2.x + R, y: y(P2) }, { x: e.O.x, y: Math.min(BAS - 56, e.O.y + FIL3) }];
  }

  function dessiner(e, g) {
    // Fils, anneau, porte-masses chargés, masses restées sur le plateau de rangement.
    g.replaceChildren();
    const fil = { stroke: "#5b4a33", "stroke-width": 1.1, fill: "none" }, c = e.crochets, O = e.O;
    L.svg("path", { d: `M${O.x} ${O.y} L${P1.x} ${P1.y - R} M${P1.x - R} ${P1.y} V${c[0].y}`, ...fil }, g);
    L.svg("path", { d: `M${O.x} ${O.y} L${P2.x} ${P2.y - R} M${P2.x + R} ${P2.y} V${c[1].y}`, ...fil }, g);
    L.svg("path", { d: `M${O.x} ${O.y} V${c[2].y}`, ...fil }, g);
    L.svg("circle", { cx: O.x, cy: O.y, r: 5, fill: "none", stroke: "url(#metal)", "stroke-width": 2.4, class: "anneau" }, g);
    c.forEach((p, i) => porte_masses(g, p.x, p.y, i + 1, FENTES.filter((f) => f.sur === i)));
    FENTES.forEach((f, k) => { if (f.sur === null && !f.en_main) dessiner_fente(g, 332 + k * 30, 452, f); });
  }

  L.table_forces = function (g) {
    // Construit la table à forces et rend les masses à fente déplaçables.
    panneau(g);
    const calque = L.svg("g", {}, g), e = { ecouteurs: [] }, maj = () => {
      calculer(e); dessiner(e, calque);
      const beta = (a) => Math.round((90 - (a * 180) / Math.PI) * 10) / 10;
      L.missions.noter("config_forces", { masses: e.masses.map((m) => Math.round(m * 1000) / 1000), pose: e.pose, beta1: beta(e.alpha1), beta2: beta(e.alpha2), F: e.efficaces });
      for (const f of e.ecouteurs) f(e);
    };
    let prise = null;
    calque.addEventListener("pointerdown", (ev) => { const n = ev.target.closest(".masse-fente"); prise = n ? FENTES[+n.dataset.fente] : null; }, { capture: true });
    L.glissable(calque, {
      soulever: false,
      debut: (ev) => (prise ? L.scene.vers_scene(ev) : null),
      saisir: () => { Object.assign(prise, { sur: null, en_main: true }); maj(); },
      deplacer: (p) => { maj(); dessiner_fente(calque, p.x, p.y, prise); },
      lacher: (p) => { const i = e.crochets.findIndex((c) => Math.abs(p.x - c.x) < 30 && p.y > c.y - 30 && p.y < c.y + 70); Object.assign(prise, { sur: i >= 0 ? i : null, en_main: false }); maj(); },
    });
    maj();
    return { etat: () => e, sur_changement: (f) => e.ecouteurs.push(f) };
  };
})(window.Labo);

/*
Rôle : mesure d'un retard sur un milieu à une dimension : règle graduée posée sous le milieu, deux cellules
       photoélectriques (A et B) dont le faisceau passe juste au-dessus du milieu au repos, que l'on fait glisser le long
       de la règle (tous les 5 cm), et chronomètre électronique relié par deux câbles : la perturbation qui coupe le
       faisceau de A le met en marche, celle qui coupe le faisceau de B l'arrête ; il affiche Δt au millième de seconde.
       Touche RAZ pour une nouvelle mesure.
Reçoit : le groupe SVG (placé derrière le milieu), le milieu (milieu_1d.js) et { x0 (px de l'abscisse 0), k (px par m),
         y_axe (px du milieu au repos), sol (px du plan de travail sous les cellules), positions [xA, xB] (m), seuil (m,
         hauteur du faisceau au-dessus du repos), chrono { x, y }, fait, sur_mesure(dt) (facultatif) }.
Produit : Labo.detecteurs_onde(g, milieu, reglage) -> d { xA, xB, dt (s ou null), raz() } ; fait « <fait> » = { xA, xB, dt }.
Utilisé par : les simulations d'ondes mécaniques (ressort, corde).
*/
(function (L) {
  const r2 = (v) => Math.round(v * 100) / 100;

  function regle(g, c) {
    // Règle de 2 m posée sur la paillasse, graduée tous les 10 cm.
    const y = c.sol - 6, l = c.milieu.longueur * c.k;
    L.svg("rect", { x: c.x0 - 8, y, width: l + 16, height: 12, rx: 1, fill: "#efe3b8", stroke: "#a8935a" }, g);
    for (let i = 0; i <= Math.round(c.milieu.longueur * 20); i++) {
      const x = c.x0 + i * 0.05 * c.k, grand = i % 2 === 0;
      L.svg("line", { x1: x, y1: y, x2: x, y2: y + (grand ? 6 : 3.5), stroke: "#3b3220", "stroke-width": 0.7 }, g);
      if (grand) L.texte(g, x, y + 9.5, String(i * 5), { "font-size": 4.6, fill: "#3b3220" });
    }
  }

  function cellule(g, x, c, nom) {
    // Cellule sur sa tige, derrière le milieu : sa tête émet le faisceau à la hauteur du seuil, au-dessus du repos.
    g.replaceChildren();
    const yf = c.y_axe - c.seuil * c.k;
    L.ombre_sol(g, x + 3, c.sol - 2, 14, 3, 0.4);
    L.svg("rect", { x: x - 10, y: c.sol - 10, width: 20, height: 8, rx: 2, fill: "#2c3238" }, g);
    L.tige(g, `M${x} ${c.sol - 10} V${yf}`, 3);
    L.svg("rect", { x: x - 8, y: yf - 9, width: 16, height: 14, rx: 2, fill: "#1f2a30", stroke: "#000", "stroke-width": 0.6 }, g);
    L.svg("circle", { cx: x, cy: yf - 2, r: 2, fill: "#ff3b30" }, g);
    L.texte(g, x, c.sol + 14, nom, { "font-size": 8, "font-weight": 700, fill: "#f4f1e6" });
    L.svg("rect", { x: x - 14, y: yf - 12, width: 28, height: c.sol - yf + 14, fill: "#000", opacity: 0 }, g);
  }

  function chrono(g, c, d) {
    // Boîtier, afficheur, prises START et STOP, touche RAZ ; renvoie la fonction d'affichage.
    const { x, y } = c.chrono;
    L.boitier(g, x - 70, y - 30, 140, 70, 20, { dessus: "#cfd5d9", face: "#7d8890" });
    L.texte(g, x, y - 20, "CHRONOMÈTRE ÉLECTRONIQUE", { "font-size": 6.5, "font-weight": 700, fill: "#23315a" });
    L.svg("rect", { x: x - 56, y: y - 12, width: 112, height: 22, rx: 3, fill: "#1d2a22" }, g);
    for (const [t, dx, couleur] of [["START", -40, "#c62828"], ["STOP", -8, "#1f2a30"]]) {
      L.svg("circle", { cx: x + dx, cy: y + 24, r: 4, fill: couleur, stroke: "#111" }, g);
      L.texte(g, x + dx, y + 34, t, { "font-size": 5.5, "font-weight": 700, fill: "#f4f1e6" });
    }
    const ecran = L.svg("g", {}, g);
    L.bouton_rond(g, x + 38, y + 24, "RAZ", () => { d.dt = null; d.tA = null; afficher(); c.noter(); }, 10);
    const afficher = () => { ecran.replaceChildren(); L.texte(ecran, x, y + 4, d.dt === null ? (d.tA === null ? "0,000 s" : "- - - -") : `${d.dt.toFixed(3).replace(".", ",")} s`, { "font-size": 12, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" }); };
    return afficher;
  }

  L.detecteurs_onde = function (g, milieu, reglage) {
    // Règle, cellules déplaçables, câbles, chronomètre ; le passage est cherché à chaque pas de calcul du milieu.
    const c = { ...reglage, milieu }, d = { xA: reglage.positions[0], xB: reglage.positions[1], dt: null, tA: null };
    regle(g, c);
    const cables = L.svg("g", { "pointer-events": "none" }, g), gA = L.svg("g", { class: "cellule-A", role: "button", "aria-label": "Cellule A" }, g), gB = L.svg("g", { class: "cellule-B", role: "button", "aria-label": "Cellule B" }, g);
    const afficher = chrono(g, c, d);
    c.noter = () => L.missions.noter(reglage.fait, { xA: r2(d.xA), xB: r2(d.xB), dt: d.dt === null ? null : Math.round(d.dt * 1000) / 1000 });
    const px = (xm) => c.x0 + xm * c.k;
    const dessiner = () => {
      cellule(gA, px(d.xA), c, "A"); cellule(gB, px(d.xB), c, "B"); cables.replaceChildren();
      for (const [xm, dx] of [[d.xA, -40], [d.xB, -8]]) L.svg("path", { d: `M${px(xm)} ${c.sol - 4} C${px(xm)} ${c.sol + 8} ${c.chrono.x + dx} ${c.chrono.y + 60} ${c.chrono.x + dx} ${c.chrono.y + 28}`, fill: "none", stroke: "#222", "stroke-width": 2 }, cables);
    };
    for (const [gr, cle] of [[gA, "xA"], [gB, "xB"]]) L.glissable(gr, { soulever: false, debut: () => ({ x: px(d[cle]), y: c.sol }), deplacer: (p) => { d[cle] = Math.max(0.1, Math.min(milieu.longueur - 0.1, Math.round((p.x - c.x0) / c.k / 0.05) * 0.05)); dessiner(); }, lacher: () => { d.dt = null; d.tA = null; afficher(); c.noter(); } });
    const coupe = (xm) => milieu.elongation(xm) > c.seuil;
    let avant = { A: false, B: false };
    milieu.sur_pas((t) => {
      const A = coupe(d.xA), B = coupe(d.xB);
      if (A && !avant.A && d.tA === null && d.dt === null) { d.tA = t; afficher(); }
      if (B && !avant.B && d.tA !== null && d.dt === null) { d.dt = (t - d.tA) * (1 + (Math.random() - 0.5) * 0.004); afficher(); c.noter(); reglage.sur_mesure?.(d.dt); }
      avant = { A, B };
    });
    d.raz = () => { d.dt = null; d.tA = null; afficher(); c.noter(); };
    dessiner(); afficher(); c.noter();
    return d;
  };
})(window.Labo);

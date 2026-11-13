/*
Rôle : paillasse « la vague et le bouchon » : cuve en verre de 80 cm de long, eau sur 3 cm de profondeur (la vague
       avance à √(g·h) ≈ 0,54 m/s), bande graduée collée en haut de la paroi avant, plage de mousse à droite (la vague
       n'y est pas réfléchie), bouchon de liège qui flotte au milieu, et cale en bois que l'on enfonce dans l'eau à
       gauche puis que l'on relâche : elle crée une perturbation de la surface qui se propage.
       Le bouchon monte puis redescend à sa place : il n'avance pas.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_vague(g) -> { pense_bete } ; fait « vague » = { source (cm, plus grande élévation créée), bouchon_dy (cm),
          bouchon_dx (cm), arrivee (vrai : la vague a atteint la plage), t_bouchon, t_plage (s après la perturbation) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const E = 1, X0 = 120, LONG = 0.8, SOL = 520, FOND = SOL - 6, H = 0.03, XB = 0.4;

  function cuve(g, avant) {
    // Parois de verre (arrière puis avant), plage de mousse ; l'eau est dessinée entre les deux.
    const l = LONG * 1000 * E, h = 90;
    L.ombre_sol(g, X0 + l / 2, SOL + 2, l / 2 + 10, 6, 0.35);
    L.svg("rect", { x: X0 - 6, y: SOL - h, width: l + 12, height: h, rx: 2, fill: "rgba(200,225,233,0.18)", stroke: "#8fb1bb" }, g);
    L.svg("path", { d: `M${X0 + l - 120} ${FOND} L${X0 + l} ${FOND - 40} V${FOND} Z`, fill: "#d8c38a", stroke: "#a7925a" }, g);
    L.svg("rect", { x: X0 - 6, y: SOL - h, width: l + 12, height: h, rx: 2, fill: "url(#verre)", opacity: 0.35, stroke: "#7fa3ad" }, avant);
    L.svg("rect", { x: X0 - 4, y: SOL - h + 2, width: l + 8, height: 13, fill: "#f6f1dc", opacity: 0.9, stroke: "#b8ab7a", "stroke-width": 0.5 }, avant);
    for (let i = 0; i <= 80; i++) L.svg("line", { x1: X0 + i * 10, y1: SOL - h + 2, x2: X0 + i * 10, y2: SOL - h + (i % 10 ? 5 : 8), stroke: "#3b3220", "stroke-width": 0.6 }, avant);
    for (let i = 0; i <= 8; i++) L.texte(avant, X0 + i * 100 + (i === 8 ? -8 : 8), SOL - h + 10, `${i * 10}`, { "font-size": 6.5, fill: "#3b3220" });
  }

  function eau(p, m) {
    // Surface de l'eau (élévations vraies, 1 px par mm) et volume d'eau jusqu'au fond.
    let d = `M${X0} ${FOND}`;
    for (let i = 0; i < m.n; i += 2) d += ` L${(X0 + i * m.dx * 1000 * E).toFixed(1)} ${(FOND - (H + m.y[i]) * 1000 * E).toFixed(1)}`;
    p.setAttribute("d", `${d} L${X0 + LONG * 1000 * E} ${FOND} Z`);
  }

  function bouchon(g, m) {
    // Bouchon de liège (2 cm) qui flotte à mi-hauteur, au point d'abscisse XB.
    g.replaceChildren();
    const x = X0 + XB * 1000 * E, y = FOND - (H + m.elongation(XB)) * 1000 * E;
    L.svg("rect", { x: x - 10, y: y - 10, width: 20, height: 18, rx: 3, fill: "#b8834c", stroke: "#7a5126" }, g);
    L.svg("ellipse", { cx: x, cy: y - 10, rx: 10, ry: 3, fill: "#d0a06a", stroke: "#7a5126", "stroke-width": 0.6 }, g);
  }

  function cale(g, etat) {
    // Cale en bois tenue au-dessus de l'eau, à gauche ; on l'enfonce (jusqu'au fond, 3 cm) et on la relâche.
    const c = L.svg("g", { class: "cale", role: "button", "aria-label": "Cale en bois" }, g);
    const dessiner = () => { c.replaceChildren(); const y = FOND - H * 1000 - 65 + etat.enfonce * 1000; L.svg("rect", { x: X0 + 8, y, width: 34, height: 60, rx: 3, fill: "url(#bois)", stroke: "#5b3b1c" }, c); L.svg("rect", { x: X0 - 10, y: y - 20, width: 70, height: 100, fill: "#000", opacity: 0 }, c); };
    L.glissable(c, { soulever: false, debut: () => { etat.tenue = true; return { x: X0 + 25, y: etat.enfonce * 1000 }; }, deplacer: (p) => { etat.enfonce = Math.max(0, Math.min(0.034, p.y / 1000)); }, lacher: () => { etat.tenue = false; } });
    return dessiner;
  }

  L.poste_vague = function (g) {
    // Cuve, eau animée, bouchon, cale (derrière la paroi avant de la cuve) ; la cale enfoncée de x soulève l'eau à gauche de x / 3,4 (au plus 1 cm).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), fond = L.svg("g", {}, g), p_eau = L.svg("path", { fill: "#7fb8d6", opacity: 0.55, stroke: "#4f8fb3" }, g);
    const g_b = L.svg("g", {}, g), g_cale = L.svg("g", {}, g), devant = L.svg("g", { "pointer-events": "none" }, g), etat = { enfonce: 0, tenue: false };
    cuve(fond, devant);
    const m = L.milieu_1d({ longueur: LONG, n: 161, v: Math.sqrt(9.81 * H), amortissement: 0.1, fin: "absorbante" });
    const dessiner_cale = cale(g_cale, etat), f = { source: 0, bouchon_dy: 0, bouchon_dx: 0, arrivee: false, t_bouchon: null, t_plage: null };
    let avant = null, note = "", t_debut = null;
    m.sur_pas((t) => {
      if (t_debut === null && Math.abs(m.y[0]) > 0.001) t_debut = t;
      if (t_debut !== null && f.t_bouchon === null && Math.abs(m.elongation(XB)) > 0.001) f.t_bouchon = Math.round((t - t_debut) * 100) / 100;
      if (t_debut !== null && f.t_plage === null && Math.abs(m.y[m.n - 3]) > 0.001) { f.t_plage = Math.round((t - t_debut) * 100) / 100; f.arrivee = true; }
    });
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000); avant = t;
      if (!etat.tenue) etat.enfonce *= Math.exp(-dt / 0.08);
      m.avancer(dt, () => Math.min(0.01, etat.enfonce / 3.4));
      f.source = Math.max(f.source, Math.round(m.y[0] * 1000) / 10); f.bouchon_dy = Math.max(f.bouchon_dy, Math.round(Math.abs(m.elongation(XB)) * 1000) / 10);
      eau(p_eau, m); bouchon(g_b, m); dessiner_cale();
      if (JSON.stringify(f) !== note) { note = JSON.stringify(f); L.missions.noter("vague", { ...f }); }
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    return { pense_bete };
  };
})(window.Labo);

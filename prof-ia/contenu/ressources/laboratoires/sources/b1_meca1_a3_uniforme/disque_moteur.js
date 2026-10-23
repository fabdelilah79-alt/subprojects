/*
Rôle : disque de 20 cm entraîné par un petit moteur électrique (vu de face, sur son support) : disque blanc gradué tous
       les 30°, un trait noir de repère, trois fentes (largeur 5 mm) à 4, 6 et 8 cm de l'axe. La fréquence de rotation suit la
       tension d'alimentation (0,8 tr/s par volt) avec un temps de mise en vitesse d'environ 1 s. En lumière ordinaire, le
       repère est flou dès que le disque tourne vite (l'œil mélange les positions) ; sous un stroboscope, on ne voit que
       les positions éclairées par les éclairs.
Reçoit : le groupe SVG et { x, y (axe), e (px/mm), sol }.
Produit : Labo.disque_moteur(g, reglage) -> m { theta (rad), omega (rad/s), U (V), f() (tr/s), regler(U), eclairs (liste
          d'angles à montrer, ou null), FENTES, R (mm) }.
Utilisé par : postes_uniforme.js.
*/
(function (L) {
  const R = 100, FENTES = [{ r: 40, a: 0 }, { r: 60, a: (2 * Math.PI) / 3 }, { r: 80, a: (4 * Math.PI) / 3 }], LARGEUR = 5, K = 0.8;

  function support(g, c, e, sol) {
    // Socle, montant, carter du moteur (derrière le disque) et son câble.
    L.svg("rect", { x: c.x - 70, y: sol - 16, width: 140, height: 16, rx: 3, fill: "#3a3f44", stroke: "#1b1e21" }, g);
    L.svg("rect", { x: c.x - 10, y: c.y, width: 20, height: sol - 16 - c.y, fill: "url(#acier)", stroke: "#1b1e21" }, g);
    L.svg("rect", { x: c.x - 26, y: c.y - 26, width: 52, height: 52, rx: 8, fill: "#2b3035", stroke: "#000" }, g);
    L.svg("path", { d: `M${c.x + 20} ${c.y + 18} C${c.x + 90} ${c.y + 40} ${c.x + 90} ${sol - 10} ${c.x + 170} ${sol - 30}`, fill: "none", stroke: "#1b1e21", "stroke-width": 3 }, g);
  }

  function face(g, c, e, a, opacite = 1) {
    // Le disque à l'angle a : fond blanc, graduations, fentes, trait de repère et point rouge.
    const r = R * e, p = (rr, aa) => ({ x: c.x + rr * e * Math.cos(aa), y: c.y + rr * e * Math.sin(aa) });
    const d = L.svg("g", { opacity: opacite }, g);
    for (let k = 0; k < 12; k++) { const u = p(R - 2, a + (k * Math.PI) / 6), v = p(R - 9, a + (k * Math.PI) / 6); L.svg("line", { x1: u.x, y1: u.y, x2: v.x, y2: v.y, stroke: "#555", "stroke-width": 1 }, d); }
    for (const f of FENTES) { const q = p(f.r, a + f.a); L.svg("rect", { x: q.x - (LARGEUR * e) / 2, y: q.y - 4 * e, width: LARGEUR * e, height: 8 * e, fill: "#20262b", transform: `rotate(${((a + f.a) * 180) / Math.PI + 90} ${q.x} ${q.y})` }, d); }
    const b = p(R - 4, a);
    L.svg("line", { x1: c.x, y1: c.y, x2: b.x, y2: b.y, stroke: "#111", "stroke-width": 4, "stroke-linecap": "round" }, d);
    L.svg("circle", { cx: b.x, cy: b.y, r: 4, fill: "#d0312d" }, d);
    return r;
  }

  function dessiner(g, m) {
    // Disque : net (au repos ou sous les éclairs), ou flou quand il tourne vite en lumière ordinaire.
    g.replaceChildren();
    const r = R * m.e;
    L.svg("circle", { cx: m.c.x, cy: m.c.y, r, fill: "#f7f7f2", stroke: "#8a8f94", "stroke-width": 2 }, g);
    const balayage = Math.abs(m.omega) / 60;
    if (m.eclairs) m.eclairs.forEach((a) => face(g, m.c, m.e, a));
    else if (balayage < 0.15) face(g, m.c, m.e, m.theta);
    else { const n = 8; for (let k = 0; k < n; k++) face(g, m.c, m.e, m.theta - (balayage * 3 * k) / n, 1.6 / n); }
    L.svg("circle", { cx: m.c.x, cy: m.c.y, r: 9, fill: "url(#metal)", stroke: "#333" }, g);
  }

  L.disque_moteur = function (g, { x, y, e = 1.4, sol }) {
    // Support, disque redessiné à chaque image ; la vitesse angulaire tend vers 2π × 0,8 × U.
    const m = { c: { x, y }, e, theta: -Math.PI / 2, omega: 0, U: 0, eclairs: null, FENTES, R, LARGEUR, t: 0 };
    support(L.svg("g", {}, g), m.c, e, sol);
    const disque = L.svg("g", { class: "disque", "pointer-events": "none" }, g);
    m.regler = (U) => { m.U = U; };
    m.f = () => m.omega / (2 * Math.PI);
    m.surveillants = [];
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000); avant = t;
      const cible = 2 * Math.PI * K * m.U;
      m.omega += (cible - m.omega) * (1 - Math.exp(-dt / 0.35)); m.theta += m.omega * dt; m.t += dt;
      m.surveillants.forEach((f) => f(dt));
      dessiner(disque, m);
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    return m;
  };
})(window.Labo);

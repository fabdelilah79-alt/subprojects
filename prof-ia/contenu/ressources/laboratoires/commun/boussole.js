/*
Rôle : boussole (aiguille aimantée sur pivot, dans un boîtier de laiton sous verre) posée sur une feuille : son aiguille
       s'oriente selon la composante horizontale du champ magnétique total, en oscillant un peu avant de s'arrêter ; le
       pôle nord de l'aiguille (rouge) indique le sens du champ. On peut la faire glisser sur la feuille.
Reçoit : le groupe SVG, le plan (plan_magnetique.js) et { x, y (m), rayon (m), champ(p) -> B, nom, fixe }.
Produit : Labo.boussole(g, plan, reglage) -> b { x, y, angle (rad, dans le plan), stable, tic(dt), dessiner() }.
Utilisé par : les postes des simulations de magnétisme.
*/
(function (L) {
  function aiguille(g, plan, b) {
    // Losange projeté : moitié nord rouge, moitié sud blanche ; pivot.
    const c = { x: b.x, y: b.y }, u = { x: Math.cos(b.angle), y: Math.sin(b.angle) }, w = { x: -u.y, y: u.x }, l = 0.85 * b.rayon, e = 0.14 * b.rayon;
    const P = (k, m) => plan.ecran({ x: c.x + k * l * u.x + m * e * w.x, y: c.y + k * l * u.y + m * e * w.y }), t = (pts) => pts.map((q) => `${q.x} ${q.y}`).join(" L");
    L.svg("path", { d: `M${t([P(1, 0), P(0, 1), P(0, -1)])} Z`, fill: "#d62d20", stroke: "#7a1712", "stroke-width": 0.5 }, g);
    L.svg("path", { d: `M${t([P(-1, 0), P(0, 1), P(0, -1)])} Z`, fill: "#f2f2ee", stroke: "#666", "stroke-width": 0.5 }, g);
    const o = plan.ecran(c);
    L.svg("circle", { cx: o.x, cy: o.y, r: 2, fill: "#c9a227", stroke: "#5b4a10", "stroke-width": 0.5 }, g);
  }

  L.boussole = function (g, plan, { x, y, rayon = 0.015, champ, nom = "", fixe = false }) {
    // Boîtier, aiguille (dynamique amortie), nom ; glisser déplace la boussole sur la feuille.
    const b = { x, y, rayon, angle: -Math.PI / 2, w: 0, stable: false, g: L.svg("g", { class: "boussole", role: "button", "aria-label": `Boussole ${nom}` }, g) };
    b.tic = (dt) => {
      // Couple de rappel vers la direction du champ horizontal (borné), frottement du pivot.
      const B = champ({ x: b.x, y: b.y, z: 0 }), Bh = Math.hypot(B.x, B.y);
      if (Bh < 1e-9) return;
      const phi = Math.atan2(B.y, B.x), k = 70 * Math.min(1, Bh / 3e-5 * 0.6 + 0.4);
      b.w += (-k * Math.sin(b.angle - phi) - 5 * b.w) * dt; b.angle += b.w * dt;
      b.stable = Math.abs(b.w) < 0.05 && Math.abs(Math.sin(b.angle - phi)) < 0.03;
    };
    b.dessiner = () => {
      b.g.replaceChildren();
      const o = plan.ecran(b), rx = rayon * plan.ex, ry = rayon * plan.ey;
      L.svg("ellipse", { cx: o.x + 2, cy: o.y + 4, rx: rx + 2, ry: ry + 2, fill: "#000", opacity: 0.25 }, b.g);
      L.svg("ellipse", { cx: o.x, cy: o.y, rx: rx + 2.5, ry: ry + 2.5, fill: "url(#laiton)", stroke: "#6b5512" }, b.g);
      L.svg("ellipse", { cx: o.x, cy: o.y, rx, ry, fill: "#f7f3e6", stroke: "#8a7a3a", "stroke-width": 0.6 }, b.g);
      aiguille(b.g, plan, b);
      L.svg("ellipse", { cx: o.x - rx * 0.3, cy: o.y - ry * 0.35, rx: rx * 0.45, ry: ry * 0.25, fill: "#fff", opacity: 0.35 }, b.g);
      if (nom) L.texte(b.g, o.x, o.y + ry + 9, nom, { "font-size": 8, "font-weight": 700, fill: "#333" });
    };
    if (!fixe) L.glissable(b.g, { soulever: false, debut: () => plan.ecran(b), deplacer: (p) => { Object.assign(b, plan.borner(plan.plan(p), rayon)); } });
    b.dessiner();
    return b;
  };
})(window.Labo);

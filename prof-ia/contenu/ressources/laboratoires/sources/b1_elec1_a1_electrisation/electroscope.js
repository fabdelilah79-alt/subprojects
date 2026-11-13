/*
Rôle : électroscope à feuilles d'or : plateau métallique relié par une tige à deux feuilles d'or dans une cage vitrée.
       Les feuilles portent la charge q_f = q + κ·q_b·f (q : charge de l'électroscope, q_b : charge de la baguette approchée,
       f : 0 à 1 selon la distance au plateau) ; elles s'écartent d'autant plus que |q_f| est grand. Au contact, la baguette
       cède une partie de sa charge ; le doigt posé sur le plateau relie l'électroscope à la Terre (les feuilles retombent :
       q = −κ·q_b·f). On fait glisser la main jusqu'au plateau, et on la retire.
Reçoit : le groupe SVG, la position { x, y } du plateau, la liste des baguettes (état de frottement.js).
Produit : Labo.electroscope(g, plateau, baguettes) -> e { q, alpha (°), tic(dt) } ; fait « electroscope » = { q, alpha,
          influence (baguette proche, sans contact), terre, contacts, charge_influence (signe obtenu par influence), vu_influence, retombe }.
Utilisé par : postes_electrisation.js.
*/
(function (L) {
  const KAPPA = 0.6, DEMI = 100, MAIN = { x: 820, y: 300 };

  function dessiner(c, P, alpha) {
    // Plateau, tige, bouchon isolant, cage vitrée et feuilles d'or écartées de alpha.
    L.svg("rect", { x: P.x - 60, y: P.y + 90, width: 120, height: 120, rx: 4, fill: "#5d666c", stroke: "#222" }, c);
    L.svg("rect", { x: P.x - 48, y: P.y + 100, width: 96, height: 96, rx: 3, fill: "url(#verre)", stroke: "#9fb6be" }, c);
    L.svg("rect", { x: P.x - 70, y: P.y + 210, width: 140, height: 10, rx: 2, fill: "#3a3f44" }, c);
    L.tige(c, `M${P.x} ${P.y} V${P.y + 130}`, 4);
    L.svg("rect", { x: P.x - 9, y: P.y + 82, width: 18, height: 16, rx: 3, fill: "#7a4b2a" }, c);
    L.svg("ellipse", { cx: P.x, cy: P.y, rx: 26, ry: 6, fill: "url(#metal)", stroke: "#555" }, c);
    const a = (alpha * Math.PI) / 180 / 2;
    for (const s of [-1, 1]) L.svg("path", { d: `M${P.x} ${P.y + 128} l${s * 46 * Math.sin(a)} ${46 * Math.cos(a)} l${s * 4} -2 Z`, fill: "#e8c14a", stroke: "#a88420", "stroke-width": 0.5 }, c);
  }

  function main(g, m) {
    // Main (doigt tendu) : à sa place, ou posée sur le plateau.
    const p = m.pos, gr = L.svg("g", { class: "main-terre", role: "button", "aria-label": "Doigt" }, g);
    L.svg("path", { d: `M${p.x} ${p.y} c8 -2 20 -2 30 2 l26 8 c6 2 6 10 0 12 l-30 0 c-10 6 -24 6 -30 -2 Z`, fill: "#e0b48c", stroke: "#8c6240" }, gr);
    L.svg("rect", { x: p.x - 10, y: p.y - 14, width: 76, height: 40, fill: "#000", opacity: 0.001 }, gr);
  }

  L.electroscope = function (g, P, baguettes) {
    // État, main déplaçable ; à chaque image : influence, contact, terre, angle des feuilles.
    const e = { q: 0, alpha: 0, contacts: 0, terre: false, influence: false, charge_influence: 0, sans_contact_depuis_terre: false, vu_influence: false, retombe: false };
    const m = { pos: { ...MAIN } }, c = L.svg("g", {}, g), cm = L.svg("g", {}, g);
    L.glissable(cm, { soulever: false, debut: () => ({ ...m.pos }), deplacer: (p) => { m.pos = p; }, lacher: (p) => { if (Math.hypot(p.x - P.x - 20, p.y - P.y) > 30) m.pos = { ...MAIN }; } });
    e.tic = () => {
      // Distance de la baguette la plus proche, transferts de charge, feuilles.
      e.terre = Math.hypot(m.pos.x - P.x - 20, m.pos.y - P.y) < 30;
      let qb = 0, f = 0;
      for (const b of baguettes) {
        if (!b.tenue && !b.pose_sur_etrier) continue;
        const x = Math.max(b.pos.x - DEMI, Math.min(b.pos.x + DEMI, P.x)), d = Math.hypot(x - P.x, b.pos.y - P.y);
        const k = Math.max(0, Math.min(1, (160 - d) / 130));
        if (k > f) { f = k; qb = b.q; }
        if (d < 14 && Math.abs(b.q - e.q) > 0.1) { const dq = 0.3 * (b.q - e.q); e.q += dq; b.q -= dq; e.contacts++; e.sans_contact_depuis_terre = false; }
      }
      if (e.terre) { e.q = -KAPPA * qb * f; e.sans_contact_depuis_terre = Math.abs(qb * f) > 0.5; }
      if (!e.terre && f < 0.05 && e.sans_contact_depuis_terre && Math.abs(e.q) > 0.3) e.charge_influence = Math.sign(e.q);
      e.influence = f > 0.3 && Math.abs(qb) > 0.5 && !e.contacts;
      if (e.influence && Math.abs(e.q) < 0.1) e.vu_influence = true;
      if (e.vu_influence && f < 0.05 && Math.abs(e.q) < 0.1) e.retombe = true;
      const qf = e.q + KAPPA * qb * f;
      e.alpha = Math.min(70, 16 * Math.abs(qf));
      c.replaceChildren(); cm.replaceChildren();
      dessiner(c, P, e.alpha); main(cm, m);
    };
    setInterval(() => L.missions.noter("electroscope", { q: Math.round(e.q * 100) / 100, alpha: Math.round(e.alpha), influence: e.influence, terre: e.terre, contacts: e.contacts, charge_influence: e.charge_influence, vu_influence: e.vu_influence, retombe: e.retombe }), 250);
    return e;
  };
})(window.Labo);

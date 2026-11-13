/*
Rôle : maquette de grande roue (32 cm de diamètre) posée sur la paillasse : roue à huit rayons tournant autour d'un axe
       horizontal fixe, huit nacelles suspendues à des pivots sur la jante (elles restent verticales : translation
       circulaire). Un segment rouge [AB] est peint sur un rayon, un segment bleu [CD] sur le plancher d'une nacelle.
       On fait tourner la roue en la poussant (glisser sur la roue) ou par sa manivelle ; lâchée, elle continue sur sa
       lancée et ralentit (frottement de l'axe).
Reçoit : le groupe SVG de la paillasse et { x, y (axe), R (px), sol }.
Produit : Labo.maquette_roue(g, reglage) -> { phi (rad), omega (rad/s), tourne_total (degrés), segments() -> { A, B, C, D } (px) }.
Utilisé par : poste_roue.js.
*/
(function (L) {
  const N = 8, RA = 0.25, RB = 0.94, COULEURS = ["#c0392b", "#2f6fb8", "#e1a21c", "#2f8a3c", "#8e44ad", "#d35400", "#16a085", "#7f8c8d"];

  function pied(g, c, R, sol) {
    // Deux pieds en tube d'acier, socle en bois, moyeu.
    L.svg("rect", { x: c.x - R * 0.9, y: sol - 12, width: R * 1.8, height: 12, rx: 3, fill: "url(#bois)", stroke: "#7a5730" }, g);
    for (const s of [-1, 1]) L.tige(g, `M${c.x} ${c.y} L${c.x + s * R * 0.62} ${sol - 12}`, 7);
  }

  function nacelle(g, p, k, avec_cd) {
    // Nacelle pendue à son pivot p : tige, toit, cabine, plancher (segment [CD] sur la nacelle 0).
    L.svg("line", { x1: p.x, y1: p.y, x2: p.x, y2: p.y + 12, stroke: "#555", "stroke-width": 2 }, g);
    L.svg("path", { d: `M${p.x - 20} ${p.y + 16} Q${p.x} ${p.y + 8} ${p.x + 20} ${p.y + 16} Z`, fill: COULEURS[k], stroke: "#333", "stroke-width": 0.8 }, g);
    L.svg("path", { d: `M${p.x - 17} ${p.y + 16} V${p.y + 34} Q${p.x} ${p.y + 40} ${p.x + 17} ${p.y + 34} V${p.y + 16}`, fill: "rgba(240,244,246,0.85)", stroke: "#333", "stroke-width": 0.8 }, g);
    L.svg("rect", { x: p.x - 17, y: p.y + 26, width: 34, height: 8, fill: COULEURS[k], opacity: 0.85 }, g);
    if (!avec_cd) return;
    L.svg("line", { x1: p.x - 15, y1: p.y + 37, x2: p.x + 15, y2: p.y + 37, stroke: "#1f5fa8", "stroke-width": 3, "stroke-linecap": "round" }, g);
    L.texte(g, p.x - 21, p.y + 41, "C", { "font-size": 9, "font-weight": 700, fill: "#1f5fa8" });
    L.texte(g, p.x + 21, p.y + 41, "D", { "font-size": 9, "font-weight": 700, fill: "#1f5fa8" });
  }

  function dessiner(g, m) {
    // Roue (jante double, rayons, segment [AB]), nacelles, manivelle.
    g.replaceChildren();
    const { c, R, phi } = m, pt = (r, a) => ({ x: c.x + r * Math.cos(a), y: c.y + r * Math.sin(a) });
    for (const r of [R, R * 0.93]) L.svg("circle", { cx: c.x, cy: c.y, r, fill: "none", stroke: "#b8c0c6", "stroke-width": r === R ? 5 : 2.5 }, g);
    for (let k = 0; k < N; k++) { const b = pt(R, phi + (k * 2 * Math.PI) / N); L.svg("line", { x1: c.x, y1: c.y, x2: b.x, y2: b.y, stroke: "#cfd5d9", "stroke-width": 2.5 }, g); }
    const A = pt(R * RA, phi), B = pt(R * RB, phi);
    L.svg("line", { x1: A.x, y1: A.y, x2: B.x, y2: B.y, stroke: "#c0392b", "stroke-width": 4, "stroke-linecap": "round" }, g);
    for (const [P, t] of [[A, "A"], [B, "B"]]) { L.svg("circle", { cx: P.x, cy: P.y, r: 3.2, fill: "#7b1d12" }, g); L.texte(g, P.x + 9 * Math.cos(phi + 1.2), P.y + 9 * Math.sin(phi + 1.2) + 3, t, { "font-size": 10, "font-weight": 700, fill: "#7b1d12" }); }
    for (let k = 0; k < N; k++) nacelle(g, pt(R, phi + (k * 2 * Math.PI) / N), k, k === 2);
    L.svg("circle", { cx: c.x, cy: c.y, r: 11, fill: "url(#metal)", stroke: "#555" }, g);
    const M = pt(44, phi + Math.PI);
    L.svg("line", { x1: c.x, y1: c.y, x2: M.x, y2: M.y, stroke: "#4a4f54", "stroke-width": 6, "stroke-linecap": "round" }, g);
    L.svg("circle", { cx: M.x, cy: M.y, r: 8, fill: "#1f2a30", stroke: "#000" }, g);
  }

  L.maquette_roue = function (g, { x, y, R = 160, sol }) {
    // Pieds, roue redessinée à chaque image où elle tourne ; on la pousse en glissant dessus.
    const m = { c: { x, y }, R, phi: -Math.PI / 2, omega: 0, tourne_total: 0 };
    pied(L.svg("g", {}, g), m.c, R, sol);
    const roue = L.svg("g", { class: "roue" }, g), zone = L.svg("circle", { cx: x, cy: y, r: R + 40, fill: "#000", opacity: 0, class: "zone-roue", role: "button", "aria-label": "Roue" }, g);
    let prise = null, avant = null;
    const angle = (q) => Math.atan2(q.y - y, q.x - x);
    L.glissable(zone, { soulever: false,
      debut: (ev) => { const q = L.scene.vers_scene(ev); prise = { a: angle(q), t: performance.now() }; m.omega = 0; return { x: 0, y: 0 }; },
      deplacer: (d, ev) => {
        const q = L.scene.vers_scene(ev), a = angle(q), t = performance.now();
        let da = a - prise.a; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI;
        m.phi += da; m.tourne_total += Math.abs((da * 180) / Math.PI); m.omega = 0.6 * m.omega + 0.4 * (da / Math.max(0.008, (t - prise.t) / 1000)); prise = { a, t };
      },
      lacher: () => { prise = null; }, toucher: () => { prise = null; } });
    const image = (t) => {
      // Sur sa lancée, la roue ralentit (frottement de l'axe, environ 6 s).
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000); avant = t;
      if (!prise && Math.abs(m.omega) > 0.01) { m.phi += m.omega * dt; m.tourne_total += Math.abs((m.omega * dt * 180) / Math.PI); m.omega *= Math.exp(-dt / 6); } else if (!prise) m.omega = 0;
      dessiner(roue, m);
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    m.segments = () => { const p = (r, a) => ({ x: x + r * Math.cos(a), y: y + r * Math.sin(a) }), P = p(R, m.phi + (2 * 2 * Math.PI) / N); return { A: p(R * RA, m.phi), B: p(R * RB, m.phi), C: { x: P.x - 15, y: P.y + 37 }, D: { x: P.x + 15, y: P.y + 37 } }; };
    return m;
  };
})(window.Labo);

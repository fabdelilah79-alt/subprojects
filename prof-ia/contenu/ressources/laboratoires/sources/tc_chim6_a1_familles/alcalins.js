/*
Rôle : réaction des métaux alcalins avec l'eau, dans un cristallisoir d'eau additionnée de phénolphtaléine :
       2 M + 2 H₂O → 2 M⁺ + 2 HO⁻ + H₂. Le grain de métal flotte et se déplace à la surface en dégageant du dihydrogène ; la
       solution devient basique (la phénolphtaléine rosit, d'abord là où passe le grain). Le lithium réagit doucement, le
       sodium fond en une petite boule qui file à la surface, le potassium s'enflamme aussitôt (flamme lilas). Les
       réactions sont de plus en plus vives en descendant la colonne.
Reçoit : le contexte de la paillasse, le cristallisoir (recipient_physique.js), le métal et une fonction appelée à la fin.
Produit : Labo.reaction_alcalin(ctx, cristallisoir, metal, fin) ; Labo.ALCALINS (durée, vitesse, flamme de chaque métal).
Utilisé par : poste_alcalins.js.
*/
(function (L) {
  const A = { Li: { duree: 22, v: 14, flamme: null, fond: false }, Na: { duree: 8, v: 95, flamme: null, fond: true }, K: { duree: 4, v: 150, flamme: "#c58cff", fond: true } };
  L.ALCALINS = A;
  L.TEINTES.rose_phenol = { aqueuse: [226, 40, 140], organique: [226, 40, 140] };

  function dessiner(g, s, cr) {
    // Grain (gris, ou boule argentée s'il a fondu), bulles, traînée rose, flamme éventuelle.
    g.replaceChildren();
    const y = cr.pose.y - cr.pr.hauteur_de(cr.c.volume()) * cr.pose.e;
    for (const t of s.trace) L.svg("ellipse", { cx: t.x, cy: y + 3, rx: 6 + t.age * 7, ry: 2 + t.age * 2.2, fill: "#e22a8c", opacity: Math.max(0, 0.45 - t.age * 0.12) }, g);
    if (s.reste <= 0) return;
    const r = 2 + 3.5 * Math.sqrt(s.reste);
    L.svg("ellipse", { cx: s.x, cy: y - r * 0.4, rx: r, ry: r * (A[s.metal].fond ? 0.9 : 0.6), fill: A[s.metal].fond ? "#e6ecef" : "#9aa1a6", stroke: "#5d646a", "stroke-width": 0.5 }, g);
    for (let i = 0; i < 4; i++) L.svg("circle", { cx: s.x + (Math.random() - 0.5) * 18, cy: y - 2 - Math.random() * 10, r: 1 + Math.random() * 1.5, fill: "none", stroke: "#fff", "stroke-width": 0.8 }, g);
    if (A[s.metal].flamme) L.svg("path", { d: `M${s.x - 6} ${y - 2} Q${s.x - 7} ${y - 14} ${s.x} ${y - 24 - Math.random() * 6} Q${s.x + 7} ${y - 14} ${s.x + 6} ${y - 2} Z`, fill: A[s.metal].flamme, opacity: 0.8 }, g);
  }

  L.reaction_alcalin = function (ctx, cr, metal, fin) {
    // Le grain glisse à la surface, rebondit sur la paroi, rapetisse ; la base formée colore la solution.
    const a = A[metal], R = cr.pr.r(cr.pr.H) * cr.pose.e - 8, s = { metal, reste: 1, x: cr.pose.x, vx: a.v * (Math.random() < 0.5 ? -1 : 1), trace: [], t: 0 };
    const g = L.svg("g", { "pointer-events": "none" }, ctx.objets);
    const pas = (dt) => {
      if (s.reste <= 0 && !s.trace.length) return;
      s.t += dt;
      if (s.reste > 0) {
        s.x += s.vx * dt;
        if (Math.abs(s.x - cr.pose.x) > R) { s.vx = -s.vx * (0.7 + Math.random() * 0.6); s.x = cr.pose.x + Math.sign(s.x - cr.pose.x) * R; }
        if (Math.random() < dt * 2) s.vx += (Math.random() - 0.5) * a.v;
        const d = Math.min(s.reste, dt / a.duree);
        s.reste -= d;
        const ph = cr.c.phases.find((p) => p.classe === "aqueuse");
        if (ph) ph.dissous.rose_phenol = (ph.dissous.rose_phenol || 0) + 6 * d;
        cr.sig = null;
        if (Math.random() < dt * 8) s.trace.push({ x: s.x, age: 0 });
        if (s.reste <= 0) fin();
      }
      s.trace.forEach((t) => { t.age += dt; });
      s.trace = s.trace.filter((t) => t.age < 4);
      dessiner(g, s, cr);
    };
    ctx.ecoulement.sur_pas(pas);
    return s;
  };
})(window.Labo);

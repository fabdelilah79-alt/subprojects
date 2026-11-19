/*
Rôle : baguette suspendue : un étrier pendu à un fil sous la potence ; une baguette posée dessus peut tourner autour du fil
       (vue un peu d'en haut). Une baguette électrisée approchée de l'une de ses extrémités l'attire ou la repousse
       (force de Coulomb entre les extrémités), et la baguette suspendue tourne.
Reçoit : le groupe SVG ; le point d'attache (px) ; les baguettes (état de frottement.js).
Produit : Labo.etrier(groupe, attache, baguettes) -> { deposer(b) (vrai si b est posée sur l'étrier) } ;
          fait noté « interactions » = { "<suspendue>_<approchée>" : "attraction" | "repulsion" }.
Utilisé par : poste_etrier.js.
*/
(function (L) {
  const DEMI = 100, K = 60, AMORTI = 1.6, TORSION = 0.12, PROFONDEUR = 0.32;

  function bouts(c, phi) {
    // Extrémités de la baguette suspendue (vue de dessus : x, z).
    return [1, -1].map((s) => ({ x: c.x + s * DEMI * Math.cos(phi), z: s * DEMI * Math.sin(phi) }));
  }

  function couple(e, b) {
    // Moment exercé sur la baguette suspendue par une baguette approchée (tenue juste devant elle, z = −25 px, au bon niveau).
    const s = e.suspendue;
    if (Math.abs(b.pos.y - e.y) > 40 || Math.abs(b.q) < 0.3) return 0;
    let tau = 0;
    for (const E of bouts(e.c, e.phi)) {
      const T = { x: Math.max(b.pos.x - DEMI, Math.min(b.pos.x + DEMI, E.x)), z: -25 }, d = { x: E.x - T.x, z: E.z - T.z }, n = Math.max(18, Math.hypot(d.x, d.z));
      const f = (K * (s.q / 2) * b.q) / (n * n * n);
      tau += (E.x - e.c.x) * (f * d.z) - (E.z) * (f * d.x);
    }
    return tau / 100;
  }

  function dessiner(e) {
    // Fil, étrier, et la baguette suspendue (son extrémité lointaine paraît plus haute et plus fine).
    const g = e.calque, [A, B] = bouts(e.c, e.phi), ecran = (P) => ({ x: P.x, y: e.y - P.z * PROFONDEUR });
    g.replaceChildren();
    L.svg("line", { x1: e.c.x, y1: e.attache.y, x2: e.c.x, y2: e.y - 10, stroke: "#c8b48a", "stroke-width": 1 }, g);
    L.svg("path", { d: `M${e.c.x - 9} ${e.y - 10} V${e.y + 4} H${e.c.x + 9} V${e.y - 10} Z`, fill: "none", stroke: "url(#metal)", "stroke-width": 1.6 }, g);
    if (!e.suspendue) return;
    const a = ecran(A), b = ecran(B);
    L.svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: e.suspendue.matiere === "verre" ? "#b8d6dd" : "#5c656b", "stroke-width": 12, "stroke-linecap": "round" }, g);
    L.svg("path", { d: `M${e.c.x - 9} ${e.y - 2} V${e.y + 4} H${e.c.x + 9} V${e.y - 2}`, fill: "none", stroke: "url(#metal)", "stroke-width": 1.6 }, g);
  }

  function noter(e, b, c) {
    // Rotation nette (depuis l'arrivée de cette baguette) dans le sens de son moment : on note attraction ou répulsion.
    if (!c) { delete e.depart[b.id]; return; }
    if (e.depart[b.id] === undefined) e.depart[b.id] = e.phi;
    const tour = e.phi - e.depart[b.id];
    if (Math.abs(tour) < 0.17 || Math.sign(tour) !== Math.sign(c) || Math.abs(b.q) < 0.5 || Math.abs(e.suspendue.q) < 0.5) return;
    e.vues[`${e.suspendue.matiere}_${b.matiere}`] = e.suspendue.q * b.q > 0 ? "repulsion" : "attraction";
    L.missions.noter("interactions", { ...e.vues });
  }

  L.etrier = function (g, attache, baguettes) {
    // Construit l'étrier ; boucle : moments des baguettes approchées, rotation amortie.
    const e = { attache, c: { x: attache.x }, y: attache.y + 200, phi: 0, omega: 0, suspendue: null, vues: {}, depart: {}, calque: L.svg("g", {}, g) };
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000);
      avant = t;
      if (e.suspendue) {
        let tau = 0;
        for (const b of baguettes) if (b !== e.suspendue) { const c = couple(e, b); tau += c; noter(e, b, c); }
        e.omega += (tau - TORSION * e.phi - AMORTI * e.omega) * dt;
        e.phi = Math.max(-1.4, Math.min(1.4, e.phi + e.omega * dt));
      }
      dessiner(e);
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    return {
      deposer: (b) => {
        // Une baguette lâchée près de l'étrier y est posée (elle ne se reprend plus à la main).
        if (e.suspendue || Math.hypot(b.pos.x - e.c.x, b.pos.y - e.y) > 50) return false;
        Object.assign(e, { suspendue: b, phi: 0, omega: 0 });
        b.pose_sur_etrier = true;
        b.g.style.display = "none";
        L.missions.noter("suspendue", { matiere: b.matiere, q: Math.round(b.q * 100) / 100 });
        return true;
      },
    };
  };
})(window.Labo);

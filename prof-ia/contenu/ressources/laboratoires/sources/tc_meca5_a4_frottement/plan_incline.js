/*
Rôle : plan inclinable : planche articulée à gauche sur la paillasse, posée sur la noix d'une tige verticale ; on l'incline
       en faisant monter la noix le long de la tige. Un rapporteur fixé à la charnière donne l'angle θ. Un pavé posé sur la planche
       reste immobile tant que tan θ ≤ k (coefficient de frottement statique) ; au-delà, il glisse jusqu'à la butée.
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève (noix, pavés).
Produit : Labo.plan_incline(groupe) ; faits notés : pave_sur_plan (matière ou null), glissement = { <matière>: angle (°) }.
Utilisé par : simulation.js (paillasse 1).
*/
(function (L) {
  const A = { x: 210, y: 470 }, LONGUEUR = 520, TIGE = 300, MAX = (50 * Math.PI) / 180, PX_PAR_M = 600, REPOS = { bois: 640, caoutchouc: 750 };

  function rapporteur(g) {
    // Quart de rapporteur à la charnière : un trait par degré, un nombre tous les 10°.
    for (let d = 0; d <= 60; d++) {
      const a = (d * Math.PI) / 180, r1 = 150, r2 = d % 10 === 0 ? 138 : d % 5 === 0 ? 142 : 145;
      L.svg("line", { x1: A.x + Math.cos(a) * r1, y1: A.y - Math.sin(a) * r1, x2: A.x + Math.cos(a) * r2, y2: A.y - Math.sin(a) * r2, stroke: "#1f4d78", "stroke-width": d % 10 ? 0.4 : 0.8 }, g);
      if (d % 10 === 0) L.texte(g, A.x + Math.cos(a) * 128, A.y - Math.sin(a) * 128, `${d}°`, { "font-size": 8, fill: "#1f4d78" });
    }
    L.svg("path", { d: `M${A.x} ${A.y} L${A.x + 152} ${A.y} A152 152 0 0 0 ${A.x + 152 * Math.cos(1.05)} ${A.y - 152 * Math.sin(1.05)} Z`, fill: "#dbeeff", opacity: 0.35, stroke: "#4a7fb0", "stroke-width": 0.6 }, g);
  }

  function planche(g, theta) {
    // Tige verticale et noix (barre d'appui) ; la planche épaisse repose sur la noix ; butée en bas, charnière.
    const u = { x: Math.cos(theta), y: -Math.sin(theta) }, n = { x: Math.sin(theta), y: Math.cos(theta) }, B = { x: A.x + u.x * LONGUEUR, y: A.y + u.y * LONGUEUR };
    const noix = { x: A.x + TIGE, y: A.y + 14 / Math.cos(theta) - TIGE * Math.tan(theta) };
    L.tige(g, `M${noix.x + 12} ${A.y + 24} V${A.y - TIGE * Math.tan(MAX) - 10}`, 6);
    L.svg("rect", { x: noix.x - 6, y: noix.y, width: 26, height: 14, rx: 3, fill: "url(#acier)", stroke: "#3b3f44", "stroke-width": 0.6 }, g);
    L.svg("path", { d: `M${A.x} ${A.y} L${B.x} ${B.y} L${B.x + n.x * 14} ${B.y + n.y * 14} L${A.x + n.x * 14} ${A.y + n.y * 14} Z`, fill: "url(#bois)", stroke: "#6b4a2a" }, g);
    L.svg("path", { d: `M${A.x + u.x * 18} ${A.y + u.y * 18} l${-n.x * 22} ${-n.y * 22}`, stroke: "#5b3d22", "stroke-width": 6 }, g);
    L.svg("circle", { cx: A.x, cy: A.y + 7, r: 5, fill: "#3b3f44" }, g);
    return { u, B, noix };
  }

  L.plan_incline = function (g) {
    // Construit le plan, ses gestes et le mouvement du pavé (pas de 2 ms).
    rapporteur(g);
    const e = { theta: 0, pave: null, s: 0, v: 0, glisse: false, angles: {} }, plan = L.svg("g", {}, g), paves = L.svg("g", {}, g);
    const dessiner = () => {
      plan.replaceChildren(); paves.replaceChildren();
      const { u, noix } = planche(plan, e.theta);
      L.svg("rect", { x: noix.x - 16, y: noix.y - 12, width: 46, height: 38, fill: "#000", opacity: 0.001, class: "noix" }, plan);
      for (const m of Object.keys(L.PAVES)) {
        const sur = e.pave === m, p = sur ? { x: A.x + u.x * e.s, y: A.y + u.y * e.s } : e.tenu && e.tenu.m === m ? e.tenu.p : { x: REPOS[m], y: 560 };
        L.dessiner_pave(paves, p, sur ? e.theta : 0, m);
      }
    };
    L.plan_gestes(g, plan, paves, e, { A, LONGUEUR, TIGE, MAX, dessiner });
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000);
      avant = t;
      if (e.pave && !e.tenu) L.plan_glisser(e, dt, PX_PAR_M);
      dessiner();
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
  };
})(window.Labo);

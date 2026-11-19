/*
Rôle : pendule de torsion : un fil d'acier tendu perpendiculairement au panneau porte un tambour (rayon 3 cm) et une aiguille
       devant un cadran gradué. Deux fils enroulés sur le tambour (en haut vers la gauche, en bas vers la droite) passent sur
       des poulies et portent des porte-masses : ils exercent un couple. À l'équilibre, le couple de torsion du fil
       (M = −C·θ) l'équilibre : θ = (F1 + F2)·r / C.
Reçoit : le groupe SVG de la paillasse ; la constante de torsion C (N·m/rad) ; les gestes de l'élève (masses à fente).
Produit : Labo.torsion(groupe, C) ; faits notés : « torsion » = { m1, m2 (kg, porte-masses compris), theta (°) } à chaque changement,
          « torsion_mesures » = [{ m, theta }] pour les configurations à masses égales.
Utilisé par : simulation.js.
*/
(function (L) {
  const G = 9.81, C0 = { x: 512, y: 230 }, R_TAMBOUR = 24, R_M = 0.03, PL = { x: 250, y: 218 }, PR = { x: 774, y: 266 }, POULIE = 12;
  const FENTES = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.02, 0.02, 0.02, 0.02].map((m, i) => ({ m, id: i, sur: null }));

  function cadran(g) {
    // Panneau, cadran gradué au degré (nombres tous les 30°), chape du fil de torsion et poulies.
    L.svg("rect", { x: 200, y: 60, width: 624, height: 330, rx: 4, fill: "#fbfbf8", stroke: "#b9bdb5", filter: "url(#ombre)" }, g);
    L.svg("circle", { cx: C0.x, cy: C0.y, r: 120, fill: "#f4f1e8", stroke: "#8d8a80" }, g);
    for (let d = 0; d < 360; d++) {
      const a = (d * Math.PI) / 180, l = d % 10 === 0 ? 10 : d % 5 === 0 ? 7 : 3.5;
      L.svg("line", { x1: C0.x + Math.sin(a) * 120, y1: C0.y - Math.cos(a) * 120, x2: C0.x + Math.sin(a) * (120 - l), y2: C0.y - Math.cos(a) * (120 - l), stroke: "#333", "stroke-width": d % 10 ? 0.35 : 0.7 }, g);
      if (d % 30 === 0) L.texte(g, C0.x + Math.sin(a) * 102, C0.y - Math.cos(a) * 102, String(d > 180 ? d - 360 : d), { "font-size": 9, fill: "#333" });
    }
    L.tige(g, `M${C0.x - 150} ${C0.y + 150} L${C0.x - 14} ${C0.y + 14}`, 6);
    for (const P of [PL, PR]) {
      L.svg("circle", { cx: P.x, cy: P.y, r: POULIE + 2, fill: "url(#metal)", stroke: "#3b3f44" }, g);
      L.svg("circle", { cx: P.x, cy: P.y, r: 3, fill: "#2a2e33" }, g);
    }
    L.svg("path", { d: "M330 456 H560 L568 470 H322 Z", fill: "url(#bois)" }, g);
    L.texte(g, 445, 486, "Masses à fente", { class: "etiquette-carton", "font-size": 14, fill: "#f3e3c7" });
  }

  function fente(g, x, y, f) {
    // Petit disque de laiton fendu (10 g ou 20 g).
    const e = f.m > 0.015 ? 6 : 4, gr = L.svg("g", { class: "masse-fente", "data-fente": f.id }, g);
    L.svg("rect", { x: x - 10, y, width: 20, height: e, fill: "url(#laiton)" }, gr);
    L.svg("ellipse", { cx: x, cy: y, rx: 10, ry: 2.5, fill: "url(#laiton-haut)", stroke: "#a77d24", "stroke-width": 0.5 }, gr);
    L.texte(gr, x, y + e / 2 + 1, `${f.m * 1000}`, { "font-size": 4, fill: "#4a370b" });
  }

  function porte_masses(g, x, y, n) {
    // Porte-masses de 10 g et ses masses à fente ; renvoie le haut de la pile.
    const gr = L.svg("g", { class: "porte-masses", "data-fil": n }, g);
    L.tige(gr, `M${x} ${y} V${y + 40}`, 2.5);
    L.svg("ellipse", { cx: x, cy: y + 42, rx: 10, ry: 3, fill: "url(#acier)", stroke: "#3b3f44", "stroke-width": 0.6 }, gr);
    let h = y + 38;
    for (const f of FENTES.filter((x) => x.sur === n)) { h -= f.m > 0.015 ? 6 : 4; fente(gr, x, h, f); }
  }

  function dessiner(g, e) {
    // Fils (enroulés sur le tambour), tambour, aiguille tournée de θ, porte-masses, masses restées sur le plateau.
    g.replaceChildren();
    const fil = { stroke: "#5b4a33", "stroke-width": 1.1, fill: "none" }, h = 380;
    L.svg("path", { d: `M${C0.x} ${C0.y - R_TAMBOUR} H${PL.x} M${PL.x - POULIE} ${PL.y} V${h - 40}`, ...fil }, g);
    L.svg("path", { d: `M${C0.x} ${C0.y + R_TAMBOUR} H${PR.x} M${PR.x + POULIE} ${PR.y} V${h - 40}`, ...fil }, g);
    L.svg("circle", { cx: C0.x, cy: C0.y, r: R_TAMBOUR, fill: "url(#acier)", stroke: "#1b1f22" }, g);
    const a = e.theta;
    L.svg("path", { d: `M${C0.x - Math.sin(a) * 18} ${C0.y + Math.cos(a) * 18} L${C0.x + Math.sin(a) * 112} ${C0.y - Math.cos(a) * 112}`, stroke: "#d32f2f", "stroke-width": 2, "stroke-linecap": "round" }, g);
    L.svg("circle", { cx: C0.x, cy: C0.y, r: 4, fill: "#d9dcdf", stroke: "#1b1f22" }, g);
    porte_masses(g, PL.x - POULIE, h - 40, 1);
    porte_masses(g, PR.x + POULIE, h - 40, 2);
    FENTES.forEach((f, k) => { if (f.sur === null && !f.en_main) fente(g, 342 + k * 22, 452, f); });
  }

  L.torsion = function (g, C) {
    // Construit le pendule ; l'aiguille tourne doucement vers l'angle d'équilibre.
    cadran(g);
    const calque = L.svg("g", {}, g), e = { theta: 0, cible: 0 }, mesures = [];
    const maj = () => {
      const m = [1, 2].map((n) => 0.01 + FENTES.filter((f) => f.sur === n).reduce((s, f) => s + f.m, 0));
      e.cible = ((m[0] + m[1]) * G * R_M) / C;
      const t = { m1: Math.round(m[0] * 1000) / 1000, m2: Math.round(m[1] * 1000) / 1000, theta: Math.round((e.cible * 180) / Math.PI * 10) / 10 };
      L.missions.noter("torsion", t);
      if (t.m1 === t.m2 && !mesures.some((x) => x.m === t.m1)) { mesures.push({ m: t.m1, theta: t.theta }); L.missions.noter("torsion_mesures", mesures.map((x) => ({ ...x }))); }
    };
    L.torsion_gestes(calque, FENTES, maj, e, dessiner);
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000);
      avant = t;
      e.theta += (e.cible - e.theta) * Math.min(1, dt * 3);
      if (!e.prise) dessiner(calque, e);
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    maj();
  };
  L.torsion.fente = fente;
})(window.Labo);

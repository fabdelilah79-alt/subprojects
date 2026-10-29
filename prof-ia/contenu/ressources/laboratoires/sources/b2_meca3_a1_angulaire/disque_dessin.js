/*
Rôle : dessin du disque en rotation vu de face (échelle 600 px/m) : socle et colonne, palier de l'axe horizontal, frein à
       patin, règle de 60 cm sur son pied, tapis de mousse ; disque d'aluminium (R = 10 cm) avec son repère blanc M à 8 cm de
       l'axe, tambour (r = 2 cm), fil enroulé et masse marquée de 200 g ; et l'image k de la vidéo filmée par la caméra.
Reçoit : le groupe SVG ; l'abscisse angulaire θ du disque (rad, sens trigonométrique), la descente de la masse (m).
Produit : Labo.disque_dessin = { fond(g), disque(g, theta), masse(g, h, posee), video(id, theta_k, n, th0 (angle quand la masse est en haut)), C, PX } ;
          video(...) suit le format de pointage_video.js (champ filmé 0,40 m × 0,30 m, axe en (0,20 ; 0,15)).
Utilisé par : poste_disque.js.
*/
(function (L) {
  const C = { x: 360, y: 190 }, PX = 600, R = 0.1, RM = 0.08, RT = 0.02, REGLE = 271, HAUT = 154, Y0 = 266, CHUTE = 0.4;

  function fond(g) {
    // Règle verticale (0 en haut) sur son pied, socle et colonne, palier, frein à patin, tapis de mousse sous la masse.
    L.ombre_sol(g, REGLE + 4, 530, 26, 4, 0.35);
    L.svg("path", { d: `M${REGLE - 22} 522 h44 l4 8 h-52 Z`, fill: "#3b4046", stroke: "#1e2226" }, g);
    L.svg("rect", { x: REGLE - 9, y: HAUT - 6, width: 18, height: 0.6 * PX + 10, fill: "#f3e7c9", stroke: "#a88b55" }, g);
    for (let cm = 0; cm <= 60; cm++) { const y = HAUT + (cm / 100) * PX, l = cm % 10 === 0 ? 9 : cm % 5 === 0 ? 6 : 3; L.svg("line", { x1: REGLE + 9, y1: y, x2: REGLE + 9 - l, y2: y, stroke: "#2b2416", "stroke-width": cm % 10 ? 0.35 : 0.7 }, g); if (cm % 10 === 0) L.texte(g, REGLE - 3, y + 2.5, String(cm), { "font-size": 6, fill: "#2b2416" }); }
    L.ombre_sol(g, C.x + 30, 536, 66, 7, 0.4);
    L.svg("path", { d: `M${C.x - 26} 520 h110 l8 14 h-126 Z`, fill: "#3b4046", stroke: "#1e2226" }, g);
    L.tige(g, `M${C.x} 522 V${C.y - 86}`, 9);
    L.svg("rect", { x: C.x - 12, y: C.y - 14, width: 24, height: 28, rx: 3, fill: "#555c63", stroke: "#2a2e33" }, g);
    L.tige(g, `M${C.x} ${C.y - 80} H${C.x - 14} V${C.y - R * PX - 6}`, 4);
    L.svg("rect", { x: C.x - 24, y: C.y - R * PX - 16, width: 20, height: 12, rx: 2, fill: "#b8562b", stroke: "#5a2a14" }, g);
    L.ombre_sol(g, C.x - 12, 552, 26, 4, 0.35);
    L.svg("rect", { x: C.x - 34, y: 540, width: 44, height: 12, rx: 3, fill: "#e8c547", stroke: "#a3861d" }, g);
  }

  function disque(g, th) {
    // Disque (tranche sombre décalée, face claire), quatre vis, rayon peint, repère M, tambour et son fil enroulé.
    g.replaceChildren();
    const r = R * PX, p = (rr, a) => ({ x: C.x + rr * PX * Math.cos(a), y: C.y - rr * PX * Math.sin(a) });
    L.svg("circle", { cx: C.x + 3, cy: C.y + 3, r, fill: "#5b6268" }, g);
    L.svg("circle", { cx: C.x, cy: C.y, r, fill: "url(#metal)", stroke: "#4a5056", "stroke-width": 1.2 }, g);
    L.svg("circle", { cx: C.x, cy: C.y, r: r - 5, fill: "none", stroke: "#ffffff", opacity: 0.25 }, g);
    for (let i = 0; i < 4; i++) { const q = p(0.035, th + 0.4 + (i * Math.PI) / 2); L.svg("circle", { cx: q.x, cy: q.y, r: 2, fill: "#3b3f44" }, g); }
    const b = p(R - 0.004, th), m = p(RM, th);
    L.svg("line", { x1: C.x, y1: C.y, x2: b.x, y2: b.y, stroke: "#1d2430", "stroke-width": 1.4 }, g);
    L.svg("circle", { cx: m.x, cy: m.y, r: 4.5, fill: "#ffffff", stroke: "#1d2430" }, g);
    L.svg("circle", { cx: m.x, cy: m.y, r: 1.2, fill: "#1d2430" }, g);
    L.texte(g, m.x + 8 * Math.cos(th + 0.6), m.y - 8 * Math.sin(th + 0.6) + 2.5, "M", { "font-size": 7, "font-weight": 700, fill: "#1d2430" });
    L.svg("circle", { cx: C.x, cy: C.y, r: RT * PX, fill: "#8a6a3d", stroke: "#4a3520" }, g);
    L.svg("circle", { cx: C.x, cy: C.y, r: RT * PX - 3, fill: "none", stroke: "#e9e2cf", "stroke-width": 2 }, g);
    L.svg("circle", { cx: C.x, cy: C.y, r: 3, fill: "#c0c4c8", stroke: "#444" }, g);
  }

  function masse(g, h, posee) {
    // Fil tendu du côté gauche du tambour jusqu'au crochet ; masse posée sur la mousse : fil mou.
    g.replaceChildren();
    const x = C.x - RT * PX, y = Y0 + Math.min(h, CHUTE) * PX;
    if (posee) L.svg("path", { d: `M${x} ${C.y} C${x - 2} ${C.y + 120} ${x - 30} ${y - 40} ${x} ${y}`, fill: "none", stroke: "#7d735c", "stroke-width": 1.2 }, g);
    else L.svg("line", { x1: x, y1: C.y, x2: x, y2: y, stroke: "#7d735c", "stroke-width": 1.2 }, g);
    L.svg("path", { d: `M${x} ${y} v6`, stroke: "url(#metal)", "stroke-width": 2 }, g);
    L.svg("rect", { x: x - 11, y: y + 6, width: 22, height: 28, rx: 2, fill: "url(#laiton)", stroke: "#6d4a0e" }, g);
    L.texte(g, x, y + 23, "200 g", { "font-size": 6, "font-weight": 700, fill: "#3b2a05" });
  }

  function video(id, theta_k, n, th0) {
    // Vidéo : règle, colonne, disque et repère M de l'image k, haut de la masse tant qu'elle est dans le champ.
    const O = { x: 0.2, y: 0.15 };
    return { id, fps: 25, n, largeur_m: 0.4, hauteur_m: 0.3, etalon: { a: { x: 0.052, y: 0.21 }, b: { x: 0.052, y: 0.01 }, longueur_m: 0.2 },
      objet: (k) => ({ x: O.x + RM * Math.cos(theta_k(k)), y: O.y + RM * Math.sin(theta_k(k)) }),
      dessiner(gv, k, m) {
        const a = m(0, 0), b = m(0.4, 0.3), o = m(O.x, O.y), s = (v) => v * (a.y - b.y) / 0.3, th = theta_k(k);
        L.svg("rect", { x: a.x, y: b.y, width: b.x - a.x, height: a.y - b.y, fill: "#3a3f44" }, gv);
        const r1 = m(0.044, 0.22), r2 = m(0.06, 0); L.svg("rect", { x: r1.x, y: r1.y, width: r2.x - r1.x, height: r2.y - r1.y, fill: "#efe3c4" }, gv);
        for (let cm = 0; cm <= 21; cm++) { const p = m(0.06, 0.21 - cm / 100); L.svg("line", { x1: p.x, y1: p.y, x2: p.x - (cm % 5 ? 2 : 4), y2: p.y, stroke: "#222", "stroke-width": 0.5 }, gv); if (cm % 10 === 0) L.texte(gv, p.x - 7, p.y + 2, String(cm), { "font-size": 4.5, fill: "#222" }); }
        L.svg("rect", { x: o.x - s(0.008), y: o.y, width: s(0.016), height: a.y - o.y, fill: "#7d858c" }, gv);
        L.svg("line", { x1: o.x - s(RT), y1: o.y, x2: o.x - s(RT), y2: a.y, stroke: "#e9e2cf", "stroke-width": 0.6 }, gv);
        L.svg("circle", { cx: o.x, cy: o.y, r: s(R), fill: "#c3c9ce", stroke: "#4a5056", "stroke-width": 0.6 }, gv);
        L.svg("line", { x1: o.x, y1: o.y, x2: o.x + s(R) * Math.cos(th), y2: o.y - s(R) * Math.sin(th), stroke: "#1d2430", "stroke-width": 0.8 }, gv);
        const hm = Math.min(CHUTE, RT * (th - th0)), cm = m(O.x - RT - 0.018, O.y - (Y0 + 6 - C.y) / PX - hm);
        if (cm.y > b.y && cm.y < a.y) L.svg("rect", { x: cm.x, y: cm.y, width: s(0.036), height: Math.min(s(0.047), a.y - cm.y), fill: "#c9a24a" }, gv);
        L.svg("circle", { cx: o.x, cy: o.y, r: s(RT), fill: "#8a6a3d" }, gv);
        L.svg("circle", { cx: o.x + s(RM) * Math.cos(th), cy: o.y - s(RM) * Math.sin(th), r: 2.4, fill: "#ffffff", stroke: "#111", "stroke-width": 0.5 }, gv);
      } };
  }

  L.disque_dessin = { fond, disque, masse, video, C, PX };
})(window.Labo);

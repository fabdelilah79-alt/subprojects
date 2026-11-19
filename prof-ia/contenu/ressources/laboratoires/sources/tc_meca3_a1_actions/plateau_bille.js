/*
Rôle : plateau horizontal (70 cm × 40 cm) vu en perspective, avec son cadre de bois garni de feutre, et la gouttière
       inclinée d'où part la bille d'acier ; conversions entre le plateau (mm) et l'écran.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.Plateau : dessiner(g) ; vers_ecran(x, y) ; vers_plateau(p) ; sur_gouttiere(s) (s de 0 en haut à 1 en bas) ;
          P (dimensions) ; dessiner_bille(g, p, rayon_px).
Utilisé par : objets_plateau.js, bille.js, poste_bille.js.
*/
(function (L) {
  const P = { l: 700, h: 400, loin: 330, pres: 520, l_loin: 560, l_pres: 682, cx: 560, ligne: 200 };
  const HAUT = { x: 178, y: 290 };

  function vers_ecran(x, y) {
    // Point du plateau (mm) -> point de l'écran (le bord du fond paraît plus étroit).
    const v = y / P.h, w = P.l_loin + (P.l_pres - P.l_loin) * v;
    return { x: P.cx + (x / P.l - 0.5) * w, y: P.loin + (P.pres - P.loin) * v, k: w / P.l };
  }

  function vers_plateau(p) {
    // Point de l'écran -> point du plateau (mm).
    const v = (p.y - P.loin) / (P.pres - P.loin), w = P.l_loin + (P.l_pres - P.l_loin) * v;
    return { x: ((p.x - P.cx) / w + 0.5) * P.l, y: v * P.h };
  }

  function sur_gouttiere(s) {
    // Point de la gouttière à l'écran : s = 0 en haut, s = 1 à l'entrée du plateau.
    const bas = vers_ecran(0, P.ligne);
    return { x: HAUT.x + (bas.x - HAUT.x) * s, y: HAUT.y + (bas.y - HAUT.y) * s };
  }

  function gouttiere(g) {
    // Gouttière en aluminium (profil en U) tenue en haut par une potence ; une butée retient la bille au départ.
    const bas = sur_gouttiere(1), haut = sur_gouttiere(0);
    L.tige(g, `M${haut.x - 6} ${haut.y + 8} V${P.pres + 30}`, 6);
    L.svg("rect", { x: haut.x - 30, y: P.pres + 28, width: 48, height: 10, rx: 2, fill: "url(#acier)" }, g);
    L.svg("path", { d: `M${haut.x - 8} ${haut.y - 6} L${bas.x} ${bas.y - 6} L${bas.x} ${bas.y + 8} L${haut.x - 8} ${haut.y + 8} Z`, fill: "url(#metal)", stroke: "#5d666d" }, g);
    L.svg("path", { d: `M${haut.x - 8} ${haut.y - 1} L${bas.x} ${bas.y - 1} L${bas.x} ${bas.y + 3} L${haut.x - 8} ${haut.y + 3} Z`, fill: "#4a5258" }, g);
    L.svg("rect", { x: haut.x - 16, y: haut.y - 14, width: 9, height: 26, rx: 2, fill: "#3b3f44" }, g);
  }

  function dessiner(g) {
    // Pieds, cadre de bois, bande de feutre vert sur les bords, plateau clair ; ligne pointillée de lancement.
    const c = [vers_ecran(0, 0), vers_ecran(P.l, 0), vers_ecran(P.l, P.h), vers_ecran(0, P.h)];
    L.ombre_sol(g, P.cx + 10, P.pres + 36, 400, 12, 0.45);
    for (const x of [c[3].x + 16, c[2].x - 16]) L.svg("rect", { x: x - 6, y: P.pres + 12, width: 12, height: 22, fill: "url(#bois-face)" }, g);
    L.svg("path", { d: `M${c[0].x - 14} ${c[0].y - 9} L${c[1].x + 14} ${c[1].y - 9} L${c[2].x + 18} ${c[2].y + 7} L${c[3].x - 18} ${c[3].y + 7} Z`, fill: "url(#bois)", stroke: "#7b5530" }, g);
    L.svg("rect", { x: c[3].x - 18, y: c[3].y + 7, width: c[2].x - c[3].x + 36, height: 12, fill: "url(#bois-face)" }, g);
    L.svg("path", { d: `M${c[0].x - 6} ${c[0].y - 4} L${c[1].x + 6} ${c[1].y - 4} L${c[2].x + 8} ${c[2].y + 3} L${c[3].x - 8} ${c[3].y + 3} Z`, fill: "#2f6b3f" }, g);
    L.svg("path", { d: `M${c[0].x} ${c[0].y} L${c[1].x} ${c[1].y} L${c[2].x} ${c[2].y} L${c[3].x} ${c[3].y} Z`, fill: "#e9e4d6", stroke: "#c8c0aa" }, g);
    for (let x = 100; x < P.l; x += 100) {
      const a = vers_ecran(x, 0), b = vers_ecran(x, P.h);
      L.svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "#d8d1bd", "stroke-width": 0.8 }, g);
    }
    gouttiere(g);
  }

  function dessiner_bille(g, p, r) {
    // Bille d'acier : ombre portée, sphère brillante (dégradé radial), petit reflet.
    if (!g.ownerSVGElement.querySelector("#bille-acier")) {
      const d = L.svg("radialGradient", { id: "bille-acier", cx: 0.35, cy: 0.3, r: 0.75 }, g.ownerSVGElement.querySelector("defs"));
      for (const [o, c] of [[0, "#ffffff"], [0.25, "#c9d0d5"], [0.7, "#5d666d"], [1, "#22282d"]]) L.svg("stop", { offset: o, "stop-color": c }, d);
    }
    L.svg("ellipse", { cx: p.x + r * 0.4, cy: p.y + r * 0.85, rx: r * 1.1, ry: r * 0.4, fill: "#000", opacity: 0.3 }, g);
    L.svg("circle", { cx: p.x, cy: p.y, r, fill: "url(#bille-acier)", stroke: "#1b1f22", "stroke-width": 0.6 }, g);
  }

  L.Plateau = { P, dessiner, vers_ecran, vers_plateau, sur_gouttiere, dessiner_bille };
})(window.Labo);

/*
Rôle : paillasse « travail de la force d'un ressort » : banc à coussin d'air, mobile relié au ressort vert (K = 20 N/m) ; un
       dynamomètre de traction (calibre 2 N) est accroché au mobile et son anneau pend au crochet d'une noix que l'on fait
       coulisser sur une tige horizontale (montant posé sur la paillasse) : la noix reste où on la lâche (vis serrée). À
       l'équilibre, F = K·x ; l'index du mobile donne l'allongement x sur une règle graduée de 0 à 10 cm.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_travail(g) -> { pense_bete } ; fait « traction » = { x (m), F (N), xmax (m) }.
Utilisé par : simulation.js (paillasse 1).
*/
(function (L) {
  const K = 20, REG = { calibre: 2, px_n: 30, corps: 150, corde: 18, pas: 0.1 }, POTEAU = 700, Y_TIGE = 432;

  function support(g, D) {
    // Montant sur son socle, tige horizontale, règle de l'allongement (0 à 10 cm) fixée au rail par deux pattes.
    L.ombre_sol(g, POTEAU, D.TABLE + 2, 30, 4, 0.35);
    L.svg("path", { d: `M${POTEAU - 26} ${D.TABLE - 6} h52 l4 8 h-60 Z`, fill: "#3b4046", stroke: "#1e2226" }, g);
    L.tige(g, `M${POTEAU} ${D.TABLE - 6} V${Y_TIGE - 10}`, 7);
    L.svg("rect", { x: POTEAU - 9, y: Y_TIGE - 7, width: 18, height: 14, rx: 2, fill: "url(#acier)", stroke: "#333" }, g);
    L.tige(g, `M${POTEAU} ${Y_TIGE} H470`, 4);
    const x0 = D.X_EQ + D.LONG / 2, y = D.HAUT + 16;
    for (const dx of [-6, 44]) L.svg("rect", { x: x0 + dx, y: D.HAUT + 11, width: 4, height: 6, fill: "#3b4046" }, g);
    L.svg("rect", { x: x0 - 8, y, width: 56, height: 10, fill: "#f3e7c9", stroke: "#a88b55", "stroke-width": 0.6 }, g);
    for (let mm = 0; mm <= 100; mm += 5) { const x = x0 + mm * D.MM; L.svg("line", { x1: x, y1: y + 10, x2: x, y2: y + 10 - (mm % 10 ? 2 : mm % 50 ? 3.5 : 5), stroke: "#2b2416", "stroke-width": 0.4 }, g); if (mm % 20 === 0) L.texte(g, x, y + 5, String(mm / 10), { "font-size": 4.5, fill: "#2b2416" }); }
    L.texte(g, x0 + 52, y + 8, "cm", { "font-size": 4.5, fill: "#2b2416", "text-anchor": "start" });
  }

  function noix(g, xn) {
    // Noix de serrage sur la tige (vis moletée), petite tige verticale et crochet où pend l'anneau du dynamomètre.
    g.replaceChildren();
    L.tige(g, `M${xn} ${Y_TIGE} V${Y_TIGE + 30}`, 3);
    L.svg("rect", { x: xn - 8, y: Y_TIGE - 7, width: 16, height: 14, rx: 2, fill: "url(#acier)", stroke: "#333" }, g);
    L.svg("rect", { x: xn - 2.5, y: Y_TIGE - 13, width: 5, height: 6, rx: 1, fill: "#2a2e33" }, g);
    L.svg("path", { d: `M${xn} ${Y_TIGE + 30} v6 a3 3 0 1 1 -5 2`, fill: "none", stroke: "url(#metal)", "stroke-width": 2, "stroke-linecap": "round" }, g);
    L.svg("rect", { x: xn - 14, y: Y_TIGE - 16, width: 28, height: 30, fill: "#000", opacity: 0.001 }, g);
  }

  L.poste_travail = function (g) {
    // Banc (sans capteur), support et noix, dynamomètre ; l'allongement se calcule à chaque déplacement de la noix.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), D = L.banc_ressort_dessin, px = 1000 * D.MM;
    const banc = L.banc_ressort(g, { k: K, capteur: false });
    support(g, D);
    const gd = L.svg("g", {}, g), gn = L.svg("g", { class: "noix", role: "button", "aria-label": "Noix" }, g), e = { xn: 600, x: 0, F: 0, xmax: 0 };
    const regler = () => {
      // Équilibre : l'anneau est au crochet de la noix ; x = 0 tant que la cordelette est lâche.
      const libre = D.X_EQ + D.LONG + REG.corde + REG.corps + 5, x = Math.max(0, (e.xn - libre) / (px + K * REG.px_n));
      Object.assign(e, { x, F: K * x, xmax: Math.max(e.xmax, x) }); Object.assign(banc.e, { x, v: 0, tenu: true });
      gd.replaceChildren(); L.svg("line", { x1: D.X_EQ + D.LONG / 2 + x * px, y1: D.HAUT + 8, x2: D.X_EQ + D.LONG / 2 + x * px, y2: D.HAUT + 21, stroke: "#c62828", "stroke-width": 1 }, gd); L.dynamometre_traction(gd, { x: D.X_EQ + D.LONG + x * px + 2, y: D.HAUT - 14 }, { x: e.xn - 3, y: Y_TIGE + 40 }, REG);
      noix(gn, e.xn); L.missions.noter("traction", { x: Math.round(x * 10000) / 10000, F: Math.round(e.F * 1000) / 1000, xmax: Math.round(e.xmax * 1000) / 1000 });
    };
    L.glissable(gn, { soulever: false, debut: () => ({ x: e.xn, y: Y_TIGE }), deplacer: (p) => { e.xn = Math.max(560, Math.min(665, p.x)); regler(); } });
    setInterval(() => { banc.e.tenu = true; banc.e.x = e.x; banc.e.v = 0; }, 50);
    regler();
    return { pense_bete };
  };
})(window.Labo);

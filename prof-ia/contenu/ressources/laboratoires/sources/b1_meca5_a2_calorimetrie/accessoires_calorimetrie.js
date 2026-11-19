/*
Rôle : accessoires des paillasses de calorimétrie : (1) cylindre de métal inconnu (100,0 g) suspendu par un fil dans un
       bécher d'eau bouillante (100 °C) sur une plaque chauffante ; on le fait glisser par son fil jusqu'au calorimètre
       pour l'y plonger ; (2) coupelle de glaçons (glace fondante à 0 °C, essuyée) posée sur une balance tarée ; on la vide
       dans le calorimètre.
Reçoit : le groupe SVG, le calorimètre (vase_dessin), une fonction appelée à l'ajout.
Produit : Labo.metal_bouillant(g, vase, plonger(m, c, theta)) -> { remettre(), dessiner() } ;
          Labo.glacons_balance(g, vase, verser(m)) -> { remettre(), dessiner(), masse }.
Utilisé par : postes_calorimetrie.js.
*/
(function (L) {
  const BAIN = { x: 660, base: 556 };

  L.metal_bouillant = function (g, vase, plonger) {
    // Plaque chauffante, bécher d'eau qui bout, potence et cylindre suspendu ; glisser le fil jusqu'au calorimètre.
    L.svg("rect", { x: BAIN.x - 50, y: BAIN.base - 18, width: 100, height: 18, rx: 3, fill: "#3a3f44" }, g);
    L.svg("circle", { cx: BAIN.x + 38, cy: BAIN.base - 9, r: 3, fill: "#ff3b30" }, g);
    L.tige(g, `M${BAIN.x + 70} ${BAIN.base} V${BAIN.base - 230}`, 6);
    L.tige(g, `M${BAIN.x + 70} ${BAIN.base - 222} H${BAIN.x}`, 4);
    const c = L.svg("g", { class: "metal-fil" }, g), m = { tenu: null, plonge: false };
    m.dessiner = () => {
      // Bécher d'eau bouillante (bulles), cylindre au bout de son fil, ou dans la main ; rien s'il est dans le calorimètre.
      c.replaceChildren();
      L.svg("rect", { x: BAIN.x - 40, y: BAIN.base - 18 - 110, width: 80, height: 110, rx: 4, fill: "url(#verre)", stroke: "#9fb6be" }, c);
      L.svg("rect", { x: BAIN.x - 37, y: BAIN.base - 18 - 80, width: 74, height: 78, fill: "#7fb8d6", opacity: 0.6 }, c);
      for (let k = 0; k < 6; k++) L.svg("circle", { cx: BAIN.x - 25 + ((k * 17 + Date.now() / 40) % 50), cy: BAIN.base - 30 - ((k * 23 + Date.now() / 12) % 60), r: 2.5, fill: "none", stroke: "#fff", "stroke-width": 0.8 }, c);
      if (m.plonge) return;
      const p = m.tenu || { x: BAIN.x, y: BAIN.base - 222 }, bas = p.y + (m.tenu ? 80 : 160);
      L.svg("path", { d: `M${p.x} ${p.y} V${bas - 90}`, stroke: "#e9e4d2", "stroke-width": 1.2 }, c);
      L.svg("rect", { x: p.x - 15, y: bas - 90, width: 30, height: 90, rx: 3, fill: "url(#metal)", stroke: "#555" }, c);
      L.svg("circle", { cx: p.x, cy: p.y, r: 14, fill: "#000", opacity: 0.001 }, c);
    };
    L.glissable(c, {
      soulever: false,
      debut: () => (m.plonge ? null : { x: BAIN.x, y: BAIN.base - 222 }),
      deplacer: (p) => { m.tenu = p; },
      lacher: (p) => { m.tenu = null; if (vase.dans({ x: p.x, y: p.y + 80 })) { m.plonge = true; plonger(100, 900, 100); } },
    });
    m.remettre = () => { m.plonge = false; m.tenu = null; };
    return m;
  };

  L.glacons_balance = function (g, vase, verser) {
    // Balance tarée et coupelle de glaçons ; la masse de glace change un peu à chaque remise en place.
    L.svg("rect", { x: 610, y: 520, width: 110, height: 36, rx: 5, fill: "#e4e7ea", stroke: "#7a858c" }, g);
    L.svg("rect", { x: 626, y: 532, width: 78, height: 18, rx: 2, fill: "#1d2a22" }, g);
    L.svg("ellipse", { cx: 665, cy: 518, rx: 44, ry: 6, fill: "url(#metal)", stroke: "#666" }, g);
    const c = L.svg("g", { class: "coupelle-glace" }, g), q = { tenu: null, masse: 0, videe: false };
    q.remettre = () => { q.videe = false; q.tenu = null; q.masse = Math.round((26 + Math.random() * 8) * 10) / 10; };
    q.dessiner = () => {
      // Coupelle (pleine ou vide), glaçons, affichage de la balance.
      c.replaceChildren();
      const p = q.tenu || { x: 665, y: 512 };
      L.svg("path", { d: `M${p.x - 34} ${p.y - 12} Q${p.x} ${p.y + 8} ${p.x + 34} ${p.y - 12} Z`, fill: "#c8ccd0", stroke: "#666" }, c);
      if (!q.videe) for (let k = 0; k < 5; k++) L.svg("rect", { x: p.x - 24 + k * 10, y: p.y - 22 - (k % 2) * 5, width: 10, height: 9, rx: 1.5, fill: "#f2fbff", stroke: "#a7c9d8", "stroke-width": 0.6 }, c);
      L.texte(c, 665, 545, q.tenu ? "- - - -" : `${(q.videe ? 0 : q.masse).toFixed(1).replace(".", ",")} g`, { "font-size": 10, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
    };
    L.glissable(c, {
      soulever: false,
      debut: () => (q.videe ? null : { x: 665, y: 512 }),
      deplacer: (p) => { q.tenu = p; },
      lacher: (p) => { q.tenu = null; if (vase.dans({ x: p.x, y: p.y + 40 })) { q.videe = true; verser(q.masse); } },
    });
    q.remettre();
    return q;
  };
})(window.Labo);

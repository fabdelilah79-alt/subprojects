/*
Rôle : dessin du dispositif de rotation vu de face (échelle 400 px/m) : socle et colonne, palier de l'axe horizontal et
       frein électromagnétique, tige d'aluminium (48 cm) portant deux masselottes de 150 g, tambour (r = 2,5 cm), fil et
       porte-masse à disques fendus de 50 g ; règle de 60 cm (0 au niveau du plateau du porte-masse au départ), cellule
       photoélectrique à 50 cm, mousse posée sur le socle ; coffret des disques.
Reçoit : le groupe SVG ; l'angle de la tige (rad, sens des aiguilles d'une montre), la distance d des masselottes (m),
         la descente de la masse (m), le nombre de disques sur le porte-masse.
Produit : Labo.tige_dessin = { fond(g), cellule(g), tige(g, phi, d), masse(g, h, disques, posee), coffret(g, libres), C, PX,
          Y_CELLULE } (coffret renvoie les groupes des disques libres, pour les rendre touchables).
Utilisé par : poste_tige.js.
*/
(function (L) {
  const C = { x: 420, y: 150 }, PX = 400, RT = 0.025, CROCHET = 246, BAS0 = 278, H = 0.5, MOUSSE = 0.55, REGLE = 476;
  const Y_CELLULE = BAS0 + H * PX;

  function fond(g) {
    // Socle, colonne, palier et frein, règle sur son pied, mousse posée sur le socle.
    L.ombre_sol(g, 392, 526, 72, 7, 0.4);
    L.svg("path", { d: "M334 510 h120 l8 14 h-136 Z", fill: "#3b4046", stroke: "#1e2226" }, g);
    L.tige(g, `M${C.x} 512 V${C.y - 34}`, 9);
    L.svg("rect", { x: C.x - 14, y: C.y - 40, width: 28, height: 16, rx: 3, fill: "#b8562b", stroke: "#5a2a14" }, g);
    L.svg("rect", { x: C.x - 12, y: C.y - 16, width: 24, height: 32, rx: 3, fill: "#555c63", stroke: "#2a2e33" }, g);
    L.ombre_sol(g, REGLE + 8, 528, 22, 4, 0.35);
    L.svg("path", { d: `M${REGLE - 12} 520 h40 l4 8 h-48 Z`, fill: "#3b4046", stroke: "#1e2226" }, g);
    L.svg("rect", { x: REGLE, y: BAS0 - 6, width: 16, height: 0.6 * PX + 8, fill: "#f3e7c9", stroke: "#a88b55" }, g);
    for (let cm = 0; cm <= 60; cm++) { const y = BAS0 + (cm / 100) * PX, l = cm % 10 === 0 ? 8 : cm % 5 === 0 ? 5 : 2.5; L.svg("line", { x1: REGLE, y1: y, x2: REGLE + l, y2: y, stroke: "#2b2416", "stroke-width": cm % 10 ? 0.35 : 0.7 }, g); if (cm % 10 === 0) L.texte(g, REGLE + 12, y + 2.3, String(cm), { "font-size": 5.5, fill: "#2b2416" }); }
    L.svg("rect", { x: C.x - 6, y: BAS0 + MOUSSE * PX, width: 36, height: 12, rx: 3, fill: "#e8c547", stroke: "#a3861d" }, g);
  }

  function cellule(g) {
    // Fourche optique à 50 cm : bras derrière le passage, émetteur à gauche, récepteur fixé à la règle, faisceau.
    const y = Y_CELLULE;
    L.svg("rect", { x: 398, y: y - 3, width: REGLE - 398, height: 6, fill: "#2c3238" }, g);
    L.svg("line", { x1: 410, y1: y, x2: 456, y2: y, stroke: "#ff3b30", "stroke-width": 0.8, "stroke-dasharray": "2 2", opacity: 0.8 }, g);
    for (const x of [398, 456]) L.svg("rect", { x, y: y - 9, width: 14, height: 18, rx: 2, fill: "#1f2a30", stroke: "#000", "stroke-width": 0.6 }, g);
    L.svg("circle", { cx: 405, cy: y - 4, r: 2, fill: "#ff3b30" }, g);
  }

  function tige(g, phi, d) {
    // Tambour (derrière la tige, fil enroulé), puis tige et masselottes tournées de phi autour de l'axe.
    g.replaceChildren();
    L.svg("circle", { cx: C.x, cy: C.y, r: RT * PX, fill: "#8a6a3d", stroke: "#4a3520" }, g);
    L.svg("circle", { cx: C.x, cy: C.y, r: RT * PX - 2.5, fill: "none", stroke: "#cfc6ab", "stroke-width": 2 }, g);
    const t = L.svg("g", { transform: `rotate(${(phi * 180) / Math.PI} ${C.x} ${C.y})` }, g);
    L.svg("rect", { x: C.x - 0.24 * PX, y: C.y - 3.5, width: 0.48 * PX, height: 7, rx: 3.5, fill: "url(#metal-h)", stroke: "#5c646b" }, t);
    for (const s of [-1, 1]) {
      const x = C.x + s * d * PX;
      L.svg("rect", { x: x - 7, y: C.y - 13, width: 14, height: 26, rx: 3, fill: "url(#laiton)", stroke: "#6d4a0e", class: "masselotte" }, t);
      L.svg("circle", { cx: x, cy: C.y - 9, r: 1.6, fill: "#3b2a05" }, t);
    }
    L.svg("circle", { cx: C.x, cy: C.y, r: 4, fill: "#c0c4c8", stroke: "#444" }, t);
  }

  function masse(g, h, disques, posee) {
    // Fil depuis le côté droit du tambour ; porte-masse (crochet, tige, plateau) et disques fendus empilés.
    g.replaceChildren();
    const x = C.x + RT * PX, y = CROCHET + Math.min(h, MOUSSE) * PX;
    if (posee) L.svg("path", { d: `M${x} ${C.y} C${x + 2} ${C.y + 120} ${x + 26} ${y - 40} ${x} ${y}`, fill: "none", stroke: "#7d735c", "stroke-width": 1.2 }, g);
    else L.svg("line", { x1: x, y1: C.y, x2: x, y2: y, stroke: "#7d735c", "stroke-width": 1.2 }, g);
    const pm = L.svg("g", { class: "porte-masse", role: "button", "aria-label": "Porte-masse" }, g);
    L.svg("path", { d: `M${x} ${y + 6} a3 3 0 1 1 3 -3`, fill: "none", stroke: "#4a5056", "stroke-width": 1.6 }, pm);
    L.svg("rect", { x: x - 1.8, y: y + 5, width: 3.6, height: 24, fill: "#8d949a", stroke: "#4a5056", "stroke-width": 0.6 }, pm);
    L.svg("rect", { x: x - 13, y: y + 27, width: 26, height: 5, rx: 1, fill: "#9aa1a7", stroke: "#3b4046" }, pm);
    for (let i = 0; i < disques; i++) L.svg("rect", { x: x - 12, y: y + 23 - i * 5, width: 24, height: 5, rx: 1, fill: "url(#laiton)", stroke: "#6d4a0e", "stroke-width": 0.6 }, pm);
    L.svg("rect", { x: x - 14, y: y - 2, width: 28, height: 36, fill: "#000", opacity: 0.001 }, pm);
    return pm;
  }

  function coffret(g, libres) {
    // Coffret en bois posé sur la paillasse, disques fendus encore disponibles (50 g chacun).
    g.replaceChildren();
    L.ombre_sol(g, 262, 556, 66, 6, 0.35);
    L.svg("path", { d: "M200 530 h124 l6 20 h-136 Z", fill: "url(#bois-face)", stroke: "#6b4a2a" }, g);
    L.texte(g, 262, 562, "disques fendus 50 g", { "font-size": 6.5, fill: "#f4f1e6" });
    return [...Array(libres).keys()].map((i) => {
      const d = L.svg("g", { class: `disque-${i}`, role: "button", "aria-label": "Disque de 50 g" }, g);
      L.svg("ellipse", { cx: 222 + i * 26, cy: 538, rx: 11, ry: 5, fill: "url(#laiton)", stroke: "#6d4a0e" }, d);
      L.svg("rect", { x: 220 + i * 26, y: 533, width: 4, height: 5, fill: "#5a3d10" }, d);
      return d;
    });
  }

  L.tige_dessin = { fond, cellule, tige, masse, coffret, C, PX, Y_CELLULE };
})(window.Labo);

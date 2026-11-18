/*
Rôle : prototype « titrage en 2,5D » : appareils réalistes en volume (trois faces, lumière d'en haut à gauche) : potence
       (socle lourd, tige chromée, noix et pince), agitateur magnétique (plateau blanc, boutons, voyant), pH-mètre (afficheur,
       touches, bras porte-électrode, électrode et câble), pissette, flacon ambré étiqueté.
Reçoit : le groupe SVG et la position de chaque appareil (x, y : coin avant gauche du pied, ou milieu du pied).
Produit : P.boite(g, x, y, l, h, p, couleurs), P.potence(g, …), P.agitateur(g, …) -> { plateau }, P.ph_metre(g, …) -> { ecran },
          P.electrode(g, …), P.pissette(g, x, y), P.flacon(g, x, y).
Utilisé par : prototype.html (proposition ; aucun laboratoire n'est modifié).
*/
(function (P) {
  const el = P.el;

  P.boite = function (g, x, y, l, h, p, [face, dessus, cote]) {
    // Boîte posée : face avant, dessus (plus clair), côté droit (plus sombre), arêtes arrondies par un reflet.
    const dx = p * 0.55, dy = p * P.K * 2.2;
    P.ombre(g, x + l / 2 + dx / 2, y - dy / 2, l / 2 + dx / 2, dy / 2 + 6);
    el("path", { d: `M${x} ${y - h} l${dx} ${-dy} h${l} l${-dx} ${dy} z`, fill: dessus }, g);
    el("path", { d: `M${x + l} ${y} l${dx} ${-dy} v${-h} l${-dx} ${dy} z`, fill: cote }, g);
    el("rect", { x, y: y - h, width: l, height: h, fill: face }, g);
    el("path", { d: `M${x} ${y - h} h${l} l${dx} ${-dy}`, stroke: "#ffffff", "stroke-width": 1.2, opacity: 0.55, fill: "none" }, g);
    return { dx, dy };
  };

  P.potence = function (g, x, y) {
    // Socle de fonte gris (x, y : coin avant gauche), tige chromée, noix et pince à burette.
    const b = el("g", { class: "potence" }, g);
    P.boite(b, x, y, 170, 16, 60, ["#4a545b", "#6c7880", "#2f363b"]);
    el("rect", { x: x + 40, y: 70, width: 11, height: y - 40 - 70, fill: "url(#chrome)" }, b);
    el("ellipse", { cx: x + 45.5, cy: 70, rx: 5.5, ry: 2, fill: "#e9eef1" }, b);
    el("rect", { x: x + 34, y: 156, width: 24, height: 22, rx: 3, fill: "url(#acier-sombre)" }, b);
    el("circle", { cx: x + 30, cy: 167, r: 5, fill: "url(#bouton-noir)" }, b);
    el("rect", { x: x + 58, y: 162, width: 112, height: 8, rx: 3, fill: "url(#chrome)" }, b);
    el("path", { d: `M${x + 166} 156 h16 a6 6 0 0 1 0 22 h-16 z`, fill: "#e64a19", stroke: "#8c2a0c" }, b);
  };

  P.agitateur = function (g, x, y) {
    // Agitateur magnétique : boîtier blanc cassé, plateau de céramique blanche, deux boutons noirs, voyant vert.
    const b = el("g", { class: "agitateur" }, g), { dx, dy } = P.boite(b, x, y, 150, 50, 46, ["#eef1f3", "#ffffff", "#b9c3ca"]);
    el("path", { d: `M${x + 10} ${y - 54} l${dx * 0.9} ${-dy * 0.9} h126 l${-dx * 0.9} ${dy * 0.9} z`, fill: "#f6f7f2", stroke: "#cfd6db" }, b);
    for (const [cx, nom] of [[x + 40, "VITESSE"], [x + 110, "CHAUFFE"]]) {
      el("circle", { cx, cy: y - 22, r: 11, fill: "url(#bouton-noir)" }, b);
      el("rect", { x: cx - 1.5, y: y - 31, width: 3, height: 8, rx: 1.5, fill: "#ffffff" }, b);
      el("text", { x: cx, y: y - 4, "text-anchor": "middle", "font-family": "system-ui", "font-size": 6.5, "font-weight": 700, fill: "#5a6670" }, b).textContent = nom;
    }
    el("circle", { cx: x + 75, cy: y - 26, r: 3.6, fill: "url(#voyant)" }, b);
    return { plateau: { x: x + 75 + dx * 0.45, y: y - 52 - dy * 0.45 } };
  };

  P.ph_metre = function (g, x, y) {
    // pH-mètre de paillasse bleu : écran à cristaux liquides, touches, prise de l'électrode, bras porte-électrode.
    const b = el("g", { class: "ph-metre" }, g);
    P.boite(b, x, y, 128, 70, 40, ["#1976d2", "#42a5f5", "#0d47a1"]);
    el("rect", { x: x + 12, y: y - 62, width: 104, height: 34, rx: 4, fill: "#0b2545" }, b);
    el("rect", { x: x + 15, y: y - 59, width: 98, height: 28, rx: 2, fill: "url(#lcd)" }, b);
    const ecran = el("text", { x: x + 108, y: y - 37, "text-anchor": "end", "font-family": "monospace", "font-size": 21, "font-weight": 700, fill: "#14301a" }, b);
    el("text", { x: x + 20, y: y - 49, "font-family": "system-ui", "font-size": 8, "font-weight": 700, fill: "#14301a" }, b).textContent = "pH";
    ["#ffd166", "#ffffff", "#ffffff"].forEach((c, i) => el("rect", { x: x + 14 + i * 36, y: y - 20, width: 28, height: 11, rx: 3, fill: c, stroke: "#0d3c7a" }, b));
    el("rect", { x: x + 20, y: y - 150, width: 7, height: 82, fill: "url(#chrome)" }, b);
    return { ecran, bras: { x: x + 23, y: y - 150 } };
  };

  P.electrode = function (g, bras, x, haut, surface, bas) {
    // Bras horizontal jusqu'au bécher, électrode de verre (partie plongée : décalée et élargie, comme réfractée), câble noir.
    const b = el("g", { class: "electrode" }, g);
    el("rect", { x, y: bras.y - 4, width: bras.x - x + 4, height: 8, rx: 3, fill: "url(#chrome)" }, b);
    el("rect", { x: x - 9, y: bras.y - 8, width: 18, height: 16, rx: 3, fill: "url(#acier-sombre)" }, b);
    el("path", { d: `M${x} ${bras.y - 8} C${x} ${bras.y - 40} ${bras.x + 60} ${bras.y - 50} ${bras.x + 70} ${bras.y + 70}`, stroke: "#1c1f22", "stroke-width": 3, fill: "none" }, b);
    el("rect", { x: x - 6, y: haut, width: 12, height: surface - haut, rx: 2, fill: "#263238" }, b);
    el("rect", { x: x - 6, y: haut + 4, width: 12, height: 6, fill: "#ffd166" }, b);
    el("rect", { x: x - 5, y: surface, width: 12, height: bas - surface - 6, fill: "#37474f" }, b);
    el("ellipse", { cx: x + 1, cy: bas - 6, rx: 7, ry: 7, fill: "#e0f2f1", stroke: "#78909c" }, b);
    el("rect", { x: x - 6, y: surface, width: 14, height: bas - surface + 2, fill: "#e91e63", opacity: 0.35 }, b);
    el("rect", { x: x - 4, y: haut + 6, width: 2, height: surface - haut - 12, fill: "#ffffff", opacity: 0.35 }, b);
  };

  P.pissette = function (g, x, y) {
    // Pissette d'eau distillée : flacon souple translucide, bouchon et tube coudé, étiquette « Eau ».
    const b = el("g", { class: "pissette" }, g);
    P.ombre(b, x, y, 30);
    el("path", { d: `M${x - 30} ${y} V${y - 74} Q${x - 30} ${y - 92} ${x - 12} ${y - 96} H${x + 12} Q${x + 30} ${y - 92} ${x + 30} ${y - 74} V${y} A30 ${30 * P.K} 0 0 1 ${x - 30} ${y} Z`, fill: "url(#pissette)", stroke: "#9fb6c3" }, b);
    el("rect", { x: x - 30, y: y - 50, width: 60, height: 44, fill: "#a7d8f0", opacity: 0.45 }, b);
    el("rect", { x: x - 11, y: y - 108, width: 22, height: 14, rx: 3, fill: "#ef476f" }, b);
    el("path", { d: `M${x} ${y - 108} V${y - 128} Q${x} ${y - 138} ${x + 14} ${y - 138} L${x + 44} ${y - 132}`, stroke: "#dfe8ee", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, b);
    el("rect", { x: x - 20, y: y - 70, width: 40, height: 18, rx: 3, fill: "#ffffff" }, b);
    el("text", { x, y: y - 58, "text-anchor": "middle", "font-family": "system-ui", "font-size": 9, "font-weight": 700, fill: "#1976d2" }, b).textContent = "Eau";
  };

  P.flacon = function (g, x, y) {
    // Flacon de verre ambré, bouchon noir, étiquette et pictogramme « corrosif ».
    const b = el("g", { class: "flacon" }, g);
    P.ombre(b, x, y, 28);
    el("path", { d: `M${x - 28} ${y} V${y - 70} Q${x - 28} ${y - 84} ${x - 12} ${y - 88} V${y - 100} H${x + 12} V${y - 88} Q${x + 28} ${y - 84} ${x + 28} ${y - 70} V${y} A28 ${28 * P.K} 0 0 1 ${x - 28} ${y} Z`, fill: "url(#ambre)" }, b);
    el("rect", { x: x - 13, y: y - 116, width: 26, height: 18, rx: 3, fill: "#212121" }, b);
    el("rect", { x: x - 22, y: y - 64, width: 44, height: 40, rx: 3, fill: "#fffdf5" }, b);
    el("text", { x, y: y - 50, "text-anchor": "middle", "font-family": "system-ui", "font-size": 8, "font-weight": 700, fill: "#263238" }, b).textContent = "NaOH";
    el("text", { x, y: y - 40, "text-anchor": "middle", "font-family": "system-ui", "font-size": 6.5, fill: "#263238" }, b).textContent = "0,10 mol/L";
    el("path", { d: `M${x} ${y - 36} l7 7 l-7 7 l-7 -7 z`, fill: "#ffffff", stroke: "#d32f2f", "stroke-width": 1.5 }, b);
    el("rect", { x: x - 22, y: y - 82, width: 5, height: 70, rx: 2.5, fill: "#ffffff", opacity: 0.3 }, b);
  };
})(window.P);

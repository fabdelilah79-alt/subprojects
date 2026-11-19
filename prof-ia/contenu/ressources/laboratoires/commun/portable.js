/*
Rôle : ordinateur portable posé sur la paillasse, de la taille voulue : écran (cadre noir, webcam, dalle), charnière,
       clavier en perspective (rangées de touches, pavé tactile), pieds et ombre ; une souris sans fil à droite (facultatif).
Reçoit : le groupe SVG et { x, y (coin de l'écran), l, h (taille de l'écran), souris (vrai : souris dessinée), titre (barre du logiciel) }.
Produit : Labo.portable(g, reglage) -> { x, y, l, h } : la dalle, où le logiciel se dessine.
Utilisé par : les simulations où l'élève travaille sur un logiciel (orbites, Franck et Hertz).
*/
(function (L) {
  function clavier(g, x, y, l) {
    // Socle du clavier vu un peu d'en haut : plateau gris, rangées de touches, pavé tactile, bord avant.
    const p = 44, m = 26;
    L.ombre_sol(g, x + l / 2, y + p + 8, l / 2 + 30, 9, 0.4);
    L.svg("path", { d: `M${x - 6} ${y} H${x + l + 6} L${x + l + m} ${y + p} H${x - m} Z`, fill: "#b9bec3", stroke: "#6c737a" }, g);
    L.svg("path", { d: `M${x - m} ${y + p} H${x + l + m} v4 H${x - m} Z`, fill: "#8d9399" }, g);
    for (let r = 0; r < 4; r++) {
      const d = (r + 1) * 5.2, y0 = y + 4 + r * 6.6;
      L.svg("rect", { x: x + 18 - d, y: y0, width: l - 36 + 2 * d, height: 5, rx: 1, fill: "#3b4147" }, g);
      for (let k = 1; k < 14; k++) L.svg("line", { x1: x + 18 - d + (k * (l - 36 + 2 * d)) / 14, y1: y0, x2: x + 18 - d + (k * (l - 36 + 2 * d)) / 14, y2: y0 + 5, stroke: "#8d9399", "stroke-width": 0.5 }, g);
    }
    L.svg("rect", { x: x + l / 2 - 40, y: y + 31, width: 80, height: 10, rx: 2, fill: "#a7adb3", stroke: "#7c838a", "stroke-width": 0.6 }, g);
  }

  function souris(g, x, y) {
    // Souris sans fil grise posée à droite du portable.
    L.ombre_sol(g, x, y + 10, 16, 3, 0.35);
    L.svg("ellipse", { cx: x, cy: y, rx: 12, ry: 9, fill: "#c9ced2", stroke: "#6c737a" }, g);
    L.svg("path", { d: `M${x - 12} ${y - 1} H${x + 12} M${x} ${y - 9} V${y - 1}`, stroke: "#8d9399", "stroke-width": 0.7 }, g);
  }

  L.portable = function (g, { x, y, l, h, souris: avec_souris = false, titre = "" }) {
    // Écran sur sa charnière, clavier devant ; la dalle (claire) attend le logiciel.
    clavier(g, x + 8, y + h, l - 16);
    L.svg("rect", { x, y, width: l, height: h, rx: 8, fill: "#1b1e21", stroke: "#000" }, g);
    L.svg("rect", { x: x + l / 2 - 30, y: y + h - 3, width: 60, height: 5, rx: 2, fill: "#2b2f33" }, g);
    L.svg("circle", { cx: x + l / 2, cy: y + 5, r: 1.6, fill: "#3a4148" }, g);
    const d = { x: x + 10, y: y + 10, l: l - 20, h: h - 22 };
    L.svg("rect", { x: d.x, y: d.y, width: d.l, height: d.h, fill: "#f4f5f2" }, g);
    if (titre) {
      L.svg("rect", { x: d.x, y: d.y, width: d.l, height: 14, fill: "#2f4a6b" }, g);
      L.texte(g, d.x + 8, d.y + 10, titre, { "font-size": 7.5, "font-weight": 700, fill: "#ffffff", "text-anchor": "start" });
      for (const k of [0, 1, 2]) L.svg("rect", { x: d.x + d.l - 12 - k * 13, y: d.y + 3, width: 9, height: 8, rx: 1, fill: k ? "#4b6a8f" : "#c0392b" }, g);
    }
    if (avec_souris) souris(g, x + l + 40, y + h + 30);
    return d;
  };
})(window.Labo);

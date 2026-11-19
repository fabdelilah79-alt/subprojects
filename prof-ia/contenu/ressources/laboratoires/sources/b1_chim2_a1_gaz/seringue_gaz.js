/*
Rôle : seringue de 60 mL couchée sur deux cales en V, aux vraies dimensions (2,2 px par mm : corps de 27 mm de diamètre
       intérieur, graduations tous les mL, chiffres tous les 10 mL), piston à joint noir, tige et poussoir ; robinet à
       trois voies au bout (manette dans l'axe : la seringue communique avec l'air ; manette tournée : elle est fermée) ;
       tuyau souple jusqu'au pressiomètre.
Reçoit : le groupe SVG, { V (mL), ouvert } et l'embout du pressiomètre.
Produit : Labo.SERINGUE = { X0, Y, K (px par mL), px(V) (abscisse du joint), V(px) } ; Labo.seringue_gaz(g, reglage) ; Labo.robinet_seringue(g, ouvert).
Utilisé par : poste_boyle.js.
*/
(function (L) {
  const X0 = 380, Y = 470, K = (2.2 * 1000) / 572.6, R = 30;
  const S = L.SERINGUE = { X0, Y, K, px: (V) => X0 + K * V, V: (x) => (x - X0) / K };

  function corps(g) {
    // Cales, corps transparent, graduations, collerette, embout.
    for (const x of [S.px(8), S.px(52)]) { L.ombre_sol(g, x, Y + R + 26, 30, 4, 0.4); L.svg("path", { d: `M${x - 26} ${Y + R + 24} V${Y + 12} L${x - 14} ${Y + R - 2} H${x + 14} L${x + 26} ${Y + 12} V${Y + R + 24} Z`, fill: "url(#bois)", stroke: "#6d4a26" }, g); }
    L.svg("rect", { x: X0 - 4, y: Y - R - 3, width: S.px(60) - X0 + 24, height: 2 * R + 6, rx: 4, fill: "#e8f2f6", opacity: 0.55, stroke: "#8fb3bd" }, g);
    L.svg("rect", { x: S.px(60) + 18, y: Y - R - 16, width: 9, height: 2 * R + 32, rx: 2, fill: "#dfeaee", stroke: "#8fb3bd" }, g);
    for (let v = 0; v <= 60; v++) { const x = S.px(v); L.svg("line", { x1: x, y1: Y - R - 3, x2: x, y2: Y - R + (v % 10 ? (v % 5 ? 5 : 8) : 12), stroke: "#1a3d7c", "stroke-width": 0.7 }, g); }
    for (let v = 0; v <= 60; v += 10) L.texte(g, S.px(v), Y - R + 21, String(v), { "font-size": 8, "font-weight": 700, fill: "#1a3d7c" });
    L.texte(g, S.px(64), Y - R + 21, "mL", { "font-size": 7, fill: "#1a3d7c" });
    L.svg("path", { d: `M${X0 - 4} ${Y - 9} H${X0 - 26} V${Y + 9} H${X0 - 4} Z`, fill: "#e8f2f6", stroke: "#8fb3bd" }, g);
  }

  L.robinet_seringue = function (g, ouvert) {
    // Robinet à trois voies : corps bleu, voie vers l'air (en haut), manette (dans l'axe si ouvert vers l'air).
    g.replaceChildren();
    const x = X0 - 40;
    L.svg("rect", { x: x - 14, y: Y - 8, width: 28, height: 16, rx: 3, fill: "#5a8fd1", stroke: "#1f4f8f" }, g);
    L.svg("rect", { x: x - 5, y: Y - 22, width: 10, height: 16, rx: 2, fill: "#5a8fd1", stroke: "#1f4f8f" }, g);
    L.svg("rect", { x: x - 30, y: Y - 5, width: 18, height: 10, rx: 2, fill: "#5a8fd1", stroke: "#1f4f8f" }, g);
    L.svg("path", { d: ouvert ? `M${x} ${Y + 4} V${Y + 34}` : `M${x} ${Y + 4} L${x + 24} ${Y + 22}`, stroke: "#1f4f8f", "stroke-width": 7, "stroke-linecap": "round" }, g);
    L.svg("circle", { cx: x, cy: Y, r: 5, fill: "#fff", stroke: "#1f4f8f" }, g);
    L.texte(g, x, Y + 50, ouvert ? "ouvert sur l'air" : "fermé", { "font-size": 7.5, "font-weight": 700, fill: "#e8e2cc" });
  };

  L.seringue_gaz = function (g, { V, embout }) {
    // Seringue (corps, piston à la position V), tuyau vers le pressiomètre.
    g.replaceChildren();
    L.svg("path", { d: `M${X0 - 70} ${Y} C${X0 - 120} ${Y} ${X0 - 110} ${embout.y - 40} ${embout.x + 60} ${embout.y - 40} S${embout.x} ${embout.y - 40} ${embout.x} ${embout.y}`, fill: "none", stroke: "#cfd8d4", "stroke-width": 7, opacity: 0.9 }, g);
    corps(g);
    const p = S.px(V), q = p + K * 60 + 40;
    L.svg("rect", { x: p + 10, y: Y - 6, width: q - p - 10, height: 12, fill: "#f2f4f2", stroke: "#9aa", opacity: 0.95 }, g);
    L.svg("rect", { x: p, y: Y - R, width: 12, height: 2 * R, rx: 3, fill: "#2a2d31", stroke: "#000" }, g);
    L.svg("rect", { x: q, y: Y - R - 6, width: 10, height: 2 * R + 12, rx: 3, fill: "#eef0ee", stroke: "#9aa" }, g);
  };
})(window.Labo);

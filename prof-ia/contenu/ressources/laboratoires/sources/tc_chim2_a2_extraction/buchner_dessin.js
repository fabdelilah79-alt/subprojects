/*
Rôle : dessins de la paillasse de filtration sous vide, aux vraies dimensions (1,6 px par mm) : entonnoir Büchner en
       porcelaine (corps, plaque perforée vue par l'ouverture, papier, liquide, résidu ; tige dans le col de la fiole, cône
       en caoutchouc), trompe à eau sur le robinet, tuyau à vide épais (enfilé sur les deux olives, ou débranché), évier,
       boîte de papiers filtres, pissette.
Reçoit : les plans de la paillasse et l'état { papier, residu, liquide (rgb ou null), filet (y de la surface du filtrat, quand il coule), vide, branche }.
Produit : Labo.buchner = { F, B, T, BRAS, fixe(ctx, fiole), dessus(g, etat), trompe(g, etat), pissette(g, presse) }.
Utilisé par : poste_buchner.js.
*/
(function (L) {
  const E = 1.6, F = { x: 520, y: 576 - 2.4 * E }, B = { x: 520, y: 258, haut: 258 - 40 * E }, T = { x: 760, y: 300 };
  const BRAS = { x: F.x + 37 * E, y: F.y - 155 * E }, R = 38 * E, PORCELAINE = { fill: "#f4f2ec", stroke: "#bdb8ab" };

  function fixe(ctx, fiole) {
    // Évier, robinet ; tige du Büchner dans le col (derrière le verre de la fiole) ; corps du Büchner et cône en caoutchouc.
    L.svg("rect", { x: T.x - 60, y: 424, width: 120, height: 44, rx: 6, fill: "#c9d0d4", stroke: "#8f989e" }, ctx.fond);
    L.svg("rect", { x: T.x - 52, y: 430, width: 104, height: 32, rx: 5, fill: "#7f8a90" }, ctx.fond);
    L.svg("rect", { x: T.x - 9, y: T.y - 20, width: 18, height: 14, rx: 2, fill: "url(#metal)" }, ctx.fond);
    const tige = L.svg("path", { d: `M${B.x - 9} ${B.y + 12} V${F.y - 150 * E} L${B.x - 5} ${F.y - 146 * E} H${B.x + 5} L${B.x + 9} ${F.y - 150 * E} V${B.y + 12} Z`, ...PORCELAINE, "pointer-events": "none" }, ctx.objets);
    ctx.objets.insertBefore(tige, fiole.g);
    const d = L.svg("g", { class: "buchner", "pointer-events": "none" }, ctx.devant), col = F.y - 180 * E;
    L.svg("path", { d: `M${B.x - 21} ${col - 22} L${B.x - 16} ${col + 8} H${B.x + 16} L${B.x + 21} ${col - 22} Z`, fill: "#4c5155" }, d);
    L.svg("path", { d: `M${B.x - R} ${B.haut} V${B.y - 6} Q${B.x - R + 2} ${B.y + 6} ${B.x - 20} ${B.y + 10} L${B.x - 10} ${B.y + 18} H${B.x + 10} L${B.x + 20} ${B.y + 10} Q${B.x + R - 2} ${B.y + 6} ${B.x + R} ${B.y - 6} V${B.haut} A${R} ${0.12 * R} 0 0 1 ${B.x - R} ${B.haut} Z`, ...PORCELAINE }, d);
    L.svg("rect", { x: B.x - R + 8, y: B.haut + 8, width: 8, height: 50, rx: 4, fill: "#fff", opacity: 0.6 }, d);
  }

  function dessus(g, e) {
    // Ce que l'on voit par l'ouverture : plaque perforée, papier filtre, liquide, résidu de fleurs ; puis le bord.
    g.replaceChildren();
    const rx = R - 4, ry = 0.12 * rx;
    L.svg("ellipse", { cx: B.x, cy: B.haut + 1, rx, ry, fill: e.papier ? "#ffffff" : "#e3dfd4", stroke: "#bdb8ab", "stroke-width": 0.6 }, g);
    if (!e.papier) for (let i = 0; i < 16; i++) L.svg("circle", { cx: B.x - 42 + (i % 8) * 12, cy: B.haut - 1 + Math.floor(i / 8) * 4, r: 1.1, fill: "#8d897e" }, g);
    if (e.liquide) L.svg("ellipse", { cx: B.x, cy: B.haut + 1, rx: rx - 2, ry: ry - 0.5, fill: L.rgb(e.liquide), opacity: 0.85 }, g);
    if (e.residu) for (let i = 0; i < 22; i++) L.svg("ellipse", { cx: B.x - 40 + ((i * 17) % 80), cy: B.haut - 3 + ((i * 7) % 7), rx: 3.4, ry: 1.7, fill: "#7b5aa6" }, g);
    L.svg("ellipse", { cx: B.x, cy: B.haut, rx: R, ry: 0.12 * R, fill: "none", stroke: "#d8d4c8", "stroke-width": 3 }, g);
    if (e.filet) L.svg("line", { x1: B.x, y1: F.y - 146 * E, x2: B.x, y2: e.filet, stroke: "rgb(226,200,140)", "stroke-width": 2.4, opacity: 0.8 }, g);
  }

  function trompe(g, e) {
    // Trompe à eau sous le robinet (jet d'eau dans l'évier quand il est ouvert) et tuyau à vide à paroi épaisse.
    g.replaceChildren();
    L.svg("rect", { x: T.x - 7, y: T.y - 6, width: 14, height: 120, rx: 3, fill: "url(#metal)", stroke: "#7d868c" }, g);
    L.svg("rect", { x: T.x - 24, y: T.y + 36, width: 18, height: 8, rx: 2, fill: "url(#metal)", stroke: "#7d868c" }, g);
    if (e.vide) L.svg("rect", { x: T.x - 3, y: T.y + 114, width: 6, height: 26, fill: "#8fd0ee", opacity: 0.75 }, g);
    const style = { stroke: "#232323", "stroke-width": 12, fill: "none" }, de = { x: T.x - 20, y: T.y + 40 };
    if (!e.branche) return void L.svg("path", { d: `M${de.x} ${de.y} H${de.x - 14} C${de.x - 70} ${de.y} ${BRAS.x + 40} ${BRAS.y + 30} ${BRAS.x + 30} ${BRAS.y + 90}`, ...style, "stroke-linecap": "round" }, g);
    L.svg("path", { d: `M${de.x} ${de.y} H${de.x - 14} C${de.x - 80} ${de.y} ${BRAS.x + 70} ${BRAS.y} ${BRAS.x + 26} ${BRAS.y} H${BRAS.x - 10}`, ...style }, g);
  }

  function pissette(g, presse) {
    // Pissette de 250 mL (repère en mm, fond en (0, 0)) : flacon souple, bouchon, tube coudé ; pointe en (34, -150).
    g.replaceChildren();
    L.svg("ellipse", { cx: 2, cy: 1, rx: 30, ry: 4, fill: "#000", opacity: 0.25 }, g);
    L.svg("path", { d: `M-28 -2 V-96 Q-28 ${presse ? -104 : -110} -12 -112 V-120 H12 V-112 Q28 ${presse ? -104 : -110} 28 -96 V-2 Q28 0 25 0 H-25 Q-28 0 -28 -2 Z`, fill: "rgba(236,244,246,0.85)", stroke: "#9fb6be", "stroke-width": 0.8 }, g);
    L.svg("rect", { x: -25, y: -60, width: 50, height: 56, fill: "rgba(196,226,238,0.45)" }, g);
    L.svg("rect", { x: -14, y: -128, width: 28, height: 10, rx: 2, fill: "#e8e8e2", stroke: "#a9a9a0", "stroke-width": 0.6 }, g);
    L.svg("path", { d: "M0 -128 V-150 Q0 -158 8 -156 L34 -150", fill: "none", stroke: "#e2e6e8", "stroke-width": 3.4, "stroke-linecap": "round" }, g);
    L.svg("text", { x: 0, y: -40, "font-size": 9, "font-weight": 700, "text-anchor": "middle", fill: "#23315a", "font-family": "sans-serif" }, g).textContent = "eau";
  }

  function boite_papiers(g, x, sol) {
    // Boîte de papiers filtres ronds de 70 mm.
    L.svg("ellipse", { cx: x + 3, cy: sol + 1, rx: 64, ry: 5, fill: "#000", opacity: 0.25 }, g);
    L.svg("rect", { x: x - 62, y: sol - 22, width: 124, height: 22, rx: 3, fill: "#3f6fb0" }, g);
    L.svg("ellipse", { cx: x, cy: sol - 22, rx: 62, ry: 8, fill: "#fff", stroke: "#c8c8c0" }, g);
    L.texte(g, x, sol - 9, "papier filtre Ø 70 mm", { "font-size": 6.5, "font-weight": 700, fill: "#fff" });
  }

  L.buchner = { F, B, T, BRAS, E, fixe, dessus, trompe, pissette, boite_papiers };
})(window.Labo);

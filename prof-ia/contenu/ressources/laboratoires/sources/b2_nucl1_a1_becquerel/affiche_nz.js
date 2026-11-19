/*
Rôle : affiche murale « diagramme (N, Z) de tous les noyaux » (N de 0 à 150, Z de 1 à 100) : un point par noyau, coloré
       selon sa stabilité ; droite N = Z en pointillés ; quelques nucléides repérés (⁵⁶Fe, ⁹⁰Sr, ¹³¹I, ¹³⁷Cs, ²⁰⁸Pb, ²²⁶Ra, ²³⁸U).
       Les noyaux légers (Z ≤ 8) sont ceux du tableau ; au-delà, l'affiche est un schéma : vallée de stabilité
       Z₀ = A / (1,98 + 0,0155·A^(2/3)), noyaux stables près de Z₀ jusqu'au plomb, α au-delà de Z = 83, β− sous la vallée
       (trop de neutrons), β+ au-dessus (trop de protons).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.affiche_nz(g).
Utilisé par : simulation.js.
*/
(function (L) {
  const O = { x: 696, y: 330 }, K = 2, REPERES = [["⁵⁶Fe", 30, 26, -1], ["⁹⁰Sr", 52, 38, 1], ["¹³¹I", 78, 53, 1], ["¹³⁷Cs", 82, 55, -1], ["²⁰⁸Pb", 126, 82, 1], ["²²⁶Ra", 138, 88, -1], ["²³⁸U", 146, 92, -1]];

  function mode(n, z) {
    // Stabilité du noyau (N, Z) : tableau exact pour Z ≤ 8, schéma de la vallée de stabilité au-delà ; null : pas de noyau.
    if (z <= 8) return L.NOYAUX_LEGERS[z][n] || null;
    const a = n + z, d = z - a / (1.98 + 0.0155 * a ** (2 / 3));
    if (Math.abs(d) > 1.5 + 0.04 * a) return null;
    if (z > 83 || a > 209) return d > -2.5 ? "a" : "b-";
    if (Math.abs(d) < 0.45 + 0.0035 * a) return "s";
    return d < 0 ? "b-" : "b+";
  }

  function image(g) {
    // Points du diagramme dessinés dans un canvas (2 px par noyau), posé comme une image.
    const t = document.createElement("canvas"), c = t.getContext("2d");
    t.width = 151 * K; t.height = 101 * K;
    for (let z = 1; z <= 100; z++) for (let n = 0; n <= 150; n++) { const m = mode(n, z); if (m) { c.fillStyle = L.MODES[m][0]; c.fillRect(n * K, (100 - z) * K, K, K); } }
    L.svg("image", { x: O.x, y: O.y - 101 * K, width: 151 * K, height: 101 * K, href: t.toDataURL() }, g);
  }

  function axes(g) {
    // Axes gradués tous les 20, titres, droite N = Z.
    L.svg("path", { d: `M${O.x} ${O.y - 101 * K} V${O.y} H${O.x + 151 * K}`, fill: "none", stroke: "#333" }, g);
    for (let v = 0; v <= 150; v += 20) { L.svg("line", { x1: O.x + v * K, y1: O.y, x2: O.x + v * K, y2: O.y + 4, stroke: "#333" }, g); L.texte(g, O.x + v * K, O.y + 13, String(v), { "font-size": 7, fill: "#333" }); }
    for (let v = 0; v <= 100; v += 20) { L.svg("line", { x1: O.x - 4, y1: O.y - v * K, x2: O.x, y2: O.y - v * K, stroke: "#333" }, g); L.texte(g, O.x - 12, O.y - v * K + 3, String(v), { "font-size": 7, fill: "#333" }); }
    L.texte(g, O.x + 151 * K + 8, O.y + 4, "N", { "font-size": 8, "font-weight": 700, fill: "#23315a" });
    L.texte(g, O.x, O.y - 101 * K - 8, "Z", { "font-size": 8, "font-weight": 700, fill: "#23315a" });
    L.svg("line", { x1: O.x, y1: O.y, x2: O.x + 100 * K, y2: O.y - 100 * K, stroke: "#555", "stroke-width": 0.8, "stroke-dasharray": "4 3" }, g);
    L.texte(g, O.x + 92 * K, O.y - 100 * K + 4, "N = Z", { "font-size": 7, fill: "#555", "text-anchor": "end" });
  }

  L.affiche_nz = function (g) {
    // Affiche, points, axes, nucléides repérés, encadré du tableau des noyaux légers.
    L.svg("rect", { x: 660, y: 26, width: 352, height: 372, rx: 2, fill: "#fbfbf7", stroke: "#b9b4a6", filter: "url(#ombre)" }, g);
    L.texte(g, 836, 44, "Diagramme (N, Z) de tous les noyaux", { "font-size": 9, "font-weight": 700, fill: "#23315a" });
    Object.entries(L.MODES).forEach(([, [c, nom]], k) => { L.svg("rect", { x: 680 + k * 82, y: 54, width: 9, height: 9, fill: c }, g); L.texte(g, 692 + k * 82, 62, nom, { "font-size": 6.5, fill: "#333", "text-anchor": "start" }); });
    image(g); axes(g);
    for (const [t, n, z, c] of REPERES) { const x = O.x + n * K + 1, y = O.y - z * K - 1; L.svg("circle", { cx: x, cy: y, r: 3.2, fill: "none", stroke: "#111", "stroke-width": 1 }, g); L.texte(g, x + 6 * c, y + (c > 0 ? 11 : -4), t, { "font-size": 7, "font-weight": 700, fill: "#111", "text-anchor": c > 0 ? "start" : "end" }); }
    L.svg("rect", { x: O.x, y: O.y - 9 * K, width: 11 * K, height: 9 * K, fill: "none", stroke: "#d32f2f" }, g);
    L.texte(g, O.x + 26, O.y - 22, "tableau de gauche", { "font-size": 6.5, fill: "#d32f2f", "text-anchor": "start" });
    L.texte(g, 836, 388, "Au-delà de Z = 8 : schéma de la vallée de stabilité.", { "font-size": 6.5, fill: "#555" });
  };
})(window.Labo);

/*
Rôle : paillasse « l'image se forme dans le cerveau » : deux feuilles pincées sur des porte-documents posés sur des
       chevalets de bois : (1) deux segments de même longueur (10 cm) terminés par des flèches ouvertes ou fermées
       (illusion de Müller-Lyer) ; (2) trois disques entamés : on « voit » un triangle blanc qui n'est pas dessiné.
       Une règle graduée transparente, posée sur la paillasse, se fait glisser sur les segments pour les mesurer.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_illusion(g) -> { pense_bete } ; fait « illusion » = { mesure (règle posée sur A puis sur B) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SA = { x: 300, y: 200 }, SB = { x: 300, y: 300 }, CM = 20;

  function chevalet(g, x0, x1, y0, y1) {
    // Chevalet de bois (pieds), porte-documents, pince, feuille blanche.
    for (const [a, b] of [[x0 + 20, x0 - 10], [x1 - 20, x1 + 10]]) L.svg("line", { x1: a, y1: y0 + 20, x2: b, y2: 520, stroke: "#8d6337", "stroke-width": 7, "stroke-linecap": "round" }, g);
    L.ombre_sol(g, (x0 + x1) / 2, 522, (x1 - x0) / 2 + 20, 6, 0.4);
    L.svg("rect", { x: x0 - 8, y: y0 - 8, width: x1 - x0 + 16, height: y1 - y0 + 16, rx: 4, fill: "url(#bois)", stroke: "#6d4a26" }, g);
    L.svg("rect", { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: "#fdfdf8", stroke: "#ccc" }, g);
    L.svg("rect", { x: (x0 + x1) / 2 - 30, y: y0 - 14, width: 60, height: 16, rx: 3, fill: "url(#metal)", stroke: "#555" }, g);
    L.svg("rect", { x: x0 - 12, y: y1 + 8, width: x1 - x0 + 24, height: 10, rx: 2, fill: "#6d4a26" }, g);
  }

  function regle(g, p) {
    // Double décimètre en plastique transparent (20 px par cm), graduations en mm et en cm.
    g.replaceChildren();
    L.svg("rect", { x: p.x - 10, y: p.y, width: 12 * CM + 20, height: 26, rx: 2, fill: "#eaf6fb", opacity: 0.78, stroke: "#7fa9b5" }, g);
    for (let k = 0; k <= 120; k++) L.svg("line", { x1: p.x + k * 2, y1: p.y, x2: p.x + k * 2, y2: p.y + (k % 10 ? (k % 5 ? 4 : 6) : 9), stroke: "#1a3d7c", "stroke-width": 0.5 }, g);
    for (let c = 0; c <= 12; c++) L.texte(g, p.x + c * CM, p.y + 16, String(c), { "font-size": 7, fill: "#1a3d7c" });
  }

  L.poste_illusion = function (g) {
    // Décor, deux chevalets, figures, règle saisissable ; faits.
    const { pense_bete } = L.decor_circuit(g, 4), e = { regle: { x: 560, y: 470 }, surA: false, surB: false };
    chevalet(g, 255, 545, 150, 340); chevalet(g, 610, 880, 150, 340);
    const trait = { stroke: "#222", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }, l = 10 * CM;
    L.svg("path", { d: `M${SA.x} ${SA.y} h${l} M${SA.x} ${SA.y} l18 -18 M${SA.x} ${SA.y} l18 18 M${SA.x + l} ${SA.y} l-18 -18 M${SA.x + l} ${SA.y} l-18 18`, ...trait }, g);
    L.svg("path", { d: `M${SB.x} ${SB.y} h${l} M${SB.x} ${SB.y} l-18 -18 M${SB.x} ${SB.y} l-18 18 M${SB.x + l} ${SB.y} l18 -18 M${SB.x + l} ${SB.y} l18 18`, ...trait }, g);
    L.texte(g, 270, SA.y, "A", { "font-size": 13, "font-weight": 700, fill: "#1a3d7c" }); L.texte(g, 266, SB.y - 22, "B", { "font-size": 13, "font-weight": 700, fill: "#1a3d7c" });
    for (const [x, y, a] of [[745, 190, 90], [680, 300, 330], [810, 300, 210]]) {
      const r = 30, a1 = ((a - 30) * Math.PI) / 180, a2 = ((a + 30) * Math.PI) / 180;
      L.svg("path", { d: `M${x} ${y} L${x + r * Math.cos(a2)} ${y + r * Math.sin(a2)} A${r} ${r} 0 1 1 ${x + r * Math.cos(a1)} ${y + r * Math.sin(a1)} Z`, fill: "#222" }, g);
    }
    const gr = L.svg("g", { class: "regle", role: "button", "aria-label": "Règle graduée" }, g);
    L.glissable(gr, { soulever: false, debut: () => ({ ...e.regle }), deplacer: (p) => { e.regle = { x: Math.max(200, Math.min(700, p.x)), y: Math.max(160, Math.min(500, p.y)) }; regle(gr, e.regle); } });
    regle(gr, e.regle);
    setInterval(() => {
      // Règle posée juste sous un segment, son zéro au début du segment.
      for (const [k, s] of [["surA", SA], ["surB", SB]]) if (Math.abs(e.regle.x - s.x) < 6 && e.regle.y - s.y > -4 && e.regle.y - s.y < 14) e[k] = true;
      L.missions.noter("illusion", { mesure: e.surA && e.surB });
    }, 250);
    return { pense_bete };
  };
})(window.Labo);

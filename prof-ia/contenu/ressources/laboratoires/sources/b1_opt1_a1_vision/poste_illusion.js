/*
Rôle : paillasse « l'image se forme dans le cerveau » : affiche au mur avec deux illusions d'optique : (1) deux segments
       de même longueur terminés par des flèches ouvertes ou fermées (illusion de Müller-Lyer) ; « Mesurer » pose une règle
       sur chacun ; (2) trois disques entamés : le cerveau « voit » un triangle blanc qui n'est pas dessiné.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_illusion(g) -> { pense_bete } ; fait « illusion » = { mesure }.
Utilisé par : simulation.js.
*/
(function (L) {
  function muller(g) {
    // Deux segments de 200 px ; flèches vers l'extérieur ou vers l'intérieur.
    const trait = { stroke: "#222", "stroke-width": 3, fill: "none", "stroke-linecap": "round" };
    L.svg("path", { d: "M300 150 H500 M300 150 l20 -20 M300 150 l20 20 M500 150 l-20 -20 M500 150 l-20 20", ...trait }, g);
    L.svg("path", { d: "M300 260 H500 M300 260 l-20 -20 M300 260 l-20 20 M500 260 l20 -20 M500 260 l20 20", ...trait }, g);
    L.texte(g, 280, 150, "A", { "font-size": 14, "font-weight": 700, fill: "#1a3d7c" }); L.texte(g, 262, 290, "B", { "font-size": 14, "font-weight": 700, fill: "#1a3d7c" });
  }

  function regles(g) {
    // Règle graduée posée sous chaque segment.
    for (const y of [170, 280]) {
      L.svg("rect", { x: 290, y, width: 220, height: 18, fill: "#f3e7b5", stroke: "#8a7a3a", opacity: 0.95 }, g);
      for (let k = 0; k <= 20; k++) L.svg("line", { x1: 300 + k * 10, y1: y, x2: 300 + k * 10, y2: y + (k % 5 ? 5 : 9), stroke: "#333" }, g);
      L.texte(g, 300, y + 14, "0", { "font-size": 7 }); L.texte(g, 500, y + 14, "10 cm", { "font-size": 7 });
    }
  }

  function kanizsa(g) {
    // Trois disques noirs entamés : triangle « vu » mais non dessiné.
    for (const [x, y, a] of [[690, 140, 90], [610, 280, 330], [770, 280, 210]]) {
      const r = 34, a1 = ((a - 30) * Math.PI) / 180, a2 = ((a + 30) * Math.PI) / 180;
      L.svg("path", { d: `M${x} ${y} L${x + r * Math.cos(a2)} ${y + r * Math.sin(a2)} A${r} ${r} 0 1 1 ${x + r * Math.cos(a1)} ${y + r * Math.sin(a1)} Z`, fill: "#222" }, g);
    }
  }

  L.poste_illusion = function (g) {
    // Affiche, touche « Mesurer » ; fait.
    L.decor.paillasse(g, 4);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { mesure: false };
    L.svg("rect", { x: 250, y: 90, width: 600, height: 260, rx: 4, fill: "#fdfdf8", stroke: "#bbb" }, g);
    L.texte(g, 550, 108, "Deux affiches : que voyez-vous ?", { "font-size": 11, "font-weight": 700, fill: "#333" });
    muller(g); kanizsa(g);
    const r = L.svg("g", { "pointer-events": "none" }, g);
    L.bouton_texte(g, 400, 330, "Mesurer", () => { e.mesure = !e.mesure; r.replaceChildren(); if (e.mesure) regles(r); });
    setInterval(() => L.missions.noter("illusion", { mesure: e.mesure }), 250);
    return { pense_bete };
  };
})(window.Labo);

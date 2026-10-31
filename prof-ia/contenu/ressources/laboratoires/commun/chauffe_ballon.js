/*
Rôle : chauffe-ballon pour ballon de 250 mL, aux vraies dimensions (14 cm × 9 cm) : coque grise, cuvette (l'arrière est
       dessiné derrière le ballon, la paroi avant devant lui : le ballon y est enfoncé jusqu'à mi-hauteur), plaque des
       commandes avec bouton de réglage et voyant rouge allumé pendant la chauffe.
Reçoit : les plans fond et devant de la paillasse et la position { x (milieu), haut (bord de la cuvette), bas }.
Produit : Labo.chauffe_ballon(fond, devant, position) -> { allumer(oui) }.
Utilisé par : les montages d'hydrodistillation et de chauffage à reflux.
*/
(function (L) {
  L.chauffe_ballon = function (fond, devant, { x, haut: h, bas: b }) {
    // Dessine le chauffe-ballon ; allumer() change la couleur du voyant.
    L.svg("ellipse", { cx: x, cy: h, rx: 112, ry: 16, fill: "#2c3135" }, fond);
    const g = L.svg("g", { "pointer-events": "none" }, devant);
    L.svg("path", { d: `M${x - 112} ${h} Q${x - 108} ${b} ${x - 96} ${b} H${x + 96} Q${x + 108} ${b} ${x + 112} ${h} A112 16 0 0 1 ${x - 112} ${h} Z`, fill: "#7b868d", stroke: "#4f585e" }, g);
    L.svg("path", { d: `M${x - 104} ${h + 2} A104 13 0 0 0 ${x + 104} ${h + 2}`, fill: "none", stroke: "#a9b3b9", "stroke-width": 3 }, g);
    L.svg("rect", { x: x - 70, y: h + 70, width: 140, height: 46, rx: 4, fill: "#e8eaea", stroke: "#a7adb0" }, g);
    L.texte(g, x - 22, h + 84, "CHAUFFE-BALLON 250 mL", { "font-size": 6, "font-weight": 700, fill: "#566066" });
    L.svg("circle", { cx: x + 46, cy: h + 98, r: 9, fill: "#30353a" }, g);
    L.svg("line", { x1: x + 46, y1: h + 98, x2: x + 51, y2: h + 91, stroke: "#fff", "stroke-width": 1.6 }, g);
    const voyant = L.svg("circle", { cx: x + 32, cy: h + 98, r: 3, fill: "#5b2420" }, g);
    return { allumer: (oui) => voyant.setAttribute("fill", oui ? "#ff3b2f" : "#5b2420") };
  };
})(window.Labo);

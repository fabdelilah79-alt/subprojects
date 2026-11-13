/*
Rôle : réfrigérant à boules de 18 cm, aux vraies dimensions : col rodé en bas, manchon, cinq boules, tube supérieur
       ouvert, deux embouts à olive (entrée de l'eau en bas, sortie en haut) ; l'eau du manchon (plein quand le robinet
       est ouvert) ; pendant le reflux, des gouttes de liquide condensé retombent dans le tube intérieur.
Reçoit : le groupe SVG, la position du bas du col rodé { x, y }, l'angle (0 : vertical, −90 : couché) et l'état
         { eau, reflux }.
Produit : Labo.refrigerant_boules(g, position, angle, etat) ; Labo.refrigerant_boules.embouts(position, angle) -> { entree, sortie }
          (extrémités des olives, en px).
Utilisé par : montage_reflux.js.
*/
(function (L) {
  const VERRE = { fill: "rgba(205,228,236,0.45)", stroke: "rgba(120,150,160,0.9)", "stroke-width": 0.8 };
  const ENTREE = { x: 54, y: -32 }, SORTIE = { x: 54, y: -252 };

  function tourner(p, o, angle) {
    // Point du repère du réfrigérant (origine : bas du col) dans la scène.
    const a = (angle * Math.PI) / 180;
    return { x: o.x + p.x * Math.cos(a) - p.y * Math.sin(a), y: o.y + p.x * Math.sin(a) + p.y * Math.cos(a) };
  }

  L.refrigerant_boules = function (g, o, angle, e) {
    // Dessin dans le repère du réfrigérant, tourné de « angle » autour du bas du col.
    g.replaceChildren();
    const r = L.svg("g", { transform: `translate(${o.x} ${o.y}) rotate(${angle})` }, g);
    L.svg("rect", { x: -14, y: -22, width: 28, height: 22, ...VERRE }, r);
    L.svg("rect", { x: -8, y: -288, width: 16, height: 23, ...VERRE }, r);
    L.svg("rect", { x: -32, y: -267, width: 64, height: 250, rx: 14, ...VERRE }, r);
    if (e.eau) L.svg("rect", { x: -28, y: -261, width: 56, height: 238, rx: 11, fill: "#5fb3dc", opacity: 0.3 }, r);
    for (let k = 0; k < 5; k++) L.svg("ellipse", { cx: 0, cy: -239 + k * 48, rx: 15, ry: 21, ...VERRE }, r);
    for (let k = 0; k < 4; k++) L.svg("rect", { x: -6, y: -219 + k * 48, width: 12, height: 10, ...VERRE }, r);
    L.svg("rect", { x: -26, y: -259, width: 4, height: 234, rx: 2, fill: "#fff", opacity: 0.45 }, r);
    for (const p of [ENTREE, SORTIE]) {
      L.svg("rect", { x: 31, y: p.y - 5, width: p.x - 31, height: 10, ...VERRE }, r);
      L.svg("rect", { x: p.x - 9, y: p.y - 6.5, width: 5, height: 13, rx: 2, ...VERRE }, r);
    }
    if (e.reflux) for (let k = 0; k < 4; k++) L.svg("ellipse", { cx: (k % 2 ? 1.5 : -1.5), cy: -40 - ((k * 37 + Date.now() / 6) % 130), rx: 1.6, ry: 2.4, fill: "rgba(225,238,244,0.95)", stroke: "rgba(120,150,160,0.7)", "stroke-width": 0.3 }, r);
  };

  L.refrigerant_boules.embouts = (o, angle) => ({ entree: tourner(ENTREE, o, angle), sortie: tourner(SORTIE, o, angle) });
})(window.Labo);

/*
Rôle : affiche des consignes de sécurité du laboratoire de chimie, collée au mur : port obligatoire des lunettes et de la
       blouse (pictogrammes ronds bleus), interdiction de goûter, de manger ou de boire (rond rouge barré).
Reçoit : le groupe SVG et la position { x, y } du coin haut gauche de l'affiche.
Produit : Labo.affiche_securite(g, x, y).
Utilisé par : les simulations de chimie.
*/
(function (L) {
  function obligation(g, cx, cy, dessin) {
    // Pictogramme d'obligation : disque bleu, dessin blanc.
    L.svg("circle", { cx, cy, r: 17, fill: "#1f5fae" }, g);
    L.svg("path", { d: dessin(cx, cy), fill: "none", stroke: "#fff", "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }, g);
  }

  L.affiche_securite = function (g, x, y) {
    // Affiche blanche à trois pictogrammes et leurs légendes.
    const a = L.svg("g", { class: "affiche-securite" }, g);
    L.svg("rect", { x: x + 3, y: y + 4, width: 170, height: 92, fill: "#000", opacity: 0.15, filter: "url(#flou)" }, a);
    L.svg("rect", { x, y, width: 170, height: 92, fill: "#fdfdfb", stroke: "#c9ccc4" }, a);
    L.texte(a, x + 85, y + 11, "SÉCURITÉ AU LABORATOIRE", { "font-size": 8, "font-weight": 700, fill: "#23315a" });
    obligation(a, x + 30, y + 42, (cx, cy) => `M${cx - 12} ${cy - 2} h24 M${cx - 11} ${cy - 2} q0 7 5 7 q4 0 5 -5 h2 q1 5 5 5 q5 0 5 -7`);
    obligation(a, x + 85, y + 42, (cx, cy) => `M${cx - 4} ${cy - 10} l4 5 l4 -5 l7 4 l-3 6 l-3 -1 v11 h-10 v-11 l-3 1 l-3 -6 Z M${cx} ${cy - 5} v14`);
    L.svg("circle", { cx: x + 140, cy: y + 42, r: 15.5, fill: "#fff", stroke: "#d31f26", "stroke-width": 3.2 }, a);
    L.svg("path", { d: `M${x + 133} ${y + 36} h14 l-2 13 h-10 Z M${x + 147} ${y + 39} q5 0 5 4 q0 4 -6 4`, fill: "none", stroke: "#111", "stroke-width": 1.6 }, a);
    L.svg("line", { x1: x + 129, y1: y + 31, x2: x + 151, y2: y + 53, stroke: "#d31f26", "stroke-width": 3.2 }, a);
    [[30, "Lunettes"], [85, "Blouse"], [140, "Ne jamais goûter"]].forEach(([dx, t]) => L.texte(a, x + dx, y + 72, t, { "font-size": 7, "font-weight": 700, fill: "#23315a" }));
    L.texte(a, x + 85, y + 84, "On ne goûte ni ne mange au laboratoire.", { "font-size": 6, fill: "#444" });
    return a;
  };
})(window.Labo);

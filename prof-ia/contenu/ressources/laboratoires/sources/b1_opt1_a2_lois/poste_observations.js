/*
Rôle : paillasse « observations courantes » : paille dans un verre d'eau (elle paraît brisée à la surface) et lac qui
       reflète un arbre (image renversée par réflexion).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_observations(g) -> { pense_bete }.
Utilisé par : simulation.js.
*/
(function (L) {
  L.poste_observations = function (g) {
    // Verre, eau, paille brisée ; affiche du lac et de l'arbre reflété.
    L.decor.paillasse(g, 2);
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.svg("path", { d: "M330 250 L350 470 H450 L470 250 Z", fill: "url(#verre)", stroke: "#9fb6be", "stroke-width": 1.5 }, g);
    L.svg("path", { d: "M336 320 L348 466 H452 L464 320 Z", fill: "#7fb8d6", opacity: 0.5 }, g);
    L.svg("line", { x1: 300, y1: 200, x2: 380, y2: 320, stroke: "#e34b4b", "stroke-width": 8, "stroke-linecap": "round" }, g);
    L.svg("line", { x1: 392, y1: 320, x2: 440, y2: 450, stroke: "#e34b4b", "stroke-width": 8, "stroke-linecap": "round", opacity: 0.85 }, g);
    L.texte(g, 400, 495, "paille dans un verre d'eau", { "font-size": 9, "font-weight": 700, fill: "#333" });
    L.svg("rect", { x: 560, y: 70, width: 300, height: 300, rx: 4, fill: "#fdfdf8", stroke: "#bbb" }, g);
    L.svg("rect", { x: 575, y: 85, width: 270, height: 140, fill: "#cfe8f7" }, g);
    L.svg("rect", { x: 575, y: 225, width: 270, height: 125, fill: "#5b8fb0" }, g);
    L.svg("rect", { x: 700, y: 160, width: 12, height: 65, fill: "#6d4a2a" }, g);
    L.svg("circle", { cx: 706, cy: 140, r: 34, fill: "#3f8f4a" }, g);
    L.svg("rect", { x: 700, y: 225, width: 12, height: 65, fill: "#6d4a2a", opacity: 0.6 }, g);
    L.svg("circle", { cx: 706, cy: 310, r: 34, fill: "#3f8f4a", opacity: 0.55 }, g);
    L.texte(g, 710, 362, "un arbre au bord d'un lac", { "font-size": 9, "font-weight": 700, fill: "#333" });
    return { pense_bete };
  };
})(window.Labo);

/*
Rôle : dessin plus en relief (2,5D) des boîtiers d'appareils et finitions de détail (proposition à valider : option
       « relief=1 » dans l'adresse, désactivée par défaut, par exemple …html#relief=1) : boîtier posé sur la paillasse
       vu un peu d'en haut (dessus éclairé, face avant ombrée de haut en bas, arêtes adoucies, pieds en caoutchouc,
       ombre de contact), touche en caoutchouc avec sa lèvre, afficheur enfoncé dans sa lunette.
Reçoit : le groupe SVG et la place de l'appareil (x : bord gauche, sol : y de la paillasse, l : largeur, h : hauteur de la
         face avant, p : profondeur visible du dessus) et ses couleurs.
Produit : Labo.relief (vrai si l'option est active) ; Labo.boite_relief(g, x, sol, l, h, p, couleurs) -> { dessus, face } (y du
          haut du dessus et de la face) ; Labo.touche_relief(g, x, y, l, h) ; Labo.afficheur_relief(g, x, y, l, h, fond).
Utilisé par : agitateur_magnetique.js, ph_metre.js, lewis_dessin.js (bouton texte) quand l'option est active.
*/
(function (L) {
  L.relief = /[#&]relief=1(&|$)/.test(window.location.hash);
  const PIED = 3;

  function degrade_ombre(g) {
    // Dégradé vertical (transparent en haut, sombre en bas) créé une fois dans le SVG de la scène.
    const svg = g.ownerSVGElement;
    if (!svg || svg.getElementById("relief-ombre")) return;
    const d = L.svg("linearGradient", { id: "relief-ombre", x1: 0, y1: 0, x2: 0, y2: 1 }, L.svg("defs", {}, svg));
    [[0, 0], [0.45, 0.04], [1, 0.3]].forEach(([o, a]) => L.svg("stop", { offset: o, "stop-color": "#000", "stop-opacity": a }, d));
  }

  L.boite_relief = function (g, x, sol, l, h, p, { face, dessus, arete = "#00000055" }) {
    // Ombre de contact, pieds, face avant (plus sombre en bas), dessus éclairé, reflet sur l'arête avant du dessus.
    const yf = sol - PIED - h, yd = yf - p;
    L.ombre_sol(g, x + l / 2 + 4, sol + 1, l * 0.56, 6, 0.5);
    for (const px of [x + 8, x + l - 22]) L.svg("rect", { x: px, y: sol - PIED - 1, width: 14, height: PIED + 1, rx: 1.5, fill: "#15181b" }, g);
    L.svg("rect", { x, y: yf - 2, width: l, height: h + 2, rx: 5, fill: face, stroke: arete }, g);
    degrade_ombre(g);
    L.svg("rect", { x: x + 1, y: yf, width: l - 2, height: h - 1, rx: 4, fill: "url(#relief-ombre)" }, g);
    L.svg("rect", { x: x + 1, y: yd, width: l - 2, height: p + 2, rx: 6, fill: dessus, stroke: arete }, g);
    L.svg("rect", { x: x + 4, y: yd + 1.5, width: l - 8, height: 2, rx: 1, fill: "#000", opacity: 0.12 }, g);
    L.svg("rect", { x: x + 3, y: yf - 1, width: l - 6, height: 1.6, rx: 0.8, fill: "#fff", opacity: 0.55 }, g);
    return { dessus: yd, face: yf };
  };

  L.touche_relief = function (g, x, y, l, h, couleur = "#3b4147") {
    // Touche en caoutchouc : lèvre sombre dessous, dessus bombé avec un reflet.
    L.svg("rect", { x: x - l / 2, y: y - h / 2 + 2, width: l, height: h, rx: 4, fill: "#111417" }, g);
    L.svg("rect", { x: x - l / 2, y: y - h / 2, width: l, height: h, rx: 4, fill: couleur, stroke: "#1d2125" }, g);
    L.svg("rect", { x: x - l / 2 + 3, y: y - h / 2 + 1.5, width: l - 6, height: 2, rx: 1, fill: "#fff", opacity: 0.25 }, g);
  };

  L.afficheur_relief = function (g, x, y, l, h, fond) {
    // Afficheur à cristaux liquides enfoncé : lunette sombre, ombre intérieure en haut, léger reflet en biais.
    L.svg("rect", { x: x - 3, y: y - 3, width: l + 6, height: h + 6, rx: 4, fill: "#23292e" }, g);
    L.svg("rect", { x, y, width: l, height: h, rx: 2, fill: fond }, g);
    L.svg("rect", { x, y, width: l, height: 4, rx: 2, fill: "#000", opacity: 0.22 }, g);
    L.svg("path", { d: `M${x + l * 0.55} ${y} h${l * 0.18} l${-l * 0.12} ${h} h${-l * 0.18} z`, fill: "#fff", opacity: 0.12 }, g);
  };
})(window.Labo);

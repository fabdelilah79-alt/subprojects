/*
Rôle : décor d'une paillasse d'électricité vue de plus haut : un bandeau de mur carrelé avec sa prise, un grand plan de
       travail où l'on pose les appareils et les fils, le bord avant et les placards.
Reçoit : le groupe SVG de la paillasse et son numéro.
Produit : Labo.decor_circuit(groupe, numero) -> { pense_bete } ; Labo.PLAN_CIRCUIT : hauteurs (fond, avant, placard) ;
          Labo.boitier(groupe, x, y, largeur, profondeur, hauteur, { dessus, face }) : boîtier d'appareil vu d'en haut.
Utilisé par : les simulations d'électricité (décor « aucun » dans demarrer), les composants circuit_*.js.
*/
(function (L) {
  L.PLAN_CIRCUIT = { fond: 168, avant: 585, placard: 598 };
  const P = L.PLAN_CIRCUIT;

  function mur(g) {
    // Mur peint, carrelage, prise électrique (à droite, pour le cordon du générateur).
    L.svg("rect", { x: 0, y: 0, width: L.LARGEUR, height: P.fond, fill: "url(#mur)" }, g);
    L.svg("rect", { x: 0, y: 96, width: L.LARGEUR, height: P.fond - 96, fill: "url(#carrelage)" }, g);
    L.svg("rect", { x: 0, y: 92, width: L.LARGEUR, height: 5, fill: "#b9bdb5" }, g);
    const prise = L.svg("g", { transform: "translate(940 110)" }, g);
    L.svg("rect", { width: 40, height: 40, rx: 4, fill: "#f7f7f4", stroke: "#b8bbb4" }, prise);
    L.svg("circle", { cx: 20, cy: 20, r: 12, fill: "#e6e7e2", stroke: "#c4c7c0" }, prise);
    for (const dx of [15, 25]) L.svg("circle", { cx: dx, cy: 20, r: 2, fill: "#555" }, prise);
  }

  function plan(g) {
    // Plan de travail sombre vu d'en haut, avec un reflet doux ; bord avant et placards.
    L.svg("rect", { x: 0, y: P.fond, width: L.LARGEUR, height: P.avant - P.fond, fill: "url(#paillasse)" }, g);
    L.svg("rect", { x: 0, y: P.fond, width: L.LARGEUR, height: 8, fill: "#000", opacity: 0.25 }, g);
    L.svg("rect", { x: 0, y: P.fond + 40, width: L.LARGEUR, height: 200, fill: "url(#reflet)", opacity: 0.7 }, g);
    L.svg("rect", { x: 0, y: P.avant, width: L.LARGEUR, height: P.placard - P.avant, fill: "url(#bord)" }, g);
    L.svg("rect", { x: 0, y: P.placard, width: L.LARGEUR, height: L.HAUTEUR - P.placard, fill: "url(#facade)" }, g);
    for (let x = 0; x < L.LARGEUR; x += 256) {
      L.svg("rect", { x: x + 6, y: P.placard + 6, width: 244, height: 40, fill: "none", stroke: "#5d6567", "stroke-width": 1.5 }, g);
      L.svg("rect", { x: x + 108, y: P.placard + 14, width: 40, height: 6, rx: 3, fill: "url(#metal-h)" }, g);
    }
  }

  L.boitier = function (g, x, y, l, p, h, { dessus = "#d9dcd8", face = "#9aa2a6" } = {}) {
    // Boîtier posé sur la paillasse : ombre, dessus (vu d'en haut), face avant (hauteur h), arête claire.
    L.svg("rect", { x: x + 4, y: y + 6, width: l, height: p + h, rx: 4, fill: "#000", opacity: 0.3, filter: "url(#flou)" }, g);
    L.svg("rect", { x, y: y + p - 4, width: l, height: h + 4, rx: 3, fill: face, stroke: "#00000050" }, g);
    L.svg("rect", { x, y, width: l, height: p, rx: 4, fill: dessus, stroke: "#00000040" }, g);
    L.svg("rect", { x: x + 3, y: y + 1.5, width: l - 6, height: 2, rx: 1, fill: "#fff", opacity: 0.35 }, g);
  };

  L.decor_circuit = function (g, numero) {
    // Dessine le décor ; le pense-bête est collé sur le mur, en haut à gauche.
    mur(g);
    plan(g);
    L.svg("text", { x: 1000, y: 30, "text-anchor": "end", class: "numero-paillasse" }, g).textContent = `Paillasse ${numero + 1}`;
    return { pense_bete: L.decor.pense_bete(g, 24, 12, 300, 126) };
  };
})(window.Labo);

/*
Rôle : décor d'une paillasse d'électricité vue de plus haut : un bandeau de mur carrelé avec sa prise, un grand plan de
       travail où l'on pose les appareils et les fils, le bord avant et les placards.
Reçoit : le groupe SVG de la paillasse et son numéro.
Produit : Labo.decor_circuit(groupe, numero) -> { pense_bete } ; Labo.PLAN_CIRCUIT : hauteurs (fond, avant, placard) ;
          Labo.PRISES_MUR : centres des prises du mur ; Labo.bouton_rond(g, x, y, texte, action, rayon) : touche ronde ; Labo.cordon_secteur(groupe, depart, prise) : cordon et fiche ;
          Labo.boitier(groupe, x, y, largeur, profondeur, hauteur, { dessus, face }) : boîtier d'appareil vu d'en haut.
Utilisé par : les simulations d'électricité (décor « aucun » dans demarrer), les composants circuit_*.js.
*/
(function (L) {
  L.PLAN_CIRCUIT = { fond: 168, avant: 585, placard: 598 };
  L.PRISES_MUR = [{ x: 860, y: 130 }, { x: 905, y: 130 }, { x: 950, y: 130 }];
  const P = L.PLAN_CIRCUIT;

  function mur(g) {
    // Mur peint, carrelage, bloc de trois prises électriques (à droite, pour les appareils branchés sur le secteur).
    L.svg("rect", { x: 0, y: 0, width: L.LARGEUR, height: P.fond, fill: "url(#mur)" }, g);
    L.svg("rect", { x: 0, y: 96, width: L.LARGEUR, height: P.fond - 96, fill: "url(#carrelage)" }, g);
    L.svg("rect", { x: 0, y: 92, width: L.LARGEUR, height: 5, fill: "#b9bdb5" }, g);
    L.svg("rect", { x: 834, y: 106, width: 142, height: 48, rx: 5, fill: "#f7f7f4", stroke: "#b8bbb4" }, g);
    for (const p of L.PRISES_MUR) {
      L.svg("circle", { cx: p.x, cy: p.y, r: 15, fill: "#e6e7e2", stroke: "#c4c7c0" }, g);
      for (const dx of [-5, 5]) L.svg("circle", { cx: p.x + dx, cy: p.y, r: 2, fill: "#555" }, g);
    }
  }

  L.cordon_secteur = function (g, depart, P) {
    // Cordon secteur : il part de l'arrière de l'appareil (caché sous lui) et finit par une fiche enfoncée dans la prise P.
    L.svg("path", { d: `M${depart.x} ${depart.y} C${depart.x + 30} ${depart.y - 50} ${P.x - 40} ${P.y + 70} ${P.x} ${P.y + 22}`, fill: "none", stroke: "#2a2d30", "stroke-width": 5, "stroke-linecap": "round" }, g);
    L.svg("rect", { x: P.x - 4, y: P.y + 8, width: 8, height: 16, rx: 3, fill: "#34373a" }, g);
    L.svg("circle", { cx: P.x + 1, cy: P.y + 2, r: 13, fill: "#000", opacity: 0.25 }, g);
    L.svg("circle", { cx: P.x, cy: P.y, r: 12, fill: "#3a3d41", stroke: "#1c1e20" }, g);
    for (const dy of [-6, 0, 6]) L.svg("rect", { x: P.x - 8, y: P.y + dy - 1, width: 16, height: 2, rx: 1, fill: "#4c5055" }, g);
    L.svg("circle", { cx: P.x - 4, cy: P.y - 5, r: 3, fill: "#fff", opacity: 0.12 }, g);
  };

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

  L.bouton_rond = function (g, x, y, texte, action, rayon = 9) {
    // Petit bouton poussoir rond, touchable.
    const b = L.svg("g", { class: "bouton-rond", role: "button", "aria-label": texte }, g);
    L.svg("circle", { cx: x + 0.8, cy: y + 1.5, r: rayon, fill: "#000", opacity: 0.3 }, b);
    L.svg("circle", { cx: x, cy: y, r: rayon, fill: "url(#acier)", stroke: "#111" }, b);
    L.texte(b, x, y + 0.5, texte, { "font-size": texte.length > 2 ? 7 : 10, "font-weight": 700, fill: "#eef" });
    L.glissable(b, { soulever: false, debut: () => ({ x, y }), toucher: action });
    return b;
  };

  L.decor_circuit = function (g, numero) {
    // Dessine le décor ; le pense-bête est collé sur le mur, en haut à gauche.
    mur(g);
    plan(g);
    g.prises_libres = L.PRISES_MUR.map((p) => ({ ...p }));
    L.svg("text", { x: 1000, y: 30, "text-anchor": "end", class: "numero-paillasse" }, g).textContent = `Paillasse ${numero + 1}`;
    return { pense_bete: L.decor.pense_bete(g, 24, 12, 300, 126) };
  };
})(window.Labo);

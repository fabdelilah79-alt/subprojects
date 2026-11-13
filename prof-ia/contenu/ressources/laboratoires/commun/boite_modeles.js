/*
Rôle : boîte de modèles moléculaires ouverte sur la paillasse (casiers de boules : carbone noir à 4 trous, hydrogène blanc
       à 1 trou, oxygène rouge à 2 trous, azote bleu à 3 trous ; bâtonnets et ressorts) et atelier d'assemblage à côté :
       on prend une boule dans un casier et on la lâche contre un trou libre du modèle (voir modele_atelier.js).
Reçoit : le contexte de la paillasse et { x (gauche de la boîte), sol, cx, cy (centre du modèle), fait, dire }.
Produit : Labo.boite_modeles(ctx, reglage) -> l'atelier (modele_atelier.js) ; bouton « Tout démonter ».
Utilisé par : les simulations de chimie (géométrie des molécules).
*/
(function (L) {
  const CASIERS = [["C", "carbone"], ["H", "hydrogène"], ["O", "oxygène"], ["N", "azote"]];

  function boule(g, el, x, y, k = 1) {
    // Boule vue de face (même rendu que dans le modèle).
    L.svg("circle", { cx: x, cy: y, r: L.MOLECULE_3D.R[el] * k, fill: `url(#boule-${el})`, stroke: "#222", "stroke-width": 0.6 }, g);
  }

  function boite(g, x, sol) {
    // Boîte en plastique transparent vue de biais : fond, cloisons, casier des bâtonnets et des ressorts.
    L.svg("ellipse", { cx: x + 110, cy: sol + 1, rx: 118, ry: 6, fill: "#000", opacity: 0.28 }, g);
    L.svg("path", { d: `M${x} ${sol} L${x + 16} ${sol - 70} H${x + 204} L${x + 220} ${sol} Z`, fill: "#e8eef1", stroke: "#9aa8b0" }, g);
    for (let k = 1; k < 4; k++) L.svg("line", { x1: x + k * 55, y1: sol, x2: x + 16 + k * 47, y2: sol - 70, stroke: "#b6c3ca" }, g);
    L.svg("rect", { x, y: sol - 16, width: 220, height: 16, fill: "rgba(205,228,236,0.6)", stroke: "#9aa8b0" }, g);
    L.texte(g, x + 110, sol - 5, "MODÈLES MOLÉCULAIRES", { "font-size": 7, "font-weight": 700, fill: "#33414b" });
    for (let i = 0; i < 6; i++) L.svg("line", { x1: x + 236 + i * 6, y1: sol - 4, x2: x + 250 + i * 6, y2: sol - 44, stroke: "#c9ccd0", "stroke-width": 4, "stroke-linecap": "round" }, g);
  }

  L.boite_modeles = function (ctx, { x, sol, cx, cy, fait, dire }) {
    // Casiers de boules (on en prend autant qu'on veut) ; l'atelier reçoit la boule lâchée.
    boite(ctx.fond, x, sol);
    const atelier = L.atelier_modele(ctx, { cx, cy, r: 190, fait, dire });
    CASIERS.forEach(([el, nom], k) => {
      const cx0 = x + 34 + k * 51, cy0 = sol - 40, tas = L.svg("g", {}, ctx.fond);
      [[-9, 6], [9, 6], [0, -4]].forEach(([dx, dy]) => boule(tas, el, cx0 + dx, cy0 + dy, 0.62));
      L.texte(ctx.fond, cx0, sol - 22, nom, { "font-size": 6.5, fill: "#33414b" });
      const prise = L.svg("g", { class: `casier casier-${el}`, role: "button", "aria-label": nom }, ctx.objets);
      L.svg("rect", { x: cx0 - 24, y: cy0 - 24, width: 48, height: 40, fill: "#000", opacity: 0 }, prise);
      let tenue = null;
      L.glissable(prise, {
        soulever: false, debut: () => ({ x: cx0, y: cy0 }),
        saisir: () => { tenue = L.svg("g", { "pointer-events": "none" }, ctx.haut); },
        deplacer: (p) => { tenue.replaceChildren(); boule(tenue, el, p.x, p.y); },
        lacher: (p) => { tenue.remove(); atelier.accrocher(el, p); },
      });
    });
    L.bouton_texte(ctx.haut, cx, sol + 2, "Tout démonter", () => { atelier.vider(); dire(""); });
    return atelier;
  };
})(window.Labo);

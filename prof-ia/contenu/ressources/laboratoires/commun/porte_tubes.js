/*
Rôle : porte-tubes en plastique blanc aux vraies dimensions : socle, deux montants, plateau percé de trous à 70 mm du
       socle. Les tubes passent dans les trous et reposent sur le socle ; la face avant du plateau passe devant eux.
Reçoit : le contexte de la paillasse et { x (milieu), sol (y de la paillasse, px), e (px/mm), n (nombre de places), pas (mm) }.
Produit : Labo.porte_tubes(ctx, reglage) -> places [{ x, y, porte : true }] (y : fond intérieur d'un tube posé, pour
          Labo.manipuler(..., { supports })).
Utilisé par : les simulations de chimie (tubes à essai).
*/
(function (L) {
  const BLANC = "#f2f3f0", OMBRE = "#c9ccc6", TRAIT = "#a7aba3";

  function arriere(g, W) {
    // Ombre, socle, montants et bord arrière du plateau (derrière les tubes) ; repère en mm, socle en y = 0.
    L.svg("ellipse", { cx: 3, cy: 1, rx: W / 2 + 4, ry: 4, fill: "#000", opacity: 0.28 }, g);
    L.svg("path", { d: `M${-W / 2} -5 L${-W / 2 + 3} -9 H${W / 2 - 3} L${W / 2} -5 Z`, fill: OMBRE }, g);
    L.svg("rect", { x: -W / 2, y: -5, width: W, height: 5, rx: 1, fill: BLANC, stroke: TRAIT, "stroke-width": 0.4 }, g);
    for (const s of [-1, 1]) L.svg("rect", { x: s > 0 ? W / 2 - 5 : -W / 2 + 1, y: -70, width: 4, height: 65, fill: "#e6e8e3", stroke: TRAIT, "stroke-width": 0.4 }, g);
    L.svg("rect", { x: -W / 2, y: -75, width: W, height: 1.5, fill: OMBRE }, g);
  }

  function avant(g, W, xs) {
    // Plateau vu un peu d'en haut : face supérieure percée (on voit les tubes dans les trous), puis face avant.
    const trous = xs.map((x) => `M${x - 8.6} -72 a8.6 1.9 0 1 0 17.2 0 a8.6 1.9 0 1 0 -17.2 0 Z`).join(" ");
    L.svg("path", { d: `M${-W / 2} -70 L${-W / 2 + 2} -74.5 H${W / 2 - 2} L${W / 2} -70 Z ${trous}`, fill: "#fbfbf8", stroke: TRAIT, "stroke-width": 0.4, "fill-rule": "evenodd" }, g);
    L.svg("rect", { x: -W / 2, y: -70, width: W, height: 7, rx: 0.8, fill: BLANC, stroke: TRAIT, "stroke-width": 0.4 }, g);
    L.svg("rect", { x: -W / 2 + 1, y: -64.6, width: W - 2, height: 1.2, fill: OMBRE, opacity: 0.6 }, g);
  }

  L.porte_tubes = function (ctx, { x, sol, e = 1.6, n = 3, pas = 30 }) {
    // Construit le porte-tubes et renvoie ses places.
    const W = n * pas + 16, xs = Array.from({ length: n }, (_, k) => (k - (n - 1) / 2) * pas);
    const g_a = L.svg("g", { class: "porte-tubes", "pointer-events": "none" }, ctx.fond), g_v = L.svg("g", { class: "porte-tubes-avant", "pointer-events": "none" }, ctx.devant);
    arriere(g_a, W); avant(g_v, W, xs);
    L.placer(g_a, x, sol, e); L.placer(g_v, x, sol, e);
    return xs.map((dx) => ({ x: x + dx * e, y: sol - 6 * e, porte: true }));
  };
})(window.Labo);

/*
Rôle : règle de ±15 cm fixée devant le rail, sous le mobile, et ses deux curseurs témoins (feutre) : l'aiguille du mobile
       les pousse, ils restent aux positions extrêmes atteintes. Touchés, ils reviennent tous les deux contre l'aiguille.
       L'amplitude se lit : (position du témoin de droite − position du témoin de gauche) / 2.
Reçoit : le groupe SVG ; à chaque pas, la position x du mobile (m, 0 à l'équilibre) ; sur_remise() (facultatif).
Produit : Labo.temoins(g, { sur_remise }) -> { suivre(x), dessiner(x), remettre(x), xmin, xmax (m), sur_main() (appelée quand l'élève
          les remet, à remplacer) }.
Utilisé par : poste_resonance.js.
*/
(function (L) {
  L.temoins = function (g, { sur_remise = () => {} } = {}) {
    // Règle graduée fixée au rail par deux pattes, aiguille, deux témoins ; redessinés à chaque image.
    const D = L.banc_ressort_dessin, px = 1000 * D.MM, x0 = D.X_EQ + D.LONG / 2, y = D.HAUT + 16, t = { xmin: 0, xmax: 0 };
    for (const dx of [-62, 58]) L.svg("rect", { x: x0 + dx, y: D.HAUT + 11, width: 4, height: y - D.HAUT - 9, fill: "#3b4046" }, g);
    L.svg("rect", { x: x0 - 66, y, width: 132, height: 10, fill: "#f3e7c9", stroke: "#a88b55", "stroke-width": 0.6 }, g);
    for (let cm = -15; cm <= 15; cm++) { const x = x0 + cm * 0.01 * px; L.svg("line", { x1: x, y1: y + 10, x2: x, y2: y + 10 - (cm % 5 ? 2.5 : 5), stroke: "#2b2416", "stroke-width": 0.4 }, g); if (cm % 5 === 0) L.texte(g, x, y + 5, String(cm).replace("-", "−"), { "font-size": 4.5, fill: "#2b2416" }); }
    t.sur_main = () => {};
    const vue = L.svg("g", { class: "temoins", role: "button", "aria-label": "Remettre les témoins" }, g);
    t.suivre = (x) => { t.x = x; t.xmin = Math.min(t.xmin, x); t.xmax = Math.max(t.xmax, x); };
    t.remettre = (x) => { t.xmin = t.xmax = x; sur_remise(); };
    t.dessiner = (x) => {
      vue.replaceChildren();
      for (const [v, dx] of [[t.xmin, -5], [t.xmax, 0]]) L.svg("rect", { x: x0 + v * px + dx, y: y - 3, width: 5, height: 9, rx: 1, fill: "#c62828", stroke: "#5a1010", "stroke-width": 0.5 }, vue);
      L.svg("line", { x1: x0 + x * px, y1: D.HAUT + 6, x2: x0 + x * px, y2: y + 4, stroke: "#222", "stroke-width": 1 }, vue);
      L.svg("rect", { x: x0 - 70, y: y - 6, width: 140, height: 20, fill: "#000", opacity: 0.001 }, vue);
    };
    L.glissable(vue, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { t.remettre(t.x || 0); t.sur_main(); } });
    return t;
  };
})(window.Labo);

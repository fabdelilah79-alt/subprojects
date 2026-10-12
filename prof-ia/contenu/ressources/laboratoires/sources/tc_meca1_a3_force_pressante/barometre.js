/*
Rôle : baromètre anéroïde accroché au mur : cadran à deux échelles (hPa à l'extérieur, mmHg à l'intérieur),
       aiguille sur la pression du jour (1006 hPa, soit 754,6 mmHg).
Reçoit : le groupe SVG, le centre et le rayon du cadran.
Produit : Labo.barometre(parent, x, y, rayon).
Utilisé par : poste_liquide.js.
*/
(function (L) {
  const PRESSION_HPA = 1006;
  const HPA_PAR_MMHG = 1.33322;
  const angle = (hpa) => ((hpa - 1000) * 2.7 * Math.PI) / 180;
  const point = (r, a) => ({ x: r * Math.sin(a), y: -r * Math.cos(a) });

  function graduations(g, r, debut, fin, pas, conversion, longueur, texte_tous) {
    // Trace une échelle circulaire (hPa ou mmHg) et ses nombres.
    for (let v = debut; v <= fin; v += pas) {
      const a = angle(conversion(v));
      const grand = v % texte_tous === 0, moyen = v % (texte_tous / 2) === 0;
      const l = grand ? longueur : moyen ? longueur * 0.65 : longueur * 0.4;
      const p1 = point(r, a), p2 = point(r - l, a);
      L.svg("line", { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, stroke: "#1a1a1a", "stroke-width": grand ? 0.8 : 0.4 }, g);
      if (grand) { const t = point(r - longueur - 6, a); L.texte(g, t.x, t.y, String(v), { class: "graduation", "font-size": 6 }); }
    }
  }

  L.barometre = function (parent, x, y, r) {
    // Dessine le baromètre complet.
    const g = L.svg("g", { transform: `translate(${x} ${y})`, filter: "url(#ombre)" }, parent);
    L.svg("circle", { r: r + 8, fill: "url(#laiton)" }, g);
    L.svg("circle", { r: r + 2, fill: "#7a5512" }, g);
    L.svg("circle", { r, fill: "#fbfaf4" }, g);
    graduations(g, r - 2, 950, 1050, 1, (v) => v, 9, 10);
    L.svg("circle", { r: r - 27, fill: "none", stroke: "#999", "stroke-width": 0.4 }, g);
    graduations(g, r - 28, 715, 785, 1, (v) => v * HPA_PAR_MMHG, 5, 10);
    L.texte(g, 0, r * 0.4, "hPa (extérieur)", { class: "graduation", "font-size": 5.5 });
    L.texte(g, 0, r * 0.49, "mmHg (intérieur)", { class: "graduation", "font-size": 5.5 });
    L.texte(g, 0, r * 0.66, "BAROMÈTRE", { class: "graduation", "font-size": 6.5, "letter-spacing": 1 });
    const a = angle(PRESSION_HPA), bout = point(r - 6, a), queue = point(-12, a);
    L.svg("line", { x1: queue.x, y1: queue.y, x2: bout.x, y2: bout.y, stroke: "#151515", "stroke-width": 1.4, "stroke-linecap": "round" }, g);
    L.svg("circle", { r: 3.5, fill: "url(#laiton)", stroke: "#4d3509", "stroke-width": 0.6 }, g);
    L.svg("path", { d: `M${-r * 0.7} ${-r * 0.55} A${r} ${r} 0 0 1 ${r * 0.2} ${-r * 0.9}`, stroke: "#fff", "stroke-width": 6, fill: "none", opacity: 0.35 }, g);
    return g;
  };
})(window.Labo);

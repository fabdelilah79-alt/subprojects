/*
Rôle : dessin d'un palet autoporteur vu en perspective, pour les systèmes de plusieurs mobiles sur la table à coussin
       d'air : ombre, flanc d'acier, dessus, surcharge éventuelle en laiton, tube porte-électrode et câble vers l'éclateur.
Reçoit : le groupe SVG, le point de l'écran sous le centre du palet (avec k, l'échelle de la perspective), le rayon (mm)
         et { surcharge (oui / non), etiquette (lettre écrite sur le palet) }.
Produit : Labo.dessiner_palet(groupe, p, rayon_mm, options).
Utilisé par : palets_solidaires.js, explosion.js, choc.js.
*/
(function (L) {
  const ECLATEUR = { x: 810, y: 440 };

  L.dessiner_palet = function (g, p, r, { surcharge = false, etiquette = null } = {}) {
    // Un palet : ombre, flanc, dessus ; surcharge en laiton posée dessus ; tube, câble ; lettre sur le flanc.
    const rx = r * p.k, ry = rx * 0.52, haut = surcharge ? 12 : 6;
    L.svg("ellipse", { cx: p.x + 4, cy: p.y + 4, rx: rx * 1.05, ry: ry * 1.05, fill: "#000", opacity: 0.25, filter: "url(#flou)" }, g);
    L.svg("path", { d: `M${p.x - rx} ${p.y - 6} V${p.y} A${rx} ${ry} 0 0 0 ${p.x + rx} ${p.y} V${p.y - 6}`, fill: "url(#acier)" }, g);
    L.svg("ellipse", { cx: p.x, cy: p.y - 6, rx, ry, fill: "url(#metal-h)", stroke: "#2a2e33", "stroke-width": 1.4 }, g);
    if (surcharge) {
      L.svg("path", { d: `M${p.x - rx * 0.7} ${p.y - 12} V${p.y - 7} A${rx * 0.7} ${ry * 0.7} 0 0 0 ${p.x + rx * 0.7} ${p.y - 7} V${p.y - 12}`, fill: "url(#laiton)" }, g);
      L.svg("ellipse", { cx: p.x, cy: p.y - 12, rx: rx * 0.7, ry: ry * 0.7, fill: "url(#laiton-haut)", stroke: "#7a5b14", "stroke-width": 0.8 }, g);
    }
    if (etiquette) L.texte(g, p.x, p.y - 1, etiquette, { "font-size": 8, "font-weight": 700, fill: "#f1f1ec" });
    L.tige(g, `M${p.x} ${p.y - haut} V${p.y - 40}`, 4);
    L.svg("path", { d: `M${p.x} ${p.y - 40} C${p.x} ${p.y - 120} 740 300 ${ECLATEUR.x} ${ECLATEUR.y}`, fill: "none", stroke: "#222", "stroke-width": 2 }, g);
  };
})(window.Labo);

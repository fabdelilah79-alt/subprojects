/*
Rôle : accessoires dessinés avec une pièce de verrerie, dans son repère (mm) : robinet d'ampoule à décanter (clé en
       PTFE bleu, ouverte dans l'axe, fermée en travers), col rodé (verre dépoli), bouchon, pied hexagonal d'éprouvette, tubulure latérale d'une fiole à vide,
       étiquette collée (et ses pictogrammes de danger).
Reçoit : le groupe du récipient (repère en mm), son profil et son état { bouchon, robinet, etiquette }.
Produit : Labo.dessin_accessoires(g, profil, etat) (appelée par verrerie_rendu.js).
Utilisé par : verrerie_rendu.js.
*/
(function (L) {
  function robinet(g, pr, ouvert) {
    // Boisseau du robinet (verre épais), clé en PTFE ; la poignée est dans l'axe quand le robinet est ouvert.
    const h = pr.extras.robinet;
    L.svg("rect", { x: -5, y: -h - 5, width: 10, height: 10, rx: 2, fill: "rgba(210,232,240,0.8)", stroke: "rgba(120,150,160,0.9)", "stroke-width": 0.4 }, g);
    L.svg("rect", { x: -9, y: -h - 2.2, width: 18, height: 4.4, rx: 1.5, fill: "#2f6fb8", stroke: "#1d3f6b", "stroke-width": 0.4 }, g);
    if (ouvert) L.svg("rect", { x: 9, y: -h - 1, width: 2, height: 2, fill: "#1d3f6b" }, g);
    L.svg("rect", ouvert ? { x: 10, y: -h - 6, width: 3.4, height: 12, rx: 1.2, fill: "#2f6fb8", stroke: "#1d3f6b", "stroke-width": 0.4 } : { x: 10, y: -h - 1.7, width: 12, height: 3.4, rx: 1.2, fill: "#2f6fb8", stroke: "#1d3f6b", "stroke-width": 0.4 }, g);
  }

  function bouchon(g, pr) {
    // Bouchon rodé en PTFE, enfoncé dans le col.
    const H = pr.H, r = pr.r(H);
    L.svg("path", { d: `M${-r + 0.6} ${-H + 9} L${-r - 1.5} ${-H - 3} H${r + 1.5} L${r - 0.6} ${-H + 9} Z`, fill: "#3b7cc4", stroke: "#1d3f6b", "stroke-width": 0.4 }, g);
    L.svg("rect", { x: -r - 3, y: -H - 7, width: 2 * r + 6, height: 5, rx: 1.5, fill: "#2f6fb8", stroke: "#1d3f6b", "stroke-width": 0.4 }, g);
  }

  function etiquette(g, pr, texte) {
    // Étiquette blanche collée sur le verre, à mi-hauteur.
    const h = pr.H * (pr.extras.etiquette_h || 0.42), r = Math.min(pr.r(h) * 0.8, 16);
    L.svg("rect", { x: -r, y: -h - 4, width: 2 * r, height: 8, rx: 0.8, fill: "#fbfaf3", stroke: "#cfcab8", "stroke-width": 0.3 }, g);
    L.svg("text", { x: 0, y: -h + 1.2, "font-size": Math.min(3.6, (3.4 * r) / Math.max(4, texte.length * 0.95)), "text-anchor": "middle", "font-weight": 700, fill: "#23315a", "font-family": "sans-serif" }, g).textContent = texte;
  }

  function tige(g, pr, etat) {
    // Tige de l'ampoule sous le robinet : vide, sauf quand le liquide s'écoule.
    const h = pr.extras.robinet;
    if (etat.coule) L.svg("rect", { x: -1.4, y: -h, width: 2.8, height: h, fill: L.rgb(etat.coule), opacity: 0.85 }, g);
    L.svg("path", { d: `M-2.8 ${-h} V-1 L-1.6 0 H1.6 L2.8 -1 V${-h}`, fill: "rgba(200,225,233,0.35)", stroke: "rgba(120,150,160,0.85)", "stroke-width": 0.4 }, g);
  }

  L.dessin_accessoires = function (g, pr, etat) {
    // Ajoute ce qui va avec la pièce.
    const x = pr.extras;
    if (x.rode) L.svg("rect", { x: -pr.r(pr.H) - pr.t, y: -pr.H, width: 2 * (pr.r(pr.H) + pr.t), height: 12, fill: "#ffffff", opacity: 0.35 }, g);
    if (x.tige) tige(g, pr, etat);
    if (x.robinet) robinet(g, pr, etat.robinet && etat.robinet.ouvert);
    if (x.tubulure) L.svg("path", { d: `M${pr.r(x.tubulure) + pr.t - 0.5} ${-x.tubulure - 3.5} H${pr.r(x.tubulure) + 24} V${-x.tubulure + 3.5} H${pr.r(x.tubulure) + pr.t - 0.5}`, fill: "rgba(205,228,236,0.6)", stroke: "rgba(120,150,160,0.9)", "stroke-width": 0.5 }, g);
    if (x.pied) L.svg("path", { d: "M-24 3 L-18 0 H18 L24 3 L18 6 H-18 Z", fill: "rgba(205,228,236,0.85)", stroke: "rgba(120,150,160,0.9)", "stroke-width": 0.4 }, g);
    if (etat.bouchon) bouchon(g, pr);
    if (etat.etiquette) etiquette(g, pr, etat.etiquette);
    (etat.pictos || []).forEach((c, i, t) => L.pictogramme?.(g, (i - (t.length - 1) / 2) * 11, -pr.H * (pr.extras.etiquette_h || 0.42) - 11, 5, c));
  };
})(window.Labo);

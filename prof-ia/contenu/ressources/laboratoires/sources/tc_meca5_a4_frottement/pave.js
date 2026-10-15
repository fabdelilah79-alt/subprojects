/*
Rôle : pavés de 200 g que l'on fait glisser : l'un en bois brut, l'autre garni d'une semelle de caoutchouc ; dessinés posés
       à plat ou sur un plan incliné (rotation autour du milieu de leur face d'appui).
Reçoit : le groupe SVG, le point milieu de la face d'appui (px), l'angle (rad, positif vers le haut à droite), la matière.
Produit : Labo.dessiner_pave(groupe, p, angle, matiere) ; Labo.PAVES (masse, coefficients de frottement statique et dynamique).
Utilisé par : plan_incline.js, traction.js.
*/
(function (L) {
  const L_PX = 74, H_PX = 30;

  L.PAVES = {
    bois: { nom: "bois", masse_kg: 0.2, statique: 0.45, dynamique: 0.36, semelle: null },
    caoutchouc: { nom: "caoutchouc", masse_kg: 0.2, statique: 0.85, dynamique: 0.7, semelle: "#2b2b2b" },
  };

  L.dessiner_pave = function (g, p, angle, matiere) {
    // Pavé de bois (faces avant et dessus), semelle éventuelle, petit crochet sur la face droite.
    const d = (angle * -180) / Math.PI, m = L.PAVES[matiere], gr = L.svg("g", { transform: `translate(${p.x} ${p.y}) rotate(${d})`, class: `pave pave-${matiere}` }, g);
    L.svg("rect", { x: -L_PX / 2, y: -H_PX, width: L_PX, height: H_PX, fill: "url(#bois-face)", stroke: "#6b4a2a", "stroke-width": 0.8 }, gr);
    L.svg("path", { d: `M${-L_PX / 2} ${-H_PX} l6 -6 H${L_PX / 2 + 6} l-6 6 Z`, fill: "url(#bois)", stroke: "#6b4a2a", "stroke-width": 0.6 }, gr);
    if (m.semelle) L.svg("rect", { x: -L_PX / 2, y: -5, width: L_PX, height: 5, fill: m.semelle }, gr);
    L.svg("path", { d: `M${L_PX / 2} ${-H_PX / 2} h6 a3 3 0 1 1 0 0.1`, fill: "none", stroke: "url(#metal)", "stroke-width": 1.6 }, gr);
    L.texte(gr, 0, -H_PX / 2 - 2, `${m.nom} · 200 g`, { "font-size": 8, "font-weight": 700, fill: "#3b2a12" });
    return gr;
  };
  L.PAVE_TAILLE = { l: L_PX, h: H_PX };
})(window.Labo);

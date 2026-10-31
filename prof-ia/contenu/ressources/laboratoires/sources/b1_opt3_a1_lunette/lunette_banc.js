/*
Rôle : matériel de la maquette de lunette astronomique au banc d'optique : fenêtre ouverte sur le ciel de nuit (la Lune,
       des étoiles) ; la Lune dessinée pour la vue de l'œil ; tache de lumière
       et petite image de la Lune sur l'écran ; marche d'un faisceau parallèle incliné (échelle réelle : 1 cm = 8 px).
Reçoit : les groupes SVG, le banc (banc_optique.js) et les positions (cm sur le rail).
Produit : Labo.fenetre_lune(g) ; Labo.lune(g) (rayon 5 : vue à l'œil nu) ;
          Labo.ecran_lunette(g, T, { image, tache }) ; Labo.vue_ecran_lunette(g, { image, tache }) ; Labo.faisceau_lunette(g, banc, { lentilles, xfin, foyers }).
Utilisé par : poste_lunette.js.
*/
(function (L) {
  L.fenetre_lune = function (g) {
    // Fenêtre ouverte sur la nuit : ciel, étoiles, Lune, cadre, légende.
    L.svg("rect", { x: 30, y: 186, width: 120, height: 92, fill: "#0b1430", stroke: "#e8e8e8", "stroke-width": 6 }, g);
    for (const [x, y] of [[48, 200], [70, 232], [128, 206], [140, 258], [56, 262], [100, 196]]) L.svg("circle", { cx: x, cy: y, r: 0.9, fill: "#fff" }, g);
    L.lune(L.svg("g", { transform: "translate(104 236) scale(1.3)" }, g));
    L.texte(g, 90, 296, "la Lune, très éloignée", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
  };

  L.lune = function (g) {
    // Disque de la Lune (rayon 5), mers sombres placées sans symétrie (on voit si l'image est renversée), cratère clair.
    L.svg("circle", { cx: 0, cy: 0, r: 5, fill: "#ece6cf" }, g);
    for (const [x, y, rx, ry] of [[-1.6, -1.8, 1.6, 1.1], [0.9, -2.2, 1.1, 0.8], [-0.4, 0.4, 1.3, 0.9], [1.9, 0.6, 0.8, 1.2], [-2.6, 1.2, 0.7, 0.6]]) L.svg("ellipse", { cx: x, cy: y, rx, ry, fill: "#a9a18a" }, g);
    L.svg("circle", { cx: 0.8, cy: 3.4, r: 0.6, fill: "#fffbea" }, g);
  };

  L.ecran_lunette = function (g, T, { image, tache }) {
    // Sur l'écran : petite image de la Lune (diamètre en mm, flou en mm) ou tache ronde de lumière (diamètre en mm).
    g.replaceChildren();
    const c = T(0, 0);
    if (image) {
      const d = Math.max(image.diametre, image.flou);
      L.svg("ellipse", { cx: c.x, cy: c.y, rx: d / 2 + 3, ry: d + 6, fill: "#ffd54f", opacity: 0.35 }, g);
      L.svg("ellipse", { cx: c.x, cy: c.y, rx: d / 4 + 0.6, ry: d / 2 + 0.6, fill: "#ffc107", opacity: Math.min(1, (image.diametre / d) ** 2 + 0.15) }, g);
    }
    if (tache) L.svg("ellipse", { cx: c.x, cy: c.y, rx: tache / 4, ry: tache / 2, fill: "#ffc107", opacity: Math.min(0.9, 60 / (tache * tache)) + 0.1 }, g);
  };

  L.vue_ecran_lunette = function (g, { image, tache }) {
    // Vue rapprochée de l'écran (4 px par mm, carreaux de 1 cm) : image de la Lune (renversée, floue ou nette) ou tache.
    const flou = image ? Math.min(12, image.flou * 1.5) : 0;
    L.vue_instrument(g, { x: 660, y: 76, r: 66, titre: "vue rapprochée de l'écran", fond: "#8e8b82", G: 1, flou: 0, sujet: (s) => {
      for (let c = -80; c <= 80; c += 40) { L.svg("line", { x1: c, y1: -80, x2: c, y2: 80, stroke: "#a3a096", "stroke-width": 0.8 }, s); L.svg("line", { x1: -80, y1: c, x2: 80, y2: c, stroke: "#a3a096", "stroke-width": 0.8 }, s); }
      const f = L.svg("filter", { id: "flou_ecran_lunette", x: "-100%", y: "-100%", width: "300%", height: "300%" }, s), z = L.svg("g", { filter: "url(#flou_ecran_lunette)" }, s);
      L.svg("feGaussianBlur", { stdDeviation: flou.toFixed(2) }, f);
      if (image) L.lune(L.svg("g", { transform: `scale(${-image.diametre * 0.4})` }, z));
      if (tache) L.svg("circle", { cx: 0, cy: 0, r: tache * 2, fill: "#ffc107", opacity: Math.min(0.95, 0.2 + 400 / (tache * tache * 16)) }, z);
    } });
  };

  L.faisceau_lunette = function (g, b, { lentilles, xfin, foyers }) {
    // Trois rayons parallèles venus d'un point de la Lune (inclinés), foyers marqués sur l'axe.
    g.replaceChildren();
    const E = (q) => ({ x: b.px(q.x), y: b.axe - q.y * b.k });
    for (const [k, [x, n]] of foyers.entries()) { const p = E({ x, y: 0 }); L.svg("line", { x1: p.x, y1: p.y - 6, x2: p.x, y2: p.y + 6, stroke: "#ffd54f", "stroke-width": 1.4 }, g); L.texte(g, p.x + 2, p.y + (k ? 18 : -10), n, { "font-size": 8, "font-weight": 700, fill: "#ffd54f" }); }
    for (const r of L.marche_rayons({ x0: 2, hauteurs: [-2.2, 0, 2.2], pente: -0.02, lentilles, xfin })) L.rayon_lumineux(g, r.map(E), { couleur: "#ffb74d", largeur: 1.1, halo: false });
  };
})(window.Labo);

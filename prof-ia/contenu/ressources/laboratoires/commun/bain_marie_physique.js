/*
Rôle : bain-marie déjà chaud, aux vraies dimensions : plaque chauffante allumée, bécher de 600 mL contenant 400 mL d'eau
       à la température T, thermomètre à alcool posé contre la paroi. Trois places pour des tubes à essai : un tube plongé
       prend peu à peu la température de l'eau (et la réaction de la liqueur de Fehling se fait au-dessus de 60 °C) ;
       un tube sorti refroidit. La partie plongée des tubes est vue à travers l'eau.
Reçoit : le contexte de la paillasse (avec ctx.ecoulement) et { x (milieu), sol (y de la paillasse, px), e (px/mm), T (°C) }.
Produit : Labo.bain_marie_physique(ctx, reglage) -> { T, bain (récipient), places [{ x, y, bain : true }] }.
Utilisé par : les simulations de chimie (test du glucose) ; réaction : chimie_reactions.js.
*/
(function (L) {
  function thermometre(g, T) {
    // Thermomètre de 180 mm (repère en mm, réservoir en bas en (0, 0)), gradué de 0 à 100 °C sur 140 mm.
    const y0 = -12, y100 = -152, yT = y0 + ((y100 - y0) * T) / 100;
    L.svg("rect", { x: -3.5, y: -180, width: 7, height: 176, rx: 3.5, fill: "rgba(232,244,248,0.85)", stroke: "rgba(120,150,160,0.9)", "stroke-width": 0.4 }, g);
    L.svg("ellipse", { cx: 0, cy: -3, rx: 2.6, ry: 4.5, fill: "#d3262d" }, g);
    L.svg("rect", { x: -0.6, y: yT, width: 1.2, height: y0 - yT + 6, fill: "#d3262d" }, g);
    for (let t = 0; t <= 100; t += 5) {
      const y = y0 + ((y100 - y0) * t) / 100;
      L.svg("line", { x1: 1, x2: t % 10 ? 2.4 : 3.2, y1: y, y2: y, stroke: "#222", "stroke-width": 0.3 }, g);
      if (t % 20 === 0) L.svg("text", { x: -1.2, y: y + 1, "font-size": 2.6, "text-anchor": "end", fill: "#222", "font-family": "sans-serif" }, g).textContent = String(t);
    }
    L.svg("rect", { x: -2.6, y: -176, width: 1, height: 160, fill: "#fff", opacity: 0.5 }, g);
  }

  function eau_devant(g, bain, e) {
    // Mince couche d'eau et paroi avant du bécher, dessinées devant les tubes plongés.
    const V = bain.c.volume(), h = bain.pr.hauteur_de(V), r = bain.pr.r(h), x = bain.pose.x, y = bain.pose.y;
    L.svg("rect", { x: x - r * e, y: y - h * e, width: 2 * r * e, height: h * e, fill: "rgb(196,226,238)", opacity: 0.22 }, g);
    L.svg("ellipse", { cx: x, cy: y - h * e, rx: r * e, ry: 0.12 * r * e, fill: "none", stroke: "rgba(255,255,255,0.7)", "stroke-width": 1 }, g);
    L.svg("rect", { x: x - r * e * 0.78, y: y - bain.pr.H * e * 0.9, width: r * e * 0.12, height: bain.pr.H * e * 0.78, fill: "#fff", opacity: 0.16 }, g);
  }

  L.bain_marie_physique = function (ctx, { x, sol, e = 1.6, T = 80 }) {
    // Construit la plaque, le bécher d'eau chaude, le thermomètre, les places, et chauffe les tubes à chaque pas.
    const k = 1.5, g_p = L.svg("g", { class: "plaque-chauffante", "pointer-events": "none", transform: `translate(${x} ${sol}) scale(${k}) translate(${-x} ${-sol})` }, ctx.fond);
    L.dessin_plaque(g_p, x, sol, true);
    const fond = sol - 36 * k - 1.4 * e;
    const bain = L.recipient(ctx, { id: "bain_marie", profil: "becher_600", x, y: fond, contenu: { eau: 400 } });
    bain.g.setAttribute("pointer-events", "none");
    const g_t = L.svg("g", { class: "thermometre", "pointer-events": "none", transform: `translate(${x - 30 * e} ${fond - 4 * e}) rotate(-6) scale(${e})` }, ctx.objets);
    thermometre(g_t, T);
    eau_devant(L.svg("g", { class: "eau-bain", "pointer-events": "none" }, ctx.devant), bain, e);
    const places = [-12, 8, 28].map((dx) => ({ x: x + dx * e, y: fond - 1 * e, bain: true }));
    ctx.ecoulement.sur_pas((dt) => {
      for (const r of ctx.ecoulement.recipients) if (r !== bain && (r.place?.bain || (r.c.T ?? 20) > 20.5)) L.chauffer_contenu(r.c, r.place?.bain ? T : 20, dt);
    });
    return { T, bain, places };
  };
})(window.Labo);

/*
Rôle : bain-marie déjà chaud : plaque chauffante allumée (voyant rouge), bécher de 250 mL d'eau à 80 °C, thermomètre.
       Trois places pour des tubes à essai ; un tube plongé prend peu à peu la température de l'eau, un tube sorti refroidit.
Reçoit : la paillasse de chimie (avec ses places de tubes) et { x, bas, T }.
Produit : Labo.bain_marie(ctx, reglage) -> { T, places } ; les contenus des tubes sont chauffés toutes les 0,2 s
          (melange.chauffer) et la paillasse est prévenue quand un précipité progresse.
Utilisé par : les simulations de chimie (test de la liqueur de Fehling).
*/
(function (L) {
  const DT = 0.2;

  function plaque(g, x, bas) {
    // Plaque chauffante : boîtier blanc, plateau en fonte, bouton de réglage, voyant allumé.
    L.svg("ellipse", { cx: x + 4, cy: bas + 2, rx: 70, ry: 6, fill: "#000", opacity: 0.3 }, g);
    L.svg("rect", { x: x - 66, y: bas - 30, width: 132, height: 30, rx: 4, fill: "#e8eaea", stroke: "#a7adb0" }, g);
    L.svg("rect", { x: x - 60, y: bas - 36, width: 120, height: 8, rx: 2, fill: "#3b3f43" }, g);
    L.svg("circle", { cx: x + 44, cy: bas - 15, r: 7, fill: "#30353a" }, g);
    L.svg("line", { x1: x + 44, y1: bas - 15, x2: x + 48, y2: bas - 20, stroke: "#fff", "stroke-width": 1.4 }, g);
    L.svg("circle", { cx: x + 26, cy: bas - 15, r: 2.6, fill: "#ff3b2f" }, g);
    L.texte(g, x - 30, bas - 14, "PLAQUE CHAUFFANTE", { "font-size": 5.5, "font-weight": 700, fill: "#566066" });
  }

  function becher(fond, devant, x, bas) {
    // Bécher de 250 mL : arrière et eau dans le fond ; devant, une fine couche d'eau et la paroi avant (les tubes sont dedans).
    const haut = bas - 104, eau = bas - 74;
    L.svg("rect", { x: x - 46, y: eau, width: 92, height: bas - eau - 2, fill: "url(#eau)", opacity: 0.55 }, fond);
    L.svg("rect", { x: x - 46, y: eau, width: 92, height: bas - eau - 2, fill: "#9fdcef", opacity: 0.12, "pointer-events": "none" }, devant);
    L.svg("ellipse", { cx: x, cy: eau, rx: 46, ry: 3.5, fill: "#d6f2fb", opacity: 0.5, "pointer-events": "none" }, devant);
    L.svg("path", { d: `M${x - 48} ${haut} V${bas - 3} Q${x - 48} ${bas} ${x - 45} ${bas} H${x + 45} Q${x + 48} ${bas} ${x + 48} ${bas - 3} V${haut} l4 -4`, fill: "url(#verre)", stroke: "#9fb6be", "pointer-events": "none" }, devant);
    L.texte(devant, x - 30, bas - 92, "250 mL", { "font-size": 5.5, fill: "#ffffff", opacity: 0.85 });
  }

  function thermometre(g, x, bas, T) {
    // Thermomètre à alcool plongé dans l'eau, gradué de 0 à 100 °C (tous les 10 °C).
    const y0 = bas - 10, y100 = bas - 150, yT = y0 + ((y100 - y0) * T) / 100;
    L.svg("rect", { x: x - 4, y: y100 - 12, width: 8, height: y0 - y100 + 16, rx: 4, fill: "#f7fbfc", stroke: "#9fb6be" }, g);
    L.svg("circle", { cx: x, cy: y0 + 4, r: 4.5, fill: "#d3262d" }, g);
    L.svg("rect", { x: x - 1.2, y: yT, width: 2.4, height: y0 - yT + 2, fill: "#d3262d" }, g);
    for (let t = 0; t <= 100; t += 10) {
      const y = y0 + ((y100 - y0) * t) / 100;
      L.svg("line", { x1: x + 1.5, x2: x + 4, y1: y, y2: y, stroke: "#333", "stroke-width": 0.5 }, g);
      if (t % 20 === 0) L.texte(g, x + 10, y, String(t), { "font-size": 5.5, fill: "#2a2a2a" });
    }
    L.texte(g, x + 10, y100 - 9, "°C", { "font-size": 5.5, fill: "#2a2a2a" });
  }

  L.bain_marie = function (ctx, { x, bas, T = 80 }) {
    // Construit le bain-marie, ses trois places de tubes et le chauffage des tubes.
    plaque(L.svg("g", { class: "plaque-chauffante" }, ctx.fond), x, bas);
    const fond_eau = bas - 36;
    const g_thermo = L.svg("g", { class: "thermometre" }, ctx.devant);
    becher(L.svg("g", {}, ctx.fond), L.svg("g", {}, ctx.devant), x, fond_eau);
    thermometre(g_thermo, x + 34, fond_eau, T);
    const bain = { T, places: L.places_tubes(ctx, [-30, -8, 14].map((dx) => ({ x: x + dx, bas: fond_eau - 4, bain: true }))) };
    setInterval(() => {
      let change = false;
      for (const p of ctx.places) {
        if (!p.tube) continue;
        const m = p.tube.m, avant = m.avance;
        m.chauffer(p.bain ? T : 20, DT);
        if (m.avance - avant > 0.002 || (m.avance > 0 && m.avance < 1 && m.avance !== avant)) { p.tube.redessiner(); change = true; }
      }
      if (change) ctx.signaler();
    }, DT * 1000);
    return bain;
  };
})(window.Labo);

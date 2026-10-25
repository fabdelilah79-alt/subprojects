/*
Rôle : paillasse « peut-on voir la lumière ? » : caisse vitrée posée sur la paillasse (fond noir, vue un peu de biais),
       laser de classe 2 sur son support, écran blanc sur pied, coupelle avec un bâton d'encens. « Encens » allume le bâton :
       sa fumée remplit peu à peu la caisse (20 s), puis se dissipe (30 s). Sans fumée, on ne voit que la tache sur l'écran ;
       dans la fumée, les particules diffusent un peu de lumière vers l'œil et le trajet rectiligne du faisceau apparaît.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_fumee(g) -> { pense_bete } ; fait « fumee » = { sans, avec }.
Utilisé par : simulation.js.
*/
(function (L) {
  const X0 = 250, X1 = 770, Y0 = 250, Y1 = 480, P = 34, YL = 360;

  function caisse(g) {
    // Ombre, fond et côtés noirs, dessus, cadre d'aluminium ; supports du laser et de l'écran ; coupelle d'encens.
    L.ombre_sol(g, (X0 + X1) / 2 + 10, Y1 + 2, (X1 - X0) / 2 + 20, 10, 0.5);
    L.svg("path", { d: `M${X0} ${Y0} L${X0 + P} ${Y0 - P} H${X1 + P} L${X1} ${Y0} Z`, fill: "#2a2f34", stroke: "#8d969c" }, g);
    L.svg("path", { d: `M${X1} ${Y0} L${X1 + P} ${Y0 - P} V${Y1 - P} L${X1} ${Y1} Z`, fill: "#15191c", stroke: "#8d969c" }, g);
    L.svg("rect", { x: X0, y: Y0, width: X1 - X0, height: Y1 - Y0, fill: "#0b0e10" }, g);
    L.svg("path", { d: `M${X0 + P} ${Y0 - P} V${Y1 - P} H${X1 + P}`, fill: "none", stroke: "#2c3237" }, g);
    L.svg("rect", { x: X0 + 70, y: YL + 10, width: 10, height: Y1 - YL - 18, fill: "url(#metal)" }, g);
    L.svg("ellipse", { cx: X0 + 75, cy: Y1 - 8, rx: 28, ry: 6, fill: "url(#acier)" }, g);
    L.svg("rect", { x: X1 - 70, y: YL - 70, width: 14, height: 140, fill: "#f4f4ee", stroke: "#bbb" }, g);
    L.svg("rect", { x: X1 - 65, y: YL + 70, width: 4, height: Y1 - YL - 76, fill: "url(#metal)" }, g);
    L.svg("ellipse", { cx: X1 - 63, cy: Y1 - 6, rx: 18, ry: 4, fill: "url(#acier)" }, g);
    L.svg("ellipse", { cx: 430, cy: Y1 - 8, rx: 20, ry: 5, fill: "#7a5a33" }, g);
    L.svg("line", { x1: 428, y1: Y1 - 10, x2: 444, y2: Y1 - 70, stroke: "#5a3a1e", "stroke-width": 2.4 }, g);
  }

  function vitre(g) {
    // Vitre avant : reflets obliques, cadre.
    L.svg("rect", { x: X0, y: Y0, width: X1 - X0, height: Y1 - Y0, fill: "none", stroke: "#a9b2b8", "stroke-width": 5 }, g);
    for (const x of [X0 + 60, X0 + 300]) L.svg("path", { d: `M${x} ${Y0 + 3} l60 0 l-120 ${Y1 - Y0 - 6} l-60 0 Z`, fill: "#fff", opacity: 0.05 }, g);
  }

  L.poste_fumee = function (g) {
    // Caisse, fumée, faisceau visible selon la fumée, tache, vitre ; touches ; faits.
    const { pense_bete } = L.decor_circuit(g, 0), e = { laser: false, brule: 0, fumee: 0, sans: 0, avec: 0, t: 0 };
    caisse(L.svg("g", {}, g));
    const dyn = L.svg("g", { "pointer-events": "none" }, g);
    vitre(L.svg("g", { "pointer-events": "none" }, g));
    L.texte(g, (X0 + X1) / 2, Y1 + 22, "caisse vitrée à fond noir : vous la regardez de face, le faisceau passe devant vous", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
    L.bouton_texte(g, 420, 548, "Laser", () => { e.laser = !e.laser; });
    L.bouton_texte(g, 512, 548, "Encens", () => { e.brule = 20; });
    let graine = 5;
    const hasard = () => ((graine = (graine * 16807) % 2147483647) / 2147483647), grains = Array.from({ length: 320 }, () => ({ x: X0 + 10 + hasard() * (X1 - X0 - 20), y: Y0 + 10 + hasard() * (Y1 - Y0 - 20), v: hasard() }));
    let avant = null;
    const image = (ms) => {
      const dt = avant === null ? 0 : Math.min(0.05, (ms - avant) / 1000); avant = ms; e.t += dt;
      if (e.brule > 0) { e.brule -= dt; e.fumee = Math.min(1, e.fumee + dt / 6); } else e.fumee = Math.max(0, e.fumee - dt / 30);
      dyn.replaceChildren();
      for (const p of grains) L.svg("circle", { cx: p.x + 6 * Math.sin(e.t * 0.3 + p.v * 6), cy: p.y - 4 * Math.sin(e.t * 0.2 + p.v * 9), r: 1.3, fill: "#a3acb4", opacity: 0.3 * e.fumee }, dyn);
      if (e.brule > 0) { L.svg("circle", { cx: 444, cy: Y1 - 71, r: 2.5, fill: "#ff7a2a" }, dyn); L.svg("path", { d: `M444 ${Y1 - 74} c${8 * Math.sin(e.t)} -20 -10 -30 0 -50 c10 -20 -6 -30 4 -60`, fill: "none", stroke: "#c9d0d6", "stroke-width": 4, opacity: 0.35 }, dyn); }
      L.laser_module(dyn, { x: X0 + 112, y: YL, allume: e.laser, longueur: 76 });
      if (e.laser) {
        L.rayon_lumineux(dyn, [{ x: X0 + 114, y: YL }, { x: X1 - 70, y: YL }], { opacite: Math.min(1, e.fumee * 1.2), fleches: false });
        L.svg("circle", { cx: X1 - 71, cy: YL, r: 3.5, fill: "#ff3b2a" }, dyn); L.svg("circle", { cx: X1 - 71, cy: YL, r: 9, fill: "#ff3b2a", opacity: 0.3 }, dyn);
        if (e.fumee < 0.05) e.sans += dt; if (e.fumee > 0.5) e.avec += dt;
      }
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("fumee", { sans: e.sans > 1, avec: e.avec > 1 }), 250);
    return { pense_bete };
  };
})(window.Labo);

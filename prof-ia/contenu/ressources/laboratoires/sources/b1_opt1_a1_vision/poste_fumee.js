/*
Rôle : paillasse « peut-on voir la lumière ? » : caisse noire à vitre (vue de face), laser de classe 2 à gauche, écran
       blanc à droite ; « Fumée » remplit la caisse de fumée d'encens qui se dissipe lentement (environ 30 s) : sans fumée,
       on ne voit que la tache sur l'écran ; avec la fumée, les particules diffusent un peu de lumière vers l'œil et le trajet
       rectiligne du faisceau apparaît.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_fumee(g) -> { pense_bete } ; fait « fumee » = { sans (laser allumé sans fumée vu), avec (laser allumé dans la fumée vu) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const X0 = 250, X1 = 790, Y0 = 220, Y1 = 470, YL = 350;

  function caisse(g) {
    // Fond noir, laser sur son support, écran blanc ; cadre de la caisse.
    L.svg("rect", { x: X0, y: Y0, width: X1 - X0, height: Y1 - Y0, rx: 4, fill: "#0d1114", stroke: "#2d3338", "stroke-width": 6 }, g);
    L.svg("rect", { x: X0 + 30, y: YL - 12, width: 70, height: 24, rx: 3, fill: "#2b3035", stroke: "#000" }, g);
    L.svg("rect", { x: X0 + 50, y: YL + 12, width: 20, height: Y1 - YL - 15, fill: "#3a3f44" }, g);
    L.texte(g, X0 + 65, YL, "LASER", { "font-size": 7, "font-weight": 700, fill: "#ffd54f" });
    L.svg("rect", { x: X1 - 50, y: YL - 80, width: 12, height: 160, fill: "#f4f4ee", stroke: "#999" }, g);
    L.svg("rect", { x: X1 - 44, y: YL + 80, width: 4, height: Y1 - YL - 83, fill: "#3a3f44" }, g);
  }

  L.poste_fumee = function (g) {
    // Caisse, fumée (particules), faisceau visible selon la fumée, tache ; vitre ; touches ; faits.
    const { pense_bete } = L.decor_circuit(g, 0), e = { laser: false, fumee: 0, sans: 0, avec: 0 };
    caisse(L.svg("g", {}, g));
    const dyn = L.svg("g", { "pointer-events": "none" }, g);
    L.svg("rect", { x: X0 + 3, y: Y0 + 3, width: X1 - X0 - 6, height: 40, fill: "#fff", opacity: 0.05 }, g);
    L.texte(g, (X0 + X1) / 2, Y1 + 18, "caisse noire à vitre — vous regardez de face, le faisceau passe devant vous", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
    L.bouton_texte(g, 420, 548, "Laser", () => { e.laser = !e.laser; });
    L.bouton_texte(g, 512, 548, "Fumée", () => { e.fumee = 1; });
    let graine = 5;
    const hasard = () => ((graine = (graine * 16807) % 2147483647) / 2147483647), grains = Array.from({ length: 260 }, () => ({ x: X0 + 10 + hasard() * (X1 - X0 - 20), y: Y0 + 10 + hasard() * (Y1 - Y0 - 20) }));
    let avant = null;
    const image = (ms) => {
      const dt = avant === null ? 0 : Math.min(0.05, (ms - avant) / 1000); avant = ms;
      e.fumee = Math.max(0, e.fumee - dt / 30);
      dyn.replaceChildren();
      for (const p of grains) L.svg("circle", { cx: p.x, cy: p.y, r: 1.2, fill: "#9aa3ab", opacity: 0.35 * e.fumee }, dyn);
      if (e.laser) {
        L.rayon_lumineux(dyn, [{ x: X0 + 100, y: YL }, { x: X1 - 50, y: YL }], { opacite: Math.min(1, e.fumee * 1.2), fleches: false });
        L.svg("circle", { cx: X1 - 51, cy: YL, r: 4, fill: "#ff3b2a" }, dyn); L.svg("circle", { cx: X1 - 51, cy: YL, r: 9, fill: "#ff3b2a", opacity: 0.3 }, dyn);
        if (e.fumee < 0.05) e.sans += dt; if (e.fumee > 0.5) e.avec += dt;
      }
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("fumee", { sans: e.sans > 1, avec: e.avec > 1 }), 250);
    return { pense_bete };
  };
})(window.Labo);

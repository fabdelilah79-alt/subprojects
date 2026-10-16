/*
Rôle : thermistance CTN (10 kΩ à 25 °C, B = 3950 K) sur support, au bout d'un câble souple : l'élève fait glisser sa
       sonde dans un bécher d'eau glacée, d'eau à 20 °C ou d'eau chaude ; sa température tend vers celle du milieu
       (constante de temps 4 s) et sa résistance diminue quand la température augmente : R = R25·exp(B·(1/T − 1/T25)).
Reçoit : le circuit (circuit.js) et le réglage { id, x, y (support), bechers: [{ x, y, T (°C), nom }] }.
Produit : Labo.thermistance(c, reglage) -> composant { T (°C), R (Ω) } ; fait noté « ctn » = { T, milieu }.
Utilisé par : les postes des simulations de caractéristiques.
*/
(function (L) {
  const R25 = 10000, B = 3950, TAU = 4, AIR = 20;
  const resistance = (T) => R25 * Math.exp(B * (1 / (T + 273.15) - 1 / 298.15));

  function becher(g, b) {
    // Bécher d'eau (glaçons, vapeur selon la température) et son étiquette.
    L.svg("ellipse", { cx: b.x + 32, cy: b.y + 92, rx: 36, ry: 8, fill: "#000", opacity: 0.3 }, g);
    L.svg("rect", { x: b.x, y: b.y + 30, width: 64, height: 60, rx: 4, fill: b.T < 10 ? "#cfe8f5" : b.T > 40 ? "#bcdcea" : "#c4e2ee", opacity: 0.8 }, g);
    L.svg("rect", { x: b.x - 2, y: b.y, width: 68, height: 92, rx: 5, fill: "url(#verre)", stroke: "#9fb6be" }, g);
    if (b.T < 10) for (const [dx, dy] of [[10, 34], [30, 38], [44, 32]]) L.svg("rect", { x: b.x + dx, y: b.y + dy, width: 12, height: 10, rx: 2, fill: "#f2fbff", stroke: "#b5d7e6" }, g);
    if (b.T > 40) for (const dx of [16, 32, 48]) L.svg("path", { d: `M${b.x + dx} ${b.y - 4} q-5 -8 0 -16 q5 -8 0 -16`, fill: "none", stroke: "#fff", opacity: 0.5, "stroke-width": 2 }, g);
    L.texte(g, b.x + 32, b.y + 104, `${b.nom} (${b.T} °C)`, { "font-size": 8.5, "font-weight": 700, fill: "#e8e2cc" });
  }

  function dessiner_sonde(g, ancre, p) {
    // Câble souple du support à la sonde, perle noire de la thermistance.
    g.replaceChildren();
    L.svg("path", { d: `M${ancre.x} ${ancre.y} C${ancre.x} ${ancre.y + 60} ${p.x} ${p.y - 60} ${p.x} ${p.y}`, fill: "none", stroke: "#2b2d30", "stroke-width": 3 }, g);
    L.svg("rect", { x: p.x - 3, y: p.y - 22, width: 6, height: 22, rx: 2, fill: "#3a3d41" }, g);
    L.svg("circle", { cx: p.x, cy: p.y + 3, r: 5, fill: "#151618" }, g);
    L.svg("rect", { x: p.x - 10, y: p.y - 30, width: 20, height: 34, fill: "#000", opacity: 0.001 }, g);
  }

  L.thermistance = function (c, { id = "ctn", x, y, bechers }) {
    // Support à deux bornes, béchers, sonde déplaçable ; la température évolue et la résistance suit.
    const comp = { id, T: AIR, R: resistance(AIR), g: L.svg("g", { class: "thermistance" }, c.calque_composants) };
    bechers.forEach((b) => becher(comp.g, b));
    L.support_dipole(c, comp, x, y, "CTN 10 kΩ (25 °C)");
    L.texte(comp.g, x + 46, y + 18, "−θ", { "font-size": 11, "font-weight": 700, fill: "#333" });
    const ancre = { x: x + 46, y: y + 50 }, sonde = L.svg("g", { class: "sonde-ctn", role: "button", "aria-label": "Sonde de la thermistance" }, comp.g);
    let p = { x: x + 46, y: y + 120 }, milieu = null;
    dessiner_sonde(sonde, ancre, p);
    const dans = (q) => bechers.find((b) => q.x > b.x && q.x < b.x + 64 && q.y > b.y + 20 && q.y < b.y + 92) || null;
    L.glissable(sonde, { soulever: false, debut: () => ({ ...p }), deplacer: (q) => { p = q; dessiner_sonde(sonde, ancre, p); }, lacher: () => { milieu = dans(p); } });
    comp.dipoles = () => [{ a: "1", b: "2", g: 1 / comp.R, j: 0 }];
    let avant = null, dernier = comp.T;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.1, (t - avant) / 1000), cible = milieu ? milieu.T : AIR;
      avant = t;
      comp.T += (cible - comp.T) * (1 - Math.exp(-dt / TAU));
      if (Math.abs(comp.T - dernier) > 0.05) { dernier = comp.T; comp.R = resistance(comp.T); L.missions.noter("ctn", { T: Math.round(comp.T * 10) / 10, milieu: milieu ? milieu.nom : "air" }); c.calculer(); }
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    return c.ajouter(comp);
  };
})(window.Labo);

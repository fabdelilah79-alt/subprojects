/*
Rôle : paillasse « rails de Laplace » : deux rails de cuivre (écartés de l = 5,0 cm) sur une planche, tige de cuivre posée
       en travers, aimant en U (B = 0,10 T, vertical, sur 6 cm de rails) dont une branche passe au-dessus des rails et
       l'autre sous la planche ; générateur de courant. Quand la tige est dans l'entrefer, la force de Laplace F = I·l·B la
       pousse le long des rails (frottement : 8 mN ; masse 15 g) ; « Retourner » inverse le champ, « Replacer » ramène la tige.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_rails(g) -> { pense_bete } ; fait « rails » = { vus: { "sI:sB": sens du mouvement (+1 vers la droite) },
          immobile (courant trop faible vu) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const X0 = 290, X1 = 810, A0 = 500, A1 = 610, PX = 1833, YB = 396, YF = 444, B = 0.1, LR = 0.05, M = 0.015, FR = 0.008;

  function decor(fond, gen) {
    // Planche, rails, butées, câbles du générateur.
    L.svg("rect", { x: X0 - 10, y: 380, width: X1 - X0 + 20, height: 80, fill: "#c89b62", stroke: "#7a5530" }, fond);
    L.svg("rect", { x: X0 - 10, y: 460, width: X1 - X0 + 20, height: 12, fill: "#8d6337" }, fond);
    for (const y of [YB, YF]) { L.svg("line", { x1: X0, y1: y, x2: X1, y2: y, stroke: "#b86b2a", "stroke-width": 5 }, fond); L.svg("line", { x1: X0, y1: y - 1.5, x2: X1, y2: y - 1.5, stroke: "#f0b27a", "stroke-width": 1 }, fond); }
    for (const x of [X0 + 4, X1 - 4]) L.svg("rect", { x: x - 4, y: YB - 8, width: 8, height: YF - YB + 16, rx: 2, fill: "#3a3f44" }, fond);
    L.svg("path", { d: `M${gen.bornes.rouge.x + 4} ${gen.bornes.rouge.y} H260 V${YB} H${X0}`, fill: "none", stroke: "#c62828", "stroke-width": 2.6, "stroke-linejoin": "round" }, fond);
    L.svg("path", { d: `M${gen.bornes.noire.x + 4} ${gen.bornes.noire.y} H260 V${YF} H${X0}`, fill: "none", stroke: "#263238", "stroke-width": 2.6, "stroke-linejoin": "round" }, fond);
  }

  function aimant(g, sB) {
    // Coude de l'aimant (au fond), branche supérieure (au-dessus des rails), bout de la branche inférieure (sous la planche) ;
    // flèche du champ.
    g.replaceChildren();
    const haut = sB > 0 ? ["#2f6fd0", "S"] : ["#d63a2f", "N"], bas = sB > 0 ? ["#d63a2f", "N"] : ["#2f6fd0", "S"];
    L.svg("rect", { x: A0, y: 256, width: A1 - A0, height: 26, rx: 10, fill: "#7a7f86", stroke: "#333" }, g);
    L.svg("rect", { x: A0, y: 280, width: A1 - A0, height: 80, fill: haut[0], stroke: "#222" }, g);
    L.svg("rect", { x: A0, y: 280, width: A1 - A0, height: 80, fill: "#fff", opacity: 0.18 }, g);
    L.texte(g, (A0 + A1) / 2, 248, "aimant en U (B = 0,10 T)", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
    L.svg("rect", { x: A0, y: 360, width: A1 - A0, height: 20, fill: haut[0], stroke: "#222" }, g);
    L.svg("rect", { x: A0, y: 472, width: A1 - A0, height: 20, fill: bas[0], stroke: "#222" }, g);
    L.texte(g, (A0 + A1) / 2, 371, haut[1], { "font-size": 11, "font-weight": 700, fill: "#fff" });
    L.texte(g, (A0 + A1) / 2, 483, bas[1], { "font-size": 11, "font-weight": 700, fill: "#fff" });
    const y1 = sB > 0 ? 452 : 388, y2 = sB > 0 ? 388 : 452;
    L.svg("path", { d: `M${A1 + 14} ${y1} V${y2} M${A1 + 9} ${y2 + 7 * sB} L${A1 + 14} ${y2} L${A1 + 19} ${y2 + 7 * sB}`, fill: "none", stroke: "#1a3d7c", "stroke-width": 2 }, g);
    L.texte(g, A1 + 26, 420, "B", { "font-size": 11, "font-weight": 700, fill: "#1a3d7c" });
  }

  function tige(g, xr, sI) {
    // Tige de cuivre posée sur les rails ; petite flèche du sens du courant (de l'arrière vers l'avant si sI > 0).
    g.replaceChildren();
    L.svg("line", { x1: xr, y1: YB - 4, x2: xr, y2: YF + 4, stroke: "#8a4f1c", "stroke-width": 8, "stroke-linecap": "round" }, g);
    L.svg("line", { x1: xr - 1.5, y1: YB - 4, x2: xr - 1.5, y2: YF + 4, stroke: "#f0b27a", "stroke-width": 2 }, g);
    if (sI) { const yc = (YB + YF) / 2; L.svg("path", { d: `M${xr + 9} ${yc - 8 * sI} L${xr + 9} ${yc + 8 * sI} M${xr + 5} ${yc + 3 * sI} L${xr + 9} ${yc + 8 * sI} L${xr + 13} ${yc + 3 * sI}`, fill: "none", stroke: "#c62828", "stroke-width": 1.8 }, g); L.texte(g, xr + 20, yc, "I", { "font-size": 10, "font-weight": 700, fill: "#c62828" }); }
  }

  L.poste_rails = function (g) {
    // Matériel, dynamique de la tige (force de Laplace dans l'entrefer, frottement, butées), faits.
    const { pense_bete } = L.decor_circuit(g, 0), fond = L.svg("g", {}, g);
    const gen = L.generateur_courant(g, { x: 60, y: 290, max: 10, pas: 1, valeur: 6 }), gt = L.svg("g", {}, g), ga = L.svg("g", {}, g);
    decor(fond, gen);
    const e = { x: (A0 + A1) / 2, v: 0, sB: 1, x0: null, vus: {}, immobile: false };
    L.bouton_texte(g, 600, 548, "Retourner", () => { e.sB = -e.sB; aimant(ga, e.sB); });
    L.bouton_texte(g, 692, 548, "Replacer", () => { e.x = (A0 + A1) / 2; e.v = 0; e.x0 = null; });
    aimant(ga, e.sB);
    let avant = null;
    const image = (ms) => {
      const dt = avant === null ? 0 : Math.min(0.03, (ms - avant) / 1000); avant = ms;
      const I = gen.intensite(), F = e.x >= A0 && e.x <= A1 ? I * LR * B * e.sB : 0;
      if (Math.abs(e.v) < 1e-4 && Math.abs(F) <= FR) { e.v = 0; if (I) e.immobile = e.immobile || Math.abs(I) <= 1; }
      else e.v += ((F - FR * Math.sign(e.v || F)) / M) * dt;
      e.x = Math.max(X0 + 12, Math.min(X1 - 12, e.x + e.v * dt * PX)); if (e.x <= X0 + 12 || e.x >= X1 - 12) e.v = 0;
      if (I && e.x0 === null) e.x0 = e.x;
      if (e.x0 !== null && Math.abs(e.x - e.x0) > 0.02 * PX) { e.vus[`${Math.sign(I) || 1}:${e.sB}`] = Math.sign(e.x - e.x0); e.x0 = null; }
      tige(gt, e.x, Math.sign(I));
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("rails", { vus: { ...e.vus }, immobile: e.immobile }), 250);
    return { pense_bete };
  };
})(window.Labo);

/*
Rôle : paillasse « induction » (observation seulement) : bobine couchée sur la paillasse, reliée à un galvanomètre à zéro
       central ; barreau aimanté que l'on fait glisser le long de l'axe de la bobine. L'aiguille dévie seulement pendant
       que l'aimant bouge (d'autant plus qu'il va vite), dans un sens quand il entre, dans l'autre quand il sort :
       c'est le courant induit (conversion d'énergie mécanique en énergie électrique).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_induction(g) -> { pense_bete } ; fait « induction » = { entre, sort, immobile_zero }.
Utilisé par : simulation.js.
*/
(function (L) {
  const BX0 = 520, BX1 = 700, BY = 420;

  function flux(x) {
    // Flux (unités arbitraires) dans la bobine quand le pôle nord de l'aimant est à l'abscisse x (écran).
    const c = (BX0 + BX1) / 2;
    return 1 / (1 + ((x + 70 - c) / 80) ** 2);
  }

  function fixe(arriere, avant) {
    // Câbles, galvanomètre, moitiés arrière des spires (derrière l'aimant) et moitiés avant (devant).
    L.svg("path", { d: `M${BX0 + 3} ${BY - 36} C${BX0 - 30} 300 380 280 395 262 M${BX1 - 3} ${BY - 36} C${BX1 + 30} 300 440 280 425 262`, fill: "none", stroke: "#263238", "stroke-width": 2.2 }, arriere);
    L.svg("rect", { x: 320, y: 170, width: 180, height: 92, rx: 8, fill: "#f2efe4", stroke: "#555" }, arriere);
    L.svg("path", { d: "M350 240 A60 60 0 0 1 470 240", fill: "none", stroke: "#333" }, arriere);
    for (let k = -4; k <= 4; k++) { const r = (k * 12 * Math.PI) / 180; L.svg("line", { x1: 410 + 58 * Math.sin(r), y1: 240 - 58 * Math.cos(r), x2: 410 + 64 * Math.sin(r), y2: 240 - 64 * Math.cos(r), stroke: "#333" }, arriere); }
    L.texte(arriere, 410, 254, "galvanomètre (zéro au centre)", { "font-size": 7, "font-weight": 700, fill: "#333" });
    for (let x = BX0; x <= BX1; x += 7) {
      L.svg("path", { d: `M${x} ${BY - 36} A6 36 0 0 1 ${x} ${BY + 36}`, fill: "none", stroke: "#8a4f1c", "stroke-width": 2.4 }, arriere);
      L.svg("path", { d: `M${x} ${BY - 36} A6 36 0 0 0 ${x} ${BY + 36}`, fill: "none", stroke: "#c8742e", "stroke-width": 2.4 }, avant);
    }
  }

  function aimant(g, a) {
    // Barreau aimanté couché dans l'axe de la bobine, pôle nord vers la bobine.
    g.replaceChildren();
    L.svg("rect", { x: a.x - 140, y: BY - 9, width: 140, height: 18, fill: "#2f6fd0", stroke: "#173d78" }, g);
    L.svg("rect", { x: a.x - 70, y: BY - 9, width: 70, height: 18, fill: "#d63a2f", stroke: "#7a1712" }, g);
    L.texte(g, a.x - 18, BY, "N", { "font-size": 10, "font-weight": 700, fill: "#fff" }); L.texte(g, a.x - 122, BY, "S", { "font-size": 10, "font-weight": 700, fill: "#fff" });
  }

  L.poste_induction = function (g) {
    // Glisser de l'aimant le long de l'axe ; courant induit ∝ variation du flux par seconde ; aiguille amortie ; faits.
    const { pense_bete } = L.decor_circuit(g, 4), arriere = L.svg("g", {}, g), aiguille = L.svg("line", { x1: 410, y1: 240, x2: 410, y2: 184, stroke: "#c62828", "stroke-width": 2 }, g);
    const gr = L.svg("g", { class: "aimant", role: "button", "aria-label": "Barreau aimanté" }, g), devant = L.svg("g", { "pointer-events": "none" }, g);
    fixe(arriere, devant);
    const a = { x: 330 }, e = { entre: false, sort: false, immobile_zero: false, phi: flux(330), angle: 0, calme: 0 };
    L.glissable(gr, { soulever: false, debut: () => ({ x: a.x, y: BY }), deplacer: (p) => { a.x = Math.max(250, Math.min(BX1 + 60, p.x)); } });
    L.texte(g, (BX0 + BX1) / 2, BY + 56, "bobine (500 spires)", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
    let avant = null;
    const image = (ms) => {
      const dt = avant === null ? 0.016 : Math.max(0.005, Math.min(0.05, (ms - avant) / 1000)); avant = ms;
      const phi = flux(a.x), i = (phi - e.phi) / dt; e.phi = phi;
      e.angle += (Math.max(-0.9, Math.min(0.9, -i * 0.25)) - e.angle) * Math.min(1, dt * 12);
      if (e.angle < -0.25) e.entre = true;
      if (e.angle > 0.25) e.sort = true;
      e.calme = Math.abs(e.angle) < 0.02 && a.x > BX0 + 40 ? e.calme + dt : 0;
      if (e.calme > 1 && e.entre) e.immobile_zero = true;
      aimant(gr, a); aiguille.setAttribute("x2", 410 + 56 * Math.sin(e.angle)); aiguille.setAttribute("y2", 240 - 56 * Math.cos(e.angle));
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("induction", { entre: e.entre, sort: e.sort, immobile_zero: e.immobile_zero }), 250);
    return { pense_bete };
  };
})(window.Labo);

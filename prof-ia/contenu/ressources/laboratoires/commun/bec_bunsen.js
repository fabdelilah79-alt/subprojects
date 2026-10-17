/*
Rôle : bec Bunsen de laboratoire aux vraies dimensions (tube de 13 cm, socle de 5,6 cm), relié par un tuyau orange au robinet
       de gaz de la paillasse, avec sa virole d'air et un allume-gaz piézoélectrique posé à côté. On ouvre le robinet, puis
       on allume avec l'allume-gaz (le gaz qui s'échappe sans flamme est dangereux). Virole ouverte : flamme bleue, très
       chaude (zone la plus chaude juste au-dessus du cône bleu, vers 1 500 °C) ; virole fermée : flamme jaune, éclairante,
       moins chaude. Chaleur(p) donne la température de la flamme au point p.
Reçoit : le contexte de la paillasse et { x, sol, e (px/mm), dire(texte) }.
Produit : Labo.bec_bunsen(ctx, reglage) -> { allume, gaz, air, chaleur(p) -> °C, zone { x, y } (point le plus chaud) }.
Utilisé par : les simulations de chimie (combustions).
*/
(function (L) {
  function bec(g, x, sol, e) {
    // Socle, tube, virole, arrivée de gaz ; robinet de paillasse et tuyau.
    L.svg("ellipse", { cx: x + 4, cy: sol + 1, rx: 48, ry: 6, fill: "#000", opacity: 0.3 }, g);
    L.svg("path", { d: `M${x - 28 * e} ${sol} Q${x} ${sol - 22} ${x + 28 * e} ${sol} Z`, fill: "#3a3f44", stroke: "#24282c" }, g);
    L.svg("rect", { x: x - 6.5 * e, y: sol - 130 * e, width: 13 * e, height: 130 * e - 8, fill: "url(#metal)", stroke: "#6d767c", "stroke-width": 0.6 }, g);
    L.svg("path", { d: `M${x + 8} ${sol - 24} H${x + 46} V${sol - 16} H${x + 8} Z`, fill: "url(#laiton)", stroke: "#7a5a1e", "stroke-width": 0.6 }, g);
    L.svg("rect", { x: x + 82, y: sol - 168, width: 16, height: 22, rx: 2, fill: "url(#metal)", stroke: "#5d646a" }, g);
    L.svg("rect", { x: x + 86, y: sol - 148, width: 8, height: 12, fill: "url(#laiton)", stroke: "#7a5a1e", "stroke-width": 0.5 }, g);
    L.svg("path", { d: `M${x + 46} ${sol - 20} C${x + 90} ${sol - 20} ${x + 90} ${sol - 60} ${x + 90} ${sol - 138}`, stroke: "#e07a1f", "stroke-width": 8, fill: "none" }, g);
  }

  function flamme(g, x, y, s) {
    // Flamme qui vacille un peu : bleue (cône intérieur bleu vif) ou jaune éclairante.
    g.replaceChildren();
    if (!s.allume) return;
    const v = 1 + 0.06 * Math.sin(performance.now() / 70) + 0.04 * Math.random(), h = (s.air ? 70 : 110) * v, l = s.air ? 11 : 15;
    if (s.air) {
      L.svg("path", { d: `M${x - l} ${y} Q${x - l} ${y - h * 0.6} ${x} ${y - h} Q${x + l} ${y - h * 0.6} ${x + l} ${y} Z`, fill: "#9bb8ff", opacity: 0.45 }, g);
      L.svg("path", { d: `M${x - 6} ${y} Q${x - 5} ${y - 14} ${x} ${y - 24} Q${x + 5} ${y - 14} ${x + 6} ${y} Z`, fill: "#3b5bff", opacity: 0.85 }, g);
    } else {
      L.svg("path", { d: `M${x - l} ${y} Q${x - l - 4} ${y - h * 0.55} ${x + 2} ${y - h} Q${x + l + 3} ${y - h * 0.5} ${x + l} ${y} Z`, fill: "#ffb22e", opacity: 0.85 }, g);
      L.svg("path", { d: `M${x - 6} ${y} Q${x - 6} ${y - h * 0.4} ${x} ${y - h * 0.6} Q${x + 6} ${y - h * 0.4} ${x + 6} ${y} Z`, fill: "#fff1a8", opacity: 0.8 }, g);
    }
  }

  function robinet(g, s) {
    // Manette jaune du robinet de gaz : en travers = fermé, dans l'axe du tuyau = ouvert.
    g.replaceChildren();
    L.svg("rect", s.gaz ? { x: -4, y: -22, width: 8, height: 24, rx: 3 } : { x: -14, y: -4, width: 28, height: 8, rx: 3 }, g).setAttribute("fill", "#f2c500");
  }

  L.bec_bunsen = function (ctx, { x, sol, e = 1.6, dire = () => {} }) {
    // Dessine le bec ; robinet, virole et allume-gaz se touchent ; la flamme est redessinée 10 fois par seconde.
    const s = { allume: false, gaz: false, air: true, fuite: 0 }, haut = sol - 130 * e;
    bec(ctx.fond, x, sol, e);
    const g_f = L.svg("g", { "pointer-events": "none" }, ctx.objets), g_r = L.svg("g", { class: "robinet-gaz", role: "button", "aria-label": "Robinet de gaz", transform: `translate(${x + 90} ${sol - 158})` }, ctx.objets);
    const virole = L.svg("rect", { class: "virole", x: x - 12, y: sol - 46, width: 24, height: 12, rx: 2, fill: "#5d646a", stroke: "#33393e", role: "button", "aria-label": "Virole" }, ctx.objets);
    const allumeur = L.svg("g", { class: "allume-gaz", role: "button", "aria-label": "Allume-gaz" }, ctx.objets);
    L.svg("rect", { x: x - 120, y: sol - 12, width: 70, height: 10, rx: 4, fill: "#c0392b" }, allumeur);
    L.svg("rect", { x: x - 52, y: sol - 9, width: 36, height: 4, fill: "url(#metal)" }, allumeur);
    const maj = () => { robinet(g_r, s); virole.setAttribute("fill", s.air ? "#8a9096" : "#3b4146"); };
    const touche = (el, f) => L.glissable(el, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { f(); maj(); } });
    touche(g_r, () => { s.gaz = !s.gaz; if (!s.gaz) { s.allume = false; dire(""); } });
    touche(virole, () => { s.air = !s.air; });
    touche(allumeur, () => { if (s.gaz) { s.allume = true; s.fuite = 0; dire(""); } else dire("Ouvrez d'abord le robinet de gaz."); });
    setInterval(() => {
      flamme(g_f, x, haut, s);
      if (s.gaz && !s.allume && (s.fuite += 0.1) > 4) dire("Le gaz s'échappe sans brûler : allumez-le, ou fermez le robinet !");
    }, 100);
    s.zone = { x, y: haut - (s.air ? 30 : 45) };
    s.chaleur = (p) => {
      if (!s.allume) return 20;
      const z = { x, y: haut - (s.air ? 30 : 45) }, d2 = (p.x - z.x) ** 2 + ((p.y - z.y) / 2) ** 2;
      return 20 + ((s.air ? 1500 : 1000) - 20) * Math.exp(-d2 / (2 * 14 * 14));
    };
    maj();
    return s;
  };
})(window.Labo);

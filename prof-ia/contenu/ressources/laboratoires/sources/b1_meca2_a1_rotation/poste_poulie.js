/*
Rôle : paillasse de la poulie à deux gorges : une masse de 600 g pend à un fil enroulé sur la petite gorge (r = 1,5 cm) ;
       on tire vers le bas, avec un dynamomètre, le fil enroulé sur la grande gorge (R = 5,0 cm). Tant que la masse est
       posée, le ressort s'allonge sans que la poulie tourne ; ensuite la masse monte à vitesse constante (frottements
       négligés) : F·R = m·g·r, la poulie tourne de θ = d / R et la masse monte de h = r·θ. Lâché, l'anneau reste tenu.
Reçoit : le groupe SVG de la paillasse ; le geste de l'élève (tirer l'anneau vers le bas, ou le laisser remonter).
Produit : Labo.poste_poulie(g) -> { pense_bete } ; fait « poulie » = { F (N), theta (rad), h (m), arrets: [{ theta, h }] }.
Utilisé par : simulation.js (paillasse 1).
*/
(function (L) {
  const G = 9.81, M = 0.6, C = { x: 430, y: 110 }, TABLE = 560, P = L.poulie_dessin, REG = { calibre: 4, px_n: 30 };
  const F_EQ = (M * G * P.r) / P.R, HAUT = C.y + 30 + L.DYN_TRACTION.corde + L.DYN_TRACTION.corps;

  function regler(e, q) {
    // Position q de l'anneau (px) : le ressort s'allonge d'abord, puis le fil se déroule de d et la masse monte.
    e.q = Math.max(HAUT - 20, Math.min(TABLE - 8, q));
    const tension = (e.q - HAUT) / REG.px_n;
    e.d = Math.max(0, e.q - HAUT - F_EQ * REG.px_n);
    e.theta = e.d / P.R;
    e.h = P.r * e.theta;
    e.F = e.d > 0 ? F_EQ : Math.max(0, tension);
  }

  function dessiner(calque, e) {
    // Fils, poulie, masse, dynamomètre et index rouge de l'anneau devant la règle.
    calque.replaceChildren();
    const xd = C.x + P.R, xm = C.x - P.r, haut_masse = TABLE - 55 - e.h;
    L.svg("path", { d: `M${xm} ${C.y} V${haut_masse + 1} M${xd} ${C.y} V${C.y + 30 + e.d}`, stroke: "#e9e4d2", "stroke-width": 1.4, fill: "none" }, calque);
    P.poulie(calque, C, e.theta);
    P.masse(calque, xm, haut_masse, "600 g");
    L.svg("path", { d: `M${xm - 17} ${TABLE - e.h} H${C.x - P.r - 38}`, stroke: "#e0251b", "stroke-width": 1.4 }, calque);
    L.dynamometre_traction(calque, { x: xd, y: C.y + 30 + e.d }, { x: xd, y: e.q }, REG);
    L.svg("path", { d: `M${xd + 7} ${e.q} H${xd + 26}`, stroke: "#e0251b", "stroke-width": 1.4 }, calque);
  }

  L.poste_poulie = function (g) {
    // Potence et règles (fond) ; anneau saisi et tiré vers le bas ; chaque lâcher, masse levée, est un arrêt noté.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), fond = L.svg("g", {}, g);
    P.potence(fond, C, TABLE);
    P.regle(fond, C.x + P.R + 26, TABLE, 35);
    P.regle(fond, C.x - P.r - 52, TABLE, 15);
    L.svg("rect", { x: 610, y: 120, width: 190, height: 62, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0" }, fond);
    ["Grande gorge : R = 5,0 cm", "Petite gorge : r = 1,5 cm", "Masse marquée : m = 600 g"].forEach((t, i) => L.texte(fond, 705, 138 + i * 16, t, { "font-size": 9, fill: "#222" }));
    const e = { q: HAUT, arrets: [] }, calque = L.svg("g", {}, g);
    regler(e, HAUT);
    L.glissable(calque, {
      soulever: false,
      debut: (ev) => (ev.target.closest(".anneau-dyn") ? { x: C.x + P.R, y: e.q } : null),
      deplacer: (p) => { regler(e, p.y); dessiner(calque, e); },
      lacher: () => { if (e.d > 5) e.arrets = e.arrets.slice(-9).concat([{ theta: Math.round(e.theta * 1000) / 1000, h: Math.round(e.h) / 1000 }]); },
    });
    dessiner(calque, e);
    setInterval(() => L.missions.noter("poulie", { F: Math.round(e.F * 100) / 100, theta: Math.round(e.theta * 1000) / 1000, h: Math.round(e.h) / 1000, arrets: e.arrets.slice() }), 250);
    return { pense_bete };
  };
})(window.Labo);

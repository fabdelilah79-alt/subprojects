/*
Rôle : recueil d'un gaz sur la cuve à eau, aux vraies dimensions : cuve en verre de 15 cm remplie d'eau, éprouvette à gaz
       de 250 mL (graduée tous les 2 mL à partir de son fond, qui est en haut) retournée, pleine d'eau, tenue par une pince ;
       l'extrémité du tube à dégagement est sous son ouverture. Le gaz qui arrive monte en bulles et chasse l'eau : le
       volume de gaz se lit au niveau de l'eau dans l'éprouvette.
Reçoit : le contexte de la paillasse et { x (axe de l'éprouvette), sol, e (px/mm) }.
Produit : Labo.recueil_gaz(ctx, reglage) -> { V (mL de gaz), entree { x, y } (sous l'ouverture), ajouter(V), vider() }.
Utilisé par : les simulations de chimie (avancement d'une réaction qui dégage un gaz).
*/
(function (L) {
  const R = 17.5, H = 300, ZERO = 14, MM_PAR_ML = 1000 / (Math.PI * R * R), CUVE = { l: 150, h: 90, eau: 72 };
  const verre = { fill: "rgba(214,233,240,0.35)", stroke: "rgba(110,140,150,0.9)", "stroke-width": 1 };

  function cuve(ctx, x, sol, e) {
    // Paroi arrière de la cuve (derrière l'éprouvette), eau et paroi avant (devant).
    const l = CUVE.l * e, h = CUVE.h * e, he = CUVE.eau * e;
    L.svg("rect", { x: x - l / 2, y: sol - h, width: l, height: h, rx: 4, ...verre }, ctx.fond);
    L.svg("rect", { x: x - l / 2 + 2, y: sol - he, width: l - 4, height: he - 2, fill: "rgba(196,224,238,0.45)" }, ctx.devant);
    L.svg("ellipse", { cx: x, cy: sol - he, rx: l / 2 - 2, ry: 3, fill: "rgba(230,244,250,0.7)" }, ctx.devant);
    L.svg("rect", { x: x - l / 2, y: sol - h, width: l, height: h, rx: 4, fill: "none", stroke: "rgba(110,140,150,0.9)" }, ctx.devant);
    L.svg("rect", { x: x - l / 2 + 6, y: sol - h + 6, width: 5, height: h - 14, fill: "#fff", opacity: 0.3, "pointer-events": "none" }, ctx.devant);
  }

  function support(g, x, sol, e, y_pince) {
    // Support à droite de la cuve, noix et pince à trois doigts qui tient l'éprouvette.
    const xt = x + (CUVE.l / 2 + 14) * e;
    L.svg("rect", { x: xt - 30, y: sol - 8, width: 60, height: 8, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, `M${xt} ${sol - 8} V${y_pince - 60}`, 5);
    L.tige(g, `M${xt} ${y_pince} H${x + (R + 4) * e}`, 3);
    L.svg("rect", { x: xt - 7, y: y_pince - 7, width: 14, height: 14, rx: 2, fill: "#5d646a" }, g);
    L.svg("path", { d: `M${x + (R + 6) * e} ${y_pince - 9} q-8 9 0 18`, fill: "none", stroke: "#c0392b", "stroke-width": 4 }, g);
  }

  function eprouvette(g, x, haut, e, V, bulles) {
    // Éprouvette retournée (pied hexagonal en haut), eau sous le gaz, graduations, bulles qui montent.
    g.replaceChildren();
    const r = R * e, bas = haut + H * e, y0 = haut + ZERO * e, y_eau = y0 + V * MM_PAR_ML * e;
    L.svg("path", { d: `M${x - r - 9 * e} ${haut - 4 * e} L${x - r - 4 * e} ${haut - 8 * e} H${x + r + 4 * e} L${x + r + 9 * e} ${haut - 4 * e} L${x + r + 4 * e} ${haut} H${x - r - 4 * e} Z`, ...verre }, g);
    L.svg("rect", { x: x - r, y: y_eau, width: 2 * r, height: bas - y_eau, fill: "rgba(196,224,238,0.55)" }, g);
    L.svg("path", { d: `M${x - r} ${y_eau} Q${x} ${y_eau - 3} ${x + r} ${y_eau}`, fill: "none", stroke: "#24435e", "stroke-width": 0.8 }, g);
    L.svg("rect", { x: x - r, y: haut, width: 2 * r, height: H * e, rx: 3, ...verre, fill: "rgba(214,233,240,0.18)" }, g);
    for (let v = 0; v <= 250; v += 2) {
      const y = y0 + v * MM_PAR_ML * e, l = v % 10 === 0 ? 12 : 6;
      L.svg("line", { x1: x - r + 3, y1: y, x2: x - r + 3 + l, y2: y, stroke: "#1d3f6b", "stroke-width": v % 10 === 0 ? 0.8 : 0.5 }, g);
      if (v % 20 === 0) L.texte(g, x - r + 26, y + 3, String(v), { "font-size": 7.5, fill: "#1d3f6b", "text-anchor": "start" });
    }
    L.svg("rect", { x: x + r - 9, y: haut + 10, width: 4, height: H * e - 20, fill: "#fff", opacity: 0.35 }, g);
    for (let i = 0; i < bulles; i++) L.svg("circle", { cx: x + (Math.random() - 0.5) * r, cy: y_eau + Math.random() * (bas - y_eau), r: 1.5 + Math.random() * 2.5, fill: "rgba(255,255,255,0.35)", stroke: "#ffffff", "stroke-width": 0.6 }, g);
  }

  L.recueil_gaz = function (ctx, { x, sol, e = 1.2 }) {
    // Cuve, support, éprouvette ; le gaz ajouté fait descendre l'eau ; bulles pendant une demi-seconde après chaque arrivée.
    const bas = sol - 22 * e, haut = bas - H * e, s = { V: 0, entree: { x: x - 4 * e, y: bas + 6 * e } };
    cuve(ctx, x - 10 * e, sol, e);
    support(ctx.fond, x - 10 * e, sol, e, haut + 120 * e);
    const g = L.svg("g", { class: "eprouvette-gaz", "pointer-events": "none" }, ctx.objets);
    let bulle = 0, avant = "";
    s.ajouter = (V) => { s.V = Math.min(260, s.V + V); if (V > 0) bulle = 0.5; };
    s.vider = () => { s.V = 0; };
    ctx.ecoulement.sur_pas((dt) => {
      bulle = Math.max(0, bulle - dt);
      const cle = `${s.V.toFixed(2)} ${bulle > 0}`;
      if (cle !== avant || bulle > 0) { avant = cle; eprouvette(g, x, haut, e, s.V, bulle > 0 ? 8 : 0); }
    });
    eprouvette(g, x, haut, e, 0, 0);
    return s;
  };
})(window.Labo);

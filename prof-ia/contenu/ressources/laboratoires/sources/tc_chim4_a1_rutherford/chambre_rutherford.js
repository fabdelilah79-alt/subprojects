/*
Rôle : chambre de diffusion de Rutherford, comme celles des laboratoires d'enseignement : platine en aluminium, cylindre de
       verre épais (on voit l'intérieur), couvercle avec son embout de pompage ; dedans, une source scellée d'américium 241
       (particules alpha) dans un bloc de plomb percé d'une fente, une feuille d'or de 2 µm sur un porte-feuille que l'on
       met dans le faisceau ou que l'on retire (bouton du couvercle), et un détecteur sur un bras qui tourne autour de la
       feuille, au-dessus d'un rapporteur gradué : l'angle θ est l'angle de déviation des particules qu'il reçoit.
Reçoit : le contexte de la paillasse et { changer(etat) } (appelée quand l'angle ou la feuille changent).
Produit : Labo.chambre_rutherford(ctx, reglage) -> { theta, feuille, C, couvercle (point de l'embout) } ; le bras se tourne au doigt
          (pas de 5°, de 0° à 150°).
Utilisé par : poste_rutherford.js.
*/
(function (L) {
  const C = { x: 380, y: 500 }, RX = 150, RY = 50, H = 130;
  const P = (phi, r) => ({ x: C.x + r * Math.cos((phi * Math.PI) / 180), y: C.y + (r * Math.sin((phi * Math.PI) / 180)) / 3 });

  function platine(g) {
    // Platine épaisse sur trois pieds, sol de la chambre et rapporteur gradué (demi-cercle avant, 0° dans l'axe du faisceau).
    L.svg("ellipse", { cx: C.x + 6, cy: 572, rx: 176, ry: 10, fill: "#000", opacity: 0.25, filter: "url(#flou)" }, g);
    L.svg("path", { d: `M${C.x - 168} ${C.y + 6} V${C.y + 18} A168 56 0 0 0 ${C.x + 168} ${C.y + 18} V${C.y + 6} Z`, fill: "#9aa3a8" }, g);
    L.svg("ellipse", { cx: C.x, cy: C.y + 6, rx: 168, ry: 56, fill: "url(#metal-h)", stroke: "#7d868c" }, g);
    L.svg("ellipse", { cx: C.x, cy: C.y, rx: RX, ry: RY, fill: "#d9dde0", stroke: "#a8b0b5" }, g);
    for (let a = 0; a <= 180; a += 10) {
      const p = P(a, 128), q = P(a, a % 30 ? 122 : 116);
      L.svg("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y, stroke: "#30363b", "stroke-width": a % 30 ? 0.6 : 1 }, g);
      if (a % 30 === 0 && a < 180) { const t = P(a, 137); L.texte(g, t.x, t.y + 2, `${a}°`, { "font-size": 7, fill: "#30363b", "font-weight": 700 }); }
    }
    L.svg("path", { d: `M${P(0, 128).x} ${C.y} A128 ${128 / 3} 0 0 1 ${P(180, 128).x} ${C.y}`, fill: "none", stroke: "#30363b", "stroke-width": 0.7 }, g);
    L.svg("circle", { cx: C.x, cy: C.y, r: 5, fill: "url(#metal)", stroke: "#5d646a" }, g);
  }

  function source(g) {
    // Bloc de plomb avec la source scellée, fente de sortie vers la feuille, trèfle de radioactivité.
    const x = P(180, 112).x, y = C.y;
    L.svg("path", { d: `M${x - 26} ${y - 30} l10 -6 h44 l-10 6 Z`, fill: "#7a8086" }, g);
    L.svg("path", { d: `M${x + 18} ${y - 30} l10 -6 v30 l-10 6 Z`, fill: "#4a4f54" }, g);
    L.svg("rect", { x: x - 26, y: y - 30, width: 44, height: 30, fill: "#5d6368", stroke: "#3c4045" }, g);
    L.svg("rect", { x: x + 18, y: y - 19, width: 22, height: 8, fill: "#4a4f54", stroke: "#2f3337" }, g);
    L.svg("rect", { x: x + 38, y: y - 17, width: 2, height: 4, fill: "#111" }, g);
    L.svg("circle", { cx: x - 10, cy: y - 15, r: 8, fill: "#f2c500", stroke: "#222", "stroke-width": 0.5 }, g);
    for (const a of [90, 210, 330]) L.svg("path", { d: secteur(x - 10, y - 15, 7, a - 30, a + 30), fill: "#111" }, g);
    L.svg("circle", { cx: x - 10, cy: y - 15, r: 1.6, fill: "#111" }, g);
    L.texte(g, x + 6, y - 4, "²⁴¹Am", { "font-size": 6, fill: "#fff", "font-weight": 700 });
  }

  function secteur(cx, cy, r, a1, a2) {
    // Secteur du trèfle (angles en degrés, 0 vers la droite), entre r/4 et r.
    const pt = (a, rr) => `${cx + rr * Math.cos((a * Math.PI) / 180)} ${cy - rr * Math.sin((a * Math.PI) / 180)}`;
    return `M${pt(a1, r / 4)} L${pt(a1, r)} A${r} ${r} 0 0 0 ${pt(a2, r)} L${pt(a2, r / 4)} Z`;
  }

  function porte_feuille(g, en_place) {
    // Cadre en laiton tenant la feuille d'or (vue un peu de biais) ; retiré, il pivote vers le fond, hors du faisceau.
    g.replaceChildren();
    const x = en_place ? C.x : C.x - 34, y = en_place ? C.y : C.y - 22;
    L.svg("ellipse", { cx: x, cy: y, rx: 8, ry: 2.6, fill: "#6d5320" }, g);
    L.svg("rect", { x: x - 8, y: y - 32, width: 16, height: 32, rx: 3, fill: "url(#laiton)", stroke: "#7a5a1e", "stroke-width": 0.8 }, g);
    L.svg("rect", { x: x - 4.5, y: y - 27, width: 9, height: 22, rx: 2, fill: "#e8c24a", stroke: "#b8922a", "stroke-width": 0.5 }, g);
    L.svg("line", { x1: x - 2.5, y1: y - 25, x2: x + 1.5, y2: y - 8, stroke: "#fff4c0", "stroke-width": 1.2, opacity: 0.8 }, g);
  }

  function detecteur(g, theta) {
    // Bras et détecteur (cylindre tourné vers la feuille) ; câble vers le passage étanche du centre.
    g.replaceChildren();
    const p = P(theta, 104), a = (Math.atan2(p.y - C.y, p.x - C.x) * 180) / Math.PI;
    L.svg("line", { x1: C.x, y1: C.y, x2: p.x, y2: p.y, stroke: "#6c757b", "stroke-width": 5, "stroke-linecap": "round" }, g);
    L.svg("path", { d: `M${p.x} ${p.y} Q${(p.x + C.x) / 2} ${(p.y + C.y) / 2 + 14} ${C.x} ${C.y + 3}`, stroke: "#222", "stroke-width": 2, fill: "none" }, g);
    const corps = L.svg("g", { transform: `translate(${p.x} ${p.y - 14}) rotate(${a})` }, g);
    L.svg("rect", { x: -12, y: -9, width: 30, height: 18, rx: 3, fill: "url(#metal)", stroke: "#5d646a" }, corps);
    L.svg("rect", { x: -16, y: -6, width: 5, height: 12, rx: 1, fill: "#2b2f33" }, corps);
    L.svg("line", { x1: p.x, y1: p.y - 5, x2: p.x, y2: p.y, stroke: "#5d646a", "stroke-width": 3 }, g);
    const t = P(theta, 92);
    L.svg("path", { d: `M${t.x} ${t.y + 1} l-3 6 h6 Z`, fill: "#c0392b" }, g);
  }

  function verre_et_couvercle(fond, devant) {
    // Paroi arrière du cylindre (fond), paroi avant transparente et couvercle en aluminium (devant).
    L.svg("path", { d: `M${C.x - RX} ${C.y} V${C.y - H} A${RX} ${RY} 0 0 1 ${C.x + RX} ${C.y - H} V${C.y}`, fill: "rgba(200,225,232,0.18)", stroke: "rgba(120,150,160,0.6)" }, fond);
    const v = L.svg("g", { "pointer-events": "none" }, devant);
    L.svg("path", { d: `M${C.x - RX} ${C.y - H} V${C.y} A${RX} ${RY} 0 0 0 ${C.x + RX} ${C.y} V${C.y - H} A${RX} ${RY} 0 0 1 ${C.x - RX} ${C.y - H} Z`, fill: "rgba(205,230,238,0.16)", stroke: "rgba(110,140,150,0.8)" }, v);
    for (const [dx, w, o] of [[-118, 7, 0.35], [-104, 2, 0.5], [112, 4, 0.3]]) L.svg("rect", { x: C.x + dx, y: C.y - H + 50, width: w, height: H - 16, fill: "#fff", opacity: o }, v);
    L.svg("path", { d: `M${C.x - RX - 6} ${C.y - H} v-10 A${RX + 6} ${RY + 2} 0 0 1 ${C.x + RX + 6} ${C.y - H - 10} v10 A${RX + 6} ${RY + 2} 0 0 1 ${C.x - RX - 6} ${C.y - H} Z`, fill: "#a9b1b6", stroke: "#7d868c" }, v);
    L.svg("ellipse", { cx: C.x, cy: C.y - H - 10, rx: RX + 6, ry: RY + 2, fill: "url(#metal-h)", stroke: "#7d868c" }, v);
    L.svg("rect", { x: C.x + 62, y: C.y - H - 30, width: 16, height: 22, fill: "url(#metal)", stroke: "#5d646a" }, v);
    L.texte(v, C.x, C.y - H + 6, "CHAMBRE DE DIFFUSION", { "font-size": 6, fill: "#2b3a44", "font-weight": 700, opacity: 0.7 });
  }

  L.chambre_rutherford = function (ctx, { changer = () => {} }) {
    // Construit la chambre ; le bras du détecteur se tourne au doigt, le bouton du couvercle met ou retire la feuille.
    const c = { theta: 0, feuille: true, C, couvercle: { x: C.x + 70, y: C.y - H - 30 } };
    platine(ctx.fond); verre_et_couvercle(ctx.fond, ctx.devant); source(ctx.objets);
    const g_feuille = L.svg("g", {}, ctx.objets), g_det = L.svg("g", { class: "detecteur", role: "button", "aria-label": "Bras du détecteur" }, ctx.objets);
    const legende = L.svg("g", { "pointer-events": "none" }, ctx.haut);
    const maj = () => {
      porte_feuille(g_feuille, c.feuille); detecteur(g_det, c.theta); legende.replaceChildren();
      L.texte(legende, C.x - 60, C.y - H - 32, c.feuille ? "feuille d'or : en place" : "feuille d'or : retirée", { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
      changer(c);
    };
    const angle = (p) => Math.max(0, Math.min(150, (Math.atan2(Math.max(0, (p.y - C.y) * 3), p.x - C.x) * 180) / Math.PI));
    L.glissable(g_det, { debut: () => ({ ...P(c.theta, 104) }), deplacer: (p) => { c.theta = Math.round(angle(p)); maj(); }, lacher: () => { c.theta = Math.round(c.theta / 5) * 5; maj(); } });
    L.bouton_rond(ctx.haut, C.x - 60, C.y - H - 16, "", () => { c.feuille = !c.feuille; maj(); }, 8);
    maj();
    return c;
  };
})(window.Labo);

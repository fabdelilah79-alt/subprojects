/*
Rôle : dessin du montage d'hydrodistillation : support et pinces, chauffe-ballon, ballon de 250 mL (eau, fleurs de lavande,
       grains de pierre ponce), col de cygne, réfrigérant droit incliné (deux embouts : entrée en bas, sortie en haut),
       allonge, éprouvette graduée qui recueille le distillat (eau en bas, huile essentielle en couche fine au-dessus),
       robinet d'eau au mur et évier.
Reçoit : le groupe SVG et l'état { ponce, tuyau (« bas », « haut » ou null), eau, chauffe, T, bulles, volume (mL), essence (mL) }.
Produit : Labo.hydro = { fixe(g), variable(g, etat), REFRI, EMBOUTS, BALLON, EPROUVETTE, ROBINET } (positions utiles aux gestes).
Utilisé par : poste_hydro.js.
*/
(function (L) {
  const BALLON = { x: 330, y: 498, r: 34 }, REFRI = { x1: 366, y1: 420, x2: 590, y2: 470 }, EPROUVETTE = { x: 614, bas: 562, h: 82 };
  const ROBINET = { x: 790, y: 330 }, EVIER = { x: 830, y: 446 };
  const le_long = (s) => ({ x: REFRI.x1 + (REFRI.x2 - REFRI.x1) * s, y: REFRI.y1 + (REFRI.y2 - REFRI.y1) * s });
  const ANGLE = Math.atan2(REFRI.y2 - REFRI.y1, REFRI.x2 - REFRI.x1), NORMALE = { x: Math.sin(ANGLE), y: -Math.cos(ANGLE) };
  const embout = (s, cote) => { const p = le_long(s), u = { x: NORMALE.x * cote, y: NORMALE.y * cote }; return { x: p.x + 21 * u.x, y: p.y + 21 * u.y, ux: u.x, uy: u.y }; };
  // Embouts du manchon, perpendiculaires au réfrigérant : extrémité (x, y) et direction vers l'extérieur (ux, uy).
  const EMBOUTS = { bas: embout(0.86, -1), haut: embout(0.16, 1) };
  const VERRE = { fill: "url(#verre)", stroke: "#9fb6be" };

  function support(g) {
    // Potence : socle, tige, deux noix et pinces (col du ballon, réfrigérant).
    L.svg("rect", { x: 196, y: 552, width: 110, height: 10, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, "M250 552 V290", 5);
    for (const [y, x2] of [[446, 318], [432, 420]]) { L.svg("rect", { x: 244, y: y - 6, width: 14, height: 12, rx: 2, fill: "#5d646a" }, g); L.tige(g, `M256 ${y} H${x2}`, 3); L.svg("rect", { x: x2 - 4, y: y - 7, width: 10, height: 14, rx: 3, fill: "#c0392b" }, g); }
  }

  function refrigerant(g) {
    // Réfrigérant droit : manchon extérieur, tube intérieur, deux embouts.
    const a = (Math.atan2(REFRI.y2 - REFRI.y1, REFRI.x2 - REFRI.x1) * 180) / Math.PI, l = Math.hypot(REFRI.x2 - REFRI.x1, REFRI.y2 - REFRI.y1);
    const r = L.svg("g", { transform: `translate(${REFRI.x1} ${REFRI.y1}) rotate(${a})` }, g);
    L.svg("rect", { x: 0, y: -3, width: l, height: 6, ...VERRE }, r);
    L.svg("rect", { x: l * 0.1, y: -11, width: l * 0.8, height: 22, rx: 8, ...VERRE }, r);
    for (const [s, dy] of [[0.16, -1], [0.86, 1]]) {
      L.svg("rect", { x: l * s - 3, y: dy < 0 ? -21 : 11, width: 6, height: 10, ...VERRE }, r);
      L.svg("rect", { x: l * s - 4, y: dy < 0 ? -20 : 16, width: 8, height: 4, rx: 1.5, ...VERRE }, r);
    }
    return { a, l };
  }

  function fixe(g) {
    // Tout ce qui ne bouge pas : robinet, évier, support, chauffe-ballon, ballon vide, col de cygne, réfrigérant, allonge, éprouvette.
    L.svg("rect", { x: EVIER.x - 70, y: EVIER.y - 22, width: 140, height: 40, rx: 6, fill: "#c9d0d4", stroke: "#8f989e" }, g);
    L.svg("rect", { x: EVIER.x - 62, y: EVIER.y - 16, width: 124, height: 28, rx: 5, fill: "#7f8a90" }, g);
    L.svg("circle", { cx: EVIER.x + 40, cy: EVIER.y, r: 4, fill: "#3a3f44" }, g);
    L.svg("rect", { x: ROBINET.x - 8, y: ROBINET.y - 18, width: 16, height: 12, rx: 2, fill: "url(#metal)" }, g);
    L.svg("path", { d: `M${ROBINET.x - 4} ${ROBINET.y - 6} V${ROBINET.y + 10} h8 V${ROBINET.y - 6}`, fill: "url(#metal)", stroke: "#7d868c" }, g);
    support(g);
    L.svg("rect", { x: 284, y: 520, width: 92, height: 42, rx: 6, fill: "#5e6b74" }, g);
    L.svg("ellipse", { cx: 330, cy: 521, rx: 44, ry: 9, fill: "#3b4247" }, g);
    L.texte(g, 330, 548, "CHAUFFE-BALLON", { "font-size": 5.5, "font-weight": 700, fill: "#dfe6ea" });
    L.svg("path", { d: `M322 470 V420 Q322 410 334 410 H350 Q362 411 ${REFRI.x1} ${REFRI.y1 - 3} L${REFRI.x1} ${REFRI.y1 + 3} Q360 418 350 418 H338 V470 Z`, ...VERRE }, g);
    refrigerant(g);
    L.svg("path", { d: `M${REFRI.x2 - 2} ${REFRI.y2 - 3} Q612 474 616 490 L610 492 Q606 480 ${REFRI.x2 - 2} ${REFRI.y2 + 3} Z`, ...VERRE }, g);
  }

  function variable(g, e) {
    // Ce qui change : contenu du ballon, eau du réfrigérant, tuyaux, distillat, vapeurs perdues.
    g.replaceChildren();
    const b = BALLON;
    L.svg("circle", { cx: b.x, cy: b.y, r: b.r, ...VERRE }, g);
    L.svg("path", { d: `M${b.x - b.r + 3} ${b.y + 2} A${b.r - 3} ${b.r - 3} 0 0 0 ${b.x + b.r - 3} ${b.y + 2} Z`, fill: "#bcd9e6", opacity: 0.7 }, g);
    for (let i = 0; i < 12; i++) L.svg("ellipse", { cx: b.x - 22 + ((i * 11) % 44), cy: b.y + 4 + ((i * 7) % 20), rx: 2.6, ry: 1.4, fill: "#7b5aa6", opacity: 0.9 }, g);
    if (e.ponce) for (let i = 0; i < 4; i++) L.svg("circle", { cx: b.x - 8 + i * 5, cy: b.y + b.r - 6, r: 1.8, fill: "#9a968c" }, g);
    for (const p of e.bulles || []) L.svg("circle", { cx: b.x + p.dx, cy: b.y + p.dy, r: p.r, fill: "none", stroke: "#fff", opacity: 0.8 }, g);
    L.svg("path", { d: "M286 521 A44 9 0 0 0 374 521 L376 562 H284 Z", fill: "#5e6b74" }, g);
    L.texte(g, 330, 548, "CHAUFFE-BALLON", { "font-size": 5.5, "font-weight": 700, fill: "#dfe6ea" });
    const ep = EPROUVETTE, haut_eau = ep.bas - 4 - e.volume * 1.4, haut_ess = haut_eau - e.essence * 6;
    if (e.volume > 0) L.svg("rect", { x: ep.x - 8, y: haut_eau, width: 16, height: ep.bas - 4 - haut_eau, fill: e.volume < 6 ? "#e9eef0" : "#dfeaf0", opacity: 0.8 }, g);
    if (e.essence > 0) L.svg("rect", { x: ep.x - 8, y: haut_ess, width: 16, height: haut_eau - haut_ess, fill: "#f2dc7a", opacity: 0.95 }, g);
    L.svg("path", { d: `M${ep.x - 10} ${ep.bas - ep.h} V${ep.bas - 2} H${ep.x + 10} V${ep.bas - ep.h}`, ...VERRE }, g);
    L.svg("rect", { x: ep.x - 16, y: ep.bas - 3, width: 32, height: 4, rx: 1, fill: "url(#verre)", stroke: "#9fb6be" }, g);
    for (let k = 1; k <= 5; k++) L.svg("line", { x1: ep.x - 10, x2: ep.x - 5, y1: ep.bas - 4 - k * 14, y2: ep.bas - 4 - k * 14, stroke: "#fff", opacity: 0.8 }, g);
    if (e.eau && e.tuyau) {
      // Eau froide dans le manchon : plein si elle entre par le bas, presque vide si elle entre par le haut.
      const a = (Math.atan2(REFRI.y2 - REFRI.y1, REFRI.x2 - REFRI.x1) * 180) / Math.PI, l = Math.hypot(REFRI.x2 - REFRI.x1, REFRI.y2 - REFRI.y1);
      const r = L.svg("g", { transform: `translate(${REFRI.x1} ${REFRI.y1}) rotate(${a})` }, g), k = e.tuyau === "bas" ? 1 : 0.25;
      L.svg("rect", { x: l * 0.1 + 2, y: 9 - 18 * k, width: l * 0.8 - 4, height: 18 * k, rx: 6, fill: "#5fb3dc", opacity: 0.35 }, r);
    }
    if (e.perte) for (let i = 0; i < 3; i++) L.svg("path", { d: `M${612 + i * 6} 470 q-4 -10 2 -20 q6 -10 0 -20`, stroke: "#fff", "stroke-width": 3, opacity: 0.4, fill: "none" }, g);
  }

  L.hydro = { fixe, variable, REFRI, EMBOUTS, BALLON, EPROUVETTE, ROBINET, EVIER, le_long };
})(window.Labo);

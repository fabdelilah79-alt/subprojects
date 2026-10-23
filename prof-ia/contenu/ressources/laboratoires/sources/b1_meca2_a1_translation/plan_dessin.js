/*
Rôle : dessin du plan incliné : planche de 90 cm graduée (0 à la charnière O), charnière, rapporteur à la charnière,
       potence dont la noix porte la tige sur laquelle repose la planche, niveau laser dont le faisceau horizontal passe
       à 20,0 cm au-dessus de O (toise posée sur une cale à la hauteur de O), chariot de 500 g avec son repère.
Reçoit : le groupe SVG, l'angle α (rad), la position du repère du chariot s (px le long de la planche).
Produit : Labo.plan_dessin = { fond(g), planche(g, a), potence(g, a), chariot(g, a, s, eclaire), MM, O, TIGE_X, LONG }.
Utilisé par : poste_plan.js.
*/
(function (L) {
  const MM = 0.55, O = { x: 235, y: 554 }, TABLE = 566, TIGE_X = 535, LONG = 900 * MM, LASER_Y = O.y - 200 * MM;
  const repere = (a, s, n = 0) => ({ x: O.x + s * Math.cos(a) + n * Math.sin(a), y: O.y - s * Math.sin(a) + n * Math.cos(a) });

  function fond(g) {
    // Socle de la charnière, rapporteur, niveau laser sur son trépied, toise sur sa cale et faisceau.
    L.svg("rect", { x: O.x - 26, y: O.y, width: 40, height: TABLE - O.y, fill: "#3a3f44", stroke: "#1b1e21" }, g);
    L.svg("path", { d: `M${O.x} ${O.y} H${O.x + 136} A136 136 0 0 0 ${O.x + 136 * Math.cos(0.9)} ${O.y - 136 * Math.sin(0.9)} Z`, fill: "#e6f0f5", opacity: 0.8, stroke: "#6d8a99", "stroke-width": 0.6 }, g);
    for (let d = 0; d <= 50; d++) {
      const r1 = 118, r2 = d % 10 ? (d % 5 ? 113 : 110) : 106, c = Math.cos((d * Math.PI) / 180), s = Math.sin((d * Math.PI) / 180);
      L.svg("line", { x1: O.x + r1 * c, y1: O.y - r1 * s, x2: O.x + r2 * c, y2: O.y - r2 * s, stroke: "#203845", "stroke-width": d % 10 ? 0.5 : 0.9 }, g);
      if (d % 10 === 0) L.texte(g, O.x + 126 * c, O.y - 126 * s + 3, `${d}°`, { "font-size": 7, "font-weight": 700, fill: "#203845" });
    }
    L.svg("rect", { x: 740, y: O.y, width: 30, height: TABLE - O.y, fill: "url(#bois-face)", stroke: "#6b4a2a" }, g);
    L.svg("rect", { x: 746, y: O.y - 330 * MM, width: 18, height: 330 * MM, fill: "#f3efe2", stroke: "#8a8270" }, g);
    for (let cm = 0; cm <= 33; cm++) L.svg("line", { x1: 746, y1: O.y - cm * 10 * MM, x2: 746 + (cm % 5 ? 5 : 9), y2: O.y - cm * 10 * MM, stroke: "#333", "stroke-width": 0.6 }, g);
    for (let cm = 0; cm <= 30; cm += 10) L.texte(g, 758, O.y - cm * 10 * MM + 3, String(cm), { "font-size": 7, "font-weight": 700, fill: "#333" });
    L.svg("path", { d: `M800 ${TABLE} L814 ${LASER_Y + 14} L828 ${TABLE} M814 ${LASER_Y + 14} V${TABLE}`, fill: "none", stroke: "#2b2f33", "stroke-width": 2.5 }, g);
    L.svg("rect", { x: 790, y: LASER_Y - 9, width: 48, height: 22, rx: 3, fill: "#e3b505", stroke: "#6b5300" }, g);
    L.svg("circle", { cx: 792, cy: LASER_Y, r: 3, fill: "#ff2a1a" }, g);
    L.texte(g, 814, LASER_Y + 25, "niveau laser", { "font-size": 7, fill: "#e8ecef" });
    L.svg("rect", { x: 600, y: 160, width: 196, height: 46, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0" }, g);
    L.texte(g, 698, 178, "Faisceau horizontal à 20,0 cm", { "font-size": 9, fill: "#222" });
    L.texte(g, 698, 194, "au-dessus du point O (charnière)", { "font-size": 9, fill: "#222" });
  }

  function planche(g, a) {
    // Planche tournée d'un angle a autour de O : dessus au niveau de O, chant gradué en cm, nombres tous les 10 cm.
    const gr = L.svg("g", { transform: `translate(${O.x} ${O.y}) rotate(${(-a * 180) / Math.PI})` }, g);
    L.svg("rect", { x: -6, y: 0, width: LONG + 6, height: 11, fill: "url(#bois-face)", stroke: "#6b4a2a", "stroke-width": 0.8 }, gr);
    for (let cm = 0; cm <= 90; cm++) {
      const x = cm * 10 * MM;
      L.svg("line", { x1: x, y1: 0, x2: x, y2: cm % 10 ? (cm % 5 ? 2.5 : 4) : 6, stroke: "#2a1a08", "stroke-width": cm % 10 ? 0.45 : 0.9 }, gr);
      if (cm % 10 === 0 && cm) L.texte(gr, x, 10, String(cm), { "font-size": 5.5, "font-weight": 700, fill: "#2a1a08" });
    }
    L.svg("circle", { cx: 0, cy: 5, r: 5, fill: "url(#metal)", stroke: "#333" }, gr);
  }

  function potence(g, a) {
    // Socle, tige verticale, noix (saisissable) et tige horizontale (vue en bout) sous la planche.
    const y = O.y - (TIGE_X - O.x) * Math.tan(a) + 11 / Math.cos(a) + 5;
    L.svg("rect", { x: TIGE_X - 40, y: TABLE - 10, width: 80, height: 10, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, `M${TIGE_X + 14} ${TABLE - 10} V250`, 6);
    const n = L.svg("g", { class: "noix", role: "slider", "aria-label": "Noix de réglage de l'inclinaison" }, g);
    L.svg("rect", { x: TIGE_X + 6, y: y - 9, width: 16, height: 18, rx: 2, fill: "#2c3e50", stroke: "#111" }, n);
    L.svg("rect", { x: TIGE_X + 22, y: y - 3, width: 10, height: 6, fill: "#111" }, n);
    L.svg("rect", { x: TIGE_X - 6, y: y - 30, width: 50, height: 60, fill: "#000", opacity: 0.001 }, n);
    L.svg("circle", { cx: TIGE_X, cy: y, r: 5, fill: "url(#metal)", stroke: "#333" }, g);
    L.tige(g, `M${TIGE_X + 4} ${y} H${TIGE_X + 8}`, 4);
  }

  function chariot(g, a, s, eclaire) {
    // Chariot à roues (15 cm) posé sur la planche ; repère rouge à l'arrière ; point du laser quand il coupe le faisceau.
    const gr = L.svg("g", { transform: `translate(${O.x} ${O.y}) rotate(${(-a * 180) / Math.PI})` }, g);
    for (const x of [s + 14, s + 68]) L.svg("circle", { cx: x, cy: -5, r: 5, fill: "#222", stroke: "#000" }, gr);
    L.svg("rect", { x: s, y: -30, width: 82, height: 21, rx: 3, fill: "#2f6db3", stroke: "#123a66" }, gr);
    L.texte(gr, s + 41, -16, "500 g", { "font-size": 8, "font-weight": 700, fill: "#fff" });
    L.svg("path", { d: `M${s} -30 V0`, stroke: "#e0251b", "stroke-width": 1.6 }, gr);
    L.svg("path", { d: `M${s - 3} -2 L${s} 0.5 L${s + 3} -2 Z`, fill: "#e0251b" }, gr);
    L.svg("path", { d: `M${s + 82} -20 h4 a3 3 0 1 1 0 0.1`, fill: "none", stroke: "url(#metal)", "stroke-width": 1.6 }, gr);
    if (eclaire) { const p = repere(a, s, -1); L.svg("circle", { cx: p.x, cy: LASER_Y, r: 4, fill: "#ff2a1a", opacity: 0.9 }, g); }
    return repere(a, s + 89, -20);
  }

  function faisceau(g) {
    // Faisceau laser horizontal, fin et rouge, de l'appareil jusqu'au-dessus de la charnière.
    L.svg("line", { x1: 790, y1: LASER_Y, x2: O.x - 10, y2: LASER_Y, stroke: "#ff2a1a", "stroke-width": 0.8, opacity: 0.75, "pointer-events": "none" }, g);
  }

  L.plan_dessin = { fond, planche, potence, chariot, faisceau, MM, O, TIGE_X, LONG, repere };
})(window.Labo);

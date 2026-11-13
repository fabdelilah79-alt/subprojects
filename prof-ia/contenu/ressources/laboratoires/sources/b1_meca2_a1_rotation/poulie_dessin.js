/*
Rôle : dessin de la poulie à deux gorges (vue de face, à l'échelle 1 px = 1 mm) : grande gorge de rayon R = 5,0 cm,
       graduée en degrés (0 sous l'index au départ, les nombres croissent dans le sens contraire de la rotation : on lit
       directement l'angle tourné), petite gorge de rayon r = 1,5 cm ; potence qui porte son axe ; masse marquée en laiton ;
       règle verticale posée sur la paillasse (0 en bas).
Reçoit : le groupe SVG, l'axe C, l'angle tourné θ (rad, sens horaire).
Produit : Labo.poulie_dessin = { potence(g, C, table), poulie(g, C, theta), masse(g, x, haut, texte, k), regle(g, x, table, cm) }.
Utilisé par : poste_poulie.js.
*/
(function (L) {
  const R = 50, r = 15;

  function potence(g, C, table) {
    // Socle, tige verticale, noix et bras horizontal qui porte l'axe de la poulie.
    const x = C.x - 140;
    L.svg("rect", { x: x - 50, y: table - 10, width: 110, height: 10, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, `M${x} ${table - 10} V${C.y - 30}`, 8);
    L.svg("rect", { x: x - 10, y: C.y - 10, width: 20, height: 20, rx: 3, fill: "#2c3e50", stroke: "#111" }, g);
    L.tige(g, `M${x + 10} ${C.y} H${C.x}`, 6);
  }

  function poulie(g, C, theta) {
    // Grande gorge graduée (un trait tous les 10°, un nombre tous les 30°), petite gorge, axe ; index fixe en haut.
    const d = L.svg("g", { transform: `rotate(${(theta * 180) / Math.PI} ${C.x} ${C.y})` }, g);
    L.svg("circle", { cx: C.x, cy: C.y, r: R + 2, fill: "#8d969c", stroke: "#3c4246" }, d);
    L.svg("circle", { cx: C.x, cy: C.y, r: R - 3, fill: "#eef1f2", stroke: "#6a7378" }, d);
    for (let k = 0; k < 36; k++) {
      const a = (k * Math.PI) / 18, u = { x: -Math.sin(a), y: -Math.cos(a) }, l = k % 3 ? 4 : 7;
      L.svg("line", { x1: C.x + u.x * (R - 3), y1: C.y + u.y * (R - 3), x2: C.x + u.x * (R - 3 - l), y2: C.y + u.y * (R - 3 - l), stroke: "#1d2a33", "stroke-width": k % 3 ? 0.5 : 0.9 }, d);
      if (k % 3 === 0) L.texte(d, C.x + u.x * (R - 15), C.y + u.y * (R - 15) + 2.5, String(k * 10), { "font-size": 6.5, "font-weight": 700, fill: "#1d2a33", transform: `rotate(${-k * 10} ${C.x + u.x * (R - 15)} ${C.y + u.y * (R - 15)})` });
    }
    L.svg("circle", { cx: C.x, cy: C.y, r: r + 2, fill: "#5d666c", stroke: "#2a2f33" }, d);
    L.svg("circle", { cx: C.x, cy: C.y, r: r - 2, fill: "url(#metal)", stroke: "#2a2f33" }, d);
    L.svg("circle", { cx: C.x, cy: C.y, r: 3, fill: "#222" }, g);
    L.svg("path", { d: `M${C.x} ${C.y - R - 1} l-4 -8 h8 Z`, fill: "#d0312d" }, g);
  }

  function masse(g, x, haut, texte, k = 1) {
    // Masse marquée en laiton (crochet en haut), de taille k (1 pour 600 g) ; haut = point d'accroche ; renvoie sa hauteur.
    const l = 34 * k, h = 46 * k;
    L.svg("path", { d: `M${x} ${haut + 9} V${haut + 3} a3 3 0 1 1 5 -1`, fill: "none", stroke: "url(#metal)", "stroke-width": 2, "stroke-linecap": "round" }, g);
    L.svg("rect", { x: x - l / 2, y: haut + 9, width: l, height: h, fill: "url(#laiton)" }, g);
    L.svg("ellipse", { cx: x, cy: haut + 9, rx: l / 2, ry: 4 * k, fill: "url(#laiton-haut)", stroke: "#a77d24", "stroke-width": 0.5 }, g);
    L.texte(g, x, haut + 9 + h * 0.6, texte, { "font-size": 8 * Math.max(0.85, k), "font-weight": 700, fill: "#4a370b" });
    return 9 + h;
  }
  masse.k = (m) => Math.cbrt(m / 0.6);

  function regle(g, x, table, cm) {
    // Règle verticale de cm centimètres sur son pied : un trait tous les 5 mm, un nombre tous les 5 cm.
    L.svg("rect", { x: x - 10, y: table - 6, width: 30, height: 6, fill: "#3a3f44" }, g);
    L.svg("rect", { x, y: table - cm * 10 - 4, width: 14, height: cm * 10 + 4, fill: "#f3efe2", stroke: "#8a8270" }, g);
    for (let mm = 0; mm <= cm * 10; mm += 5) {
      const y = table - mm, l = mm % 10 ? 3 : mm % 50 ? 6 : 9;
      L.svg("line", { x1: x, y1: y, x2: x + l, y2: y, stroke: "#333", "stroke-width": mm % 10 ? 0.4 : 0.7 }, g);
      if (mm % 50 === 0) L.texte(g, x + 11, y + 2.5, String(mm / 10), { "font-size": 6.5, "font-weight": 700, fill: "#333" });
    }
  }

  L.poulie_dessin = { potence, poulie, masse, regle, R, r };
})(window.Labo);

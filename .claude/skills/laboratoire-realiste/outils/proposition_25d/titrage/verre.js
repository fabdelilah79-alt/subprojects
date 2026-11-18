/*
Rôle : prototype « titrage en 2,5D » : verrerie réaliste : bécher (verre épais, bord ovale, graduations émaillées, liquide
       rose avec sa surface ovale et son ménisque, barreau aimanté qui tourne) et burette (tube gradué, liquide incolore,
       ménisque, robinet bleu, pointe) d'où tombent des gouttes ; tout cercle horizontal est un ovale de rapport P.K.
Reçoit : le groupe SVG et la position de chaque pièce.
Produit : P.becher(g, { x, y, r, h, niveau }) -> { surface_y, animer(t) } ; P.burette(g, { x, haut, bas }) -> { pointe }.
Utilisé par : prototype.html (proposition ; aucun laboratoire n'est modifié).
*/
(function (P) {
  const el = P.el;
  const arc = (x, y, r, k, sens) => `A${r} ${r * k} 0 0 ${sens} ${x}`;

  function corps_liquide(g, x, yb, r, ys) {
    // Liquide : du fond (arc avant) jusqu'à la surface ; puis la surface, ovale plus clair, et son ménisque.
    const k = P.K;
    el("path", { d: `M${x - r} ${ys} V${yb} ${arc(x + r, yb, r, k, 0)} ${yb} V${ys} Z`, fill: "url(#rose)" }, g);
    el("ellipse", { cx: x, cy: ys, rx: r, ry: r * k, fill: "#f48fb1", opacity: 0.9 }, g);
    el("ellipse", { cx: x, cy: ys, rx: r, ry: r * k, fill: "none", stroke: "#fce4ec", "stroke-width": 1.6, opacity: 0.9 }, g);
    el("path", { d: `M${x - r} ${ys} ${arc(x + r, ys, r, k, 0)} ${ys}`, fill: "none", stroke: "#ad1457", "stroke-width": 1.2, opacity: 0.6 }, g);
  }

  function barreau(g, x, yb, r) {
    // Barreau aimanté blanc posé au fond ; il tourne (sa longueur apparente change).
    const b = el("g", {}, g), corps = el("rect", { x: x - 16, y: yb - r * P.K * 0.4 - 4, width: 32, height: 7, rx: 3.5, fill: "#ffffff", stroke: "#c9ced2" }, b);
    return (t) => { const c = Math.cos(t * 9), l = 4 + 28 * Math.abs(c); corps.setAttribute("x", x - l / 2); corps.setAttribute("width", l); };
  }

  P.becher = function (g, { x, y, r, h, niveau }) {
    // Bécher de 250 mL posé en (x, y) (milieu du fond) ; niveau entre 0 et 1.
    const k = P.K, yt = y - h, ys = y - h * niveau, b = el("g", { class: "becher" }, g);
    P.ombre(b, x, y, r + 3);
    el("ellipse", { cx: x, cy: yt, rx: r, ry: r * k, fill: "#e8f6fa", opacity: 0.18, stroke: "#8fb3bf", "stroke-width": 1.2 }, b);
    el("ellipse", { cx: x, cy: y, rx: r, ry: r * k, fill: "#d6ebf2", opacity: 0.35 }, b);
    const tourner = barreau(b, x, y, r);
    corps_liquide(b, x, y, r - 1.5, ys);
    el("path", { d: `M${x - r} ${yt} V${y} ${arc(x + r, y, r, k, 0)} ${y} V${yt}`, fill: "url(#verre)", stroke: "#7fa6b3", "stroke-width": 1.3 }, b);
    for (let i = 1; i <= 4; i++) {
      const yy = y - (h * 0.82 * i) / 4;
      el("path", { d: `M${x + r * 0.35} ${yy + 3} q${r * 0.25} 2 ${r * 0.48} 0`, stroke: "#ffffff", "stroke-width": 1.4, fill: "none", opacity: 0.9 }, b);
      el("text", { x: x + r * 0.3, y: yy + 2, "text-anchor": "end", "font-family": "system-ui", "font-size": 7, fill: "#ffffff", opacity: 0.9 }, b).textContent = 50 * i;
    }
    el("rect", { x: x - r * 0.78, y: yt + 10, width: 5, height: h - 22, rx: 2.5, fill: "#ffffff", opacity: 0.55 }, b);
    el("rect", { x: x - r * 0.6, y: yt + 14, width: 2, height: h - 34, rx: 1, fill: "#ffffff", opacity: 0.35 }, b);
    el("path", { d: `M${x - r} ${yt} ${arc(x + r, yt, r, k, 0)} ${yt}`, fill: "none", stroke: "#f4fbfd", "stroke-width": 3 }, b);
    el("path", { d: `M${x - r - 1} ${yt - 1} q-7 -3 -9 -7 q5 1 9 3`, fill: "#e8f6fa", stroke: "#7fa6b3", "stroke-width": 1 }, b);
    return { surface_y: ys, animer: tourner };
  };

  function graduations(b, x, haut, bas, r) {
    // Traits de 0 à 25 mL (un trait par mL, un nombre tous les 5 mL), de haut en bas.
    for (let v = 0; v <= 25; v++) {
      const y = haut + 18 + (v * (bas - haut - 60)) / 25, long = v % 5 ? 4 : 8;
      el("line", { x1: x - r, y1: y, x2: x - r + long, y2: y, stroke: "#264653", "stroke-width": v % 5 ? 0.6 : 1 }, b);
      if (v % 5 === 0) el("text", { x: x - r - 3, y: y + 2.5, "text-anchor": "end", "font-family": "system-ui", "font-size": 7, "font-weight": 700, fill: "#264653" }, b).textContent = v;
    }
  }

  P.burette = function (g, { x, haut, bas }) {
    // Burette de 25 mL : tube de verre, soude incolore (léger bleu), ménisque, robinet à clé bleue, pointe effilée.
    const r = 7, b = el("g", { class: "burette" }, g), menisque = haut + 40, robinet = bas - 42;
    el("rect", { x: x - r, y: menisque, width: 2 * r, height: robinet - menisque, fill: "url(#soude)" }, b);
    el("path", { d: `M${x - r} ${menisque - 2} Q${x} ${menisque + 5} ${x + r} ${menisque - 2}`, stroke: "#2c5d80", "stroke-width": 1.4, fill: "none" }, b);
    el("rect", { x: x - r, y: haut, width: 2 * r, height: robinet - haut, rx: 2, fill: "url(#verre)", stroke: "#7fa6b3", "stroke-width": 1.2 }, b);
    el("ellipse", { cx: x, cy: haut, rx: r, ry: r * P.K, fill: "none", stroke: "#f4fbfd", "stroke-width": 2.2 }, b);
    graduations(b, x, haut, bas, r);
    el("rect", { x: x - r + 2, y: haut + 6, width: 2.5, height: robinet - haut - 12, fill: "#ffffff", opacity: 0.6 }, b);
    el("rect", { x: x - 5, y: robinet, width: 10, height: 14, rx: 2, fill: "url(#verre)", stroke: "#7fa6b3" }, b);
    el("rect", { x: x - 22, y: robinet + 3, width: 44, height: 8, rx: 4, fill: "#1e88e5", stroke: "#0d47a1" }, b);
    el("rect", { x: x - 20, y: robinet + 4, width: 40, height: 2.5, rx: 1, fill: "#90caf9" }, b);
    el("path", { d: `M${x - 4} ${robinet + 14} L${x - 1.2} ${bas} H${x + 1.2} L${x + 4} ${robinet + 14} Z`, fill: "url(#verre)", stroke: "#7fa6b3", "stroke-width": 1 }, b);
    return { pointe: { x, y: bas } };
  };
})(window.P);

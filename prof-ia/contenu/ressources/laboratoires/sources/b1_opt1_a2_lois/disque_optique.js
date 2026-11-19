/*
Rôle : disque optique gradué (vertical, vu de face, sur son pied, avec son épaisseur) : graduations en degrés comptées à partir de la normale (verticale),
       dioptre horizontal passant par le centre ; module laser fixé sur un curseur que l'on fait glisser sur le bord du disque
       (angles entiers), visant le centre. Calcul des rayons réfléchi et réfracté (lois de Descartes, réflexion totale) ; dessin.
Reçoit : le groupe SVG ; { C (centre, écran), R (rayon, px), n (indice du milieu du bas ; null pour un miroir) }.
Produit : Labo.disque_optique(g, reglage) -> d { a (position du laser, degrés depuis la normale du haut, + à droite),
          rayons() -> { i, r (réfléchi), t (réfracté, null si réflexion totale), haut (laser dans l'air) }, dessiner() }.
Utilisé par : poste_reflexion.js, poste_refraction.js.
*/
(function (L) {
  const rad = (x) => (x * Math.PI) / 180, deg = (x) => (x * 180) / Math.PI;

  function graduations(g, C, R) {
    // Pied et tige, tranche du disque (épaisseur), face blanche, couronne graduée (1°, 5°, 10°), chiffres de 0 à 90 dans chaque
    // quart, normale en pointillés.
    L.pied_support(g, C.x, 530, C.y + R);
    L.svg("circle", { cx: C.x + 5, cy: C.y + 7, r: R + 22, fill: "#8d969c" }, g);
    L.svg("circle", { cx: C.x, cy: C.y, r: R + 22, fill: "#f7f6f0", stroke: "#a9a596", "stroke-width": 1.2 }, g);
    L.svg("circle", { cx: C.x, cy: C.y, r: R + 22, fill: "url(#reflet)" }, g);
    L.svg("circle", { cx: C.x, cy: C.y, r: R, fill: "none", stroke: "#333", "stroke-width": 0.8 }, g);
    for (let a = 0; a < 360; a++) { const l = a % 10 === 0 ? 10 : a % 5 === 0 ? 7 : 4, s = Math.sin(rad(a)), c = Math.cos(rad(a)); L.svg("line", { x1: C.x + R * s, y1: C.y - R * c, x2: C.x + (R + l) * s, y2: C.y - (R + l) * c, stroke: "#222", "stroke-width": a % 10 ? 0.5 : 0.9 }, g); }
    for (let a = 0; a < 360; a += 10) { const v = a <= 90 ? a : a <= 180 ? 180 - a : a <= 270 ? a - 180 : 360 - a; L.texte(g, C.x + (R - 12) * Math.sin(rad(a)), C.y - (R - 12) * Math.cos(rad(a)), String(v), { "font-size": 7.5, fill: "#222" }); }
    L.svg("line", { x1: C.x, y1: C.y - R, x2: C.x, y2: C.y + R, stroke: "#1a3d7c", "stroke-width": 0.8, "stroke-dasharray": "5 4" }, g);
    L.texte(g, C.x + 22, C.y - R + 24, "normale", { "font-size": 7.5, "font-weight": 700, fill: "#1a3d7c" });
    L.svg("circle", { cx: C.x, cy: C.y, r: 3, fill: "url(#metal)", stroke: "#555" }, g);
  }

  function milieu(g, C, R, n) {
    // Demi-cylindre de plexiglas (face avant, face arrière décalée, arêtes, reflet) ou miroir de verre (tranche, face argentée).
    if (n) {
      const arc = (dx, dy) => `M${C.x - R + dx} ${C.y + dy} A${R} ${R} 0 0 0 ${C.x + R + dx} ${C.y + dy} Z`;
      L.svg("path", { d: arc(5, -5), fill: "#cfe8ef", opacity: 0.45, stroke: "#9fc2cc" }, g);
      L.svg("path", { d: arc(0, 0), fill: "#cfe8ef", opacity: 0.6, stroke: "#7fa9b5", "stroke-width": 1.2 }, g);
      L.svg("path", { d: `M${C.x - R} ${C.y} L${C.x - R + 5} ${C.y - 5} H${C.x + R + 5} L${C.x + R} ${C.y}`, fill: "#e6f4f8", opacity: 0.8, stroke: "#7fa9b5" }, g);
      L.svg("path", { d: `M${C.x - R * 0.8} ${C.y + R * 0.45} A${R * 0.9} ${R * 0.9} 0 0 0 ${C.x - R * 0.2} ${C.y + R * 0.86}`, fill: "none", stroke: "#fff", "stroke-width": 3, opacity: 0.6 }, g);
      L.texte(g, C.x - 150, C.y + R + 44, `demi-cylindre de plexiglas (n = ${String(n).replace(".", ",")})`, { "font-size": 8, "font-weight": 700, fill: "#245a68" });
    } else {
      L.svg("rect", { x: C.x - R * 0.8 + 5, y: C.y - 5, width: R * 1.6, height: 5, fill: "url(#metal-h)", stroke: "#666" }, g);
      L.svg("rect", { x: C.x - R * 0.8, y: C.y, width: R * 1.6, height: 7, fill: "#8fb9b3", stroke: "#4d6b66" }, g);
      L.svg("rect", { x: C.x - R * 0.8, y: C.y + 7, width: R * 1.6, height: 3, fill: "#555" }, g);
      L.texte(g, C.x, C.y + 26, "miroir plan", { "font-size": 8, "font-weight": 700, fill: "#333" });
    }
    L.svg("line", { x1: C.x - R, y1: C.y, x2: C.x + R, y2: C.y, stroke: "#245a68", "stroke-width": 0.8, "stroke-dasharray": "2 3" }, g);
  }

  L.disque_optique = function (g, { C, R, n }) {
    // Disque, milieu du bas (miroir ou demi-cylindre), laser saisissable, rayons.
    const d = { a: -40 }, fond = L.svg("g", {}, g), rayons = L.svg("g", { "pointer-events": "none" }, g), laser = L.svg("g", { class: "laser", role: "slider", "aria-label": "Laser" }, g);
    graduations(fond, C, R);
    milieu(fond, C, R, n);
    d.rayons = () => {
      // Angles d'incidence, de réflexion et de réfraction (degrés), selon le côté du laser.
      const haut = Math.abs(d.a) < 90, i = haut ? Math.abs(d.a) : 180 - Math.abs(d.a), n1 = haut ? 1 : n, n2 = haut ? n : 1;
      if (!n) return { i, r: i, t: null, haut };
      const s = (n1 / n2) * Math.sin(rad(i));
      return { i, r: i, t: s > 1 ? null : deg(Math.asin(s)), haut };
    };
    d.dessiner = () => {
      // Laser au bord, rayon incident jusqu'au centre, réfléchi (faible s'il y a réfraction), réfracté.
      laser.replaceChildren(); rayons.replaceChildren();
      const P = (a, r) => ({ x: C.x + r * Math.sin(rad(a)), y: C.y - r * Math.cos(rad(a)) }), x = d.rayons(), sg = Math.sign(d.a) || 1;
      const tete = P(d.a, R + 26), dir = (Math.atan2(Math.cos(rad(d.a)), -Math.sin(rad(d.a))) * 180) / Math.PI;
      L.svg("rect", { x: -14, y: -R - 30, width: 28, height: 12, rx: 2, fill: "#2b3035", stroke: "#000", transform: `translate(${C.x} ${C.y}) rotate(${d.a})` }, laser);
      L.laser_module(laser, { x: tete.x, y: tete.y, angle: dir, allume: true, longueur: 64 });
      L.svg("rect", { x: -16, y: -R - 100, width: 32, height: 84, fill: "#000", opacity: 0.001, transform: `translate(${C.x} ${C.y}) rotate(${d.a})` }, laser);
      L.rayon_lumineux(rayons, [P(d.a, R + 26), C]);
      L.rayon_lumineux(rayons, [C, P(-d.a, R)], { opacite: n && x.t !== null ? 0.35 : 1 });
      if (x.t !== null) L.rayon_lumineux(rayons, [C, P(x.haut ? -sg * (180 - x.t) : -sg * x.t, R)]);
      return x;
    };
    L.glissable(laser, { soulever: false, debut: () => { const p = { x: C.x + (R + 44) * Math.sin(rad(d.a)), y: C.y - (R + 44) * Math.cos(rad(d.a)) }; return p; }, deplacer: (p) => { const a = Math.round(deg(Math.atan2(p.x - C.x, -(p.y - C.y)))); d.a = Math.abs(a) === 90 || (!n && Math.abs(a) > 89) ? d.a : a; d.dessiner(); d.sur_deplacement?.(); }, lacher: () => d.sur_lacher?.() });
    d.dessiner();
    return d;
  };
})(window.Labo);

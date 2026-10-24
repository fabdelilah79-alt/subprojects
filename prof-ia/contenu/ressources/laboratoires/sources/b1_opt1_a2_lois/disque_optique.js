/*
Rôle : disque optique gradué (vertical, vu de face) : graduations en degrés comptées à partir de la normale (verticale),
       dioptre horizontal passant par le centre ; laser que l'on fait glisser sur le bord du disque (angles entiers), visant
       le centre. Calcul des rayons réfléchi et réfracté (lois de Descartes, réflexion totale) ; dessin.
Reçoit : le groupe SVG ; { C (centre, écran), R (rayon, px), n (indice du milieu du bas ; null pour un miroir) }.
Produit : Labo.disque_optique(g, reglage) -> d { a (position du laser, degrés depuis la normale du haut, + à droite),
          rayons() -> { i, r (réfléchi), t (réfracté, null si réflexion totale), haut (laser dans l'air) }, dessiner() }.
Utilisé par : poste_reflexion.js, poste_refraction.js.
*/
(function (L) {
  const rad = (x) => (x * Math.PI) / 180, deg = (x) => (x * 180) / Math.PI;

  function graduations(g, C, R) {
    // Cercle, couronne graduée (1°, 5°, 10°), chiffres de 0 à 90 dans chaque quart, normale et dioptre en pointillés.
    L.svg("circle", { cx: C.x, cy: C.y, r: R + 22, fill: "#f6f4ec", stroke: "#8a8270", "stroke-width": 1.5 }, g);
    for (let a = 0; a < 360; a++) { const l = a % 10 === 0 ? 10 : a % 5 === 0 ? 7 : 4, s = Math.sin(rad(a)), c = Math.cos(rad(a)); L.svg("line", { x1: C.x + R * s, y1: C.y - R * c, x2: C.x + (R + l) * s, y2: C.y - (R + l) * c, stroke: "#333", "stroke-width": a % 10 ? 0.5 : 0.9 }, g); }
    for (let a = 0; a < 360; a += 10) { const v = a <= 90 ? a : a <= 180 ? 180 - a : a <= 270 ? a - 180 : 360 - a; L.texte(g, C.x + (R - 12) * Math.sin(rad(a)), C.y - (R - 12) * Math.cos(rad(a)), String(v), { "font-size": 7.5, fill: "#333" }); }
    L.svg("line", { x1: C.x, y1: C.y - R, x2: C.x, y2: C.y + R, stroke: "#1a3d7c", "stroke-width": 0.8, "stroke-dasharray": "5 4" }, g);
    L.texte(g, C.x + 22, C.y - R + 24, "normale", { "font-size": 7.5, "font-weight": 700, fill: "#1a3d7c" });
  }

  L.disque_optique = function (g, { C, R, n }) {
    // Disque, milieu du bas (miroir ou demi-cylindre), laser saisissable, rayons.
    const d = { a: -40 }, fond = L.svg("g", {}, g), rayons = L.svg("g", { "pointer-events": "none" }, g), laser = L.svg("g", { class: "laser", role: "slider", "aria-label": "Laser" }, g);
    graduations(fond, C, R);
    if (n) { L.svg("path", { d: `M${C.x - R} ${C.y} A${R} ${R} 0 0 0 ${C.x + R} ${C.y} Z`, fill: "#cfe8ef", opacity: 0.75, stroke: "#7fa9b5" }, fond); L.texte(fond, C.x, C.y + R * 0.55, `demi-cylindre de plexiglas (n = ${String(n).replace(".", ",")})`, { "font-size": 8, "font-weight": 700, fill: "#245a68" }); }
    else { L.svg("rect", { x: C.x - R * 0.8, y: C.y, width: R * 1.6, height: 8, fill: "url(#metal)", stroke: "#555" }, fond); L.svg("rect", { x: C.x - R * 0.8, y: C.y + 8, width: R * 1.6, height: 6, fill: "#555" }, fond); L.texte(fond, C.x, C.y + 30, "miroir plan", { "font-size": 8, "font-weight": 700, fill: "#333" }); }
    L.svg("line", { x1: C.x - R, y1: C.y, x2: C.x + R, y2: C.y, stroke: "#245a68", "stroke-width": 0.8, "stroke-dasharray": "2 3" }, fond);
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
      L.svg("rect", { x: -9, y: -R - 64, width: 18, height: 40, rx: 3, fill: "#2b3035", stroke: "#000", transform: `translate(${C.x} ${C.y}) rotate(${d.a})` }, laser);
      L.svg("rect", { x: -12, y: -R - 70, width: 24, height: 52, fill: "#000", opacity: 0.001, transform: `translate(${C.x} ${C.y}) rotate(${d.a})` }, laser);
      L.rayon_lumineux(rayons, [P(d.a, R + 24), C]);
      L.rayon_lumineux(rayons, [C, P(-d.a, R)], { opacite: n && x.t !== null ? 0.35 : 1 });
      if (x.t !== null) L.rayon_lumineux(rayons, [C, P(x.haut ? -sg * (180 - x.t) : -sg * x.t, R)]);
      return x;
    };
    L.glissable(laser, { soulever: false, debut: () => { const p = { x: C.x + (R + 44) * Math.sin(rad(d.a)), y: C.y - (R + 44) * Math.cos(rad(d.a)) }; return p; }, deplacer: (p) => { const a = Math.round(deg(Math.atan2(p.x - C.x, -(p.y - C.y)))); d.a = Math.abs(a) === 90 || (!n && Math.abs(a) > 89) ? d.a : a; d.dessiner(); d.sur_deplacement?.(); }, lacher: () => d.sur_lacher?.() });
    d.dessiner();
    return d;
  };
})(window.Labo);

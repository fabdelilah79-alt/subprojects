/*
Rôle : dessin réaliste d'une pièce de verrerie (profil de verrerie_profils.js) dans sa position : ombre portée, verre
       épais et transparent (bords plus sombres, reflets verticaux), bord supérieur ovale, fond en perspective, liquide en
       phases avec sa surface (ovale clair si le récipient est droit, ménisque), graduations émaillées blanches, bec,
       pied d'éprouvette, bourrelet de tube, robinet et col rodé d'ampoule, bouchon.
Reçoit : le groupe SVG, le profil, la pose { x, y (milieu du fond, px), angle (degrés), e (px par mm) } et l'état
         { regions : [{ poly (repère du récipient), rgb, alpha }], surface : [p1, p2] ou null, bouchon, robinet, etiquette }.
Produit : Labo.dessiner_verrerie(g, profil, pose, etat).
Utilisé par : recipient_physique.js.
*/
(function (L) {
  const chemin = (poly) => (poly.length ? "M" + poly.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" L") + " Z" : "");
  const VERRE_FOND = "rgba(214,233,240,0.20)", BORD = "rgba(120,150,160,0.85)";

  function verre(g, pr) {
    // Corps du verre : paroi (entre contour extérieur et intérieur) légèrement teintée, contours, fond épais en perspective.
    const R = pr.r(pr.h0) + pr.t, ry = 0.12 * R, yb = -pr.h0;
    L.svg("path", { d: chemin(pr.exterieur) + " " + chemin(pr.interieur), fill: "rgba(200,225,233,0.45)", "fill-rule": "evenodd" }, g);
    L.svg("path", { d: chemin(pr.interieur), fill: VERRE_FOND }, g);
    L.svg("path", { d: chemin(pr.exterieur), fill: "none", stroke: BORD, "stroke-width": 0.45 }, g);
    if (!pr.extras.tige) L.svg("path", { d: `M${-R} ${yb} A${R} ${ry} 0 0 0 ${R} ${yb}`, fill: "none", stroke: "rgba(255,255,255,0.55)", "stroke-width": 0.5 }, g);
  }

  function reflets(g, pr) {
    // Deux reflets verticaux sur la gauche, un mince sur la droite (lumière venant de la gauche).
    const H = pr.H, r = pr.r(H * 0.5);
    L.svg("rect", { x: -r * 0.78, y: -H * 0.9, width: r * 0.14, height: H * 0.78, rx: r * 0.07, fill: "#fff", opacity: 0.28 }, g);
    L.svg("rect", { x: -r * 0.55, y: -H * 0.86, width: r * 0.05, height: H * 0.7, fill: "#fff", opacity: 0.2 }, g);
    L.svg("rect", { x: r * 0.78, y: -H * 0.8, width: r * 0.05, height: H * 0.6, fill: "#fff", opacity: 0.18 }, g);
  }

  function bord(g, pr) {
    // Bord supérieur vu un peu d'en haut : anneau ovale (épaisseur du verre), bec éventuel.
    const H = pr.H, r = pr.r(H), t = pr.t, ry = 0.12 * (r + t);
    L.svg("ellipse", { cx: 0, cy: -H, rx: r + t / 2, ry, fill: "none", stroke: "rgba(235,246,250,0.9)", "stroke-width": t }, g);
    L.svg("ellipse", { cx: 0, cy: -H, rx: r + t, ry: ry + t / 2, fill: "none", stroke: BORD, "stroke-width": 0.35 }, g);
    if (pr.extras.bec) L.svg("path", { d: `M${r} ${-H - 0.5} q2.5 -0.5 3.8 -2.2 q-1 2.8 -3.8 3.4`, fill: "rgba(225,240,245,0.9)", stroke: BORD, "stroke-width": 0.35 }, g);
    if (pr.extras.bourrelet) L.svg("ellipse", { cx: 0, cy: -H, rx: r + t * 1.6, ry: ry + t, fill: "none", stroke: "rgba(235,246,250,0.9)", "stroke-width": t * 0.9 }, g);
  }

  function graduations(g, pr) {
    // Traits et nombres émaillés en blanc, sur la droite, et la capacité.
    for (const { v, h } of pr.graduations) {
      const r = pr.r(h);
      L.svg("path", { d: `M${r * 0.35} ${-h} H${r * 0.9}`, stroke: "#fff", "stroke-width": 0.5, opacity: 0.9 }, g);
      L.svg("text", { x: r * 0.3, y: -h + 0.9, "font-size": 2.6, "text-anchor": "end", fill: "#fff", opacity: 0.9, "font-family": "sans-serif" }, g).textContent = String(v);
    }
    if (pr.graduations.length) L.svg("text", { x: -pr.r(pr.H * 0.2) * 0.5, y: -pr.H * 0.12, "font-size": 2.8, fill: "#fff", opacity: 0.85, "font-family": "sans-serif" }, g).textContent = `${pr.graduations[pr.graduations.length - 1].v} mL`;
  }

  function liquide(g, etat) {
    // Phases (tranches qui ne se recouvrent pas ; la première est celle du haut), puis surface : ovale clair et ménisque.
    for (const ph of etat.regions) L.svg("path", { d: chemin(ph.poly), fill: L.rgb(ph.rgb), opacity: ph.alpha }, g);
    const s = etat.surface;
    if (!s) return;
    const mx = (s[0].x + s[1].x) / 2, my = (s[0].y + s[1].y) / 2, l = Math.hypot(s[1].x - s[0].x, s[1].y - s[0].y) / 2, a = (Math.atan2(s[1].y - s[0].y, s[1].x - s[0].x) * 180) / Math.PI;
    const haut = etat.regions[0];
    if (etat.droit) L.svg("ellipse", { cx: mx, cy: my, rx: l, ry: l * 0.12, transform: `rotate(${a} ${mx} ${my})`, fill: L.rgb(haut.rgb.map((v) => Math.min(255, v + 25))), opacity: Math.min(0.9, haut.alpha + 0.15) }, g);
    L.svg("path", { d: `M${s[0].x} ${s[0].y} L${s[1].x} ${s[1].y}`, stroke: "rgba(255,255,255,0.7)", "stroke-width": 0.4 }, g);
  }

  L.dessiner_verrerie = function (g, pr, pose, etat) {
    // Dessine la pièce complète ; tout est dessiné dans le repère du récipient (mm).
    g.replaceChildren();
    if (Math.abs(pose.angle || 0) < 2 && etat.ombre !== false && !pr.extras.tige && !pr.extras.sans_ombre) L.svg("ellipse", { cx: pose.x + 4, cy: pose.y + 2, rx: (pr.r(0) + pr.t) * pose.e * 1.05, ry: (pr.r(0) + pr.t) * pose.e * 0.16, fill: "#000", opacity: 0.28 }, g);
    const l = L.svg("g", { transform: `translate(${pose.x} ${pose.y}) rotate(${pose.angle || 0}) scale(${pose.e})` }, g);
    verre(l, pr);
    liquide(l, etat);
    L.dessin_accessoires?.(l, pr, etat);
    reflets(l, pr);
    graduations(l, pr);
    bord(l, pr);
    return l;
  };
})(window.Labo);

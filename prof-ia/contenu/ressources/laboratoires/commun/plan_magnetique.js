/*
Rôle : feuille (ou plaque) posée sur la paillasse, vue un peu d'en haut, où l'on étudie le champ magnétique : passage des
       coordonnées du plan (mètres ; x vers l'est, y vers le sud, c'est-à-dire vers l'élève) aux coordonnées de l'écran, et
       inversement ; dessin de la feuille avec sa rose des vents (le nord est vers le fond de la paillasse),
       dessinée à part pour rester au-dessus de la limaille.
Reçoit : { cx, cy (centre à l'écran), ex, ey (pixels par mètre en x et en y), du, dv (demi-largeur et demi-profondeur, m) }.
Produit : Labo.plan_magnetique(reglage) -> plan { ecran(p), plan(e), dans(p, marge), borner(p, marge), ...reglage } ;
          Labo.plan_magnetique.feuille(g, plan, { matiere }) (« papier » ou « plexiglas ») ; Labo.plan_magnetique.rose(g, plan).
Utilisé par : boussole.js, limaille.js, teslametre.js et les postes des simulations de magnétisme.
*/
(function (L) {
  L.plan_magnetique = function (r) {
    // Projection simple : x → horizontale, y → verticale écrasée (vue en biais).
    const plan = { ...r };
    plan.ecran = (p) => ({ x: r.cx + p.x * r.ex, y: r.cy + p.y * r.ey });
    plan.plan = (e) => ({ x: (e.x - r.cx) / r.ex, y: (e.y - r.cy) / r.ey });
    plan.dans = (p, m = 0) => Math.abs(p.x) <= r.du - m && Math.abs(p.y) <= r.dv - m;
    plan.borner = (p, m = 0) => ({ x: Math.max(-r.du + m, Math.min(r.du - m, p.x)), y: Math.max(-r.dv + m, Math.min(r.dv - m, p.y)) });
    return plan;
  };

  L.plan_magnetique.feuille = function (g, plan, { matiere = "papier" } = {}) {
    // Ombre, feuille blanche (ou plaque de plexiglas sur cales), quadrillage léger tous les 2 cm.
    const a = plan.ecran({ x: -plan.du, y: -plan.dv }), b = plan.ecran({ x: plan.du, y: plan.dv }), verre = matiere === "plexiglas";
    L.svg("rect", { x: a.x + 4, y: a.y + 6, width: b.x - a.x, height: b.y - a.y, fill: "#000", opacity: 0.25 }, g);
    L.svg("rect", { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y, fill: verre ? "#dfeef2" : "#fbfaf4", stroke: verre ? "#9fb6be" : "#d6d2c2", opacity: verre ? 0.92 : 1 }, g);
    for (let x = -plan.du + 0.02; x < plan.du; x += 0.02) { const e = plan.ecran({ x, y: 0 }); L.svg("line", { x1: e.x, y1: a.y, x2: e.x, y2: b.y, stroke: "#c9d6dc", "stroke-width": 0.5 }, g); }
    for (let y = -plan.dv + 0.02; y < plan.dv; y += 0.02) { const e = plan.ecran({ x: 0, y }); L.svg("line", { x1: a.x, y1: e.y, x2: b.x, y2: e.y, stroke: "#c9d6dc", "stroke-width": 0.5 }, g); }
  };

  L.plan_magnetique.rose = function (g, plan) {
    // Flèche « Nord » imprimée dans le coin de la feuille (dessinée au-dessus de la limaille).
    const b = plan.ecran({ x: plan.du, y: plan.dv }), a = plan.ecran({ x: -plan.du, y: -plan.dv }), r = { x: b.x - 26, y: a.y + 30 };
    L.svg("rect", { x: r.x - 14, y: r.y - 28, width: 28, height: 44, fill: "#fbfaf4" }, g);
    L.svg("path", { d: `M${r.x} ${r.y + 14} L${r.x} ${r.y - 12} M${r.x - 5} ${r.y - 4} L${r.x} ${r.y - 13} L${r.x + 5} ${r.y - 4}`, fill: "none", stroke: "#1a3d7c", "stroke-width": 1.6 }, g);
    L.texte(g, r.x, r.y - 21, "Nord", { "font-size": 8, "font-weight": 700, fill: "#1a3d7c" });
  };
})(window.Labo);

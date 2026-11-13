/*
Rôle : paillasse « champ de vision d'un miroir plan » (vue de dessus) : petit miroir de 10 cm debout au fond d'une feuille,
       six pions de couleur et une figurine « œil » que l'on fait glisser. Un pion est vu dans le miroir si la droite qui va
       de l'œil à l'image du pion (symétrique par rapport au miroir) traverse le miroir ; la zone vue (champ de vision) est
       tracée à partir de l'image de l'œil et des bords du miroir.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_champ(g) -> { pense_bete } ; fait « champ » = { pres, loin (nombre de pions vus) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const YM = -0.09, XM = 0.05, PIONS = [["rouge", -0.12, -0.03, "#d63a2f"], ["bleu", -0.06, 0.02, "#2f6fd0"], ["vert", 0.02, -0.05, "#3c9a4a"], ["jaune", 0.09, 0.0, "#f2c230"], ["violet", 0.15, -0.04, "#8e44ad"], ["orange", -0.17, 0.05, "#ef8a2a"]];

  function vus(oeil) {
    // Pions dont l'image est vue à travers le miroir depuis l'œil.
    return PIONS.filter(([, x, y]) => { const yi = 2 * YM - y, t = (YM - oeil.y) / (yi - oeil.y), xc = oeil.x + t * (x - oeil.x); return t > 0 && t < 1 && Math.abs(xc) <= XM; });
  }

  function champ(g, plan, oeil) {
    // Image de l'œil, bords du champ (droites issues de l'image passant par les bords du miroir), rayons des pions vus.
    g.replaceChildren();
    const Ei = { x: oeil.x, y: 2 * YM - oeil.y }, bord = (s) => { const t = (0.11 - Ei.y) / (YM - Ei.y); return { x: Ei.x + t * (s * XM - Ei.x), y: 0.11 }; };
    const a = plan.ecran({ x: -XM, y: YM }), b = plan.ecran({ x: XM, y: YM }), c = plan.ecran(bord(1)), d = plan.ecran(bord(-1));
    L.svg("path", { d: `M${a.x} ${a.y} L${b.x} ${b.y} L${c.x} ${c.y} L${d.x} ${d.y} Z`, fill: "#9fe3a8", opacity: 0.22 }, g);
    for (const [p, q] of [[a, d], [b, c]]) L.svg("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y, stroke: "#3c9a4a", "stroke-width": 1, "stroke-dasharray": "5 4" }, g);
    for (const [, x, y] of vus(oeil)) {
      const yi = 2 * YM - y, t = (YM - oeil.y) / (yi - oeil.y), m = { x: oeil.x + t * (x - oeil.x), y: YM };
      L.rayon_lumineux(g, [plan.ecran({ x, y }), plan.ecran(m), plan.ecran(oeil)], { couleur: "#ffb300", largeur: 1.1 });
    }
  }

  L.poste_champ = function (g) {
    // Feuille, miroir, pions, œil saisissable, champ ; bulle ; faits.
    const { pense_bete } = L.decor_circuit(g, 1), plan = L.plan_magnetique({ cx: 512, cy: 395, ex: 1800, ey: 1050, du: 0.22, dv: 0.11 }), e = { oeil: { x: 0.0, y: 0.06 }, pres: null, loin: null };
    L.plan_magnetique.feuille(L.svg("g", {}, g), plan);
    const h = plan.ecran({ x: -plan.du, y: -plan.dv }), k = plan.ecran({ x: plan.du, y: plan.dv }), clip = L.svg("clipPath", { id: "clip_champ" }, g);
    L.svg("rect", { x: h.x, y: h.y, width: k.x - h.x, height: k.y - h.y }, clip);
    const gc = L.svg("g", { "pointer-events": "none", "clip-path": "url(#clip_champ)" }, g), a = plan.ecran({ x: -XM, y: YM }), b = plan.ecran({ x: XM, y: YM });
    L.svg("rect", { x: a.x, y: a.y - 42, width: b.x - a.x, height: 42, fill: "url(#metal-h)", stroke: "#555" }, g);
    L.svg("rect", { x: a.x + 3, y: a.y - 39, width: b.x - a.x - 6, height: 34, fill: "#cfe3ea", opacity: 0.7 }, g);
    L.svg("rect", { x: a.x - 6, y: a.y - 2, width: b.x - a.x + 12, height: 8, rx: 2, fill: "#2b3035" }, g);
    L.texte(g, (a.x + b.x) / 2, a.y - 50, "miroir plan (10 cm)", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
    for (const [nom, x, y, c] of PIONS) { const p = plan.ecran({ x, y }); L.ombre_sol(g, p.x + 2, p.y + 4, 11, 4, 0.4); L.svg("ellipse", { cx: p.x, cy: p.y + 3, rx: 10, ry: 6, fill: "#222", opacity: 0.4 }, g); L.svg("ellipse", { cx: p.x, cy: p.y, rx: 10, ry: 6, fill: c, stroke: "#222" }, g); L.texte(g, p.x, p.y + 16, nom, { "font-size": 7.5, "font-weight": 700, fill: "#333" }); }
    const go = L.svg("g", { class: "oeil", role: "button", "aria-label": "Figurine œil" }, g), bulle = L.svg("g", {}, g);
    const maj = () => {
      // Champ, figurine, bulle ; nombres de pions vus près du miroir et loin du miroir.
      champ(gc, plan, e.oeil); go.replaceChildren(); bulle.replaceChildren();
      const p = plan.ecran(e.oeil), v = vus(e.oeil), dist = e.oeil.y - YM;
      L.svg("ellipse", { cx: p.x, cy: p.y + 3, rx: 13, ry: 7, fill: "#000", opacity: 0.3 }, go); L.svg("ellipse", { cx: p.x, cy: p.y, rx: 13, ry: 8, fill: "#f2efe4", stroke: "#333" }, go);
      L.svg("ellipse", { cx: p.x, cy: p.y, rx: 7, ry: 4, fill: "#fff", stroke: "#333" }, go); L.svg("circle", { cx: p.x, cy: p.y - 1, r: 2.6, fill: "#2b4a6a" }, go);
      L.svg("rect", { x: 780, y: 200, width: 220, height: 44, rx: 10, fill: "#fdfdf8", stroke: "#999" }, bulle);
      L.texte(bulle, 890, 214, "Dans le miroir, je vois :", { "font-size": 8, "font-weight": 700, fill: "#333" });
      L.texte(bulle, 890, 231, v.map((x) => x[0]).join(", ") || "aucun pion", { "font-size": 9, "font-weight": 700, fill: "#1a3d7c" });
      if (dist < 0.07) e.pres = v.length; if (dist > 0.15) e.loin = v.length;
    };
    L.glissable(go, { soulever: false, debut: () => plan.ecran(e.oeil), deplacer: (p) => { const q = plan.plan(p); e.oeil = { x: Math.max(-0.2, Math.min(0.2, q.x)), y: Math.max(YM + 0.03, Math.min(0.1, q.y)) }; maj(); } });
    maj();
    setInterval(() => L.missions.noter("champ", { pres: e.pres, loin: e.loin }), 250);
    return { pense_bete };
  };
})(window.Labo);

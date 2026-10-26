/*
Rôle : optique de la loupe (lentille convergente f' = 5 cm, œil fixe à 22 cm de l'objet) : où est l'image de la coccinelle,
       sous quel angle l'œil la voit (grossissement G : angle avec la loupe / angle à 25 cm sans loupe), est-elle nette
       (l'œil voit net de 25 cm à l'infini) ; dessin de la coccinelle, de ce que voit l'œil, des rayons et de leurs prolongements.
Reçoit : la distance d (cm) de la loupe à l'objet.
Produit : Labo.vision_loupe(d) -> { G, flou, virtuelle, OAp, gamma } ; Labo.coccinelle(g, x, y, echelle) ;
          Labo.vue_oeil(g, vision) ; Labo.rayons_loupe(g, d, P) (P : cm -> écran, origine en A).
Utilisé par : poste_observation_loupe.js.
*/
(function (L) {
  const F = 5, OEIL = 22, H = 2, VUE = { x: 675, y: 84, r: 72 };
  let n_flou = 0;

  L.vision_loupe = function (d) {
    // Image (relation de conjugaison), distance de l'image à l'œil, grossissement, flou d'accommodation.
    const acc = (D) => (D >= 25 ? 0 : Math.min(12, 110 * (1 / D - 1 / 25))), dl = OEIL - d, inv = 1 / F - 1 / d;
    if (Math.abs(inv) < 1e-3) return { G: 25 / F, flou: 0, virtuelle: true, OAp: -Infinity, gamma: Infinity };
    const OAp = 1 / inv, gamma = OAp / -d;
    if (OAp < 0) { const D = -OAp + dl; return { G: (gamma * 25) / D, flou: acc(D), virtuelle: true, OAp, gamma }; }
    const s = dl - OAp;
    if (s <= 1) return { G: 4, flou: 12, virtuelle: false, OAp, gamma };
    return { G: Math.max(-6, (gamma * 25) / s), flou: acc(s), virtuelle: false, OAp, gamma };
  };

  L.coccinelle = function (g, x, y, k) {
    // Coccinelle de 2 cm (k : px par cm ; k < 0 : renversée) : pattes, corps rouge, tête, ligne, points.
    const c = L.svg("g", { transform: `translate(${x} ${y}) scale(${k / 10})` }, g);
    for (const s of [-1, 1]) for (const v of [-4, 0, 4]) L.svg("line", { x1: 0, y1: v, x2: s * 9, y2: v + 2, stroke: "#111", "stroke-width": 0.8 }, c);
    L.svg("circle", { cx: 0, cy: -7, r: 3.2, fill: "#111" }, c);
    L.svg("ellipse", { cx: 0, cy: 1, rx: 7, ry: 8, fill: "#d32f2f", stroke: "#5a0d0d", "stroke-width": 0.5 }, c);
    L.svg("line", { x1: 0, y1: -6.5, x2: 0, y2: 9, stroke: "#111", "stroke-width": 0.7 }, c);
    for (const [px, py] of [[-3.5, -2], [3.5, -2], [-4, 3.5], [4, 3.5], [-1.8, 7], [1.8, 7]]) L.svg("circle", { cx: px, cy: py, r: 1.3, fill: "#111" }, c);
  };

  L.vue_oeil = function (g, v) {
    // Ce que voit l'œil : disque (pupille de la loupe) sur fond de papier, coccinelle grossie, nette ou floue.
    g.replaceChildren();
    const id = `flou_oeil_${++n_flou}`, clip = L.svg("clipPath", { id: `${id}_c` }, g);
    L.svg("circle", { cx: VUE.x, cy: VUE.y, r: VUE.r }, clip);
    const fl = L.svg("filter", { id, x: "-50%", y: "-50%", width: "200%", height: "200%" }, g);
    L.svg("feGaussianBlur", { stdDeviation: v.flou.toFixed(2) }, fl);
    L.svg("rect", { x: VUE.x - 84, y: 4, width: 168, height: 162, rx: 6, fill: "#20262b", stroke: "#000" }, g);
    const z = L.svg("g", { "clip-path": `url(#${id}_c)` }, g);
    L.svg("rect", { x: VUE.x - VUE.r, y: VUE.y - VUE.r, width: 2 * VUE.r, height: 2 * VUE.r, fill: "#f3efe2" }, z);
    L.coccinelle(L.svg("g", { filter: `url(#${id})` }, z), VUE.x, VUE.y, 10 * v.G);
    L.texte(g, VUE.x, VUE.y + VUE.r + 5, "ce que voit l'œil", { "font-size": 7, "font-weight": 700, fill: "#e8e2d4" });
  };

  L.rayons_loupe = function (g, d, P) {
    // Axe, F et F', deux rayons issus de B (parallèle à l'axe, par O) jusqu'à l'œil ; prolongements vers B' (image virtuelle).
    g.replaceChildren();
    const id = `zone_rayons_${++n_flou}`, zone = L.svg("clipPath", { id }, g), a = P(-6, 8), z = P(OEIL - 1.3, -8);
    L.svg("rect", { x: a.x, y: a.y, width: z.x - a.x, height: z.y - a.y }, zone);
    g = L.svg("g", { "clip-path": `url(#${id})` }, g);
    const ax = [P(-2, 0), P(OEIL, 0)], v = L.vision_loupe(d), fin = OEIL - 1.3;
    L.svg("line", { x1: ax[0].x, y1: ax[0].y, x2: ax[1].x, y2: ax[1].y, stroke: "#9fb4c8", "stroke-width": 0.8, "stroke-dasharray": "8 3 2 3" }, g);
    for (const [x, n] of [[d - F, "F"], [d + F, "F'"]]) { const p = P(x, 0); L.svg("line", { x1: p.x, y1: p.y - 5, x2: p.x, y2: p.y + 5, stroke: "#ffd54f", "stroke-width": 1.4 }, g); L.texte(g, p.x, p.y + 14, n, { "font-size": 8, "font-weight": 700, fill: "#ffd54f" }); }
    const r1 = [P(0, H), P(d, H), P(fin, H - (H * (fin - d)) / F)], r2 = [P(0, H), P(d, 0), P(fin, (-H * (fin - d)) / d)];
    L.rayon_lumineux(g, r1, { couleur: "#ff5a4a", largeur: 1.3, halo: false }); L.rayon_lumineux(g, r2, { couleur: "#4aa3ff", largeur: 1.3, halo: false });
    if (!v.virtuelle || !Number.isFinite(v.OAp)) return;
    const Bp = P(d + v.OAp, H * v.gamma);
    for (const [a, c] of [[r1[1], "#ff5a4a"], [r2[1], "#4aa3ff"]]) L.svg("line", { x1: a.x, y1: a.y, x2: Bp.x, y2: Bp.y, stroke: c, "stroke-width": 1, "stroke-dasharray": "5 4" }, g);
    L.svg("path", { d: `M${P(d + v.OAp, 0).x} ${P(0, 0).y} L${Bp.x} ${Bp.y}`, stroke: "#ffd54f", "stroke-width": 1.6, "stroke-dasharray": "3 2" }, g);
    L.texte(g, Bp.x - 10, Bp.y - 4, "B'", { "font-size": 8, "font-weight": 700, fill: "#ffd54f" });
  };
})(window.Labo);

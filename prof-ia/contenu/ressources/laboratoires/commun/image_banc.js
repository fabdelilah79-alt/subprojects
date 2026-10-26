/*
Rôle : image donnée par une lentille mince convergente sur le banc d'optique : relation de conjugaison (positions en cm
       mesurées sur le rail, axe orienté dans le sens de la lumière : 1/OA' − 1/OA = 1/f'), grandissement γ = OA'/OA ; dessin
       sur l'écran de la tache de lumière et de l'image du « F » (renversée, agrandie ou réduite), floue si l'écran n'est pas
       à la place de l'image (cercle de flou : diamètre D·|écart|/OA'), plus floue sans diaphragme (aberrations), plus pâle
       quand elle est grande. Objet à l'infini : petite maison lointaine, image dans le plan focal.
Reçoit : la position de l'objet, de la lentille, de l'écran, f' (cm), le diamètre utile D (mm).
Produit : Labo.conjuguer({ xO, xL, f, infini }) -> { OA, OAp (null : pas d'image réelle), gamma } ;
          Labo.image_banc(g, T, reglage) -> { nette } (T : transformation de l'écran, banc_optique.js) ;
          Labo.faisceau_banc(g, banc, reglage) : le faisceau visible entre l'objet, la lentille et l'écran.
Utilisé par : les postes des simulations d'optique (lentilles).
*/
(function (L) {
  let n_filtre = 0;

  L.conjuguer = function ({ xO, xL, f, infini = false }) {
    // OA (cm, négatif : objet avant la lentille), OA' (cm) et γ ; OA' = null si l'image n'est pas réelle.
    if (infini) return { OA: -Infinity, OAp: f, gamma: 0 };
    const OA = xO - xL, inv = 1 / f + 1 / OA;
    if (inv <= 1e-6) return { OA, OAp: null, gamma: null };
    const OAp = 1 / inv;
    return { OA, OAp, gamma: OAp / OA };
  };

  function trace(T, segments, g_, attrs, g) {
    // Segments (mm, repère de l'écran) agrandis de g_ puis portés sur l'écran.
    const d = segments.map(([a, b, c, e]) => { const m = T(g_ * a, g_ * b), n = T(g_ * c, g_ * e); return `M${m.x} ${m.y} L${n.x} ${n.y}`; }).join(" ");
    return L.svg("path", { d, fill: "none", ...attrs }, g);
  }

  L.image_banc = function (g, T, { xE, xL, f, xO, infini = false, D = 40 }) {
    // Tache de lumière, puis image floue ou nette ; rien de net si l'image est virtuelle.
    g.replaceChildren();
    const id = `flou_banc_${++n_filtre}`, filtre = L.svg("filter", { id, x: "-50%", y: "-50%", width: "200%", height: "200%" }, g), flou = L.svg("feGaussianBlur", { stdDeviation: 0 }, filtre);
    const coins = [T(-60, -60), T(60, -60), T(60, 60), T(-60, 60)], clip = L.svg("clipPath", { id: `${id}_c` }, g);
    L.svg("path", { d: `M${coins.map((q) => `${q.x} ${q.y}`).join(" L")} Z` }, clip);
    g = L.svg("g", { "clip-path": `url(#${id}_c)` }, g);
    const c = L.conjuguer({ xO, xL, f, infini }), dE = xE - xL;
    if (c.OAp === null) { L.svg("ellipse", { cx: T(0, 0).x, cy: T(0, 0).y, rx: 26, ry: 52, fill: "#fff3b0", opacity: 0.25 }, g); return { nette: false, ...c }; }
    const ecart = dE - c.OAp, diam = (D * Math.abs(ecart)) / Math.abs(c.OAp), r = Math.max(4, Math.min(60, diam / 2 + 12));
    L.svg("ellipse", { cx: T(0, 0).x, cy: T(0, 0).y, rx: (r * 60) / 120, ry: r, fill: "#fff3b0", opacity: Math.max(0.15, Math.min(0.6, 600 / (r * r))) }, g);
    const sigma = 0.35 * diam + (D > 20 ? 1.1 : 0.2), nette = sigma < 1.8 && Math.abs(ecart) < 0.6;
    flou.setAttribute("stdDeviation", Math.min(12, sigma).toFixed(2));
    const gi = L.svg("g", { filter: `url(#${id})` }, g);
    if (infini) {
      const h = 0.06 * f * 10, s = -h / 20;
      trace(T, [[-8, 0, 8, 0], [8, 0, 8, -12], [8, -12, -8, -12], [-8, -12, -8, 0], [-10, -12, 0, -20], [0, -20, 10, -12], [14, 0, 14, -14]], s, { stroke: "#6b4a10", "stroke-width": Math.max(0.6, 2 * Math.abs(s)) }, gi);
    } else {
      const op = Math.max(0.2, Math.min(1, ((D / 40) ** 2 * 1.4) / Math.max(0.5, c.gamma * c.gamma)));
      trace(T, [[0, 0, 0, -20], [0, -20, 12, -20], [0, -11, 8, -11]], c.gamma, { stroke: "#ffcf3a", "stroke-width": Math.max(1, 3 * Math.abs(c.gamma)), opacity: op, "stroke-linecap": "square" }, gi);
    }
    return { nette, ...c };
  };

  L.faisceau_banc = function (g, b, { xO, xL, xE, f, infini, diaphragme }) {
    // Faisceau visible (poussière) : de l'objet aux bords de la lentille, puis vers l'image (réelle ou virtuelle) jusqu'à l'écran.
    g.replaceChildren();
    const a = diaphragme ? 8 : 24, pL = b.px(xL), pE = b.px(xE), y = b.axe, st = { fill: "#fff3b0", opacity: 0.1 };
    if (!infini) L.svg("path", { d: `M${b.px(xO) - 22} ${y - 16} L${pL} ${y - a} L${pL} ${y + a} L${b.px(xO) - 22} ${y + 16} Z`, ...st }, g);
    const inv = 1 / f + (infini ? 0 : 1 / (xO - xL)), t = Math.abs(inv) < 1e-6 ? 0 : (xE - xL) * inv, h = a * (1 - t);
    L.svg("path", { d: `M${pL} ${y - a} L${pE} ${y - h} L${pE} ${y + h} L${pL} ${y + a} Z`, ...st, opacity: 0.14 }, g);
  };
})(window.Labo);

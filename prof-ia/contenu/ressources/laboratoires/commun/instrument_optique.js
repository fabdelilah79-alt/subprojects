/*
Rôle : optique des instruments à lentilles minces (lunette, microscope, loupe) : images successives (relation de conjugaison
       lentille après lentille, objet ou image à l'infini), angle sous lequel l'œil voit l'image finale, grossissement
       G = α' / α (α : objet à l'infini vu à l'œil nu, ou objet vu à 25 cm), flou quand l'œil ne peut pas accommoder (il voit
       net de 25 cm à l'infini) ; marche de rayons (approximation de Gauss) ; vue « ce que voit l'œil ».
Reçoit : la position de l'objet (ou son diamètre apparent s'il est à l'infini), les lentilles { x, f, r } (cm), l'œil.
Produit : Labo.instrument(reglage) -> { images: [{ x, h } | { infini, a }], alpha_p, G, flou } ;
          Labo.marche_rayons({ x0, hauteurs, pente, depart, lentilles, xfin }) -> [[{ x, y }…]] (cm) ;
          Labo.vue_instrument(g, { x, y, r, titre, fond, sujet(g, k), G, flou, champ, noir }).
Utilisé par : les simulations d'optique (lunette, microscope).
*/
(function (L) {
  let n_vue = 0;
  const acc = (D) => (D >= 25 ? 0 : Math.min(12, 110 * (1 / Math.max(D, 0.5) - 1 / 25)));

  function traverser(o, { x, f }) {
    // Image par une lentille de l'objet o ({ infini, a } ou { x, h }).
    if (o.infini) return { x: x + f, h: -f * o.a };
    const OA = o.x - x, inv = 1 / f + 1 / OA;
    if (Math.abs(inv * f) < 2e-3) return { infini: true, a: o.h / -OA };
    return { x: x + 1 / inv, h: (o.h / inv) / OA };
  }

  L.instrument = function ({ infini = false, alpha = 0, xO = 0, h = 1, lentilles, oeil }) {
    // Images successives, angle de l'image finale vu par l'œil, grossissement et flou.
    let o = infini ? { infini: true, a: alpha } : { x: xO, h };
    const images = lentilles.map((l) => (o = traverser(o, l)));
    let alpha_p, flou;
    if (o.infini) { alpha_p = o.a; flou = 0; }
    else { const D = oeil - o.x; alpha_p = o.h / Math.max(1, Math.abs(D)); flou = D > 0.5 ? acc(D) : 12; }
    return { images, alpha_p, G: alpha_p / (infini ? alpha : h / 25), flou };
  };

  L.marche_rayons = function ({ x0, hauteurs, pente, depart, lentilles, xfin }) {
    // Rayons parallèles de pente donnée (hauteurs en x0), ou issus du point depart (hauteurs sur la première lentille) ;
    // arrêtés par la monture (|y| > r).
    return hauteurs.map((y0) => {
      const pts = [depart || { x: x0, y: y0 }];
      let y = depart ? depart.y : y0, x = depart ? depart.x : x0, p = depart ? (y0 - depart.y) / (lentilles[0].x - depart.x) : pente;
      for (const l of lentilles) {
        y += p * (l.x - x); x = l.x; pts.push({ x, y });
        if (Math.abs(y) > l.r) return pts;
        p -= y / l.f;
      }
      pts.push({ x: xfin, y: y + p * (xfin - x) });
      return pts;
    });
  };

  L.vue_instrument = function (g, { x, y, r, titre, fond = "#0b1020", sujet, G, flou, champ = 1, noir = false }) {
    // Cadre, disque de vision, sujet à l'échelle G (G < 0 : renversé), flou, champ limité (bord noir), noir si rien n'arrive.
    g.replaceChildren();
    const id = `vue_instr_${++n_vue}`, clip = L.svg("clipPath", { id: `${id}_c` }, g);
    L.svg("circle", { cx: x, cy: y, r }, clip);
    const fl = L.svg("filter", { id, x: "-50%", y: "-50%", width: "200%", height: "200%" }, g);
    L.svg("feGaussianBlur", { stdDeviation: flou.toFixed(2) }, fl);
    L.svg("rect", { x: x - r - 12, y: y - r - 8, width: 2 * r + 24, height: 2 * r + 26, rx: 6, fill: "#20262b", stroke: "#000" }, g);
    const z = L.svg("g", { "clip-path": `url(#${id}_c)` }, g);
    L.svg("rect", { x: x - r, y: y - r, width: 2 * r, height: 2 * r, fill: noir ? "#000" : fond }, z);
    if (!noir) sujet(L.svg("g", { transform: `translate(${x} ${y}) scale(${G})` }, L.svg("g", { filter: `url(#${id})` }, z)));
    if (!noir && champ < 1) L.svg("circle", { cx: x, cy: y, r: r * (1 + champ) / 2, fill: "none", stroke: "#000", "stroke-width": r * (1 - champ) }, z);
    L.texte(g, x, y + r + 12, titre, { "font-size": 7, "font-weight": 700, fill: "#e8e2d4" });
  };
})(window.Labo);

/*
Rôle : têt à combustion (cuillère à déflagration : tige d'acier de 18 cm, coupelle, disque-couvercle de 6 cm) rangé sur son
       support, et réactifs posés sur des carreaux de céramique : soufre (0,10 g), laine de fer (0,15 g), sodium (0,05 g).
       On glisse un réactif sur la coupelle, on le chauffe dans la flamme, puis on plonge le têt dans un flacon de gaz :
       S + O₂ → SO₂ (flamme bleue, faible dans l'air, vive dans le dioxygène) ; 3 Fe + 2 O₂ → Fe₃O₄ (gerbe d'étincelles, grains
       noirs, seulement dans le dioxygène) ; 2 Na + Cl₂ → 2 NaCl (flamme jaune, fumée blanche, dans le dichlore). Les masses
       de gaz consommé et de produit suivent l'équation.
Reçoit : le contexte de la paillasse, le bec Bunsen (chaleur(p)) et { support { x, sol }, carreaux [{ reactif, x }], sol_carreaux,
         flacons (flacon_gaz.js), e, dire, autoriser() }.
Produit : Labo.cuillere_combustion(ctx, bec, reglage) -> t { reactif, m (g restants), T, lieu, brule, faits { reactif : { m, brule { lieu : g brûlés } } } } ;
          Labo.charger_reactifs(ctx, reglage) ; Labo.REACTIFS_COMBUSTION.
Utilisé par : les simulations de chimie (combustions, transformations).
*/
(function (L) {
  const REACTIFS = {
    soufre: { nom: "Soufre", m0: 0.1, gaz: "O2", g_gaz: 1.0, produit: "SO2", g_produit: 2.0, T_i: 250, f_min: 0.1, v: 0.006, rgb: [236, 206, 40], flamme: "#5b63ff" },
    fer: { nom: "Laine\nde fer", m0: 0.15, gaz: "O2", g_gaz: 0.382, produit: "Fe3O4", g_produit: 1.382, T_i: 600, f_min: 0.45, v: 0.02, rgb: [128, 130, 134], flamme: "#fff1b0" },
    sodium: { nom: "Sodium", m0: 0.05, gaz: "Cl2", g_gaz: 1.543, produit: "NaCl", g_produit: 2.543, T_i: 150, f_min: 0.3, v: 0.005, rgb: [196, 198, 196], flamme: "#ffb21c" },
  };
  const TIGE = 180, DISQUE = 90;
  L.REACTIFS_COMBUSTION = REACTIFS;

  function charge(g, R, t, e) {
    // Le réactif dans la coupelle (repère en px, coupelle en (0, -5 e)) : solide, fondu ou incandescent ; flamme quand il brûle.
    const k = Math.cbrt(t.m / R.m0), y = -5 * e, fondu = (R === REACTIFS.soufre && t.T > 115) || (R === REACTIFS.sodium && t.T > 98);
    if (t.m > 0.002) {
      if (R === REACTIFS.fer) for (let i = 0; i < 7; i++) L.svg("path", { d: `M${-9 * k} ${y - 2 - i} q${5 * k} ${-6 * k} ${9 * k} 0 t${9 * k} ${-1}`, fill: "none", stroke: t.T > 500 ? "#e8641c" : L.rgb(R.rgb), "stroke-width": 0.9 }, g);
      else L.svg("path", { d: fondu ? `M${-9 * k} ${y} Q0 ${y - 7 * k} ${9 * k} ${y} Z` : `M${-7 * k} ${y} V${y - 9 * k} H${7 * k} V${y} Z`, fill: R === REACTIFS.soufre && fondu ? "#b0461c" : L.rgb(R.rgb), stroke: "#555", "stroke-width": 0.4 }, g);
    }
    if (t.residu > 0.002) L.svg("ellipse", { cx: 0, cy: y - 1, rx: 7, ry: 2.4, fill: R === REACTIFS.sodium ? "#f8f8f4" : "#1b1b1c", opacity: 0.9 }, g);
    if (!t.brule) return;
    const h = (10 + 34 * t.f) * e * 0.6;
    if (R === REACTIFS.fer) { for (let i = 0; i < 26; i++) { const a = Math.random() * Math.PI * 2, l = (6 + Math.random() * 22) * e * t.f; L.svg("line", { x1: 0, y1: y - 4, x2: l * Math.cos(a), y2: y - 4 + l * Math.sin(a), stroke: i % 3 ? "#ffe9a0" : "#ffffff", "stroke-width": 0.9 }, g); } return; }
    L.svg("path", { d: `M${-8 * e} ${y} Q${-7 * e} ${y - h * 0.7} 0 ${y - h} Q${7 * e} ${y - h * 0.7} ${8 * e} ${y} Z`, fill: R.flamme, opacity: 0.55 + Math.random() * 0.2 }, g);
  }

  function dessiner(g, t, p, angle, e) {
    // Tige, poignée, disque, coupelle et son contenu.
    g.replaceChildren();
    g.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angle})`);
    L.svg("line", { x1: 0, y1: -4, x2: 0, y2: -TIGE * e, stroke: "#6d767c", "stroke-width": 3 }, g);
    L.svg("rect", { x: -4, y: -TIGE * e - 40, width: 8, height: 44, rx: 3, fill: "url(#bois)", stroke: "#7a5730" }, g);
    L.svg("ellipse", { cx: 0, cy: -DISQUE * e, rx: 30 * e, ry: 4, fill: "url(#metal-h)", stroke: "#6d767c" }, g);
    L.svg("path", { d: "M-12 -6 Q0 6 12 -6 Z", fill: "url(#metal)", stroke: "#5d646a" }, g);
    if (t.reactif) charge(g, REACTIFS[t.reactif], t, e);
    L.svg("rect", { x: -16, y: -TIGE * e - 40, width: 32, height: TIGE * e + 46, fill: "#000", opacity: 0 }, g);
  }

  function bruler(t, R, dt, flamme, a) {
    // Chauffage dans la flamme (le têt ne dépasse pas 950 °C) ; combustion si le réactif est assez chaud et le gaz assez abondant.
    flamme = Math.min(flamme, 950);
    if (flamme > t.T) t.T += (flamme - t.T) * (1 - Math.exp(-dt / 2.5));
    t.f = a ? (a.gaz === R.gaz ? a.m / a.m0 : 0) : R.gaz === "O2" ? 0.21 : 0;
    t.brule = t.m > 0.002 && t.T > R.T_i && t.f > R.f_min;
    if (!t.brule) { if (flamme <= t.T) t.T = 20 + (t.T - 20) * Math.exp(-dt / 6); return 0; }
    const dm = Math.min(t.m, R.v * t.f * t.f * dt, a ? a.m / R.g_gaz : 1);
    t.m -= dm; t.residu += R === REACTIFS.soufre ? 0 : dm * 0.2;
    t.T += (300 + 900 * t.f - t.T) * (1 - Math.exp(-dt / 1.5));
    return dm;
  }

  L.charger_reactifs = function (ctx, { carreaux, sol, e, t, dire, rangee }) {
    // Carreaux de céramique et leurs réactifs ; un réactif lâché sur la coupelle du têt rangé y est chargé.
    for (const { reactif, x } of carreaux) {
      const R = REACTIFS[reactif], g = L.svg("g", { class: `reactif-${reactif}`, role: "button", "aria-label": R.nom.replace("\n", " ") }, ctx.objets), repos = { x, y: sol - 4 };
      L.svg("path", { d: `M${x - 22} ${sol} l5 -6 h34 l5 6 Z`, fill: "#eceae2", stroke: "#b8b09c" }, ctx.fond);
      R.nom.split("\n").forEach((l, i) => L.texte(ctx.fond, x, sol + 12 + i * 9, l, { "font-size": 7.5, "font-weight": 700, fill: "#e6eaed" }));
      charge(g, R, { m: R.m0, T: 20, residu: 0, brule: false }, e);
      L.svg("rect", { x: -16, y: -26, width: 32, height: 26, fill: "#000", opacity: 0 }, g);
      L.placer(g, repos.x, repos.y + 5 * e);
      L.glissable(g, {
        debut: () => ({ ...repos }), saisir: () => ctx.haut.append(g), deplacer: (p) => L.placer(g, p.x, p.y + 5 * e),
        lacher: (p) => {
          const sur = t.lieu === "support" && Math.hypot(p.x - rangee.x, p.y - rangee.y) < 34;
          if (sur && t.m > 0.002) dire("Le têt contient déjà un réactif : brûlez-le d'abord.");
          if (sur && t.m <= 0.002) { Object.assign(t, { reactif, m: R.m0, T: 20, residu: 0 }); g.style.display = "none"; ctx.signaler?.(); return; }
          ctx.objets.append(g); L.placer(g, repos.x, repos.y + 5 * e);
        },
      });
    }
  };

  L.cuillere_combustion = function (ctx, bec, { support, carreaux, sol_carreaux, flacons, e = 1.6, dire = () => {}, autoriser = () => true }) {
    // Têt déplaçable ; réactifs glissés sur sa coupelle ; combustion à chaque pas.
    const t = { reactif: null, m: 0, T: 20, f: 0, residu: 0, lieu: "support", dans: null, brule: false, pos: null, faits: {} };
    const g = L.svg("g", { class: "tet", role: "button", "aria-label": "Têt à combustion" }, ctx.objets);
    const rangee = { x: support.x, y: support.sol - 14 };
    const haut = (f) => f.monde(f.pr.levres.g).y;
    const place = () => (t.lieu === "flacon" ? { x: t.dans.pose.x, y: haut(t.dans) + DISQUE * e - 3 } : t.lieu === "support" ? rangee : t.pos);
    L.charger_reactifs(ctx, { carreaux, sol: sol_carreaux, e, t, dire, rangee });
    L.glissable(g, {
      debut: () => (autoriser() ? { ...place() } : null),
      saisir: () => { if (t.dans) t.dans.ferme = false; t.lieu = "main"; t.dans = null; ctx.haut.append(g); },
      deplacer: (p) => { t.pos = p; },
      lacher: (p) => {
        const f = flacons.find((k) => Math.abs(p.x - k.pose.x) < 45 && p.y > haut(k) - 60 && p.y < haut(k) + 190);
        if (f?.bouchon) dire("Ôtez d'abord la plaque de verre du flacon.");
        if (f && !f.bouchon) { t.lieu = "flacon"; t.dans = f; f.ferme = true; ctx.objets.insertBefore(g, f.g); } else { t.lieu = "support"; ctx.objets.append(g); }
        ctx.signaler?.();
      },
    });
    ctx.ecoulement.sur_pas((dt) => {
      const p = place(), R = REACTIFS[t.reactif], a = t.dans?.atmosphere;
      if (R) {
        const dm = bruler(t, R, dt, t.lieu === "main" ? bec.chaleur({ x: p.x, y: p.y - 10 }) : 20, a);
        if (dm && a) { a.m -= dm * R.g_gaz; a.produits[R.produit] = (a.produits[R.produit] || 0) + dm * R.g_produit; if (R !== REACTIFS.fer) a.fumee = Math.min(1, a.fumee + dm * (R === REACTIFS.sodium ? 40 : 4)); }
        if (dm) { const f = (t.faits[t.reactif] ??= { m: 0, brule: {} }), ou = a ? t.dans.id : "air"; f.m = Math.round(t.m * 1000) / 1000; f.brule[ou] = (f.brule[ou] || 0) + dm; }
      }
      dessiner(g, t, p, t.lieu === "main" ? 25 : 0, e);
    });
    return t;
  };
})(window.Labo);

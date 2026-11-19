/*
Rôle : un fil de cuivre enroulé en spirale (15 cm) et un clou en fer (7 cm), posés sur un verre de montre : glissés au-dessus
       d'un tube à essai, ils y tombent et y restent. Dans le tube, on voit le métal à travers le verre et le liquide ; les
       cristaux d'argent poussent en aiguilles grises sur le cuivre, le dépôt de cuivre rouge recouvre la partie immergée du
       clou (ions_metaux.js) ; les transformations avancent à chaque pas.
Reçoit : le contexte de la paillasse (avec ctx.ecoulement), { metaux [{ type (« cuivre », « fer »), x }], sol, e, tubes (récipients), dire }.
Produit : Labo.metaux_tubes(ctx, reglage) -> { metaux [{ type, dans (tube ou null) }] } ; tube.metal ; Labo.dessin_metal(g, m, h_liquide).
Utilisé par : les simulations de chimie (transformations chimiques).
*/
(function (L) {
  const hasard = (k) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const helice = (h) => 4.4 * Math.sin(h * 0.95);

  function cuivre(g, m, hl) {
    // Spirale de cuivre (repère du tube, mm, y vers le haut négatif), tige et crochet sur le bord ; aiguilles d'argent.
    const pts = []; for (let h = 6; h <= 50; h += 0.5) pts.push(`${helice(h).toFixed(2)} ${-h}`);
    L.svg("path", { d: `M${pts.join(" L")} L0 -52 V-152 Q0 -156 4.5 -156 Q8.5 -156 8.5 -151 V-140`, fill: "none", stroke: "#b8642c", "stroke-width": 1.3, "stroke-linejoin": "round" }, g);
    L.svg("path", { d: `M${pts.join(" L")}`, fill: "none", stroke: "#f0a874", "stroke-width": 0.4, opacity: 0.8 }, g);
    const k = Math.min(1, m.Ag / 0.5), N = Math.round(150 * k);
    if (k > 0.02) L.svg("path", { d: `M${pts.filter((_, i) => -6 - i * 0.5 > -hl).join(" L")}`, fill: "none", stroke: "#8c9298", "stroke-width": 1.6, opacity: 0.7 * k }, g);
    for (let i = 0; i < N; i++) {
      const h = 6 + hasard(i) * 44, x = helice(h), a = hasard(i + 0.5) * Math.PI * 2, l = (1 + 4 * hasard(i + 0.2)) * (0.4 + 0.6 * k);
      if (h > hl) continue;
      L.svg("line", { x1: x, y1: -h, x2: x + l * Math.cos(a), y2: -h + l * Math.sin(a), stroke: hasard(i + 0.8) > 0.5 ? "#c9cdd1" : "#7f868c", "stroke-width": 0.35, "stroke-linecap": "round" }, g);
    }
  }

  function clou(g, m, hl) {
    // Clou en fer : pointe en bas, tige de 2,6 mm, tête ; dépôt de cuivre sur la partie immergée.
    L.svg("path", { d: "M0 -1 L-1.3 -5 V-71 H1.3 V-5 Z", fill: "#80858a", stroke: "#4e5357", "stroke-width": 0.3 }, g);
    L.svg("rect", { x: -3.6, y: -73, width: 7.2, height: 2, rx: 0.6, fill: "#6d7276", stroke: "#4e5357", "stroke-width": 0.3 }, g);
    L.svg("rect", { x: -0.6, y: -70, width: 0.4, height: 64, fill: "#fff", opacity: 0.4 }, g);
    const k = Math.min(0.92, m.Cu / 0.12), h = Math.min(hl, 73);
    if (k > 0.02 && h > 1) L.svg("path", { d: `M0 -1 L-1.4 -5 V${-h} H1.4 V-5 Z`, fill: "#a24a24", opacity: k }, g);
  }

  L.dessin_metal = function (g, m, hl = 0) {
    // Dessine le métal (repère du tube) ; hl : hauteur du liquide (mm).
    (m.type === "cuivre" ? cuivre : clou)(g, m, hl);
  };

  function habiller(r) {
    // Le tube dessine aussi son métal, vu à travers le liquide (une couche de liquide est redessinée par-dessus).
    const dessiner = () => {
      const l = L.dessiner_verrerie(r.g, r.pr, r.pose, r.etat());
      if (!r.metal) return;
      L.dessin_metal(l, r.metal, r.pr.hauteur_de(r.c.volume()));
      for (const ph of r.etat().regions) L.svg("path", { d: "M" + ph.poly.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" L") + " Z", fill: L.rgb(ph.rgb), "fill-opacity": ph.alpha * 0.45, "pointer-events": "none" }, l);
    };
    r.dessiner = dessiner;
  }

  L.metaux_tubes = function (ctx, { metaux, sol, e = 1.6, tubes, dire = () => {} }) {
    // Verres de montre et métaux déplaçables ; transformations dans les tubes à chaque pas.
    tubes.forEach(habiller);
    const M = metaux.map(({ type, x }) => {
      const m = { type, Ag: 0, Cu: 0, dans: null, g: L.svg("g", { class: `metal-${type}`, role: "button", "aria-label": type === "cuivre" ? "Fil de cuivre" : "Clou en fer" }, ctx.objets) };
      L.svg("path", { d: `M${x - 34 * e} ${sol - 2} Q${x} ${sol + 6} ${x + 34 * e} ${sol - 2} Q${x} ${sol - 1} ${x - 34 * e} ${sol - 2} Z`, fill: "rgba(214,233,240,0.7)", stroke: "rgba(110,140,150,0.9)" }, ctx.fond);
      const corps = L.svg("g", {}, m.g), repos = { x: x + (type === "cuivre" ? -78 : -36) * e, y: sol - 5 };
      L.dessin_metal(corps, m, 0); L.svg("rect", { x: -8, y: -158, width: 16, height: 160, fill: "#000", opacity: 0 }, corps);
      const placer = (p, couche) => m.g.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${couche ? 90 : 0}) scale(${e})`);
      L.glissable(m.g, {
        debut: () => ({ ...repos }), saisir: () => ctx.haut.append(m.g), deplacer: (p) => placer(p, false),
        lacher: (p) => {
          const t = tubes.find((r) => { const b = r.monde({ x: 0, y: -r.pr.H }); return Math.abs(p.x - b.x) < 24 && p.y < b.y + 40 && p.y > b.y - 160; });
          if (t?.metal) dire("Ce tube contient déjà un métal.");
          if (t && !t.metal) { t.metal = m; m.dans = t; m.g.style.display = "none"; t.sig = null; ctx.signaler?.(); return; }
          ctx.objets.append(m.g); placer(repos, true);
        },
      });
      placer(repos, true);
      return m;
    });
    let attente = 0;
    ctx.ecoulement.sur_pas((dt) => {
      // Transformations dans chaque tube ; les missions sont prévenues au plus cinq fois par seconde.
      let change = false;
      for (const r of tubes) if (L.IONS.evoluer(r, dt)) { r.sig = null; change = true; }
      attente += dt;
      if (change && attente > 0.2) { attente = 0; ctx.signaler?.(); }
    });
    return { metaux: M };
  };
})(window.Labo);

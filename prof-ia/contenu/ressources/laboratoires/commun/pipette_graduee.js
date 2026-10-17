/*
Rôle : pipette graduée de 10 mL (graduations tous les 0,1 mL, lues de 0 en haut à 10 en bas) surmontée d'un pipeteur à
       molette. On la pose, pointe dans un récipient ; la molette tournée vers le haut aspire le liquide (si la pointe est
       sous la surface ; sinon de l'air), tournée vers le bas elle le fait couler : le volume délivré est la différence de
       deux lectures. Le liquide qui sort tombe dans le récipient où est la pointe (lâchée juste au-dessus d'un col étroit,
       la pointe y entre). Rangée sur son support quand on la
       lâche ailleurs (elle garde son liquide).
Reçoit : le contexte de la paillasse (avec ctx.ecoulement), { support { x, y } (place de la pointe au repos), e (px/mm), dire }.
Produit : Labo.pipette_graduee(ctx, reglage) -> p { c (contenu), V (mL dans la pipette), lecture(), dans (récipient où est la pointe) }.
Utilisé par : les simulations de chimie (prélever un volume, préparer et diluer une solution).
*/
(function (L) {
  const A = 10 / 210, CONE = 25, VC = 0.15, BAS = 15, GRAD = 210, HAUT = 50, V10 = VC + BAS * A, VMAX = V10 + 10 + 40 * A;

  function dessiner(g, p, e) {
    // Pipette (repère en mm, pointe en (0, 0), vers le haut : y négatif), graduations, liquide, pipeteur et molette.
    g.replaceChildren();
    const H = CONE + BAS + GRAD + HAUT, verre = { fill: "rgba(214,233,240,0.5)", stroke: "rgba(110,140,150,0.9)", "stroke-width": 0.35 };
    L.svg("path", { d: `M-0.7 0 L-3.6 ${-CONE} V${-H} H3.6 V${-CONE} L0.7 0 Z`, ...verre }, g);
    const rgb = p.c.phases.length ? p.c.couleur(p.c.phases[0]).rgb : [220, 235, 242], liq = { fill: L.rgb(rgb.map((v) => v * 0.93)), opacity: 0.9 };
    if (p.V > 0) {
      const hc = CONE * Math.min(1, p.V / VC), lc = 0.5 + (2.6 * hc) / CONE;
      L.svg("path", { d: `M-0.5 -0.3 L${-lc} ${-hc} H${lc} L0.5 -0.3 Z`, ...liq }, g);
      if (p.V > VC) {
        const y = -CONE - (p.V - VC) / A;
        L.svg("rect", { x: -3.1, y, width: 6.2, height: (p.V - VC) / A, ...liq }, g);
        L.svg("path", { d: `M-3.1 ${y - 0.6} Q0 ${y + 1.4} 3.1 ${y - 0.6}`, fill: "none", stroke: "#1d3f6b", "stroke-width": 0.45, opacity: 0.85 }, g);
      }
    }
    for (let k = 0; k <= 100; k++) {
      const y = -(CONE + BAS + (GRAD * k) / 100), long = k % 10 === 0 ? 3.2 : k % 5 === 0 ? 2.2 : 1.3;
      L.svg("line", { x1: -3.6, y1: y, x2: -3.6 + long, y2: y, stroke: "#1d3f6b", "stroke-width": 0.18 }, g);
      if (k % 10 === 0) L.svg("text", { x: -3.6 - 0.6, y: y + 0.9, "font-size": 2.6, "text-anchor": "end", fill: "#1d3f6b", "font-family": "sans-serif" }, g).textContent = String(10 - k / 10);
    }
    L.svg("rect", { x: -5, y: -H - 92, width: 10, height: 92, rx: 2, fill: "#2f8a3c", stroke: "#1d5a26", "stroke-width": 0.5 }, g);
    L.svg("rect", { x: -3.2, y: -H - 4, width: 6.4, height: 8, fill: "#1d5a26" }, g);
    L.svg("ellipse", { cx: 6.5, cy: -H - 55, rx: 3, ry: 11, fill: "#1f2a30", stroke: "#000", "stroke-width": 0.3 }, g);
    for (let k = -4; k <= 4; k++) L.svg("line", { x1: 4.5, y1: -H - 55 + k * 2.4, x2: 8.5, y2: -H - 55 + k * 2.4, stroke: "#5d646a", "stroke-width": 0.5 }, g);
  }

  L.pipette_graduee = function (ctx, { support, e = 1.2, dire = () => {} }) {
    // Pipette déplaçable ; molette (glisser verticalement) ; transfert du liquide entre la pipette et le récipient.
    const p = { c: L.contenu({}), V: 0, dans: null, pos: { ...support } }, g = L.svg("g", { class: "pipette-graduee", role: "button", "aria-label": "Pipette graduée" }, ctx.objets);
    const H = CONE + BAS + GRAD + HAUT, prise = L.svg("rect", { x: -9, y: -H, width: 18, height: H - CONE, fill: "#000", opacity: 0 }), molette = L.svg("rect", { x: 1, y: -H - 70, width: 14, height: 30, fill: "#000", opacity: 0, class: "molette" });
    const corps = L.svg("g", {}, g);
    g.append(prise, molette);
    const maj = () => { dessiner(corps, p, e); g.setAttribute("transform", `translate(${p.pos.x} ${p.pos.y}) scale(${e})`); ctx.signaler?.(); };
    p.lecture = () => Math.round((10 - (p.V - V10)) * 100) / 100;
    const surface = (r) => r.pose.y - r.pr.hauteur_de(r.c.volume()) * r.pose.e;
    const recipient = (q) => ctx.ecoulement.recipients.find((r) => L.dans_polygone(r.interieur_monde(), q));
    const col = (q) => ctx.ecoulement.recipients.find((r) => { const b = r.monde({ x: 0, y: -r.pr.H }); return !r.bouchon && Math.abs(q.x - b.x) < r.pr.r(r.pr.H) * r.pose.e + 10 && q.y > b.y - 12 && q.y < r.pose.y; });
    L.glissable(prise, {
      soulever: false, debut: () => ({ ...p.pos }), saisir: () => { p.dans = null; dire(""); ctx.haut.append(g); }, deplacer: (q) => { p.pos = q; maj(); },
      lacher: (q) => {
        // Dans un récipient (ou juste au-dessus d'un col étroit : la pointe y entre, au milieu) ; ailleurs, retour au support.
        const r = recipient(q), c = !r && col(q), b = c && c.monde({ x: 0, y: -c.pr.H });
        ctx.objets.append(g);
        if (r) { p.dans = r; p.pos = { x: q.x, y: Math.min(q.y, r.pose.y - 4) }; } else if (c) { p.dans = c; p.pos = { x: b.x, y: Math.max(q.y, b.y + 8) }; } else { p.dans = null; p.pos = { ...support }; }
        maj();
      },
    });
    let y0 = null;
    L.glissable(molette, {
      soulever: false, debut: () => { y0 = null; return { x: 0, y: 0 }; },
      deplacer: (d) => {
        if (y0 === null) { y0 = d.y; return; }
        const dV = -(d.y - y0) * 0.06; y0 = d.y;
        if (dV > 0) {
          const r = p.dans;
          if (!r || p.pos.y < surface(r) + 2) return dire(r ? "La pointe n'est pas dans le liquide : vous aspirez de l'air." : "");
          const v = Math.min(dV, r.c.volume(), VMAX - p.V);
          if (p.V + dV > VMAX) dire("Attention : le liquide arrive au pipeteur !");
          r.c.retirer(v, "bas").forEach((part) => p.c.verser(part)); p.V += v; r.sig = null;
        } else if (p.V > 0) {
          const v = Math.min(-dV, p.V), parts = p.c.retirer(v, "bas"); p.V -= v;
          if (p.dans) { parts.forEach((part) => p.dans.c.verser(part)); p.dans.sig = null; } else ctx.ecoulement.emettre({ c: L.contenu({}), interieur_monde: () => [] }, { x: p.pos.x, y: p.pos.y + 2 }, { x: 0, y: 40 }, parts, v);
        }
        maj();
      },
    });
    maj();
    return p;
  };
})(window.Labo);

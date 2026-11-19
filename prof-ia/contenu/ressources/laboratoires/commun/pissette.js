/*
Rôle : pissette d'eau distillée de 500 mL en polyéthylène souple, aux vraies dimensions (corps de 72 mm, bouchon, tube
       recourbé) : on la prend et on la lâche, le bec au-dessus d'un récipient ; elle reste tenue, inclinée, le bec vers le
       bas. Tant qu'on appuie sur son corps, un jet d'eau (environ 4 mL/s) sort du bec et tombe (chute libre, ecoulement.js)
       là où il tombe vraiment : dans le récipient, dans un entonnoir, sur une coupelle à rincer, ou sur la paillasse.
       Un toucher sur le bouchon (ou un lâcher ailleurs) la repose sur la paillasse.
Reçoit : le contexte de la paillasse (avec ctx.ecoulement) et { x, sol, e (px/mm), V (mL d'eau au départ) }.
Produit : Labo.pissette(ctx, reglage) -> p { V (mL restants), tenue, pressee, bec() (position du bec, px) }.
Utilisé par : les simulations de chimie (préparation de solutions, rinçage).
*/
(function (L) {
  const ROT = 31, BEC = { x: 36, y: -188 }, DEBIT = 4;
  const CORPS = "M-36 -4 Q-36 0 -32 0 H32 Q36 0 36 -4 V-136 Q36 -152 22 -160 L15 -166 V-172 H-15 V-166 L-22 -160 Q-36 -152 -36 -136 Z";

  function dessin(g, p, id) {
    // Pissette debout (repère en mm, milieu du fond en (0, 0)) : eau visible à travers le plastique, étiquette, bouchon, tube.
    g.replaceChildren();
    const clip = L.svg("clipPath", { id }, g);
    L.svg("path", { d: CORPS }, clip);
    L.svg("path", { d: CORPS, fill: "rgba(246,248,249,0.78)", stroke: "#aab3b8", "stroke-width": 0.6 }, g);
    const niveau = 4 + (p.V / 500) * 150, eau = L.svg("g", { "clip-path": `url(#${id})` }, g);
    L.svg("rect", { x: -150, y: -niveau, width: 300, height: 260, fill: "rgba(196,222,236,0.55)", transform: p.tenue ? `rotate(${-ROT} 0 ${-niveau})` : "" }, eau);
    L.svg("rect", { x: -26, y: -112, width: 52, height: 44, rx: 2, fill: "#fff", opacity: 0.92 }, g);
    L.svg("text", { x: 0, y: -96, "font-size": 8, "text-anchor": "middle", "font-weight": 700, fill: "#1f5fa8", "font-family": "sans-serif" }, g).textContent = "EAU";
    L.svg("text", { x: 0, y: -82, "font-size": 6.4, "text-anchor": "middle", "font-weight": 700, fill: "#1f5fa8", "font-family": "sans-serif" }, g).textContent = "distillée";
    L.svg("rect", { x: -22, y: -60, width: 6, height: 50, rx: 3, fill: "#fff", opacity: 0.35 }, g);
    L.svg("rect", { x: -17, y: -184, width: 34, height: 13, rx: 2.5, fill: "#2f6fb8", stroke: "#1d3f6b", "stroke-width": 0.5 }, g);
    L.svg("path", { d: `M0 -184 V-205 Q0 -216 10 -214 Q22 -211 30 -198 L${BEC.x} ${BEC.y}`, fill: "none", stroke: "#9aa5ab", "stroke-width": 4.2, "stroke-linecap": "round" }, g);
    L.svg("path", { d: `M0 -184 V-205 Q0 -216 10 -214 Q22 -211 30 -198 L${BEC.x} ${BEC.y}`, fill: "none", stroke: "#eef2f4", "stroke-width": 2.4, "stroke-linecap": "round" }, g);
    if (p.pressee) L.svg("path", { d: "M-38 -70 h8 M30 -70 h8", stroke: "#c08a16", "stroke-width": 1.5 }, g);
  }

  L.pissette = function (ctx, { x, sol, e = 1.6, V = 400 }) {
    // Pissette déplaçable ; jet tant qu'on appuie sur le corps de la pissette tenue.
    const p = { V, tenue: false, pressee: false, pos: { x, y: sol } }, id = `pissette-${Math.round(x)}`;
    const g = L.svg("g", { class: "pissette", role: "button", "aria-label": "Pissette d'eau distillée" }, ctx.objets), source = { c: L.contenu({ eau: 1 }), interieur_monde: () => [] };
    const a = (ROT * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const vers_local = (q) => { const dx = (q.x - p.pos.x) / e, dy = (q.y - p.pos.y) / e; return { x: BEC.x + dx * c + dy * s, y: BEC.y - dx * s + dy * c }; };
    p.bec = () => (p.tenue ? { ...p.pos } : { x: x + BEC.x * e, y: sol + BEC.y * e });
    const placer = () => {
      dessin(g, p, id);
      g.setAttribute("transform", p.tenue ? `translate(${p.pos.x} ${p.pos.y}) rotate(${ROT}) scale(${e}) translate(${-BEC.x} ${-BEC.y})` : `translate(${x} ${sol}) scale(${e})`);
    };
    const sous = (q) => { for (let y = q.y; y < q.y + 300; y += 6) { const t = { x: q.x, y }; if (ctx.ecoulement.cibles.some((k) => k.contient(t)) || ctx.ecoulement.recipients.some((r) => !r.bouchon && L.dans_polygone(r.interieur_monde(), t))) return true; } return false; };
    const ranger = () => { Object.assign(p, { tenue: false, pressee: false }); ctx.objets.append(g); placer(); };
    const relacher = () => { p.pressee = false; placer(); };
    L.glissable(g, {
      soulever: false,
      debut: (ev) => {
        // Tenue : appuyer sur le corps fait jaillir l'eau ; ailleurs (bouchon, tube), on la déplace.
        const q = vers_local(L.scene.vers_scene(ev));
        if (p.tenue && Math.abs(q.x) < 38 && q.y < 2 && q.y > -150) { p.pressee = true; placer(); window.addEventListener("pointerup", relacher, { once: true }); return null; }
        return p.tenue ? { ...p.pos } : { x: x + BEC.x * e, y: sol + BEC.y * e };
      },
      saisir: () => { p.tenue = true; ctx.haut.append(g); },
      deplacer: (q) => { p.pos = q; placer(); },
      lacher: (q) => { if (!sous(q)) return ranger(); p.pos = q; placer(); },
      toucher: ranger,
    });
    ctx.ecoulement.sur_pas((dt) => {
      // Jet : la portion d'eau quitte le bec vers le bas, à 1 m/s environ.
      if (!p.pressee || p.V <= 0) return;
      const v = Math.min(p.V, DEBIT * dt * (0.85 + 0.3 * Math.random()));
      p.V -= v;
      ctx.ecoulement.emettre(source, { x: p.pos.x, y: p.pos.y + 2 }, { x: 0, y: 1000 * e }, [{ classe: "aqueuse", liquides: { eau: v }, dissous: {}, T: 20 }], v);
    });
    placer();
    return p;
  };
})(window.Labo);

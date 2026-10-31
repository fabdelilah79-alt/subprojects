/*
Rôle : pipette compte-gouttes aux vraies dimensions, rangée dans son flacon (30 mL, verre teinté, étiquette) ou dans un
       bécher d'échantillon (pipette Pasteur à tétine rouge) : on la sort (elle contient 1 mL, pris dans le bécher), on la
       lâche au-dessus d'un récipient ou d'un verre de montre où elle reste tenue ; tant qu'on appuie sur la poire, une goutte
       de 0,05 mL se forme toutes les 0,3 s et tombe (chute libre, ecoulement.js) là où elle tombe vraiment. Remise dans son
       flacon ou son bécher, elle se remplit de nouveau.
Reçoit : le contexte de la paillasse (avec ctx.ecoulement) et { id, x, sol, e (px/mm), liquide, texte, autoriser() } (flacon) ou
         { id, becher (récipient fixe de recipient_physique.js), e } (pipette Pasteur dans un bécher : elle est dessinée
         derrière la paroi avant et le liquide du bécher).
Produit : Labo.flacon_gouttes(ctx, reglage) -> { pipette : { charge (mL), tenue } }.
Utilisé par : les simulations de chimie.
*/
(function (L) {
  const GOUTTE = 0.05;

  function flacon(g, ouvert, texte, rgb) {
    // Flacon de 30 mL (repère en mm, fond en (0, 0)) : verre brun, épaule, col ; étiquette.
    g.replaceChildren();
    L.svg("ellipse", { cx: 2, cy: 1, rx: 19, ry: 3.5, fill: "#000", opacity: 0.3 }, g);
    L.svg("path", { d: "M-17 -2 V-52 Q-17 -62 -7 -64 V-72 H7 V-64 Q17 -62 17 -52 V-2 Q17 0 15 0 H-15 Q-17 0 -17 -2 Z", fill: "#6b3a12", opacity: 0.9, stroke: "#2b1606", "stroke-width": 0.5 }, g);
    L.svg("rect", { x: -15, y: -40, width: 30, height: 36, fill: L.rgb(rgb), opacity: 0.25 }, g);
    L.svg("rect", { x: -12, y: -14 - 40, width: 3, height: 46, rx: 1.5, fill: "#fff", opacity: 0.18 }, g);
    L.svg("rect", { x: -14, y: -46, width: 28, height: 22, fill: "#f7f3e6", stroke: "#bdb59c", "stroke-width": 0.4 }, g);
    String(texte).split("\n").forEach((t, i, tout) => L.svg("text", { x: 0, y: -36 + i * 5 - 2.5 * (tout.length - 1), "font-size": 4, "font-weight": 700, "text-anchor": "middle", fill: "#222", "font-family": "sans-serif" }, g).textContent = t);
    if (ouvert) L.svg("ellipse", { cx: 0, cy: -72, rx: 6, ry: 1.6, fill: "#1a0d04" }, g);
  }

  function pipette(g, entiere, charge, rgb, pasteur) {
    // Pipette, pointe en (0, 0) : tube de verre effilé (60 mm), bague, poire en caoutchouc (22 mm).
    g.replaceChildren();
    if (entiere) {
      L.svg("path", { d: "M-0.8 0 L-3 -24 V-60 H3 V-24 L0.8 0 Z", fill: "rgba(214,233,240,0.55)", stroke: "rgba(120,150,160,0.9)", "stroke-width": 0.4 }, g);
      if (charge > 0) L.svg("path", { d: `M-0.6 -1 L-2.2 -18 V${-18 - 30 * charge} H2.2 V-18 L0.6 -1 Z`, fill: L.rgb(rgb), opacity: 0.85 }, g);
      L.svg("rect", { x: -1.6, y: -58, width: 1.2, height: 50, fill: "#fff", opacity: 0.4 }, g);
    }
    if (!pasteur) L.svg("rect", { x: -7, y: -68, width: 14, height: 8, rx: 1.5, fill: "#2a2a2c" }, g);
    L.svg("path", { d: `M-6 ${pasteur ? -60 : -68} V-80 Q-6 -92 0 -92 Q6 -92 6 -80 V${pasteur ? -60 : -68} Z`, fill: pasteur ? "#c4472b" : "#1d1d1f" }, g);
    L.svg("path", { d: "M-3 -88 V-72", stroke: "#fff", "stroke-width": 1, opacity: 0.25 }, g);
  }

  function cible_sous(ctx, p) {
    // Y a-t-il, sous la pointe, un récipient ouvert ou une surface qui peut recevoir des gouttes ?
    const E = ctx.ecoulement;
    for (let y = p.y; y < p.y + 260; y += 6) {
      const q = { x: p.x, y };
      if (E.cibles.some((c) => c.contient(q)) || E.recipients.some((r) => !r.bouchon && L.dans_polygone(r.interieur_monde(), q))) return true;
    }
    return false;
  }

  L.flacon_gouttes = function (ctx, { id, x, sol, e = 1.6, liquide, texte, becher = null, autoriser = () => true }) {
    // Flacon fixe (ou bécher) ; pipette déplaçable ; gouttes tant qu'on appuie sur la poire.
    const g_f = becher ? null : L.svg("g", { class: `flacon flacon-${id}` }, ctx.fond), g_p = L.svg("g", { class: `pipette pipette-${id}`, role: "button" }, ctx.objets);
    const nom = () => liquide || Object.entries(becher.c.phases[0]?.liquides || { eau: 1 }).sort((a, b) => b[1] - a[1])[0][0];
    if (becher) becher.g.setAttribute("pointer-events", "none");
    const repos = becher ? { x: becher.pose.x + 8 * e, y: becher.pose.y - 6 * e } : { x, y: sol - 12 * e };
    const p = { charge: 0, tenue: false, pos: { ...repos } }, source = { c: L.contenu({}), interieur_monde: () => [] };
    const dessiner = () => {
      const rgb = L.LIQUIDES[nom()].rgb;
      if (g_f) { flacon(g_f, p.tenue, texte, rgb); L.placer(g_f, x, sol, e); }
      pipette(g_p, p.tenue || !!becher, p.charge, rgb, !!becher); L.placer(g_p, p.pos.x, p.pos.y, e);
    };
    const remplir = () => {
      // Aspiration : 1 mL (pris dans le bécher, s'il y en a un).
      const parts = becher ? becher.c.retirer(Math.min(1, becher.c.volume()), "bas") : [{ liquides: { [liquide]: 1 }, dissous: { ...(L.LIQUIDES[liquide].dissous || {}) }, classe: L.LIQUIDES[liquide].classe }];
      source.c = L.contenu({}); parts.forEach((q) => source.c.verser(q)); p.charge = source.c.volume();
    };
    const ranger = () => { Object.assign(p, { tenue: false, pos: { ...repos } }); remplir(); if (becher) ctx.objets.insertBefore(g_p, becher.g); else ctx.objets.append(g_p); dessiner(); };
    let goutteur = null;
    const arreter = () => { clearInterval(goutteur); goutteur = null; };
    const goutte = () => {
      // Une goutte quitte la pointe (vitesse initiale presque nulle).
      if (p.charge < 0.02) return arreter();
      const v = Math.min(GOUTTE, p.charge); p.charge -= v;
      ctx.ecoulement.emettre(source, { x: p.pos.x, y: p.pos.y + 2 }, { x: 0, y: 20 }, source.c.retirer(v), v); dessiner();
    };
    L.glissable(g_p, {
      debut: (ev) => { if (p.tenue && Math.abs(L.scene.vers_scene(ev).y - (p.pos.y - 80 * e)) < 14 * e) { goutte(); goutteur = setInterval(goutte, 300); window.addEventListener("pointerup", arreter, { once: true }); return null; } if (!p.tenue && !autoriser()) return null; return { ...p.pos }; },
      saisir: () => { p.tenue = true; ctx.haut.append(g_p); dessiner(); },
      deplacer: (q) => { p.pos = q; dessiner(); },
      lacher: (q) => { if (Math.hypot(q.x - repos.x, q.y - repos.y) < 16 || !cible_sous(ctx, q)) return ranger(); p.pos = q; dessiner(); },
    });
    ranger();
    return { pipette: p };
  };
})(window.Labo);

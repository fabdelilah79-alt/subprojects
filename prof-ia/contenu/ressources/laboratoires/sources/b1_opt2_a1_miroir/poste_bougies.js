/*
Rôle : paillasse « expérience des deux bougies » : feuille graduée posée sur la paillasse (lignes tous les centimètres,
       distance à la vitre), vitre verticale tenue par deux pinces au milieu de la feuille ; bougie 1 allumée devant la
       vitre, bougie 2 éteinte derrière ; on voit dans la vitre l'image de la flamme de la bougie 1. On fait glisser les
       bougies (pas de 0,5 cm) : quand la bougie 2 est à la place de l'image, elle paraît allumée.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_bougies(g) -> { pense_bete } ; fait « bougies » = { essais: [{ d_objet, d_image (cm) }] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const XC = 512, YG = 400, KY = 8, KX = 14, D = 22, U = 14;
  const ech = (d) => 1 - d * 0.012, E = (u, d) => ({ x: XC + u * KX * ech(d), y: YG - d * KY });
  const P = (p) => { const d = (YG - p.y) / KY; return { u: (p.x - XC) / (KX * ech(d)), d }; };

  function feuille(g) {
    // Feuille en perspective, lignes tous les centimètres (chiffres : distance à la vitre), axe médian.
    const pts = [E(-U, -D), E(U, -D), E(U, D), E(-U, D)];
    L.ombre_sol(g, XC + 8, YG + D * KY + 4, U * KX + 10, 8, 0.4);
    L.svg("path", { d: `M${pts.map((p) => `${p.x} ${p.y}`).join(" L")} Z`, fill: "#fbfaf4", stroke: "#cfcab6" }, g);
    for (let d = -D + 2; d <= D - 2; d += 1) { const a = E(-U, d), b = E(U, d); L.svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: d % 5 ? "#e3e0d2" : "#bdb79f", "stroke-width": d % 5 ? 0.5 : 0.9 }, g); if (d % 5 === 0) L.texte(g, a.x - 14, a.y, `${Math.abs(d)}`, { "font-size": 7.5, fill: "#6d6a5c" }); }
    for (let u = -U + 2; u <= U - 2; u += 2) { const a = E(u, -D), b = E(u, D); L.svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "#ece9dc", "stroke-width": 0.5 }, g); }
    L.texte(g, E(-U, -D).x - 20, E(-U, -D).y + 14, "cm", { "font-size": 7.5, fill: "#6d6a5c" });
  }

  function vitre(g) {
    // Plaque de verre verticale sur la ligne 0, deux pinces ; reflets.
    const a = E(-U + 1, 0), b = E(U - 1, 0), h = 150;
    L.svg("path", { d: `M${a.x} ${a.y} L${b.x} ${b.y} L${b.x} ${b.y - h} L${a.x} ${a.y - h} Z`, fill: "#dfeef3", opacity: 0.32, stroke: "#9fb6be", "stroke-width": 1.5 }, g);
    for (const x of [a.x + 60, a.x + 220]) L.svg("path", { d: `M${x} ${a.y - h + 4} l40 0 l-60 ${h - 8} l-40 0 Z`, fill: "#fff", opacity: 0.12 }, g);
    for (const p of [a, b]) { L.svg("rect", { x: p.x - 10, y: p.y - 10, width: 20, height: 14, rx: 2, fill: "#2b3035" }, g); L.svg("rect", { x: p.x - 3, y: p.y - 22, width: 6, height: 14, fill: "url(#metal)" }, g); }
    L.texte(g, b.x + 20, b.y - h + 10, "vitre", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
  }

  L.poste_bougies = function (g) {
    // Feuille, vitre, bougies saisissables ; image de la flamme ; coïncidence notée.
    const { pense_bete } = L.decor_circuit(g, 0), e = { b1: { u: -3, d: -10 }, b2: { u: 5, d: 16 }, essais: [] };
    feuille(L.svg("g", {}, g));
    const derriere = L.svg("g", {}, g); vitre(L.svg("g", { "pointer-events": "none" }, g)); const devant = L.svg("g", {}, g), info = L.svg("g", {}, g);
    const g1 = L.svg("g", { class: "bougie", role: "button", "aria-label": "Bougie allumée" }, devant), g2 = L.svg("g", { class: "bougie", role: "button", "aria-label": "Bougie éteinte" }, derriere), gi = L.svg("g", { "pointer-events": "none" }, derriere);
    const glisser = (gr, k, dmin, dmax) => L.glissable(gr, { soulever: false, debut: () => E(e[k].u, e[k].d), deplacer: (p) => { const q = P(p); e[k] = { u: Math.round(Math.max(-U + 2, Math.min(U - 2, q.u)) * 2) / 2, d: Math.round(Math.max(dmin, Math.min(dmax, q.d)) * 2) / 2 }; } });
    glisser(g1, "b1", -D + 2, -3); glisser(g2, "b2", 3, D - 2);
    let t = 0, avant = null;
    const image = (ms) => {
      // Bougies, image de la flamme (symétrique de la bougie 1 par rapport à la vitre), coïncidence.
      t += avant === null ? 0 : (ms - avant) / 1000; avant = ms;
      const im = { u: e.b1.u, d: -e.b1.d }, ok = Math.abs(e.b2.u - im.u) < 0.3 && Math.abs(e.b2.d - im.d) < 0.3;
      [g1, g2, gi, info].forEach((x) => x.replaceChildren());
      const p2 = E(e.b2.u, e.b2.d), pi = E(im.u, im.d), p1 = E(e.b1.u, e.b1.d);
      L.bougie(g2, { ...p2, s: ech(e.b2.d), t });
      L.bougie(gi, { ...pi, s: ech(im.d), image: true, t });
      L.bougie(g1, { ...p1, s: ech(e.b1.d), allumee: true, t });
      if (ok) { L.texte(info, 512, 200, "la bougie 2 paraît allumée : elle est à la place de l'image", { "font-size": 10, "font-weight": 700, fill: "#9fe3a8" }); if (!e.essais.some((x) => x.d_objet === -e.b1.d)) e.essais.push({ d_objet: -e.b1.d, d_image: e.b2.d }); }
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("bougies", { essais: e.essais.map((x) => ({ ...x })) }), 250);
    return { pense_bete };
  };
})(window.Labo);

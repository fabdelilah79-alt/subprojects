/*
Rôle : paillasse « lentilles et faisceau parallèle » : tableau blanc magnétique sur ses pieds (quadrillage de 1 cm, axe
       gradué), boîte à rayons (cinq rayons laser parallèles, 4 mm d'écart), plumier de quatre lentilles profil (L1, L2, L3
       convergentes, L4 divergente) que l'on pose sur le tableau et fait glisser le long de l'axe, repère aimanté F' ;
       « Prolonger » trace le prolongement des rayons sortants vers l'arrière. Les rayons sont calculés face par face.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_tableau(g) -> { pense_bete } ; fait « tableau » = { allume, vu: { conv, div }, mesures: { L1… : f' (mm) } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const K = 3.2, X0 = 200, Y0 = 300, E = (x, y) => ({ x: X0 + x * K, y: Y0 + y * K }), M = (p) => ({ x: (p.x - X0) / K, y: (p.y - Y0) / K });
  const RAYONS = [-8, -4, 0, 4, 8], RANGE = (k) => ({ x: 330 + 115 * k, y: 503 });

  function tableau(g) {
    // Pieds, cadre d'aluminium, surface blanche, quadrillage, axe gradué en cm, boîte à rayons.
    for (const x of [260, 720]) { L.svg("line", { x1: x, y1: 400, x2: x - 20, y2: 470, stroke: "url(#metal)", "stroke-width": 6 }, g); L.ombre_sol(g, x - 20, 472, 26, 5, 0.4); }
    L.svg("rect", { x: X0 - 8, y: Y0 - 104, width: 180 * K + 16, height: 208, rx: 4, fill: "url(#metal-h)", stroke: "#666" }, g);
    L.svg("rect", { x: X0, y: Y0 - 96, width: 180 * K, height: 192, fill: "#fbfbf6" }, g);
    for (let x = 0; x <= 180; x += 10) { const p = E(x, 0); L.svg("line", { x1: p.x, y1: Y0 - 96, x2: p.x, y2: Y0 + 96, stroke: "#d5dde2", "stroke-width": 0.6 }, g); L.texte(g, p.x, Y0 - 88, String(x / 10), { "font-size": 6.5, fill: "#7a8a94" }); }
    for (let y = -30; y <= 30; y += 10) { const p = E(0, y); L.svg("line", { x1: X0, y1: p.y, x2: X0 + 180 * K, y2: p.y, stroke: "#d5dde2", "stroke-width": 0.6 }, g); }
    L.svg("line", { x1: X0, y1: Y0, x2: X0 + 180 * K, y2: Y0, stroke: "#1a3d7c", "stroke-width": 0.8, "stroke-dasharray": "8 3 2 3" }, g);
    for (let x = 0; x <= 180; x++) L.svg("line", { x1: E(x, 0).x, y1: Y0 - (x % 10 ? 2 : 4), x2: E(x, 0).x, y2: Y0 + (x % 10 ? 2 : 4), stroke: "#1a3d7c", "stroke-width": 0.5 }, g);
    L.svg("rect", { x: E(2, -14).x, y: E(2, -14).y, width: 26 * K, height: 28 * K, rx: 4, fill: "#24282c", stroke: "#000" }, g);
    for (const y of RAYONS) L.svg("rect", { x: E(27, y).x, y: E(27, y).y - 1.5, width: 4, height: 3, fill: "#ff6b5b" }, g);
    L.texte(g, E(15, 0).x, E(15, -4).y, "5 rayons", { "font-size": 7, "font-weight": 700, fill: "#e8e8e8" }); L.texte(g, E(15, 0).x, E(15, 4).y, "parallèles", { "font-size": 7, "font-weight": 700, fill: "#e8e8e8" });
    L.svg("path", { d: `M${E(2, 8).x} ${E(2, 8).y} C${X0 - 40} ${Y0 + 40} ${X0 - 50} 430 ${X0 - 70} 470`, fill: "none", stroke: "#1b1e21", "stroke-width": 2.4 }, g);
  }

  function plumier(g) {
    // Plumier de bois posé sur la paillasse, quatre logements numérotés.
    L.ombre_sol(g, 505, 570, 250, 8, 0.45);
    L.svg("rect", { x: 260, y: 440, width: 490, height: 130, rx: 6, fill: "url(#bois)", stroke: "#6d4a26" }, g);
    L.svg("rect", { x: 260, y: 568, width: 490, height: 12, rx: 3, fill: "url(#bois-face)" }, g);
    L.LENTILLES.forEach((l, k) => { const p = RANGE(k); L.svg("rect", { x: p.x - 40, y: p.y - 56, width: 80, height: 108, rx: 6, fill: "#7a5530", opacity: 0.6 }, g); L.texte(g, p.x, p.y + 60, `${l.nom} : ${l.matiere}`, { "font-size": 7, "font-weight": 700, fill: "#3b2614" }); });
  }

  function rayons(g, e) {
    // Rayons (calculés à travers la lentille posée) jusqu'au bord du tableau ; prolongements en pointillés.
    g.replaceChildren();
    if (!e.allume) return;
    const l = e.pose;
    for (const y0 of RAYONS) {
      const r = l && L.traverser(l, y0), pts = [{ x: 28, y: y0 }];
      let p = { x: 28, y: y0 }, d = { x: 1, y: 0 };
      if (r) { pts.push(...r.points); p = r.sortie.p; d = r.sortie.d; }
      const t = Math.min((180 - p.x) / d.x, d.y ? (Math.sign(d.y) * 30 - p.y) / d.y : 1e9);
      pts.push({ x: p.x + t * d.x, y: p.y + t * d.y });
      L.rayon_lumineux(g, pts.map((q) => E(q.x, q.y)), { largeur: 1.4 });
      if (r && e.prolonger) { const u = Math.min(70, (p.x - 30) / d.x); L.svg("line", { x1: E(p.x, p.y).x, y1: E(p.x, p.y).y, x2: E(p.x - u * d.x, p.y - u * d.y).x, y2: E(p.x - u * d.x, p.y - u * d.y).y, stroke: "#ff2a1a", "stroke-width": 1, "stroke-dasharray": "4 3", opacity: 0.7 }, g); }
    }
  }

  L.poste_tableau = function (g) {
    // Matériel, lentilles saisissables (plumier ↔ tableau), repère F', touches ; faits.
    const { pense_bete } = L.decor_circuit(g, 0), e = { allume: false, prolonger: false, pose: null, repere: { x: 165, y: -24 }, vu: {}, mesures: {} };
    tableau(L.svg("g", {}, g)); plumier(L.svg("g", {}, g));
    const gr = L.svg("g", { "pointer-events": "none" }, g), gl = L.svg("g", {}, g), gf = L.svg("g", { class: "repere", role: "button", "aria-label": "Repère F'" }, g);
    const lentilles = L.LENTILLES.map((l, k) => ({ ...l, k, x: null, g: L.svg("g", { class: "lentille", role: "button", "aria-label": `Lentille ${l.nom}` }, gl) }));
    const dessiner = () => {
      // Lentilles (au plumier ou sur le tableau), rayons, repère.
      for (const l of lentilles) { l.g.replaceChildren(); const c = l.x === null ? RANGE(l.k) : E(l.x, 0); L.dessin_lentille(l.g, { ...l, x: 0 }, (x, y) => ({ x: c.x + x * K, y: c.y + y * K }), K); }
      rayons(gr, e);
      gf.replaceChildren(); const f = E(e.repere.x, e.repere.y);
      L.svg("circle", { cx: f.x + 1, cy: f.y + 2, r: 7, fill: "#000", opacity: 0.25 }, gf); L.svg("circle", { cx: f.x, cy: f.y, r: 7, fill: "#c62828", stroke: "#600" }, gf);
      L.svg("path", { d: `M${f.x - 4} ${f.y} H${f.x + 4} M${f.x} ${f.y - 4} V${f.y + 4}`, stroke: "#fff", "stroke-width": 1.2 }, gf); L.texte(gf, f.x + 13, f.y - 8, "F'", { "font-size": 9, "font-weight": 700, fill: "#c62828" });
    };
    for (const l of lentilles) L.glissable(l.g, {
      soulever: false, debut: () => (l.x === null ? RANGE(l.k) : E(l.x, 0)),
      deplacer: (p) => { const q = M(p); if (Math.abs(q.y) < 40 && q.x > 35 && q.x < 160) { if (e.pose && e.pose !== l) e.pose.x = null; l.x = Math.round(q.x * 2) / 2; e.pose = l; } else { l.x = null; if (e.pose === l) e.pose = null; } dessiner(); },
    });
    L.glissable(gf, { soulever: false, debut: () => E(e.repere.x, e.repere.y), deplacer: (p) => { const q = M(p); e.repere = { x: Math.max(2, Math.min(178, q.x)), y: Math.max(-28, Math.min(28, q.y)) }; dessiner(); } });
    L.bouton_texte(g, 840, 250, "Rayons", () => { e.allume = !e.allume; dessiner(); });
    L.bouton_texte(g, 840, 280, "Prolonger", () => { e.prolonger = !e.prolonger; dessiner(); });
    dessiner();
    setInterval(() => {
      // Lentille éclairée ; repère posé sur le foyer image (à 3 mm près) : distance lentille-foyer notée (au mm).
      const l = e.pose;
      if (l && e.allume) { e.vu[l.type] = true; if (Math.abs(e.repere.y) < 2 && Math.abs(e.repere.x - L.foyer(l)) < 3) e.mesures[l.id] = Math.round(e.repere.x - l.x); }
      L.missions.noter("tableau", JSON.parse(JSON.stringify({ allume: e.allume, vu: e.vu, mesures: e.mesures })));
    }, 250);
    return { pense_bete };
  };
})(window.Labo);

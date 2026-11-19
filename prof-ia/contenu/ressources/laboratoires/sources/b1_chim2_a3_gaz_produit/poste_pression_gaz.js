/*
Rôle : paillasse « un gaz produit par une transformation » : erlenmeyer de 250 mL contenant 20,0 mL d'acide chlorhydrique à
       0,50 mol/L ; quatre rubans de magnésium pesés (0,024 g, 0,036 g, 0,048 g, 0,24 g) sur un verre de montre ; bouchon
       relié au pressiomètre (un toucher le pose sur le col ou le retire) ; « Nouvel essai » : acide neuf, rubans neufs. Un ruban lâché au-dessus du col tombe dans
       l'acide : après 3 s (couche d'oxyde), Mg + 2 H⁺ → Mg²⁺ + H₂ ; bulles ; le ruban rapetisse. Le dihydrogène reste
       dans l'erlenmeyer s'il est bouché (sinon il s'échappe) : P = 1 013 hPa + n(H₂) R T / V, V = 260 mL de gaz, T = 293 K.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_pression_gaz(g) -> { pense_bete } ; fait « gaz_produit » = { epi, essais: [{ m, P }], courant { m, ferme, P, fini } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, X = 520, P0 = 1013, HPA_MMOL = (8.314 * 293.15) / 260e-6 / 1e5, MG = 24.3, RUBANS = [0.024, 0.036, 0.048, 0.24];
  L.LIQUIDES.acide_chlorhydrique = { nom: "acide chlorhydrique", d: 1.0, rgb: [236, 243, 246], alpha: 0.3, classe: "aqueuse", pH: 0.3 };
  const col = () => ({ x: X, y: SOL - 118 * E }), longueur = (m) => 60 * Math.cbrt(m / 0.24);

  function ruban(g, p, m, reste = 1) {
    // Ruban de magnésium posé à plat (gris brillant), longueur proportionnelle à sa masse.
    const l = Math.max(3, longueur(m) * reste);
    L.svg("rect", { x: p.x - l / 2, y: p.y - 3, width: l, height: 4, rx: 1, fill: "url(#metal-h)", stroke: "#666", "stroke-width": 0.5 }, g);
  }

  function bouchon(g, ferme, embout) {
    // Bouchon de caoutchouc (sur le col, ou posé sur la paillasse), tuyau jusqu'au pressiomètre.
    g.replaceChildren();
    const b = ferme ? { x: X, y: col().y } : { x: 610, y: SOL - 10 };
    L.svg("path", { d: `M${b.x} ${b.y - 12} C${b.x} ${b.y - 70} ${embout.x} ${embout.y - 60} ${embout.x} ${embout.y}`, fill: "none", stroke: "#cfd8d4", "stroke-width": 6 }, g);
    L.svg("path", { d: `M${b.x - 18} ${b.y + 10} L${b.x - 21} ${b.y - 12} H${b.x + 21} L${b.x + 18} ${b.y + 10} Z`, fill: "#7a3b2a", stroke: "#4a2016" }, g);
    L.svg("rect", { x: b.x - 26, y: b.y - 20, width: 52, height: 36, fill: "#fff", opacity: 0.01 }, g);
  }

  function bulles(g, e, t) {
    // Bulles qui montent du ruban pendant la réaction.
    g.replaceChildren();
    if (!e.en_cours || e.vitesse < 0.01) return;
    for (let k = 0; k < Math.min(14, 4 + e.vitesse * 20); k++) { const y = SOL - 6 - ((t * 60 + k * 23) % 34); L.svg("circle", { cx: X - 8 + ((k * 7) % 18), cy: y, r: 1.6, fill: "none", stroke: "#fff", "stroke-width": 0.7 }, g); }
  }

  L.poste_pression_gaz = function (g) {
    // Matériel ; réaction à chaque pas ; essais enregistrés quand la réaction est finie et l'erlenmeyer bouché.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const epi = L.equipement(g, { x: 300, y: 70 });
    const capteur = L.pressiometre(ctx.fond, { x: 700, y: 470 });
    L.recipient(ctx, { id: "erlen", profil: "erlenmeyer_250", x: X, y: SOL, e: E, contenu: { acide_chlorhydrique: 20 }, etiquette: "HCl 0,50 mol/L" }).g.setAttribute("pointer-events", "none");
    L.svg("ellipse", { cx: 300, cy: SOL - 8, rx: 88, ry: 18, fill: "#e8f2f6", opacity: 0.7, stroke: "#8fb3bd" }, ctx.fond);
    L.texte(ctx.fond, 300, SOL - 32, "rubans de magnésium", { "font-size": 7.5, "font-weight": 700, fill: "#e8e2cc" });
    const e = { ferme: false, m: 0, nMg: 0, nH: 10, gaz: 0, attente: 0, en_cours: false, vitesse: 0, fini: false, essais: [], pris: [] };
    const gb = L.svg("g", { class: "bouchon", role: "button", "aria-label": "Bouchon relié au pressiomètre" }, ctx.haut), gu = L.svg("g", { "pointer-events": "none" }, ctx.haut), gr = L.svg("g", {}, ctx.haut), gm = L.svg("g", { "pointer-events": "none" }, ctx.objets);
    const rubans = RUBANS.map((m, k) => ({ m, p0: { x: 240 + longueur(m) / 2, y: SOL - 20 + 8 * k }, p: null, g: L.svg("g", { class: "ruban", role: "button", "aria-label": `Ruban de ${m} g` }, gr) }));
    const dessiner = () => {
      bouchon(gb, e.ferme, capteur.embout); gm.replaceChildren();
      for (const r of rubans) { r.g.replaceChildren(); if (!e.pris.includes(r.m)) { ruban(r.g, r.p || r.p0, r.m); if (!r.p) L.texte(r.g, 330, r.p0.y + 1, `${String(r.m).replace(".", ",")} g`, { "font-size": 6.5, "font-weight": 700, fill: "#23315a", "text-anchor": "start" }); } }
      if (e.m && e.nMg > 1e-4) ruban(gm, { x: X, y: SOL - 5 }, e.m, Math.cbrt(e.nMg / (e.m / MG * 1000)));
    };
    for (const r of rubans) L.glissable(r.g, { soulever: false, debut: () => ({ ...(r.p || r.p0) }), deplacer: (p) => { r.p = p; dessiner(); },
      lacher: () => { const c = col(); if (!e.m && epi.protege() && Math.abs(r.p.x - c.x) < 25 && r.p.y < c.y + 30 && r.p.y > c.y - 120 && !e.ferme) { Object.assign(e, { m: r.m, nMg: (r.m / MG) * 1000, attente: 3, en_cours: true, fini: false }); e.pris.push(r.m); } r.p = null; dessiner(); } });
    L.glissable(gb, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.ferme = !e.ferme; if (!e.ferme) e.gaz = 0; dessiner(); } });
    L.bouton_texte(g, 140, 250, "Nouvel essai", () => { Object.assign(e, { ferme: false, m: 0, nMg: 0, nH: 10, gaz: 0, en_cours: false, vitesse: 0, fini: false }); e.pris = []; dessiner(); });
    let t = 0;
    setInterval(() => {
      // Pas de 0,1 s : vitesse ∝ surface du ruban × [H⁺] ; gaz gardé si bouché ; essai noté à la fin.
      t += 0.1;
      if (e.en_cours) {
        if (e.attente > 0) e.attente -= 0.1;
        else { const dn = Math.min(e.nMg, e.nH / 2, 0.8 * Math.cbrt(e.nMg * e.nMg) * (e.nH / 10) * 0.1); e.nMg -= dn; e.nH -= 2 * dn; e.vitesse = dn / 0.1; if (e.ferme) e.gaz += dn; if (dn < 2e-4 || Math.min(e.nMg, e.nH / 2) < 0.01) { e.en_cours = false; e.fini = true; e.vitesse = 0; } }
        if (e.fini && e.ferme && !e.essais.some((x) => x.m === e.m)) e.essais.push({ m: e.m, P: Math.round(P0 + e.gaz * HPA_MMOL) });
      }
      const P = P0 + (e.ferme ? e.gaz * HPA_MMOL : 0);
      capteur.afficher(P); bulles(gu, e, t); if (e.en_cours) dessiner();
      L.missions.noter("gaz_produit", JSON.parse(JSON.stringify({ epi: epi.protege(), essais: e.essais, courant: { m: e.m, ferme: e.ferme, P: Math.round(P), fini: e.fini } })));
    }, 100);
    dessiner();
    return { pense_bete };
  };
})(window.Labo);

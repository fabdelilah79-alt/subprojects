/*
Rôle : paillasse « haut-parleur et moteur » : (1) haut-parleur électrodynamique en coupe (aimant, entrefer, bobine mobile
       collée à la membrane) alimenté par un GBF très lent (0,5 à 2 Hz) : la force de Laplace sur la bobine fait avancer
       puis reculer la membrane ; (2) moteur à courant continu vu dans l'axe : cadre entre les pôles N et S, collecteur et
       balais ; le couple des forces de Laplace le fait tourner ; sans collecteur, il s'arrête cadre perpendiculaire à B.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_hp_moteur(g) -> { pense_bete } ; faits « hp » = { vu }, « moteur » = { tours, bloque }.
Utilisé par : simulation.js.
*/
(function (L) {
  const MC = { x: 720, y: 360, r: 70 }, FREQ = [0.5, 1, 2];

  function hp(g, dx, i) {
    // Coupe : culasse et noyau (gris), aimant (rouge/bleu), bobine dans l'entrefer, membrane ; sens du courant et force.
    g.replaceChildren();
    L.svg("rect", { x: 200, y: 300, width: 20, height: 120, fill: "#7a7f86", stroke: "#333" }, g);
    L.svg("rect", { x: 220, y: 351, width: 66, height: 18, fill: "#7a7f86", stroke: "#333" }, g);
    for (const [y, h] of [[300, 45], [375, 45]]) { L.svg("rect", { x: 220, y, width: 40, height: h, fill: "#d63a2f", stroke: "#333" }, g); L.svg("rect", { x: 260, y, width: 16, height: h, fill: "#7a7f86", stroke: "#333" }, g); }
    L.texte(g, 240, 322, "N", { "font-size": 9, "font-weight": 700, fill: "#fff" }); L.texte(g, 240, 398, "N", { "font-size": 9, "font-weight": 700, fill: "#fff" });
    const x = 278 + dx;
    L.svg("rect", { x, y: 345, width: 30, height: 30, fill: "none", stroke: "#b86b2a", "stroke-width": 3 }, g);
    L.svg("path", { d: `M${x + 30} 348 L${x + 120} 270 M${x + 30} 372 L${x + 120} 450`, fill: "none", stroke: "#d8c9a3", "stroke-width": 5 }, g);
    L.svg("path", { d: `M${x + 120} 270 L${x + 120} 450`, fill: "none", stroke: "#a99a76", "stroke-width": 2 }, g);
    if (i) for (const [y, s] of [[347, 1], [373, -1]]) { const t = i * s > 0 ? "⊙" : "⊗"; L.texte(g, x + 8, y - 1, t, { "font-size": 9, fill: "#c62828" }); }
    if (i) L.svg("path", { d: `M${x + 60} 360 h${30 * Math.sign(i)} m${-6 * Math.sign(i)} -5 l${6 * Math.sign(i)} 5 l${-6 * Math.sign(i)} 5`, fill: "none", stroke: "#1a3d7c", "stroke-width": 2 }, g);
    L.texte(g, 300, 470, "haut-parleur (coupe)", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
  }

  function moteur(g, m) {
    // Pôles, cadre vu dans l'axe (deux côtés, ⊙ et ⊗), collecteur et balais, forces de Laplace.
    g.replaceChildren();
    L.svg("rect", { x: MC.x - 160, y: MC.y - 70, width: 50, height: 140, fill: "#d63a2f", stroke: "#222" }, g);
    L.svg("rect", { x: MC.x + 110, y: MC.y - 70, width: 50, height: 140, fill: "#2f6fd0", stroke: "#222" }, g);
    L.texte(g, MC.x - 135, MC.y, "N", { "font-size": 14, "font-weight": 700, fill: "#fff" }); L.texte(g, MC.x + 135, MC.y, "S", { "font-size": 14, "font-weight": 700, fill: "#fff" });
    const c = Math.cos(m.theta), s = Math.sin(m.theta), A = { x: MC.x + MC.r * c, y: MC.y - MC.r * s }, Bp = { x: MC.x - MC.r * c, y: MC.y + MC.r * s };
    L.svg("line", { x1: A.x, y1: A.y, x2: Bp.x, y2: Bp.y, stroke: "#b86b2a", "stroke-width": 4 }, g);
    for (const [p, k] of [[A, 1], [Bp, -1]]) {
      L.svg("circle", { cx: p.x, cy: p.y, r: 9, fill: "#f5e6d0", stroke: "#b86b2a", "stroke-width": 2 }, g);
      if (m.i) { const sg = m.i * k; L.texte(g, p.x, p.y + 1, sg > 0 ? "•" : "×", { "font-size": 12, "font-weight": 700, fill: "#c62828" }); L.svg("path", { d: `M${p.x} ${p.y - 14 * sg} v${-26 * sg} m-5 ${6 * sg} l5 ${-6 * sg} l5 ${6 * sg}`, fill: "none", stroke: "#1a3d7c", "stroke-width": 2 }, g); }
    }
    L.svg("circle", { cx: MC.x, cy: MC.y, r: 12, fill: m.collecteur ? "#c9a227" : "#8a8f96", stroke: "#5b4a10" }, g);
    if (m.collecteur) { L.svg("line", { x1: MC.x - 12 * s, y1: MC.y - 12 * c, x2: MC.x + 12 * s, y2: MC.y + 12 * c, stroke: "#222", "stroke-width": 2 }, g); for (const k of [-1, 1]) L.svg("rect", { x: MC.x + k * 15 - 3, y: MC.y - 5, width: 6, height: 10, fill: "#2b2f33" }, g); }
    L.texte(g, MC.x, MC.y + 98, m.collecteur ? "moteur : cadre, collecteur et balais" : "moteur sans collecteur", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
  }

  L.poste_hp_moteur = function (g) {
    // Matériel, touches, animation (membrane sinusoïdale ; dynamique du cadre), faits.
    const { pense_bete } = L.decor_circuit(g, 3), gh = L.svg("g", {}, g), gm = L.svg("g", {}, g);
    const h = { marche: false, kf: 1, t: 0, duree: 0 }, m = { ferme: false, collecteur: true, theta: 0, w: 0, i: 0, angle: 0, tours: 0, arret: 0 };
    L.bouton_texte(g, 260, 510, "GBF : marche", () => { h.marche = !h.marche; });
    L.bouton_texte(g, 352, 510, "Fréquence", () => { h.kf = (h.kf + 1) % FREQ.length; });
    const f_txt = L.texte(g, 306, 535, "", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
    L.bouton_texte(g, 680, 510, "Fermer / Ouvrir", () => { m.ferme = !m.ferme; });
    L.bouton_texte(g, 772, 510, "Collecteur", () => { m.collecteur = !m.collecteur; });
    let avant = null;
    const image = (ms) => {
      const dt = avant === null ? 0 : Math.min(0.03, (ms - avant) / 1000); avant = ms;
      if (h.marche) { h.t += dt; h.duree += dt; }
      const i = h.marche ? Math.sin(2 * Math.PI * FREQ[h.kf] * h.t) : 0;
      hp(gh, 10 * i, Math.abs(i) > 0.15 ? i : 0); f_txt.textContent = `GBF : f = ${String(FREQ[h.kf]).replace(".", ",")} Hz ${h.marche ? "(en marche)" : "(arrêté)"}`;
      m.i = m.ferme ? (m.collecteur ? Math.sign(Math.cos(m.theta)) || 1 : 1) : 0;
      m.w += (14 * m.i * Math.cos(m.theta) - 1.6 * m.w) * dt; m.theta += m.w * dt; m.angle += Math.abs(m.w * dt);
      m.tours = Math.floor(m.angle / (2 * Math.PI));
      m.arret = m.ferme && !m.collecteur && Math.abs(m.w) < 0.05 ? m.arret + dt : 0;
      moteur(gm, m);
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => { L.missions.noter("hp", { vu: h.duree > 2 }); L.missions.noter("moteur", { tours: m.collecteur ? m.tours : 0, bloque: m.arret > 1 }); }, 250);
    return { pense_bete };
  };
})(window.Labo);

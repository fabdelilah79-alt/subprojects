/*
Rôle : paillasse « solide sur un plan horizontal ou incliné » : planche de 1,1 m articulée à son bas, relevée par une
       potence (α de 0° à 30°, rapporteur à la charnière) ; deux solides de 200 g : chariot à roulettes (frottements
       négligeables, μ = 0,005) et pavé de bois (glissement μ = 0,30 ; il ne démarre que si tan α > 0,36) ; lanceur à
       ressort en haut de la planche (v0 = 1,4 m/s, sinon lâcher sans vitesse) ; caméra inclinée comme la planche (dans la
       vidéo, la planche est horizontale, le solide se déplace selon x), reliée au portable de pointage.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_plan(g) -> { pense_bete } ; faits « plan » = { alpha, solide, lanceur }, « essais_plan » =
          [{ id, solide, alpha, v0, a (m/s², théorique), arret }], « pointage ».
Utilisé par : simulation.js.
*/
(function (L) {
  const G = 9.81, FPS = 25, LONG = 1.1, PX = 340, H = { x: 480, y: 470 }, ANGLES = [0, 10, 15, 20, 25, 30], V0 = 1.4, M = 0.2;
  const SOLIDES = { chariot: { nom: "chariot", mu: 0.005, mus: 0.01 }, pave: { nom: "pavé de bois", mu: 0.3, mus: 0.36 } };
  const rad = (d) => (d * Math.PI) / 180;

  function mouvement(solide, alpha, v0) {
    // Abscisse s(t) le long de la planche (m, depuis le haut) : pas de 1 ms jusqu'à l'arrêt ou la butée (s = 0,98 m).
    const S = SOLIDES[solide], a_m = G * Math.sin(rad(alpha)), f = G * S.mu * Math.cos(rad(alpha)), pts = [];
    let s = 0.04, v = v0, t = 0, arret = false;
    if (!v0 && Math.tan(rad(alpha)) <= S.mus) return { pts: [[0, s]], a: 0, arret: true };
    while (t < 1.4 && s < 0.98) {
      pts.push([t, s]);
      const a = a_m - (v > 0 ? f : 0);
      v += a * 0.001; if (v <= 0 && Math.tan(rad(alpha)) <= S.mus) { v = 0; arret = true; break; }
      s += v * 0.001; t += 0.001;
    }
    pts.push([t, Math.min(s, 0.98)]);
    return { pts, a: Math.round((a_m - f) * 1000) / 1000, arret };
  }

  const position = (m, t) => { let p = m.pts[0][1]; for (const [ti, si] of m.pts) { if (ti > t) break; p = si; } return p; };

  function video(id, solide, m) {
    // Vidéo prise par la caméra inclinée : planche horizontale, règle de 1 m le long de la planche, solide à sa place.
    const n = Math.min(30, Math.floor(m.pts[m.pts.length - 1][0] * FPS) + 3);
    return { id, fps: FPS, n, largeur_m: 1.2, hauteur_m: 0.6, etalon: { a: { x: 0.1, y: 0.1 }, b: { x: 1.1, y: 0.1 }, longueur_m: 1 }, objet: (k) => ({ x: 0.1 + position(m, k / FPS), y: 0.12 }),
      dessiner(gv, k, ecran) {
        const r = (a, b, c, d, fill) => { const p = ecran(a, b), q = ecran(c, d); L.svg("rect", { x: p.x, y: q.y, width: q.x - p.x, height: p.y - q.y, fill }, gv); };
        r(0, 0, 1.2, 0.6, "#3a3f44"); r(0.05, 0.03, 1.2, 0.08, "#b98a55"); r(0.1, 0.08, 1.1, 0.12, "#efe3c4");
        for (let cm = 0; cm <= 100; cm += 5) { const p = ecran(0.1 + cm / 100, 0.08); L.svg("line", { x1: p.x, y1: p.y, x2: p.x, y2: p.y - (cm % 10 ? 3 : 6), stroke: "#222", "stroke-width": 0.6 }, gv); if (cm % 50 === 0) L.texte(gv, p.x, p.y - 8, String(cm), { "font-size": 6, fill: "#222" }); }
        const x = 0.1 + position(m, k / FPS) - 0.04;
        r(x, 0.12, x + 0.08, solide === "pave" ? 0.17 : 0.15, solide === "pave" ? "#c58b4e" : "#5a6c7d");
        const c = ecran(x + 0.04, 0.12); L.svg("circle", { cx: c.x, cy: c.y - 4, r: 1.6, fill: "#ffeb3b" }, gv);
      } };
  }

  function planche(g, alpha, solide, s, lanceur) {
    // Planche, potence et noix au bout relevé, rapporteur, lanceur à ressort, solide posé ; caméra en avant, inclinée comme la planche.
    g.replaceChildren();
    const u = { x: -Math.cos(rad(alpha)), y: -Math.sin(rad(alpha)) }, haut = { x: H.x + u.x * LONG * PX, y: H.y + u.y * LONG * PX }, n = { x: u.y, y: -u.x };
    L.svg("path", { d: `M${H.x - 20} ${H.y + 6} A26 26 0 0 0 ${H.x - 26} ${H.y - 14}`, fill: "none", stroke: "#bcc6cc" }, g);
    L.texte(g, H.x - 30, H.y + 22, `α = ${alpha}°`, { "font-size": 8, "font-weight": 700, fill: "#f4f1e6" });
    L.svg("path", { d: `M146 420 C170 420 ${haut.x - 30} ${haut.y - 30} ${haut.x - 8} ${haut.y - 12}`, fill: "none", stroke: "#222", "stroke-width": 1.6 }, g);
    L.ombre_sol(g, (H.x + haut.x) / 2, H.y + 14, (H.x - haut.x) / 2, 6, 0.3);
    if (alpha) { L.tige(g, `M${haut.x + 14} ${H.y + 14} V${haut.y + 4}`, 6); L.svg("rect", { x: haut.x + 4, y: haut.y + 4, width: 20, height: 12, rx: 2, fill: "#555c63" }, g); L.svg("path", { d: `M${haut.x - 16} ${H.y + 10} h60 l6 10 h-72 Z`, fill: "#3b4046", stroke: "#1e2226" }, g); }
    L.svg("path", { d: `M${H.x} ${H.y} L${haut.x} ${haut.y} l${n.x * 10} ${n.y * 10} L${H.x + n.x * 10} ${H.y + n.y * 10} Z`, fill: "url(#bois)", stroke: "#8d6337" }, g);
    if (lanceur) { const b = L.svg("g", { transform: `translate(${haut.x} ${haut.y}) rotate(${alpha})` }, g); L.svg("rect", { x: -16, y: -22, width: 12, height: 22, rx: 2, fill: "#6b737a", stroke: "#2a3238" }, b); L.svg("path", { d: "M-4 -10 l2 -4 l2 8 l2 -8 l2 8", fill: "none", stroke: "#c0c4c8", "stroke-width": 1.2 }, b); }
    L.ombre_sol(g, 440, 584, 30, 4, 0.35); for (const dx of [-18, 0, 18]) L.tige(g, `M440 552 L${440 + dx} 584`, 2.5);
    const cam = L.svg("g", { transform: `translate(440 540) rotate(${alpha})` }, g); L.svg("rect", { x: -18, y: -12, width: 36, height: 24, rx: 4, fill: "#24282c" }, cam); L.svg("circle", { cx: 0, cy: -16, r: 7, fill: "#111", stroke: "#666" }, cam);
    L.svg("path", { d: "M458 540 C520 540 520 480 548 470", fill: "none", stroke: "#222", "stroke-width": 2.5 }, g);
    L.svg("circle", { cx: H.x, cy: H.y, r: 5, fill: "#555c63" }, g);
    const p = { x: haut.x - u.x * s * PX, y: haut.y - u.y * s * PX }, ang = alpha;
    const corps = L.svg("g", { transform: `translate(${p.x} ${p.y}) rotate(${ang})` }, g);
    if (solide === "pave") L.svg("rect", { x: -16, y: -20, width: 32, height: 20, rx: 2, fill: "#c58b4e", stroke: "#6b4a2a" }, corps);
    else { L.svg("rect", { x: -17, y: -18, width: 34, height: 12, rx: 3, fill: "#5a6c7d", stroke: "#2a3238" }, corps); for (const dx of [-10, 10]) L.svg("circle", { cx: dx, cy: -4, r: 4, fill: "#222" }, corps); }
    L.svg("rect", { x: -8, y: -26, width: 16, height: 6, fill: "#ffeb3b", opacity: 0.8 }, corps);
  }

  L.poste_plan = function (g) {
    // Matériel et réglages ; « Lancer » : le solide part, la caméra filme, la vidéo va au logiciel.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), vue = L.svg("g", {}, g), essais = [];
    const logiciel = L.pointage_video(g, { nom: "pointage", x: 540, y: 180 });
    const etat = { alpha: 0, solide: "chariot", lanceur: true, t: null, m: null, n: 0 };
    const dessiner = () => planche(vue, etat.alpha, etat.solide, etat.m ? position(etat.m, etat.t) : 0.04, etat.lanceur);
    const noter = () => L.missions.noter("plan", { alpha: etat.alpha, solide: etat.solide, lanceur: etat.lanceur });
    L.reglages_plan(g, etat, ANGLES, (k) => { if (etat.t !== null) return; Object.assign(etat, k); etat.m = null; noter(); dessiner(); }, () => {
      if (etat.t !== null) { etat.t = null; etat.m = null; return dessiner(); }
      etat.m = mouvement(etat.solide, etat.alpha, etat.lanceur ? V0 : 0); etat.t = 0;
      const id = `plan${++etat.n}`, avant = performance.now(), fin = etat.m.pts[etat.m.pts.length - 1][0];
      const pas = () => { etat.t = Math.min(fin, (performance.now() - avant) / 1000); dessiner(); if (etat.t < fin) return requestAnimationFrame(pas); essais.push({ id, solide: etat.solide, alpha: etat.alpha, v0: etat.lanceur ? V0 : 0, a: etat.m.a, arret: etat.m.arret }); L.missions.noter("essais_plan", essais.slice()); logiciel.charger(video(id, etat.solide, etat.m)); };
      requestAnimationFrame(pas);
    });
    noter(); dessiner();
    return { pense_bete, masse: M };
  };
})(window.Labo);

/*
Rôle : corde tendue de 2 m : tenue à gauche par une poignée (on la secoue vers le haut puis on la relâche), elle passe à
       droite sur une poulie fixée au bord de la paillasse et tend un porte-masse (50 g) qui reçoit des disques de
       100 g (toucher la boîte de disques en ajoute un, toucher le porte-masse en retire un) : tension T = M·g. Trois
       cordes de masses linéiques différentes sont accrochées au mur ; en toucher une la monte à la place de l'autre.
       La perturbation avance à v = √(T / μ) (milieu_1d.js) et se réfléchit sur la poulie.
Reçoit : le groupe SVG et { x0 (px de la poignée), k (px par m), y_axe, sol (px du pied de la poulie), fait, changer()
         (facultatif : appelée quand la corde ou la tension change) }.
Produit : Labo.corde_tendue(g, reglage) -> { milieu, etat { corde, mu (kg/m), M (kg), T (N), v } } ; fait « <fait> » =
          { corde (A, B ou C), mu, M, T, secousse (m, plus grande élévation de la poignée) }.
Utilisé par : les simulations d'ondes mécaniques (influence du milieu sur la célérité).
*/
(function (L) {
  const LONG = 2, G = 9.81, CORDES = { A: { mu: 0.05, couleur: "#c62828", e: 2.5 }, B: { mu: 0.1, couleur: "#1565c0", e: 3.5 }, C: { mu: 0.2, couleur: "#2e7d32", e: 5 } };

  function poulie(g, x, y, sol) {
    // Poulie à gorge (diamètre 5 cm) sur sa pince, fixée au bord de la paillasse.
    L.svg("rect", { x: x - 6, y, width: 12, height: sol - y + 6, fill: "#5d646a", stroke: "#2b2f33" }, g);
    L.svg("rect", { x: x - 16, y: sol - 4, width: 32, height: 14, rx: 2, fill: "#3a4046" }, g);
    L.svg("circle", { cx: x + 7, cy: y + 8, r: 8, fill: "#d9dde0", stroke: "#555" }, g);
    L.svg("circle", { cx: x + 7, cy: y + 8, r: 2, fill: "#555" }, g);
  }

  function masses(g, x, haut, n) {
    // Porte-masse (tige et plateau) et ses n disques de 100 g, pendus au bout de la corde.
    g.replaceChildren();
    L.tige(g, `M${x} ${haut} V${haut + 40}`, 2);
    L.svg("rect", { x: x - 12, y: haut + 40, width: 24, height: 4, rx: 1, fill: "#8a6a2a" }, g);
    for (let i = 0; i < n; i++) L.svg("rect", { x: x - 11, y: haut + 34 - i * 6, width: 22, height: 6, rx: 1.5, fill: "#b08a3e", stroke: "#6d5320", "stroke-width": 0.6 }, g);
    L.svg("rect", { x: x - 16, y: haut, width: 32, height: 48, fill: "#000", opacity: 0 }, g);
  }

  function boite(g, x, y) {
    // Boîte de disques de 100 g posée sur la paillasse.
    L.boitier(g, x - 32, y - 20, 64, 14, 12, { dessus: "#b08a3e", face: "#6d5320" });
    L.texte(g, x, y + 9, "disques 100 g", { "font-size": 6, "font-weight": 700, fill: "#f6ecd2" });
    L.svg("rect", { x: x - 34, y: y - 24, width: 68, height: 50, fill: "#000", opacity: 0 }, g);
  }

  function crochets(g, s, monter) {
    // Les trois cordes enroulées au mur, avec leur masse linéique ; celle qui est montée est un crochet vide.
    g.replaceChildren();
    Object.entries(CORDES).forEach(([nom, c], i) => {
      const x = 470 + i * 110, b = L.svg("g", { role: "button", "aria-label": `Corde ${nom}` }, g);
      L.svg("circle", { cx: x, cy: 70, r: 3, fill: "#666" }, b);
      if (s.corde !== nom) for (let k = 0; k < 4; k++) L.svg("ellipse", { cx: x, cy: 100, rx: 24 - k * 2, ry: 28 - k * 2, fill: "none", stroke: c.couleur, "stroke-width": c.e }, b);
      L.texte(b, x, 145, `${nom} : μ = ${Math.round(c.mu * 1000)} g/m`, { "font-size": 8, "font-weight": 700, fill: "#23315a" });
      L.svg("rect", { x: x - 40, y: 66, width: 80, height: 86, fill: "#000", opacity: 0 }, b);
      L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => monter(nom) });
    });
  }

  L.corde_tendue = function (g, { x0, k, y_axe, sol, fait = "corde", changer = () => {} }) {
    // Corde, poignée, poulie, masses, cordes de rechange ; la célérité suit la corde montée et la tension.
    const s = { corde: "B", n: 2, main: 0, cible: 0, tenue: false, secousse: 0 }, xp = x0 + LONG * k;
    const m = L.milieu_1d({ longueur: LONG, n: 201, v: 1, amortissement: 0.3, fin: "fixe" });
    const gc = L.svg("g", {}, g), p = L.svg("path", { fill: "none", "stroke-linecap": "round" }, g), gm = L.svg("g", { class: "porte-masse", role: "button", "aria-label": "Porte-masse" }, g);
    poulie(g, xp, y_axe - 8, sol); const gb = L.svg("g", { class: "boite-disques", role: "button", "aria-label": "Boîte de disques" }, g); boite(gb, xp - 90, sol - 10);
    const regler = () => { const c = CORDES[s.corde]; Object.assign(s, { mu: c.mu, M: Math.round((0.05 + 0.1 * s.n) * 1000) / 1000 }); s.T = Math.round(s.M * G * 1000) / 1000; s.v = Math.sqrt(s.T / s.mu); m.regler(s.v); m.repos(); masses(gm, xp + 15, y_axe + 20, s.n); crochets(gc, s, (nom) => { s.corde = nom; regler(); }); noter(); changer(); };
    const noter = () => L.missions.noter(fait, { corde: s.corde, mu: s.mu, M: s.M, T: s.T, secousse: Math.round(s.secousse * 100) / 100 });
    L.glissable(gb, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { s.n = Math.min(5, s.n + 1); regler(); } });
    L.glissable(gm, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { s.n = Math.max(0, s.n - 1); regler(); } });
    const h = L.svg("g", { class: "poignee-corde", role: "button", "aria-label": "Poignée de la corde" }, g);
    L.glissable(h, { soulever: false, debut: () => { s.tenue = true; return { x: x0, y: y_axe - s.main * k }; }, deplacer: (q) => { s.cible = Math.max(-0.1, Math.min(0.1, (y_axe - q.y) / k)); }, lacher: () => { s.tenue = false; } });
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000); avant = t;
      if (!s.tenue) s.cible *= Math.exp(-dt / 0.03);
      const de = s.main, t0 = m.t; m.avancer(dt, (tt) => de + (s.cible - de) * Math.min(1, (tt - t0) / Math.max(dt, 1e-6))); s.main = s.cible;
      if (s.main > s.secousse + 0.005) { s.secousse = s.main; noter(); }
      let d = ""; for (let i = 0; i < m.n; i += 2) d += `${i ? "L" : "M"}${(x0 + i * m.dx * k).toFixed(1)} ${(y_axe - m.y[i] * k).toFixed(1)} `;
      p.setAttribute("d", `${d}L${xp + 4} ${y_axe - 2} Q${xp + 15} ${y_axe} ${xp + 15} ${y_axe + 12} V${y_axe + 20}`); p.setAttribute("stroke", CORDES[s.corde].couleur); p.setAttribute("stroke-width", CORDES[s.corde].e);
      h.replaceChildren(); L.svg("rect", { x: x0 - 44, y: y_axe - s.main * k - 7, width: 44, height: 14, rx: 6, fill: "url(#bois)", stroke: "#5b3b1c" }, h); L.svg("rect", { x: x0 - 56, y: y_axe - s.main * k - 26, width: 64, height: 52, fill: "#000", opacity: 0 }, h);
      requestAnimationFrame(image);
    };
    regler(); requestAnimationFrame(image);
    return { milieu: m, etat: s, longueur: LONG };
  };
})(window.Labo);

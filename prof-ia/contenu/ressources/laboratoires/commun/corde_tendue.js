/*
Rôle : corde tendue de 2 m : tenue à gauche par une poignée (un toucher donne un coup sec vers le haut : une bosse
       brève et nette, d'amplitude et de durée réglables), elle passe à droite sur une poulie fixée au bord de la paillasse et tend un porte-masse (50 g) qui reçoit des disques de
       100 g (toucher la boîte de disques en ajoute un, toucher le porte-masse en retire un) : tension T = M·g. Trois
       cordes de masses linéiques différentes sont accrochées au mur ; en toucher une la monte à la place de l'autre.
       La perturbation avance à v = √(T / μ) (milieu_1d.js) et se réfléchit sur la poulie. Une caméra rapide montre la
       scène au ralenti (× 20 par défaut : le chronomètre mesure toujours les vraies durées) ; la chronophotographie
       superpose la forme de la corde toutes les 0,05 s après le coup.
Reçoit : le groupe SVG et { x0 (px de la poignée), k (px par m), y_axe, sol (px du pied de la poulie), fait, changer()
         (facultatif : appelée quand la corde ou la tension change) }.
Produit : Labo.corde_tendue(g, reglage) -> { milieu, etat { corde, mu (kg/m), M (kg), T (N), v } } ; fait « <fait> » =
          { corde (A, B ou C), mu, M, T, secousse (m, amplitude du dernier coup), duree (s), ralenti } ; « photos_<fait> » =
          nombre d'images de la dernière chronophotographie.
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

  function commandes(g, s, changer) {
    // Boîtier mural à quatre réglages : amplitude et durée du coup sec, ralenti de la caméra rapide, chronophotographie.
    const lignes = [["Secousse", "amplitude", [[0.06, "grande (6 cm)"], [0.03, "petite (3 cm)"]]], ["Durée du coup", "duree", [[0.04, "brève (0,04 s)"], [0.1, "longue (0,10 s)"]]],
      ["Caméra rapide", "ralenti", [[20, "ralenti × 20"], [1, "temps réel"]]], ["Chronophotographie", "photos", [[false, "non"], [true, "toutes les 0,05 s"]]]];
    L.svg("rect", { x: 760, y: 56, width: 240, height: 132, rx: 4, fill: "#eef1f3", stroke: "#8d979e" }, g);
    L.texte(g, 880, 70, "COMMANDE DE L'EXPÉRIENCE", { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
    lignes.forEach(([titre, cle, choix], i) => {
      const y = 92 + i * 26, b = L.svg("g", { role: "button", "aria-label": titre }, g);
      L.texte(g, 770, y, titre, { "font-size": 7.5, "text-anchor": "start", fill: "#23315a" });
      L.svg("rect", { x: 868, y: y - 9, width: 124, height: 18, rx: 3, fill: "#fff", stroke: "#8d979e" }, b);
      const t = L.svg("g", {}, b);
      const ecrire = () => { t.replaceChildren(); L.texte(t, 930, y, choix.find((c) => c[0] === s[cle])[1], { "font-size": 7.5, "font-weight": 700, fill: "#1f4f8f" }); };
      L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { s[cle] = choix[(choix.findIndex((c) => c[0] === s[cle]) + 1) % choix.length][0]; ecrire(); changer(); } });
      ecrire();
    });
  }

  function forme(m, x0, k, y_axe) {
    // Chemin de la corde (un point sur deux du milieu).
    let d = "";
    for (let i = 0; i < m.n; i += 2) d += `${i ? "L" : "M"}${(x0 + i * m.dx * k).toFixed(1)} ${(y_axe - m.y[i] * k).toFixed(1)} `;
    return d;
  }

  function photographier(m, s, gp, c, fait) {
    // Après un coup sec, garde la forme de la corde toutes les 0,05 s (8 images), dessinées en filigrane et numérotées.
    m.sur_pas((t) => {
      if (!s.photos || s.coup === null || s.images >= 8 || t < s.coup + (s.images + 1) * 0.05) return;
      s.images++; L.missions.noter(`photos_${fait}`, s.images);
      L.svg("path", { d: forme(m, c.x0, c.k, c.y_axe), fill: "none", stroke: "#37474f", "stroke-width": 1, opacity: 0.45 }, gp);
      const i = m.y.reduce((b, v, j) => (v > m.y[b] ? j : b), 0);
      L.texte(gp, c.x0 + i * m.dx * c.k, c.y_axe - m.y[i] * c.k - 7, String(s.images), { "font-size": 7, "font-weight": 700, fill: "#37474f" });
    });
  }

  L.corde_tendue = function (g, { x0, k, y_axe, sol, fait = "corde", changer = () => {} }) {
    // Corde, poignée (un toucher : coup sec), poulie, masses, cordes de rechange, boîtier de commande.
    const s = { corde: "B", n: 2, main: 0, secousse: 0, amplitude: 0.06, duree: 0.04, ralenti: 20, photos: false, coup: null, images: 0 }, xp = x0 + LONG * k, c = { x0, k, y_axe };
    const m = L.milieu_1d({ longueur: LONG, n: 201, v: 1, amortissement: 0.3, fin: "fixe" });
    const gc = L.svg("g", {}, g), gp = L.svg("g", { "pointer-events": "none" }, g), p = L.svg("path", { fill: "none", "stroke-linecap": "round" }, g), gm = L.svg("g", { class: "porte-masse", role: "button", "aria-label": "Porte-masse" }, g);
    poulie(g, xp, y_axe - 8, sol); const gb = L.svg("g", { class: "boite-disques", role: "button", "aria-label": "Boîte de disques" }, g); boite(gb, xp - 90, sol - 10);
    const noter = () => L.missions.noter(fait, { corde: s.corde, mu: s.mu, M: s.M, T: s.T, secousse: s.secousse, duree: s.duree, ralenti: s.ralenti });
    const regler = () => { const r = CORDES[s.corde]; Object.assign(s, { mu: r.mu, M: Math.round((0.05 + 0.1 * s.n) * 1000) / 1000, coup: null }); s.T = Math.round(s.M * G * 1000) / 1000; s.v = Math.sqrt(s.T / s.mu); m.regler(s.v); m.repos(); gp.replaceChildren(); masses(gm, xp + 15, y_axe + 20, s.n); crochets(gc, s, (nom) => { s.corde = nom; regler(); }); noter(); changer(); };
    commandes(g, s, noter); photographier(m, s, gp, c, fait);
    L.glissable(gb, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { s.n = Math.min(5, s.n + 1); regler(); } });
    L.glissable(gm, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { s.n = Math.max(0, s.n - 1); regler(); } });
    const h = L.svg("g", { class: "poignee-corde", role: "button", "aria-label": "Poignée de la corde" }, g);
    L.glissable(h, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { if (s.coup !== null && m.t < s.coup + s.duree) return; s.coup = m.t; s.images = 0; s.forme = { A: s.amplitude, tau: s.duree }; gp.replaceChildren(); s.secousse = s.amplitude; noter(); } });
    const source = (t) => (s.coup !== null && t > s.coup && t < s.coup + s.forme.tau ? s.forme.A * Math.sin((Math.PI * (t - s.coup)) / s.forme.tau) : 0);
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000) / s.ralenti; avant = t;
      m.avancer(dt, source); s.main = source(m.t);
      p.setAttribute("d", `${forme(m, x0, k, y_axe)}L${xp + 4} ${y_axe - 2} Q${xp + 15} ${y_axe} ${xp + 15} ${y_axe + 12} V${y_axe + 20}`); p.setAttribute("stroke", CORDES[s.corde].couleur); p.setAttribute("stroke-width", CORDES[s.corde].e);
      h.replaceChildren(); L.svg("rect", { x: x0 - 44, y: y_axe - s.main * k - 7, width: 44, height: 14, rx: 6, fill: "url(#bois)", stroke: "#5b3b1c" }, h); L.svg("rect", { x: x0 - 56, y: y_axe - s.main * k - 26, width: 64, height: 52, fill: "#000", opacity: 0 }, h);
      requestAnimationFrame(image);
    };
    regler(); requestAnimationFrame(image);
    return { milieu: m, etat: s, longueur: LONG };
  };
})(window.Labo);

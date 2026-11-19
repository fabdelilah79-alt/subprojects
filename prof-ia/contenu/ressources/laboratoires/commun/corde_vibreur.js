/*
Rôle : onde progressive sinusoïdale le long d'une corde de 1,5 m : à gauche un vibreur (excitateur électromécanique) relié
       à un GBF (fréquence f de 10 à 100 Hz, touche marche) ; à droite un tampon de coton qui absorbe l'onde (pas de
       réflexion). Célérité v = 10 m/s : λ = v / f. En lumière ordinaire, l'œil ne voit qu'une bande floue (la corde vibre
       trop vite). Avec le stroboscope (salle obscure), on voit la corde aux instants des éclairs (fréquence fe) : l'œil
       garde les images de 0,1 s ; si f est un multiple de fe, la corde paraît immobile ; si fe est un peu plus petite
       que f, l'onde semble avancer lentement. Deux curseurs rouges se déplacent le long de la règle pour mesurer λ.
Reçoit : le groupe SVG et { x0 (px du vibreur), k (px par m), y_axe, sol, fait }.
Produit : Labo.corde_vibreur(g, reglage) -> s { f, fe, marche, strobo, c1, c2 (m) } ; fait « <fait> » = { f, marche, strobo, fe,
          rapport (f / fe), ecart (cm, entre les curseurs), lambda (cm) }.
Utilisé par : les simulations d'ondes progressives périodiques.
*/
(function (L) {
  const LONG = 1.5, V = 10, A = 0.015, GARDE = 0.1;

  function elongation(s, x, t) {
    // Élongation au point x à l'instant t (le front de l'onde avance à v depuis la mise en marche).
    if (!s.marche || x > V * (t - s.t_on)) return 0;
    return A * Math.sin(2 * Math.PI * s.f * (t - s.t_on - x / V));
  }

  function chemin(s, c, t) {
    // Forme de la corde à l'instant t (150 points).
    let d = "";
    for (let i = 0; i <= 150; i++) { const x = (i / 150) * LONG; d += `${i ? "L" : "M"}${(c.x0 + x * c.k).toFixed(1)} ${(c.y_axe - elongation(s, x, t) * c.k).toFixed(1)} `; }
    return d;
  }

  function dessiner(gr, s, c, t) {
    // Lumière ordinaire : bande floue ; stroboscope : une image par éclair des 0,1 dernière seconde.
    gr.replaceChildren();
    const fil = { fill: "none", stroke: "#f0e6c8", "stroke-width": 2.2, "stroke-linecap": "round" };
    if (!s.strobo) {
      const front = s.marche ? Math.min(LONG, V * (t - s.t_on)) * c.k : 0;
      if (front > 0) L.svg("rect", { x: c.x0, y: c.y_axe - A * c.k, width: front, height: 2 * A * c.k, fill: "#b07a3a", opacity: 0.45 }, gr);
      return void L.svg("path", { d: chemin(s, c, t), ...fil, stroke: "#8a5a2b", opacity: 0.8 }, gr);
    }
    const n2 = Math.floor(t * s.fe), n1 = Math.max(Math.ceil((t - GARDE) * s.fe), n2 - 11);
    for (let n = n1; n <= n2; n++) L.svg("path", { d: chemin(s, c, n / s.fe), ...fil }, gr);
  }

  function regle(g, c) {
    // Règle de 1,5 m tenue sous la corde, graduée en centimètres (chiffres tous les 10 cm).
    const y = c.y_axe + 26;
    L.svg("rect", { x: c.x0 - 6, y, width: LONG * c.k + 12, height: 14, fill: "#efe3b8", stroke: "#a8935a" }, g);
    for (let i = 0; i <= 150; i++) { const x = c.x0 + i * 0.01 * c.k; L.svg("line", { x1: x, y1: y, x2: x, y2: y + (i % 10 ? (i % 5 ? 3 : 5) : 7), stroke: "#3b3220", "stroke-width": 0.5 }, g); if (i % 10 === 0) L.texte(g, x, y + 11, String(i), { "font-size": 5, fill: "#3b3220" }); }
  }

  function curseurs(g, s, c, noter) {
    // Deux curseurs rouges glissés le long de la règle (au millimètre).
    [["c1", 0.25], ["c2", 0.6]].forEach(([cle, x]) => {
      s[cle] = x;
      const b = L.svg("g", { class: `curseur-${cle}`, role: "button", "aria-label": `Curseur ${cle}` }, g);
      const placer = () => { b.replaceChildren(); const px = c.x0 + s[cle] * c.k; L.svg("path", { d: `M${px} ${c.y_axe + 24} l-6 -10 h12 Z`, fill: "#d32f2f" }, b); L.svg("line", { x1: px, y1: c.y_axe + 14, x2: px, y2: c.y_axe - 30, stroke: "#d32f2f", "stroke-width": 0.8, "stroke-dasharray": "3 2" }, b); L.svg("rect", { x: px - 10, y: c.y_axe - 32, width: 20, height: 58, fill: "#000", opacity: 0 }, b); };
      L.glissable(b, { soulever: false, debut: () => ({ x: c.x0 + s[cle] * c.k, y: 0 }), deplacer: (p) => { s[cle] = Math.max(0, Math.min(LONG, Math.round(((p.x - c.x0) / c.k) * 1000) / 1000)); placer(); }, lacher: noter });
      placer();
    });
  }

  function appareils(g, s, c, noter) {
    // GBF (fréquence, marche) relié au vibreur ; stroboscope (fe, marche) posé sur une étagère murale ; tampon de coton.
    const yg = c.y_axe + 44;
    L.boitier(g, c.x0 - 150, yg - 70, 130, 14, 112, { dessus: "#cfd5d9", face: "#5d6970" });
    L.texte(g, c.x0 - 85, yg - 63, "GBF", { "font-size": 7, "font-weight": 700, fill: "#23315a" });
    L.bouton_reglage(g, { x: c.x0 - 108, y: yg, min: 10, max: 100, pas: 1, valeur: 50, unite: "Hz", titre: "f", decimales: 0, sur_changement: (v) => { s.f = v; noter(); } });
    L.bouton_rond(g, c.x0 - 42, yg, "I/O", () => { s.marche = !s.marche; s.t_on = performance.now() / 1000; noter(); }, 10);
    L.svg("rect", { x: c.x0 - 22, y: c.y_axe - 8, width: 24, height: 40, rx: 3, fill: "#37474f", stroke: "#111" }, g);
    L.svg("ellipse", { cx: c.x0 + LONG * c.k + 6, cy: c.y_axe, rx: 12, ry: 9, fill: "#fbfbf6", stroke: "#cfcfc4" }, g);
    const xs = c.x0 + LONG * c.k - 60;
    L.svg("rect", { x: xs - 100, y: 170, width: 200, height: 8, fill: "url(#bois)" }, g);
    for (const dx of [-80, 80]) L.svg("path", { d: `M${xs + dx} 178 v24 h6 v-6 l-6 -18 Z`, fill: "#6c747a" }, g);
    L.boitier(g, xs - 80, 44, 160, 14, 112, { dessus: "#cfd5d9", face: "#3f4b52" });
    L.texte(g, xs, 51, "STROBOSCOPE", { "font-size": 7, "font-weight": 700, fill: "#23315a" });
    L.bouton_reglage(g, { x: xs - 30, y: 114, min: 1, max: 100, pas: 0.1, valeur: 25, unite: "Hz", titre: "fe", decimales: 1, sur_changement: (v) => { s.fe = Math.round(v * 10) / 10; noter(); } });
    L.bouton_rond(g, xs + 46, 114, "I/O", () => { s.strobo = !s.strobo; c.voile.style.display = s.strobo ? "" : "none"; noter(); }, 10);
  }

  L.corde_vibreur = function (g, { x0, k, y_axe, sol, fait = "corde_vibreur" }) {
    // Voile de la salle obscure (sous les appareils, qui restent visibles), règle, corde animée, curseurs.
    const s = { f: 50, fe: 25, marche: false, strobo: false, t_on: 0 }, c = { x0, k, y_axe, sol };
    const r2 = (v) => Math.round(v * 100) / 100;
    const noter = () => L.missions.noter(fait, { f: s.f, marche: s.marche, strobo: s.strobo, fe: s.fe, rapport: Math.round((s.f / s.fe) * 1000) / 1000, ecart: r2(Math.abs(s.c2 - s.c1) * 100), lambda: r2((V / s.f) * 100) });
    c.voile = L.svg("rect", { x: 0, y: 0, width: 1024, height: 640, fill: "#05070a", opacity: 0.88, "pointer-events": "none" }, g); c.voile.style.display = "none";
    appareils(g, s, c, noter); regle(g, c);
    const gr = L.svg("g", { "pointer-events": "none" }, g);
    curseurs(g, s, c, noter);
    const image = () => { dessiner(gr, s, c, performance.now() / 1000); requestAnimationFrame(image); };
    requestAnimationFrame(image); noter();
    return s;
  };
})(window.Labo);

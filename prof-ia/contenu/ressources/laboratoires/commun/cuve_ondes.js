/*
Rôle : cuve à ondes (eau sur 5 mm, vibreur à réglette : onde plane) éclairée par une lampe et un stroboscope réglé sur
       la fréquence du vibreur : l'image des rides, projetée sur un écran (35 cm × 25 cm à l'échelle 1,2 px/mm), est
       immobile (ou défile lentement si l'on décale le stroboscope). Une barrière à 11 cm du vibreur porte une fente de
       largeur a réglable (5 à 60 mm), ou un obstacle de même largeur, ou rien. L'image est calculée par le principe de
       Huygens (chaque point de la fente réémet une onde circulaire) ; λ suit la relation de dispersion des ondes à la
       surface de l'eau (pesanteur et tension superficielle) : la célérité dépend de la fréquence.
Reçoit : le groupe SVG et { x, y (coin de l'écran), fait }.
Produit : Labo.cuve_ondes(g, reglage) -> s { f, a, obstacle } ; fait « <fait> » = { f, obstacle, a (mm), lambda (mm), v (m/s),
          ecart (mm, entre les curseurs), rapport (a / λ) }.
Utilisé par : les simulations de diffraction et de dispersion.
*/
(function (L) {
  const NX = 210, NY = 150, MM = 350 / NX, E = 1.2, YB = 110, H = 0.005;

  function lambda(f) {
    // Longueur d'onde (mm) : ω² = (g·k + σ/ρ·k³)·th(k·h), résolue par la méthode de Newton.
    const w = 2 * Math.PI * f, g = 9.81, S = 7.3e-5;
    let k = (w * w) / g;
    for (let i = 0; i < 60; i++) { const th = Math.tanh(k * H), F = (g * k + S * k ** 3) * th - w * w, dF = (g + 3 * S * k * k) * th + ((g * k + S * k ** 3) * H) / Math.cosh(k * H) ** 2; k -= F / dF; }
    return (2 * Math.PI / k) * 1000;
  }

  function fente(px, py, k, a) {
    // Onde diffractée par une fente de largeur a (mm) centrée en x = 175 mm : somme de sources de Huygens (complexe).
    const n = Math.max(8, Math.ceil(a / 1.5)), ds = a / n, c = Math.sqrt(k / (2 * Math.PI));
    let re = 0, im = 0;
    for (let j = 0; j < n; j++) {
      const dx = px - (175 - a / 2 + (j + 0.5) * ds), dy = py - YB, r = Math.hypot(dx, dy) + 1e-6, amp = (c * ds * (1 + dy / r)) / 2 / Math.sqrt(r), ph = k * (YB + r) - Math.PI / 4;
      re += amp * Math.cos(ph); im += amp * Math.sin(ph);
    }
    return [re, im];
  }

  function champ(s) {
    // Champ complexe en chaque case de l'image (avant la barrière : onde plane ; après : fente, obstacle ou rien).
    const k = (2 * Math.PI) / s.lambda, re = new Float32Array(NX * NY), im = new Float32Array(NX * NY);
    for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
      const x = (i + 0.5) * MM, y = (j + 0.5) * MM, p = j * NX + i;
      let u = [Math.cos(k * y), Math.sin(k * y)];
      if (y > YB && s.obstacle !== "aucun") { const d = fente(x, y, k, s.a); u = s.obstacle === "fente" ? d : [u[0] - d[0], u[1] - d[1]]; }
      re[p] = u[0]; im[p] = u[1];
    }
    s.re = re; s.im = im;
  }

  function peindre(s, img, toile) {
    // Les crêtes (partie réelle positive) concentrent la lumière : bandes claires ; la barrière est sombre.
    const c = toile.getContext("2d"), d = c.createImageData(NX, NY), cp = Math.cos(s.phase), sp = Math.sin(s.phase), xa = 175 - s.a / 2, xb = 175 + s.a / 2;
    for (let p = 0; p < NX * NY; p++) {
      const x = ((p % NX) + 0.5) * MM, y = (Math.floor(p / NX) + 0.5) * MM, bar = Math.abs(y - YB) < 4 && s.obstacle !== "aucun" && (s.obstacle === "fente" ? x < xa || x > xb : x > xa && x < xb);
      const b = bar ? 40 : Math.max(20, Math.min(250, 135 + 95 * (s.re[p] * cp + s.im[p] * sp)));
      d.data.set([b * 0.86, b * 0.94, b, 255], 4 * p);
    }
    c.putImageData(d, 0, 0); img.setAttribute("href", toile.toDataURL());
  }

  function curseurs(g, s, c, noter) {
    // Deux traits rouges que l'on glisse verticalement sur l'image (au demi-millimètre) ; règle graduée à gauche.
    for (let m = 0; m <= 250; m += 5) L.svg("line", { x1: c.x - (m % 50 ? 4 : 8), y1: c.y + m * E, x2: c.x, y2: c.y + m * E, stroke: "#333", "stroke-width": 0.6 }, g);
    for (let m = 0; m <= 250; m += 50) L.texte(g, c.x - 18, c.y + m * E, `${m / 10}`, { "font-size": 7, fill: "#333" });
    L.texte(g, c.x - 18, c.y - 10, "cm", { "font-size": 7, fill: "#333" });
    [["c1", 20], ["c2", 60]].forEach(([cle, m]) => {
      s[cle] = m;
      const b = L.svg("g", { class: `curseur-${cle}`, role: "button", "aria-label": `Curseur ${cle}` }, g);
      const placer = () => { b.replaceChildren(); const y = c.y + s[cle] * E; L.svg("line", { x1: c.x, y1: y, x2: c.x + 350 * E, y2: y, stroke: "#e53935", "stroke-width": 1 }, b); L.svg("path", { d: `M${c.x + 350 * E} ${y} l10 -6 v12 Z`, fill: "#e53935" }, b); L.svg("rect", { x: c.x + 350 * E - 2, y: y - 10, width: 24, height: 20, fill: "#000", opacity: 0 }, b); };
      L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: c.y + s[cle] * E }), deplacer: (p) => { s[cle] = Math.max(0, Math.min(250, Math.round(((p.y - c.y) / E) * 2) / 2)); placer(); }, lacher: noter });
      placer();
    });
  }

  function commandes(g, s, c, changer) {
    // Fréquence du vibreur, type de barrière, largeur a, stroboscope (immobile ou défilement lent).
    const x = c.x + 350 * E + 50;
    L.boitier(g, x, c.y + 10, 150, 14, 270, { dessus: "#cfd5d9", face: "#46525a" });
    L.texte(g, x + 75, c.y + 17, "VIBREUR ET STROBOSCOPE", { "font-size": 6.5, "font-weight": 700, fill: "#23315a" });
    L.bouton_reglage(g, { x: x + 75, y: c.y + 90, min: 10, max: 30, pas: 1, valeur: s.f, unite: "Hz", titre: "f", decimales: 0, sur_changement: (v) => { s.f = v; changer(true); } });
    [["obstacle", ["fente", "obstacle", "aucun"], 150], ["defile", [false, true], 230]].forEach(([cle, liste, dy]) => {
      const b = L.svg("g", { role: "button", "aria-label": cle }, g);
      L.svg("rect", { x: x + 12, y: c.y + dy, width: 126, height: 20, rx: 3, fill: "#fff", stroke: "#8d979e" }, b);
      const t = L.svg("g", {}, b);
      const ecrire = () => { t.replaceChildren(); L.texte(t, x + 75, c.y + dy + 10, cle === "obstacle" ? `barrière : ${s.obstacle}` : s.defile ? "strobo : défilement lent" : "strobo : image immobile", { "font-size": 7.5, "font-weight": 700, fill: "#1f4f8f" }); };
      L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { s[cle] = liste[(liste.indexOf(s[cle]) + 1) % liste.length]; ecrire(); changer(cle === "obstacle"); } });
      ecrire();
    });
    const ta = L.svg("g", {}, g), ecrire_a = () => { ta.replaceChildren(); L.texte(ta, x + 75, c.y + 200, `a = ${s.a} mm`, { "font-size": 9, "font-weight": 700, fill: "#f4f1e6" }); };
    [[-1, 30], [1, 120]].forEach(([d, dx]) => L.bouton_rond(g, x + dx, c.y + 200, d < 0 ? "−" : "+", () => { const A = [5, 10, 15, 20, 30, 40, 60]; s.a = A[Math.max(0, Math.min(A.length - 1, A.indexOf(s.a) + d))]; ecrire_a(); changer(true); }));
    ecrire_a();
  }

  L.cuve_ondes = function (g, { x, y, fait = "cuve" }) {
    // Écran (cadre, image), règle et curseurs, commandes ; l'image est recalculée quand un réglage change.
    const s = { f: 20, a: 60, obstacle: "fente", defile: false, phase: 0 }, c = { x, y }, toile = document.createElement("canvas");
    toile.width = NX; toile.height = NY;
    L.svg("rect", { x: x - 10, y: y - 10, width: 350 * E + 20, height: 250 * E + 20, rx: 3, fill: "#f4f4ee", stroke: "#9a9a90" }, g);
    const img = L.svg("image", { x, y, width: 350 * E, height: 250 * E, preserveAspectRatio: "none", style: "image-rendering: auto" }, g);
    L.svg("rect", { x: x + 20, y: y - 6, width: 350 * E - 40, height: 6, fill: "#455a64" }, g);
    const r2 = (v) => Math.round(v * 100) / 100;
    const noter = () => L.missions.noter(fait, { f: s.f, obstacle: s.obstacle, a: s.a, lambda: r2(s.lambda), v: Math.round(s.lambda * s.f) / 1000, ecart: r2(Math.abs(s.c2 - s.c1)), rapport: r2(s.a / s.lambda) });
    const changer = (calcul) => { if (calcul) { s.lambda = lambda(s.f); champ(s); } peindre(s, img, toile); noter(); };
    curseurs(g, s, c, noter); commandes(g, s, c, changer);
    let avant = null;
    const image = (t) => { if (s.defile && avant !== null && t - avant > 66) { s.phase += 2 * Math.PI * 0.4 * ((t - avant) / 1000); peindre(s, img, toile); avant = t; } if (avant === null || !s.defile) avant = t; requestAnimationFrame(image); };
    changer(true); requestAnimationFrame(image);
    return s;
  };
})(window.Labo);

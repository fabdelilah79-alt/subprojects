/*
Rôle : chaîne d'acquisition d'une position : interface posée sur la paillasse (entrée du capteur, câble USB) et ordinateur
       portable avec son logiciel. Touches « Durée » (2, 5 ou 10 s), « Zéro » (la position actuelle devient x = 0),
       « Acquérir » (l'acquisition démarre quand on lâche le mobile ; un point toutes les 10 ms), « Effacer ». Graphique
       x (cm) en fonction de t (s) ; les deux acquisitions précédentes restent affichées en clair, chacune avec sa légende ;
       curseur vertical que l'on fait glisser, qui affiche t et x.
Reçoit : le groupe SVG et { x, y (coin de l'écran), boitier { x, y } (interface), durees, etiquette() (légende de la courbe) } ;
         puis mesurer(t, position brute en m) à chaque pas de calcul et depart() au lâcher.
Produit : Labo.logiciel_xt(g, reglage) -> { mesurer(t, p), depart(), s } (aussi dans Labo.logiciel_xt.actif, pour les tests) ; fait « acquisition » = { duree, etat, n,
          zero (m), courbes [{ etiquette, x0 (cm) }], curseur { t (s), x (cm) } }.
Utilisé par : les simulations des oscillateurs mécaniques (2e année du bac).
*/
(function (L) {
  const P = { dx: 54, dy: 68, l: 356, h: 138 }, COULEURS = ["#1565c0", "#f29d0b", "#d32f2f"], fr = (v, n) => v.toFixed(n).replace(".", ",").replace("-", "−");

  function materiel(g, x, y, b) {
    // Interface (prise du capteur sur la face, câble USB jusqu'au portable) et portable posé sur la paillasse.
    L.svg("path", { d: `M${b.x + 96} ${b.y + 8} C${b.x + 160} ${b.y - 10} ${x + 470} ${y + 330} ${x + 458} ${y + 300}`, fill: "none", stroke: "#2b2b2b", "stroke-width": 3 }, g);
    L.boitier(g, b.x, b.y, 100, 22, 14, { dessus: "#d9dcd8", face: "#3b4248" });
    L.texte(g, b.x + 50, b.y + 13, "INTERFACE", { "font-size": 6.5, "font-weight": 700, fill: "#23315a" });
    L.svg("circle", { cx: b.x + 10, cy: b.y + 28, r: 3, fill: "#111", stroke: "#888" }, g);
    L.ombre_sol(g, x + 220, y + 318, 240, 10, 0.4);
    L.svg("path", { d: `M${x - 10} ${y + 270} h460 l30 44 h-520 Z`, fill: "#b9bec3", stroke: "#6c737a" }, g);
    for (let r = 0; r < 4; r++) L.svg("rect", { x: x + 10 - r * 6, y: y + 276 + r * 9, width: 420 + r * 12, height: 6, rx: 1, fill: "#40464c", opacity: 0.7 }, g);
    L.svg("rect", { x, y, width: 440, height: 268, rx: 8, fill: "#1b1e21", stroke: "#000" }, g);
    L.svg("rect", { x: x + 10, y: y + 10, width: 420, height: 246, fill: "#fbfbf8" }, g);
  }

  function touches(g, x, y, a) {
    // Touches du logiciel (petits boutons gris).
    [["Durée", a.duree], ["Zéro", a.zero], ["Acquérir", a.acquerir], ["Effacer", a.effacer]].forEach(([t, f], k) => {
      const b = L.svg("g", { class: `xt-${k}`, role: "button", "aria-label": t }, g);
      L.svg("rect", { x: x + 16 + k * 66, y: y + 14, width: 60, height: 17, rx: 3, fill: "#e4e8ec", stroke: "#8a96a0" }, b);
      L.texte(b, x + 46 + k * 66, y + 26, t, { "font-size": 8, "font-weight": 700, fill: "#23315a" });
      L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: f });
    });
  }

  function graphique(g, s, x, y) {
    // Quadrillage, graduations, courbes (la dernière en rouge), légendes, curseur et sa lecture.
    const x0 = x + P.dx, y0 = y + P.dy, xs = s.courbes.flatMap((c) => c.pts.map((p) => Math.abs(p[1]))), m = Math.max(2, 2 * Math.ceil(Math.max(0, ...xs) / 2));
    const X = (t) => x0 + (t / s.duree) * P.l, Y = (v) => y0 + P.h / 2 - (v / m) * (P.h / 2);
    for (let k = 0; k <= 10; k++) { L.svg("line", { x1: X((k * s.duree) / 10), y1: y0, x2: X((k * s.duree) / 10), y2: y0 + P.h, stroke: "#e2e2dc", "stroke-width": 0.6 }, g); if (k % 2 === 0) L.texte(g, X((k * s.duree) / 10), y0 + P.h + 11, fr((k * s.duree) / 10, 1), { "font-size": 6.5, fill: "#333" }); }
    for (const v of [-m, -m / 2, 0, m / 2, m]) { L.svg("line", { x1: x0, y1: Y(v), x2: x0 + P.l, y2: Y(v), stroke: v ? "#e2e2dc" : "#999", "stroke-width": 0.6 }, g); L.texte(g, x0 - 6, Y(v) + 2.5, fr(v, 1), { "font-size": 6.5, fill: "#333", "text-anchor": "end" }); }
    L.texte(g, x0 - 6, y0 - 6, "x (cm)", { "font-size": 7, "font-weight": 700, fill: "#333", "text-anchor": "start" });
    L.texte(g, x0 + P.l, y0 + P.h + 22, "t (s)", { "font-size": 7, "font-weight": 700, fill: "#333", "text-anchor": "end" });
    s.courbes.forEach((c, n) => {
      const col = COULEURS[n + 3 - s.courbes.length], d = c.pts.map((p, k) => `${k ? "L" : "M"}${X(p[0]).toFixed(1)} ${Y(p[1]).toFixed(1)}`).join(" ");
      if (c.pts.length) L.svg("path", { d, fill: "none", stroke: col, "stroke-width": n === s.courbes.length - 1 ? 1.4 : 0.9, opacity: n === s.courbes.length - 1 ? 1 : 0.6 }, g);
      L.texte(g, x0 + P.l, y + 42 + n * 8, c.etiquette, { "font-size": 6.5, "font-weight": 700, fill: col, "text-anchor": "end" });
    });
    L.svg("line", { x1: X(s.curseur), y1: y0, x2: X(s.curseur), y2: y0 + P.h, stroke: "#2e7d32", "stroke-width": 1 }, g);
  }

  function lecture(s) {
    // Point de la dernière courbe le plus proche du curseur.
    const d = s.courbes[s.courbes.length - 1];
    return d && d.pts.length ? d.pts.reduce((m, q) => (Math.abs(q[0] - s.curseur) < Math.abs(m[0] - s.curseur) ? q : m)) : null;
  }

  L.logiciel_xt = function (g, { x, y, boitier, durees = [2, 5, 10], etiquette = () => "" }) {
    // Matériel, touches, graphique redessiné à chaque changement ; enregistrement des mesures du capteur.
    const s = { duree: durees[1], etat: "prête", courbes: [], curseur: 0, zero: 0, brut: 0, n: 0, t0: 0, dernier: 0 };
    materiel(g, x, y, boitier);
    const gg = L.svg("g", { "pointer-events": "none" }, g);
    const zone = L.svg("rect", { x: x + P.dx, y: y + P.dy, width: P.l, height: P.h, fill: "#000", opacity: 0, class: "curseur-xt", role: "slider", "aria-label": "Curseur" }, g);
    L.glissable(zone, { soulever: false, debut: () => ({ x: x + P.dx + (s.curseur / s.duree) * P.l, y: 0 }), deplacer: (p) => { s.curseur = Math.max(0, Math.min(1, (p.x - x - P.dx) / P.l)) * s.duree; maj(); } });
    const noter = (p) => L.missions.noter("acquisition", { duree: s.duree, etat: s.etat, n: s.n, zero: Math.round(s.zero * 10000) / 10000, courbes: s.courbes.map((c) => ({ etiquette: c.etiquette, x0: c.pts.length ? c.pts[0][1] : null })), curseur: p ? { t: p[0], x: p[1] } : null });
    const maj = () => {
      gg.replaceChildren(); graphique(gg, s, x, y);
      const p = lecture(s);
      L.texte(gg, x + 290, y + 26, `${s.duree} s · ${s.etat}`, { "font-size": 7.5, fill: "#23315a", "text-anchor": "start" });
      L.texte(gg, x + 220, y + 248, p ? `curseur : t = ${fr(p[0], 2)} s ; x = ${fr(p[1], 1)} cm` : "curseur : pas de mesure", { "font-size": 8.5, "font-weight": 700, fill: "#2e7d32" });
      noter(p);
    };
    touches(g, x, y, {
      duree: () => { if (s.etat !== "en cours") s.duree = durees[(durees.indexOf(s.duree) + 1) % durees.length]; maj(); },
      zero: () => { if (s.etat !== "en cours") s.zero = s.brut; maj(); },
      acquerir: () => { if (s.etat !== "en cours") s.etat = "en attente"; maj(); },
      effacer: () => { if (s.etat !== "en cours") { s.courbes = []; s.etat = "prête"; } maj(); },
    });
    const api = { s, mesurer: (t, p) => {
      s.brut = p;
      if (s.etat !== "en cours" || t - s.dernier < 0.01 - 1e-9) return;
      s.dernier = t; s.courbes[s.courbes.length - 1].pts.push([Math.round((t - s.t0) * 1000) / 1000, Math.round((p - s.zero) * 1000) / 10]);
      if (t - s.t0 >= s.duree - 1e-9) { s.etat = "terminée"; s.n++; maj(); }
    }, depart: (t) => {
      if (s.etat !== "en attente") return;
      Object.assign(s, { etat: "en cours", t0: t, dernier: t - 0.01 }); s.courbes.push({ etiquette: etiquette(), pts: [] }); if (s.courbes.length > 3) s.courbes.shift();
    } };
    L.logiciel_xt.actif = api;
    setInterval(() => { if (s.etat === "en cours") maj(); }, 100);
    maj();
    return api;
  };
})(window.Labo);

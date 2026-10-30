/*
Rôle : paillasse « équilibre dynamique » : ordinateur portable avec un logiciel de simulation de A + B ⇌ C + D
       (modele_equilibre.js) : boîte où s'agitent les particules A (rouges), B (bleues), C (vertes) et D (orange) ; touches
       « 30 A + 30 B » et « 30 C + 30 D » (essai de 60 s à 300 K) ; compteurs (nombre de chaque particule ; chocs efficaces
       par seconde dans le sens direct et dans le sens inverse, sur les 10 dernières secondes) ; courbe du nombre de C au
       cours du temps pour les deux derniers essais et l'essai en cours.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_equilibre(g) -> { pense_bete } ; fait « essais_equilibre » = [{ depart, C_fin (moyenne des 30 dernières
          secondes), direct_s, inverse_s (chocs efficaces par seconde, 30 dernières secondes) }] (essais terminés).
Utilisé par : simulation.js.
*/
(function (L) {
  const DUREE = 60, COULEURS = { A: "#d32f2f", B: "#1565c0", C: "#2e7d32", D: "#ef8f00" }, TRACE = ["#9e9e9e", "#6a1b9a"];
  const fr = (v, n = 1) => v.toFixed(n).replace(".", ","), DEPARTS = { AB: "30 A + 30 B", CD: "30 C + 30 D" };

  function touche(g, x, y, l, texte, classe, f) {
    // Petite touche grise du logiciel.
    const b = L.svg("g", { class: classe, role: "button", "aria-label": texte }, g);
    L.svg("rect", { x, y, width: l, height: 18, rx: 3, fill: "#e4e8ec", stroke: "#8a96a0" }, b);
    L.texte(b, x + l / 2, y + 12, texte, { "font-size": 8.5, "font-weight": 700, fill: "#23315a" });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: f });
  }

  function courbes(g, d, essais, s) {
    // Nombre de C en fonction du temps (0 à 60 s) : deux derniers essais et essai en cours.
    const x0 = d.x + 36, y0 = d.y + 352, l = 300, h = 80, X = (t) => x0 + (t / DUREE) * l, Y = (n) => y0 - (n / 30) * h;
    L.svg("rect", { x: x0, y: y0 - h, width: l, height: h, fill: "#fff", stroke: "#c9ced2" }, g);
    for (const n of [0, 10, 20, 30]) { L.svg("line", { x1: x0, y1: Y(n), x2: x0 + l, y2: Y(n), stroke: "#eceee8" }, g); L.texte(g, x0 - 5, Y(n) + 3, String(n), { "font-size": 6.5, fill: "#333", "text-anchor": "end" }); }
    for (const t of [0, 20, 40, 60]) L.texte(g, X(t), y0 + 10, String(t), { "font-size": 6.5, fill: "#333" });
    L.texte(g, x0, y0 - h - 5, "nombre de C", { "font-size": 7, "font-weight": 700, fill: "#333", "text-anchor": "start" });
    L.texte(g, x0 + l, y0 + 20, "t (s)", { "font-size": 7, "font-weight": 700, fill: "#333", "text-anchor": "end" });
    const liste = [...essais.slice(-2).map((e, k) => ({ ...e, col: TRACE[k] })), ...(s && s.en_cours ? [{ depart: s.depart, points: s.points, col: COULEURS.C }] : [])];
    liste.forEach((e, k) => {
      if (e.points.length > 1) L.svg("path", { d: e.points.map(([t, n], i) => `${i ? "L" : "M"}${X(t).toFixed(1)} ${Y(n).toFixed(1)}`).join(" "), fill: "none", stroke: e.col, "stroke-width": 1.6 }, g);
      L.texte(g, x0 + l + 8, y0 - h + 8 + k * 11, `départ ${DEPARTS[e.depart]}`, { "font-size": 7, "font-weight": 700, fill: e.col, "text-anchor": "start" });
    });
  }

  function panneau(g, d, s) {
    // Compteurs : temps, nombre de chaque particule, chocs efficaces par seconde dans chaque sens.
    const x = d.x + 362, ligne = (y, t, o = {}) => L.texte(g, x, y, t, { "font-size": 9, fill: "#23315a", "text-anchor": "start", ...o });
    ligne(d.y + 74, s ? `Temps : ${fr(Math.min(s.m.t, DUREE))} s ${s.en_cours ? "" : "(terminé)"}` : "Temps : —", { "font-weight": 700 });
    const n = s ? s.m.compte() : { A: 0, B: 0, C: 0, D: 0 };
    ["A", "B", "C", "D"].forEach((k, i) => ligne(d.y + 96 + i * 16, `Particules ${k} : ${n[k]}`, { "font-weight": 700, fill: COULEURS[k] }));
    const f = s && s.fenetre.length > 1 ? s.fenetre : null, dt = f ? f[f.length - 1][0] - f[0][0] : 0;
    ligne(d.y + 172, "Chocs efficaces par seconde (10 dernières secondes) :", { "font-size": 8 });
    ligne(d.y + 190, `sens direct  A + B → C + D : ${f && dt > 0.5 ? fr((f[f.length - 1][1] - f[0][1]) / dt, 2) : "—"}`);
    ligne(d.y + 206, `sens inverse  C + D → A + B : ${f && dt > 0.5 ? fr((f[f.length - 1][2] - f[0][2]) / dt, 2) : "—"}`);
  }

  function boite(g, B, W, H, s) {
    // Boîte (vue microscopique) et particules colorées.
    g.replaceChildren();
    L.svg("rect", { x: B.x, y: B.y, width: W, height: H, fill: "#fbfcfd", stroke: "#23315a", "stroke-width": 1.2 }, g);
    if (!s) return L.texte(g, B.x + W / 2, B.y + H / 2, "Choisissez un départ.", { "font-size": 9, fill: "#666" });
    for (const p of s.m.particules) L.svg("circle", { cx: B.x + p.x, cy: B.y + p.y, r: L.equilibre_chocs.R, fill: COULEURS[p.type], stroke: "#222", "stroke-width": 0.5 }, g);
  }

  function fin(s, essais) {
    // Essai terminé : moyennes des 30 dernières secondes, notées.
    const q = s.histo.filter(([t]) => t >= DUREE - 30), a = q[0], b = q[q.length - 1];
    essais.push({ depart: s.depart, C_fin: Math.round((10 * q.reduce((t, p) => t + p[3], 0)) / q.length) / 10, direct_s: Math.round((100 * (b[1] - a[1])) / (b[0] - a[0])) / 100, inverse_s: Math.round((100 * (b[2] - a[2])) / (b[0] - a[0])) / 100, points: s.points.filter((p, k) => k % 6 === 0) });
    L.missions.noter("essais_equilibre", essais.map(({ points, ...e }) => e));
  }

  L.poste_equilibre = function (g) {
    // Portable, logiciel ; une image avance la simulation (temps réel) et redessine ; l'essai s'arrête à 60 s.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), d = L.portable(g, { x: 290, y: 40, l: 710, h: 420, titre: "Simulation : A + B ⇌ C + D (300 K)" });
    const essais = [], W = 330, H = 230, B = { x: d.x + 12, y: d.y + 24 }, gb = L.svg("g", {}, g), gp = L.svg("g", {}, g);
    let s = null, avant = performance.now();
    const lancer = (depart) => () => { s = { m: L.equilibre_chocs.creer({ depart, W, H }), depart, points: [[0, depart === "AB" ? 0 : 30]], histo: [], fenetre: [], en_cours: true }; };
    touche(g, d.x + 362, d.y + 30, 96, "30 A + 30 B", "equilibre-ab", lancer("AB")); touche(g, d.x + 466, d.y + 30, 96, "30 C + 30 D", "equilibre-cd", lancer("CD"));
    const image = (t) => {
      const dt = Math.min(0.05, (t - avant) / 1000); avant = t;
      if (s && s.en_cours) {
        L.equilibre_chocs.pas(s.m, dt);
        const ligne = [s.m.t, s.m.direct, s.m.inverse, s.m.compte().C];
        s.points.push([s.m.t, ligne[3]]); s.histo.push(ligne); s.fenetre.push(ligne);
        while (s.fenetre[0][0] < s.m.t - 10) s.fenetre.shift();
        if (s.m.t >= DUREE) { s.en_cours = false; fin(s, essais); }
      }
      boite(gb, B, W, H, s); gp.replaceChildren(); panneau(gp, d, s); courbes(gp, d, essais, s);
      requestAnimationFrame(image);
    };
    L.missions.noter("essais_equilibre", []); requestAnimationFrame(image);
    return { pense_bete };
  };
})(window.Labo);

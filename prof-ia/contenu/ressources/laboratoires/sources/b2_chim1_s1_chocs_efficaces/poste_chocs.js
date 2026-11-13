/*
Rôle : paillasse « interprétation microscopique » : ordinateur portable avec un logiciel de simulation de la réaction
       A + B → C (modele_chocs.js) : boîte où les particules A (rouges) et B (bleues) s'agitent, réglages du nombre de
       particules A et B (15, 30 ou 60) et de la température (250 à 400 K), touche « Lancer » (essai de 20 s) ; compteurs :
       chocs A–B et chocs efficaces par seconde pendant les 2 premières secondes, particules C formées, part des chocs
       efficaces sur tout l'essai ; courbe du nombre de
       C au cours du temps pour les trois derniers essais.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_chocs(g) -> { pense_bete } ; faits « reglage_chocs » = { nA, nB, T } et « essais_chocs » = [{ nA, nB, T,
          chocs_s, efficaces_s, C20, part (%) }] (essais terminés).
Utilisé par : simulation.js.
*/
(function (L) {
  const NOMBRES = [15, 30, 60], TEMP = [250, 300, 350, 400], DUREE = 20, DEBUT = 2, COULEURS = { A: "#d32f2f", B: "#1565c0", C: "#2e7d32" }, TRACE = ["#9e9e9e", "#f29d0b", "#6a1b9a"];
  const fr = (v, n = 1) => v.toFixed(n).replace(".", ",");

  function touche(g, x, y, l, texte, classe, f) {
    // Petite touche grise du logiciel.
    const b = L.svg("g", { class: classe, role: "button", "aria-label": texte }, g);
    L.svg("rect", { x, y, width: l, height: 16, rx: 3, fill: "#e4e8ec", stroke: "#8a96a0" }, b);
    L.texte(b, x + l / 2, y + 11, texte, { "font-size": 8, "font-weight": 700, fill: "#23315a" });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: f });
  }

  function courbes(g, d, essais, s) {
    // Nombre de particules C en fonction du temps (0 à 20 s) pour les trois derniers essais et l'essai en cours.
    const x0 = d.x + 36, y0 = d.y + 352, l = 300, h = 80, X = (t) => x0 + (t / DUREE) * l, Y = (n) => y0 - (n / 60) * h;
    L.svg("rect", { x: x0, y: y0 - h, width: l, height: h, fill: "#fff", stroke: "#c9ced2" }, g);
    for (const n of [0, 20, 40, 60]) { L.svg("line", { x1: x0, y1: Y(n), x2: x0 + l, y2: Y(n), stroke: "#eceee8" }, g); L.texte(g, x0 - 5, Y(n) + 3, String(n), { "font-size": 6.5, fill: "#333", "text-anchor": "end" }); }
    for (const t of [0, 5, 10, 15, 20]) L.texte(g, X(t), y0 + 10, String(t), { "font-size": 6.5, fill: "#333" });
    L.texte(g, x0, y0 - h - 5, "C formés", { "font-size": 7, "font-weight": 700, fill: "#333", "text-anchor": "start" });
    L.texte(g, x0 + l, y0 + 20, "t (s)", { "font-size": 7, "font-weight": 700, fill: "#333", "text-anchor": "end" });
    const liste = [...essais.slice(-3).map((e, k) => ({ ...e, col: TRACE[k] })), ...(s && s.en_cours ? [{ ...s.essai, points: s.points, col: "#2e7d32" }] : [])];
    liste.forEach((e, k) => {
      if (e.points.length > 1) L.svg("path", { d: e.points.map(([t, n], i) => `${i ? "L" : "M"}${X(t).toFixed(1)} ${Y(n).toFixed(1)}`).join(" "), fill: "none", stroke: e.col, "stroke-width": 1.6 }, g);
      L.texte(g, x0 + l + 8, y0 - h + 8 + k * 11, `${e.nA} A, ${e.nB} B, ${e.T} K`, { "font-size": 7, "font-weight": 700, fill: e.col, "text-anchor": "start" });
    });
  }

  function panneau(g, d, r, s) {
    // Réglages et compteurs.
    const x = d.x + 362, ligne = (y, t, o = {}) => L.texte(g, x, y, t, { "font-size": 9, fill: "#23315a", "text-anchor": "start", ...o });
    ligne(d.y + 34, `Particules A : ${r.nA}`); ligne(d.y + 58, `Particules B : ${r.nB}`); ligne(d.y + 82, `Température : ${r.T} K`);
    ligne(d.y + 122, s ? `Temps : ${fr(Math.min(s.m.t, DUREE))} s ${s.en_cours ? "" : "(terminé)"}` : "Temps : —", { "font-weight": 700 });
    const c5 = s ? s.c5 : null;
    ligne(d.y + 142, `Chocs A–B par seconde : ${c5 ? fr(c5.chocs / Math.min(DEBUT, s.m.t || 1)) : "—"}`);
    ligne(d.y + 158, `Chocs efficaces par seconde : ${c5 ? fr(c5.efficaces / Math.min(DEBUT, s.m.t || 1), 2) : "—"}`);
    ligne(d.y + 172, "(pendant les 2 premières secondes)", { "font-size": 7, fill: "#555" });
    ligne(d.y + 192, `Particules C formées : ${s ? s.m.C : 0}`, { "font-weight": 700, fill: COULEURS.C });
    ligne(d.y + 212, `Part des chocs A–B efficaces : ${s && s.m.chocs ? fr((100 * s.m.efficaces) / s.m.chocs) : "—"} %`, { "font-weight": 700 });
  }

  L.poste_chocs = function (g) {
    // Portable, logiciel ; une image redessine la boîte, le panneau et les courbes ; l'essai s'arrête après 20 s.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), d = L.portable(g, { x: 290, y: 40, l: 710, h: 420, titre: "Simulation : chocs entre particules (A + B → C)" });
    const r = { nA: 30, nB: 30, T: 300 }, essais = [], W = 330, H = 230, B = { x: d.x + 12, y: d.y + 24 };
    const gb = L.svg("g", {}, g), gp = L.svg("g", {}, g); let s = null;
    const suivant = (liste, v, sens) => liste[Math.max(0, Math.min(liste.length - 1, liste.indexOf(v) + sens))];
    const regler = (cle, liste, sens) => { r[cle] = suivant(liste, r[cle], sens); L.missions.noter("reglage_chocs", { ...r }); };
    [["nA", NOMBRES, 26], ["nB", NOMBRES, 50], ["T", TEMP, 74]].forEach(([cle, liste, dy]) => {
      touche(g, d.x + 560, d.y + dy, 22, "−", `chocs-${cle}-moins`, () => regler(cle, liste, -1)); touche(g, d.x + 586, d.y + dy, 22, "+", `chocs-${cle}-plus`, () => regler(cle, liste, 1));
    });
    touche(g, d.x + 362, d.y + 94, 70, "Lancer", "chocs-lancer", () => { s = { m: L.chocs.creer({ ...r, W, H }), essai: { ...r }, points: [[0, 0]], en_cours: true, c5: { chocs: 0, efficaces: 0 } }; });
    let avant = performance.now();
    const image = (t) => {
      // Avance la simulation (temps réel), note l'essai terminé, redessine.
      const dt = Math.min(0.05, (t - avant) / 1000); avant = t;
      if (s && s.en_cours) {
        L.chocs.pas(s.m, dt);
        if (s.m.t <= DEBUT) s.c5 = { chocs: s.m.chocs, efficaces: s.m.efficaces };
        s.points.push([s.m.t, s.m.C]);
        if (s.m.t >= DUREE) {
          s.en_cours = false;
          essais.push({ ...s.essai, chocs_s: Math.round((s.c5.chocs / DEBUT) * 10) / 10, efficaces_s: Math.round((s.c5.efficaces / DEBUT) * 100) / 100, C20: s.m.C, part: Math.round((1000 * s.m.efficaces) / Math.max(1, s.m.chocs)) / 10, points: s.points.filter((p, k) => k % 6 === 0) });
          L.missions.noter("essais_chocs", essais.map(({ points, ...e }) => e));
        }
      }
      dessiner_boite(gb, B, W, H, s); gp.replaceChildren(); panneau(gp, d, r, s); courbes(gp, d, essais, s);
      requestAnimationFrame(image);
    };
    L.missions.noter("reglage_chocs", { ...r }); L.missions.noter("essais_chocs", []); requestAnimationFrame(image);
    return { pense_bete };
  };

  function dessiner_boite(g, B, W, H, s) {
    // Boîte (vue microscopique) et particules : A rouges, B bleues, C vertes (plus grosses).
    g.replaceChildren();
    L.svg("rect", { x: B.x, y: B.y, width: W, height: H, fill: "#fbfcfd", stroke: "#23315a", "stroke-width": 1.2 }, g);
    if (!s) return L.texte(g, B.x + W / 2, B.y + H / 2, "Réglez, puis touchez « Lancer ».", { "font-size": 9, fill: "#666" });
    for (const p of s.m.particules) L.svg("circle", { cx: B.x + p.x, cy: B.y + p.y, r: p.r, fill: COULEURS[p.type], stroke: "#222", "stroke-width": 0.5 }, g);
  }
})(window.Labo);

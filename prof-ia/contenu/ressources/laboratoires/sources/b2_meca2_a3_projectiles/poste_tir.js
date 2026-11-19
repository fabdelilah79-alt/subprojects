/*
Rôle : paillasse « mouvement d'un projectile » : lance-projectile à ressort (angle α = 30°, 45° ou 60° ; ressort à 3 crans :
       v0 = 2,5, 3,0 ou 3,5 m/s), deux projectiles denses (bille d'acier 33 g, balle de bois 8 g : action de l'air
       négligeable), tableau quadrillé (carreaux de 10 cm, graduations en cm) debout derrière la trajectoire, bac à sable à
       la hauteur de la bouche du lanceur, caméra (25 images/s) reliée au portable de pointage vidéo.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_tir(g) -> { pense_bete } ; faits « tir » = { alpha, v0, projectile }, « essais_tir » = [{ id, projectile,
          alpha, v0, fleche (m), portee (m) }], « pointage ».
Utilisé par : simulation.js.
*/
(function (L) {
  const G = 9.81, FPS = 25, PX = 250, O = { x: 110, y: 430 }, ANGLES = [30, 45, 60], V0 = [2.5, 3, 3.5];
  const PROJ = { acier: { nom: "bille d'acier", masse_g: 33, teinte: "url(#acier)" }, bois: { nom: "balle de bois", masse_g: 8, teinte: "#c58b4e" } };
  const rad = (d) => (d * Math.PI) / 180, e = (x, y) => ({ x: O.x + x * PX, y: O.y - y * PX });
  const pos = (t, a, v) => ({ x: v * Math.cos(rad(a)) * t, y: v * Math.sin(rad(a)) * t - 0.5 * G * t * t });

  function decor(g) {
    // Tableau quadrillé debout derrière la trajectoire (pieds sur la paillasse), bac à sable surélevé, caméra et câble USB.
    const b = { x: O.x - 26, y: O.y - 0.72 * PX, l: 1.62 * PX, h: 0.8 * PX };
    L.ombre_sol(g, b.x + b.l / 2, O.y + 36, b.l / 2, 6, 0.3);
    L.svg("rect", { x: b.x, y: b.y, width: b.l, height: b.h, fill: "#f7f7f2", stroke: "#8a8a80", filter: "url(#ombre)" }, g);
    for (let k = 0; k <= 15; k++) { const x = O.x + (k / 10) * PX; L.svg("line", { x1: x, y1: b.y, x2: x, y2: b.y + b.h, stroke: "#9fb3c8", "stroke-width": k % 5 ? 0.4 : 0.9 }, g); if (k % 2 === 0 || k === 15) L.texte(g, x, b.y + 10, String(k * 10), { "font-size": 6.5, fill: "#2a2a28" }); }
    L.texte(g, b.x + b.l - 6, b.y + 20, "cm", { "font-size": 6.5, fill: "#2a2a28", "text-anchor": "end" });
    for (let k = -1; k <= 7; k++) { const y = O.y - (k / 10) * PX; if (y >= b.y && y <= b.y + b.h) L.svg("line", { x1: b.x, y1: y, x2: b.x + b.l, y2: y, stroke: "#9fb3c8", "stroke-width": k ? 0.4 : 0.9 }, g); }
    for (const x of [b.x + 20, b.x + b.l - 20]) L.svg("rect", { x: x - 4, y: b.y + b.h, width: 8, height: 36 - (b.y + b.h - O.y), fill: "#555c63" }, g);
    for (const x of [e(0.5, 0).x, e(1.45, 0).x]) L.tige(g, `M${x} ${O.y + 14} V${O.y + 50}`, 4);
    L.svg("path", { d: `M${e(0.45, 0).x} ${O.y + 4} h${1.05 * PX} v12 h${-1.05 * PX} Z`, fill: "url(#bois-face)", stroke: "#6b4a2a" }, g);
    L.svg("rect", { x: e(0.45, 0).x + 2, y: O.y, width: 1.05 * PX - 4, height: 5, fill: "#d9c08a" }, g);
    L.ombre_sol(g, 462, 584, 30, 4, 0.35); for (const dx of [-18, 0, 18]) L.tige(g, `M462 552 L${462 + dx} 584`, 2.5);
    L.svg("rect", { x: 444, y: 528, width: 36, height: 24, rx: 4, fill: "#24282c" }, g); L.svg("circle", { cx: 462, cy: 524, r: 7, fill: "#111", stroke: "#666" }, g);
    L.svg("path", { d: "M480 540 C520 540 520 480 548 470", fill: "none", stroke: "#222", "stroke-width": 2.5 }, g);
  }

  function lanceur(g, a) {
    // Socle sur la paillasse, montant jusqu'au pivot, rapporteur gradué, canon incliné de α dont la bouche est le point O.
    g.replaceChildren();
    const pv = { x: O.x - 36 * Math.cos(rad(a)), y: O.y + 36 * Math.sin(rad(a)) };
    L.ombre_sol(g, O.x - 30, O.y + 46, 40, 5, 0.35);
    L.svg("path", { d: `M${O.x - 70} ${O.y + 38} h80 l6 8 h-92 Z`, fill: "#3b4046", stroke: "#1e2226" }, g);
    L.tige(g, `M${pv.x} ${O.y + 38} V${pv.y}`, 6);
    L.svg("path", { d: `M${pv.x - 22} ${pv.y} A22 22 0 0 1 ${pv.x + 22} ${pv.y} Z`, fill: "#e8e2d0", stroke: "#8a7a5a", opacity: 0.9 }, g);
    for (const d of [30, 45, 60]) L.svg("line", { x1: pv.x + 16 * Math.cos(rad(d)), y1: pv.y - 16 * Math.sin(rad(d)), x2: pv.x + 22 * Math.cos(rad(d)), y2: pv.y - 22 * Math.sin(rad(d)), stroke: "#5a4420", "stroke-width": 0.8 }, g);
    const c = L.svg("g", { transform: `translate(${O.x} ${O.y}) rotate(${-a})` }, g);
    L.svg("rect", { x: -44, y: -7, width: 44, height: 14, rx: 3, fill: "#2f5d8a", stroke: "#173a5c" }, c);
    L.svg("circle", { cx: pv.x, cy: pv.y, r: 3, fill: "#c0c4c8" }, g);
    L.texte(g, O.x - 34, O.y + 58, `α = ${a}°`, { "font-size": 8, "font-weight": 700, fill: "#f4f1e6" });
  }

  function video(id, p, a, v) {
    // Vidéo : tableau quadrillé, lanceur, projectile à la position de l'image k (origine des positions : la bouche).
    const T = (2 * v * Math.sin(rad(a))) / G, n = Math.min(30, Math.floor(T * FPS) + 2), q = (k) => pos(Math.min(k / FPS, T), a, v);
    return { id, fps: FPS, n, largeur_m: 1.7, hauteur_m: 0.85, etalon: { a: { x: 0.1, y: 0.05 }, b: { x: 1.1, y: 0.05 }, longueur_m: 1 }, objet: (k) => ({ x: 0.1 + q(k).x, y: 0.1 + q(k).y }),
      dessiner(gv, k, m) {
        const r = (x1, y1, x2, y2, fill) => { const A = m(x1, y1), B = m(x2, y2); L.svg("rect", { x: A.x, y: B.y, width: B.x - A.x, height: A.y - B.y, fill }, gv); };
        r(0, 0, 1.7, 0.85, "#3a3f44"); r(0.05, 0.02, 1.68, 0.84, "#e9e9e2");
        for (let i = 0; i <= 16; i++) { const A = m(0.1 + i / 10, 0.02), B = m(0.1 + i / 10, 0.84); L.svg("line", { x1: A.x, y1: A.y, x2: B.x, y2: B.y, stroke: "#9fb3c8", "stroke-width": i % 5 ? 0.3 : 0.7 }, gv); if (i % 5 === 0 && i <= 15) L.texte(gv, A.x, A.y - 2, String(i * 10), { "font-size": 5, fill: "#222" }); }
        r(0.02, 0.04, 0.1, 0.1, "#2f5d8a");
        const b = m(0.1 + q(k).x, 0.1 + q(k).y); L.svg("circle", { cx: b.x, cy: b.y, r: 2.4, fill: p === "acier" ? "#8d949a" : "#c58b4e", stroke: "#111", "stroke-width": 0.5 }, gv);
      } };
  }

  L.poste_tir = function (g) {
    // Matériel et réglages ; « Tirer » : le projectile vole, retombe dans le sable ; la vidéo va au logiciel.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    decor(g);
    const canon = L.svg("g", {}, g), vue = L.svg("g", {}, g), logiciel = L.pointage_video(g, { nom: "pointage", x: 540, y: 180 });
    const etat = { alpha: 45, v0: 3, projectile: "acier", t: null, n: 0 }, essais = [];
    const dessiner = () => { lanceur(canon, etat.alpha); vue.replaceChildren(); const T = (2 * etat.v0 * Math.sin(rad(etat.alpha))) / G, q = etat.t === null ? { x: 0, y: 0 } : pos(Math.min(etat.t, T), etat.alpha, etat.v0), p = e(q.x, q.y); L.svg("circle", { cx: p.x, cy: p.y, r: 6, fill: PROJ[etat.projectile].teinte, stroke: "#222", "stroke-width": 0.6 }, vue); };
    const noter = () => L.missions.noter("tir", { alpha: etat.alpha, v0: etat.v0, projectile: etat.projectile });
    L.reglages_tir(g, etat, { angles: ANGLES, vitesses: V0, projectiles: PROJ }, (k) => { if (etat.t !== null && !k.recharger) return; Object.assign(etat, k, { t: null }); delete etat.recharger; noter(); dessiner(); }, () => {
      if (etat.t !== null) return;
      const T = (2 * etat.v0 * Math.sin(rad(etat.alpha))) / G, id = `tir${++etat.n}`, avant = performance.now();
      etat.t = 0;
      const pas = () => { etat.t = (performance.now() - avant) / 1000; dessiner(); if (etat.t < T) return requestAnimationFrame(pas); const s = Math.sin(rad(etat.alpha)); essais.push({ id, projectile: etat.projectile, alpha: etat.alpha, v0: etat.v0, fleche: Math.round(((etat.v0 * s) ** 2 / (2 * G)) * 1000) / 1000, portee: Math.round(((etat.v0 ** 2 * Math.sin(rad(2 * etat.alpha))) / G) * 1000) / 1000 }); L.missions.noter("essais_tir", essais.slice()); logiciel.charger(video(id, etat.projectile, etat.alpha, etat.v0)); };
      requestAnimationFrame(pas);
    });
    noter(); dessiner();
    return { pense_bete };
  };
})(window.Labo);

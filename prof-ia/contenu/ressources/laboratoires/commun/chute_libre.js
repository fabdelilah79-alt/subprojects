/*
Rôle : appareil de chute libre : une bille d'acier (m = 33,0 g, d = 2,00 cm) est tenue par l'électroaimant, son centre à
       z0 = 1,100 m au-dessus de la paillasse ; « Lâcher » coupe le courant : la bille tombe sans vitesse initiale
       (frottements de l'air négligés, g = 9,81 N/kg). Chaque cellule (déplaçable le long de la tige, de 15 à 100 cm, au
       demi-centimètre) mesure la durée Δt pendant laquelle la bille coupe son faisceau : v ≈ d / Δt.
       « Remonter » la replace contre l'électroaimant.
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève (cellules, boutons).
Produit : Labo.chute_libre(g) -> l'état ; fait « chute » = { z1, z2 (m), dt1, dt2 (s), en_chute,
          essais: [{ z1, z2, dt1, dt2 }] }.
Utilisé par : les simulations du chapitre « Le travail, mode de transfert d'énergie » (Epp, conservation de Em).
*/
(function (L) {
  const G = 9.81, R = 0.01, D = L.chute_dessin, Z0 = D.Z0;
  const instant = (z) => Math.sqrt((2 * Math.max(0, Z0 - z)) / G);
  const occultation = (zc) => (instant(zc - R) - instant(zc + R)) * (1 + (Math.random() - 0.5) * 0.002);

  function avancer(e, dt) {
    // La bille tombe ; quand elle a dépassé une cellule, son afficheur montre Δt ; arrêt dans le réceptacle.
    if (!e.en_chute) return;
    e.t += dt;
    e.z = Math.max(0.05, Z0 - 0.5 * G * e.t * e.t);
    for (const k of [1, 2]) if (e[`dt${k}`] === null && e.z < e[`z${k}`] - R) e[`dt${k}`] = occultation(e[`z${k}`]);
    if (e.z <= 0.05) { e.en_chute = false; e.essais.push({ z1: e.z1, z2: e.z2, dt1: e.dt1, dt2: e.dt2 }); }
  }

  function dessiner(c, e) {
    // Cellules (faisceau coupé quand la bille passe), bille, afficheurs.
    c.replaceChildren();
    for (const k of [1, 2]) D.cellule(c, k, e[`z${k}`], Math.abs(e.z - e[`z${k}`]) < R);
    D.bille(c, e.z);
    D.afficheurs(c, e.dt1, e.dt2);
  }

  function gestes(c, e) {
    // Faire glisser une cellule le long de la tige (bille tenue par l'électroaimant) ; elles restent à 10 cm l'une de l'autre.
    let k = 0;
    L.glissable(c, {
      soulever: false,
      debut: (ev) => { const t = ev.target.closest(".cellule-chute"); k = t ? (t.classList.contains("cellule-1") ? 1 : 2) : 0; return k && !e.en_chute ? { x: 0, y: D.y_de(e[`z${k}`]) } : null; },
      deplacer: (p) => {
        const z = Math.max(0.15, Math.min(1.0, Math.round(((D.TABLE - p.y) / (1000 * D.MM)) * 200) / 200)), autre = e[`z${3 - k}`];
        if (Math.abs(z - autre) >= 0.1) e[`z${k}`] = z;
      },
    });
  }

  L.chute_libre = function (g) {
    // Décor, boutons de l'électroaimant, calque animé ; faits notés 4 fois par seconde.
    D.fond(L.svg("g", {}, g));
    const e = { z1: 0.9, z2: 0.4, z: Z0, t: 0, en_chute: false, dt1: null, dt2: null, essais: [] };
    L.bouton_texte(g, 575, 100, "Lâcher", () => { if (!e.en_chute && e.z === Z0) { e.en_chute = true; e.t = 0; e.dt1 = e.dt2 = null; } });
    L.bouton_texte(g, 575, 130, "Remonter", () => { if (!e.en_chute) e.z = Z0; });
    const c = L.svg("g", {}, g);
    D.regle(L.svg("g", { "pointer-events": "none" }, g));
    gestes(c, e);
    let avant = null;
    const image = (t) => { avancer(e, avant === null ? 0 : Math.min(0.02, (t - avant) / 1000)); avant = t; dessiner(c, e); requestAnimationFrame(image); };
    requestAnimationFrame(image);
    const r = (x) => (x === null ? null : Math.round(x * 1e6) / 1e6);
    setInterval(() => L.missions.noter("chute", { z1: e.z1, z2: e.z2, dt1: r(e.dt1), dt2: r(e.dt2), en_chute: e.en_chute, essais: e.essais.map((x) => ({ ...x, dt1: r(x.dt1), dt2: r(x.dt2) })) }), 250);
    return e;
  };
})(window.Labo);

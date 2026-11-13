/*
Rôle : simulateur d'orbites qui tourne sur le portable : état (mode, r0, v0, orbite calculée, temps simulé), animation (un tour
       en 4 s à l'écran ; échappement calculé pas à pas ; chute en spirale de l'électron qui rayonne, montrée en 8 s), faits notés.
       La case à cocher du mode est l'option : rayonnement de l'électron (mode atome) ou aires de Kepler (mode soleil).
Reçoit : le groupe SVG, la dalle { x, y, l, h } du portable et { modes } (les deux onglets ; par défaut « terre » et « atome »).
Produit : Labo.logiciel_orbites(g, dalle, reglage) -> s ; faits « lancers » = [{ mode, r0, v0, issue, circulaire, rmin, rmax, T, E, eV,
          rayonnement, aires, tombe, tf }] et « simulateur » = { mode }.
Utilisé par : poste_astres.js (b2_meca6_a1_astres_atomes), poste_satellites.js (b2_meca2_a4_satellites).
*/
(function (L) {
  const TOUR = 4, SPIRALE = 8;

  function noter(s) {
    // Copie les lancements dans les faits.
    L.missions.noter("lancers", s.lancers.map((l) => ({ ...l })));
  }

  function lancer(s) {
    // Calcule l'orbite et note le lancement.
    const o = L.orbites.orbite(s.mode, s.r0, s.v0), ray = s.mode === "atome" && s.option && o.issue === "orbite";
    Object.assign(s, { o, t: 0, p: { x: s.r0, y: 0 }, trace: [{ x: s.r0, y: 0 }], fini: false, vol: { x: s.r0, y: 0, vx: 0, vy: s.v0 }, spirale: ray ? { f: 0, phi: 0 } : null });
    s.message = ray ? "L'électron rayonne de l'énergie…" : { echappe: "Vitesse trop grande : le mobile s'échappe.", chute: "Le satellite va retomber sur la Terre.", orbite: o.circulaire ? "Orbite circulaire." : "Orbite elliptique." }[o.issue];
    const r = (v) => (v === undefined ? null : Number(v.toPrecision(5)));
    s.lancers.push({ mode: s.mode, r0: r(s.r0), v0: r(s.v0), issue: o.issue, circulaire: !!o.circulaire, rmin: r(o.rmin), rmax: r(o.rmax), T: r(o.T), E: r(o.E), eV: r(o.eV), rayonnement: ray, aires: s.mode === "soleil" && s.option, tombe: false, tf: ray ? r(o.tf) : null });
    noter(s);
  }

  function spirale(s, dt) {
    // L'électron perd de l'énergie : r = r0·(1 − t/tf)^(1/3) ; il tombe sur le proton au bout de tf.
    const sp = s.spirale, a0 = s.o.a;
    sp.f = Math.min(1, sp.f + dt / SPIRALE);
    const r = a0 * Math.cbrt(1 - sp.f);
    sp.phi += dt * 2 * Math.PI * Math.min(3, 0.5 * (a0 / Math.max(r, 1e-13)) ** 1.5);
    s.p = { x: r * Math.cos(sp.phi), y: r * Math.sin(sp.phi) }; s.t = sp.f * s.o.tf;
    s.trace.push(s.p); if (s.trace.length > 500) s.trace.shift();
    if (sp.f >= 1 && !s.fini) {
      s.fini = true; s.message = `Chute sur le proton en ${L.nombre_court(s.o.tf, 2)} s (≈ ${L.nombre_court(2 * s.o.tf / s.o.T, 1)} tours, non tous dessinés).`;
      s.lancers[s.lancers.length - 1].tombe = true; noter(s);
    }
  }

  function echappement(s, dt) {
    // Trajectoire ouverte calculée pas à pas (méthode d'Euler-Cromer), arrêtée quand le mobile sort de la fenêtre.
    const mu = L.orbites.MODES[s.mode].mu, v = s.vol, h = (dt * 3 * s.r0) / s.v0 / 200;
    for (let k = 0; k < 200; k++) { const r3 = Math.hypot(v.x, v.y) ** 3; v.vx -= (mu * v.x / r3) * h; v.vy -= (mu * v.y / r3) * h; v.x += v.vx * h; v.y += v.vy * h; s.t += h; }
    s.p = { x: v.x, y: v.y }; s.trace.push(s.p);
    if (Math.hypot(v.x, v.y) > 2.6 * s.r0) s.fini = true;
  }

  function avancer(s, dt) {
    // Un pas d'animation selon l'issue du lancement.
    if (!s.o || s.fini) return;
    if (s.spirale) return spirale(s, dt);
    if (s.o.issue === "echappe") return echappement(s, dt);
    s.t += (dt * s.o.T) / TOUR; s.p = L.orbites.position(s.o, s.t); s.trace.push(s.p);
    if (s.trace.length > 160) s.trace.shift();
    if (s.o.issue === "chute" && Math.hypot(s.p.x, s.p.y) <= L.orbites.MODES.terre.R) { s.fini = true; s.message = "Le satellite s'est écrasé sur la Terre."; }
  }

  L.logiciel_orbites = function (g, d, { modes = ["terre", "atome"] } = {}) {
    // Panneau à gauche, fenêtre à droite ; boucle d'animation.
    const M0 = L.orbites.MODES[modes[0]], s = { modes, mode: modes[0], r0: M0.r0, v0: M0.v0, o: null, t: 0, p: null, trace: [], message: "", option: false, lancers: [] };
    const fenetre = L.svg("g", { "pointer-events": "none" }, g), dessiner = L.orbites_ecran(fenetre, { x: d.x + 212, y: d.y + 18, l: d.l - 216, h: d.h - 22 });
    const effacer = () => Object.assign(s, { o: null, t: 0, p: null, trace: [], message: "", spirale: null, fini: false });
    const arrondi = (cle, v) => { const M = L.orbites.MODES[s.mode], pas = M[cle === "r0" ? "pas_r" : "pas_v"], b = cle === "r0" ? [M.rmin, M.rmax] : [M.vmin, M.vmax]; return Math.min(b[1], Math.max(b[0], Math.round(v / pas) * pas)); };
    const maj = L.orbites_panneau(g, d, s, {
      mode: (m) => { if (m === s.mode) return; const M = L.orbites.MODES[m]; Object.assign(s, { mode: m, r0: M.r0, v0: M.v0, option: false }); effacer(); L.missions.noter("simulateur", { mode: m }); maj(); },
      regler: (cle, v) => { s[cle] = arrondi(cle, v); effacer(); maj(); },
      lancer: () => { lancer(s); maj(); }, effacer: () => { effacer(); maj(); },
      option: () => { if (L.orbites.MODES[s.mode].option) { s.option = !s.option; effacer(); maj(); } },
    });
    let avant = null;
    const image = (instant) => { const dt = avant === null ? 0 : Math.min(0.05, (instant - avant) / 1000); avant = instant; avancer(s, dt); dessiner(s); if (s.o) maj(); requestAnimationFrame(image); };
    L.missions.noter("lancers", []); L.missions.noter("simulateur", { mode: s.mode });
    maj(); requestAnimationFrame(image);
    L.logiciel_orbites.actif = s;
    return s;
  };
})(window.Labo);

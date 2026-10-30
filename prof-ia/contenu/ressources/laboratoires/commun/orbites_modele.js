/*
Rôle : calculs du simulateur d'orbites (mécanique de Newton) : un satellite de 1 000 kg lancé autour de la Terre, une planète
       (masse de la Terre) autour du Soleil, ou un électron lancé autour d'un proton ; force centrale en 1/r² (μ = G·M pour la
       Terre et le Soleil, μ = k·e²/m pour l'électron). Lancement à la
       distance r0, vitesse v0 perpendiculaire au rayon : orbite elliptique exacte (lois de Kepler), échappement si v0² ≥ 2μ/r0,
       chute si le périgée est sous la surface de la Terre. Option « rayonnement » (électron) : selon l'électromagnétisme
       classique, l'électron qui tourne rayonne et tombe sur le proton en t = r0³ / (4·re²·c) (≈ 1,6 × 10⁻¹¹ s pour 53 pm).
Reçoit : le mode (« terre », « soleil » ou « atome »), r0 (m), v0 (m/s), le temps (s).
Produit : Labo.orbites = { MODES (onglet, case à cocher, unités, bornes des réglages de chaque mode), OMEGA_TERRE (rad/s), orbite(mode, r0, v0) -> { issue, a, e, rmin, rmax, T, E (J), eV, circulaire, tf },
          position(o, t) -> { x, y } (m, origine au centre attracteur ; lancement en (r0, 0) vers +y) }.
Utilisé par : logiciel_orbites.js, orbites_ecran.js, orbites_panneau.js.
*/
(function (L) {
  const G = 6.674e-11, K = 8.988e9, E_CH = 1.602e-19, ME = 9.109e-31, RE = 2.818e-15, C = 2.998e8;
  const MODES = {
    terre: { onglet: "Terre – satellite", option: null, mu: G * 5.972e24, R: 6.371e6, m: 1000, ur: 1e3, nom_r: "km", rmin: 6.6e6, rmax: 4.5e7, pas_r: 1e5, vmin: 1000, vmax: 11000, pas_v: 10, r0: 7e6, v0: 7000 },
    soleil: { onglet: "Soleil – planète", option: "Aires balayées en des durées égales (T/10)", mu: G * 1.989e30, R: 6.96e8, m: 5.972e24, ur: 1.496e11, nom_r: "UA", rmin: 4.5e10, rmax: 9e11, pas_r: 1.496e9, vmin: 5e3, vmax: 6e4, pas_v: 100, r0: 1.496e11, v0: 25000 },
    atome: { onglet: "Proton – électron", option: "Rayonnement de l'électron (électromagnétisme)", mu: (K * E_CH * E_CH) / ME, R: 0, m: ME, ur: 1e-12, nom_r: "pm", rmin: 2e-11, rmax: 2e-10, pas_r: 1e-12, vmin: 5e5, vmax: 5e6, pas_v: 1e3, r0: 5.3e-11, v0: 2e6 },
  };

  function orbite(mode, r0, v0) {
    // Éléments de l'orbite : demi-grand axe, excentricité, distances extrêmes, période, énergie mécanique.
    const M = MODES[mode], mu = M.mu, E = M.m * (v0 * v0 / 2 - mu / r0), o = { mode, r0, v0, E, eV: E / E_CH };
    if (v0 * v0 >= (2 * mu) / r0) return Object.assign(o, { issue: "echappe" });
    o.a = 1 / (2 / r0 - (v0 * v0) / mu);
    o.e = Math.abs((r0 * v0 * v0) / mu - 1);
    o.rmin = o.a * (1 - o.e); o.rmax = o.a * (1 + o.e);
    o.T = 2 * Math.PI * Math.sqrt(o.a ** 3 / mu);
    o.apogee = v0 * v0 < mu / r0;
    o.circulaire = (o.rmax - o.rmin) / (o.rmax + o.rmin) < 0.01;
    o.issue = o.rmin < M.R ? "chute" : "orbite";
    o.tf = mode === "atome" ? r0 ** 3 / (4 * RE * RE * C) : null;
    return o;
  }

  function anomalie(Mo, e) {
    // Résout l'équation de Kepler E − e·sin E = M (méthode de Newton).
    let E = e < 0.8 ? Mo : Math.PI;
    for (let k = 0; k < 30; k++) E -= (E - e * Math.sin(E) - Mo) / (1 - e * Math.cos(E));
    return E;
  }

  function position(o, t) {
    // Position sur l'ellipse à l'instant t ; si r0 est l'apogée, on part de l'apogée.
    const Mo = (2 * Math.PI * t) / o.T + (o.apogee ? Math.PI : 0), E = anomalie(Mo % (2 * Math.PI), o.e);
    const x = o.a * (Math.cos(E) - o.e), y = o.a * Math.sqrt(1 - o.e * o.e) * Math.sin(E);
    return o.apogee ? { x: -x, y: -y } : { x, y };
  }

  L.orbites = { MODES, orbite, position, E_CH, OMEGA_TERRE: (2 * Math.PI) / 86164 };
})(window.Labo);

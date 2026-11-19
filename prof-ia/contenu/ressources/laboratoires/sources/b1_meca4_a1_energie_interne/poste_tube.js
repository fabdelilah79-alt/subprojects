/*
Rôle : paillasse du tube à grenaille : on fait tourner le tube autour de son axe (glisser autour de l'axe, ou un toucher
       pour un demi-tour) ; à chaque retournement, la grenaille glisse puis tombe à l'autre bout (accélération g·cos φ le
       long du tube). À chaque choc, l'énergie mécanique perdue m·g·h (h = 1,00 m × cos φ) devient énergie interne du plomb :
       ΔT = g·h / c. Le plomb se refroidit très lentement vers 20,0 °C (constante de temps 15 min).
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève.
Produit : Labo.poste_tube(g) -> { pense_bete } ; fait « tube » = { n, T (°C), mesures: { n: T } }.
Utilisé par : simulation.js (paillasse 1).
*/
(function (L) {
  const D = L.tube_dessin, G = 9.81, C = 129, PX = 400, AMBIANTE = 20, TAU = 900;

  function avancer(e, dt) {
    // Glissement de la grenaille, choc au bout (échauffement), refroidissement lent, demi-tour automatique après un toucher.
    if (e.demi_tour) { const d = Math.min(dt * 2 * Math.PI, e.demi_tour); e.phi += d; e.demi_tour -= d; }
    const cos = Math.cos(e.phi);
    e.vs += G * PX * cos * dt;
    e.s += e.vs * dt;
    const bout = e.s >= D.BUTEE ? 1 : e.s <= -D.BUTEE ? -1 : 0;
    if (bout) {
      e.s = bout * D.BUTEE;
      if (bout !== e.repos && Math.abs(e.vs) > 50) { e.n++; e.T += (G * Math.abs(cos)) / C; e.mesures[e.n] = Math.round(e.T * 10) / 10; }
      if (bout * e.vs > 0) e.vs = 0;
      e.repos = bout;
    }
    e.T -= ((e.T - AMBIANTE) * dt) / TAU;
  }

  function gestes(c, e) {
    // Glisser : le tube suit l'angle du pointeur autour de l'axe ; toucher : un demi-tour.
    let a0 = 0, phi0 = 0;
    const angle = (p) => Math.atan2(p.y - D.P.y, p.x - D.P.x);
    L.glissable(c, {
      soulever: false,
      debut: (ev) => (ev.target.closest(".tube-grenaille") && !e.demi_tour ? L.scene.vers_scene(ev) : null),
      saisir: () => { a0 = null; phi0 = e.phi; },
      deplacer: (p) => { if (a0 === null) a0 = angle(p); let d = angle(p) - a0; d = Math.atan2(Math.sin(d), Math.cos(d)); e.phi = phi0 + d; if (Math.abs(d) > 2.5) { phi0 = e.phi; a0 = angle(p); } },
      toucher: () => { e.demi_tour = Math.PI; },
    });
  }

  L.poste_tube = function (g) {
    // Décor, calque animé (tube, afficheurs) ; faits notés 4 fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    D.fond(L.svg("g", {}, g));
    const e = { phi: 0, s: D.BUTEE, vs: 0, repos: 1, n: 0, T: AMBIANTE, demi_tour: 0, mesures: { 0: AMBIANTE } }, c = L.svg("g", {}, g);
    gestes(c, e);
    let avant = null;
    const image = (t) => { avancer(e, avant === null ? 0 : Math.min(0.02, (t - avant) / 1000)); avant = t; c.replaceChildren(); D.tube(c, e.phi, e.s); D.afficheurs(c, e.T, e.n); requestAnimationFrame(image); };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("tube", { n: e.n, T: Math.round(e.T * 10) / 10, mesures: { ...e.mesures } }), 250);
    return { pense_bete };
  };
})(window.Labo);

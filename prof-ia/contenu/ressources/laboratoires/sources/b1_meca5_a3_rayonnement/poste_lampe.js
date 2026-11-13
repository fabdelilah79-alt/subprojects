/*
Rôle : paillasse du rayonnement : la lampe allumée rayonne vers deux plaques identiques ; chaque plaque absorbe une part de
       ce rayonnement (plaque noire : 95 %, plaque brillante : 10 %) et perd de la chaleur vers l'air : sa température
       tend vers une valeur d'équilibre d'autant plus haute que la lampe est proche (en 1/d²). Le chronomètre part quand on
       allume la lampe ; les températures sont notées chaque minute.
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève (interrupteur, lampe que l'on monte ou descend).
Produit : Labo.poste_lampe(g) -> { pense_bete } ; fait « lampe » = { allumee, d (cm), tn, tb (°C), t (s),
          releves: [{ min, tn, tb }] }.
Utilisé par : simulation.js (paillasse 1).
*/
(function (L) {
  const D = L.lampe_dessin, VITE = 10, AMBIANTE = 20, CAP = 4, H = 0.035, P20 = 0.9, ABS = { tn: 0.95, tb: 0.1 };

  function avancer(e, dt) {
    // Échauffement des plaques sous la lampe (rayonnement reçu en 1/d²), pertes vers l'air ; relevé chaque minute.
    const recu = e.allumee ? P20 * (200 / e.d) ** 2 : 0;
    for (const k of ["tn", "tb"]) e[k] += ((ABS[k] * recu - H * (e[k] - AMBIANTE)) * dt) / CAP;
    if (!e.allumee) return;
    e.t += dt;
    const m = Math.floor(e.t / 60 + 1e-9);
    if (m > e.releves.length - 1 && m <= 10) e.releves.push({ min: m, tn: Math.round(e.tn * 10) / 10, tb: Math.round(e.tb * 10) / 10 });
  }

  L.poste_lampe = function (g) {
    // Décor, interrupteur, lampe déplaçable ; boucle d'animation ; faits notés 4 fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    D.fond(L.svg("g", {}, g));
    const e = { allumee: false, d: 200, tn: AMBIANTE, tb: AMBIANTE, t: 0, releves: [] };
    L.bouton_texte(g, 765, 320, "Allumer / Éteindre", () => { e.allumee = !e.allumee; if (e.allumee && !e.releves.length) e.releves.push({ min: 0, tn: Math.round(e.tn * 10) / 10, tb: Math.round(e.tb * 10) / 10 }); });
    const c = L.svg("g", {}, g);
    L.glissable(c, {
      soulever: false,
      debut: (ev) => (ev.target.closest(".lampe") ? { x: 0, y: D.Y_PLAQUES - e.d } : null),
      deplacer: (p) => { e.d = Math.max(150, Math.min(300, Math.round((D.Y_PLAQUES - p.y) / 10) * 10)); },
    });
    let avant = null;
    const image = (t) => {
      avancer(e, avant === null ? 0 : Math.min(0.05, (t - avant) / 1000) * VITE); avant = t;
      c.replaceChildren(); D.lampe(c, D.Y_PLAQUES - e.d - 10, e.allumee); D.afficheurs(c, e.tn, e.tb, e.t);
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("lampe", { allumee: e.allumee, d: e.d / 10, tn: Math.round(e.tn * 10) / 10, tb: Math.round(e.tb * 10) / 10, t: Math.round(e.t), releves: e.releves.slice() }), 250);
    return { pense_bete };
  };
})(window.Labo);

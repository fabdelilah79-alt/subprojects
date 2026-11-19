/*
Rôle : paillasse du banc à coussin d'air : on recule le mobile contre le plateau du lanceur (compression du ressort
       jusqu'à 5 cm) et on le lâche : il part à la vitesse v = c·√(k/m) (k = 40 N/m), glisse sans frottement, son drapeau
       (5,0 cm) coupe la cellule (le chronomètre affiche la durée Δt), puis il pousse le curseur à frottement (f = 0,25 N)
       jusqu'à l'arrêt : d = m·v² / (2f). On ajoute ou retire des surcharges de 100 g quand le mobile est arrêté.
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève (mobile, surcharges).
Produit : Labo.poste_banc(g) -> { pense_bete } ; fait « banc » = { m (kg), dt (s), bouge, essais: [{ m, dt, d (m) }] }.
Utilisé par : simulation.js (paillasse 1).
*/
(function (L) {
  const B = L.banc_dessin, K = 40, F = 0.25, DRAPEAU = 0.05, PLACES = [600, 632], PX = 1000 * B.MM;
  const masse = (e) => Math.round((0.2 + 0.1 * e.n) * 10) / 10;

  function avancer(e, dt) {
    // Glissement à vitesse constante, passage du drapeau devant la cellule, freinage par le curseur jusqu'à l'arrêt.
    if (!e.v) return;
    const avant = e.x;
    e.x += e.v * dt * PX;
    if (avant + 17.5 < B.X_CELLULE && e.x + 17.5 >= B.X_CELLULE) e.dt = (DRAPEAU / e.v) * (1 + (Math.random() - 0.5) * 0.002);
    if (!e.fin && e.x + B.LONG_MOBILE >= e.xb) e.fin = e.xb + ((masse(e) * e.v * e.v) / (2 * F)) * PX;
    if (e.fin) {
      e.v = Math.max(0, e.v - (F / masse(e)) * dt);
      e.xb = Math.min(e.fin, e.x + B.LONG_MOBILE);
      e.x = e.xb - B.LONG_MOBILE;
      if (!e.v || e.xb >= e.fin) { e.v = 0; e.xb = e.fin; e.x = e.fin - B.LONG_MOBILE; e.essais.push({ m: masse(e), dt: Math.round(e.dt * 1e4) / 1e4, d: Math.round((e.fin - B.X_CURSEUR) / B.MM) / 1000 }); e.fin = null; }
    }
  }

  function dessiner(c, e) {
    // Lanceur, curseur, mobile et ses surcharges, surcharges posées ou tenues, afficheur du chronomètre.
    c.replaceChildren();
    B.lanceur(c, Math.min(B.X_REPOS, e.x - 4));
    B.curseur(c, e.xb);
    B.mobile(c, e.x, e.n);
    PLACES.slice(e.n).forEach((x, k) => { const p = e.tenue && k === 0 ? e.tenue : { x, y: B.TABLE }; B.surcharge(L.svg("g", { class: "surcharge-posee" }, c), p.x, p.y); });
    L.texte(c, B.X_CELLULE + 45, 327, e.dt === null ? "- - - -" : `Δt = ${e.dt.toFixed(4).replace(".", ",")} s`, { "font-size": 11, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
  }

  function gestes(c, e) {
    // Mobile : reculer (compression) puis lâcher ; surcharges : poser sur le mobile ou reprendre (mobile arrêté).
    let prise = null;
    c.addEventListener("pointerdown", (ev) => { const t = ev.target; prise = t.closest(".surcharge-mobile") ? "retirer" : t.closest(".surcharge-posee") ? "poser" : t.closest(".mobile-banc") ? "mobile" : null; }, { capture: true });
    L.glissable(c, {
      soulever: false,
      debut: (ev) => (prise && !e.v ? L.scene.vers_scene(ev) : null),
      saisir: () => { if (prise === "mobile") { e.xb = B.X_CURSEUR; e.dt = null; } if (prise === "retirer") e.n--; },
      deplacer: (p) => { if (prise === "mobile") e.x = Math.max(B.X_REPOS + 4 - 50 * B.MM, Math.min(B.X_CURSEUR - B.LONG_MOBILE, p.x - B.LONG_MOBILE / 2)); else e.tenue = { x: p.x, y: p.y }; },
      lacher: (p) => {
        if (prise === "mobile") { const comp = (B.X_REPOS + 4 - e.x) / B.MM / 1000; if (comp > 0.003) e.v = comp * Math.sqrt(K / masse(e)); }
        else { e.tenue = null; if (Math.abs(p.x - (e.x + B.LONG_MOBILE / 2)) < 45 && p.y < B.HAUT + 10 && e.n < 2) e.n++; }
      },
    });
  }

  L.poste_banc = function (g) {
    // Décor du banc, calque animé ; faits notés 4 fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    B.fond(L.svg("g", {}, g));
    const e = { x: B.X_REPOS + 4, v: 0, xb: B.X_CURSEUR, n: 0, dt: null, fin: null, tenue: null, essais: [] }, c = L.svg("g", {}, g);
    gestes(c, e);
    let avant = null;
    const image = (t) => { avancer(e, avant === null ? 0 : Math.min(0.04, (t - avant) / 1000)); avant = t; dessiner(c, e); requestAnimationFrame(image); };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("banc", { m: Math.round(masse(e) * 10) / 10, dt: e.dt === null ? null : Math.round(e.dt * 1e4) / 1e4, bouge: !!e.v, essais: e.essais.slice() }), 250);
    return { pense_bete };
  };
})(window.Labo);

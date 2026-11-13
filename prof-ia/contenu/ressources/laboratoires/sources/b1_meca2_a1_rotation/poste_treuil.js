/*
Rôle : paillasse du treuil électrique : on accroche une masse marquée (200 g ou 500 g), on règle la tension du moteur
       (0 à 12 V) et on commande Monter, Arrêter ou Descendre. Le moteur exerce sur le tambour un couple de moment
       M = m·g·r ; sa vitesse angulaire tend vers ω = 3·U − 60·M (rad/s ; temps de mise en vitesse 0,2 s). Le chronomètre
       mesure la durée de passage entre les deux cellules (Δh = 60,0 cm) ; le compte-tours affiche N (tr/min) à chaque instant.
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève (masses, boutons de commande, bouton de réglage).
Produit : Labo.poste_treuil(g) -> { pense_bete } ; fait « treuil » = { m (kg), U (V), h (m), N (tr/min), en_marche,
          essais: [{ U, m, dt (s), N }] }.
Utilisé par : simulation.js (paillasse 2).
*/
(function (L) {
  const G = 9.81, r = 0.02, H_MAX = 0.75, T = L.treuil_dessin, P = L.poulie_dessin;
  const H_C = [0.1, 0.7], PLACES = { 0.2: 520, 0.5: 575 };

  function avancer(e, dt) {
    // Vitesse du tambour vers sa valeur de régime ; fin de course en haut et en bas ; chronomètre entre les cellules.
    const M = e.m * G * r, cible = e.sens > 0 ? Math.max(0, 3 * e.U - 60 * M) : e.sens < 0 ? -(3 * e.U + 60 * M) : 0;
    e.omega += (cible - e.omega) * (1 - Math.exp(-dt / 0.2));
    const h0 = e.h;
    e.h = Math.max(0, Math.min(H_MAX, e.h + e.omega * r * dt));
    if (e.h === 0 || e.h === H_MAX) { if ((e.h === 0 && e.sens < 0) || (e.h === H_MAX && e.sens > 0)) e.sens = 0; e.omega = 0; }
    e.t += dt;
    if (h0 < H_C[0] && e.h >= H_C[0]) e.depart = e.t;
    if (h0 < H_C[1] && e.h >= H_C[1] && e.depart !== null && e.m) {
      e.dt = (e.t - e.depart) * (1 + (Math.random() - 0.5) * 0.002);
      e.essais.push({ U: e.U, m: e.m, dt: Math.round(e.dt * 1000) / 1000, N: Math.round(e.N) });
      e.depart = null;
    }
    e.N = (Math.abs(e.omega) * 60) / (2 * Math.PI);
  }

  function dessiner(calque, e) {
    // Tambour, fil, crochet ou masse accrochée, masses posées, cellules, afficheurs.
    calque.replaceChildren();
    T.tambour(calque, e.h / r);
    const k = e.m ? P.masse.k(e.m) : 0, bas = T.TABLE - e.h * 1000 * T.MM, haut = e.m ? bas - 9 - 46 * k : bas - 14;
    L.svg("line", { x1: T.X_FIL, y1: T.TAMBOUR.y, x2: T.X_FIL, y2: haut + 1, stroke: "#e9e4d2", "stroke-width": 1.4 }, calque);
    if (e.m) P.masse(L.svg("g", { class: "masse-treuil" }, calque), T.X_FIL, haut, `${e.m * 1000} g`, k);
    else L.svg("path", { d: `M${T.X_FIL} ${haut} v8 a4 4 0 1 1 -4 4`, fill: "none", stroke: "url(#metal)", "stroke-width": 1.8 }, calque);
    for (const [m, x] of Object.entries(PLACES)) {
      if (Number(m) === e.m) continue;
      const kk = P.masse.k(Number(m)), p = e.tenue && e.tenue.m === Number(m) ? e.tenue : { x, y: T.TABLE - 9 - 46 * kk };
      P.masse(L.svg("g", { class: "masse-posee", "data-m": m }, calque), p.x, p.y, `${Number(m) * 1000} g`, kk);
    }
    T.Y_CELLULES.forEach((y) => T.cellule(calque, y, e.m && y > haut + 9 && y < bas));
    T.afficheur(calque, 526, 120, `${String(Math.round(e.N)).padStart(3, " ")} tr/min`);
    const duree = e.depart !== null ? e.t - e.depart : e.dt;
    T.afficheur(calque, 725, 253, duree === null ? "- - - -" : `Δt = ${duree.toFixed(3).replace(".", ",")} s`);
  }

  function gestes(calque, e) {
    // Prendre une masse posée et l'accrocher au crochet (en bas, moteur arrêté), ou décrocher la masse accrochée.
    let prise = null;
    L.glissable(calque, {
      soulever: false,
      debut: (ev) => {
        const t = ev.target.closest(".masse-posee, .masse-treuil");
        if (!t || e.h > 0.002 || e.sens) return null;
        prise = t.classList.contains("masse-treuil") ? e.m : Number(t.dataset.m);
        if (prise === e.m) e.m = 0;
        return L.scene.vers_scene(ev);
      },
      deplacer: (p) => { e.tenue = { m: prise, x: p.x, y: p.y - 20 }; },
      lacher: (p) => { e.tenue = null; if (Math.abs(p.x - T.X_FIL) < 40 && p.y > T.TABLE - 150) e.m = prise; },
    });
  }

  L.poste_treuil = function (g) {
    // Décor, alimentation, boîtier de commande ; boucle d'animation ; faits notés 4 fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    T.fond(L.svg("g", {}, g));
    const e = { m: 0, U: 0, sens: 0, omega: 0, h: 0, t: 0, N: 0, dt: null, depart: null, essais: [], tenue: null };
    L.treuil_commandes(g, e);
    const calque = L.svg("g", {}, g);
    gestes(calque, e);
    let avant = null;
    const image = (t) => { avancer(e, avant === null ? 0 : Math.min(0.05, (t - avant) / 1000)); avant = t; dessiner(calque, e); requestAnimationFrame(image); };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("treuil", { m: e.m, U: e.U, h: Math.round(e.h * 1000) / 1000, N: Math.round(e.N), en_marche: e.sens, essais: e.essais.slice() }), 250);
    return { pense_bete };
  };
})(window.Labo);

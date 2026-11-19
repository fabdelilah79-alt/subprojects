/*
Rôle : gestes et mouvement du plan inclinable : la noix soulève la planche (angle θ), les pavés se posent sur la planche ou
       en sont retirés ; un pavé immobile se met à glisser dès que tan θ dépasse son coefficient statique (l'angle est noté),
       puis glisse avec le coefficient dynamique jusqu'à la butée.
Reçoit : les calques de la planche et des pavés, l'état du plan, ses dimensions et sa fonction de dessin.
Produit : Labo.plan_gestes(...), Labo.plan_glisser(etat, dt, px_par_m) ; faits notés : pave_sur_plan, glissement.
Utilisé par : plan_incline.js.
*/
(function (L) {
  const G = 9.81, BUTEE = 50;

  function poser(e, p, A, LONGUEUR) {
    // Lâché le long de la planche (et sans autre pavé dessus) : le pavé y est posé, immobile.
    const u = { x: Math.cos(e.theta), y: -Math.sin(e.theta) }, d = { x: p.x - A.x, y: p.y - A.y }, s = d.x * u.x + d.y * u.y, ecart = Math.abs(d.x * u.y - d.y * u.x);
    if (e.pave || ecart > 45 || s < 80 || s > LONGUEUR - 40) return false;
    Object.assign(e, { pave: e.tenu.m, s, v: 0, glisse: false, stable: Math.tan(e.theta) <= L.PAVES[e.tenu.m].statique });
    return true;
  }

  L.plan_gestes = function (g, plan, paves, e, { A, LONGUEUR, TIGE, MAX, dessiner }) {
    // Noix : change l'angle. Pavés : glisser-déposer entre la paillasse et la planche.
    let noix = false;
    plan.addEventListener("pointerdown", (ev) => { noix = !!ev.target.closest(".noix"); }, { capture: true });
    L.glissable(plan, {
      soulever: false,
      debut: () => (noix ? { x: A.x + TIGE, y: A.y - TIGE * Math.tan(e.theta) } : null),
      deplacer: (p) => { e.theta = Math.max(0, Math.min(MAX, Math.atan((A.y - p.y) / TIGE))); },
    });
    let m = null;
    paves.addEventListener("pointerdown", (ev) => { const n = ev.target.closest(".pave"); m = n ? Object.keys(L.PAVES).find((k) => n.classList.contains(`pave-${k}`)) : null; }, { capture: true });
    L.glissable(paves, {
      soulever: false,
      debut: (ev) => (m ? L.scene.vers_scene(ev) : null),
      saisir: () => { if (e.pave === m) e.pave = null; e.tenu = { m, p: { x: 0, y: 0 } }; },
      deplacer: (p) => { e.tenu.p = { x: p.x, y: p.y + 16 }; },
      lacher: (p) => {
        poser(e, { x: p.x, y: p.y + 16 }, A, LONGUEUR);
        e.tenu = null;
        L.missions.noter("pave_sur_plan", e.pave);
        dessiner();
      },
    });
  };

  L.plan_glisser = function (e, dt, px_par_m) {
    // Démarrage du glissement (angle noté si le pavé était immobile), puis mouvement freiné par le frottement dynamique.
    const k = L.PAVES[e.pave], th = e.theta;
    if (!e.glisse) {
      if (Math.tan(th) <= k.statique) { e.stable = true; return; }
      e.glisse = true;
      if (e.stable) { e.angles[e.pave] = Math.round((th * 180) / Math.PI * 2) / 2; L.missions.noter("glissement", { ...e.angles }); }
    }
    for (let reste = dt; reste > 1e-6 && e.glisse; reste -= 0.002) {
      const pas = Math.min(0.002, reste);
      e.v = Math.max(0, e.v + G * (Math.sin(th) - k.dynamique * Math.cos(th)) * pas);
      e.s -= e.v * pas * px_par_m;
      if (e.s <= BUTEE) Object.assign(e, { s: BUTEE, v: 0, glisse: false, stable: false });
      else if (e.v === 0 && Math.tan(th) <= k.statique) e.glisse = false;
    }
  };
})(window.Labo);

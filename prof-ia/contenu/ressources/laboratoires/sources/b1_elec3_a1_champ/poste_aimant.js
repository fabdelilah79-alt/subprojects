/*
Rôle : paillasse « barreau aimanté » : feuille sur la paillasse, barreau aimanté (10 cm) rangé dans sa boîte (son champ
       ne sort pas de la boîte) que l'on pose sur la feuille, déplace, tourne, casse en deux ou recolle ; boussole ;
       limaille de fer ; teslamètre. Les observations faites sont notées.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_aimant(g) -> { pense_bete } ; fait « aimant » = { pose, casse, vu: { nord_geo, pres_nord, pres_sud,
          cassure, lignes, lignes_casse }, mesures: { d2, d4 (T, à 2 et 4 cm du pôle nord, dans l'axe) } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const BOITE = { x: 115, y: 325 };

  function repere(a, p) {
    // Coordonnées du point dans le repère de l'aimant : t le long de l'axe (vers le nord), n en travers.
    const dx = p.x - a.x, dy = p.y - a.y;
    return { t: dx * Math.cos(a.angle) + dy * Math.sin(a.angle), n: -dx * Math.sin(a.angle) + dy * Math.cos(a.angle) };
  }

  function observer(e, a, bo, lim, t, champ) {
    // Met à jour les observations : boussole immobile près d'un pôle ou de la cassure, limaille alignée, mesures dans l'axe.
    const r = repere(a, bo), h = a.longueur / 2;
    if (bo.stable && !e.pose && Math.abs(Math.cos(bo.angle)) < 0.1 && Math.sin(bo.angle) < 0) e.vu.nord_geo = true;
    if (bo.stable && e.pose && !a.casse && Math.abs(r.n) < 0.02) { if (r.t > h + 0.005 && r.t < h + 0.04) e.vu.pres_nord = true; if (r.t < -h - 0.005 && r.t > -h - 0.04) e.vu.pres_sud = true; }
    if (bo.stable && e.pose && a.casse && Math.abs(r.t) < 0.03 && Math.abs(r.n) < 0.025) e.vu.cassure = true;
    if (e.pose && lim.visible && lim.alignement(champ) > 0.8) e.vu[a.casse ? "lignes_casse" : "lignes"] = true;
    const s = repere(a, t.sonde);
    if (e.pose && !a.casse && t.mode === "H" && Math.abs(s.n) < 0.003) for (const [k, d] of [["d2", 0.02], ["d4", 0.04]]) if (Math.abs(s.t - h - d) < 0.003) e.mesures[k] = t.valeur;
  }

  L.poste_aimant = function (g) {
    // Décor, feuille, limaille, aimant et sa boîte, boussole, teslamètre, boutons ; animation et faits.
    const { pense_bete } = L.decor_circuit(g, 0), plan = L.plan_magnetique({ cx: 500, cy: 400, ex: 1800, ey: 1100, du: 0.15, dv: 0.09 });
    L.plan_magnetique.feuille(L.svg("g", {}, g), plan);
    const a = { x: plan.plan(BOITE).x, y: plan.plan(BOITE).y, angle: 0, longueur: 0.1, largeur: 0.016, casse: false, ecart: 0.016, q: 1.6e-6 };
    const e = { pose: false, vu: {}, mesures: {} };
    const champ = (p) => L.champ_magnetique.calculer([...L.champ_magnetique.terre(), ...(e.pose ? L.sources_barreau(a) : [])], p);
    const lim = L.limaille(L.svg("g", {}, g), plan);
    L.plan_magnetique.rose(g, plan);
    L.svg("rect", { x: BOITE.x - 100, y: BOITE.y - 22, width: 200, height: 44, rx: 4, fill: "#6d4a2a", stroke: "#3b2614" }, g);
    L.texte(g, BOITE.x, BOITE.y + 32, "boîte de l'aimant", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
    const ga = L.svg("g", { class: "aimant", role: "button", "aria-label": "Barreau aimanté" }, g);
    const redessiner = () => { ga.replaceChildren(); L.dessin_barreau(ga, plan, a); if (lim.visible) lim.tapoter(champ); };
    L.glissable(ga, {
      soulever: false, debut: () => plan.ecran(a), deplacer: (p) => Object.assign(a, plan.plan(p)) && redessiner(),
      lacher: () => { e.pose = plan.dans(a, 0.02); if (!e.pose) Object.assign(a, plan.plan(BOITE), { angle: 0, casse: false }); redessiner(); },
    });
    const bo = L.boussole(g, plan, { x: 0.1, y: -0.045, champ }), t = L.teslametre(g, plan, { x: 850, y: 300, sonde: { x: 0.12, y: 0.06 }, champ });
    [["Tourner", () => { if (e.pose) { a.angle += Math.PI / 4; redessiner(); } }], ["Casser", () => { if (e.pose) { a.casse = !a.casse; redessiner(); } }],
      ["Limaille", () => { if (lim.visible) lim.retirer(); else lim.saupoudrer(champ); }], ["Tapoter", () => { if (lim.visible) lim.tapoter(champ); }]]
      .forEach(([texte, action], k) => L.bouton_texte(g, 330 + k * 92, 548, texte, action));
    redessiner();
    let avant = null;
    const image = (ms) => { const dt = avant === null ? 0 : Math.min(0.03, (ms - avant) / 1000); avant = ms; bo.tic(dt); bo.dessiner(); t.tic(); requestAnimationFrame(image); };
    requestAnimationFrame(image);
    setInterval(() => { observer(e, a, bo, lim, t, champ); L.missions.noter("aimant", JSON.parse(JSON.stringify({ pose: e.pose, casse: a.casse, vu: e.vu, mesures: e.mesures }))); }, 250);
    return { pense_bete };
  };
})(window.Labo);

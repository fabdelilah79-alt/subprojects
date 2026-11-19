/*
Rôle : paillasse « superposition de deux champs » : deux barreaux aimantés fixés à angle droit, dont les pôles nord
       visent le point O marqué sur la feuille ; chacun peut être retiré ou remis ; boussole, limaille, teslamètre. Les
       valeurs mesurées en O (aimant 1 seul, aimant 2 seul, les deux) et l'orientation de la boussole en O sont notées.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_superposition(g) -> { pense_bete } ; fait « superposition » = { B1, B2, B12 (T), boussole_O }.
Utilisé par : simulation.js.
*/
(function (L) {
  const O = { x: 0.03, y: 0.02 };

  L.poste_superposition = function (g) {
    // Décor, feuille, aimants (présents ou retirés), point O, boussole, teslamètre, boutons ; animation et faits.
    const { pense_bete } = L.decor_circuit(g, 1), plan = L.plan_magnetique({ cx: 500, cy: 400, ex: 1800, ey: 1100, du: 0.15, dv: 0.09 });
    L.plan_magnetique.feuille(L.svg("g", {}, g), plan);
    const aimants = [{ x: -0.07, y: O.y, angle: 0 }, { x: O.x, y: -0.06, angle: Math.PI / 2 }].map((a) => ({ ...a, longueur: 0.1, largeur: 0.016, casse: false, q: 1.6e-6, la: true }));
    const champ = (p) => L.champ_magnetique.calculer([...L.champ_magnetique.terre(), ...aimants.filter((a) => a.la).flatMap((a) => L.sources_barreau(a))], p);
    const lim = L.limaille(L.svg("g", {}, g), plan, { masque: (p) => aimants.some((a) => a.la && L.dans_barreau(a, p)) });
    L.plan_magnetique.rose(g, plan);
    const o = plan.ecran(O);
    L.svg("path", { d: `M${o.x - 6} ${o.y} H${o.x + 6} M${o.x} ${o.y - 4} V${o.y + 4}`, stroke: "#c0392b", "stroke-width": 1.4 }, g);
    L.texte(g, o.x + 10, o.y + 10, "O", { "font-size": 10, "font-weight": 700, fill: "#c0392b" });
    const ga = L.svg("g", { "pointer-events": "none" }, g);
    const redessiner = () => { ga.replaceChildren(); aimants.forEach((a, k) => { if (a.la) L.dessin_barreau(ga, plan, a); else { const p = plan.ecran(a); L.texte(ga, p.x, p.y, `aimant ${k + 1} retiré`, { "font-size": 8, fill: "#8a8270" }); } }); if (lim.visible) lim.tapoter(champ); };
    const bo = L.boussole(g, plan, { x: 0.1, y: 0.06, champ }), t = L.teslametre(g, plan, { x: 850, y: 300, sonde: { x: 0.12, y: -0.06 }, champ });
    [["Aimant 1", () => { aimants[0].la = !aimants[0].la; redessiner(); }], ["Aimant 2", () => { aimants[1].la = !aimants[1].la; redessiner(); }],
      ["Limaille", () => { if (lim.visible) lim.retirer(); else lim.saupoudrer(champ); }], ["Tapoter", () => { if (lim.visible) lim.tapoter(champ); }]]
      .forEach(([texte, action], k) => L.bouton_texte(g, 330 + k * 92, 548, texte, action));
    redessiner();
    const e = {};
    let avant = null;
    const image = (ms) => { const dt = avant === null ? 0 : Math.min(0.03, (ms - avant) / 1000); avant = ms; bo.tic(dt); bo.dessiner(); t.tic(); requestAnimationFrame(image); };
    requestAnimationFrame(image);
    setInterval(() => {
      // Mesure en O selon les aimants présents ; boussole immobile en O avec les deux aimants.
      const [u, v] = aimants.map((a) => a.la), cle = u && v ? "B12" : u ? "B1" : v ? "B2" : null;
      if (cle && t.mode === "H" && Math.hypot(t.sonde.x - O.x, t.sonde.y - O.y) < 0.002) e[cle] = t.valeur;
      if (u && v && bo.stable && Math.hypot(bo.x - O.x, bo.y - O.y) < 0.004) e.boussole_O = true;
      L.missions.noter("superposition", { ...e });
    }, 250);
    return { pense_bete };
  };
})(window.Labo);

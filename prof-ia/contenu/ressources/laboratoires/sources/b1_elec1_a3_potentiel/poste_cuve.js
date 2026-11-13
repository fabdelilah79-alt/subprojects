/*
Rôle : paillasse de la cuve rhéographique : on promène la pointe de touche dans l'eau (au millimètre) ; le voltmètre
       indique le potentiel V du point touché (référence : plaque à 0 V). Chaque lâcher de la pointe est un relevé (x, y, V).
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève.
Produit : Labo.poste_cuve(g) -> { pense_bete } ; fait « cuve » = { x, y (cm), V (V), releves: [{ x, y, V }] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const C = L.cuve_rheo;

  L.poste_cuve = function (g) {
    // Décor, pointe déplaçable, afficheur ; faits notés 4 fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    C.fond(L.svg("g", {}, g));
    const e = { p: { x: 10, y: 7 }, releves: [] }, c = L.svg("g", {}, g);
    const mesure = () => Math.round((C.potentiel(e.p) + (Math.random() - 0.5) * 0.02) * 100) / 100;
    let V = mesure();
    L.glissable(c, {
      soulever: false,
      debut: (ev) => (ev.target.closest(".pointe-touche") ? C.ecran(e.p) : null),
      deplacer: (q) => { const p = C.vers_cuve(q); e.p = { x: Math.round(Math.max(0.2, Math.min(C.LX - 0.2, p.x)) * 10) / 10, y: Math.round(Math.max(0.2, Math.min(C.LY - 0.2, p.y)) * 10) / 10 }; V = mesure(); },
      lacher: () => { e.releves = e.releves.slice(-39).concat([{ x: e.p.x, y: e.p.y, V }]); },
    });
    const image = () => { c.replaceChildren(); C.pointe(c, e.p); C.afficheur(c, V); requestAnimationFrame(image); };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("cuve", { x: e.p.x, y: e.p.y, V, releves: e.releves.slice() }), 250);
    return { pense_bete };
  };
})(window.Labo);

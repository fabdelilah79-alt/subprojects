/*
Rôle : paillasse « conducteur rectiligne » : tige de cuivre verticale qui traverse une plaque de plexiglas posée sur des
       cales, reliée au générateur de courant (0 à 20 A) ; boussole, limaille, teslamètre (avec zéro). Les lignes de champ
       (cercles autour du fil), le sens du champ pour les deux sens du courant et les mesures de B (selon I et la distance)
       sont notés.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_fil(g) -> { pense_bete } ; fait « fil » = { zero_ok, vu: { lignes, sens1, sens2 }, points: { "I:d" : B (T) } }
          (I en A, d en cm, de 1 à 5 cm).
Utilisé par : simulation.js.
*/
(function (L) {
  const PLAN = { cx: 540, cy: 410, ex: 1800, ey: 1100, du: 0.11, dv: 0.08 };

  function tige(dessous, dessus, gen) {
    // Tige verticale (sous la plaque, puis au-dessus), câbles jusqu'aux bornes du générateur.
    const c = { x: PLAN.cx, y: PLAN.cy }, r = gen.bornes.rouge, n = gen.bornes.noire;
    L.svg("path", { d: `M${c.x} ${c.y + 38} H250 V${n.y} H${n.x + 4}`, fill: "none", stroke: "#263238", "stroke-width": 2.6, "stroke-linejoin": "round" }, dessous);
    L.svg("line", { x1: c.x, y1: c.y, x2: c.x, y2: c.y + 38, stroke: "#c8742e", "stroke-width": 4 }, dessous);
    L.svg("line", { x1: c.x, y1: c.y + 2, x2: c.x, y2: c.y - 160, stroke: "#c8742e", "stroke-width": 4 }, dessus);
    L.svg("ellipse", { cx: c.x, cy: c.y, rx: 4, ry: 2.4, fill: "#7a4a1a" }, dessus);
    L.svg("path", { d: `M${c.x} ${c.y - 160} V${c.y - 172} H250 V${r.y} H${r.x + 4}`, fill: "none", stroke: "#c62828", "stroke-width": 2.6, "stroke-linejoin": "round" }, dessus);
  }

  function observer(e, gen, bo, lim, t, champ) {
    // Lignes de champ, sens de l'aiguille près du fil, mesures (après un zéro fait circuit ouvert).
    const I = gen.intensite();
    if (I && lim.visible && lim.alignement(champ, 1e-4) > 0.8) e.vu.lignes = true;
    if (Math.abs(I) >= 4 && bo.stable && Math.hypot(bo.x, bo.y) < 0.03) e.vu[I > 0 ? "sens1" : "sens2"] = true;
    const d = Math.hypot(t.sonde.x, t.sonde.y) * 100, dcm = Math.round(d);
    if (e.zero_ok && t.mode === "H" && dcm >= 1 && dcm <= 5 && Math.abs(d - dcm) < 0.15) e.points[`${Math.abs(I)}:${dcm}`] = t.valeur;
  }

  L.poste_fil = function (g) {
    // Décor, plaque, tige et câbles, générateur, limaille, boussole, teslamètre ; animation et faits.
    const { pense_bete } = L.decor_circuit(g, 0), plan = L.plan_magnetique(PLAN), dessous = L.svg("g", {}, g);
    L.plan_magnetique.feuille(L.svg("g", {}, g), plan, { matiere: "plexiglas" });
    const gen = L.generateur_courant(g, { x: 60, y: 290, max: 20, pas: 1, valeur: 20 }), e = { zero_ok: false, vu: {}, points: {} };
    const champ = (p) => L.champ_magnetique.calculer([...L.champ_magnetique.terre(), ...L.champ_magnetique.fil_vertical({ x: 0, y: 0, I: gen.intensite() })], p);
    const lim = L.limaille(L.svg("g", {}, g), plan, { masque: (p) => Math.hypot(p.x, p.y) < 0.003 });
    const dessus = L.svg("g", {}, g);
    tige(dessous, dessus, gen);
    const bo = L.boussole(g, plan, { x: -0.07, y: -0.05, champ });
    const t = L.teslametre(g, plan, { x: 860, y: 300, sonde: { x: 0.08, y: 0.05 }, champ, sur_zero: () => { e.zero_ok = gen.intensite() === 0; } });
    [["Limaille", () => { if (lim.visible) lim.retirer(); else lim.saupoudrer(champ); }], ["Tapoter", () => { if (lim.visible) lim.tapoter(champ); }]].forEach(([texte, action], k) => L.bouton_texte(g, 480 + k * 92, 548, texte, action));
    let avant = null;
    const image = (ms) => { const dt = avant === null ? 0 : Math.min(0.03, (ms - avant) / 1000); avant = ms; bo.tic(dt); bo.dessiner(); t.tic(); requestAnimationFrame(image); };
    requestAnimationFrame(image);
    setInterval(() => { observer(e, gen, bo, lim, t, champ); L.missions.noter("fil", JSON.parse(JSON.stringify(e))); }, 250);
    return { pense_bete };
  };
})(window.Labo);

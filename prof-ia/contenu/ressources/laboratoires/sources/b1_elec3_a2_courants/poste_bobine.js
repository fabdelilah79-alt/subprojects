/*
Rôle : paillasse « spire et bobine » : spire ou bobine (touche « Spire / Bobine ») traversant une plaque de plexiglas,
       générateur de courant (0 à 10 A), boussole, limaille, teslamètre (avec zéro). Les lignes de champ, les faces de la
       bobine pour les deux sens du courant et les valeurs de B au centre sont notées.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_bobine(g) -> { pense_bete } ; fait « bobine » = { mode, zero_ok, vu: { lignes_spire, lignes_bobine,
          face1, face2 }, points: { "spire:I" | "bobine:I" : B (T) } }.
Utilisé par : simulation.js.
*/
(function (L) {
  function observer(e, gen, bo, lim, t, champ) {
    // Lignes de champ, aiguille devant la face avant de la bobine, B au centre (après un zéro fait circuit ouvert).
    const I = gen.intensite(), demi = L.BOBINAGES.bobine.l / 2;
    if (I && lim.visible && lim.alignement(champ, 2e-4) > 0.8) e.vu[`lignes_${e.mode}`] = true;
    if (e.mode === "bobine" && Math.abs(I) >= 2 && bo.stable && Math.abs(bo.x) < 0.015 && bo.y > demi + 0.01 && bo.y < demi + 0.035) e.vu[I > 0 ? "face1" : "face2"] = true;
    if (e.zero_ok && t.mode === "H" && Math.hypot(t.sonde.x, t.sonde.y) < 0.003) e.points[`${e.mode}:${Math.abs(I)}`] = t.valeur;
  }

  L.poste_bobine = function (g) {
    // Décor, plaque, bobinage, générateur, limaille, boussole, teslamètre, touches ; animation et faits.
    const { pense_bete } = L.decor_circuit(g, 1), plan = L.plan_magnetique({ cx: 540, cy: 400, ex: 1800, ey: 1100, du: 0.11, dv: 0.11 }), dessous = L.svg("g", {}, g);
    L.plan_magnetique.feuille(L.svg("g", {}, g), plan, { matiere: "plexiglas" });
    const gen = L.generateur_courant(g, { x: 60, y: 290, max: 10, pas: 1, valeur: 4 }), e = { mode: "spire", zero_ok: false, vu: {}, points: {} };
    let sources = L.sources_bobinage(e.mode, 1), I_sources = 1;
    const champ = (p) => {
      // Les sources sont recalculées seulement quand l'intensité change.
      const I = gen.intensite();
      if (I !== I_sources) { sources = L.sources_bobinage(e.mode, I); I_sources = I; }
      return L.champ_magnetique.calculer([...L.champ_magnetique.terre(), ...(I ? sources : [])], p);
    };
    const lim = L.limaille(L.svg("g", {}, g), plan, { masque: (p) => L.masque_bobinage(e.mode, p) });
    const dessus = L.svg("g", {}, g), dessiner = () => L.dessin_bobinage(dessous, dessus, plan, e.mode, gen);
    const bo = L.boussole(g, plan, { x: 0.07, y: -0.07, champ });
    const t = L.teslametre(g, plan, { x: 860, y: 300, sonde: { x: 0.08, y: 0.07 }, champ, sur_zero: () => { e.zero_ok = gen.intensite() === 0; } });
    [["Spire / Bobine", () => { e.mode = e.mode === "spire" ? "bobine" : "spire"; I_sources = null; lim.retirer(); dessiner(); }], ["Limaille", () => { if (lim.visible) lim.retirer(); else lim.saupoudrer(champ); }], ["Tapoter", () => { if (lim.visible) lim.tapoter(champ); }]]
      .forEach(([texte, action], k) => L.bouton_texte(g, 430 + k * 92, 548, texte, action));
    dessiner();
    let avant = null;
    const image = (ms) => { const dt = avant === null ? 0 : Math.min(0.03, (ms - avant) / 1000); avant = ms; bo.tic(dt); bo.dessiner(); t.tic(); requestAnimationFrame(image); };
    requestAnimationFrame(image);
    setInterval(() => { observer(e, gen, bo, lim, t, champ); L.missions.noter("bobine", JSON.parse(JSON.stringify(e))); }, 250);
    return { pense_bete };
  };
})(window.Labo);

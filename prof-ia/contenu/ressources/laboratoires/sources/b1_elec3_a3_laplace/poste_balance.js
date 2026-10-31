/*
Rôle : paillasse « balance de Laplace » : aimant en U (B = 0,080 T dans l'entrefer) sur un plateau tournant posé sur une
       balance électronique ; cadre conducteur fixe (longueur l = 1, 2 ou 4 cm dans l'entrefer) tenu par une potence et
       relié au générateur de courant. La force de Laplace F = I·l·B·sin α s'exerce sur le cadre ; la force opposée
       s'exerce sur l'aimant : l'indication de la balance change de Δm = F/g.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_balance(g) -> { pense_bete } ; fait « balance » = { tare_ok, points: { "l:α:I" : |Δm| (g) } } (l en cm).
Utilisé par : simulation.js.
*/
(function (L) {
  const C = { x: 470, y: 463 }, B = 0.08, M_AIMANT = 152.37, G = 9.81, LS = [0.04, 0.02, 0.01], AS = [90, 60, 30, 0];

  function cables(g, gen) {
    // Câbles du support isolant du cadre jusqu'aux bornes du générateur ; potence.
    const y = C.y - 0.15 * 1100 - 8;
    L.tige(g, `M704 545 V${y - 30}`, 6);
    L.tige(g, `M704 ${y - 10} H${C.x + 30}`, 4);
    L.svg("path", { d: `M${C.x - 30} ${y - 2} H250 V${gen.bornes.rouge.y} H${gen.bornes.rouge.x + 4}`, fill: "none", stroke: "#c62828", "stroke-width": 2.4, "stroke-linejoin": "round" }, g);
    L.svg("path", { d: `M${C.x - 30} ${y + 3} H262 V${gen.bornes.noire.y} H${gen.bornes.noire.x + 4}`, fill: "none", stroke: "#263238", "stroke-width": 2.4, "stroke-linejoin": "round" }, g);
  }

  L.poste_balance = function (g) {
    // Balance, aimant, cadre, générateur, touches ; la masse apparente de l'aimant suit la force de Laplace.
    const { pense_bete } = L.decor_circuit(g, 1);
    const ctx = { fond: L.svg("g", {}, g), devant: null, haut: null };
    const gen = L.generateur_courant(g, { x: 60, y: 290, max: 5, pas: 0.5, valeur: 1 }), e = { k_l: 0, k_a: 0, tare_ok: false, points: {} };
    const extra = () => (-gen.intensite() * LS[e.k_l] * B * Math.sin((AS[e.k_a] * Math.PI) / 180) / G) * 1000;
    const aimant = { get masse() { return M_AIMANT + extra(); } };
    ctx.devant = L.svg("g", {}, g); ctx.haut = L.svg("g", {}, g);
    const b = L.balance_electronique(ctx, { x: C.x, sol: 540, e: 1.6 });
    b.ajouter(aimant);
    const ga = L.svg("g", {}, g), gc = L.svg("g", {}, g);
    cables(g, gen);
    const dessiner = () => { L.dessin_aimant_balance(ga, C, AS[e.k_a]); L.dessin_cadre(gc, C, LS[e.k_l]); };
    L.bouton_texte(g, 800, 440, "Cadre", () => { e.k_l = (e.k_l + 1) % LS.length; dessiner(); });
    L.bouton_texte(g, 800, 470, "Tourner", () => { e.k_a = (e.k_a + 1) % AS.length; dessiner(); });
    L.texte(g, 800, 410, "B = 0,080 T (entrefer)", { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" });
    dessiner();
    let tare = b.tare;
    setInterval(() => {
      // Tare faite courant coupé ; point noté quand l'affichage, stable, a rejoint la valeur attendue.
      if (b.tare !== tare) { tare = b.tare; e.tare_ok = gen.intensite() === 0; }
      const lu = b.lecture(), attendu = Math.round((M_AIMANT + extra() - b.tare) * 100) / 100;
      if (e.tare_ok && lu !== null && Math.abs(lu - attendu) < 0.006) e.points[`${Math.round(LS[e.k_l] * 100)}:${AS[e.k_a]}:${Math.abs(gen.intensite())}`] = Math.abs(lu);
      L.missions.noter("balance", JSON.parse(JSON.stringify(e)));
    }, 250);
    return { pense_bete };
  };
})(window.Labo);

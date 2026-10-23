/*
Rôle : paillasse du chauffage électrique : gobelet en polystyrène (capacité thermique négligeable), thermoplongeur de
       puissance P = 100 W relié à son alimentation (Marche/Arrêt) et à un chronomètre de chauffe (temps accéléré × 5),
       béchers de 200 g d'eau et de 200 g d'huile à 20,0 °C ; « Vider le gobelet » vide le gobelet et fait remplir les
       béchers. Chaque arrêt du chauffage note un essai (liquide, masse, durée, températures avant et après).
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève (béchers, boutons, agitateur).
Produit : Labo.poste_chauffage(g) -> { pense_bete } ; fait « chauffage » = { nom, m (g), theta, marche, t (s),
          essais: [{ nom, m, t, theta0, theta1 }] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const P = 100, VITE = 5, X = 430, BASE = 556, C_HUILE = 2000, C_EAU = L.vase_modele.C_EAU;

  function thermoplongeur(g) {
    // Potence, tige du thermoplongeur et spirale au fond du gobelet, câble jusqu'à l'alimentation.
    L.svg("rect", { x: X + 60, y: BASE - 10, width: 70, height: 10, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, `M${X + 95} ${BASE - 10} V${BASE - 214}`, 6);
    L.tige(g, `M${X + 95} ${BASE - 198} H${X + 18}`, 4);
    L.tige(g, `M${X + 8} ${BASE - 190} V${BASE - 26}`, 4);
    L.svg("path", { d: `M${X + 8} ${BASE - 26} c-14 0 -14 -8 0 -8 c-14 0 -14 -8 0 -8`, fill: "none", stroke: "#9a6b3a", "stroke-width": 2.4 }, g);
    L.svg("rect", { x: X - 2, y: BASE - 206, width: 20, height: 18, rx: 3, fill: "#2b3035" }, g);
    L.svg("path", { d: `M${X + 18} ${BASE - 198} C${X + 120} ${BASE - 230} 660 400 700 440`, fill: "none", stroke: "#1b1e21", "stroke-width": 2.4 }, g);
    L.svg("rect", { x: 690, y: 420, width: 150, height: 100, rx: 6, fill: "#2c3e50", stroke: "#111" }, g);
    L.texte(g, 765, 433, "ALIMENTATION — 100 W", { "font-size": 7.5, "font-weight": 700, fill: "#e8ecef" });
    L.svg("rect", { x: 705, y: 442, width: 120, height: 24, rx: 3, fill: "#1d2a22" }, g);
    L.texte(g, 765, 512, "temps accéléré × 5", { "font-size": 6.5, fill: "#cfd6db" });
  }

  L.poste_chauffage = function (g) {
    // Gobelet et son contenu, thermoplongeur, béchers, boutons ; boucle d'animation ; faits notés 4 fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), v = L.vase_modele({ C: 0, pertes_s: 20000 });
    const e = { marche: false, t: 0, theta0: 20, essais: [] };
    thermoplongeur(g);
    const vase = L.vase_dessin(g, v, { x: X, base: BASE, type: "gobelet", afficheur: { x: 620, y: 330 } });
    const verser = (m, c, theta, nom) => { if (!v.m || v.nom === nom) v.verser(m, c, theta, nom); };
    const B = [["eau", 250, C_EAU], ["eau", 330, C_EAU], ["huile", 625, C_HUILE]].map(([nom, x, c]) => L.becher_verseur(g, { x, base: BASE, m: 200, c, theta: 20, nom, etiquette: nom === "eau" ? "eau" : "huile", cible: vase.dans, verser }));
    L.bouton_texte(g, 765, 490, "Marche / Arrêt", () => {
      if (e.marche) { e.marche = false; v.P = 0; e.essais.push({ nom: v.nom, m: Math.round(v.m), t: Math.round(e.t), theta0: e.theta0, theta1: Math.round(v.theta * 10) / 10 }); }
      else if (v.m) { e.marche = true; e.t = 0; e.theta0 = Math.round(v.theta * 10) / 10; v.P = P; }
    });
    L.bouton_texte(g, 620, 296, "Vider le gobelet", () => { if (!e.marche) { v.vider(20); B.forEach((b) => b.remplir()); e.t = 0; } });
    const ecran = L.svg("g", {}, g);
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000) * VITE; avant = t;
      v.tic(dt); B.forEach((b) => { b.tic(dt); b.dessiner(); }); if (e.marche) e.t += dt;
      vase.dessiner(); ecran.replaceChildren();
      L.texte(ecran, 765, 459, `${Math.floor(e.t)} s`, { "font-size": 12, "font-weight": 700, fill: e.marche ? "#ffb347" : "#7dff9a", "font-family": "monospace" });
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("chauffage", { nom: v.nom, m: Math.round(v.m), theta: Math.round(v.theta * 10) / 10, marche: e.marche, t: Math.round(e.t), essais: e.essais.slice() }), 250);
    return { pense_bete };
  };
})(window.Labo);

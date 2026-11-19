/*
Rôle : les deux paillasses de la rotation uniforme : (1) salle obscure : disque entraîné par un moteur, alimentation
       réglable, stroboscope ; (2) même disque, capteur optique à fourche et compteur-chronomètre. Chaque paillasse note
       ce que l'on règle et ce que l'on mesure.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_stroboscope(groupe), Labo.poste_fourche(groupe) -> { pense_bete } ; faits « strobo » = { U, f, allume, fe,
          images } et « fourche » = { U, f, r, mode, T, dt, passages }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, C = { x: 420, y: 310 };

  function alimentation(g, m, x, y) {
    // Alimentation du moteur : boîtier, bouton de réglage de 0 à 12 V.
    L.svg("rect", { x: x - 75, y: y - 72, width: 150, height: 110, rx: 6, fill: "#2c3e50", stroke: "#111" }, g);
    L.texte(g, x, y - 60, "ALIMENTATION MOTEUR", { "font-size": 7.5, "font-weight": 700, fill: "#e8ecef" });
    return L.bouton_reglage(g, { x, y, min: 0, max: 12, pas: 0.1, valeur: 0, unite: "V", titre: "tension", sur_changement: (v) => m.regler(v) });
  }

  const r3 = (v) => (v === null ? null : Math.round(v * 1e5) / 1e5);

  L.poste_stroboscope = function (g) {
    // Voile de la salle obscure (sous le disque et les appareils), pense-bête, disque, alimentation, stroboscope.
    const voile = L.svg("rect", { x: 0, y: 0, width: 1024, height: 640, fill: "#05070a", opacity: 0.9, "pointer-events": "none" }, g);
    voile.style.display = "none";
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    const m = L.disque_moteur(g, { x: C.x, y: C.y, e: 1.4, sol: SOL });
    const alim = alimentation(g, m, 790, 500), s = L.stroboscope(g, m, voile, { x: 820, y: 250 });
    setInterval(() => L.missions.noter("strobo", { U: alim.valeur(), f: Math.round(m.f() * 1000) / 1000, allume: s.allume, fe: Math.round(s.fe * 10) / 10, images: s.images }), 250);
    return { pense_bete };
  };

  L.poste_fourche = function (g) {
    // Disque, fourche optique et compteur, alimentation.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    const m = L.disque_moteur(g, { x: C.x, y: C.y, e: 1.4, sol: SOL });
    const alim = alimentation(g, m, 790, 500), fo = L.fourche_optique(g, m, { x: 790, y: 300 });
    L.svg("rect", { x: 720, y: 140, width: 140, height: 52, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0" }, g);
    L.texte(g, 790, 158, "Fentes : largeur 5,0 mm", { "font-size": 8.5, fill: "#222" });
    L.texte(g, 790, 174, "à 4, 6 et 8 cm de l'axe", { "font-size": 8.5, fill: "#222" });
    setInterval(() => L.missions.noter("fourche", { U: alim.valeur(), f: Math.round(m.f() * 1000) / 1000, r: fo.r, mode: fo.mode, T: r3(fo.T), dt: r3(fo.dt), passages: fo.passages }), 250);
    return { pense_bete };
  };
})(window.Labo);

/*
Rôle : paillasse des lignes de champ : cuve d'huile de ricin et de semoule, deux boîtes d'électrodes (deux pointes, deux
       plaques) que l'on pose dans la cuve, générateur haute tension (Marche/Arrêt) relié aux électrodes, bouton « Remuer »
       qui mélange les grains. Note quand les grains sont bien alignés pour chaque configuration.
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève.
Produit : Labo.poste_champ(g) -> { pense_bete } ; fait « champ » = { config, ht, alignement, vu: { pointes, plaques } }.
Utilisé par : simulation.js (paillasse 2).
*/
(function (L) {
  const BOITES = [{ config: "pointes", x: 190, y: 300, nom: "2 pointes" }, { config: "plaques", x: 190, y: 360, nom: "2 plaques" }];

  function boite(g, b, p) {
    // Boîte d'électrodes (à sa place ou tenue) ; vide quand ses électrodes sont dans la cuve.
    const gr = L.svg("g", { class: `boite-${b.config}`, role: "button", "aria-label": `Électrodes : ${b.nom}` }, g);
    L.svg("rect", { x: p.x - 46, y: p.y - 18, width: 92, height: 36, rx: 4, fill: "#2c3e50", stroke: "#111" }, gr);
    L.texte(gr, p.x, p.y - 4, "Électrodes", { "font-size": 7.5, fill: "#e8ecef" });
    L.texte(gr, p.x, p.y + 10, b.nom, { "font-size": 9, "font-weight": 700, fill: "#ffd27a" });
  }

  L.poste_champ = function (g) {
    // Générateur, câbles, cuve, boîtes d'électrodes ; boucle d'animation ; faits notés 4 fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), C = L.cuve_semoule.C;
    L.svg("rect", { x: 730, y: 420, width: 150, height: 90, rx: 6, fill: "#7a2a22", stroke: "#2b0f0c" }, g);
    L.texte(g, 805, 436, "HAUTE TENSION 6 kV", { "font-size": 8, "font-weight": 700, fill: "#fbe9e7" });
    for (const [x, col] of [[760, "#c0392b"], [850, "#1f4f8f"]]) L.svg("circle", { cx: x, cy: 452, r: 5, fill: col, stroke: "#000" }, g);
    const cuve = L.cuve_semoule(g), fils = L.svg("g", { "pointer-events": "none" }, g), e = { tenue: null, vu: { pointes: false, plaques: false } };
    L.bouton_texte(g, 805, 480, "Marche / Arrêt", () => { cuve.ht = !cuve.ht; });
    L.bouton_texte(g, 430, 560, "Remuer", () => cuve.remuer());
    const boites = L.svg("g", {}, g);
    L.glissable(boites, {
      soulever: false,
      debut: (ev) => { const b = BOITES.find((k) => ev.target.closest(`.boite-${k.config}`)); e.prise = b; return b && b.config !== cuve.config ? { x: b.x, y: b.y } : null; },
      deplacer: (p) => { e.tenue = p; },
      lacher: (p) => { if (cuve.dans(p)) { cuve.config = e.prise.config; cuve.remuer(); } e.tenue = null; },
    });
    let avant = null;
    const image = (t) => {
      cuve.tic(avant === null ? 0 : Math.min(0.05, (t - avant) / 1000)); avant = t;
      cuve.dessiner(); fils.replaceChildren(); boites.replaceChildren();
      if (cuve.config) for (const [x, col, u] of [[760, "#c0392b", -110], [850, "#1f4f8f", 110]]) L.svg("path", { d: `M${x} 452 C${x - 60} 360 ${C.x + u + 60} 300 ${C.x + u} ${C.y - (cuve.config === "plaques" ? 60 : 6)}`, fill: "none", stroke: col, "stroke-width": 2 }, fils);
      BOITES.forEach((b) => { if (b.config !== cuve.config) boite(boites, b, e.tenue && e.prise === b ? e.tenue : b); });
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => { const a = cuve.alignement(); if (cuve.ht && a > 0.85 && cuve.config) e.vu[cuve.config] = true; L.missions.noter("champ", { config: cuve.config, ht: cuve.ht, alignement: Math.round(a * 100) / 100, vu: { ...e.vu } }); }, 250);
    return { pense_bete };
  };
})(window.Labo);

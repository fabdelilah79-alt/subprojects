/*
Rôle : paillasse « champ terrestre et expérience d'Œrsted » : feuille avec une boussole ; fil de cuivre tendu dans la
       direction nord-sud, 1,5 cm au-dessus de la feuille, entre deux bornes isolantes, relié au générateur de courant
       (generateur_courant.js : 0 à 5 A, interrupteur, inverseur) ; teslamètre (composantes horizontale et verticale) ; boussole d'inclinaison ;
       document historique d'Œrsted au mur.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_terre(g) -> { pense_bete } ; faits « terre » = { BH, BV (T, courant coupé, loin du fil), devie,
          inverse }, « doc_oersted » (documents lus).
Utilisé par : simulation.js.
*/
(function (L) {
  const XF = -0.06, ZF = 0.015, DOC = { x: 350, y: 30, l: 260, h: 84, titre: "Œrsted (1820)", texte: "Au cours d'une leçon, le physicien danois Hans Christian Œrsted approche une boussole d'un fil parcouru par un courant : l'aiguille dévie, puis revient au nord quand le courant est coupé ; elle dévie dans l'autre sens quand on inverse le courant. C'est la première preuve qu'un courant électrique crée un champ magnétique." };

  function inclinaison(g, x, y) {
    // Boussole d'inclinaison vue de côté : cercle gradué vertical, aiguille inclinée de 46° (nord vers le bas).
    L.svg("rect", { x: x - 34, y: y + 44, width: 68, height: 8, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, `M${x} ${y + 44} V${y + 36}`, 3);
    L.svg("circle", { cx: x, cy: y, r: 36, fill: "#f7f3e6", stroke: "url(#laiton)", "stroke-width": 4 }, g);
    for (let a = 0; a < 360; a += 15) { const r = (a * Math.PI) / 180; L.svg("line", { x1: x + 30 * Math.cos(r), y1: y + 30 * Math.sin(r), x2: x + 34 * Math.cos(r), y2: y + 34 * Math.sin(r), stroke: "#555", "stroke-width": a % 90 ? 0.5 : 1 }, g); }
    L.svg("line", { x1: x - 34, y1: y, x2: x + 34, y2: y, stroke: "#999", "stroke-width": 0.6, "stroke-dasharray": "2 2" }, g);
    const c = Math.cos((46 * Math.PI) / 180), s = Math.sin((46 * Math.PI) / 180);
    L.svg("line", { x1: x, y1: y, x2: x - 28 * c, y2: y + 28 * s, stroke: "#d62d20", "stroke-width": 3 }, g);
    L.svg("line", { x1: x, y1: y, x2: x + 28 * c, y2: y - 28 * s, stroke: "#eee", "stroke-width": 3 }, g);
    L.svg("circle", { cx: x, cy: y, r: 2.5, fill: "#c9a227" }, g);
    L.texte(g, x, y + 60, "boussole d'inclinaison (nord ←)", { "font-size": 7.5, "font-weight": 700, fill: "#e8e2d4" });
  }

  function fil(g, plan) {
    // Fil tendu nord-sud au-dessus de la feuille (ombre portée sur la feuille), bornes isolantes, câbles du générateur.
    const h = ZF * 1100, a = plan.ecran({ x: XF, y: -0.095 }), b = plan.ecran({ x: XF, y: 0.095 });
    L.svg("line", { x1: a.x + 5, y1: a.y + 4, x2: b.x + 5, y2: b.y - 2, stroke: "#000", opacity: 0.2, "stroke-width": 2 }, g);
    for (const p of [a, b]) L.svg("rect", { x: p.x - 5, y: p.y - h - 4, width: 10, height: h + 6, rx: 2, fill: "#f0e6c8", stroke: "#8a7a4a" }, g);
    L.svg("line", { x1: a.x, y1: a.y - h, x2: b.x, y2: b.y - h, stroke: "#c8742e", "stroke-width": 2.2 }, g);
    L.svg("path", { d: `M${a.x} ${a.y - h - 2} V${a.y - h - 14} H222 V320 H204`, fill: "none", stroke: "#c62828", "stroke-width": 2.4, "stroke-linejoin": "round" }, g);
    L.svg("path", { d: `M${b.x} ${b.y - h + 2} V${b.y + 14} H222 V420 H204`, fill: "none", stroke: "#263238", "stroke-width": 2.4, "stroke-linejoin": "round" }, g);
  }

  L.poste_terre = function (g) {
    // Décor, document, feuille, boussole, fil, générateur, teslamètre ; animation et faits.
    const { pense_bete } = L.decor_circuit(g, 2), plan = L.plan_magnetique({ cx: 440, cy: 400, ex: 1800, ey: 1100, du: 0.12, dv: 0.08 });
    L.documents_mur(g, [DOC], "doc_oersted");
    L.plan_magnetique.feuille(L.svg("g", {}, g), plan); L.plan_magnetique.rose(g, plan);
    const e = { devie: 0 }, sources = () => [...L.champ_magnetique.terre(), ...L.champ_magnetique.fil({ x: XF, y: -0.5, z: ZF }, { x: XF, y: 0.5, z: ZF }, gen.intensite())];
    const champ = (p) => L.champ_magnetique.calculer(sources(), p);
    const bo = L.boussole(g, plan, { x: 0.02, y: -0.04, champ });
    const gen = L.generateur_courant(g, { x: 30, y: 290, max: 5, pas: 0.5, valeur: 3 });
    fil(g, plan);
    inclinaison(g, 920, 450);
    const t = L.teslametre(g, plan, { x: 860, y: 300, sonde: { x: 0.08, y: 0.05 }, champ });
    let avant = null;
    const image = (ms) => { const dt = avant === null ? 0 : Math.min(0.03, (ms - avant) / 1000); avant = ms; bo.tic(dt); bo.dessiner(); t.tic(); requestAnimationFrame(image); };
    requestAnimationFrame(image);
    setInterval(() => {
      // Champ terrestre : courant coupé, sonde loin du fil ; déviation de la boussole sous le fil, puis en sens inverse.
      if (!gen.ferme && Math.abs(t.sonde.x - XF) > 0.06) e[t.mode === "H" ? "BH" : "BV"] = t.valeur;
      const dev = Math.cos(bo.angle);
      if (gen.ferme && gen.I >= 2 && bo.stable && Math.abs(bo.x - XF) < 0.01 && Math.abs(dev) > 0.5) { if (!e.devie) e.devie = Math.sign(dev); else if (Math.sign(dev) !== e.devie) e.inverse = true; }
      L.missions.noter("terre", { ...e });
    }, 250);
    return { pense_bete };
  };
})(window.Labo);

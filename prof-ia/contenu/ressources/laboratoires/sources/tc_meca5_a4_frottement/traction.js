/*
Rôle : traction horizontale d'un pavé de bois posé sur la paillasse, avec un dynamomètre couché que l'on tire par son anneau.
       Le pavé reste immobile tant que la force est inférieure à k·P (frottement statique) ; il démarre alors, et un index
       noir garde la valeur maximale atteinte. Une masse de 200 g peut être posée sur le pavé.
Reçoit : le groupe SVG de la paillasse ; les gestes de l'élève (anneau du dynamomètre, pavé, masse).
Produit : Labo.traction(groupe) ; fait noté « traction » = { <charge en g> : force maximale (N) } au démarrage du pavé.
Utilisé par : simulation.js (paillasse 2).
*/
(function (L) {
  const G = 9.81, Y = 520, PX_N = 80, X0 = 300, VIDE = 300, CALIBRE = 2.5, M = L.PAVES.bois;

  function dynamometre(g, xh, xb, f_max) {
    // Tube gradué (0 à droite, la force croît vers la gauche), index rouge, index noir du maximum, anneau, tige et crochet.
    const zero = xh - 40, y = Y - 15, f = (xh - xb - VIDE) / PX_N;
    L.svg("rect", { x: xh - 250, y: y - 9, width: 220, height: 18, rx: 4, fill: "url(#plastique)", stroke: "#9aa6ac" }, g);
    for (let i = 0; i <= CALIBRE * 20; i++) {
      const x = zero - (i / 20) * PX_N, grand = i % 10 === 0;
      L.svg("line", { x1: x, y1: y - 9, x2: x, y2: y - 9 + (grand ? 8 : i % 2 ? 3 : 5), stroke: "#1d1d1d", "stroke-width": grand ? 0.8 : 0.4 }, g);
      if (grand) L.texte(g, x, y - 16, L.nombre(i / 20, 1), { "font-size": 8, fill: "#e9edf0" });
    }
    L.texte(g, xh - 262, y - 16, "N", { "font-size": 8, fill: "#e9edf0" });
    L.svg("rect", { x: zero - f_max * PX_N - 1, y: y - 7, width: 2, height: 14, fill: "#111" }, g);
    L.svg("rect", { x: zero - Math.min(CALIBRE, f) * PX_N - 1.5, y: y - 8, width: 3, height: 16, fill: "#e0251b" }, g);
    L.tige(g, `M${xb + 43} ${y} H${zero - Math.min(CALIBRE, f) * PX_N}`, 2.5);
    L.tige(g, `M${xh - 30} ${y} H${xh - 5}`, 3);
    L.svg("circle", { cx: xh + 4, cy: y, r: 9, fill: "none", stroke: "url(#metal)", "stroke-width": 3, class: "anneau-traction" }, g);
    L.svg("circle", { cx: xh + 4, cy: y, r: 16, fill: "#000", opacity: 0.001, class: "anneau-traction" }, g);
  }

  function avancer(e) {
    // Statique tant que F < k·P ; au démarrage, la force maximale est notée ; en glissement, F = k_dynamique·P.
    const P = (M.masse_kg + e.charge) * G, f = (e.xh - e.xb - VIDE) / PX_N;
    e.f_max = Math.max(e.f_max, Math.min(CALIBRE, f));
    if (!e.glisse && f >= M.statique * P) {
      e.glisse = true;
      e.mesures[Math.round(e.charge * 1000)] = Math.round(e.f_max * 100) / 100;
      L.missions.noter("traction", { ...e.mesures });
    }
    if (e.glisse) {
      const cible = e.xh - VIDE - M.dynamique * P * PX_N;
      e.xb += Math.max(0, cible - e.xb) * 0.25;
      if (cible - e.xb < 0.5) e.glisse = false;
    }
  }

  L.traction = function (g) {
    // Construit le poste et branche les gestes : tirer l'anneau, ramener le pavé, poser la masse.
    const e = { xb: X0, xh: X0 + VIDE, f_max: 0, charge: 0, glisse: false, mesures: {} }, calque = L.svg("g", {}, g);
    const dessiner = () => {
      calque.replaceChildren();
      L.dessiner_pave(calque, { x: e.xb, y: Y }, 0, "bois");
      L.traction_masse(calque, e, Y);
      dynamometre(calque, e.xh, e.xb, e.f_max);
    };
    L.traction_gestes(calque, e, { X0, VIDE, avancer, dessiner });
    dessiner();
  };
})(window.Labo);

/*
Rôle : outils de mesure posés sur la feuille d'enregistrement relevée :
       - transparent millimétré avec deux axes gradués (x vers la droite, y vers le haut) : là où l'on pose son
         origine O, on choisit le repère d'espace ;
       - règle transparente de 30 cm : on la fait glisser, et on la fait pivoter par sa poignée ronde (autour du zéro).
Reçoit : la feuille (Labo.Feuille) ; les gestes de l'élève.
Produit : Labo.transparent(feuille) -> { origine() en mm } ; Labo.regle(feuille) -> { zero(), angle() } ;
          faits notés : origine_repere (mm sur la feuille).
Utilisé par : les simulations de mouvement (repère, vitesse instantanée, MRU, MCU).
*/
(function (L) {
  const E = () => L.Feuille.ECHELLE, vf = (x, y) => L.Feuille.vers_feuille(x, y);

  function quadrillage(g, de_x, a_x, de_y, a_y) {
    // Lignes tous les millimètres (pâles), tous les 5 mm, tous les centimètres (plus foncées), en mm autour de O.
    for (const [axe, de, a] of [["x", de_x, a_x], ["y", de_y, a_y]]) {
      for (let v = de; v <= a; v++) {
        const opacite = v % 10 === 0 ? 0.55 : v % 5 === 0 ? 0.32 : 0.14;
        const ligne = axe === "x" ? { x1: v * E(), y1: -a_y * E(), x2: v * E(), y2: -de_y * E() } : { x1: de_x * E(), y1: -v * E(), x2: a_x * E(), y2: -v * E() };
        L.svg("line", { ...ligne, stroke: "#1f6fb2", "stroke-width": v % 10 === 0 ? 0.6 : 0.4, opacity: opacite }, g);
      }
    }
  }

  function axes(g, a_x, a_y) {
    // Axes Ox et Oy en rouge, graduations en cm, lettres O, x, y.
    L.svg("path", { d: `M${-20 * E()} 0 H${a_x * E()}`, stroke: "#c0392b", "stroke-width": 1.3, "marker-end": "url(#fleche-cote)" }, g);
    L.svg("path", { d: `M0 ${20 * E()} V${-a_y * E()}`, stroke: "#c0392b", "stroke-width": 1.3, "marker-end": "url(#fleche-cote)" }, g);
    for (let cm = 1; cm * 10 < a_x; cm++) L.texte(g, cm * 10 * E(), 8, String(cm), { "font-size": 6.5, fill: "#c0392b" });
    for (let cm = 1; cm * 10 < a_y; cm++) L.texte(g, -7, -cm * 10 * E(), String(cm), { "font-size": 6.5, fill: "#c0392b" });
    L.texte(g, -8, 8, "O", { "font-size": 9, "font-weight": 700, fill: "#c0392b" });
    L.texte(g, a_x * E() - 6, 10, "x (cm)", { "font-size": 8, fill: "#c0392b", "text-anchor": "end" });
    L.texte(g, 6, -a_y * E() + 4, "y (cm)", { "font-size": 8, fill: "#c0392b", "text-anchor": "start" });
  }

  L.transparent = function (feuille, depart = { x: 30, y: 370 }) {
    // Transparent millimétré déplaçable ; son origine O se cale au millimètre près.
    const g = L.svg("g", { class: "transparent-millimetre" }, feuille.outils);
    L.svg("rect", { x: -20 * E(), y: -360 * E(), width: 580 * E(), height: 380 * E(), fill: "#e8f3ff", opacity: 0.18, stroke: "#9cc3e6" }, g);
    quadrillage(g, -20, 560, -20, 360);
    axes(g, 560, 360);
    const etat = { o: { ...depart } };
    const placer = () => { const p = vf(etat.o.x, etat.o.y); L.placer(g, p.x, p.y); };
    L.glissable(g, {
      soulever: false,
      debut: () => vf(etat.o.x, etat.o.y),
      deplacer: (p) => { etat.o = { x: Math.round((p.x - vf(0, 0).x) / E()), y: Math.round((p.y - vf(0, 0).y) / E()) }; placer(); },
      lacher: () => L.missions.noter("origine_repere", { ...etat.o }),
    });
    placer();
    return { origine: () => ({ ...etat.o }) };
  };

  L.regle = function (feuille, depart = { x: 30, y: 330 }) {
    // Règle transparente de 30 cm, zéro à gauche ; la poignée ronde à droite la fait pivoter autour du zéro.
    const g = L.svg("g", { class: "regle-transparente" }, feuille.outils);
    const corps = L.svg("g", {}, g);
    L.svg("rect", { x: -6 * E(), y: 0, width: 312 * E(), height: 28 * E(), rx: 3, fill: "#f5fbff", opacity: 0.55, stroke: "#7aa7c9" }, corps);
    for (let mm = 0; mm <= 300; mm++) {
      const l = mm % 10 === 0 ? 7 : mm % 5 === 0 ? 5 : 3;
      L.svg("line", { x1: mm * E(), y1: 0, x2: mm * E(), y2: l * E(), stroke: "#123", "stroke-width": mm % 10 === 0 ? 0.6 : 0.35 }, corps);
      if (mm % 10 === 0) L.texte(corps, mm * E(), 11 * E(), String(mm / 10), { "font-size": 6.5, fill: "#123" });
    }
    const poignee = L.svg("circle", { cx: 300 * E(), cy: 20 * E(), r: 8, fill: "#f1d58a", stroke: "#8a6516", class: "poignee" }, g);
    const etat = { zero: { ...depart }, angle: 0 };
    const placer = () => { const p = vf(etat.zero.x, etat.zero.y); g.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${etat.angle})`); };
    L.glissable(corps, {
      soulever: false,
      debut: () => vf(etat.zero.x, etat.zero.y),
      deplacer: (p) => { etat.zero = { x: (p.x - vf(0, 0).x) / E(), y: (p.y - vf(0, 0).y) / E() }; placer(); },
    });
    L.glissable(poignee, {
      soulever: false,
      debut: () => { const p = vf(etat.zero.x, etat.zero.y), a = (etat.angle * Math.PI) / 180; return { x: p.x + 300 * E() * Math.cos(a), y: p.y + 300 * E() * Math.sin(a) }; },
      deplacer: (p) => { const o = vf(etat.zero.x, etat.zero.y); etat.angle = (Math.atan2(p.y - o.y, p.x - o.x) * 180) / Math.PI; placer(); },
    });
    placer();
    return { zero: () => ({ ...etat.zero }), angle: () => etat.angle };
  };
})(window.Labo);

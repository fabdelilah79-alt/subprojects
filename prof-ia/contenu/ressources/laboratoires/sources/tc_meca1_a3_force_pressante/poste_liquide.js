/*
Rôle : paillasse « La pression dans un liquide » : éprouvette géante remplie d'eau avec son échelle (cm),
       potence et noix de serrage que l'on fait glisser, capsule manométrique reliée par un tuyau au manomètre en U,
       baromètre au mur. La dénivellation vaut la profondeur (deux colonnes d'eau) : Δh = h.
Reçoit : le groupe SVG de la paillasse (décor déjà dessiné).
Produit : Labo.poste_liquide(groupe) -> { pense_bete } ; faits : capsule_profondeurs, capsule_profondeur_max, capsule_orientations.
Utilisé par : simulation.js.
*/
(function (L) {
  const X = 430, R = 62, HAUT = 196, FOND = 548, SURFACE = 262, PX_PAR_CM = 10;
  const TIGE = 300, BRAS = 150, NOIX = { min: 30, max: 330 };

  function eprouvette_fond(g) {
    // Verre (arrière), ombre, socle de l'éprouvette.
    L.ombre_sol(g, X + 10, FOND + 4, R + 30, 9, 0.5);
    L.svg("rect", { x: X - R, y: HAUT, width: 2 * R, height: FOND - HAUT, fill: "#dfeef3", opacity: 0.25 }, g);
    L.svg("ellipse", { cx: X, cy: FOND, rx: R + 14, ry: 9, fill: "url(#acier)" }, g);
  }

  function eprouvette_devant(g) {
    // Eau (devant la capsule, pour la teinter), surface, reflets du verre, échelle collée sur le verre.
    L.svg("rect", { x: X - R, y: SURFACE, width: 2 * R, height: FOND - SURFACE - 4, fill: "url(#eau)", opacity: 0.55 }, g);
    L.svg("ellipse", { cx: X, cy: SURFACE, rx: R, ry: 7, fill: "#bfe6f3", opacity: 0.6, stroke: "#7fc4dc", "stroke-width": 0.8 }, g);
    L.svg("rect", { x: X - R, y: HAUT, width: 2 * R, height: FOND - HAUT, fill: "url(#verre)", stroke: "#a9c3cc", "stroke-width": 1 }, g);
    L.svg("ellipse", { cx: X, cy: HAUT, rx: R, ry: 7, fill: "none", stroke: "#cfe3ea", "stroke-width": 2 }, g);
    L.svg("rect", { x: X - R + 4, y: SURFACE - 4, width: 18, height: 292, fill: "#fbfaf2", opacity: 0.92 }, g);
    for (let cm = 0; cm <= 28; cm++) {
      const y = SURFACE + cm * PX_PAR_CM;
      L.svg("line", { x1: X - R + 4, y1: y, x2: X - R + 4 + (cm % 5 === 0 ? 9 : 5), y2: y, stroke: "#1a1a1a", "stroke-width": 0.6 }, g);
      if (cm % 5 === 0) L.texte(g, X - R + 18, y, String(cm), { class: "graduation", "font-size": 6.5 });
      if (cm < 28) L.svg("line", { x1: X - R + 4, y1: y + 5, x2: X - R + 7, y2: y + 5, stroke: "#1a1a1a", "stroke-width": 0.35 }, g);
    }
    L.texte(g, X - R + 13, SURFACE - 10, "h (cm)", { class: "graduation", "font-size": 6.5 });
  }

  function potence(g) {
    // Socle et tige verticale sur lesquels coulisse la noix.
    L.ombre_sol(g, TIGE + 4, 548, 70, 8, 0.5);
    L.svg("path", { d: `M${TIGE - 60} 528 H${TIGE + 52} L${TIGE + 46} 540 H${TIGE - 66} Z`, fill: "#3a3f45" }, g);
    L.svg("rect", { x: TIGE - 66, y: 540, width: 112, height: 10, rx: 2, fill: "url(#acier)" }, g);
    L.svg("rect", { x: TIGE - 5, y: 14, width: 10, height: 522, fill: "url(#metal)" }, g);
  }

  function equipage(parent) {
    // Noix de serrage + bras horizontal + tube rigide + capsule : tout descend ensemble.
    const g = L.svg("g", { class: "equipage" }, parent);
    L.svg("rect", { x: TIGE - 13, y: -12, width: 26, height: 24, rx: 3, fill: "url(#acier)" }, g);
    L.svg("rect", { x: TIGE - 30, y: -4, width: 17, height: 8, rx: 2, fill: "#1b1e21" }, g);
    L.svg("circle", { cx: TIGE - 32, cy: 0, r: 6, fill: "#2a2e33", stroke: "#5f676e" }, g);
    L.svg("rect", { x: TIGE + 13, y: -3.5, width: X - TIGE - 13 + 6, height: 7, fill: "url(#metal-h)" }, g);
    L.svg("rect", { x: X - 8, y: -8, width: 16, height: 16, rx: 2, fill: "url(#acier)" }, g);
    const capsule = new L.Capsule(L.svg("g", { transform: `translate(${X} 8)` }, g), BRAS);
    return { g, capsule };
  }

  L.poste_liquide = function (g) {
    // Construit la paillasse et branche la noix, la capsule et le manomètre.
    L.barometre(g, 884, 176, 82);
    const manometre = new L.Manometre(g, 680, 96);
    potence(g);
    eprouvette_fond(g);
    const tuyau = L.svg("path", { fill: "none", stroke: "#3b3b3b", "stroke-width": 6, "stroke-linecap": "round" }, g);
    const eq = equipage(g);
    eprouvette_devant(L.svg("g", { "pointer-events": "none" }, g));
    const etat = { noix: 60, mesures: new Set(), max: 0, orientations: new Set(), reference: null, cible: null };
    const profondeur = () => Math.max(0, (etat.noix + 8 + BRAS - SURFACE) / PX_PAR_CM);

    function placer() {
      // Place l'équipage, le tuyau souple et met à jour la pression vue par le manomètre.
      eq.g.setAttribute("transform", `translate(0 ${etat.noix})`);
      const e = manometre.entree(), y = etat.noix - 8;
      tuyau.setAttribute("d", `M${X} ${y} C${X + 30} ${Math.max(24, y - 60)} ${e.x} ${Math.max(24, e.y - 80)} ${e.x} ${e.y}`);
      manometre.viser(profondeur());
    }

    function noter() {
      // Liquide immobile : on note la profondeur atteinte et les orientations essayées à cette profondeur.
      const h = profondeur();
      if (h < 0.5) return;
      etat.mesures.add(Math.round(h * 10) / 10);
      etat.max = Math.max(etat.max, h);
      if (etat.reference === null || Math.abs(etat.reference - h) > 0.3) { etat.reference = h; etat.orientations = new Set(); }
      etat.orientations.add(eq.capsule.orientation);
      L.missions.noter("capsule_profondeurs", [...etat.mesures]);
      L.missions.noter("capsule_profondeur_max", etat.max);
      L.missions.noter("capsule_orientations", etat.orientations.size);
    }

    manometre.sur_repos(noter);
    L.glissable(eq.g, {
      soulever: false,
      debut: (e) => { etat.cible = e.target.closest(".capsule"); return { x: 0, y: etat.noix }; },
      deplacer: (p) => { etat.noix = Math.max(NOIX.min, Math.min(NOIX.max, p.y)); placer(); },
      toucher: () => { if (etat.cible) { eq.capsule.tourner(); noter(); } },
    });
    placer();
    return { pense_bete: L.decor.pense_bete(g, 24, 52, 230) };
  };
})(window.Labo);

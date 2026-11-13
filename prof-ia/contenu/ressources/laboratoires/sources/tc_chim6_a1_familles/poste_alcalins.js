/*
Rôle : paillasse des métaux alcalins (démonstration derrière un écran de protection) : lithium, sodium et potassium
       conservés dans l'huile (petits flacons étiquetés, pictogrammes), une pince pour prendre un grain de métal, et trois
       cristallisoirs de 90 mm contenant de l'eau et quelques gouttes de phénolphtaléine. On lâche un grain au-dessus d'un
       cristallisoir propre : il réagit avec l'eau (alcalins.js). Lunettes exigées.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_alcalins(groupe) -> { pense_bete } ; fait « alcalins » = { lunettes, Li, Na, K (« pot », « eau » ou « fini ») }.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, METAUX = [["Li", "lithium", 214], ["Na", "sodium", 278], ["K", "potassium", 342]];

  function flacon(g, x, nom) {
    // Flacon d'huile de paraffine (36 × 56 mm) avec des morceaux de métal, étiquette et pictogrammes (inflammable, corrosif).
    L.svg("ellipse", { cx: x + 3, cy: SOL + 1, rx: 31, ry: 4, fill: "#000", opacity: 0.28 }, g);
    L.svg("rect", { x: x - 29, y: SOL - 90, width: 58, height: 90, rx: 6, fill: "rgba(214,232,238,0.55)", stroke: "#9fb6be" }, g);
    L.svg("rect", { x: x - 27, y: SOL - 70, width: 54, height: 68, rx: 4, fill: "#efe2a8", opacity: 0.5 }, g);
    for (const [dx, dy] of [[-12, 8], [8, 12], [-2, 18]]) L.svg("rect", { x: x + dx - 6, y: SOL - dy - 7, width: 12, height: 7, rx: 1.5, fill: "#9aa1a6", stroke: "#5d646a", "stroke-width": 0.4 }, g);
    L.svg("rect", { x: x - 25, y: SOL - 66, width: 50, height: 32, fill: "#fff", stroke: "#c9c4b0", "stroke-width": 0.4 }, g);
    L.texte(g, x, SOL - 58, nom, { "font-size": 7.4, "font-weight": 700, fill: "#222" });
    L.pictogramme(g, x - 10, SOL - 41, 12, "SGH02"); L.pictogramme(g, x + 10, SOL - 41, 12, "SGH05");
  }

  function pince(g, metal) {
    // Pince brucelles en inox qui tient un grain de métal (repère : grain en (0, 0), pince vers le haut à droite).
    g.replaceChildren();
    L.svg("path", { d: "M2 -2 L66 -108 M5 0 L71 -104", stroke: "url(#metal)", "stroke-width": 3, "stroke-linecap": "round" }, g);
    L.svg("path", { d: "M3 -1 L68 -106", stroke: "#000", "stroke-width": 16, opacity: 0 }, g);
    if (metal) L.svg("rect", { x: -5, y: -4, width: 10, height: 7, rx: 1.5, fill: "#9aa1a6", stroke: "#5d646a", "stroke-width": 0.5 }, g);
  }

  L.poste_alcalins = function (g) {
    // Écran de protection, flacons, pince, cristallisoirs ; un grain lâché au-dessus d'un cristallisoir réagit.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    L.ecoulement(ctx, { sol: SOL, e: E });
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 380, y: 236, width: 320, height: 26, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 540, 249, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    const epi = L.equipement(g, { x: 300, y: 70, changer: () => dire("") });
    L.svg("rect", { x: 380, y: 300, width: 440, height: 220, rx: 4, fill: "rgba(210,232,240,0.22)", stroke: "rgba(120,150,160,0.7)", "pointer-events": "none" }, ctx.devant);
    L.texte(ctx.devant, 600, 314, "ÉCRAN DE PROTECTION", { "font-size": 7, "font-weight": 700, fill: "#33414b", opacity: 0.6 });
    const etat = { Li: "pot", Na: "pot", K: "pot" }, noter = () => L.missions.noter("alcalins", { lunettes: epi.porte.lunettes, ...etat });
    const cristallisoirs = [440, 600, 760].map((x, k) => ({ r: L.recipient(ctx, { id: `cr${k}`, profil: "cristallisoir_90", x, y: SOL, contenu: { eau: 150, phenolphtaleine: 1 } }), libre: true }));
    cristallisoirs.forEach((c) => c.r.g.setAttribute("pointer-events", "none"));
    METAUX.forEach(([m, nom, x]) => {
      const p = L.svg("g", { class: `pince-${m}`, role: "button", "aria-label": `pince et ${nom}` }, ctx.fond), repos = { x: x - 4, y: SOL - 30 };
      flacon(ctx.fond, x, nom);
      const devant = p.nextSibling, ranger = () => { pince(p, false); L.placer(p, repos.x, repos.y); ctx.fond.insertBefore(p, devant); };
      L.glissable(p, {
        debut: () => { if (!epi.porte.lunettes) { dire("Mettez vos lunettes : la réaction peut projeter de la soude."); return null; } if (etat[m] !== "pot") { dire(`Le ${nom} a déjà été utilisé.`); return null; } dire(""); pince(p, true); return { ...repos }; },
        saisir: () => ctx.haut.append(p), deplacer: (q) => L.placer(p, q.x, q.y),
        lacher: (q) => {
          const c = cristallisoirs.find((o) => Math.abs(q.x - o.r.pose.x) < 60 && q.y > SOL - 140 && q.y < SOL - 50);
          if (c && !c.libre) dire("Ce cristallisoir a déjà servi : prenez-en un autre.");
          if (c && c.libre) { c.libre = false; etat[m] = "eau"; L.reaction_alcalin(ctx, c.r, m, () => { etat[m] = "fini"; noter(); }); noter(); }
          ranger();
        },
      });
      ranger();
    });
    noter();
    setInterval(noter, 500);
    return { pense_bete };
  };
})(window.Labo);

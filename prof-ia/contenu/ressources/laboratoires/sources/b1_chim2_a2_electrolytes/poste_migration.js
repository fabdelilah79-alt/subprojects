/*
Rôle : paillasse « migration des ions » : bande de papier filtre imbibée de solution de nitrate de potassium, posée sur une
       plaque de verre entre deux électrodes (pinces crocodiles) reliées à un générateur de 12 V ; flacon compte-gouttes
       d'un mélange de sulfate de cuivre et de permanganate de potassium : on dépose une goutte au milieu de la bande. Le
       générateur allumé, la tache bleue (ions Cu²⁺) avance vers l'électrode reliée à la borne −, la tache violette (ions
       MnO₄⁻) vers la borne + ; « Inverser » permute les bornes.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_migration(g) -> { pense_bete } ; fait « migration » = { depot, allume, inverse, cuivre (px parcourus vers la
          borne −), permanganate (px vers la borne +) }.
Utilisé par : simulation.js.
*/
(function (L) {
  const Y = 460, X1 = 300, X2 = 760, XC = 530, V = 4, FLACON = { x: 200, y: 430 };

  function plaque(g) {
    // Plaque de verre en perspective, bande de papier humide, électrodes et fils jusqu'au générateur.
    L.ombre_sol(g, 530, 506, 270, 10, 0.4);
    L.svg("path", { d: "M262 438 L798 438 L830 498 L230 498 Z", fill: "#e6f2f6", opacity: 0.6, stroke: "#9fb6be" }, g);
    L.svg("path", { d: `M${X1 - 20} ${Y - 10} H${X2 + 20} L${X2 + 26} ${Y + 12} H${X1 - 26} Z`, fill: "#eef3f1", stroke: "#c2cbc6" }, g);
    for (const [x, c] of [[X1 - 18, "#c62828"], [X2 + 18, "#111"]]) {
      L.svg("rect", { x: x - 12, y: Y - 14, width: 24, height: 10, rx: 3, fill: "url(#metal)", stroke: "#444" }, g);
      L.svg("path", { d: `M${x} ${Y - 14} C${x} ${Y - 70} ${c === "#111" ? 900 : 870} ${380} ${c === "#111" ? 900 : 870} ${440}`, fill: "none", stroke: c, "stroke-width": 2.6 }, g);
    }
  }

  function generateur(g, allume, inverse) {
    // Générateur 12 V : boîtier, voyant, bornes (la borne reliée à chaque électrode dépend du sens).
    g.replaceChildren();
    L.ombre_sol(g, 905, 512, 80, 6, 0.45);
    L.svg("rect", { x: 830, y: 430, width: 150, height: 80, rx: 6, fill: "#2f3a45", stroke: "#111" }, g);
    for (const [x, c] of [[870, "#c62828"], [900, "#111"]]) L.svg("circle", { cx: x, cy: 444, r: 5, fill: c, stroke: "#000" }, g);
    L.texte(g, 940, 448, "12 V ⎓", { "font-size": 8, "font-weight": 700, fill: "#e8e2cc" });
    L.svg("circle", { cx: 845, cy: 444, r: 5, fill: allume ? "#7cff8a" : "#34403a" }, g);
    L.texte(g, X1 - 18, Y + 32, inverse ? "borne −" : "borne +", { "font-size": 8, "font-weight": 700, fill: "#e8e2cc" });
    L.texte(g, X2 + 18, Y + 32, inverse ? "borne +" : "borne −", { "font-size": 8, "font-weight": 700, fill: "#e8e2cc" });
  }

  function taches(g, e) {
    // Taches sur le papier (ellipses aplaties par la perspective), plus larges avec le temps (diffusion).
    g.replaceChildren();
    if (!e.depot) return;
    const r = 7 + e.t * 0.12, vers_moins = e.inverse ? -1 : 1;
    L.svg("ellipse", { cx: e.x0 + vers_moins * e.cuivre, cy: Y + 1, rx: r, ry: r * 0.35, fill: "#2f7fd8", opacity: 0.75 }, g);
    L.svg("ellipse", { cx: e.x0 - vers_moins * e.permanganate, cy: Y + 1, rx: r * 0.9, ry: r * 0.32, fill: "#7b2a8f", opacity: 0.75 }, g);
  }

  function flacon(g, p, tenu) {
    // Flacon compte-gouttes du mélange (ou sa pipette tenue au-dessus de la bande).
    g.replaceChildren();
    if (!tenu) { L.svg("rect", { x: FLACON.x - 14, y: FLACON.y - 40, width: 28, height: 40, rx: 4, fill: "#5a4030", opacity: 0.85, stroke: "#2b1a10" }, g); L.texte(g, FLACON.x, FLACON.y + 12, "Cu²⁺ + MnO₄⁻", { "font-size": 7, "font-weight": 700, fill: "#e8e2cc" }); }
    L.svg("rect", { x: p.x - 3, y: p.y - 70, width: 6, height: 60, rx: 2, fill: "#e8f2f6", stroke: "#8fb3bd" }, g);
    L.svg("rect", { x: p.x - 6, y: p.y - 92, width: 12, height: 24, rx: 5, fill: "#1d1d1f" }, g);
  }

  L.poste_migration = function (g) {
    // Matériel, dépôt de la goutte, générateur ; déplacement des taches ; fait.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { depot: false, allume: false, inverse: false, x0: XC, cuivre: 0, permanganate: 0, t: 0, p: { ...FLACON }, tenu: false };
    plaque(L.svg("g", {}, g));
    const gg = L.svg("g", { "pointer-events": "none" }, g), gt = L.svg("g", { "pointer-events": "none" }, g), gp = L.svg("g", { class: "pipette", role: "button", "aria-label": "Pipette du mélange" }, g);
    const dessiner = () => { generateur(gg, e.allume, e.inverse); taches(gt, e); flacon(gp, e.p, e.tenu); };
    L.glissable(gp, { soulever: false, debut: () => { e.tenu = true; return { ...e.p }; }, deplacer: (p) => { e.p = p; dessiner(); },
      lacher: () => { if (Math.abs(e.p.x - XC) < 80 && Math.abs(e.p.y - 10 - Y) < 40) Object.assign(e, { depot: true, x0: e.p.x, cuivre: 0, permanganate: 0, t: 0 }); e.p = { ...FLACON }; e.tenu = false; dessiner(); } });
    L.bouton_texte(g, 868, 488, "Marche/Arrêt", () => { e.allume = !e.allume; dessiner(); });
    L.bouton_texte(g, 946, 488, "Inverser", () => { e.inverse = !e.inverse; [e.cuivre, e.permanganate] = [-e.cuivre, -e.permanganate]; dessiner(); });
    dessiner();
    setInterval(() => {
      // Pas de 0,1 s : les ions avancent quand le générateur est allumé (vitesse V px/s), sans quitter la bande.
      if (e.depot && e.allume) { e.t += 0.1; const lim = (s) => Math.min(Math.abs(X2 - e.x0), Math.abs(e.x0 - X1)) - 10 > s; if (lim(e.cuivre)) e.cuivre += V * 0.1; if (lim(e.permanganate)) e.permanganate += V * 0.85 * 0.1; dessiner(); }
      L.missions.noter("migration", { depot: e.depot, allume: e.allume, inverse: e.inverse, cuivre: Math.round(e.cuivre), permanganate: Math.round(e.permanganate) });
    }, 100);
    return { pense_bete };
  };
})(window.Labo);

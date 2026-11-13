/*
Rôle : balance électronique de laboratoire au centième de gramme (portée 200 g), aux vraies dimensions : boîtier gris clair,
       plateau rond en inox de 9 cm, afficheur à cristaux liquides, touches Marche/Arrêt et TARE. L'affichage monte vers la
       masse posée puis se stabilise (le signe « g » n'apparaît qu'une fois la mesure stable).
Reçoit : le contexte de la paillasse et { x (milieu), sol, e (px/mm) }.
Produit : Labo.balance_electronique(ctx, reglage) -> { plateau { x, y, r } (dessus du plateau), ajouter(objet), retirer(objet),
          lecture() (nombre affiché en g, ou null si éteinte ou instable), sur_changement(f) } ; un objet a une masse (g).
Utilisé par : les simulations de chimie (masse des atomes, quantité de matière).
*/
(function (L) {
  function boitier(g, x, sol, e) {
    // Boîtier vu un peu d'en haut : dessus incliné, face avant avec l'afficheur et les touches, pieds réglables.
    const l = 190 * e, h = 32 * e, p = 26 * e;
    L.svg("ellipse", { cx: x + 6, cy: sol, rx: l / 2 + 6, ry: 6, fill: "#000", opacity: 0.28, filter: "url(#flou)" }, g);
    L.svg("path", { d: `M${x - l / 2 + 12} ${sol - h - p} H${x + l / 2 - 12} L${x + l / 2} ${sol - h} H${x - l / 2} Z`, fill: "#e4e7e8", stroke: "#a9b0b4" }, g);
    L.svg("rect", { x: x - l / 2, y: sol - h, width: l, height: h - 3, rx: 4, fill: "#d3d8db", stroke: "#a0a8ad" }, g);
    for (const s of [-1, 1]) L.svg("rect", { x: x + s * (l / 2 - 16) - 6, y: sol - 4, width: 12, height: 4, rx: 1, fill: "#2b2f33" }, g);
    L.svg("rect", { x: x - 44, y: sol - h + 8, width: 88, height: 26, rx: 2, fill: "#2a3a30", stroke: "#56635a" }, g);
    L.texte(g, x - l / 2 + 26, sol - 12, "200 g × 0,01 g", { "font-size": 6.4, fill: "#4a5258", "font-weight": 700 });
  }

  function plateau(g, x, y, r) {
    // Plateau rond en inox posé sur son croisillon.
    L.svg("rect", { x: x - 6, y, width: 12, height: 8, fill: "#7d868c" }, g);
    L.svg("ellipse", { cx: x, cy: y + 3, rx: r, ry: r * 0.22, fill: "#8d969c" }, g);
    L.svg("ellipse", { cx: x, cy: y, rx: r, ry: r * 0.22, fill: "url(#metal-h)", stroke: "#7d868c" }, g);
    L.svg("ellipse", { cx: x - r * 0.25, cy: y - 1, rx: r * 0.45, ry: r * 0.06, fill: "#fff", opacity: 0.45 }, g);
  }

  L.balance_electronique = function (ctx, { x, sol, e = 1.6 }) {
    // Dessine la balance ; la lecture suit la masse posée moins la tare ; les touches allument et tarent.
    const h = 32 * e, b = { plateau: { x, y: sol - h - 16 * e, r: 45 * e }, objets: new Set(), allumee: false, tare: 0, affiche: 0, stable: true, ecouteurs: [] };
    boitier(ctx.fond, x, sol, e);
    plateau(ctx.fond, x, b.plateau.y, b.plateau.r);
    const ecran = L.svg("g", { "pointer-events": "none" }, ctx.devant);
    const vraie = () => [...b.objets].reduce((s, o) => s + o.masse, 0);
    const dessiner = () => {
      ecran.replaceChildren();
      if (!b.allumee) return;
      L.texte(ecran, x + 30, sol - h + 27, L.nombre(b.affiche, 2), { "font-size": 16, "font-family": "monospace", "text-anchor": "end", fill: "#9dffb0" });
      if (b.stable) L.texte(ecran, x + 38, sol - h + 27, "g", { "font-size": 10, "font-family": "monospace", fill: "#9dffb0" });
    };
    const prevenir = () => b.ecouteurs.forEach((f) => f());
    setInterval(() => {
      if (!b.allumee) return;
      const cible = Math.round((vraie() - b.tare) * 100) / 100, avant = b.affiche;
      b.affiche = Math.abs(cible - b.affiche) < 0.02 ? cible : b.affiche + (cible - b.affiche) * 0.45;
      b.stable = b.affiche === cible;
      if (b.affiche !== avant) { dessiner(); prevenir(); }
    }, 80);
    L.bouton_rond(ctx.haut, x - 60, sol - h + 21, "I/O", () => { b.allumee = !b.allumee; b.tare = vraie(); b.affiche = 0; b.stable = true; dessiner(); prevenir(); }, 8);
    L.bouton_rond(ctx.haut, x + 62, sol - h + 21, "T", () => { if (b.allumee) { b.tare = vraie(); b.affiche = 0; dessiner(); prevenir(); } }, 8);
    b.ajouter = (o) => { b.objets.add(o); prevenir(); };
    b.retirer = (o) => { b.objets.delete(o); prevenir(); };
    b.lecture = () => (b.allumee && b.stable ? b.affiche : null);
    b.sur_changement = (f) => b.ecouteurs.push(f);
    dessiner();
    return b;
  };
})(window.Labo);

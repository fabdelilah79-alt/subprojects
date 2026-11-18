/*
Rôle : agitateur magnétique aux vraies dimensions (boîtier de 150 mm × 60 mm, plateau blanc) : le récipient posé sur le
       plateau contient un barreau aimanté (25 mm) qui tourne quand l'agitateur est en marche ; on touche le bouton pour
       passer d'arrêt à lent puis à rapide (voyant vert). Le barreau est dessiné derrière la paroi avant du récipient (on
       le voit à travers le verre). Le plateau est un support pour Labo.manipuler.
Reçoit : le contexte de la paillasse et { x (milieu), sol, e (px/mm) }.
Produit : Labo.agitateur_magnetique(ctx, reglage) -> { station (support { x, y }), vitesse() (0, 1 ou 2),
          agite(r) (vrai si le récipient r est sur le plateau et que le barreau tourne), suivre(r) (dessine le barreau de r) }.
Utilisé par : les postes de titrage. Option « relief=1 » (relief.js) : boîtier dessiné en relief.
*/
(function (L) {
  const LARG = 150, HAUT = 60, BARREAU = 25;

  function boitier_relief(g, x, sol, e, vitesse) {
    // Variante en relief (option relief=1) : dessus vu d'en haut avec sa plaque de céramique, face avant ombrée, bouton
    // saillant, voyant qui luit ; le milieu du dessus reste à la hauteur de la station (sol - 60 mm).
    const l = LARG * e, p = 18 * e, h = HAUT * e - p / 2 - 3, k = L.boite_relief(g, x - l / 2, sol, l, h, p, { face: "#5d6870", dessus: "#c9d0d4" });
    L.svg("rect", { x: x - l / 2 + 12, y: k.dessus + 3, width: l - 24, height: p - 4, rx: 4, fill: "#f7f7f3", stroke: "#aeb3ac" }, g);
    L.svg("rect", { x: x - l / 2 + 16, y: k.dessus + 4.5, width: l - 32, height: 1.6, rx: 0.8, fill: "#fff" }, g);
    const bx = x + l * 0.3, by = sol - 28 * e, a = vitesse * 1.2 - 1.2;
    L.svg("circle", { cx: bx + 1.5, cy: by + 2.5, r: 9.5 * e, fill: "#000", opacity: 0.35 }, g);
    L.svg("circle", { cx: bx, cy: by, r: 9 * e, fill: "url(#acier)", stroke: "#111" }, g);
    L.svg("circle", { cx: bx, cy: by, r: 6 * e, fill: "#2a2f33" }, g);
    L.svg("line", { x1: bx, y1: by, x2: bx + 6 * e * Math.sin(a), y2: by - 6 * e * Math.cos(a), stroke: "#fff", "stroke-width": 1.8, "stroke-linecap": "round" }, g);
    if (vitesse) L.svg("circle", { cx: x + l * 0.12, cy: by, r: 6 * e, fill: "#5cff7a", opacity: 0.3 }, g);
    L.svg("circle", { cx: x + l * 0.12, cy: by, r: 2.6 * e, fill: vitesse ? "#5cff7a" : "#2c4a30", stroke: "#111" }, g);
    L.texte(g, x - l * 0.2, by - 6 * e, "AGITATEUR", { "font-size": 6.5, "font-weight": 700, fill: "#e8ecef" });
    L.texte(g, x - l * 0.2, by + 6 * e, ["arrêt", "lent", "rapide"][vitesse], { "font-size": 6, fill: "#cfd6db" });
  }

  function boitier(g, x, sol, e, vitesse) {
    // Boîtier gris, plateau blanc, bouton de réglage, voyant, inscription (en relief si l'option relief=1 est active).
    g.replaceChildren();
    if (L.relief) return boitier_relief(g, x, sol, e, vitesse);
    const y = sol - HAUT * e, l = LARG * e;
    L.ombre_sol(g, x, sol + 2, l * 0.55, 5, 0.4);
    L.svg("rect", { x: x - l / 2, y: y + 6 * e, width: l, height: (HAUT - 6) * e, rx: 4, fill: "#5d6870", stroke: "#2e353a" }, g);
    L.svg("rect", { x: x - l / 2 - 2, y, width: l + 4, height: 7 * e, rx: 2, fill: "#f4f5f2", stroke: "#a9ada6" }, g);
    L.svg("circle", { cx: x + l * 0.3, cy: y + 32 * e, r: 9 * e, fill: "url(#acier)", stroke: "#111" }, g);
    L.svg("line", { x1: x + l * 0.3, y1: y + 32 * e, x2: x + l * 0.3 + 7 * e * Math.sin(vitesse * 1.2 - 1.2), y2: y + 32 * e - 7 * e * Math.cos(vitesse * 1.2 - 1.2), stroke: "#fff", "stroke-width": 1.6 }, g);
    L.svg("circle", { cx: x + l * 0.12, cy: y + 32 * e, r: 2.6 * e, fill: vitesse ? "#5cff7a" : "#2c4a30", stroke: "#111" }, g);
    L.texte(g, x - l * 0.2, y + 26 * e, "AGITATEUR", { "font-size": 6.5, "font-weight": 700, fill: "#e8ecef" });
    L.texte(g, x - l * 0.2, y + 38 * e, ["arrêt", "lent", "rapide"][vitesse], { "font-size": 6, fill: "#cfd6db" });
  }

  L.agitateur_magnetique = function (ctx, { x, sol, e = 1 }) {
    // Boîtier (fond), bouton touchable ; barreau dessiné derrière la paroi du récipient posé, il tourne selon la vitesse.
    const a = { v: 0, angle: 0 }, g = L.svg("g", { class: "agitateur-magnetique" }, ctx.fond), gb = L.svg("g", { "pointer-events": "none" }, ctx.objets);
    const station = { x, y: sol - HAUT * e, station: true };
    const bouton = L.svg("circle", { cx: x + LARG * e * 0.3, cy: sol - HAUT * e + 32 * e, r: 14, fill: "#fff", opacity: 0.01, role: "button", "aria-label": "Vitesse de l'agitateur" }, ctx.haut);
    const dessiner = () => boitier(g, x, sol, e, a.v);
    L.glissable(bouton, { soulever: false, debut: () => ({ x, y: sol }), toucher: () => { a.v = (a.v + 1) % 3; dessiner(); } });
    dessiner();
    let suivi = null;
    const barreau = () => {
      // Barreau vu de face : sa longueur apparente varie comme |cos| de l'angle.
      gb.replaceChildren();
      if (!suivi || suivi.place !== station || suivi.tenu) return;
      if (gb.nextSibling !== suivi.g) ctx.objets.insertBefore(gb, suivi.g);
      a.angle += a.v * 0.35;
      const l = Math.max(4, BARREAU * e * Math.abs(Math.cos(a.angle)));
      L.svg("rect", { x: suivi.pose.x - l / 2, y: suivi.pose.y - 3 * e - 2, width: l, height: 6 * e, rx: 3 * e, fill: "#f6f6f2", stroke: "#9a9d96" }, gb);
    };
    setInterval(barreau, 60);
    return { station, vitesse: () => a.v, agite: (r) => a.v > 0 && r.place === station && !r.tenu, suivre: (r) => { suivi = r; } };
  };
})(window.Labo);

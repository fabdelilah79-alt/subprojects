/*
Rôle : paillasse « trois écrans percés » (vue de côté) : lampe à gauche, trois écrans de carton percés d'un petit trou, que
       l'on fait monter ou descendre, et l'œil à droite. La lumière de la lampe n'arrive à l'œil que si les trois trous sont
       alignés avec la lampe et l'œil : la lumière se propage en ligne droite.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_ecrans(g) -> { pense_bete } ; fait « ecrans » = { aligne, desaligne }.
Utilisé par : simulation.js.
*/
(function (L) {
  const Y = 340, XS = [430, 560, 690], LAMPE = 280, OEIL = 860;

  L.poste_ecrans = function (g) {
    // Lampe, écrans (glisser vertical), œil ; rayon arrêté au premier écran dont le trou n'est pas sur la droite.
    const { pense_bete } = L.decor_circuit(g, 2), e = { trous: [Y - 40, Y + 30, Y], aligne: false, desaligne: false };
    L.svg("rect", { x: 0, y: 160, width: 1024, height: 440, fill: "#000", opacity: 0.35 }, g);
    L.svg("rect", { x: LAMPE - 30, y: Y + 20, width: 60, height: 150, fill: "#3a3f44" }, g);
    L.svg("circle", { cx: LAMPE, cy: Y, r: 16, fill: "#fff6c2", stroke: "#c9a227", "stroke-width": 2 }, g);
    L.svg("circle", { cx: LAMPE, cy: Y, r: 30, fill: "#fff6c2", opacity: 0.18 }, g);
    L.svg("ellipse", { cx: OEIL, cy: Y, rx: 14, ry: 8, fill: "#fff", stroke: "#333" }, g);
    L.svg("circle", { cx: OEIL - 5, cy: Y, r: 4.5, fill: "#2b4a6a" }, g);
    L.texte(g, OEIL, Y + 24, "œil", { "font-size": 9, "font-weight": 700, fill: "#e8e2d4" });
    const rayon = L.svg("g", { "pointer-events": "none" }, g), cartons = XS.map((x, k) => L.svg("g", { class: "ecran-perce", role: "slider", "aria-label": `Écran ${k + 1}` }, g));
    const dessiner = () => {
      // Écrans à leur hauteur, rayon jusqu'au premier écran mal placé (ou jusqu'à l'œil), indication.
      cartons.forEach((c, k) => { c.replaceChildren(); const t = e.trous[k]; L.svg("rect", { x: XS[k] - 6, y: t - 90, width: 12, height: 180, fill: "#b08a5a", stroke: "#5a3f22" }, c); L.svg("rect", { x: XS[k] - 7, y: t - 3, width: 14, height: 6, fill: "#111" }, c); L.texte(c, XS[k], t + 102, `écran ${k + 1}`, { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" }); });
      rayon.replaceChildren();
      const k = e.trous.findIndex((t) => Math.abs(t - Y) > 4), fin = k < 0 ? OEIL - 14 : XS[k] - 6;
      L.rayon_lumineux(rayon, [{ x: LAMPE + 16, y: Y }, { x: fin, y: Y }], { couleur: "#ffd54f" });
      L.texte(rayon, 560, 210, k < 0 ? "l'œil voit la lampe" : "l'œil ne voit pas la lampe", { "font-size": 11, "font-weight": 700, fill: k < 0 ? "#9fe3a8" : "#ff8a80" });
      if (k < 0) e.aligne = true; else e.desaligne = true;
    };
    cartons.forEach((c, k) => L.glissable(c, { soulever: false, debut: () => ({ x: XS[k], y: e.trous[k] }), deplacer: (p) => { const y = Math.max(Y - 80, Math.min(Y + 80, p.y)); e.trous[k] = Math.abs(y - Y) < 5 ? Y : y; dessiner(); } }));
    dessiner();
    setInterval(() => L.missions.noter("ecrans", { aligne: e.aligne, desaligne: e.desaligne }), 250);
    return { pense_bete };
  };
})(window.Labo);

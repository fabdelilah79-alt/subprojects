/*
Rôle : paillasse « trois écrans percés » (vue de face) : lampe sur douille tenue par un pied, trois écrans de carton
       percés d'un petit trou, chacun tenu par une noix sur la tige d'un pied (on fait glisser la noix vers le haut ou vers
       le bas), élève assis à droite. La lumière n'arrive à l'œil que si les trois trous sont alignés avec la lampe et l'œil.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_ecrans(g) -> { pense_bete } ; fait « ecrans » = { aligne, desaligne }.
Utilisé par : simulation.js.
*/
(function (L) {
  const Y = 336, XS = [440, 570, 700], LAMPE = 280, OEIL = 884, SOL = 512;

  L.poste_ecrans = function (g) {
    // Lampe, écrans (glisser vertical), élève ; rayon arrêté au premier écran dont le trou n'est pas sur la droite.
    const { pense_bete } = L.decor_circuit(g, 2), e = { trous: [Y - 40, Y + 30, Y], aligne: false, desaligne: false };
    L.pied_support(g, LAMPE, SOL, Y + 30); L.noix(g, LAMPE, Y + 32); L.lampe_douille(g, { x: LAMPE, y: Y + 24, allumee: true });
    L.observateur(L.svg("g", {}, g), { x: OEIL, y: Y });
    const cartons = XS.map((x, k) => L.svg("g", { class: "ecran-perce", role: "slider", "aria-label": `Écran ${k + 1}` }, g)), rayon = L.svg("g", { "pointer-events": "none" }, g), info = L.svg("g", {}, g);
    const dessiner = () => {
      // Écrans à leur hauteur (le trou est à t) ; rayon qui passe par les trous alignés et s'arrête sur le premier écran mal
      // placé (ou arrive à l'œil) ; indication.
      cartons.forEach((c, k) => { c.replaceChildren(); L.pied_support(c, XS[k] - 4, SOL, Math.min(e.trous[k] + 62, SOL - 30)); L.ecran_perce(c, { x: XS[k], y: e.trous[k] - 4 }); L.texte(c, XS[k] - 6, SOL + 16, `écran ${k + 1}`, { "font-size": 8, "font-weight": 700, fill: "#e8e2d4" }); });
      rayon.replaceChildren(); info.replaceChildren();
      const k = e.trous.findIndex((t) => Math.abs(t - Y) > 4);
      let x0 = LAMPE + 18;
      for (let j = 0; j < (k < 0 ? XS.length : k + 1); j++) {
        // La lumière entre dans le trou (face gauche du carton) et ressort derrière le carton ; sinon, elle s'arrête sur le carton.
        L.rayon_lumineux(rayon, [{ x: x0, y: Y }, { x: XS[j] - 13, y: Y }], { couleur: "#ffd54f" });
        if (j === k) { L.svg("ellipse", { cx: XS[j] - 14, cy: Y, rx: 5, ry: 8, fill: "#ffe27a", opacity: 0.85 }, rayon); break; }
        L.svg("ellipse", { cx: XS[j] - 13, cy: Y, rx: 2.4, ry: 3.8, fill: "#fff4b0" }, rayon);
        x0 = XS[j] + 5;
      }
      if (k < 0) L.rayon_lumineux(rayon, [{ x: x0, y: Y }, { x: OEIL - 8, y: Y }], { couleur: "#ffd54f" });
      L.texte(info, 570, 200, k < 0 ? "l'élève voit la lampe à travers les trois trous" : "l'élève ne voit pas la lampe", { "font-size": 11, "font-weight": 700, fill: k < 0 ? "#9fe3a8" : "#ff8a80" });
      if (k < 0) e.aligne = true; else e.desaligne = true;
    };
    cartons.forEach((c, k) => L.glissable(c, { soulever: false, debut: () => ({ x: XS[k], y: e.trous[k] }), deplacer: (p) => { const y = Math.max(Y - 70, Math.min(Y + 70, p.y)); e.trous[k] = Math.abs(y - Y) < 5 ? Y : y; dessiner(); } }));
    dessiner();
    setInterval(() => L.missions.noter("ecrans", { aligne: e.aligne, desaligne: e.desaligne }), 250);
    return { pense_bete };
  };
})(window.Labo);

/*
Rôle : paillasse « conditions de vision » (salle dans l'obscurité) : lampe d'architecte que l'on allume ou éteint, livre
       posé à plat, élève assis à droite, carton opaque tenu par un pied, que l'on fait glisser. Les rayons tracés vont de
       la lampe au livre et du livre (qui diffuse) à l'œil, sauf si le carton les arrête ; une bulle dit ce que voit l'élève.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_vision(g) -> { pense_bete } ; fait « vision » = { eteinte, vu_livre, cache }.
Utilisé par : simulation.js.
*/
(function (L) {
  const LIVRE = { x: 500, y: 470 }, OEIL = { x: 872, y: 338 }, SOL = 522;

  function coupe(a, b, c) {
    // Vrai si le segment a-b traverse le carton (face de 108 px de haut, à x = c.x − 9).
    const xc = c.x - 9;
    if ((a.x - xc) * (b.x - xc) > 0) return false;
    const y = a.y + ((xc - a.x) / (b.x - a.x)) * (b.y - a.y);
    return Math.abs(y - (c.y + 4)) < 58;
  }

  function bulle(g, texte) {
    // Bulle de pensée de l'élève.
    g.replaceChildren();
    L.svg("rect", { x: 800, y: 182, width: 200, height: 48, rx: 12, fill: "#fdfdf8", stroke: "#999" }, g);
    L.svg("circle", { cx: 880, cy: 240, r: 5, fill: "#fdfdf8", stroke: "#999" }, g); L.svg("circle", { cx: 874, cy: 252, r: 3, fill: "#fdfdf8", stroke: "#999" }, g);
    L.texte(g, 900, 197, "Ce que je vois :", { "font-size": 8, "font-weight": 700, fill: "#333" });
    L.texte(g, 900, 215, texte, { "font-size": 10, "font-weight": 700, fill: "#1a3d7c" });
  }

  L.poste_vision = function (g) {
    // Décor, livre, élève, pénombre, lampe, carton saisissable, rayons et bulle ; faits.
    const { pense_bete } = L.decor_circuit(g, 1), e = { lampe: false, carton: { x: 395, y: 410 }, eteinte: false, vu_livre: false, cache: false };
    const livre = L.livre(L.svg("g", {}, g), { x: LIVRE.x, y: LIVRE.y, titre: "PHYSIQUE" });
    L.observateur(L.svg("g", {}, g), OEIL);
    const nuit = L.svg("rect", { x: 0, y: 166, width: 1024, height: 474, fill: "#000", "pointer-events": "none" }, g);
    const gl = L.svg("g", {}, g), nuit_lampe = L.svg("rect", { x: 0, y: 166, width: 1024, height: 474, fill: "#000", "pointer-events": "none" }, g);
    const rayons = L.svg("g", { "pointer-events": "none" }, g), carton = L.svg("g", { class: "carton", role: "button", "aria-label": "Carton opaque" }, g), gb = L.svg("g", {}, g);
    L.glissable(carton, { soulever: false, debut: () => ({ ...e.carton }), deplacer: (p) => { e.carton = { x: Math.max(380, Math.min(800, p.x)), y: Math.max(330, Math.min(410, p.y)) }; } });
    L.bouton_texte(g, 240, 548, "Lampe", () => { e.lampe = !e.lampe; });
    L.texte(g, 512, 180, "salle dans l'obscurité", { "font-size": 9, "font-weight": 700, fill: "#e8e2d4" });
    let vu = null;
    const image = () => {
      // Lampe et pénombre, rayons (arrêtés par le carton), carton et son pied, bulle.
      const c = e.carton, oeil = { x: OEIL.x - 6, y: OEIL.y }, cible = livre.dessus;
      gl.replaceChildren(); rayons.replaceChildren(); carton.replaceChildren();
      const { foyer } = L.lampe_bureau(gl, { x: 240, sol: 478, coude: { x: 214, y: 345 }, tete: { x: 275, y: 262 }, cible, allumee: e.lampe });
      nuit.setAttribute("opacity", e.lampe ? 0.32 : 0.62); nuit_lampe.setAttribute("opacity", e.lampe ? 0 : 0.5);
      const livre_vu = e.lampe && !coupe(cible, oeil, c), lampe_vue = e.lampe && !coupe(foyer, oeil, c);
      if (e.lampe) {
        for (const dx of [-45, 0, 45]) L.rayon_lumineux(rayons, [foyer, { x: cible.x + dx, y: cible.y }], { couleur: "#ffd54f", largeur: 1.3 });
        for (const dx of [-20, 25]) { const a = { x: cible.x + dx, y: cible.y }, b = oeil, f = coupe(a, b, c) ? { x: c.x - 22, y: a.y + ((c.x - 22 - a.x) / (b.x - a.x)) * (b.y - a.y) } : b; L.rayon_lumineux(rayons, [a, f], { couleur: "#9fe3a8", largeur: 1.1 }); }
      }
      L.pied_support(carton, c.x - 4, SOL, c.y + 66); L.ecran_perce(carton, { x: c.x, y: c.y, trou: false });
      const texte = [lampe_vue ? "la lampe" : "", livre_vu ? "le livre" : ""].filter(Boolean).join(" et ") || "rien (noir)";
      if (texte !== vu) { bulle(gb, texte); vu = texte; }
      if (!e.lampe) e.eteinte = true; else if (livre_vu) e.vu_livre = true; else if (coupe(cible, oeil, c)) e.cache = true;
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("vision", { eteinte: e.eteinte, vu_livre: e.vu_livre, cache: e.cache }), 250);
    return { pense_bete };
  };
})(window.Labo);

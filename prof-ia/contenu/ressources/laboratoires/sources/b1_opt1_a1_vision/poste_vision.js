/*
Rôle : paillasse « conditions de vision » (vue de côté, salle dans l'obscurité) : lampe de bureau que l'on allume ou éteint,
       livre posé sur la paillasse, observateur (œil) à droite, carton opaque que l'on fait glisser. Les rayons tracés vont de
       la lampe au livre et du livre (qui diffuse) à l'œil, sauf si le carton les arrête ; une bulle dit ce que voit l'élève.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_vision(g) -> { pense_bete } ; fait « vision » = { eteinte, vu_livre, cache }.
Utilisé par : simulation.js.
*/
(function (L) {
  const LAMPE = { x: 300, y: 250 }, LIVRE = { x: 520, y: 448 }, OEIL = { x: 842, y: 338 };

  function coupe(a, b, c) {
    // Vrai si le segment a-b traverse le carton (rectangle vertical de 16 × 130 px centré en c).
    if ((a.x - c.x) * (b.x - c.x) > 0 && Math.abs(a.x - c.x) > 8 && Math.abs(b.x - c.x) > 8) return false;
    const t = (c.x - a.x) / (b.x - a.x || 1e-6), y = a.y + t * (b.y - a.y);
    return t >= 0 && t <= 1 && Math.abs(y - c.y) < 65;
  }

  function fixe(g) {
    // Lampe de bureau, livre, tête de l'observateur.
    L.svg("rect", { x: 230, y: 470, width: 90, height: 10, rx: 3, fill: "#2b3035" }, g);
    L.tige(g, "M275 470 L250 330 L300 262", 5);
    L.svg("path", { d: `M282 236 L330 236 L348 268 L268 268 Z`, fill: "#3a6ea5", stroke: "#123" }, g);
    L.svg("rect", { x: LIVRE.x - 50, y: LIVRE.y - 14, width: 100, height: 26, rx: 2, fill: "#2f8f5b", stroke: "#14502f" }, g);
    L.svg("rect", { x: LIVRE.x - 50, y: LIVRE.y - 14, width: 100, height: 6, fill: "#f0ead6" }, g);
    L.svg("path", { d: "M930 470 C930 400 905 380 905 360 C905 340 890 335 878 330 C870 300 880 260 920 250 C980 240 1000 300 990 360 C985 400 980 430 990 470 Z", fill: "#e0b48e", stroke: "#8a5a3a" }, g);
    L.svg("ellipse", { cx: OEIL.x + 40, cy: OEIL.y, rx: 7, ry: 4, fill: "#fff", stroke: "#333" }, g);
    L.svg("circle", { cx: OEIL.x + 37, cy: OEIL.y, r: 2.3, fill: "#2b4a6a" }, g);
  }

  L.poste_vision = function (g) {
    // Décor sombre, matériel, rayons recalculés à chaque image, bulle ; faits.
    const { pense_bete } = L.decor_circuit(g, 1), e = { lampe: false, carton: { x: 700, y: 520 }, eteinte: false, vu_livre: false, cache: false };
    L.svg("rect", { x: 0, y: 160, width: 1024, height: 440, fill: "#000", opacity: 0.45 }, g);
    fixe(L.svg("g", {}, g));
    const ampoule = L.svg("ellipse", { cx: 308, cy: 270, rx: 16, ry: 6 }, g), rayons = L.svg("g", { "pointer-events": "none" }, g);
    const carton = L.svg("g", { class: "carton", role: "button", "aria-label": "Carton opaque" }, g), bulle = L.svg("g", {}, g);
    L.glissable(carton, { soulever: false, debut: () => ({ ...e.carton }), deplacer: (p) => { e.carton = { x: Math.max(380, Math.min(800, p.x)), y: Math.max(300, Math.min(520, p.y)) }; } });
    L.bouton_texte(g, 300, 548, "Lampe", () => { e.lampe = !e.lampe; });
    L.texte(g, 512, 196, "salle dans l'obscurité", { "font-size": 9, "font-weight": 700, fill: "#e8e2d4" });
    let avant = null;
    const image = () => {
      const c = e.carton, oeil = { x: OEIL.x + 30, y: OEIL.y }, livre_vu = e.lampe && !coupe(LIVRE, oeil, c), lampe_vue = e.lampe && !coupe({ x: 308, y: 270 }, oeil, c);
      ampoule.setAttribute("fill", e.lampe ? "#fff6c2" : "#7d7a6a");
      rayons.replaceChildren(); carton.replaceChildren(); bulle.replaceChildren();
      if (e.lampe) {
        for (const dx of [-40, 0, 40]) L.rayon_lumineux(rayons, [{ x: 308, y: 272 }, { x: LIVRE.x + dx, y: LIVRE.y - 14 }], { couleur: "#ffd54f", largeur: 1.4 });
        for (const dy of [-6, 6]) { const a = { x: LIVRE.x + 30, y: LIVRE.y - 14 }, b = { x: oeil.x, y: oeil.y + dy }, fin = coupe(a, b, c) ? { x: c.x - 8, y: a.y + ((c.x - 8 - a.x) / (b.x - a.x)) * (b.y - a.y) } : b; L.rayon_lumineux(rayons, [a, fin], { couleur: "#9fe3a8", largeur: 1.2 }); }
      }
      L.svg("rect", { x: c.x - 8, y: c.y - 65, width: 16, height: 130, rx: 2, fill: "#8a6a44", stroke: "#4a351c" }, carton);
      L.svg("rect", { x: 820, y: 180, width: 180, height: 46, rx: 8, fill: "#fdfdf8", stroke: "#999" }, bulle);
      L.texte(bulle, 910, 194, "Ce que je vois :", { "font-size": 8, "font-weight": 700, fill: "#333" });
      L.texte(bulle, 910, 212, [lampe_vue ? "la lampe" : "", livre_vu ? "le livre" : ""].filter(Boolean).join(" et ") || "rien (noir)", { "font-size": 9, "font-weight": 700, fill: "#1a3d7c" });
      if (!e.lampe) e.eteinte = true; else if (livre_vu) e.vu_livre = true; else if (coupe(LIVRE, oeil, c)) e.cache = true;
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter("vision", { eteinte: e.eteinte, vu_livre: e.vu_livre, cache: e.cache }), 250);
    return { pense_bete };
  };
})(window.Labo);

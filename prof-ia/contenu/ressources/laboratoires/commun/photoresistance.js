/*
Rôle : photorésistance (LDR) sur support : sa résistance diminue quand elle est plus éclairée, R = 1 kΩ·(E/1000 lx)^(−0,75).
       Éclairement de la salle 200 lx ; une lampe de poche, que l'élève approche ou éloigne, ajoute son éclairement
       (en 1/d²) ; un cache noir posé sur la photorésistance la met dans l'obscurité.
Reçoit : le circuit (circuit.js) et le réglage { id, x, y (support), lampe: { x, y }, cache: { x, y } (positions de départ) }.
Produit : Labo.photoresistance(c, reglage) -> composant { E (lx), R (Ω) } ; fait noté « ldr » = { E, cache }.
Utilisé par : les postes des simulations de caractéristiques.
*/
(function (L) {
  const SALLE = 200, LAMPE = 2000, D0 = 60, NOIR = 1;
  const resistance = (E) => 1000 * Math.pow(Math.max(E, 0.5) / 1000, -0.75);

  function dessiner_lampe(g, p) {
    // Lampe de poche allumée, couchée sur la paillasse, éclairant vers la gauche (faisceau jaune pâle).
    g.replaceChildren();
    L.svg("path", { d: `M${p.x - 6} ${p.y - 9} L${p.x - 90} ${p.y - 34} L${p.x - 90} ${p.y + 34} L${p.x - 6} ${p.y + 9} Z`, fill: "#fff6c2", opacity: 0.18 }, g);
    L.svg("rect", { x: p.x, y: p.y - 8, width: 70, height: 16, rx: 5, fill: "#2f5d8a", stroke: "#1b3854" }, g);
    L.svg("rect", { x: p.x - 8, y: p.y - 11, width: 12, height: 22, rx: 3, fill: "url(#metal)" }, g);
    L.svg("ellipse", { cx: p.x - 8, cy: p.y, rx: 3, ry: 9, fill: "#fff9d8" }, g);
    L.svg("rect", { x: p.x + 30, y: p.y - 3, width: 10, height: 6, rx: 2, fill: "#d9302c" }, g);
  }

  function dessiner_cache(g, p) {
    // Cache noir (capuchon opaque).
    g.replaceChildren();
    L.svg("ellipse", { cx: p.x + 2, cy: p.y + 14, rx: 18, ry: 6, fill: "#000", opacity: 0.3 }, g);
    L.svg("rect", { x: p.x - 16, y: p.y - 12, width: 32, height: 26, rx: 6, fill: "#16181a", stroke: "#000" }, g);
    L.texte(g, p.x, p.y + 1, "cache", { "font-size": 7, fill: "#9aa0a6" });
  }

  L.photoresistance = function (c, { id = "ldr", x, y, lampe, cache }) {
    // Support à deux bornes, cellule photosensible (piste en serpentin), lampe de poche et cache déplaçables.
    const comp = { id, E: SALLE, R: resistance(SALLE), g: L.svg("g", { class: "photoresistance" }, c.calque_composants) };
    L.support_dipole(c, comp, x, y, "Photorésistance");
    const cellule = { x: x + 46, y: y + 16 };
    L.svg("circle", { cx: cellule.x, cy: cellule.y, r: 10, fill: "#e8c26a", stroke: "#8d6f2c" }, comp.g);
    L.svg("path", { d: `M${cellule.x - 6} ${cellule.y - 5} h12 v3 h-12 v3 h12 v3 h-12`, fill: "none", stroke: "#a0522d", "stroke-width": 1.2 }, comp.g);
    const g_lampe = L.svg("g", { class: "lampe-poche", role: "button", "aria-label": "Lampe de poche" }, comp.g), g_cache = L.svg("g", { class: "cache", role: "button", "aria-label": "Cache noir" }, comp.g);
    let pl = { ...lampe }, pc = { ...cache };
    const mettre_a_jour = () => {
      const couvert = Math.hypot(pc.x - cellule.x, pc.y - cellule.y) < 14, d = Math.max(D0, Math.hypot(pl.x - 8 - cellule.x, pl.y - cellule.y));
      comp.E = couvert ? NOIR : SALLE + LAMPE * Math.pow(D0 / d, 2) * (pl.x > cellule.x ? 1 : 0);
      comp.R = resistance(comp.E);
      L.missions.noter("ldr", { E: Math.round(comp.E), cache: couvert });
      c.calculer();
    };
    dessiner_lampe(g_lampe, pl);
    dessiner_cache(g_cache, pc);
    L.glissable(g_lampe, { soulever: false, debut: () => ({ ...pl }), deplacer: (q) => { pl = q; dessiner_lampe(g_lampe, pl); }, lacher: mettre_a_jour });
    L.glissable(g_cache, { soulever: false, debut: () => ({ ...pc }), deplacer: (q) => { pc = q; dessiner_cache(g_cache, pc); }, lacher: mettre_a_jour });
    comp.dipoles = () => [{ a: "1", b: "2", g: 1 / comp.R, j: 0 }];
    return c.ajouter(comp);
  };
})(window.Labo);

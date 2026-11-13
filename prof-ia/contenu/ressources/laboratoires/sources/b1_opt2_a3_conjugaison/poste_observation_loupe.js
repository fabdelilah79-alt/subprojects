/*
Rôle : paillasse « la loupe » : coccinelle de 2 cm imprimée sur une carte tenue par un pied, loupe (f' = 5 cm) sur son pied
       que l'on fait glisser, élève qui regarde à travers (œil à 22 cm de la carte), règle graduée posée sur la paillasse ;
       vue « ce que voit l'œil » ; touche Rayons (construction de l'image et prolongements).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_observation_loupe(g) -> { pense_bete } ; fait « loupe » = { vus: [{ d, G, flou, virtuelle }], rayons_virtuelle }.
Utilisé par : simulation.js.
*/
(function (L) {
  const XA = 250, P = (x, y) => ({ x: XA + 20 * x, y: 330 - 20 * y }), SOL = 480;

  function carte(g) {
    // Pied, noix, carte vue de trois quarts, coccinelle imprimée (A sur l'axe, B à 2 cm).
    L.pied_support(g, XA, SOL, 352); L.noix(g, XA, 360);
    L.svg("path", { d: `M${XA - 15} ${270 + 2.4} L${XA + 15} ${270 - 2.4} V${352 - 2.4} L${XA - 15} ${352 + 2.4} Z`, fill: "#fbfaf4", stroke: "#a9a393" }, g);
    L.svg("path", { d: `M${XA + 15} ${270 - 2.4} l3 -1 V${351 - 2.4} l-3 1 Z`, fill: "#cfcabb" }, g);
    L.coccinelle(L.svg("g", { transform: `matrix(0.5 -0.08 0 1 ${XA} 310)` }, g), 0, 0, 20);
  }

  function regle(g) {
    // Règle de 30 cm posée devant le montage, zéro sous la carte.
    L.ombre_sol(g, 470, 516, 240, 5, 0.35);
    L.svg("rect", { x: XA - 20, y: 498, width: 490, height: 16, rx: 2, fill: "#f2e7c2", stroke: "#8f7f4f" }, g);
    for (let c = 0; c <= 23; c++) L.svg("line", { x1: P(c, 0).x, y1: 498, x2: P(c, 0).x, y2: 498 + (c % 5 ? 5 : 8), stroke: "#333", "stroke-width": 0.7 }, g);
    for (let c = 0; c <= 20; c += 5) L.texte(g, P(c, 0).x, 512, String(c), { "font-size": 6.5, "font-weight": 700, fill: "#333" });
  }

  function loupe(g, d) {
    // Loupe sur son pied : socle, tige, fourche, bague noire, verre (vu par la tranche), étiquette.
    g.replaceChildren();
    const x = P(d, 0).x;
    L.svg("rect", { x: x - 30, y: 280, width: 60, height: 200, fill: "#fff", opacity: 0.01 }, g);
    L.pied_support(g, x, SOL, 380);
    L.svg("path", { d: `M${x} 380 V374 M${x - 10} 372 H${x + 10}`, stroke: "#2b3035", "stroke-width": 4 }, g);
    L.svg("ellipse", { cx: x, cy: 330, rx: 8, ry: 42, fill: "#1e2226" }, g);
    L.svg("ellipse", { cx: x, cy: 330, rx: 5, ry: 38, fill: "#cfe8ef", opacity: 0.75 }, g);
    L.svg("ellipse", { cx: x - 2, cy: 318, rx: 1.4, ry: 12, fill: "#fff", opacity: 0.7 }, g);
    L.texte(g, x, 278, "loupe f' = 5 cm", { "font-size": 7, "font-weight": 700, fill: "#e8e2d4" });
  }

  L.poste_observation_loupe = function (g) {
    // Matériel, élève, loupe saisissable, vue de l'œil, rayons ; observations notées au lâcher.
    const { pense_bete } = L.decor_circuit(g, 1), e = { d: 9, rayons: false, vus: [], rayons_virtuelle: false };
    const fond = L.svg("g", {}, g); regle(fond); carte(fond); L.observateur(fond, { x: P(22, 0).x, y: 330 });
    const gl = L.svg("g", { class: "loupe", role: "slider", "aria-label": "Loupe" }, g), gr = L.svg("g", { "pointer-events": "none" }, g), gv = L.svg("g", { "pointer-events": "none" }, g);
    const dessiner = () => {
      // Loupe, rayons (si demandés), ce que voit l'œil.
      loupe(gl, e.d); const v = L.vision_loupe(e.d);
      if (e.rayons) { L.rayons_loupe(gr, e.d, P); if (v.virtuelle) e.rayons_virtuelle = true; } else gr.replaceChildren();
      L.vue_oeil(gv, v);
    };
    const noter = () => { const v = L.vision_loupe(e.d); e.vus.push({ d: e.d, G: Math.round(v.G * 10) / 10, flou: Math.round(v.flou * 10) / 10, virtuelle: v.virtuelle }); };
    L.glissable(gl, { soulever: false, debut: () => P(e.d, 0), deplacer: (p) => { e.d = Math.round(Math.max(1, Math.min(12, (p.x - XA) / 20)) * 10) / 10; dessiner(); }, lacher: noter });
    L.bouton_texte(g, 560, 560, "Rayons", () => { e.rayons = !e.rayons; dessiner(); });
    dessiner();
    setInterval(() => L.missions.noter("loupe", JSON.parse(JSON.stringify({ vus: e.vus, rayons_virtuelle: e.rayons_virtuelle }))), 250);
    return { pense_bete };
  };
})(window.Labo);

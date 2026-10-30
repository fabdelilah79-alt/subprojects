/*
Rôle : matériel de la paillasse du sodium : prise murale, alimentation 12 V (interrupteur ajouté par le poste), support
       élévateur (« boy ») et lanterne à lampe à incandescence (caisson à ailettes, condenseur), faisceau de lumière blanche,
       bécher d'eau salée, support à pince, anse en nichrome à manche isolant (dans le bécher ou dans la pince), flamme
       jaune du sodium par-dessus la flamme du bec Bunsen.
Reçoit : le groupe SVG et les positions ; l'état { lampe, anse, sel } pour ce qui change.
Produit : Labo.sodium_dessin = { fixe(g), lanterne(g, allumee), faisceau(g, allume), anse(g, position), flamme_sodium(g, x, haut, air), PRISE, AXE, SOL, XB }.
Utilisé par : poste_sodium.js (fichier nommé pour être chargé avant lui).
*/
(function (L) {
  const PRISE = { x: 62, y: 330 }, DX = 110, AXE = { y: 232, lentille: 284 + DX, fente: 726 }, SOL = 470, XB = 520, PINCE = { x: 640, y: 232 }, BECHER = { x: 700, y: SOL };

  function boy(g, x1, x2, haut) {
    // Support élévateur (« boy ») : plateau et embase en aluminium, double ciseau, vis de réglage et sa molette.
    const milieu = (haut + SOL - 8) / 2;
    L.ombre_sol(g, (x1 + x2) / 2, SOL + 3, (x2 - x1) / 2 + 8, 6, 0.4);
    L.svg("rect", { x: x1 - 4, y: SOL - 10, width: x2 - x1 + 8, height: 10, rx: 1.5, fill: "url(#metal-h)", stroke: "#5b646a" }, g);
    L.svg("rect", { x: x1, y: haut, width: x2 - x1, height: 7, rx: 1.5, fill: "url(#metal-h)", stroke: "#5b646a" }, g);
    for (const [ya, yb] of [[haut + 7, milieu], [milieu, SOL - 10]]) for (const [a, b] of [[x1 + 8, x2 - 8], [x2 - 8, x1 + 8]]) L.svg("line", { x1: a, y1: ya, x2: b, y2: yb, stroke: "#9aa3aa", "stroke-width": 5, "stroke-linecap": "round" }, g);
    L.svg("rect", { x: x1 + 2, y: milieu - 2, width: x2 - x1 + 14, height: 4, fill: "url(#acier)" }, g);
    for (const x of [x1 + 8, x2 - 8]) L.svg("circle", { cx: x, cy: milieu, r: 3.5, fill: "#5d646a", stroke: "#222", "stroke-width": 0.5 }, g);
    L.svg("rect", { x: x2 + 14, y: milieu - 8, width: 8, height: 16, rx: 2, fill: "#1b1e21" }, g);
  }

  function fixe(g) {
    // Prise, alimentation, boy, plaque du robinet de gaz, bécher, support à pince (tout ce qui ne bouge pas).
    L.svg("rect", { x: PRISE.x - 22, y: PRISE.y - 22, width: 44, height: 44, rx: 4, fill: "#f7f7f4", stroke: "#b8bbb4" }, g);
    L.cordon_secteur(g, { x: 70, y: SOL - 52 }, PRISE);
    L.boitier(g, 40, SOL - 62, 92, 22, 40, { dessus: "#d9dcd8", face: "#3b4248" });
    L.texte(g, 86, SOL - 8, "ALIM. 12 V", { "font-size": 6.5, "font-weight": 700, fill: "#dfe6ec" });
    L.svg("path", { d: `M132 ${SOL - 30} C170 ${SOL - 30} ${170 + DX} ${AXE.y + 40} ${170 + DX} ${AXE.y + 26}`, fill: "none", stroke: "#2b2b2b", "stroke-width": 2.5 }, g);
    boy(g, 150 + DX, 250 + DX, AXE.y + 28);
    L.svg("rect", { x: XB + 76, y: SOL - 178, width: 28, height: 46, rx: 3, fill: "#d5d8d4", stroke: "#9da19b" }, g);
    for (const dy of [-172, -138]) L.svg("circle", { cx: XB + 90, cy: SOL + dy, r: 1.6, fill: "#8d918b" }, g);
    L.svg("rect", { x: PINCE.x - 36, y: SOL - 8, width: 72, height: 8, rx: 2, fill: "#3a3f45" }, g);
    L.svg("rect", { x: PINCE.x - 2.5, y: PINCE.y - 30, width: 5, height: SOL - PINCE.y + 22, fill: "url(#metal)" }, g);
    L.svg("rect", { x: PINCE.x - 8, y: PINCE.y - 6, width: 16, height: 13, rx: 2, fill: "#2b3036", stroke: "#111" }, g);
    L.svg("rect", { x: PINCE.x - 36, y: PINCE.y - 2, width: 30, height: 4, fill: "url(#metal)" }, g);
    L.svg("path", { d: `M${PINCE.x - 36} ${PINCE.y - 6} h-10 v12 h10`, fill: "none", stroke: "#8a9196", "stroke-width": 2.5 }, g);
    L.ombre_sol(g, BECHER.x, BECHER.y + 2, 20, 4, 0.35);
    L.svg("rect", { x: BECHER.x - 15, y: BECHER.y - 26, width: 30, height: 18, fill: "#cfe6f2", opacity: 0.7 }, g);
    L.svg("path", { d: `M${BECHER.x - 16} ${BECHER.y - 40} V${BECHER.y} H${BECHER.x + 16} V${BECHER.y - 40}`, fill: "url(#verre)", stroke: "#9fb6be" }, g);
    L.svg("rect", { x: BECHER.x - 10, y: BECHER.y - 22, width: 20, height: 9, fill: "#fdfdf8", stroke: "#999", "stroke-width": 0.4 }, g);
    L.texte(g, BECHER.x, BECHER.y - 15.5, "NaCl", { "font-size": 6, fill: "#23315a" });
  }

  function lanterne(g, allumee) {
    // Lanterne : caisson noir à ailettes, chapeau, condenseur vers la droite ; la lumière filtre par les ailettes si elle brille.
    g.replaceChildren();
    L.svg("rect", { x: 160 + DX, y: AXE.y - 28, width: 82, height: 56, rx: 4, fill: "#23272b", stroke: "#000" }, g);
    for (let k = 0; k < 6; k++) L.svg("rect", { x: 168 + DX + k * 12, y: AXE.y - 34, width: 6, height: 8, fill: allumee ? "#ffe9a8" : "#3a3f44", opacity: allumee ? 0.8 : 1 }, g);
    L.svg("rect", { x: 242 + DX, y: AXE.y - 14, width: 40, height: 28, rx: 2, fill: "#2b2f33", stroke: "#000" }, g);
    L.svg("ellipse", { cx: 282 + DX, cy: AXE.y, rx: 4, ry: 13, fill: allumee ? "#fff6d0" : "#9fb6be", stroke: "#555" }, g);
    L.texte(g, 201 + DX, AXE.y + 4, "LAMPE 12 V", { "font-size": 6, "font-weight": 700, fill: "#c9ced2" });
  }

  function faisceau(g, allume) {
    // Faisceau de lumière blanche (à peine visible) de la lanterne à la fente du spectroscope.
    g.replaceChildren();
    if (allume) L.svg("path", { d: `M${AXE.lentille} ${AXE.y - 12} L${AXE.fente} ${AXE.y - 4} V${AXE.y + 4} L${AXE.lentille} ${AXE.y + 12} Z`, fill: "#fff6d0", opacity: 0.18 }, g);
  }

  function anse(g, position) {
    // Anse : manche noir isolant et fil de nichrome terminé par une boucle ; dans la pince (boucle dans la flamme) ou dans le bécher ;
    // une zone invisible autour d'elle la rend facile à toucher.
    g.replaceChildren();
    const [a, b, c] = position === "flamme" ? [{ x: PINCE.x - 20, y: PINCE.y }, { x: PINCE.x - 62, y: PINCE.y }, { x: XB + 6, y: PINCE.y + 2 }] : [{ x: BECHER.x + 22, y: BECHER.y - 86 }, { x: BECHER.x + 6, y: BECHER.y - 46 }, { x: BECHER.x - 2, y: BECHER.y - 16 }];
    L.svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "#1b1e21", "stroke-width": 5, "stroke-linecap": "round" }, g);
    L.svg("line", { x1: b.x, y1: b.y, x2: c.x, y2: c.y, stroke: "#9aa0a6", "stroke-width": 1.2 }, g);
    L.svg("circle", { cx: c.x, cy: c.y, r: 2.6, fill: "none", stroke: "#9aa0a6", "stroke-width": 1.2 }, g);
    const xs = [a.x, c.x], ys = [a.y, c.y];
    L.svg("rect", { x: Math.min(...xs) - 6, y: Math.min(...ys) - 8, width: Math.abs(a.x - c.x) + 12, height: Math.abs(a.y - c.y) + 16, fill: "#000", opacity: 0.001 }, g);
  }

  function flamme_sodium(g, x, haut, air) {
    // Flamme colorée en jaune orangé intense par le sodium.
    g.replaceChildren();
    const v = 1 + 0.05 * Math.sin(performance.now() / 80), h = (air ? 74 : 112) * v, l = air ? 13 : 16;
    L.svg("path", { d: `M${x - l} ${haut} Q${x - l - 3} ${haut - h * 0.55} ${x + 1} ${haut - h} Q${x + l + 2} ${haut - h * 0.5} ${x + l} ${haut} Z`, fill: "#ffa000", opacity: 0.85 }, g);
    L.svg("path", { d: `M${x - 7} ${haut} Q${x - 7} ${haut - h * 0.4} ${x} ${haut - h * 0.7} Q${x + 7} ${haut - h * 0.4} ${x + 7} ${haut} Z`, fill: "#ffe066", opacity: 0.9 }, g);
  }

  L.sodium_dessin = { fixe, lanterne, faisceau, anse, flamme_sodium, PRISE, AXE, SOL, XB };
})(window.Labo);

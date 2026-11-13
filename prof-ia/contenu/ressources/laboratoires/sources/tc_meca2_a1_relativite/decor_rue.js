/*
Rôle : décor de la rue, dessiné en mètres dans le référentiel terrestre (il défile quand on filme depuis le vélo) :
       ciel, immeubles aux fenêtres à volets, palmier, lampadaire, trottoir, route et marquage, caméra sur trépied.
Reçoit : le groupe SVG (déplacé horizontalement par la caméra choisie).
Produit : Labo.decor_rue(groupe) -> { camera_fixe } (groupe de la caméra sur trépied) ; Labo.RUE (sol, échelle).
Utilisé par : poste_rue.js.
*/
(function (L) {
  const PX = 100, SOL = 490, DE = -30, A = 50, ETAGE = 64;

  function immeubles(g) {
    // Façades de 3 à 5 étages, enduit clair, fenêtres à volets verts, de -30 m à 50 m.
    const couleurs = ["#e9dcc4", "#f1e7d6", "#e2cfb2", "#ece4d8"];
    let x = DE, i = 0;
    while (x < A) {
      const l = 5 + (i % 3) * 1.5, etages = 3 + (i % 3);
      const haut = SOL - 50 - etages * ETAGE;
      L.svg("rect", { x: x * PX, y: haut, width: l * PX - 6, height: SOL - 50 - haut, fill: couleurs[i % 4], stroke: "#cbbd9f" }, g);
      for (let e = 0; e < etages; e++) {
        for (let f = 0; f < Math.floor(l / 1.6); f++) {
          const fx = x * PX + 40 + f * 160, fy = haut + 14 + e * ETAGE;
          L.svg("rect", { x: fx, y: fy, width: 44, height: 40, fill: "#3d566e", stroke: "#f6f1e6", "stroke-width": 3 }, g);
          L.svg("rect", { x: fx - 16, y: fy, width: 14, height: 40, fill: "#2f7d55" }, g);
          L.svg("rect", { x: fx + 46, y: fy, width: 14, height: 40, fill: "#2f7d55" }, g);
        }
      }
      x += l;
      i++;
    }
  }

  function palmier(g, x) {
    // Palmier sur le trottoir.
    L.svg("path", { d: `M${x} ${SOL - 44} C${x + 6} ${SOL - 140} ${x - 6} ${SOL - 220} ${x + 4} ${SOL - 290}`, fill: "none", stroke: "#8a6a45", "stroke-width": 12 }, g);
    for (const a of [-2.6, -2.1, -1.5, -0.9, -0.4]) {
      L.svg("path", { d: `M${x + 4} ${SOL - 290} q${Math.cos(a) * 60} ${Math.sin(a) * 40 - 10} ${Math.cos(a) * 110} ${Math.sin(a) * 60 + 40}`, fill: "none", stroke: "#3f7d3a", "stroke-width": 7, "stroke-linecap": "round" }, g);
    }
  }

  function lampadaire(g, x) {
    // Lampadaire en fonte.
    L.tige(g, `M${x} ${SOL - 44} V${SOL - 300} Q${x} ${SOL - 320} ${x + 30} ${SOL - 320}`, 5);
    L.svg("path", { d: `M${x + 22} ${SOL - 324} h22 l-4 10 h-14 Z`, fill: "#2a2e33" }, g);
  }

  function chaussee(g) {
    // Trottoir (bordure), route, marquage blanc discontinu.
    L.svg("rect", { x: DE * PX, y: SOL - 50, width: (A - DE) * PX, height: 34, fill: "#bdb6a8" }, g);
    L.svg("rect", { x: DE * PX, y: SOL - 16, width: (A - DE) * PX, height: 8, fill: "#8e887c" }, g);
    L.svg("rect", { x: DE * PX, y: SOL - 8, width: (A - DE) * PX, height: 90, fill: "#4a4d50" }, g);
    for (let x = DE; x < A; x += 3) L.svg("rect", { x: x * PX, y: SOL + 44, width: 150, height: 6, fill: "#e9e9e4" }, g);
  }

  function camera_trepied(g, x) {
    // Caméra fixe sur trépied, posée au bord du trottoir.
    const c = L.svg("g", { class: "camera-fixe", role: "button", tabindex: 0, "aria-label": "Regarder avec la caméra fixe" }, g);
    L.svg("path", { d: `M${x} ${SOL - 82} L${x - 24} ${SOL - 30} M${x} ${SOL - 82} L${x + 24} ${SOL - 30} M${x} ${SOL - 82} V${SOL - 34}`, stroke: "#2a2e33", "stroke-width": 3 }, c);
    L.svg("rect", { x: x - 22, y: SOL - 110, width: 40, height: 26, rx: 3, fill: "#1b1e21" }, c);
    L.svg("circle", { cx: x + 22, cy: SOL - 97, r: 9, fill: "#3f6ea8", stroke: "#111", "stroke-width": 2 }, c);
    L.svg("circle", { cx: x - 14, cy: SOL - 104, r: 2.5, fill: "#e8513f" }, c);
    return c;
  }

  L.decor_rue = function (g) {
    // Dessine toute la rue et renvoie la caméra sur trépied.
    immeubles(g);
    chaussee(g);
    palmier(g, 7.2 * PX);
    palmier(g, 22 * PX);
    lampadaire(g, 3.2 * PX);
    lampadaire(g, 16 * PX);
    return { camera_fixe: camera_trepied(g, 1.3 * PX) };
  };

  L.RUE = { PX, SOL };
})(window.Labo);

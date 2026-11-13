/*
Rôle : préparations pour le microscope : boîte de lames posée sur la paillasse, lame de verre (étiquette, préparation),
       et ce que l'on voit au microscope : épiderme d'oignon coloré au lugol (cellules de 0,25 mm × 0,06 mm, parois, noyaux)
       ou micromètre objet (1 mm divisé en 100) ; vue « dans l'oculaire » (champ = 18 mm / grandissement de l'objectif avec
       l'oculaire ×10, 12 mm avec ×20 ; flou de mise au point ; grossissement « à vide » au-delà de 500 environ).
Reçoit : les groupes SVG, le nom de la lame, l'objectif, l'oculaire, la lampe, le flou.
Produit : Labo.LAMES ; Labo.boite_lames(g) ; Labo.lame_dessin(g, x, y, nom) ; Labo.vue_microscope(g, reglage) -> { champ (mm) }.
Utilisé par : poste_microscope.js.
*/
(function (L) {
  const LAMES = L.LAMES = { oignon: "épiderme d'oignon", micrometre: "micromètre objet" };
  const hasard = (i, j) => { const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; return s - Math.floor(s); };

  L.boite_lames = function (g) {
    // Boîte de bois ouverte, deux logements.
    L.ombre_sol(g, 130, 498, 74, 6, 0.4);
    L.svg("rect", { x: 58, y: 446, width: 144, height: 48, rx: 4, fill: "url(#bois)", stroke: "#6d4a26" }, g);
    L.svg("rect", { x: 64, y: 452, width: 132, height: 36, rx: 2, fill: "#5a3c1e" }, g);
    L.texte(g, 130, 506, "boîte de lames", { "font-size": 7, "font-weight": 700, fill: "#e8e2d4" });
  };

  L.lame_dessin = function (g, x, y, nom) {
    // Lame de verre de 76 mm (vue de dessus), étiquette, tache de la préparation (lamelle).
    L.svg("rect", { x: x - 38, y: y - 6, width: 76, height: 12, rx: 1, fill: "#d8eef3", opacity: 0.9, stroke: "#8fb3bd" }, g);
    L.svg("rect", { x: x - 38, y: y - 6, width: 22, height: 12, fill: "#f4f1e4" }, g);
    L.texte(g, x - 27, y + 2, nom === "oignon" ? "oignon" : "1 mm/100", { "font-size": 4.6, "font-weight": 700, fill: "#333" });
    L.svg("rect", { x: x + 2, y: y - 5, width: 16, height: 10, fill: nom === "oignon" ? "#e0b45a" : "#ffffff", opacity: nom === "oignon" ? 0.6 : 0.4, stroke: "#9bb", "stroke-width": 0.4 }, g);
  };

  function oignon(g, k, R) {
    // Cellules en rangées décalées ; parois en un seul tracé ; noyaux quand ils sont assez grands (k : px par mm).
    const h = 0.06 * k, l = 0.25 * k, n = Math.ceil(R / h) + 1, m = Math.ceil(R / l) + 1;
    let d = "";
    for (let i = -n; i <= n; i++) {
      d += `M${-R} ${i * h} H${R} `;
      for (let j = -m; j <= m; j++) { const x = (j + (i % 2 ? 0.5 : 0) + 0.2 * (hasard(i, j) - 0.5)) * l; d += `M${x} ${i * h} V${(i + 1) * h} `; }
    }
    L.svg("rect", { x: -R, y: -R, width: 2 * R, height: 2 * R, fill: "#e9c97a" }, g);
    L.svg("path", { d, fill: "none", stroke: "#8a5a1c", "stroke-width": Math.max(0.5, 0.004 * k) }, g);
    if (0.02 * k < 2) return;
    for (let i = -n; i <= n; i++) for (let j = -m; j <= m; j++) L.svg("ellipse", { cx: (j + (i % 2 ? 0.5 : 0) + 0.6 * hasard(j, i) - 0.3) * l + l / 2, cy: (i + 0.5) * h, rx: 0.012 * k, ry: 0.009 * k, fill: "#7a4a12", opacity: 0.8 }, g);
  }

  function micrometre(g, k) {
    // 1 mm divisé en 100 : traits de 0,01 mm, traits longs tous les 0,1 mm, chiffres de 0 à 10.
    const e = Math.max(0.7, 0.002 * k);
    for (let n = 0; n <= 100; n++) { const x = (n / 100 - 0.5) * k, h = (n % 10 ? (n % 5 ? 0.02 : 0.03) : 0.045) * k; L.svg("line", { x1: x, y1: 0, x2: x, y2: -h, stroke: "#111", "stroke-width": e }, g); }
    L.svg("line", { x1: -0.5 * k, y1: 0, x2: 0.5 * k, y2: 0, stroke: "#111", "stroke-width": e }, g);
    if (0.1 * k > 16) for (let n = 0; n <= 10; n++) L.texte(g, (n / 10 - 0.5) * k, -0.045 * k - 5, String(n), { "font-size": 9, "font-weight": 700, fill: "#111" });
  }

  L.vue_microscope = function (g, { lame, obj, oculaire, lampe, flou }) {
    // Disque de l'oculaire : préparation à l'échelle du champ, floue ou nette, plus sombre aux forts grossissements.
    const G = L.MICRO.OBJ[obj].g * oculaire, champ = (oculaire === 10 ? 18 : 12) / L.MICRO.OBJ[obj].g, V = { x: 770, y: 320, r: 140 };
    const k = (2 * V.r) / champ, vide = Math.max(0, (G - 450) / 140);
    L.vue_instrument(g, { ...V, titre: "dans l'oculaire", fond: "#f6f3e8", G: 1, flou: Math.min(12, flou + vide), noir: !lampe, sujet: (s) => { if (lame === "oignon") oignon(s, k, V.r); if (lame === "micrometre") micrometre(s, k); } });
    if (lampe) L.svg("circle", { cx: V.x, cy: V.y, r: V.r, fill: "#000", opacity: 0.1 * obj + (oculaire === 20 ? 0.18 : 0), "pointer-events": "none" }, g);
    return { champ, G };
  };
})(window.Labo);

/*
Rôle : matériel de la déviation magnétique (échelle 0,9 px/mm) : deux bobines de Helmholtz (130 spires, rayon 15 cm, carcasses
       noires, bobinage de cuivre, pieds, douilles) sur leur planche, vues dans l'axe ; entre elles le tube à faisceau filiforme
       (ampoule de 16 cm remplie d'hydrogène sous faible pression, canon à électrons en bas, réglette de repères lumineux tous
       les 2 cm au-dessus de la sortie du canon) ; alimentation du tube (chauffage 6,3 V~, tension accélératrice U) et
       alimentation des bobines (0 – 3 A continu) ; cordons de sécurité ; une seconde prise murale.
Reçoit : le groupe SVG ; pour la trace, la liste des points (px).
Produit : Labo.bobines_dessin = { fond(g), trace(g, pts, chauffe), vers_px(x, y) (m depuis la sortie du canon), SORTIE, SPHERE, BOITE1, BOITE2 }.
Utilisé par : poste_champ_magnetique.js (fichier nommé pour être chargé avant lui).
*/
(function (L) {
  const K = 900, C = { x: 360, y: 315 }, SPHERE = { x: 360, y: 315, r: 72 }, SORTIE = { x: 360, y: 368 }, SOL = 470;
  const BOITE1 = { x: 560, y: SOL - 120 }, BOITE2 = { x: 770, y: SOL - 120 };
  const vers_px = (x, y) => ({ x: SORTIE.x + x * K, y: SORTIE.y - y * K });

  function bobine(g, dx, dy, avant) {
    // Une bobine : carcasse noire en anneau, bobinage de cuivre visible sur la tranche, pied.
    const x = C.x + dx, y = C.y + dy;
    L.svg("rect", { x: x - 14, y: y + 135, width: 28, height: SOL - y - 135, fill: "#1b1e21" }, g);
    L.svg("circle", { cx: x, cy: y, r: 135, fill: "none", stroke: "#202428", "stroke-width": 20 }, g);
    L.svg("circle", { cx: x, cy: y, r: 135, fill: "none", stroke: "#b8692f", "stroke-width": 10, opacity: avant ? 0.9 : 0.6 }, g);
    for (let k = 0; k < 40; k++) { const a = (k / 40) * 2 * Math.PI; L.svg("line", { x1: x + 131 * Math.cos(a), y1: y + 131 * Math.sin(a), x2: x + 139 * Math.cos(a), y2: y + 139 * Math.sin(a), stroke: "#7a3f15", "stroke-width": 0.6, opacity: 0.6 }, g); }
  }

  function tube(g) {
    // Ampoule, col et canon en bas, réglette de repères (2 à 12 cm), culot et ses douilles.
    L.svg("rect", { x: SPHERE.x - 16, y: SPHERE.y + 60, width: 32, height: 44, rx: 4, fill: "url(#verre)", stroke: "#9fb6be" }, g);
    L.svg("circle", { cx: SPHERE.x, cy: SPHERE.y, r: SPHERE.r, fill: "url(#verre)", stroke: "#9fb6be", "stroke-width": 1.2, opacity: 0.9 }, g);
    L.svg("ellipse", { cx: SPHERE.x - 26, cy: SPHERE.y - 36, rx: 18, ry: 10, fill: "#fff", opacity: 0.25 }, g);
    L.svg("rect", { x: SORTIE.x - 22, y: SORTIE.y - 4, width: 22, height: 9, rx: 2, fill: "#7a8288", stroke: "#4b5258" }, g);
    L.svg("rect", { x: SORTIE.x - 1, y: SORTIE.y - 6, width: 3, height: 13, fill: "#9aa3aa" }, g);
    L.svg("line", { x1: SORTIE.x, y1: SORTIE.y - 10, x2: SORTIE.x, y2: SORTIE.y - 0.12 * K - 4, stroke: "#c9d2d8", "stroke-width": 1.4 }, g);
    for (let d = 2; d <= 12; d += 2) { const p = vers_px(0, d / 100); L.svg("rect", { x: p.x - 3, y: p.y - 1, width: 6, height: 2, fill: "#e8f6a8" }, g); L.texte(g, p.x - 7, p.y + 2, String(d), { "font-size": 5.5, fill: "#3b4a2b", "text-anchor": "end" }); }
    L.svg("rect", { x: SPHERE.x - 6, y: SPHERE.y + 120, width: 12, height: SOL - 6 - SPHERE.y - 120, fill: "url(#metal)" }, g);
    L.svg("rect", { x: SPHERE.x - 26, y: SPHERE.y + 104, width: 52, height: 18, rx: 3, fill: "#1b1e21" }, g);
  }

  function boite(g, B, titre) {
    // Boîtier d'alimentation posé sur la paillasse, face sombre, titre.
    L.boitier(g, B.x, B.y - 26, B === BOITE1 ? 190 : 160, 26, 116, { dessus: "#cfd3d6", face: "#33404d" });
    L.texte(g, B.x + (B === BOITE1 ? 95 : 80), B.y + 12, titre, { "font-size": 6.5, "font-weight": 700, fill: "#dfe6ec" });
  }

  function cordons(g) {
    // Cordons de sécurité : canon ← alimentation du tube ; bobines en série ← alimentation des bobines ; cordons secteur.
    const fil = (a, b, c, creux) => { L.svg("path", { d: `M${a.x} ${a.y} C${a.x} ${a.y + creux} ${b.x} ${b.y + creux} ${b.x} ${b.y}`, fill: "none", stroke: c, "stroke-width": 2.2, "pointer-events": "none" }, g); for (const p of [a, b]) L.svg("circle", { cx: p.x, cy: p.y, r: 4.5, fill: c, stroke: "#111", "stroke-width": 0.6 }, g); };
    [[-18, 590], [-6, 606], [6, 650], [18, 720]].forEach(([dx, xb], i) => fil({ x: SPHERE.x + dx, y: SPHERE.y + 113 }, { x: xb, y: SOL - 14 }, i === 3 ? "#c62828" : "#222", 70 - i * 6));
    fil({ x: C.x - 6, y: SOL - 20 }, { x: C.x + 26, y: SOL - 26 }, "#222", 20);
    fil({ x: C.x + 6, y: SOL - 20 }, { x: 790, y: SOL - 14 }, "#c62828", 80); fil({ x: C.x + 46, y: SOL - 26 }, { x: 815, y: SOL - 14 }, "#1565c0", 70);
    L.svg("rect", { x: 858, y: 236, width: 44, height: 44, rx: 4, fill: "#f7f7f4", stroke: "#b8bbb4" }, g);
    L.cordon_secteur(g, { x: BOITE1.x + 170, y: BOITE1.y - 10 }, { x: 880, y: 258 }); L.cordon_secteur(g, { x: BOITE2.x + 140, y: BOITE2.y - 10 }, { x: 962, y: 322 });
  }

  function fond(g) {
    // Planche, bobine arrière, tube, bobine avant, douilles des bobines, alimentations et cordons.
    L.ombre_sol(g, C.x, SOL + 4, 180, 8, 0.4);
    L.svg("path", { d: `M${C.x - 175} ${SOL - 6} H${C.x + 175} l10 12 H${C.x - 185} Z`, fill: "url(#bois-face)", stroke: "#6b4a2a" }, g);
    bobine(g, 18, -12, false); tube(g); bobine(g, 0, 0, true);
    for (const [dx, c] of [[-6, "#222"], [6, "#c62828"], [26, "#222"], [46, "#1565c0"]]) L.svg("circle", { cx: C.x + dx, cy: SOL - (dx > 20 ? 26 : 20), r: 3.6, fill: c, stroke: "#777" }, g);
    boite(g, BOITE1, "ALIMENTATION DU TUBE"); boite(g, BOITE2, "BOBINES 0 – 3 A");
    for (const [x, c] of [[590, "#222"], [606, "#222"], [650, "#222"], [720, "#c62828"], [790, "#c62828"], [815, "#1565c0"]]) L.svg("circle", { cx: x, cy: SOL - 14, r: 4.5, fill: c, stroke: "#111" }, g);
    cordons(g);
  }

  function trace(g, pts, chauffe) {
    // Lueur du filament et trace bleu-violet du faisceau dans l'hydrogène.
    g.replaceChildren();
    if (chauffe) L.svg("rect", { x: SORTIE.x - 18, y: SORTIE.y - 2, width: 6, height: 5, fill: "#ff9b4a" }, g);
    if (pts.length < 2) return;
    const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    L.svg("path", { d, fill: "none", stroke: "#8f7dff", "stroke-width": 6, opacity: 0.3 }, g);
    L.svg("path", { d, fill: "none", stroke: "#c7c2ff", "stroke-width": 1.5 }, g);
  }

  L.bobines_dessin = { fond, trace, vers_px, SORTIE, SPHERE, BOITE1, BOITE2, K };
})(window.Labo);

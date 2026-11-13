/*
Rôle : matériel de la déviation électrostatique, dessiné comme le matériel des catalogues : tube à déviation électronique (ampoule
       de verre de 13 cm, col avec le canon à électrons — filament, cathode, anode —, culot à quatre douilles F, F, C, A, deux
       plaques de déviation de 10 cm distantes de 5,0 cm reliées à deux douilles sur l'ampoule, écran fluorescent quadrillé en cm
       entre les plaques) sur son support (socle, colonne, collier du col, berceau) ; alimentation haute tension 0 – 5 kV
       (sorties 6,3 V~, UA, UP) ; cordons de sécurité terminés par des fiches enfoncées dans les douilles.
Reçoit : le groupe SVG ; la trajectoire (points en cm) pour la trace lumineuse.
Produit : Labo.tube_dessin = { tube(g), alimentation(g), cordons(g), trace(g, pts, chauffe), ecran_cm(x, y) -> px, DOUILLES, ECRAN, PANNEAU }.
Utilisé par : poste_champ_electrique.js (fichier nommé pour être chargé avant lui).
*/
(function (L) {
  const ECRAN = { x: 262, y: 320, k: 14 }, C = { x: 330, y: 320, r: 86 }, SOL = 470, PANNEAU = { x: 560, y: SOL - 150 };
  const DOUILLES = { F1: { x: 96, y: 306 }, F2: { x: 96, y: 318 }, C: { x: 96, y: 330 }, A: { x: 96, y: 342 }, P1: { x: 330, y: 228 }, P2: { x: 330, y: 412 } };
  const SORTIES = { F1: { x: 590, y: 452 }, F2: { x: 612, y: 452 }, C: { x: 660, y: 452 }, A: { x: 690, y: 452 }, P2: { x: 790, y: 452 }, P1: { x: 820, y: 452 } };
  const ecran_cm = (x, y) => ({ x: ECRAN.x + x * ECRAN.k, y: ECRAN.y - y * ECRAN.k });

  function support(g) {
    // Socle, colonne et collier qui serre le col, berceau sous l'ampoule.
    L.ombre_sol(g, 300, SOL + 4, 150, 8, 0.4);
    L.svg("path", { d: `M150 ${SOL - 8} H450 l10 12 H140 Z`, fill: "#2f3438", stroke: "#15181a" }, g);
    L.tige(g, `M190 ${SOL - 8} V340`, 7); L.tige(g, `M${C.x} ${SOL - 8} V${C.y + C.r + 6}`, 7);
    L.svg("rect", { x: 178, y: 296, width: 24, height: 48, rx: 4, fill: "#3b4046", stroke: "#111" }, g);
    L.svg("path", { d: `M${C.x - 40} ${C.y + C.r - 18} Q${C.x} ${C.y + C.r + 14} ${C.x + 40} ${C.y + C.r - 18}`, fill: "none", stroke: "#3b4046", "stroke-width": 6 }, g);
  }

  function tube(g) {
    // Culot et douilles, col et canon, ampoule, plaques et leurs douilles, écran quadrillé (1 cm).
    support(g);
    L.svg("rect", { x: 84, y: 296, width: 26, height: 56, rx: 3, fill: "#1b1e21", stroke: "#000" }, g);
    for (const [k, p] of Object.entries(DOUILLES).slice(0, 4)) { L.svg("circle", { cx: p.x, cy: p.y, r: 3.6, fill: "#111", stroke: "#777" }, g); L.texte(g, p.x + 9, p.y + 2.5, k.slice(0, 1), { "font-size": 6, fill: "#dfe6ec" }); }
    L.svg("rect", { x: 110, y: 302, width: 150, height: 36, rx: 10, fill: "url(#verre)", stroke: "#9fb6be" }, g);
    L.svg("circle", { cx: C.x, cy: C.y, r: C.r, fill: "url(#verre)", stroke: "#9fb6be", "stroke-width": 1.2 }, g);
    L.svg("ellipse", { cx: C.x - 34, cy: C.y - 46, rx: 22, ry: 12, fill: "#fff", opacity: 0.25 }, g);
    L.svg("rect", { x: 150, y: 312, width: 34, height: 16, rx: 2, fill: "#7a8288", stroke: "#4b5258" }, g);
    L.svg("rect", { x: 200, y: 306, width: 6, height: 28, fill: "#9aa3aa", stroke: "#4b5258", "stroke-width": 0.5 }, g);
    L.svg("rect", { x: ECRAN.x, y: ECRAN.y - 2.5 * ECRAN.k, width: 10 * ECRAN.k, height: 5 * ECRAN.k, fill: "#2a3a35", opacity: 0.85 }, g);
    for (let i = 0; i <= 10; i++) L.svg("line", { x1: ECRAN.x + i * ECRAN.k, y1: ECRAN.y - 35, x2: ECRAN.x + i * ECRAN.k, y2: ECRAN.y + 35, stroke: "#c8d6cf", "stroke-width": i % 5 ? 0.3 : 0.6, opacity: 0.7 }, g);
    for (let j = -2; j <= 2; j++) L.svg("line", { x1: ECRAN.x, y1: ECRAN.y - j * ECRAN.k, x2: ECRAN.x + 140, y2: ECRAN.y - j * ECRAN.k, stroke: "#c8d6cf", "stroke-width": j ? 0.3 : 0.6, opacity: 0.7 }, g);
    for (const [s, p] of [[1, DOUILLES.P1], [-1, DOUILLES.P2]]) {
      L.svg("rect", { x: ECRAN.x - 4, y: ECRAN.y - s * 2.5 * ECRAN.k - (s > 0 ? 3 : 0), width: 148, height: 3, fill: "url(#metal)", stroke: "#555", "stroke-width": 0.4 }, g);
      L.svg("rect", { x: p.x - 3, y: s > 0 ? p.y : ECRAN.y + 38, width: 6, height: s > 0 ? ECRAN.y - 38 - p.y : p.y - ECRAN.y - 38, fill: "#9aa3aa" }, g);
      L.svg("rect", { x: p.x - 7, y: p.y - 7, width: 14, height: 14, rx: 3, fill: "#1b1e21" }, g);
      L.svg("circle", { cx: p.x, cy: p.y, r: 3.6, fill: "#111", stroke: "#777" }, g);
    }
  }

  function alimentation(g) {
    // Boîtier, titre, sorties 6,3 V~, UA et UP (douilles de sécurité), inscriptions.
    const P = PANNEAU;
    L.boitier(g, P.x, P.y - 26, 360, 26, 146, { dessus: "#cfd3d6", face: "#33404d" });
    L.texte(g, P.x + 180, P.y + 12, "ALIMENTATION HAUTE TENSION 0 – 5 kV", { "font-size": 7, "font-weight": 700, fill: "#dfe6ec" });
    for (const [k, p] of Object.entries(SORTIES)) L.svg("circle", { cx: p.x, cy: p.y, r: 4.5, fill: k === "A" || k === "P1" ? "#c62828" : "#222", stroke: "#111" }, g);
    for (const [t, x] of [["6,3 V ~", 601], ["−  UA  +", 675], ["−  UP  +", 805]]) L.texte(g, x, 466, t, { "font-size": 6.5, fill: "#dfe6ec" });
    L.svg("path", { d: `M${P.x + 330} ${P.y + 22} l8 -14 l8 14 Z`, fill: "#f2c500", stroke: "#222", "stroke-width": 0.8 }, g);
  }

  function cordon(g, a, b, couleur, creux, detour = null) {
    // Cordon de sécurité qui pend entre deux douilles (ou suit le chemin « detour », qui contourne le boîtier) ; chaque fiche est enfoncée dans sa douille.
    const c = [{ x: a.x, y: a.y + creux }, { x: b.x, y: b.y + creux }];
    L.svg("path", { d: detour || `M${a.x} ${a.y} C${c[0].x} ${c[0].y} ${c[1].x} ${c[1].y} ${b.x} ${b.y}`, fill: "none", stroke: couleur, "stroke-width": 2.4, "pointer-events": "none" }, g);
    for (const p of [a, b]) { L.svg("circle", { cx: p.x, cy: p.y, r: 4.8, fill: couleur, stroke: "#111", "stroke-width": 0.6 }, g); L.svg("circle", { cx: p.x, cy: p.y, r: 1.8, fill: "#000", opacity: 0.4 }, g); }
  }

  function cordons(g) {
    // Chauffage (noirs), cathode (noir) et anode (rouge) du canon ; plaques (bleu et rouge).
    cordon(g, DOUILLES.F1, SORTIES.F1, "#222", 150); cordon(g, DOUILLES.F2, SORTIES.F2, "#222", 140);
    cordon(g, DOUILLES.C, SORTIES.C, "#222", 130); cordon(g, DOUILLES.A, SORTIES.A, "#c62828", 120);
    cordon(g, DOUILLES.P1, SORTIES.P1, "#c62828", 0, `M${DOUILLES.P1.x} ${DOUILLES.P1.y} C600 160 932 230 932 360 S860 506 ${SORTIES.P1.x} ${SORTIES.P1.y}`); cordon(g, DOUILLES.P2, SORTIES.P2, "#1565c0", 60);
  }

  function trace(g, pts, chauffe) {
    // Lueur du filament, trace bleu-vert du faisceau sur l'écran fluorescent.
    g.replaceChildren();
    if (chauffe) L.svg("rect", { x: 152, y: 314, width: 8, height: 12, rx: 2, fill: "#ff9b4a", opacity: 0.9 }, g);
    if (pts.length < 2) return;
    const d = pts.map((p, i) => { const e = ecran_cm(p.x, p.y); return `${i ? "L" : "M"}${e.x.toFixed(1)} ${e.y.toFixed(1)}`; }).join(" ");
    L.svg("path", { d, fill: "none", stroke: "#7cfcff", "stroke-width": 4, opacity: 0.25 }, g);
    L.svg("path", { d, fill: "none", stroke: "#b9fff6", "stroke-width": 1.4 }, g);
  }

  L.tube_dessin = { tube, alimentation, cordons, trace, ecran_cm, DOUILLES, ECRAN, PANNEAU, SOL };
})(window.Labo);

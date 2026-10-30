/*
Rôle : matériel des spectres d'émission : tube spectral (tube de Plücker : deux ampoules à électrodes et capuchons métalliques
       reliées par un capillaire de 9 cm où brille la décharge), alimentation haute tension 5 kV pour tubes spectraux (socle,
       interrupteur à voyant, pictogramme « danger électrique », colonne isolante et deux pinces à ressort qui tiennent le tube),
       coffret en bois garni de mousse où les tubes sont rangés, chacun avec son étiquette.
Reçoit : le groupe SVG, les positions et, pour la lueur, la couleur du gaz.
Produit : Labo.tubes_dessin = { tube(g, x, y, angle, lueur, etiquette), alimentation(g, x, sol), coffret(g, x, y), place(k), AXE }.
Utilisé par : poste_tubes.js (fichier nommé pour être chargé avant lui).
*/
(function (L) {
  const AXE = { x: 800, haut: 214, bas: 384 }, COFFRET = { x: 228, y: 470, l: 250, h: 100 };

  function tube(g, x, y, angle, lueur, etiquette) {
    // Tube vertical (angle 0) ou couché (angle 90) centré en (x, y) ; lueur = couleur de la décharge, ou null (éteint).
    const t = L.svg("g", { transform: `translate(${x} ${y}) rotate(${angle})` }, g);
    for (const s of [-1, 1]) {
      L.svg("rect", { x: -4, y: s > 0 ? 75 : -83, width: 8, height: 8, rx: 1.5, fill: "url(#acier)", stroke: "#444", "stroke-width": 0.5 }, t);
      L.svg("rect", { x: -7, y: s > 0 ? 45 : -75, width: 14, height: 30, rx: 6, fill: "url(#verre)", stroke: "#9fb6be", "stroke-width": 0.8 }, t);
      L.svg("rect", { x: -1, y: s > 0 ? 50 : -73, width: 2, height: 22, fill: "#7a8288" }, t);
    }
    if (lueur) {
      L.svg("rect", { x: -9, y: -48, width: 18, height: 96, rx: 9, fill: lueur, opacity: 0.25, filter: "url(#flou)" }, t);
      for (const s of [-1, 1]) L.svg("rect", { x: -6, y: s > 0 ? 46 : -74, width: 12, height: 28, rx: 5, fill: lueur, opacity: 0.25 }, t);
    }
    L.svg("rect", { x: -1.8, y: -46, width: 3.6, height: 92, rx: 1.8, fill: lueur || "url(#verre)", stroke: lueur ? "none" : "#9fb6be", "stroke-width": 0.5, opacity: lueur ? 0.95 : 1 }, t);
    if (lueur) L.svg("rect", { x: -0.7, y: -46, width: 1.4, height: 92, fill: "#fff", opacity: 0.55 }, t);
    if (etiquette) { L.svg("rect", { x: -6, y: 10, width: 12, height: 18, rx: 1, fill: "#fdfdf8", stroke: "#999", "stroke-width": 0.4 }, t); L.texte(t, 0, 22, etiquette, { "font-size": 6.5, "font-weight": 700, fill: "#23315a", transform: angle ? `rotate(${-angle} 0 19)` : "" }); }
    return t;
  }

  function alimentation(g, x, sol) {
    // Socle, face avant, colonne et pinces ; l'interrupteur est ajouté par le poste.
    L.boitier(g, x, sol - 76, 190, 30, 42, { dessus: "#cfd3d6", face: "#3b4a57" });
    L.svg("rect", { x: AXE.x - 5, y: AXE.haut - 22, width: 10, height: sol - 76 - AXE.haut + 26, rx: 2, fill: "#2b2f33", stroke: "#111" }, g);
    for (const y of [AXE.haut - 4, AXE.bas - 8]) { L.svg("rect", { x: AXE.x - 13, y, width: 26, height: 12, rx: 3, fill: "#1b1e21", stroke: "#000" }, g); L.svg("rect", { x: AXE.x - 10, y: y + 3, width: 20, height: 2, fill: "#8a9196" }, g); }
    L.svg("path", { d: `M${AXE.x + 13} ${AXE.haut + 2} C${AXE.x + 30} ${AXE.haut + 40} ${AXE.x + 26} ${sol - 90} ${AXE.x + 14} ${sol - 76}`, fill: "none", stroke: "#c62828", "stroke-width": 2.2 }, g);
    const f = sol - 46;
    L.texte(g, x + 110, f + 12, "ALIMENTATION 5 kV", { "font-size": 6.5, "font-weight": 700, fill: "#dfe6ec" });
    L.texte(g, x + 110, f + 21, "tubes spectraux", { "font-size": 6, fill: "#dfe6ec" });
    L.svg("path", { d: `M${x + 160} ${f + 30} l9 -16 l9 16 Z`, fill: "#f2c500", stroke: "#222", "stroke-width": 0.8 }, g);
    L.svg("path", { d: `M${x + 170} ${f + 18} l-3 6 h3 l-2 5`, fill: "none", stroke: "#222", "stroke-width": 1 }, g);
  }

  function place(k) {
    // Centre du logement k du coffret (tubes couchés).
    return { x: COFFRET.x + COFFRET.l / 2 + 8, y: COFFRET.y + 18 + k * 17 };
  }

  function coffret(g) {
    // Coffret en bois vu un peu d'en haut, mousse grise et cinq logements.
    const c = COFFRET;
    L.ombre_sol(g, c.x + c.l / 2, c.y + c.h + 3, c.l / 2 + 10, 6, 0.4);
    L.svg("rect", { x: c.x, y: c.y, width: c.l, height: c.h, rx: 4, fill: "#9b6b3c", stroke: "#5e3d1f" }, g);
    L.svg("rect", { x: c.x + 6, y: c.y + 6, width: c.l - 12, height: c.h - 12, rx: 3, fill: "#5f6468" }, g);
    for (let k = 0; k < 5; k++) { const p = place(k); L.svg("rect", { x: p.x - 92, y: p.y - 6, width: 184, height: 12, rx: 6, fill: "#45494d" }, g); }
    L.svg("rect", { x: c.x, y: c.y + c.h - 6, width: c.l, height: 6, rx: 2, fill: "#7d5530" }, g);
  }

  L.tubes_dessin = { tube, alimentation, coffret, place, AXE, COFFRET };
})(window.Labo);

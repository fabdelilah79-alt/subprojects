/*
Rôle : matériel de l'expérience de Franck et Hertz, dessiné comme dans les catalogues : four électrique (caisson laqué, fentes
       d'aération, hublot où l'on voit le tube triode au mercure : cathode qui rougeoie, grille, anode ; sonde de température
       sur le dessus ; plaque signalétique ; pieds) relié par son câble multibroche à l'appareil d'alimentation et de mesure
       (face avant sombre : interrupteur à voyant, afficheur de la température du four, emplacements des boutons, afficheur
       de IA, inverseur MAN / RAMPE, douilles de sortie UA et U2/10).
Reçoit : le groupe SVG et les positions ; l'état { allume, theta } pour la lueur de la cathode et de la vapeur.
Produit : Labo.fh_dessin = { four(g, x, sol), unite(g, x, sol), cable(g, four_x, unite_x, sol), lueur(g, x, sol, e), afficheur(g, x, y, l, texte, allume), FOUR, UNITE }.
Utilisé par : poste_franck_hertz.js.
*/
(function (L) {
  const FOUR = { l: 130, h: 150, p: 26 }, UNITE = { l: 330, h: 140, p: 26 };

  function four(g, x, sol) {
    // Caisson posé sur ses pieds, hublot, tube visible, fentes, sonde et plaque.
    const y = sol - FOUR.h - FOUR.p, f = y + FOUR.p;
    for (const dx of [14, FOUR.l - 14]) L.svg("rect", { x: x + dx - 8, y: sol - 2, width: 16, height: 5, rx: 2, fill: "#1b1e21" }, g);
    L.boitier(g, x, y, FOUR.l, FOUR.p, FOUR.h - 4, { dessus: "#cfd3d6", face: "#b6bcc1" });
    for (let k = 0; k < 6; k++) L.svg("rect", { x: x + 12 + k * 18, y: y + 8, width: 12, height: 3, rx: 1.5, fill: "#5d646a" }, g);
    L.svg("rect", { x: x + 58, y: y - 26, width: 6, height: 30, rx: 2, fill: "url(#acier)", stroke: "#444", "stroke-width": 0.5 }, g);
    L.svg("rect", { x: x + 54, y: y + 2, width: 14, height: 6, rx: 2, fill: "#2b2f33" }, g);
    L.svg("rect", { x: x + 14, y: f + 14, width: FOUR.l - 28, height: 74, rx: 6, fill: "#2a2116", stroke: "#4a4f55", "stroke-width": 3 }, g);
    L.svg("rect", { x: x + 18, y: f + 18, width: FOUR.l - 36, height: 8, rx: 3, fill: "#fff", opacity: 0.12 }, g);
    L.svg("rect", { x: x + 22, y: f + 104, width: FOUR.l - 44, height: 22, rx: 2, fill: "#eef0f2", stroke: "#8a9298", "stroke-width": 0.6 }, g);
    L.texte(g, x + FOUR.l / 2, f + 113, "FOUR ÉLECTRIQUE", { "font-size": 6, "font-weight": 700, fill: "#23315a" });
    L.texte(g, x + FOUR.l / 2, f + 122, "tube de Franck-Hertz (Hg)", { "font-size": 5.5, fill: "#23315a" });
  }

  function lueur(g, x, sol, e) {
    // Tube triode dans le hublot : ampoule de verre, cathode (rouge orangé si chauffée), grille, anode ; vapeur bleutée si chaude.
    g.replaceChildren();
    const f = sol - FOUR.h, cy = f + 51;
    if (e.allume && e.theta > 120) L.svg("rect", { x: x + 18, y: f + 18, width: FOUR.l - 36, height: 66, rx: 4, fill: "#6f86c9", opacity: Math.min(0.25, (e.theta - 120) / 300) }, g);
    L.svg("rect", { x: x + 26, y: cy - 20, width: FOUR.l - 52, height: 40, rx: 18, fill: "url(#verre)", stroke: "#a9c1c9", "stroke-width": 1 }, g);
    L.svg("rect", { x: x + 34, y: cy - 12, width: 5, height: 24, rx: 1, fill: e.allume ? "#ff8a3d" : "#6a5a50" }, g);
    if (e.allume) L.svg("rect", { x: x + 31, y: cy - 15, width: 11, height: 30, rx: 4, fill: "#ff9b4a", opacity: 0.35 }, g);
    for (let k = 0; k < 7; k++) L.svg("line", { x1: x + 80, y1: cy - 14 + k * 4.6, x2: x + 84, y2: cy - 14 + k * 4.6, stroke: "#b9c0c6", "stroke-width": 0.8 }, g);
    L.svg("path", { d: `M${x + 82} ${cy - 15} V${cy + 15}`, stroke: "#b9c0c6", "stroke-width": 0.8 }, g);
    L.svg("rect", { x: x + 94, y: cy - 13, width: 4, height: 26, fill: "#9aa3aa", stroke: "#5d646a", "stroke-width": 0.5 }, g);
    L.texte(g, x + 36, cy + 26, "K", { "font-size": 6, fill: "#e6e0d6" }); L.texte(g, x + 82, cy + 26, "G", { "font-size": 6, fill: "#e6e0d6" }); L.texte(g, x + 96, cy + 26, "A", { "font-size": 6, fill: "#e6e0d6" });
  }

  function afficheur(g, x, y, l, texte, allume) {
    // Afficheur à cristaux liquides (vert sur fond sombre), éteint si l'appareil est hors tension.
    L.svg("rect", { x, y, width: l, height: 20, rx: 3, fill: "#1d2a22", stroke: "#000" }, g);
    if (allume) L.texte(g, x + l / 2, y + 14, texte, { "font-size": 10, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" });
  }

  function unite(g, x, sol) {
    // Boîtier de l'appareil, face avant sombre, titre, douilles de sortie.
    const y = sol - UNITE.h - UNITE.p, f = y + UNITE.p;
    L.boitier(g, x, y, UNITE.l, UNITE.p, UNITE.h - 4, { dessus: "#cfd3d6", face: "#33404d" });
    L.texte(g, x + UNITE.l / 2, f + 9, "APPAREIL DE FRANCK ET HERTZ", { "font-size": 6.5, "font-weight": 700, fill: "#dfe6ec" });
    for (const [dx, nom, c] of [[262, "UA", "#c62828"], [292, "U2/10", "#c62828"], [316, "⏚", "#222"]]) {
      L.svg("circle", { cx: x + dx, cy: f + 118, r: 4.5, fill: c, stroke: "#111" }, g);
      L.svg("circle", { cx: x + dx, cy: f + 118, r: 1.8, fill: "#111" }, g);
      L.texte(g, x + dx, f + 109, nom, { "font-size": 6, fill: "#dfe6ec" });
    }
  }

  function cable(g, xf, xu, sol) {
    // Câble multibroche : fiche sur le flanc droit du four, fiche sur le flanc gauche de l'appareil, câble qui pend entre les deux.
    const a = { x: xf + FOUR.l, y: sol - 70 }, b = { x: xu, y: sol - 70 };
    L.svg("path", { d: `M${a.x + 6} ${a.y} C${a.x + 16} ${sol + 4} ${b.x - 16} ${sol + 4} ${b.x - 6} ${b.y}`, fill: "none", stroke: "#2b2b2b", "stroke-width": 4 }, g);
    for (const [px, s] of [[a.x, 1], [b.x, -1]]) L.svg("rect", { x: s > 0 ? px : px - 9, y: px === a.x ? a.y - 6 : b.y - 6, width: 9, height: 12, rx: 2, fill: "#555c63", stroke: "#222" }, g);
  }

  L.fh_dessin = { cable, four, unite, lueur, afficheur, FOUR, UNITE };
})(window.Labo);

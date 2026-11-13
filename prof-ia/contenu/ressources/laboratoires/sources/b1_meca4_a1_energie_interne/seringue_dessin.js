/*
Rôle : dessin de la seringue à gaz (échelle 1,6 px/mm) : cylindre de verre vertical (section S = 4,00 cm², gradué de 0 à
       60 mL), piston étanche et sa tige terminée par un plateau, support ; manomètre électronique relié par un tuyau à la
       sortie du bas ; sonde de température ; masses marquées de 1 kg (disques à encoche) sur la paillasse ou le plateau.
Reçoit : le groupe SVG ; le volume du gaz (mL), le nombre de masses sur le plateau, la masse tenue, p et T affichées.
Produit : Labo.seringue_dessin = { fond(g), seringue(g, V, n), masse(g, x, y, posee), afficheurs(g, p, T), y_piston(V),
          PLACES, X }.
Utilisé par : poste_seringue.js.
*/
(function (L) {
  const X = 400, BAS = 500, PX_ML = 4, R = 18, TABLE = 560, PLACES = [600, 660, 720];
  const y_piston = (V) => BAS - V * PX_ML;

  function fond(g) {
    // Support, bouchon du bas, tuyau jusqu'au manomètre, câble de la sonde, boîtiers, fiche des données.
    L.svg("rect", { x: X - 60, y: TABLE - 10, width: 120, height: 10, rx: 2, fill: "#3a3f44" }, g);
    L.svg("rect", { x: X - 26, y: BAS, width: 52, height: TABLE - 10 - BAS, fill: "#4b555c", stroke: "#1b1e21" }, g);
    L.svg("path", { d: `M${X + 26} ${BAS + 18} C560 ${BAS + 18} 560 470 616 470`, fill: "none", stroke: "#c7d6dc", "stroke-width": 6, opacity: 0.9 }, g);
    L.svg("rect", { x: 612, y: 464, width: 8, height: 12, rx: 1.5, fill: "#6b7378" }, g);
    L.svg("path", { d: `M${X + 26} ${BAS + 8} C500 ${BAS + 8} 520 331 616 331`, fill: "none", stroke: "#1b1e21", "stroke-width": 2 }, g);
    L.svg("circle", { cx: 618, cy: 331, r: 3, fill: "#1b1e21" }, g);
    for (const [y, titre, teinte] of [[300, "THERMOMÈTRE (gaz)", "#e9b949"], [440, "MANOMÈTRE", "#c7ccd0"]]) {
      L.svg("rect", { x: 620, y, width: 150, height: 62, rx: 6, fill: teinte, stroke: "#555" }, g);
      L.texte(g, 695, y + 13, titre, { "font-size": 7.5, "font-weight": 700, fill: "#23315a" });
      L.svg("rect", { x: 632, y: y + 20, width: 126, height: 28, rx: 3, fill: "#1d2a22" }, g);
    }
    L.svg("rect", { x: 600, y: 140, width: 290, height: 76, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0" }, g);
    ["Piston : S = 4,00 cm² (masse et frottements négligés)", "Au départ : p0 = 1013 hPa ; V1 = 50,0 mL ; 20,0 °C", "Masses marquées : 1,00 kg chacune ; g = 9,81 N/kg"].forEach((t, i) => L.texte(g, 745, 160 + i * 18, t, { "font-size": 9, fill: "#222" }));
  }

  function seringue(g, V, n) {
    // Gaz (légèrement teinté), cylindre gradué, piston, tige, plateau et masses empilées ; renvoie la hauteur du plateau.
    const yp = y_piston(V), yh = BAS - 64 * PX_ML, plateau = yp - 156;
    L.svg("rect", { x: X - R, y: yp, width: 2 * R, height: BAS - yp, fill: "#e6f2f7", opacity: 0.6 }, g);
    L.tige(g, `M${X} ${yp} V${plateau}`, 6);
    L.svg("rect", { x: X - R + 1, y: yp - 12, width: 2 * R - 2, height: 12, fill: "#2b3035" }, g);
    L.svg("rect", { x: X - R - 2, y: yh, width: 2 * R + 4, height: BAS - yh, rx: 3, fill: "url(#verre)", stroke: "#9fb6be", "stroke-width": 1.2 }, g);
    for (let ml = 0; ml <= 60; ml++) L.svg("line", { x1: X + R, y1: y_piston(ml), x2: X + R - (ml % 10 ? (ml % 5 ? 5 : 8) : 12), y2: y_piston(ml), stroke: "#1d2a33", "stroke-width": ml % 10 ? 0.5 : 0.9 }, g);
    for (let ml = 0; ml <= 60; ml += 10) { L.svg("rect", { x: X + R + 4, y: y_piston(ml) - 5, width: 16, height: 10, rx: 2, fill: "#fdfdf8", opacity: 0.9 }, g); L.texte(g, X + R + 12, y_piston(ml) + 3, String(ml), { "font-size": 7.5, "font-weight": 700, fill: "#1d2a33" }); }
    L.svg("rect", { x: X + R + 2, y: yh - 13, width: 20, height: 11, rx: 2, fill: "#fdfdf8", opacity: 0.9 }, g);
    L.texte(g, X + R + 12, yh - 5, "mL", { "font-size": 7.5, "font-weight": 700, fill: "#1d2a33" });
    L.svg("rect", { x: X - 34, y: plateau - 5, width: 68, height: 5, rx: 1.5, fill: "url(#metal-h)", stroke: "#444" }, g);
    for (let k = 0; k < n; k++) masse(g, X, plateau - 5 - k * 14, true);
    return plateau;
  }

  function masse(g, x, y, posee) {
    // Disque à encoche de 1,00 kg (vu de côté), posé sur y ; classe selon qu'il est sur le plateau ou sur la paillasse.
    const gr = L.svg("g", { class: posee ? "masse-plateau" : "masse-table" }, g);
    L.svg("rect", { x: x - 30, y: y - 14, width: 60, height: 14, rx: 2, fill: "url(#laiton)", stroke: "#8a6a1e", "stroke-width": 0.6 }, gr);
    L.texte(gr, x, y - 4, "1 kg", { "font-size": 8, "font-weight": 700, fill: "#4a370b" });
  }

  function afficheurs(g, p, T) {
    // Pression (hPa) et température du gaz (°C).
    const o = { "font-size": 13, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" };
    L.texte(g, 695, 339, `${T.toFixed(1).replace(".", ",")} °C`, o);
    L.texte(g, 695, 479, `${Math.round(p / 100)} hPa`, o);
  }

  L.seringue_dessin = { fond, seringue, masse, afficheurs, y_piston, PLACES, X, TABLE };
})(window.Labo);

/*
Rôle : dessin de la paillasse du rayonnement (1 px = 1 mm) : lampe à incandescence de 100 W et son réflecteur, montée sur
       une potence (on la fait glisser verticalement : distance aux plaques de 15 à 30 cm, lue sur une règle), deux plaques
       de cuivre identiques (l'une peinte en noir mat, l'autre polie et brillante) sur leurs supports, leurs sondes et
       leurs thermomètres, chronomètre (temps accéléré × 10), interrupteur.
Reçoit : le groupe SVG ; la hauteur de la lampe, l'état allumé, les températures et le temps.
Produit : Labo.lampe_dessin = { fond(g), lampe(g, y, allumee), afficheurs(g, tn, tb, t), Y_PLAQUES, X_LAMPE }.
Utilisé par : poste_lampe.js.
*/
(function (L) {
  const X_LAMPE = 450, Y_PLAQUES = 470, PLAQUES = [{ x: 330, noire: true }, { x: 570, noire: false }], TABLE = 560;

  function fond(g) {
    // Potence de la lampe, règle des distances, supports des plaques, plaques, sondes, thermomètres, chronomètre.
    L.svg("rect", { x: X_LAMPE - 45, y: TABLE - 10, width: 90, height: 10, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, `M${X_LAMPE} ${TABLE - 10} V110`, 6);
    L.svg("rect", { x: X_LAMPE + 14, y: Y_PLAQUES - 300, width: 24, height: 300, fill: "#f3efe2", stroke: "#8a8270" }, g);
    for (let cm = 0; cm <= 30; cm++) L.svg("line", { x1: X_LAMPE + 14, y1: Y_PLAQUES - cm * 10, x2: X_LAMPE + 14 + (cm % 5 ? 4 : 8), y2: Y_PLAQUES - cm * 10, stroke: "#333", "stroke-width": cm % 5 ? 0.5 : 0.9 }, g);
    for (let cm = 5; cm <= 30; cm += 5) L.texte(g, X_LAMPE + 30, Y_PLAQUES - cm * 10 + 3, String(cm), { "font-size": 7, "font-weight": 700, fill: "#333" });
    L.texte(g, X_LAMPE + 26, Y_PLAQUES - 304, "cm", { "font-size": 7, "font-weight": 700, fill: "#333" });
    PLAQUES.forEach((p, k) => {
      L.svg("rect", { x: p.x - 4, y: Y_PLAQUES + 4, width: 8, height: TABLE - Y_PLAQUES - 14, fill: "url(#metal)" }, g);
      L.svg("rect", { x: p.x - 30, y: TABLE - 10, width: 60, height: 10, rx: 2, fill: "#3a3f44" }, g);
      L.svg("rect", { x: p.x - 50, y: Y_PLAQUES, width: 100, height: 4, fill: p.noire ? "#141414" : "url(#metal-h)", stroke: p.noire ? "#000" : "#888" }, g);
      L.texte(g, p.x, Y_PLAQUES - 8, p.noire ? "plaque noire mate" : "plaque polie brillante", { "font-size": 8, "font-weight": 700, fill: "#e8ecef" });
      const bx = k ? 760 : 140;
      L.svg("path", { d: `M${p.x + (k ? 50 : -50)} ${Y_PLAQUES + 3} C${p.x + (k ? 90 : -90)} ${Y_PLAQUES + 10} ${bx} ${Y_PLAQUES - 40} ${bx} ${Y_PLAQUES - 66}`, fill: "none", stroke: "#1b1e21", "stroke-width": 2 }, g);
      L.svg("rect", { x: bx - 48, y: Y_PLAQUES - 110, width: 96, height: 44, rx: 5, fill: "#e9b949", stroke: "#6b5300" }, g);
      L.texte(g, bx, Y_PLAQUES - 99, p.noire ? "θ plaque noire" : "θ plaque brillante", { "font-size": 6.5, "font-weight": 700, fill: "#3b2a05" });
      L.svg("rect", { x: bx - 40, y: Y_PLAQUES - 94, width: 80, height: 22, rx: 3, fill: "#1d2a22" }, g);
    });
    L.svg("rect", { x: 700, y: 240, width: 130, height: 60, rx: 6, fill: "#c7ccd0", stroke: "#555" }, g);
    L.texte(g, 765, 253, "CHRONOMÈTRE (× 10)", { "font-size": 7, "font-weight": 700, fill: "#23315a" });
    L.svg("rect", { x: 712, y: 260, width: 106, height: 24, rx: 3, fill: "#1d2a22" }, g);
  }

  function lampe(g, y, allumee) {
    // Cône de lumière (lampe allumée), réflecteur, ampoule, noix sur la tige ; saisissable pour changer la hauteur.
    if (allumee) L.svg("path", { d: `M${X_LAMPE - 30} ${y + 18} L${X_LAMPE - 190} ${Y_PLAQUES} H${X_LAMPE + 190} L${X_LAMPE + 30} ${y + 18} Z`, fill: "#fff3b0", opacity: 0.25, "pointer-events": "none" }, g);
    const gr = L.svg("g", { class: "lampe", role: "slider", "aria-label": "Hauteur de la lampe" }, g);
    L.svg("rect", { x: X_LAMPE - 11, y: y - 40, width: 22, height: 20, rx: 3, fill: "#2c3e50", stroke: "#111" }, gr);
    L.tige(gr, `M${X_LAMPE} ${y - 20} V${y - 8}`, 5);
    L.svg("path", { d: `M${X_LAMPE - 40} ${y + 16} Q${X_LAMPE} ${y - 40} ${X_LAMPE + 40} ${y + 16} Z`, fill: "url(#metal)", stroke: "#555" }, gr);
    L.svg("circle", { cx: X_LAMPE, cy: y + 10, r: 13, fill: allumee ? "#fff7c2" : "#e8e8e0", stroke: "#999" }, gr);
    L.svg("path", { d: `M${X_LAMPE + 14} ${y + 10} H${X_LAMPE + 40}`, stroke: "#e0251b", "stroke-width": 1.6 }, gr);
    L.svg("rect", { x: X_LAMPE - 50, y: y - 44, width: 100, height: 74, fill: "#000", opacity: 0.001 }, gr);
  }

  function afficheurs(g, tn, tb, t) {
    // Températures des deux plaques et temps écoulé (min : s).
    const o = { "font-size": 11.5, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" };
    L.texte(g, 140, Y_PLAQUES - 78, `${tn.toFixed(1).replace(".", ",")} °C`, o);
    L.texte(g, 760, Y_PLAQUES - 78, `${tb.toFixed(1).replace(".", ",")} °C`, o);
    L.texte(g, 765, 277, `${Math.floor(t / 60)} min ${String(Math.floor(t % 60)).padStart(2, "0")} s`, o);
  }

  L.lampe_dessin = { fond, lampe, afficheurs, Y_PLAQUES, X_LAMPE };
})(window.Labo);

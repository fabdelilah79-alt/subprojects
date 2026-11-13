/*
Rôle : rhéostat (résistance variable bobinée) : un fil résistant enroulé sur un cylindre de céramique, deux bornes aux
       extrémités (A et B) et un curseur que l'élève fait glisser sur la barre ; la borne C est reliée au curseur.
       Entre A et C, la résistance vaut x·R (x : position du curseur, de 0 à 1) ; entre C et B, (1 − x)·R.
Reçoit : le circuit (circuit.js) et le réglage { id, x, y, R (Ω), I_max (A, inscrit sur la plaque) }.
Produit : Labo.rheostat(c, reglage) -> composant { position (0 à 1) } ; bornes « A », « B », « C ».
Utilisé par : les postes des simulations de dipôles actifs.
*/
(function (L) {
  const LONG = 220, R_CONTACT = 0.2;

  function corps(g, x, y, R, I_max) {
    // Pieds, cylindre de céramique couvert de spires, barre du curseur, plaque signalétique.
    for (const dx of [0, LONG + 28]) L.boitier(g, x + dx, y + 10, 16, 52, 10, { dessus: "#3b4045", face: "#24282c" });
    L.svg("rect", { x: x + 14, y: y + 26, width: LONG, height: 30, rx: 12, fill: "#e8dcc4", stroke: "#a8987a" }, g);
    for (let k = 0; k < 74; k++) L.svg("line", { x1: x + 18 + k * 2.95, y1: y + 27, x2: x + 18 + k * 2.95 + 2, y2: y + 55, stroke: "#9b6b3a", "stroke-width": 1 }, g);
    L.svg("rect", { x: x + 8, y: y + 12, width: LONG + 28, height: 6, rx: 2, fill: "url(#metal-h)" }, g);
    L.svg("rect", { x: x + 80, y: y + 60, width: 90, height: 12, rx: 2, fill: "#d9d4c3" }, g);
    L.texte(g, x + 125, y + 66.5, `Rhéostat ${R} Ω – ${String(I_max).replace(".", ",")} A`, { "font-size": 7.5, "font-weight": 700, fill: "#333" });
  }

  function dessiner_curseur(g, x, y, position) {
    // Curseur : chariot sur la barre et frotteur appuyé sur les spires.
    g.replaceChildren();
    const cx = x + 14 + position * LONG;
    L.svg("rect", { x: cx - 10, y: y + 6, width: 20, height: 18, rx: 3, fill: "#1f2226", stroke: "#000" }, g);
    L.svg("rect", { x: cx - 2, y: y + 22, width: 4, height: 8, fill: "url(#laiton)" }, g);
    L.svg("rect", { x: cx - 12, y: y + 2, width: 24, height: 30, fill: "#000", opacity: 0.001 }, g);
  }

  L.rheostat = function (c, { id = "rheostat", x, y, R = 100, I_max = 1 }) {
    // Construit le rhéostat ; glisser le curseur change les deux résistances, puis le circuit est recalculé.
    const comp = { id, position: 0.5, g: L.svg("g", { class: "rheostat" }, c.calque_composants) };
    corps(comp.g, x, y, R, I_max);
    const curseur = L.svg("g", { class: "curseur-rheostat", role: "slider", "aria-label": "Curseur du rhéostat" }, comp.g);
    dessiner_curseur(curseur, x, y, comp.position);
    L.glissable(curseur, {
      soulever: false,
      debut: () => ({ x: x + 14 + comp.position * LONG, y }),
      deplacer: (p) => { comp.position = Math.max(0, Math.min(1, (p.x - x - 14) / LONG)); dessiner_curseur(curseur, x, y, comp.position); c.calculer(); },
    });
    c.borne(comp, "A", x + 8, y + 46, "#4a4f55");
    c.borne(comp, "B", x + LONG + 36, y + 46, "#4a4f55");
    c.borne(comp, "C", x + LONG + 36, y + 8, "#4a4f55");
    for (const [t, dx, dy] of [["A", 8, 70], ["B", LONG + 36, 70], ["C", LONG + 52, 8]]) L.texte(comp.g, x + dx, y + dy, t, { "font-size": 10, "font-weight": 700, fill: "#9ec5ff" });
    comp.dipoles = () => [{ a: "A", b: "C", g: 1 / (comp.position * R + R_CONTACT), j: 0 }, { a: "C", b: "B", g: 1 / ((1 - comp.position) * R + R_CONTACT), j: 0 }];
    return c.ajouter(comp);
  };
})(window.Labo);

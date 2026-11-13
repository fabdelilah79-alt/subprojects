/*
Rôle : paillasse « émettre et recevoir une onde électromagnétique » : GBF (100 kHz à 1 MHz) relié à une antenne émettrice ;
       antenne réceptrice sur un chariot que l'on fait glisser le long d'une règle (0,1 à 1 m), reliée par un câble à son
       boîtier de bornes ; oscilloscope (voie 1 : antenne réceptrice ; voie 2 : GBF). La tension reçue a la fréquence du GBF
       et une amplitude qui diminue avec la distance (Ur = Umax × 0,03 m / d).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_antennes(g) -> { pense_bete } ; fait « antennes » = { f (Hz), d (m), Ur (V), emission, reception, voie2_gbf }.
Utilisé par : simulation.js.
*/
(function (L) {
  const X0 = 320, PX = 300, RAIL = 470, arr = (v, n) => Math.round(v * 10 ** n) / 10 ** n;

  function socle(c, id, x, y, nom) {
    // Boîtier à deux bornes (antenne, masse) et son nom.
    const comp = { id, g: L.svg("g", { class: `socle-${id}` }, c.calque_composants) };
    L.boitier(comp.g, x, y, 70, 30, 10, { dessus: "#d9d5cc", face: "#9c978c" });
    L.texte(comp.g, x + 35, y + 50, nom, { "font-size": 7.5, "font-weight": 700, fill: "#f4f1e6" });
    c.borne(comp, "antenne", x + 18, y + 15, "#c9a227"); c.borne(comp, "masse", x + 52, y + 15, L.NOIR_BORNE);
    comp.dipoles = () => [];
    return c.ajouter(comp);
  }

  function regle(g) {
    // Règle graduée posée sur la paillasse, de l'antenne émettrice jusqu'à 1 m.
    L.svg("rect", { x: X0 - 6, y: RAIL, width: PX + 12, height: 12, rx: 2, fill: "#e8d9a8", stroke: "#8a7a4a" }, g);
    for (let k = 0; k <= 10; k++) { L.svg("line", { x1: X0 + k * 30, y1: RAIL, x2: X0 + k * 30, y2: RAIL + (k % 5 ? 4 : 7), stroke: "#3a3020" }, g); if (k % 2 === 0) L.texte(g, X0 + k * 30, RAIL + 21, `${String(k / 10).replace(".", ",")} m`, { "font-size": 6.5, fill: "#f4f1e6" }); }
  }

  function tige(g, x, y0, y1) {
    // Antenne télescopique : brins de plus en plus fins, boule au sommet.
    L.svg("line", { x1: x, y1: y0, x2: x, y2: (y0 + y1) / 2, stroke: "#c0c4c8", "stroke-width": 4 }, g);
    L.svg("line", { x1: x, y1: (y0 + y1) / 2, x2: x, y2: y1, stroke: "#d8dbde", "stroke-width": 2.4 }, g);
    L.svg("circle", { cx: x, cy: y1, r: 3, fill: "#e0e3e6", stroke: "#888" }, g);
  }

  L.poste_antennes = function (g) {
    // GBF, antennes, chariot mobile, oscilloscope qui lit les tensions calculées.
    const { pense_bete } = L.decor_circuit(g, 0), c = L.circuit(g);
    const gbf = L.gbf(c, { id: "gbf", x: 40, y: 190, f: 100000, Umax: 10, frequences: [100000, 200000, 500000, 1000000] });
    socle(c, "E", 285, 390, "antenne émettrice"); socle(c, "R", 490, 505, "antenne réceptrice");
    tige(g, X0, 392, 210); regle(g);
    const mobile = L.svg("g", { class: "chariot", role: "slider", "aria-label": "Antenne réceptrice" }, c.calque_bornes);
    let d = 0.5;
    const dessiner = () => { mobile.replaceChildren(); const x = X0 + d * PX; L.svg("path", { d: `M${x} ${RAIL - 2} C${x} ${RAIL + 40} 508 ${RAIL + 10} 508 509`, fill: "none", stroke: "#222", "stroke-width": 2.5 }, mobile); L.svg("rect", { x: x - 14, y: RAIL - 10, width: 28, height: 12, rx: 3, fill: "#5a6670", stroke: "#2a3238" }, mobile); tige(mobile, x, RAIL - 10, RAIL - 190); L.texte(mobile, x, RAIL - 196, `d = ${String(d).replace(".", ",")} m`, { "font-size": 7.5, "font-weight": 700, fill: "#f4f1e6" }); };
    L.glissable(mobile, { soulever: false, debut: () => ({ x: X0 + d * PX, y: RAIL }), deplacer: (p) => { d = Math.max(0.1, Math.min(1, Math.round((p.x - X0) / PX * 20) / 20)); dessiner(); }, fin: () => c.calculer() });
    dessiner();
    const n = (a, b) => c.meme_noeud(a, b), etat = () => {
      const emission = n("gbf.sortie", "E.antenne") && n("gbf.masse", "E.masse"), r = L.am.reglage([gbf.f]), Ur = emission ? (gbf.Umax * 0.03) / d : 0;
      const masse = n("oscillo.masse", "R.masse") || n("oscillo.masse", "gbf.masse"), reception = masse && n("oscillo.Y1", "R.antenne"), voie2_gbf = masse && n("oscillo.Y2", "gbf.sortie");
      L.missions.noter("antennes", { f: gbf.f, d, Ur: arr(Ur, 3), emission, reception, voie2_gbf });
      return { r, Y1: reception ? L.am.sinus(r, gbf.f, Ur) : null, Y2: voie2_gbf ? L.am.sinus(r, gbf.f, gbf.Umax) : null };
    };
    L.oscilloscope(c, { id: "oscillo", x: 650, y: 180, Sv: 0.2, Sv2: 10, b: 0.002, voies: 2, balayages: [0.0001, 0.0002, 0.0005, 0.001, 0.002, 0.005, 0.01], lire: { onde: (nom) => etat()[nom], f: () => gbf.f } });
    c.calculer();
    return { pense_bete };
  };
})(window.Labo);

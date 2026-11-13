/*
Rôle : paillasse « particule chargée dans un champ électrostatique » : tube à déviation électronique et alimentation haute tension.
       Chauffage du filament (6,3 V~), tension accélératrice UA (0 à 5 kV, le faisceau se voit à partir de 1,5 kV), tension UP
       entre les plaques (0 à 5 kV), inverseur (plaque positive en haut ou en bas). Dans le canon (E parallèle à v) l'électron
       acquiert v0 = √(2·e·UA/m) ; entre les plaques (E = UP/d, perpendiculaire à v0) sa trajectoire est la parabole
       y = UP·x² / (4·d·UA), tournée vers la plaque positive ; le faisceau s'arrête sur une plaque s'il l'atteint.
       Toucher l'écran du tube l'ouvre en grand (quadrillage de 1 cm, subdivisions de 2 mm) pour lire des points.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_champ_electrique(g) -> { pense_bete } ; faits « tube_e » = { chauffage, UA, UP, sens, faisceau },
          « vues_ecran » = [{ UA, UP, sens }] (écran ouvert en grand) ; Labo.champ_e = { D, trajectoire(e) } (points en cm).
Utilisé par : simulation.js.
*/
(function (L) {
  const T = L.tube_dessin, D = 0.05, K = 60, Z = { x: 192, y: 150 };

  function trajectoire(e) {
    // Points (cm) de la trace sur l'écran ; vide si le faisceau ne se voit pas.
    if (!e.chauffage || e.UA < 1500) return [];
    const pts = [];
    for (let x = 0; x <= 10.001; x += 0.25) {
      const y = (e.sens * e.UP * (x / 100) ** 2) / (4 * D * e.UA) * 100;
      if (Math.abs(y) >= 2.5) { pts.push({ x: Math.sqrt((0.025 * 4 * D * e.UA) / e.UP) * 100, y: 2.5 * e.sens }); break; }
      pts.push({ x, y });
    }
    return pts;
  }

  function grand(gv, e) {
    // Écran vu en grand : quadrillage 1 cm et 2 mm, plaques, axes gradués, trace.
    gv.replaceChildren();
    L.svg("rect", { x: Z.x - 60, y: Z.y - 70, width: 10 * K + 110, height: 5 * K + 140, rx: 8, fill: "#1b1e21" }, gv);
    L.svg("rect", { x: Z.x, y: Z.y, width: 10 * K, height: 5 * K, fill: "#2a3a35" }, gv);
    for (let i = 0; i <= 50; i++) L.svg("line", { x1: Z.x + (i * K) / 5, y1: Z.y, x2: Z.x + (i * K) / 5, y2: Z.y + 5 * K, stroke: "#c8d6cf", "stroke-width": i % 5 ? 0.3 : 0.9, opacity: i % 5 ? 0.4 : 0.8 }, gv);
    for (let j = 0; j <= 25; j++) L.svg("line", { x1: Z.x, y1: Z.y + (j * K) / 5, x2: Z.x + 10 * K, y2: Z.y + (j * K) / 5, stroke: "#c8d6cf", "stroke-width": j % 5 ? 0.3 : 0.9, opacity: j % 5 ? 0.4 : 0.8 }, gv);
    for (const y of [Z.y - 6, Z.y + 5 * K]) L.svg("rect", { x: Z.x - 8, y, width: 10 * K + 16, height: 6, fill: "url(#metal)" }, gv);
    for (let i = 0; i <= 10; i += 2) L.texte(gv, Z.x + i * K, Z.y + 5 * K + 22, `${i}`, { "font-size": 11, fill: "#dfe6ec" });
    for (let j = -2; j <= 2; j++) L.texte(gv, Z.x - 14, Z.y + 2.5 * K - j * K + 4, `${j}`.replace("-", "−"), { "font-size": 11, fill: "#dfe6ec", "text-anchor": "end" });
    L.texte(gv, Z.x + 10 * K + 30, Z.y + 5 * K + 22, "x (cm)", { "font-size": 10, fill: "#dfe6ec" }); L.texte(gv, Z.x - 30, Z.y - 20, "y (cm)", { "font-size": 10, fill: "#dfe6ec" });
    const pts = trajectoire(e), d = pts.map((p, i) => `${i ? "L" : "M"}${(Z.x + p.x * K).toFixed(1)} ${(Z.y + 2.5 * K - p.y * K).toFixed(1)}`).join(" ");
    if (pts.length > 1) { L.svg("path", { d, fill: "none", stroke: "#7cfcff", "stroke-width": 7, opacity: 0.25 }, gv); L.svg("path", { d, fill: "none", stroke: "#d4fffa", "stroke-width": 2 }, gv); }
    L.texte(gv, Z.x + 5 * K, Z.y - 30, pts.length ? `UA = ${e.UA} V ; UP = ${e.UP} V` : "Aucun faisceau : chauffage et UA ≥ 1 500 V.", { "font-size": 12, "font-weight": 700, fill: "#dfe6ec" });
    L.texte(gv, Z.x + 5 * K, Z.y + 5 * K + 50, "Touchez pour refermer.", { "font-size": 10, fill: "#888" });
  }

  function commandes(g, e, maj) {
    // Interrupteur du chauffage, boutons UA et UP, inverseur de polarité des plaques.
    const P = T.PANNEAU, b = L.svg("g", { class: "chauffage", role: "switch", "aria-label": "Chauffage" }, g);
    L.svg("rect", { x: P.x + 18, y: P.y + 28, width: 18, height: 24, rx: 3, fill: "#111" }, b);
    const bascule = L.svg("rect", { x: P.x + 21, y: P.y + 31, width: 12, height: 9, rx: 2, fill: "#c62828" }, b);
    L.texte(g, P.x + 27, P.y + 64, "Chauffage", { "font-size": 6, fill: "#dfe6ec" });
    L.glissable(b, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.chauffage = !e.chauffage; bascule.setAttribute("y", e.chauffage ? P.y + 40 : P.y + 31); maj(); } });
    L.bouton_reglage(g, { x: P.x + 110, y: P.y + 78, min: 0, max: 5000, pas: 100, valeur: 0, unite: "V", titre: "UA", decimales: 0, sur_changement: (v) => { e.UA = v; maj(); } });
    L.bouton_reglage(g, { x: P.x + 230, y: P.y + 78, min: 0, max: 5000, pas: 100, valeur: 0, unite: "V", titre: "UP", decimales: 0, sur_changement: (v) => { e.UP = v; maj(); } });
    const inv = L.svg("g", { class: "inverseur", role: "switch", "aria-label": "Polarité des plaques" }, g);
    L.svg("rect", { x: P.x + 318, y: P.y + 50, width: 14, height: 30, rx: 7, fill: "#111" }, inv);
    const levier = L.svg("circle", { cx: P.x + 325, cy: P.y + 57, r: 5, fill: "url(#acier)" }, inv);
    L.texte(g, P.x + 325, P.y + 94, "+ haut / bas", { "font-size": 5.5, fill: "#dfe6ec" });
    L.glissable(inv, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { e.sens = -e.sens; levier.setAttribute("cy", e.sens > 0 ? P.y + 57 : P.y + 73); maj(); } });
  }

  L.poste_champ_electrique = function (g) {
    // Matériel, cordons, commandes ; l'écran du tube se touche pour l'ouvrir en grand.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), e = { chauffage: false, UA: 0, UP: 0, sens: 1 }, vues = [];
    L.cordon_secteur(g, { x: T.PANNEAU.x + 340, y: T.PANNEAU.y - 10 }, { x: 962, y: 322 });
    T.tube(g); T.alimentation(g); T.cordons(g);
    const gt = L.svg("g", { "pointer-events": "none" }, g), zone = L.svg("rect", { class: "ecran-tube", x: T.ECRAN.x, y: T.ECRAN.y - 35, width: 140, height: 70, fill: "#000", opacity: 0.001 }, g);
    const maj = () => { const pts = trajectoire(e); T.trace(gt, pts, e.chauffage); L.missions.noter("tube_e", { ...e, faisceau: pts.length > 1 }); };
    commandes(g, e, maj);
    const gv = L.svg("g", { class: "vue-ecran" }, g);
    L.glissable(zone, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { grand(gv, e); if (trajectoire(e).length) { vues.push({ UA: e.UA, UP: e.UP, sens: e.sens }); L.missions.noter("vues_ecran", vues.slice()); } } });
    L.glissable(gv, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => gv.replaceChildren() });
    maj(); L.missions.noter("vues_ecran", []);
    return { pense_bete };
  };
  L.champ_e = { D, trajectoire };
})(window.Labo);

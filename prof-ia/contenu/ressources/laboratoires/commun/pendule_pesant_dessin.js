/*
Rôle : dessin du pendule pesant vu de face (500 px/m) : statif (socle, tige, noix, bras), capteur de rotation au bout du bras
       (boîtier cylindrique vu dans l'axe, plaque signalétique, câble jusqu'à la prise de l'interface), rapporteur en plexiglas
       derrière l'axe (graduations tous les 5°), tige en aluminium de 50 cm (axe à 1 cm du bout, trous tous les 10 cm,
       graduations en cm) serrée dans un moyeu, masse coulissante en laiton (200 g) et sa vis de blocage ; palette
       d'amortissement en aluminium mince (plan contenant la tige et l'axe, vue en perspective) et sa pince ;
       palette posée à plat sur la paillasse quand elle n'est pas montée.
Reçoit : { x, y (axe de rotation, px), sol (dessus de la paillasse, px), prise { x, y } (prise du capteur sur l'interface) } ;
         puis l'angle θ (rad), la distance d (m) de la masse à l'axe et l'état de la palette.
Produit : Labo.pendule_pesant_dessin(reglage) -> { fond(g), pendule(g, th, d, palette), palette_table(g, montee), point(r, th),
          AXE, PX, ZONE_PALETTE } (le dernier créé est aussi Labo.pendule_pesant_dessin.actif, pour les tests).
Utilisé par : b2_meca4_s1_pendule_pesant (poste_pendule_pesant.js) ; l'énergie du pendule pesant (2e année du bac).
*/
(function (L) {
  const PX = 500, PROF = { x: 20, y: -11 }, PALETTE = [0.435, 0.49];

  L.pendule_pesant_dessin = function ({ x = 360, y = 200, sol = 500, prise }) {
    // Crée le dessin pour un pendule dont l'axe est en (x, y) ; le statif est à droite de l'axe.
    const AXE = { x, y }, XS = x + 150, ZONE_PALETTE = { x: x - 70, y: sol + 30 };
    const point = (r, th) => ({ x: AXE.x + r * PX * Math.sin(th), y: AXE.y + r * PX * Math.cos(th) });

    function statif(g) {
      // Socle lourd, tige verticale, noix et bras horizontal qui porte le capteur.
      L.ombre_sol(g, XS + 10, sol + 26, 92, 10, 0.5);
      L.svg("path", { d: `M${XS - 66} ${sol} H${XS + 86} L${XS + 78} ${sol + 16} H${XS - 74} Z`, fill: "#3a3f45" }, g);
      L.svg("rect", { x: XS - 74, y: sol + 16, width: 152, height: 13, rx: 2, fill: "url(#acier)" }, g);
      L.svg("rect", { x: XS - 5, y: y - 90, width: 10, height: sol + 8 - y + 90, fill: "url(#metal)" }, g);
      L.svg("rect", { x: x + 10, y: y - 36, width: XS - x - 10, height: 8, fill: "url(#metal-h)" }, g);
      L.svg("rect", { x: XS - 13, y: y - 44, width: 26, height: 24, rx: 3, fill: "url(#acier)" }, g);
      L.svg("rect", { x: XS + 11, y: y - 37, width: 13, height: 6, rx: 2, fill: "#1b1e21" }, g);
      L.svg("rect", { x: x - 8, y: y - 40, width: 26, height: 30, rx: 2, fill: "#5b6268", stroke: "#2b2f33" }, g);
    }

    function capteur(g) {
      // Boîtier du capteur vu dans l'axe, plaque, câble qui longe le bras et descend jusqu'à l'interface.
      L.svg("path", { d: `M${x + 14} ${y - 14} C${x + 60} ${y - 20} ${XS - 30} ${y - 22} ${XS - 12} ${y - 14} S${XS - 22} ${sol - 40} ${prise.x} ${prise.y}`, fill: "none", stroke: "#222", "stroke-width": 2.2 }, g);
      L.svg("circle", { cx: x, cy: y, r: 19, fill: "#1f2327", stroke: "#000" }, g);
      L.svg("circle", { cx: x, cy: y, r: 15, fill: "none", stroke: "#3b4046", "stroke-width": 1.4 }, g);
      L.svg("rect", { x: x - 30, y: y - 58, width: 60, height: 14, rx: 2, fill: "#e9ecef", stroke: "#8a96a0" }, g);
      L.texte(g, x, y - 48, "CAPTEUR DE ROTATION", { "font-size": 4.8, "font-weight": 700, fill: "#23315a" });
      L.svg("path", { d: `M${x} ${y - 44} V${y - 19}`, stroke: "#5b6268", "stroke-width": 4 }, g);
    }

    function rapporteur(g) {
      // Rapporteur demi-cercle en plexiglas, centré sur l'axe : 0° à la verticale, nombres tous les 10° jusqu'à 60°.
      const R = 104;
      L.svg("path", { d: `M${x - R - 6} ${y} A${R + 6} ${R + 6} 0 0 0 ${x + R + 6} ${y} Z`, fill: "#e8f3f6", opacity: 0.55, stroke: "#9fb6be" }, g);
      for (let a = -90; a <= 90; a += 5) {
        const t = (a * Math.PI) / 180, l = a % 10 ? 5 : 9, p = { x: x + R * Math.sin(t), y: y + R * Math.cos(t) };
        L.svg("line", { x1: p.x, y1: p.y, x2: x + (R - l) * Math.sin(t), y2: y + (R - l) * Math.cos(t), stroke: "#1d2a33", "stroke-width": a % 10 ? 0.4 : 0.7 }, g);
        if (a % 10 === 0 && Math.abs(a) <= 60) L.texte(g, x + (R - 16) * Math.sin(t), y + 2 + (R - 16) * Math.cos(t), String(Math.abs(a)), { "font-size": 5.5, fill: "#1d2a33" });
      }
    }

    function fond(g) {
      // Statif, rapporteur, capteur.
      statif(g); rapporteur(g); capteur(g);
    }

    function masse(g, d) {
      // Masse coulissante en laiton (cylindre enfilé sur la tige) et vis de blocage à molette.
      const c = d * PX;
      L.svg("rect", { x: -9, y: c - 6.5, width: 18, height: 13, rx: 1.5, fill: "url(#laiton)", stroke: "#6d4a0e", "stroke-width": 0.6 }, g);
      L.svg("ellipse", { cx: 0, cy: c - 6.5, rx: 9, ry: 2, fill: "#e2c374", stroke: "#6d4a0e", "stroke-width": 0.4 }, g);
      L.svg("rect", { x: 9, y: c - 1.5, width: 3, height: 3, fill: "url(#acier)" }, g);
      L.svg("rect", { x: 12, y: c - 4, width: 3.5, height: 8, rx: 1, fill: "#2b2f33" }, g);
    }

    function tige(g) {
      // Tige en aluminium (axe à 1 cm du bout), trous tous les 10 cm, graduations en cm, moyeu et vis de serrage.
      L.svg("rect", { x: -3.8, y: -0.01 * PX, width: 7.6, height: 0.5 * PX, rx: 1.5, fill: "url(#metal)", stroke: "#7c858c", "stroke-width": 0.5 }, g);
      for (let c = 1; c <= 48; c++) L.svg("line", { x1: -3.8, y1: c * 5, x2: c % 5 ? -2.2 : -0.8, y2: c * 5, stroke: "#2b2f33", "stroke-width": 0.35 }, g);
      for (let c = 10; c <= 40; c += 10) { L.svg("circle", { cx: 1.6, cy: c * 5, r: 1.3, fill: "#2b2f33" }, g); }
      L.svg("circle", { cx: 0, cy: 0, r: 9, fill: "url(#acier)", stroke: "#111" }, g);
      L.svg("circle", { cx: 0, cy: 0, r: 3, fill: "#9aa3aa", stroke: "#333", "stroke-width": 0.5 }, g);
      L.svg("rect", { x: -2, y: 7, width: 4, height: 4, fill: "#1b1e21" }, g);
    }

    function palette_montee(g, th) {
      // Palette dans le plan de la tige et de l'axe (perspective), pince serrée sur la tige.
      const a = point(PALETTE[0], th), b = point(PALETTE[1], th);
      L.svg("path", { d: `M${a.x} ${a.y} L${b.x} ${b.y} l${PROF.x} ${PROF.y} L${a.x + PROF.x} ${a.y + PROF.y} Z`, fill: "#c9d1d6", opacity: 0.85, stroke: "#6c747a", "stroke-width": 0.7 }, g);
      const p = point(PALETTE[0] + 0.004, th);
      L.svg("circle", { cx: p.x, cy: p.y, r: 3.2, fill: "#2b2f33" }, g);
    }

    function pendule(g, th, d, palette) {
      // Tige tournée de θ autour de l'axe, masse à d, palette si elle est montée.
      g.replaceChildren();
      if (palette) palette_montee(g, th);
      const r = L.svg("g", { transform: `translate(${x} ${y}) rotate(${(-th * 180) / Math.PI})` }, g);
      tige(r); masse(r, d);
    }

    function palette_table(g, montee) {
      // Palette posée à plat sur la paillasse (estompée quand elle est montée sur le pendule).
      g.replaceChildren();
      const P = ZONE_PALETTE;
      L.ombre_sol(g, P.x, P.y + 6, 34, 4, montee ? 0.1 : 0.3);
      L.svg("path", { d: `M${P.x - 28} ${P.y + 4} l8 -10 h48 l-8 10 Z`, fill: "#c9d1d6", stroke: "#6c747a", opacity: montee ? 0.25 : 1 }, g);
      L.texte(g, P.x, P.y + 16, "palette", { "font-size": 6.5, fill: "#f4f1e6", opacity: montee ? 0.4 : 1 });
    }

    const o = { fond, pendule, palette_table, point, AXE, PX, ZONE_PALETTE };
    L.pendule_pesant_dessin.actif = o;
    return o;
  };
})(window.Labo);

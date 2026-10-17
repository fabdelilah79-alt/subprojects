/*
Rôle : dessin, aux vraies dimensions (1,6 px par mm), du montage d'hydrodistillation : deux supports et leurs pinces,
       support élévateur, chauffe-ballon (chauffe_ballon.js), col de cygne,
       réfrigérant droit incliné de 24 cm (deux embouts : entrée en bas, sortie en haut), allonge qui plonge dans
       l'éprouvette graduée de 50 mL, robinet d'eau au mur et évier.
Reçoit : les plans de la paillasse (ctx) ; pour l'eau du manchon : le groupe et l'état { eau, tuyau }.
Produit : Labo.hydro = { fixe(ctx) -> chauffe-ballon, refrigerant(g), eau_manchon(g, etat), REFRI, EMBOUTS, BALLON, POINTE, EPROUVETTE, ROBINET, EVIER, CHAUFFE }.
Utilisé par : poste_hydro.js.
*/
(function (L) {
  const E = 1.6, VERRE = { fill: "rgba(205,228,236,0.45)", stroke: "rgba(120,150,160,0.9)", "stroke-width": 0.8 };
  const BALLON = { x: 340, y: 400 }, CHAUFFE = { x: 340, haut: 336, bas: 480 }, A = { x: 400, y: 178 }, LONG = 380, ANG = 12;
  const COS = Math.cos((ANG * Math.PI) / 180), SIN = Math.sin((ANG * Math.PI) / 180);
  const le_long = (s) => ({ x: A.x + LONG * s * COS, y: A.y + LONG * s * SIN });
  const B = le_long(1), POINTE = { x: 790, y: 306 }, EPROUVETTE = { x: 790, sol: 576 }, ROBINET = { x: 870, y: 330 }, EVIER = { x: 894, y: 446 };
  const embout = (s, cote) => { const p = le_long(s), u = { x: -SIN * cote, y: COS * cote }; return { x: p.x + 34 * u.x, y: p.y + 34 * u.y, ux: u.x, uy: u.y }; };
  // Embouts du manchon, perpendiculaires au réfrigérant : extrémité (x, y) et direction vers l'extérieur (ux, uy).
  const EMBOUTS = { bas: embout(0.86, 1), haut: embout(0.16, -1) };

  function supports(g) {
    // Deux supports (tige sur socle) : pince du col du ballon, pince du réfrigérant ; noix grises, mâchoires liège.
    for (const [x, y_haut, pince] of [[220, 160, { y: 240, x2: 322 }], [592, 196, { y: le_long(0.55).y, x2: le_long(0.55).x - 6 }]]) {
      L.svg("rect", { x: x - 62, y: 542, width: 124, height: 9, rx: 2, fill: "#3a3f44" }, g);
      L.tige(g, `M${x} 544 V${y_haut}`, 6);
      L.svg("rect", { x: x - 8, y: pince.y - 8, width: 16, height: 16, rx: 2, fill: "#5d646a" }, g);
      L.tige(g, `M${x} ${pince.y} H${pince.x2}`, 4);
      L.svg("rect", { x: pince.x2 - 3, y: pince.y - 12, width: 14, height: 24, rx: 4, fill: "#b9894f", stroke: "#7a5730" }, g);
    }
  }

  function elevateur(g) {
    // Support élévateur à croisillons sous le chauffe-ballon.
    const x = CHAUFFE.x, h = CHAUFFE.bas;
    L.svg("ellipse", { cx: x + 6, cy: 577, rx: 120, ry: 5, fill: "#000", opacity: 0.3 }, g);
    for (const y of [h, 568]) L.svg("rect", { x: x - 112, y, width: 224, height: 8, rx: 1.5, fill: "url(#metal)", stroke: "#7d868c" }, g);
    L.svg("path", { d: `M${x - 90} ${h + 8} L${x + 90} 568 M${x + 90} ${h + 8} L${x - 90} 568`, stroke: "#8c949a", "stroke-width": 5 }, g);
    L.svg("circle", { cx: x, cy: (h + 576) / 2, r: 5, fill: "#5d646a" }, g);
    L.svg("rect", { x: x + 100, y: (h + 568) / 2 - 4, width: 22, height: 8, rx: 3, fill: "#30353a" }, g);
  }

  function refrigerant(g) {
    // Col de cygne, réfrigérant droit (tube intérieur, manchon, embouts à olive), allonge.
    const col = BALLON.y - 118 * E;
    L.svg("path", { d: `M${BALLON.x} ${col + 4} V${A.y + 14} Q${BALLON.x} ${A.y - 12} ${A.x} ${A.y}`, fill: "none", stroke: "rgba(120,150,160,0.9)", "stroke-width": 22, "stroke-linecap": "butt" }, g);
    L.svg("path", { d: `M${BALLON.x} ${col + 4} V${A.y + 14} Q${BALLON.x} ${A.y - 12} ${A.x} ${A.y}`, fill: "none", stroke: "rgba(225,240,245,0.92)", "stroke-width": 20, "stroke-linecap": "butt" }, g);
    const r = L.svg("g", { transform: `translate(${A.x} ${A.y}) rotate(${ANG})` }, g);
    L.svg("rect", { x: -6, y: -7, width: LONG + 6, height: 14, ...VERRE }, r);
    for (const [s, c] of [[0.16, -1], [0.86, 1]]) {
      L.svg("rect", { x: LONG * s - 5, y: c < 0 ? -34 : 20, width: 10, height: 14, ...VERRE }, r);
      L.svg("rect", { x: LONG * s - 6.5, y: c < 0 ? -32 : 26, width: 13, height: 5, rx: 2, ...VERRE }, r);
    }
    L.svg("rect", { x: LONG * 0.1, y: -20, width: LONG * 0.8, height: 40, rx: 12, ...VERRE }, r);
    L.svg("rect", { x: LONG * 0.12, y: -16, width: LONG * 0.76, height: 3, rx: 1.5, fill: "#fff", opacity: 0.45 }, r);
    L.svg("path", { d: `M${B.x - 4} ${B.y - 7} Q${POINTE.x + 6} ${B.y - 4} ${POINTE.x + 5} ${B.y + 24} V${POINTE.y} H${POINTE.x - 5} V${B.y + 26} Q${POINTE.x - 6} ${B.y + 8} ${B.x - 4} ${B.y + 7} Z`, ...VERRE }, g);
  }

  function fixe(ctx) {
    // Tout ce qui ne bouge pas : robinet, évier, supports, élévateur, chauffe-ballon, verrerie fixe.
    const g = ctx.fond;
    L.svg("rect", { x: EVIER.x - 60, y: EVIER.y - 22, width: 120, height: 44, rx: 6, fill: "#c9d0d4", stroke: "#8f989e" }, g);
    L.svg("rect", { x: EVIER.x - 52, y: EVIER.y - 16, width: 104, height: 32, rx: 5, fill: "#7f8a90" }, g);
    L.svg("circle", { cx: EVIER.x + 30, cy: EVIER.y, r: 4, fill: "#3a3f44" }, g);
    L.svg("rect", { x: ROBINET.x - 8, y: ROBINET.y - 18, width: 16, height: 12, rx: 2, fill: "url(#metal)" }, g);
    L.svg("path", { d: `M${ROBINET.x - 4} ${ROBINET.y - 6} V${ROBINET.y + 10} h8 V${ROBINET.y - 6}`, fill: "url(#metal)", stroke: "#7d868c" }, g);
    supports(g); elevateur(g); return L.chauffe_ballon(g, ctx.devant, CHAUFFE);
  }

  function eau_manchon(g, e) {
    // Eau froide dans le manchon : plein si elle entre par le bas, presque vide si elle entre par le haut.
    g.replaceChildren();
    if (!e.eau || !e.tuyau) return;
    const r = L.svg("g", { transform: `translate(${A.x} ${A.y}) rotate(${ANG})`, "pointer-events": "none" }, g), k = e.tuyau === "bas" ? 1 : 0.25;
    L.svg("rect", { x: LONG * 0.1 + 3, y: 17 - 34 * k, width: LONG * 0.8 - 6, height: 34 * k, rx: 10, fill: "#5fb3dc", opacity: 0.45 }, r);
  }

  L.hydro = { fixe, eau_manchon, refrigerant, EMBOUTS, BALLON, POINTE, EPROUVETTE, ROBINET, EVIER, CHAUFFE, le_long, E };
})(window.Labo);

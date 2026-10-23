/*
Rôle : dessin du volant d'inertie vu de face (échelle 0,8 px/mm) : palier et moteur d'entraînement, disque d'acier
       (A : R = 10,0 cm, B : R = 14,0 cm, masse 1,00 kg) avec ses repères (flous quand il tourne vite), patin de frein,
       disque de rechange posé à plat sur la paillasse, panneau du compte-tours et du compteur de tours.
Reçoit : le groupe SVG ; l'état du volant (disque monté, angle, vitesse angulaire, frein serré).
Produit : Labo.volant_dessin = { fond(g), disque(g, nom, theta, omega), patin(g, rayon, serre), rechange(g, nom, p),
          afficheurs(g, N, n), DISQUES, C, MM }.
Utilisé par : poste_volant.js.
*/
(function (L) {
  const MM = 0.8, C = { x: 430, y: 300 }, TABLE = 560;
  const DISQUES = { A: { R: 100, J: 0.5 * 1 * 0.1 ** 2, teinte: "#9aa4ab" }, B: { R: 140, J: 0.5 * 1 * 0.14 ** 2, teinte: "#8d9a8f" } };

  function fond(g) {
    // Socle, palier (derrière le disque), moteur et son arbre, panneau des afficheurs, fiche des données.
    L.svg("rect", { x: C.x - 90, y: TABLE - 14, width: 180, height: 14, rx: 3, fill: "#3a3f44" }, g);
    L.svg("path", { d: `M${C.x - 22} ${TABLE - 14} L${C.x - 10} ${C.y} H${C.x + 10} L${C.x + 22} ${TABLE - 14} Z`, fill: "#4b555c", stroke: "#1b1e21" }, g);
    L.svg("rect", { x: 230, y: C.y - 26, width: 90, height: 52, rx: 8, fill: "#2b3035", stroke: "#000" }, g);
    L.texte(g, 275, C.y + 4, "moteur", { "font-size": 8, fill: "#cfd6db" });
    L.tige(g, `M320 ${C.y} H${C.x}`, 6);
    L.svg("rect", { x: 330, y: C.y - 10, width: 16, height: 20, rx: 2, fill: "#6b5a3a", stroke: "#2b1f0a" }, g);
    L.svg("rect", { x: 660, y: 100, width: 220, height: 92, rx: 6, fill: "#2c3e50", stroke: "#111" }, g);
    L.texte(g, 770, 114, "COMPTE-TOURS", { "font-size": 7, "font-weight": 700, fill: "#e8ecef" });
    L.texte(g, 770, 156, "TOURS DEPUIS LE FREINAGE", { "font-size": 7, "font-weight": 700, fill: "#e8ecef" });
    for (const y of [120, 162]) L.svg("rect", { x: 690, y, width: 160, height: 24, rx: 3, fill: "#1d2a22" }, g);
    L.svg("rect", { x: 640, y: 214, width: 260, height: 60, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0" }, g);
    ["Disque A : 1,00 kg ; R = 10,0 cm ; J = 5,0×10⁻³ kg·m²", "Disque B : 1,00 kg ; R = 14,0 cm ; J = 9,8×10⁻³ kg·m²", "Frein : moment du couple de frottement constant"].forEach((t, i) => L.texte(g, 770, 232 + i * 16, t, { "font-size": 8.5, fill: "#222" }));
  }

  function disque(g, nom, theta, omega) {
    // Disque d'acier, six repères et un trait rouge ; au-delà de 3 tr/s, les repères se fondent (flou de mouvement).
    const d = DISQUES[nom], R = d.R * MM, net = Math.max(0.12, 1 - Math.abs(omega) / 25);
    const gr = L.svg("g", { class: "disque-monte", role: "button", "aria-label": `Disque ${nom}` }, g);
    L.svg("circle", { cx: C.x, cy: C.y, r: R, fill: d.teinte, stroke: "#3c4246", "stroke-width": 2 }, gr);
    L.svg("circle", { cx: C.x, cy: C.y, r: R - 6, fill: "none", stroke: "#c3cbd0", "stroke-width": 1.2 }, gr);
    const rep = L.svg("g", { transform: `rotate(${(theta * 180) / Math.PI} ${C.x} ${C.y})`, opacity: net }, gr);
    for (let k = 0; k < 6; k++) { const a = (k * Math.PI) / 3; L.svg("line", { x1: C.x + 18 * Math.cos(a), y1: C.y + 18 * Math.sin(a), x2: C.x + (R - 10) * Math.cos(a), y2: C.y + (R - 10) * Math.sin(a), stroke: "#59636a", "stroke-width": 1.4 }, rep); }
    L.svg("line", { x1: C.x, y1: C.y, x2: C.x, y2: C.y - R + 8, stroke: "#d0312d", "stroke-width": 4, "stroke-linecap": "round" }, rep);
    L.svg("circle", { cx: C.x, cy: C.y, r: 12, fill: "url(#metal)", stroke: "#333" }, gr);
    L.texte(gr, C.x, C.y + R * 0.55, nom, { "font-size": 14, "font-weight": 700, fill: "#2b3136", opacity: net });
  }

  function patin(g, rayon, serre) {
    // Levier et patin de frein en feutre contre la jante, à droite ; écarté quand le frein est desserré.
    const x = C.x + rayon * MM + (serre ? 0 : 6);
    L.svg("path", { d: `M${x + 30} ${TABLE - 14} L${x + 14} ${C.y + 6}`, stroke: "#3a3f44", "stroke-width": 6 }, g);
    L.svg("rect", { x, y: C.y - 14, width: 14, height: 28, rx: 2, fill: "#6b2f2a", stroke: "#2b0f0c" }, g);
  }

  function rechange(g, nom, p) {
    // Disque de rechange posé à plat (ou tenu à la main en p).
    const R = DISQUES[nom].R * MM, gr = L.svg("g", { class: "disque-rechange", role: "button", "aria-label": `Disque ${nom}` }, g);
    L.svg("ellipse", { cx: p.x, cy: p.y, rx: R, ry: R * 0.22, fill: DISQUES[nom].teinte, stroke: "#3c4246", "stroke-width": 1.5 }, gr);
    L.svg("ellipse", { cx: p.x, cy: p.y, rx: 10, ry: 3, fill: "#2b3136" }, gr);
    L.texte(gr, p.x, p.y + R * 0.12, nom, { "font-size": 11, "font-weight": 700, fill: "#2b3136" });
  }

  function afficheurs(g, N, n) {
    // Vitesse de rotation (tr/min) et nombre de tours depuis le début du freinage.
    const o = { "font-size": 12, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" };
    L.texte(g, 770, 137, `${Math.round(N)} tr/min`, o);
    L.texte(g, 770, 179, `${n.toFixed(1).replace(".", ",")} tours`, o);
  }

  L.volant_dessin = { fond, disque, patin, rechange, afficheurs, DISQUES, C, MM, TABLE };
})(window.Labo);

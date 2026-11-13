/*
Rôle : scène de la barque, vue de côté : un lac, un ponton à gauche, une barque où se tient un enfant. Au signal,
       l'enfant saute sur le ponton ; la barque recule. Une ligne de bouées tous les 0,5 m sert de règle.
Reçoit : le groupe SVG de la scène ; { m_enfant, m_barque, v_enfant } (kg, m/s).
Produit : Labo.poste_barque(groupe, reglages) -> {} ; fait « recul_barque » (photographie terminée).
Utilisé par : simulation.js.
*/
(function (L) {
  const ECH = 100, O = 60, EAU = 440, BOUEES = 478;

  function fond(g) {
    // Ciel, collines, lac, ponton de bois, ligne de bouées graduée, quai au premier plan.
    const defs = g.ownerSVGElement.querySelector("defs"), d = L.svg("linearGradient", { id: "ciel-lac", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    for (const [o, c] of [[0, "#8ec3ea"], [1, "#e3f1fa"]]) L.svg("stop", { offset: o, "stop-color": c }, d);
    L.svg("rect", { width: L.LARGEUR, height: EAU, fill: "url(#ciel-lac)" }, g);
    L.svg("path", { d: `M0 ${EAU} L0 360 Q160 300 330 350 T700 330 T1024 350 V${EAU} Z`, fill: "#7aa36a" }, g);
    L.svg("path", { d: `M0 ${EAU} L0 395 Q260 360 520 392 T1024 385 V${EAU} Z`, fill: "#5f8b52" }, g);
    const e = L.svg("linearGradient", { id: "eau-lac", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    for (const [o, c] of [[0, "#5d97b8"], [1, "#2d5f7e"]]) L.svg("stop", { offset: o, "stop-color": c }, e);
    L.svg("rect", { y: EAU, width: L.LARGEUR, height: L.HAUTEUR - EAU, fill: "url(#eau-lac)" }, g);
    for (let i = 0; i < 26; i++) L.svg("path", { d: `M${(i * 97) % 1000} ${EAU + 12 + ((i * 37) % 110)} q14 -3 28 0`, stroke: "#cfe6f2", "stroke-width": 1, fill: "none", opacity: 0.5 }, g);
    for (const x of [20, 110, 200]) L.svg("rect", { x: x - 5, y: 420, width: 10, height: 90, fill: "#5b3d22" }, g);
    L.svg("rect", { x: 0, y: 414, width: O + 1.8 * ECH, height: 14, fill: "url(#bois)", stroke: "#6b4a2a" }, g);
    for (let x = 0; x < O + 1.8 * ECH; x += 22) L.svg("line", { x1: x, y1: 414, x2: x, y2: 428, stroke: "#6b4a2a", "stroke-width": 0.8 }, g);
    for (let m = 0; m <= 9; m += 0.5) {
      const x = O + m * ECH;
      L.svg("circle", { cx: x, cy: BOUEES, r: 4.5, fill: m % 1 ? "#ffffff" : "#e53935", stroke: "#333", "stroke-width": 0.6 }, g);
      if (m % 1 === 0) L.texte(g, x, BOUEES + 15, `${m} m`, { "font-size": 11, "font-weight": 700, fill: "#f4f8fb" });
    }
    L.svg("line", { x1: O, y1: BOUEES, x2: O + 9 * ECH, y2: BOUEES, stroke: "#e9e2cf", "stroke-width": 1 }, g);
    L.svg("rect", { y: 560, width: L.LARGEUR, height: 80, fill: "url(#bois-face)" }, g);
    L.svg("rect", { y: 560, width: L.LARGEUR, height: 8, fill: "url(#bois)" }, g);
  }

  function barque(g, x) {
    // Coque de bois, bordé, petit mât avec son fanion rouge (point repère).
    L.svg("path", { d: `M${x - 130} 432 Q${x - 120} 466 ${x - 80} 470 H${x + 90} Q${x + 128} 462 ${x + 136} 428 Z`, fill: "#8a5a32", stroke: "#4e3019", "stroke-width": 1.2 }, g);
    L.svg("path", { d: `M${x - 126} 440 H${x + 133}`, stroke: "#b07a47", "stroke-width": 3 }, g);
    L.svg("ellipse", { cx: x, cy: 472, rx: 120, ry: 5, fill: "#1f4660", opacity: 0.5 }, g);
    L.tige(g, `M${x} 432 V352`, 3);
    L.svg("path", { d: `M${x} 352 l22 6 l-22 6 Z`, fill: "#d32f2f" }, g);
  }

  function enfant(g, x, etat, x0) {
    // L'enfant : debout dans la barque, en l'air pendant le saut, puis debout sur le ponton.
    const s = Math.max(0, Math.min(1, (x0 - (x - O) / ECH) / (x0 - 1.3))), pied = (etat.parti && s >= 1 ? 414 : 432) - Math.sin(Math.PI * s) * 38;
    L.svg("path", { d: `M${x - 6} ${pied} L${x} ${pied - 34} L${x + 6} ${pied}`, stroke: "#2b3a55", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, g);
    L.svg("path", { d: `M${x} ${pied - 34} V${pied - 62}`, stroke: "#e07a2f", "stroke-width": 12, "stroke-linecap": "round" }, g);
    L.svg("path", { d: `M${x} ${pied - 56} l${etat.parti ? -16 : -10} ${etat.parti ? -10 : 14} M${x} ${pied - 56} l${etat.parti ? 14 : 10} ${etat.parti ? -12 : 14}`, stroke: "#c98f6b", "stroke-width": 4, "stroke-linecap": "round" }, g);
    L.svg("circle", { cx: x, cy: pied - 72, r: 9, fill: "#c98f6b" }, g);
    return pied - 72;
  }

  L.poste_barque = function (g, { m_enfant, m_barque, v_enfant }) {
    // Construit le lac et branche la scène de recul (photo toutes les 0,25 s).
    fond(g);
    L.svg("rect", { x: 22, y: 330, width: 190, height: 44, rx: 3, fill: "#f7f5ee", stroke: "#8a6a45" }, g);
    L.texte(g, 117, 345, `Enfant : ${m_enfant} kg`, { class: "etiquette-carton", "font-size": 15 });
    L.texte(g, 117, 363, `Barque : ${m_barque} kg`, { class: "etiquette-carton", "font-size": 15 });
    const X0 = 2.45, tete = { y: 360 };
    L.scene_recul(g, {
      nom: "recul_barque", photo_s: 0.25, duree_s: 2.5, echelle: ECH, origine_px: O, sol_y: BOUEES, bouton: { x: 512, y: 604, texte: "Sauter !" },
      corps: [
        { masse: m_enfant, x0: X0, v: -v_enfant, arret: (x) => x <= 1.3, couleur: "#ffd60a", repere_y: () => tete.y, dessiner: (h, x, e) => { tete.y = enfant(h, x, e, X0); } },
        { masse: m_barque, x0: 3.45, arret: (x) => x >= 8.8, couleur: "#e53935", repere_y: 358, dessiner: (h, x) => barque(h, x) },
      ],
    });
    L.texte(g, 512, 24, "Photographie à pose multiple : une image toutes les 0,25 s", { "font-size": 15, "font-weight": 700, fill: "#14324f" });
    return {};
  };
})(window.Labo);

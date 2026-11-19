/*
Rôle : microscope optique de lycée dessiné en 2,5D (vu de profil, un peu d'en haut) : pied en fer à cheval avec la lampe,
       potence, platine qui monte et descend (crémaillère) avec ses valets, condenseur, tube, revolver à trois objectifs
       (×4 rouge, ×10 jaune, ×40 bleu ; l'objectif en service est vertical), oculaire (×10 ou ×20) ; lame posée sur la platine.
Reçoit : le groupe SVG et { z (hauteur de la platine, mm), obj (0, 1, 2), oculaire (10 ou 20), lampe, lame (nom ou null) }.
Produit : Labo.MICRO (géométrie : axe, objectifs, pointe(obj), y_lame(z), contact(obj)) ; Labo.microscope(g, reglage).
Utilisé par : poste_microscope.js.
*/
(function (L) {
  const X = 330, OBJ = [{ g: 4, coul: "#c62828", lg: 18, wd: 18, dof: 0.04, ouv: 0.1 }, { g: 10, coul: "#f9a825", lg: 40, wd: 7, dof: 0.01, ouv: 0.25 }, { g: 40, coul: "#1565c0", lg: 53, wd: 0.6, dof: 0.002, ouv: 0.65 }];
  const M = L.MICRO = {
    X, OBJ, REV: 376, pointe: (o) => 376 + OBJ[o].lg, y_platine: (z) => 445 - 2 * z,
    contact: (o) => (443 - (376 + OBJ[o].lg)) / 2, net: [6.5, 6.52, 6.506],
  };

  function pied_potence(g, lampe) {
    // Pied en fer à cheval (dessus, tranche), lampe intégrée, interrupteur, potence courbe.
    L.ombre_sol(g, X - 10, 566, 130, 10, 0.5);
    L.svg("path", { d: "M196 540 H430 L450 556 H176 Z", fill: "#353a41", stroke: "#111" }, g);
    L.svg("rect", { x: 176, y: 556, width: 274, height: 12, rx: 2, fill: "#22262b" }, g);
    L.svg("rect", { x: 404, y: 558, width: 16, height: 7, rx: 1.5, fill: lampe ? "#7cff8a" : "#555" }, g);
    L.svg("ellipse", { cx: X, cy: 543, rx: 13, ry: 3.5, fill: lampe ? "#fff7d1" : "#6b6f75", stroke: "#111" }, g);
    if (lampe) L.svg("circle", { cx: X, cy: 540, r: 24, fill: "url(#halo)" }, g);
    L.svg("path", { d: "M222 541 C206 452 204 338 236 266 L272 244 L322 254 L322 282 L284 286 C262 334 262 444 272 541 Z", fill: "#30353b", stroke: "#0b0d0f" }, g);
    L.svg("path", { d: "M230 520 C218 440 218 340 244 276", fill: "none", stroke: "#5a6168", "stroke-width": 3, opacity: 0.6 }, g);
  }

  function platine(g, z, lame, lampe) {
    // Crémaillère, platine (dessus en perspective, tranche), trou, valets, condenseur, lame, lumière qui traverse.
    const y = M.y_platine(z);
    L.svg("rect", { x: 254, y: y - 4, width: 22, height: 48, rx: 2, fill: "#24282d", stroke: "#000" }, g);
    if (lampe) L.svg("path", { d: `M${X - 10} 541 L${X - 5} ${y + 40} L${X + 5} ${y + 40} L${X + 10} 541 Z`, fill: "#fff7d1", opacity: 0.25 }, g);
    L.svg("rect", { x: X - 9, y: y + 14, width: 18, height: 26, rx: 2, fill: "url(#metal)", stroke: "#222" }, g);
    L.svg("path", { d: `M266 ${y} H408 L420 ${y + 8} H254 Z`, fill: "#2d3238", stroke: "#0b0d0f" }, g);
    L.svg("rect", { x: 254, y: y + 8, width: 166, height: 7, fill: "#1c1f23" }, g);
    L.svg("ellipse", { cx: X + 4, cy: y + 4, rx: 7, ry: 2.2, fill: lampe ? "#fff3b0" : "#0b0d0f" }, g);
    if (lame) {
      L.svg("path", { d: `M${X - 44} ${y + 2} L${X + 40} ${y + 2} L${X + 48} ${y + 6} L${X - 36} ${y + 6} Z`, fill: "#d8eef3", opacity: 0.85, stroke: "#8fb3bd", "stroke-width": 0.6 }, g);
      L.svg("path", { d: `M${X - 44} ${y + 2} L${X - 24} ${y + 2} L${X - 16} ${y + 6} L${X - 36} ${y + 6} Z`, fill: "#f4f1e4" }, g);
    }
    for (const x of [286, 372]) L.svg("path", { d: `M${x} ${y + 3} l22 -1 l2 2 l-22 1 Z`, fill: "url(#metal)", stroke: "#333", "stroke-width": 0.6 }, g);
  }

  function tete(g, obj, oculaire) {
    // Tube, oculaire, revolver ; objectifs inactifs inclinés derrière, objectif en service vertical (bague de couleur).
    L.svg("rect", { x: X - 11, y: 262, width: 22, height: 104, fill: "url(#metal-h)", stroke: "#222" }, g);
    L.svg("rect", { x: X - 9, y: 238, width: 18, height: 26, rx: 2, fill: "#1f2327", stroke: "#000" }, g);
    L.svg("rect", { x: X - 11, y: 232, width: 22, height: 8, rx: 3, fill: "#111" }, g);
    L.texte(g, X, 254, `×${oculaire}`, { "font-size": 6.5, "font-weight": 700, fill: "#e8e8e8" });
    OBJ.filter((o, k) => k !== obj).forEach((o, i) => L.svg("g", { transform: `rotate(${i ? 34 : -34} ${X} ${M.REV})` }, g).append(...objectif(o)));
    L.svg("ellipse", { cx: X, cy: M.REV - 4, rx: 28, ry: 9, fill: "url(#metal)", stroke: "#222" }, g);
    objectif(OBJ[obj]).forEach((n) => g.append(n));
  }

  function objectif(o) {
    // Corps d'un objectif (vertical, sous le revolver) : fût métallique, bague de couleur, gravure, lentille frontale.
    const t = L.svg("g", {}), b = M.REV, h = o.lg;
    L.svg("path", { d: `M${X - 8} ${b} H${X + 8} L${X + 6} ${b + h} H${X - 6} Z`, fill: "url(#metal-h)", stroke: "#222" }, t);
    L.svg("rect", { x: X - 8, y: b + h * 0.35, width: 16, height: 3, fill: o.coul }, t);
    L.texte(t, X, b + h * 0.35 + 9, String(o.g), { "font-size": 5.5, "font-weight": 700, fill: "#111" });
    L.svg("ellipse", { cx: X, cy: b + h, rx: 4, ry: 1.4, fill: "#9fd6ff" }, t);
    return [t];
  }

  L.microscope = function (g, { z, obj, oculaire, lampe, lame }) {
    // Le microscope complet, dans l'ordre de profondeur.
    g.replaceChildren();
    pied_potence(g, lampe); platine(g, z, lame, lampe); tete(g, obj, oculaire);
  };
})(window.Labo);

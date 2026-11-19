/*
Rôle : dessin du pendule simple (500 px/m) : potence ; pince de suspension accrochée au crochet, avec sa molette qui enroule
       le fil (la longueur se règle de 15 à 80 cm) ; règle graduée en cm fixée au bras par une noix, son zéro au point de
       suspension ; fil fin et bille (acier 44 g ou aluminium 15 g, diamètre 2,2 cm) ; coupelle où attend l'autre bille.
Reçoit : le groupe SVG ; la longueur l (m), l'angle θ (rad) et la bille accrochée.
Produit : Labo.pendule_simple_dessin = { fond(g), pendule(g, l, th, bille), coupelle(g, bille), centre(l, th), O, PX, COUPELLE, MOLETTE }.
Utilisé par : poste_pendule_simple.js (fichier nommé pour être chargé avant lui).
*/
(function (L) {
  const PX = 500, O = { x: 470, y: 84 }, R = 5.5, COUPELLE = { x: 640, y: 512 }, MOLETTE = { x: 470, y: 72 };
  const BILLES = { acier: ["url(#metal)", "#4b5258"], aluminium: ["#d5dadd", "#8a939a"] };
  const centre = (l, th) => ({ x: O.x + l * PX * Math.sin(th), y: O.y + l * PX * Math.cos(th) });

  function regle(g) {
    // Règle en bois clair (0 à 80 cm) serrée par une noix sur le bras, à gauche du fil ; zéro en face du point de suspension.
    L.svg("rect", { x: 434, y: 42, width: 24, height: 22, rx: 3, fill: "url(#acier)" }, g);
    L.svg("rect", { x: 436, y: O.y - 12, width: 20, height: 0.8 * PX + 22, rx: 1.5, fill: "#efe2bf", stroke: "#a88f5c", "stroke-width": 0.6 }, g);
    for (let c = 0; c <= 80; c++) {
      const y = O.y + c * 5, l = c % 10 ? (c % 5 ? 4 : 7) : 10;
      L.svg("line", { x1: 456, y1: y, x2: 456 - l, y2: y, stroke: "#2b2416", "stroke-width": c % 5 ? 0.35 : 0.7 }, g);
      if (c % 10 === 0) L.texte(g, 442, y + 2.2, String(c), { "font-size": 5.5, fill: "#2b2416" });
    }
    L.texte(g, 446, O.y + 0.8 * PX + 8, "cm", { "font-size": 5, fill: "#2b2416" });
  }

  function pince(g) {
    // Pince de suspension accrochée au crochet du bras : corps métallique, molette moletée qui enroule le fil.
    L.svg("rect", { x: O.x - 9, y: 64, width: 18, height: O.y - 64, rx: 2, fill: "url(#acier)", stroke: "#1b1e21", "stroke-width": 0.6 }, g);
    L.svg("circle", { cx: MOLETTE.x, cy: MOLETTE.y, r: 6.5, fill: "#2b2f33", stroke: "#000" }, g);
    for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; L.svg("line", { x1: MOLETTE.x + 4.5 * Math.cos(a), y1: MOLETTE.y + 4.5 * Math.sin(a), x2: MOLETTE.x + 6.5 * Math.cos(a), y2: MOLETTE.y + 6.5 * Math.sin(a), stroke: "#6b7278", "stroke-width": 0.6 }, g); }
    L.svg("circle", { cx: MOLETTE.x, cy: MOLETTE.y, r: 1.6, fill: "#9aa3aa" }, g);
  }

  function fond(g) {
    // Potence, pince de suspension, règle.
    L.potence(g, { x: 300, haut: 40, bras: 170, socle: 504 });
    pince(g); regle(g);
  }

  function bille_dessin(g, p, bille) {
    // Bille et son reflet.
    const [f, s] = BILLES[bille];
    L.svg("circle", { cx: p.x, cy: p.y, r: R, fill: f, stroke: s, "stroke-width": 0.7 }, g);
    L.svg("circle", { cx: p.x - 1.8, cy: p.y - 1.8, r: 1.6, fill: "#fff", opacity: 0.6 }, g);
  }

  function pendule(g, l, th, bille) {
    // Fil tendu du point de suspension au centre de la bille (il entre dans la bille), puis la bille.
    g.replaceChildren();
    const p = centre(l, th);
    L.svg("line", { x1: O.x, y1: O.y, x2: p.x, y2: p.y, stroke: "#7d735c", "stroke-width": 0.9 }, g);
    bille_dessin(g, p, bille);
  }

  function coupelle(g, bille) {
    // Coupelle en verre posée sur la paillasse, avec la bille qui n'est pas accrochée.
    g.replaceChildren();
    const C = COUPELLE;
    L.ombre_sol(g, C.x, C.y + 8, 30, 5, 0.35);
    L.svg("path", { d: `M${C.x - 26} ${C.y - 6} Q${C.x} ${C.y + 14} ${C.x + 26} ${C.y - 6}`, fill: "url(#verre)", stroke: "#9fb6be" }, g);
    L.svg("ellipse", { cx: C.x, cy: C.y - 6, rx: 26, ry: 5, fill: "#e6f1f4", opacity: 0.6, stroke: "#9fb6be" }, g);
    bille_dessin(g, { x: C.x, y: C.y - 3 }, bille === "acier" ? "aluminium" : "acier");
    L.texte(g, C.x, C.y + 24, bille === "acier" ? "bille d'aluminium" : "bille d'acier", { "font-size": 6.5, fill: "#f4f1e6" });
  }

  L.pendule_simple_dessin = { fond, pendule, coupelle, centre, O, PX, COUPELLE, MOLETTE };
})(window.Labo);

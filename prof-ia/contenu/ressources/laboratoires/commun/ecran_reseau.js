/*
Rôle : écran du banc à réseau vu de face, en haut de la paillasse : grand écran blanc de 70 cm dans la salle obscure
       (1 px par mm), règle graduée en millimètres (0 au milieu, sur l'axe du faisceau incident), deux curseurs rouges
       que l'on fait glisser au millimètre ; chacun affiche sa position.
Reçoit : le groupe SVG, l'état s du banc (s.c1, s.c2 : positions des curseurs, mm) et noter() (appelé au lâcher).
Produit : Labo.ecran_reseau(g, s, noter) -> image SVG à peindre avec Labo.peindre_reseau.
Utilisé par : banc_reseau.js.
*/
(function (L) {
  const X = 312, Y = 56, DEMI = 350;

  function regle(g) {
    // Graduations : traits tous les 5 mm, chiffres tous les 50 mm.
    for (let m = -DEMI; m <= DEMI; m += 5) L.svg("line", { x1: X + DEMI + m, y1: Y + 62, x2: X + DEMI + m, y2: Y + 62 + (m % 50 ? (m % 10 ? 3 : 5) : 9), stroke: "#333", "stroke-width": 0.6 }, g);
    for (let m = -DEMI + 50; m < DEMI; m += 50) L.texte(g, X + DEMI + m, Y + 80, String(m).replace("-", "−"), { "font-size": 7, fill: "#333" });
    L.texte(g, X + 2 * DEMI - 4, Y + 80, "mm", { "font-size": 7, fill: "#333" });
  }

  function curseur(g, s, cle, noter) {
    // Curseur rouge : trait sur l'écran, poignée triangulaire et position lue sous la règle.
    const b = L.svg("g", { class: `curseur-${cle}`, role: "button", "aria-label": `Curseur ${cle}` }, g);
    const placer = () => {
      b.replaceChildren(); const px = X + DEMI + s[cle];
      L.svg("line", { x1: px, y1: Y - 4, x2: px, y2: Y + 66, stroke: "#ff5252", "stroke-width": 1 }, b);
      L.svg("path", { d: `M${px} ${Y + 84} l-6 9 h12 Z`, fill: "#e53935" }, b);
      L.texte(b, px, Y + 103, `${cle} : ${String(s[cle]).replace("-", "−")} mm`, { "font-size": 7.5, "font-weight": 700, fill: "#b71c1c" });
      L.svg("rect", { x: px - 11, y: Y - 6, width: 22, height: 114, fill: "#000", opacity: 0 }, b);
    };
    L.glissable(b, { soulever: false, debut: () => ({ x: X + DEMI + s[cle], y: 0 }), deplacer: (p) => { s[cle] = Math.max(-DEMI, Math.min(DEMI, Math.round(p.x - X - DEMI))); placer(); }, lacher: noter });
    placer();
  }

  L.ecran_reseau = function (g, s, noter) {
    // Cadre de l'écran, image de la figure, règle, deux curseurs.
    L.svg("rect", { x: X - 14, y: Y - 26, width: 2 * DEMI + 28, height: 140, rx: 3, fill: "#f3f2ec", stroke: "#9a9a90", filter: "url(#ombre)" }, g);
    L.texte(g, X, Y - 14, "Écran vu de face (salle obscure)", { "font-size": 8, "font-weight": 700, fill: "#23315a", "text-anchor": "start" });
    const image = L.svg("image", { x: X, y: Y, width: 2 * DEMI, height: 60, preserveAspectRatio: "none" }, g);
    regle(g);
    curseur(g, s, "c1", noter); curseur(g, s, "c2", noter);
    return image;
  };
})(window.Labo);

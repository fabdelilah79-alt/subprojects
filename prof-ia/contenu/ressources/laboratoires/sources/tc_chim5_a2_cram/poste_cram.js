/*
Rôle : paillasse « modèles moléculaires et représentation de Cram » : boîte de modèles moléculaires et atelier
       d'assemblage (le modèle se tourne au doigt) ; au mur, un tableau blanc où l'on dessine la représentation de Cram du
       méthane : on touche chaque liaison pour choisir trait simple (dans le plan), triangle plein (vers l'avant) ou
       triangle hachuré (vers l'arrière).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_cram(groupe) -> { pense_bete } ; faits « modele » (modele_atelier.js) et « cram » = { plan, avant, arriere }.
Utilisé par : simulation.js.
*/
(function (L) {
  const C = { x: 912, y: 178 }, ANGLES = [90, 210, 330, 270], STYLES = ["plan", "avant", "arriere"];

  function liaison(g, a, style) {
    // Trait simple, triangle plein ou triangle hachuré, du carbone vers l'hydrogène.
    const t = (a * Math.PI) / 180, u = { x: Math.cos(t), y: -Math.sin(t) }, n = { x: -u.y, y: u.x }, p = (d, l = 0) => ({ x: C.x + u.x * d + n.x * l, y: C.y + u.y * d + n.y * l });
    if (style === "plan") { const a1 = p(14), b1 = p(58); return void L.svg("line", { x1: a1.x, y1: a1.y, x2: b1.x, y2: b1.y, stroke: "#1f2a44", "stroke-width": 2.6 }, g); }
    if (style === "avant") { const [a1, b1, c1] = [p(14), p(58, 7), p(58, -7)]; return void L.svg("path", { d: `M${a1.x} ${a1.y} L${b1.x} ${b1.y} L${c1.x} ${c1.y} Z`, fill: "#1f2a44" }, g); }
    for (let d = 16; d <= 58; d += 5) { const l = (7 * (d - 14)) / 44, q1 = p(d, l), q2 = p(d, -l); L.svg("line", { x1: q1.x, y1: q1.y, x2: q2.x, y2: q2.y, stroke: "#1f2a44", "stroke-width": 1.6 }, g); }
  }

  function tableau_cram(g) {
    // Tableau blanc, carbone au centre, quatre hydrogènes ; un toucher sur une liaison change son style.
    L.svg("rect", { x: 812, y: 36, width: 200, height: 270, rx: 3, fill: "url(#metal-h)", filter: "url(#ombre)" }, g);
    L.svg("rect", { x: 817, y: 41, width: 190, height: 260, fill: "#fbfcfd" }, g);
    L.texte(g, 912, 58, "Cram : le méthane", { class: "etiquette-carton", "font-size": 14 });
    const styles = ANGLES.map(() => "plan"), dessin = L.svg("g", { "pointer-events": "none" }, g);
    const maj = () => {
      dessin.replaceChildren();
      ANGLES.forEach((a, k) => { liaison(dessin, a, styles[k]); const t = (a * Math.PI) / 180; L.texte(dessin, C.x + 72 * Math.cos(t), C.y - 72 * Math.sin(t) + 5, "H", { "font-size": 15, "font-weight": 700, fill: "#222" }); });
      L.texte(dessin, C.x, C.y + 5, "C", { "font-size": 15, "font-weight": 700, fill: "#222" });
      L.missions.noter("cram", { plan: styles.filter((s) => s === "plan").length, avant: styles.filter((s) => s === "avant").length, arriere: styles.filter((s) => s === "arriere").length });
    };
    ANGLES.forEach((a, k) => {
      const t = (a * Math.PI) / 180, z = L.svg("circle", { cx: C.x + 36 * Math.cos(t), cy: C.y - 36 * Math.sin(t), r: 16, fill: "#000", opacity: 0, class: `cram-${k}`, role: "button", "aria-label": "Liaison" }, g);
      L.glissable(z, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { styles[k] = STYLES[(STYLES.indexOf(styles[k]) + 1) % 3]; maj(); } });
    });
    L.texte(g, 912, 270, "Touchez une liaison :", { "font-size": 8, fill: "#555" });
    L.texte(g, 912, 283, "plan → avant → arrière", { "font-size": 8, fill: "#555" });
    maj();
  }

  L.poste_cram = function (g) {
    // Boîte de modèles et atelier, tableau de Cram ; message court au-dessus de l'atelier.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 420, y: 188, width: 400, height: 22, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 620, 199, t, { "font-size": 7.6, "font-weight": 700, fill: "#6b3d00" }); } };
    tableau_cram(g);
    L.boite_modeles(ctx, { x: 206, sol: 576, cx: 620, cy: 380, fait: "modele", dire });
    return { pense_bete };
  };
})(window.Labo);

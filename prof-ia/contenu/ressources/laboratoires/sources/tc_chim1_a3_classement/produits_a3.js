/*
Rôle : six produits posés sur la paillasse, à leur taille réelle, chacun avec son étiquette à lire : gousse de vanille, sachet de sucre vanilliné,
       citron, tube de comprimés de vitamine C, bobine de fil de nylon, boîte d'aspirine. Un toucher ouvre l'étiquette.
Reçoit : le groupe SVG de la paillasse et le nom du fait à noter.
Produit : Labo.produits_etiquettes(g, fait) ; fait « <fait> » = [noms des produits dont l'étiquette a été lue].
Utilisé par : postes_a3.js.
*/
(function (L) {
  const PRODUITS = [
    { nom: "vanille", x: 300, k: 3, titre: "Gousse de vanille", texte: "Fruit séché du vanillier (une orchidée). Contient de la vanilline, C₈H₈O₃, et d'autres espèces odorantes." },
    { nom: "sucre", x: 450, k: 2.6, titre: "Sucre vanilliné", texte: "Ingrédients : sucre, vanilline. Vanilline obtenue par synthèse : même formule que celle de la gousse, C₈H₈O₃." },
    { nom: "citron", x: 560, k: 2.2, titre: "Citron", texte: "Fruit du citronnier. Contient de l'acide ascorbique (vitamine C), C₆H₈O₆." },
    { nom: "vitamine", x: 650, k: 2.6, titre: "Vitamine C 500 mg", texte: "Comprimés d'acide ascorbique, C₆H₈O₆, fabriqué par l'industrie chimique (synthèse)." },
    { nom: "nylon", x: 735, k: 2.2, titre: "Fil de pêche en nylon", texte: "Nylon (un polyamide) obtenu par synthèse. Le nylon n'existe pas dans la nature." },
    { nom: "aspirine", x: 825, k: 2.4, titre: "Aspirine 500 mg", texte: "Acide acétylsalicylique obtenu par synthèse. Il n'existe pas dans la nature (l'écorce de saule contient une espèce voisine)." },
  ];

  const DESSINS = {
    vanille: (g, x, y) => { L.svg("path", { d: `M${x - 30} ${y + 4} Q${x} ${y - 6} ${x + 30} ${y - 2} Q${x} ${y + 2} ${x - 30} ${y + 4} Z`, fill: "#3a2416", stroke: "#1e120a" }, g); L.svg("path", { d: `M${x - 26} ${y + 2} Q${x} ${y - 3} ${x + 26} ${y - 1}`, stroke: "#5c3a22", fill: "none" }, g); },
    sucre: (g, x, y) => { L.svg("path", { d: `M${x - 18} ${y + 6} L${x - 16} ${y - 20} H${x + 16} L${x + 18} ${y + 6} Z`, fill: "#f4efe0", stroke: "#b9b19a" }, g); L.svg("rect", { x: x - 12, y: y - 12, width: 24, height: 12, fill: "#e8d6a8" }, g); L.texte(g, x, y - 6, "sucre vanilliné", { "font-size": 3.6, fill: "#4a3a12" }); },
    citron: (g, x, y) => { L.svg("ellipse", { cx: x, cy: y - 10, rx: 20, ry: 14, fill: "#f2d534", stroke: "#c9a80f" }, g); L.svg("ellipse", { cx: x + 20, cy: y - 10, rx: 3, ry: 2.5, fill: "#d9b81a" }, g); L.svg("ellipse", { cx: x - 6, cy: y - 16, rx: 6, ry: 3, fill: "#fff59a", opacity: 0.6 }, g); },
    vitamine: (g, x, y) => { L.svg("rect", { x: x - 11, y: y - 40, width: 22, height: 46, rx: 3, fill: "#f6a51c", stroke: "#b56d0c" }, g); L.svg("rect", { x: x - 12, y: y - 46, width: 24, height: 8, rx: 2, fill: "#ffffff", stroke: "#bbb" }, g); L.texte(g, x, y - 20, "Vit. C", { "font-size": 5.5, "font-weight": 700, fill: "#fff" }); },
    nylon: (g, x, y) => {
      // Bobine debout : deux flasques bleues, fil transparent enroulé entre elles.
      L.svg("rect", { x: x - 11, y: y - 28, width: 22, height: 30, fill: "#cfe6f0", opacity: 0.9 }, g);
      for (let k = 0; k < 7; k++) L.svg("path", { d: `M${x - 11} ${y - 25 + k * 4} q11 3 22 0`, stroke: "#9fc3d4", fill: "none", "stroke-width": 0.7 }, g);
      L.svg("ellipse", { cx: x, cy: y + 2, rx: 17, ry: 5, fill: "#2f6fb8", stroke: "#1f4f88" }, g);
      L.svg("ellipse", { cx: x, cy: y - 28, rx: 17, ry: 5, fill: "#3b82cf", stroke: "#1f4f88" }, g);
      L.svg("ellipse", { cx: x, cy: y - 28, rx: 4, ry: 1.4, fill: "#173b66" }, g);
    },
    aspirine: (g, x, y) => { L.svg("path", { d: `M${x - 22} ${y + 4} V${y - 14} L${x - 14} ${y - 22} H${x + 26} V${y - 4} L${x + 18} ${y + 4} Z`, fill: "#ffffff", stroke: "#b8b8b8" }, g); L.svg("path", { d: `M${x - 22} ${y - 14} H${x + 18} L${x + 26} ${y - 22} M${x + 18} ${y - 14} V${y + 4}`, stroke: "#b8b8b8", fill: "none" }, g); L.svg("rect", { x: x - 20, y: y - 10, width: 36, height: 6, fill: "#2a8f3a" }, g); L.texte(g, x - 2, y - 1, "Aspirine", { "font-size": 4.5, "font-weight": 700, fill: "#1f6e2b" }); },
  };

  function etiquette(calque, p) {
    // Grande étiquette lue, au-dessus du produit.
    calque.replaceChildren();
    const x = Math.max(160, Math.min(860, p.x)), y = 250, lignes = [""];
    for (const m of p.texte.split(" ")) { if ((lignes[lignes.length - 1] + " " + m).length > 44) lignes.push(m); else lignes[lignes.length - 1] = (lignes[lignes.length - 1] + " " + m).trim(); }
    L.svg("line", { x1: p.x, y1: 420, x2: x, y2: y + 24 + lignes.length * 11, stroke: "#55606a", "stroke-dasharray": "3 2" }, calque);
    L.svg("rect", { x: x - 130, y, width: 260, height: 28 + lignes.length * 11, rx: 3, fill: "#fffdf4", stroke: "#b9b19a", filter: "url(#ombre)" }, calque);
    L.texte(calque, x, y + 12, `Étiquette : ${p.titre}`, { "font-size": 8.5, "font-weight": 700, fill: "#23315a" });
    lignes.forEach((t, i) => L.texte(calque, x, y + 25 + i * 11, t, { "font-size": 8, fill: "#222" }));
  }

  L.produits_etiquettes = function (g, fait) {
    // Dessine les produits ; toucher un produit ouvre son étiquette et la note comme lue.
    const calque = L.svg("g", { "pointer-events": "none" }, g), lus = new Set(), y = 515;
    for (const p of PRODUITS) {
      // Chaque dessin (fait à petite échelle) est agrandi autour de sa base pour avoir la taille réelle du produit.
      const e = L.svg("g", { class: `produit produit-${p.nom}`, role: "button", "aria-label": p.titre, filter: "url(#ombre)", transform: `translate(${p.x} ${y}) scale(${p.k}) translate(${-p.x} ${-y})` }, g);
      // Zone que l'on touche : 84 × 135 px à l'écran, quel que soit l'agrandissement.
      L.svg("rect", { x: p.x - 42 / p.k, y: y - 120 / p.k, width: 84 / p.k, height: 135 / p.k, fill: "#000", opacity: 0 }, e);
      DESSINS[p.nom](e, p.x, y);
      L.glissable(e, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => { etiquette(calque, p); lus.add(p.nom); L.missions.noter(fait, [...lus]); } });
    }
  };
})(window.Labo);

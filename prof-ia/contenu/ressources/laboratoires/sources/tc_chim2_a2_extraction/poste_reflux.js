/*
Rôle : paillasse « reconnaître la verrerie » : un montage de chauffage à reflux aux vraies dimensions (chauffe-ballon,
       ballon de 250 mL, réfrigérant à boules vertical de 18 cm tenu par une pince, entrée de l'eau en bas et sortie en
       haut) dont les éléments sont numérotés, et un tableau pour associer chaque nom à son numéro.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_reflux(groupe) -> { pense_bete } ; Labo.ETIQUETTES_REFLUX ; fait « tri_reflux ».
Utilisé par : simulation.js.
*/
(function (L) {
  const E = 1.6, X = 330, VERRE = { fill: "rgba(205,228,236,0.45)", stroke: "rgba(120,150,160,0.9)", "stroke-width": 0.8 };
  const BAS = 290, HAUT = 40, ENTREE = { x: X + 54, y: 275 }, SORTIE = { x: X + 54, y: 55 }, ROBINET = { x: 548, y: 388 };
  L.LIQUIDES.melange_reflux = { nom: "mélange", d: 1.0, rgb: [233, 215, 176], alpha: 0.7, classe: "aqueuse" };
  L.ETIQUETTES_REFLUX = [
    { id: "refrigerant", texte: ["réfrigérant", "à boules"], colonne: 0 }, { id: "ballon", texte: ["ballon", "(fond rond)"], colonne: 1 },
    { id: "chauffe", texte: ["chauffe-ballon", ""], colonne: 2 }, { id: "entree", texte: ["entrée de", "l'eau froide"], colonne: 3 },
    { id: "sortie", texte: ["sortie de", "l'eau"], colonne: 4 },
  ];

  function refrigerant(g) {
    // Réfrigérant à boules : col rodé, manchon plein d'eau, cinq boules, tube supérieur ouvert, deux embouts à olive.
    L.svg("rect", { x: X - 14, y: BAS, width: 28, height: 22, ...VERRE }, g);
    L.svg("rect", { x: X - 8, y: 19, width: 16, height: HAUT - 17, ...VERRE }, g);
    L.svg("rect", { x: X - 32, y: HAUT, width: 64, height: BAS - HAUT, rx: 14, ...VERRE }, g);
    L.svg("rect", { x: X - 28, y: HAUT + 6, width: 56, height: BAS - HAUT - 12, rx: 11, fill: "#5fb3dc", opacity: 0.3 }, g);
    for (let k = 0; k < 5; k++) L.svg("ellipse", { cx: X, cy: HAUT + 28 + k * 48, rx: 15, ry: 21, ...VERRE }, g);
    for (let k = 0; k < 4; k++) L.svg("rect", { x: X - 6, y: HAUT + 48 + k * 48, width: 12, height: 10, ...VERRE }, g);
    L.svg("rect", { x: X - 26, y: HAUT + 8, width: 4, height: BAS - HAUT - 16, rx: 2, fill: "#fff", opacity: 0.45 }, g);
    for (const p of [ENTREE, SORTIE]) {
      L.svg("rect", { x: X + 31, y: p.y - 5, width: p.x - X - 31, height: 10, ...VERRE }, g);
      L.svg("rect", { x: p.x - 9, y: p.y - 6.5, width: 5, height: 13, rx: 2, ...VERRE }, g);
    }
  }

  function montage(ctx) {
    // Support et pinces, chauffe-ballon, ballon, réfrigérant, robinet et évier, tuyaux enfilés sur les olives.
    const g = ctx.fond;
    L.svg("rect", { x: 168, y: 542, width: 124, height: 9, rx: 2, fill: "#3a3f44" }, g);
    L.tige(g, "M230 544 V24", 6);
    for (const [y, x2] of [[330, X - 18], [170, X - 36]]) { L.svg("rect", { x: 222, y: y - 8, width: 16, height: 16, rx: 2, fill: "#5d646a" }, g); L.tige(g, `M230 ${y} H${x2}`, 4); L.svg("rect", { x: x2 - 3, y: y - 12, width: 14, height: 24, rx: 4, fill: "#b9894f", stroke: "#7a5730" }, g); }
    L.svg("rect", { x: ROBINET.x - 60, y: 424, width: 120, height: 44, rx: 6, fill: "#c9d0d4", stroke: "#8f989e" }, g);
    L.svg("rect", { x: ROBINET.x - 52, y: 430, width: 104, height: 32, rx: 5, fill: "#7f8a90" }, g);
    L.svg("rect", { x: ROBINET.x - 8, y: ROBINET.y - 18, width: 16, height: 12, rx: 2, fill: "url(#metal)" }, g);
    L.svg("path", { d: `M${ROBINET.x - 4} ${ROBINET.y - 6} V${ROBINET.y + 10} h8 V${ROBINET.y - 6}`, fill: "url(#metal)", stroke: "#7d868c" }, g);
    const tuyau = { stroke: "#c9a96b", "stroke-width": 9, fill: "none", "stroke-linecap": "round" };
    L.svg("path", { d: `M${ROBINET.x} ${ROBINET.y + 8} C${ROBINET.x - 70} ${ROBINET.y + 8} ${ENTREE.x + 70} ${ENTREE.y} ${ENTREE.x + 4} ${ENTREE.y} H${ENTREE.x - 8}`, ...tuyau }, g);
    L.svg("path", { d: `M${SORTIE.x - 8} ${SORTIE.y} H${SORTIE.x + 16} C${SORTIE.x + 80} ${SORTIE.y} 470 200 470 300 S${ROBINET.x - 30} 420 ${ROBINET.x - 22} 440`, ...tuyau }, g);
    L.hydro.chauffe_ballon(g, ctx.devant, { x: X, haut: 432, bas: 576 });
    L.recipient(ctx, { id: "ballon", profil: "ballon_250", x: X, y: 496, contenu: { melange_reflux: 110 } }).g.setAttribute("pointer-events", "none");
    refrigerant(L.svg("g", { "pointer-events": "none" }, ctx.objets));
  }

  function numeros(g) {
    // Pastilles numérotées reliées à chaque élément.
    for (const [n, x, y, cx, cy] of [[1, 440, 150, X + 32, 150], [2, 196, 404, X - 34, 412], [3, 196, 476, 228, 482], [4, 420, 322, ENTREE.x, ENTREE.y + 4], [5, 430, 26, SORTIE.x, SORTIE.y - 4]]) {
      L.svg("line", { x1: x, y1: y, x2: cx, y2: cy, stroke: "#23315a", "stroke-width": 1 }, g);
      L.svg("circle", { cx: x, cy: y, r: 10, fill: "#fbe98a", stroke: "#23315a" }, g);
      L.texte(g, x, y + 0.5, String(n), { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    }
  }

  L.poste_reflux = function (g) {
    // Montage numéroté et tableau des noms.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 160, 140), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: 576, e: E });
    montage(ctx); numeros(ctx.haut);
    L.tableau_tri(g, { x: 490, y: 48, largeur: 510, hauteur: 300, titre: "Montage de chauffage à reflux", colonnes: ["1", "2", "3", "4", "5"], etiquettes: [3, 0, 4, 1, 2].map((k) => ({ ...L.ETIQUETTES_REFLUX[k] })), fait: "tri_reflux" });
    return { pense_bete };
  };
})(window.Labo);

/*
Rôle : matériel de la chute verticale avec frottement (échelle 330 px/m) : deux colonnes de verre de 8 cm de diamètre et 1,10 m de
       haut sur leur socle (eau, glycérine), potence centrale (socle en fonte, tige, noix), règle de 1 m vissée sur la tige
       (0 à la surface des liquides), deux bras porte-balle avec leur fourche à déclencheur, coupelle des trois balles creuses
       lestées (4,0 cm ; 40, 50 et 60 g), boîtier du déclencheur, caméra sur trépied.
Reçoit : le groupe SVG et les positions ; pour les balles, la position de la balle (px) et sa masse.
Produit : Labo.frottement_dessin = { fond(g), balle(g, x, y, nom), camera(g) -> voyant, ecran_y(z), COLONNES, SURFACE, PX, REGLE }.
Utilisé par : poste_frottement.js (fichier nommé pour être chargé avant lui).
*/
(function (L) {
  const PX = 330, FOND = 492, SURFACE = FOND - PX, TIGE = 360, REGLE = { x: 349, l: 22 };
  const COLONNES = { eau: { x: 300, teinte: "#cfe8f5", nom: "EAU" }, glycerine: { x: 420, teinte: "#efe3b4", nom: "GLYCÉRINE" } };
  const ecran_y = (z) => SURFACE + (0.02 + z) * PX;

  function colonne(g, c) {
    // Socle rond, tube de verre (bords plus clairs), liquide teinté, ménisque, bague du haut, étiquette sur le socle.
    L.ombre_sol(g, c.x, 507, 30, 5, 0.4);
    L.svg("ellipse", { cx: c.x, cy: 500, rx: 26, ry: 7, fill: "#2f3438", stroke: "#15181a" }, g);
    L.svg("rect", { x: c.x - 26, y: 492, width: 52, height: 8, fill: "#3a3f44" }, g);
    L.svg("rect", { x: c.x - 12, y: SURFACE, width: 24, height: FOND - SURFACE, fill: c.teinte, opacity: 0.65 }, g);
    L.svg("ellipse", { cx: c.x, cy: SURFACE, rx: 12, ry: 2.5, fill: "#ffffff", opacity: 0.5 }, g);
    L.svg("rect", { x: c.x - 14, y: 135, width: 28, height: 359, rx: 3, fill: "url(#verre)", stroke: "#9fb6be", "stroke-width": 1, opacity: 0.85 }, g);
    L.svg("rect", { x: c.x - 11, y: 140, width: 3, height: 350, fill: "#fff", opacity: 0.35 }, g);
    L.svg("rect", { x: c.x - 16, y: 132, width: 32, height: 6, rx: 2, fill: "#b9c3c8", stroke: "#7d878d" }, g);
    L.texte(g, c.x, 499, c.nom, { "font-size": 5.5, "font-weight": 700, fill: "#e6ebef" });
  }

  function potence(g) {
    // Socle en fonte, tige, règle de 1 m vissée sur la tige (graduée en cm, 0 à la surface), bras et fourches porte-balle.
    L.ombre_sol(g, TIGE, 528, 56, 7, 0.4);
    L.svg("path", { d: `M${TIGE - 45} 512 h90 l8 14 h-106 Z`, fill: "#3b4046", stroke: "#1e2226" }, g);
    L.tige(g, `M${TIGE} 512 V106`, 7);
    L.svg("rect", { x: REGLE.x, y: SURFACE - 6, width: REGLE.l, height: PX + 12, fill: "#f3e7c9", stroke: "#a88b55" }, g);
    for (let cm = 0; cm <= 100; cm++) { const y = SURFACE + cm * PX / 100, l = cm % 10 === 0 ? 10 : cm % 5 === 0 ? 7 : 3.5; L.svg("line", { x1: REGLE.x, y1: y, x2: REGLE.x + l, y2: y, stroke: "#2b2416", "stroke-width": cm % 10 ? 0.35 : 0.7 }, g); if (cm % 10 === 0) L.texte(g, REGLE.x + 16, y + 2.5, String(cm), { "font-size": 6, fill: "#2b2416" }); }
    for (const y of [SURFACE + 20, FOND - 20]) L.svg("circle", { cx: REGLE.x + REGLE.l / 2, cy: y, r: 2, fill: "url(#acier)", stroke: "#555", "stroke-width": 0.4 }, g);
    for (const c of Object.values(COLONNES)) {
      L.svg("rect", { x: TIGE - 9, y: 112, width: 18, height: 14, rx: 2, fill: "#555c63", stroke: "#222" }, g);
      L.tige(g, `M${TIGE} 119 H${c.x}`, 4); L.tige(g, `M${c.x} 119 V${ecran_y(0) - 9}`, 2.5);
      L.svg("path", { d: `M${c.x - 9} ${ecran_y(0) - 9} h18 M${c.x - 9} ${ecran_y(0) - 9} v6 M${c.x + 9} ${ecran_y(0) - 9} v6`, fill: "none", stroke: "#8a9196", "stroke-width": 1.6 }, g);
    }
  }

  function fond(g) {
    // Colonnes, potence et règle, coupelle des balles, boîtier du déclencheur et son câble.
    for (const c of Object.values(COLONNES)) colonne(g, c);
    potence(g);
    L.svg("ellipse", { cx: 300, cy: 552, rx: 62, ry: 12, fill: "#cfd3d6", stroke: "#8a9096" }, g);
    L.svg("rect", { x: 100, y: 418, width: 130, height: 82, rx: 4, fill: "url(#facade)", stroke: "#4a5254" }, g);
    L.texte(g, 165, 432, "DÉCLENCHEUR", { "font-size": 7, "font-weight": 700, fill: "#23315a" });
    L.svg("path", { d: `M230 440 C270 440 ${TIGE - 30} 470 ${TIGE - 4} 430 V130`, fill: "none", stroke: "#222", "stroke-width": 2 }, g);
  }

  function balle(g, x, y, nom) {
    // Balle creuse orange lestée de grenaille (4,0 cm), reflet, masse écrite dessus.
    L.svg("circle", { cx: x, cy: y, r: 6.6, fill: "#f08a24", stroke: "#8a4a10", "stroke-width": 0.6 }, g);
    L.svg("circle", { cx: x - 2, cy: y - 2.2, r: 1.8, fill: "#fff", opacity: 0.55 }, g);
    if (nom) L.texte(g, x, y + 16, nom, { "font-size": 6.5, fill: "#f4f1e6" });
  }

  function camera(g) {
    // Caméra sur trépied tournée vers les colonnes, voyant d'enregistrement, câble USB jusqu'au portable.
    L.ombre_sol(g, 492, 528, 36, 6, 0.35);
    for (const dx of [-22, 0, 22]) L.tige(g, `M492 400 L${492 + dx} 524`, 3);
    L.svg("rect", { x: 472, y: 368, width: 40, height: 30, rx: 4, fill: "#24282c", stroke: "#000" }, g);
    L.svg("circle", { cx: 472, cy: 383, r: 9, fill: "#111", stroke: "#666" }, g);
    L.svg("path", { d: "M512 386 C530 386 528 455 548 470", fill: "none", stroke: "#222", "stroke-width": 2.5 }, g);
    return L.svg("circle", { cx: 506, cy: 373, r: 2.5, fill: "#5a1d1d" }, g);
  }

  L.frottement_dessin = { fond, balle, camera, ecran_y, COLONNES, SURFACE, PX, REGLE };
})(window.Labo);

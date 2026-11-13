/*
Rôle : dessin du banc à coussin d'air horizontal vu de côté (échelle 0,4 px/mm) avec son oscillateur : rail gradué de 1,20 m
       sur ses pieds, soufflerie (cordon jusqu'à la prise murale de gauche), butée fixe, ressorts (longueur à vide 30 cm),
       mobile de 200 g (drapeau réflecteur, surcharges de 100 g, palette ou aimant de freinage), capteur de position à
       ultrasons sur son montant à droite ; facultatif : excitateur (moteur à excentrique, bielle, tige guidée).
Reçoit : le groupe SVG ; la position du mobile (px de sa face gauche), le nombre de surcharges, l'amortisseur, les ressorts.
Produit : Labo.banc_ressort_dessin = { fond(g, excitateur, avec_capteur), ressort(g, x1, x2, couleur), mobile(g, x, n, amortisseur),
          excitateur(g, angle, e_px, a_px), X0, MM, HAUT, TABLE, X_EQ (face gauche du mobile à l'équilibre), LONG, X_CAPTEUR, PRISE }.
Utilisé par : banc_ressort.js et les simulations des oscillateurs mécaniques (2e année du bac) ; pièces : banc_ressort_pieces.js.
*/
(function (L) {
  const X0 = 210, MM = 0.4, HAUT = 482, TABLE = 556, L0 = 300 * MM, LONG = 120 * MM, X_EQ = X0 + 14 + L0, X_CAPTEUR = 676;
  const PRISE = { x: 96, y: 330 };

  function rail(g) {
    // Pieds, rail d'aluminium percé de trous, graduation en centimètres sur sa face (0 à 120 cm).
    for (const x of [X0 + 24, X0 + 456]) L.svg("rect", { x: x - 4, y: HAUT + 12, width: 8, height: TABLE - HAUT - 12, fill: "url(#metal)" }, g);
    for (const x of [X0 + 24, X0 + 456]) L.svg("rect", { x: x - 12, y: TABLE - 4, width: 24, height: 5, rx: 2, fill: "#3b4046" }, g);
    L.ombre_sol(g, X0 + 240, TABLE + 2, 250, 6, 0.35);
    L.svg("rect", { x: X0, y: HAUT, width: 1200 * MM, height: 12, fill: "url(#metal-h)", stroke: "#5b646a" }, g);
    for (let cm = 0; cm <= 120; cm++) { const x = X0 + cm * 10 * MM; L.svg("line", { x1: x, y1: HAUT + 12, x2: x, y2: HAUT + 12 - (cm % 10 ? (cm % 5 ? 2 : 3.5) : 5), stroke: "#2a2e33", "stroke-width": 0.4 }, g); if (cm % 10 === 0 && cm) L.texte(g, x, HAUT + 6, String(cm), { "font-size": 4.5, fill: "#2a2e33" }); }
  }

  function soufflerie(g) {
    // Soufflerie sous le rail, tuyau jusqu'à l'embout du rail, cordon secteur jusqu'à la prise murale de gauche.
    L.svg("rect", { x: PRISE.x - 22, y: PRISE.y - 22, width: 44, height: 44, rx: 4, fill: "#f7f7f4", stroke: "#b8bbb4" }, g);
    L.cordon_secteur(g, { x: 262, y: 530 }, PRISE);
    L.svg("path", { d: `M${X0 + 2} ${HAUT + 8} C${X0 - 26} ${HAUT + 30} 296 ${TABLE - 80} 296 ${TABLE - 40}`, fill: "none", stroke: "#2b2f33", "stroke-width": 7 }, g);
    L.pieces_banc.soufflerie(g, 262, TABLE - 35);
  }

  function capteur(g) {
    // Montant à l'extrémité droite, tête du capteur à ultrasons tournée vers le drapeau, câble vers l'interface.
    L.svg("path", { d: `M${X_CAPTEUR} ${TABLE - 6} C${X_CAPTEUR} ${TABLE + 12} 702 ${TABLE + 4} 714 ${TABLE - 20}`, fill: "none", stroke: "#222", "stroke-width": 2 }, g);
    L.svg("rect", { x: X_CAPTEUR - 3, y: HAUT - 48, width: 6, height: TABLE - HAUT + 42, fill: "url(#metal)" }, g);
    L.svg("rect", { x: X_CAPTEUR - 10, y: TABLE - 6, width: 20, height: 6, rx: 2, fill: "#3b4046" }, g);
    L.svg("rect", { x: X_CAPTEUR - 20, y: HAUT - 54, width: 18, height: 16, rx: 2, fill: "#20262b", stroke: "#000" }, g);
    for (const dy of [-50, -42]) L.svg("circle", { cx: X_CAPTEUR - 20, cy: HAUT + dy, r: 3, fill: "#8d949a", stroke: "#111" }, g);
  }

  function fond(g, excitateur = false, avec_capteur = true) {
    // Prise et soufflerie, rail, butée fixe de gauche, capteur (s'il sert) ; support de l'excitateur s'il y en a un.
    soufflerie(g); rail(g); if (avec_capteur) capteur(g);
    L.svg("rect", { x: X0, y: HAUT - 34, width: 14, height: 34, fill: "#3a3f44", stroke: "#1e2226" }, g);
    if (excitateur) L.svg("rect", { x: 598, y: HAUT - 4, width: 58, height: 4, fill: "#3a3f44" }, g);
  }

  function ressort(g, x1, x2, couleur = "#2f6db3") {
    // Ressort à spires non jointives entre x1 et x2 (axe à 14 px au-dessus du rail), avec ses crochets.
    const n = 16, y = HAUT - 14, l = x2 - x1 - 8;
    L.svg("path", { d: `M${x1} ${y} h4 ` + Array.from({ length: n }, () => `c${l / n / 3} -7 ${(2 * l) / n / 3} -7 ${l / n} 0 c${-l / n / 3} 7 ${l / n / 3} 7 0 0`).join(" ") + " h4", fill: "none", stroke: couleur, "stroke-width": 1.3 }, g);
  }

  function mobile(g, x, n, amortisseur) {
    // Mobile de 12 cm (pièces détaillées dans banc_ressort_pieces.js).
    return L.pieces_banc.mobile(g, x, HAUT, LONG, n, amortisseur);
  }

  function excitateur(g, angle, e, a) {
    // Moteur sur son support, disque à excentrique (rayon a) qui tourne, bielle, tige guidée ; e = déplacement de la tige (px).
    g.replaceChildren();
    const c = { x: 632, y: HAUT - 22 }, p = { x: c.x + a * Math.cos(angle), y: c.y + a * Math.sin(angle) }, bout = X_EQ + LONG + L0 + e;
    L.svg("rect", { x: 610, y: HAUT - 46, width: 44, height: 42, rx: 4, fill: "#3b4a57", stroke: "#111" }, g);
    L.svg("rect", { x: 560, y: HAUT - 19, width: 30, height: 10, rx: 2, fill: "#555c63" }, g);
    L.tige(g, `M${bout} ${HAUT - 14} H${598 + e}`, 3);
    L.svg("line", { x1: 598 + e, y1: HAUT - 14, x2: p.x, y2: p.y, stroke: "#aab0b5", "stroke-width": 2.5 }, g);
    L.svg("circle", { cx: c.x, cy: c.y, r: 13, fill: "url(#metal)", stroke: "#333" }, g);
    L.svg("circle", { cx: p.x, cy: p.y, r: 2.5, fill: "#d32f2f" }, g);
    return bout;
  }

  L.banc_ressort_dessin = { fond, ressort, mobile, excitateur, X0, MM, HAUT, TABLE, X_EQ, LONG, X_CAPTEUR, PRISE, L0 };
})(window.Labo);

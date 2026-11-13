/*
Rôle : objets du suivi temporel d'une transformation : horloge murale à grands chiffres (minutes et secondes écoulées depuis
       le début de la transformation) et feuille de relevés sur un porte-bloc accroché au mur (date et mesure de chaque
       relevé, écrites à la main dans deux colonnes, quatorze lignes au plus).
Reçoit : le groupe SVG ; horloge { x, y (coin haut gauche, 170 × 70), legende } ; feuille { x, y, titre, colonnes [deux
         en-têtes] }.
Produit : Labo.horloge_murale(g, reglage) -> afficher(t en s, ou null : « --:-- ») ;
          Labo.feuille_releves(g, reglage) -> { ajouter([texte1, texte2]) (faux si la feuille est pleine), vider(), n() }.
Utilisé par : les simulations de suivi temporel (2e année du bac).
*/
(function (L) {
  const mm_ss = (t) => `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  const LIGNES = 14, PAS = 13;

  L.horloge_murale = function (g, { x, y, legende = "HORLOGE — depuis le mélange" }) {
    // Boîtier noir, écran vert à chiffres lumineux, légende sous l'écran.
    L.svg("rect", { x, y, width: 170, height: 70, rx: 6, fill: "#2b2f33", stroke: "#111", filter: "url(#ombre)" }, g);
    L.svg("rect", { x: x + 12, y: y + 10, width: 146, height: 36, rx: 3, fill: "#10251a" }, g);
    L.texte(g, x + 85, y + 60, legende, { "font-size": 6.5, fill: "#dfe6ec", "font-weight": 700 });
    const ecran = L.svg("g", {}, g);
    return (t) => { ecran.replaceChildren(); L.texte(ecran, x + 85, y + 37, t === null ? "--:--" : mm_ss(t), { "font-size": 24, "font-weight": 700, fill: "#7dff9a", "font-family": "monospace" }); };
  };

  function porte_bloc(g, x, y, l, h, titre, colonnes) {
    // Planchette brune, pince métallique, feuille quadrillée, titre et en-têtes des deux colonnes.
    L.svg("rect", { x: x - 8, y: y - 10, width: l + 16, height: h + 18, rx: 5, fill: "#8a5a35", stroke: "#5b3a20", filter: "url(#ombre)" }, g);
    L.svg("rect", { x, y, width: l, height: h, fill: "#fdfdf8", stroke: "#c9c4b0" }, g);
    L.svg("rect", { x: x + l / 2 - 30, y: y - 16, width: 60, height: 14, rx: 3, fill: "url(#metal)", stroke: "#555" }, g);
    L.svg("circle", { cx: x + l / 2, cy: y - 9, r: 3, fill: "#666" }, g);
    L.texte(g, x + l / 2, y + 16, titre, { "font-size": 9, "font-weight": 700, fill: "#23315a" });
    colonnes.forEach((c, k) => L.texte(g, x + l * (0.28 + 0.44 * k), y + 31, c, { "font-size": 8, "font-weight": 700, fill: "#23315a" }));
    L.svg("line", { x1: x + l / 2, y1: y + 22, x2: x + l / 2, y2: y + h - 6, stroke: "#c9c4b0" }, g);
    for (let k = 0; k <= LIGNES; k++) L.svg("line", { x1: x + 8, y1: y + 36 + k * PAS, x2: x + l - 8, y2: y + 36 + k * PAS, stroke: "#e2ddcc", "stroke-width": 0.8 }, g);
  }

  L.feuille_releves = function (g, { x, y, titre, colonnes }) {
    // Feuille vide ; chaque relevé s'écrit à la main sur la ligne suivante.
    const l = 170, h = 44 + LIGNES * PAS, lignes = [];
    porte_bloc(g, x, y, l, h, titre, colonnes);
    const ecrit = L.svg("g", { "pointer-events": "none" }, g);
    return {
      ajouter(valeurs) {
        // Écrit les deux valeurs sur la ligne suivante (police manuscrite, encre bleue).
        if (lignes.length >= LIGNES) return false;
        const yl = y + 46 + lignes.length * PAS;
        valeurs.forEach((v, k) => L.texte(ecrit, x + l * (0.28 + 0.44 * k), yl, v, { "font-size": 12, fill: "#1f3a93", "font-family": "Caveat, cursive" }));
        lignes.push(valeurs);
        return true;
      },
      vider() { ecrit.replaceChildren(); lignes.length = 0; },
      n: () => lignes.length,
    };
  };
})(window.Labo);

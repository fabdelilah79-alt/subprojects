/*
Rôle : paillasse « cycle du carbone et abondance des éléments » : trois documents illustrés au mur (le cycle naturel du
       carbone, l'abondance des éléments, le Soleil qui fabrique de l'hélium), et un tableau magnétique où l'on range les
       phénomènes qui retirent du dioxyde de carbone de l'air ou qui en rejettent.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_cycle(groupe) -> { pense_bete } ; faits « docs_carbone » = [numéros lus], « tri_carbone » = { étiquette : colonne } ;
          Labo.TRI_CARBONE (étiquettes et colonne attendue).
Utilisé par : simulation.js.
*/
(function (L) {
  const fleche = (g, x, y, k, [x1, y1, cx, cy, x2, y2], c) => {
    // Flèche (courbe de Bézier) entre deux réservoirs, pointe dessinée dans la direction d'arrivée.
    const P = (a, b) => [x + a * k, y + b * k], [ax, ay] = P(x1, y1), [bx, by] = P(cx, cy), [ex, ey] = P(x2, y2);
    L.svg("path", { d: `M${ax} ${ay} Q${bx} ${by} ${ex} ${ey}`, stroke: c, "stroke-width": 1.3 * k, fill: "none" }, g);
    const a = Math.atan2(ey - by, ex - bx), l = 4 * k;
    L.svg("path", { d: `M${ex} ${ey} L${ex - l * Math.cos(a - 0.45)} ${ey - l * Math.sin(a - 0.45)} L${ex - l * Math.cos(a + 0.45)} ${ey - l * Math.sin(a + 0.45)} Z`, fill: c }, g);
  };
  const boite = (g, x, y, k, t, c) => {
    // Réservoir de carbone : cadre arrondi et nom.
    L.svg("rect", { x: x - 20 * k, y: y - 7 * k, width: 40 * k, height: 14 * k, rx: 3 * k, fill: c, stroke: "#555", "stroke-width": 0.4 * k }, g);
    L.texte(g, x, y + 2 * k, t, { "font-size": 4.6 * k, "font-weight": 700, fill: "#222" });
  };

  function cycle(g, x, y, k) {
    // Air (CO₂), plantes, animaux, océans (calcaire), combustibles fossiles ; vert : retire du CO₂ de l'air, rouge : en rejette.
    const V = "#2c7a3a", R = "#c0392b";
    boite(g, x, y - 36 * k, k, "CO₂ de l'air", "#e8f0f7");
    boite(g, x - 34 * k, y, k, "plantes", "#dff0d8"); boite(g, x + 34 * k, y, k, "animaux", "#f6e6d6");
    boite(g, x - 34 * k, y + 36 * k, k, "océans, calcaire", "#d6e9f6"); boite(g, x + 34 * k, y + 36 * k, k, "charbon, pétrole", "#e6e1d6");
    fleche(g, x, y, k, [-10, -29, -18, -18, -26, -8], V);
    fleche(g, x, y, k, [26, -8, 18, -18, 10, -29], R);
    fleche(g, x, y, k, [-14, 0, 0, -3, 13, 0], "#666");
    fleche(g, x, y, k, [-20, -36, -82, -4, -44, 28], V);
    fleche(g, x, y, k, [44, 28, 82, -4, 20, -36], R);
    L.texte(g, x, y + 52 * k, "vert : retire du CO₂ de l'air ; rouge : en rejette", { "font-size": 4.2 * k, fill: "#555", "font-style": "italic" });
  }

  function abondance(g, x, y, k) {
    // Histogramme : éléments de la croûte terrestre, pourcentage en masse.
    const D = [["O", 46], ["Si", 28], ["Al", 8], ["Fe", 5.6], ["Ca", 4.1], ["autres", 8.3]];
    D.forEach(([n, p], i) => {
      const bx = x - 40 * k + i * 14 * k, h = p * 1.4 * k;
      L.svg("rect", { x: bx, y: y + 30 * k - h, width: 10 * k, height: h, fill: "#6f8fb8" }, g);
      L.texte(g, bx + 5 * k, y + 36 * k, n, { "font-size": 4.6 * k, fill: "#222", "font-weight": 700 });
      L.texte(g, bx + 5 * k, y + 28 * k - h, `${String(p).replace(".", ",")} %`, { "font-size": 3.8 * k, fill: "#222" });
    });
    L.texte(g, x, y + 46 * k, "croûte terrestre (% en masse)", { "font-size": 4.4 * k, fill: "#555", "font-style": "italic" });
  }

  function soleil(g, x, y, k) {
    // Soleil ; en dessous, deux noyaux d'hydrogène qui finissent en un noyau d'hélium (schéma simplifié).
    L.svg("circle", { cx: x, cy: y - 10 * k, r: 26 * k, fill: "url(#soleil)" }, g);
    L.texte(g, x, y + 30 * k, "4 noyaux ¹H → 1 noyau ⁴He", { "font-size": 5 * k, "font-weight": 700, fill: "#6b3d00" });
    L.texte(g, x, y + 42 * k, "réaction nucléaire (le noyau change)", { "font-size": 4.4 * k, fill: "#555", "font-style": "italic" });
  }

  const doc = (k, titre, dessin, texte) => ({ x: 262 + k * 248, y: 40, l: 236, h: 200, taille: 4.6, titre, dessin, texte });
  const DOCS = [
    doc(0, "Le cycle naturel du carbone", cycle, "L'élément carbone circule entre l'air, les êtres vivants, les océans et les roches. Les plantes vertes prennent le dioxyde de carbone CO₂ de l'air pour fabriquer leur matière (glucose, cellulose) : c'est la photosynthèse. Les êtres vivants rejettent du CO₂ en respirant ; leurs restes sont décomposés par des micro-organismes. Les océans dissolvent du CO₂ ; coquillages et coraux en font du calcaire (carbonate de calcium CaCO₃). Des restes d'êtres vivants enfouis pendant des millions d'années sont devenus charbon, pétrole et gaz naturel, dont la combustion rejette du CO₂. Dans toutes ces transformations, l'élément carbone se conserve : il change seulement d'espèce chimique."),
    doc(1, "L'abondance des éléments", abondance, "Les éléments chimiques ne sont pas répartis de la même façon partout. Dans l'Univers, environ 92 % des atomes sont des atomes d'hydrogène, et presque 8 % des atomes d'hélium. Dans la croûte terrestre, les éléments les plus abondants (en masse) sont l'oxygène (46 %), le silicium (28 %), l'aluminium (8 %) et le fer (5,6 %). Dans le corps humain, ce sont l'oxygène (65 %), le carbone (18 %), l'hydrogène (10 %) et l'azote (3 %)."),
    doc(2, "Le Soleil fabrique de l'hélium", soleil, "Au cœur du Soleil, à environ 15 millions de degrés, des noyaux d'hydrogène fusionnent et forment des noyaux d'hélium : ce sont des réactions nucléaires. Elles transforment un élément en un autre, parce qu'elles changent le noyau (son nombre de protons Z). Les transformations chimiques, elles, ne modifient pas les noyaux : les éléments s'y conservent. Les éléments plus lourds (carbone, oxygène, fer…) ont été fabriqués dans des étoiles, puis dispersés dans l'espace."),
  ];
  const e = (id, l1, l2, colonne) => ({ id, texte: [l1, l2], colonne });
  const ETIQUETTES = [
    e("photosynthese", "photosynthèse", "des plantes", 0), e("respiration", "respiration", "des êtres vivants", 1), e("combustion", "combustion du bois,", "du pétrole", 1),
    e("oceans", "dissolution dans", "les océans", 0), e("decomposition", "décomposition", "des restes", 1), e("volcan", "éruption", "volcanique", 1),
  ];

  L.poste_cycle = function (g) {
    // Documents au mur et tableau de tri.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 262, y: 262, largeur: 560, hauteur: 290, titre: "Le dioxyde de carbone de l'air", colonnes: [["Retire du CO₂", "de l'air"], ["Rejette du CO₂", "dans l'air"]], etiquettes: ETIQUETTES, fait: "tri_carbone" });
    L.documents_mur(g, DOCS, "docs_carbone");
    return { pense_bete };
  };
  L.TRI_CARBONE = ETIQUETTES;
})(window.Labo);

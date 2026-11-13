/*
Rôle : tableau blanc magnétique « diagramme (N,Z) des noyaux légers » (Z = 1 à 8, N = 0 à 10) : chaque case d'un noyau
       connu est colorée selon sa stabilité (stable, radioactif β−, β+ ou α) ; six cartes aimantées (³H, ⁴He, ¹¹C, ¹²C,
       ¹⁴C, ¹⁶O) attendent en bas : on les fait glisser dans leur case (ligne Z, colonne N = A − Z).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.MODES (couleurs et noms des modes) ; Labo.indice(texte, haut, bas) ; Labo.tableau_nz(g) ;
          fait « cartes_nz » = { carte : "Z,N" ou null }.
Utilisé par : simulation.js, affiche_nz.js.
*/
(function (L) {
  const LEGERS = { 1: { 0: "s", 1: "s", 2: "b-" }, 2: { 1: "s", 2: "s", 4: "b-", 6: "b-" }, 3: { 3: "s", 4: "s", 5: "b-", 6: "b-", 8: "b-" },
    4: { 4: "a", 5: "s", 6: "b-", 7: "b-", 8: "b-" }, 5: { 3: "b+", 5: "s", 6: "s", 7: "b-", 8: "b-" }, 6: { 3: "b+", 4: "b+", 5: "b+", 6: "s", 7: "s", 8: "b-", 9: "b-", 10: "b-" },
    7: { 5: "b+", 6: "b+", 7: "s", 8: "s", 9: "b-", 10: "b-" }, 8: { 5: "b+", 6: "b+", 7: "b+", 8: "s", 9: "s", 10: "s" } };
  L.MODES = { s: ["#2b2b2b", "stable"], "b-": ["#4a90d9", "radioactif β−"], "b+": ["#e5533d", "radioactif β+"], a: ["#f2c84b", "radioactif α"] };
  L.NOYAUX_LEGERS = LEGERS;
  const HAUT = "⁰¹²³⁴⁵⁶⁷⁸⁹", BAS = "₀₁₂₃₄₅₆₇₈₉", SYMB = ["n", "H", "He", "Li", "Be", "B", "C", "N", "O"];
  L.indice = (x, a, z) => [...String(a)].map((c) => HAUT[c]).join("") + [...String(z)].map((c) => BAS[c]).join("") + x;
  const CARTES = [["H3", 1, 2], ["He4", 2, 2], ["C11", 6, 5], ["C12", 6, 6], ["C14", 6, 8], ["O16", 8, 8]];
  const G = { x: 330, y: 306, l: 28, h: 25 }, cx = (n) => G.x + n * G.l + G.l / 2, cy = (z) => G.y - z * G.h + G.h / 2;

  function grille(g) {
    // Tableau blanc, titre, légende, cases colorées, numéros des lignes (Z, symbole) et des colonnes (N).
    L.svg("rect", { x: 266, y: 26, width: 384, height: 372, rx: 4, fill: "#fbfbf7", stroke: "#9aa2a6", "stroke-width": 3, filter: "url(#ombre)" }, g);
    L.texte(g, 458, 44, "Diagramme (N, Z) des noyaux légers", { "font-size": 9, "font-weight": 700, fill: "#23315a" });
    Object.entries(L.MODES).forEach(([, [c, nom]], k) => { L.svg("rect", { x: 290 + k * 88, y: 54, width: 10, height: 10, fill: c }, g); L.texte(g, 304 + k * 88, 62, nom, { "font-size": 7, fill: "#333", "text-anchor": "start" }); });
    for (let z = 1; z <= 8; z++) {
      L.texte(g, G.x - 16, cy(z) + 3, `${z} ${SYMB[z]}`, { "font-size": 7.5, "font-weight": 700, fill: "#333" });
      for (let n = 0; n <= 10; n++) { const m = LEGERS[z][n]; L.svg("rect", { x: G.x + n * G.l + 1, y: cy(z) - G.h / 2 + 1, width: G.l - 2, height: G.h - 2, fill: m ? L.MODES[m][0] : "none", stroke: "#cfd3d6", "stroke-width": 0.6 }, g); }
    }
    for (let n = 0; n <= 10; n++) L.texte(g, cx(n), G.y + 12, String(n), { "font-size": 7.5, "font-weight": 700, fill: "#333" });
    L.texte(g, G.x + 11 * G.l + 8, G.y + 12, "N", { "font-size": 8, "font-weight": 700, fill: "#23315a" });
    L.texte(g, G.x - 16, G.y - 8 * G.h - 6, "Z", { "font-size": 8, "font-weight": 700, fill: "#23315a" });
    L.svg("line", { x1: cx(0), y1: cy(0), x2: cx(9), y2: cy(9), stroke: "#777", "stroke-width": 0.8, "stroke-dasharray": "4 3" }, g);
    L.texte(g, G.x + 8.2 * G.l, G.y - 8.6 * G.h, "N = Z", { "font-size": 7, fill: "#555" });
  }

  function carte(g, [id, z, n], k, etat, noter) {
    // Carte aimantée : grande dans la réserve, petite dans une case ; se colle dans une case libre de la grille.
    const reserve = { x: 300 + k * 60, y: 358 }, b = L.svg("g", { class: `carte-${id}`, role: "button", "aria-label": `Carte ${id}` }, g), pos = { ...reserve };
    const texte = L.indice(id.replace(/\d+/, ""), n + z, z);
    const dessiner = () => {
      b.replaceChildren(); const petit = !!etat[id], w = petit ? 26 : 50, h = petit ? 22 : 30;
      L.svg("rect", { x: pos.x - w / 2, y: pos.y - h / 2, width: w, height: h, rx: 3, fill: "#fffbe6", stroke: "#b59b4c" }, b);
      L.texte(b, pos.x, pos.y + (petit ? 3.5 : 5), texte, { "font-size": petit ? 9 : 13, "font-weight": 700, fill: "#23315a" });
    };
    L.glissable(b, { soulever: false, debut: () => ({ ...pos }), deplacer: (p) => { Object.assign(pos, p); dessiner(); }, lacher: (p) => {
      const nn = Math.floor((p.x - G.x) / G.l), zz = Math.ceil((G.y - p.y) / G.h), cle = `${zz},${nn}`, libre = !Object.entries(etat).some(([c, v]) => c !== id && v === cle);
      if (nn >= 0 && nn <= 10 && zz >= 1 && zz <= 8 && libre) { etat[id] = cle; Object.assign(pos, { x: cx(nn), y: cy(zz) }); } else { etat[id] = null; Object.assign(pos, reserve); }
      dessiner(); noter();
    } });
    dessiner();
  }

  L.tableau_nz = function (g) {
    // Grille et cartes ; fait noté à chaque carte posée.
    grille(g);
    L.texte(g, 458, 336, "Cartes à placer (ligne Z, colonne N = A − Z)", { "font-size": 7.5, fill: "#555" });
    const etat = Object.fromEntries(CARTES.map(([id]) => [id, null])), noter = () => L.missions.noter("cartes_nz", { ...etat });
    CARTES.forEach((c, k) => carte(g, c, k, etat, noter));
    noter();
  };
})(window.Labo);

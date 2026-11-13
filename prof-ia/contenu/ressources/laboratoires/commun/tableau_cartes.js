/*
Rôle : tableau blanc magnétique quadrillé (lignes × colonnes, titres au feutre) et cartes aimantées à ranger dans ses cases :
       une carte glissée sur une case libre s'y colle ; lâchée ailleurs (ou sur une case prise), elle retourne dans la
       réserve, en bas du tableau. Sert à la classification des éléments (cartes de Mendeleïev, tableau périodique).
Reçoit : le groupe SVG et { titre, colonnes [textes], lignes [textes], cartes [{ id, textes [3 lignes], fond }], fait, case { l, h } }.
Produit : Labo.tableau_cartes(g, reglage) -> { place } ; fait « <fait> » = { id_carte : "ligne,colonne" }.
Utilisé par : les simulations de chimie (classification périodique).
*/
(function (L) {
  const B = { x: 250, y: 36, l: 550, h: 356 };

  function carte(parent, c, l, h) {
    // Carte aimantée : symbol en grand, deux lignes d'information.
    const g = L.svg("g", { class: `carte carte-${c.id}`, role: "button", "aria-label": c.textes[0], filter: "url(#ombre)" }, parent);
    L.svg("rect", { x: -l / 2, y: -h / 2, width: l, height: h, rx: 3, fill: c.fond || "#fff8d8", stroke: "#b8a76a", "stroke-width": 0.6 }, g);
    L.texte(g, 0, -h / 2 + 22, c.textes[0], { "font-size": 17, "font-weight": 700, fill: "#1f2a44" });
    c.textes.slice(1).forEach((t, i) => L.texte(g, 0, -h / 2 + 37 + i * 11, t, { "font-size": t.length > 11 ? 7 : 8.2, fill: "#23315a" }));
    return g;
  }

  L.tableau_cartes = function (g, { titre, colonnes, lignes, cartes, fait, case: C = { l: 60, h: 64 } }) {
    // Cadre, quadrillage, réserve ; chaque carte se glisse dans une case.
    const x0 = B.x + 44, y0 = B.y + 40, nc = colonnes.length, nl = lignes.length, place = {};
    L.svg("rect", { x: B.x - 6, y: B.y - 6, width: B.l + 12, height: B.h + 12, rx: 3, fill: "url(#metal-h)", filter: "url(#ombre)" }, g);
    L.svg("rect", { x: B.x, y: B.y, width: B.l, height: B.h, fill: "#fbfcfd" }, g);
    L.texte(g, B.x + B.l / 2, B.y + 14, titre, { class: "etiquette-carton", "font-size": 14 });
    colonnes.forEach((t, j) => L.texte(g, x0 + (j + 0.5) * C.l, y0 - 6, t, { class: "etiquette-carton", "font-size": 12, fill: "#1f4f8f" }));
    lignes.forEach((t, i) => L.texte(g, x0 - 22, y0 + (i + 0.5) * C.h + 4, t, { class: "etiquette-carton", "font-size": 12, fill: "#1f4f8f" }));
    for (let i = 0; i <= nl; i++) L.svg("line", { x1: x0, y1: y0 + i * C.h, x2: x0 + nc * C.l, y2: y0 + i * C.h, stroke: "#1f4f8f", "stroke-width": 0.9 }, g);
    for (let j = 0; j <= nc; j++) L.svg("line", { x1: x0 + j * C.l, y1: y0, x2: x0 + j * C.l, y2: y0 + nl * C.h, stroke: "#1f4f8f", "stroke-width": 0.9 }, g);
    const yr = y0 + nl * C.h + 12, par_ligne = Math.floor((B.l - 12) / (C.l - 2));
    const reserve = (k) => ({ x: B.x + 8 + (C.l - 4) / 2 + (k % par_ligne) * (C.l - 2), y: yr + (C.h - 4) / 2 + Math.floor(k / par_ligne) * (C.h - 2) });
    const centre = (cle) => { const [i, j] = cle.split(",").map(Number); return { x: x0 + (j + 0.5) * C.l, y: y0 + (i + 0.5) * C.h }; };
    const ranger = () => { cartes.forEach((c, k) => { const p = place[c.id] ? centre(place[c.id]) : reserve(k); c.pos = p; L.placer(c.g, p.x, p.y); }); L.missions.noter(fait, { ...place }); };
    cartes.forEach((c) => {
      c.g = carte(g, c, C.l - 6, C.h - 6);
      L.glissable(c.g, {
        debut: () => ({ ...c.pos }), deplacer: (p) => L.placer(c.g, p.x, p.y),
        lacher: (p) => {
          const j = Math.floor((p.x - x0) / C.l), i = Math.floor((p.y - y0) / C.h), cle = `${i},${j}`;
          delete place[c.id];
          if (i >= 0 && j >= 0 && i < nl && j < nc && !Object.values(place).includes(cle)) place[c.id] = cle;
          ranger();
        },
      });
    });
    ranger();
    return { place };
  };
})(window.Labo);

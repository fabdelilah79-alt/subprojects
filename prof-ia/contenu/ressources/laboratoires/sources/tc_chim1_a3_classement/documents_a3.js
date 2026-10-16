/*
Rôle : deux documents affichés au mur sur l'industrie chimique : (1) les phosphates du Maroc, de la roche aux engrais ;
       (2) pourquoi fabriquer des espèces chimiques (vanilline de synthèse, espèces artificielles). Un toucher ouvre le
       document en grand ; un second toucher le referme.
Reçoit : le groupe SVG de la paillasse et le nom du fait à noter.
Produit : Labo.documents_industrie(g, fait) ; fait « <fait> » = [numéros des documents lus].
Utilisé par : postes_a3.js.
*/
(function (L) {
  const DOCS = [
    { x: 290, titre: "Les phosphates du Maroc", chaine: ["roche de phosphate", "(naturelle)", "acide phosphorique", "engrais"], texte: "Le Maroc possède environ 70 % des réserves mondiales de phosphates, une roche naturelle riche en phosphore. L'industrie chimique la transforme : avec de l'acide sulfurique, on fabrique de l'acide phosphorique, puis des engrais, qui apportent aux plantes le phosphore dont elles ont besoin. La plateforme de Jorf Lasfar, près d'El Jadida, est l'un des plus grands sites de transformation des phosphates au monde." },
    { x: 560, titre: "Pourquoi fabriquer des espèces chimiques ?", chaine: ["gaïacol ou lignine", "(matière première)", "synthèse", "vanilline C₈H₈O₃"], texte: "La vanilline donne son goût à la vanille. Les gousses fournissent moins de 1 % de la vanilline consommée dans le monde : le reste est fabriqué par synthèse, à partir du gaïacol (tiré du pétrole) ou de la lignine du bois. La vanilline de synthèse est la même espèce chimique que la vanilline naturelle. La chimie fabrique aussi des espèces qui n'existent pas dans la nature : matières plastiques (nylon, polyéthylène), médicaments (aspirine), colorants." },
  ];

  function lignes(texte, n) {
    // Coupe un texte en lignes d'au plus n caractères.
    const r = [""];
    for (const m of texte.split(" ")) { if ((r[r.length - 1] + " " + m).length > n) r.push(m); else r[r.length - 1] = (r[r.length - 1] + " " + m).trim(); }
    return r;
  }

  function page(g, d, x, y, l, h, taille) {
    // Une page de document : titre, petit schéma en chaîne (flèches), texte.
    L.svg("rect", { x: x + 4, y: y + 5, width: l, height: h, fill: "#000", opacity: 0.18, filter: "url(#flou)" }, g);
    L.svg("rect", { x, y, width: l, height: h, fill: "#fdfdf8", stroke: "#c9c4b0" }, g);
    L.texte(g, x + l / 2, y + taille * 1.6, d.titre, { "font-size": taille * 1.25, "font-weight": 700, fill: "#23315a" });
    const yc = y + taille * 4, pas = l / 3;
    [[d.chaine[0], d.chaine[1]], [d.chaine[2], ""], [d.chaine[3], ""]].forEach(([a, b], k) => {
      L.svg("rect", { x: x + 8 + k * pas, y: yc - taille, width: pas - 24, height: taille * 2.6, rx: 3, fill: "#e8f0f7", stroke: "#8fb0cf" }, g);
      L.texte(g, x + 8 + k * pas + (pas - 24) / 2, yc, a, { "font-size": taille * 0.85, fill: "#1f3f66", "font-weight": 700 });
      if (b) L.texte(g, x + 8 + k * pas + (pas - 24) / 2, yc + taille, b, { "font-size": taille * 0.8, fill: "#1f3f66" });
      if (k < 2) L.svg("path", { d: `M${x + k * pas + pas - 14} ${yc + 2} h12 m-4 -3 l4 3 l-4 3`, stroke: "#23315a", fill: "none", "stroke-width": 1.2 }, g);
    });
    lignes(d.texte, Math.floor(l / (taille * 0.52))).forEach((t, i) => L.texte(g, x + 10, y + taille * 7.2 + i * taille * 1.35, t, { "text-anchor": "start", "font-size": taille, fill: "#222" }));
  }

  L.documents_industrie = function (g, fait) {
    // Deux affiches ; toucher l'une l'ouvre en grand au centre de la scène.
    const lus = new Set(), grand = L.svg("g", { class: "document-ouvert" }, g);
    DOCS.forEach((d, k) => {
      const e = L.svg("g", { class: `document document-${k + 1}`, role: "button", "aria-label": d.titre }, g);
      page(e, d, d.x, 40, 250, 300, 6.2);
      L.glissable(e, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => {
        grand.replaceChildren();
        page(grand, d, 112, 60, 800, 380, 16);
        L.texte(grand, 512, 428, "Touchez le document pour le refermer.", { "font-size": 10, fill: "#666" });
        lus.add(k + 1); L.missions.noter(fait, [...lus]);
      } });
    });
    L.glissable(grand, { soulever: false, debut: () => ({ x: 0, y: 0 }), toucher: () => grand.replaceChildren() });
    g.append(grand);
  };
})(window.Labo);

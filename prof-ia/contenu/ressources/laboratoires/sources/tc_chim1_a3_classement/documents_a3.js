/*
Rôle : deux documents affichés au mur sur l'industrie chimique : (1) les phosphates du Maroc, de la roche aux engrais ;
       (2) pourquoi fabriquer des espèces chimiques (vanilline de synthèse, espèces artificielles). Un toucher ouvre le
       document en grand ; un second toucher le referme.
Reçoit : le groupe SVG de la paillasse et le nom du fait à noter.
Produit : Labo.documents_industrie(g, fait) ; fait « <fait> » = [numéros des documents lus] (affichage : documents_mur.js).
Utilisé par : postes_a3.js.
*/
(function (L) {
  const DOCS = [
    { x: 290, y: 40, l: 250, h: 300, titre: "Les phosphates du Maroc", chaine: ["roche de phosphate", "(naturelle)", "acide phosphorique", "engrais"], texte: "Le Maroc possède environ 70 % des réserves mondiales de phosphates, une roche naturelle riche en phosphore. L'industrie chimique la transforme : avec de l'acide sulfurique, on fabrique de l'acide phosphorique, puis des engrais, qui apportent aux plantes le phosphore dont elles ont besoin. La plateforme de Jorf Lasfar, près d'El Jadida, est l'un des plus grands sites de transformation des phosphates au monde." },
    { x: 560, y: 40, l: 250, h: 300, titre: "Pourquoi fabriquer des espèces chimiques ?", chaine: ["gaïacol ou lignine", "(matière première)", "synthèse", "vanilline C₈H₈O₃"], texte: "La vanilline donne son goût à la vanille. Les gousses fournissent moins de 1 % de la vanilline consommée dans le monde : le reste est fabriqué par synthèse, à partir du gaïacol (tiré du pétrole) ou de la lignine du bois. La vanilline de synthèse est la même espèce chimique que la vanilline naturelle. La chimie fabrique aussi des espèces qui n'existent pas dans la nature : matières plastiques (nylon, polyéthylène), médicaments (aspirine), colorants." },
  ];

  L.documents_industrie = function (g, fait) {
    // Les deux affiches de l'industrie chimique.
    L.documents_mur(g, DOCS, fait);
  };
})(window.Labo);

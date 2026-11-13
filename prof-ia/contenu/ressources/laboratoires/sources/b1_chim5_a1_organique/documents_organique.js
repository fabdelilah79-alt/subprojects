/*
Rôle : paillasse des documents de la chimie organique : quatre affiches au mur (composition des espèces organiques ;
       jalons historiques ; matières naturelles : photosynthèse, biochimie, hydrocarbures fossiles ; diversité des
       molécules et importance économique). Un toucher ouvre un document en grand ; un second toucher le referme.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_documents_organique(g) -> { pense_bete } ; fait « documents » = [numéros des documents lus].
Utilisé par : simulation.js.
*/
(function (L) {
  const DOCS = [
    { x: 270, y: 40, l: 180, h: 300, titre: "Qu'est-ce qu'une espèce organique ?", chaine: ["paraffine", "(bougie)", "combustion", "CO₂ + H₂O"], texte: "Les espèces organiques sont des espèces chimiques constituées principalement d'atomes de carbone et d'hydrogène (sucre, éthanol, butane, urée...) ; beaucoup contiennent aussi de l'oxygène et de l'azote, parfois du chlore, du soufre ou du phosphore. Quand on les chauffe, elles noircissent (le carbone apparaît) ; quand elles brûlent, elles donnent du dioxyde de carbone et de l'eau. Le dioxyde de carbone, les carbonates et le monoxyde de carbone, qui contiennent du carbone, sont classés dans la chimie minérale." },
    { x: 460, y: 40, l: 180, h: 300, titre: "Quelques jalons historiques", chaine: ["1807", "Berzelius", "1828 Wöhler", "1858 Kekulé"], texte: "En 1807, Berzelius appelle « organiques » les espèces extraites des êtres vivants : on pense qu'une « force vitale » est nécessaire pour les fabriquer. En 1828, Wöhler obtient l'urée, espèce produite par le corps humain, à partir d'une espèce minérale (le cyanate d'ammonium) : la force vitale n'est pas nécessaire. En 1858, Kekulé montre que l'atome de carbone forme toujours quatre liaisons. Berthelot réalise ensuite de nombreuses synthèses (acétylène, éthanol, benzène)." },
    { x: 650, y: 40, l: 180, h: 300, titre: "Les matières organiques naturelles", chaine: ["CO₂ + H₂O", "lumière", "glucose", "pétrole"], texte: "Par la photosynthèse, les plantes vertes fabriquent le glucose à partir du dioxyde de carbone de l'air et de l'eau, grâce à la lumière : 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂. La biochimie étudie les espèces organiques des êtres vivants (sucres, graisses, protéines, ADN). Enfouie pendant des millions d'années, la matière vivante s'est transformée en pétrole, en gaz naturel et en charbon : ce sont des hydrocarbures fossiles, formés de carbone et d'hydrogène, qui ne se renouvellent pas à l'échelle humaine." },
    { x: 840, y: 40, l: 170, h: 300, titre: "Diversité et importance économique", chaine: ["pétrole", "brut", "raffinage", "plastiques"], texte: "On connaît plus de cent millions d'espèces organiques : l'atome de carbone se lie à d'autres atomes de carbone par des liaisons simples, doubles ou triples, pour former des chaînes droites, ramifiées ou des cycles. La chimie de synthèse fabrique à partir du pétrole et du gaz naturel les carburants, les matières plastiques, les fibres textiles, les peintures, les détergents, les engrais azotés et de nombreux médicaments : c'est l'une des premières industries mondiales." },
  ];

  L.poste_documents_organique = function (g) {
    // Pense-bête et quatre affiches.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.documents_mur(g, DOCS, "documents");
    return { pense_bete };
  };
})(window.Labo);

/*
Rôle : paillasse des documents sur la pétrochimie et la polymérisation : quatre affiches au mur (distillation fractionnée
       du pétrole ; modification du squelette : craquage, reformage, vapocraquage ; polyaddition ; polymères courants et
       leurs monomères). Un toucher ouvre un document en grand ; un second toucher le referme.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_petrochimie(g) -> { pense_bete } ; fait « petrochimie » = [numéros des documents lus].
Utilisé par : simulation.js.
*/
(function (L) {
  const DOCS = [
    { x: 270, y: 40, l: 180, h: 300, titre: "La distillation fractionnée du pétrole", chaine: ["pétrole", "brut", "colonne", "fractions"], texte: "Le pétrole brut est un mélange de très nombreux hydrocarbures. Chauffé vers 400 °C, il est envoyé dans une colonne de distillation fractionnée, plus chaude en bas qu'en haut. Chaque constituant se condense à l'étage où la température est inférieure à sa température d'ébullition : en haut les gaz (méthane à butane), puis l'essence (C₅ à C₁₀), le kérosène, le gazole ; en bas les fiouls lourds et le bitume." },
    { x: 460, y: 40, l: 180, h: 300, titre: "Modifier le squelette carboné", chaine: ["C₁₀H₂₂", "(gazole)", "craquage", "C₈H₁₈ + C₂H₄"], texte: "Le craquage casse les longues chaînes en chaînes plus courtes, plus demandées (essence) : C₁₀H₂₂ → C₈H₁₈ + C₂H₄. Le vapocraquage, vers 800 °C en présence de vapeur d'eau, produit surtout des alcènes légers : éthène (éthylène) et propène. Le reformage transforme des chaînes linéaires en chaînes ramifiées ou en cycles, et la déshydrogénation enlève des atomes d'hydrogène : on obtient une essence de meilleure qualité. La chaîne peut aussi être allongée." },
    { x: 650, y: 40, l: 180, h: 300, titre: "La polyaddition", chaine: ["n CH₂=CH₂", "(éthène)", "polyaddition", "–(CH₂–CH₂)n–"], texte: "Des molécules d'un alcène, le monomère, s'additionnent les unes aux autres en ouvrant leur liaison double : elles forment une très longue chaîne, le polymère. Pour un monomère CH₂=CHA, la polyaddition s'écrit n CH₂=CHA → –(CH₂–CHA)n– ; le motif –CH₂–CHA– se répète n fois (n est l'indice de polymérisation, de quelques milliers à plusieurs centaines de milliers)." },
    { x: 840, y: 40, l: 170, h: 300, titre: "Des polymères courants", chaine: ["monomère", "CH₂=CHA", "polymère", "–(CH₂–CHA)n–"], texte: "Polyéthylène PE (A = H) : sacs, bouteilles. Polypropylène PP (A = CH₃) : boîtes, pare-chocs. Polychlorure de vinyle PVC (A = Cl), à partir du chlorure de vinyle CH₂=CHCl : tuyaux, fenêtres. Polystyrène PS (A = C₆H₅) : emballages. Ces matières plastiques sont fabriquées à partir du pétrole ; leur recyclage limite les déchets." },
  ];

  L.poste_petrochimie = function (g) {
    // Pense-bête et quatre affiches.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.documents_mur(g, DOCS, "petrochimie");
    return { pense_bete };
  };
})(window.Labo);

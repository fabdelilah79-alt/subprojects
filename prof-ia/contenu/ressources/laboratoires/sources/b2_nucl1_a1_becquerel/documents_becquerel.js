/*
Rôle : trois documents au mur de la paillasse de Becquerel : « Becquerel, 1896 », « Les Curie, 1898 » et « La taille
       des noyaux » (ordres de grandeur, nucléide et élément chimique, étoile à neutrons).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.documents_becquerel(g) ; fait « docs_becquerel » = [numéros lus].
Utilisé par : poste_becquerel.js.
*/
(function (L) {
  const doc = (x, y, titre, texte) => ({ x, y, l: 116, h: 120, taille: 3.4, titre, texte });
  const DOCS = [
    doc(762, 44, "Becquerel, 1896", "Henri Becquerel pensait que les sels d'uranium, éclairés par le Soleil, émettaient des rayons pénétrants. Il posa des cristaux sur une plaque photographique enveloppée de papier noir et l'exposa au Soleil : la plaque fut noircie. Un jour de ciel couvert, il rangea le tout dans un tiroir ; il développa quand même la plaque : elle était aussi noircie. L'uranium émet donc un rayonnement de lui-même, sans avoir besoin de lumière. C'est la découverte de la radioactivité."),
    doc(884, 44, "Les Curie, 1898", "Pierre et Marie Curie montrent que le rayonnement ne dépend que de la quantité d'uranium, quel que soit le composé : c'est une propriété des atomes d'uranium, plus précisément de leurs noyaux. Ils découvrent deux nouveaux éléments bien plus radioactifs, le polonium et le radium, et donnent son nom au phénomène : la radioactivité. Becquerel et les Curie reçoivent le prix Nobel de physique en 1903."),
    doc(762, 174, "La taille des noyaux", "Un atome mesure environ 10⁻¹⁰ m, son noyau 10⁻¹⁵ m : cent mille fois moins. Presque toute la masse de l'atome est dans son noyau, formé de Z protons et de N neutrons (A = Z + N nucléons). Un nucléide est un ensemble de noyaux identiques, noté ᴬ_Z X ; tous les nucléides de même Z appartiennent au même élément chimique X. Une étoile à neutrons a la densité d'un noyau : une cuillère à café de sa matière pèserait des centaines de millions de tonnes."),
  ];

  L.documents_becquerel = function (g) {
    // Les trois documents au mur.
    L.documents_mur(g, DOCS, "docs_becquerel");
  };
})(window.Labo);

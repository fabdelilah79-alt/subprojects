/*
Rôle : deux documents au mur de la paillasse du microscope : « Objectif, oculaire, grossissement » et « Les limites du
       microscope » (pouvoir séparateur limité par la diffraction, grossissement utile, profondeur de champ, lumière).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.documents_microscope(g) ; fait « docs_microscope » = [numéros lus].
Utilisé par : poste_microscope.js.
*/
(function (L) {
  const doc = (k, titre, texte) => ({ x: 340 + k * 138, y: 10, l: 132, h: 150, taille: 3.6, titre, texte });
  const DOCS = [
    doc(0, "Objectif, oculaire, grossissement", "Un microscope associe deux systèmes convergents. L'objectif, de très petite distance focale (quelques millimètres), est placé près de l'objet, un peu avant son foyer objet : il en donne une image intermédiaire A1B1 réelle, renversée et très agrandie (grandissement γ1, gravé sur l'objectif : × 4, × 10, × 40). L'oculaire joue le rôle d'une loupe pour observer A1B1 ; quand A1B1 est dans son plan focal objet, l'image finale est à l'infini. Grossissement commercial du microscope : Gc = |γ1| × Gc(oculaire), par exemple 40 × 10 = 400."),
    doc(1, "Les limites du microscope", "La lumière est diffractée par les très petits détails : deux points plus proches qu'environ 0,2 µm ne peuvent pas être séparés, quel que soit le grossissement. C'est le pouvoir séparateur du microscope optique. Au-delà d'un grossissement d'environ 1 000, l'image est plus grande mais ne montre aucun détail nouveau : c'est un grossissement « à vide ». Aux forts grossissements, la profondeur de champ est très faible (on ne voit net qu'une tranche très mince), le champ est petit et il faut beaucoup de lumière : la préparation doit être fine et bien éclairée. Pour voir des virus, on utilise le microscope électronique."),
  ];

  L.documents_microscope = function (g) {
    // Les deux documents au mur.
    L.documents_mur(g, DOCS, "docs_microscope");
  };
})(window.Labo);

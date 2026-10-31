/*
Rôle : paillasse « méthode de Mendeleïev » : trois documents au mur (de l'Antiquité à Lavoisier ; Mendeleïev en 1869 et
       ses prévisions ; la classification d'aujourd'hui) et un tableau magnétique où l'on range 16 cartes d'éléments
       connus en 1869, comme Mendeleïev : par masse croissante, en commençant une nouvelle ligne quand les propriétés
       (formule du composé avec l'oxygène ou l'hydrogène) se répètent.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_mendeleiev(groupe) -> { pense_bete } ; faits « docs_classification » (documents lus) et « mendeleiev »
          (cartes rangées) ; Labo.CARTES_MENDELEIEV (case attendue de chaque carte).
Utilisé par : simulation.js.
*/
(function (L) {
  const I = (t) => t.replace(/\d/g, (c) => "₀₁₂₃₄₅₆₇₈₉"[c]);
  // [symbole, masse connue en 1869, composé typique, ligne, colonne]
  const E = [["Li", 7, "O : Li2O", 0, 0], ["Be", 9.4, "O : BeO", 0, 1], ["B", 11, "O : B2O3", 0, 2], ["C", 12, "H : CH4", 0, 3], ["N", 14, "H : NH3", 0, 4], ["O", 16, "H : H2O", 0, 5], ["F", 19, "H : HF", 0, 6],
    ["Na", 23, "O : Na2O", 1, 0], ["Mg", 24, "O : MgO", 1, 1], ["Al", 27.4, "O : Al2O3", 1, 2], ["Si", 28, "H : SiH4", 1, 3], ["P", 31, "H : PH3", 1, 4], ["S", 32, "H : H2S", 1, 5], ["Cl", 35.5, "H : HCl", 1, 6],
    ["K", 39, "O : K2O", 2, 0], ["Ca", 40, "O : CaO", 2, 1]];
  const ORDRE = [9, 2, 13, 5, 0, 15, 7, 11, 3, 14, 8, 1, 12, 6, 10, 4];
  L.CARTES_MENDELEIEV = Object.fromEntries(E.map(([s, , , i, j]) => [s, `${i},${j}`]));

  const doc = (k, titre, texte) => ({ x: 818, y: 40 + k * 116, l: 188, h: 106, taille: 3.4, titre, texte });
  const DOCS = [
    doc(0, "De l'Antiquité à Lavoisier", "Pour les Grecs de l'Antiquité, tout était fait de quatre éléments : la terre, l'eau, l'air et le feu. Les alchimistes connaissaient quelques métaux (or, argent, cuivre, fer, plomb, étain, mercure). En 1789, Lavoisier définit l'élément chimique comme ce que l'on ne peut pas décomposer, et dresse une liste de 33 « substances simples ». Au début du XIXe siècle, on découvre de nombreux éléments ; en 1869, on en connaît 63, et les chimistes cherchent à les classer."),
    doc(1, "Mendeleïev, 1869", "Le chimiste russe Dmitri Mendeleïev range les 63 éléments connus par masse atomique croissante, sur des lignes, et place les uns sous les autres ceux qui ont les mêmes propriétés chimiques (mêmes formules de composés avec l'oxygène ou l'hydrogène). Pour respecter les propriétés, il laisse des cases vides : il prévoit qu'on y découvrira des éléments inconnus. Il annonce ainsi « l'éka-silicium », sous le silicium, de masse voisine de 72. En 1886, on découvre le germanium : sa masse est 72,6 et ses propriétés sont celles qu'il avait prévues."),
    doc(2, "La classification d'aujourd'hui", "En 1913, Moseley montre que ce qui caractérise un élément n'est pas sa masse mais son numéro atomique Z. Aujourd'hui, les 118 éléments connus sont rangés par Z croissant ; une ligne (période) correspond au remplissage d'une couche électronique, et les éléments d'une même colonne ont le même nombre d'électrons sur leur couche externe : ils forment une famille chimique (alcalins, halogènes, gaz nobles…). Cette classification diffère peu de celle de Mendeleïev."),
  ];

  L.poste_mendeleiev = function (g) {
    // Documents au mur et tableau des cartes (16 cartes, dans le désordre).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 200);
    const cartes = ORDRE.map((k) => { const [s, m, f] = E[k]; return { id: s, textes: [s, `masse ${String(m).replace(".", ",")}`, I(f)] }; });
    L.tableau_cartes(g, { titre: "Rangez les éléments comme Mendeleïev", colonnes: ["I", "II", "III", "IV", "V", "VI", "VII"], lignes: ["1", "2", "3"], cartes, fait: "mendeleiev", case: { l: 60, h: 58 } });
    L.documents_mur(g, DOCS, "docs_classification");
    return { pense_bete };
  };
})(window.Labo);

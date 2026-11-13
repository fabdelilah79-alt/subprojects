/*
Rôle : paillasses de l'activité documentaire sur les piles : (1) quatre documents au mur (histoire des piles, piles usuelles,
       accumulateurs, dangers et recyclage) ; (2) tableau blanc magnétique : huit générateurs électrochimiques à ranger en
       piles (non rechargeables) et accumulateurs (rechargeables).
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_docs_piles, Labo.poste_tri_piles (groupe) -> { pense_bete } ; faits « docs_piles » (documents lus) et
          « tri_piles » ({ id: colonne }) ; Labo.TRI_PILES = [[id, texte, colonne attendue]].
Utilisé par : simulation.js.
*/
(function (L) {
  const doc = (k, titre, chaine, texte) => ({ x: 262 + (k % 2) * 370, y: 34 + Math.floor(k / 2) * 180, l: 360, h: 170, taille: 4, titre, chaine, texte });
  L.TRI_PILES = [
    ["alcaline", ["pile alcaline", "LR6, 1,5 V"], 0], ["saline", ["pile saline", "R20, 1,5 V"], 0], ["bouton", ["pile bouton", "argent, 1,55 V"], 0], ["lithium", ["pile au lithium", "CR2032, 3 V"], 0],
    ["plomb", ["batterie au plomb", "voiture, 12 V"], 1], ["nimh", ["accumulateur", "Ni-MH, 1,2 V"], 1], ["liion", ["batterie Li-ion", "téléphone, 3,7 V"], 1], ["nicd", ["accumulateur", "Ni-Cd, 1,2 V"], 1],
  ];

  L.poste_docs_piles = function (g) {
    // Pense-bête et quatre documents sur les piles.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.documents_mur(g, [
      doc(0, "Histoire des piles", ["Volta 1800", "zinc | carton salé | cuivre", "Daniell 1836", "Leclanché 1866"], "En 1800, Alessandro Volta empile des disques de zinc et de cuivre séparés par du carton imbibé d'eau salée : c'est la première pile, qui donne un courant continu. En 1836, John Daniell sépare les deux couples (Zn²⁺/Zn et Cu²⁺/Cu) par une paroi poreuse : sa pile donne une tension plus stable. En 1866, Georges Leclanché invente la pile au zinc et au dioxyde de manganèse, ancêtre des piles salines et alcalines d'aujourd'hui."),
      doc(1, "Piles usuelles", ["saline, alcaline", "1,5 V", "bouton 1,55 V", "lithium 3 V"], "Dans une pile saline ou alcaline, le zinc (pôle −) est oxydé et le dioxyde de manganèse (pôle +) est réduit ; l'électrolyte est gélifié pour que la pile ne coule pas. Une pile alcaline LR6 a une capacité d'environ 2 400 mAh : c'est la quantité d'électricité maximale qu'elle peut débiter. Les piles bouton (montres) et au lithium (appareils photo, cartes mères) donnent une tension plus stable. Une pile usée ne se recharge pas."),
      doc(2, "Accumulateurs", ["plomb 2 V", "6 en série : 12 V", "Ni-MH 1,2 V", "Li-ion 3,7 V"], "Un accumulateur est un générateur électrochimique rechargeable : pendant la charge, un générateur extérieur lui impose une transformation forcée, inverse de celle qui a lieu quand il débite. La batterie d'une voiture contient six éléments au plomb de 2 V en série (12 V). Les téléphones et les ordinateurs portables utilisent des batteries lithium-ion (3,7 V par élément)."),
      doc(3, "Dangers et recyclage", ["métaux lourds", "Hg, Cd, Pb", "collecte", "recyclage"], "Les piles et les accumulateurs contiennent des métaux toxiques pour l'environnement et la santé (mercure dans les anciennes piles, cadmium, plomb, nickel) et des électrolytes corrosifs. Il ne faut jamais les jeter avec les ordures ménagères, ni les ouvrir, ni les jeter au feu : on les dépose dans un point de collecte. Le recyclage récupère le zinc, le manganèse, le nickel, le plomb ou le lithium."),
    ], "docs_piles");
    g.append(g.querySelector(".document-ouvert"));
    return { pense_bete };
  };

  L.poste_tri_piles = function (g) {
    // Pense-bête et tableau de tri.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 290, y: 30, largeur: 600, hauteur: 360, titre: "Pile ou accumulateur ?", colonnes: [["Pile", "(non rechargeable)"], ["Accumulateur", "(rechargeable)"]], etiquettes: L.TRI_PILES.map(([id, texte, colonne]) => ({ id, texte, colonne })), fait: "tri_piles", par_ligne: 4 });
    return { pense_bete };
  };
})(window.Labo);

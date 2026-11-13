/*
Rôle : paillasses documentaires de l'activité 2 : (1) quatre documents au mur (électrolyses industrielles, dépôts
       électrolytiques, respiration, photosynthèse) ; (2) tableau blanc magnétique : huit transformations à ranger en
       spontanées et forcées.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_docs_forcees, Labo.poste_tri_forcees (groupe) -> { pense_bete } ; faits « docs_forcees » (documents lus) et
          « tri_forcees » ({ id: colonne }) ; Labo.TRI_FORCEES = [[id, texte, colonne attendue]].
Utilisé par : simulation.js.
*/
(function (L) {
  const doc = (k, titre, chaine, texte) => ({ x: 262 + (k % 2) * 370, y: 34 + Math.floor(k / 2) * 180, l: 360, h: 170, taille: 4, titre, chaine, texte });
  L.TRI_FORCEES = [
    ["butane", ["combustion", "du butane"], 0], ["pile", ["pile qui", "alimente une lampe"], 0], ["rouille", ["formation de", "la rouille"], 0], ["respiration", ["respiration", "des cellules"], 0],
    ["photosynthese", ["photosynthèse", "(feuille éclairée)"], 1], ["aluminium", ["électrolyse", "de l'alumine"], 1], ["recharge", ["recharge d'une", "batterie de téléphone"], 1], ["chromage", ["chromage", "d'un robinet"], 1],
  ];

  L.poste_docs_forcees = function (g) {
    // Pense-bête et quatre documents.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.documents_mur(g, [
      doc(0, "Électrolyses industrielles", ["alumine Al₂O₃", "fondue, 950 °C", "aluminium", "chlore et soude"], "L'aluminium est produit par électrolyse de l'alumine fondue : à la cathode, Al³⁺ + 3 e⁻ → Al ; il faut environ 13 kWh d'énergie électrique par kilogramme d'aluminium. L'électrolyse de l'eau salée (saumure) produit le dichlore (anode), le dihydrogène et la soude (cathode), utilisés pour l'eau de Javel, les plastiques et les savons. Le cuivre très pur des fils électriques est obtenu par électrolyse : le cuivre impur de l'anode se dissout et se dépose pur à la cathode."),
      doc(1, "Dépôts électrolytiques", ["objet à couvrir", "à la cathode", "chromage", "argenture"], "Pour couvrir un objet métallique d'une fine couche d'un autre métal, on en fait la cathode d'une électrolyse : les ions du métal (Cr³⁺, Ag⁺, Zn²⁺, Ni²⁺…) y sont réduits et se déposent. On protège ainsi l'acier de la rouille (zingage, chromage des robinets) ou on décore un objet (argenture, dorure). L'épaisseur déposée dépend de la quantité d'électricité Q = I·Δt qui a traversé l'électrolyseur."),
      doc(2, "La respiration", ["glucose + O₂", "→ CO₂ + H₂O", "énergie", "transformation spontanée"], "Dans les cellules, le glucose est oxydé par le dioxygène : C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O. Comme la combustion, cette transformation est spontanée et libère de l'énergie, mais lentement et à 37 °C. Cette énergie permet aux êtres vivants de réaliser des transformations qui ne se feraient pas seules, de bouger et de garder leur température : c'est comme une pile qui alimente une électrolyse."),
      doc(3, "La photosynthèse", ["CO₂ + H₂O", "lumière", "glucose + O₂", "transformation forcée"], "Les plantes vertes fabriquent le glucose : 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂. C'est l'inverse de la respiration : seule, cette transformation n'a pas lieu ; elle est forcée par l'énergie de la lumière, captée par les parties vertes de la plante. Le jour, la feuille éclairée dégage du dioxygène ; à l'obscurité, la photosynthèse s'arrête et seule la respiration continue. Comme dans un accumulateur, l'énergie reçue est stockée sous forme chimique et rendue plus tard, quand le glucose est oxydé."),
    ], "docs_forcees");
    g.append(g.querySelector(".document-ouvert"));
    return { pense_bete };
  };

  L.poste_tri_forcees = function (g) {
    // Pense-bête et tableau de tri.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_tri(g, { x: 290, y: 30, largeur: 600, hauteur: 360, titre: "Spontanée ou forcée ?", colonnes: [["Spontanée", "(se fait seule)"], ["Forcée", "(énergie imposée)"]], etiquettes: L.TRI_FORCEES.map(([id, texte, colonne]) => ({ id, texte, colonne })), fait: "tri_forcees", par_ligne: 4 });
    return { pense_bete };
  };
})(window.Labo);

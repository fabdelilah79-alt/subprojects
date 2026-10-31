/*
Rôle : simulation de l'activité 1 du chapitre « Transformation chimique d'un système » (tronc commun) : cuivre et nitrate
       d'argent, fer et sulfate de cuivre, identification des ions et précipitation de l'hydroxyde de cuivre ; combustions du
       soufre et du fer dans le dioxygène, du sodium dans le dichlore ; écriture et ajustement des équations. Objectifs O1, O2.
Reçoit : rien (les vérifications lisent les faits « metaux », « combustions » et « equations »).
Produit : la simulation démarrée : métaux et ions ; combustions ; équations.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const t = (faits, id) => faits.metaux?.[id] || {};
  const brule = (faits, r, f) => faits.combustions?.faits?.[r]?.brule?.[f] || 0;

  const METAUX = {
    id: "metaux", paillasse: 0, titre: "Métaux et ions en solution",
    objectif: "Décrire l'état initial et l'état final de trois systèmes chimiques ; identifier les ions formés.",
    entetes: [],
    conclusion: "Un système chimique est décrit par les espèces présentes, leurs quantités et leur état. Au cours d'une transformation chimique, des réactifs sont consommés et des produits se forment ; les ions qui ne réagissent pas (NO₃⁻, SO₄²⁻) sont spectateurs. La transformation est modélisée par une réaction, écrite avec une équation : Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag ; Fe + Cu²⁺ → Fe²⁺ + Cu ; Cu²⁺ + 2 HO⁻ → Cu(OH)₂.",
    conclusion_courte: "Réactifs → produits ; les ions spectateurs ne réagissent pas.",
    etapes: [
      { consigne: "Le nitrate d'argent et la soude sont corrosifs : mettez vos lunettes et vos gants.", court: "Lunettes et gants.", verifier: ({ faits }) => !!faits.metaux?.protege },
      { consigne: "Plongez le fil de cuivre dans le tube 1 (nitrate d'argent) et observez pendant une minute.", court: "Cuivre dans le tube 1.", aide_geste: "Glissez le fil de cuivre au-dessus du tube 1 et lâchez-le.", verifier: ({ faits }) => (t(faits, "t2").metal === "cuivre" || t(faits, "t3").metal === "cuivre" ? "Le fil de cuivre devait aller dans le tube 1." : t(faits, "t1").Ag_depose > 0.3) },
      { consigne: "Qu'observez-vous dans le tube 1 ?", court: "Répondez dans le carnet.", question: choix(["Des aiguilles grises d'argent se forment sur le cuivre et la solution devient bleue", "Le cuivre disparaît entièrement", "Rien ne se passe"], "Regardez le fil et la couleur de la solution.", "Exact : de l'argent se dépose, et des ions cuivre Cu²⁺ (bleus) passent en solution.") },
      { consigne: "État initial du tube 1 : cuivre Cu, ions Ag⁺ et NO₃⁻, eau. Les espèces qui ont réagi sont…", court: "Répondez dans le carnet.", question: choix(["le cuivre et les ions argent", "les ions nitrate et l'eau", "toutes les espèces"], "Lesquelles ont changé ?", "Exact : les ions nitrate NO₃⁻ sont spectateurs.") },
      { consigne: "Plongez le clou en fer dans le tube 2 (sulfate de cuivre) et observez.", court: "Clou dans le tube 2.", verifier: ({ faits }) => t(faits, "t2").Cu_depose > 0.15 },
      { consigne: "Qu'observez-vous dans le tube 2 ?", court: "Répondez dans le carnet.", question: choix(["Un dépôt rouge de cuivre recouvre le clou et la solution perd sa couleur bleue", "Le clou devient argenté", "La solution devient plus bleue"], "Regardez le clou et la couleur.", "Exact : les ions Cu²⁺ (bleus) disparaissent, du cuivre se dépose.") },
      { consigne: "Pour identifier l'ion formé dans le tube 2, ajoutez quelques gouttes de soude.", court: "Soude dans le tube 2.", aide_geste: "Sortez la pipette du flacon de soude, tenez-la au-dessus du tube 2 et appuyez sur la poire.", verifier: ({ faits }) => t(faits, "t2").FeOH2 > 0.03 },
      { consigne: "Le précipité vert montre que le tube 2 contient maintenant…", court: "Répondez dans le carnet.", question: choix(["des ions fer II Fe²⁺", "des ions cuivre Cu²⁺", "du fer métal"], "Lisez la fiche au mur.", "Exact : le fer a donné des ions Fe²⁺.") },
      { consigne: "Ajoutez de la soude dans le tube 3 (sulfate de cuivre).", court: "Soude dans le tube 3.", verifier: ({ faits }) => t(faits, "t3").CuOH2 > 0.05 },
      { consigne: "Il se forme un précipité bleu d'hydroxyde de cuivre Cu(OH)₂. Ses réactifs sont…", court: "Répondez dans le carnet.", question: choix(["les ions cuivre Cu²⁺ et les ions hydroxyde HO⁻", "les ions sulfate et les ions sodium", "l'eau et le cuivre"], "Les ions sodium et sulfate restent en solution.", "Exact : Cu²⁺ + 2 HO⁻ → Cu(OH)₂.") },
      { consigne: "Ajoutez enfin de la soude dans le tube 1.", court: "Soude dans le tube 1.", verifier: ({ faits }) => t(faits, "t1").CuOH2 > 0.03 },
      { consigne: "Le précipité bleu du tube 1 confirme que le cuivre a donné…", court: "Répondez dans le carnet.", question: choix(["des ions cuivre Cu²⁺", "des ions argent Ag⁺", "du nitrate de sodium"], "Quelle couleur a le précipité ?", "Exact.") },
    ],
  };

  const COMBUSTIONS = {
    id: "combustions", paillasse: 1, titre: "Combustions",
    objectif: "Brûler du soufre et du fer dans le dioxygène, du sodium dans le dichlore ; décrire les produits.",
    entetes: [],
    conclusion: "Une combustion est une transformation chimique : un réactif brûle dans un gaz (le dioxygène, ou ici le dichlore). S + O₂ → SO₂ ; 3 Fe + 2 O₂ → Fe₃O₄ ; 2 Na + Cl₂ → 2 NaCl. À l'état final, il peut rester un réactif (ici le gaz) : l'autre a été entièrement consommé.",
    conclusion_courte: "Combustion : réactif + gaz → produits.",
    etapes: [
      { consigne: "Mettez vos lunettes : les combustions dans le dioxygène sont très vives.", court: "Lunettes.", verifier: ({ faits }) => !!faits.combustions?.lunettes },
      { consigne: "Allumez le bec Bunsen : ouvrez le robinet de gaz, puis approchez l'allume-gaz.", court: "Allumez le bec.", verifier: ({ faits }) => !!faits.combustions?.allume },
      { consigne: "Posez le soufre sur le têt, chauffez-le dans la flamme jusqu'à ce qu'il brûle, ôtez la plaque du flacon de dioxygène 1 et plongez-y le têt.", court: "Soufre dans le dioxygène 1.", aide_geste: "Glissez le soufre sur la coupelle du têt ; prenez le têt par sa tige ; touchez le haut du flacon pour ôter la plaque.", verifier: ({ faits }) => brule(faits, "soufre", "O2a") > 0.05 },
      { consigne: "Dans le dioxygène, le soufre brûle…", court: "Répondez dans le carnet.", question: choix(["avec une flamme bleue bien plus vive que dans l'air", "sans flamme", "en devenant rouge"], "Comparez avec la flamme dans l'air.", "Exact : il se forme du dioxyde de soufre SO₂, un gaz toxique (d'où la hotte).") },
      { consigne: "Rangez le têt, posez-y la laine de fer, chauffez-la au rouge et plongez-la dans le flacon de dioxygène 2.", court: "Fer dans le dioxygène 2.", verifier: ({ faits }) => brule(faits, "fer", "O2b") > 0.08 },
      { consigne: "Dans le dioxygène, la laine de fer…", court: "Répondez dans le carnet.", question: choix(["brûle en gerbe d'étincelles et donne des grains noirs d'oxyde de fer Fe₃O₄", "brûle avec une flamme bleue", "fond sans brûler"], "Regardez le fond du flacon.", "Exact.") },
      { consigne: "Posez le sodium sur le têt, chauffez-le (il fond), puis plongez-le dans le flacon de dichlore.", court: "Sodium dans le dichlore.", verifier: ({ faits }) => brule(faits, "sodium", "Cl2") > 0.03 },
      { consigne: "Le sodium brûle dans le dichlore avec une flamme jaune. La fumée blanche est…", court: "Répondez dans le carnet.", question: choix(["du chlorure de sodium NaCl", "de la vapeur d'eau", "du dichlore"], "Que forment le sodium et le chlore ?", "Exact : du sel de cuisine, en très fins cristaux.") },
      { consigne: "Après la combustion, le flacon est encore jaune-vert : il reste du dichlore. Le réactif entièrement consommé est…", court: "Répondez dans le carnet.", question: choix(["le sodium", "le dichlore", "aucun des deux"], "Que reste-t-il sur le têt ?", "Exact : à l'état final, il ne reste plus de sodium.") },
    ],
  };

  const eq = (id, quoi, titre) => ({ consigne: `Au tableau, écrivez et ajustez l'équation de ${quoi} (bouton « ${titre} »).`, court: `Équation : ${titre}.`, verifier: ({ faits }) => !!faits.equations?.[id]?.juste });
  const EQUATIONS = {
    id: "equations", paillasse: 2, titre: "Écrire et ajuster les équations",
    objectif: "Écrire les équations des réactions observées et les ajuster (conservation des éléments et des charges).",
    entetes: [],
    conclusion: "Une équation chimique s'écrit : réactifs → produits. Les coefficients stœchiométriques, les plus petits entiers possibles, assurent la conservation des éléments et des charges électriques. Les ions spectateurs n'y figurent pas.",
    conclusion_courte: "Ajuster : conserver éléments et charges.",
    etapes: [
      eq("argent", "la réaction du cuivre avec les ions argent", "Cu + Ag⁺"), eq("fer", "la réaction du fer avec les ions cuivre", "Fe + Cu²⁺"),
      eq("hydroxyde", "la précipitation de l'hydroxyde de cuivre", "Cu²⁺ + HO⁻"), eq("soufre", "la combustion du soufre", "S + O₂"),
      eq("oxyde_fer", "la combustion du fer", "Fe + O₂"), eq("sodium", "la combustion du sodium dans le dichlore", "Na + Cl₂"), eq("propane", "la combustion du propane", "C₃H₈ + O₂"),
      { consigne: "Ajuster une équation, c'est…", court: "Répondez dans le carnet.", question: choix(["choisir les coefficients pour conserver les éléments et les charges", "changer les indices des formules", "écrire autant d'espèces de chaque côté"], "On ne change jamais une formule.", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_chim8_a1_transformations", titre: "Laboratoire : transformations", paillasses: [L.poste_metaux, L.poste_combustions, L.poste_equations], missions: [METAUX, COMBUSTIONS, EQUATIONS] });
})(window.Labo);

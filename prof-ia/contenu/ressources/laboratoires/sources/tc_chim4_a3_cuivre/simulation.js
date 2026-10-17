/*
Rôle : simulation de l'activité 3 du chapitre « Modèle de l'atome » (tronc commun) : conservation de l'élément cuivre, par
       l'expérience, avant le cours. Dans un même tube, le cuivre métal devient ions Cu²⁺, hydroxyde Cu(OH)₂, oxyde CuO,
       de nouveau ions Cu²⁺, puis de nouveau cuivre métal : l'élément cuivre (Z = 29) se conserve. Objectif O4.
Reçoit : rien (les vérifications lisent le fait « cycle » de la paillasse).
Produit : la simulation démarrée : deux missions sur la même paillasse.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const C = (faits) => faits.cycle || {};

  function attaque({ faits }) {
    // Toute la tournure a été attaquée : le cuivre est passé en solution (ions Cu²⁺).
    const c = C(faits);
    if (c.metal > 0.02 && !c.gaz && c.ions > 0.05) return "Il reste du cuivre et l'attaque s'est arrêtée : ajoutez encore un peu d'acide nitrique.";
    return (c.metal <= 0.02 && c.ions > 0.9) || false;
  }

  const IONS = {
    id: "ions", paillasse: 0, titre: "Le cuivre change de forme",
    objectif: "Faire réagir de la tournure de cuivre avec de l'acide nitrique, puis ajouter de la soude, et suivre ce que devient le cuivre.",
    entetes: [],
    conclusion: "L'acide nitrique attaque le cuivre : le métal disparaît, la solution devient bleue (ions cuivre Cu²⁺) et un gaz roux se dégage. La soude donne avec les ions Cu²⁺ un précipité bleu d'hydroxyde de cuivre Cu(OH)₂.",
    conclusion_courte: "Cu → Cu²⁺ (bleu) → Cu(OH)₂ (précipité bleu).",
    etapes: [
      { consigne: "Mettez les lunettes et les gants : les acides et la soude sont corrosifs. Le gaz qui va se former est toxique : on travaille sous la hotte.", court: "Lunettes et gants.", verifier: ({ faits }) => C(faits).epi || false, aide_geste: "Touchez les lunettes, puis les gants, au mur." },
      { consigne: "Avec la pipette, versez environ 1 mL d'acide nitrique (une pipette pleine) sur la tournure de cuivre du tube. Observez jusqu'à la fin de la réaction.", court: "1 mL d'acide nitrique sur le cuivre.", verifier: attaque, aide_geste: "Sortez la pipette du flacon, lâchez-la au-dessus du tube, puis appuyez sur la poire." },
      { consigne: "Le métal a disparu, la solution est bleue. L'élément cuivre…", court: "Répondez dans le carnet.", question: choix(["est toujours dans le tube, sous forme d'ions cuivre Cu²⁺ (qui colorent la solution en bleu)", "a disparu", "est parti avec le gaz roux"], "Que devient la couleur de la solution ? Le gaz roux est du dioxyde d'azote NO₂.", "Exact : le gaz roux, NO₂, vient de l'acide nitrique.") },
      { consigne: "Ajoutez de la soude, goutte à goutte, jusqu'à ce que la solution ne soit plus bleue (environ 1 mL).", court: "Ajoutez de la soude.", verifier: ({ faits }) => (C(faits).hydroxyde > 0.9 && C(faits).ions < 0.05) || false, aide_geste: "Les premières gouttes neutralisent l'acide restant : continuez." },
      { consigne: "Le précipité bleu est de l'hydroxyde de cuivre Cu(OH)₂. Il contient…", court: "Répondez dans le carnet.", question: choix(["l'élément cuivre, venu des ions Cu²⁺", "un nouvel élément, créé par la soude", "seulement de l'eau"], "Regardez sa formule.", "Exact.") },
    ],
  };

  const RETOUR = {
    id: "retour", paillasse: 0, titre: "Retrouver le cuivre métal",
    objectif: "Chauffer le précipité, le dissoudre dans l'acide sulfurique, puis ajouter de la poudre de fer.",
    entetes: [],
    conclusion: "Chauffé, l'hydroxyde de cuivre devient de l'oxyde de cuivre CuO, noir. L'acide sulfurique le dissout : on retrouve les ions Cu²⁺ bleus. La poudre de fer transforme ces ions en cuivre métal, rouge. Sous toutes ces formes (Cu, Cu²⁺, Cu(OH)₂, CuO), c'est le même élément cuivre, de numéro atomique Z = 29 : l'élément chimique se conserve au cours des transformations chimiques.",
    conclusion_courte: "L'élément cuivre se conserve.",
    etapes: [
      { consigne: "Plongez le tube dans le bain-marie à 90 °C et attendez que le précipité devienne noir.", court: "Tube au bain-marie (90 °C).", verifier: ({ faits }) => (C(faits).oxyde > 0.9 && C(faits).hydroxyde < 0.05) || false },
      { consigne: "Le solide noir est de l'oxyde de cuivre CuO. Il s'est formé…", court: "Répondez dans le carnet.", question: choix(["à partir de l'hydroxyde de cuivre chauffé : il contient toujours l'élément cuivre", "à partir de l'eau du bain-marie", "à partir du verre du tube"], "Que contenait le tube avant le chauffage ?", "Exact.") },
      { consigne: "Sortez le tube (remettez-le dans le porte-tubes), puis versez environ 1 mL d'acide sulfurique.", court: "1 mL d'acide sulfurique.", aide_geste: "S'il reste du solide noir, ajoutez encore un peu d'acide : il neutralise d'abord la soude en excès.", verifier: ({ faits }) => (C(faits).ions > 0.9 && C(faits).oxyde < 0.05 && !C(faits).bain) || false },
      { consigne: "Avec la spatule, ajoutez une pointe de poudre de fer dans le tube. Observez.", court: "Une pointe de fer en poudre.", aide_geste: "Plongez le bout de la spatule dans le pot, puis lâchez-la, le bout au-dessus du tube.", verifier: ({ faits }) => (C(faits).metal > 0.9 && C(faits).ions < 0.05) || false },
      { consigne: "Le dépôt rouge est du cuivre métal ; la solution n'est plus bleue. On en conclut que…", court: "Répondez dans le carnet.", question: choix(["l'élément cuivre s'est conservé au cours de toutes ces transformations", "le fer s'est transformé en cuivre", "le cuivre a été créé par l'acide"], "D'où vient ce cuivre ? Le fer, lui, est passé en solution (ions Fe²⁺).", "Exact : on a retrouvé le cuivre du départ.") },
      { consigne: "Cu, Cu²⁺, Cu(OH)₂ et CuO contiennent le même élément, car…", court: "Répondez dans le carnet.", question: choix(["leurs atomes ou ions de cuivre ont le même noyau : 29 protons (Z = 29)", "ils ont le même nombre d'électrons", "ils ont la même couleur"], "Quel nombre caractérise un élément chimique ?", "Exact : c'est Z qui caractérise l'élément. Seules des réactions nucléaires (dans le Soleil, par exemple) changent un élément en un autre.") },
    ],
  };

  L.demarrer({ id: "tc_chim4_a3_cuivre", titre: "Laboratoire : conservation de l'élément cuivre", paillasses: [L.poste_cuivre], missions: [IONS, RETOUR] });
})(window.Labo);

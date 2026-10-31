/*
Rôle : simulation de l'activité 4 du chapitre « Modèle de l'atome » (tronc commun) : conservation de l'élément carbone
       (combustion du charbon de bois dans le dioxygène, test du dioxyde de carbone à l'eau de chaux), cycle naturel du
       carbone, abondance des éléments ; les réactions nucléaires du Soleil sont seulement évoquées. Objectifs O1, O4.
Reçoit : rien (les vérifications lisent les faits des paillasses).
Produit : la simulation démarrée : combustion ; cycle du carbone.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const C = (faits) => faits.carbone || {};

  function brule({ faits }) {
    // Le charbon a brûlé dans le flacon de dioxygène (il n'en reste presque rien).
    const c = C(faits);
    if (c.m > 0.1 && c.T < 450 && c.lieu === "flacon") return "Le charbon est froid : il faut d'abord le chauffer au rouge dans la flamme.";
    return (c.m < 0.02 && c.CO2 > 0.5) || false;
  }

  function tri({ faits }) {
    // Les six phénomènes sont rangés dans la bonne colonne.
    const t = faits.tri_carbone || {};
    if (Object.keys(t).length < L.TRI_CARBONE.length) return false;
    return L.TRI_CARBONE.every((e) => t[e.id] === e.colonne) || "Une étiquette n'est pas dans la bonne colonne : relisez le document 1.";
  }

  const COMBUSTION = {
    id: "combustion", paillasse: 0, titre: "Que devient le carbone qui brûle ?",
    objectif: "Faire brûler du charbon de bois (carbone) dans du dioxygène, puis rechercher le gaz formé avec l'eau de chaux.",
    entetes: [],
    conclusion: "Le charbon de bois (carbone) brûle vivement dans le dioxygène et disparaît. Le gaz formé trouble l'eau de chaux : c'est du dioxyde de carbone. C + O₂ → CO₂ : l'élément carbone n'a pas disparu, il est dans le dioxyde de carbone, puis dans le carbonate de calcium qui trouble l'eau de chaux.",
    conclusion_courte: "C + O₂ → CO₂ : l'élément carbone se conserve.",
    etapes: [
      { consigne: "Mettez vos lunettes de protection.", court: "Lunettes.", verifier: ({ faits }) => C(faits).lunettes || false, aide_geste: "Touchez les lunettes, au mur." },
      { consigne: "Ouvrez le robinet de gaz, puis allumez le bec avec l'allume-gaz. Gardez la virole ouverte : flamme bleue, la plus chaude.", court: "Bec allumé, flamme bleue.", verifier: ({ faits }) => (C(faits).allume && C(faits).air) || false, aide_geste: "Touchez la manette jaune du robinet, puis l'allume-gaz rouge. La virole est la bague du bas du tube." },
      { consigne: "Tenez le têt dans la flamme, la coupelle juste au-dessus du cône bleu, jusqu'à ce que le charbon rougeoie.", court: "Charbon chauffé au rouge.", verifier: ({ faits }) => C(faits).T > 600 || false, aide_geste: "Gardez le doigt appuyé : le têt reste dans votre main tant que vous ne le lâchez pas." },
      { consigne: "Ôtez la plaque de verre du flacon de dioxygène (touchez le haut du flacon), puis lâchez le têt dans le flacon. Observez.", court: "Têt dans le dioxygène.", verifier: brule },
      { consigne: "Dans le dioxygène, le charbon incandescent…", court: "Répondez dans le carnet.", question: choix(["brûle beaucoup plus vivement que dans l'air, et disparaît", "s'éteint aussitôt", "ne change pas"], "Comparez l'éclat du charbon dans l'air et dans le flacon.", "Exact : l'air ne contient que 21 % de dioxygène.") },
      { consigne: "Remettez le têt sur son support. Versez l'eau de chaux dans le flacon, reposez la plaque de verre et agitez le flacon.", court: "Eau de chaux, plaque, agitez.", verifier: ({ faits }) => C(faits).trouble > 0.8 || false, aide_geste: "Saisissez le flacon et secouez-le doucement de droite à gauche." },
      { consigne: "L'eau de chaux se trouble : le gaz formé par la combustion est…", court: "Répondez dans le carnet.", question: choix(["du dioxyde de carbone CO₂", "du dioxygène", "de la vapeur d'eau"], "Quel gaz l'eau de chaux permet-elle de reconnaître ?", "Exact.") },
      { consigne: "Où est passé l'élément carbone du charbon ?", court: "Répondez dans le carnet.", question: choix(["dans le dioxyde de carbone CO₂, puis dans le carbonate de calcium qui trouble l'eau de chaux", "il a disparu en brûlant", "dans la flamme du bec Bunsen"], "Regardez la formule du gaz formé.", "Exact : C + O₂ → CO₂. L'élément carbone se conserve.") },
    ],
  };

  const CYCLE = {
    id: "cycle", paillasse: 1, titre: "Le cycle du carbone ; l'abondance des éléments",
    objectif: "Lire des documents et en extraire les informations : cycle naturel du carbone, abondance des éléments, éléments formés dans le Soleil.",
    entetes: [],
    conclusion: "Dans la nature, l'élément carbone passe de l'air (CO₂) aux êtres vivants, aux océans et aux roches, puis revient dans l'air : il se conserve au cours de ces transformations. L'hydrogène et l'hélium forment presque tout l'Univers ; l'oxygène est l'élément le plus abondant de la croûte terrestre et du corps humain. Seules les réactions nucléaires (dans les étoiles) changent un élément en un autre.",
    conclusion_courte: "Le carbone circule et se conserve.",
    etapes: [
      { consigne: "Lisez les trois documents.", court: "Lisez les documents 1, 2, 3.", verifier: ({ faits }) => [1, 2, 3].every((k) => (faits.docs_carbone || []).includes(k)) || false },
      { consigne: "Rangez chaque phénomène : retire-t-il du dioxyde de carbone de l'air, ou en rejette-t-il ?", court: "Rangez les six étiquettes.", aide_geste: "Faites glisser chaque étiquette dans sa colonne.", verifier: tri },
      { consigne: "Au cours du cycle naturel du carbone, l'élément carbone…", court: "Répondez dans le carnet.", question: choix(["se conserve : il passe d'une espèce chimique à une autre (CO₂, glucose, calcaire…)", "est créé par les plantes", "disparaît dans les combustions"], "Relisez la dernière phrase du document 1.", "Exact.") },
      { consigne: "L'élément le plus abondant (en masse) de la croûte terrestre est…", court: "Répondez dans le carnet.", question: choix(["l'oxygène", "le fer", "le silicium"], "Regardez l'histogramme du document 2.", "Exact : 46 % de la masse de la croûte terrestre.") },
      { consigne: "Dans l'Univers, les atomes les plus nombreux sont…", court: "Répondez dans le carnet.", question: choix(["les atomes d'hydrogène, puis d'hélium", "les atomes d'oxygène", "les atomes de carbone"], "Relisez le début du document 2.", "Exact : environ 92 % et 8 % des atomes.") },
      { consigne: "Dans le Soleil, l'hydrogène devient de l'hélium. Ce n'est pas une transformation chimique, car…", court: "Répondez dans le carnet.", question: choix(["le noyau change : le nombre de protons Z n'est plus le même", "il y fait trop chaud", "l'hélium est un gaz"], "Qu'est-ce qui caractérise un élément ?", "Exact : c'est une réaction nucléaire. Dans une transformation chimique, les éléments se conservent.") },
    ],
  };

  L.demarrer({ id: "tc_chim4_a4_carbone", titre: "Laboratoire : l'élément carbone", paillasses: [L.poste_carbone, L.poste_cycle], missions: [COMBUSTION, CYCLE] });
})(window.Labo);

/*
Rôle : simulation de l'activité 1 du chapitre « Lecture d'une formule chimique » (1re année du bac) : influence du
       squelette carboné (solubilité dans l'eau et densité des hydrocarbures, températures d'ébullition : longueur de la
       chaîne, ramification, distillation fractionnée) ; tests des groupes caractéristiques (2,4-DNPH, liqueur de Fehling,
       BBT, permanganate acidifié) pour identifier un alcool primaire, un aldéhyde, une cétone, un acide carboxylique et un
       alcool tertiaire. Objectifs O1, O4, O5.
Reçoit : rien (les vérifications lisent les faits « solubilite », « ebullition », « groupes », la feuille et la courbe).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const so = (f, k) => ((f.solubilite || {})[k]) || {}, eb = (f, k) => ((f.ebullition || {})[k]) || {}, gr = (f, l) => ((f.groupes || {})[l]) || {};
  const TEB = { 1: -162, 2: -89, 3: -42, 4: -0.5, 5: 36, 6: 69 };

  function tableau({ feuille }) {
    // Six alcanes linéaires : n (atomes de carbone), Téb (°C) lue sur l'affiche.
    const l = feuille.lignes(["A", "B"]);
    if (l.length < 6) return false;
    for (const [k, x] of l.entries()) if (!(x.A in TEB) || Math.abs(TEB[x.A] - x.B) > 0.6) return `Ligne ${k + 2} : n (de 1 à 6) et la température d'ébullition de l'alcane linéaire correspondant.`;
    return new Set(l.map((x) => x.A)).size >= 6 || "Les six alcanes linéaires, du méthane à l'hexane.";
  }

  const SOLUBILITE = {
    id: "solubilite", paillasse: 0, titre: "Solubilité et densité",
    objectif: "Ajouter de l'eau à de l'hexane, du cyclohexane et de l'éthanol ; observer.",
    entetes: [],
    donnees: ["Hexane C₆H₁₄ et cyclohexane C₆H₁₂ : hydrocarbures ; éthanol C₂H₅–OH : alcool", "Masse volumique de l'eau : 1,00 g/mL"],
    conclusion: "L'hexane et le cyclohexane ne se mélangent pas à l'eau : deux phases ; l'hydrocarbure est au-dessus, il est moins dense que l'eau (d = 0,66 et 0,78). L'éthanol se mélange à l'eau en toutes proportions : son groupe –OH le rend soluble. La densité d'un hydrocarbure augmente avec le nombre d'atomes de carbone et quand la chaîne est cyclique.",
    conclusion_courte: "Hydrocarbures : non miscibles, moins denses que l'eau.",
    etapes: [
      { consigne: "Avec la pissette, ajoutez environ 3 mL d'eau dans chacun des trois tubes et observez.", court: "Eau dans les trois tubes.", aide_geste: "Prenez la pissette, lâchez-la le bec au-dessus d'un tube et appuyez sur son corps ; touchez son bouchon pour la reposer.", verifier: ({ faits }) => [1, 2, 3].every((k) => so(faits, k).eau >= 1) },
      { consigne: "Dans les tubes d'hexane et de cyclohexane…", court: "Répondez dans le carnet.", question: choix(["deux phases : l'hydrocarbure au-dessus", "une seule phase : il se dissout", "deux phases : l'hydrocarbure au fond"], "Regardez où se trouve chaque liquide.", "Exact.") },
      { consigne: "L'éthanol se mélange à l'eau parce que…", court: "Répondez dans le carnet.", question: choix(["son groupe –OH ressemble à l'eau", "il est plus dense que l'eau", "sa chaîne carbonée est longue"], "Comparez les formules C₂H₅–OH et H–OH.", "Exact.") },
    ],
  };

  const EBULLITION = {
    id: "ebullition", paillasse: 1, titre: "Températures d'ébullition",
    objectif: "Chauffer trois hydrocarbures au bain-marie à 50 °C ; relier la température d'ébullition au squelette.",
    entetes: ["n (C)", "Téb (°C)"],
    conclusion: "Seul le pentane (Téb = 36 °C) bout à 50 °C. La température d'ébullition des alcanes linéaires augmente avec le nombre d'atomes de carbone ; pour un même nombre d'atomes, elle diminue quand la chaîne est ramifiée (pentane 36 °C, 2-méthylbutane 28 °C, 2,2-diméthylpropane 10 °C). La distillation fractionnée du pétrole sépare ainsi ses constituants selon leur température d'ébullition.",
    conclusion_courte: "Téb augmente avec la chaîne, diminue avec la ramification.",
    etapes: [
      { consigne: "Plongez les trois tubes dans le bain-marie à 50 °C et observez.", court: "Tubes au bain-marie.", aide_geste: "Faites glisser chaque tube dans une place du bain-marie.", verifier: ({ faits }) => [1, 2, 3].every((k) => eb(faits, k).bain) && eb(faits, 1).a_bouilli },
      { consigne: "Seul le pentane bout parce que…", court: "Répondez dans le carnet.", question: choix(["il bout à 36 °C, sous 50 °C", "il est le plus dense des trois", "sa chaîne est la plus longue"], "Lisez l'affiche.", "Exact.") },
      { consigne: "Tableur : en A, le nombre n d'atomes de carbone (1 à 6) ; en B, la température d'ébullition de l'alcane linéaire (affiche).", court: "Tableur : A, B.", verifier: tableau },
      { consigne: "Tracez Téb (B) en fonction de n (A).", court: "Courbe Téb = f(n).", verifier: ({ courbe }) => (courbe.x === "A" && courbe.y === "B" && courbe.n >= 6) || "Abscisse : A (n) ; ordonnée : B (Téb)." },
      { consigne: "Pour un même nombre d'atomes de carbone (C₅H₁₂), la ramification…", court: "Répondez dans le carnet.", question: choix(["abaisse θéb", "élève θéb", "ne change pas θéb"], "Comparez le pentane et ses deux isomères.", "Exact.") },
      { consigne: "La distillation fractionnée du pétrole sépare ses constituants parce qu'ils ont…", court: "Répondez dans le carnet.", question: choix(["des θéb différentes", "des couleurs différentes", "des densités différentes"], "Les plus légers sortent en haut de la colonne.", "Exact.") },
    ],
  };

  const GROUPES = {
    id: "groupes", paillasse: 2, titre: "Les groupes caractéristiques",
    objectif: "Identifier, par des tests, le contenu des tubes A à E.",
    entetes: [],
    donnees: ["Les tubes contiennent, dans le désordre : éthanol, éthanal, propanone, acide éthanoïque, 2-méthylpropan-2-ol", "2,4-DNPH : précipité jaune-orangé avec un aldéhyde ou une cétone (groupe carbonyle C=O)", "Liqueur de Fehling chauffée : précipité rouge brique avec un aldéhyde", "Permanganate acidifié : décoloré par un alcool primaire ou secondaire (et par un aldéhyde)"],
    conclusion: "B et C contiennent le groupe carbonyle (DNPH) ; B réduit la liqueur de Fehling : c'est l'éthanal CH₃–CHO, un aldéhyde ; C est la propanone CH₃–CO–CH₃, une cétone. D fait virer le BBT au jaune : c'est l'acide éthanoïque CH₃–COOH. A décolore le permanganate : c'est l'éthanol CH₃–CH₂–OH, alcool primaire, oxydé en éthanal puis en acide éthanoïque ; E ne réagit pas : c'est le 2-méthylpropan-2-ol, alcool tertiaire.",
    conclusion_courte: "Tests : DNPH, Fehling, BBT, permanganate.",
    etapes: [
      { consigne: "Ajoutez quelques gouttes de 2,4-DNPH dans les cinq tubes (lunettes et gants).", court: "DNPH dans A à E.", verifier: ({ faits }) => ["A", "B", "C", "D", "E"].every((l) => gr(faits, l).dnph !== null) },
      { consigne: "Le précipité jaune-orangé apparaît dans…", court: "Répondez dans le carnet.", question: choix(["B et C : groupe C=O", "A et E : groupe –OH", "D seul : groupe –COOH"], "Regardez les cinq tubes.", "Exact.") },
      { consigne: "Touchez « Nouveaux tubes » ; ajoutez de la liqueur de Fehling dans B et C, puis plongez-les dans le bain-marie.", court: "Fehling dans B et C, à chaud.", verifier: ({ faits }) => gr(faits, "B").fehling !== null && gr(faits, "C").fehling !== null && gr(faits, "B").fehling === true },
      { consigne: "Ajoutez du BBT dans A, D et E ; puis, dans des tubes neufs, du permanganate acidifié dans A et E.", court: "BBT, puis permanganate.", verifier: ({ faits }) => ["A", "D", "E"].every((l) => gr(faits, l).bbt !== null) && gr(faits, "A").mno4 !== null && gr(faits, "E").mno4 !== null },
      { consigne: "Le tube B contient…", court: "Répondez dans le carnet.", question: choix(["l'éthanal (aldéhyde)", "la propanone (cétone)", "l'éthanol (alcool)"], "Carbonyle et Fehling positif.", "Exact.") },
      { consigne: "Le tube D contient…", court: "Répondez dans le carnet.", question: choix(["l'acide éthanoïque (–COOH)", "l'éthanal (aldéhyde, –CHO)", "l'éthanol (alcool, –OH)"], "BBT jaune : solution acide.", "Exact.") },
      { consigne: "A décolore le permanganate, E non. A est…", court: "Répondez dans le carnet.", question: choix(["l'éthanol, alcool primaire", "l'alcool tertiaire", "la propanone, une cétone"], "Un alcool tertiaire ne subit pas d'oxydation ménagée.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_chim6_a1_squelette", titre: "Laboratoire : squelette et groupes caractéristiques", paillasses: [L.poste_solubilite, L.poste_ebullition, L.poste_groupes], missions: [SOLUBILITE, EBULLITION, GROUPES] });
})(window.Labo);

/*
Rôle : simulation de l'activité 2 du chapitre « Lecture d'une formule chimique » (1re année du bac) : modèles moléculaires
       (butane et méthylpropane : isomères de constitution ; (Z)- et (E)-but-2-ène : isomérie Z/E ; noms IUPAC, formules
       semi-développées) et documents sur la pétrochimie (distillation fractionnée, craquage, reformage, vapocraquage) et
       la polymérisation (polyaddition, motif –(CH₂–CHA)n–). Objectifs O1, O2, O3.
Reçoit : rien (les vérifications lisent les faits « modele » et « petrochimie »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nom = (f) => ((f.modele || {}).nom) || {};
  const construit = (attendu, aide) => ({ faits }) => { const m = faits.modele || {}, n = nom(faits); if (n.nom === attendu) return true; return m.complet && m.brute && n.nom ? `Votre modèle : ${n.nom}. ${aide}` : false; };

  function poste_modeles(g) {
    // Boîte de modèles moléculaires et atelier d'assemblage ; message court au-dessus de l'atelier.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 420, y: 188, width: 400, height: 22, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 620, 199, t, { "font-size": 7.6, "font-weight": 700, fill: "#6b3d00" }); } };
    L.boite_modeles(ctx, { x: 206, sol: 576, cx: 620, cy: 380, fait: "modele", dire });
    return { pense_bete };
  }

  const ISOMERES = {
    id: "isomeres", paillasse: 0, titre: "Isomères de constitution",
    objectif: "Construire deux molécules de formule brute C₄H₁₀ ; écrire leurs formules semi-développées ; les nommer.",
    entetes: [],
    donnees: ["Nom d'un alcane : racine selon le nombre d'atomes de carbone de la chaîne la plus longue (méth-, éth-, prop-, but-, pent-, hex-) + « ane »", "Une ramification CH₃– s'appelle méthyle ; son indice est le plus petit possible"],
    conclusion: "Le butane CH₃–CH₂–CH₂–CH₃ a une chaîne linéaire ; le 2-méthylpropane CH₃–CH(CH₃)–CH₃ a une chaîne ramifiée. Ils ont la même formule brute C₄H₁₀ mais des enchaînements d'atomes différents : ce sont des isomères de constitution, qui n'ont pas les mêmes propriétés (Téb : −0,5 °C et −12 °C). C₅H₁₂ a trois isomères : pentane, 2-méthylbutane, 2,2-diméthylpropane.",
    conclusion_courte: "Même formule brute, enchaînements différents.",
    etapes: [
      { consigne: "Construisez le butane : quatre carbones à la suite, puis des hydrogènes dans tous les trous.", court: "Butane C₄H₁₀.", aide_geste: "Prenez une boule dans un casier et lâchez-la contre un trou libre ; glissez à côté du modèle pour le tourner.", verifier: construit("butane", "Les quatre carbones doivent se suivre.") },
      { consigne: "Touchez « Tout démonter », puis construisez un isomère du butane à chaîne ramifiée.", court: "Isomère ramifié de C₄H₁₀.", verifier: construit("2-méthylpropane", "Accrochez trois carbones au carbone central.") },
      { consigne: "Le butane et le 2-méthylpropane sont des isomères de constitution parce qu'ils ont…", court: "Répondez dans le carnet.", question: choix(["la même formule brute et des enchaînements d'atomes différents", "la même formule semi-développée", "des formules brutes différentes"], "Comptez les atomes, puis comparez les chaînes.", "Exact.") },
      { consigne: "La formule semi-développée du 2-méthylpropane est…", court: "Répondez dans le carnet.", question: choix(["CH₃–CH(CH₃)–CH₃", "CH₃–CH₂–CH₂–CH₃", "CH₂=CH–CH₃"], "Le carbone central porte un seul hydrogène.", "Exact.") },
      { consigne: "CH₃–CH(CH₃)–CH₂–CH₃ se nomme…", court: "Répondez dans le carnet.", question: choix(["2-méthylbutane", "3-méthylbutane", "2-méthylpentane"], "Chaîne la plus longue : 4 carbones ; numérotez pour donner le plus petit indice.", "Exact : c'est un isomère du pentane.") },
    ],
  };

  const ZE = {
    id: "ze", paillasse: 0, titre: "L'isomérie Z/E",
    objectif: "Construire les deux but-2-ène CH₃–CH=CH–CH₃ ; comparer la position des groupes CH₃.",
    entetes: [],
    donnees: ["Alcène : racine + « ène », précédé de l'indice de la liaison double (but-2-ène)", "Toucher une liaison C–C la rend double ; la liaison double empêche la rotation"],
    conclusion: "Autour de la liaison double, la molécule est plane et ne peut pas tourner. Dans le (Z)-but-2-ène, les deux groupes CH₃ sont du même côté de la liaison double ; dans le (E)-but-2-ène, ils sont de part et d'autre. Ce sont deux isomères Z et E, de propriétés différentes. Le but-1-ène n'a pas d'isomère Z/E : un des carbones de la double liaison porte deux hydrogènes.",
    conclusion_courte: "Z : même côté ; E : de part et d'autre.",
    etapes: [
      { consigne: "Démontez, puis construisez le (Z)-but-2-ène : une liaison double entre deux carbones, un CH₃ sur chacun, du même côté.", court: "(Z)-but-2-ène.", aide_geste: "Lâchez chaque carbone près du trou choisi : il s'y accroche.", verifier: construit("(Z)-but-2-ène", "Les deux CH₃ doivent être du même côté de la liaison double.") },
      { consigne: "Démontez, puis construisez le (E)-but-2-ène : les deux CH₃ de part et d'autre de la liaison double.", court: "(E)-but-2-ène.", verifier: construit("(E)-but-2-ène", "Les deux CH₃ doivent être de part et d'autre de la liaison double.") },
      { consigne: "On ne peut pas passer de l'isomère Z à l'isomère E en tournant le modèle parce que…", court: "Répondez dans le carnet.", question: choix(["la liaison double empêche la rotation autour de l'axe C=C", "les hydrogènes se gênent", "la molécule est linéaire"], "Essayez de tourner un CH₃ autour de la liaison double.", "Exact.") },
      { consigne: "Le but-1-ène CH₂=CH–CH₂–CH₃ a-t-il des isomères Z et E ?", court: "Répondez dans le carnet.", question: choix(["non : l'un des carbones de la double liaison porte deux atomes identiques (H)", "oui, comme le but-2-ène", "oui, trois isomères"], "Isomérie Z/E : CHA=CHB.", "Exact.") },
    ],
  };

  const POLYMERES = {
    id: "polymeres", paillasse: 1, titre: "Pétrochimie et polymères",
    objectif: "Lire les quatre documents ; relier les procédés aux modifications du squelette ; écrire le motif d'un polymère.",
    entetes: [],
    conclusion: "La distillation fractionnée sépare les constituants du pétrole selon leur température d'ébullition. Le craquage raccourcit les chaînes, le reformage les ramifie ou les cyclise, le vapocraquage donne des alcènes légers. Par polyaddition, n CH₂=CHA → –(CH₂–CHA)n– : l'éthène donne le polyéthylène, le chlorure de vinyle le PVC, le propène le polypropylène.",
    conclusion_courte: "n CH₂=CHA → –(CH₂–CHA)n–.",
    etapes: [
      { consigne: "Touchez chaque document pour le lire, puis refermez-le.", court: "Lire les quatre documents.", verifier: ({ faits }) => (faits.petrochimie || []).length >= 4 },
      { consigne: "Le craquage d'une longue chaîne…", court: "Répondez dans le carnet.", question: choix(["la raccourcit (C₁₀H₂₂ → C₈H₁₈ + C₂H₄)", "la ramifie", "la transforme en cycle"], "Document 2.", "Exact.") },
      { consigne: "Le motif du PVC, obtenu à partir du chlorure de vinyle CH₂=CHCl, est…", court: "Répondez dans le carnet.", question: choix(["–(CH₂–CHCl)–", "–(CH₂=CHCl)–", "–(CH–Cl)–"], "La liaison double s'ouvre ; A = Cl.", "Exact : PVC = –(CH₂–CHCl)n–.") },
      { consigne: "Le polypropylène –(CH₂–CH(CH₃))n– est obtenu à partir du monomère…", court: "Répondez dans le carnet.", question: choix(["propène CH₂=CH–CH₃", "propane CH₃–CH₂–CH₃", "éthène CH₂=CH₂"], "Le monomère est un alcène CH₂=CHA, avec A = CH₃.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_chim6_a2_modeles", titre: "Laboratoire : isomères, noms et polymères", paillasses: [poste_modeles, L.poste_petrochimie], missions: [ISOMERES, ZE, POLYMERES] });
})(window.Labo);

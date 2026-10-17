/*
Rôle : simulation de l'activité 1 du chapitre « Géométrie de quelques molécules » (tronc commun) : règles du duet et de
       l'octet et ions monoatomiques stables (tableau de l'atome) ; représentation de Lewis de molécules (tableau de Lewis) ;
       formules développées, semi-développées et brutes, isomères. Objectifs O1, O2, O3.
Reçoit : rien (les vérifications lisent les faits des paillasses).
Produit : la simulation démarrée : ions ; Lewis ; formules.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const { ion, molecule, isomere } = L.VERIF_LEWIS, I = L.indice;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const GESTE_ATOME = "Touchez une réserve de protons ou de neutrons pour en ajouter un au noyau ; touchez une couche pour y poser un électron ; glissez un électron hors de l'atome pour le retirer.";
  const GESTE_LEWIS = "Touchez un aimant de la réserve, puis un point du quadrillage. Touchez entre deux atomes pour une liaison (simple, double, triple), à côté d'un atome pour un doublet non liant.";
  const batir = (brute, texte, avec = true) => ({ consigne: texte, court: `Construisez ${I(brute)}.`, aide_geste: GESTE_LEWIS, verifier: molecule(brute, avec) });

  const IONS = {
    id: "ions", paillasse: 0, titre: "Les ions monoatomiques stables",
    objectif: "Comprendre, avec les règles du duet et de l'octet, pourquoi un atome donne un ion de charge bien précise.",
    entetes: [],
    conclusion: "Les gaz nobles ont une couche externe pleine (2 électrons pour He, 8 pour Ne et Ar) : ils restent isolés. Les autres atomes gagnent ou perdent des électrons pour avoir la même structure que le gaz noble le plus proche : 2 électrons externes (règle du duet) ou 8 (règle de l'octet). Na → Na⁺, Mg → Mg²⁺, Cl → Cl⁻, O → O²⁻.",
    conclusion_courte: "Duet, octet : Na⁺, Mg²⁺, Cl⁻, O²⁻.",
    etapes: [
      { consigne: "Lisez l'affiche des gaz nobles. Ces atomes restent isolés, parce que…", court: "Répondez dans le carnet.", question: choix(["leur couche externe est pleine : 2 électrons (He) ou 8 (Ne, Ar)", "ils n'ont pas d'électrons", "leur noyau est très lourd"], "Regardez la dernière couche de chacun.", "Exact : les autres atomes ne sont pas isolés ; ils s'associent ou forment des ions.") },
      { consigne: "Construisez l'atome de sodium ²³₁₁Na (couches remplies dans l'ordre K, L, M).", court: "Construisez ²³₁₁Na.", aide_geste: GESTE_ATOME, verifier: ion(11, 23, 11) },
      { consigne: "Le sodium perd l'électron de sa couche externe : retirez-le.", court: "Retirez l'électron externe.", verifier: ion(11, 23, 10) },
      { consigne: "L'ion Na⁺ a la structure (K)²(L)⁸. Il est stable, car…", court: "Répondez dans le carnet.", question: choix(["sa couche externe a 8 électrons, comme le néon (règle de l'octet)", "il a autant d'électrons que de protons", "il n'a plus de couche M, donc plus d'électrons"], "Comparez avec l'affiche des gaz nobles.", "Exact.") },
      { consigne: "Touchez « Tout ranger ». Construisez l'atome de chlore ³⁵₁₇Cl, puis ajoutez l'électron qu'il gagne.", court: "Formez l'ion chlorure.", aide_geste: GESTE_ATOME, verifier: ion(17, 35, 18) },
      { consigne: "L'ion obtenu a 17 protons et 18 électrons, (K)²(L)⁸(M)⁸. On le note…", court: "Répondez dans le carnet.", question: choix(["Cl⁻ : il a la structure de l'argon", "Cl⁺", "Ar"], "Une charge négative en trop.", "Exact : c'est l'ion chlorure.") },
      { consigne: "Le magnésium (Z = 12) a la structure (K)²(L)⁸(M)². Il donne l'ion…", court: "Répondez dans le carnet.", question: choix(["Mg²⁺ (il perd ses 2 électrons externes)", "Mg⁶⁻ (il gagne 6 électrons)", "Mg⁺"], "Il est plus simple de perdre 2 électrons que d'en gagner 6.", "Exact.") },
      { consigne: "L'oxygène (Z = 8) a la structure (K)²(L)⁶. Il donne l'ion…", court: "Répondez dans le carnet.", question: choix(["O²⁻ (il gagne 2 électrons : structure du néon)", "O⁶⁺", "O²⁺"], "Combien d'électrons lui manque-t-il pour avoir 8 électrons externes ?", "Exact.") },
    ],
  };

  const LEWIS = {
    id: "lewis", paillasse: 1, titre: "La représentation de Lewis",
    objectif: "Représenter des molécules avec leurs doublets liants et non liants, en respectant les règles du duet et de l'octet.",
    entetes: [],
    conclusion: "Dans une molécule, les atomes mettent en commun des électrons : un doublet liant est une liaison covalente. Chaque atome est entouré de 2 électrons (H) ou de 8 électrons (C, N, O, Cl), en comptant les doublets liants et non liants. H forme 1 liaison, C 4, N 3, O 2, Cl 1. Il existe des liaisons doubles (O=C=O) et triples (N≡N). Le modèle de Lewis a des limites : il n'explique pas certaines molécules, comme NO₂.",
    conclusion_courte: "Duet pour H, octet pour C, N, O, Cl.",
    etapes: [
      batir("H2O", "Représentez la molécule d'eau H₂O : atomes, doublets liants, doublets non liants."),
      { consigne: "Dans H₂O, l'atome d'oxygène a…", court: "Répondez dans le carnet.", question: choix(["2 doublets liants et 2 doublets non liants", "2 doublets liants seulement", "4 doublets liants"], "Comptez les traits autour de O.", "Exact : 4 doublets, soit 8 électrons (octet).") },
      batir("NH3", "Représentez l'ammoniac NH₃."),
      batir("CH4", "Représentez le méthane CH₄."),
      batir("CO2", "Représentez le dioxyde de carbone CO₂ (le carbone est au milieu)."),
      batir("N2", "Représentez le diazote N₂."),
      { consigne: "Dans N₂, les deux atomes d'azote sont unis par…", court: "Répondez dans le carnet.", question: choix(["une liaison triple (3 doublets liants)", "une liaison simple", "une liaison double"], "N forme 3 liaisons.", "Exact : N≡N, avec un doublet non liant sur chaque atome.") },
      batir("C2H4", "Représentez l'éthylène C₂H₄."),
      { consigne: "NO₂ a 5 + 6 + 6 = 17 électrons externes, un nombre impair. On en conclut que…", court: "Répondez dans le carnet.", question: choix(["on ne peut pas respecter l'octet pour tous ses atomes : le modèle de Lewis a des limites", "NO₂ n'existe pas", "l'azote forme 5 liaisons"], "Avec des doublets, le nombre d'électrons est toujours pair.", "Exact.") },
    ],
  };

  const FORMULES = {
    id: "formules", paillasse: 1, titre: "Formules développées, semi-développées, brutes",
    objectif: "Construire des molécules de même formule brute mais de formules développées différentes (isomères).",
    entetes: [],
    conclusion: "La formule brute (C₂H₆O) donne les atomes ; la formule développée montre toutes les liaisons ; la formule semi-développée n'écrit pas les liaisons avec H (CH₃–CH₂–OH). Des molécules de même formule brute mais de formules développées différentes sont des isomères : éthanol et méthoxyméthane (C₂H₆O), butane et méthylpropane (C₄H₁₀), éthylamine et diméthylamine (C₂H₇N).",
    conclusion_courte: "Même formule brute, formules développées différentes : isomères.",
    etapes: [
      { ...batir("C2H6O", "Touchez « Tout ranger ». Construisez une molécule de formule brute C₂H₆O (formule développée : les doublets non liants ne sont pas obligatoires).", false), verifier: isomere("C2H6O", "a") },
      { ...batir("C2H6O", "Construisez une autre molécule de formule brute C₂H₆O, avec des liaisons différentes.", false), court: "Une autre molécule C₂H₆O.", verifier: isomere("C2H6O", "a") },
      { consigne: "Ces deux molécules ont la même formule brute, mais des formules développées différentes. Ce sont…", court: "Répondez dans le carnet.", question: choix(["des isomères", "la même molécule", "des ions"], "Comparez leurs liaisons.", "Exact : l'éthanol et le méthoxyméthane.") },
      { consigne: "La formule semi-développée de l'éthanol (qui contient le groupe O–H) est…", court: "Répondez dans le carnet.", question: choix(["CH₃–CH₂–OH", "CH₃–O–CH₃", "C₂H₆O"], "Dans l'éthanol, l'oxygène est lié à un carbone et à un hydrogène.", "Exact. CH₃–O–CH₃ est le méthoxyméthane.") },
      { ...batir("C4H10", "Construisez une molécule de formule brute C₄H₁₀.", false), verifier: isomere("C4H10", "b") },
      { consigne: "Les deux isomères de C₄H₁₀ ont pour formules semi-développées…", court: "Répondez dans le carnet.", question: choix(["CH₃–CH₂–CH₂–CH₃ et CH₃–CH(CH₃)–CH₃", "CH₃–CH₂–CH₂–CH₃ et CH₃–CH₂–CH₂–CH₃", "C₄H₁₀ et C₂H₅"], "Une chaîne droite, ou une chaîne avec une ramification.", "Exact : le butane et le méthylpropane.") },
      { consigne: "Les deux isomères de C₂H₇N sont…", court: "Répondez dans le carnet.", question: choix(["CH₃–CH₂–NH₂ et CH₃–NH–CH₃", "CH₃–CH₂–NH₂ et CH₃–CH₃–NH", "NH₃ et C₂H₄"], "L'azote forme 3 liaisons, le carbone 4.", "Exact : l'éthylamine et la diméthylamine.") },
    ],
  };

  L.demarrer({ id: "tc_chim5_a1_lewis", titre: "Laboratoire : ions et représentation de Lewis", paillasses: [L.poste_ions, L.poste_lewis], missions: [IONS, LEWIS, FORMULES] });
})(window.Labo);

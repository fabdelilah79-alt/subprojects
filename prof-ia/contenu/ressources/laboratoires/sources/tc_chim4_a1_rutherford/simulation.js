/*
Rôle : simulation de l'activité 1 du chapitre « Modèle de l'atome » (tronc commun) : recherche historique et expérience de
       Rutherford. Les documents présentent les premiers modèles ; l'expérience (reconstituée avec le matériel d'un
       laboratoire d'enseignement) montre la structure lacunaire de l'atome et l'existence du noyau ; on termine par les
       ordres de grandeur et le classement des découvertes. Objectifs O1, O2, O3.
Reçoit : rien (les vérifications lisent les faits des paillasses).
Produit : la simulation démarrée : histoire ; expérience ; modèle de l'atome.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const lus = (faits, n) => n.every((k) => (faits.docs_atome || []).includes(k));

  function tri({ faits }) {
    // Les six étiquettes sont rangées, chacune dans la colonne de son époque.
    const t = faits.tri_atome || {};
    if (Object.keys(t).length < L.TRI_ATOME.length) return false;
    return L.TRI_ATOME.every((e) => t[e.id] === e.colonne) || "Une étiquette n'est pas dans la bonne colonne : relisez les dates dans les documents.";
  }

  const HISTOIRE = {
    id: "histoire", paillasse: 0, titre: "Les premiers modèles de l'atome",
    objectif: "Lire des documents historiques et en extraire les idées principales.",
    entetes: [],
    conclusion: "Pour Dalton (1808), l'atome est une sphère pleine et indivisible. La découverte de l'électron (Thomson, 1897) montre que l'atome a des constituants : Thomson imagine une sphère positive où sont dispersés les électrons.",
    conclusion_courte: "Dalton, puis Thomson : l'atome contient des électrons.",
    etapes: [
      { consigne: "Touchez les documents 1 (Démocrite et Dalton) et 2 (Thomson) pour les lire.", court: "Lisez les documents 1 et 2.", verifier: ({ faits }) => lus(faits, [1, 2]) || false },
      { consigne: "La découverte de l'électron montre que l'atome n'est pas indivisible, car…", court: "Répondez dans le carnet.", question: choix(["l'électron est une particule beaucoup plus petite, présente dans tous les atomes", "l'électron est un atome", "l'électron est chargé positivement"], "Relisez le document 2.", "Exact : l'atome a des constituants.") },
      { consigne: "Dans le modèle de Thomson, la charge positive de la sphère…", court: "Répondez dans le carnet.", question: choix(["compense la charge négative des électrons : l'atome est neutre", "s'ajoute à celle des électrons", "n'existe pas"], "La matière est électriquement neutre.", "Exact.") },
      { consigne: "Prévision : si le modèle de Thomson est juste, des particules alpha (positives, rapides) envoyées sur une feuille d'or très mince…", court: "Faites une prévision.", question: choix(["la traversent presque toutes, avec de très petites déviations", "rebondissent toutes", "sont toutes arrêtées"], "Dans ce modèle, la charge positive est étalée : elle ne repousse que faiblement.", "C'est ce que prévoit le modèle de Thomson. Vérifions-le : passez à la paillasse de l'expérience.") },
    ],
  };

  const MODELE = {
    id: "modele", paillasse: 0, titre: "Le modèle de l'atome",
    objectif: "Décrire les constituants de l'atome et les ordres de grandeur de ses dimensions, puis ranger les découvertes.",
    entetes: [],
    conclusion: "L'atome est formé d'un noyau (protons de charge +e et neutrons sans charge, les nucléons) et d'électrons de charge −e. Il a autant d'électrons que de protons : il est électriquement neutre. Son diamètre (10⁻¹⁰ m) est 100 000 fois celui du noyau (10⁻¹⁵ m) : l'atome est presque vide, et sa masse est concentrée dans le noyau.",
    conclusion_courte: "Noyau (protons, neutrons) + électrons ; neutre ; lacunaire.",
    etapes: [
      { consigne: "Lisez les documents 3 (Rutherford), 4 (Bohr) et 5 (Chadwick).", court: "Lisez les documents 3, 4 et 5.", verifier: ({ faits }) => lus(faits, [3, 4, 5]) || false },
      { consigne: "Combien de fois le diamètre d'un atome (10⁻¹⁰ m) est-il plus grand que celui de son noyau (10⁻¹⁵ m) ?", court: "Rapport des diamètres ?", question: { type: "nombre", unite: "fois", attendu: 1e5, tolerance: 1, aide: "Calculez 10⁻¹⁰ / 10⁻¹⁵ = 10^(−10 + 15).", bravo: "Exact : 10⁵ = 100 000 fois." } },
      { consigne: "Maquette : si le noyau était une bille de 1 mm de diamètre, quel serait le diamètre de l'atome, en mètres ?", court: "Diamètre de l'atome-maquette (m) ?", question: { type: "nombre", unite: "m", attendu: 100, tolerance: 0.5, aide: "Multipliez 1 mm par 100 000, puis convertissez en mètres.", bravo: "Exact : 100 m, la taille d'un stade. Entre la bille et les tribunes : du vide." } },
      { consigne: "Rangez les six découvertes par époque sur le tableau blanc.", court: "Rangez les étiquettes.", aide_geste: "Faites glisser chaque étiquette dans sa colonne.", verifier: tri },
      { consigne: "Les constituants de l'atome sont…", court: "Répondez dans le carnet.", question: choix(["un noyau (protons positifs, neutrons sans charge) et des électrons négatifs autour", "des protons et des électrons dans le noyau, des neutrons autour", "des neutrons négatifs autour d'un noyau de protons"], "Relisez les documents 4 et 5.", "Exact.") },
      { consigne: "Un atome est électriquement neutre parce que…", court: "Répondez dans le carnet.", question: choix(["il a autant d'électrons (−e) que de protons (+e)", "ses neutrons annulent les charges", "il ne contient aucune charge"], "Comparez les charges du proton et de l'électron.", "Exact.") },
      { consigne: "La masse de l'atome est presque toute dans le noyau, car…", court: "Répondez dans le carnet.", question: choix(["un nucléon est environ 1 800 fois plus lourd qu'un électron", "le noyau est plus grand que l'atome", "les électrons n'ont pas de masse"], "Comparez les masses données dans le document 5.", "Exact : les électrons ont une masse, mais très petite.") },
    ],
  };

  L.demarrer({ id: "tc_chim4_a1_rutherford", titre: "Laboratoire : l'expérience de Rutherford", paillasses: [L.poste_histoire, L.poste_rutherford], missions: [HISTOIRE, L.MISSION_RUTHERFORD, MODELE] });
})(window.Labo);

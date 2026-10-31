/*
Rôle : simulation de l'activité 3 du chapitre « Espèces chimiques » (tronc commun) : inventaire des espèces trouvées,
       classement selon l'origine (naturelle, synthétique identique à une espèce naturelle, synthétique artificielle)
       à partir des étiquettes, documents sur l'industrie chimique. Objectif O1 ; on évite de confondre « synthétique »
       et « artificiel ».
Reçoit : rien (les vérifications lisent les classements et les lectures notés par les paillasses).
Produit : la simulation démarrée : inventaire ; origine des espèces ; industrie chimique.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const { inventaire, origine } = L.ETIQUETTES_A3;

  const INVENTAIRE = {
    id: "inventaire", paillasse: 0, titre: "Inventaire des espèces",
    objectif: "Rassembler les espèces chimiques mises en évidence par nos sens et par les tests.",
    entetes: [],
    conclusion: "L'orange contient de l'eau, du glucose, une espèce acide et une huile odorante ; le papier contient de la cellulose et de l'amidon. Chaque espèce a été mise en évidence par un test (comparé à un témoin) ou une observation. Les espèces de l'orange sont naturelles : elles sont fabriquées par l'oranger.",
    conclusion_courte: "Un inventaire : espèce, et comment on l'a trouvée.",
    etapes: [
      { consigne: "Classez chaque étiquette selon le produit où l'espèce a été trouvée (glissez-la dans une colonne).", court: "Classez les étiquettes.", verifier: ({ faits }) => L.tableau_tri.verifier(inventaire, faits.tri_inventaire) },
      { consigne: "L'eau, le glucose et l'huile odorante de l'orange sont des espèces…", court: "Répondez dans le carnet.", question: choix(["naturelles : elles sont fabriquées par l'oranger", "synthétiques", "artificielles"], "Qui les a fabriquées ?", "Exact.") },
      { consigne: "Un test de détection, comparé à un témoin, permet…", court: "Répondez dans le carnet.", question: choix(["d'affirmer qu'une espèce est présente", "de connaître la masse de cette espèce", "de savoir que le produit est pur"], "Que montre un test positif ?", "Exact.") },
    ],
  };

  const ORIGINE = {
    id: "origine", paillasse: 1, titre: "Naturelle, synthétique ou artificielle ?",
    objectif: "D'où viennent les espèces chimiques de ces produits ?",
    entetes: [],
    conclusion: "Une espèce naturelle est extraite d'un produit de la nature. Une espèce synthétique est fabriquée par l'homme grâce à des transformations chimiques : elle peut être identique à une espèce naturelle (vanilline du sucre vanilliné, acide ascorbique des comprimés) ou n'exister nulle part dans la nature, on dit alors qu'elle est artificielle (nylon, acide acétylsalicylique). Synthétique ne veut donc pas dire artificiel.",
    conclusion_courte: "Synthétique ≠ artificiel.",
    etapes: [
      { consigne: "Touchez chaque produit pour lire son étiquette (les six produits).", court: "Lisez les 6 étiquettes.", verifier: ({ faits }) => (faits.etiquettes_lues || []).length >= 6 || false },
      { consigne: "Classez chaque espèce dans le tableau selon son origine.", court: "Classez les espèces.", verifier: ({ faits }) => L.tableau_tri.verifier(origine, faits.tri_origine) },
      { consigne: "La vanilline du sucre vanilliné est…", court: "Répondez dans le carnet.", question: choix(["synthétique, mais c'est la même espèce chimique que la vanilline de la gousse (même formule C₈H₈O₃)", "artificielle : elle n'existe pas dans la nature", "naturelle : elle vient de la gousse"], "Comparez les deux étiquettes.", "Exact.") },
      { consigne: "Une espèce artificielle est…", court: "Répondez dans le carnet.", question: choix(["une espèce synthétique qui n'existe pas dans la nature (nylon, aspirine)", "n'importe quelle espèce synthétique", "une espèce de moins bonne qualité qu'une espèce naturelle"], "Le nylon existe-t-il dans la nature ?", "Exact.") },
      { consigne: "L'acide ascorbique du citron et celui du comprimé…", court: "Répondez dans le carnet.", question: choix(["sont la même espèce chimique, l'une naturelle, l'autre synthétique", "sont deux espèces différentes", "sont tous les deux artificiels"], "Comparez les formules.", "Exact : une espèce est la même, quelle que soit son origine.") },
    ],
  };

  const DOCUMENTS = {
    id: "documents", paillasse: 2, titre: "L'industrie chimique",
    objectif: "Que fabrique l'industrie chimique, et pourquoi ?",
    entetes: [],
    conclusion: "L'industrie chimique transforme des matières premières naturelles (phosphates, pétrole, bois) : elle fabrique en grande quantité des espèces qui existent dans la nature (vanilline, vitamine C) et des espèces nouvelles (engrais, matières plastiques, médicaments). Au Maroc, l'industrie des phosphates en est un exemple majeur.",
    conclusion_courte: "Des matières premières aux produits utiles.",
    etapes: [
      { consigne: "Touchez chaque document pour le lire en grand (touchez-le de nouveau pour le refermer).", court: "Lisez les deux documents.", verifier: ({ faits }) => (faits.documents_lus || []).length >= 2 || false },
      { consigne: "D'après le document 1, le Maroc possède…", court: "Répondez dans le carnet.", question: choix(["environ 70 % des réserves mondiales de phosphates", "très peu de phosphates", "la moitié du pétrole mondial"], "Relisez le début du document 1.", "Exact.") },
      { consigne: "Les engrais phosphatés sont…", court: "Répondez dans le carnet.", question: choix(["fabriqués par l'industrie chimique à partir d'une roche naturelle, le phosphate", "extraits directement des plantes", "des roches naturelles que l'on broie seulement"], "Suivez la chaîne du document 1.", "Exact.") },
      { consigne: "On fabrique la vanilline par synthèse parce que…", court: "Répondez dans le carnet.", question: choix(["les gousses en fournissent moins de 1 % des besoins", "la vanilline de synthèse est une autre espèce", "la vanilline naturelle est dangereuse"], "Relisez le document 2.", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_chim1_a3_classement", titre: "Laboratoire : origine des espèces chimiques", paillasses: [L.poste_inventaire, L.poste_origine, L.poste_documents], missions: [INVENTAIRE, ORIGINE, DOCUMENTS] });
})(window.Labo);

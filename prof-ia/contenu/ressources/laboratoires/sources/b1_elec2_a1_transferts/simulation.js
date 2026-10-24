/*
Rôle : simulation de l'activité 1 du chapitre « Transfert d'énergie dans un circuit électrique » (1re année du bac) :
       une lampe, un moteur et un électrolyseur reçoivent de l'énergie électrique du générateur et la transforment
       (rayonnement, travail mécanique, énergie chimique, et toujours un peu de chaleur) ; classement d'appareils de la vie
       courante. Objectif O1.
Reçoit : rien (les vérifications lisent les faits « recepteurs » et « tri_energies »).
Produit : la simulation démarrée : récepteurs ; tableau magnétique.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const vu = (f, k) => !!(f.recepteurs || {})[k];
  const BRANCHER = "Tirez un fil d'une borne à une autre ; fermez l'interrupteur d'un toucher.";

  const RECEPTEURS = {
    id: "recepteurs", paillasse: 0, titre: "Que devient l'énergie électrique ?",
    objectif: "Brancher tour à tour une lampe, un moteur et un électrolyseur sur le générateur ; décrire les transferts d'énergie.",
    entetes: [],
    conclusion: "Un récepteur reçoit de l'énergie électrique du générateur et la transforme : la lampe en rayonnement (et en chaleur), le moteur en travail mécanique (et en chaleur), l'électrolyseur en énergie chimique (et en chaleur). L'énergie se conserve : l'énergie électrique reçue est égale à la somme des énergies fournies par le récepteur à l'extérieur (W_reçue = W_utile + Q).",
    conclusion_courte: "W_électrique reçue = W_utile + chaleur.",
    etapes: [
      { consigne: "Réalisez un circuit série : générateur, interrupteur, lampe. Fermez l'interrupteur.", court: "Circuit avec la lampe.", aide_geste: BRANCHER, verifier: ({ faits }) => vu(faits, "lampe") },
      { consigne: "La lampe reçoit de l'énergie électrique et la transfère au milieu extérieur surtout sous forme…", court: "Répondez dans le carnet.", question: choix(["de rayonnement (lumière) et de chaleur", "de travail mécanique", "d'énergie chimique"], "Elle éclaire et elle chauffe.", "Exact.") },
      { consigne: "Remplacez la lampe par le moteur : il fait monter la masse de 200 g.", court: "Circuit avec le moteur.", verifier: ({ faits }) => vu(faits, "moteur") },
      { consigne: "Le moteur transforme l'énergie électrique reçue en…", court: "Répondez dans le carnet.", question: choix(["travail mécanique (la masse monte) et un peu de chaleur", "rayonnement", "énergie chimique"], "La masse gagne de l'énergie potentielle de pesanteur.", "Exact.") },
      { consigne: "Remplacez le moteur par l'électrolyseur : des bulles de gaz apparaissent sur les électrodes.", court: "Circuit avec l'électrolyseur.", verifier: ({ faits }) => vu(faits, "electrolyseur") },
      { consigne: "L'électrolyseur transforme l'énergie électrique en…", court: "Répondez dans le carnet.", question: choix(["énergie chimique (une réaction a lieu) et un peu de chaleur", "travail mécanique", "rayonnement"], "Une transformation chimique produit du dihydrogène et du dioxygène.", "Exact.") },
      { consigne: "Pour chaque récepteur, l'énergie électrique reçue est…", court: "Répondez dans le carnet.", question: choix(["égale à la somme de l'énergie utile et de la chaleur cédée : l'énergie se conserve", "plus petite que l'énergie utile", "perdue en totalité"], "Rien ne se crée, rien ne se perd.", "Exact.") },
    ],
  };

  const ENERGIES = {
    id: "energies", paillasse: 1, titre: "Appareils de la vie courante",
    objectif: "Classer des appareils selon la forme principale de l'énergie utile qu'ils fournissent.",
    entetes: [],
    conclusion: "Tous les récepteurs électriques reçoivent de l'énergie électrique ; ils se distinguent par la forme de l'énergie utile qu'ils fournissent : rayonnement (lampes), chaleur (radiateurs, fers à repasser : effet Joule), travail mécanique (moteurs), énergie chimique (électrolyseurs, batteries en charge). Une partie de l'énergie reçue est toujours transférée sous forme de chaleur.",
    conclusion_courte: "Rayonnement, chaleur, travail mécanique, énergie chimique.",
    etapes: [
      { consigne: "Classez les huit appareils selon la forme principale de l'énergie utile.", court: "Classez les étiquettes.", verifier: ({ faits }) => L.tableau_tri.verifier(L.APPAREILS_ENERGIE, faits.tri_energies) },
      { consigne: "Dans tous ces appareils, une partie de l'énergie reçue est aussi transférée sous forme…", court: "Répondez dans le carnet.", question: choix(["de chaleur (effet Joule)", "de lumière", "d'énergie chimique"], "Tous les appareils tiédissent quand ils fonctionnent.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_elec2_a1_transferts", titre: "Laboratoire : transferts d'énergie", decor: "aucun", paillasses: [L.poste_recepteurs, L.poste_tri_energies], missions: [RECEPTEURS, ENERGIES] });
})(window.Labo);

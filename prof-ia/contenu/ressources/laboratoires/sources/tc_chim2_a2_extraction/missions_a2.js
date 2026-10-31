/*
Rôle : missions « hydrodistillation » (objectifs O1, O2, O3) et « extraction par un solvant » (objectifs O1, O2, O3) de
       l'activité 2 du chapitre « Extraction, séparation et identification ».
Reçoit : rien (les vérifications lisent les faits des paillasses).
Produit : Labo.MISSIONS_A2 = { hydro, solvant, choix }.
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const H = (faits) => faits.hydro || {}, A = (faits) => faits.ampoule || {};

  function eau_branchee({ faits }) {
    // L'arrivée d'eau doit être sur l'embout du bas, et le robinet ouvert.
    const h = H(faits);
    if (h.tuyau === "haut") return "L'eau doit entrer par le bas du réfrigérant, pour qu'il soit plein d'eau froide : tirez le tuyau et branchez-le sur l'autre embout.";
    return (h.tuyau === "bas" && h.eau) || false;
  }

  function solvant_verse({ faits }) {
    // Eau iodée et cyclohexane dans l'ampoule (l'éthanol donne une seule phase : il faut recommencer).
    const a = A(faits);
    if (a.miscible) return "L'éthanol se mélange à l'eau : une seule phase ! Videz l'ampoule dans le bidon de récupération et recommencez avec le cyclohexane.";
    return (a.aq >= 15 && a.org >= 8 && a.solvant === "cyclohexane") || false;
  }

  function vidange({ faits }) {
    // Toute la phase aqueuse dans le bécher, robinet refermé avant la phase violette.
    const a = A(faits);
    if (a.recu_org > 1.5) return "Trop loin : de la phase violette est passée dans le bécher. Videz l'ampoule dans le bidon et recommencez.";
    return (a.aq < 1 && a.recu_aq >= 14 && !a.robinet && a.org >= 8) || false;
  }

  const HYDRO = {
    id: "hydro", paillasse: 0, titre: "L'hydrodistillation de la lavande",
    objectif: "Extraire l'huile essentielle des fleurs de lavande en les faisant bouillir dans l'eau.",
    entetes: [],
    conclusion: "Hydrodistillation : les fleurs bouillent dans l'eau ; la vapeur entraîne l'huile essentielle, se condense dans le réfrigérant (l'eau froide y entre par le bas) et le distillat est recueilli. L'huile essentielle, moins dense que l'eau et non miscible, forme une fine couche au-dessus. La pierre ponce régularise l'ébullition.",
    conclusion_courte: "Distillat : huile essentielle au-dessus de l'eau.",
    etapes: [
      { consigne: "Touchez chaque élément du montage pour lire son nom.", court: "Touchez chaque élément.", verifier: ({ faits }) => (H(faits).noms || []).length >= 5 || false },
      { consigne: "Ajoutez quelques grains de pierre ponce dans le ballon (glissez-les du flacon jusqu'au col du ballon).", court: "Pierre ponce dans le ballon.", verifier: ({ faits }) => H(faits).ponce || false },
      { consigne: "Branchez le tuyau d'arrivée d'eau sur un embout du réfrigérant, puis ouvrez le robinet.", court: "Eau dans le réfrigérant.", verifier: eau_branchee, aide_geste: "Le bouton du robinet est à droite de celui-ci." },
      { consigne: "Allumez le chauffe-ballon (touche I/O) et observez jusqu'à recueillir 30 mL de distillat.", court: "Chauffez, recueillez 30 mL.", verifier: ({ faits }) => H(faits).volume >= 30 || false },
      { consigne: "Le réfrigérant sert à…", court: "Répondez dans le carnet.", question: choix(["refroidir les vapeurs pour qu'elles redeviennent liquides", "chauffer le distillat", "filtrer les fleurs"], "Que se passe-t-il dans le tube intérieur ?", "Exact.") },
      { consigne: "Dans l'éprouvette, l'huile essentielle de lavande (densité 0,88, non miscible à l'eau) se trouve…", court: "Répondez dans le carnet.", question: choix(["au-dessus de l'eau, en couche fine", "au fond, sous l'eau", "mélangée à l'eau"], "Comparez sa densité à celle de l'eau (1,00).", "Exact.") },
      { consigne: "Pourquoi l'eau du réfrigérant entre-t-elle par le bas ?", court: "Répondez dans le carnet.", question: choix(["pour que le réfrigérant soit entièrement rempli d'eau froide", "pour que l'eau coule plus vite", "cela n'a aucune importance"], "Essayez en branchant le tuyau en haut.", "Exact.") },
    ],
  };

  const SOLVANT = {
    id: "solvant", paillasse: 1, titre: "Extraire le diiode avec un solvant",
    objectif: "Le diiode colore l'eau iodée. Comment le faire passer dans un autre liquide, puis séparer les deux liquides ?",
    entetes: [],
    conclusion: "Le solvant d'extraction ne doit pas se mélanger à l'eau et doit bien dissoudre l'espèce à extraire ; on préfère le moins dangereux : le cyclohexane. Il est moins dense que l'eau (0,78) : il forme la phase supérieure, violette, qui contient le diiode. Dans l'ampoule à décanter : robinet fermé, on verse, on bouche, on agite, on dégaze, on laisse décanter, on ôte le bouchon et on recueille la phase inférieure.",
    conclusion_courte: "Solvant non miscible ; phase supérieure : la moins dense.",
    etapes: [
      { consigne: "D'après le tableau, à 20 °C, le cyclohexane (fusion 6,5 °C, ébullition 81 °C) est…", court: "Répondez dans le carnet.", question: choix(["liquide", "solide", "gazeux"], "20 °C est entre 6,5 °C et 81 °C.", "Exact.") },
      { consigne: "Pour extraire le diiode de l'eau, on choisit…", court: "Répondez dans le carnet.", question: choix(["le cyclohexane : non miscible à l'eau, le diiode y est très soluble, et il est moins dangereux que le dichlorométhane", "l'éthanol", "le dichlorométhane"], "Lisez les colonnes « miscible » et « dangers ».", "Exact.") },
      { consigne: "Fermez le robinet de l'ampoule (touchez-le), puis versez toute l'eau iodée et tout le cyclohexane.", court: "Robinet fermé ; eau iodée, cyclohexane.", verifier: solvant_verse, aide_geste: "Portez le bécher au-dessus de l'ampoule, puis tournez la poignée pour l'incliner." },
      { consigne: "Prévoyez : la phase supérieure sera…", court: "Répondez dans le carnet.", question: choix(["le cyclohexane, moins dense que l'eau (0,78 < 1)", "l'eau, plus lourde", "on ne peut pas prévoir"], "Comparez les densités.", "Exact.") },
      { consigne: "Bouchez l'ampoule (touchez le bouchon posé sur la paillasse), prenez-la et secouez-la vivement, reposez-la sur l'anneau, puis dégazez (touchez le robinet).", court: "Bouchez, agitez, dégazez.", verifier: ({ faits }) => (A(faits).agitee && A(faits).degaze) || false, aide_geste: "Pendant le dégazage, l'ampoule est retournée, robinet vers le haut, loin du visage." },
      { consigne: "Laissez l'ampoule sur l'anneau jusqu'à ce que les deux phases soient bien séparées.", court: "Laissez décanter.", verifier: ({ faits }) => (A(faits).decante && A(faits).I2_org > 0.8) || false },
      { consigne: "Après agitation, le diiode se trouve…", court: "Répondez dans le carnet.", question: choix(["dans la phase supérieure (cyclohexane), devenue violette ; la phase aqueuse s'est presque décolorée", "toujours dans l'eau", "il a disparu"], "Observez la couleur de chaque phase.", "Exact.") },
      { consigne: "Ôtez le bouchon (touchez le haut de l'ampoule), ouvrez le robinet et recueillez la phase aqueuse ; fermez le robinet juste avant la phase violette.", court: "Recueillez la phase aqueuse.", verifier: vidange, aide_geste: "Sans ôter le bouchon, le liquide ne coule pas." },
    ],
  };

  L.MISSIONS_A2 = { hydro: HYDRO, solvant: SOLVANT, choix };
})(window.Labo);

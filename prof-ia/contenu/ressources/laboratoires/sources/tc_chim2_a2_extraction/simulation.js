/*
Rôle : simulation de l'activité 2 du chapitre « Extraction, séparation et identification » (tronc commun) :
       hydrodistillation de la lavande, extraction du diiode par un solvant (ampoule à décanter, tableau de données),
       filtration sous vide, reconnaissance de la verrerie d'un chauffage à reflux. Objectifs O1, O2, O3 ;
       observation et manipulation, sans interprétation théorique.
Reçoit : rien (les vérifications lisent les faits des paillasses).
Produit : la simulation démarrée : hydrodistillation ; solvant ; filtration sous vide ; verrerie.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const { hydro, solvant, choix } = L.MISSIONS_A2;
  const B = (faits) => faits.buchner || {};

  const FILTRATION = {
    id: "filtration", paillasse: 2, titre: "La filtration sous vide",
    objectif: "Séparer rapidement les fleurs de l'eau qui reste dans le ballon.",
    entetes: [],
    conclusion: "Dans la filtration sous vide, la trompe à eau aspire l'air de la fiole : le liquide traverse le papier filtre du Büchner beaucoup plus vite. Pour arrêter, on débranche d'abord le tuyau, puis on ferme le robinet ; sinon l'eau de la trompe remonte dans la fiole.",
    conclusion_courte: "Débrancher le tuyau, puis fermer le robinet.",
    etapes: [
      { consigne: "Posez un papier filtre dans le Büchner, puis mouillez-le avec la pissette pour qu'il colle bien.", court: "Papier filtre posé et mouillé.", verifier: ({ faits }) => (B(faits).papier && B(faits).mouille) || false },
      { consigne: "Ouvrez le robinet de la trompe à eau : elle aspire l'air de la fiole à vide.", court: "Ouvrez le robinet.", verifier: ({ faits }) => (B(faits).vide && B(faits).branche) || false },
      { consigne: "Versez le mélange (fleurs et eau) dans le Büchner.", court: "Versez le mélange.", verifier: ({ faits }) => B(faits).filtrat >= 95 || false },
      { consigne: "Avec le vide, le liquide traverse le papier…", court: "Répondez dans le carnet.", question: choix(["beaucoup plus vite que dans un simple entonnoir", "plus lentement", "à la même vitesse"], "Combien de temps a duré la filtration ?", "Exact.") },
      { consigne: "Arrêtez : débranchez d'abord le tuyau de la fiole (touchez la tubulure), puis fermez le robinet.", court: "Tuyau débranché, robinet fermé.", verifier: ({ faits }) => { const b = B(faits); if (b.retour) return "Retour d'eau : l'eau de la trompe est montée dans la fiole. Il fallait débrancher le tuyau avant de fermer le robinet."; return (!b.vide && !b.branche) || false; } },
      { consigne: "Pourquoi débranche-t-on le tuyau avant de fermer le robinet ?", court: "Répondez dans le carnet.", question: choix(["pour que l'eau de la trompe ne remonte pas dans la fiole (retour d'eau)", "pour économiser l'eau", "pour sécher le papier"], "Que se passe-t-il dans la trompe quand l'eau s'arrête ?", "Exact.") },
    ],
  };

  const VERRERIE = {
    id: "verrerie", paillasse: 3, titre: "Le montage à reflux",
    objectif: "Reconnaître la verrerie d'un chauffage à reflux.",
    entetes: [],
    conclusion: "Chauffage à reflux : chauffe-ballon, ballon, réfrigérant à boules vertical (l'eau entre en bas, sort en haut). Les vapeurs se condensent et retombent dans le ballon : on peut chauffer longtemps sans perdre de matière. En hydrodistillation, au contraire, le distillat est recueilli hors du ballon.",
    conclusion_courte: "À reflux, les vapeurs retombent dans le ballon.",
    etapes: [
      { consigne: "Glissez chaque nom dans la colonne du numéro qui lui correspond.", court: "Nommez les éléments 1 à 5.", verifier: ({ faits }) => L.tableau_tri.verifier(L.ETIQUETTES_REFLUX, faits.tri_reflux) },
      { consigne: "Dans un chauffage à reflux, les vapeurs…", court: "Répondez dans le carnet.", question: choix(["se condensent dans le réfrigérant et retombent dans le ballon", "sortent par le haut du réfrigérant", "sont recueillies dans une éprouvette"], "Où va le liquide condensé ?", "Exact.") },
      { consigne: "Quelle différence avec l'hydrodistillation ?", court: "Répondez dans le carnet.", question: choix(["en hydrodistillation, le liquide condensé est recueilli hors du ballon ; à reflux, il retombe dans le ballon", "aucune", "à reflux, on ne chauffe pas"], "Comparez les deux montages.", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_chim2_a2_extraction", titre: "Laboratoire : extraire et séparer", paillasses: [L.poste_hydro, L.poste_solvant, L.poste_buchner, L.poste_reflux], missions: [hydro, solvant, FILTRATION, VERRERIE] });
})(window.Labo);

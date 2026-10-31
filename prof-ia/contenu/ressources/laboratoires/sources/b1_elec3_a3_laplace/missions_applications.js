/*
Rôle : missions des paillasses « courants parallèles, faisceau d'électrons », « haut-parleur et moteur », « induction ».
Reçoit : rien (les vérifications lisent les faits « courants », « faisceau », « hp », « moteur », « induction »).
Produit : Labo.MISSIONS_APPLICATIONS = [COURANTS, APPLICATIONS, INDUCTION].
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const v = (f, fait, k) => !!(f[fait] || {})[k];

  const COURANTS = {
    id: "courants", paillasse: 2, titre: "Deux courants, un faisceau d'électrons",
    objectif: "Observer l'interaction de deux courants parallèles et la déviation d'un faisceau d'électrons par un aimant.",
    entetes: [],
    conclusion: "Chaque conducteur est placé dans le champ créé par l'autre : deux courants parallèles de même sens s'attirent, de sens contraires se repoussent. Les électrons en mouvement forment un courant : le faisceau d'un tube est dévié par un aimant (force de Laplace), dans un sens qui dépend du pôle approché.",
    conclusion_courte: "Même sens : attraction ; sens contraires : répulsion.",
    etapes: [
      { consigne: "Fermez le circuit des deux rubans, avec des courants de même sens puis de sens contraires.", court: "Même sens, puis sens contraires.", aide_geste: "« Sens » change le sens du courant dans le ruban de droite.", verifier: ({ faits }) => v(faits, "courants", "attire") && v(faits, "courants", "repousse") },
      { consigne: "Deux courants parallèles…", court: "Répondez dans le carnet.", question: choix(["de même sens s'attirent, de sens contraires se repoussent : chacun subit la force de Laplace due au champ de l'autre", "s'attirent toujours", "n'agissent pas l'un sur l'autre"], "Regardez la forme des rubans.", "Exact.") },
      { consigne: "Approchez l'aimant du tube par l'avant, pôle nord vers le tube, puis pôle sud (« Retourner »).", court: "Pôle nord, puis pôle sud.", aide_geste: "Faites glisser l'aimant sous le tube, vers le fond de la paillasse.", verifier: ({ faits }) => v(faits, "faisceau", "haut") && v(faits, "faisceau", "bas") },
      { consigne: "Le faisceau d'électrons est dévié, parce que…", court: "Répondez dans le carnet.", question: choix(["les électrons en mouvement forment un courant : ils subissent une force due au champ de l'aimant, qui change de sens avec le pôle", "l'aimant attire la lumière", "le verre du tube est aimanté"], "Un courant dans un champ subit une force.", "Exact.") },
    ],
  };

  const APPLICATIONS = {
    id: "applications", paillasse: 3, titre: "Haut-parleur et moteur",
    objectif: "Comprendre le principe du haut-parleur électrodynamique et du moteur à courant continu.",
    entetes: [],
    conclusion: "Haut-parleur : la bobine mobile, placée dans le champ radial de l'aimant, subit une force de Laplace dirigée selon l'axe ; un courant alternatif la fait avancer et reculer avec la membrane, qui fait vibrer l'air (son). Moteur : les forces de Laplace sur les deux côtés du cadre forment un couple qui le fait tourner ; le collecteur inverse le courant à chaque demi-tour pour que le couple garde le même sens.",
    conclusion_courte: "Force de Laplace : membrane qui vibre ; cadre qui tourne.",
    etapes: [
      { consigne: "Mettez le GBF du haut-parleur en marche (fréquence très basse) et observez la membrane.", court: "GBF en marche.", verifier: ({ faits }) => v(faits, "hp", "vu") },
      { consigne: "La membrane avance puis recule, parce que…", court: "Répondez dans le carnet.", question: choix(["la force de Laplace sur la bobine change de sens avec le courant alternatif", "l'aimant vibre", "la membrane est attirée par le GBF"], "Regardez les symboles du courant dans la bobine.", "Exact : à 50 Hz ou plus, la membrane produit un son.") },
      { consigne: "Moteur : fermez le circuit.", court: "Fermez le circuit.", verifier: ({ faits }) => ((faits.moteur || {}).tours || 0) >= 2 },
      { consigne: "Le cadre tourne, parce que…", court: "Répondez dans le carnet.", question: choix(["les forces de Laplace sur ses deux côtés, de sens opposés, forment un couple", "l'aimant tourne", "le courant pousse le cadre vers le pôle nord"], "Regardez les deux flèches.", "Exact.") },
      { consigne: "Enlevez le collecteur (« Collecteur ») et observez le cadre.", court: "Sans collecteur.", verifier: ({ faits }) => v(faits, "moteur", "bloque") },
      { consigne: "Sans collecteur, le cadre s'arrête. Le rôle du collecteur est…", court: "Répondez dans le carnet.", question: choix(["d'inverser le courant dans le cadre à chaque demi-tour, pour que le couple garde le même sens", "d'augmenter le champ de l'aimant", "de freiner le moteur"], "Sans lui, le couple ramène le cadre perpendiculaire à B.", "Exact.") },
    ],
  };

  const INDUCTION = {
    id: "induction", paillasse: 4, titre: "Observer l'induction",
    objectif: "Observer le courant produit dans une bobine quand on y déplace un aimant.",
    entetes: [],
    conclusion: "Quand on déplace un aimant près d'une bobine, un courant induit apparaît dans la bobine fermée, seulement pendant le mouvement ; son sens change avec le sens du mouvement. De l'énergie mécanique est ainsi convertie en énergie électrique (alternateurs, dynamos) : c'est la conversion inverse de celle du moteur.",
    conclusion_courte: "Aimant en mouvement : courant induit.",
    etapes: [
      { consigne: "Faites entrer l'aimant dans la bobine, puis faites-le sortir, en observant le galvanomètre.", court: "Entrez, puis sortez l'aimant.", aide_geste: "Faites glisser l'aimant le long de l'axe de la bobine.", verifier: ({ faits }) => v(faits, "induction", "entre") && v(faits, "induction", "sort") },
      { consigne: "Laissez l'aimant immobile dans la bobine pendant quelques secondes.", court: "Aimant immobile.", verifier: ({ faits }) => v(faits, "induction", "immobile_zero") },
      { consigne: "Un courant traverse la bobine…", court: "Répondez dans le carnet.", question: choix(["seulement pendant que l'aimant bouge ; son sens dépend du sens du mouvement", "dès que l'aimant est dans la bobine, même immobile", "jamais"], "Comparez le galvanomètre pendant et après le mouvement.", "Exact : c'est l'induction électromagnétique.") },
      { consigne: "Dans cette expérience, l'énergie est convertie…", court: "Répondez dans le carnet.", question: choix(["d'énergie mécanique (mouvement de l'aimant) en énergie électrique", "d'énergie électrique en énergie mécanique", "d'énergie chimique en énergie électrique"], "C'est le principe de l'alternateur.", "Exact : c'est l'inverse du moteur.") },
    ],
  };

  L.MISSIONS_APPLICATIONS = [COURANTS, APPLICATIONS, INDUCTION];
})(window.Labo);

/*
Rôle : simulation de l'activité 1 du chapitre « Principe d'inertie » (tronc commun) : « Aimant approché d'une bille en
       mouvement, bille heurtant un obstacle, palets sur table à coussin d'air ». Objectif O2 (corps isolé, pseudo-isolé) ;
       orientation : dépasser la conception « une force est nécessaire pour entretenir un mouvement rectiligne uniforme ».
Reçoit : rien (les vérifications lisent les lancers de la bille et les glissades du palet).
Produit : la simulation démarrée : paillasse de la bille (aimant, cale), paillasse de la table à coussin d'air.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });

  function lancer(voulu) {
    // Vérifie le dernier lancer de la bille : objets posés, et effet attendu (droite, courbe, rebond).
    return ({ faits }) => {
      const l = faits.lancer_bille;
      if (!l) return false;
      if (voulu === "libre") return (!l.aimant && !l.cale) || "Pour ce premier essai, laissez l'aimant et la cale rangés à droite du plateau.";
      if (voulu === "aimant") {
        if (!l.aimant || l.cale) return "Posez seulement l'aimant sur le plateau (la cale reste rangée), puis relâchez la bille.";
        return l.deviation_mm > 10 || "La bille passe trop loin de l'aimant : rapprochez-le de son trajet (sans le poser dessus).";
      }
      if (!l.cale || l.aimant) return "Rangez l'aimant, posez la cale en travers du trajet, puis relâchez la bille.";
      return l.rebond || "La bille n'a pas touché la cale : placez-la sur la ligne pointillée de son trajet.";
    };
  }

  const glissade = (air) => ({ faits }) => {
    // Le dernier lancer du palet a-t-il été fait avec (ou sans) l'air ?
    const g = faits.glissade;
    if (!g) return false;
    return g.air === air || (air ? "Appuyez d'abord sur « Mettre l'air », puis relancez le palet." : "Coupez l'air pour ce premier essai, puis relancez le palet.");
  };

  const BILLE = {
    id: "bille", paillasse: 0, titre: "La bille, l'aimant et la cale",
    objectif: "Lâcher une bille d'acier et observer comment une action mécanique (à distance ou de contact) modifie son mouvement.",
    entetes: [],
    conclusion: "Une action mécanique modifie le mouvement : elle peut changer la direction et la valeur de la vitesse. Sans action (ou avec des actions qui se compensent), pas de changement.",
    conclusion_courte: "Une action modifie le mouvement.",
    etapes: [
      { consigne: "Touchez la bille en haut de la gouttière pour la lâcher. Rien n'est posé sur le plateau.", court: "Lâchez la bille, plateau vide.", verifier: lancer("libre"), aide_geste: "Touchez la bille arrêtée pour la remettre en haut." },
      { consigne: "Sur la photographie, la trajectoire de la bille est…", court: "Répondez dans le carnet.", question: choix(["une droite, et la bille ralentit un peu (les images se rapprochent)", "une courbe", "une droite, et la bille accélère"], "Regardez l'alignement et l'écart des images.", "Exact.") },
      { consigne: "Pourquoi la bille ralentit-elle un peu ?", court: "Répondez dans le carnet.", question: choix(["Le plateau et l'air frottent sur elle : ces actions la freinent", "La force qu'elle a reçue au départ s'épuise", "Son poids la tire vers l'arrière"], "Une bille ne « contient » pas de force.", "Exact : sans frottements, elle ne ralentirait pas.") },
      { consigne: "Posez l'aimant à côté du trajet de la bille (pas dessus), puis relâchez la bille.", court: "Aimant près du trajet : relâchez la bille.", verifier: lancer("aimant") },
      { consigne: "L'aimant agit sur la bille sans la toucher. Cette action à distance…", court: "Répondez dans le carnet.", question: choix(["modifie la direction du mouvement (et la vitesse)", "ne change rien au mouvement", "arrête toujours la bille"], "Comparez avec la première photographie.", "Exact.") },
      { consigne: "Rangez l'aimant. Posez la cale en bois en travers du trajet (touchez-la pour la tourner), puis relâchez la bille.", court: "Cale sur le trajet : relâchez la bille.", verifier: lancer("cale") },
      { consigne: "Au choc, la cale exerce sur la bille une action de contact. Elle…", court: "Répondez dans le carnet.", question: choix(["change la direction et la valeur de la vitesse", "ne change que la couleur des images", "ne modifie pas le mouvement"], "Regardez la photographie après le choc.", "Exact.") },
    ],
  };

  const PALET = {
    id: "palet", paillasse: 1, titre: "Le palet sur la table à coussin d'air",
    objectif: "Lancer le palet sans air, puis avec l'air qui le soulève : quelles actions s'exercent sur lui ?",
    entetes: [],
    conclusion: "Avec l'air, le poids du palet et l'action de l'air se compensent : le palet est pseudo-isolé, il glisse en ligne droite à vitesse constante. Aucune force n'est nécessaire pour entretenir ce mouvement.",
    conclusion_courte: "Pseudo-isolé : il glisse sans s'arrêter.",
    etapes: [
      { consigne: "L'air est coupé. Lancez le palet d'un geste.", court: "Lancez le palet, air coupé.", verifier: glissade(false) },
      { consigne: "Sans air, le palet s'arrête après quelques centimètres, parce que…", court: "Répondez dans le carnet.", question: choix(["la table frotte sur lui : une action de frottement le freine", "il n'a plus de force en lui", "son poids le pousse en arrière"], "Qu'est-ce qui touche le palet ?", "Exact.") },
      { consigne: "Appuyez sur « Mettre l'air », puis lancez de nouveau le palet.", court: "Mettez l'air, relancez le palet.", verifier: glissade(true) },
      { consigne: "Avec l'air, le palet glisse loin, en ligne droite, sans ralentir. Les actions qui s'exercent sur lui sont…", court: "Répondez dans le carnet.", question: choix(["son poids et l'action de l'air, qui se compensent", "une force qui le pousse vers l'avant", "aucune action"], "La main ne le touche plus.", "Exact : aucune force ne le pousse vers l'avant.") },
      { consigne: "Un corps soumis à des actions qui se compensent est dit…", court: "Répondez dans le carnet.", question: choix(["pseudo-isolé", "isolé", "en équilibre instable"], "Isolé : soumis à aucune action.", "Exact. Un corps isolé, lui, n'est soumis à aucune action (une sonde très loin de tout astre).") },
    ],
  };

  L.demarrer({
    id: "tc_meca3_a1_actions", titre: "Laboratoire : actions mécaniques et mouvement",
    paillasses: [L.poste_bille, (g) => L.poste_coussin_air(g, { nom: "palet", soufflerie: true })],
    missions: [BILLE, PALET],
  });
})(window.Labo);

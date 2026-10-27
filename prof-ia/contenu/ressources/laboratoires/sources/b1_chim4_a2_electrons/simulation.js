/*
Rôle : simulation de l'activité 2 du chapitre « Titrages » (1re année du bac) : transfert d'électrons. Un clou de fer dans
       une solution de sulfate de cuivre (Fe + Cu²⁺ → Fe²⁺ + Cu), ions fer II identifiés par la soude ; l'eau de Javel oxyde
       les ions iodure (ClO⁻ + 2 I⁻ + H₂O → I₂ + Cl⁻ + 2 HO⁻), diiode révélé par l'empois d'amidon ; l'acide ascorbique
       réduit le diiode. Oxydant, réducteur, couples Ox/Red, demi-équations. Objectifs O3, O4.
Reçoit : rien (les vérifications lisent les faits « metal » et « iodure »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const m = (f, t) => ((f.metal || {})[t]) || {}, io = (f, t) => ((f.iodure || {})[t]) || {};
  const vu = (f, t, debut) => (io(f, t).reactions || []).some((e) => e.startsWith(debut));

  const METAL = {
    id: "metal", paillasse: 0, titre: "Le fer et les ions cuivre II",
    objectif: "Plonger un clou de fer dans une solution de sulfate de cuivre ; identifier les produits ; écrire les demi-équations.",
    entetes: [],
    donnees: ["Ions Cu²⁺ : solution bleue ; le cuivre métal est rouge", "Test à la soude : Cu²⁺ → précipité bleu ; Fe²⁺ → précipité vert", "Couples : Cu²⁺/Cu et Fe²⁺/Fe"],
    conclusion: "Le clou se recouvre de cuivre et la solution se décolore ; la soude donne un précipité vert : des ions Fe²⁺ se sont formés. Chaque atome de fer a cédé deux électrons (Fe → Fe²⁺ + 2 e⁻), captés par un ion cuivre II (Cu²⁺ + 2 e⁻ → Cu) : Fe + Cu²⁺ → Fe²⁺ + Cu. Un réducteur cède des électrons (ici le fer), un oxydant en capte (ici l'ion Cu²⁺) ; les électrons ne sont jamais libres en solution.",
    conclusion_courte: "Fe + Cu²⁺ → Fe²⁺ + Cu : transfert de 2 électrons.",
    etapes: [
      { consigne: "Plongez le clou de fer dans le tube 1 ; attendez que la solution se décolore (comparez au tube témoin).", court: "Clou dans le tube 1.", aide_geste: "Faites glisser le clou au-dessus du tube 1 et lâchez-le ; il faut environ une minute.", verifier: ({ faits }) => m(faits, "t1").metal === "fer" && m(faits, "t1").Cu <= 0.025 },
      { consigne: "Ajoutez quelques gouttes de soude dans le tube 1 (mettez lunettes et gants).", court: "Soude dans le tube 1.", aide_geste: "S'il reste des ions cuivre II, ils précipitent d'abord en bleu : ajoutez encore quelques gouttes.", verifier: ({ faits }) => m(faits, "t1").FeOH2 > 0.005 },
      { consigne: "Le précipité vert montre que…", court: "Répondez dans le carnet.", question: choix(["des ions fer II Fe²⁺ se sont formés", "il reste des ions cuivre II", "la soude est verte"], "Regardez la fiche : Fe²⁺ donne un précipité vert.", "Exact.") },
      { consigne: "Que s'est-il passé pour le fer ?", court: "Répondez dans le carnet.", question: choix(["Fe → Fe²⁺ + 2 e⁻ : le fer a cédé deux électrons, c'est un réducteur", "Fe + 2 e⁻ → Fe²⁺ : le fer a capté deux électrons", "le fer a cédé des protons"], "Un atome Fe devient un ion Fe²⁺.", "Exact.") },
      { consigne: "L'équation de la réaction est…", court: "Répondez dans le carnet.", question: choix(["Fe + Cu²⁺ → Fe²⁺ + Cu", "Fe²⁺ + Cu → Fe + Cu²⁺", "Fe + Cu → Fe²⁺ + Cu²⁺"], "Les deux électrons cédés par le fer sont captés par l'ion Cu²⁺ : ils ne figurent pas dans l'équation.", "Exact.") },
      { consigne: "Dans cette réaction, l'oxydant est…", court: "Répondez dans le carnet.", question: choix(["l'ion cuivre II Cu²⁺ : il capte des électrons", "le fer Fe", "l'ion sulfate SO₄²⁻"], "Un oxydant capte des électrons ; SO₄²⁻ est spectateur.", "Exact : couple Cu²⁺/Cu.") },
    ],
  };

  const IODE = {
    id: "iode", paillasse: 1, titre: "Eau de Javel, diiode, vitamine C",
    objectif: "Oxyder les ions iodure par l'eau de Javel, réduire le diiode par l'acide ascorbique ; oxydants et réducteurs.",
    entetes: [],
    donnees: ["Eau de Javel : ions hypochlorite ClO⁻ (couple ClO⁻/Cl⁻) — corrosive", "Diiode I₂ : brun en solution ; bleu-noir avec l'empois d'amidon (couple I₂/I⁻)", "Acide ascorbique (vitamine C) C₆H₈O₆ (couple C₆H₆O₆/C₆H₈O₆)"],
    conclusion: "L'eau de Javel fait apparaître du diiode (brun, bleu-noir avec l'amidon) : l'ion hypochlorite, oxydant, capte deux électrons cédés par deux ions iodure (2 I⁻ → I₂ + 2 e⁻). L'acide ascorbique fait disparaître le diiode : c'est un réducteur, il cède des électrons au diiode (I₂ + 2 e⁻ → 2 I⁻). Une même espèce (I₂) peut être produite par un oxydant et consommée par un réducteur : I₂/I⁻ est un couple oxydant/réducteur.",
    conclusion_courte: "ClO⁻ oxyde I⁻ ; la vitamine C réduit I₂.",
    etapes: [
      { consigne: "Ajoutez quelques gouttes d'eau de Javel dans le tube 1 (iodure de potassium).", court: "Javel dans le tube 1.", verifier: ({ faits }) => vu(faits, "t1", "ClO⁻") },
      { consigne: "Ajoutez une goutte d'empois d'amidon dans le tube 1 : quelle espèce s'est formée ?", court: "Amidon dans le tube 1.", verifier: ({ faits }) => io(faits, "t1").amidon && io(faits, "t1").I2 > 2e-6 },
      { consigne: "Dans le tube 1, les ions iodure I⁻…", court: "Répondez dans le carnet.", question: choix(["ont cédé des électrons à l'ion hypochlorite (2 I⁻ → I₂ + 2 e⁻) : ce sont des réducteurs", "ont capté des électrons", "ont réagi avec l'amidon"], "Le diiode révélé par l'amidon vient des ions iodure.", "Exact : ClO⁻ est l'oxydant.") },
      { consigne: "Ajoutez de la vitamine C goutte à goutte dans le tube 2 (diiode) jusqu'à la décoloration.", court: "Vitamine C dans le tube 2.", verifier: ({ faits }) => vu(faits, "t2", "I₂ + C₆H₈O₆") && io(faits, "t2").I2 < 1e-4 },
      { consigne: "L'acide ascorbique est…", court: "Répondez dans le carnet.", question: choix(["un réducteur : il cède des électrons au diiode", "un oxydant", "un acide qui neutralise le diiode"], "Le diiode est réduit en ions iodure.", "Exact : c'est pourquoi la vitamine C est un antioxydant.") },
      { consigne: "La demi-équation du couple I₂/I⁻ s'écrit…", court: "Répondez dans le carnet.", question: choix(["I₂ + 2 e⁻ ⇌ 2 I⁻", "I₂ ⇌ 2 I⁻ + 2 e⁻", "I⁻ + e⁻ ⇌ I₂"], "L'oxydant capte des électrons ; conservez les atomes d'iode et les charges.", "Exact.") },
      { consigne: "Dans une réaction d'oxydoréduction, les électrons…", court: "Répondez dans le carnet.", question: choix(["passent directement du réducteur d'un couple à l'oxydant d'un autre couple : ils ne sont pas libres en solution", "restent libres dans l'eau", "sont apportés par l'eau"], "Les électrons ne figurent pas dans l'équation de la réaction.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_chim4_a2_electrons", titre: "Laboratoire : transfert d'électrons", paillasses: [L.poste_metal, L.poste_iodure], missions: [METAL, IODE] });
})(window.Labo);

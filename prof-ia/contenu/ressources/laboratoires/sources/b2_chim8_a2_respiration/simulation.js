/*
Rôle : simulation de l'activité 2 du chapitre « Exemples de transformations forcées : l'électrolyse » (2e année du bac, PC et SM) :
       une pile (transformation spontanée) fournit l'énergie d'une électrolyse (transformation forcée) ; documents sur les
       applications de l'électrolyse, la respiration et la photosynthèse ; classement de huit transformations en spontanées et
       forcées. Objectif O1.
Reçoit : rien (les vérifications lisent les faits « pile_electrolyse », « docs_forcees », « tri_forcees »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const P = (f) => f.pile_electrolyse || {};

  function tri({ faits }) {
    // Toutes les étiquettes rangées dans la bonne colonne.
    const t = faits.tri_forcees || {};
    if (L.TRI_FORCEES.some(([id]) => t[id] === undefined || t[id] === null)) return false;
    const faux = L.TRI_FORCEES.filter(([id, , c]) => t[id] !== c);
    return faux.length === 0 || `${faux.length} étiquette(s) mal rangée(s) : une transformation forcée a besoin d'un apport d'énergie (générateur, lumière).`;
  }

  const PILE = {
    id: "pile", paillasse: 0, titre: "Une pile pour forcer une électrolyse",
    conclusion: "La pile de 4,5 V fait passer un courant d'environ 0,11 A dans le tube en U : l'électrolyse de la solution de chlorure de sodium a lieu. Dans la pile, une transformation spontanée convertit de l'énergie chimique en énergie électrique ; dans le tube, l'électrolyse, transformation forcée, reçoit cette énergie (P = U·I ≈ 0,47 W) et la stocke en partie sous forme chimique (dichlore, dihydrogène). Les êtres vivants couplent de la même manière une transformation spontanée (la respiration) à des transformations forcées.",
    objectif: "Utiliser une transformation spontanée (pile) pour réaliser une transformation forcée (électrolyse) (O1).",
    entetes: [], donnees: ["Pile plate de 4,5 V", "Tube en U : NaCl à 1 mol/L + phénolphtaléine, électrodes de graphite"],
    conclusion_courte: "Spontanée (pile) → énergie → forcée (électrolyse).",
    etapes: [
      { consigne: "Branchez la pile, l'ampèremètre (A⎓, calibre 200 mA) et le tube en U en série.", court: "Pile + ampèremètre + tube en U.", verifier: ({ faits }) => (P(faits).I_lu > 30) || false },
      { consigne: "Dans ce montage…", court: "Répondez dans le carnet.", question: choix(["la pile est le siège d'une transformation spontanée qui fournit l'énergie ; l'électrolyse, forcée, la reçoit", "les deux transformations sont spontanées", "l'électrolyse fournit l'énergie à la pile"], "Sans pile, l'électrolyse n'aurait pas lieu.", "Exact.") },
      { consigne: "Mesurez la tension aux bornes du tube en U (V⎓, calibre 20 V).", court: "U aux bornes du tube.", verifier: ({ faits }) => (P(faits).U_tube > 2) || false },
      { consigne: "Puissance électrique (W) reçue par le tube en U ?", court: "P (W) ?", question: { type: "nombre", unite: "W", attendu: (f) => (P(f).U_tube || 4.3) * (P(f).I_lu || 118) * 1e-3, tolerance_relative: 0.05, aide: "P = U·I, I en ampères.", bravo: "Exact : c'est l'énergie par seconde que la pile fournit à l'électrolyse." } },
      { consigne: "Chez les êtres vivants, ce rôle de la pile est joué par…", court: "Répondez dans le carnet.", question: choix(["la respiration : transformation spontanée qui fournit l'énergie de transformations forcées", "la photosynthèse", "la digestion seule, sans aucune transformation chimique"], "Lisez les documents de la paillasse 2 si besoin.", "Exact.") },
    ],
  };

  const DOCUMENTS = {
    id: "documents", paillasse: 1, titre: "Électrolyse, respiration et photosynthèse",
    conclusion: "L'électrolyse produit l'aluminium, le dichlore, la soude et le cuivre pur, et sert à couvrir les objets d'un métal protecteur (zingage, chromage) : l'objet est la cathode, où les ions métalliques sont réduits. La respiration (glucose + dioxygène → dioxyde de carbone + eau) est spontanée et libère de l'énergie ; la photosynthèse, sa transformation inverse, est forcée par l'énergie lumineuse.",
    objectif: "Lire des documents sur les applications de l'électrolyse et sur deux transformations du vivant (O1).",
    entetes: [], donnees: ["Quatre documents au mur"],
    conclusion_courte: "Respiration spontanée ; photosynthèse forcée.",
    etapes: [
      { consigne: "Lisez les quatre documents.", court: "Lisez les documents.", aide_geste: "Touchez un document pour l'ouvrir, puis pour le refermer.", verifier: ({ faits }) => (faits.docs_forcees || []).length >= 4 || false },
      { consigne: "Pour chromer un robinet par électrolyse, le robinet est…", court: "Répondez dans le carnet.", question: choix(["la cathode : les ions Cr³⁺ y sont réduits en chrome", "l'anode : le chrome y est oxydé", "plongé sans être relié au générateur"], "Relisez « Dépôts électrolytiques ».", "Exact.") },
      { consigne: "La photosynthèse 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂ est…", court: "Répondez dans le carnet.", question: choix(["une transformation forcée : elle a besoin de l'énergie de la lumière", "une transformation spontanée, comme la respiration", "une transformation qui ne met en jeu aucune énergie"], "Que se passe-t-il à l'obscurité ?", "Exact.") },
      { consigne: "La respiration et la photosynthèse…", court: "Répondez dans le carnet.", question: choix(["sont des transformations inverses : la première est spontanée, la seconde forcée", "sont une seule et même transformation", "sont toutes deux forcées par la lumière"], "Comparez leurs équations.", "Exact.") },
    ],
  };

  const TRI = {
    id: "tri", paillasse: 2, titre: "Spontanée ou forcée ?",
    conclusion: "Spontanées : combustion du butane, pile qui débite, rouille, respiration. Forcées : photosynthèse (énergie lumineuse), électrolyse de l'alumine, recharge d'une batterie, chromage (énergie électrique d'un générateur). Une transformation forcée fait évoluer le système dans le sens inverse de son évolution spontanée : il faut lui fournir de l'énergie.",
    objectif: "Distinguer transformations spontanées et forcées (O1).",
    entetes: [], donnees: ["Huit transformations de la vie courante, de l'industrie et du vivant"],
    conclusion_courte: "Forcée : il faut fournir de l'énergie.",
    etapes: [
      { consigne: "Rangez les huit étiquettes dans le tableau.", court: "Rangez les étiquettes.", aide_geste: "Faites glisser chaque étiquette dans une colonne.", verifier: tri },
      { consigne: "Une transformation forcée…", court: "Répondez dans le carnet.", question: choix(["fait évoluer le système dans le sens inverse du sens spontané, grâce à de l'énergie reçue de l'extérieur", "se fait toujours plus vite qu'une transformation spontanée", "fait évoluer le système vers l'équilibre"], "Pensez au générateur de l'électrolyse et à la lumière de la photosynthèse.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_chim8_a2_respiration", titre: "Laboratoire : spontané ou forcé ?", paillasses: [L.poste_pile_electrolyse, L.poste_docs_forcees, L.poste_tri_forcees], missions: [PILE, DOCUMENTS, TRI] });
})(window.Labo);

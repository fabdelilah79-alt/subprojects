/*
Rôle : simulation de l'activité 1 du chapitre « Espèces chimiques » (tronc commun) : utiliser les sens pour repérer des
       espèces chimiques dans un produit naturel (une orange) et dans un produit fabriqué (le papier) ; on ne goûte
       jamais au laboratoire ; les sens donnent des indices, les tests (activité 2) permettent de conclure. Objectif O1.
Reçoit : rien (les vérifications lisent les observations notées par les paillasses).
Produit : la simulation démarrée : une orange ; une feuille de papier.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const vu = (fait, objet, sens) => ({ faits }) => sens.every((s) => ((faits[fait] || {})[objet] || []).includes(s)) || false;
  const O = (faits) => faits.orange || {};

  const ORANGE = {
    id: "orange", paillasse: 0, titre: "Une orange et nos sens",
    objectif: "Quelles espèces chimiques une orange contient-elle ? Que nous apprennent nos sens ?",
    entetes: [],
    conclusion: "Les sens donnent des indices : l'orange contient probablement de l'eau (pulpe humide, jus), des sucres (le jus colle en séchant), une huile odorante (dans les pores de la peau) et des colorants. Ce sont des espèces chimiques naturelles. Les sens ne suffisent pas pour conclure : il faut des tests. Au laboratoire, on ne goûte jamais.",
    conclusion_courte: "Les sens donnent des indices, pas des preuves.",
    etapes: [
      { consigne: "Posez les cartes Vue, Odorat et Toucher sur l'orange entière, puis observez-la à la loupe.", court: "Vue, odorat, toucher, loupe sur l'orange.", verifier: vu("sens_orange", "orange", ["vue", "odorat", "toucher", "loupe"]), aide_geste: "Glissez une carte sur l'orange : une bulle dit ce que vous percevez." },
      { consigne: "Coupez l'orange en deux : glissez le couteau sur l'orange.", court: "Coupez l'orange.", verifier: ({ faits }) => O(faits).coupee || false },
      { consigne: "Observez la pulpe (Vue, Odorat, Toucher, loupe), puis la peau à la loupe.", court: "Pulpe et peau : sens et loupe.", verifier: ({ faits }) => (vu("sens_orange", "pulpe", ["vue", "odorat", "toucher", "loupe"])({ faits }) && vu("sens_orange", "peau", ["loupe"])({ faits })) || false },
      { consigne: "Pressez la demi-orange côté pulpe sur le cône du presse-agrumes, puis observez le jus (Vue, Toucher).", court: "Pressez, puis observez le jus.", verifier: ({ faits }) => (O(faits).jus && vu("sens_orange", "jus", ["vue", "toucher"])({ faits })) || false },
      { consigne: "Peut-on utiliser la carte Goût au laboratoire ?", court: "Répondez dans le carnet.", question: choix(["Non : on ne goûte jamais un produit au laboratoire, même un aliment", "Oui, si c'est un fruit", "Oui, avec un peu de jus seulement"], "Lisez l'affiche de sécurité.", "Exact.") },
      { consigne: "D'après vos observations, l'orange contient probablement…", court: "Répondez dans le carnet.", question: choix(["de l'eau, des sucres, une huile odorante et des colorants", "seulement de l'eau", "aucune espèce chimique, puisque c'est un produit naturel"], "Humide, collant, odeur forte quand on presse la peau, couleur…", "Exact : ce sont des espèces chimiques naturelles.") },
      { consigne: "Le toucher (« ça colle ») permet-il d'affirmer que le jus contient du glucose ?", court: "Répondez dans le carnet.", question: choix(["Non : c'est un indice ; il faut un test de détection pour le vérifier", "Oui, le toucher suffit", "Oui, si l'odeur est sucrée"], "Plusieurs espèces peuvent coller.", "Exact : nous ferons ces tests dans l'activité suivante.") },
    ],
  };

  const PAPIER = {
    id: "papier", paillasse: 1, titre: "Une feuille de papier et nos sens",
    objectif: "Le papier est un produit fabriqué. De quoi est-il fait ?",
    entetes: [],
    conclusion: "À la loupe, le papier est un enchevêtrement de fibres de cellulose, une espèce chimique naturelle tirée du bois. Le papier est un produit fabriqué par l'homme à partir d'espèces naturelles, auxquelles on ajoute d'autres espèces (amidon, craie...). Une espèce chimique est un ensemble d'entités identiques (molécules, ions...) : l'eau, le glucose, la cellulose sont des espèces chimiques.",
    conclusion_courte: "Papier : fibres de cellulose (venue du bois).",
    etapes: [
      { consigne: "Observez la feuille avec la carte Vue, puis à la loupe.", court: "Vue et loupe sur le papier.", verifier: vu("sens_papier", "papier", ["vue", "loupe"]) },
      { consigne: "Posez les cartes Odorat, Toucher et Ouïe sur la feuille (pour l'ouïe, on la froisse).", court: "Odorat, toucher, ouïe.", verifier: vu("sens_papier", "papier", ["odorat", "toucher", "ouie"]) },
      { consigne: "À la loupe, le papier est formé…", court: "Répondez dans le carnet.", question: choix(["de fibres enchevêtrées : des fibres de cellulose, venues du bois", "de petits cristaux de sel", "de gouttelettes d'eau"], "Relisez la légende de la loupe.", "Exact.") },
      { consigne: "Le papier est…", court: "Répondez dans le carnet.", question: choix(["un produit fabriqué par l'homme à partir d'une espèce naturelle, la cellulose du bois", "un produit naturel, qu'on trouve tel quel dans la nature", "un produit qui ne contient aucune espèce naturelle"], "D'où viennent ses fibres ?", "Exact.") },
      { consigne: "Une espèce chimique, c'est…", court: "Répondez dans le carnet.", question: choix(["un ensemble d'entités identiques (molécules, ions...) : l'eau, le glucose, la cellulose en sont", "un produit dangereux du laboratoire", "un mélange de plusieurs produits"], "L'eau du jus et l'eau du robinet sont-elles la même espèce ?", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_chim1_a1_sens", titre: "Laboratoire : les espèces chimiques et nos sens", paillasses: [L.poste_orange, L.poste_papier], missions: [ORANGE, PAPIER] });
})(window.Labo);

/*
Rôle : simulation de l'activité 1 du chapitre « Énergie potentielle électrostatique » (1re année du bac, SM) : électrisation
       par frottement, par contact (pendule électrostatique) et par influence (électroscope à feuilles d'or). Elle prépare
       la loi de Coulomb (O1) : attraction et répulsion entre charges.
Reçoit : rien (les vérifications lisent les faits « pendule », « electroscope » et « charges »).
Produit : la simulation démarrée : pendule électrostatique ; électroscope.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const pe = (f) => f.pendule || { vu: {} }, el = (f) => f.electroscope || {};
  const FROTTER = "Frottez la baguette sur le chiffon par des allers-retours, puis approchez-la.";

  const CONTACT = {
    id: "contact", paillasse: 0, titre: "Électrisation par contact",
    objectif: "Approcher une baguette électrisée d'un pendule électrostatique, puis le toucher ; observer attraction et répulsion.",
    entetes: [],
    conclusion: "Un corps électrisé attire un corps léger neutre (par influence : les charges du corps neutre se déplacent). Au contact, une partie de la charge passe sur le corps neutre, qui se charge du même signe : ils se repoussent alors. Deux corps chargés de même signe se repoussent ; de signes contraires, ils s'attirent. La force entre deux charges est décrite par la loi de Coulomb : F = k·|q1·q2| / d².",
    conclusion_courte: "Contact : même signe ; même signe → répulsion ; signes contraires → attraction.",
    etapes: [
      { consigne: "Frottez la baguette de PVC sur la laine, puis approchez-la de la boule sans la toucher.", court: "PVC frotté, approché.", aide_geste: FROTTER, verifier: ({ faits }) => !!pe(faits).vu.attire_neutre },
      { consigne: "La boule neutre est attirée par la baguette chargée, car…", court: "Répondez dans le carnet.", question: choix(["ses charges se séparent sous l'influence", "elle était déjà chargée avant l'essai", "la baguette lui donne des charges à distance"], "La boule est recouverte d'aluminium, un conducteur.", "Exact : c'est une électrisation par influence.") },
      { consigne: "Laissez la boule toucher la baguette, puis observez.", court: "Contact boule-baguette.", verifier: ({ faits }) => pe(faits).contacts >= 1 && !!pe(faits).vu.repousse_contact },
      { consigne: "Après le contact, la boule est repoussée par la baguette. Elle s'est chargée…", court: "Répondez dans le carnet.", question: choix(["du même signe que la baguette", "de signe opposé à la baguette", "de charges des deux signes à la fois"], "Deux charges de même signe se repoussent.", "Exact : électrisation par contact.") },
      { consigne: "Frottez la baguette de verre sur la soie et approchez-la de la boule (toujours chargée par le PVC).", court: "Verre frotté, approché.", verifier: ({ faits }) => !!pe(faits).vu.attire_oppose },
      { consigne: "La boule chargée par le PVC est attirée par le verre frotté. Deux corps chargés de signes contraires…", court: "Répondez dans le carnet.", question: choix(["s'attirent", "se repoussent", "n'agissent pas l'un sur l'autre"], "Le PVC frotté avec la laine se charge négativement ; le verre frotté avec la soie, positivement.", "Exact.") },
      { consigne: "Quand on approche la baguette, l'attraction ou la répulsion est d'autant plus forte que…", court: "Répondez dans le carnet.", question: choix(["la distance est petite", "la distance est grande", "la baguette est longue"], "F = k·|q1·q2| / d².", "Exact.") },
    ],
  };

  const INFLUENCE = {
    id: "influence", paillasse: 1, titre: "Électrisation par influence",
    objectif: "Charger un électroscope par contact, puis par influence ; comparer les signes.",
    entetes: [],
    conclusion: "Un corps chargé approché d'un conducteur isolé (sans contact) y sépare les charges : c'est l'influence. Si l'on relie le conducteur à la Terre pendant l'influence, puis qu'on coupe cette liaison avant d'éloigner le corps chargé, le conducteur reste chargé, de signe opposé au corps inducteur. Par contact, il se charge du même signe.",
    conclusion_courte: "Influence : signe opposé ; contact : même signe.",
    etapes: [
      { consigne: "Frottez la baguette de PVC, approchez-la du plateau sans le toucher, puis éloignez-la : observez les feuilles d'or.", court: "Approcher, puis éloigner.", aide_geste: FROTTER, verifier: ({ faits }) => !!(el(faits).vu_influence && el(faits).retombe) },
      { consigne: "Les feuilles s'écartent quand la baguette est proche, et retombent quand on l'éloigne, car…", court: "Répondez dans le carnet.", question: choix(["les charges se séparent, puis se remettent en place", "la baguette donne puis reprend des charges", "l'air entre les feuilles se charge, puis se décharge"], "Il n'y a pas eu de contact.", "Exact : c'est l'influence.") },
      { consigne: "Touchez le plateau avec la baguette de PVC chargée, puis éloignez-la.", court: "Contact avec le plateau.", verifier: ({ faits }) => (el(faits).contacts >= 1 && Math.abs(el(faits).q) > 0.3 && el(faits).alpha > 8) || false },
      { consigne: "Les feuilles restent écartées : l'électroscope est chargé…", court: "Répondez dans le carnet.", question: choix(["négativement, comme le PVC", "positivement, à l'opposé du PVC", "il est neutre : charges égales"], "Par contact, l'électroscope prend une partie de la charge de la baguette.", "Exact.") },
      { consigne: "Déchargez l'électroscope en posant le doigt sur le plateau. Puis : approchez le PVC chargé sans contact, posez le doigt sur le plateau, retirez le doigt, et enfin éloignez la baguette.", court: "Charger par influence.", aide_geste: "Glissez la main jusqu'au plateau ; reglissez-la ailleurs pour la retirer.", verifier: ({ faits }) => el(faits).charge_influence === 1 },
      { consigne: "Les feuilles s'écartent à nouveau. L'électroscope est chargé…", court: "Répondez dans le carnet.", question: choix(["positivement, à l'opposé du PVC", "négativement, comme le PVC", "il est neutre : charges égales"], "Pendant l'influence, des électrons repoussés par le PVC sont partis dans la Terre par le doigt.", "Exact : électrisation par influence.") },
    ],
  };

  L.demarrer({ id: "b1_elec1_a1_electrisation", titre: "Laboratoire : électrisation", paillasses: [L.poste_pendule, L.poste_electroscope], missions: [CONTACT, INFLUENCE] });
})(window.Labo);

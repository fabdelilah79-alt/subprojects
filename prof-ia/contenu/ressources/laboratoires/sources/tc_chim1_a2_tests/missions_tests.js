/*
Rôle : missions « l'eau » (sulfate de cuivre anhydre) et « acide ou basique » (papier pH, phénolphtaléine) de l'activité 2
       du chapitre « Espèces chimiques » (tests de détection, objectif O1).
Reçoit : rien (les vérifications lisent les faits des paillasses et la feuille du tableur).
Produit : Labo.MISSIONS_TESTS = { eau, ph, choix }.
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const E = (faits) => faits.test_eau || {}, P = (faits) => faits.test_ph || {};
  const tous = (etat, n, f) => Array.from({ length: n }, (_, k) => etat[k + 1] || {}).every(f);

  function feuille_ph({ feuille, faits }) {
    // Lignes : numéro du bécher (A) et pH lu sur l'échelle (B) ; à une unité près, pour les cinq béchers.
    const lignes = feuille.lignes(["A", "B"]), p = P(faits);
    for (const [k, l] of lignes.entries()) {
      const e = p[l.A];
      if (!e) return `Ligne ${k + 2} : le numéro du bécher (colonne A) va de 1 à 5.`;
      if (e.pH === null) return `Ligne ${k + 2} : vous n'avez pas encore déposé ce liquide sur une bande de papier pH.`;
      if (Math.abs(l.B - e.pH) > 1) return `Ligne ${k + 2} : comparez de nouveau la teinte de la bande à l'échelle de la boîte.`;
    }
    return new Set(lignes.map((l) => l.A)).size >= 5 || false;
  }

  const EAU = {
    id: "eau", paillasse: 0, titre: "Le test de l'eau",
    objectif: "L'orange contient-elle de l'eau ? Et le papier ? Le sulfate de cuivre anhydre, blanc, bleuit au contact de l'eau.",
    entetes: [],
    conclusion: "Le sulfate de cuivre anhydre (blanc) bleuit en présence d'eau. Il bleuit avec l'eau distillée (témoin) et avec le jus d'orange : le jus contient de l'eau. Il reste blanc avec l'huile et le papier sec, qui n'en contiennent pas (ou presque pas).",
    conclusion_courte: "Sulfate de cuivre anhydre : bleu = eau.",
    etapes: [
      { consigne: "Avec la spatule, prenez une pointe de sulfate de cuivre anhydre dans le pot, puis déposez-la dans un verre de montre. Recommencez pour les quatre verres de montre.", court: "Poudre blanche dans les 4 verres de montre.", verifier: ({ faits }) => tous(E(faits), 4, (e) => e.poudre) || false, aide_geste: "Glissez la spatule sur le pot pour la charger, puis sur le verre de montre." },
      { consigne: "Avec la pipette de chaque bécher, déposez quelques gouttes de jus d'orange (1), d'huile (3) et d'eau distillée (4) sur la poudre. Le verre 2 contient un morceau de papier sec.", court: "Gouttes de jus, d'huile, d'eau distillée.", verifier: ({ faits }) => [1, 3, 4].every((n) => (E(faits)[n] || {}).liquide) || false, aide_geste: "Sortez la pipette, lâchez-la juste au-dessus du verre de montre, puis appuyez sur sa poire. Remettez-la dans son bécher." },
      { consigne: "Le sulfate de cuivre anhydre a bleui…", court: "Répondez dans le carnet.", question: choix(["avec l'eau distillée et le jus d'orange ; il est resté blanc avec l'huile et le papier sec", "avec les quatre échantillons", "seulement avec le jus d'orange"], "Regardez chaque verre de montre.", "Exact.") },
      { consigne: "Pourquoi a-t-on fait le test avec de l'eau distillée ?", court: "Répondez dans le carnet.", question: choix(["C'est un témoin : il montre ce que donne le test quand l'eau est présente", "Pour diluer la poudre", "Pour nettoyer le verre de montre"], "Que sait-on déjà de l'eau distillée ?", "Exact : on compare chaque résultat à celui du témoin.") },
      { consigne: "On conclut que…", court: "Répondez dans le carnet.", question: choix(["le jus d'orange contient de l'eau, une espèce chimique", "le jus d'orange est de l'eau pure", "l'huile contient de l'eau"], "Un test positif montre la présence d'une espèce, pas qu'elle est seule.", "Exact.") },
    ],
  };

  const PH = {
    id: "ph", paillasse: 1, titre: "Acide, neutre ou basique ?",
    objectif: "Classer cinq liquides à l'aide du papier pH, puis de la phénolphtaléine.",
    entetes: ["bécher n°", "pH"],
    conclusion: "Le papier pH donne le pH : pH < 7 acide (jus d'orange, vinaigre), pH = 7 neutre (eau distillée), pH > 7 basique (eau savonneuse, eau de chaux). La phénolphtaléine reste incolore en dessous de pH 8,2 et devient rose au-delà : elle détecte une solution basique, mais ne distingue pas un acide d'une solution neutre.",
    conclusion_courte: "pH < 7 acide ; 7 neutre ; > 7 basique.",
    etapes: [
      { consigne: "Avec la pipette de chaque bécher, déposez une goutte de chaque liquide sur la bande de papier pH placée devant lui.", court: "Une goutte sur chaque bande pH.", verifier: ({ faits }) => tous(P(faits), 5, (e) => e.pH !== null && e.pH !== undefined) || false, aide_geste: "Tenez la pipette juste au-dessus de la bande, puis appuyez sur sa poire." },
      { consigne: "Comparez la teinte de chaque bande à l'échelle de la boîte. Tableur : numéro du bécher en A, pH lu en B (les cinq béchers).", court: "Tableur : bécher n° et pH.", verifier: feuille_ph, aide_geste: "Zoomez sur la boîte pour bien voir les teintes." },
      { consigne: "Le jus d'orange et le vinaigre sont…", court: "Répondez dans le carnet.", question: choix(["acides (pH < 7) ; l'eau savonneuse et l'eau de chaux sont basiques (pH > 7)", "basiques (pH > 7)", "neutres (pH = 7)"], "Comparez chaque pH à 7.", "Exact.") },
      { consigne: "Avec le flacon compte-gouttes, ajoutez deux gouttes de phénolphtaléine dans chacun des cinq béchers.", court: "Phénolphtaléine dans les 5 béchers.", verifier: ({ faits }) => tous(P(faits), 5, (e) => e.phenol) || false, aide_geste: "Lâchez la pipette du flacon au-dessus d'un bécher, appuyez brièvement sur la poire, puis passez au suivant." },
      { consigne: "La phénolphtaléine est devenue rose…", court: "Répondez dans le carnet.", question: choix(["seulement dans l'eau savonneuse et l'eau de chaux (basiques) : elle ne distingue pas un acide d'une solution neutre", "dans les cinq béchers", "dans les liquides acides"], "Dans quels béchers est-elle rose ?", "Exact : elle devient rose au-delà de pH 8,2.") },
    ],
  };

  L.MISSIONS_TESTS = { eau: EAU, ph: PH, choix };
})(window.Labo);

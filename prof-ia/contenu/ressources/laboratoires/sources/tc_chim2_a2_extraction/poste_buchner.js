/*
Rôle : paillasse de la filtration sous vide de l'activité « extraction » : on sépare les fleurs de lavande de l'eau qui
       reste dans le ballon (matériel : buchner_poste.js).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_buchner(groupe) -> { pense_bete } ; fait « buchner » (voir buchner_poste.js).
Utilisé par : simulation.js.
*/
(function (L) {
  Object.assign(L.LIQUIDES, {
    eau_lavande: { nom: "eau et fleurs de lavande", d: 1.0, rgb: [128, 96, 120], alpha: 0.82, classe: "aqueuse" },
    filtrat_lavande: { nom: "filtrat", d: 1.0, rgb: [226, 200, 140], alpha: 0.55, classe: "aqueuse" },
  });

  L.poste_buchner = function (g) {
    // Paillasse, écoulement, puis le matériel de filtration avec le mélange « fleurs + eau ».
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g);
    L.ecoulement(ctx, { sol: 576, e: 1.6 });
    L.filtration_buchner(ctx, { fait: "buchner", melange: { contenu: { eau_lavande: 100 }, etiquette: "fleurs + eau" }, retenu: { eau_lavande: "filtrat_lavande" } });
    return { pense_bete };
  };
})(window.Labo);

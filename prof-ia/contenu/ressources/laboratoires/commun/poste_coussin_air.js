/*
Rôle : paillasse « table à coussin d'air » prête à l'emploi : table posée sur la paillasse (à plat, ou inclinée
       par une cale), mobile autoporteur, éclateur, feuille d'enregistrement et outils de mesure demandés.
Reçoit : le groupe SVG de la paillasse et { inclinaison_mm_s2, fil, outils: ["transparent", "regle"], vecteurs }.
Produit : Labo.poste_coussin_air(groupe, reglages) -> { pense_bete, table, eclateur, feuille, outils }.
Utilisé par : les simulations de mouvement (tc_meca2_a2_repere, tc_meca2_a3_vitesse, tc_meca2_a4_mru_mcu).
*/
(function (L) {
  function cale(g) {
    // Cale en bois sous les pieds du fond : la table penche vers l'élève.
    for (const x of [262, 742]) {
      L.svg("path", { d: `M${x - 18} 352 H${x + 18} L${x + 22} 366 H${x - 22} Z`, fill: "url(#bois)", stroke: "#8d6337", "stroke-width": 0.6 }, g);
    }
    L.texte(g, 512, 326, "Table inclinée : cale de 2 cm sous le côté du fond", { class: "etiquette-carton", "font-size": 15, fill: "#3b2a05" });
  }

  L.poste_coussin_air = function (g, reglages = {}) {
    // Construit la paillasse et branche tous les éléments ensemble.
    if (reglages.inclinaison_mm_s2) cale(g);
    const table = new L.CoussinAir(g, reglages);
    const eclateur = new L.Eclateur(g, table, 808, 398);
    const pense_bete = L.decor.pense_bete(g, 24, 40, 230);
    const dessus = L.svg("g", { class: "calque-dessus" }, g);
    const feuille = new L.Feuille(table, dessus, table);
    const outils = {};
    for (const nom of reglages.outils || []) outils[nom] = L[nom](feuille);
    // Avec un fil, les flèches n'apparaissent que pour un enregistrement circulaire (fil accroché).
    const quand = reglages.fil ? () => !!table.fil_accroche : () => true;
    if (reglages.vecteurs) outils.vecteurs = L.vecteurs_vitesse(feuille, { ...reglages.vecteurs, quand });
    return { pense_bete, table, eclateur, feuille, outils };
  };
})(window.Labo);

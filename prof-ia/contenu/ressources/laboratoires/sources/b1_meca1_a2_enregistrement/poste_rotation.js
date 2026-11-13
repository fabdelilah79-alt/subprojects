/*
Rôle : paillasse « enregistrement d'un solide en rotation » : table à coussin d'air, solide pivotant autour du clou (deux
       palets à électrode, A à 6 cm et B à 12 cm de l'axe), éclateur, feuille d'enregistrement avec la règle et le
       rapporteur, fiche des distances.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_rotation(groupe) -> { pense_bete } ; faits « enregistrement » (éclateur, points { t, a, b }) et « rapporteur ».
Utilisé par : simulation.js.
*/
(function (L) {
  L.poste_rotation = function (g) {
    // Fiche murale des rayons, table, solide pivotant, outils.
    L.svg("rect", { x: 744, y: 44, width: 250, height: 62, rx: 3, fill: "#fdfdf8", stroke: "#c9c4b0", filter: "url(#ombre)" }, g);
    L.texte(g, 869, 62, "Solide en rotation autour du clou O", { "font-size": 10, "font-weight": 700, fill: "#23315a" });
    L.texte(g, 869, 80, "OA = 6,0 cm ; OB = 12,0 cm", { "font-size": 9.5, fill: "#222" });
    L.texte(g, 869, 96, "Les étincelles marquent A et B toutes les τ.", { "font-size": 9, fill: "#222" });
    // La table vient après la fiche : la feuille relevée passe devant elle.
    const poste = L.poste_coussin_air(g, { nom: "rotation", outils: ["regle", "rapporteur"] });
    L.solide_pivotant(poste.table);
    return { pense_bete: poste.pense_bete };
  };
})(window.Labo);

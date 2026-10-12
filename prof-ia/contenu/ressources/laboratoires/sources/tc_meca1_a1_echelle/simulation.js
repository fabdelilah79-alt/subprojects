/*
Rôle : simulation de l'activité 1 du chapitre « Exemples d'actions mécaniques » (tronc commun) :
       « Documents sur l'Univers (atome, Terre, système solaire, galaxies) pour comparer les dimensions ».
       Objectif O1 : connaître l'échelle des distances dans l'Univers (des atomes aux astres).
Reçoit : rien (les vérifications lisent les étiquettes posées et le tableur).
Produit : la simulation démarrée (une paillasse, une mission).
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const LONGUEURS_M = [1.7e-15, 1e-10, 7e-6, 1.7, 6.4e6, 3.84e8, 1.5e11, 9.46e20];

  function conversions({ feuille }) {
    // Les 8 longueurs du document doivent être écrites en mètre dans la colonne B (à 1 % près).
    const valeurs = feuille.lignes(["B"]).map((l) => l.B);
    if (!valeurs.length) return false;
    const manquantes = LONGUEURS_M.filter((v) => !valeurs.some((x) => Math.abs(x - v) <= 0.01 * v)).length;
    if (!manquantes) return true;
    return valeurs.length >= 8 && `${manquantes} longueur${manquantes > 1 ? "s sont fausses" : " est fausse"} : vérifiez la conversion en mètre (1 km = 10³ m).`;
  }

  function placement({ faits }) {
    // Les 8 étiquettes sont sur la frise, chacune à son ordre de grandeur.
    const placees = faits.etiquettes_placees || {};
    if (Object.keys(placees).length < L.ETIQUETTES_UNIVERS.length) return false;
    const fausses = L.ETIQUETTES_UNIVERS.filter((e) => placees[e.id] !== e.exposant).length;
    return fausses === 0 || `${fausses} étiquette${fausses > 1 ? "s sont mal placées" : " est mal placée"} : écrivez L = a × 10ⁿ, puis appliquez la règle du document.`;
  }

  const ECHELLE = {
    id: "echelle", paillasse: 0, titre: "L'échelle des distances dans l'Univers",
    objectif: "Comparer les dimensions dans l'Univers, du noyau de l'atome aux galaxies, grâce aux ordres de grandeur.",
    entetes: ["Objet", "L (m)"],
    conclusion: "Les longueurs de l'Univers vont de 10⁻¹⁵ m (noyau) à 10²¹ m (galaxie) : 36 ordres de grandeur.",
    conclusion_courte: "De 10⁻¹⁵ m à 10²¹ m.",
    etapes: [
      { consigne: "Lisez le document au mur. Dans le tableur, écrivez le nom de chaque objet (colonne A) et sa longueur en mètre (colonne B).", court: "Tableur : les 8 longueurs, en mètre.", verifier: conversions, aide_geste: "Pour 6,4 × 10⁶, écrivez 6,4E6. Vous pouvez aussi calculer : =6400*1000." },
      { consigne: "Placez chaque étiquette aimantée sur la frise, à l'ordre de grandeur de sa longueur.", court: "Placez les 8 étiquettes sur la frise.", verifier: placement, aide_geste: "Faites glisser une étiquette sur la frise : elle se fixe à la graduation la plus proche." },
      { consigne: "Avec le tableur, calculez combien de fois la distance Terre – Soleil est plus grande que la distance Terre – Lune.", court: "Terre-Soleil / Terre-Lune = ?", question: { type: "nombre", unite: "fois", attendu: 390.6, tolerance: 4, aide: "Divisez la distance Terre – Soleil par la distance Terre – Lune (toutes deux en mètre).", bravo: "Exact : environ 390 fois." } },
      { consigne: "Combien d'ordres de grandeur séparent l'atome d'hydrogène du rayon de la Terre ?", court: "Combien d'ordres de grandeur ?", question: { type: "nombre", unite: "", attendu: 17, tolerance: 0, aide: "Comptez les graduations entre 10⁻¹⁰ m et 10⁷ m.", bravo: "Exact : 10⁷ / 10⁻¹⁰ = 10¹⁷." } },
      { consigne: "La lumière parcourt 3 × 10⁸ m en une seconde. Pour venir du Soleil jusqu'à la Terre, elle met environ…", court: "Répondez dans le carnet.", question: { type: "choix", options: ["500 s (un peu plus de 8 minutes)", "1 s", "1 an"], bonne: 0, aide: "Calculez la durée t = d / v avec le tableur.", bravo: "Exact : 1,5 × 10¹¹ / 3 × 10⁸ = 500 s." } },
    ],
  };

  L.demarrer({ id: "tc_meca1_a1_echelle", titre: "Laboratoire : l'échelle des distances", paillasses: [L.poste_echelle], missions: [ECHELLE] });
})(window.Labo);

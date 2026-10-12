/*
Rôle : vérifier les étapes de découverte de la loi de gravitation : les lignes du tableur doivent correspondre
       à des mesures réellement faites avec les sondes (même masse, même distance, même force à 1 % près).
Reçoit : le contexte d'une étape { faits, feuille, courbe } (voir commun/missions.js).
Produit : Labo.VERIF_LOI : distances_variees, tableau_masses, deux_astres, tableau_distances, rapport_constant.
Utilisé par : simulation.js.
*/
(function (L) {
  const proche = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
  const mesures = (faits) => faits.mesures_sondes || [];

  function distances_variees({ faits }) {
    // Au moins trois distances différentes à la Terre ont été essayées.
    return new Set(mesures(faits).map((m) => m.dT)).size >= 3;
  }

  function tableau_masses({ feuille, faits }) {
    // Les trois sondes, à d_T = 20 000 km : m (kg) en A, F_T (N) en B, conformes aux mesures.
    const lignes = feuille.lignes(["A", "B"]);
    for (const l of lignes) {
      const mesure = mesures(faits).find((m) => m.m === l.A && m.dT === 20000);
      if (![250, 500, 1000].includes(l.A)) return "La colonne A contient la masse de la sonde en kg : 250, 500 ou 1000.";
      if (!mesure) return `Placez d'abord la sonde de ${l.A} kg sur le cercle de 20 000 km autour de la Terre.`;
      if (!proche(l.B, mesure.FT, 0.01)) return `Relisez F_{T} sur l'afficheur de la sonde de ${l.A} kg.`;
    }
    return new Set(lignes.map((l) => l.A)).size >= 3 || false;
  }

  function deux_astres({ faits }) {
    // La sonde de 500 kg a été placée à 10 000 km de la Terre, puis à 10 000 km de la Lune.
    const m = mesures(faits).filter((x) => x.m === 500);
    return (m.some((x) => x.dT === 10000) && m.some((x) => x.dL === 10000)) || false;
  }

  function tableau_distances({ feuille, faits }) {
    // Sonde de 1000 kg : d (km) en A, F_T (N) en B, 1/d² en C ; au moins 5 distances différentes.
    const lignes = feuille.lignes(["A", "B"]);
    for (const l of lignes) {
      if (l.A > 1e6) return "Dans la colonne A, écrivez la distance d en km (comme sur l'afficheur).";
      const mesure = mesures(faits).find((m) => m.m === 1000 && m.dT === l.A);
      if (!mesure) return `La sonde de 1000 kg n'a pas été placée à d_{T} = ${L.nombre(l.A, 0)} km de la Terre.`;
      if (!proche(l.B, mesure.FT, 0.01)) return `Relisez F_{T} pour d = ${L.nombre(l.A, 0)} km.`;
    }
    if (new Set(lignes.map((l) => l.A)).size < 5) return false;
    const avec_c = feuille.lignes(["A", "C"]);
    if (avec_c.length < lignes.length) return "Dans la colonne C, calculez 1/d² : écrivez =1/A2^2 puis recopiez vers le bas.";
    return avec_c.every((l) => proche(l.C, 1 / (l.A * l.A), 0.01)) || "Vérifiez la colonne C : =1/A2^2.";
  }

  function rapport_constant({ feuille }) {
    // Colonne D : F·d²/(m·M_T) calculé pour au moins 5 lignes ; il vaut G (constante) sur chaque ligne.
    const lignes = feuille.lignes(["A", "B", "D"]);
    if (lignes.length < 5) return false;
    const faux = lignes.find((l) => !proche(l.D, L.LOI_GRAVITATION.G, 0.03));
    return !faux || `Vérifiez D pour d = ${L.nombre(faux.A, 0)} km : d en mètre (× 1000), m = 1000 kg, M = 5,97E24 kg.`;
  }

  L.VERIF_LOI = { distances_variees, tableau_masses, deux_astres, tableau_distances, rapport_constant };
})(window.Labo);

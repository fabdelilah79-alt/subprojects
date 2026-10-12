/*
Rôle : simulation complémentaire du chapitre « Exemples d'actions mécaniques » (tronc commun), objectif O3 :
       découvrir l'effet de l'altitude sur la force de gravitation (le poids) : F = m·g0·R²/(R+h)², g = g0·R²/(R+h)².
       Orientation : « donner P = m·g et sa représentation à une altitude h ». À valider par l'enseignant.
Reçoit : rien (les vérifications lisent les mesures de la sonde et le tableur).
Produit : la simulation démarrée : vue réaliste de la Terre depuis l'espace (une mission).
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const { R_KM, force } = L.ALTITUDE;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const proche = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);

  function tableau({ feuille, faits }) {
    // Au moins 6 altitudes réellement mesurées (dont le sol), h en km en A, F en N en B.
    const lignes = feuille.lignes(["A", "B"]);
    const mesures = faits.mesures_altitude || [];
    for (const l of lignes) {
      if (!mesures.some((m) => m.h === l.A)) return `La sonde n'a pas été arrêtée à h = ${L.nombre(l.A, 0)} km.`;
      if (!proche(l.B, force(l.A), 0.01)) return `Relisez F sur l'afficheur pour h = ${L.nombre(l.A, 0)} km.`;
    }
    if (lignes.length && !lignes.some((l) => l.A === 0)) return "Mesurez aussi F au sol (h = 0 km).";
    return new Set(lignes.map((l) => l.A)).size >= 6 || false;
  }

  function distances({ feuille }) {
    // Colonne C : d = R + h (km) ; colonne D : 1/d², sur toutes les lignes mesurées.
    const lignes = feuille.lignes(["A", "B"]);
    const completes = feuille.lignes(["A", "C", "D"]);
    if (completes.length < lignes.length || lignes.length < 6) return false;
    if (!completes.every((l) => Math.abs(l.C - (l.A + R_KM)) < 1)) return "Colonne C : d = R + h, soit =A2+6400.";
    return completes.every((l) => proche(l.D, 1 / (l.C * l.C), 0.01)) || "Colonne D : 1/d², soit =1/C2^2.";
  }

  const ALTITUDE = {
    id: "altitude", paillasse: 0, titre: "La force de gravitation et l'altitude",
    objectif: "Découvrir comment la force exercée par la Terre sur une sonde (son poids) varie quand l'altitude h augmente.",
    entetes: ["h (km)", "F (N)", "d = R+h (km)", "1/d²"],
    donnees: ["Rayon de la Terre : R = 6400 km", "Masse de la sonde : m = 1000 kg", "Au sol : g_{0} = 9,81 N/kg"],
    conclusion: "Le poids diminue avec l'altitude : F = m · g, avec g = g_{0} · R² / (R + h)². À h = R, g est divisée par 4.",
    conclusion_courte: "g = g0·R²/(R+h)².",
    etapes: [
      { consigne: "Faites monter la sonde le long du rail des altitudes. Observez la force F sur son afficheur.", court: "Faites monter la sonde.", verifier: ({ faits }) => (faits.mesures_altitude || []).some((m) => m.h >= 10000), aide_geste: "Saisissez la sonde et faites-la glisser le long du rail gradué." },
      { consigne: "Mesurez F pour au moins 6 altitudes, de 0 km à 36 000 km. Notez h (km) en A et F (N) en B.", court: "6 altitudes : notez h et F.", verifier: tableau, aide_geste: "Lâchez la sonde pour arrêter la mesure. Zoomez sur l'afficheur." },
      { consigne: "Tracez F en fonction de h.", court: "Tracez F en fonction de h.", verifier: ({ courbe }) => courbe.x === "A" && courbe.y === "B" && courbe.n >= 6 },
      { consigne: "Quand h augmente, F diminue. La courbe F = f(h) est-elle une droite ?", court: "Répondez dans le carnet.", question: choix(["Non : F diminue de moins en moins vite", "Oui : F diminue selon une droite", "F ne dépend pas de h"], "Modélisez par une droite : passe-t-elle par tous les points ?", "Exact : ce n'est pas une droite.") },
      { consigne: "En C, calculez la distance au centre de la Terre d = R + h (=A2+6400) ; en D, calculez 1/d² (=1/C2^2).", court: "Colonnes C et D : d = R + h et 1/d².", verifier: distances },
      { consigne: "Tracez F en fonction de 1/d² (colonne D) et modélisez par une droite.", court: "Tracez F en fonction de 1/d².", verifier: ({ courbe }) => courbe.x === "D" && courbe.y === "B" && courbe.n >= 6 },
      { consigne: "La force exercée par la Terre est proportionnelle à…", court: "Répondez dans le carnet.", question: choix(["1/(R + h)²", "1/h", "h"], "La courbe F = f(1/d²) est-elle une droite passant par l'origine ?", "Exact : F = F_{0} · R² / (R + h)².") },
      { consigne: "Placez la sonde à l'altitude de l'ISS (400 km). Calculez g = F / m.", court: "g à 400 km d'altitude ?", question: { type: "nombre", unite: "N/kg", attendu: force(400) / 1000, tolerance: 0.05, aide: "Lisez F à h = 400 km, puis divisez par m = 1000 kg.", bravo: "Exact : g ≈ 8,7 N/kg : à bord de l'ISS, le poids des astronautes n'est pas nul." } },
      { consigne: "D'après g = g_{0} · R² / (R + h)², que vaut g à une altitude égale au rayon de la Terre (h = R = 6400 km) ?", court: "g à h = R ?", question: choix(["g_{0} / 4 ≈ 2,45 N/kg", "g_{0} / 2 ≈ 4,9 N/kg", "0 N/kg"], "Si h = R, alors R + h = 2R.", "Exact : (2R)² = 4R², g est divisée par 4.") },
      { consigne: "Les astronautes flottent dans l'ISS. Pourquoi ?", court: "Répondez dans le carnet.", question: choix(["Leur poids n'est pas nul, mais ils tombent en même temps que la station autour de la Terre", "Il n'y a plus de pesanteur à 400 km", "Ils sont trop loin de la Terre pour être attirés"], "Comparez g à 400 km avec g_{0} = 9,81 N/kg.", "Exact : g ≈ 8,7 N/kg ; ils sont en chute libre avec la station.") },
    ],
  };

  L.demarrer({ id: "tc_meca1_o3_altitude", titre: "Observatoire : le poids en altitude", decor: "aucun", repos_carnet: { x: 740, y: 574 }, paillasses: [L.poste_altitude], missions: [ALTITUDE] });
})(window.Labo);

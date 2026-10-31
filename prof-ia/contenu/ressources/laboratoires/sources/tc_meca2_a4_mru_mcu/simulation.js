/*
Rôle : simulation de l'activité 4 du chapitre « Le mouvement » (tronc commun) : « Mettre en évidence expérimentalement
       les caractéristiques du MRU et du MCU ». Objectifs O5 (reconnaître un MRU par son équation horaire et l'utiliser)
       et O6 (représenter les vecteurs vitesse d'un MCU) ; orientation : MCU, exemples de la Lune et des satellites.
Reçoit : rien (les vérifications lisent l'enregistrement, le fil, les flèches tracées et le tableur).
Produit : la simulation démarrée : table à coussin d'air avec clou central et fil, éclateur, règle, flèches-vecteurs.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const V = L.VERIF_ENR, ECHELLE = 100, INDICES = [2, 6, 10];
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const e_ = (f) => V.dernier(f);
  const vitesse_mru = (f) => V.distance(e_(f).points[0], e_(f).points[10]) / 1000 / (10 * e_(f).tau_s);

  function mru({ faits }) {
    // Enregistrement sans fil, d'au moins 12 points alignés (sans rebond).
    const e = e_(faits);
    if (!e) return false;
    if (e.fil) return "Pour le mouvement rectiligne, lancez le mobile sans l'accrocher au fil.";
    if (e.points.length < 12 || !L.VERIF_ENR.rectiligne(e.points, 12)) return "Il faut 12 points alignés : relancez le mobile vers le milieu de la table, sans rebond.";
    return true;
  }

  function tableau_mru({ feuille, faits }) {
    // t (s) et x = M0Mi (cm) mesuré à la règle, pour i = 0 à 10.
    const e = e_(faits);
    if (!e || e.fil) return false;
    const lignes = feuille.lignes(["A", "B"]);
    for (let i = 0; i < Math.min(11, lignes.length); i++) {
      if (Math.abs(lignes[i].A - i * e.tau_s) > 0.0005) return `Ligne ${i + 2} : t = ${i} × τ (t = 0 en M0).`;
      if (Math.abs(lignes[i].B - V.distance(e.points[0], e.points[i]) / 10) > 0.15) return `Remesurez M0M${i} à la règle (en cm, au millimètre près).`;
    }
    return lignes.length >= 11 || false;
  }

  function mcu({ faits }) {
    // Enregistrement avec le fil accroché, d'au moins 12 points.
    const e = e_(faits);
    if (!faits.fil_accroche) return false;
    return (e && e.fil && e.points.length >= 12) || false;
  }

  function vecteurs({ faits }) {
    // Flèches v2, v6, v10 correctes sur l'enregistrement circulaire.
    const e = e_(faits), v = faits.vecteurs || {};
    if (!e || !e.fil) return false;
    for (const i of INDICES) {
      const r = L.vecteurs_vitesse.verifier(v[i], e.points, i, e.tau_s, ECHELLE);
      if (r !== true) return r;
    }
    return true;
  }

  const MRU = {
    id: "mru", paillasse: 0, titre: "Le mouvement rectiligne uniforme",
    objectif: "Lancer le mobile librement sur la table horizontale, puis reconnaître un mouvement rectiligne uniforme par son équation horaire.",
    entetes: ["t (s)", "x (cm)"],
    conclusion: "Mouvement rectiligne uniforme : trajectoire droite, vitesse constante ; équation horaire x = v·t + x0.",
    conclusion_courte: "MRU : x = v·t + x0.",
    etapes: [
      { consigne: "Appuyez sur « Enregistrer », puis lancez le mobile sans l'accrocher au fil.", court: "Enregistrez un lancer libre.", verifier: mru, aide_geste: "Laissez l'anneau du fil près du clou." },
      { consigne: "Prenez la feuille. Pour i = 0 à 10, notez t (s) en A et x = M0Mi (cm), mesuré à la règle, en B.", court: "Tableur : t et x = M0Mi (i = 0 à 10).", verifier: tableau_mru, aide_geste: "Posez le zéro de la règle sur M0 et alignez-la sur les points." },
      { consigne: "Tracez x en fonction de t et modélisez par une droite.", court: "Tracez x en fonction de t.", verifier: ({ courbe }) => courbe.x === "A" && courbe.y === "B" && courbe.n >= 11 && courbe.modele !== "aucun" },
      { consigne: "D'après le modèle, quelle est la vitesse du mobile (en m/s) ?", court: "Vitesse du mobile (m/s) ?", question: { type: "nombre", unite: "m/s", attendu: vitesse_mru, tolerance_relative: 0.05, aide: "Le coefficient a du modèle est en cm/s : divisez par 100.", bravo: "Exact : la vitesse est constante, c'est la pente de la droite." } },
      { consigne: "L'équation horaire du mouvement, avec l'origine en M0 et t = 0 en M0, s'écrit…", court: "Répondez dans le carnet.", question: choix(["x = v·t", "x = v·t²", "x = v / t"], "x est proportionnelle à t.", "Exact : x = v·t (ici x0 = 0).") },
      { consigne: "Utilisez l'équation horaire : quelle distance le mobile parcourrait-il en 5 s (en m) ?", court: "Distance en 5 s (m) ?", question: { type: "nombre", unite: "m", attendu: (f) => 5 * vitesse_mru(f), tolerance_relative: 0.05, aide: "x = v·t avec t = 5 s.", bravo: "Exact." } },
      { consigne: "Combien de temps lui faudrait-il pour parcourir 2 m (en s) ?", court: "Durée pour 2 m (s) ?", question: { type: "nombre", unite: "s", attendu: (f) => 2 / vitesse_mru(f), tolerance_relative: 0.05, aide: "t = x / v.", bravo: "Exact." } },
    ],
  };

  const MCU = {
    id: "mcu", paillasse: 0, titre: "Le mouvement circulaire uniforme",
    objectif: "Retenir le mobile par un fil attaché au clou central : étudier son mouvement et ses vecteurs vitesse.",
    entetes: ["i", "Mi-1Mi+1 (cm)"],
    conclusion: "Mouvement circulaire uniforme : trajectoire circulaire, valeur de la vitesse constante ; le vecteur vitesse, tangent au cercle, change de direction.",
    conclusion_courte: "MCU : v constante, direction qui tourne.",
    etapes: [
      { consigne: "Faites glisser l'anneau du fil jusqu'au mobile pour l'accrocher. Appuyez sur « Enregistrer », puis lancez le mobile : il tourne autour du clou.", court: "Accrochez le fil, enregistrez le mouvement.", verifier: mcu },
      { consigne: "Prenez la feuille. Mesurez M1M3, M5M7 et M9M11 à la règle. Ces distances sont…", court: "Répondez dans le carnet.", question: choix(["égales : la valeur de la vitesse est constante", "de plus en plus grandes", "de plus en plus petites"], "Mesurez-les au millimètre près.", "Exact : le mouvement est uniforme.") },
      { consigne: "Tracez les vecteurs vitesse en M2, M6 et M10 : faites glisser la pointe de chaque flèche (échelle : 1 cm ↔ 0,1 m/s).", court: "Tracez v2, v6 et v10.", verifier: vecteurs },
      { consigne: "Dans un mouvement circulaire uniforme, le vecteur vitesse…", court: "Répondez dans le carnet.", question: choix(["garde la même valeur mais change de direction : il est toujours tangent au cercle", "ne change pas du tout", "est dirigé vers le clou"], "Comparez vos trois flèches.", "Exact.") },
      { consigne: "Dans le référentiel géocentrique, la Lune tourne autour de la Terre sur une orbite presque circulaire, à vitesse constante. Son mouvement est…", court: "Répondez dans le carnet.", question: choix(["circulaire uniforme (à peu près)", "rectiligne uniforme", "immobile"], "Pensez à la trajectoire et à la vitesse.", "Exact, comme celui des satellites géostationnaires.") },
    ],
  };

  L.demarrer({
    id: "tc_meca2_a4_mru_mcu", titre: "Laboratoire : MRU et MCU",
    paillasses: [(g) => L.poste_coussin_air(g, { fil: true, outils: ["regle"], vecteurs: { indices: INDICES, echelle_mm_par_ms: ECHELLE } })],
    missions: [MRU, MCU],
  });
})(window.Labo);

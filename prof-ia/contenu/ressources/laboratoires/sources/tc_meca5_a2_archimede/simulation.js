/*
Rôle : simulation de l'activité 2 du chapitre « Équilibre d'un solide » (tronc commun) : « Mesure de la poussée
       d'Archimède ». Objectif O2 (connaître la poussée d'Archimède F = ρ·V·g et ses caractéristiques).
Reçoit : rien (les vérifications lisent les mesures notées par la paillasse : solide, liquide, immersion).
Produit : la simulation démarrée : dynamomètre, deux cylindres de 50 cm³, eau et eau salée, support élévateur.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const G = 9.81, V = 50, ALU = 135, POM = 70;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (attendu, aide) => ({ type: "nombre", unite: "N", attendu, tolerance: 0.03, aide, bravo: "Exact." });
  const mesure = (solide, liquide, immersion) => ({ faits }) => (faits.mesures_archimede || []).some((m) => m.solide === solide && (liquide === null || m.liquide === liquide) && Math.abs(m.immersion - immersion) < 0.06) || false;
  const poussee = (rho) => rho * V * 1e-6 * G;

  const MESURE = {
    id: "mesure", paillasse: 0, titre: "Mesurer la poussée d'Archimède",
    objectif: `Un cylindre d'aluminium (${V} cm³) est pesé dans l'air, puis plongé dans l'eau. Que devient l'indication du dynamomètre ?`,
    entetes: [],
    conclusion: "Un liquide exerce sur un corps immergé une poussée verticale, vers le haut : F = P − P' (poids réel moins poids apparent). Elle dépend du volume immergé.",
    conclusion_courte: "Poussée : F = P − P'.",
    etapes: [
      { consigne: "Accrochez le cylindre d'aluminium au crochet du dynamomètre, hors de l'eau.", court: "Accrochez le cylindre d'aluminium.", verifier: mesure("alu", null, 0), aide_geste: "Si besoin, baissez le support élévateur en faisant glisser ses bras croisés." },
      { consigne: "Lisez son poids P sur le dynamomètre (en N).", court: "Poids P (N) ?", question: nombre((ALU / 1000) * G, "Zoomez sur l'index rouge ; un petit trait vaut 0,05 N.") },
      { consigne: "Faites monter le support élévateur (glissez ses bras croisés vers le haut) jusqu'à ce que le cylindre soit entièrement dans l'eau.", court: "Immergez entièrement le cylindre.", verifier: mesure("alu", "eau", 1) },
      { consigne: "Lisez le « poids apparent » P' indiqué par le dynamomètre (en N).", court: "Poids apparent P' (N) ?", question: nombre((ALU / 1000) * G - poussee(1000), "Le dynamomètre indique moins que dans l'air.") },
      { consigne: "Calculez la poussée d'Archimède F = P − P' (en N).", court: "Poussée F (N) ?", question: nombre(poussee(1000), "Différence de vos deux lectures.") },
      { consigne: "Baissez le support pour que le cylindre ne soit plus immergé qu'à moitié.", court: "Immergez le cylindre à moitié.", verifier: mesure("alu", "eau", 0.5) },
      { consigne: "À moitié immergé, la poussée est…", court: "Répondez dans le carnet.", question: choix(["deux fois plus petite : elle dépend du volume immergé", "la même", "nulle"], "Comparez P − P' dans les deux cas.", "Exact.") },
    ],
  };

  const FACTEURS = {
    id: "facteurs", paillasse: 0, titre: "De quoi dépend la poussée ?",
    objectif: "Changer de solide (même volume, masse différente), puis changer de liquide.",
    entetes: [],
    conclusion: "Poussée d'Archimède : F = ρ·V·g (ρ : masse volumique du liquide, V : volume immergé). Verticale, vers le haut. Elle ne dépend pas de la masse du solide.",
    conclusion_courte: "F = ρ·V·g, vers le haut.",
    etapes: [
      { consigne: `Accrochez le cylindre en plastique (lui aussi ${V} cm³) : pesez-le dans l'air, puis immergez-le entièrement dans l'eau.`, court: "Plastique : dans l'air, puis dans l'eau.", verifier: (c) => mesure("pom", null, 0)(c) && mesure("pom", "eau", 1)(c) },
      { consigne: "Calculez P − P' pour ce cylindre. Comparée à celle de l'aluminium, la poussée est…", court: "Répondez dans le carnet.", question: choix(["la même : elle ne dépend pas de la masse du solide", "plus petite", "plus grande"], "Les deux cylindres ont le même volume.", "Exact.") },
      { consigne: "Baissez le plateau, remplacez le bécher d'eau par celui d'eau salée, et immergez entièrement le cylindre d'aluminium.", court: "Aluminium dans l'eau salée.", verifier: mesure("alu", "sale", 1), aide_geste: "Faites glisser le bécher d'eau salée sur le plateau baissé." },
      { consigne: "Dans l'eau salée (plus dense que l'eau), la poussée est…", court: "Répondez dans le carnet.", question: choix(["plus grande : elle dépend de la masse volumique du liquide", "la même", "plus petite"], "Comparez les poids apparents.", "Exact.") },
      { consigne: `Calculez F = ρ·V·g pour le cylindre entièrement immergé dans l'eau (ρ = 1000 kg/m³, V = ${V} cm³), en N.`, court: "ρ·V·g (N) ?", question: { type: "nombre", unite: "N", attendu: poussee(1000), tolerance: 0.01, aide: "V = 50 × 10⁻⁶ m³ ; g = 9,81 N/kg.", bravo: "Exact : c'est bien la poussée mesurée." } },
      { consigne: "La poussée d'Archimède est…", court: "Répondez dans le carnet.", question: choix(["verticale, vers le haut, de valeur ρ·V·g", "verticale, vers le bas", "horizontale"], "Elle allège le corps immergé.", "Exact.") },
    ],
  };

  L.demarrer({
    id: "tc_meca5_a2_archimede", titre: "Laboratoire : la poussée d'Archimède",
    paillasses: [(g) => L.poste_archimede(g, {
      solides: [{ id: "alu", nom: "aluminium", v_cm3: V, masse_g: ALU, couleur: "url(#metal-h)", repos: 300 }, { id: "pom", nom: "plastique", v_cm3: V, masse_g: POM, couleur: "#ece4cf", repos: 350 }],
      liquides: [{ id: "eau", nom: "eau", rho: 1000, couleur: "#7fb8d9", repos: 790 }, { id: "sale", nom: "eau salée", rho: 1200, couleur: "#9cc7b4", repos: 790 }],
    })],
    missions: [MESURE, FACTEURS],
  });
})(window.Labo);

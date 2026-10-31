/*
Rôle : simulation de l'activité 3 du chapitre « Modulation d'amplitude » (2e année du bac) : réaliser librement un
       récepteur radio AM simple (antenne, terre, circuit d'accord L∥C — circuit bouchon —, détecteur d'enveloppe,
       écouteur), l'accorder sur trois émetteurs, relier la fréquence d'accord à f₀ = 1/(2π√(LC)), connaître le rôle de
       chaque élément. Objectifs O4, O5.
Reçoit : rien (les vérifications lisent les faits « recepteur », « ecoute »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const R = (f) => f.recepteur || {}, E = (f) => f.ecoute || {};
  const nette = (f, s) => E(f).station === s && E(f).clarte > 0.9;

  const RECEPTEUR = {
    id: "recepteur", paillasse: 0, titre: "Réaliser un récepteur AM",
    objectif: "Assembler un récepteur radio AM avec les pièces de la paillasse ; l'accorder sur un émetteur.",
    entetes: [],
    donnees: ["Bobine d'accord : L = 1,0 mH", "Fréquence d'accord du circuit L∥C : f₀ = 1 / (2π√(LC))", "Émetteurs : A 171 kHz, B 207 kHz, C 252 kHz"],
    conclusion: "Un récepteur AM simple comprend : une antenne (et une prise de terre) qui capte les ondes de tous les émetteurs et les transforme en tensions ; un circuit d'accord L∥C (circuit bouchon) qui sélectionne l'émetteur dont la fréquence vaut f₀ = 1/(2π√(LC)) ; un détecteur d'enveloppe (diode puis R∥C) qui démodule ; un écouteur (ou un amplificateur et un haut-parleur) qui transforme le signal en son. On change de station en réglant le condensateur variable.",
    conclusion_courte: "Antenne, accord L∥C, détecteur, écouteur.",
    etapes: [
      { consigne: "Réalisez un récepteur avec les pièces : antenne et terre, circuit d'accord (bobine et condensateur variable en parallèle entre l'antenne et la terre), détecteur d'enveloppe (diode, puis résistance et condensateur en parallèle vers la terre), écouteur.", court: "Réalisez le récepteur.", aide_geste: "Vous êtes libre du câblage, tant que chaque fonction est réalisée. L'oscilloscope (masse à la terre) vous aide.", verifier: ({ faits }) => (R(faits).accord && R(faits).diode && R(faits).detecteur && R(faits).ecouteur) || false },
      { consigne: "Réglez le condensateur variable pour entendre nettement la station B (touchez l'écouteur pour écouter).", court: "Accordez sur la station B.", aide_geste: "Touches « et » : 100 pF ; − et + : 10 pF.", verifier: ({ faits }) => nette(faits, "B") || false },
      { consigne: "Capacité du condensateur variable quand la station B est nette (pF) ?", court: "C (pF) ?", question: nombre("pF", (f) => E(f).CV || 590, 1, "Lisez l'afficheur du condensateur variable.", "Exact.") },
      { consigne: "Calculez f₀ = 1/(2π√(LC)) avec L = 1,0 mH et votre capacité (kHz).", court: "f₀ (kHz) ?", question: nombre("kHz", (f) => (E(f).f0 || 207000) / 1000, 3, "C en farads : 1 pF = 10⁻¹² F.", "Exact : f₀ est proche de 207 kHz, la fréquence de la station B.") },
      { consigne: "Le circuit d'accord L∥C (circuit bouchon)…", court: "Répondez dans le carnet.", question: choix(["sélectionne l'émetteur dont la fréquence est égale à sa fréquence propre f₀", "démodule le signal", "produit l'onde porteuse"], "Que se passe-t-il quand on tourne le condensateur variable ?", "Exact.") },
      { consigne: "Accordez le récepteur sur les stations A et C.", court: "Écoutez A et C.", verifier: ({ faits }) => ["A", "C"].every((s) => (E(faits).entendues || []).includes(s)) || false },
      { consigne: "Pour passer de la station A (171 kHz) à la station C (252 kHz), on a…", court: "Répondez dans le carnet.", question: choix(["diminué la capacité C : f₀ = 1/(2π√(LC)) augmente", "augmenté la capacité C", "changé la diode"], "Comparez les capacités.", "Exact.") },
    ],
  };

  const ROLES = {
    id: "roles", paillasse: 0, titre: "Rôle de chaque élément",
    objectif: "Relier chaque élément du récepteur à sa fonction ; voir les tensions à l'oscilloscope.",
    entetes: [],
    donnees: ["Voie 1 : antenne (tension modulée) ; voie 2 : sortie du détecteur", "Masse de l'oscilloscope : la terre"],
    conclusion: "La tension de l'antenne, après le circuit d'accord, est la tension modulée de la station choisie. Le détecteur d'enveloppe en extrait l'enveloppe ; l'écouteur, dont la membrane ne suit pas la porteuse, transforme le signal modulant en son. La chaîne d'un récepteur AM est : antenne → circuit d'accord → démodulateur → (amplificateur) → écouteur ou haut-parleur.",
    conclusion_courte: "Antenne → accord → démodulation → écouteur.",
    etapes: [
      { consigne: "Branchez l'oscilloscope : masse à la terre, voie 1 sur l'antenne, voie 2 sur la sortie de la diode (détecteur). Observez les deux tensions.", court: "Observez à l'oscilloscope.", verifier: ({ faits }) => { const o = faits.oscillo || {}; return (o.u_max > 0.5 && o.ch2 && o.ch2.u_max > 0.3) || false; } },
      { consigne: "Le rôle de l'antenne est…", court: "Répondez dans le carnet.", question: choix(["de capter les ondes électromagnétiques de tous les émetteurs et de les transformer en tensions électriques", "de choisir un émetteur", "de démoduler le signal"], "Sans circuit d'accord, entend-on une station ?", "Exact.") },
      { consigne: "Le détecteur d'enveloppe…", court: "Répondez dans le carnet.", question: choix(["extrait l'enveloppe de la tension modulée : il démodule", "sélectionne la station", "émet l'onde"], "Comparez les voies 1 et 2.", "Exact.") },
      { consigne: "Dans l'ordre, la chaîne d'un récepteur AM est…", court: "Répondez dans le carnet.", question: choix(["antenne → circuit d'accord → démodulateur → amplificateur → haut-parleur", "haut-parleur → antenne → démodulateur → accord", "démodulateur → antenne → accord → écouteur"], "Suivez le trajet du signal.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_elec5_a3_recepteur", titre: "Laboratoire : récepteur radio AM", decor: "aucun", paillasses: [L.poste_recepteur], missions: [RECEPTEUR, ROLES] });
})(window.Labo);

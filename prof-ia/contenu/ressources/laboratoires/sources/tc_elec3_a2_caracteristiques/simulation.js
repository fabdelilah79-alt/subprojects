/*
Rôle : simulation de l'activité 2 du chapitre « Montages électriques » (tronc commun) : caractéristiques de dipôles
       passifs. Objectifs O4 (caractéristique ; tension de seuil, tension Zener, Zener observée à l'oscilloscope) et
       O5 (dipôles commandés : thermistance et photorésistance, mesurées à l'ohmmètre).
Reçoit : Labo.MISSIONS_CARACTERISTIQUES (missions_caracteristiques.js).
Produit : la simulation démarrée : résistance et lampe ; diode ; Zener à l'oscilloscope ; capteurs.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const O = (faits) => faits.oscillo || {};
  const ecretee = ({ faits }) => { const o = O(faits); return (o.gbf && o.gbf.Umax >= 7 && o.u_max > 4.8 && o.u_max < 5.6 && o.u_min < -0.5 && o.u_min > -0.95) || false; };

  const ZENER = {
    id: "zener", paillasse: 2, titre: "La diode Zener à l'oscilloscope",
    objectif: "Observer à l'oscilloscope la tension aux bornes d'une diode Zener alimentée par une tension sinusoïdale.",
    entetes: [],
    conclusion: "En sens inverse, une diode Zener conduit dès que la tension à ses bornes atteint sa tension Zener Uz (ici 5,1 V) : elle maintient alors cette tension. En sens direct, elle se comporte comme une diode ordinaire (environ −0,7 V ici).",
    conclusion_courte: "Zener : tension maintenue à Uz en inverse.",
    etapes: [
      { consigne: "Réalisez le montage : SORTIE du GBF vers la résistance R, R vers la cathode K de la Zener, anode A vers la masse du GBF. Branchez l'oscilloscope aux bornes de la Zener : Y1 sur K, masse sur A.", court: "GBF, R et Zener ; oscilloscope sur la Zener.", verifier: ecretee, aide_geste: "Le GBF délivre une sinusoïde de 8 V d'amplitude." },
      { consigne: "Lisez la tension maximale aux bornes de la Zener (en V).", court: "Umax aux bornes de la Zener (V) ?", question: { type: "nombre", unite: "V", attendu: (faits) => O(faits).u_max || 5.1, tolerance: 0.25, aide: "Sv × nombre de divisions au-dessus du niveau de la masse.", bravo: "Exact : c'est la tension Zener, environ 5,1 V." } },
      { consigne: "La sinusoïde du GBF monte jusqu'à 8 V, mais la tension aux bornes de la Zener ne dépasse pas 5,1 V. En effet…", court: "Répondez dans le carnet.", question: choix(["au-delà de Uz, la Zener conduit en sens inverse et maintient sa tension à Uz", "le GBF est réglé trop bas", "la Zener ne conduit jamais en sens inverse"], "La partie haute de la courbe est coupée à plat.", "Exact.") },
      { consigne: "Pendant l'alternance négative, la tension reste vers −0,7 V. La Zener se comporte alors…", court: "Répondez dans le carnet.", question: choix(["comme une diode ordinaire passante en sens direct", "comme un interrupteur ouvert", "comme une résistance de 470 Ω"], "Dans ce sens, le courant va de A vers K.", "Exact.") },
    ],
  };

  const CAPTEURS = {
    id: "capteurs", paillasse: 3, titre: "Thermistance et photorésistance",
    objectif: "Comment la résistance d'une thermistance et d'une photorésistance dépend-elle de la température et de la lumière ?",
    entetes: [],
    conclusion: "La résistance d'une thermistance CTN diminue quand la température augmente ; celle d'une photorésistance diminue quand l'éclairement augmente. Ce sont des dipôles commandés, utilisés comme capteurs.",
    conclusion_courte: "CTN : R diminue si θ augmente ; LDR : R diminue si la lumière augmente.",
    etapes: [
      { consigne: "Branchez l'ohmmètre (calibre 20 kΩ, puis 200 kΩ si besoin) aux bornes de la thermistance. Plongez sa sonde dans l'eau glacée, puis dans l'eau du robinet et dans l'eau chaude ; attendez chaque fois que la mesure se stabilise.", court: "CTN : eau glacée, robinet, chaude.", verifier: ({ faits }) => Object.keys(faits.mesures_ctn || {}).length >= 3 || false, aide_geste: "Faites glisser la sonde noire dans un bécher." },
      { consigne: "Quand la température augmente, la résistance de la thermistance CTN…", court: "Répondez dans le carnet.", question: choix(["diminue (coefficient de température négatif)", "augmente", "ne change pas"], "Comparez les trois mesures.", "Exact.") },
      { consigne: "Branchez l'ohmmètre aux bornes de la photorésistance. Mesurez sa résistance à la lumière de la salle, puis éclairée de près par la lampe de poche, puis sous le cache noir.", court: "LDR : salle, lampe proche, cache.", verifier: ({ faits }) => Object.keys(faits.mesures_ldr || {}).length >= 3 || false, aide_geste: "Approchez la lampe de poche à moins de 10 cm ; posez le cache sur la cellule." },
      { consigne: "Plus la photorésistance est éclairée…", court: "Répondez dans le carnet.", question: choix(["plus sa résistance est petite", "plus sa résistance est grande", "sa résistance ne dépend pas de la lumière"], "Comparez la mesure sous le cache et celle avec la lampe.", "Exact.") },
      { consigne: "On veut allumer automatiquement l'éclairage d'une rue à la tombée de la nuit. Quel dipôle commandé utiliser comme capteur ?", court: "Répondez dans le carnet.", question: choix(["une photorésistance", "une thermistance", "une diode Zener"], "Quelle grandeur change à la tombée de la nuit ?", "Exact.") },
    ],
  };

  const [RESISTANCE, LAMPE, DIODE] = L.MISSIONS_CARACTERISTIQUES;
  L.demarrer({ id: "tc_elec3_a2_caracteristiques", titre: "Laboratoire : caractéristiques de dipôles", decor: "aucun", paillasses: [L.poste_resistance_lampe, L.poste_diode, L.poste_zener, L.poste_capteurs], missions: [RESISTANCE, LAMPE, DIODE, ZENER, CAPTEURS] });
})(window.Labo);

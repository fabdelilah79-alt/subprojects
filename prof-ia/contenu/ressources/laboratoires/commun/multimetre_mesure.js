/*
Rôle : ce que mesure le multimètre selon la position de son commutateur : tension continue (V⎓), tension alternative
       (V~, valeur efficace vraie « TRMS »), intensité continue (A⎓). Calibres, résolution et précision comme sur un
       appareil réel à 2000 points ; au-delà du calibre, l'afficheur montre « 1 ».
Reçoit : l'état du multimètre (mode, tensions et courants reçus du circuit).
Produit : Labo.MULTIMETRE_MODES (positions du commutateur), Labo.multimetre_lire(comp) -> { valeur, lecture, unite, depasse } ;
          Labo.multimetre_incertitude(mode, valeur) -> incertitude de la notice (même unité que valeur).
Utilisé par : multimetre.js.
*/
(function (L) {
  // precision : [part de la lecture, nombre d'unités du dernier chiffre] (notice de l'appareil).
  L.MULTIMETRE_MODES = [
    { nom: "OFF", angle: 0, texte: "OFF" },
    { nom: "200mV", angle: 30, texte: "200m", type: "V", calibre: 0.2, unite: "mV", facteur: 1000, decimales: 1, precision: [0.005, 2] },
    { nom: "2V", angle: 60, texte: "2", type: "V", calibre: 2, unite: "V", facteur: 1, decimales: 3, precision: [0.005, 2] },
    { nom: "20V", angle: 90, texte: "20", type: "V", calibre: 20, unite: "V", facteur: 1, decimales: 2, precision: [0.005, 2] },
    { nom: "200V", angle: 120, texte: "200", type: "V", calibre: 200, unite: "V", facteur: 1, decimales: 1, precision: [0.005, 2] },
    { nom: "200V~", angle: 150, texte: "200", type: "VAC", calibre: 200, unite: "V", facteur: 1, decimales: 1, precision: [0.01, 3] },
    { nom: "20V~", angle: 180, texte: "20", type: "VAC", calibre: 20, unite: "V", facteur: 1, decimales: 2, precision: [0.01, 3] },
    { nom: "10A", angle: 210, texte: "10A", type: "A", borne: "10A", calibre: 10, unite: "A", facteur: 1, decimales: 2, precision: [0.02, 3] },
    { nom: "200mA", angle: 240, texte: "200m", type: "A", borne: "mA", calibre: 0.2, unite: "mA", facteur: 1000, decimales: 1, precision: [0.01, 2] },
    { nom: "20mA", angle: 270, texte: "20m", type: "A", borne: "mA", calibre: 0.02, unite: "mA", facteur: 1000, decimales: 2, precision: [0.01, 2] },
  ];
  L.MULTIMETRE_GROUPES = [{ type: "V", texte: "V⎓", angle: 75, couleur: "#f4f4ee" }, { type: "VAC", texte: "V~", angle: 165, couleur: "#ffb74d" }, { type: "A", texte: "A⎓", angle: 255, couleur: "#80deea" }];
  const EFFICACE = { sinus: Math.SQRT1_2, triangle: 1 / Math.sqrt(3), carre: 1 };

  L.multimetre_lire = function (comp) {
    // Valeur mesurée (V ou A, signée en continu) et texte de l'afficheur pour le mode choisi.
    const m = L.MULTIMETRE_MODES.find((k) => k.nom === comp.mode);
    if (!m.type) return { valeur: 0, lecture: "", unite: "", depasse: false };
    let v = 0;
    if (m.type === "V") v = comp.u_continue;
    else if (m.type === "VAC") v = comp.alternatif ? Math.abs(comp.u_alternative) * comp.alternatif.Umax * EFFICACE[comp.alternatif.forme] : 0;
    else v = comp.courants[m.borne];
    const resolution = Math.pow(10, -m.decimales) / m.facteur, depasse = Math.abs(v) > m.calibre - resolution / 2;
    return { valeur: v, lecture: depasse ? "1" : (v * m.facteur).toFixed(m.decimales), unite: m.unite, depasse };
  };

  L.multimetre_incertitude = function (mode, valeur) {
    // Incertitude de la notice : p % de la lecture + n unités du dernier chiffre affiché (dans l'unité de valeur, V ou A).
    const m = L.MULTIMETRE_MODES.find((k) => k.nom === mode);
    return m.precision[0] * Math.abs(valeur) + (m.precision[1] * Math.pow(10, -m.decimales)) / m.facteur;
  };
})(window.Labo);

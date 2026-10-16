/*
Rôle : ce que mesure le multimètre selon la position de son commutateur : tension continue (V⎓), tension alternative
       (V~, valeur efficace vraie « TRMS »), intensité continue (A⎓), résistance (Ω : l'appareil envoie un petit courant
       de test et mesure la tension). Calibres, résolution et précision d'un appareil réel à 2000 points ; au-delà du
       calibre (ou circuit ouvert en ohmmètre), l'afficheur montre « 1 ».
Reçoit : l'état du multimètre (mode, tension continue, onde de tension s'il y a un GBF, courants reçus du circuit).
Produit : Labo.MULTIMETRE_MODES (positions du commutateur), Labo.multimetre_lire(comp) -> { valeur, lecture, unite, depasse } ;
          Labo.multimetre_incertitude(mode, valeur) -> incertitude de la notice (même unité que valeur).
Utilisé par : multimetre.js.
*/
(function (L) {
  // precision : [part de la lecture, nombre d'unités du dernier chiffre] (notice de l'appareil).
  L.MULTIMETRE_MODES = [
    { nom: "OFF", angle: 0, texte: "OFF" },
    { nom: "2V", angle: 30, texte: "2", type: "V", calibre: 2, unite: "V", facteur: 1, decimales: 3, precision: [0.005, 2] },
    { nom: "20V", angle: 60, texte: "20", type: "V", calibre: 20, unite: "V", facteur: 1, decimales: 2, precision: [0.005, 2] },
    { nom: "200V", angle: 90, texte: "200", type: "V", calibre: 200, unite: "V", facteur: 1, decimales: 1, precision: [0.005, 2] },
    { nom: "20V~", angle: 120, texte: "20", type: "VAC", calibre: 20, unite: "V", facteur: 1, decimales: 2, precision: [0.01, 3] },
    { nom: "10A", angle: 150, texte: "10A", type: "A", borne: "10A", calibre: 10, unite: "A", facteur: 1, decimales: 2, precision: [0.02, 3] },
    { nom: "200mA", angle: 180, texte: "200m", type: "A", borne: "mA", calibre: 0.2, unite: "mA", facteur: 1000, decimales: 1, precision: [0.01, 2] },
    { nom: "20mA", angle: 210, texte: "20m", type: "A", borne: "mA", calibre: 0.02, unite: "mA", facteur: 1000, decimales: 2, precision: [0.01, 2] },
    { nom: "200Ω", angle: 240, texte: "200", type: "R", calibre: 200, test: 1e-3, unite: "Ω", facteur: 1, decimales: 1, precision: [0.008, 3] },
    { nom: "2kΩ", angle: 270, texte: "2k", type: "R", calibre: 2000, test: 1e-3, unite: "kΩ", facteur: 1e-3, decimales: 3, precision: [0.008, 3] },
    { nom: "20kΩ", angle: 300, texte: "20k", type: "R", calibre: 20000, test: 1e-4, unite: "kΩ", facteur: 1e-3, decimales: 2, precision: [0.008, 3] },
    { nom: "200kΩ", angle: 330, texte: "200k", type: "R", calibre: 200000, test: 1e-5, unite: "kΩ", facteur: 1e-3, decimales: 1, precision: [0.008, 3] },
  ];
  L.MULTIMETRE_GROUPES = [{ type: "V", texte: "V⎓", angle: 60, couleur: "#f4f4ee" }, { type: "VAC", texte: "V~", angle: 120, couleur: "#ffb74d" }, { type: "A", texte: "A⎓", angle: 180, couleur: "#80deea" }, { type: "R", texte: "Ω", angle: 285, couleur: "#c5e1a5" }];
  const COMPLIANCE_V = 2.8;
  const moyenne = (t) => t.reduce((s, v) => s + v, 0) / t.length;

  L.multimetre_lire = function (comp) {
    // Valeur mesurée (V, A ou Ω) et texte de l'afficheur pour le mode choisi. En V~ : valeur efficace vraie (TRMS)
    // de la partie variable ; en V⎓ : valeur moyenne ; en Ω : tension aux bornes divisée par le courant de test.
    const m = L.MULTIMETRE_MODES.find((k) => k.nom === comp.mode);
    if (!m.type) return { valeur: 0, lecture: "", unite: "", depasse: false };
    const onde = comp.onde, moy = onde ? moyenne(onde) : comp.u_continue;
    let v = 0, hors = false;
    if (m.type === "V") v = moy;
    else if (m.type === "VAC") v = onde ? Math.sqrt(Math.max(0, moyenne(onde.map((x) => x * x)) - moy * moy)) : 0;
    else if (m.type === "A") v = comp.courants[m.borne];
    else { v = comp.u_continue / m.test; hors = comp.u_continue > COMPLIANCE_V || v < 0; }
    const resolution = Math.pow(10, -m.decimales) / m.facteur, depasse = hors || Math.abs(v) > m.calibre - resolution / 2;
    return { valeur: v, lecture: depasse ? "1" : (v * m.facteur).toFixed(m.decimales), unite: m.unite, depasse };
  };

  L.multimetre_incertitude = function (mode, valeur) {
    // Incertitude de la notice : p % de la lecture + n unités du dernier chiffre affiché (dans l'unité de valeur, V ou A).
    const m = L.MULTIMETRE_MODES.find((k) => k.nom === mode);
    return m.precision[0] * Math.abs(valeur) + (m.precision[1] * Math.pow(10, -m.decimales)) / m.facteur;
  };
})(window.Labo);

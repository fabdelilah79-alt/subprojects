/*
Rôle : paillasse des tests des groupes caractéristiques : cinq tubes A à E (éthanol, éthanal, propanone, acide éthanoïque,
       2-méthylpropan-2-ol, en solution, 2 mL ; l'élève ne connaît que la liste), flacons de 2,4-DNPH, de liqueur de Fehling,
       de BBT et de permanganate acidifié, bain-marie à 80 °C pour le test de Fehling, touche « Nouveaux tubes ».
       Lunettes et gants exigés (DNPH, permanganate).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_groupes(g) -> { pense_bete } ; fait « groupes » = { A…E : { dnph, fehling, bbt, mno4 } } : pour chaque
          test déjà fait sur le tube, le résultat observé (dnph : précipité ; fehling : rouge brique ; bbt : jaune, vert ou
          bleu ; mno4 : décoloré) ; un test pas encore fait vaut null.
Utilisé par : simulation.js.
*/
(function (L) {
  const SOL = 576, E = 1.6, LETTRES = ["A", "B", "C", "D", "E"];
  const ECHANTILLONS = ["org_ethanol", "org_ethanal", "org_propanone", "org_acide", "org_tertiaire"];

  function resultats(t) {
    // Ce que l'on voit dans le tube pour chaque réactif présent.
    const ph = t.c.phases.find((p) => p.classe === "aqueuse") || { liquides: {}, dissous: {}, V: 0 }, a = (n) => (ph.liquides[n] || 0) > 0, c = (s) => L.concentration(ph, s);
    const pH = L.pH_phase(ph) ?? 7;
    return {
      dnph: a("org_dnph") ? c("hydrazone") > 1e-3 : null,
      fehling: a("fehling") ? (t.c.avance || 0) > 0.4 : null,
      bbt: a("ab_bbt") ? (pH < 6 ? "jaune" : pH <= 7.6 ? "vert" : "bleu") : null,
      mno4: a("org_permanganate") ? c("MnO4-") < 2e-5 : null,
    };
  }

  L.poste_groupes = function (g) {
    // Tubes, réactifs, bain-marie ; les résultats observés sont gardés (même après « Nouveaux tubes »).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230), ctx = L.paillasse_chimie(g), calque = L.svg("g", { "pointer-events": "none" }, g);
    const dire = (t) => { calque.replaceChildren(); if (t) { L.svg("rect", { x: 380, y: 236, width: 320, height: 26, rx: 5, fill: "#fff6e0", stroke: "#d08a1a" }, calque); L.texte(calque, 540, 249, t, { "font-size": 7.4, "font-weight": 700, fill: "#6b3d00" }); } };
    L.ecoulement(ctx, { sol: SOL, e: E });
    const epi = L.equipement(g, { x: 300, y: 70, changer: () => dire("") }), proteger = () => epi.protege() || (dire("Mettez lunettes et gants : ces réactifs sont dangereux."), false);
    const bain = L.bain_marie_physique(ctx, { x: 760, sol: SOL, e: E, T: 80 });
    const rack = L.porte_tubes(ctx, { x: 300, sol: SOL, e: E, n: 5, pas: 30 });
    const tubes = ECHANTILLONS.map((s, k) => { const t = L.recipient(ctx, { id: `t${LETTRES[k]}`, profil: "tube", x: rack[k].x, y: rack[k].y, contenu: { [s]: 2 }, etiquette: LETTRES[k] }); t.place = rack[k]; L.manipuler(ctx, t, { sol: SOL, supports: [...rack, ...bain.places], pose_libre: false }); return t; });
    [["org_dnph", "2,4-DNPH", true], ["fehling", "Liqueur de\nFehling"], ["ab_bbt", "BBT"], ["org_permanganate", "Permanganate\nacidifié", true]].forEach(([liquide, texte, danger], k) => L.flacon_gouttes(ctx, { id: liquide, x: 450 + k * 62, sol: SOL, e: E, liquide, texte, autoriser: danger ? proteger : () => true }));
    L.bouton_texte(g, 140, 250, "Nouveaux tubes", () => { tubes.forEach((t, k) => { t.c = L.contenu({ [ECHANTILLONS[k]]: 2 }); t.sig = null; if (t.place?.bain) t.c.T = 80; }); dire("Tubes rincés et remplis de nouveau (2 mL)."); });
    ctx.ecoulement.sur_pas(() => tubes.forEach((t) => { if (L.reagir(t.c)) t.sig = null; }));
    const vus = Object.fromEntries(LETTRES.map((l) => [l, { dnph: null, fehling: null, bbt: null, mno4: null }]));
    setInterval(() => {
      tubes.forEach((t, k) => { const r = resultats(t), v = vus[LETTRES[k]]; for (const [cle, x] of Object.entries(r)) if (x !== null && (v[cle] === null || x === true || cle === "bbt")) v[cle] = x; });
      L.missions.noter("groupes", JSON.parse(JSON.stringify(vus)));
    }, 400);
    return { pense_bete };
  };
})(window.Labo);

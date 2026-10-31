/*
Rôle : missions « caractéristique de transfert » (objectif O4) et « suiveur » (objectif O5) de l'activité 2 du chapitre
       « Montages électroniques », et outils partagés par les missions des montages à AO.
Reçoit : rien (les vérifications lisent les mesures, la feuille et la courbe du tableur).
Produit : Labo.MISSIONS_AO = { transfert, suiveur, outils : { choix, montage, bien_regle } }.
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const T = (faits) => faits.transfert || {}, montage = (type) => (faits) => faits[`montage_${type}`] || {};

  function bien_regle(type, egales = false) {
    // Les deux courbes doivent tenir dans l'écran et occuper au moins 1,5 division (même sensibilité si egales).
    return ({ faits }) => {
      const m = montage(type)(faits), o = faits[`oscillo_${type}`] || {}, Sv = o.Sv, Sv2 = (o.ch2 || {}).Sv;
      const h1 = m.ue_max / Sv, h2 = Math.max(m.us_max, -m.us_min) / Sv2;
      if (!m.monte || !(m.ue_max > 0.3)) return false;
      if (h1 > 4 || h2 > 4) return "Une courbe sort de l'écran : augmentez la sensibilité (V/div) de cette voie.";
      if (h1 < 1.5 || h2 < 1.5) return "Une courbe est trop petite : diminuez la sensibilité (V/div) de cette voie.";
      return !egales || Sv === Sv2 || "Pour comparer, réglez les deux voies sur la même sensibilité.";
    };
  }

  function feuille_transfert({ feuille, faits, courbe }) {
    // Lignes : ε (A) et Us (B) lus sur les voltmètres ; au moins 8 points, de part et d'autre de ε = 0.
    const lignes = feuille.lignes(["A", "B"]), pts = T(faits).points || [];
    for (const [k, l] of lignes.entries()) {
      if (!pts.some((p) => Math.abs(p.eps - l.A) <= 0.015 && Math.abs(p.us - l.B) <= 0.015)) return `Ligne ${k + 2} : ce couple (ε, Us) ne correspond à aucune mesure faite.`;
    }
    if (lignes.length < 8) return false;
    if (!lignes.some((l) => l.A < 0) || !lignes.some((l) => l.A >= 0)) return "Il faut des points avec ε négatif et avec ε positif.";
    return (courbe.x === "A" && courbe.y === "B" && courbe.n >= 8) || "Tracez Us (B) en fonction de ε (A).";
  }

  const TRANSFERT = {
    id: "transfert", paillasse: 0, titre: "La caractéristique de transfert",
    objectif: "Comment la tension de sortie Us d'un AO dépend-elle de la tension d'entrée différentielle ε = V+ − V− ?",
    entetes: ["ε (V)", "Us (V)"],
    conclusion: "Sans liaison entre la sortie et l'entrée e−, l'AO est saturé : Us = +Vsat si ε > 0, Us = −Vsat si ε < 0 (Vsat ≈ 13,5 V pour une alimentation ±15 V). Le régime linéaire (Us = A·ε, A ≈ 2·10⁵) n'existe que pour |ε| < 0,1 mV : pour l'AO idéal, ε = 0 en régime linéaire, et les courants d'entrée sont nuls (i+ = i− = 0).",
    conclusion_courte: "Saturation : Us = ±Vsat ; linéaire : ε = 0 ; i+ = i− = 0.",
    etapes: [
      { consigne: "Un AO doit être alimenté : reliez ses bornes +15, 0 et −15 à celles de l'alimentation symétrique.", court: "Alimentez l'AO (+15, 0, −15).", verifier: ({ faits }) => T(faits).alimente || false },
      { consigne: "G (+) → e+ ; pile (+) → e− ; bornes − de G et de la pile → 0 de l'AO. Voltmètre V1 (20 V⎓) : VΩ sur e+, COM sur e− (il mesure ε). Voltmètre V2 (20 V⎓) : VΩ sur s, COM sur 0 (il mesure Us).", court: "Montez les entrées et les deux voltmètres.", verifier: ({ faits }) => (T(faits).monte && (T(faits).points || []).length >= 1) || false, aide_geste: "La pile fixe V− à 4,5 V : ε = U_G − 4,5 V." },
      { consigne: "Faites varier la tension de G de 0 à 9 V (touches fines près de 4,5 V) : relevez au moins 8 couples (ε, Us), avec ε négatif et positif.", court: "Au moins 8 couples (ε, Us).", verifier: ({ faits }) => { const p = T(faits).points || []; return (p.length >= 8 && p.some((q) => q.eps < 0) && p.some((q) => q.eps > 0)) || false; } },
      { consigne: "Tableur : ε en A, Us en B. Tracez Us en fonction de ε.", court: "Tableur, puis Us en fonction de ε.", verifier: feuille_transfert },
      { consigne: "Pour ε > 0, la sortie est saturée : Us = +Vsat. Que vaut Vsat (en V) ?", court: "Vsat (V) ?", question: { type: "nombre", unite: "", attendu: 13.5, tolerance: 0.15, aide: "Lisez V2 quand ε > 0.", bravo: "Exact : Vsat ≈ 13,5 V, un peu moins que la tension d'alimentation (15 V)." } },
      { consigne: "Us bascule de −Vsat à +Vsat quand ε passe par 0. Le régime linéaire de l'AO correspond donc…", court: "Répondez dans le carnet.", question: choix(["à des valeurs de ε si petites (moins de 0,1 mV) que le voltmètre affiche 0 : en régime linéaire, ε ≈ 0", "à ε compris entre −13,5 V et +13,5 V", "à ε égal à Us"], "Le voltmètre a-t-il affiché un ε pour lequel Us était entre −13 V et +13 V ?", "Exact : AO idéal, ε = 0 en régime linéaire.") },
    ],
  };

  const S = montage("suiveur");
  const SUIVEUR = {
    id: "suiveur", paillasse: 1, titre: "Le montage suiveur",
    objectif: "Que devient la tension du GBF quand la sortie de l'AO est reliée à son entrée e− ?",
    entetes: [],
    conclusion: "Montage suiveur : la sortie est reliée à e− (contre-réaction), l'AO fonctionne en régime linéaire, ε = 0 donc Us = Ue. Comme i+ = 0, il ne prélève aucun courant au circuit d'entrée : il « recopie » une tension sans la perturber.",
    conclusion_courte: "Suiveur : Us = Ue.",
    etapes: [
      { consigne: "L'AO est déjà alimenté. SORTIE du GBF → e+ ; fil de s → e− ; masse du GBF → 0. Oscilloscope : Y1 sur la SORTIE du GBF (Ue), Y2 sur s (Us), masse ⏚ sur 0.", court: "Montez le suiveur et l'oscilloscope.", verifier: ({ faits }) => (S(faits).monte && S(faits).ue_max > 0.3) || false, aide_geste: "Toutes les masses (GBF, oscilloscope, 0 de l'alimentation) sont reliées." },
      { consigne: "Réglez les deux voies sur la même sensibilité, les courbes entières dans l'écran.", court: "Même sensibilité sur les deux voies.", verifier: bien_regle("suiveur", true) },
      { consigne: "Les deux courbes sont confondues. Pour le montage suiveur…", court: "Répondez dans le carnet.", question: choix(["Us = Ue : la sortie recopie la tension d'entrée", "Us = −Ue", "Us = 2·Ue"], "Comparez les deux courbes.", "Exact : ε = 0, donc V− = V+, soit Us = Ue.") },
      { consigne: "Comme i+ = 0, le suiveur…", court: "Répondez dans le carnet.", question: choix(["ne prélève aucun courant au GBF : il transmet la tension sans perturber le circuit d'entrée", "amplifie la tension", "fournit l'énergie au GBF"], "Quel courant entre par e+ ?", "Exact.") },
    ],
  };

  L.MISSIONS_AO = { transfert: TRANSFERT, suiveur: SUIVEUR, outils: { choix, montage, bien_regle } };
})(window.Labo);

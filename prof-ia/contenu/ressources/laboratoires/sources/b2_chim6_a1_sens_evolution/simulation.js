/*
Rôle : simulation de l'activité du chapitre « Évolution spontanée d'un système chimique » (2e année du bac) : critère
       d'évolution spontanée ; (1) trois mélanges d'acide éthanoïque, d'éthanoate de sodium, d'acide méthanoïque et de
       méthanoate de sodium à 0,10 mol/L (Qr,i = 0, 1 et 0,10 ; K = 0,10) : prévision du sens, pH mesuré, rapport
       [CH₃CO₂⁻]/[CH₃CO₂H] avant et après (banc_ph.js) ; (2) ions fer III et fer II avec du cuivre et du fer (poste_fer.js).
       Objectifs O1, O2.
Reçoit : rien (les vérifications lisent les faits « ph_melanges », « fer_metaux »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const M = (f) => (f.ph_melanges || {}).mesures || {}, F = (f) => f.fer_metaux || {};
  const melange = (v1, v2, v3, v4) => ({ eq_ethanoique_01: v1, eq_methanoate_01: v2, eq_ethanoate_01: v3, eq_methanoique_01: v4 });
  const MELANGES = [{ id: "m1", etiquette: "M1", contenu: melange(20, 20, 0, 0) }, { id: "m2", etiquette: "M2", contenu: melange(10, 10, 10, 10) }, { id: "m3", etiquette: "M3", contenu: melange(14, 14, 2, 10) }];

  const ACIDE_BASE = {
    id: "acide_base", paillasse: 0, titre: "Mélanges d'acides et de bases",
    conclusion: "Pour CH₃CO₂H + HCO₂⁻ ⇌ CH₃CO₂⁻ + HCO₂H, K = KA1 / KA2 = 10^(pKA2 − pKA1) ≈ 0,10. M1 : Qr,i = 0 < K, la réaction avance dans le sens direct : le rapport [CH₃CO₂⁻]/[CH₃CO₂H], nul au départ, vaut 10^(pH − 4,76) ≈ 0,31 à la fin. M2 : Qr,i = 1 > K, sens inverse : ce rapport passe de 1 à 0,31. M3 : Qr,i = 0,10 = K, le système est déjà à l'équilibre : le rapport reste 0,14. Au cours d'une évolution spontanée, Qr tend vers K.",
    objectif: "Calculer Qr,i, prévoir le sens d'évolution et le vérifier par le pH.",
    entetes: [], donnees: ["Solutions à 0,10 mol/L ; pKA(CH₃CO₂H/CH₃CO₂⁻) = 4,76 ; pKA(HCO₂H/HCO₂⁻) = 3,75", "M1 : 20 mL CH₃CO₂H + 20 mL HCO₂Na", "M2 : 10 mL de chacune des quatre solutions", "M3 : 14 mL CH₃CO₂H + 14 mL HCO₂Na + 2 mL CH₃CO₂Na + 10 mL HCO₂H"],
    conclusion_courte: "Qr,i < K : sens direct ; Qr,i > K : sens inverse.",
    etapes: [
      { consigne: "Pour la réaction CH₃CO₂H + HCO₂⁻ ⇌ CH₃CO₂⁻ + HCO₂H, le quotient de réaction s'écrit…", court: "Répondez dans le carnet.", question: choix(["Qr = [CH₃CO₂⁻]·[HCO₂H] / ([CH₃CO₂H]·[HCO₂⁻])", "Qr = [CH₃CO₂H]·[HCO₂⁻] / ([CH₃CO₂⁻]·[HCO₂H])", "Qr = [CH₃CO₂⁻] / [CH₃CO₂H]"], "Produits au numérateur.", "Exact.") },
      { consigne: "Constante d'équilibre K = KA(CH₃CO₂H) / KA(HCO₂H) ?", court: "K ?", question: relatif("", 10 ** (3.75 - 4.76), 0.08, "K = 10^(pKA2 − pKA1).", "Exact : K ≈ 0,10.") },
      { consigne: "Qr,i du mélange M3 ?", court: "Qr,i (M3) ?", question: relatif("", (2 * 10) / (14 * 14), 0.05, "Les concentrations sont proportionnelles aux quantités ; les volumes se simplifient.", "Exact : Qr,i ≈ 0,10.") },
      { consigne: "On prévoit donc…", court: "Répondez dans le carnet.", question: choix(["M1 : sens direct (Qr,i = 0 < K) ; M2 : sens inverse (Qr,i = 1 > K) ; M3 : pas d'évolution (Qr,i ≈ K)", "les trois mélanges évoluent dans le sens direct", "M1 : sens inverse ; M2 : sens direct ; M3 : sens direct"], "Comparez Qr,i et K.", "Exact.") },
      { consigne: "Mesurez le pH des trois mélanges.", court: "pH de M1, M2, M3.", aide_geste: "Arrêtez l'agitateur et remontez l'électrode avant d'enlever un bécher ; déplacez-le doucement.", verifier: ({ faits }) => ["m1", "m2", "m3"].every((k) => M(faits)[k] !== undefined) || false },
      { consigne: "Dans M2, rapport final [CH₃CO₂⁻]/[CH₃CO₂H] = 10^(pH − 4,76) ?", court: "Rapport final (M2) ?", question: relatif("", (f) => 10 ** ((M(f).m2 || 4.26) - 4.76), 0.05, "pH = pKA + log([CH₃CO₂⁻]/[CH₃CO₂H]).", "Exact : environ 0,31.") },
      { consigne: "Dans M2, ce rapport valait 1 au départ ; il a diminué, donc…", court: "Répondez dans le carnet.", question: choix(["des ions CH₃CO₂⁻ ont été consommés : la réaction a évolué dans le sens inverse, comme prévu", "la réaction a évolué dans le sens direct", "il ne s'est rien passé"], "Quel sens consomme CH₃CO₂⁻ ?", "Exact.") },
    ],
  };

  const OXYDOREDUCTION = {
    id: "oxydoreduction", paillasse: 1, titre: "Ions fer III, cuivre et fer",
    conclusion: "Pour 2 Fe³⁺ + Cu ⇌ 2 Fe²⁺ + Cu²⁺, il n'y a pas d'ions Cu²⁺ au départ : Qr,i = [Fe²⁺]²·[Cu²⁺] / [Fe³⁺]² = 0 < K ≈ 10¹⁴ ; la réaction évolue dans le sens direct : le cuivre est oxydé, la teinte jaune-orangé des ions Fe³⁺ disparaît. De même, le fer réduit les ions Fe³⁺ (2 Fe³⁺ + Fe → 3 Fe²⁺). Le tube témoin ne change pas. Les solides ne figurent pas dans Qr. Critère : Qr,i < K, sens direct ; Qr,i > K, sens inverse ; Qr,i = K, pas d'évolution.",
    objectif: "Prévoir et observer le sens d'évolution d'une transformation d'oxydoréduction.",
    entetes: [], donnees: ["Tubes 1 et 3 : Fe³⁺ et Fe²⁺ à 0,025 mol/L ; tube 2 : Fe³⁺ à 0,050 mol/L", "Pas d'ions Cu²⁺ au départ", "Données (K) affichées au mur"],
    conclusion_courte: "Qr,i = 0 < K : sens direct, Fe³⁺ consommés.",
    etapes: [
      { consigne: "Mettez le fil de cuivre dans le tube 1 et le clou en fer dans le tube 2 ; le tube 3 sert de témoin.", court: "Cuivre → tube 1 ; fer → tube 2.", aide_geste: "Faites glisser le métal au-dessus du tube et lâchez-le.", verifier: ({ faits }) => (F(faits).t1?.metal === "cuivre" && F(faits).t2?.metal === "fer" && !F(faits).t3?.metal) || false },
      { consigne: "Pour 2 Fe³⁺ + Cu ⇌ 2 Fe²⁺ + Cu²⁺ dans le tube 1, au départ…", court: "Répondez dans le carnet.", question: choix(["Qr,i = [Fe²⁺]²·[Cu²⁺] / [Fe³⁺]² = 0 < K : sens direct prévu", "Qr,i = 1 = K : pas d'évolution", "Qr,i > K : sens inverse prévu"], "Il n'y a pas d'ions Cu²⁺ au départ ; le cuivre solide ne figure pas dans Qr.", "Exact.") },
      { consigne: "Observez les tubes pendant deux minutes environ.", court: "Observez les tubes.", verifier: ({ faits }) => (F(faits).t1?.part_Fe3 < 0.2 && F(faits).t2?.part_Fe3 < 0.2) || false },
      { consigne: "Dans les tubes 1 et 2, la teinte jaune-orangé disparaît, mais pas dans le témoin, car…", court: "Répondez dans le carnet.", question: choix(["les ions Fe³⁺ sont réduits en ions Fe²⁺ : la réaction évolue dans le sens direct, comme prévu", "les ions Fe²⁺ sont oxydés", "le métal se dissout sans réaction"], "Comparez avec le tube témoin.", "Exact.") },
      { consigne: "Le critère d'évolution spontanée s'énonce…", court: "Répondez dans le carnet.", question: choix(["Qr,i < K : sens direct ; Qr,i > K : sens inverse ; Qr,i = K : le système est à l'équilibre", "K grand : toujours sens direct", "Qr,i < K : sens inverse"], "Qr évolue vers K.", "Exact.") },
    ],
  };

  const melanges = (g) => L.banc_ph(g, { fait: "ph_melanges", bechers: MELANGES });
  L.demarrer({ id: "b2_chim6_a1_sens_evolution", titre: "Laboratoire : sens d'évolution spontanée", paillasses: [melanges, L.poste_fer], missions: [ACIDE_BASE, OXYDOREDUCTION] });
})(window.Labo);

/*
Rôle : simulation de l'activité 1 du chapitre « Montages électriques » (tronc commun) : associations de conducteurs
       ohmiques (ohmmètre), résistivité, diviseur de tension. Objectifs O1 (R = ρ·l/S, conductance G), O2 (résistance
       équivalente en série et en parallèle), O3 (diviseur de tension U = R2/(R1 + R2)·U0).
Reçoit : rien (les vérifications lisent les mesures de l'ohmmètre et du voltmètre).
Produit : la simulation démarrée : paillasse des résistances, paillasse des fils résistants, paillasse du diviseur.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (attendu, tolerance, aide, bravo, relative = false) => ({ type: "nombre", unite: "", attendu, [relative ? "tolerance_relative" : "tolerance"]: tolerance, aide, bravo });
  const R = (faits) => faits.resistances || {};
  const mesurees = (noms) => ({ faits }) => noms.every((k) => typeof R(faits)[k] === "number") || false;
  const T = (faits) => faits.tensions_diviseur || {};

  const OHMMETRE = {
    id: "ohmmetre", paillasse: 0, titre: "Mesurer une résistance",
    objectif: "Mesurer à l'ohmmètre la résistance de conducteurs ohmiques et la comparer à leur code des couleurs.",
    entetes: [],
    conclusion: "L'ohmmètre mesure la résistance d'un dipôle isolé du circuit. On choisit le plus petit calibre supérieur à la valeur. La valeur réelle d'une résistance est comprise dans l'intervalle donné par sa tolérance (5 % pour l'anneau or).",
    conclusion_courte: "Ohmmètre : dipôle isolé, bon calibre.",
    etapes: [
      { consigne: "Tournez le commutateur sur Ω 200 et branchez l'ohmmètre aux deux bornes de R1 (VΩ sur une borne, COM sur l'autre).", court: "Ohmmètre (Ω 200) aux bornes de R1.", verifier: mesurees(["R1"]), aide_geste: "La résistance mesurée doit être seule : aucun autre fil sur ses bornes." },
      { consigne: "Mesurez de même R2 et R3, en choisissant chaque fois le bon calibre.", court: "Mesurez R2 et R3.", verifier: mesurees(["R2", "R3"]), aide_geste: "Si l'écran affiche « 1 », passez au calibre supérieur." },
      { consigne: "Sur le calibre 2 kΩ, l'afficheur donne R2 en kΩ. Écrivez R2 en ohms.", court: "R2 en Ω ?", question: nombre((faits) => R(faits).R2 || 0, 1, "1 kΩ = 1 000 Ω.", "Exact.") },
      { consigne: "Les anneaux de R2 sont rouge, rouge, marron, or. Ils signifient…", court: "Répondez dans le carnet.", question: choix(["22 × 10¹ Ω = 220 Ω, à 5 % près", "221 Ω exactement", "2 200 Ω, à 1 % près"], "Rouge = 2, marron = 1 zéro, or = 5 %.", "Exact.") },
      { consigne: "La valeur mesurée de R2 et celle du code…", court: "Répondez dans le carnet.", question: choix(["sont compatibles : la mesure est entre 209 Ω et 231 Ω", "sont incompatibles : la résistance est défectueuse", "doivent être exactement égales"], "220 Ω ± 5 % : de 209 Ω à 231 Ω.", "Exact.") },
    ],
  };

  const ASSOCIATIONS = {
    id: "associations", paillasse: 0, titre: "Associations de résistances",
    objectif: "Quelle est la résistance de deux résistances associées en série, puis en parallèle ?",
    entetes: [],
    conclusion: "En série, les résistances s'ajoutent : Req = R1 + R2. En parallèle, les conductances (G = 1/R, en siemens) s'ajoutent : 1/Req = 1/R1 + 1/R2 ; Req est plus petite que chacune des résistances.",
    conclusion_courte: "Série : Req = R1 + R2 ; parallèle : G = G1 + G2.",
    etapes: [
      { consigne: "Reliez R1 et R2 en série (un fil entre une borne de R1 et une borne de R2) et mesurez la résistance de l'ensemble.", court: "R1 et R2 en série : mesurez Req.", verifier: mesurees(["serie_R1_R2"]) },
      { consigne: "Calculez R1 + R2 avec vos mesures (en Ω).", court: "R1 + R2 (Ω) ?", question: nombre((faits) => (R(faits).R1 || 0) + (R(faits).R2 || 0), 1, "Additionnez les deux mesures.", "Exact : c'est la valeur mesurée pour l'association.") },
      { consigne: "Montez R1 et R2 en parallèle (deux fils) et mesurez la résistance de l'ensemble.", court: "R1 et R2 en parallèle : mesurez Req.", verifier: mesurees(["parallele_R1_R2"]) },
      { consigne: "La conductance d'une résistance est G = 1/R (en siemens, S). Calculez G1 + G2 avec vos mesures de R1 et R2 (en S).", court: "G1 + G2 (S) ?", question: nombre((faits) => 1 / (R(faits).R1 || 1) + 1 / (R(faits).R2 || 1), 0.01, "G1 = 1/R1, avec R1 en ohms.", "Exact.", true) },
      { consigne: "Calculez 1/(G1 + G2) et comparez avec la mesure. En parallèle…", court: "Répondez dans le carnet.", question: choix(["les conductances s'ajoutent : Req = 1/(G1 + G2), plus petite que R1 et que R2", "les résistances s'ajoutent", "Req est la moyenne de R1 et R2"], "1/(G1 + G2) vaut-il la mesure ?", "Exact.") },
    ],
  };

  const RESISTIVITE = {
    id: "resistivite", paillasse: 1, titre: "Résistance d'un fil : R = ρ·l/S",
    objectif: "De quoi dépend la résistance d'un fil ?",
    entetes: [],
    conclusion: "La résistance d'un fil est proportionnelle à sa longueur l et inversement proportionnelle à sa section S : R = ρ·l/S. La résistivité ρ (en Ω·m) dépend du matériau.",
    conclusion_courte: "R = ρ·l/S.",
    etapes: [
      { consigne: "Avec l'ohmmètre (Ω 200), mesurez la résistance des quatre fils F1, F2, F3 et F4.", court: "Mesurez F1, F2, F3, F4.", verifier: mesurees(["F1", "F2", "F3", "F4"]) },
      { consigne: "Comparez F1 et F2 : même fil, mais F2 est deux fois plus court. La résistance…", court: "Répondez dans le carnet.", question: choix(["est proportionnelle à la longueur l", "ne dépend pas de la longueur", "est inversement proportionnelle à la longueur"], "R(F2) = R(F1)/2 ?", "Exact.") },
      { consigne: "Comparez F1 et F3 : même longueur, mais F3 a une section deux fois plus grande. La résistance…", court: "Répondez dans le carnet.", question: choix(["est inversement proportionnelle à la section S", "est proportionnelle à la section", "ne dépend pas de la section"], "R(F3) = R(F1)/2 ?", "Exact.") },
      { consigne: "Comparez F1 (constantan) et F4 (cuivre), de mêmes dimensions. La résistance dépend aussi…", court: "Répondez dans le carnet.", question: choix(["du matériau : c'est sa résistivité ρ", "de la couleur du fil", "de rien d'autre"], "Le cuivre conduit bien mieux que le constantan.", "Exact.") },
      { consigne: "Calculez la résistivité du constantan ρ = R·S/l avec le fil F1 (S = 0,05 mm² = 5 × 10⁻⁸ m²), en Ω·m.", court: "ρ du constantan (Ω·m) ?", question: nombre((faits) => ((R(faits).F1 || 9.8) * 5e-8) / 1, 0.05, "Écrivez par exemple 4,9E-7.", "Exact : ρ ≈ 4,9 × 10⁻⁷ Ω·m.", true) },
    ],
  };

  const DIVISEUR = {
    id: "diviseur", paillasse: 2, titre: "Le diviseur de tension",
    objectif: "Obtenir, avec deux résistances en série, une tension plus petite que celle du générateur.",
    entetes: [],
    conclusion: "Diviseur de tension : la tension aux bornes de R2 vaut U = R2/(R1 + R2)·U0, où U0 est la tension appliquée à l'ensemble.",
    conclusion_courte: "U = R2/(R1 + R2)·U0.",
    etapes: [
      { consigne: "Montez R1 et R2 en série aux bornes du générateur (P vers A, B vers C, D vers N). Mesurez U0 = U_{PN} et U = U_{CD} (voltmètre V⎓ 20).", court: "Mesurez UPN et UCD.", verifier: ({ faits }) => (typeof T(faits).PN === "number" && typeof T(faits).CD === "number") || false },
      { consigne: "Calculez R2/(R1 + R2)·U0 avec les valeurs du code (R1 = 1 000 Ω, R2 = 470 Ω) et votre mesure de U0 (en V).", court: "R2/(R1 + R2)·U0 (V) ?", question: nombre((faits) => (470 / 1470) * (T(faits).PN || 12), 0.03, "470 / 1470 × U0.", "Exact.") },
      { consigne: "Comparez avec U_{CD} mesurée. Le montage…", court: "Répondez dans le carnet.", question: choix(["est un diviseur de tension : U_{CD} = R2/(R1 + R2)·U0", "donne la même tension aux bornes de R1 et de R2", "double la tension du générateur"], "L'écart vient de la tolérance des résistances.", "Exact.") },
      { consigne: "Pour obtenir une tension U plus petite avec le même générateur, il faut…", court: "Répondez dans le carnet.", question: choix(["diminuer R2 (ou augmenter R1)", "augmenter R2", "brancher R2 directement aux bornes du générateur"], "U = R2/(R1 + R2)·U0.", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_elec3_a1_associations", titre: "Laboratoire : associations de résistances, diviseur de tension", decor: "aucun", paillasses: [L.poste_resistances, L.poste_fils, L.poste_diviseur], missions: [OHMMETRE, ASSOCIATIONS, RESISTIVITE, DIVISEUR] });
})(window.Labo);

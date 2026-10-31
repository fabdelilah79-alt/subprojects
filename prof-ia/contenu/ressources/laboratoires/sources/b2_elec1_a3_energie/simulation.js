/*
Rôle : simulation de l'activité 3 du chapitre « Dipôle RC » (2e année du bac) : énergie stockée dans un condensateur,
       E = ½·C·u² ; décharge dans une lampe (modèle de flash) pour plusieurs capacités et tensions ; applications (flash,
       défibrillateur) : énergie et puissance. Objectifs O5, O7.
Reçoit : rien (les vérifications lisent les faits « montage_flash », « eclairs », « docs_flash »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });
  const eclair = (f, C, U) => (f.eclairs || []).find((e) => Math.abs(e.C - C) < 1e-9 && Math.abs(e.U0 - U) < 0.2 && e.pic > 0.2);
  const M = (f) => f.montage_flash || {};

  const ENERGIE = {
    id: "energie", paillasse: 0, titre: "L'énergie stockée",
    objectif: "Charger un condensateur, puis le décharger dans une lampe ; relier l'éclair à l'énergie E = ½·C·u².",
    entetes: [],
    donnees: ["Énergie stockée dans un condensateur de capacité C sous la tension u : E = ½·C·u²"],
    conclusion: "Chargé, le condensateur stocke de l'énergie ; en se déchargeant dans la lampe, il la lui rend : la lampe s'allume un court instant. La décharge n'est pas instantanée, car la tension aux bornes du condensateur est continue. L'énergie stockée vaut E = ½·C·u² : elle est proportionnelle à C, et à u² (doubler la tension multiplie l'énergie par 4). Avec 2,2 mF sous 6 V : 40 mJ ; sous 12 V : 158 mJ.",
    conclusion_courte: "E = ½·C·u².",
    etapes: [
      { consigne: "Câblez : G+ vers K1, K0 vers C1, C2 vers G− ; K2 vers la lampe, l'autre borne de la lampe vers C2 ; EA0 sur C1, GND sur C2.", court: "Câblez le montage.", verifier: ({ faits }) => (M(faits).charge && M(faits).eclair && M(faits).mesure) || false },
      { consigne: "E = 6 V, C = 2,2 mF : basculez K en 1 (charge), touchez « Lancer » (durée 1 s), puis basculez K en 2.", court: "Éclair : 2,2 mF sous 6 V.", aide_geste: "Réglez la durée du logiciel sur 1 s.", verifier: ({ faits }) => !!eclair(faits, 2.2e-3, 6) || false },
      { consigne: "La lampe s'allume brièvement parce que…", court: "Répondez dans le carnet.", question: choix(["le condensateur chargé avait stocké de l'énergie, qu'il rend à la lampe en se déchargeant", "le générateur alimente la lampe", "la lampe stocke de l'énergie"], "Le générateur n'est plus relié à la lampe.", "Exact.") },
      { consigne: "Énergie stockée E = ½·C·u² (mJ) ?", court: "E (mJ) ?", question: nombre("mJ", 39.6, 1, "C = 2,2 × 10⁻³ F ; u = 6 V.", "Exact : environ 40 mJ.") },
      { consigne: "Recommencez avec C = 4,7 mF sous 6 V. L'éclair…", court: "Éclair : 4,7 mF.", verifier: ({ faits }) => !!eclair(faits, 4.7e-3, 6) || false },
      { consigne: "Avec une capacité plus grande, l'éclair dure…", court: "Répondez dans le carnet.", question: choix(["plus longtemps : l'énergie stockée est plus grande et τ = R·C aussi", "moins longtemps", "pareil"], "Comparez les courbes de décharge.", "Exact.") },
      { consigne: "Revenez à C = 2,2 mF et réglez E = 12 V. Faites un éclair.", court: "Éclair : 2,2 mF sous 12 V.", verifier: ({ faits }) => !!eclair(faits, 2.2e-3, 12) || false },
      { consigne: "En doublant la tension, l'énergie stockée est multipliée par…", court: "Répondez dans le carnet.", question: choix(["4 : E est proportionnelle à u²", "2", "1"], "E = ½·C·u².", "Exact : 158 mJ.") },
    ],
  };

  const FLASH = {
    id: "flash", paillasse: 0, titre: "Applications : flash et défibrillateur",
    objectif: "Lire les documents ; calculer des énergies et des puissances.",
    entetes: [],
    donnees: ["E = ½·C·u² ; puissance moyenne P = E / Δt"],
    conclusion: "Le condensateur d'un flash (150 µF sous 300 V) stocke 6,75 J et les libère en 1 ms : une puissance de 6 750 W, impossible à obtenir d'une pile. Un défibrillateur de 32 µF doit être chargé sous environ 3 500 V pour délivrer 200 J. Le condensateur stocke lentement l'énergie et peut la rendre très vite.",
    conclusion_courte: "Stocker lentement, rendre très vite.",
    etapes: [
      { consigne: "Lisez les deux documents.", court: "Lisez les documents.", aide_geste: "Touchez un document pour l'ouvrir, touchez-le de nouveau pour le refermer.", verifier: ({ faits }) => (faits.docs_flash || []).length >= 2 || false },
      { consigne: "Énergie stockée dans le condensateur du flash (150 µF sous 300 V), en J ?", court: "E flash (J) ?", question: nombre("J", 6.75, 0.05, "E = ½ × 150 × 10⁻⁶ × 300².", "Exact.") },
      { consigne: "Puissance moyenne de l'éclair, libéré en 1 ms (W) ?", court: "P flash (W) ?", question: nombre("W", 6750, 60, "P = E / Δt, Δt = 10⁻³ s.", "Exact : plusieurs kilowatts.") },
      { consigne: "On utilise un condensateur dans un flash parce que…", court: "Répondez dans le carnet.", question: choix(["il stocke l'énergie lentement et peut la rendre en un temps très court", "il produit de l'énergie", "il remplace la lampe"], "Comparez à une pile.", "Exact.") },
      { consigne: "Défibrillateur : C = 32 µF ; pour E = 200 J, sous quelle tension faut-il le charger (V) ?", court: "U défibrillateur (V) ?", question: nombre("V", 3536, 30, "u = √(2E / C).", "Exact : environ 3 500 V.") },
    ],
  };

  L.demarrer({ id: "b2_elec1_a3_energie", titre: "Laboratoire : énergie d'un condensateur", decor: "aucun", paillasses: [L.poste_flash], missions: [ENERGIE, FLASH] });
})(window.Labo);

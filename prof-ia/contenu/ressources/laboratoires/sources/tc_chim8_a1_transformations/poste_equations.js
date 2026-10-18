/*
Rôle : paillasse « écrire et ajuster les équations » : tableau magnétique (tableau_equation.js) avec les sept transformations
       observées ou citées (cuivre et ions argent, fer et ions cuivre, précipitation de l'hydroxyde de cuivre, combustions du
       soufre, du fer, du sodium dans le dichlore, combustion du propane) ; chaque réserve contient des ions spectateurs ou des intrus.
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_equations(groupe) -> { pense_bete } ; fait « equations » (voir tableau_equation.js).
Utilisé par : simulation.js.
*/
(function (L) {
  const s = (f, z = 0) => ({ f, z });
  const ESPECES = {
    Cu: s("Cu"), "Ag+": s("Ag", 1), "Cu2+": s("Cu", 2), Ag: s("Ag"), "NO3-": s("NO3", -1), Fe: s("Fe"), "Fe2+": s("Fe", 2), "SO42-": s("SO4", -2),
    "HO-": s("HO", -1), CuOH2: s("Cu(OH)2"), "Na+": s("Na", 1), S: s("S"), O2: s("O2"), SO2: s("SO2"), SO3: s("SO3"), Fe3O4: s("Fe3O4"), FeO: s("FeO"),
    Na: s("Na"), Cl2: s("Cl2"), Cl: s("Cl"), NaCl: s("NaCl"), C3H8: s("C3H8"), CO: s("CO"), CO2: s("CO2"), H2O: s("H2O"),
  };
  const EQUATIONS = [
    { id: "argent", titre: "Cu + Ag⁺", texte: "Le cuivre Cu réagit avec les ions argent Ag⁺ (solution de nitrate d'argent) :\nil se forme de l'argent Ag et des ions cuivre Cu²⁺.", cartes: ["Ag", "Cu", "NO3-", "Cu2+", "Ag+"], reactifs: ["Cu", "Ag+"], produits: ["Cu2+", "Ag"] },
    { id: "fer", titre: "Fe + Cu²⁺", texte: "Le fer Fe réagit avec les ions cuivre Cu²⁺ (solution de sulfate de cuivre) :\nil se forme du cuivre Cu et des ions fer II Fe²⁺.", cartes: ["Cu2+", "SO42-", "Fe2+", "Fe", "Cu"], reactifs: ["Fe", "Cu2+"], produits: ["Fe2+", "Cu"] },
    { id: "hydroxyde", titre: "Cu²⁺ + HO⁻", texte: "Les ions cuivre Cu²⁺ réagissent avec les ions hydroxyde HO⁻ de la soude :\nil se forme un précipité bleu d'hydroxyde de cuivre Cu(OH)₂.", cartes: ["Na+", "CuOH2", "HO-", "SO42-", "Cu2+"], reactifs: ["Cu2+", "HO-"], produits: ["CuOH2"] },
    { id: "soufre", titre: "S + O₂", texte: "Le soufre S brûle dans le dioxygène O₂ :\nil se forme du dioxyde de soufre SO₂.", cartes: ["SO3", "O2", "S", "SO2"], reactifs: ["S", "O2"], produits: ["SO2"] },
    { id: "oxyde_fer", titre: "Fe + O₂", texte: "Le fer Fe brûle dans le dioxygène O₂ :\nil se forme de l'oxyde magnétique Fe₃O₄.", cartes: ["FeO", "Fe", "Fe3O4", "O2"], reactifs: ["Fe", "O2"], produits: ["Fe3O4"] },
    { id: "sodium", titre: "Na + Cl₂", texte: "Le sodium Na brûle dans le dichlore Cl₂ :\nil se forme du chlorure de sodium NaCl.", cartes: ["Cl", "NaCl", "Na", "Cl2"], reactifs: ["Na", "Cl2"], produits: ["NaCl"] },
    { id: "propane", titre: "C₃H₈ + O₂", texte: "Le propane C₃H₈ (gaz des bouteilles) brûle dans le dioxygène O₂ :\nil se forme du dioxyde de carbone CO₂ et de l'eau H₂O.", cartes: ["CO", "H2O", "C3H8", "CO2", "O2"], reactifs: ["C3H8", "O2"], produits: ["CO2", "H2O"] },
  ];
  L.EQUATIONS_CHIM8 = EQUATIONS;

  L.poste_equations = function (g) {
    // Pense-bête et tableau magnétique.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    L.tableau_equation(g, { especes: ESPECES, equations: EQUATIONS, fait: "equations" });
    return { pense_bete };
  };
})(window.Labo);

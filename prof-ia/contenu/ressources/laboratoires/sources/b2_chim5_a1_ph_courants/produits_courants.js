/*
Rôle : solutions de l'activité « pH de produits courants et de milieux biologiques » : cinq produits de la vie courante (pH
       imposé, mesuré sur des échantillons réels : jus de citron 2,3 ; vinaigre blanc 2,9 ; lait 6,6 ; solution de
       bicarbonate de sodium 8,3 ; eau de Javel diluée 11,5) et solutions d'hydroxyde de sodium à 1,0 × 10⁻² et
       1,0 × 10⁻³ mol/L (pH exact : equilibre_acide.js) ; paillasse 2 : document mural sur le pH des liquides du corps humain.
Reçoit : le groupe SVG de la paillasse (pour la paillasse 2).
Produit : liquides ph_citron, ph_vinaigre, ph_lait, ph_bicarbonate, ph_javel, eq_soude_2, eq_soude_3 ; Labo.paillasse_eau_corps(g)
          -> { pense_bete } (banc de pH-métrie : HCl, soude 10⁻² et 10⁻³ mol/L ; document) ; fait « docs_bio ».
Utilisé par : simulation.js.
*/
(function (L) {
  const produit = (nom, pH, rgb, alpha = 0.3) => ({ nom, d: 1.0, rgb, alpha, classe: "aqueuse", pH, tampon: pH });
  Object.assign(L.LIQUIDES, {
    ph_citron: produit("jus de citron", 2.3, [244, 236, 180], 0.5), ph_vinaigre: produit("vinaigre blanc", 2.9, [236, 240, 236]),
    ph_lait: produit("lait", 6.6, [250, 250, 244], 0.95), ph_bicarbonate: produit("solution de bicarbonate de sodium", 8.3, [234, 240, 244]),
    ph_javel: produit("eau de Javel diluée", 11.5, [236, 244, 214], 0.4),
    eq_soude_2: { nom: "hydroxyde de sodium 1,0 × 10⁻² mol/L", d: 1.0, rgb: [230, 240, 246], alpha: 0.3, classe: "aqueuse", pH: null, dissous: { "Na+": 0.01, "HO-": 0.01 } },
    eq_soude_3: { nom: "hydroxyde de sodium 1,0 × 10⁻³ mol/L", d: 1.0, rgb: [230, 240, 246], alpha: 0.3, classe: "aqueuse", pH: null, dissous: { "Na+": 0.001, "HO-": 0.001 } },
  });

  L.paillasse_eau_corps = function (g) {
    // Banc de pH-métrie (acide chlorhydrique, soude à deux concentrations) et document sur le pH des liquides du corps.
    const r = L.banc_ph(g, { fait: "ph_eau", bechers: [{ id: "hcl", liquide: "eq_hcl", etiquette: "HCl 10⁻² M" }, { id: "soude2", liquide: "eq_soude_2", etiquette: "NaOH 10⁻² M" }, { id: "soude3", liquide: "eq_soude_3", etiquette: "NaOH 10⁻³ M" }] });
    L.documents_mur(g, [{ x: 270, y: 34, l: 360, h: 120, taille: 4, titre: "Le pH dans le corps humain", chaine: ["sang", "pH 7,35 à 7,45", "CO₂,H₂O / HCO₃⁻", "pKA = 6,4"],
      texte: "Le pH des liquides du corps reste dans des limites étroites. Sang : 7,35 à 7,45 ; salive : 6,5 à 7,4 ; larmes : 7,4 ; urine : 5 à 7 ; suc gastrique : 1,5 à 2. Dans le sang, le couple CO₂,H₂O / HCO₃⁻ (pKA = 6,4 à 37 °C) maintient le pH : un pH du sang inférieur à 7,35 est une acidose, un pH supérieur à 7,45 une alcalose." }], "docs_bio");
    g.append(g.querySelector(".document-ouvert"));
    return r;
  };
})(window.Labo);

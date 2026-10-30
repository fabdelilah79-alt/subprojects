/*
Rôle : pH exact d'une solution aqueuse à 25 °C : équilibres des couples faibles (CH₃CO₂H/CH₃CO₂⁻, pKa 4,76 ; HCO₂H/HCO₂⁻,
       pKa 3,75 ; C₆H₅CO₂H/C₆H₅CO₂⁻, pKa 4,20 ; C₂H₅CO₂H/C₂H₅CO₂⁻, pKa 4,87 ; NH₄⁺/NH₃, pKa 9,25), autoprotolyse de l'eau (Ke = 1,0 × 10⁻¹⁴), ions spectateurs (Na⁺, K⁺, Cl⁻, NO₃⁻) ;
       [H₃O⁺] est la racine de l'électroneutralité, cherchée par dichotomie sur log[H₃O⁺] ; un acide fort est compté par
       son anion (Cl⁻). Une solution tampon (plus de la moitié du volume) impose son pH. Activités assimilées aux concentrations.
       Solutions : acide chlorhydrique, acide méthanoïque et acide éthanoïque à 1,0 × 10⁻² mol/L, tampons pH 4,00 et 7,00,
       acide éthanoïque pur (17,4 mol/L), éthanoate de sodium en cristaux (CH₃CO₂Na, 82 g/mol, compté en mL de solide) ;
       acide éthanoïque à 5,0 × 10⁻³, 2,0 × 10⁻³ et 1,0 × 10⁻³ mol/L ; acides benzoïque et propanoïque à 1,0 × 10⁻² mol/L.
       Conductivité à l'équilibre : σ = Σ λi·[Xi]éq (ions des couples, H₃O⁺, HO⁻, ions spectateurs) + 1 µS/cm (eau distillée).
Reçoit : une phase (liquide_contenu.js : liquides en mL, dissous en mmol, V en mL).
Produit : Labo.pH_exact(phase) -> pH (nombre) ; Labo.sigma_equilibre(phase) -> σ (S/m) ; Labo.COUPLES_FAIBLES ; liquides
          eq_hcl, eq_methanoique, eq_ethanoique, tampon_4, tampon_7, eq_ethanoique_pur, eq_ethanoate_sodium, eq_ethanoique_5,
          eq_ethanoique_2, eq_ethanoique_1, eq_benzoique, eq_propanoique ; λ des ions méthanoate, benzoate, propanoate.
Utilisé par : ph_metre.js et les simulations des transformations non totales (2e année du bac).
*/
(function (L) {
  const aq = (nom, dissous, rgb = [230, 240, 246]) => ({ nom, d: 1.0, rgb, alpha: 0.3, classe: "aqueuse", pH: null, dissous });
  Object.assign(L.LIQUIDES, {
    eq_hcl: aq("acide chlorhydrique 1,0 × 10⁻² mol/L", { "H3O+": 0.01, "Cl-": 0.01 }),
    eq_methanoique: aq("acide méthanoïque 1,0 × 10⁻² mol/L", { HCO2H: 0.01 }),
    eq_ethanoique: aq("acide éthanoïque 1,0 × 10⁻² mol/L", { CH3CO2H: 0.01 }),
    tampon_4: { ...aq("solution tampon pH 4,00", null, [242, 196, 196]), alpha: 0.45, tampon: 4.0 },
    tampon_7: { ...aq("solution tampon pH 7,00", null, [200, 226, 200]), alpha: 0.45, tampon: 7.0 },
    eq_ethanoique_pur: { ...aq("acide éthanoïque pur", { CH3CO2H: 17.4 }), d: 1.05 },
    eq_ethanoate_sodium: { ...aq("éthanoate de sodium", { "Na+": 17.7, "CH3CO2-": 17.7 }), d: 1.45 },
    eq_ethanoique_5: aq("acide éthanoïque 5,0 × 10⁻³ mol/L", { CH3CO2H: 0.005 }), eq_ethanoique_2: aq("acide éthanoïque 2,0 × 10⁻³ mol/L", { CH3CO2H: 0.002 }),
    eq_ethanoique_1: aq("acide éthanoïque 1,0 × 10⁻³ mol/L", { CH3CO2H: 0.001 }),
    eq_benzoique: aq("acide benzoïque 1,0 × 10⁻² mol/L", { C6H5CO2H: 0.01 }), eq_propanoique: aq("acide propanoïque 1,0 × 10⁻² mol/L", { C2H5CO2H: 0.01 }),
  });
  if (L.LAMBDA) Object.entries({ "HCO2-": 5.46, "C6H5CO2-": 3.23, "C2H5CO2-": 3.58, "CH3CO2-": 4.09, "NO3-": 7.14 }).forEach(([s, v]) => { L.LAMBDA[s] ??= v; });
  L.COUPLES_FAIBLES = [["CH3CO2H", "CH3CO2-", 4.76], ["HCO2H", "HCO2-", 3.75], ["C6H5CO2H", "C6H5CO2-", 4.2], ["C2H5CO2H", "C2H5CO2-", 4.87], ["NH4+", "NH3", 9.25]];
  const CHARGES = { "Na+": 1, "K+": 1, "Cl-": -1, "NO3-": -1 };

  function ecart(h, c, S) {
    // Électroneutralité : cations − anions (mol/L) pour [H₃O⁺] = h ; décroît quand h diminue.
    let q = h + S - 1e-14 / h;
    for (const [a, b, pKa] of L.COUPLES_FAIBLES) {
      const Ka = 10 ** -pKa, tot = c(a) + c(b);
      if (a === "NH4+") q += (tot * h) / (Ka + h); else q -= (tot * Ka) / (Ka + h);
    }
    return q;
  }

  function racine(ph) {
    // [H₃O⁺] (mol/L) qui annule l'écart à l'électroneutralité, et les concentrations totales c(espèce).
    const c = (s) => (ph.dissous[s] || 0) / ph.V;
    const S = Object.entries(CHARGES).reduce((t, [s, z]) => t + z * c(s), 0);
    let bas = -14, haut = 1;
    for (let k = 0; k < 60; k++) { const m = (bas + haut) / 2; if (ecart(10 ** m, c, S) > 0) haut = m; else bas = m; }
    return { h: 10 ** ((bas + haut) / 2), c };
  }

  L.pH_exact = function (ph) {
    // pH de la phase : tampon s'il domine, sinon racine de l'électroneutralité.
    if (!ph || ph.V <= 0) return 7;
    for (const [n, v] of Object.entries(ph.liquides || {})) if (L.LIQUIDES[n]?.tampon && v > 0.5 * ph.V) return L.LIQUIDES[n].tampon;
    return -Math.log10(racine(ph).h);
  };

  L.sigma_equilibre = function (ph) {
    // Conductivité (S/m) : ions à l'équilibre (λ en mS·m²/mol, concentrations en mol/L) + 1 µS/cm d'eau distillée.
    if (!ph || ph.V <= 0) return 1e-4;
    const { h, c } = racine(ph), l = (s) => L.LAMBDA[s] || 0;
    let s = l("H3O+") * h + l("HO-") * (1e-14 / h) + Object.keys(CHARGES).reduce((t, k) => t + l(k) * c(k), 0);
    for (const [a, b, pKa] of L.COUPLES_FAIBLES) {
      const Ka = 10 ** -pKa, tot = c(a) + c(b);
      s += a === "NH4+" ? l(a) * (tot * h) / (Ka + h) : l(b) * (tot * Ka) / (Ka + h);
    }
    return s + 1e-4;
  };
})(window.Labo);

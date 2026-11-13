/*
Rôle : physique de la conductimétrie : conductivités molaires ioniques (valeurs des tables, à 25 °C, en
       mS·m²/mol), solutions (ions et coefficients), conductivité σ = Σ λi·[Xi] (SI) corrigée pour la concentration
       (les ions se gênent : facteur 1 − 0,5·√C) et la température (+ 2,1 % par °C) ; eau distillée σ = 5 × 10⁻⁴ S/m ;
       conductance G = σ·S/L.
Reçoit : le nom de la solution, C (mol/L), θ (°C), S (m²), L (m).
Produit : Labo.LAMBDA ; Labo.SOLUTIONS ; Labo.sigma(nom, C, θ) (S/m) ; Labo.conductance({ nom, C, theta, S, L }) (S).
Utilisé par : cellule_conductance.js et les simulations de conductimétrie.
*/
(function (L) {
  L.LAMBDA = { "H3O+": 34.98, "HO-": 19.86, "Na+": 5.01, "K+": 7.35, "NH4+": 7.34, "Cl-": 7.63 };
  L.SOLUTIONS = {
    eau: { nom: "eau distillée", ions: {} }, sucre: { nom: "eau sucrée", ions: {} },
    NaCl: { nom: "chlorure de sodium", ions: { "Na+": 1, "Cl-": 1 } }, KCl: { nom: "chlorure de potassium", ions: { "K+": 1, "Cl-": 1 } },
    NaOH: { nom: "hydroxyde de sodium", ions: { "Na+": 1, "HO-": 1 } }, KOH: { nom: "hydroxyde de potassium", ions: { "K+": 1, "HO-": 1 } },
    HCl: { nom: "acide chlorhydrique", ions: { "H3O+": 1, "Cl-": 1 } }, NH4Cl: { nom: "chlorure d'ammonium", ions: { "NH4+": 1, "Cl-": 1 } },
  };

  L.sigma = function (nom, C, theta = 25) {
    // σ (S/m) = Σ λ (S·m²/mol) × [X] (mol/m³), corrigée ; plus la faible conductivité de l'eau.
    const s = Object.entries(L.SOLUTIONS[nom].ions).reduce((t, [ion, nu]) => t + L.LAMBDA[ion] * 1e-3 * nu * C * 1000, 0);
    return (s * (1 - 0.5 * Math.sqrt(C)) + 5e-4) * (1 + 0.021 * (theta - 25));
  };
  L.conductance = ({ nom, C, theta = 25, S, L: l }) => (l > 0 && S > 0 ? (L.sigma(nom, C, theta) * S) / l : 0);
})(window.Labo);

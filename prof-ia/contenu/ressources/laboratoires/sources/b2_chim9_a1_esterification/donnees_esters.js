/*
Rôle : données de l'estérification CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O (K = 4) : modèle de l'avancement dans des tubes scellés
       de 20 mmol d'acide et 20 mmol d'éthanol à 100 °C sans catalyseur, dx/dt = k·[(n₀ − x)² − x²/K] / n₀ avec k = 0,02 min⁻¹
       (environ x = 10,4 mmol à 60 min, limite 13,3 mmol) ; hydrolyse de 20 mmol d'ester par 20 mmol d'eau (limite 6,7 mmol) ;
       liquides titrés : contenu d'un tube sorti du bain à 60 min, mélange 20 mmol d'acide + 60 mmol d'éthanol à l'équilibre
       (1,94 mmol d'acide restant), soude à 1,0 mol/L. Dans l'eau glacée, la soude ne réagit pratiquement pas avec l'ester.
Reçoit : rien.
Produit : Labo.ESTERS = { n0, x(t) (mmol), RESULTATS ([[t (min), VE (mL)]], sans la date 60 min), HYDROLYSE ([[t, x]]),
          CONDITIONS ([[texte, x à 60 min, x à l'état final]]), VE_60, VE_EXCES } ; liquides est_tube_60, est_exces, est_soude.
Utilisé par : postes_esters.js, simulation.js.
*/
(function (L) {
  const N0 = 20, K = 4, k = 0.02;

  function x(t) {
    // Solution exacte de dy/dt = k·[(1 − y)² − y²/4] (racines 2/3 et 2), avancement en mmol.
    const a = 2 / 3, b = 2, r = (a / b) * Math.exp(0.75 * k * (a - b) * t);
    return N0 * (a - r * b) / (1 - r);
  }
  const vingtieme = (v) => Math.round(v * 20) / 20;
  const RESULTATS = [5, 10, 20, 30, 45, 90, 120, 150, 180, 240].map((t) => [t, vingtieme(N0 - x(t))]);
  const VE_60 = Math.round((N0 - x(60)) * 100) / 100, VE_EXCES = 1.94;
  const aq = (nom, dissous, d = 1.0) => ({ nom, d, rgb: [236, 240, 242], alpha: 0.3, classe: "aqueuse", pH: null, dissous });
  Object.assign(L.LIQUIDES, {
    est_tube_60: aq("contenu du tube (60 min)", { CH3CO2H: VE_60 / 2.3 }, 0.95),
    est_exces: aq("mélange à l'équilibre (alcool en excès)", { CH3CO2H: VE_EXCES / 4.65 }, 0.88),
    est_soude: aq("soude 1,0 mol/L", { "Na+": 1, "HO-": 1 }),
  });
  L.ESTERS = {
    n0: N0, K, x, RESULTATS, VE_60, VE_EXCES,
    HYDROLYSE: [[30, 2.5], [60, 4.2], [120, 5.9], [180, 6.4], [240, 6.6], [360, 6.7], [480, 6.7]],
    CONDITIONS: [["20 °C, sans catalyseur (plusieurs mois)", 0.3, 13.3], ["100 °C, sans catalyseur", 10.4, 13.3], ["100 °C, 1 mL d'acide sulfurique", 13.2, 13.3]],
  };
})(window.Labo);

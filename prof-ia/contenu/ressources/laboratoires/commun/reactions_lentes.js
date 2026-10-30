/*
Rôle : transformations lentes en solution aqueuse, avec leur vitesse : v = k(T)·Π [X]^n (mol·L⁻¹·s⁻¹), k(T) suit la loi
       d'Arrhenius (k20 à 20 °C, énergie d'activation Ea). Réactions déclarées : H₂O₂ + 2 I⁻ + 2 H⁺ → I₂ + 2 H₂O
       (v = k·[H₂O₂]·[I⁻], k20 = 0,020 L·mol⁻¹·s⁻¹, Ea = 56 kJ/mol) ; S₂O₃²⁻ + 2 H⁺ → S + SO₂ + H₂O (v = k·[S₂O₃²⁻],
       k20 = 7,0 × 10⁻⁴ s⁻¹, Ea = 50 kJ/mol ; le soufre colloïdal trouble la solution : blanc-jaune laiteux, opaque vers
       2 × 10⁻³ mol/L). Solutions : eau oxygénée 0,10 mol/L, acide chlorhydrique 2,0 mol/L, iodure de potassium acidifié.
Reçoit : le contenu d'un récipient (liquide_contenu.js : phases, dissous en mmol, volume en mL, T en °C) et la durée dt (s).
Produit : Labo.reaction_lente({ equation, reactifs, produits, k20, Ea, ordres }) ; Labo.avancer_lent(contenu, dt) -> vrai si le
          contenu a changé (contenu.lentes : avancement en mmol de chaque équation) ; Labo.k_arrhenius(k20, Ea, T) ;
          liquides cin_peroxyde, cin_hcl, cin_ki_acide ; règle de couleur du soufre.
Utilisé par : les simulations de cinétique chimique (2e année du bac).
*/
(function (L) {
  const R = 8.314, LENTES = [], aq = (nom, dissous) => ({ nom, d: 1.0, rgb: [230, 240, 246], alpha: 0.3, classe: "aqueuse", pH: null, dissous });
  Object.assign(L.LIQUIDES, {
    cin_peroxyde: aq("eau oxygénée 0,10 mol/L", { H2O2: 0.1 }),
    cin_hcl: aq("acide chlorhydrique 2,0 mol/L", { "H3O+": 2, "Cl-": 2 }),
    cin_ki_acide: aq("iodure de potassium acidifié", { "K+": 0.1, "I-": 0.1, "H3O+": 0.5, "SO4--": 0.25 }),
  });
  L.LIQUIDES.cin_hcl.pH = 0;
  L.reaction_lente = (r) => LENTES.push(r);
  L.k_arrhenius = (k20, Ea, T) => k20 * Math.exp((-Ea / R) * (1 / (T + 273.15) - 1 / 293.15));

  function avancer_reaction(c, ph, r, dt) {
    // Avancement pendant dt (mmol), limité par les réactifs présents ; renvoie l'avancement.
    const C = (s) => (ph.dissous[s] || 0) / ph.V, k = L.k_arrhenius(r.k20, r.Ea, c.T ?? 20);
    const v = Object.entries(r.ordres).reduce((p, [s, n]) => p * C(s) ** n, k);
    const max = Math.min(...Object.entries(r.reactifs).map(([s, a]) => (ph.dissous[s] || 0) / a));
    const dx = Math.max(0, Math.min(max, v * ph.V * dt));
    if (dx <= 0) return 0;
    for (const [s, a] of Object.entries(r.reactifs)) ph.dissous[s] -= a * dx;
    for (const [s, a] of Object.entries(r.produits)) ph.dissous[s] = (ph.dissous[s] || 0) + a * dx;
    c.lentes = c.lentes || {}; c.lentes[r.equation] = (c.lentes[r.equation] || 0) + dx;
    return dx;
  }

  L.avancer_lent = function (c, dt) {
    // Fait avancer chaque réaction lente de la phase aqueuse ; vrai si l'aspect a pu changer.
    const ph = c.phases.find((p) => p.classe === "aqueuse");
    if (!ph || ph.V <= 0) return false;
    let dx = 0;
    for (const r of LENTES) dx += avancer_reaction(c, ph, r, dt);
    return dx > 1e-7;
  };

  L.reaction_lente({ equation: "H₂O₂ + 2 I⁻ + 2 H⁺ → I₂ + 2 H₂O", reactifs: { H2O2: 1, "I-": 2, "H3O+": 2 }, produits: { I2: 1 }, k20: 0.02, Ea: 56000, ordres: { H2O2: 1, "I-": 1 } });
  L.reaction_lente({ equation: "S₂O₃²⁻ + 2 H⁺ → S + SO₂ + H₂O", reactifs: { "S2O3--": 1, "H3O+": 2 }, produits: { S: 1, SO2: 1 }, k20: 7e-4, Ea: 50000, ordres: { "S2O3--": 1 } });

  L.REGLES_COULEUR = L.REGLES_COULEUR || [];
  L.REGLES_COULEUR.push((ph, rgb, alpha) => {
    // Soufre colloïdal : la solution devient blanc-jaune laiteux, puis opaque.
    const s = L.concentration(ph, "S");
    if (s < 2e-5) return { rgb, alpha };
    const k = Math.min(1, s / 2e-3);
    return { rgb: rgb.map((x, i) => x + ([238, 232, 196][i] - x) * k), alpha: Math.max(alpha, 0.3 + 0.68 * k) };
  });
})(window.Labo);

/*
Rôle : espèces organiques des simulations et leurs tests. Hydrocarbures (pentane, hexane, cyclohexane : non miscibles à
       l'eau, moins denses qu'elle, températures d'ébullition 36, 69 et 81 °C) ; solutions de l'éthanol, de l'éthanal,
       de la propanone, de l'acide éthanoïque et du 2-méthylpropan-2-ol ; réactifs : 2,4-DNPH (précipité jaune-orangé avec
       un aldéhyde ou une cétone), permanganate de potassium acidifié (violet, décoloré par un alcool primaire ou
       secondaire et par un aldéhyde : oxydation ménagée ; un alcool tertiaire ne réagit pas). L'éthanal réduit la liqueur
       de Fehling à chaud, comme le glucose (chimie_reactions.js) ; l'acide éthanoïque fait virer le BBT au jaune
       (acide_base.js). Un liquide organique chauffé au-dessus de sa température d'ébullition bout et s'évapore.
Reçoit : le contenu des récipients (liquide_contenu.js) ; reactions_totales.js, oxydoreduction.js (couleur du permanganate).
Produit : de nouvelles entrées dans Labo.LIQUIDES (org_*) ; réactions ; règle de couleur du précipité de DNPH ;
          Labo.ebullition(contenu, dt) -> vrai si un liquide bout (il perd alors du volume).
Utilisé par : les simulations de chimie organique.
*/
(function (L) {
  const hc = (nom, d, Teb) => ({ nom, d, rgb: [238, 242, 244], alpha: 0.3, classe: "organique", Teb });
  const aq = (nom, dissous, pH = null, autres = {}) => ({ nom, d: 1.0, rgb: [230, 240, 246], alpha: 0.3, classe: "aqueuse", pH, dissous, ...autres });
  Object.assign(L.LIQUIDES, {
    org_pentane: hc("pentane", 0.626, 36), org_hexane: hc("hexane", 0.659, 69), org_cyclohexane: hc("cyclohexane", 0.779, 81),
    org_ethanol: aq("éthanol (solution)", { C2H5OH: 1 }), org_ethanal: aq("éthanal (solution)", { CH3CHO: 0.5 }, null, { glucose: true }),
    org_propanone: aq("propanone (solution)", { CH3COCH3: 1 }), org_acide: aq("acide éthanoïque (solution)", { CH3CO2H: 1 }),
    org_tertiaire: aq("2-méthylpropan-2-ol (solution)", { C4H9OH: 1 }),
    org_dnph: { ...aq("2,4-DNPH", { DNPH: 0.05 }), rgb: [240, 196, 90], alpha: 0.55 },
    org_permanganate: { ...aq("permanganate acidifié", { "MnO4-": 0.01, "K+": 0.01, "H3O+": 1, "SO4--": 0.5 }) },
  });
  const R = (equation, reactifs, produits) => L.reaction({ equation, reactifs, produits });
  R("CH₃CHO + DNPH → hydrazone (précipité)", { CH3CHO: 1, DNPH: 1 }, { hydrazone: 1 });
  R("CH₃COCH₃ + DNPH → hydrazone (précipité)", { CH3COCH3: 1, DNPH: 1 }, { hydrazone: 1 });
  R("5 CH₃CH₂OH + 2 MnO₄⁻ + 6 H⁺ → 5 CH₃CHO + 2 Mn²⁺ + 8 H₂O", { C2H5OH: 5, "MnO4-": 2, "H3O+": 6 }, { CH3CHO: 5, "Mn2+": 2 });
  R("5 CH₃CHO + 2 MnO₄⁻ + 6 H⁺ → 5 CH₃CO₂H + 2 Mn²⁺ + 3 H₂O", { CH3CHO: 5, "MnO4-": 2, "H3O+": 6 }, { CH3CO2H: 5, "Mn2+": 2 });

  const vers = (a, b, k) => a.map((v, i) => v + (b[i] - v) * Math.max(0, Math.min(1, k)));
  L.REGLES_COULEUR.push((ph, rgb, alpha) => {
    // Précipité d'hydrazone (test à la 2,4-DNPH) : jaune-orangé, opaque.
    const c = L.concentration(ph, "hydrazone");
    if (!(c > 1e-6)) return { rgb, alpha };
    const k = Math.min(0.9, 200 * c);
    return { rgb: vers(rgb, [236, 148, 30], k), alpha: Math.max(alpha, 0.4 + 0.5 * k) };
  });

  L.ebullition = function (c, dt) {
    // Chaque liquide organique dont la température d'ébullition est dépassée s'évapore (0,03 mL/s environ).
    let bout = false;
    for (const ph of c.phases) for (const [n, v] of Object.entries(ph.liquides)) {
      const T = L.LIQUIDES[n].Teb;
      if (T === undefined || !(v > 0.01) || (c.T ?? 20) <= T) continue;
      const dv = Math.min(v, 0.03 * dt * ((c.T - T) / 10 + 0.5));
      ph.liquides[n] -= dv; ph.V -= dv; bout = true;
    }
    c.phases = c.phases.filter((p) => p.V > 1e-6);
    return bout;
  };
})(window.Labo);

/*
Rôle : espèces et transformations de la synthèse de l'aspirine : acide salicylique (solide blanc, 3,0 g ≈ 2,1 mL) + anhydride
       éthanoïque (6,0 mL, en excès) → aspirine + acide éthanoïque, à chaud, accélérée par quelques gouttes d'acide sulfurique
       (catalyseur ; sans lui, environ sept fois plus lente) ; versé dans l'eau glacée, le mélange laisse cristalliser
       l'aspirine (peu soluble à froid) et l'eau détruit l'anhydride restant. Comprimé d'aspirine 500 dissous (2,78 mmol dans
       60 mL d'eau et d'éthanol) et soude à 0,20 mol/L : C₉H₈O₄ + HO⁻ → C₉H₇O₄⁻ + H₂O (titrage direct, rapide, à froid).
Reçoit : le contenu d'un récipient (liquide_contenu.js), l'avancement, la durée.
Produit : de nouvelles entrées dans Labo.LIQUIDES ; Labo.ASPIRINE = { acetyler(c, d), cristalliser(c, dt), somme(c, nom),
          M_OBTENUE (masse sèche obtenue, g), N_COMPRIME (mmol) } ; réaction de titrage (reactions_totales.js).
Utilisé par : postes_aspirine.js, poste_comprime.js, simulation.js.
*/
(function (L) {
  const aq = (nom, d, rgb, alpha, pH, dissous = null) => ({ nom, d, rgb, alpha, classe: "aqueuse", pH, dissous });
  const N_COMPRIME = 500 / 180;
  Object.assign(L.LIQUIDES, {
    acide_salicylique: { nom: "acide salicylique (poudre)", d: 1.44, rgb: [248, 248, 244], alpha: 0.96, classe: "solide" },
    anhydride_acetique: aq("anhydride éthanoïque", 1.08, [238, 240, 242], 0.3, 3),
    brut_aspirine: aq("mélange réactionnel (aspirine, acide éthanoïque, anhydride en excès)", 1.1, [242, 238, 222], 0.4, 2),
    suspension_aspirine: aq("cristaux d'aspirine dans l'eau", 1.02, [248, 248, 244], 0.88, 3),
    eau_mere_aspirine: aq("eau mère (acide éthanoïque dilué)", 1.0, [236, 240, 240], 0.3, 3),
    asp_comprime: aq("comprimé d'aspirine 500 dissous", 0.98, [240, 242, 242], 0.35, null, { ASPH: N_COMPRIME / 60 }),
    asp_soude: aq("soude 0,20 mol/L", 1.0, [236, 240, 242], 0.3, null, { "Na+": 0.2, "HO-": 0.2 }),
  });
  L.reaction({ equation: "C₉H₈O₄ + HO⁻ → C₉H₇O₄⁻ + H₂O", reactifs: { ASPH: 1, "HO-": 1 }, produits: { "ASP-": 1 } });
  const somme = (c, n) => c.phases.reduce((s, p) => s + (p.liquides[n] || 0), 0), convertir = L.convertir_liquide;

  L.ASPIRINE = {
    // Acétylation : seulement si les deux réactifs sont dans le ballon ; catalyseur : quelques gouttes d'acide sulfurique.
    acetyler: (c, d) => {
      if (somme(c, "acide_salicylique") <= 0 || somme(c, "anhydride_acetique") <= 0) return;
      const k = somme(c, "ox_sulfurique") > 0.05 ? 1 : 0.15;
      convertir(c, "acide_salicylique", "brut_aspirine", 2.1 * d * k);
      convertir(c, "anhydride_acetique", "brut_aspirine", 6 * d * k);
    },
    // Dans l'eau glacée, le mélange obtenu donne une suspension de cristaux (4 mL par seconde au plus).
    cristalliser: (c, dt) => {
      if (somme(c, "eau_glacee") < 5 || somme(c, "brut_aspirine") <= 0) return;
      const v = convertir(c, "brut_aspirine", "suspension_aspirine", 4 * dt);
      if (v > 0) convertir(c, "eau_glacee", "suspension_aspirine", 2 * v);
    },
    somme, M_OBTENUE: 3.2, N_COMPRIME,
  };
})(window.Labo);

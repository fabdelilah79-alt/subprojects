/*
Rôle : espèces et transformations de la synthèse de l'acide benzoïque : oxydation de l'alcool benzylique par le
       permanganate en milieu basique, à chaud (3 C₆H₅–CH₂OH + 4 MnO₄⁻ → 3 C₆H₅–COO⁻ + 4 MnO₂ + HO⁻ + 4 H₂O : le violet
       devient brun) ; acidification du filtrat d'ions benzoate (C₆H₅–COO⁻ + H₃O⁺ → C₆H₅–COOH + H₂O) : l'acide benzoïque,
       peu soluble dans l'eau froide, précipite en cristaux blancs (suspension laiteuse ; le papier filtre
       retient les cristaux et laisse passer l'eau mère).
Reçoit : le contenu d'un récipient (liquide_contenu.js), l'avancement, la durée.
Produit : de nouvelles entrées dans Labo.LIQUIDES ; Labo.BENZOIQUE = { oxyder(c, d), acidifier(c, dt) -> mL d'acide versé
          qui a réagi, somme(c, nom), M_OBTENUE (masse sèche obtenue, g) }.
Utilisé par : postes_benzoique.js, poste_pesee_benzoique.js, simulation.js.
*/
(function (L) {
  Object.assign(L.LIQUIDES, {
    alcool_benzylique: { nom: "alcool benzylique", d: 1.04, rgb: [240, 238, 228], alpha: 0.3, classe: "organique" },
    permanganate_basique: { nom: "permanganate de potassium + soude", d: 1.03, rgb: [104, 24, 112], alpha: 0.95, classe: "aqueuse", pH: 13 },
    melange_mno2: { nom: "mélange réactionnel (MnO₂ brun + ions benzoate)", d: 1.06, rgb: [86, 56, 30], alpha: 0.98, classe: "aqueuse", pH: 13 },
    benzoate_sodium: { nom: "solution d'ions benzoate", d: 1.02, rgb: [238, 240, 236], alpha: 0.3, classe: "aqueuse", pH: 12 },
    hcl_concentre: { nom: "acide chlorhydrique à 6 mol/L", d: 1.1, rgb: [236, 240, 242], alpha: 0.3, classe: "aqueuse", pH: 0 },
    eau_mere: { nom: "solution acide (eau mère)", d: 1.02, rgb: [236, 240, 240], alpha: 0.3, classe: "aqueuse", pH: 2 },
    suspension_benzoique: { nom: "cristaux d'acide benzoïque dans l'eau mère", d: 1.03, rgb: [246, 246, 240], alpha: 0.88, classe: "aqueuse", pH: 2 },
  });
  const somme = (c, n) => c.phases.reduce((s, p) => s + (p.liquides[n] || 0), 0), convertir = L.convertir_liquide;
  // 45 mL de filtrat (17 mmol d'ions benzoate) consomment 2,8 mL d'acide à 6 mol/L.
  const R = 16;

  L.BENZOIQUE = {
    // Oxydation : seulement si les deux réactifs sont dans le ballon ; 2 mL d'alcool et 45 mL de permanganate par avancement.
    oxyder: (c, d) => {
      if (somme(c, "alcool_benzylique") <= 0 || somme(c, "permanganate_basique") <= 0) return;
      convertir(c, "alcool_benzylique", "melange_mno2", 2 * d);
      convertir(c, "permanganate_basique", "melange_mno2", 45 * d);
    },
    // Acidification : l'acide et les ions benzoate d'une même phase réagissent vite (3 mL d'acide par seconde au plus).
    acidifier: (c, dt) => {
      const ph = c.phases.find((p) => p.liquides.hcl_concentre > 0 && p.liquides.benzoate_sodium > 0);
      if (!ph) return 0;
      const v = Math.min(ph.liquides.hcl_concentre, ph.liquides.benzoate_sodium / R, 3 * dt);
      convertir(c, "hcl_concentre", "suspension_benzoique", v);
      convertir(c, "benzoate_sodium", "suspension_benzoique", R * v);
      return v;
    },
    somme,
    M_OBTENUE: 1.62,
  };
})(window.Labo);

/*
Rôle : espèces et transformations de la synthèse de l'arôme de banane : alcool isoamylique + acide acétique → acétate
       d'isoamyle + eau, à chaud, accélérée par quelques gouttes d'acide sulfurique (catalyseur) ; le mélange obtenu est
       homogène ; dans l'eau salée, l'ester (peu soluble, moins dense que l'eau) se sépare et forme la phase du dessus.
Reçoit : le contenu d'un récipient (liquide_contenu.js), l'avancement, la durée.
Produit : de nouvelles entrées dans Labo.LIQUIDES ; Labo.AROME = { esterifier(c, d), separer(c, dt) }.
Utilisé par : postes_arome.js.
*/
(function (L) {
  Object.assign(L.LIQUIDES, {
    alcool_isoamylique: { nom: "alcool isoamylique", d: 0.81, rgb: [236, 240, 242], alpha: 0.3, classe: "aqueuse" },
    acide_acetique: { nom: "acide acétique", d: 1.05, rgb: [236, 240, 242], alpha: 0.3, classe: "aqueuse", pH: 2 },
    acide_sulfurique: { nom: "acide sulfurique", d: 1.8, rgb: [236, 238, 240], alpha: 0.3, classe: "aqueuse", pH: 1 },
    brut_ester: { nom: "mélange obtenu", d: 0.95, rgb: [238, 232, 210], alpha: 0.35, classe: "aqueuse", pH: 3 },
    ester: { nom: "acétate d'isoamyle", d: 0.87, rgb: [246, 238, 196], alpha: 0.45, classe: "organique" },
    eau_acide: { nom: "phase aqueuse", d: 1.15, rgb: [232, 240, 246], alpha: 0.32, classe: "aqueuse", pH: 3 },
  });
  const somme = (c, n) => c.phases.reduce((s, p) => s + (p.liquides[n] || 0), 0);

  L.AROME = {
    // Estérification : sans catalyseur, la transformation est environ sept fois plus lente.
    esterifier: (c, d) => {
      const k = somme(c, "acide_sulfurique") > 0.05 ? 1 : 0.15;
      L.convertir_liquide(c, "alcool_isoamylique", "brut_ester", 15 * d * k);
      L.convertir_liquide(c, "acide_acetique", "brut_ester", 20 * d * k);
    },
    // Lavage à l'eau salée : 40 % du mélange obtenu est de l'ester (phase du dessus), le reste passe dans l'eau.
    separer: (c, dt) => {
      if (somme(c, "eau_salee") < 1) return;
      const v = L.convertir_liquide(c, "brut_ester", "eau_acide", 30 * dt);
      if (v > 0) L.convertir_liquide(c, "eau_acide", "ester", 0.4 * v);
    },
    somme,
  };
})(window.Labo);

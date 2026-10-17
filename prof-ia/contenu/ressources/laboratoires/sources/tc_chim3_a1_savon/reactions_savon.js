/*
Rôle : espèces et transformations de la synthèse d'un savon : huile + soude → savon + glycérol (saponification, à chaud,
       dans l'éthanol qui aide l'huile et la soude à se rencontrer) ; dans l'eau salée, le savon est peu soluble : il se
       rassemble en grains qui flottent (relargage).
Reçoit : le contenu d'un récipient (liquide_contenu.js) et l'avancement.
Produit : de nouvelles entrées dans Labo.LIQUIDES ; Labo.SAVON = { convertir(c, de, vers, V), saponifier(c, d), relarguer(c, dt) }.
Utilisé par : postes_reflux_savon.js, postes_savon_test.js.
*/
(function (L) {
  Object.assign(L.LIQUIDES, {
    soude: { nom: "solution de soude", d: 1.3, rgb: [236, 242, 244], alpha: 0.32, classe: "aqueuse", pH: 14 },
    eau_salee: { nom: "eau salée", d: 1.2, rgb: [230, 240, 246], alpha: 0.32, classe: "aqueuse", pH: 7 },
    savon_solution: { nom: "savon dissous", d: 1.0, rgb: [238, 222, 176], alpha: 0.7, classe: "aqueuse", pH: 10 },
    savon_grains: { nom: "grains de savon", d: 0.93, rgb: [246, 240, 222], alpha: 0.96, classe: "solide" },
    eau_savon_obtenu: { nom: "eau + savon obtenu", d: 1.0, rgb: [240, 238, 226], alpha: 0.5, classe: "aqueuse", mousse: true },
    eau_savon_commerce: { nom: "eau + savon du commerce", d: 1.0, rgb: [240, 238, 228], alpha: 0.5, classe: "aqueuse", mousse: true },
  });

  function convertir(c, de, vers, V) {
    // Remplace V mL du liquide « de » par V mL du liquide « vers » (dans la phase qui le contient).
    const ph = c.phases.find((p) => p.liquides[de] > 0);
    if (!ph) return 0;
    const v = Math.min(V, ph.liquides[de]);
    ph.liquides[de] -= v; ph.V -= v;
    if (ph.V < 1e-6) c.phases.splice(c.phases.indexOf(ph), 1);
    c.ajouter(vers, v);
    return v;
  }

  L.SAVON = {
    convertir,
    // Saponification : à chaque part d'avancement, 20 mL d'huile et 20 mL de soude réagissent (proportionnellement).
    saponifier: (c, d) => { convertir(c, "huile", "savon_solution", 20 * d); convertir(c, "soude", "savon_solution", 20 * d); },
    // Relargage : dans l'eau salée, le savon dissous forme des grains (60 % du volume), le reste reste dans l'eau.
    relarguer: (c, dt) => {
      if (!c.phases.some((p) => p.liquides.eau_salee > 0)) return;
      const v = convertir(c, "savon_solution", "eau", 20 * dt);
      if (v > 0) { convertir(c, "eau", "savon_grains", 0.6 * v); }
    },
  };
})(window.Labo);

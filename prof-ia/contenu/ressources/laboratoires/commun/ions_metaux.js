/*
Rôle : transformations entre métaux et ions en solution, dans un récipient : un métal plongé dans la solution d'ions d'un
       métal moins réducteur se recouvre de ce métal (Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag ; Fe + Cu²⁺ → Fe²⁺ + Cu ; Fe + 2 Ag⁺ →
       Fe²⁺ + 2 Ag), et ses ions passent en solution ; la soude précipite les ions : Cu(OH)₂ bleu, Fe(OH)₂ vert, Ag₂O brun.
       Le précipité trouble d'abord le liquide, puis tombe au fond. Quantités en mmol ; le métal plongé est en excès.
Reçoit : le récipient (recipient_physique.js) avec, s'il y en a un, r.metal = { type (« cuivre », « fer »), Ag, Cu (mmol déposées) }, et la durée du pas.
Produit : de nouvelles entrées dans Labo.LIQUIDES (nitrate_argent 0,10 mol/L, sulfate_cuivre 0,050 mol/L, soude 1,0 mol/L,
          précipités) et Labo.TEINTES ; Labo.IONS = { evoluer(r, dt) (vrai si quelque chose a changé), bilan(contenu) }.
Utilisé par : metal_tube.js et les simulations de chimie (transformations chimiques).
*/
(function (L) {
  const aq = (nom, dissous, pH = 7) => ({ nom, d: 1.0, rgb: [228, 240, 246], alpha: 0.3, classe: "aqueuse", pH, dissous });
  const solide = (nom, d, rgb) => ({ nom, d, rgb, alpha: 0.95, classe: "solide" });
  Object.assign(L.LIQUIDES, { nitrate_argent: aq("nitrate d'argent", { "Ag+": 0.1 }), sulfate_cuivre: aq("sulfate de cuivre", { "Cu2+": 0.05 }, 5) });
  L.LIQUIDES.soude ??= { ...aq("solution de soude", null, 14), d: 1.04 };
  L.LIQUIDES.hydroxyde_cuivre_ii ??= solide("hydroxyde de cuivre", 3.4, [70, 140, 215]);
  Object.assign(L.LIQUIDES, { hydroxyde_fer_ii: solide("hydroxyde de fer II", 3.4, [104, 132, 96]), oxyde_argent: solide("oxyde d'argent", 7.1, [84, 60, 42]) });
  L.TEINTES["Cu2+"] ??= { aqueuse: [24, 104, 214], organique: [24, 104, 214] };
  L.TEINTES["Fe2+"] ??= { aqueuse: [168, 200, 150], organique: [168, 200, 150] };
  // Précipités : ion, nom, ions métalliques par unité formée (chacune demande 2 HO⁻), volume apparent (mL) d'une mmol
  // de précipité floconneux. Temps (s) des réactions sur le métal.
  const PRECIPITES = [["Cu2+", "hydroxyde_cuivre_ii", 1, 5], ["Fe2+", "hydroxyde_fer_ii", 1, 5], ["Ag+", "oxyde_argent", 2, 2.5]];
  const TAU = { cuivre: { "Ag+": 25 }, fer: { "Cu2+": 20, "Ag+": 20 } };

  const aqueuse = (c) => c.phases.find((p) => p.classe === "aqueuse");
  const n = (c, s) => aqueuse(c)?.dissous[s] || 0;
  const vol = (c, nom) => c.phases.reduce((s, p) => s + (p.liquides[nom] || 0), 0);
  const ajouter_ion = (c, s, dn) => { const ph = aqueuse(c); if (ph) ph.dissous[s] = Math.max(0, (ph.dissous[s] || 0) + dn); };

  function sur_le_metal(r, dt) {
    // Le métal plongé réduit les ions d'un métal moins réducteur ; ce métal se dépose sur lui.
    const m = r.metal, c = r.c;
    if (!m || !aqueuse(c) || r.pr.hauteur_de(c.volume()) - r.pr.h0 < 8) return false;
    let change = false;
    for (const [ion, tau] of Object.entries(TAU[m.type] || {})) {
      const dn = n(c, ion) * (1 - Math.exp(-dt / tau));
      if (dn < 1e-7) continue;
      const forme = m.type === "cuivre" ? "Cu2+" : "Fe2+", par = ion === "Ag+" ? 0.5 : 1;
      ajouter_ion(c, ion, -dn); ajouter_ion(c, forme, dn * par);
      if (ion === "Ag+") m.Ag += dn; else m.Cu += dn;
      change = true;
    }
    return change;
  }

  function precipiter(c, dt) {
    // La soude (1 mmol d'ions HO⁻ par mL) précipite les ions métalliques ; le liquide est d'abord trouble.
    let change = false;
    for (const [ion, nom, a, V] of PRECIPITES) {
      const p = Math.min(n(c, ion) / a, vol(c, "soude") / 2, 3 * dt);
      if (p < 1e-6) continue;
      ajouter_ion(c, ion, -p * a); L.convertir_liquide(c, "soude", "eau", p * 2); c.ajouter(nom, p * V);
      c.trouble = { nom, q: Math.min(1, (c.trouble?.nom === nom ? c.trouble.q : 0) + p * 6) }; change = true;
    }
    if (c.trouble) { c.trouble.q *= Math.exp(-dt / 10); if (c.trouble.q < 0.02) c.trouble = null; change = true; }
    return change;
  }

  L.REGLES_COULEUR = L.REGLES_COULEUR || [];
  L.REGLES_COULEUR.push((ph, rgb, alpha, c) => {
    // Précipité en suspension : le liquide prend sa couleur et devient opaque.
    if (!c.trouble || ph.classe !== "aqueuse") return { rgb, alpha };
    const t = L.LIQUIDES[c.trouble.nom].rgb, k = Math.min(0.85, c.trouble.q);
    return { rgb: rgb.map((v, i) => v + (t[i] - v) * k), alpha: Math.min(0.92, alpha + 0.6 * k) };
  });

  const r3 = (v) => Math.round(v * 1000) / 1000;
  L.IONS = {
    evoluer: (r, dt) => { const a = sur_le_metal(r, dt), b = precipiter(r.c, dt); return a || b; },
    bilan: (c) => ({ Ag: r3(n(c, "Ag+")), Cu: r3(n(c, "Cu2+")), Fe: r3(n(c, "Fe2+")), HO: r3(vol(c, "soude")), CuOH2: r3(vol(c, "hydroxyde_cuivre_ii") / 5), FeOH2: r3(vol(c, "hydroxyde_fer_ii") / 5), Ag2O: r3(vol(c, "oxyde_argent") / 2.5) }),
  };
})(window.Labo);

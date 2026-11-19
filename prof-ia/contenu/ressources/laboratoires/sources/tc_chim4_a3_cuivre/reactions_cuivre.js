/*
Rôle : espèces et transformations du cycle du cuivre, dans un tube à essai : le cuivre métal est attaqué par l'acide
       nitrique (gaz roux NO₂, ions Cu²⁺ bleus) ; la soude neutralise d'abord l'acide en excès, puis précipite l'hydroxyde de
       cuivre Cu(OH)₂ (bleu) ; chauffé (au-dessus de 60 °C), il devient de l'oxyde de cuivre CuO (noir) ; l'acide sulfurique
       le dissout (Cu²⁺ bleus) ; la poudre de fer réduit les ions Cu²⁺ en cuivre métal (dépôt rouge), et donne des ions Fe²⁺.
       Les quantités sont comptées en « unités de cuivre » (1 unité au départ) : l'élément cuivre se conserve.
Reçoit : le contenu d'un tube (liquide_contenu.js, avec sa température c.T) et la durée du pas (s).
Produit : de nouvelles entrées dans Labo.LIQUIDES et Labo.TEINTES ; Labo.CUIVRE = { evoluer(c, dt), bilan(c) -> { metal,
          ions, hydroxyde, oxyde, fer, gaz } } (en unités de cuivre ; gaz : vrai pendant l'attaque nitrique).
Utilisé par : poste_cuivre.js.
*/
(function (L) {
  const aq = (nom, pH) => ({ nom, d: 1.1, rgb: [236, 242, 244], alpha: 0.3, classe: "aqueuse", pH });
  const solide = (nom, d, rgb) => ({ nom, d, rgb, alpha: 0.97, classe: "solide" });
  Object.assign(L.LIQUIDES, {
    acide_nitrique: aq("acide nitrique", 0), acide_sulfurique: aq("acide sulfurique", 0.5), soude: { ...aq("solution de soude", 14), d: 1.3 },
    cuivre_metal: solide("cuivre", 8.9, [196, 98, 52]), hydroxyde_cuivre_ii: solide("hydroxyde de cuivre", 3.4, [70, 140, 215]),
    oxyde_cuivre_ii: solide("oxyde de cuivre", 6.3, [32, 30, 30]), fer_poudre: solide("poudre de fer", 7.9, [96, 98, 102]),
  });
  L.TEINTES["Cu2+"] = { aqueuse: [24, 104, 214], organique: [24, 104, 214] };
  L.TEINTES["Fe2+"] = { aqueuse: [168, 200, 150], organique: [168, 200, 150] };
  // Volume (mL) ou quantité dissoute qui correspond à une unité de cuivre, pour chaque forme.
  const PAR_UNITE = { cuivre_metal: 0.25, hydroxyde_cuivre_ii: 0.8, oxyde_cuivre_ii: 0.3, fer_poudre: 0.08, "Cu2+": 0.15, "Fe2+": 0.06 };
  const ACIDE = 0.5, SOUDE = 0.5;

  const vol = (c, n) => c.phases.reduce((s, p) => s + (p.liquides[n] || 0), 0);
  const unites = (c, n) => vol(c, n) / PAR_UNITE[n];
  const ions = (c, s) => (c.phases.find((p) => p.classe === "aqueuse")?.dissous[s] || 0) / PAR_UNITE[s];

  function retirer(c, n, V) {
    // Retire V mL d'un liquide ou d'un solide (sa phase disparaît quand elle est vide).
    const ph = c.phases.find((p) => p.liquides[n] > 0);
    if (!ph || V <= 0) return;
    const v = Math.min(V, ph.liquides[n]);
    ph.liquides[n] -= v; ph.V -= v;
    if (ph.V < 1e-6) c.phases.splice(c.phases.indexOf(ph), 1);
  }

  function ion(c, s, du) {
    // Ajoute (ou retire, du < 0) des ions dans la phase aqueuse.
    const ph = c.phases.find((p) => p.classe === "aqueuse");
    if (ph) ph.dissous[s] = Math.max(0, (ph.dissous[s] || 0) + du * PAR_UNITE[s]);
  }

  function acides(c, V) {
    // Consomme V mL d'acide (nitrique d'abord) ; les acides consommés deviennent de l'eau.
    for (const n of ["acide_nitrique", "acide_sulfurique"]) { const v = Math.min(V, vol(c, n)); L.convertir_liquide(c, n, "eau", v); V -= v; }
  }

  function evoluer(c, dt) {
    // Un pas : neutralisation, attaque du cuivre, précipitation, déshydratation à chaud, dissolution acide, action du fer.
    const acide = () => vol(c, "acide_nitrique") + vol(c, "acide_sulfurique");
    const neutre = Math.min(vol(c, "soude"), acide()) * Math.min(1, 5 * dt);
    if (neutre > 1e-4) { L.convertir_liquide(c, "soude", "eau", neutre); acides(c, neutre); }
    const attaque = Math.min(unites(c, "cuivre_metal"), vol(c, "acide_nitrique") / ACIDE, 0.04 * dt);
    c.gaz = attaque > 1e-5;
    if (c.gaz) { retirer(c, "cuivre_metal", attaque * PAR_UNITE.cuivre_metal); ion(c, "Cu2+", attaque); L.convertir_liquide(c, "acide_nitrique", "eau", attaque * ACIDE); }
    const precip = Math.min(ions(c, "Cu2+"), vol(c, "soude") / SOUDE, 2 * dt);
    if (precip > 1e-5) { ion(c, "Cu2+", -precip); c.ajouter("hydroxyde_cuivre_ii", precip * PAR_UNITE.hydroxyde_cuivre_ii); L.convertir_liquide(c, "soude", "eau", precip * SOUDE); }
    const T = c.T ?? 20, chauffe = T > 60 ? unites(c, "hydroxyde_cuivre_ii") * Math.min(1, (dt * (T - 60)) / 150) : 0;
    if (chauffe > 1e-5) { retirer(c, "hydroxyde_cuivre_ii", chauffe * PAR_UNITE.hydroxyde_cuivre_ii); c.ajouter("oxyde_cuivre_ii", chauffe * PAR_UNITE.oxyde_cuivre_ii); }
    for (const n of ["oxyde_cuivre_ii", "hydroxyde_cuivre_ii"]) {
      const d = Math.min(unites(c, n), acide() / ACIDE, 0.5 * dt);
      if (d > 1e-5) { retirer(c, n, d * PAR_UNITE[n]); ion(c, "Cu2+", d); acides(c, d * ACIDE); }
    }
    const fer = Math.min(unites(c, "fer_poudre"), ions(c, "Cu2+"), 0.1 * dt);
    if (fer > 1e-5) { retirer(c, "fer_poudre", fer * PAR_UNITE.fer_poudre); ion(c, "Cu2+", -fer); ion(c, "Fe2+", fer); c.ajouter("cuivre_metal", fer * PAR_UNITE.cuivre_metal); }
  }

  const r2 = (v) => Math.round(v * 100) / 100;
  L.CUIVRE = {
    evoluer,
    bilan: (c) => ({ metal: r2(unites(c, "cuivre_metal")), ions: r2(ions(c, "Cu2+")), hydroxyde: r2(unites(c, "hydroxyde_cuivre_ii")), oxyde: r2(unites(c, "oxyde_cuivre_ii")), fer: r2(unites(c, "fer_poudre")), gaz: !!c.gaz, T: Math.round(c.T ?? 20) }),
  };
})(window.Labo);

/*
Rôle : les trois paillasses de calorimétrie (temps accéléré × 3) : (1) capacité thermique du calorimètre : 200 g d'eau
       froide (18,0 °C) dans le calorimètre, bécher de 200 g d'eau chaude (60,0 °C) ; (2) chaleur massique d'un métal :
       200 g d'eau à 20,0 °C, cylindre de 100,0 g sorti de l'eau bouillante ; (3) chaleur latente de fusion de la glace :
       200 g d'eau à 30,0 °C, glaçons pesés sur une balance.
Reçoit : le groupe SVG de chaque paillasse.
Produit : Labo.poste_calo_capacite(g), Labo.poste_calo_metal(g), Labo.poste_calo_glace(g) -> { pense_bete } ;
          faits « calo_capacite », « calo_metal », « calo_glace » = { theta, essais: [{ theta1, ..., thetae }] }.
Utilisé par : simulation.js.
*/
(function (L) {
  const VITE = 3, C_EAU = L.vase_modele.C_EAU;

  function animer(base, objets, fait) {
    // Boucle d'animation commune ; faits notés 4 fois par seconde.
    let avant = null;
    const image = (t) => {
      const dt = avant === null ? 0 : Math.min(0.05, (t - avant) / 1000) * VITE; avant = t;
      base.tic(dt); objets.forEach((o) => { if (o.tic) o.tic(dt); o.dessiner(); }); base.vase.dessiner();
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    setInterval(() => L.missions.noter(fait, { theta: Math.round(base.v.theta * 10) / 10, essais: base.essais.slice() }), 250);
  }

  L.poste_calo_capacite = function (g) {
    // Calorimètre à 18,0 °C et bécher d'eau chaude.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    let b = null;
    const base = L.calo_base(g, { theta: 18, recommencer: () => b.remplir() });
    b = L.becher_verseur(g, { x: 280, base: 556, m: 200, c: C_EAU, theta: 60, nom: "eau", etiquette: "eau chaude", cible: base.vase.dans, verser: (m, c, theta, nom) => { base.ajouter({ theta2: Math.round(theta * 10) / 10 }); base.v.verser(m, c, theta, nom); } });
    animer(base, [b], "calo_capacite");
    return { pense_bete };
  };

  L.poste_calo_metal = function (g) {
    // Calorimètre à 20,0 °C et cylindre de métal dans l'eau bouillante.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    let m = null;
    const base = L.calo_base(g, { theta: 20, recommencer: () => m.remettre() });
    m = L.metal_bouillant(g, base.vase, (masse, c, theta) => { base.ajouter({}); base.v.plonger(masse, c, theta, "metal"); });
    animer(base, [m], "calo_metal");
    return { pense_bete };
  };

  L.poste_calo_glace = function (g) {
    // Calorimètre à 30,0 °C et glaçons sur la balance.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    let q = null;
    const base = L.calo_base(g, { theta: 30, recommencer: () => q.remettre() });
    q = L.glacons_balance(g, base.vase, (masse) => { base.ajouter({ m_glace: masse }); base.v.ajouter_glace(masse); });
    animer(base, [q], "calo_glace");
    return { pense_bete };
  };
})(window.Labo);

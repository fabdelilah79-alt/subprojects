/*
Rôle : réaction de l'acide éthanoïque (vinaigre dilué, 0,50 mol/L) avec l'hydrogénocarbonate de sodium (poudre blanche),
       dans un récipient : CH₃COOH + HCO₃⁻ → CH₃COO⁻ + CO₂ + H₂O. La réaction est rapide (effervescence : bulles et mousse) et
       s'arrête quand un des réactifs est épuisé (réactif limitant). Quantités en mmol.
Reçoit : le récipient (recipient_physique.js) et la durée du pas.
Produit : de nouvelles entrées dans Labo.LIQUIDES (acide_ethanoique, ethanoate_sodium, hydrogenocarbonate) ;
          Labo.EFFERVESCENCE = { evoluer(r, dt) -> mmol de CO₂ formées pendant le pas, bilan(contenu), habiller(r) (bulles) }.
Utilisé par : les simulations de chimie (avancement d'une réaction).
*/
(function (L) {
  const C_ACIDE = 0.5, M_BIC = 84, D_BIC = 2.2, TAU = 1.5;
  Object.assign(L.LIQUIDES, {
    acide_ethanoique: { nom: "vinaigre dilué", d: 1.0, rgb: [244, 238, 220], alpha: 0.32, classe: "aqueuse", pH: 2.7 },
    ethanoate_sodium: { nom: "solution d'éthanoate de sodium", d: 1.0, rgb: [236, 240, 240], alpha: 0.3, classe: "aqueuse", pH: 8 },
    hydrogenocarbonate: { nom: "hydrogénocarbonate de sodium", d: D_BIC, rgb: [250, 250, 248], alpha: 0.97, classe: "solide", collant: 0.1 },
  });
  const vol = (c, n) => c.phases.reduce((s, p) => s + (p.liquides[n] || 0), 0);
  const n_acide = (c) => vol(c, "acide_ethanoique") * C_ACIDE, n_bic = (c) => (vol(c, "hydrogenocarbonate") * D_BIC * 1000) / M_BIC;

  function retirer_solide(c, nom, V) {
    // Retire V mL d'un solide (sa phase disparaît quand elle est vide).
    const ph = c.phases.find((p) => p.liquides[nom] > 0);
    if (!ph) return;
    const v = Math.min(V, ph.liquides[nom]); ph.liquides[nom] -= v; ph.V -= v;
    if (ph.V < 1e-7) c.phases.splice(c.phases.indexOf(ph), 1);
  }

  function evoluer(r, dt) {
    // Avancement pendant le pas : il tend vers le plus petit des deux réactifs (le réactif limitant).
    const c = r.c, a = n_acide(c), b = n_bic(c);
    let dn = Math.min(a, b) * (1 - Math.exp(-dt / TAU));
    if (Math.min(a, b) - dn < 0.005) dn = Math.min(a, b);
    const avant = r.debit || 0;
    r.debit = dn / Math.max(dt, 1e-6);
    if (dn < 1e-7) { if (avant > 0) r.sig = null; return 0; }
    L.convertir_liquide(c, "acide_ethanoique", "ethanoate_sodium", dn / C_ACIDE);
    retirer_solide(c, "hydrogenocarbonate", (dn * M_BIC) / 1000 / D_BIC);
    r.sig = null;
    return dn;
  }

  function bulles(l, r) {
    // Effervescence : bulles qui montent dans le liquide et mousse en surface, d'autant plus que le débit de gaz est grand.
    const k = Math.min(1, (r.debit || 0) / 1.2);
    if (k < 0.02) return;
    const pr = r.pr, h = pr.hauteur_de(r.c.volume());
    for (let i = 0; i < Math.round(40 * k) + 3; i++) {
      const y = pr.h0 + Math.random() * (h - pr.h0), x = (Math.random() * 2 - 1) * (pr.r(y) - 1.5);
      L.svg("circle", { cx: x, cy: -y, r: 0.5 + Math.random() * 1.1, fill: "none", stroke: "#ffffff", "stroke-width": 0.35, opacity: 0.85 }, l);
    }
    const w = pr.r(h) - 0.5;
    L.svg("path", { d: `M${-w} ${-h} Q0 ${-h - 4 * k} ${w} ${-h} Z`, fill: "#fbfbf6", opacity: 0.4 + 0.5 * k }, l);
  }

  const r3 = (v) => Math.round(v * 1000) / 1000;
  L.EFFERVESCENCE = {
    evoluer,
    bilan: (c) => ({ acide: r3(n_acide(c)), bic: r3(n_bic(c)) }),
    habiller: (r) => { r.dessiner = () => bulles(L.dessiner_verrerie(r.g, r.pr, r.pose, r.etat()), r); },
    C_ACIDE, M_BIC,
  };
})(window.Labo);

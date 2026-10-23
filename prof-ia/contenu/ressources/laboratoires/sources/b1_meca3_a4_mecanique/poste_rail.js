/*
Rôle : paillasse du rail à coussin d'air incliné : le mobile (200 g) est retenu en haut par un électroaimant ; « Lâcher »
       le libère sans vitesse. Avec le débit normal de la soufflerie, il glisse sans frottement (a = g·sin α) ; avec le
       débit faible, il frotte sur le rail (force constante f = 0,080 N : a = g·sin α − f/m). Les deux cellules mesurent la
       durée d'occultation du drapeau (ℓ = 2,0 cm) à x = 20 cm et x = 80 cm ; « Remonter » le ramène en haut.
Reçoit : le groupe SVG de la paillasse ; les boutons touchés par l'élève.
Produit : Labo.poste_rail(g) -> { pense_bete } ; fait « rail » = { debit, dt1, dt2 (s), bouge, essais: [{ debit, dt1, dt2 }] }.
Utilisé par : simulation.js (paillasse 2).
*/
(function (L) {
  const R = L.rail_dessin, G = 9.81, SIN = 0.1, M = 0.2, F = 0.08, ELL = 0.02, FIN = 0.93;
  const acc = (debit) => G * SIN - (debit === "faible" ? F / M : 0);
  const instant = (x, a) => Math.sqrt((2 * Math.max(0, x)) / a);
  const occultation = (x, a) => (instant(x + ELL / 2, a) - instant(x - ELL / 2, a)) * (1 + (Math.random() - 0.5) * 0.002);

  function avancer(e, dt) {
    // Glissement uniformément accéléré jusqu'à la butée ; durée affichée quand le drapeau a passé une cellule.
    if (!e.bouge) return;
    e.t += dt;
    const a = acc(e.debit_lache);
    e.x = Math.min(FIN, 0.5 * a * e.t * e.t);
    R.X_CELLULES.forEach((xc, k) => { if (e.dt[k] === null && e.x > xc + ELL / 2) e.dt[k] = occultation(xc, a); });
    if (e.x >= FIN) { e.bouge = false; e.essais.push({ debit: e.debit_lache, dt1: e.dt[0], dt2: e.dt[1] }); }
  }

  function commandes(g, e) {
    // Boutons de l'électroaimant et de la soufflerie.
    L.bouton_texte(g, 155, 298, "Lâcher", () => { if (!e.bouge && e.x === 0) { e.bouge = true; e.t = 0; e.dt = [null, null]; e.debit_lache = e.debit; } });
    L.bouton_texte(g, 155, 326, "Remonter", () => { if (!e.bouge) e.x = 0; });
    L.bouton_texte(g, 540, 506, "Débit normal", () => { e.debit = "normal"; });
    L.bouton_texte(g, 540, 532, "Débit faible", () => { e.debit = "faible"; });
  }

  L.poste_rail = function (g) {
    // Décor, commandes, calque animé ; faits notés 4 fois par seconde.
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    R.fond(L.svg("g", {}, g));
    const e = { x: 0, t: 0, bouge: false, debit: "normal", debit_lache: "normal", dt: [null, null], essais: [] };
    commandes(g, e);
    const c = L.svg("g", { "pointer-events": "none" }, g);
    let avant = null;
    const image = (t) => {
      avancer(e, avant === null ? 0 : Math.min(0.03, (t - avant) / 1000)); avant = t;
      c.replaceChildren();
      R.mobile(c, e.x);
      R.cellules(c, R.X_CELLULES.map((xc) => Math.abs(e.x - xc) < ELL / 2));
      R.afficheurs(c, e.dt[0], e.dt[1], e.debit);
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    const r = (x) => (x === null ? null : Math.round(x * 1e6) / 1e6);
    setInterval(() => L.missions.noter("rail", { debit: e.debit, dt1: r(e.dt[0]), dt2: r(e.dt[1]), bouge: e.bouge, essais: e.essais.map((x) => ({ ...x, dt1: r(x.dt1), dt2: r(x.dt2) })) }), 250);
    return { pense_bete };
  };
})(window.Labo);

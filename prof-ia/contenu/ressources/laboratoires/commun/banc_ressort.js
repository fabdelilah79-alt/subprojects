/*
Rôle : oscillateur « solide-ressort horizontal » sur le banc à coussin d'air : mobile de masse m = 0,200 kg + 0,100 kg par
       surcharge, ressort de raideur k (à gauche) et, avec l'excitateur, second ressort k2 relié à la tige du moteur
       (e(t) = a·cos(2π·f·t)). Frottement fluide −h·v (h = h_base, plus 0,25 kg/s avec la palette, 5 kg/s avec l'aimant de
       freinage). Calcul pas à pas (0,5 ms) : m·ẍ = −k·x − k2·(x − e) − h·ẋ. On écarte le mobile à la main (±8 cm) et on
       le lâche sans vitesse ; le capteur mesure la position (x vers la droite, en m, 0 à l'équilibre).
Reçoit : le groupe SVG et { k (N/m), k2 (0 sans excitateur), h_base (kg/s), a_exc (m), capteur (vrai : capteur de position dessiné),
         sur_lacher(x0), sur_pas(t, x) }.
Produit : Labo.banc_ressort(g, reglage) -> banc { e (état : n, k, k2, amortisseur, x, v, tenu, f, marche, t), masse(), h(),
          T0() (2π·√(m/(k + k2))), regler(changement) (arrête le mobile), dessiner() }.
Utilisé par : les simulations des oscillateurs mécaniques (2e année du bac).
*/
(function (L) {
  const AMORTI = { aucun: 0, palette: 0.25, aimant: 5 }, DT = 0.0005, XMAX = 0.08;

  function pas(b, dt) {
    // Un pas de calcul (Euler semi-implicite) : force des ressorts, de l'excitateur et du frottement fluide.
    const e = b.e, m = b.masse(), ex = b.excitation();
    e.v += ((-e.k * e.x - e.k2 * (e.x - ex) - b.h() * e.v) / m) * dt;
    e.x += e.v * dt;
    if (e.marche) e.phase += 2 * Math.PI * e.f * dt;
    e.t += dt;
  }

  function geste(b) {
    // Le mobile suit la main horizontalement (±8 cm) ; lâché, il part sans vitesse.
    const D = L.banc_ressort_dessin, px = 1000 * D.MM;
    let depart = 0;
    L.glissable(b.vue.mobile, {
      soulever: false,
      debut: () => { b.e.tenu = true; b.e.v = 0; depart = b.e.x; return { x: D.X_EQ + b.e.x * px, y: D.HAUT }; },
      deplacer: (p) => { b.e.x = Math.max(-XMAX, Math.min(XMAX, (p.x - D.X_EQ) / px)); b.e.v = 0; b.dessiner(); },
      lacher: () => { b.e.tenu = false; if (Math.abs(b.e.x - depart) > 0.002 || Math.abs(b.e.x) > 0.002) b.sur_lacher(b.e.x); },
      fin: () => { b.e.tenu = false; },
    });
  }

  L.banc_ressort = function (g, { k = 10, k2 = 0, h_base = 0.04, a_exc = 0.015, capteur = true, sur_lacher = () => {}, sur_pas = () => {} } = {}) {
    // Banc, ressorts, mobile et excitateur dessinés ; boucle d'animation en temps réel.
    const D = L.banc_ressort_dessin, px = 1000 * D.MM;
    D.fond(g, k2 > 0, capteur);
    const gr = L.svg("g", {}, g), gx = L.svg("g", {}, g), gm = L.svg("g", {}, g);
    const b = { e: { n: 0, k, k2, amortisseur: "aucun", x: 0, v: 0, tenu: false, f: 1, marche: false, phase: 0, t: 0 }, vue: {}, sur_lacher };
    b.masse = () => 0.2 + 0.1 * b.e.n;
    b.h = () => h_base + AMORTI[b.e.amortisseur];
    b.excitation = () => (b.e.k2 ? a_exc * Math.cos(b.e.phase) : 0);
    b.T0 = () => 2 * Math.PI * Math.sqrt(b.masse() / (b.e.k + b.e.k2));
    b.dessiner = () => {
      // Ressorts (bleu : 10 N/m ; vert : 20 N/m), excitateur, mobile à sa position.
      const xm = D.X_EQ + b.e.x * px, couleur = (kk) => (kk > 15 ? "#2e8b57" : "#2f6db3");
      gr.replaceChildren(); gm.replaceChildren();
      D.ressort(gr, D.X0 + 14, xm, couleur(b.e.k));
      if (b.e.k2) D.ressort(gr, xm + D.LONG, D.excitateur(gx, b.e.phase, b.excitation() * px, a_exc * px), couleur(b.e.k2));
      b.vue.mobile = D.mobile(gm, xm, b.e.n, b.e.amortisseur);
      geste(b);
    };
    b.regler = (changement) => { Object.assign(b.e, changement, { x: 0, v: 0 }); b.dessiner(); };
    let avant = null;
    const image = (instant) => {
      const dt = avant === null ? 0 : Math.min(0.05, (instant - avant) / 1000); avant = instant;
      if (!b.e.tenu) for (let r = dt; r > 1e-9; r -= DT) { pas(b, Math.min(DT, r)); sur_pas(b.e.t, b.e.x); }
      else { b.e.t += dt; sur_pas(b.e.t, b.e.x); }
      if (b.e.marche) b.e.phase %= 2 * Math.PI;
      b.dessiner(); requestAnimationFrame(image);
    };
    b.dessiner(); requestAnimationFrame(image);
    return b;
  };
})(window.Labo);

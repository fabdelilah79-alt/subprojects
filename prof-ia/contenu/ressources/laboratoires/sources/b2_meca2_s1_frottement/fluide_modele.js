/*
Rôle : physique de la chute verticale d'une balle creuse lestée (diamètre 4,0 cm, volume 33,5 cm³) dans une colonne d'eau ou de
       glycérine, lâchée sans vitesse sous la surface : poids, poussée d'Archimède, force de frottement du liquide
       F = ½·ρ·Cd·S·v² avec le coefficient de traînée réel Cd(Re) (Cd = 24/Re·(1 + 0,15·Re^0,687) si Re < 1 000, sinon 0,44),
       et masse ajoutée (½·ρ·V, liquide entraîné). Dans l'eau (Re ≈ 2 × 10⁴), F est proportionnelle à v² ; dans la glycérine
       (Re ≈ 3), F est presque proportionnelle à v. Calcul pas à pas (Runge-Kutta d'ordre 4, pas de 1 ms).
Reçoit : la balle et le liquide.
Produit : Labo.chute_fluide = { BALLES, LIQUIDES, V, HAUTEUR, mouvement(balle, liquide) -> { flotte (balle moins dense que le liquide),
          profondeur(t) (m), vitesse(t) (m/s), vlim, tau, a0, duree (s, jusqu'au fond) } }.
Utilisé par : poste_frottement.js, verifications_frottement.js.
*/
(function (L) {
  const G = 9.81, D = 0.04, V = (Math.PI * D ** 3) / 6, S = (Math.PI * D * D) / 4, HAUTEUR = 0.95, DT = 0.001;
  const BALLES = [{ id: "b40", masse: 0.040, nom: "40 g" }, { id: "b50", masse: 0.050, nom: "50 g" }, { id: "b60", masse: 0.060, nom: "60 g" }];
  const LIQUIDES = { eau: { nom: "eau", rho: 1000, eta: 1.0e-3 }, glycerine: { nom: "glycérine", rho: 1260, eta: 1.41 } };

  function acceleration(v, b, l) {
    // Accélération (vers le bas) à la vitesse v : poids − poussée − frottement, divisés par la masse augmentée de la masse ajoutée.
    const re = (l.rho * Math.abs(v) * D) / l.eta, cd = re < 1e-9 ? 0 : re < 1000 ? (24 / re) * (1 + 0.15 * re ** 0.687) : 0.44;
    const f = re < 1e-9 ? 0 : 0.5 * l.rho * cd * S * v * Math.abs(v);
    return ((b.masse - l.rho * V) * G - f) / (b.masse + 0.5 * l.rho * V);
  }

  function mouvement(b, l) {
    // Intègre la chute jusqu'au fond de la colonne ; renvoie les fonctions d'interpolation et les grandeurs caractéristiques.
    if (acceleration(0, b, l) <= 0) return { flotte: true, profondeur: () => 0, vitesse: () => 0, vlim: 0, a0: 0, tau: 0, duree: 0 };
    const zs = [0], vs = [0];
    let z = 0, v = 0;
    while (z < HAUTEUR && zs.length < 60000) {
      const k1 = acceleration(v, b, l), k2 = acceleration(v + (k1 * DT) / 2, b, l), k3 = acceleration(v + (k2 * DT) / 2, b, l), k4 = acceleration(v + k3 * DT, b, l);
      z += DT * (v + (DT / 6) * (k1 + k2 + k3)); v += (DT / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
      zs.push(z); vs.push(v);
    }
    const lit = (tab) => (t) => { const i = Math.min(tab.length - 1, Math.max(0, t / DT)), j = Math.floor(i); return j >= tab.length - 1 ? tab[tab.length - 1] : tab[j] + (tab[j + 1] - tab[j]) * (i - j); };
    const vlim = vs[vs.length - 1], a0 = acceleration(0, b, l);
    return { flotte: false, profondeur: lit(zs), vitesse: lit(vs), vlim, a0, tau: vlim / a0, duree: (zs.length - 1) * DT };
  }

  L.chute_fluide = { BALLES, LIQUIDES, V, HAUTEUR, mouvement };
})(window.Labo);

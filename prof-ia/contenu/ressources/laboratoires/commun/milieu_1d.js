/*
Rôle : milieu à une dimension (corde, ressort, surface de l'eau d'une cuve étroite) où se propage une perturbation :
       élongation calculée en n points régulièrement espacés, pas à pas. Le pas de temps vaut dx / v : le calcul est alors
       exact, la perturbation avance à la célérité v sans se déformer. L'extrémité x = 0 suit la source ; l'autre est
       fixe (réflexion), libre, ou absorbante (plage d'amortissement : pas de réflexion).
Reçoit : { longueur (m), n (points), v (m/s), amortissement (fraction perdue par seconde), fin (« fixe », « libre »,
         « absorbante ») }.
Produit : Labo.milieu_1d(reglage) -> m { n, dx, y (élongations, m), t (s), v, avancer(dt, source(t) -> élongation),
          elongation(x) (m, interpolée), regler(v), repos(), sur_pas(f(t)) (après chaque pas de calcul) }.
Utilisé par : ressort_long.js, corde_tendue.js, les cuves des simulations d'ondes.
*/
(function (L) {
  const PAS_MAX = 400;

  function pas(m, source) {
    // Un pas de calcul (nombre de Courant égal à 1) : y(t+dt)[i] = y[i+1] + y[i−1] − y(t−dt)[i], puis les deux extrémités.
    const { y, avant, n } = m, neuf = new Float64Array(n), k = 1 - m.amortissement * m.dts;
    for (let i = 1; i < n - 1; i++) neuf[i] = y[i] + (y[i + 1] + y[i - 1] - avant[i] - y[i]) * k;
    m.t += m.dts;
    neuf[0] = source(m.t);
    if (m.fin === "libre") neuf[n - 1] = neuf[n - 2];
    else if (m.fin === "absorbante") neuf[n - 1] = y[n - 2];
    else neuf[n - 1] = 0;
    m.avant = y; m.y = neuf;
    for (const f of m.ecouteurs) f(m.t);
  }

  L.milieu_1d = function ({ longueur, n = 201, v, amortissement = 0, fin = "fixe" }) {
    // Construit le milieu au repos.
    const m = { n, longueur, dx: longueur / (n - 1), v, dts: longueur / (n - 1) / v, amortissement, fin, t: 0, reste: 0, ecouteurs: [] };
    m.repos = () => { m.y = new Float64Array(n); m.avant = new Float64Array(n); };
    m.repos();
    m.regler = (v2) => { m.v = v2; m.dts = m.dx / v2; m.reste = 0; };
    m.sur_pas = (f) => m.ecouteurs.push(f);
    m.avancer = (dt, source) => {
      // Fait autant de pas de calcul que la durée dt en contient (au plus PAS_MAX : un onglet en veille ne bloque rien).
      m.reste += dt;
      let k = 0;
      while (m.reste >= m.dts && k++ < PAS_MAX) { m.reste -= m.dts; pas(m, source); }
      if (k > PAS_MAX) m.reste = 0;
    };
    m.elongation = (x) => {
      // Élongation au point d'abscisse x (m), interpolée entre deux points de calcul.
      const p = Math.max(0, Math.min(n - 1, x / m.dx)), i = Math.min(n - 2, Math.floor(p)), r = p - i;
      return m.y[i] * (1 - r) + m.y[i + 1] * r;
    };
    return m;
  };
})(window.Labo);

/*
Rôle : modèle d'un pendule (pendule pesant ou pendule simple) sans approximation des petits angles :
       θ̈ = −ω0²·sin θ − θ̇/τ (ω0² = M·g·a/J, ou g/l ; τ : temps d'amortissement, infini sans frottement), intégré par la
       méthode de Runge-Kutta d'ordre 4 au pas de 1 ms ; période exacte des oscillations libres d'amplitude θ0
       (T = T0 / AGM(1, cos(θ0/2)), moyenne arithmético-géométrique).
Reçoit : { omega2 (s⁻²), tau (s) } ; puis la durée à simuler et, à chaque pas, une fonction appelée avec (t, θ).
Produit : Labo.pendule = { creer(reglage) -> { th, w, t, oscille, omega2, tau, lacher(th0), arreter(), avancer(duree, sur_pas) },
          periode(omega2, th0) (s), G }.
Utilisé par : b2_meca4_s1_pendule_pesant (pendule pesant et pendule simple) ; l'énergie du pendule pesant (2e année du bac).
*/
(function (L) {
  const DT = 0.001;

  function acceleration(s, th, w) {
    // Accélération angulaire : rappel du poids et frottement.
    return -s.omega2 * Math.sin(th) - (s.tau ? w / s.tau : 0);
  }

  function pas(s) {
    // Un pas de Runge-Kutta d'ordre 4 sur (θ, θ̇).
    const a1 = acceleration(s, s.th, s.w), v1 = s.w;
    const a2 = acceleration(s, s.th + (v1 * DT) / 2, s.w + (a1 * DT) / 2), v2 = s.w + (a1 * DT) / 2;
    const a3 = acceleration(s, s.th + (v2 * DT) / 2, s.w + (a2 * DT) / 2), v3 = s.w + (a2 * DT) / 2;
    const a4 = acceleration(s, s.th + v3 * DT, s.w + a3 * DT), v4 = s.w + a3 * DT;
    s.th += ((v1 + 2 * v2 + 2 * v3 + v4) * DT) / 6;
    s.w += ((a1 + 2 * a2 + 2 * a3 + a4) * DT) / 6;
    s.t += DT;
  }

  function creer({ omega2, tau = 0 }) {
    // Pendule au repos ; lacher(θ0) le libère sans vitesse ; avancer(durée) l'intègre en appelant sur_pas(t, θ) à chaque pas.
    const s = { th: 0, w: 0, t: 0, oscille: false, omega2, tau };
    s.lacher = (th0) => Object.assign(s, { th: th0, w: 0, t: 0, oscille: true });
    s.arreter = () => Object.assign(s, { w: 0, oscille: false });
    s.avancer = (duree, sur_pas = null) => {
      if (!s.oscille) return;
      for (let n = Math.round(Math.min(duree, 0.1) / DT); n > 0; n--) { pas(s); if (sur_pas) sur_pas(s.t, s.th); }
    };
    return s;
  }

  function periode(omega2, th0) {
    // Période exacte des oscillations libres d'amplitude θ0 (sans frottement).
    let a = 1, b = Math.cos(Math.abs(th0) / 2);
    for (let k = 0; k < 8; k++) [a, b] = [(a + b) / 2, Math.sqrt(a * b)];
    return (2 * Math.PI) / Math.sqrt(omega2) / a;
  }

  L.pendule = { creer, periode, G: 9.81 };
})(window.Labo);

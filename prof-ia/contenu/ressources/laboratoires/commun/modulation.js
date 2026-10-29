/*
Rôle : calcul des tensions de la modulation d'amplitude, instant par instant sur une période commune : tensions
       sinusoïdales des GBF, multiplieur (u = k·x·(y + U₀)), détecteur d'enveloppe (diode de seuil 0,2 V suivie de R∥C :
       le condensateur se charge quand la diode conduit, se décharge dans R sinon), filtre passe-haut (suppression de la
       composante continue), enveloppe supérieure, ressemblance de deux tensions.
Reçoit : des fréquences (Hz, entières), des amplitudes (V), des tableaux d'échantillons.
Produit : Labo.am = { reglage(frequences) -> { f (Hz, fréquence de la période commune), n, dt }, sinus(r, f, A),
          produit(k, x, y, U0), detecteur(u, dt, tau), sans_continu(u), enveloppe(u, n_porteuse), ressemblance(a, b) }.
Utilisé par : les postes du chapitre « Modulation d'amplitude ».
*/
(function (L) {
  const SEUIL = 0.2, pgcd = (a, b) => (b ? pgcd(b, a % b) : a);

  L.am = {
    reglage(frequences) {
      // Période commune aux fréquences (pgcd) et nombre d'échantillons : au moins 40 par période de la plus rapide.
      const f = frequences.reduce((a, b) => pgcd(a, b)), n = Math.min(80000, Math.max(400, Math.ceil((40 * Math.max(...frequences)) / f)));
      return { f, n, dt: 1 / (f * n) };
    },
    sinus(r, f, A) {
      // A·sin(2π·f·t) aux n instants de la période commune.
      return Array.from({ length: r.n }, (_, k) => A * Math.sin((2 * Math.PI * f * k) / (r.f * r.n)));
    },
    produit(k, x, y, U0) {
      // Sortie du multiplieur : k·x·(y + U₀).
      return x.map((v, i) => k * v * (y[i] + U0));
    },
    detecteur(u, dt, tau) {
      // Diode (seuil 0,2 V) et R∥C : trois périodes pour atteindre le régime permanent ; on garde la dernière.
      const q = Math.exp(-dt / tau), s = new Array(u.length);
      let v = 0;
      for (let p = 0; p < 3; p++) for (let i = 0; i < u.length; i++) { v *= q; if (u[i] - SEUIL > v) v = u[i] - SEUIL; s[i] = v; }
      return s;
    },
    sans_continu(u) {
      // Filtre passe-haut de fréquence de coupure très basse : on retire la valeur moyenne.
      const m = u.reduce((a, b) => a + b, 0) / u.length;
      return u.map((v) => v - m);
    },
    enveloppe(u, np) {
      // Enveloppe supérieure : maximum sur chaque période de la porteuse (blocs de np échantillons) ; Umax et Umin.
      const env = [];
      for (let i = 0; i + np <= u.length; i += np) env.push(Math.max(...u.slice(i, i + np)));
      return { env, max: Math.max(...env), min: Math.min(...env) };
    },
    ressemblance(a, b) {
      // Coefficient de corrélation des deux tensions (1 : même forme).
      const m = (t) => t.reduce((s, v) => s + v, 0) / t.length, ma = m(a), mb = m(b);
      let ab = 0, aa = 0, bb = 0;
      a.forEach((v, i) => { ab += (v - ma) * (b[i] - mb); aa += (v - ma) ** 2; bb += (b[i] - mb) ** 2; });
      return aa && bb ? ab / Math.sqrt(aa * bb) : 0;
    },
  };
})(window.Labo);

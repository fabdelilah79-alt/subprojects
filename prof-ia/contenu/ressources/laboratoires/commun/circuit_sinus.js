/*
Rôle : calcul d'un circuit en régime sinusoïdal forcé (régime permanent) quand il contient un condensateur ou une bobine
       et un GBF, sans horloge : chaque composant réactif donne son admittance complexe (Y = j·C·ω ; Y = 1 / (r + j·L·ω)),
       les autres leur conductance ; le GBF est décomposé en harmoniques (une seule pour le sinus, harmoniques impaires
       pour le triangle et le carré) ; pour chacune, les potentiels complexes des nœuds sont calculés (pivot de Gauss),
       puis les tensions instantanées sont reconstituées aux instants d'une période. Les appareils (oscilloscope,
       multimètre en alternatif) lisent ces ondes comme d'habitude.
Reçoit : le circuit, les numéros des bornes, le nombre de nœuds, les potentiels continus, le nombre d'instants.
Produit : Labo.ondes_sinus(c, cles, n, V0, instants) -> [potentiels de chaque nœud à chaque instant].
Utilisé par : circuit.js.
*/
(function (L) {
  const G_FIL = 1000, FUITE = 1e-9;

  function harmoniques(forme) {
    // Amplitudes complexes [k, re, im] des harmoniques de la forme (sin θ = Re(−j·e^(jθ))).
    if (forme === "sinus") return [[1, 0, -1]];
    const h = [];
    for (let k = 1; k <= 25; k += 2) h.push(forme === "triangle" ? [k, 0, (-8 / (Math.PI * Math.PI * k * k)) * (((k - 1) / 2) % 2 ? -1 : 1)] : [k, 0, -4 / (Math.PI * k)]);
    return h;
  }

  function eliminer(A, B) {
    // Résout A·x = B en nombres complexes ([re, im]) par le pivot de Gauss partiel.
    const n = B.length, mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]], div = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
    for (let k = 0; k < n; k++) {
      let p = k;
      for (let i = k + 1; i < n; i++) if (Math.hypot(...A[i][k]) > Math.hypot(...A[p][k])) p = i;
      [A[k], A[p]] = [A[p], A[k]]; [B[k], B[p]] = [B[p], B[k]];
      for (let i = k + 1; i < n; i++) {
        const f = div(A[i][k], A[k][k]);
        for (let c = k; c < n; c++) { const m = mul(f, A[k][c]); A[i][c] = [A[i][c][0] - m[0], A[i][c][1] - m[1]]; }
        const m = mul(f, B[k]); B[i] = [B[i][0] - m[0], B[i][1] - m[1]];
      }
    }
    const x = new Array(n);
    for (let k = n - 1; k >= 0; k--) {
      let s = B[k];
      for (let c = k + 1; c < n; c++) { const m = mul(A[k][c], x[c]); s = [s[0] - m[0], s[1] - m[1]]; }
      x[k] = div(s, A[k][k]);
    }
    return x;
  }

  function branches(c, cles, w) {
    // Admittances [re, im] et sources de courant unitaires (pour 1 V du GBF) de tous les dipôles, fils compris.
    const liste = [];
    for (const comp of c.composants) {
      const cle = (x) => cles[`${comp.id}.${x}`];
      if (comp.admittance) { for (const d of comp.admittance(w)) liste.push({ a: cle(d.a), b: cle(d.b), y: d.y, j: 0 }); continue; }
      c.instant = 1;
      const d1 = comp.dipoles ? comp.dipoles("instant") : [];
      c.instant = 0;
      const d0 = comp.dipoles ? comp.dipoles("continu") : [];
      d0.forEach((d, k) => liste.push({ a: cle(d.a), b: cle(d.b), y: [d.g, 0], j: ((d1[k] && d1[k].j) || 0) - (d.j || 0) }));
    }
    for (const f of c.fils) liste.push({ a: cles[f.a], b: cles[f.b], y: [G_FIL, 0], j: 0 });
    return liste;
  }

  function une_harmonique(c, cles, n, w, A) {
    // Potentiels complexes des nœuds pour une harmonique d'amplitude complexe A.
    const M = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, k) => [i === k ? FUITE : 0, 0])), B = Array.from({ length: n }, () => [0, 0]);
    for (const d of branches(c, cles, w)) {
      const ajouter = (i, k, s) => { M[i][k] = [M[i][k][0] + s * d.y[0], M[i][k][1] + s * d.y[1]]; };
      ajouter(d.a, d.a, 1); ajouter(d.b, d.b, 1); ajouter(d.a, d.b, -1); ajouter(d.b, d.a, -1);
      const J = [d.j * A[0], d.j * A[1]];
      B[d.a] = [B[d.a][0] - J[0], B[d.a][1] - J[1]]; B[d.b] = [B[d.b][0] + J[0], B[d.b][1] + J[1]];
    }
    return eliminer(M, B);
  }

  L.ondes_sinus = function (c, cles, n, V0, instants) {
    // Somme des harmoniques aux instants d'une période, ajoutée aux potentiels continus.
    const { forme, f, Umax } = c.alternatif, ondes = Array.from({ length: instants }, () => V0.slice());
    for (const [k, re, im] of harmoniques(forme)) {
      const V = une_harmonique(c, cles, n, 2 * Math.PI * f * k, [Umax * re, Umax * im]);
      for (let t = 0; t < instants; t++) {
        const th = (2 * Math.PI * k * t) / instants, co = Math.cos(th), si = Math.sin(th);
        for (let p = 0; p < n; p++) ondes[t][p] += V[p][0] * co - V[p][1] * si;
      }
    }
    return ondes;
  };
})(window.Labo);

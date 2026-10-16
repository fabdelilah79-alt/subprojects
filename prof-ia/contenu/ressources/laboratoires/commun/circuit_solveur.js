/*
Rôle : calcule les potentiels et les courants d'un circuit en courant continu (méthode des nœuds). Chaque dipôle est
       vu comme une conductance g en parallèle avec une source de courant j : i(a→b) = g·(Va − Vb) + j.
       Un générateur (E, r) est donc g = 1/r, j = E/r de sa borne − vers sa borne +. Un dipôle non linéaire
       (DEL, lampe, diode) est remplacé par sa tangente au point de fonctionnement : on recalcule jusqu'à stabilité.
Reçoit : le nombre de nœuds et la liste des dipôles { a, b (numéros de nœuds), g (S), j (A), ctrl (facultatif : sources
         commandées [{ c, d, g }] qui ajoutent g·(Vc − Vd) au courant de a vers b), ajuster(u, i, V) (facultatif : renvoie
         vrai si le dipôle change d'état et met à jour g, j et ctrl) }.
Produit : Labo.resoudre_circuit(n, dipoles) -> { potentiels: [V], courants: [A] (de a vers b, un par dipôle) } ;
          Labo.dipole_non_lineaire(a, b, courant(u), pas_max) -> dipôle à caractéristique quelconque.
Utilisé par : circuit.js.
*/
(function (L) {
  const FUITE = 1e-9, TOURS = 60;

  function eliminer(A, B) {
    // Résout A·x = B (pivot de Gauss partiel) ; A et B sont modifiés.
    const n = B.length;
    for (let k = 0; k < n; k++) {
      let p = k;
      for (let i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > Math.abs(A[p][k])) p = i;
      [A[k], A[p]] = [A[p], A[k]];
      [B[k], B[p]] = [B[p], B[k]];
      for (let i = k + 1; i < n; i++) {
        const f = A[i][k] / A[k][k];
        if (!f) continue;
        for (let c = k; c < n; c++) A[i][c] -= f * A[k][c];
        B[i] -= f * B[k];
      }
    }
    const x = new Array(n).fill(0);
    for (let k = n - 1; k >= 0; k--) {
      let s = B[k];
      for (let c = k + 1; c < n; c++) s -= A[k][c] * x[c];
      x[k] = s / A[k][k];
    }
    return x;
  }

  function une_fois(n, dipoles) {
    // Assemble les équations des nœuds (somme des courants sortants nulle) et les résout.
    const A = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, c) => (i === c ? FUITE : 0)));
    const B = new Array(n).fill(0);
    for (const d of dipoles) {
      A[d.a][d.a] += d.g; A[d.b][d.b] += d.g;
      A[d.a][d.b] -= d.g; A[d.b][d.a] -= d.g;
      B[d.a] -= d.j || 0; B[d.b] += d.j || 0;
      for (const k of d.ctrl || []) { A[d.a][k.c] += k.g; A[d.a][k.d] -= k.g; A[d.b][k.c] -= k.g; A[d.b][k.d] += k.g; }
    }
    const V = eliminer(A, B);
    const commande = (d) => (d.ctrl || []).reduce((s, k) => s + k.g * (V[k.c] - V[k.d]), 0);
    return { potentiels: V, courants: dipoles.map((d) => d.g * (V[d.a] - V[d.b]) + (d.j || 0) + commande(d)) };
  }

  L.dipole_non_lineaire = function (a, b, courant, pas_max) {
    // Dipôle de caractéristique i = courant(u) : remplacé par sa tangente au dernier point ; à chaque tour, la tension
    // de ce point se rapproche de la tension calculée, d'au plus pas_max (méthode de Newton amortie).
    const d = { a, b, u0: 0 };
    const tangente = (u) => {
      const h = 1e-5, i = courant(u), g = Math.max(1e-9, (courant(u + h) - courant(u - h)) / (2 * h));
      Object.assign(d, { u0: u, g, j: i - g * u });
    };
    tangente(0);
    d.ajuster = (u) => {
      const v = d.u0 + Math.max(-pas_max, Math.min(pas_max, u - d.u0));
      if (Math.abs(v - d.u0) < 1e-6) return false;
      tangente(v);
      return true;
    };
    return d;
  };

  L.resoudre_circuit = function (n, dipoles) {
    // Calcule, puis laisse les dipôles non linéaires (DEL, lampe, diode) se réajuster et recalcule, jusqu'à stabilité.
    let r = une_fois(n, dipoles);
    for (let t = 0; t < TOURS; t++) {
      let change = false;
      dipoles.forEach((d, k) => { if (d.ajuster && d.ajuster(r.potentiels[d.a] - r.potentiels[d.b], r.courants[k], r.potentiels)) change = true; });
      if (!change) break;
      r = une_fois(n, dipoles);
    }
    return r;
  };
})(window.Labo);

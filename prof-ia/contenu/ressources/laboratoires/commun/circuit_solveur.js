/*
Rôle : calcule les potentiels et les courants d'un circuit en courant continu (méthode des nœuds). Chaque dipôle est
       vu comme une conductance g en parallèle avec une source de courant j : i(a→b) = g·(Va − Vb) + j.
       Un générateur (E, r) est donc g = 1/r, j = E/r de sa borne − vers sa borne +. Une DEL change d'état
       (passante ou bloquée) : on recalcule jusqu'à ce que son état ne change plus.
Reçoit : le nombre de nœuds et la liste des dipôles { a, b (numéros de nœuds), g (S), j (A), ajuster(u, i) (facultatif :
         renvoie vrai si le dipôle change d'état et met à jour g et j) }.
Produit : Labo.resoudre_circuit(n, dipoles) -> { potentiels: [V], courants: [A] (de a vers b, un par dipôle) }.
Utilisé par : circuit.js.
*/
(function (L) {
  const FUITE = 1e-9, TOURS = 12;

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
    }
    const V = eliminer(A, B);
    return { potentiels: V, courants: dipoles.map((d) => d.g * (V[d.a] - V[d.b]) + (d.j || 0)) };
  }

  L.resoudre_circuit = function (n, dipoles) {
    // Calcule, puis laisse les dipôles non linéaires (DEL) changer d'état et recalcule, jusqu'à stabilité.
    let r = une_fois(n, dipoles);
    for (let t = 0; t < TOURS; t++) {
      let change = false;
      dipoles.forEach((d, k) => { if (d.ajuster && d.ajuster(r.potentiels[d.a] - r.potentiels[d.b], r.courants[k])) change = true; });
      if (!change) break;
      r = une_fois(n, dipoles);
    }
    return r;
  };
})(window.Labo);

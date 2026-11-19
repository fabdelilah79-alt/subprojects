/*
Rôle : physique du tube de Franck et Hertz au mercure. Les électrons émis par la cathode chaude sont accélérés par U2 entre la
       cathode et la grille (potentiel de contact Uc = 2,0 V) ; une contre-tension U3 = 1,5 V empêche ceux qui n'ont plus assez
       d'énergie d'atteindre l'anode. Un électron dont l'énergie atteint 4,9 eV cède, lors d'un choc avec un atome de mercure,
       exactement 4,9 eV (probabilité p qui dépend de la pression de la vapeur, donc de la température du four) ; il repart et
       peut recommencer. Les énergies des électrons sont étalées (écart-type 0,3 eV). Le courant d'anode IA (nA) chute donc
       chaque fois que U2 augmente de 4,9 V. Pression de vapeur : log10(P/Pa) = 10,122 − 3 190 / T.
Reçoit : U2 (V) et la température du four ϑ (°C).
Produit : Labo.franck_hertz = { courant(U2, theta) (nA), maximums(theta) (U2 des maximums entre 0 et 30 V), E1 (4,9 eV) }.
Utilisé par : poste_franck_hertz.js.
*/
(function (L) {
  const E1 = 4.9, UC = 2.0, U3 = 1.5, SIGMA = 0.3, A = 0.105, POIDS = Array.from({ length: 61 }, (_, i) => { const z = -3 + i * 0.1; return [z, Math.exp(-z * z / 2)]; });

  function pression(theta) {
    // Pression de la vapeur de mercure (Pa) à la température ϑ (°C).
    return 10 ** (10.122 - 3190 / (theta + 273.15));
  }

  function recueilli(e, p) {
    // Probabilité qu'un électron arrivé à la grille avec l'énergie e (eV) atteigne l'anode, après ses chocs inélastiques.
    if (e < E1) return e > U3 ? Math.min(1, (e - U3) / 0.6) : 0;
    return p * recueilli(e - E1, p) + (1 - p);
  }

  function courant(U2, theta) {
    // Courant d'anode (nA) : enveloppe en u^1,5 (charge d'espace), moyenne sur l'étalement des énergies.
    const u = U2 - UC;
    if (u <= 0) return 0;
    const P = pression(theta), p = 1 - Math.exp(-P / 250), somme = POIDS.reduce((s, [, w]) => s + w, 0);
    const moyenne = POIDS.reduce((s, [z, w]) => s + w * recueilli(Math.max(0, u + z * SIGMA), p), 0) / somme;
    return (A * u ** 1.5 * moyenne) / (1 + P / 4000);
  }

  function maximums(theta) {
    // U2 (V) des maximums de IA entre 0 et 30 V : point plus haut que tous ceux à moins de 0,5 V (pas de 0,02 V), chute nette après.
    const pts = Array.from({ length: 1501 }, (_, i) => courant(i * 0.02, theta)), r = [];
    pts.forEach((I, i) => {
      const voisins = pts.slice(Math.max(0, i - 25), i + 26);
      if (I > 0.05 && i > 25 && i < 1475 && I >= Math.max(...voisins) && Math.min(...pts.slice(i, i + 75)) < 0.8 * I) r.push(Math.round(i * 2) / 100);
    });
    return r;
  }

  L.franck_hertz = { courant, maximums, pression, E1 };
})(window.Labo);

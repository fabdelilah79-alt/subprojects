/*
Rôle : horloge d'un circuit qui évolue dans le temps (condensateur, bobine) : à chaque image, le temps réel écoulé est découpé
       en petits pas (0,5 ms) ; à chaque pas, le circuit est résolu (c.resoudre), puis chaque composant valide son nouvel
       état (valider) et les appareils enregistreurs lisent les tensions (sur_pas) ; une fois par image, le circuit est
       recalculé et redessiné (c.calculer). Méthode d'Euler implicite : un condensateur de capacité C est, pendant un pas,
       une conductance C/pas en parallèle avec une source qui garde sa tension précédente. Avec ralenti = k, une seconde
       réelle ne représente que 1/k seconde du circuit (phénomènes de quelques millisecondes, rendus visibles).
       Avec trapeze = vrai (c.trapeze), condensateur et bobine suivent la méthode des trapèzes : elle conserve l'énergie
       d'un circuit LC (oscillations sans amortissement artificiel).
Reçoit : le circuit (circuit.js) et { pas (s), max (nombre de pas au plus par image), ralenti (1 par défaut), trapeze }.
Produit : Labo.horloge_circuit(c, reglage) -> h { t (s), pas, ralenti, sur_pas(f(t)) } ; c.pas, c.trapeze, c.horloge.
Utilisé par : condensateur.js, bobine.js et les simulations des dipôles RC, RL et du circuit RLC.
*/
(function (L) {
  L.horloge_circuit = function (c, { pas = 5e-4, max = 60, ralenti = 1, trapeze = false } = {}) {
    // Boucle d'images : pas de temps, validation des états, enregistrements, puis dessin.
    const h = { t: 0, pas, ralenti, ecouteurs: [] }, reel = pas * ralenti * 1000;
    c.pas = pas; c.trapeze = trapeze; c.horloge = h;
    h.sur_pas = (f) => h.ecouteurs.push(f);
    let avant = performance.now();
    const image = (maintenant) => {
      const n = Math.min(max, Math.floor((maintenant - avant) / reel));
      avant = n === max ? maintenant : avant + n * reel;
      for (let k = 0; k < n; k++) {
        h.t += pas; c.resoudre();
        for (const comp of c.composants) comp.valider?.();
        for (const f of h.ecouteurs) f(h.t);
      }
      if (n) c.calculer();
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
    return h;
  };
})(window.Labo);

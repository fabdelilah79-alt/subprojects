/*
Rôle : horloge de la lecture, que l'on peut mettre en pause ou accélérer.
Reçoit : les ordres pause, reprise et accélération du lecteur.
Produit : le temps écoulé (en secondes, pauses exclues), des attentes et des animations qui le suivent.
Utilisé par : client/js/lecteur/lecteur.js, client/js/tableau/ecriture.js, client/js/tableau/formule.js.
*/

export function creer_horloge() {
  // Crée une horloge arrêtée, à zéro.
  let cumul = 0;
  let depart = null;
  let rapide = false;
  return {
    maintenant: () => cumul + (depart === null ? 0 : (performance.now() - depart) / 1000),
    reprendre() { if (depart === null) depart = performance.now(); },
    pause() { if (depart !== null) { cumul = this.maintenant(); depart = null; } },
    accelerer() { rapide = true; },
    ralentir() { rapide = false; },
    est_rapide: () => rapide,
  };
}

export function attendre_jusqu_a(horloge, instant) {
  // Attend que l'horloge atteigne un instant (immédiat si l'horloge est accélérée).
  return new Promise((resoudre) => {
    const verifier = () => {
      if (horloge.est_rapide() || horloge.maintenant() >= instant) resoudre();
      else requestAnimationFrame(verifier);
    };
    verifier();
  });
}

export function animer(horloge, duree_s, dessiner) {
  // Appelle dessiner(p) à chaque image, p allant de 0 à 1 pendant duree_s ; s'arrête en pause.
  const debut = horloge.maintenant();
  return new Promise((resoudre) => {
    const etape = () => {
      const ecoule = horloge.maintenant() - debut;
      const p = horloge.est_rapide() || duree_s <= 0 ? 1 : Math.min(1, ecoule / duree_s);
      dessiner(p);
      if (p >= 1) resoudre();
      else requestAnimationFrame(etape);
    };
    etape();
  });
}

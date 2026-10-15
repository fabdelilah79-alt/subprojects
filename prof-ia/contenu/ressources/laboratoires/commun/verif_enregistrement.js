/*
Rôle : outils de vérification des enregistrements de la table à coussin d'air : dernier enregistrement,
       mouvement rectiligne sans rebond, coordonnées attendues dans le repère choisi, vitesses instantanées.
Reçoit : les faits des missions (enregistrement, origine_repere).
Produit : Labo.VERIF_ENR : dernier(faits), rectiligne(points, n), coordonnees(point, origine) en cm,
          vitesse(points, i, tau) en m/s, distance(a, b) en mm.
Utilisé par : les simulations de mouvement (simulation.js de chaque activité).
*/
(function (L) {
  const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

  function dernier(faits) {
    // Le dernier enregistrement terminé (ou null).
    return faits.enregistrement && faits.enregistrement.points.length ? faits.enregistrement : null;
  }

  function rectiligne(points, n) {
    // Les n premiers points sont-ils alignés (écart à la droite M0-M(n-1) inférieur à 1 mm) ?
    if (points.length < n) return false;
    const a = points[0], b = points[n - 1], d = distance(a, b) || 1;
    return points.slice(0, n).every((p) => Math.abs((b.x - a.x) * (a.y - p.y) - (a.x - p.x) * (b.y - a.y)) / d < 1);
  }

  function coordonnees(point, origine) {
    // Coordonnées (en cm) d'un point dans le repère du transparent : x vers la droite, y vers le haut.
    return { x: (point.x - origine.x) / 10, y: (origine.y - point.y) / 10 };
  }

  function vitesse(points, i, tau) {
    // Vitesse instantanée approchée en Mi : Mi-1Mi+1 / (2τ), en m/s.
    return distance(points[i - 1], points[i + 1]) / 1000 / (2 * tau);
  }

  L.VERIF_ENR = { dernier, rectiligne, coordonnees, vitesse, distance };
})(window.Labo);

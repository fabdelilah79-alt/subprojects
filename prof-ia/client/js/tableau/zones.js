/*
Rôle : calculer les zones du tableau et y réserver de la place, sans jamais de chevauchement.
Reçoit : les zones de config/tableau.json (en fractions du tableau) et la hauteur d'un écrit.
Produit : la position où poser l'écrit, ou null si la zone est pleine (avec un message dans la console).
Utilisé par : client/js/tableau/tableau.js, ecriture.js, formule.js.
*/

export function creer_zones(reglages) {
  // Transforme les zones de la config en rectangles du tableau, encore vides.
  const { largeur, hauteur } = reglages.dimensions;
  const zones = {};
  for (const [nom, zone] of Object.entries(reglages.zones)) {
    zones[nom] = {
      nom,
      x: zone.x * largeur,
      y: zone.y * hauteur,
      largeur: zone.largeur * largeur,
      hauteur: zone.hauteur * hauteur,
      utilise: 0,
    };
  }
  return zones;
}

export function largeur_utile(zone, reglages) {
  // Renvoie la largeur où l'on peut écrire, marges déduites.
  return zone.largeur - 2 * reglages.marge_zone;
}

export function reserver(zone, hauteur, reglages) {
  // Réserve une bande sous ce qui est déjà écrit ; renvoie sa position, ou null si la place manque.
  const marge = reglages.marge_zone;
  const place_libre = zone.hauteur - 2 * marge - zone.utilise;
  if (hauteur > place_libre) {
    const manque = Math.ceil(hauteur - place_libre);
    console.warn(`Zone « ${zone.nom} » pleine : il manque ${manque} unités de hauteur. L'écrit n'est pas affiché.`);
    return null;
  }
  const position = { x: zone.x + marge, y: zone.y + marge + zone.utilise };
  zone.utilise += hauteur + reglages.espace_entre_ecrits;
  return position;
}

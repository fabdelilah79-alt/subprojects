/*
Rôle : élément « point » : un point marqué et son nom.
Reçoit : un crayon et les paramètres u, v (position dans le carré unité) et nom.
Produit : le point et son étiquette, ajoutés aux traits du crayon.
Utilisé par : client/js/tableau/elements/index.js.
*/
export const exemple = { u: 0.5, v: 0.5, nom: "M" };

export function dessiner(crayon, parametres) {
  // Marque le point, puis écrit son nom en haut à droite.
  const { u, v, nom } = { ...exemple, ...parametres };
  crayon.point(u, v);
  crayon.texte(u + 0.07, v - 0.07, nom);
}

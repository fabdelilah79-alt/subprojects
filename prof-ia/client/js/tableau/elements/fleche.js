/*
Rôle : élément « fleche » : un vecteur (vitesse, force…) avec son nom.
Reçoit : un crayon et les paramètres de, a (positions [u, v]) et nom.
Produit : la flèche et son étiquette.
Utilisé par : client/js/tableau/elements/index.js.
*/
export const exemple = { de: [0.2, 0.7], a: [0.8, 0.35], nom: "V" };

export function dessiner(crayon, parametres) {
  // Trace la flèche, puis écrit son nom au-dessus de son milieu.
  const { de, a, nom } = { ...exemple, ...parametres };
  crayon.fleche(de[0], de[1], a[0], a[1]);
  crayon.texte((de[0] + a[0]) / 2 - 0.04, (de[1] + a[1]) / 2 - 0.08, nom);
}

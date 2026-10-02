/*
Rôle : élément « cercle » : une trajectoire circulaire et son centre.
Reçoit : un crayon et les paramètres rayon (entre 0 et 0,45) et centre (nom du centre).
Produit : le cercle, son centre marqué et nommé.
Utilisé par : client/js/tableau/elements/index.js.
*/
export const exemple = { rayon: 0.38, centre: "O" };

export function dessiner(crayon, parametres) {
  // Trace le cercle, puis marque et nomme son centre.
  const { rayon, centre } = { ...exemple, ...parametres };
  crayon.cercle(0.5, 0.5, rayon);
  crayon.point(0.5, 0.5);
  crayon.texte(0.45, 0.56, centre);
}

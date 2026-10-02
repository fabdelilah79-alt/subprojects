/*
Rôle : élément « segment » : un segment entre deux points nommés.
Reçoit : un crayon et les paramètres de, a (positions [u, v]) et noms (deux noms).
Produit : le segment, ses extrémités et leurs noms.
Utilisé par : client/js/tableau/elements/index.js.
*/
export const exemple = { de: [0.15, 0.7], a: [0.85, 0.3], noms: ["A", "B"] };

export function dessiner(crayon, parametres) {
  // Trace le segment, marque les deux extrémités et écrit leurs noms.
  const { de, a, noms } = { ...exemple, ...parametres };
  crayon.ligne(de[0], de[1], a[0], a[1]);
  crayon.point(de[0], de[1]);
  crayon.texte(de[0] - 0.05, de[1] + 0.07, noms[0]);
  crayon.point(a[0], a[1]);
  crayon.texte(a[0] + 0.05, a[1] - 0.07, noms[1]);
}

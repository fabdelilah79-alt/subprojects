/*
Rôle : élément « disque_points » : un solide (disque) en rotation autour de son axe, avec deux points A et B.
Reçoit : un crayon et les paramètres noms (deux noms), centre et angle_deg (direction du rayon portant A et B).
Produit : le disque, son centre sur l'axe, le rayon OB, les points A (près de l'axe) et B (au bord), le sens de rotation.
Utilisé par : client/js/tableau/elements/index.js (partie 2 : vitesses linéaire et angulaire).
*/
import { sur_cercle } from "../crayon.js";

export const exemple = { noms: ["A", "B"], centre: "O", angle_deg: 25 };

export function dessiner(crayon, parametres) {
  // Trace le disque et son centre, puis le rayon portant A et B, puis le sens de rotation.
  const { noms, centre, angle_deg } = { ...exemple, ...parametres };
  const angle = (angle_deg * Math.PI) / 180;
  const [u, v] = [0.5, 0.52];
  crayon.cercle(u, v, 0.4);
  crayon.point(u, v);
  crayon.texte(u - 0.05, v + 0.07, centre);
  const a = sur_cercle(u, v, 0.18, angle);
  const b = sur_cercle(u, v, 0.36, angle);
  crayon.ligne(u, v, ...b);
  crayon.point(...a);
  crayon.texte(a[0] - 0.02, a[1] - 0.07, noms[0]);
  crayon.point(...b);
  crayon.texte(b[0] + 0.02, b[1] - 0.07, noms[1]);
  crayon.arc(u, v, 0.46, 0.35 * Math.PI, 0.65 * Math.PI);
  crayon.fleche(...sur_cercle(u, v, 0.46, 0.6 * Math.PI), ...sur_cercle(u, v, 0.46, 0.65 * Math.PI));
}

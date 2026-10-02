/*
Rôle : élément « repere_cercle » : repérage d'un point G sur un cercle (abscisse angulaire θ, abscisse curviligne s).
Reçoit : un crayon et les noms centre, point, origine, axe, angle, arc, ainsi que angle_deg (position de G).
Produit : l'axe Ox, le cercle, les points O, A, G, le rayon OG, l'angle θ et l'arc s.
Utilisé par : client/js/tableau/elements/index.js (partie 1 du cours de rotation).
*/
import { sur_cercle } from "../crayon.js";

export const exemple = { centre: "O", point: "G", origine: "A", axe: "x", angle: "θ", arc: "s", angle_deg: 50 };

export function dessiner(crayon, parametres) {
  // Trace l'axe et le cercle, place O, A et G, puis marque l'angle θ et l'arc s.
  const p = { ...exemple, ...parametres };
  const theta = (p.angle_deg * Math.PI) / 180;
  const [u, v, rayon] = [0.44, 0.52, 0.35];
  crayon.fleche(0.03, v, 0.97, v);
  crayon.texte(0.95, v + 0.06, p.axe);
  crayon.cercle(u, v, rayon);
  crayon.point(u, v);
  crayon.texte(u - 0.05, v + 0.06, p.centre);
  const a = sur_cercle(u, v, rayon, 0);
  crayon.point(...a);
  crayon.texte(a[0] + 0.05, a[1] + 0.06, p.origine);
  const g = sur_cercle(u, v, rayon, theta);
  crayon.ligne(u, v, ...g);
  crayon.point(...g);
  crayon.texte(...sur_cercle(u, v, rayon + 0.07, theta), p.point);
  crayon.arc(u, v, 0.1, 0, theta);
  crayon.texte(...sur_cercle(u, v, 0.16, theta / 2), p.angle);
  crayon.arc(u, v, rayon + 0.035, 0, theta);
  crayon.texte(...sur_cercle(u, v, rayon + 0.1, theta / 2), p.arc);
}

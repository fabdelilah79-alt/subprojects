/*
Rôle : élément « angle » : deux demi-droites issues d'un sommet et l'arc qui marque l'angle.
Reçoit : un crayon et les paramètres debut_deg, fin_deg (en degrés), nom et sommet.
Produit : les deux côtés, l'arc de l'angle et son nom.
Utilisé par : client/js/tableau/elements/index.js.
*/
import { sur_cercle } from "../crayon.js";

export const exemple = { debut_deg: 0, fin_deg: 50, nom: "θ", sommet: "O" };

export function dessiner(crayon, parametres) {
  // Trace les deux côtés depuis le sommet, puis l'arc et le nom de l'angle.
  const { debut_deg, fin_deg, nom, sommet } = { ...exemple, ...parametres };
  const [debut, fin] = [debut_deg, fin_deg].map((d) => (d * Math.PI) / 180);
  const centre = [0.2, 0.72];
  for (const angle of [debut, fin]) crayon.ligne(...centre, ...sur_cercle(...centre, 0.7, angle));
  crayon.point(...centre);
  crayon.texte(centre[0] - 0.06, centre[1] + 0.06, sommet);
  crayon.arc(...centre, 0.22, debut, fin);
  crayon.texte(...sur_cercle(...centre, 0.3, (debut + fin) / 2), nom);
}

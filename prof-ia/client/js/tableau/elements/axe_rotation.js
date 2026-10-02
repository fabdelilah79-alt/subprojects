/*
Rôle : élément « axe_rotation » : l'axe fixe (Δ), en pointillés, et le sens de rotation.
Reçoit : un crayon et le paramètre nom (par défaut « (Δ) »).
Produit : l'axe vertical, une flèche courbe autour de lui et le nom de l'axe.
Utilisé par : client/js/tableau/elements/index.js.
*/
export const exemple = { nom: "(Δ)" };

export function dessiner(crayon, parametres) {
  // Trace l'axe en pointillés, puis une ellipse fléchée qui montre le sens de rotation.
  const { nom } = { ...exemple, ...parametres };
  crayon.ligne(0.5, 0.04, 0.5, 0.96, true);
  const aplati = 0.32;
  const fin = 1.85 * Math.PI;
  crayon.arc(0.5, 0.35, 0.25, 1.15 * Math.PI, fin, aplati);
  const pointe = (angle) => [0.5 + 0.25 * Math.cos(angle), 0.35 - 0.25 * aplati * Math.sin(angle)];
  crayon.fleche(...pointe(fin - 0.25), ...pointe(fin));
  crayon.texte(0.62, 0.08, nom);
}

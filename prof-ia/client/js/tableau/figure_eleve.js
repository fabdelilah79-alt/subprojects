/*
Rôle : poser au tableau la figure que l'élève a tracée dans le laboratoire (graphique de sa tablette), comme une feuille
       imprimée fixée par deux morceaux de ruban adhésif.
Reçoit : la page du tableau, l'action « figure_eleve » (zone, url de la figure nettoyée par le serveur, légende facultative),
         les réglages du tableau (marges, palette) et l'horloge.
Produit : la feuille dans la zone (au plus large qui tient), ou rien si la zone est pleine.
Utilisé par : client/js/tableau/tableau.js.
*/
import { creer_element_svg } from "./ecriture.js";
import { largeur_utile, reserver } from "./zones.js";

const RAPPORT = 290 / 600; // hauteur / largeur du graphique de la tablette

function feuille(cadre, url) {
  // La feuille : fond papier, la figure de l'élève dessus (balise image : aucun script ne s'exécute), deux rubans.
  const groupe = creer_element_svg("g", { class: "figure-eleve", transform: `rotate(-1 ${cadre.x + cadre.l / 2} ${cadre.y})` });
  groupe.append(creer_element_svg("rect", { x: cadre.x, y: cadre.y, width: cadre.l, height: cadre.h, fill: "#fbfaf4" }));
  groupe.append(creer_element_svg("image", { href: url, x: cadre.x + 6, y: cadre.y + 6, width: cadre.l - 12, height: cadre.h - 12 }));
  for (const x of [cadre.x + cadre.l * 0.18, cadre.x + cadre.l * 0.72]) {
    groupe.append(creer_element_svg("rect", { x, y: cadre.y - 7, width: cadre.l * 0.12, height: 14, fill: "#ffffff", opacity: 0.55 }));
  }
  return groupe;
}

export async function poser_figure(page, action, reglages) {
  // Réserve la place dans la zone, puis pose la feuille ; la légende éventuelle s'écrit dessous, petite.
  const zone = page.zones[action.zone];
  const l = largeur_utile(zone, reglages);
  const h = Math.min(l * RAPPORT + 12, zone.hauteur - 2 * reglages.marge_zone - zone.utilise);
  const place = reserver(zone, h, reglages);
  if (!place) return;
  const largeur = Math.min(l, (h - 12) / RAPPORT + 12);
  page.svg.append(feuille({ x: place.x + (l - largeur) / 2, y: place.y, l: largeur, h }, action.url));
}

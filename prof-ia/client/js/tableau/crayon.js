/*
Rôle : outils de dessin à la craie (traits d'aspect fait main avec Rough.js) pour les éléments de schéma.
Reçoit : la page du tableau, un cadre carré {x, y, cote}, la couleur et les réglages du dessin.
Produit : un crayon dont chaque trait est ajouté, caché, à la liste « traits » (révélée ensuite par dessin.js).
Utilisé par : client/js/tableau/dessin.js et les fichiers de client/js/tableau/elements/.
Les éléments dessinent dans un carré de côté 1 : (0, 0) en haut à gauche, (1, 1) en bas à droite.
Les angles sont en radians, comptés dans le sens trigonométrique (comme en physique).
*/
import { creer_element_svg } from "./ecriture.js";

function position(outil, u, v) {
  // Convertit un point du carré unité en coordonnées du tableau.
  const { x, y, cote } = outil.cadre;
  return [x + u * cote, y + v * cote];
}

function ajouter(outil, noeud, apparition = "trace") {
  // Ajoute un trait caché au tableau ; dessin.js le révélera à son tour.
  noeud.dataset.apparition = apparition;
  noeud.style.visibility = "hidden";
  outil.page.svg.append(noeud);
  outil.traits.push(noeud);
}

function ligne(outil, u1, v1, u2, v2, pointille = false) {
  // Trace un segment, plein ou en pointillés.
  const [x1, y1] = position(outil, u1, v1);
  const [x2, y2] = position(outil, u2, v2);
  const tirets = pointille ? [14, 10] : undefined;
  ajouter(outil, outil.rough.line(x1, y1, x2, y2, { ...outil.options, strokeLineDash: tirets }));
}

function cercle(outil, u, v, rayon) {
  // Trace un cercle de centre (u, v).
  const [x, y] = position(outil, u, v);
  ajouter(outil, outil.rough.circle(x, y, 2 * rayon * outil.cadre.cote, outil.options));
}

function arc(outil, u, v, rayon, debut, fin, aplati = 1) {
  // Trace un arc de cercle (ou d'ellipse si aplati < 1) entre deux angles.
  const [x, y] = position(outil, u, v);
  const diametre = 2 * rayon * outil.cadre.cote;
  ajouter(outil, outil.rough.arc(x, y, diametre, diametre * aplati, -fin, -debut, false, outil.options));
}

function point(outil, u, v) {
  // Marque un point par un petit disque.
  const [x, y] = position(outil, u, v);
  const rayon = outil.reglages.dessin.epaisseur * 2.2;
  ajouter(outil, creer_element_svg("circle", { cx: x, cy: y, r: rayon, fill: outil.couleur }), "fondu");
}

function texte(outil, u, v, contenu) {
  // Écrit une étiquette (nom de point, d'angle…) centrée sur (u, v).
  const [x, y] = position(outil, u, v);
  const etiquette = creer_element_svg("text", {
    x, y, fill: outil.couleur, "font-size": outil.reglages.dessin.taille_etiquette,
    "text-anchor": "middle", "dominant-baseline": "middle", "font-family": `${outil.reglages.police.famille}, cursive`,
  });
  etiquette.textContent = contenu;
  ajouter(outil, etiquette, "fondu");
}

function fleche(outil, u1, v1, u2, v2) {
  // Trace une flèche (un vecteur) de (u1, v1) vers (u2, v2).
  ligne(outil, u1, v1, u2, v2);
  const angle = Math.atan2(v2 - v1, u2 - u1);
  for (const ecart of [0.45, -0.45]) {
    ligne(outil, u2, v2, u2 - 0.05 * Math.cos(angle + ecart), v2 - 0.05 * Math.sin(angle + ecart));
  }
}

export function creer_crayon(page, cadre, couleur, reglages) {
  // Prépare un crayon qui dessine dans le cadre, à la couleur demandée.
  const { epaisseur, rugosite, graine } = reglages.dessin;
  const outil = {
    page, cadre, couleur, reglages, traits: [],
    rough: window.rough.svg(page.svg),
    options: { stroke: couleur, strokeWidth: epaisseur, roughness: rugosite, seed: graine },
  };
  const avec = (fonction) => (...valeurs) => fonction(outil, ...valeurs);
  return {
    traits: outil.traits,
    ligne: avec(ligne), cercle: avec(cercle), arc: avec(arc),
    point: avec(point), texte: avec(texte), fleche: avec(fleche),
  };
}

export function sur_cercle(u, v, rayon, angle) {
  // Renvoie le point du cercle de centre (u, v) à l'angle donné (sens trigonométrique, y vers le bas).
  return [u + rayon * Math.cos(angle), v - rayon * Math.sin(angle)];
}

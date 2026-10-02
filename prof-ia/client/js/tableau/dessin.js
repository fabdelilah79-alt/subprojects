/*
Rôle : dessiner un schéma au tableau, trait par trait, à partir de la bibliothèque d'éléments.
Reçoit : la page du tableau, une action « dessiner » (element, zone, parametres), sa couleur, les réglages, l'horloge.
Produit : le schéma dans un carré réservé dans la zone ; une promesse tenue quand le dernier trait est tracé.
Utilisé par : client/js/tableau/tableau.js et client/js/tableau/catalogue.js.
*/
import { animer } from "../lecteur/horloge.js";
import { creer_crayon } from "./crayon.js";
import { ELEMENTS } from "./elements/index.js";
import { largeur_utile, reserver } from "./zones.js";

async function reveler_trace(noeud, vitesse, horloge) {
  // Révèle un trait comme si la craie le traçait : chaque chemin apparaît du début à la fin.
  const chemins = [...noeud.querySelectorAll("path")];
  const longueurs = chemins.map((chemin) => chemin.getTotalLength());
  chemins.forEach((chemin, i) => {
    chemin.style.strokeDasharray = longueurs[i];
    chemin.style.strokeDashoffset = longueurs[i];
  });
  noeud.style.visibility = "visible";
  const total = longueurs.reduce((a, b) => a + b, 0);
  await animer(horloge, total / vitesse, (p) => {
    let reste = p * total;
    chemins.forEach((chemin, i) => {
      const visible = Math.max(0, Math.min(longueurs[i], reste));
      chemin.style.strokeDashoffset = longueurs[i] - visible;
      reste -= longueurs[i];
    });
  });
  chemins.forEach((chemin) => chemin.style.removeProperty("stroke-dasharray"));
  chemins.forEach((chemin) => chemin.style.removeProperty("stroke-dashoffset"));
}

async function reveler_fondu(noeud, horloge) {
  // Fait apparaître un point ou une étiquette en un court fondu.
  noeud.style.opacity = 0;
  noeud.style.visibility = "visible";
  await animer(horloge, 0.25, (p) => { noeud.style.opacity = p; });
}

export async function tracer_element(page, nom, cadre, parametres, couleur, reglages, horloge) {
  // Dessine un élément de la bibliothèque dans un cadre carré, trait après trait.
  const crayon = creer_crayon(page, cadre, couleur, reglages);
  ELEMENTS[nom].dessiner(crayon, parametres ?? {});
  for (const noeud of crayon.traits) {
    if (noeud.dataset.apparition === "fondu") await reveler_fondu(noeud, horloge);
    else await reveler_trace(noeud, reglages.dessin.vitesse_trait_par_s, horloge);
  }
}

export async function dessiner(page, action, couleur, reglages, horloge) {
  // Réserve un carré dans la zone (sans chevauchement), puis y dessine l'élément demandé.
  if (!ELEMENTS[action.element]) {
    console.warn(`Élément « ${action.element} » inconnu : voir client/js/tableau/elements/.`);
    return;
  }
  const zone = page.zones[action.zone];
  const libre = zone.hauteur - 2 * reglages.marge_zone - zone.utilise;
  const cote = Math.min(largeur_utile(zone, reglages), libre, reglages.dessin.taille_max);
  const place = reserver(zone, Math.max(cote, reglages.dessin.taille_min), reglages);
  if (!place) return;
  const cadre = { x: place.x + (largeur_utile(zone, reglages) - cote) / 2, y: place.y, cote };
  await tracer_element(page, action.element, cadre, action.parametres, couleur, reglages, horloge);
}

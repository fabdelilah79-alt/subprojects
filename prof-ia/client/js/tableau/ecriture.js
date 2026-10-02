/*
Rôle : écrire un texte à la craie, en police manuscrite révélée de gauche à droite, ligne par ligne.
Reçoit : la page du tableau, une action « ecrire », sa couleur, les réglages et l'horloge.
Produit : le texte dans la zone demandée ; une promesse tenue quand l'écriture est finie.
Utilisé par : client/js/tableau/tableau.js.
*/
import { animer } from "../lecteur/horloge.js";
import { largeur_utile, reserver } from "./zones.js";

const SVG = "http://www.w3.org/2000/svg";
let compteur_masques = 0;

export function creer_element_svg(nom, attributs) {
  // Crée un élément SVG avec ses attributs.
  const element = document.createElementNS(SVG, nom);
  for (const [cle, valeur] of Object.entries(attributs)) element.setAttribute(cle, valeur);
  return element;
}

function couper_en_lignes(page, texte, police, largeur_max) {
  // Répartit les mots en lignes qui tiennent dans la largeur de la zone.
  const mesure = creer_element_svg("text", police);
  page.svg.append(mesure);
  const lignes = [];
  let ligne = "";
  for (const mot of texte.split(/\s+/)) {
    const essai = ligne ? `${ligne} ${mot}` : mot;
    mesure.textContent = essai;
    if (ligne && mesure.getComputedTextLength() > largeur_max) {
      lignes.push(ligne);
      ligne = mot;
    } else {
      ligne = essai;
    }
  }
  mesure.remove();
  return ligne ? [...lignes, ligne] : lignes;
}

function poser_ligne(page, texte, police, x, haut, hauteur_ligne) {
  // Pose une ligne de texte cachée derrière un masque de largeur nulle ; renvoie le masque et la longueur.
  compteur_masques += 1;
  const id = `masque-${compteur_masques}`;
  const masque = creer_element_svg("clipPath", { id });
  const rect = creer_element_svg("rect", { x, y: haut, width: 0, height: hauteur_ligne });
  masque.append(rect);
  const ligne = creer_element_svg("text", { ...police, x, y: haut + hauteur_ligne * 0.78, "clip-path": `url(#${id})` });
  ligne.textContent = texte;
  page.svg.append(masque, ligne);
  return { rect, longueur: ligne.getComputedTextLength() + police["font-size"] * 0.2 };
}

export async function ecrire_texte(page, action, couleur, reglages, horloge) {
  // Écrit le texte dans sa zone, à la vitesse d'écriture des réglages.
  const zone = page.zones[action.zone];
  const taille = action.style === "titre" ? reglages.police.taille_titre : reglages.police.taille_texte;
  const police = { "font-family": `${reglages.police.famille}, cursive`, "font-size": taille, fill: couleur };
  const lignes = couper_en_lignes(page, action.texte, police, largeur_utile(zone, reglages));
  const hauteur_ligne = taille * reglages.police.interligne;
  const place = reserver(zone, lignes.length * hauteur_ligne, reglages);
  if (!place) return;
  for (const [numero, texte] of lignes.entries()) {
    const haut = place.y + numero * hauteur_ligne;
    const { rect, longueur } = poser_ligne(page, texte, police, place.x, haut, hauteur_ligne);
    const duree = texte.length / reglages.ecriture.vitesse_caracteres_par_s;
    await animer(horloge, duree, (p) => rect.setAttribute("width", p * longueur));
  }
}

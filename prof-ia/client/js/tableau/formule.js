/*
Rôle : écrire une formule (KaTeX, avec mhchem pour la chimie), révélée de gauche à droite.
Reçoit : la page du tableau, une action « formule », sa couleur, les réglages et l'horloge.
Produit : la formule dans la zone demandée ; une promesse tenue quand elle est entièrement écrite.
Utilisé par : client/js/tableau/tableau.js. Demande que katex.min.js et mhchem.min.js soient chargés.
*/
import { animer } from "../lecteur/horloge.js";
import { creer_element_svg } from "./ecriture.js";
import { largeur_utile, reserver } from "./zones.js";

function rendre_formule(latex, couleur, reglages) {
  // Transforme le LaTeX en formule affichable, à la taille et dans la couleur de la craie.
  const boite = document.createElement("div");
  boite.className = "formule-craie";
  boite.style.fontSize = `${reglages.police.taille_formule}px`;
  boite.style.color = couleur;
  window.katex.render(latex, boite, { throwOnError: false });
  return boite;
}

function mesurer(boite) {
  // Mesure la formule hors du tableau, aux dimensions du tableau.
  boite.classList.add("formule-mesure");
  document.body.append(boite);
  const taille = { largeur: Math.ceil(boite.offsetWidth), hauteur: Math.ceil(boite.offsetHeight) };
  boite.remove();
  boite.classList.remove("formule-mesure");
  return taille;
}

export async function ecrire_formule(page, action, couleur, reglages, horloge) {
  // Écrit la formule dans sa zone, à la vitesse d'écriture des réglages.
  const zone = page.zones[action.zone];
  const boite = rendre_formule(action.latex, couleur, reglages);
  const taille = mesurer(boite);
  if (taille.largeur > largeur_utile(zone, reglages)) {
    console.warn(`Formule trop large pour la zone « ${zone.nom} » : ${action.latex}`);
  }
  const place = reserver(zone, taille.hauteur, reglages);
  if (!place) return;
  const cadre = creer_element_svg("foreignObject", {
    x: place.x, y: place.y, width: largeur_utile(zone, reglages), height: taille.hauteur,
  });
  boite.style.clipPath = "inset(0 100% 0 0)";
  cadre.append(boite);
  page.svg.append(cadre);
  const nb_signes = (boite.querySelector(".katex-html") ?? boite).textContent.length;
  const duree = nb_signes / reglages.ecriture.vitesse_caracteres_par_s;
  await animer(horloge, duree, (p) => { boite.style.clipPath = `inset(0 ${100 - 100 * p}% 0 0)`; });
}

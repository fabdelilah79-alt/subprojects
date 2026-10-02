/*
Rôle : petits outils partagés par les simulations (dessin SVG, nombres à la française, curseurs, boucle d'animation).
Reçoit : rien.
Produit : des fonctions à importer.
Utilisé par : toutes les simulations de contenu/ressources/animations/.
*/
const SVG = "http://www.w3.org/2000/svg";

export function el(nom, attributs = {}, parent = null) {
  // Crée un élément SVG avec ses attributs, et l'ajoute au parent s'il est donné.
  const element = document.createElementNS(SVG, nom);
  for (const [cle, valeur] of Object.entries(attributs)) element.setAttribute(cle, valeur);
  if (parent) parent.append(element);
  return element;
}

export function nombre(valeur, decimales = 2) {
  // Écrit un nombre à la française : virgule décimale, nombre de décimales fixé.
  return valeur.toLocaleString("fr-FR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
}

export function curseur(id, affichage, sur_changement) {
  // Relie un curseur à son affichage ; appelle sur_changement(valeur) à chaque mouvement.
  const entree = document.getElementById(id);
  const sortie = document.querySelector(`output[for="${id}"]`);
  const mettre_a_jour = () => {
    const valeur = Number(entree.value);
    if (sortie) sortie.textContent = affichage(valeur);
    sur_changement(valeur);
  };
  entree.addEventListener("input", mettre_a_jour);
  mettre_a_jour();
  return () => Number(entree.value);
}

export function boucle(image) {
  // Boucle d'animation : appelle image(dt) à chaque image tant qu'elle est lancée (dt en secondes).
  let derniere = null;
  let lancee = false;
  const tourner = (instant) => {
    if (!lancee) return;
    image(derniere === null ? 0 : (instant - derniere) / 1000);
    derniere = instant;
    requestAnimationFrame(tourner);
  };
  return {
    lancer() { if (!lancee) { lancee = true; derniere = null; requestAnimationFrame(tourner); } },
    arreter() { lancee = false; },
    est_lancee: () => lancee,
  };
}

export function position_svg(svg, evenement) {
  // Convertit la position du pointeur (souris, doigt) en coordonnées du dessin SVG.
  const point = svg.createSVGPoint();
  point.x = evenement.clientX;
  point.y = evenement.clientY;
  return point.matrixTransform(svg.getScreenCTM().inverse());
}

export function bascule(bouton, texte_actif, texte_inactif, sur_changement) {
  // Fait d'un bouton un interrupteur (aria-pressed) ; appelle sur_changement(actif).
  bouton.addEventListener("click", () => {
    const actif = bouton.getAttribute("aria-pressed") !== "true";
    bouton.setAttribute("aria-pressed", String(actif));
    bouton.textContent = actif ? texte_actif : texte_inactif;
    sur_changement(actif);
  });
}

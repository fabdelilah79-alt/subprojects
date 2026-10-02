/*
Rôle : afficher tous les éléments de schéma sur un tableau à part, pour les vérifier d'un coup d'œil.
Reçoit : le tableau, les réglages et une horloge en marche.
Produit : un nouvel onglet « Éléments » où chaque élément est dessiné dans sa case, avec son nom.
Utilisé par : client/js/demo_tableau.js (bouton « Tous les éléments »).
*/
import { tracer_element } from "./dessin.js";
import { creer_element_svg } from "./ecriture.js";
import { ELEMENTS } from "./elements/index.js";

const COLONNES = 4;

function ecrire_nom(page, nom, x, y, reglages) {
  // Écrit le nom de l'élément sous sa case.
  const etiquette = creer_element_svg("text", {
    x, y, fill: reglages.palette.jaune, "font-size": reglages.police.taille_texte * 0.8,
    "text-anchor": "middle", "font-family": `${reglages.police.famille}, cursive`,
  });
  etiquette.textContent = nom;
  page.svg.append(etiquette);
}

export async function afficher_catalogue(tableau, reglages, horloge) {
  // Dessine chaque élément de la bibliothèque dans une case d'une grille.
  const page = tableau.ouvrir_page("Éléments de schéma");
  const noms = Object.keys(ELEMENTS);
  const { largeur, hauteur } = reglages.dimensions;
  const lignes = Math.ceil(noms.length / COLONNES);
  const [case_l, case_h] = [largeur / COLONNES, hauteur / lignes];
  const cote = Math.min(case_l, case_h) * 0.78;
  const couleur = reglages.palette[reglages.couleur_par_style.schema];
  for (const [i, nom] of noms.entries()) {
    const [colonne, ligne] = [i % COLONNES, Math.floor(i / COLONNES)];
    const cadre = { x: colonne * case_l + (case_l - cote) / 2, y: ligne * case_h + 8, cote };
    ecrire_nom(page, nom, colonne * case_l + case_l / 2, (ligne + 1) * case_h - 14, reglages);
    await tracer_element(page, nom, cadre, ELEMENTS[nom].exemple, couleur, reglages, horloge);
  }
}

/*
Rôle : le tableau vert. Il crée une page par tableau et exécute les actions d'écriture.
Reçoit : l'endroit de la page où dessiner, la barre d'onglets, les réglages de config/tableau.json.
Produit : un objet avec executer(action, horloge) et gere(type).
Utilisé par : client/js/demo_tableau.js (et plus tard la page de classe).
*/
import { creer_element_svg, ecrire_texte } from "./ecriture.js";
import { ecrire_formule } from "./formule.js";
import { creer_onglets } from "./onglets.js";
import { creer_zones } from "./zones.js";

const ACTIONS_GEREES = new Set(["nouveau_tableau", "ecrire", "formule"]);

async function charger_police(reglages) {
  // Attend que la police manuscrite soit prête, pour mesurer les textes correctement.
  const { famille, taille_texte } = reglages.police;
  await document.fonts.load(`${taille_texte}px ${famille}`, "abcé");
}

function couleur_de(action, reglages) {
  // Choisit la couleur : celle demandée, sinon celle du style (une formule normale a sa couleur propre).
  const cle = action.type === "formule" && action.style === "normal" ? "formule" : action.style;
  const nom = action.couleur ?? reglages.couleur_par_style[cle];
  return reglages.palette[nom];
}

function creer_page(planche, reglages) {
  // Crée une page de tableau vide : un dessin SVG au fond vert, avec ses zones.
  const { largeur, hauteur } = reglages.dimensions;
  const svg = creer_element_svg("svg", { viewBox: `0 0 ${largeur} ${hauteur}`, class: "page-tableau" });
  svg.append(creer_element_svg("rect", { width: largeur, height: hauteur, fill: reglages.fond }));
  planche.append(svg);
  return { svg, zones: creer_zones(reglages) };
}

export async function creer_tableau(planche, barre_onglets, reglages) {
  // Prépare le tableau : police chargée, onglets prêts, aucune page encore.
  await charger_police(reglages);
  const pages = [];
  const afficher = (numero) => pages.forEach((page, i) => page.svg.classList.toggle("cache", i !== numero));
  const onglets = creer_onglets(barre_onglets, afficher);

  function nouvelle_page(titre) {
    // Ouvre un nouveau tableau ; les anciens restent consultables par leur onglet.
    pages.push(creer_page(planche, reglages));
    afficher(onglets.ajouter(titre));
  }

  async function executer(action, horloge) {
    // Exécute une action au tableau et attend qu'elle soit finie.
    if (action.type === "nouveau_tableau") return nouvelle_page(action.titre);
    if (!pages.length) nouvelle_page("Tableau");
    const page = pages.at(-1);
    const couleur = couleur_de(action, reglages);
    if (action.type === "ecrire") return ecrire_texte(page, action, couleur, reglages, horloge);
    return ecrire_formule(page, action, couleur, reglages, horloge);
  }

  return { executer, gere: (type) => ACTIONS_GEREES.has(type) };
}

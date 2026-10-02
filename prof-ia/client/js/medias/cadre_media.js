/*
Rôle : montrer une ressource du manifeste (simulation, image, vidéo, document) dans un cadre posé sur le tableau.
Reçoit : la planche du tableau, les réglages (zone cadre_media), le manifeste, la fonction signaler, puis des actions « media ».
Produit : le cadre avec la consigne, un bouton « Plein écran » et, si demandé, « J'ai terminé » ;
          la lecture attend ce clic, puis le cadre se ferme (il ne fait pas partie de la trace écrite).
          Événements signalés : media_ouvert, plein_ecran, media_termine (avec la durée de manipulation).
Utilisé par : client/js/demo_tableau.js (et plus tard la page de classe).
*/
import { attendre_acceleration } from "../lecteur/horloge.js";

const CHEMIN_RESSOURCES = "/ressources/";

function creer(nom, attributs = {}, texte = "") {
  // Crée un élément HTML avec ses attributs et son texte.
  const element = document.createElement(nom);
  for (const [cle, valeur] of Object.entries(attributs)) element.setAttribute(cle, valeur);
  if (texte) element.textContent = texte;
  return element;
}

function contenu_de(ressource) {
  // Choisit la bonne balise selon le type de ressource.
  const source = CHEMIN_RESSOURCES + ressource.fichier;
  if (["image", "enregistrement"].includes(ressource.type)) return creer("img", { src: source, alt: ressource.description });
  if (ressource.type === "video") return creer("video", { src: source, controls: "" });
  return creer("iframe", { src: source, title: ressource.description });
}

function placer(cadre, zone) {
  // Pose le cadre sur la zone cadre_media du tableau (en pourcentages, il suit la taille de l'écran).
  cadre.style.left = `${zone.x * 100}%`;
  cadre.style.top = `${zone.y * 100}%`;
  cadre.style.width = `${zone.largeur * 100}%`;
  cadre.style.height = `${zone.hauteur * 100}%`;
}

function construire(action, ressource, zone, signaler) {
  // Construit le cadre : la ressource en haut, la consigne et les boutons en bas.
  const cadre = creer("section", { class: "cadre-media", "aria-label": "Ressource à observer" });
  placer(cadre, zone);
  const contenu = creer("div", { class: "cadre-media-contenu" });
  contenu.append(contenu_de(ressource));
  const barre = creer("div", { class: "cadre-media-barre" });
  const plein_ecran = creer("button", { type: "button", class: action.plein_ecran ? "bouton" : "bouton bouton-second" }, "Plein écran");
  plein_ecran.addEventListener("click", () => {
    signaler("plein_ecran", { ressource: ressource.id });
    cadre.requestFullscreen?.().catch(() => {});
  });
  barre.append(creer("p", { class: "cadre-media-consigne" }, action.consigne), plein_ecran);
  cadre.append(contenu, barre);
  return { cadre, barre };
}

function attendre_clic(barre) {
  // Ajoute le bouton « J'ai terminé » et attend le clic de l'élève.
  const fini = creer("button", { type: "button", class: "bouton" }, "J'ai terminé");
  barre.append(fini);
  return new Promise((resoudre) => fini.addEventListener("click", resoudre));
}

async function fermer(cadre) {
  // Sort du plein écran si besoin, puis retire le cadre.
  if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
  cadre.remove();
}

export function creer_cadre_media(planche, reglages, manifeste, signaler) {
  // Prépare l'exécutant des actions « media » pour le lecteur.
  const ressources = Object.fromEntries(manifeste.ressources.map((r) => [r.id, r]));
  let ouvert = null;
  async function executer(action, horloge) {
    // Ouvre la ressource demandée (en fermant la précédente) et attend « J'ai terminé » si besoin.
    ouvert?.remove();
    const { cadre, barre } = construire(action, ressources[action.ressource], reglages.zones.cadre_media, signaler);
    planche.append(cadre);
    ouvert = cadre;
    signaler("media_ouvert", { ressource: action.ressource });
    if (action.attendre !== "clic_termine") return;
    const debut = performance.now();
    const suivi = { fini: false };
    await Promise.race([attendre_clic(barre), attendre_acceleration(horloge, suivi)]);
    suivi.fini = true;
    signaler("media_termine", { ressource: action.ressource, duree_s: Math.round((performance.now() - debut) / 100) / 10 });
    await fermer(cadre);
  }
  return { gere: (type) => type === "media", executer };
}

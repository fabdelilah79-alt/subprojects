/*
Rôle : faire parler le professeur : jouer l'audio d'un beat ou d'une réaction, en suivant l'horloge.
Reçoit : le nom du fichier audio (dans sorties/cache_audio/, servi à /audio/), sa durée et l'horloge.
Produit : une promesse tenue à la fin de la parole ; pause et reprise suivent l'horloge ; « Beat suivant » coupe.
Utilisé par : client/js/lecteur/lecteur.js et client/js/interaction/prediction.js.
Si le fichier manque (pas encore généré), le professeur se tait pendant la durée prévue : rien ne se bloque.
*/
import { attendre_jusqu_a } from "./horloge.js";

const CHEMIN_AUDIO = "/audio/";

function suivre(son, horloge) {
  // Suit l'horloge à chaque image : pause, reprise ; arrête le son si l'on passe au beat suivant.
  return new Promise((resoudre) => {
    const verifier = () => {
      if (son.ended) return resoudre();
      if (horloge.est_rapide()) {
        son.pause();
        return resoudre();
      }
      if (horloge.en_pause() && !son.paused) son.pause();
      if (!horloge.en_pause() && son.paused) son.play().catch(() => {});
      requestAnimationFrame(verifier);
    };
    verifier();
  });
}

async function jouer(fichier, duree_s, horloge) {
  // Joue le fichier ; s'il est absent ou illisible, attend simplement la durée prévue.
  const silence = () => attendre_jusqu_a(horloge, horloge.maintenant() + (duree_s ?? 0));
  if (!fichier) return silence();
  const son = new Audio(CHEMIN_AUDIO + fichier);
  try {
    await son.play();
  } catch (erreur) {
    console.info(`Audio indisponible (${fichier}) : le professeur se tait pendant ${duree_s} s.`, erreur.name);
    return silence();
  }
  return suivre(son, horloge);
}

export function creer_voix() {
  // Prépare la voix du professeur pour le lecteur et la prédiction.
  return { jouer };
}

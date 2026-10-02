/*
Rôle : faire fonctionner la page de démonstration du tableau (boutons, état, texte dit, médias, catalogue).
Reçoit : la partition demandée dans l'adresse (?partie=1 par défaut) et les réglages du tableau.
Produit : la partition jouée au tableau, sans voix, avec une durée fixe par beat.
Utilisé par : client/demo_tableau.html.
*/
import { lire_manifeste, lire_partie, lire_reglages_tableau } from "./api.js";
import { creer_horloge } from "./lecteur/horloge.js";
import { creer_lecteur } from "./lecteur/lecteur.js";
import { creer_cadre_media } from "./medias/cadre_media.js";
import { afficher_catalogue } from "./tableau/catalogue.js";
import { creer_tableau } from "./tableau/tableau.js";

const etat = document.querySelector("#etat");
const texte_dit = document.querySelector("#texte-dit");
const remarques = document.querySelector("#remarques");
const ETAPE_PREVUE = { prediction: 6, pause: 5 };

function creer_rappels(partition) {
  // Prépare ce que la page affiche à chaque beat, pour chaque action non encore gérée, et à la fin.
  const ignorees = new Set();
  return {
    sur_beat(index, beat) {
      etat.textContent = `Beat ${index + 1} sur ${partition.beats.length} · ${beat.phase}`;
      texte_dit.textContent = beat.texte_dit;
    },
    sur_action_ignoree(beat, action) {
      ignorees.add(`${action.type} (étape ${ETAPE_PREVUE[action.type] ?? "?"})`);
      remarques.textContent = `Pas encore au tableau : ${[...ignorees].join(", ")}.`;
    },
    sur_fin() {
      etat.textContent = `Fin de la partie ${partition.numero}.`;
    },
  };
}

function brancher_boutons(lecteur, tableau, reglages) {
  // Relie les boutons au lecteur ; « Tous les éléments » dessine la bibliothèque sur un tableau à part.
  document.querySelector("#lecture").addEventListener("click", () => lecteur.lecture());
  document.querySelector("#pause").addEventListener("click", () => lecteur.pause());
  document.querySelector("#suivant").addEventListener("click", () => lecteur.beat_suivant());
  document.querySelector("#elements").addEventListener("click", () => {
    const horloge = creer_horloge();
    horloge.reprendre();
    afficher_catalogue(tableau, reglages, horloge);
  });
}

async function demarrer() {
  // Charge les réglages et la partition, prépare le tableau et le lecteur.
  const numero = new URLSearchParams(location.search).get("partie") ?? "1";
  try {
    const [reglages, partition, manifeste] = await Promise.all([lire_reglages_tableau(), lire_partie(numero), lire_manifeste()]);
    const planche = document.querySelector("#planche");
    const tableau = await creer_tableau(planche, document.querySelector("#onglets"), reglages);
    const executants = [tableau, creer_cadre_media(planche, reglages, manifeste)];
    const lecteur = creer_lecteur(partition, executants, reglages, creer_horloge(), creer_rappels(partition));
    brancher_boutons(lecteur, tableau, reglages);
    etat.textContent = `Partie ${partition.numero} : ${partition.titre}. Prêt.`;
  } catch (erreur) {
    etat.textContent = `Impossible de charger la partie ${numero}. Vérifiez que le serveur est lancé.`;
    console.error(erreur);
  }
}

demarrer();

/*
Rôle : suivre la préparation de la partie 1 de l'élève, puis proposer d'entrer en classe.
Reçoit : l'état des parties de l'élève (via api.js), relu à intervalle régulier (config/application.json).
Produit : le message d'avancement du professeur ; quand la partie 1 est prête, le bouton « Entrer en classe ».
Utilisé par : client/attente.html.
*/
import { lire_etat_parties, lire_options_accueil } from "./api.js";
import { lire_pseudonyme } from "./session_eleve.js";

const etat = document.querySelector("#etat");
const barre = document.querySelector("#progression");

function attendre(ms) {
  // Attend quelques millisecondes.
  return new Promise((suite) => setTimeout(suite, ms));
}

function montrer_entree(partie) {
  // La partie 1 est prête : la barre se remplit et le bouton apparaît.
  barre.value = 100;
  etat.textContent = partie.message ? `Le tableau est prêt. ${partie.message}` : "Le tableau est prêt.";
  const entrer = document.querySelector("#entrer");
  entrer.hidden = false;
  entrer.focus();
}

async function suivre(pseudonyme) {
  // Relit l'état de la partie 1 jusqu'à ce qu'elle soit prête (ou en erreur).
  const { intervalle_suivi_s } = await lire_options_accueil();
  for (;;) {
    const { parties } = await lire_etat_parties(pseudonyme);
    const partie = parties[0];
    if (partie.etat === "prete") return montrer_entree(partie);
    if (partie.etat === "erreur") throw new Error(partie.message);
    etat.textContent = partie.message || "Le professeur prépare son tableau…";
    await attendre(intervalle_suivi_s * 1000);
  }
}

const pseudonyme = lire_pseudonyme();
if (!pseudonyme) {
  etat.innerHTML = 'Commencez par la page d\'<a href="index.html">accueil</a>.';
} else {
  suivre(pseudonyme).catch((erreur) => {
    etat.textContent = "La préparation n'a pas abouti. Prévenez votre professeur.";
    console.error(erreur);
  });
}

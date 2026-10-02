/*
Rôle : faire avancer la barre de la page d'attente, puis proposer d'entrer en classe.
Reçoit : la durée d'attente simulée (attente_simulee_s, via /api/accueil).
Produit : une barre qui se remplit par paliers ; à la fin, le bouton « Entrer en classe ».
Utilisé par : client/attente.html.
*/
import { lire_options_accueil } from "./api.js";

const PALIERS = 20;

async function simuler_preparation() {
  // Remplit la barre en un nombre fixe de paliers, sur la durée prévue, puis affiche le bouton.
  const { attente_simulee_s } = await lire_options_accueil();
  const barre = document.querySelector("#progression");
  for (let palier = 1; palier <= PALIERS; palier += 1) {
    await new Promise((suite) => setTimeout(suite, (attente_simulee_s * 1000) / PALIERS));
    barre.value = (100 * palier) / PALIERS;
  }
  document.querySelector("#etat").textContent = "Le tableau est prêt.";
  const entrer = document.querySelector("#entrer");
  entrer.hidden = false;
  entrer.focus();
}

simuler_preparation().catch((erreur) => {
  document.querySelector("#etat").textContent = "La préparation n'a pas pu être suivie. Prévenez votre professeur.";
  console.error(erreur);
});

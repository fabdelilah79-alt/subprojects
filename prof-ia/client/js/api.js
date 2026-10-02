/*
Rôle : seul fichier qui parle au serveur depuis le navigateur.
Reçoit : les demandes des autres scripts du client.
Produit : les réponses du serveur, déjà lues en JSON.
Utilisé par : client/js/accueil.js.
*/

async function lire(chemin) {
  // Envoie une demande au serveur et renvoie sa réponse JSON, ou une erreur claire.
  const reponse = await fetch(chemin);
  if (!reponse.ok) {
    throw new Error(`Le serveur a répondu ${reponse.status} pour ${chemin}`);
  }
  return reponse.json();
}

export function lire_options_accueil() {
  // Récupère les cours et les classes à proposer sur la page d'accueil.
  return lire("/api/accueil");
}

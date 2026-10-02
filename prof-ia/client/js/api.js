/*
Rôle : seul fichier qui parle au serveur depuis le navigateur.
Reçoit : les demandes des autres scripts du client.
Produit : les réponses du serveur, déjà lues en JSON.
Utilisé par : client/js/accueil.js, client/js/demo_tableau.js.
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

export function lire_reglages_tableau() {
  // Récupère les réglages du tableau : dimensions, zones, couleurs, police, vitesse d'écriture.
  return lire("/api/tableau");
}

export function lire_partie(numero) {
  // Récupère la partition validée d'une partie du cours.
  return lire(`/api/parties/${numero}`);
}

export function lire_manifeste() {
  // Récupère le manifeste : type et fichier de chaque ressource (simulation, image, document).
  return lire("/api/manifeste");
}

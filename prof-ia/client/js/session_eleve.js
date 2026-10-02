/*
Rôle : se souvenir du pseudonyme de l'élève pendant sa séance (jamais de son nom).
Reçoit : le pseudonyme donné par le serveur à l'accueil.
Produit : lire_pseudonyme() et memoriser_pseudonyme() ; tout est effacé à la fermeture de l'onglet.
Utilisé par : accueil.js, interaction/qcm.js, api.js (pour joindre le pseudonyme aux événements).
*/

export function memoriser_pseudonyme(pseudonyme) {
  // Garde le pseudonyme pour les pages suivantes de la séance.
  try {
    sessionStorage.setItem("pseudonyme", pseudonyme);
  } catch (erreur) {
    console.warn("Pseudonyme non mémorisé :", erreur);
  }
}

export function lire_pseudonyme() {
  // Renvoie le pseudonyme de la séance, ou null s'il n'y en a pas.
  try {
    return sessionStorage.getItem("pseudonyme");
  } catch {
    return null;
  }
}

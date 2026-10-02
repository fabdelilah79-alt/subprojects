/*
Rôle : seul fichier qui parle au serveur depuis le navigateur.
Reçoit : les demandes des autres scripts du client.
Produit : les réponses du serveur, déjà lues en JSON ; l'envoi des événements de l'élève.
Utilisé par : accueil.js, qcm.js, attente.js, demo_tableau.js.
*/
import { lire_pseudonyme } from "./session_eleve.js";

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

async function envoyer(chemin, corps) {
  // Envoie des données JSON au serveur et renvoie sa réponse JSON, ou une erreur claire.
  const reponse = await fetch(chemin, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corps),
  });
  if (!reponse.ok) throw new Error(`Le serveur a répondu ${reponse.status} pour ${chemin}`);
  return reponse.json();
}

export function envoyer_evenement(type, donnees) {
  // Envoie au serveur un événement de l'élève (prédiction, média ouvert…), avec son pseudonyme et l'heure.
  const corps = { pseudonyme: lire_pseudonyme(), type, donnees, horodatage: new Date().toISOString() };
  return envoyer("/api/evenements", corps);
}

export function inscrire_eleve(nom, classe, cours) {
  // Envoie l'inscription ; le serveur renvoie un pseudonyme (le nom ne sert qu'à la correspondance).
  return envoyer("/api/eleve", { nom, classe, cours });
}

export function lire_qcm() {
  // Récupère le questionnaire, sans les bonnes réponses.
  return lire("/api/qcm");
}

export function envoyer_reponses_qcm(pseudonyme, reponses) {
  // Envoie toutes les réponses au QCM ; le serveur calcule le profil.
  return envoyer("/api/qcm/reponses", { pseudonyme, reponses });
}

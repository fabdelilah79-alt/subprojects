/*
Rôle : seul fichier qui parle au serveur depuis le navigateur.
Reçoit : les demandes des autres scripts du client.
Produit : les réponses du serveur, déjà lues en JSON ; l'envoi des événements de l'élève.
Utilisé par : accueil.js, attente.js, classe.js, demo_tableau.js, interaction/qcm.js, interaction/main_levee.js.
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

export function lire_qcm(test = "pre") {
  // Récupère le questionnaire de départ (pre) ou de fin (post), sans les bonnes réponses.
  return lire(`/api/qcm?test=${test}`);
}

export function envoyer_reponses_qcm(pseudonyme, reponses, test = "pre", partiel = false) {
  // Envoie les réponses au questionnaire ; le serveur calcule le profil (partiel : premières questions seulement).
  return envoyer("/api/qcm/reponses", { pseudonyme, reponses, test, partiel });
}

export function lire_etat_parties(pseudonyme) {
  // Récupère l'état de préparation de chaque partie du cours pour cet élève.
  return lire(`/api/eleve/${pseudonyme}/etat`);
}

export function lire_partie_eleve(pseudonyme, numero) {
  // Récupère la partition préparée pour cet élève.
  return lire(`/api/eleve/${pseudonyme}/parties/${numero}`);
}

export function poser_question(pseudonyme, question, partie, deja_au_tableau) {
  // Envoie une question de la main levée ; le serveur renvoie la réponse du professeur (texte et audio).
  return envoyer("/api/questions", { pseudonyme, question, partie, deja_au_tableau });
}

/*
Rôle : faire fonctionner la page d'accueil (listes des cours et des classes).
Reçoit : les options envoyées par le serveur, via api.js.
Produit : les listes remplies. L'envoi du formulaire est bloqué jusqu'à l'étape 7.
Utilisé par : client/index.html.
*/
import { lire_options_accueil } from "./api.js";

const message = document.querySelector("#message");

function remplir_liste(liste, options) {
  // Ajoute à une liste déroulante une ligne par option reçue.
  for (const option of options) {
    const ligne = document.createElement("option");
    ligne.value = option.valeur;
    ligne.textContent = option.texte;
    liste.append(ligne);
  }
}

function afficher_message(texte, type = "info") {
  // Affiche un message court sous le bouton.
  message.textContent = texte;
  message.dataset.type = type;
}

async function preparer_accueil() {
  // Remplit les listes de la page, ou prévient si le serveur ne répond pas.
  try {
    const options = await lire_options_accueil();
    const cours = options.cours.map((c) => ({ valeur: c.id, texte: c.titre }));
    const classes = options.classes.map((c) => ({ valeur: c, texte: c }));
    remplir_liste(document.querySelector("#cours"), cours);
    remplir_liste(document.querySelector("#classe"), classes);
  } catch (erreur) {
    afficher_message("Impossible de charger les cours. Vérifiez que le serveur est lancé.", "erreur");
    console.error(erreur);
  }
}

function bloquer_envoi(evenement) {
  // Empêche l'envoi : l'enregistrement de l'élève sera branché à l'étape 7.
  evenement.preventDefault();
  afficher_message("Formulaire complet. L'enregistrement sera branché à l'étape 7.");
}

document.querySelector("#formulaire-accueil").addEventListener("submit", bloquer_envoi);
preparer_accueil();

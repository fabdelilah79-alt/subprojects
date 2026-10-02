/*
Rôle : faire fonctionner la page d'accueil (listes des cours et des classes).
Reçoit : les options envoyées par le serveur, via api.js.
Produit : les listes remplies ; à l'envoi, l'inscription (pseudonyme) puis le passage au questionnaire.
Utilisé par : client/index.html.
*/
import { inscrire_eleve, lire_options_accueil } from "./api.js";
import { memoriser_pseudonyme } from "./session_eleve.js";

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

async function commencer(evenement) {
  // Inscrit l'élève (le serveur remplace son nom par un pseudonyme), puis ouvre le questionnaire.
  evenement.preventDefault();
  const donnees = new FormData(evenement.target);
  try {
    const { pseudonyme } = await inscrire_eleve(donnees.get("nom"), donnees.get("classe"), donnees.get("cours"));
    memoriser_pseudonyme(pseudonyme);
    location.href = "qcm.html";
  } catch (erreur) {
    afficher_message("L'inscription n'a pas fonctionné. Vérifiez que le serveur est lancé.", "erreur");
    console.error(erreur);
  }
}

document.querySelector("#formulaire-accueil").addEventListener("submit", commencer);
preparer_accueil();

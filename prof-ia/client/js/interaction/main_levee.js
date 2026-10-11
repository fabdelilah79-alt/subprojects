/*
Rôle : la main levée : l'élève écrit une question pendant le cours ; le professeur y répond à la fin de sa phrase,
       à voix haute, et écrit l'essentiel au brouillon.
Reçoit : le pseudonyme, la voix, une fonction pour afficher le texte dit, une fonction qui donne le contexte du cours
         (numéro de la partie, phrases déjà dites) et la fonction signaler (événements).
Produit : repondre(horloge), à appeler entre deux beats : il traite les questions en attente, une par une.
          Événement signalé : main_levee (au moment où l'élève envoie sa question).
Utilisé par : client/js/classe.js.
*/
import { poser_question } from "../api.js";

const bouton = document.querySelector("#lever-main");
const formulaire = document.querySelector("#formulaire-question");
const champ = document.querySelector("#question");
const suivi = document.querySelector("#suivi-question");

function montrer_formulaire(visible) {
  // Montre le formulaire de question (et cache le bouton), ou l'inverse.
  formulaire.hidden = !visible;
  bouton.hidden = visible;
  if (visible) champ.focus();
}

function ecrire_au_brouillon(question, reponse) {
  // Ajoute l'échange au brouillon : la question de l'élève et ce que le professeur écrit.
  const ligne = document.createElement("li");
  const texte_question = document.createElement("p");
  texte_question.className = "echange-question";
  texte_question.textContent = `Question : ${question}`;
  ligne.append(texte_question);
  if (reponse.ecrit_brouillon) {
    const ecrit = document.createElement("p");
    ecrit.className = "echange-ecrit";
    ecrit.textContent = reponse.ecrit_brouillon;
    ligne.append(ecrit);
  }
  document.querySelector("#echanges").append(ligne);
  document.querySelector("#brouillon").hidden = false;
}

function brancher_formulaire(en_attente, contexte_cours, signaler) {
  // Le bouton ouvre le formulaire ; la question envoyée rejoint la liste d'attente.
  bouton.addEventListener("click", () => montrer_formulaire(true));
  document.querySelector("#annuler-question").addEventListener("click", () => montrer_formulaire(false));
  formulaire.addEventListener("submit", (evenement) => {
    evenement.preventDefault();
    const question = champ.value.trim();
    if (!question) return;
    en_attente.push(question);
    signaler("main_levee", { partie: contexte_cours().partie, longueur: question.length });
    champ.value = "";
    montrer_formulaire(false);
    suivi.textContent = "Question notée : le professeur vous répond à la fin de sa phrase.";
  });
}

export function creer_main_levee(pseudonyme, voix, afficher_texte_dit, contexte_cours, signaler) {
  // Branche le bouton et le formulaire ; renvoie de quoi répondre aux questions entre deux beats.
  const en_attente = [];
  brancher_formulaire(en_attente, contexte_cours, signaler);

  async function repondre(horloge) {
    // Répond aux questions en attente, dans l'ordre : réponse dite, écrit au brouillon.
    while (en_attente.length) {
      const question = en_attente.shift();
      const { partie, deja } = contexte_cours();
      suivi.textContent = "Le professeur répond à votre question…";
      try {
        const reponse = await poser_question(pseudonyme, question, partie, deja);
        ecrire_au_brouillon(question, reponse);
        afficher_texte_dit(reponse.reponse_orale);
        await voix.jouer(reponse.audio, reponse.duree_s, horloge);
        suivi.textContent = "";
      } catch (erreur) {
        suivi.textContent = "La question n'a pas pu être envoyée. Réessayez plus tard.";
        console.error(erreur);
      }
    }
  }
  return { repondre, activer: () => { bouton.hidden = false; } };
}

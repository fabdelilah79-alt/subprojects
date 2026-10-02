/*
Rôle : faire passer le QCM diagnostique, une question à la fois, puis envoyer les réponses.
Reçoit : le questionnaire (via api.js) et le pseudonyme de la séance.
Produit : les réponses (choix, justification, certitude, temps en secondes) envoyées au serveur ; puis la page d'attente.
Utilisé par : client/qcm.html.
*/
import { envoyer_reponses_qcm, lire_qcm } from "../api.js";
import { lire_pseudonyme } from "../session_eleve.js";
import { attendre_reponse, construire_question } from "./qcm_question.js";

const zone = document.querySelector("#question");
const avancement = document.querySelector("#avancement");
const message = document.querySelector("#message");

async function poser(question, index, qcm) {
  // Affiche une question, attend la réponse, renvoie la réponse avec son temps.
  const derniere = index === qcm.questions.length - 1;
  avancement.textContent = `Question ${index + 1} sur ${qcm.questions.length}`;
  const formulaire = construire_question(question, qcm.certitudes, derniere ? "Terminer" : "Question suivante");
  zone.replaceChildren(formulaire);
  formulaire.querySelector("input").focus();
  const debut = performance.now();
  const reponse = await attendre_reponse(formulaire);
  return { question: question.id, ...reponse, temps_s: Math.round((performance.now() - debut) / 100) / 10 };
}

async function passer_qcm(pseudonyme) {
  // Pose toutes les questions dans l'ordre, puis envoie les réponses et ouvre la page d'attente.
  const qcm = await lire_qcm();
  document.querySelector("#titre").textContent = qcm.titre;
  document.querySelector("#consigne").textContent = qcm.consigne;
  const reponses = [];
  for (const [index, question] of qcm.questions.entries()) reponses.push(await poser(question, index, qcm));
  zone.replaceChildren();
  avancement.textContent = "Envoi de vos réponses…";
  await envoyer_reponses_qcm(pseudonyme, reponses);
  location.href = "attente.html";
}

const pseudonyme = lire_pseudonyme();
if (!pseudonyme) {
  message.innerHTML = 'Commencez par la page d\'<a href="index.html">accueil</a>.';
} else {
  passer_qcm(pseudonyme).catch((erreur) => {
    message.textContent = "Un problème est survenu. Prévenez votre professeur.";
    message.dataset.type = "erreur";
    console.error(erreur);
  });
}

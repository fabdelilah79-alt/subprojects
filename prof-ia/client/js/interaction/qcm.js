/*
Rôle : faire passer un questionnaire (de départ, ou de fin avec ?test=post), une question à la fois.
Reçoit : le questionnaire (via api.js) et le pseudonyme de la séance.
Produit : les réponses (choix, justification, certitude, temps en secondes) envoyées au serveur ;
          au départ, un premier envoi dès la fin des questions de la partie 1 (sa préparation commence),
          puis la page d'attente ; à la fin du cours, la page de remerciement.
Utilisé par : client/qcm.html.
*/
import { envoyer_reponses_qcm, lire_qcm } from "../api.js";
import { lire_pseudonyme } from "../session_eleve.js";
import { attendre_reponse, construire_question } from "./qcm_question.js";

const TEST = new URLSearchParams(location.search).get("test") === "post" ? "post" : "pre";
const SUITE = { pre: "attente.html", post: "fin.html" };
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

function envoyer_debut(pseudonyme, qcm, reponses, index) {
  // Au départ, dès la dernière question de la partie 1, envoie ces réponses : la partie 1 se prépare déjà.
  const suivante = qcm.questions[index + 1];
  if (TEST !== "pre" || qcm.questions[index].partie !== 1 || !suivante || suivante.partie === 1) return;
  envoyer_reponses_qcm(pseudonyme, [...reponses], TEST, true).catch((erreur) => console.warn(erreur));
}

async function passer_qcm(pseudonyme) {
  // Pose toutes les questions dans l'ordre, puis envoie les réponses et ouvre la page suivante.
  const qcm = await lire_qcm(TEST);
  document.querySelector("#titre").textContent = qcm.titre;
  document.querySelector("#consigne").textContent = qcm.consigne;
  const reponses = [];
  for (const [index, question] of qcm.questions.entries()) {
    reponses.push(await poser(question, index, qcm));
    envoyer_debut(pseudonyme, qcm, reponses, index);
  }
  zone.replaceChildren();
  avancement.textContent = "Envoi de vos réponses…";
  await envoyer_reponses_qcm(pseudonyme, reponses, TEST);
  location.href = SUITE[TEST];
}

const pseudonyme = lire_pseudonyme();
if (TEST === "post") document.querySelector(".parcours li:last-child").setAttribute("aria-current", "step");
if (TEST === "post") document.querySelector(".parcours li:nth-child(2)").removeAttribute("aria-current");
if (!pseudonyme) {
  message.innerHTML = 'Commencez par la page d\'<a href="index.html">accueil</a>.';
} else {
  passer_qcm(pseudonyme).catch((erreur) => {
    message.textContent = "Un problème est survenu. Prévenez votre professeur.";
    message.dataset.type = "erreur";
    console.error(erreur);
  });
}

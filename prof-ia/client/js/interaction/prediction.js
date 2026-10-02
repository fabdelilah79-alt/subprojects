/*
Rôle : recueillir la prédiction de l'élève (choix + justification), puis faire réagir le professeur selon son choix.
Reçoit : la planche du tableau, la voix, la fonction signaler, une fonction pour afficher le texte dit ; puis des actions « prediction ».
Produit : un panneau posé sur le tableau ; la lecture attend la réponse, puis la réaction (branche) est dite.
          Événement signalé : prediction (question, choix, conception, justification, temps de réponse).
Utilisé par : client/js/demo_tableau.js (et plus tard la page de classe).
*/
import { attendre_acceleration } from "../lecteur/horloge.js";

function creer(nom, attributs = {}, texte = "") {
  // Crée un élément HTML avec ses attributs et son texte.
  const element = document.createElement(nom);
  for (const [cle, valeur] of Object.entries(attributs)) element.setAttribute(cle, valeur);
  if (texte) element.textContent = texte;
  return element;
}

const insecables = (texte) => texte.replace(/ ([?!:;])/g, "\u00a0$1");

function ligne_de_choix(choix) {
  // Crée une option : un bouton radio et son texte, cliquables ensemble.
  const etiquette = creer("label", { class: "choix" });
  etiquette.append(creer("input", { type: "radio", name: "choix", value: choix.id, required: "" }));
  etiquette.append(creer("span", {}, insecables(`${choix.id}. ${choix.texte}`)));
  return etiquette;
}

function construire(action) {
  // Construit le formulaire : la question, les choix, la justification si elle est demandée, le bouton.
  const formulaire = creer("form", { class: "prediction", "aria-label": "Votre prédiction" });
  const groupe = creer("fieldset");
  groupe.append(creer("legend", {}, insecables(action.question)), ...action.choix.map(ligne_de_choix));
  formulaire.append(groupe);
  if (action.justifier) {
    const champ = creer("div", { class: "champ" });
    champ.append(creer("label", { for: "justification" }, "Pourquoi ? Expliquez en une ou deux phrases."));
    champ.append(creer("textarea", { id: "justification", name: "justification", rows: 3, required: "", minlength: 3 }));
    formulaire.append(champ);
  }
  formulaire.append(creer("button", { type: "submit", class: "bouton" }, "Valider ma réponse"));
  return formulaire;
}

function attendre_reponse(formulaire) {
  // Attend l'envoi du formulaire (le navigateur vérifie d'abord que tout est rempli).
  return new Promise((resoudre) => {
    formulaire.addEventListener("submit", (evenement) => {
      evenement.preventDefault();
      const donnees = new FormData(formulaire);
      resoudre({ choix: donnees.get("choix"), justification: donnees.get("justification") ?? "" });
    });
  });
}

export function creer_prediction(planche, voix, signaler, afficher_texte_dit) {
  // Prépare l'exécutant des actions « prediction » pour le lecteur.
  async function executer(action, horloge) {
    // Pose la question, attend la réponse, signale l'événement, puis joue la réaction prévue pour ce choix.
    const formulaire = construire(action);
    planche.append(formulaire);
    formulaire.querySelector("input").focus();
    const debut = performance.now();
    const suivi = { fini: false };
    const reponse = await Promise.race([attendre_reponse(formulaire), attendre_acceleration(horloge, suivi)]);
    suivi.fini = true;
    formulaire.remove();
    if (!reponse) return;
    const choix = action.choix.find((c) => c.id === reponse.choix);
    signaler("prediction", { question: action.question, ...reponse, conception: choix.conception ?? null,
      temps_s: Math.round((performance.now() - debut) / 100) / 10 });
    const branche = action.branches.find((b) => b.choix === reponse.choix);
    afficher_texte_dit(branche.texte_dit);
    await voix.jouer(branche.audio, branche.duree_s, horloge);
  }
  return { gere: (type) => type === "prediction", executer };
}

/*
Rôle : construire le formulaire d'une question du QCM : énoncé, choix, justification, certitude.
Reçoit : une question (sans bonne réponse), les degrés de certitude, le texte du bouton.
Produit : un formulaire prêt à afficher, et une promesse tenue quand l'élève l'a rempli et validé.
Utilisé par : client/js/interaction/qcm.js.
*/
const insecables = (texte) => texte.replace(/ ([?!:;])/g, " $1");

function creer(nom, attributs = {}, texte = "") {
  // Crée un élément HTML avec ses attributs et son texte.
  const element = document.createElement(nom);
  for (const [cle, valeur] of Object.entries(attributs)) element.setAttribute(cle, valeur);
  if (texte) element.textContent = texte;
  return element;
}

function groupe_de_choix(legende, nom, options, classe) {
  // Crée un groupe de boutons radio (un seul choix possible, obligatoire).
  const groupe = creer("fieldset", { class: classe });
  groupe.append(creer("legend", {}, insecables(legende)));
  for (const option of options) {
    const ligne = creer("label", { class: "choix" });
    ligne.append(creer("input", { type: "radio", name: nom, value: option.id, required: "" }));
    ligne.append(creer("span", {}, insecables(option.texte)));
    groupe.append(ligne);
  }
  return groupe;
}

export function construire_question(question, certitudes, texte_bouton) {
  // Construit le formulaire complet d'une question.
  const formulaire = creer("form", { class: "qcm-question" });
  const choix = question.choix.map((c) => ({ id: c.id, texte: `${c.id}. ${c.texte}` }));
  formulaire.append(groupe_de_choix(question.enonce, "choix", choix, "qcm-enonce"));
  const champ = creer("div", { class: "champ" });
  champ.append(creer("label", { for: "justification" }, "Pourquoi ? Une phrase suffit."));
  champ.append(creer("textarea", { id: "justification", name: "justification", rows: 2, required: "", minlength: 3 }));
  formulaire.append(champ);
  formulaire.append(groupe_de_choix("Êtes-vous sûr de votre réponse ?", "certitude", certitudes, "qcm-certitude"));
  formulaire.append(creer("button", { type: "submit", class: "bouton" }, texte_bouton));
  return formulaire;
}

export function attendre_reponse(formulaire) {
  // Attend que l'élève valide la question (le navigateur vérifie que tout est rempli).
  return new Promise((resoudre) => {
    formulaire.addEventListener("submit", (evenement) => {
      evenement.preventDefault();
      const donnees = new FormData(formulaire);
      resoudre({ choix: donnees.get("choix"), justification: donnees.get("justification"), certitude: donnees.get("certitude") });
    });
  });
}

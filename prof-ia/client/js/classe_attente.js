/*
Rôle : entre deux parties, attendre que la suivante soit prête ; en attendant, montrer ce qu'il faut retenir.
Reçoit : le pseudonyme, le numéro de la partie attendue, la planche du tableau, la partie précédente, l'intervalle de suivi.
Produit : rien si la partie est déjà prête ; sinon un panneau posé sur le tableau (à recopier dans le cahier),
          avec le message d'avancement, retiré dès que la partie est prête.
Utilisé par : client/js/classe.js.
*/
import { lire_etat_parties } from "./api.js";

function creer(nom, texte = "") {
  // Crée un élément HTML avec son texte.
  const element = document.createElement(nom);
  element.textContent = texte;
  return element;
}

function ligne_a_retenir(action) {
  // Une ligne de la liste : le texte, ou la formule mise en forme par KaTeX.
  const ligne = creer("li", action.texte ?? "");
  if (action.latex) window.katex.render(action.latex, ligne, { throwOnError: false });
  return ligne;
}

function construire_panneau(precedente) {
  // Construit le panneau : titre, consigne, liste « à retenir » de la partie précédente, barre d'attente.
  const panneau = creer("section");
  panneau.className = "panneau-attente";
  panneau.setAttribute("aria-label", "Le professeur prépare la suite");
  const retenir = precedente?.beats.flatMap((beat) => beat.actions).filter((a) => a.zone === "a_retenir") ?? [];
  panneau.append(creer("h2", "Le professeur prépare la suite"));
  if (retenir.length) {
    panneau.append(creer("p", "En attendant, recopiez dans votre cahier ce qu'il faut retenir :"));
    const liste = creer("ul");
    liste.append(...retenir.map(ligne_a_retenir));
    panneau.append(liste);
  }
  const message = creer("p");
  message.setAttribute("role", "status");
  panneau.append(message, creer("progress"));
  return { panneau, message };
}

export async function attendre_partie(pseudonyme, numero, planche, precedente, intervalle_s) {
  // Relit l'état de la partie jusqu'à ce qu'elle soit prête ; montre le panneau seulement s'il faut attendre.
  let affichage = null;
  for (;;) {
    const partie = (await lire_etat_parties(pseudonyme)).parties[numero - 1];
    if (partie.etat === "prete" || partie.etat === "erreur") {
      affichage?.panneau.remove();
      if (partie.etat === "erreur") throw new Error(partie.message);
      return;
    }
    if (!affichage) {
      affichage = construire_panneau(precedente);
      planche.append(affichage.panneau);
    }
    affichage.message.textContent = partie.message || "Préparation…";
    await new Promise((suite) => setTimeout(suite, intervalle_s * 1000));
  }
}

/*
Rôle : faire fonctionner la classe : jouer les parties de l'élève l'une après l'autre, avec la main levée.
Reçoit : le pseudonyme de la séance ; les réglages du tableau, le manifeste et les parties préparées (via api.js).
Produit : le cours au tableau ; les événements partie_commencee, partie_terminee, retour_onglet ;
          entre deux parties, une attente utile si la suivante n'est pas prête ; à la fin, le questionnaire de fin.
Utilisé par : client/classe.html.
*/
import { envoyer_evenement, lire_etat_parties, lire_manifeste, lire_options_accueil, lire_partie_eleve,
  lire_reglages_tableau } from "./api.js";
import { attendre_partie } from "./classe_attente.js";
import { creer_main_levee } from "./interaction/main_levee.js";
import { creer_prediction } from "./interaction/prediction.js";
import { creer_voix } from "./lecteur/audio.js";
import { creer_horloge } from "./lecteur/horloge.js";
import { creer_lecteur } from "./lecteur/lecteur.js";
import { creer_cadre_media } from "./medias/cadre_media.js";
import { lire_pseudonyme } from "./session_eleve.js";
import { creer_tableau } from "./tableau/tableau.js";

const PHASES = { prediction: "prédiction", observation: "observation", explication: "explication", synthese: "synthèse" };
const etat = document.querySelector("#etat");
const texte_dit = document.querySelector("#texte-dit");
const planche = document.querySelector("#planche");
const signaler = (type, donnees) => envoyer_evenement(type, donnees).catch((e) => console.warn(e));
const afficher_texte_dit = (texte) => { texte_dit.textContent = texte; };

function creer_rappels(cours, nombre) {
  // Ce que la page affiche à chaque beat ; les phrases dites servent de contexte à la main levée.
  return {
    sur_beat(index, beat) {
      etat.textContent = `Partie ${cours.partie} sur ${nombre} · ${PHASES[beat.phase]}`;
      afficher_texte_dit(beat.texte_dit);
      cours.deja.push(beat.texte_dit);
    },
    sur_action_ignoree(beat, action) { console.warn(`Action non gérée (${beat.id}) :`, action.type); },
    sur_fin() {},
  };
}

function brancher_pause(horloge) {
  // Le bouton Pause arrête le professeur (voix, écriture) ; il devient « Reprendre ».
  const bouton = document.querySelector("#pause");
  bouton.hidden = false;
  bouton.addEventListener("click", () => {
    if (horloge.en_pause()) horloge.reprendre(); else horloge.pause();
    bouton.textContent = horloge.en_pause() ? "Reprendre" : "Pause";
  });
}

function attendre_commencer() {
  // Attend le clic sur « Commencer le cours » (le navigateur n'autorise le son qu'après un clic).
  const bouton = document.querySelector("#lecture");
  etat.textContent = "Le tableau est prêt.";
  return new Promise((suite) => bouton.addEventListener("click", () => { bouton.hidden = true; suite(); }, { once: true }));
}

async function preparer(pseudonyme) {
  // Charge les réglages et prépare le tableau, la voix, les médias, la prédiction et la main levée.
  const [reglages, manifeste, options, { nombre }] = await Promise.all([
    lire_reglages_tableau(), lire_manifeste(), lire_options_accueil(), lire_etat_parties(pseudonyme)]);
  const cours = { partie: 1, deja: [] };
  const sur_onglet = (choisi, courant) => signaler("retour_onglet", { partie: cours.partie, onglet: choisi + 1, courant: courant + 1 });
  const tableau = await creer_tableau(planche, document.querySelector("#onglets"), reglages, sur_onglet);
  const voix = creer_voix();
  const horloge = creer_horloge();
  const main_levee = creer_main_levee(pseudonyme, voix, afficher_texte_dit, () => cours, signaler);
  const executants = [tableau, creer_cadre_media(planche, reglages, manifeste, signaler),
    creer_prediction(planche, voix, signaler, afficher_texte_dit)];
  const contexte = { executants, voix, reglages, horloge, rappels: creer_rappels(cours, nombre),
    entre_beats: () => main_levee.repondre(horloge) };
  return { contexte, cours, nombre, main_levee, intervalle_s: options.intervalle_suivi_s };
}

async function faire_cours(pseudonyme) {
  // Joue chaque partie dès qu'elle est prête ; l'élève n'attend qu'entre deux parties, si besoin.
  const { contexte, cours, nombre, main_levee, intervalle_s } = await preparer(pseudonyme);
  await attendre_commencer();
  brancher_pause(contexte.horloge);
  main_levee.activer();
  let precedente = null;
  for (let numero = 1; numero <= nombre; numero += 1) {
    etat.textContent = `Partie ${numero} sur ${nombre}`;
    await attendre_partie(pseudonyme, numero, planche, precedente, intervalle_s);
    const partition = await lire_partie_eleve(pseudonyme, numero);
    Object.assign(cours, { partie: numero, deja: [] });
    signaler("partie_commencee", { partie: numero, source: partition.generation.source });
    await creer_lecteur(partition, contexte).jouer();
    signaler("partie_terminee", { partie: numero });
    precedente = partition;
  }
  etat.textContent = "Fin du cours. Merci de votre attention.";
  document.querySelector("#pause").hidden = true;
  document.querySelector("#lever-main").hidden = true;
  document.querySelector("#questionnaire-fin").hidden = false;
}

const pseudonyme = lire_pseudonyme();
if (!pseudonyme) {
  etat.innerHTML = 'Commencez par la page d\'<a href="index.html">accueil</a>.';
} else {
  faire_cours(pseudonyme).catch((erreur) => {
    etat.textContent = "Le cours n'a pas pu continuer. Prévenez votre professeur.";
    console.error(erreur);
  });
}

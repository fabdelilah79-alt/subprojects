/*
Rôle : jouer une partition beat par beat : le professeur parle, et chaque action démarre au bon moment.
Reçoit : la partition et un contexte : exécutants (tableau, médias, prédiction), voix, réglages, horloge, rappels,
         et, si besoin, entre_beats(index, beat) : appelé après chaque beat (réponses de la main levée).
Produit : un objet avec lecture(), pause(), beat_suivant() et jouer() (promesse tenue à la fin de la partition).
Utilisé par : client/js/demo_tableau.js et client/js/classe.js.
*/
import { attendre_jusqu_a } from "./horloge.js";

function instants_des_actions(beat, duree) {
  // Instant de départ de chaque action : debut_s s'il existe, sinon actions réparties sur la durée du beat.
  const nombre = beat.actions.length;
  return beat.actions.map((action, i) => action.debut_s ?? (i * duree) / nombre);
}

async function jouer_beat(beat, contexte) {
  // Joue un beat : chaque action démarre à son instant, une seule écriture à la fois, comme un vrai prof.
  const { executants, voix, reglages, horloge, rappels } = contexte;
  const debut = horloge.maintenant();
  const duree = beat.duree_s ?? reglages.demo.duree_beat_s;
  const instants = instants_des_actions(beat, duree);
  const parole = voix.jouer(beat.audio, duree, horloge);
  for (const [i, action] of beat.actions.entries()) {
    await attendre_jusqu_a(horloge, debut + instants[i]);
    const executant = executants.find((candidat) => candidat.gere(action.type));
    if (executant) await executant.executer(action, horloge);
    else rappels.sur_action_ignoree(beat, action);
  }
  await parole;
  await attendre_jusqu_a(horloge, debut + duree);
  await attendre_jusqu_a(horloge, horloge.maintenant() + reglages.ecriture.pause_entre_beats_s);
}

async function jouer_partition(partition, contexte) {
  // Enchaîne les beats jusqu'à la fin ; « Beat suivant » n'accélère que le beat en cours.
  for (const [index, beat] of partition.beats.entries()) {
    contexte.rappels.sur_beat(index, beat);
    await jouer_beat(beat, contexte);
    contexte.horloge.ralentir();
    if (contexte.entre_beats) await contexte.entre_beats(index, beat);
  }
  contexte.rappels.sur_fin();
}

export function creer_lecteur(partition, contexte) {
  // Prépare la lecture de la partition ; elle démarre au premier appui sur Lecture ou Beat suivant.
  const { horloge } = contexte;
  let lecture_en_cours = null;
  const demarrer = () => {
    lecture_en_cours ??= jouer_partition(partition, contexte);
    return lecture_en_cours;
  };
  return {
    lecture() { horloge.reprendre(); demarrer(); },
    pause() { horloge.pause(); },
    beat_suivant() { demarrer(); horloge.accelerer(); },
    jouer() { horloge.reprendre(); return demarrer(); },
  };
}

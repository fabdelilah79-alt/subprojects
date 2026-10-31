/*
Rôle : simulation de l'activité 1 du chapitre « Le mouvement » (tronc commun) : « Exemples de la vie courante sur la
       relativité du mouvement ». Objectif O1 : choisir un référentiel et décrire la trajectoire dans ce référentiel.
       Orientation : nécessité du référentiel ; terrestre à la surface de la Terre, géocentrique pour la Lune et les satellites.
Reçoit : rien (les vérifications lisent les passages observés avec chaque caméra).
Produit : la simulation démarrée : rue, cycliste, caméra fixe et caméra embarquée avec stroboscope.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const vu = (vue) => ({ faits }) => ((faits.passages || {})[vue] || 0) >= 1;

  const RELATIVITE = {
    id: "relativite", paillasse: 0, titre: "La relativité du mouvement",
    objectif: "Observer le même mouvement depuis deux référentiels : la route (caméra fixe) et le vélo (caméra embarquée).",
    entetes: [],
    conclusion: "La trajectoire d'un point dépend du référentiel : pour décrire un mouvement, il faut d'abord choisir un référentiel.",
    conclusion_courte: "Le mouvement dépend du référentiel.",
    etapes: [
      { consigne: "Regardez un passage complet du cycliste avec la caméra fixe, sur son trépied au bord du trottoir.", court: "Un passage vu par la caméra fixe.", verifier: vu("fixe"), aide_geste: "Points jaunes : la valve de la roue ; points bleus : le casque. Le bouton « Pause » arrête l'image." },
      { consigne: "Dans le référentiel terrestre (la route), la trajectoire de la valve est…", court: "Répondez dans le carnet.", question: choix(["une courbe en arches (une cycloïde)", "un cercle", "une droite"], "Suivez les points jaunes d'un bout à l'autre.", "Exact : la valve avance et tourne à la fois.") },
      { consigne: "Touchez la petite caméra fixée sur le porte-bagages : regardez un passage complet depuis le vélo.", court: "Un passage vu depuis le vélo.", verifier: vu("embarquee") },
      { consigne: "Dans le référentiel du vélo, la trajectoire de la valve est…", court: "Répondez dans le carnet.", question: choix(["un cercle autour du moyeu", "une courbe en arches", "une droite"], "Suivez les points jaunes : le vélo ne bouge pas dans cette vue.", "Exact : par rapport au vélo, la valve tourne autour du moyeu.") },
      { consigne: "Le casque du cycliste (points bleus) est…", court: "Répondez dans le carnet.", question: choix(["immobile par rapport au vélo, en mouvement par rapport à la route", "immobile par rapport à la route", "en mouvement dans les deux référentiels"], "Comparez les points bleus dans les deux vues.", "Exact : le mouvement est relatif.") },
      { consigne: "Pour étudier le mouvement de la Lune ou d'un satellite autour de la Terre, on choisit le référentiel…", court: "Répondez dans le carnet.", question: choix(["géocentrique (centre de la Terre, axes vers des étoiles lointaines)", "terrestre (le sol de la classe)", "du satellite lui-même"], "Le centre de la Terre ne tourne pas avec le sol.", "Exact.") },
      { consigne: "Pour étudier le mouvement d'une voiture sur la route, le référentiel le plus simple est…", court: "Répondez dans le carnet.", question: choix(["le référentiel terrestre", "le référentiel géocentrique", "le référentiel de la voiture"], "Où se trouve la route ?", "Exact : le sol, lié à la Terre.") },
    ],
  };

  L.demarrer({ id: "tc_meca2_a1_relativite", titre: "Dans la rue : la relativité du mouvement", decor: "aucun", repos_carnet: { x: 118, y: 634 }, repos_tablette: { x: 922, y: 632 }, paillasses: [L.poste_rue], missions: [RELATIVITE] });
})(window.Labo);

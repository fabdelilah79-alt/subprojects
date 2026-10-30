/*
Rôle : simulation de la partie propre aux filières PC, SMA et SMB du chapitre « Transformations rapides et transformations
       lentes » (2e année du bac) : interprétation microscopique qualitative de la réaction par les chocs efficaces ; influence
       de la concentration et de la température sur le nombre de chocs efficaces par unité de temps, avec un logiciel de
       simulation (A + B → C). Objectif O3 (facteurs cinétiques).
Reçoit : rien (les vérifications lisent « essais_chocs »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const essai = (nA, nB, T) => ({ faits }) => (faits.essais_chocs || []).some((e) => e.nA === nA && e.nB === nB && e.T === T) || false;

  const CHOCS = {
    id: "chocs", paillasse: 0, titre: "Les chocs efficaces",
    conclusion: "Dans une solution, les entités réactives (molécules, ions) s'agitent sans cesse et se heurtent. Une réaction se produit seulement lors d'un choc efficace : un choc assez énergique (énergie au moins égale à une énergie seuil) et convenablement orienté. Seule une petite partie des chocs est efficace.",
    objectif: "Observer les chocs entre particules A et B et la formation de C.",
    entetes: [], donnees: ["A (rouge) + B (bleu) → C (vert)", "Un choc est efficace s'il est assez énergique", "Essai : 20 s ; compteurs sur les 2 premières secondes"],
    conclusion_courte: "Réaction : chocs efficaces seulement.",
    etapes: [
      { consigne: "Avec 30 particules A, 30 particules B et 300 K, touchez « Lancer » et observez l'essai jusqu'au bout.", court: "Essai : 30 A, 30 B, 300 K.", verifier: essai(30, 30, 300) },
      { consigne: "Les particules A et B se rencontrent souvent, mais elles forment C…", court: "Répondez dans le carnet.", question: choix(["seulement quand le choc est assez énergique : c'est un choc efficace", "à chaque rencontre", "quand elles s'arrêtent l'une contre l'autre"], "Comparez le nombre de chocs et le nombre de C formés.", "Exact.") },
      { consigne: "Les chocs efficaces représentent…", court: "Répondez dans le carnet.", question: choix(["une petite partie des chocs A–B", "tous les chocs", "exactement la moitié des chocs"], "Regardez la part des chocs A–B efficaces.", "Exact.") },
    ],
  };

  const CONCENTRATION = {
    id: "concentration", paillasse: 0, titre: "Concentration et chocs efficaces",
    conclusion: "Dans le même volume, deux fois plus de particules A et deux fois plus de particules B donnent environ quatre fois plus de chocs A–B par seconde, donc plus de chocs efficaces par seconde : C se forme plus vite. Plus les réactifs sont concentrés, plus la transformation est rapide. Au cours de l'essai, A et B se raréfient : les chocs efficaces deviennent moins fréquents et la formation de C ralentit.",
    objectif: "Comparer les chocs avec deux fois plus de particules.",
    entetes: [], donnees: ["Même boîte : même volume", "Concentration = nombre de particules / volume", "Comparez les compteurs et les courbes"],
    conclusion_courte: "Plus concentré : plus de chocs efficaces par seconde.",
    etapes: [
      { consigne: "Réglez 60 particules A et 60 particules B (300 K) et lancez un essai.", court: "Essai : 60 A, 60 B, 300 K.", aide_geste: "Touches + et − à droite des réglages.", verifier: essai(60, 60, 300) },
      { consigne: "Avec deux fois plus de particules A et B dans la même boîte…", court: "Répondez dans le carnet.", question: choix(["il y a beaucoup plus de chocs (et de chocs efficaces) par seconde : C se forme plus vite", "le nombre de chocs par seconde ne change pas", "les chocs deviennent plus énergiques"], "Comparez les compteurs des deux essais.", "Exact : environ quatre fois plus de chocs A–B.") },
      { consigne: "Au cours d'un essai, la courbe du nombre de C s'aplatit, car…", court: "Répondez dans le carnet.", question: choix(["il reste de moins en moins de particules A et B : les chocs efficaces deviennent rares", "les particules ralentissent", "les particules C empêchent toute réaction"], "Regardez la boîte à la fin de l'essai.", "Exact.") },
    ],
  };

  const TEMPERATURE = {
    id: "temperature", paillasse: 0, titre: "Température et chocs efficaces",
    conclusion: "À température plus élevée, les particules sont plus rapides : les chocs sont à peine plus nombreux, mais beaucoup plus souvent assez énergiques (environ 5 % de chocs efficaces à 400 K contre 2 % à 300 K). Le nombre de chocs efficaces par seconde augmente nettement : la transformation est plus rapide. C'est l'interprétation de l'effet de la température observé au laboratoire.",
    objectif: "Comparer les chocs à 300 K et à 400 K.",
    entetes: [], donnees: ["30 A et 30 B", "À 400 K, les particules s'agitent plus vite", "Comparez les compteurs et les courbes"],
    conclusion_courte: "Plus chaud : chocs plus énergiques, plus souvent efficaces.",
    etapes: [
      { consigne: "Revenez à 30 A et 30 B, réglez 400 K et lancez un essai.", court: "Essai : 30 A, 30 B, 400 K.", verifier: essai(30, 30, 400) },
      { consigne: "À 400 K, par rapport à 300 K…", court: "Répondez dans le carnet.", question: choix(["les chocs ne sont guère plus nombreux, mais ils sont beaucoup plus souvent efficaces : C se forme plus vite", "les chocs sont beaucoup moins énergiques", "la température ne change rien aux chocs"], "Comparez la part des chocs efficaces et les courbes des deux essais.", "Exact : la part des chocs efficaces augmente beaucoup.") },
      { consigne: "Au laboratoire, le tube d'iodure et d'eau oxygénée brunit plus vite à 70 °C, car…", court: "Répondez dans le carnet.", question: choix(["les chocs efficaces entre H₂O₂ et I⁻ sont plus nombreux par seconde", "le diiode est plus coloré à chaud", "l'eau s'évapore"], "Même interprétation que dans la simulation.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_chim1_s1_chocs_efficaces", titre: "Laboratoire : les chocs efficaces", paillasses: [L.poste_chocs], missions: [CHOCS, CONCENTRATION, TEMPERATURE] });
})(window.Labo);

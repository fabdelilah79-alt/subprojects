/*
Rôle : missions de la paillasse « barreau aimanté » : aiguille aimantée, sens du champ près des pôles, lignes de champ
       (limaille), valeur de B au teslamètre ; aimant brisé.
Reçoit : rien (les vérifications lisent le fait « aimant »).
Produit : Labo.MISSIONS_AIMANT = [CHAMP, BRISE].
Utilisé par : simulation.js.
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const vu = (f, k) => !!((f.aimant || {}).vu || {})[k], mes = (f, k) => ((f.aimant || {}).mesures || {})[k];

  const CHAMP = {
    id: "champ", paillasse: 0, titre: "Aiguille aimantée et lignes de champ",
    objectif: "Trouver la direction et le sens du champ magnétique avec une boussole ; observer les lignes de champ ; mesurer B.",
    entetes: [],
    conclusion: "Un aimant crée autour de lui un champ magnétique. En un point, le vecteur champ B a la direction de l'aiguille aimantée immobile, le sens qui va de son pôle sud à son pôle nord, et une valeur mesurée en teslas (T) au teslamètre. Les lignes de champ, dessinées par la limaille, sont tangentes au champ ; à l'extérieur de l'aimant, elles sortent du pôle nord et entrent par le pôle sud ; B est grand là où elles sont serrées.",
    conclusion_courte: "B : direction et sens de l'aiguille ; valeur en teslas.",
    etapes: [
      { consigne: "Sans aimant sur la feuille, déplacez la boussole et attendez que l'aiguille s'immobilise.", court: "Boussole seule.", aide_geste: "Faites glisser la boussole sur la feuille.", verifier: ({ faits }) => vu(faits, "nord_geo") },
      { consigne: "Loin de tout aimant, le pôle nord (rouge) de l'aiguille indique…", court: "Répondez dans le carnet.", question: choix(["le nord : l'aiguille s'oriente dans le champ magnétique terrestre", "toujours la direction de l'élève", "une direction au hasard"], "Regardez la rose des vents de la feuille.", "Exact.") },
      { consigne: "Posez l'aimant sur la feuille. Placez la boussole devant son pôle nord (N), dans son axe, puis devant son pôle sud (S).", court: "Boussole devant N, puis devant S.", aide_geste: "Faites glisser l'aimant de sa boîte jusqu'à la feuille.", verifier: ({ faits }) => vu(faits, "pres_nord") && vu(faits, "pres_sud") },
      { consigne: "Devant le pôle nord de l'aimant, le pôle nord de l'aiguille…", court: "Répondez dans le carnet.", question: choix(["s'éloigne de l'aimant ; devant le pôle sud, il s'en approche : le champ sort par le pôle nord et entre par le pôle sud", "s'approche du pôle nord de l'aimant", "ne bouge pas"], "Deux pôles de même nom se repoussent.", "Exact.") },
      { consigne: "Saupoudrez la limaille de fer sur la feuille (« Limaille »), puis tapotez la feuille.", court: "Limaille.", verifier: ({ faits }) => vu(faits, "lignes") },
      { consigne: "La limaille dessine les lignes de champ. En chaque point, le champ est…", court: "Répondez dans le carnet.", question: choix(["tangent à la ligne de champ ; à l'extérieur de l'aimant, les lignes vont du pôle nord au pôle sud", "perpendiculaire aux lignes de champ", "nul là où il y a de la limaille"], "Comparez l'aiguille de la boussole et les grains voisins.", "Exact.") },
      { consigne: "Avec le teslamètre (composante horizontale), mesurez B dans l'axe de l'aimant, à 2 cm puis à 4 cm de son pôle nord.", court: "B à 2 cm et à 4 cm.", aide_geste: "Faites glisser la sonde : la mesure se fait à sa pointe (le quadrillage est tous les 2 cm).", verifier: ({ faits }) => mes(faits, "d2") !== undefined && mes(faits, "d4") !== undefined },
      { consigne: "Valeur du champ à 2 cm du pôle nord ?", court: "B (mT) à 2 cm ?", question: { type: "nombre", unite: "mT", attendu: (f) => (mes(f, "d2") || 0) * 1000, tolerance_relative: 0.02, aide: "Lisez le teslamètre, sonde à 2 cm.", bravo: "Exact : environ 1,6 mT, soit 1,6×10⁻³ T." } },
      { consigne: "Quand on s'éloigne du pôle de l'aimant, B…", court: "Répondez dans le carnet.", question: choix(["diminue : les lignes de champ y sont moins serrées", "augmente", "ne change pas"], "Comparez vos deux mesures.", "Exact.") },
    ],
  };

  const BRISE = {
    id: "brise", paillasse: 0, titre: "L'aimant brisé",
    objectif: "Casser l'aimant en deux et observer les pôles des deux morceaux.",
    entetes: [],
    conclusion: "Chaque morceau d'un aimant brisé est un aimant complet, avec un pôle nord et un pôle sud : on ne peut pas isoler un pôle magnétique.",
    conclusion_courte: "Chaque morceau a deux pôles.",
    etapes: [
      { consigne: "Cassez l'aimant (« Casser »). Placez la boussole entre les deux morceaux, puis saupoudrez la limaille et tapotez.", court: "Boussole et limaille à la cassure.", verifier: ({ faits }) => vu(faits, "cassure") && vu(faits, "lignes_casse") },
      { consigne: "Chaque morceau de l'aimant…", court: "Répondez dans le carnet.", question: choix(["est un aimant complet, avec un pôle nord et un pôle sud : on ne peut pas isoler un pôle", "n'a qu'un seul pôle", "n'est plus aimanté"], "Regardez les lettres et la limaille près de la cassure.", "Exact.") },
    ],
  };

  L.MISSIONS_AIMANT = [CHAMP, BRISE];
})(window.Labo);

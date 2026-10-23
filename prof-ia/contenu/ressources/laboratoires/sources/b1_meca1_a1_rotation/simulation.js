/*
Rôle : simulation de l'activité 1 du chapitre « Rotation d'un solide autour d'un axe fixe » (1re année du bac) :
       maquette de grande roue (la roue tourne autour de son axe, les nacelles sont en translation circulaire),
       chronophotographie, puis classement de mouvements du vécu. Objectif O1.
Reçoit : rien (les vérifications lisent les faits « roue » et « tri_mouvements »).
Produit : la simulation démarrée : grande roue ; classement.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const photo = (faits) => faits.roue?.photo;

  const ROUE = {
    id: "roue", paillasse: 0, titre: "La roue et ses nacelles",
    objectif: "Comparer le mouvement de la roue et celui d'une nacelle de la grande roue.",
    entetes: [],
    conclusion: "Un solide est en rotation autour d'un axe fixe quand ses points (hors de l'axe) décrivent des cercles centrés sur cet axe, et qu'un segment du solide change de direction. Une nacelle est en translation circulaire : ses points décrivent des cercles de même rayon, mais chaque segment de la nacelle reste parallèle à lui-même.",
    conclusion_courte: "Rotation : un segment tourne ; translation : il reste parallèle.",
    etapes: [
      { consigne: "Faites tourner la roue : poussez-la en glissant le doigt dessus, ou tournez la manivelle.", court: "Faites tourner la roue.", verifier: ({ faits }) => (faits.roue?.tourne || 0) > 120 },
      { consigne: "Lancez la roue, puis touchez l'appareil photo : il superpose dix images prises toutes les 0,25 s.", court: "Chronophotographie.", aide_geste: "La roue doit tourner pendant la prise de vue (2,5 s).", verifier: ({ faits }) => (photo(faits)?.dphi || 0) >= 40 || (photo(faits) && "La roue a trop peu tourné : relancez-la et reprenez une photo.") || false },
      { consigne: "Sur la photo, le segment rouge [AB], peint sur un rayon de la roue…", court: "Répondez dans le carnet.", question: choix(["change de direction : il tourne avec la roue", "reste parallèle à lui-même", "reste immobile"], "Comparez la direction des segments rouges.", "Exact.") },
      { consigne: "Le segment bleu [CD], sur le plancher de la nacelle…", court: "Répondez dans le carnet.", question: choix(["reste parallèle à lui-même (horizontal)", "tourne comme la roue", "change de longueur"], "Comparez les segments bleus.", "Exact : la nacelle reste verticale.") },
      { consigne: "Les points A et B de la roue décrivent…", court: "Répondez dans le carnet.", question: choix(["des cercles centrés sur l'axe, de rayons différents", "des cercles de même rayon", "des droites"], "Regardez les points rouges numérotés.", "Exact : chaque point a son propre rayon.") },
      { consigne: "La roue est en rotation autour d'un axe fixe ; la nacelle est…", court: "Répondez dans le carnet.", question: choix(["en translation circulaire", "en rotation autour du même axe", "immobile"], "Un segment de la nacelle tourne-t-il ?", "Exact : ses points décrivent des cercles de même rayon, et ses segments restent parallèles.") },
    ],
  };

  const TRI = {
    id: "classer", paillasse: 1, titre: "Rotation ou translation ?",
    objectif: "Classer des mouvements du vécu : rotation autour d'un axe fixe, translation circulaire, translation rectiligne.",
    entetes: [],
    conclusion: "Pour reconnaître une rotation autour d'un axe fixe, on regarde un segment du solide : s'il tourne et que les points décrivent des cercles centrés sur un même axe immobile, c'est une rotation (porte, aiguille, barrière, la Lune qui nous montre toujours la même face). S'il reste parallèle à lui-même, c'est une translation (circulaire ou rectiligne).",
    conclusion_courte: "Un segment qui tourne : rotation.",
    etapes: [
      { consigne: "Rangez chaque étiquette dans la bonne colonne.", court: "Classez les mouvements.", verifier: ({ faits }) => L.tableau_tri.verifier(L.MOUVEMENTS_VECU, faits.tri_mouvements) },
      { consigne: "Lors de la rotation d'un solide autour d'un axe fixe, les points situés sur l'axe…", court: "Répondez dans le carnet.", question: choix(["sont immobiles", "décrivent les plus grands cercles", "vont en ligne droite"], "Un cercle de rayon nul…", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_meca1_a1_rotation", titre: "Laboratoire : rotation et translation", paillasses: [L.poste_roue, L.poste_tri_rotation], missions: [ROUE, TRI] });
})(window.Labo);

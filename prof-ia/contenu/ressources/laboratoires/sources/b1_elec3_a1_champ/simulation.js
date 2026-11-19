/*
Rôle : simulation de l'activité 1 du chapitre « Magnétisme » (1re année du bac) : aiguille aimantée, lignes de champ,
       aimant brisé, superposition de deux champs, champ magnétique terrestre et expérience d'Œrsted. Objectifs O1, O2.
Reçoit : rien (les missions sont dans missions_aimant.js et missions_terre.js).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  L.demarrer({ id: "b1_elec3_a1_champ", titre: "Laboratoire : champ magnétique", decor: "aucun", paillasses: [L.poste_aimant, L.poste_superposition, L.poste_terre], missions: [...L.MISSIONS_AIMANT, ...L.MISSIONS_TERRE] });
})(window.Labo);

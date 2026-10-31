/*
Rôle : simulation de l'activité 3 du chapitre « Magnétisme » (1re année du bac) : force de Laplace (rails de Laplace,
       balance de Laplace : F = I·l·B·sin α), deux courants parallèles, faisceau d'électrons, haut-parleur, moteur,
       observation de l'induction. Objectifs O4, O5, O6 (SM).
Reçoit : rien (les missions sont dans missions_laplace.js et missions_applications.js).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  L.demarrer({ id: "b1_elec3_a3_laplace", titre: "Laboratoire : force de Laplace", decor: "aucun", paillasses: [L.poste_rails, L.poste_balance, L.poste_courants, L.poste_hp_moteur, L.poste_induction], missions: [...L.MISSIONS_LAPLACE, ...L.MISSIONS_APPLICATIONS] });
})(window.Labo);

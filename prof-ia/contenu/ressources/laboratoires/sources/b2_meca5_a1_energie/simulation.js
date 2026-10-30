/*
Rôle : simulation de l'activité du chapitre « Aspects énergétiques des oscillateurs mécaniques » (2e année du bac) : établir
       Epe à partir du travail (paillasse 1), exploiter des enregistrements et des diagrammes d'énergie du solide-ressort
       (paillasse 2) et du pendule de torsion (paillasse 3). Objectifs O1 à O4.
Reçoit : rien (les missions des paillasses 1 et 2 sont dans missions_energie.js ; ici, celle du pendule de torsion).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const { choix, relatif } = L.questions_energie, LA = (f) => (f.lachers_energie || []).slice(-1)[0];

  const TORSION = {
    id: "torsion", paillasse: 2, titre: "Énergie mécanique du pendule de torsion",
    objectif: "Enregistrer θ(t) avec le capteur de rotation, afficher Ec, Ept et Em.",
    entetes: [], donnees: ["Ec = ½·J·θ̇² ; Ept = ½·C·θ² (θ en rad)", "C = 4,0 × 10⁻³ N·m/rad ; J = 2,18 × 10⁻³ kg·m²", "θ (rad) = θ (°) × π / 180"],
    conclusion: "Le fil tordu d'un angle θ possède l'énergie potentielle de torsion Ept = ½·C·θ² (référence : fil non tordu). L'énergie mécanique du pendule de torsion est Em = ½·J·θ̇² + ½·C·θ² ; sans frottement, elle se conserve : Ec et Ept s'échangent et Em = ½·C·θm².",
    conclusion_courte: "Ept = ½·C·θ² ; Em = ½·J·θ̇² + ½·C·θ² = ½·C·θm².",
    etapes: [
      { consigne: "« Acquérir » (10 s), tournez la barre d'environ 30° par son aiguille et lâchez-la.", court: "Enregistrez θ(t).", aide_geste: "Faites glisser l'aiguille rouge le long du cadran, puis lâchez.", verifier: ({ faits }) => (LA(faits) && Math.abs(LA(faits).theta0) >= 15 && faits.acquisition?.etat === "terminée") || false },
      { consigne: "Touchez « Énergies ».", court: "Vue « Énergies ».", verifier: ({ faits }) => faits.acquisition?.vue === "energies" || false },
      { consigne: "L'énergie potentielle de torsion du fil tordu de θ s'écrit…", court: "Répondez dans le carnet.", question: choix(["Ept = ½·C·θ² (θ en radians)", "Ept = C·θ", "Ept = ½·J·θ²"], "Analogie avec Epe = ½·K·x².", "Exact.") },
      { consigne: "Énergie mécanique Em (mJ), lue au curseur ?", court: "Em (mJ) ?", question: relatif("mJ", (f) => (LA(f)?.Em0 || 0) * 1000, 0.08, "Courbe verte ; vérifiez avec ½·C·θm².", "Exact.") },
      { consigne: "Au cours des oscillations, Ec et Ept…", court: "Répondez dans le carnet.", question: choix(["s'échangent : Em = ½·J·θ̇² + ½·C·θ² reste constante", "augmentent ensemble", "restent constantes chacune"], "Comparez les trois courbes.", "Exact.") },
      { consigne: "L'énergie cinétique est maximale quand…", court: "Répondez dans le carnet.", question: choix(["la barre passe par θ = 0", "la barre est à l'élongation maximale", "jamais"], "Où θ̇ est-elle la plus grande ?", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_meca5_a1_energie", titre: "Laboratoire : énergie des oscillateurs mécaniques", paillasses: [L.poste_travail, L.poste_energie_ressort, L.poste_energie_torsion], missions: [...L.MISSIONS_ENERGIE, TORSION] });
})(window.Labo);

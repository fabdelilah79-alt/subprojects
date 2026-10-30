/*
Rôle : simulation de la partie « Énergie mécanique du pendule pesant » du chapitre « Aspects énergétiques des oscillateurs
       mécaniques » (2e année du bac, filières PC, SMA, SMB) : expressions de Ec = ½·JΔ·θ̇² et de Epp = M·g·a·(1 − cos θ)
       (rappelées comme acquises), Em au lâcher ; conservation de Em et échanges entre Ec et Epp lus sur le diagramme des
       énergies ; vitesse maximale ; diminution de Em avec la palette (travail des frottements, transfert thermique). Objectif O5.
Reçoit : rien (les vérifications lisent les faits du poste et la feuille).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const V = L.verif_energie_pendule, choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const relatif = (unite, attendu, tol, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance_relative: tol, aide, bravo });
  const a30 = (palette) => (x) => x.d === 0.4 && !!x.palette === palette && Math.abs(Math.abs(x.theta0) - 30) <= 2;

  const EXPRESSIONS = {
    id: "expressions", paillasse: 0, titre: "Énergies du pendule pesant",
    conclusion: "Le pendule pesant tourne autour d'un axe fixe : Ec = ½·JΔ·θ̇². En prenant Epp = 0 à la position d'équilibre, Epp = M·g·zG = M·g·a·(1 − cos θ), où a est la distance de G à l'axe (M·a = m1·a1 + m2·d). Lâché sans vitesse depuis θ0, le pendule a l'énergie mécanique Em = M·g·a·(1 − cos θ0) ; pour les petits angles, Epp ≈ ½·M·g·a·θ².",
    objectif: "Exprimer Ec, Epp et Em du pendule pesant, puis les observer sur le diagramme des énergies.",
    entetes: [], donnees: ["Rotation autour d'un axe fixe : Ec = ½·JΔ·θ̇²", "Epp = M·g·zG + cte (axe Oz vers le haut)", "G est à la distance a de l'axe : zG = −a·cos θ"],
    conclusion_courte: "Ec = ½·JΔ·θ̇² ; Epp = M·g·a·(1 − cos θ).",
    etapes: [
      { consigne: "Énergie cinétique du pendule, qui tourne autour de l'axe Δ :", court: "Répondez dans le carnet.", question: choix(["Ec = ½·JΔ·θ̇²", "Ec = ½·M·θ̇²", "Ec = JΔ·θ̇"], "Rotation autour d'un axe fixe.", "Exact.") },
      { consigne: "Avec Epp = 0 à la position d'équilibre (θ = 0), l'énergie potentielle de pesanteur est…", court: "Répondez dans le carnet.", question: choix(["Epp = M·g·a·(1 − cos θ)", "Epp = M·g·a·cos θ", "Epp = M·g·a·sin θ"], "zG − zG(équilibre) = a·(1 − cos θ).", "Exact.") },
      { consigne: "Pour les petites oscillations (cos θ ≈ 1 − θ²/2, θ en rad), Epp ≈ …", court: "Répondez dans le carnet.", question: choix(["½·M·g·a·θ²", "M·g·a·θ", "0"], "Remplacez cos θ.", "Exact : la même forme que ½·C·θ² pour le pendule de torsion.") },
      { consigne: "Masse à 40 cm, sans palette : durée 5 s, « Acquérir », lâchez la tige à 30°, puis touchez « Énergies ».", court: "Lâcher à 30° ; vue « Énergies ».", verifier: V.vue_energies(a30(false), 5) },
      { consigne: "Énergie mécanique au lâcher Em = M·g·a·(1 − cos θ0), en mJ (M·a = m1·a1 + m2·d) ?", court: "Em au lâcher (mJ) ?", question: relatif("mJ", V.em0, 0.03, "M·a = 0,100 × 0,24 + 0,200 × 0,40 ; g = 9,81 m/s².", "Exact : environ 137 mJ, la valeur lue sur la courbe verte.") },
      { consigne: "Sur le diagramme, Em (courbe verte)…", court: "Répondez dans le carnet.", question: choix(["reste constante : Ec et Epp s'échangent", "diminue de moitié à chaque oscillation", "est maximale au passage par l'équilibre"], "Regardez la courbe verte.", "Exact.") },
    ],
  };

  const ECHANGES = {
    id: "echanges", paillasse: 0, titre: "Conservation de l'énergie mécanique",
    conclusion: "Quand les frottements sont négligeables, Em = Ec + Epp reste constante : Ec est maximale et Epp nulle au passage par la position d'équilibre ; Ec est nulle et Epp maximale aux positions extrêmes. La conservation donne la vitesse angulaire maximale θ̇max = √(2·Em/JΔ) et montre que le pendule remonte à la même hauteur de l'autre côté.",
    objectif: "Lire Ec, Epp et Em à plusieurs instants et exploiter la conservation de Em.",
    entetes: ["t (s)", "Ec (mJ)", "Epp (mJ)", "Em (mJ)"], donnees: ["Vue « Énergies » : le curseur donne Ec, Epp et Em", "J = J1 + m2·d² = 3,98 × 10⁻² kg·m² (d = 40 cm)", "v = d·θ̇ pour la masse coulissante"],
    conclusion_courte: "Sans frottement notable : Em constante.",
    etapes: [
      { consigne: "Tableur : placez le curseur à cinq instants (au passage par l'équilibre, aux positions extrêmes, entre les deux) ; t en A, Ec en B, Epp en C, Em en D.", court: "Tableur : t, Ec, Epp, Em.", aide_geste: "Faites glisser le curseur vert sur le graphique.", verifier: V.echanges },
      { consigne: "Quand Ec est maximale, Epp est…", court: "Répondez dans le carnet.", question: choix(["nulle : le pendule passe par sa position d'équilibre", "maximale aussi", "égale à Ec"], "Comparez les lignes du tableur.", "Exact.") },
      { consigne: "Vitesse angulaire au passage par l'équilibre : θ̇max = √(2·Em / JΔ), en rad/s ?", court: "θ̇max (rad/s) ?", question: relatif("rad/s", V.omega_max, 0.03, "Em en joules ; JΔ = 3,98 × 10⁻² kg·m².", "Exact : environ 2,6 rad/s.") },
      { consigne: "Vitesse de la masse coulissante à cet instant (m/s) ?", court: "v (m/s) ?", question: relatif("m/s", (f) => 0.4 * V.omega_max(f), 0.03, "v = d·θ̇max, d = 0,40 m.", "Exact : environ 1,05 m/s.") },
      { consigne: "Lâché à 30°, le pendule remonte de l'autre côté jusqu'à…", court: "Répondez dans le carnet.", question: choix(["30° environ : Em se conserve, Epp reprend sa valeur du départ", "0°", "60°"], "Ec = 0 aux positions extrêmes.", "Exact.") },
    ],
  };

  const FROTTEMENTS = {
    id: "frottements", paillasse: 0, titre: "Non-conservation de l'énergie mécanique",
    conclusion: "Avec la palette, les frottements de l'air ne sont plus négligeables : leur travail est négatif et Em diminue (il en reste environ 37 % après 4 s). Em diminue surtout au passage par l'équilibre, là où la vitesse est grande. L'énergie perdue par le pendule est transférée à l'air sous forme d'énergie thermique.",
    objectif: "Observer la diminution de Em quand les frottements ne sont plus négligeables.",
    entetes: [], donnees: ["Palette d'amortissement au bas de la tige", "Em au lâcher : la même qu'à la mission 1 (30°)", "ΔEm = travail des frottements"],
    conclusion_courte: "Frottements : Em diminue (transfert thermique).",
    etapes: [
      { consigne: "Montez la palette (touchez-la sur la paillasse), durée 10 s, « Acquérir », lâchez la tige à 30°, puis vue « Énergies ».", court: "Palette, 10 s, lâcher à 30°.", verifier: V.vue_energies(a30(true), 10) },
      { consigne: "Avec la palette, Em…", court: "Répondez dans le carnet.", question: choix(["diminue : le travail des frottements de l'air est négatif", "reste constante", "augmente"], "Regardez la courbe verte.", "Exact.") },
      { consigne: "Placez le curseur vers t = 4 s : quel pourcentage de Em au lâcher reste-t-il ?", court: "Em restante (%) ?", question: { type: "nombre", unite: "%", attendu: 37, tolerance: 6, aide: "Pourcentage = 100 × Em(4 s) / Em(0).", bravo: "Exact : environ 37 %." } },
      { consigne: "Au cours d'une oscillation, Em diminue surtout…", court: "Répondez dans le carnet.", question: choix(["au passage par l'équilibre, là où la vitesse est grande", "aux positions extrêmes, où la vitesse est nulle", "toujours au même rythme"], "Regardez les « marches » de la courbe verte.", "Exact : le frottement de l'air croît avec la vitesse.") },
      { consigne: "L'énergie perdue par le pendule…", court: "Répondez dans le carnet.", question: choix(["est transférée à l'air sous forme d'énergie thermique", "disparaît", "est stockée dans la masse coulissante"], "L'énergie se conserve toujours au total.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_meca5_s1_pendule_pesant", titre: "Laboratoire : énergie mécanique du pendule pesant", paillasses: [L.poste_pendule_pesant_energies], missions: [EXPRESSIONS, ECHANGES, FROTTEMENTS] });
})(window.Labo);

/*
Rôle : paillasse « astres et atomes » : quatre documents affichés au mur (interaction gravitationnelle, loi de Coulomb, données,
       ce que montrent les expériences sur l'atome d'hydrogène, avec le diagramme des niveaux d'énergie) et, sur la paillasse,
       le portable où tourne le simulateur d'orbites (mécanique de Newton).
Reçoit : le groupe SVG de la paillasse.
Produit : Labo.poste_astres(g) -> { pense_bete } ; faits « documents_astres » (documents lus), « lancers », « simulateur ».
Utilisé par : simulation.js.
*/
(function (L) {
  function niveaux(g, x, y, k) {
    // Diagramme des niveaux d'énergie de l'atome d'hydrogène, à l'échelle : En = −13,6 / n² eV.
    L.niveaux_energie(g, x, y, k, { titre: "Niveaux d'énergie de H", niveaux: [["n = 1", -13.6], ["n = 2", -3.4], ["n = 3", -1.51], ["n = 4", -0.85], ["n = ∞", 0]] });
  }

  const DOCUMENTS = [
    { x: 22, y: 160, l: 172, h: 112, titre: "Interaction gravitationnelle", texte: "Deux corps A et B de masses mA et mB, à la distance d l'un de l'autre, s'attirent : F = G·mA·mB / d², avec G = 6,67 × 10⁻¹¹ N·m²·kg⁻². Cette interaction est toujours attractive ; elle gouverne le mouvement des planètes autour du Soleil et des satellites autour de la Terre." },
    { x: 202, y: 160, l: 172, h: 112, titre: "Interaction électrostatique", texte: "Loi de Coulomb : deux charges ponctuelles qA et qB, à la distance d, exercent l'une sur l'autre des forces opposées de valeur F = k·|qA|·|qB| / d², avec k = 9,0 × 10⁹ N·m²·C⁻². Attraction si les charges sont de signes contraires, répulsion sinon." },
    { x: 22, y: 280, l: 172, h: 112, titre: "Données", texte: "Proton : mp = 1,67 × 10⁻²⁷ kg ; charge +e. Électron : me = 9,11 × 10⁻³¹ kg ; charge −e. Charge élémentaire : e = 1,60 × 10⁻¹⁹ C. Atome d'hydrogène : distance électron-noyau d ≈ 53 pm = 5,3 × 10⁻¹¹ m. Terre : M = 5,97 × 10²⁴ kg ; R = 6 371 km. 1 eV = 1,60 × 10⁻¹⁹ J." },
    { x: 202, y: 280, l: 172, h: 112, titre: "Ce que montrent les expériences", dessin: niveaux, texte: "Tous les atomes d'hydrogène sont identiques : même taille, même spectre de raies. Leur énergie ne prend que certaines valeurs : En = −13,6 / n² eV (n = 1, 2, 3…). Un atome isolé est stable : son électron ne tombe pas sur le noyau." },
  ];

  L.poste_astres = function (g) {
    // Portable et simulateur, puis documents au mur (un document ouvert passe devant le portable).
    const pense_bete = L.decor.pense_bete(g, 24, 52, 230);
    const dalle = L.portable(g, { x: 384, y: 34, l: 620, h: 372, titre: "Simulateur d'orbites — mécanique de Newton" });
    L.logiciel_orbites(g, dalle);
    L.documents_mur(g, DOCUMENTS, "documents_astres");
    L.missions.noter("documents_astres", []);
    return { pense_bete };
  };
})(window.Labo);

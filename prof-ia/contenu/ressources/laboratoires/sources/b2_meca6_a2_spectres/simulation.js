/*
Rôle : simulation de l'activité 2 du chapitre « L'atome et la mécanique de Newton » (2e année du bac) : documents sur la
       quantification et étude de spectres. Électrons de même énergie cinétique et atomes de mercure (expérience de Franck et
       Hertz, paillasse 1) ; spectres de raies des tubes spectraux, énergie des photons E = h·ν, niveaux de l'hydrogène
       (paillasse 2) ; raie du sodium en émission et en absorption : un faisceau de lumière n'est absorbé que pour E = h·ν égale
       à un écart entre niveaux (paillasse 3). Objectifs O2, O3, O4.
Reçoit : rien (les missions des paillasses 1 et 2 sont dans missions_spectres.js ; ici, celle du sodium).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const { choix, nombre } = L.questions_spectres, NA = (f) => f.sodium || {}, VUS = (f) => f.vus_sodium || [];

  const SODIUM = {
    id: "sodium", paillasse: 2, titre: "Émission et absorption du sodium",
    conclusion: "La flamme colorée par le sodium émet une raie jaune de longueur d'onde 589 nm : ses photons ont l'énergie E = h·c/λ = 2,11 eV. Éclairée en lumière blanche, la vapeur de sodium absorbe exactement cette radiation : une raie noire apparaît à 589 nm dans le spectre continu. Un atome n'absorbe que les photons dont l'énergie h·ν est égale à l'écart entre deux de ses niveaux : spectre d'émission et spectre d'absorption d'un élément ont leurs raies aux mêmes longueurs d'onde.",
    objectif: "Observer la raie du sodium en émission puis en absorption ; calculer l'énergie de ses photons.",
    entetes: [], donnees: ["h = 6,63 × 10⁻³⁴ J·s ; c = 3,00 × 10⁸ m/s", "1 eV = 1,60 × 10⁻¹⁹ J", "Photon : E = h·ν = h·c / λ"],
    conclusion_courte: "Le sodium absorbe la radiation qu'il émet : 589 nm, 2,11 eV.",
    etapes: [
      { consigne: "Allumez le bec Bunsen (robinet de gaz, puis allume-gaz). Fixez l'anse trempée dans l'eau salée dans la pince : sa boucle entre dans la flamme.", court: "Anse salée dans la flamme.", aide_geste: "Touchez le robinet jaune, puis l'allume-gaz rouge ; touchez l'anse dans le bécher.", verifier: ({ faits }) => NA(faits).sel || false },
      { consigne: "Lampe éteinte, regardez la flamme dans le spectroscope.", court: "Spectre de la flamme.", verifier: ({ faits }) => VUS(faits).includes("emission") || false },
      { consigne: "Longueur d'onde de la raie jaune du sodium (nm) ?", court: "λ (nm) ?", question: nombre("nm", 589, 3, "Lisez la raie sur l'échelle graduée.", "Exact : 589 nm (en fait deux raies très proches, 589,0 et 589,6 nm).") },
      { consigne: "Énergie (eV) d'un photon de cette radiation ?", court: "E (eV) ?", question: nombre("eV", (6.63e-34 * 3e8) / 589e-9 / 1.6e-19, 0.04, "E = h·c/λ, puis divisez par 1,60 × 10⁻¹⁹.", "Exact : 2,11 eV.") },
      { consigne: "Remettez l'anse dans le bécher, allumez la lampe et regardez le spectre de sa lumière.", court: "Spectre de la lampe.", verifier: ({ faits }) => VUS(faits).includes("continu") || false },
      { consigne: "Lampe allumée, remettez l'anse salée dans la flamme et regardez de nouveau.", court: "Lampe + flamme salée.", verifier: ({ faits }) => VUS(faits).includes("absorption") || false },
      { consigne: "Une raie noire apparaît…", court: "Répondez dans le carnet.", question: choix(["à 589 nm, à la place de la raie jaune émise par le sodium", "à une autre longueur d'onde", "dans le violet"], "Comparez avec le spectre de la flamme seule.", "Exact.") },
      { consigne: "La vapeur de sodium éclairée en lumière blanche…", court: "Répondez dans le carnet.", question: choix(["n'absorbe que les photons d'énergie 2,11 eV, égale à l'écart entre deux de ses niveaux", "absorbe tous les photons", "absorbe les photons les plus énergétiques"], "Un faisceau monochromatique de 589 nm serait absorbé ; un autre non.", "Exact : les échanges d'énergie avec la lumière sont quantifiés.") },
      { consigne: "Le spectre d'émission et le spectre d'absorption d'un même élément…", court: "Répondez dans le carnet.", question: choix(["ont leurs raies aux mêmes longueurs d'onde", "n'ont rien en commun", "sont des spectres continus"], "Comparez les deux observations.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b2_meca6_a2_spectres", titre: "Laboratoire : quantification de l'énergie", paillasses: [L.poste_franck_hertz, L.poste_tubes, L.poste_sodium], missions: [...L.MISSIONS_SPECTRES, SODIUM] });
})(window.Labo);

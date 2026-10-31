/*
Rôle : simulation de l'activité 1 du chapitre « Courant électrique continu » (tronc commun) : « Expériences simples et
       documents » sur l'électrisation par frottement. Objectifs O1 (électrisation par frottement, deux types d'électricité,
       interactions) et O2 (charge élémentaire e, interprétation par la structure de la matière) ; hors programme :
       électrisation par contact et par influence.
Reçoit : rien (les vérifications lisent les charges, les papiers attirés, les interactions et la loupe).
Produit : la simulation démarrée : paillasse des petits papiers, paillasse de l'étrier et de la loupe.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const attire = (id) => ({ faits }) => !!(faits.papiers_attires || {})[id] || false;
  const interaction = (cle) => ({ faits }) => !!(faits.interactions || {})[cle] || false;

  const FROTTER = {
    id: "frotter", paillasse: 0, titre: "Électriser par frottement",
    objectif: "Une baguette frottée attire-t-elle de petits morceaux de papier ?",
    entetes: [],
    conclusion: "Frottés, le PVC (avec la laine) et le verre (avec la soie) s'électrisent : ils attirent les corps légers.",
    conclusion_courte: "Le frottement électrise.",
    etapes: [
      { consigne: "Approchez la baguette de PVC, sans la frotter, des petits papiers de la coupelle.", court: "PVC non frotté près des papiers.", verifier: ({ faits }) => faits.papiers_neutre === "pvc" || false },
      { consigne: "Frottez la baguette de PVC sur le chiffon de laine (faites-la glisser plusieurs fois d'un bord à l'autre), puis approchez-la des papiers.", court: "Frottez le PVC, approchez-le.", verifier: attire("pvc"), aide_geste: "Plus on frotte, plus la baguette se charge." },
      { consigne: "Par frottement, la baguette de PVC…", court: "Répondez dans le carnet.", question: choix(["s'est électrisée : elle attire les corps légers", "est devenue un aimant", "s'est réchauffée, c'est tout"], "Comparez avec la baguette non frottée.", "Exact.") },
      { consigne: "Frottez la baguette de verre avec la soie, puis approchez-la des papiers.", court: "Frottez le verre, approchez-le.", verifier: attire("verre") },
      { consigne: "Les papiers collés à la baguette retombent au bout d'un moment. Avant cela, verre et PVC frottés…", court: "Répondez dans le carnet.", question: choix(["attirent tous les deux les corps légers", "les repoussent tous les deux", "ne font rien"], "Observez les deux essais.", "Exact.") },
    ],
  };

  const INTERACTIONS = {
    id: "interactions", paillasse: 1, titre: "Deux types d'électricité",
    objectif: "Une baguette de PVC frottée est suspendue. Que se passe-t-il quand on approche une autre baguette frottée ?",
    entetes: [],
    conclusion: "Il existe deux types d'électricité : positive (verre frotté avec la soie) et négative (PVC frotté avec la laine). Deux corps de même électricité se repoussent, de types différents s'attirent.",
    conclusion_courte: "Mêmes signes : répulsion ; signes contraires : attraction.",
    etapes: [
      { consigne: "Frottez une baguette de PVC avec la laine et posez-la sur l'étrier, sous la potence.", court: "PVC frotté sur l'étrier.", verifier: ({ faits }) => (faits.suspendue && faits.suspendue.matiere === "pvc" && faits.suspendue.q < -0.5) || false, aide_geste: "Lâchez la baguette juste sur l'étrier." },
      { consigne: "Frottez la seconde baguette de PVC avec la laine et approchez-la d'une extrémité de la baguette suspendue, à la même hauteur.", court: "Approchez un PVC frotté.", verifier: interaction("pvc_pvc") },
      { consigne: "Frottez la baguette de verre avec la soie et approchez-la de la baguette suspendue.", court: "Approchez le verre frotté.", verifier: interaction("pvc_verre") },
      { consigne: "Deux corps portant la même électricité…", court: "Répondez dans le carnet.", question: choix(["se repoussent ; deux électricités différentes s'attirent", "s'attirent toujours", "n'agissent pas l'un sur l'autre"], "Qu'a fait la baguette suspendue dans chaque cas ?", "Exact.") },
      { consigne: "Par convention, le verre frotté avec la soie porte une électricité positive. Le PVC frotté avec la laine porte donc…", court: "Répondez dans le carnet.", question: choix(["une électricité négative", "une électricité positive", "aucune électricité"], "Le PVC et le verre s'attirent.", "Exact : c'est une convention.") },
    ],
  };

  const MODELE = {
    id: "modele", paillasse: 1, titre: "Interpréter l'électrisation",
    objectif: "La matière contient des charges positives (noyaux) et négatives (électrons). Que se passe-t-il pendant le frottement ?",
    entetes: [],
    conclusion: "Le frottement fait passer des électrons d'un corps à l'autre. La charge d'un corps est un multiple de la charge élémentaire : Q = n·e, avec e = 1,6 × 10⁻¹⁹ C.",
    conclusion_courte: "Q = n·e.",
    etapes: [
      { consigne: "Promenez la loupe sur la baguette de PVC frottée, puis sur le chiffon de laine.", court: "La loupe sur le PVC, puis sur la laine.", verifier: ({ faits }) => { const v = faits.loupe || {}; return (["pvc1", "pvc2"].some((k) => v[k] === -1) && v.laine === 1) || false; }, aide_geste: "Faites glisser la loupe, accrochée au mur, à droite." },
      { consigne: "Pendant le frottement…", court: "Répondez dans le carnet.", question: choix(["des électrons passent de la laine au PVC : le PVC a des électrons en excès (charge négative), la laine en manque (charge positive)", "des noyaux positifs passent du PVC à la laine", "le PVC fabrique des électrons"], "Comparez le nombre de signes − et + dans la loupe.", "Exact : seuls les électrons se déplacent.") },
      { consigne: "Le verre frotté avec la soie est chargé positivement. Il a…", court: "Répondez dans le carnet.", question: choix(["perdu des électrons, passés sur la soie", "gagné des électrons", "gagné des noyaux"], "Positif : moins d'électrons que de charges +.", "Exact.") },
      { consigne: "Une baguette porte la charge Q = −3,2 × 10⁻⁹ C. Combien d'électrons a-t-elle en excès ? (e = 1,6 × 10⁻¹⁹ C)", court: "Nombre d'électrons ?", question: { type: "nombre", unite: "", attendu: 2e10, tolerance_relative: 0.02, aide: "n = |Q| / e ; écrivez par exemple 2E10.", bravo: "Exact : 2 × 10¹⁰ électrons." } },
      { consigne: "La charge électrique d'un corps est toujours…", court: "Répondez dans le carnet.", question: choix(["un multiple entier de la charge élémentaire : Q = n·e", "un nombre quelconque", "égale à e"], "Les électrons ne se coupent pas en morceaux.", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_elec1_a1_electrisation", titre: "Laboratoire : l'électrisation par frottement", paillasses: [L.poste_papier, L.poste_etrier], missions: [FROTTER, INTERACTIONS, MODELE] });
})(window.Labo);

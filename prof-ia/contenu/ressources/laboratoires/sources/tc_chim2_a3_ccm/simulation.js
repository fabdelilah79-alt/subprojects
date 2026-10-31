/*
Rôle : simulation de l'activité 3 du chapitre « Extraction, séparation et identification » (tronc commun) :
       chromatographie sur couche mince des colorants d'un sirop de menthe (comparaison avec des références, Rf), puis
       d'un médicament dont les espèces sont incolores (révélation sous UV et au diiode). Objectif O4.
Reçoit : rien (les vérifications lisent les faits des paillasses et la feuille du tableur).
Produit : la simulation démarrée : colorants ; espèces incolores.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const { choix, preparation, feuille_rf } = L.MISSIONS_CCM;
  const COLORANTS = { E102: { rgb: [238, 196, 24], Rf: 0.72 }, E124: { rgb: [212, 36, 48], Rf: 0.55 }, E131: { rgb: [36, 84, 206], Rf: 0.38 } };
  const INCOLORES = { paracetamol: { rgb: null, Rf: 0.45 }, cafeine: { rgb: null, Rf: 0.25 } };
  const ech = (n, x, texte, rgb, especes) => ({ n, x, texte, rgb, especes });

  const MISSION_COLORANTS = {
    id: "colorants", paillasse: 0, titre: "Les colorants d'un sirop de menthe",
    objectif: "Le sirop de menthe (4) est vert. Quels colorants contient-il ? On le compare à trois colorants de référence (1, 2, 3).",
    entetes: ["dépôt n°", "d (mm)", "D (mm)", "Rf"],
    conclusion: "La chromatographie sépare les espèces d'un mélange : chacune monte plus ou moins vite avec l'éluant. Dans les mêmes conditions, une espèce donne toujours le même rapport frontal Rf = d / D. Le sirop de menthe donne deux taches, à la hauteur de E102 (jaune) et de E131 (bleu) : il contient ces deux colorants, et pas E124.",
    conclusion_courte: "Même Rf, mêmes conditions : même espèce.",
    etapes: [
      { consigne: "Pourquoi trace-t-on la ligne de dépôt au crayon à papier, et non au stylo ?", court: "Répondez dans le carnet.", question: choix(["l'encre du stylo serait entraînée par l'éluant et donnerait des taches", "le crayon s'efface plus facilement", "pour que la ligne soit plus fine"], "Que contient l'encre d'un stylo ?", "Exact.") },
      ...preparation("ccm_colorants", 4, "eau salée"),
      { consigne: "Le sirop de menthe (4) contient…", court: "Répondez dans le carnet.", question: choix(["E102 (jaune) et E131 (bleu) : ses taches sont à la même hauteur que celles de ces références", "E124 (rouge)", "un seul colorant, vert"], "Comparez la hauteur des taches du dépôt 4 à celles des références.", "Exact.") },
      { consigne: "Avec la règle (son zéro est sur la ligne de dépôt), mesurez la distance d parcourue par chaque référence (dépôts 1, 2, 3) et celle D du front. Tableur : n° en A, d en B, D en C, Rf = d / D en D.", court: "Tableur : d, D et Rf des références.", verifier: feuille_rf("ccm_colorants", [1, 2, 3]), aide_geste: "Zoomez sur la plaque pour lire la règle au millimètre." },
      { consigne: "Deux taches à la même hauteur (même Rf), sur la même plaque…", court: "Répondez dans le carnet.", question: choix(["correspondent à la même espèce chimique", "ont la même couleur par hasard", "n'ont rien en commun"], "Pourquoi utilise-t-on des références ?", "Exact : on identifie une espèce par comparaison avec une référence.") },
    ],
  };

  const MISSION_INCOLORES = {
    id: "incolores", paillasse: 1, titre: "Des espèces incolores",
    objectif: "Un médicament (3) contient-il du paracétamol (1) et de la caféine (2) ? Ces espèces sont incolores.",
    entetes: [],
    conclusion: "Les taches des espèces incolores ne se voient pas : on les révèle. Sous la lumière UV, la plaque (qui contient un indicateur fluorescent) brille, et les taches apparaissent sombres : on les entoure au crayon. Le diiode, lui, colore les taches en brun. Le médicament donne deux taches, à la hauteur du paracétamol et de la caféine : il contient ces deux espèces.",
    conclusion_courte: "Espèces incolores : révélation (UV, diiode).",
    etapes: [
      ...preparation("ccm_incolores", 3, "mélange de solvants préparé par le professeur"),
      { consigne: "Après séchage, on ne voit aucune tache. Pourquoi ?", court: "Répondez dans le carnet.", question: choix(["les espèces sont incolores : il faut les révéler", "les dépôts ont disparu", "l'éluant les a effacés"], "De quelle couleur sont le paracétamol et la caféine ?", "Exact.") },
      { consigne: "Allumez la lampe UV au-dessus de la plaque (touchez son bouton), puis entourez au crayon chaque tache sombre.", court: "Révélation UV, taches entourées.", verifier: ({ faits }) => { const f = faits.ccm_incolores || {}; return (f.uv_vu && f.cercles >= 4) || false; }, aide_geste: "Lâchez la mine du crayon sur chaque tache sombre." },
      { consigne: "Le médicament (3) contient…", court: "Répondez dans le carnet.", question: choix(["du paracétamol et de la caféine", "seulement du paracétamol", "aucune de ces deux espèces"], "Comparez les taches du dépôt 3 à celles des références.", "Exact.") },
      { consigne: "Éteignez la lampe. Autre révélateur : posez la plaque quelques minutes dans le bocal de diiode, puis remettez-la sur son support.", court: "Révélation au diiode.", verifier: ({ faits }) => { const f = faits.ccm_incolores || {}; return (f.iode >= 0.9 && f.lieu === "support") || false; } },
      { consigne: "La lumière UV et le diiode servent à…", court: "Répondez dans le carnet.", question: choix(["rendre visibles les taches des espèces incolores", "faire monter l'éluant", "sécher la plaque"], "Que voyait-on avant la révélation ?", "Exact.") },
    ],
  };

  const P1 = L.poste_ccm({ fait: "ccm_colorants", eluant: "eau salée", especes: COLORANTS, echantillons: [ech(1, 400, "E102", [238, 196, 24], ["E102"]), ech(2, 435, "E124", [212, 36, 48], ["E124"]), ech(3, 470, "E131", [36, 84, 206], ["E131"]), ech(4, 505, "sirop", [70, 150, 60], ["E102", "E131"])] });
  const P2 = L.poste_ccm({ fait: "ccm_incolores", eluant: "éluant", revelation: true, especes: INCOLORES, echantillons: [ech(1, 390, "parac.", null, ["paracetamol"]), ech(2, 425, "caféine", null, ["cafeine"]), ech(3, 460, "médic.", null, ["paracetamol", "cafeine"])] });
  L.demarrer({ id: "tc_chim2_a3_ccm", titre: "Laboratoire : chromatographie sur couche mince", paillasses: [P1, P2], missions: [MISSION_COLORANTS, MISSION_INCOLORES] });
})(window.Labo);

/*
Rôle : simulation de l'activité 2 du chapitre « Quelques instruments d'optique » (1re année du bac) : principe du
       microscope : observer (éléments, mise au point, objectifs), mesurer (champ, taille d'une cellule), limites
       (grossissement à vide, profondeur de champ) ; modèle au banc d'optique (image intermédiaire, grossissement).
       Objectifs O1 à O4.
Reçoit : rien (les vérifications lisent les faits « microscope », « docs_microscope », « modele »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const mi = (f) => f.microscope || { nets: [] }, net = (f, c) => mi(f).nets.includes(c), mo = (f) => f.modele || { images: [], nets: [] };

  const OBSERVER = {
    id: "observer", paillasse: 0, titre: "Observer au microscope",
    objectif: "Connaître les éléments du microscope ; faire la mise au point avec les trois objectifs.",
    entetes: [],
    donnees: ["Objectifs : × 4 (rouge), × 10 (jaune), × 40 (bleu) ; oculaire × 10"],
    conclusion: "La lampe éclaire la préparation posée sur la platine. L'objectif donne une image intermédiaire réelle et agrandie ; l'oculaire, comme une loupe, permet de l'observer. On fait la mise au point avec la vis macrométrique au faible grossissement, puis avec la vis micrométrique au fort grossissement. Plus le grossissement est fort, plus le champ observé est petit et l'image sombre.",
    conclusion_courte: "Objectif : image agrandie ; oculaire : loupe.",
    etapes: [
      { consigne: "Allumez la lampe et posez la lame « oignon » sur la platine.", court: "Lampe, lame d'oignon.", aide_geste: "Faites glisser la lame de la boîte jusqu'à la platine.", verifier: ({ faits }) => mi(faits).lampe && mi(faits).lame === "oignon" },
      { consigne: "Avec l'objectif × 4, montez la platine avec la vis macrométrique jusqu'à voir les cellules nettes.", court: "Net à × 4.", aide_geste: "Glissez vers le haut ou le bas sur la grosse molette.", verifier: ({ faits }) => net(faits, "oignon:4:10") },
      { consigne: "Tournez le revolver (× 10 puis × 40) ; refaites la mise au point avec la vis micrométrique.", court: "Net à × 40.", aide_geste: "Touchez le revolver ; glissez sur la petite molette, au centre.", verifier: ({ faits }) => net(faits, "oignon:40:10") },
      { consigne: "Quand on passe de l'objectif × 4 à l'objectif × 40…", court: "Répondez dans le carnet.", question: choix(["les cellules sont plus grandes, le champ plus petit et l'image plus sombre", "on voit plus de cellules", "rien ne change"], "Comparez le nombre de cellules vues.", "Exact.") },
      { consigne: "Rôle de l'objectif :", court: "Répondez dans le carnet.", question: choix(["donner de la préparation une image intermédiaire réelle, renversée et agrandie", "éclairer la préparation", "jouer le rôle de loupe pour l'œil"], "Relisez le document « Objectif, oculaire, grossissement ».", "Exact : l'oculaire, lui, est une loupe.") },
      { consigne: "Grossissement commercial avec l'objectif × 40 et l'oculaire × 10 ?", court: "Gc ?", question: { type: "nombre", unite: "", attendu: 400, tolerance: 1, aide: "Gc = |γ1| × Gc(oculaire).", bravo: "Exact : 40 × 10 = 400." } },
    ],
  };

  const MESURER = {
    id: "mesurer", paillasse: 0, titre: "Mesurer au microscope",
    objectif: "Mesurer le diamètre du champ avec le micromètre objet, puis la longueur d'une cellule d'oignon.",
    entetes: [],
    donnees: ["Micromètre objet : 1 mm divisé en 100 (une division = 0,01 mm)"],
    conclusion: "Le micromètre objet permet de mesurer le champ du microscope : à × 40, environ 45 divisions, soit 0,45 mm. En comptant les cellules dans le champ, on trouve qu'une cellule d'épiderme d'oignon mesure environ 0,25 mm de long.",
    conclusion_courte: "Champ à × 40 : 0,45 mm ; cellule : 0,25 mm.",
    etapes: [
      { consigne: "Remplacez la lame par le micromètre objet ; faites la mise au point à × 40.", court: "Micromètre net à × 40.", verifier: ({ faits }) => net(faits, "micrometre:40:10") },
      { consigne: "Diamètre du champ à × 40 (en mm) ? Comptez les divisions d'un bord à l'autre.", court: "Champ (mm) ?", question: { type: "nombre", unite: "mm", attendu: 0.45, tolerance: 0.03, aide: "Une division = 0,01 mm ; comptez de dix en dix.", bravo: "Exact : environ 45 divisions." } },
      { consigne: "Reposez la lame d'oignon et faites la mise au point à × 40.", court: "Oignon net à × 40.", verifier: ({ faits }) => mi(faits).lame === "oignon" && net(faits, "oignon:40:10") },
      { consigne: "Longueur d'une cellule (mm) ? Comptez les cellules sur un diamètre du champ.", court: "Cellule (mm) ?", question: { type: "nombre", unite: "mm", attendu: 0.25, tolerance: 0.06, aide: "Longueur = diamètre du champ / nombre de cellules.", bravo: "Exact : environ 0,25 mm." } },
    ],
  };

  const LIMITES = {
    id: "limites", paillasse: 0, titre: "Les limites du microscope",
    objectif: "Observer ce qui se passe quand on grossit encore ; lire le document sur les limites.",
    entetes: [],
    conclusion: "Le microscope optique ne sépare pas deux points plus proches qu'environ 0,2 µm, à cause de la diffraction de la lumière : au-delà d'un grossissement d'environ 1 000, l'image grossit sans montrer de nouveaux détails. Aux forts grossissements, la profondeur de champ est très faible et il faut beaucoup de lumière.",
    conclusion_courte: "Limite : pouvoir séparateur (≈ 0,2 µm).",
    etapes: [
      { consigne: "À × 40, remplacez l'oculaire × 10 par l'oculaire × 20 et refaites la mise au point.", court: "Oculaire × 20.", verifier: ({ faits }) => mi(faits).nets.some((c) => c.endsWith(":40:20")) },
      { consigne: "Lisez le document « Les limites du microscope ».", court: "Lisez le document.", verifier: ({ faits }) => (faits.docs_microscope || []).includes(2) },
      { consigne: "Avec l'oculaire × 20, l'image est…", court: "Répondez dans le carnet.", question: choix(["plus grande, mais plus sombre et sans détail nouveau", "beaucoup plus détaillée", "plus lumineuse"], "Comparez avec l'oculaire × 10.", "Exact : c'est un grossissement « à vide ».") },
      { consigne: "Ce qui limite les détails visibles au microscope optique :", court: "Répondez dans le carnet.", question: choix(["la diffraction de la lumière : on ne sépare pas deux points à moins de 0,2 µm environ", "la taille de la platine", "la puissance de la lampe seulement"], "Relisez le document.", "Exact.") },
      { consigne: "À × 40, la mise au point est délicate parce que…", court: "Répondez dans le carnet.", question: choix(["la profondeur de champ est très faible", "l'objectif est trop court", "la lame est trop épaisse"], "Avec × 40, il faut la vis micrométrique.", "Exact.") },
    ],
  };

  const MODELE = {
    id: "modele", paillasse: 1, titre: "Modèle du microscope",
    objectif: "Réaliser un modèle de microscope au banc d'optique ; trouver l'image intermédiaire ; calculer le grossissement.",
    entetes: [],
    donnees: ["Objet « F » : AB = 5 mm, à 10 cm sur le rail ; objectif L1 : f'1 = 5 cm, à 17 cm", "Oculaire L2 : f'2 = 10 cm ; Gc(oculaire) = 0,25 / f'2"],
    conclusion: "L'objectif, placé à une distance de l'objet un peu supérieure à f'1, donne une image intermédiaire A1B1 réelle, renversée et agrandie (γ1 = OA1/OA = −2,5). L'oculaire placé de façon que A1B1 soit dans son plan focal objet donne une image finale à l'infini. Grossissement : G = |γ1| × 0,25/f'2 = 2,5 × 2,5 ≈ 6.",
    conclusion_courte: "G = |γ1| × Gc(oculaire).",
    etapes: [
      { consigne: "Faites glisser l'écran jusqu'à obtenir l'image A1B1 nette du « F ».", court: "Image A1B1 nette.", verifier: ({ faits }) => mo(faits).images.length > 0 },
      { consigne: "Grandissement de l'objectif γ1 = OA1 / OA (OA = −7 cm) ?", court: "γ1 ?", question: { type: "nombre", unite: "", attendu: -2.5, tolerance: 0.15, aide: "OA1 : distance de l'objectif à l'écran (positive) ; OA = −7 cm.", bravo: "Exact : γ1 = 17,5 / (−7) = −2,5." } },
      { consigne: "Retirez l'écran, posez l'oculaire et faites-le glisser jusqu'à voir le « F » net.", court: "« F » net dans le modèle.", verifier: ({ faits }) => mo(faits).nets.length > 0 },
      { consigne: "Grossissement G = |γ1| × 0,25 / f'2 (f'2 en mètres) ?", court: "G ?", question: { type: "nombre", unite: "", attendu: 6.25, tolerance: 0.3, aide: "0,25 / 0,10 = 2,5 ; puis multipliez par |γ1|.", bravo: "Exact : comparez les deux vues." } },
      { consigne: "Touchez « Faisceau » (oculaire en place, écran retiré).", court: "Faisceau.", verifier: ({ faits }) => !!mo(faits).faisceau },
      { consigne: "Les rayons issus de B, à la sortie de l'oculaire, sont…", court: "Répondez dans le carnet.", question: choix(["parallèles : l'image finale est à l'infini, A1B1 est au foyer objet F2", "convergents vers l'écran", "arrêtés par l'oculaire"], "Suivez les trois rayons.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_opt3_a2_microscope", titre: "Laboratoire : le microscope", decor: "aucun", paillasses: [L.poste_microscope, L.poste_modele_microscope], missions: [OBSERVER, MESURER, LIMITES, MODELE] });
})(window.Labo);

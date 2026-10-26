/*
Rôle : simulation de l'activité 1 du chapitre « Quelques instruments d'optique » (1re année du bac) : la lunette
       astronomique, par des documents (rôle de l'objectif et de l'oculaire, diamètre apparent, grossissement, cercle
       oculaire) puis par une maquette au banc d'optique tournée vers la Lune. Objectifs O1, O2, O3.
Reçoit : rien (les vérifications lisent les faits « docs_lunette », « tri_lunette », « lunette »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const lu = (f) => f.lunette || { images: [], nets: [] };

  function tri({ faits }) {
    // Toutes les étiquettes rangées dans la bonne colonne.
    const t = faits.tri_lunette || {};
    if (Object.keys(t).length < L.TRI_LUNETTE.length) return false;
    return L.TRI_LUNETTE.every((e) => t[e.id] === e.colonne) || "Une étiquette n'est pas dans la bonne colonne : relisez le document « Objectif et oculaire ».";
  }

  const DOCS = {
    id: "docs", paillasse: 0, titre: "Documents : la lunette astronomique",
    objectif: "Lire les documents ; connaître le rôle de l'objectif et de l'oculaire, le diamètre apparent et le grossissement.",
    entetes: [],
    conclusion: "La lunette astronomique associe deux lentilles convergentes : l'objectif (grande distance focale) donne de l'astre une image réelle A1B1 dans son plan focal image ; l'oculaire (petite distance focale) sert de loupe pour l'observer. Le diamètre apparent α est l'angle sous lequel on voit un objet ; le grossissement est G = α' / α ; pour une lunette afocale, G = f'1 / f'2.",
    conclusion_courte: "Objectif : image A1B1 ; oculaire : loupe ; G = α'/α.",
    etapes: [
      { consigne: "Lisez les quatre documents au mur.", court: "Lisez les documents.", aide_geste: "Touchez un document pour l'ouvrir, touchez-le de nouveau pour le refermer.", verifier: ({ faits }) => (faits.docs_lunette || []).length >= 4 },
      { consigne: "Rangez chaque étiquette sous la lentille qui convient.", court: "Tableau : rangez les étiquettes.", aide_geste: "Faites glisser chaque étiquette dans une colonne.", verifier: tri },
      { consigne: "Le diamètre apparent de la Lune est…", court: "Répondez dans le carnet.", question: choix(["l'angle sous lequel on la voit : environ 9 × 10⁻³ rad (un demi-degré)", "son diamètre : 3 474 km", "sa distance à la Terre"], "Relisez le document « Diamètre apparent et grossissement ».", "Exact.") },
      { consigne: "Le grossissement G d'une lunette est…", court: "Répondez dans le carnet.", question: choix(["G = α' / α : le rapport des diamètres apparents de l'image et de l'objet", "le rapport des tailles A'B' / AB", "la vergence de l'objectif"], "α' : avec la lunette ; α : à l'œil nu.", "Exact.") },
    ],
  };

  const OBJECTIF = {
    id: "objectif", paillasse: 1, titre: "L'objectif",
    objectif: "Recueillir sur un écran l'image de la Lune donnée par l'objectif.",
    entetes: [],
    donnees: ["Objectif L1 : f'1 = 40 cm (son index est à 25 cm sur le rail)", "Oculaire L2 : f'2 = 5 cm"],
    conclusion: "L'objectif donne de la Lune, très éloignée, une image réelle, petite et renversée, dans son plan focal image (à f'1 = 40 cm de l'objectif). C'est l'image intermédiaire A1B1 ; son diamètre vaut f'1 × α.",
    conclusion_courte: "A1B1 dans le plan focal image de l'objectif.",
    etapes: [
      { consigne: "Faites glisser l'écran jusqu'à voir une petite image nette de la Lune.", court: "Image nette de la Lune.", aide_geste: "Faites glisser l'écran par son cavalier.", verifier: ({ faits }) => lu(faits).images.length > 0 },
      { consigne: "Distance de l'objectif à l'écran (lisez les index sur le rail) ?", court: "Distance (cm) ?", question: { type: "nombre", unite: "cm", attendu: 40, tolerance: 1, aide: "Index de l'écran moins index de l'objectif (25 cm).", bravo: "Exact : f'1 = 40 cm." } },
      { consigne: "L'image A1B1 donnée par l'objectif est…", court: "Répondez dans le carnet.", question: choix(["réelle, petite, dans le plan focal image de l'objectif", "virtuelle", "aussi grande que la Lune"], "On la recueille sur l'écran, à f'1 de l'objectif.", "Exact.") },
    ],
  };

  const OCULAIRE = {
    id: "oculaire", paillasse: 1, titre: "L'oculaire et le grossissement",
    objectif: "Observer l'image A1B1 avec l'oculaire ; régler la lunette ; comparer les diamètres apparents.",
    entetes: [],
    conclusion: "L'oculaire est une loupe : il donne de A1B1 une image virtuelle, agrandie. Quand A1B1 est au foyer objet F2 de l'oculaire (F'1 et F2 confondus), l'image finale est à l'infini : la lunette est afocale et l'œil observe sans fatigue. La Lune est vue renversée, G = f'1 / f'2 = 8 fois plus grande.",
    conclusion_courte: "Lunette afocale : F'1 = F2 ; G = f'1/f'2.",
    etapes: [
      { consigne: "Retirez l'écran (touche « Écran »), posez l'oculaire (« Oculaire ») et faites-le glisser jusqu'à voir la Lune nette.", court: "Lune nette dans la lunette.", verifier: ({ faits }) => lu(faits).nets.length > 0 },
      { consigne: "La Lune est vue nette quand l'image A1B1 est…", court: "Répondez dans le carnet.", question: choix(["au foyer objet F2 de l'oculaire : F'1 et F2 sont confondus (lunette afocale)", "contre l'oculaire", "au foyer image de l'oculaire"], "Distance objectif-oculaire : f'1 + f'2 = 45 cm.", "Exact.") },
      { consigne: "Combien de fois la Lune paraît-elle plus grande dans la lunette (G) ?", court: "G ?", question: { type: "nombre", unite: "", attendu: 8, tolerance: 0.5, aide: "Comparez les deux vues, ou calculez f'1 / f'2.", bravo: "Exact : G = 40 / 5 = 8." } },
      { consigne: "Dans la lunette, la Lune est vue…", court: "Répondez dans le carnet.", question: choix(["renversée", "droite", "de côté"], "Comparez les taches sombres (mers) dans les deux vues.", "Exact : une lunette astronomique renverse les images.") },
    ],
  };

  const CERCLE = {
    id: "cercle", paillasse: 1, titre: "Cercle oculaire et faisceau",
    objectif: "Trouver le cercle oculaire ; y placer l'œil ; suivre un faisceau dans la lunette.",
    entetes: [],
    conclusion: "Un faisceau parallèle venu d'un point de la Lune converge en un point de A1B1, puis ressort de l'oculaire parallèle, plus incliné : c'est pourquoi la Lune paraît plus grande. Tous les faisceaux sortants passent par le cercle oculaire : l'œil s'y place pour recevoir toute la lumière et voir tout le champ.",
    conclusion_courte: "L'œil se place au cercle oculaire.",
    etapes: [
      { consigne: "Replacez l'écran derrière l'oculaire et cherchez la plus petite tache de lumière.", court: "Plus petite tache.", verifier: ({ faits }) => !!lu(faits).cercle },
      { consigne: "Cette petite tache est le cercle oculaire. Son intérêt :", court: "Répondez dans le carnet.", question: choix(["toute la lumière entrée dans l'objectif y passe : c'est là qu'on place l'œil", "c'est l'image de la Lune", "c'est le foyer de l'objectif"], "Relisez le document « Le cercle oculaire ».", "Exact.") },
      { consigne: "Retirez l'écran et placez l'œil de l'élève au cercle oculaire : le champ vu est le plus large.", court: "Œil au cercle oculaire.", aide_geste: "Faites glisser l'élève le long du banc.", verifier: ({ faits }) => !!lu(faits).oeil_cercle },
      { consigne: "Touchez « Faisceau ».", court: "Faisceau.", verifier: ({ faits }) => !!lu(faits).faisceau },
      { consigne: "À la sortie d'une lunette afocale, le faisceau venu d'un point de la Lune est…", court: "Répondez dans le carnet.", question: choix(["parallèle, plus incliné sur l'axe qu'à l'entrée", "convergent vers l'œil", "parallèle à l'axe"], "Suivez les trois rayons après l'oculaire.", "Exact : α' > α.") },
    ],
  };

  L.demarrer({ id: "b1_opt3_a1_lunette", titre: "Laboratoire : la lunette astronomique", decor: "aucun", paillasses: [L.poste_documents_lunette, L.poste_lunette], missions: [DOCS, OBJECTIF, OCULAIRE, CERCLE] });
})(window.Labo);

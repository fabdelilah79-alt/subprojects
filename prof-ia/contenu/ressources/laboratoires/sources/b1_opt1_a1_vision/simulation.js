/*
Rôle : simulation de l'activité 1 du chapitre « Conditions de visibilité d'un objet » (1re année du bac) : la lumière ne
       se voit pas (laser et fumée) ; conditions de vision d'un objet ; propagation rectiligne (écrans percés) ; sources
       primaires et objets diffusants ; l'image se forme dans le cerveau (illusions). Objectifs O1, O2.
Reçoit : rien (les vérifications lisent les faits « fumee », « vision », « ecrans », « tri_sources », « illusion »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const v = (f, fait, k) => !!(f[fait] || {})[k];

  const LUMIERE = {
    id: "lumiere", paillasse: 0, titre: "Peut-on voir la lumière ?",
    objectif: "Observer un faisceau laser sans fumée, puis dans la fumée.",
    entetes: [],
    conclusion: "La lumière ne se voit pas : on ne voit que les objets qui envoient de la lumière dans nos yeux. Le faisceau laser n'apparaît que si de fines particules (fumée, poussière de craie) en diffusent une partie vers l'œil ; on voit alors que la lumière se propage en ligne droite.",
    conclusion_courte: "La lumière ne se voit pas ; on voit les objets.",
    etapes: [
      { consigne: "Allumez le laser (sans fumée). Ne regardez jamais un laser dans l'axe du faisceau.", court: "Laser allumé, sans fumée.", verifier: ({ faits }) => v(faits, "fumee", "sans") },
      { consigne: "Sans fumée, entre le laser et l'écran…", court: "Répondez dans le carnet.", question: choix(["on ne voit pas le faisceau", "on voit un trait rouge", "on voit un trait, mais pâle"], "Regardez la caisse.", "Exact.") },
      { consigne: "Allumez le bâton d'encens (« Encens ») et attendez que la fumée remplisse la caisse, laser allumé.", court: "Encens.", verifier: ({ faits }) => v(faits, "fumee", "avec") },
      { consigne: "Dans la fumée, on voit le trajet du faisceau, parce que…", court: "Répondez dans le carnet.", question: choix(["la fumée diffuse la lumière vers nos yeux", "la fumée colore la lumière en rouge", "la fumée produit sa propre lumière"], "La fumée seule, sans laser, ne brille pas.", "Exact.") },
      { consigne: "Que peut-on conclure ?", court: "Répondez dans le carnet.", question: choix(["on ne voit que la lumière qui entre dans l'œil", "on voit toujours la lumière, même de côté", "la lumière ne se propage que dans la fumée"], "Sans fumée, le faisceau est invisible.", "Exact.") },
    ],
  };

  const VISION = {
    id: "vision", paillasse: 1, titre: "Conditions de vision d'un objet",
    objectif: "Chercher quand l'œil voit le livre posé sur la paillasse.",
    entetes: [],
    conclusion: "Un objet n'est vu que s'il est lumineux (source primaire) ou éclairé (il diffuse alors une partie de la lumière reçue), et si la lumière qu'il envoie arrive jusqu'à l'œil sans être arrêtée. L'œil reçoit la lumière ; l'image se forme et s'interprète dans le cerveau.",
    conclusion_courte: "Objet lumineux ou éclairé, et lumière jusqu'à l'œil.",
    etapes: [
      { consigne: "Salle dans l'obscurité, lampe éteinte : voit-on le livre ?", court: "Répondez dans le carnet.", question: choix(["non : il ne reçoit pas de lumière", "oui : il est juste devant l'œil", "oui : l'œil envoie de la lumière"], "Regardez la bulle.", "Exact.") },
      { consigne: "Allumez la lampe.", court: "Allumez la lampe.", verifier: ({ faits }) => v(faits, "vision", "vu_livre") },
      { consigne: "Le livre est maintenant visible, parce que…", court: "Répondez dans le carnet.", question: choix(["il diffuse la lumière qu'il reçoit", "il produit sa propre lumière", "l'œil l'éclaire de son regard"], "Suivez les rayons tracés.", "Exact.") },
      { consigne: "Faites glisser le carton entre le livre et l'œil.", court: "Carton entre le livre et l'œil.", aide_geste: "Faites glisser le carton marron.", verifier: ({ faits }) => v(faits, "vision", "cache") },
      { consigne: "Avec le carton, l'œil ne voit plus le livre, parce que…", court: "Répondez dans le carnet.", question: choix(["le carton arrête la lumière diffusée", "le carton empêche l'œil de regarder", "le livre n'est plus éclairé du tout"], "Le livre reste éclairé.", "Exact.") },
    ],
  };

  const RECTILIGNE = {
    id: "rectiligne", paillasse: 2, titre: "Propagation rectiligne",
    objectif: "Aligner trois trous pour voir la lampe.",
    entetes: [],
    conclusion: "Dans un milieu transparent et homogène, la lumière se propage en ligne droite. On représente son trajet par une droite fléchée dans le sens de propagation : c'est le rayon lumineux ; un faisceau est un ensemble de rayons.",
    conclusion_courte: "Ligne droite ; modèle du rayon lumineux.",
    etapes: [
      { consigne: "Déplacez les écrans jusqu'à ce que l'œil voie la lampe.", court: "Alignez les trous.", aide_geste: "Faites glisser chaque écran vers le haut ou vers le bas.", verifier: ({ faits }) => v(faits, "ecrans", "aligne") && v(faits, "ecrans", "desaligne") },
      { consigne: "L'œil voit la lampe seulement si…", court: "Répondez dans le carnet.", question: choix(["les trous et la lampe sont alignés", "les trous sont à des hauteurs différentes", "les écrans sont tous tout en bas"], "Comparez la hauteur des trous.", "Exact.") },
      { consigne: "On représente le trajet de la lumière par…", court: "Répondez dans le carnet.", question: choix(["une droite fléchée", "une ligne courbe", "un point lumineux"], "Regardez le trait tracé.", "Exact.") },
    ],
  };

  const SOURCES = {
    id: "sources", paillasse: 3, titre: "Sources de lumière et objets diffusants",
    objectif: "Classer des objets selon l'origine de la lumière qu'ils envoient.",
    entetes: [],
    conclusion: "Une source primaire produit sa propre lumière (Soleil, lampe allumée, flamme). Un objet diffusant (source secondaire) renvoie dans toutes les directions une partie de la lumière qu'il reçoit (Lune, livre, mur) : on ne le voit que s'il est éclairé.",
    conclusion_courte: "Source primaire ou objet diffusant.",
    etapes: [
      { consigne: "Classez les huit étiquettes.", court: "Classez les étiquettes.", verifier: ({ faits }) => L.tableau_tri.verifier(L.SOURCES_LUMIERE, faits.tri_sources) },
      { consigne: "On voit la Lune la nuit, parce que…", court: "Répondez dans le carnet.", question: choix(["elle diffuse la lumière du Soleil", "elle produit sa propre lumière", "elle reflète la lumière des étoiles"], "La Lune n'est pas une source primaire.", "Exact.") },
    ],
  };

  const CERVEAU = {
    id: "cerveau", paillasse: 4, titre: "L'image se forme dans le cerveau",
    objectif: "Observer deux illusions d'optique.",
    entetes: [],
    conclusion: "L'œil reçoit la lumière et la rétine envoie des messages nerveux au cerveau : c'est le cerveau qui forme et interprète l'image. Il peut se tromper (illusions d'optique) ou compléter ce qui manque. Cette image n'a rien à voir avec l'image projetée sur un écran.",
    conclusion_courte: "Le cerveau forme et interprète l'image.",
    etapes: [
      { consigne: "Affiche de gauche : le segment A paraît-il plus court ou plus long que le segment B ?", court: "Répondez dans le carnet.", question: choix(["plus court", "plus long", "de même longueur"], "Regardez sans mesurer.", "C'est ce que voient presque tous les élèves.") },
      { consigne: "Mesurez les deux segments avec la règle : son zéro au début du segment, juste en dessous.", court: "Mesurez A, puis B.", aide_geste: "Faites glisser la règle posée sur la paillasse.", verifier: ({ faits }) => v(faits, "illusion", "mesure") },
      { consigne: "Les deux segments mesurent tous les deux 10 cm. Cette illusion montre que…", court: "Répondez dans le carnet.", question: choix(["le cerveau interprète ce que l'œil reçoit", "l'œil reçoit mal la lumière des segments", "les flèches changent la longueur réelle"], "La règle ne se trompe pas, le cerveau si.", "Exact.") },
      { consigne: "Affiche de droite : on « voit » un triangle blanc, alors qu'il n'est pas dessiné. Le cerveau…", court: "Répondez dans le carnet.", question: choix(["complète l'image reçue", "reçoit la lumière d'un triangle", "voit à travers l'affiche"], "Seuls trois disques entamés sont dessinés.", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_opt1_a1_vision", titre: "Laboratoire : voir un objet", decor: "aucun", paillasses: [L.poste_fumee, L.poste_vision, L.poste_ecrans, L.poste_sources, L.poste_illusion], missions: [LUMIERE, VISION, RECTILIGNE, SOURCES, CERVEAU] });
})(window.Labo);

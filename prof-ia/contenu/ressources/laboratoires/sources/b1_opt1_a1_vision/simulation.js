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
  const M = (id, paillasse, titre, objectif, conclusion, conclusion_courte, etapes) => ({ id, paillasse, titre, objectif, entetes: [], conclusion, conclusion_courte, etapes });

  const LUMIERE = M("lumiere", 0, "Peut-on voir la lumière ?", "Observer un faisceau laser sans fumée, puis dans la fumée.",
    "La lumière ne se voit pas : on ne voit que les objets qui envoient de la lumière dans nos yeux. Le faisceau laser n'apparaît que si de fines particules (fumée, poussière de craie) en diffusent une partie vers l'œil ; on voit alors que la lumière se propage en ligne droite.", "La lumière ne se voit pas ; on voit les objets.", [
      { consigne: "Allumez le laser (sans fumée). Ne regardez jamais un laser dans l'axe du faisceau.", court: "Laser allumé, sans fumée.", verifier: ({ faits }) => v(faits, "fumee", "sans") },
      { consigne: "Sans fumée, entre le laser et l'écran…", court: "Répondez dans le carnet.", question: choix(["on ne voit pas le faisceau : on voit seulement la tache sur l'écran", "on voit un trait rouge", "on voit le faisceau mais pas la tache"], "Regardez la caisse.", "Exact.") },
      { consigne: "Allumez le bâton d'encens (« Encens ») et attendez que la fumée remplisse la caisse, laser allumé.", court: "Encens.", verifier: ({ faits }) => v(faits, "fumee", "avec") },
      { consigne: "Dans la fumée, on voit le trajet du faisceau, parce que…", court: "Répondez dans le carnet.", question: choix(["les particules de fumée diffusent une partie de la lumière dans toutes les directions, donc vers nos yeux", "la fumée colore la lumière", "la fumée produit de la lumière"], "La fumée seule, sans laser, ne brille pas.", "Exact.") },
      { consigne: "Que peut-on conclure ?", court: "Répondez dans le carnet.", question: choix(["la lumière ne se voit pas : on voit les objets qui envoient de la lumière dans nos yeux ; elle se propage en ligne droite", "la lumière se voit toujours", "la lumière ne se propage que dans la fumée"], "Sans fumée, le faisceau est invisible.", "Exact.") },
    ]);

  const VISION = M("vision", 1, "Conditions de vision d'un objet", "Chercher quand l'œil voit le livre posé sur la paillasse.",
    "Un objet n'est vu que s'il est lumineux (source primaire) ou éclairé (il diffuse alors une partie de la lumière reçue), et si la lumière qu'il envoie arrive jusqu'à l'œil sans être arrêtée. L'œil reçoit la lumière ; l'image se forme et s'interprète dans le cerveau.", "Objet lumineux ou éclairé, et lumière jusqu'à l'œil.", [
      { consigne: "Salle dans l'obscurité, lampe éteinte : voit-on le livre ?", court: "Répondez dans le carnet.", question: choix(["non : le livre ne reçoit pas de lumière, il n'en envoie pas vers l'œil", "oui, car il est devant l'œil", "oui, car l'œil envoie de la lumière"], "Regardez la bulle.", "Exact.") },
      { consigne: "Allumez la lampe.", court: "Allumez la lampe.", verifier: ({ faits }) => v(faits, "vision", "vu_livre") },
      { consigne: "Le livre est maintenant visible, parce que…", court: "Répondez dans le carnet.", question: choix(["il est éclairé et diffuse une partie de la lumière reçue dans toutes les directions, en particulier vers l'œil", "il produit sa propre lumière", "l'œil l'éclaire"], "Suivez les rayons tracés.", "Exact.") },
      { consigne: "Faites glisser le carton entre le livre et l'œil.", court: "Carton entre le livre et l'œil.", aide_geste: "Faites glisser le carton marron.", verifier: ({ faits }) => v(faits, "vision", "cache") },
      { consigne: "Avec le carton, l'œil ne voit plus le livre, parce que…", court: "Répondez dans le carnet.", question: choix(["la lumière diffusée par le livre se propage en ligne droite et le carton l'arrête", "le carton éteint la lampe", "le livre n'est plus éclairé"], "Le livre reste éclairé.", "Exact.") },
    ]);

  const RECTILIGNE = M("rectiligne", 2, "Propagation rectiligne", "Aligner trois trous pour voir la lampe.",
    "Dans un milieu transparent et homogène, la lumière se propage en ligne droite. On représente son trajet par une droite fléchée dans le sens de propagation : c'est le rayon lumineux ; un faisceau est un ensemble de rayons.", "Ligne droite ; modèle du rayon lumineux.", [
      { consigne: "Déplacez les écrans jusqu'à ce que l'œil voie la lampe.", court: "Alignez les trous.", aide_geste: "Faites glisser chaque écran vers le haut ou vers le bas.", verifier: ({ faits }) => v(faits, "ecrans", "aligne") && v(faits, "ecrans", "desaligne") },
      { consigne: "L'œil voit la lampe seulement si…", court: "Répondez dans le carnet.", question: choix(["les trois trous sont alignés avec la lampe et l'œil : la lumière se propage en ligne droite", "les trous sont à des hauteurs différentes", "les écrans sont tous en bas"], "Comparez la hauteur des trous.", "Exact.") },
      { consigne: "On représente le trajet de la lumière par…", court: "Répondez dans le carnet.", question: choix(["un rayon lumineux : une droite avec une flèche dans le sens de propagation", "une ligne courbe", "un point"], "Regardez le trait tracé.", "Exact.") },
    ]);

  const SOURCES = M("sources", 3, "Sources de lumière et objets diffusants", "Classer des objets selon l'origine de la lumière qu'ils envoient.",
    "Une source primaire produit sa propre lumière (Soleil, lampe allumée, flamme). Un objet diffusant (source secondaire) renvoie dans toutes les directions une partie de la lumière qu'il reçoit (Lune, livre, mur) : on ne le voit que s'il est éclairé.", "Source primaire ou objet diffusant.", [
      { consigne: "Classez les huit étiquettes.", court: "Classez les étiquettes.", verifier: ({ faits }) => L.tableau_tri.verifier(L.SOURCES_LUMIERE, faits.tri_sources) },
      { consigne: "On voit la Lune la nuit, parce que…", court: "Répondez dans le carnet.", question: choix(["elle est éclairée par le Soleil et renvoie une partie de cette lumière vers la Terre", "elle produit sa propre lumière", "elle reflète la lumière des étoiles"], "La Lune n'est pas une source primaire.", "Exact.") },
    ]);

  const CERVEAU = M("cerveau", 4, "L'image se forme dans le cerveau", "Observer deux illusions d'optique.",
    "L'œil reçoit la lumière et la rétine envoie des messages nerveux au cerveau : c'est le cerveau qui forme et interprète l'image. Il peut se tromper (illusions d'optique) ou compléter ce qui manque. Cette image n'a rien à voir avec l'image projetée sur un écran.", "Le cerveau forme et interprète l'image.", [
      { consigne: "Affiche de gauche : le segment A paraît-il plus court ou plus long que le segment B ?", court: "Répondez dans le carnet.", question: choix(["plus court", "plus long", "de même longueur"], "Regardez sans mesurer.", "C'est ce que voient presque tous les élèves.") },
      { consigne: "Mesurez les deux segments avec la règle : son zéro au début du segment, juste en dessous.", court: "Mesurez A, puis B.", aide_geste: "Faites glisser la règle posée sur la paillasse.", verifier: ({ faits }) => v(faits, "illusion", "mesure") },
      { consigne: "Les deux segments mesurent tous les deux 10 cm. Cette illusion montre que…", court: "Répondez dans le carnet.", question: choix(["c'est le cerveau qui interprète la lumière reçue par l'œil : il peut se tromper", "l'œil mesure mal les longueurs", "les flèches changent la longueur des segments"], "La règle ne se trompe pas, le cerveau si.", "Exact.") },
      { consigne: "Affiche de droite : on « voit » un triangle blanc, alors qu'il n'est pas dessiné. Le cerveau…", court: "Répondez dans le carnet.", question: choix(["complète l'image à partir des formes reçues", "reçoit la lumière d'un triangle", "voit à travers l'affiche"], "Seuls trois disques entamés sont dessinés.", "Exact.") },
    ]);

  L.demarrer({ id: "b1_opt1_a1_vision", titre: "Laboratoire : voir un objet", decor: "aucun", paillasses: [L.poste_fumee, L.poste_vision, L.poste_ecrans, L.poste_sources, L.poste_illusion], missions: [LUMIERE, VISION, RECTILIGNE, SOURCES, CERVEAU] });
})(window.Labo);

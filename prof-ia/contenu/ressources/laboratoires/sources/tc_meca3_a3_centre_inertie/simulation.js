/*
Rôle : simulation de l'activité 3 du chapitre « Principe d'inertie » (tronc commun) : « Centre d'inertie : mouvement
       d'ensemble et mouvement propre ; barycentre de deux palets solidaires ». Objectifs O3 (repérer le centre d'inertie
       sur un enregistrement), O4 (centre d'inertie de solides homogènes simples), O5 (relation barycentrique).
Reçoit : rien (les vérifications lisent l'enregistrement, le curseur de la feuille et les gommettes).
Produit : la simulation démarrée : table à coussin d'air avec deux palets solidaires, paillasse des solides homogènes.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const M_A = 0.4, M_B = 0.2, AB = 120, GA = (M_B / (M_A + M_B)) * AB, K_VRAI = GA / AB;
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });

  function enregistrement({ faits }) {
    // Au moins 16 étincelles sur les deux palets, et le solide a tourné d'au moins un demi-radian.
    const e = L.VERIF_ENR.dernier(faits);
    if (!e || !e.points[0].a) return false;
    if (e.points.length < 16) return "L'enregistrement est trop court : relancez le solide pendant l'enregistrement.";
    const angle = (p) => Math.atan2(p.b.y - p.a.y, p.b.x - p.a.x), tour = Math.abs(angle(e.points[15]) - angle(e.points[0]));
    return tour > 0.5 || "Le solide doit tourner en avançant : lancez-le d'un geste plus vif.";
  }

  function centre({ faits }) {
    // Le curseur est-il à la bonne fraction de AB (croix alignées et régulièrement espacées) ?
    if (faits.fraction_g === undefined || faits.fraction_g === null) return false;
    return Math.abs(faits.fraction_g - K_VRAI) < 0.03 || "Les croix vertes ne sont pas encore alignées et régulièrement espacées : déplacez encore le curseur.";
  }

  function gommettes({ faits }) {
    // Les quatre gommettes sont-elles au centre des quatre solides ?
    if (faits.gommette_hors_centre) return `La gommette posée sur la ${faits.gommette_hors_centre === "sphere" ? "sphère" : faits.gommette_hors_centre} n'est pas au centre : cherchez son centre de symétrie.`;
    const c = faits.centres || {};
    return (c.tige && c.barre && c.disque && c.sphere) || false;
  }

  const CENTRE = {
    id: "centre", paillasse: 0, titre: "Deux palets solidaires",
    objectif: `Un palet A (${M_A * 1000} g) et un palet B (${M_B * 1000} g) sont reliés par une tige légère. Lancé en tournant, quel point du solide va en ligne droite ?`,
    entetes: [],
    conclusion: "Le centre d'inertie G est le seul point du solide qui décrit un mouvement rectiligne uniforme (mouvement d'ensemble) ; les autres points tournent autour de G (mouvement propre). G vérifie mA·GA = mB·GB.",
    conclusion_courte: "G : mA·GA = mB·GB.",
    etapes: [
      { consigne: "Appuyez sur « Enregistrer », puis lancez le solide d'un geste vif : il avance en tournant.", court: "Enregistrez le mouvement du solide.", verifier: enregistrement },
      { consigne: "Prenez la feuille. Les points A et B (sous les deux palets) décrivent…", court: "Répondez dans le carnet.", question: choix(["des courbes : chaque palet tourne en même temps qu'il avance", "des droites", "des cercles"], "Suivez les points A0, A1, A2…", "Exact.") },
      { consigne: "Sur la feuille, Ai et Bi sont reliés au crayon. Faites glisser le curseur vert le long de A0B0 : les croix marquent le même point du solide à chaque instant. Trouvez le point qui va en ligne droite, à vitesse constante.", court: "Trouvez le point qui va en ligne droite.", verifier: centre, aide_geste: "Les croix doivent être alignées et régulièrement espacées." },
      { consigne: "Ce point, qui décrit un mouvement rectiligne uniforme, s'appelle…", court: "Répondez dans le carnet.", question: choix(["le centre d'inertie G du solide", "le centre de la table", "le palet A"], "Pensez au principe d'inertie.", "Exact : le solide est pseudo-isolé, son centre d'inertie suit le principe d'inertie.") },
      { consigne: "Avec la règle, mesurez GA : de A0 à la croix verte du segment A0B0 (en cm).", court: "GA en cm ?", question: nombre("cm", GA / 10, 0.2, "Posez le zéro de la règle sur A0 ; zoomez pour lire au millimètre.", "Exact.") },
      { consigne: "Mesurez GB : de la croix verte à B0 (en cm).", court: "GB en cm ?", question: nombre("cm", (AB - GA) / 10, 0.2, "GA + GB = AB.", "Exact.") },
      { consigne: `Avec mA = ${M_A * 1000} g et mB = ${M_B * 1000} g, comparez mA·GA et mB·GB.`, court: "Répondez dans le carnet.", question: choix(["mA·GA = mB·GB : G est plus près du palet le plus lourd", "GA = GB : G est toujours au milieu", "mA·GB = mB·GA"], "Calculez les deux produits.", "Exact.") },
      { consigne: "La relation barycentrique s'écrit avec des vecteurs…", court: "Répondez dans le carnet.", question: choix(["mA × (vecteur GA) + mB × (vecteur GB) = vecteur nul", "(vecteur GA) + (vecteur GB) = vecteur nul", "mA × (vecteur GA) = mB × (vecteur GB)"], "Les vecteurs GA et GB sont de sens opposés.", "Exact.") },
      { consigne: "Le mouvement du solide se décompose en…", court: "Répondez dans le carnet.", question: choix(["un mouvement d'ensemble (celui de G, rectiligne uniforme) et un mouvement propre (rotation autour de G)", "deux mouvements rectilignes", "un seul mouvement circulaire autour de A"], "Que font G, puis A et B ?", "Exact.") },
    ],
  };

  const SOLIDES = {
    id: "solides", paillasse: 1, titre: "Centre d'inertie des solides homogènes",
    objectif: "Situer le centre d'inertie de solides homogènes simples, puis utiliser la relation barycentrique.",
    entetes: [],
    conclusion: "Le centre d'inertie d'un solide homogène qui a un centre de symétrie est ce centre de symétrie (milieu d'une tige, centre d'un disque, d'une sphère).",
    conclusion_courte: "Solide homogène : G au centre de symétrie.",
    etapes: [
      { consigne: "Faites glisser une gommette rouge au centre d'inertie de chacun des quatre solides homogènes.", court: "Une gommette au centre de chaque solide.", verifier: gommettes, aide_geste: "Près du bon point, la gommette se colle." },
      { consigne: "Pour un solide homogène qui a un centre de symétrie, le centre d'inertie est…", court: "Répondez dans le carnet.", question: choix(["son centre de symétrie", "toujours sur son bord", "le point par où on le tient"], "Regardez où sont vos gommettes.", "Exact.") },
      { consigne: "Deux boules de 300 g et de 100 g sont fixées aux extrémités d'une tige légère de 40 cm. À quelle distance de la boule de 300 g se trouve G (en cm) ?", court: "Distance de G à la boule de 300 g (cm) ?", question: nombre("cm", 10, 0.1, "300 × GA = 100 × GB et GA + GB = 40 cm.", "Exact : 300 × 10 = 100 × 30.") },
    ],
  };

  L.demarrer({
    id: "tc_meca3_a3_centre_inertie", titre: "Laboratoire : le centre d'inertie",
    paillasses: [
      (g) => {
        const poste = L.poste_coussin_air(g, { nom: "solide", outils: ["regle"] });
        L.palets_solidaires(poste.table, { m_a: M_A, m_b: M_B, ab: AB });
        L.recherche_centre(poste.feuille);
        return poste;
      },
      L.poste_solides,
    ],
    missions: [CENTRE, SOLIDES],
  });
})(window.Labo);

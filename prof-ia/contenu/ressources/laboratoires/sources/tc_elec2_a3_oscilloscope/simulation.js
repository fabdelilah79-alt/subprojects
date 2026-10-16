/*
Rôle : simulation de l'activité 3 du chapitre « Tension électrique » (tronc commun) : observation de tensions à
       l'oscilloscope. Objectifs O1 (oscilloscope), O5 (tension variable : période, fréquence, valeur maximale ;
       U = Umax/√2 pour une tension sinusoïdale) et O6 (sensibilité verticale et balayage : U = Sv·y, t = b·x).
Reçoit : rien (les vérifications lisent l'oscilloscope, le GBF et le voltmètre).
Produit : la simulation démarrée : une paillasse (GBF, pile, oscilloscope, multimètre).
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (attendu, tolerance, aide, bravo, relative = false) => ({ type: "nombre", unite: "", attendu, [relative ? "tolerance_relative" : "tolerance"]: tolerance, aide, bravo });
  const O = (faits) => faits.oscillo || {};
  const G = (faits) => O(faits).gbf || { f: 500, Umax: 3, forme: "sinus" };
  const voit_gbf = (faits) => Math.abs(O(faits).ua || 0) > 0.5;

  function bien_regle({ faits }) {
    // Sinusoïde : amplitude de 2,5 à 4 divisions, une période de 4 à 10 divisions.
    if (!voit_gbf(faits)) return false;
    const o = O(faits), g = G(faits), y = (g.Umax * Math.abs(o.ua)) / o.Sv, x = 1000 / g.f / o.b;
    if (y > 4) return "La courbe sort de l'écran : augmentez Sv (plus de volts par division).";
    if (y < 2.5) return "La courbe est trop petite : diminuez Sv.";
    if (x > 10) return "On ne voit pas une période entière : augmentez b.";
    return x >= 4 || "Les périodes sont trop serrées : diminuez b.";
  }

  const CONTINUE = {
    id: "continue", paillasse: 0, titre: "Une tension continue à l'oscilloscope",
    objectif: "Que montre l'oscilloscope quand on lui applique la tension d'une pile ?",
    entetes: [],
    conclusion: "Une tension continue donne une droite horizontale, au-dessus du niveau de la masse si elle est positive, en dessous si elle est négative. U = Sv·y (Sv en V/div, y en divisions).",
    conclusion_courte: "U = Sv·y.",
    etapes: [
      { consigne: "Branchez la pile sur l'entrée de l'oscilloscope : borne + sur Y1, borne − sur la masse ⏚.", court: "Pile : + sur Y1, − sur la masse.", verifier: ({ faits }) => { const o = O(faits); if (!(o.u_dc > 4)) return false; return o.u_dc / o.Sv <= 4 || "Le trait sort de l'écran : augmentez Sv."; }, aide_geste: "Le petit triangle jaune à gauche de l'écran marque le niveau 0 V (la masse)." },
      { consigne: "Lisez la sensibilité verticale Sv affichée (en V/div). De combien de divisions verticales y le trait est-il monté au-dessus du niveau de la masse ?", court: "y (div) ?", question: nombre((faits) => O(faits).u_dc / O(faits).Sv, 0.15, "Comptez les grands carreaux, puis les petites graduations (0,2 div).", "Exact.") },
      { consigne: "Déduisez-en la tension U de la pile (U = Sv·y, en V).", court: "U de la pile (V) ?", question: nombre((faits) => O(faits).u_dc, 0.15, "U = Sv × y.", "Exact : U ≈ 4,5 V, la tension de la pile.") },
      { consigne: "Inversez les branchements de la pile.", court: "Inversez la pile.", verifier: ({ faits }) => { const o = O(faits); if (!(o.u_dc < -4)) return false; return o.u_dc / o.Sv >= -4 || "Le trait sort de l'écran : augmentez Sv."; } },
      { consigne: "Une tension continue apparaît à l'oscilloscope comme…", court: "Répondez dans le carnet.", question: choix(["une droite horizontale, au-dessus ou en dessous de la masse selon son signe", "une sinusoïde", "un point qui clignote"], "Qu'avez-vous vu dans les deux cas ?", "Exact.") },
    ],
  };

  const SINUS = {
    id: "sinus", paillasse: 0, titre: "Une tension sinusoïdale",
    objectif: "Mesurer la période, la fréquence et la valeur maximale de la tension du GBF.",
    entetes: [],
    conclusion: "Une tension sinusoïdale est périodique : période T = b·x, fréquence f = 1/T, valeur maximale Umax = Sv·y. Le voltmètre en mode alternatif mesure sa valeur efficace U = Umax/√2.",
    conclusion_courte: "T = b·x ; f = 1/T ; Umax = Sv·y ; U = Umax/√2.",
    etapes: [
      { consigne: "Débranchez la pile. Branchez le GBF (sinusoïdal) sur l'oscilloscope : SORTIE sur Y1, masse du GBF sur la masse de l'oscilloscope.", court: "GBF : SORTIE sur Y1, masse sur masse.", verifier: ({ faits }) => (voit_gbf(faits) && Math.abs(O(faits).u_dc) < 0.05 && G(faits).forme === "sinus") || false },
      { consigne: "Réglez Sv et b : la courbe doit être la plus haute possible sans sortir de l'écran, et une période doit occuper au moins 4 divisions.", court: "Réglez Sv et b.", verifier: bien_regle, aide_geste: "Touches − et + des cadres VOLTS/DIV et TIME/DIV." },
      { consigne: "Combien de divisions horizontales x occupe une période ?", court: "x pour une période (div) ?", question: nombre((faits) => 1000 / G(faits).f / O(faits).b, 0.2, "Mesurez entre deux passages à zéro en montant (zoomez).", "Exact.") },
      { consigne: "Calculez la période T = b·x (en ms).", court: "T (ms) ?", question: nombre((faits) => 1000 / G(faits).f, 0.03, "T = b × x, avec b en ms/div.", "Exact.", true) },
      { consigne: "Calculez la fréquence f = 1/T (en Hz). Comparez avec l'afficheur du GBF.", court: "f (Hz) ?", question: nombre((faits) => G(faits).f, 0.03, "T en secondes : 2 ms = 0,002 s.", "Exact : c'est la fréquence affichée par le GBF.", true) },
      { consigne: "Mesurez la valeur maximale Umax = Sv·y (y : divisions entre le niveau de la masse et le sommet), en V.", court: "Umax (V) ?", question: nombre((faits) => G(faits).Umax * Math.abs(O(faits).ua || 1), 0.12, "Umax = Sv × y.", "Exact.") },
      { consigne: "Réglez le multimètre sur V~ 20 et branchez-le aux bornes du GBF (VΩ sur SORTIE, COM sur la masse).", court: "Voltmètre V~ aux bornes du GBF.", verifier: ({ faits }) => (faits.voltmetre_gbf && faits.voltmetre_gbf.mode === "20V~" && faits.voltmetre_gbf.forme === "sinus") || false },
      { consigne: "Le voltmètre affiche U. Comparez U à Umax/√2. Le voltmètre en mode alternatif mesure…", court: "Répondez dans le carnet.", question: choix(["la valeur efficace U = Umax/√2", "la valeur maximale Umax", "la valeur moyenne de la tension"], "Calculez Umax/√2.", "Exact.") },
    ],
  };

  const FORMES = {
    id: "formes", paillasse: 0, titre: "D'autres tensions variables",
    objectif: "Observer des tensions triangulaire et carrée, et vérifier si U = Umax/√2 s'applique encore.",
    entetes: [],
    conclusion: "Une tension variable peut être sinusoïdale, triangulaire ou carrée. La période est fixée par la fréquence du GBF. La relation U = Umax/√2 n'est valable que pour une tension sinusoïdale.",
    conclusion_courte: "U = Umax/√2 : seulement en sinusoïdal.",
    etapes: [
      { consigne: "Sur le GBF, choisissez la forme triangulaire, puis la forme carrée, et observez l'écran.", court: "Formes triangulaire, puis carrée.", verifier: ({ faits }) => { const v = faits.formes_vues || []; return (v.includes("triangle") && v.includes("carre")) || false; } },
      { consigne: "Quand on change de forme sans toucher à la fréquence, la période…", court: "Répondez dans le carnet.", question: choix(["reste la même : elle est fixée par la fréquence du GBF", "change avec la forme", "devient nulle pour la forme carrée"], "Comparez x pour une période dans les trois cas.", "Exact.") },
      { consigne: "Forme carrée, lisez le voltmètre (V~ 20).", court: "Tension carrée : lisez le voltmètre.", verifier: ({ faits }) => (faits.voltmetre_gbf && faits.voltmetre_gbf.forme === "carre" && faits.voltmetre_gbf.mode === "20V~") || false },
      { consigne: "Pour la tension carrée, le voltmètre affiche U = Umax, et non Umax/√2. On en conclut que…", court: "Répondez dans le carnet.", question: choix(["U = Umax/√2 n'est valable que pour une tension sinusoïdale", "le voltmètre est en panne", "U = Umax/√2 est valable pour toutes les tensions"], "La formule a été établie pour une sinusoïde.", "Exact.") },
    ],
  };

  L.demarrer({ id: "tc_elec2_a3_oscilloscope", titre: "Laboratoire : tensions variables et oscilloscope", decor: "aucun", paillasses: [L.poste_oscilloscope], missions: [CONTINUE, SINUS, FORMES] });
})(window.Labo);

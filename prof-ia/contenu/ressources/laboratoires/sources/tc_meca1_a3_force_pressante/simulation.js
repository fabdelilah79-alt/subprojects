/*
Rôle : simulation de l'activité 3 du chapitre « Exemples d'actions mécaniques » (tronc commun) :
       « Expériences mettant en évidence la force pressante ». Objectifs O4 (classer les forces), O5 (force pressante),
       O6 (P = F/S et unités) ; orientations : cas d'un fluide, unités usuelles, aspects de la vie courante.
Reçoit : rien (les vérifications lisent les faits notés par les paillasses et le tableur).
Produit : la simulation démarrée : paillasse 1 (brique et mousse), paillasse 2 (capsule, manomètre, baromètre).
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const F_BRIQUE = 2 * 9.81;
  const proche_de_liste = (v, liste, tol) => liste.some((x) => Math.abs(x - v) <= tol);

  function tableau_pression({ feuille }) {
    // Les trois faces : S en m², F en N, P = F/S en Pa, enfoncement d en mm.
    const lignes = feuille.lignes(["A", "B", "C", "D"]);
    for (const l of lignes) {
      if (l.A > 1) return "La surface S doit être en m² : 1 cm² = 0,0001 m².";
      if (!proche_de_liste(l.A, [0.02, 0.01, 0.005], 0.0002)) return "Vérifiez S : calculez l'aire de la face posée sur la mousse (longueur × largeur).";
      if (Math.abs(l.B - F_BRIQUE) > 0.3) return "La force pressante est le poids de la brique : F = m·g.";
      if (Math.abs(l.C - l.B / l.A) > 0.02 * l.C + 1) return "Calculez P = F / S (par exemple =B2/A2).";
      if (Math.abs(l.D - l.C / 200) > 1.2) return "Relisez l'enfoncement d sur le réglet, en millimètres (zoomez).";
    }
    return new Set(lignes.map((l) => l.A)).size >= 3 || false;
  }

  function tableau_liquide({ feuille, faits }) {
    // 5 profondeurs réellement explorées, Δh lu sur le manomètre (à 0,5 cm près).
    const lignes = feuille.lignes(["A", "B"]);
    for (const l of lignes) {
      if (!proche_de_liste(l.A, faits.capsule_profondeurs || [], 0.5)) return `La capsule n'a pas été arrêtée à h = ${L.nombre(l.A, 1)} cm.`;
      if (Math.abs(l.B - l.A) > 0.5) return `Relisez la dénivellation Δh pour h = ${L.nombre(l.A, 1)} cm (zoomez sur le manomètre).`;
    }
    return new Set(lignes.map((l) => Math.round(l.A))).size >= 5 || false;
  }

  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });

  const PRESSION = {
    id: "pression", paillasse: 0, titre: "Force pressante et pression",
    objectif: "Mettre en évidence la force pressante et découvrir de quoi dépend son effet sur une surface.",
    entetes: ["S (m²)", "F (N)", "P (Pa)", "d (mm)"],
    conclusion: "La pression P = F / S (en pascal, Pa) augmente quand la force pressante augmente ou quand la surface pressée diminue.",
    conclusion_courte: "P = F / S, en pascal (Pa).",
    etapes: [
      { consigne: "Posez une brique sur la mousse. Touchez-la pour la tourner : essayez ses trois faces.", court: "Posez la brique sur la mousse, sur ses 3 faces.", verifier: ({ faits }) => (faits.faces_vues || []).length >= 3, aide_geste: "Touchez la brique (sans la déplacer) pour changer la face posée." },
      { consigne: "Pour chaque face : surface S (m²), force pressante F = poids de la brique (N), P = F / S (formule), enfoncement d lu au réglet (mm).", court: "Tableur : S, F, P = F/S et d pour chaque face.", verifier: tableau_pression, aide_geste: "Les dimensions sont sur la fiche. Faites glisser le réglet contre la brique." },
      { consigne: "Pour une même force pressante F, quand la surface pressée S diminue, la pression P…", court: "Répondez dans le carnet.", question: choix(["augmente", "diminue", "ne change pas"], "Comparez la colonne P et l'enfoncement d.", "Exact : plus S est petite, plus P est grande.") },
      { consigne: "Posez la deuxième brique sur la première : la force pressante double.", court: "Empilez les deux briques sur la mousse.", verifier: ({ faits }) => !!faits.empilement },
      { consigne: "La force F double et la surface S ne change pas. La pression P…", court: "Répondez dans le carnet.", question: choix(["double", "ne change pas", "est divisée par deux"], "Regardez l'enfoncement d avec deux briques.", "Exact : P = F / S double.") },
      { consigne: "Vie courante : pourquoi un skieur s'enfonce-t-il moins dans la neige qu'un piéton ?", court: "Répondez dans le carnet.", question: choix(["Les skis augmentent la surface pressée : la pression diminue", "Les skis diminuent le poids du skieur", "Les skis augmentent la pression"], "Le poids est le même : qu'est-ce qui change ?", "Exact : même force, surface plus grande, pression plus petite.") },
      { consigne: "Sur le tableau magnétique, classez chaque action mécanique : de contact localisée, de contact répartie ou à distance.", court: "Classez les actions sur le tableau magnétique.", verifier: ({ faits }) => L.tableau_tri.verifier(L.ETIQUETTES_FORCES, faits.classement_forces) },
      { consigne: "Système étudié : la brique. L'action de la mousse sur la brique est une action…", court: "Répondez dans le carnet.", question: choix(["extérieure à la brique", "intérieure à la brique"], "La mousse fait-elle partie du système étudié ?", "Exact : la mousse ne fait pas partie du système.") },
    ],
  };

  const LIQUIDE = {
    id: "liquide", paillasse: 1, titre: "La force pressante dans un liquide",
    objectif: "Explorer la pression dans l'eau avec une capsule manométrique, puis lire la pression atmosphérique.",
    entetes: ["h (cm)", "Δh (cm)"],
    conclusion: "Dans un liquide, la pression augmente avec la profondeur et ne dépend pas de l'orientation de la surface pressée.",
    conclusion_courte: "La pression augmente avec la profondeur.",
    etapes: [
      { consigne: "Faites glisser la noix de serrage vers le bas pour plonger la capsule dans l'eau. Observez le manomètre.", court: "Plongez la capsule dans l'eau.", verifier: ({ faits }) => (faits.capsule_profondeur_max || 0) >= 3 },
      { consigne: "Pour 5 profondeurs h différentes, lisez h sur l'éprouvette et la dénivellation Δh sur le manomètre. Notez-les dans le tableur.", court: "5 profondeurs : notez h et Δh (en cm).", verifier: tableau_liquide, aide_geste: "Lâchez la noix pour arrêter la capsule, puis lisez. Zoomez à deux doigts." },
      { consigne: "Tracez Δh en fonction de h.", court: "Tracez Δh en fonction de h.", verifier: ({ courbe }) => courbe.x === "A" && courbe.y === "B" && courbe.n >= 5 },
      { consigne: "D'après votre courbe, la pression dans l'eau…", court: "Répondez dans le carnet.", question: choix(["augmente avec la profondeur", "est la même partout", "diminue avec la profondeur"], "Que devient Δh quand h augmente ?", "Exact : Δh augmente avec h.") },
      { consigne: "À une même profondeur, touchez la capsule pour la tourner : vers le haut, sur le côté, vers le bas.", court: "Tournez la capsule à profondeur fixe.", verifier: ({ faits }) => (faits.capsule_orientations || 0) >= 3 },
      { consigne: "Quand on tourne la capsule sans changer sa profondeur, la dénivellation Δh…", court: "Répondez dans le carnet.", question: choix(["ne change pas", "change"], "Recommencez en regardant bien le manomètre.", "Exact : la pression ne dépend pas de l'orientation.") },
      { consigne: "Lisez le baromètre du laboratoire (en hPa). Exprimez la pression atmosphérique en bar (1 bar = 1000 hPa).", court: "Lisez le baromètre : P en bar ?", question: { type: "nombre", unite: "bar", attendu: 1.006, tolerance: 0.004, aide: "Lisez l'aiguille sur l'échelle extérieure (hPa), puis divisez par 1000.", bravo: "Exact : 1,006 bar." } },
      { consigne: "Sur l'échelle intérieure du baromètre (mmHg), lisez la même pression en centimètres de mercure.", court: "La même pression en cm de mercure ?", question: { type: "nombre", unite: "cmHg", attendu: 75.5, tolerance: 0.3, aide: "Lisez l'échelle intérieure en mmHg, puis divisez par 10.", bravo: "Exact : 75,5 cmHg (la pression normale vaut 76 cmHg = 1 atm)." } },
    ],
  };

  L.demarrer({
    id: "tc_meca1_a3_force_pressante",
    titre: "Laboratoire : la force pressante",
    paillasses: [L.poste_pression, L.poste_liquide],
    missions: [PRESSION, LIQUIDE],
  });
})(window.Labo);

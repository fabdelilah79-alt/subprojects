/*
Rôle : simulation de l'activité du chapitre « Importance de la mesure des quantités de matière dans la vie courante »
       (1re année du bac) : exemples de mesures (santé, environnement, agroalimentaire, sécurité), dosage des nitrates de
       trois eaux par bandelettes, concentration d'un colorant dans une boisson par échelle de teintes. Objectif O1.
Reçoit : rien (les vérifications lisent les faits « docs_mesure », « tri_mesure », « bandelettes », « teintes »).
Produit : la simulation démarrée.
Utilisé par : page.html (dernier script).
*/
(function (L) {
  const choix = (options, aide, bravo) => ({ type: "choix", options, bonne: 0, aide, bravo });
  const nombre = (unite, attendu, tolerance, aide, bravo) => ({ type: "nombre", unite, attendu, tolerance, aide, bravo });

  function tri({ faits }) {
    // Les huit exemples rangés dans le bon domaine.
    const t = faits.tri_mesure || {};
    if (Object.keys(t).length < L.TRI_MESURE.length) return false;
    return L.TRI_MESURE.every((e) => t[e.id] === e.colonne) || "Une étiquette n'est pas dans le bon domaine : relisez les documents.";
  }

  const POURQUOI = {
    id: "pourquoi", paillasse: 0, titre: "Pourquoi mesurer ?",
    objectif: "Lire des exemples de mesures dans la vie courante ; les ranger par domaine.",
    entetes: [],
    conclusion: "On mesure des quantités de matière (masses, concentrations) pour comparer les résultats à des valeurs de référence ou à des normes, et décider : soigner un malade, déclarer une eau potable, autoriser un aliment, éviter un accident. Une mesure n'a de sens qu'avec une technique adaptée et une incertitude connue.",
    conclusion_courte: "Mesurer pour comparer à une norme et décider.",
    etapes: [
      { consigne: "Lisez les cinq documents au mur.", court: "Lisez les documents.", aide_geste: "Touchez un document pour l'ouvrir, touchez-le de nouveau pour le refermer.", verifier: ({ faits }) => (faits.docs_mesure || []).length >= 5 },
      { consigne: "Rangez chaque exemple de mesure dans son domaine.", court: "Tableau : rangez les étiquettes.", verifier: tri },
      { consigne: "Une prise de sang à jeun donne une glycémie de 1,32 g/L. Ce résultat est…", court: "Répondez dans le carnet.", question: choix(["au-dessus des valeurs de référence (0,70 à 1,10 g/L) : il faut consulter un médecin", "normal", "trop faible"], "Relisez le document « Santé ».", "Exact.") },
      { consigne: "On mesure des quantités de matière dans la vie courante surtout pour…", court: "Répondez dans le carnet.", question: choix(["comparer à des normes ou à des valeurs de référence, et prendre une décision", "remplir des tableaux", "fabriquer des appareils"], "Que fait-on du résultat d'une analyse ?", "Exact.") },
    ],
  };

  const NITRATES = {
    id: "nitrates", paillasse: 1, titre: "Des nitrates dans l'eau ?",
    objectif: "Mesurer la teneur en ions nitrate de trois eaux avec des bandelettes réactives ; dire si elles sont potables.",
    entetes: [],
    donnees: ["Eau potable : moins de 50 mg/L d'ions nitrate"],
    conclusion: "La bandelette réactive se colore d'autant plus que l'eau contient d'ions nitrate ; on lit la teneur en comparant sa couleur à une échelle colorée. L'eau du puits (environ 100 mg/L) dépasse la norme de 50 mg/L : elle n'est pas potable. C'est une mesure rapide, mais peu précise.",
    conclusion_courte: "Bandelette : couleur comparée à une échelle.",
    etapes: [
      { consigne: "Trempez une bandelette dans chacune des trois eaux.", court: "Trois bandelettes.", aide_geste: "Faites glisser une bandelette de la boîte jusque dans un bécher, puis lâchez-la.", verifier: ({ faits }) => Object.values(faits.bandelettes || {}).every((v) => v !== null) && Object.keys(faits.bandelettes || {}).length === 3 },
      { consigne: "Teneur en ions nitrate de l'eau du puits (bandelette 2), lue sur l'échelle colorée ?", court: "Nitrates (mg/L) ?", question: nombre("mg/L", 100, 1, "Comparez la zone rose de la bandelette aux cases de l'échelle.", "Exact : environ 100 mg/L.") },
      { consigne: "Quelle eau n'est pas potable ?", court: "Répondez dans le carnet.", question: choix(["l'eau du puits : plus de 50 mg/L d'ions nitrate", "l'eau du robinet", "l'eau minérale"], "Comparez chaque teneur à la norme.", "Exact.") },
      { consigne: "La technique utilisée ici consiste à…", court: "Répondez dans le carnet.", question: choix(["comparer une couleur à une échelle colorée (méthode colorimétrique)", "peser l'eau", "mesurer le volume d'eau"], "Comment lit-on le résultat ?", "Exact.") },
    ],
  };

  const TEINTES = {
    id: "teintes", paillasse: 2, titre: "Un colorant dans une boisson",
    objectif: "Estimer la concentration du colorant E131 dans une boisson à la menthe avec une échelle de teintes.",
    entetes: [],
    donnees: ["Étalons : solutions de E131 à 2, 4, 6, 8 et 10 mg/L", "Boisson : sirop dilué 10 fois", "DJA du E131 : 5 mg par kg de masse corporelle et par jour"],
    conclusion: "Une échelle de teintes est une série de solutions étalons de concentrations connues. En comparant, sur fond blanc, la teinte de la boisson à celle des étalons, on encadre sa concentration : entre 4 et 6 mg/L, soit environ 5 mg/L ; le sirop pur en contient environ 50 mg/L. Un enfant de 30 kg qui boit 1 L de boisson absorbe environ 5 mg de E131, bien moins que sa dose journalière admissible (150 mg).",
    conclusion_courte: "Échelle de teintes : encadrer une concentration.",
    etapes: [
      { consigne: "Faites glisser le tube de boisson dans la place libre du porte-tubes où sa teinte se range le mieux.", court: "Tube à sa place.", aide_geste: "Saisissez le tube « ? » et lâchez-le au-dessus d'une place libre.", verifier: ({ faits }) => { const t = faits.teintes || {}; if (t.place === null || t.place === undefined) return false; return (t.entre && t.entre[0] === 4 && t.entre[1] === 6) || "La teinte de la boisson n'est pas entre ces deux étalons : comparez de nouveau."; } },
      { consigne: "Concentration en E131 de la boisson ?", court: "C (mg/L) ?", question: nombre("mg/L", 5, 1, "Elle est entre 4 et 6 mg/L.", "Exact : environ 5 mg/L.") },
      { consigne: "Concentration en E131 du sirop pur (la boisson est diluée 10 fois) ?", court: "Sirop (mg/L) ?", question: nombre("mg/L", 50, 10, "Multipliez par 10.", "Exact : environ 50 mg/L.") },
      { consigne: "Masse de E131 dans 1 L de boisson ?", court: "Masse (mg) ?", question: nombre("mg", 5, 1, "m = C × V.", "Exact : environ 5 mg.") },
      { consigne: "Un enfant de 30 kg boit 1 L de cette boisson dans la journée :", court: "Répondez dans le carnet.", question: choix(["il reste très en dessous de sa DJA (5 × 30 = 150 mg)", "il dépasse sa DJA", "la DJA ne concerne pas les enfants"], "DJA = 5 mg × masse en kg.", "Exact.") },
      { consigne: "Parmi ces listes, laquelle ne contient que des techniques de mesure ?", court: "Répondez dans le carnet.", question: choix(["pesée, mesure de volume, échelle de teintes, pH-mètre, conductimètre", "goût, odeur, toucher", "filtration, décantation, distillation"], "Relisez le document « Quelques techniques de mesure ».", "Exact.") },
    ],
  };

  L.demarrer({ id: "b1_chim1_a1_mesure", titre: "Laboratoire : importance de la mesure", paillasses: [L.poste_documents_mesure, L.poste_bandelettes, L.poste_echelle_teintes], missions: [POURQUOI, NITRATES, TEINTES] });
})(window.Labo);
